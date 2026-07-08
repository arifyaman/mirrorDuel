package room

import (
	"log"

	"mirror-duel-server-go/internal/config"
	"mirror-duel-server-go/internal/network"
)

// SessionIface is the interface that both room.Session and network sessions implement.
type SessionIface interface {
	ID() string
	PlayerID() int
	SendSnapshot(data []byte)
	SendRoomCreated(data []byte)
	SendSlashEvent(data []byte)
	SendDisconnect()
}

// RoomCallbacks provides hooks for session lifecycle events.
type RoomCallbacks struct {
	OnSessionCreated  func(session SessionIface)
	OnSessionDisconnect func(session SessionIface)
}

// RoomManager handles matchmaking, input routing, tick loop, and state broadcast.
type RoomManager struct {
	Config                 *config.Config
	Rooms                  []*GameSession
	NextRoomID             int
	TickAccumulator        float32
	TickCounter            int
	OrphanedCleanupCounter int
	Callbacks              RoomCallbacks
}

// NewRoomManager creates a new RoomManager.
func NewRoomManager(cfg *config.Config) *RoomManager {
	return &RoomManager{
		Config:      cfg,
		Rooms:       make([]*GameSession, 0),
		NextRoomID:  1,
		TickAccumulator: 0,
		TickCounter: 0,
	}
}

// HandleMessage routes incoming messages to the appropriate handler.
func (m *RoomManager) HandleMessage(session SessionIface, msg *network.SessionMessage) {
	switch msg.Type {
	case network.MSGJoinRoom:
		m.handleJoinRoom(session, msg.Payload)
	case network.MSGPlayerInput:
		m.handlePlayerInput(session, msg.Payload)
	}
}

func (m *RoomManager) handleJoinRoom(session SessionIface, payload []byte) {
	name := network.DecodeJoinRoom(payload)
	if name == "" {
		log.Printf("[Room] Invalid join room payload from %s", session.ID())
		return
	}

	result := m.join(session, name)
	if result == nil {
		return
	}

	roomCreated := network.EncodeRoomCreated(result.RoomID, uint8(result.PlayerID), result.OpponentName)
	session.SendRoomCreated(roomCreated)

	// Also send current snapshot to both players in the room
	for _, room := range m.Rooms {
		if room.RoomID == int(result.RoomID) {
			tick, players, projectiles := room.GetSnapshot()
			data := network.EncodeStateSnapshot(tick, players, projectiles)
			for _, p := range room.Players {
				if p.Session != nil {
					p.Session.SendSnapshot(data)
				}
			}
			break
		}
	}
}

type JoinResult struct {
	RoomID       uint16
	PlayerID     int
	OpponentName string
}

func (m *RoomManager) join(session SessionIface, playerName string) *JoinResult {
	// Priority 1: Find a room with exactly 1 player waiting for a duel
	var room *GameSession
	for _, r := range m.Rooms {
		if len(r.Players) == 1 {
			room = r
			break
		}
	}

	// Priority 2: Find any room with < 2 players
	if room == nil {
		for _, r := range m.Rooms {
			if len(r.Players) < 2 {
				room = r
				break
			}
		}
	}

	// Create new room if none available
	if room == nil {
		roomID := m.NextRoomID
		m.NextRoomID++
		room = NewGameSession(roomID, m.Config)
		m.Rooms = append(m.Rooms, room)
		log.Printf("[Room] Created room %d", roomID)
	}

	var playerID int
	for _, id := range []int{1, 2} {
		if _, taken := room.Players[id]; !taken {
			playerID = id
			break
		}
	}
	if playerID == 0 {
		log.Printf("[Room] %s tried to join full room %d", playerName, room.RoomID)
		return nil
	}
	_ = room.AddPlayer(playerID, playerName, session)
	session.(*network.Session).SetPlayerID(playerID)

	// Find opponent
	var opponentName string
	for _, id := range []int{1, 2} {
		if id != playerID {
			if other, ok := room.Players[id]; ok {
				opponentName = other.Name
			}
		}
	}

	log.Printf("[Room] Player %d (%s) joined room %d", playerID, playerName, room.RoomID)

	if m.Callbacks.OnSessionCreated != nil {
		m.Callbacks.OnSessionCreated(session)
	}

	return &JoinResult{
		RoomID:       uint16(room.RoomID),
		PlayerID:     playerID,
		OpponentName: opponentName,
	}
}

func (m *RoomManager) handlePlayerInput(session SessionIface, payload []byte) {
	input := network.DecodePlayerInput(payload)
	if input == nil {
		return
	}

	// Find the player for this session
	for _, room := range m.Rooms {
		for _, player := range room.Players {
			if player.Session == session {
				player.QueueInput(*input)
				return
			}
		}
	}
}

// Update is called every frame by the game loop.
func (m *RoomManager) Update(dt float32) {
	m.TickAccumulator += dt * 1000 // convert seconds to ms
	for m.TickAccumulator >= 16.67 {
		m.TickAccumulator -= 16.67
		m.tickStep()
	}
}

func (m *RoomManager) tickStep() {
	m.TickCounter++
	for _, room := range m.Rooms {
		room.TickStep()
	}
	// Cleanup empty rooms every 30 ticks (~0.5 seconds)
	if m.TickCounter%30 == 0 {
		m.CleanupEmptyRooms()
	}
	m.broadcast()
}

func (m *RoomManager) broadcast() {
	for _, room := range m.Rooms {
		if len(room.Players) == 0 {
			continue
		}
		tick, players, projectiles := room.GetSnapshot()
		data := network.EncodeStateSnapshot(tick, players, projectiles)
		slashEvents := room.GetSlashEvents()
		for _, player := range room.Players {
			if player.Session != nil {
				player.Session.SendSnapshot(data)
				for _, evt := range slashEvents {
					evtData := network.EncodeSlashEvent(evt.PlayerID, evt.X, evt.Z, evt.Angle)
					player.Session.SendSlashEvent(evtData)
				}
			}
		}
	}
}

// HandleDisconnect is called when a session closes.
func (m *RoomManager) HandleDisconnect(session SessionIface) {
	playerID := session.PlayerID()
	if playerID == 0 {
		return
	}

	for i := len(m.Rooms) - 1; i >= 0; i-- {
		room := m.Rooms[i]
		room.mu.Lock()
		if _, hasPlayer := room.Players[playerID]; !hasPlayer {
			room.mu.Unlock()
			continue
		}

		delete(room.Players, playerID)

		if len(room.Players) == 0 {
			log.Printf("[Room] Empty room %d removed", room.RoomID)
			m.Rooms = append(m.Rooms[:i], m.Rooms[i+1:]...)
			room.mu.Unlock()

			if m.Callbacks.OnSessionDisconnect != nil {
				m.Callbacks.OnSessionDisconnect(session)
			}

			log.Printf("[Room] Player %d disconnected", playerID)
			return
		}

		room.mu.Unlock()

		log.Printf("[Room] Player %d disconnected, room %d now has %d player(s) waiting", playerID, room.RoomID, len(room.Players))
		return
	}
}

// CleanupEmptyRooms removes rooms with no players connected.
// Called periodically during the tick step to prevent room accumulation.
func (m *RoomManager) CleanupEmptyRooms() {
	for i := len(m.Rooms) - 1; i >= 0; i-- {
		room := m.Rooms[i]
		room.mu.Lock()
		if len(room.Players) == 0 {
			room.mu.Unlock()
			log.Printf("[Room] Removed empty room %d", room.RoomID)
			m.Rooms = append(m.Rooms[:i], m.Rooms[i+1:]...)
		} else {
			room.mu.Unlock()
		}
	}
}

// Cleanup removes all rooms.
func (m *RoomManager) Cleanup() {
	m.Rooms = nil
}

// PlayerCount returns the total number of connected players.
func (m *RoomManager) PlayerCount() int {
	count := 0
	for _, room := range m.Rooms {
		count += len(room.Players)
	}
	return count
}

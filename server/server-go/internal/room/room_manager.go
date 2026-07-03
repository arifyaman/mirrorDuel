package room

import (
	"fmt"

	"mirror-duel-server-go/internal/config"
	"mirror-duel-server-go/internal/network"
)

// SessionIface is the interface that both room.Session and network sessions implement.
type SessionIface interface {
	ID() string
	PlayerID() int
	SendSnapshot(data []byte)
	SendRoomCreated(data []byte)
	SendDisconnect()
}

// RoomCallbacks provides hooks for session lifecycle events.
type RoomCallbacks struct {
	OnSessionCreated  func(session SessionIface)
	OnSessionDisconnect func(session SessionIface)
}

// RoomManager handles matchmaking, input routing, tick loop, and state broadcast.
type RoomManager struct {
	Config          *config.Config
	Rooms           []*GameSession
	NextRoomID      int
	TickAccumulator float32
	Callbacks       RoomCallbacks
}

// NewRoomManager creates a new RoomManager.
func NewRoomManager(cfg *config.Config) *RoomManager {
	return &RoomManager{
		Config:          cfg,
		Rooms:           make([]*GameSession, 0),
		NextRoomID:      1,
		TickAccumulator: 0,
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
		fmt.Printf("[Room] Invalid join room payload from %s\n", session.ID())
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
	// Find a room with < 2 players
	var room *GameSession
	for _, r := range m.Rooms {
		if len(r.Players) < 2 {
			room = r
			break
		}
	}

	// Create new room if none available
	if room == nil {
		roomID := m.NextRoomID
		m.NextRoomID++
		room = NewGameSession(roomID, m.Config)
		m.Rooms = append(m.Rooms, room)
		fmt.Printf("[Room] Created room %d\n", roomID)
	}

	playerID := len(room.Players) + 1
	_ = room.AddPlayer(playerID, playerName, session)
	session.(*network.Session).SetPlayerID(playerID)

	// Find opponent
	var opponentName string
	if other, ok := room.Players[playerID+1]; ok {
		opponentName = other.Name
	} else if other, ok := room.Players[playerID-1]; ok {
		opponentName = other.Name
	}

	fmt.Printf("[Room] Player %d (%s) joined room %d\n", playerID, playerName, room.RoomID)

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
	for _, room := range m.Rooms {
		room.TickStep()
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
		for _, player := range room.Players {
			if player.Session != nil {
				player.Session.SendSnapshot(data)
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

		// Notify opponent
		for _, p := range room.Players {
			if p.Session != nil {
				p.Session.SendDisconnect()
			}
		}

		// Remove empty rooms
		if len(room.Players) == 0 {
			fmt.Printf("[Room] Empty room %d removed\n", room.RoomID)
			m.Rooms = append(m.Rooms[:i], m.Rooms[i+1:]...)
		}

		room.mu.Unlock()

		if m.Callbacks.OnSessionDisconnect != nil {
			m.Callbacks.OnSessionDisconnect(session)
		}

		fmt.Printf("[Room] Player %d disconnected\n", playerID)
		return
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

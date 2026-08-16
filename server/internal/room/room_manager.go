package room

import (
	"log"
	"strings"
	"unicode"

	"mirror-duel-server-go/internal/config"
	"mirror-duel-server-go/internal/network"
)

// maxNicknameLength bounds player display names (matches the client's
// <input maxlength="12">).
const maxNicknameLength = 12

// SessionIface is the interface that both room.Session and network sessions implement.
type SessionIface interface {
	ID() string
	PlayerID() int
	SendSnapshot(data []byte)
	SendRoomCreated(data []byte)
	SendPong(data []byte)
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
	case network.MSGPing:
		m.handlePing(session, msg.Payload)
	case network.MSGSelectPerk:
		m.handleSelectPerk(session, msg.Payload)
	}
}

// handleSelectPerk applies the chosen perk to the player.
func (m *RoomManager) handleSelectPerk(session SessionIface, payload []byte) {
	if len(payload) < 1 {
		return
	}
	perkID := payload[0]
	for _, room := range m.Rooms {
		room.mu.Lock()
		for _, player := range room.Players {
			if player.Session == session {
				player.ApplyPerk(perkID)
				log.Printf("[PERK] Player %d equipped perk %d", player.ID, perkID)

				// Broadcast perk update to all players in the room
				room.pendingEvents = append(room.pendingEvents, GameEvent{
					Type:    network.EventPlayerPerks,
					Payload: network.EncodePlayerPerksPayload(uint8(player.ID), player.GetPerkMask()),
				})
				break
			}
		}
		room.mu.Unlock()
	}
}

// handlePing stores the sender's self-reported RTT (if provided) and replies
// with a PONG that echoes the original timestamp (for the client's own RTT
// measurement, unchanged) plus the sender's opponent's last known RTT
// (-1 if unknown), piggybacked on the same round trip — deliberately not a
// separate push message or embedded in STATE_SNAPSHOT, since ping only
// updates ~once/sec (the PING cadence) while snapshots go out at 60Hz.
func (m *RoomManager) handlePing(session SessionIface, payload []byte) {
	pingData := network.DecodePing(payload)
	if pingData == nil {
		// Malformed/too-short payload — nothing meaningful to embed, but
		// keep the lenient prior behavior of echoing it back unchanged.
		session.SendPong(payload)
		return
	}

	opponentPing := float32(-1)
	for _, room := range m.Rooms {
		var self, opponent *Player
		for _, player := range room.Players {
			if player.Session == session {
				self = player
			}
		}
		if self == nil {
			continue
		}
		if pingData.LastPing >= 0 {
			self.Ping = pingData.LastPing
		}
		for _, player := range room.Players {
			if player.ID != self.ID {
				opponent = player
			}
		}
		if opponent != nil {
			opponentPing = opponent.Ping
		}
		break
	}

	session.SendPong(network.EncodeOpponentPingPong(pingData.Timestamp, opponentPing))
}

// sanitizeNickname trims whitespace, strips control characters, and clamps
// to maxNicknameLength runes (rune-safe, not a raw byte slice) as
// defense-in-depth. The client already enforces this via <input
// maxlength="12">, but a modified/malicious client could otherwise send an
// arbitrary string up to 255 bytes (the wire format's length-prefix limit).
func sanitizeNickname(name string) string {
	name = strings.TrimSpace(name)

	var b strings.Builder
	for _, r := range name {
		if unicode.IsControl(r) {
			continue
		}
		b.WriteRune(r)
	}
	name = strings.TrimSpace(b.String())

	runes := []rune(name)
	if len(runes) > maxNicknameLength {
		runes = runes[:maxNicknameLength]
	}
	return string(runes)
}

func (m *RoomManager) handleJoinRoom(session SessionIface, payload []byte) {
	name := sanitizeNickname(network.DecodeJoinRoom(payload))
	if name == "" {
		log.Printf("[Room] Invalid join room payload from %s", session.ID())
		return
	}

	result := m.join(session, name)
	if result == nil {
		return
	}

	roomCreated := network.EncodeRoomCreated(
		result.RoomID,
		uint8(result.PlayerID),
		result.OpponentName,
		uint8(m.Config.ObstacleGridWidth),
		uint8(m.Config.ObstacleGridHeight),
		m.Config.ObstacleBitmask,
	)
	session.SendRoomCreated(roomCreated)

	// Notify any already-connected player(s) in the room of the new
	// opponent's name. ROOM_CREATED is otherwise only ever sent to the
	// session that is currently joining — without this, whichever player
	// joined first would never learn a later joiner's name (their own
	// ROOM_CREATED was already sent before the opponent existed).
	for _, room := range m.Rooms {
		if room.RoomID == int(result.RoomID) {
			for _, p := range room.Players {
				if p.ID == result.PlayerID || p.Session == nil {
					continue
				}
				otherRoomCreated := network.EncodeRoomCreated(
					uint16(room.RoomID),
					uint8(p.ID),
					name,
					uint8(m.Config.ObstacleGridWidth),
					uint8(m.Config.ObstacleGridHeight),
					m.Config.ObstacleBitmask,
				)
				p.Session.SendRoomCreated(otherRoomCreated)
			}
			break
		}
	}

	// Also send current snapshot to both players in the room
	for _, room := range m.Rooms {
		if room.RoomID == int(result.RoomID) {
			tick, players, projectiles := room.GetSnapshot()
			data := network.EncodeStateSnapshot(tick, players, projectiles, nil)
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
	// First clean up any empty rooms
	m.CleanupEmptyRooms()

	// Priority 1: Find a room with exactly 1 player waiting for a duel
	var room *GameSession
	for _, r := range m.Rooms {
		r.mu.Lock()
		count := len(r.Players)
		r.mu.Unlock()
		if count == 1 {
			room = r
			break
		}
	}

	// Priority 2: Find any room with < 2 players
	if room == nil {
		for _, r := range m.Rooms {
			r.mu.Lock()
			count := len(r.Players)
			r.mu.Unlock()
			if count < 2 {
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
		roomEvents := room.GetPendingEvents()
		events := make([]network.GameEvent, len(roomEvents))
		for i, e := range roomEvents {
			events[i] = network.GameEvent{Type: e.Type, Payload: e.Payload}
		}
		data := network.EncodeStateSnapshot(tick, players, projectiles, events)
		for _, player := range room.Players {
			if player.Session != nil {
				player.Session.SendSnapshot(data)
			}
		}
	}
}

// HandleDisconnect is called when a session closes.
func (m *RoomManager) HandleDisconnect(session SessionIface) {
	for i := len(m.Rooms) - 1; i >= 0; i-- {
		room := m.Rooms[i]
		room.mu.Lock()
		var foundID int
		for id, p := range room.Players {
			if p.Session == session {
				foundID = id
				break
			}
		}

		if foundID == 0 {
			room.mu.Unlock()
			continue
		}

		delete(room.Players, foundID)

		if len(room.Players) == 0 {
			log.Printf("[Room] Empty room %d removed", room.RoomID)
			m.Rooms = append(m.Rooms[:i], m.Rooms[i+1:]...)
			room.mu.Unlock()

			if m.Callbacks.OnSessionDisconnect != nil {
				m.Callbacks.OnSessionDisconnect(session)
			}

			log.Printf("[Room] Player %d disconnected", foundID)
			return
		}

		room.mu.Unlock()

		log.Printf("[Room] Player %d disconnected, room %d now has %d player(s) waiting", foundID, room.RoomID, len(room.Players))
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

package network

import (
	"encoding/binary"
	"math"
)

// Message type constants — must match the TypeScript client and server.
const (
	MSGJoinRoom      = 1
	MSGPlayerInput   = 2
	MSGPing          = 3
	MSGStateSnapshot = 16
	MSGRoomCreated   = 17
	MSGPong          = 18
	MSGDisconnect    = 255

	InputSize = 13

	// Game event sub-types embedded in STATE_SNAPSHOT.
	EventSlash        = 1
	EventPerfectBlock = 2
	EventShieldBlock  = 3
)

// PlayerInput matches the binary layout from client protocol.
type PlayerInput struct {
	Tick   uint16
	MoveX  int8
	MoveZ  int8
	MouseX float32
	MouseY float32
	Flags  uint8
}

// SessionMessage is a parsed message from a session.
type SessionMessage struct {
	Type    uint8
	Payload []byte
}

// ---- ENCODING ----

// EncodeJoinRoom produces: [nameLen: u8][name: bytes]
func EncodeJoinRoom(name string) []byte {
	buf := make([]byte, 1+len(name))
	buf[0] = uint8(len(name))
	copy(buf[1:], name)
	return buf
}

// EncodePlayerInput produces a 13-byte payload:
// [tick: u16][moveX: i8][moveZ: i8][mouseX: f32][mouseY: f32][flags: u8]
// All multi-byte fields are little-endian.
func EncodePlayerInput(tick uint16, moveX int8, moveZ int8, mouseX, mouseY float32, flags uint8) []byte {
	buf := make([]byte, InputSize)
	binary.LittleEndian.PutUint16(buf[0:2], tick)
	buf[2] = byte(moveX)
	buf[3] = byte(moveZ)
	binary.LittleEndian.PutUint32(buf[4:8], math.Float32bits(mouseX))
	binary.LittleEndian.PutUint32(buf[8:12], math.Float32bits(mouseY))
	buf[12] = flags
	return buf
}

const (
	// Snapshot record sizes must match the TypeScript encoder.
	SnapshotPlayerSize     = 37 // u8 + 9*f32
	SnapshotProjectileSize = 32 // u8 + u16 + 7*f32 + u8 (ownerId)
)

// PlayerSnapshot is the data needed for encoding a player in STATE_SNAPSHOT.
type PlayerSnapshot struct {
	ID             uint8
	X              float32
	Y              float32
	Z              float32
	Angle          float32
	Cooldown       float32
	Health         float32
	DashCooldown   float32
	ShieldCooldown float32
	SlashCooldown  float32
}

// ProjectileSnapshot is the data needed for encoding a projectile in STATE_SNAPSHOT.
type ProjectileSnapshot struct {
	ID        uint8
	SpawnTick uint16
	StartX    float32
	Y         float32
	StartZ    float32
	DirX      float32
	DirZ      float32
	Speed     float32
	MaxReach  float32
	OwnerID   uint8
}

// GameEvent is a generic event embedded in STATE_SNAPSHOT.
type GameEvent struct {
	Type    uint8
	Payload []byte
}

// EncodeStateSnapshot produces a variable-length snapshot payload:
// [tick: u16][playerCount: u8][players...][projCount: u8][projectiles...][eventCount: u8][events...]
func EncodeStateSnapshot(tick uint16, players []PlayerSnapshot, projectiles []ProjectileSnapshot, events []GameEvent) []byte {
	pc := len(players)
	pj := len(projectiles)
	ec := len(events)
	size := 2 + 1 + pc*SnapshotPlayerSize + 1 + pj*SnapshotProjectileSize + 1
	for _, e := range events {
		size += 1 + len(e.Payload) // type byte + payload
	}
	buf := make([]byte, size)
	b := 0
	binary.LittleEndian.PutUint16(buf[b:b+2], tick)
	b += 2
	buf[b] = uint8(pc)
	b += 1

	for _, p := range players {
		buf[b] = p.ID
		b += 1
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.X))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.Y))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.Z))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.Angle))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.Cooldown))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.Health))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.DashCooldown))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.ShieldCooldown))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.SlashCooldown))
		b += 4
	}

	buf[b] = uint8(pj)
	b += 1

	for _, p := range projectiles {
		buf[b] = p.ID
		b += 1
		binary.LittleEndian.PutUint16(buf[b:b+2], p.SpawnTick)
		b += 2
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.StartX))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.Y))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.StartZ))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.DirX))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.DirZ))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.Speed))
		b += 4
		binary.LittleEndian.PutUint32(buf[b:b+4], math.Float32bits(p.MaxReach))
		b += 4
		buf[b] = p.OwnerID
		b += 1
	}

	buf[b] = uint8(ec)
	b += 1
	for _, e := range events {
		buf[b] = e.Type
		b += 1
		copy(buf[b:], e.Payload)
		b += len(e.Payload)
	}

	return buf
}

// EncodeRoomCreated produces:
// [roomId: u16][myPlayerId: u8][nameLen: u8][name: bytes][gridWidth: u8][gridHeight: u8][bitmask: bytes]
// The obstacle grid fields are appended after the name so older parsers
// that only read the first 4+nameLen bytes remain unaffected.
func EncodeRoomCreated(roomID uint16, myPlayerID uint8, opponentName string, gridWidth, gridHeight uint8, bitmask []byte) []byte {
	size := 4 + len(opponentName) + 2 + len(bitmask)
	buf := make([]byte, size)
	binary.LittleEndian.PutUint16(buf[0:2], roomID)
	buf[2] = myPlayerID
	buf[3] = uint8(len(opponentName))
	b := 4
	copy(buf[b:], opponentName)
	b += len(opponentName)
	buf[b] = gridWidth
	b++
	buf[b] = gridHeight
	b++
	copy(buf[b:], bitmask)
	return buf
}

// EncodeSlashPayload produces the payload for a slash event: [playerId: u8][x: f32][z: f32][angle: f32] (13 bytes)
func EncodeSlashPayload(playerId uint8, x, z, angle float32) []byte {
	buf := make([]byte, 13)
	buf[0] = playerId
	binary.LittleEndian.PutUint32(buf[1:5], math.Float32bits(x))
	binary.LittleEndian.PutUint32(buf[5:9], math.Float32bits(z))
	binary.LittleEndian.PutUint32(buf[9:13], math.Float32bits(angle))
	return buf
}

// EncodePerfectBlockPayload produces the payload for a perfect block event: [playerId: u8][x: f32][z: f32][angle: f32] (13 bytes)
func EncodePerfectBlockPayload(playerId uint8, x, z, angle float32) []byte {
	buf := make([]byte, 13)
	buf[0] = playerId
	binary.LittleEndian.PutUint32(buf[1:5], math.Float32bits(x))
	binary.LittleEndian.PutUint32(buf[5:9], math.Float32bits(z))
	binary.LittleEndian.PutUint32(buf[9:13], math.Float32bits(angle))
	return buf
}

// EncodeShieldBlockPayload produces the payload for a shield block event: [playerId: u8][x: f32][z: f32][angle: f32] (13 bytes)
func EncodeShieldBlockPayload(playerId uint8, x, z, angle float32) []byte {
	buf := make([]byte, 13)
	buf[0] = playerId
	binary.LittleEndian.PutUint32(buf[1:5], math.Float32bits(x))
	binary.LittleEndian.PutUint32(buf[5:9], math.Float32bits(z))
	binary.LittleEndian.PutUint32(buf[9:13], math.Float32bits(angle))
	return buf
}

// EncodeOpponentPingPong produces an extended PONG payload:
// [timestamp: f64][opponentPingMs: f32] (12 bytes). timestamp is the
// original client-sent PING timestamp (echoed back unchanged, as before,
// for the client's own RTT measurement); opponentPingMs is the recipient's
// opponent's last self-reported RTT (-1 if unknown), piggybacked on the
// existing PING/PONG round trip instead of a separate push message.
func EncodeOpponentPingPong(timestamp float64, opponentPingMs float32) []byte {
	buf := make([]byte, 12)
	binary.LittleEndian.PutUint64(buf[0:8], math.Float64bits(timestamp))
	binary.LittleEndian.PutUint32(buf[8:12], math.Float32bits(opponentPingMs))
	return buf
}

// ---- DECODING ----

// PingData is the decoded payload of a client PING message.
type PingData struct {
	Timestamp float64
	// LastPing is the client's own last-measured RTT in ms (self-reported,
	// via its own PING/PONG round trip), or -1 if unknown/not yet measured.
	// Only present on newer clients — payloads shorter than 12 bytes yield
	// LastPing = -1.
	LastPing float32
}

// DecodePing parses a PING payload: [timestamp: f64][lastPing: f32 (optional)]
func DecodePing(data []byte) *PingData {
	if len(data) < 8 {
		return nil
	}
	result := &PingData{
		Timestamp: math.Float64frombits(binary.LittleEndian.Uint64(data[0:8])),
		LastPing:  -1,
	}
	if len(data) >= 12 {
		result.LastPing = math.Float32frombits(binary.LittleEndian.Uint32(data[8:12]))
	}
	return result
}

// DecodePlayerInput parses a 13-byte input payload. Returns nil if too short.
func DecodePlayerInput(data []byte) *PlayerInput {
	if len(data) < InputSize {
		return nil
	}
	return &PlayerInput{
		Tick:   binary.LittleEndian.Uint16(data[0:2]),
		MoveX:  int8(data[2]),
		MoveZ:  int8(data[3]),
		MouseX: math.Float32frombits(binary.LittleEndian.Uint32(data[4:8])),
		MouseY: math.Float32frombits(binary.LittleEndian.Uint32(data[8:12])),
		Flags:  data[12],
	}
}

// DecodeJoinRoom parses a join room payload: [nameLen: u8][name: bytes]
func DecodeJoinRoom(data []byte) string {
	if len(data) < 1 {
		return ""
	}
	nameLen := int(data[0])
	if len(data) < 1+nameLen {
		return ""
	}
	return string(data[1 : 1+nameLen])
}

// ParseMessage strips the 1-byte message type prefix and returns {type, payload}.
// Returns nil if data is too short.
func ParseMessage(data []byte) *SessionMessage {
	if len(data) < 2 {
		return nil
	}
	return &SessionMessage{
		Type:    data[0],
		Payload: data[1:],
	}
}

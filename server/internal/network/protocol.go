package network

import (
	"encoding/binary"
	"math"
)

// Message type constants — must match the TypeScript client and server.
const (
	MSGJoinRoom       = 1
	MSGPlayerInput    = 2
	MSGStateSnapshot  = 16
	MSGRoomCreated    = 17
	MSGDisconnect     = 255
	MSGSlashEvent     = 18

	InputSize = 13
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
	SnapshotProjectileSize = 31 // u8 + u16 + 7*f32
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
}

// EncodeStateSnapshot produces a variable-length snapshot payload:
// [tick: u16][playerCount: u8][players...][projCount: u8][projectiles...]
func EncodeStateSnapshot(tick uint16, players []PlayerSnapshot, projectiles []ProjectileSnapshot) []byte {
	pc := len(players)
	pj := len(projectiles)
	size := 2 + 1 + pc*SnapshotPlayerSize + 1 + pj*SnapshotProjectileSize
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
	}

	return buf
}

// EncodeRoomCreated produces: [roomId: u16][myPlayerId: u8][nameLen: u8][name: bytes]
func EncodeRoomCreated(roomID uint16, myPlayerID uint8, opponentName string) []byte {
	size := 4 + len(opponentName)
	buf := make([]byte, size)
	binary.LittleEndian.PutUint16(buf[0:2], roomID)
	buf[2] = myPlayerID
	buf[3] = uint8(len(opponentName))
	copy(buf[4:], opponentName)
	return buf
}

// EncodeSlashEvent produces: [playerId: u8][x: f32][z: f32][angle: f32] (13 bytes)
func EncodeSlashEvent(playerId uint8, x, z, angle float32) []byte {
	buf := make([]byte, 13)
	buf[0] = playerId
	binary.LittleEndian.PutUint32(buf[1:5], math.Float32bits(x))
	binary.LittleEndian.PutUint32(buf[5:9], math.Float32bits(z))
	binary.LittleEndian.PutUint32(buf[9:13], math.Float32bits(angle))
	return buf
}

// ---- DECODING ----

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

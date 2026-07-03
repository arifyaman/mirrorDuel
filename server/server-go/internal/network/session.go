package network

import (
	"fmt"

	"github.com/quic-go/webtransport-go"
)

// Session wraps a WebTransport session and provides the room.Session interface.
type Session struct {
	id        string
	conn      *webtransport.Session
	stream    *webtransport.Stream
	connected bool
	playerID  int

	onMessage func(msg *SessionMessage)
}

// NewSession creates a new Session.
func NewSession(id string, conn *webtransport.Session, stream *webtransport.Stream) *Session {
	s := &Session{
		id:        id,
		conn:      conn,
		stream:    stream,
		connected: true,
	}
	go s.readLoop()
	return s
}

// ID returns the session identifier.
func (s *Session) ID() string {
	return s.id
}

// PlayerID returns the player ID (0 if not assigned).
func (s *Session) PlayerID() int {
	return s.playerID
}

// SetPlayerID sets the player ID for this session.
func (s *Session) SetPlayerID(id int) {
	s.playerID = id
}

// SetMessageHandler sets the callback for incoming messages.
func (s *Session) SetMessageHandler(fn func(msg *SessionMessage)) {
	s.onMessage = fn
}

// SendMsg prepends a message type byte and writes to the QUIC stream.
func (s *Session) SendMsg(msgType uint8, data []byte) {
	if !s.connected {
		return
	}

	full := make([]byte, 1+len(data))
	full[0] = msgType
	copy(full[1:], data)

	_, err := s.stream.Write(full)
	if err != nil {
		fmt.Printf("[Session] Write error for %s: %v\n", s.id, err)
		s.connected = false
	}
}

// SendSnapshot sends a STATE_SNAPSHOT message with pre-encoded binary data.
func (s *Session) SendSnapshot(data []byte) {
	s.SendMsg(MSGStateSnapshot, data)
}

// SendRoomCreated sends a ROOM_CREATED message with pre-encoded binary data.
func (s *Session) SendRoomCreated(data []byte) {
	s.SendMsg(MSGRoomCreated, data)
}

// SendDisconnect sends a DISCONNECT message.
func (s *Session) SendDisconnect() {
	s.SendMsg(MSGDisconnect, nil)
	s.connected = false
}

// readLoop reads from the QUIC stream and dispatches messages via the callback.
func (s *Session) readLoop() {
	buf := make([]byte, 256)

	for s.connected {
		n, err := s.stream.Read(buf)
		if err != nil {
			fmt.Printf("[Session] %s stream read error: %v (n=%d)\n", s.id, err, n)
			s.connected = false
			return
		}

		if n == 0 {
			continue
		}

		fmt.Printf("[Session] %s received %d bytes: %v\n", s.id, n, buf[:n])
		msg := ParseMessage(buf[:n])
		if msg == nil {
			fmt.Printf("[Session] %s failed to parse message\n", s.id)
			continue
		}

		if s.onMessage != nil {
			s.onMessage(msg)
		}
	}
}

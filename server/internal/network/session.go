package network

import (
	"log"

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

// encodeFrame wraps data into a length-prefixed frame:
// [length: u32 LE][msgType: u8][payload: bytes]
// The length field covers msgType + payload.
func encodeFrame(msgType uint8, data []byte) []byte {
	payloadLen := 1 + len(data) // msgType + payload
	buf := make([]byte, 4+payloadLen)
	buf[0] = byte(payloadLen >> 24)
	buf[1] = byte(payloadLen >> 16)
	buf[2] = byte(payloadLen >> 8)
	buf[3] = byte(payloadLen)
	buf[4] = msgType
	if len(data) > 0 {
		copy(buf[5:], data)
	}
	return buf
}

// SendMsg prepends a message type byte and writes to the QUIC stream.
func (s *Session) SendMsg(msgType uint8, data []byte) {
	if !s.connected {
		return
	}

	full := encodeFrame(msgType, data)

	_, err := s.stream.Write(full)
	if err != nil {
		log.Printf("[Session] Write error for %s: %v", s.id, err)
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

// SendPong echoes back a PING payload unchanged, for client-side RTT measurement.
func (s *Session) SendPong(data []byte) {
	s.SendMsg(MSGPong, data)
}

// SendDisconnect sends a DISCONNECT message.
func (s *Session) SendDisconnect() {
	s.SendMsg(MSGDisconnect, nil)
	s.connected = false
}

// readLoop reads from the QUIC stream and dispatches messages via the callback.
// It handles partial reads and coalesced reads using length-prefixed framing.
func (s *Session) readLoop() {
	for s.connected {
		// Read into a temporary buffer
		tmp := make([]byte, 4096)
		n, err := s.stream.Read(tmp)
		if err != nil {
			log.Printf("[Session] %s stream read error: %v (n=%d)", s.id, err, n)
			s.connected = false
			return
		}

		if n == 0 {
			continue
		}

		// Process data in buf
		buf := tmp[:n]

		for len(buf) > 0 {
			// Need at least 4 bytes for length header
			if len(buf) < 4 {
				// Should not happen with normal reads, but handle it
				break
			}

			msgLen := int(buf[0])<<24 | int(buf[1])<<16 | int(buf[2])<<8 | int(buf[3])

			// Need the full message (length + 1 type byte + payload)
			total := 4 + msgLen
			if len(buf) < total {
				break
			}

			msgBuf := buf[:total]
			buf = buf[total:]

			msgType := msgBuf[4]
			payload := msgBuf[5:]

			switch msgType {
			case MSGPlayerInput:
				if s.onMessage != nil {
					s.onMessage(&SessionMessage{
						Type:    MSGPlayerInput,
						Payload: payload,
					})
				}
			case MSGJoinRoom:
				if s.onMessage != nil {
					s.onMessage(&SessionMessage{
						Type:    MSGJoinRoom,
						Payload: payload,
					})
				}
			default:
				if s.onMessage != nil {
					s.onMessage(&SessionMessage{
						Type:    msgType,
						Payload: payload,
					})
				}
			}
		}
	}
}

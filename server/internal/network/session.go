package network

import (
	"log"
	"sync"
	"sync/atomic"
	"time"

	"github.com/quic-go/webtransport-go"
)

const (
	// sendQueueSize bounds how many outbound messages can be buffered per
	// session before newer ones are dropped. At 60Hz, ~64 covers roughly a
	// second of snapshots — plenty for jitter/high latency, small enough
	// that a truly stalled connection can't grow memory unboundedly.
	sendQueueSize = 64

	// writeTimeout bounds how long a single stream write may block. Without
	// this, a stalled/lossy connection's Write() call can block forever
	// (QUIC flow-control has no built-in timeout), which — since sends are
	// dispatched from a per-session goroutine — would otherwise leak that
	// goroutine forever instead of detecting the dead connection.
	writeTimeout = 3 * time.Second

	// readTimeout bounds how long the read loop waits for any data (input,
	// pings, etc.) before considering the connection dead. This reaps
	// sessions whose connection stalled without a clean QUIC close.
	readTimeout = 30 * time.Second
)

// Session wraps a WebTransport session and provides the room.Session interface.
type Session struct {
	id       string
	conn     *webtransport.Session
	stream   *webtransport.Stream
	playerID int

	connected atomic.Bool

	onMessage func(msg *SessionMessage)

	sendQueue chan []byte
	done      chan struct{}
	closeOnce sync.Once
}

// NewSession creates a new Session.
func NewSession(id string, conn *webtransport.Session, stream *webtransport.Stream) *Session {
	s := &Session{
		id:        id,
		conn:      conn,
		stream:    stream,
		sendQueue: make(chan []byte, sendQueueSize),
		done:      make(chan struct{}),
	}
	s.connected.Store(true)
	go s.readLoop()
	go s.writeLoop()
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

// Close stops this session's write loop, marks it disconnected, and
// terminates the underlying WebTransport session. Safe to call multiple
// times (e.g. on read/write error and again during external cleanup) —
// the actual teardown only runs once.
//
// Actively closing the session (not just the local stream) matters: a
// stream-level read/write timeout (see readTimeout/writeTimeout) only
// fails that local call, it does NOT close the underlying connection on
// its own. Without this, main.go's `<-conn.Context().Done()` would never
// fire for a stalled-but-not-cleanly-closed client, so the disconnect
// cleanup (removing the player from their room, room teardown, etc.)
// would never run and this goroutine/session would leak indefinitely.
func (s *Session) Close() {
	s.connected.Store(false)
	s.closeOnce.Do(func() {
		close(s.done)
		if s.conn != nil {
			_ = s.conn.CloseWithError(0, "session closed")
		}
	})
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

// SendMsg prepends a message type byte and enqueues it for the session's
// write loop. This never blocks the caller (e.g. the shared 60Hz tick-loop
// goroutine broadcasting to every room) — if the per-session send queue is
// full (connection stalled/falling behind), the message is dropped instead
// of piling up or blocking.
func (s *Session) SendMsg(msgType uint8, data []byte) {
	if !s.connected.Load() {
		return
	}

	full := encodeFrame(msgType, data)

	select {
	case s.sendQueue <- full:
	default:
		log.Printf("[Session] %s send queue full, dropping message type %d", s.id, msgType)
	}
}

// writeLoop drains the send queue and performs the actual (potentially
// slow/blocking) stream writes on its own per-session goroutine, isolated
// from the shared tick loop and from every other session.
func (s *Session) writeLoop() {
	for {
		select {
		case full := <-s.sendQueue:
			s.stream.SetWriteDeadline(time.Now().Add(writeTimeout))
			if _, err := s.stream.Write(full); err != nil {
				log.Printf("[Session] Write error for %s: %v", s.id, err)
				s.Close()
			}
		case <-s.done:
			return
		}
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

// SendPong sends a PONG message with the given pre-encoded payload
// (typically the echoed PING timestamp plus the opponent's ping, see
// room.RoomManager.handlePing), for client-side RTT measurement.
func (s *Session) SendPong(data []byte) {
	s.SendMsg(MSGPong, data)
}

// SendDisconnect sends a DISCONNECT message.
func (s *Session) SendDisconnect() {
	s.SendMsg(MSGDisconnect, nil)
	s.connected.Store(false)
}

// readLoop reads from the QUIC stream and dispatches messages via the callback.
// It handles partial reads and coalesced reads using length-prefixed framing.
func (s *Session) readLoop() {
	defer s.Close()

	var buf []byte
	tmp := make([]byte, 4096)

	for s.connected.Load() {
		s.stream.SetReadDeadline(time.Now().Add(readTimeout))

		n, err := s.stream.Read(tmp)
		if err != nil {
			log.Printf("[Session] %s stream read error: %v (n=%d)", s.id, err, n)
			return
		}

		if n == 0 {
			continue
		}

		buf = append(buf, tmp[:n]...)

		for len(buf) > 0 {
			// Need at least 4 bytes for length header
			if len(buf) < 4 {
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

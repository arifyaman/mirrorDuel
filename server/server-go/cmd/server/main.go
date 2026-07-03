package main

import (
	"context"
	"crypto/tls"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"sync"
	"sync/atomic"
	"syscall"
	"time"

	"github.com/quic-go/quic-go"
	"mirror-duel-server-go/internal/config"
	"mirror-duel-server-go/internal/room"
	"mirror-duel-server-go/internal/network"
)

// sessionRegistry tracks all active QUIC sessions.
type sessionRegistry struct {
	mu       sync.RWMutex
	sessions map[string]*network.Session
}

func newSessionRegistry() *sessionRegistry {
	return &sessionRegistry{sessions: make(map[string]*network.Session)}
}

func (r *sessionRegistry) Add(id string, s *network.Session) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.sessions[id] = s
}

func (r *sessionRegistry) Remove(id string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.sessions, id)
}

func (r *sessionRegistry) Count() int {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return len(r.sessions)
}

// quicSession is a wrapper around a raw QUIC connection.
type quicSession struct {
	id        string
	conn      *quic.Conn
	stream    *quic.Stream
	connected bool
	rm        *room.RoomManager
	reg       *sessionRegistry
}

func newQUICSession(id string, conn *quic.Conn, stream *quic.Stream, rm *room.RoomManager, reg *sessionRegistry) *quicSession {
	s := &quicSession{
		id:        id,
		conn:      conn,
		stream:    stream,
		connected: true,
		rm:        rm,
		reg:       reg,
	}
	go s.readLoop()
	return s
}

func (s *quicSession) ID() string {
	return s.id
}

func (s *quicSession) PlayerID() int {
	// We need to track this separately
	return 0
}

func (s *quicSession) IsConnected() bool {
	return s.connected
}

func (s *quicSession) SendRoomCreated(data []byte) {
	if !s.connected {
		return
	}
	s.sendMsg(network.MSGRoomCreated, data)
}

func (s *quicSession) SendSnapshot(data []byte) {
	if !s.connected {
		return
	}
	s.sendMsg(network.MSGStateSnapshot, data)
}

func (s *quicSession) SendDisconnect() {
	s.sendMsg(network.MSGDisconnect, nil)
	s.connected = false
}

func (s *quicSession) sendMsg(msgType uint8, data []byte) {
	if !s.connected {
		return
	}
	full := make([]byte, 1+len(data))
	full[0] = msgType
	copy(full[1:], data)
	_, err := s.stream.Write(full)
	if err != nil {
		fmt.Printf("[QUIC] Write error for %s: %v\n", s.id, err)
		s.connected = false
	}
}

func (s *quicSession) readLoop() {
	buf := make([]byte, 256)
	for s.connected {
		n, err := s.stream.Read(buf)
		if err != nil {
			fmt.Printf("[QUIC] %s stream read error: %v\n", s.id, err)
			s.connected = false
			return
		}
		if n == 0 {
			continue
		}
		// Parse message
		msg := network.ParseMessage(buf[:n])
		if msg == nil {
			continue
		}
		fmt.Printf("[QUIC] %s received msg type=%d payloadLen=%d\n", s.id, msg.Type, len(msg.Payload))
		// Dispatch to room manager
		s.rm.HandleMessage(s, msg)
	}
}

func (s *quicSession) close() {
	s.rm.HandleDisconnect(s)
	s.reg.Remove(s.id)
}

var sessionCounter int64

func main() {
	cfg := config.Default()

	// Load TLS cert for QUIC (required)
	certFile := "tls/cert.pem"
	keyFile := "tls/key.pem"

	cert, err := tls.LoadX509KeyPair(certFile, keyFile)
	if err != nil {
		fmt.Printf("[TLS] Failed to load cert: %v. Generating self-signed...\n", err)
		cmd := exec.Command("go", "run", "tls/gen_cert.go")
		cmd.Dir = "."
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			panic(fmt.Sprintf("[TLS] Failed to generate cert: %v", err))
		}
		cert, err = tls.LoadX509KeyPair(certFile, keyFile)
		if err != nil {
			panic(err)
		}
	}

	// --- Create Room Manager ---
	rm := room.NewRoomManager(cfg)
	sessionReg := newSessionRegistry()

	rm.Callbacks = room.RoomCallbacks{
		OnSessionCreated: func(s room.SessionIface) {
			fmt.Printf("[Game] Session %s created\n", s.ID())
		},
		OnSessionDisconnect: func(s room.SessionIface) {
			fmt.Printf("[Game] Session %s disconnected\n", s.ID())
		},
	}

	// --- QUIC listener ---
	quicAddr := fmt.Sprintf(":%d", cfg.QUICPort)

	udpConn, err := net.ListenUDP("udp4", &net.UDPAddr{Port: cfg.QUICPort})
	if err != nil {
		panic(err)
	}

	tlsConf := &tls.Config{
		Certificates: []tls.Certificate{cert},
		NextProtos:   []string{"mirror-duel/1"},
	}

	quicLn, err := quic.Listen(udpConn, tlsConf, nil)
	if err != nil {
		panic(err)
	}
	fmt.Printf("[Server] QUIC listening on %s\n", quicAddr)

	// Accept QUIC connections
	quicCtx, quicCancel := context.WithCancel(context.Background())
	defer quicCancel()
	go func() {
		for {
			conn, err := quicLn.Accept(quicCtx)
			if err != nil {
				// Expected during shutdown
				return
			}
			// Wait for handshake
			<-conn.HandshakeComplete()

			// Accept the first bidirectional stream from the client
			stream, err := conn.AcceptStream(quicCtx)
			if err != nil {
				continue
			}

			id := fmt.Sprintf("s%d", atomic.AddInt64(&sessionCounter, 1))
			quicSess := newQUICSession(id, conn, stream, rm, sessionReg)

			// Wait for session to close
			for quicSess.connected {
				time.Sleep(100 * time.Millisecond)
			}

			quicSess.close()
		}
	}()

	// --- 60Hz game loop ---
	ticker := time.NewTicker(16 * time.Millisecond)
	go func() {
		for range ticker.C {
			rm.Update(0.016)
		}
	}()

	// --- HTTP health check ---
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status":"ok","version":"0.2.0","players":%d}`, rm.PlayerCount())
	})
	httpPort := cfg.HTTPPort
	addr := fmt.Sprintf(":%d", httpPort)
	fmt.Printf("[Server] HTTP health check on %s\n", addr)
	go func() {
		if err := http.ListenAndServe(addr, nil); err != nil {
			fmt.Printf("[HTTP] Error: %v\n", err)
		}
	}()

	// --- Graceful shutdown ---
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig
	fmt.Println("\n[Server] Shutting down...")

	quicLn.Close()
	rm.Cleanup()
	ticker.Stop()
	println("[Server] Shutdown complete")
}

package main

import (
	"crypto/sha256"
	"crypto/tls"
	"encoding/hex"
	"encoding/pem"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"sync"
	"sync/atomic"
	"syscall"
	"time"

	"github.com/quic-go/quic-go/http3"
	"github.com/quic-go/webtransport-go"
	"mirror-duel-server-go/internal/config"
	"mirror-duel-server-go/internal/network"
	"mirror-duel-server-go/internal/room"
)

// sessionRegistry tracks active sessions for cleanup.
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

func getCertSHA256(certFile string) string {
	data, err := os.ReadFile(certFile)
	if err != nil {
		return ""
	}
	block, _ := pem.Decode(data)
	if block == nil {
		return ""
	}
	hash := sha256.Sum256(block.Bytes)
	return hex.EncodeToString(hash[:])
}

var sessionCounter int64

// wtHandler serves HTTP requests and WebTransport upgrades.
type wtHandler struct {
	rm       *room.RoomManager
	reg      *sessionRegistry
	wtServer *webtransport.Server
	certHash string
}

func (h *wtHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/health" {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status":"ok","version":"0.3.0","players":%d}`, h.rm.PlayerCount())
		return
	}
	if r.URL.Path == "/cert-hash" {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"hash":"%s"}`, h.certHash)
		return
	}

	// WebTransport upgrade
	if r.URL.Path == "/wt" {
		conn, err := h.wtServer.Upgrade(w, r)
		if err != nil {
			fmt.Printf("[WT] Upgrade error: %v\n", err)
			return
		}
		stream, err := conn.AcceptStream(r.Context())
		if err != nil {
			fmt.Printf("[WT] Stream accept error: %v\n", err)
			return
		}

		id := fmt.Sprintf("s%d", atomic.AddInt64(&sessionCounter, 1))
		sess := network.NewSession(id, conn, stream)
		sess.SetMessageHandler(func(msg *network.SessionMessage) {
			h.rm.HandleMessage(sess, msg)
		})
		h.reg.Add(id, sess)

		fmt.Printf("[WT] %s connected (total: %d)\n", id, h.reg.Count())

		// Wait for session to close
		<-conn.Context().Done()
		sess.SendDisconnect()
		h.reg.Remove(id)
		h.rm.HandleDisconnect(sess)

		if h.rm.Callbacks.OnSessionDisconnect != nil {
			h.rm.Callbacks.OnSessionDisconnect(sess)
		}
		fmt.Printf("[WT] %s disconnected\n", id)
		return
	}

	http.NotFound(w, r)
}

func main() {
	cfg := config.Default()

	certFile := "tls/cert.pem"
	keyFile := "tls/key.pem"

	_, err := tls.LoadX509KeyPair(certFile, keyFile)
	if err != nil {
		fmt.Printf("[TLS] Failed to load cert: %v. Generating self-signed...\n", err)
		cmd := exec.Command("go", "run", "tls/gen_cert.go")
		cmd.Dir = "."
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			panic(fmt.Sprintf("[TLS] Failed to generate cert: %v", err))
		}
		_, err = tls.LoadX509KeyPair(certFile, keyFile)
		if err != nil {
			panic(err)
		}
	}

	certHash := getCertSHA256(certFile)
	if certHash == "" {
		panic("Failed to read cert for hash")
	}
	fmt.Printf("[TLS] Certificate SHA-256: %s\n", certHash)

	// --- Room Manager ---
	rm := room.NewRoomManager(cfg)
	sessionReg := newSessionRegistry()

	// --- WebTransport + HTTP/3 server ---
	// Create webtransport server and set its handler to our custom handler
	var wtServer *webtransport.Server
	wtServer = &webtransport.Server{
		H3: http3.Server{
			Addr: fmt.Sprintf(":%d", cfg.QUICPort),
		},
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	handler := &wtHandler{
		rm:       rm,
		reg:      sessionReg,
		wtServer: wtServer,
		certHash: certHash,
	}
	wtServer.H3.Handler = handler

	fmt.Printf("[Server] WebTransport listening on QUIC :%d\n", cfg.QUICPort)
	go func() {
		if err := wtServer.ListenAndServeTLS(certFile, keyFile); err != nil {
			fmt.Printf("[WT] Error: %v\n", err)
		}
	}()

	// --- 60Hz game loop ---
	ticker := time.NewTicker(16 * time.Millisecond)
	go func() {
		for range ticker.C {
			rm.Update(0.016)
		}
	}()

	// --- HTTP endpoints (TCP) ---
	httpPort := cfg.HTTPPort
	addr := fmt.Sprintf(":%d", httpPort)
	fmt.Printf("[Server] HTTP health check on %s\n", addr)

	// Read cert PEM for /cert-pem endpoint
	certPEM, err := os.ReadFile(certFile)
	if err != nil {
		fmt.Printf("[HTTP] Warning: could not read cert for /cert-pem: %v\n", err)
	}

	go func() {
		mux := http.NewServeMux()
		cors := func(h http.HandlerFunc) http.HandlerFunc {
			return func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Access-Control-Allow-Origin", "*")
				w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
				w.Header().Set("Access-Control-Max-Age", "86400")
				if r.Method == "OPTIONS" {
					w.WriteHeader(204)
					return
				}
				h(w, r)
			}
		}
		mux.HandleFunc("/health", cors(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			fmt.Fprintf(w, `{"status":"ok","version":"0.3.0","players":%d}`, rm.PlayerCount())
		}))
		if len(certPEM) > 0 {
			mux.HandleFunc("/cert-pem", cors(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Content-Type", "application/x-pem-file")
				w.Write(certPEM)
			}))
		}
		if err := http.ListenAndServe(addr, mux); err != nil {
			fmt.Printf("[HTTP] Error: %v\n", err)
		}
	}()

	// --- Graceful shutdown ---
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig
	fmt.Println("\n[Server] Shutting down...")
	rm.Cleanup()
	ticker.Stop()
	wtServer.Close()
	println("[Server] Shutdown complete")
}

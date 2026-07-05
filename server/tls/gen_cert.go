package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/base64"
	"encoding/pem"
	"fmt"
	"math/big"
	"os"
	"time"
)

func main() {
	os.MkdirAll("tls", 0755)

	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		panic(fmt.Sprintf("Failed to generate key: %v", err))
	}

	notBefore := time.Now()
	notAfter := notBefore.Add(13 * 24 * time.Hour)

	template := x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject: pkix.Name{
			CommonName: "localhost",
		},
		NotBefore:             notBefore,
		NotAfter:              notAfter,
		KeyUsage:              x509.KeyUsageDigitalSignature,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
		IsCA:                  false,
		DNSNames:              []string{"localhost"},
	}

	certDER, err := x509.CreateCertificate(rand.Reader, &template, &template, &privateKey.PublicKey, privateKey)
	if err != nil {
		panic(err)
	}

	if err := os.WriteFile("tls/cert.pem", pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: certDER}), 0644); err != nil {
		panic(err)
	}

	ecPriv, err := x509.MarshalECPrivateKey(privateKey)
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile("tls/key.pem", pem.EncodeToMemory(&pem.Block{Type: "EC PRIVATE KEY", Bytes: ecPriv}), 0600); err != nil {
		panic(err)
	}

	// SPKI hash for Chrome --ignore-certificate-errors-spki-list
	spki, _ := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
	spkiHash := sha256.Sum256(spki)
	spkiBase64 := base64.StdEncoding.EncodeToString(spkiHash[:])

	// Cert hash for WebTransport serverCertificateHashes
	certHash := sha256.Sum256(certDER)
	certBase64 := base64.StdEncoding.EncodeToString(certHash[:])

	fmt.Printf("✅ Certificate generated: tls/cert.pem, tls/key.pem\n")
	fmt.Printf("   Valid for 13 days\n\n")
	fmt.Printf("🔑 SPKI hash (for Chrome flag):\n")
	fmt.Printf("   %s\n\n", spkiBase64)
	fmt.Printf("🔐 Cert hash (for WebTransport serverCertificateHashes):\n")
	fmt.Printf("   %s\n\n", certBase64)
	fmt.Printf("🌐 Open Chrome with:\n")
	fmt.Printf("   google-chrome \\\n")
	fmt.Printf("     --origin-to-force-quic-on=localhost:4433 \\\n")
	fmt.Printf("     --ignore-certificate-errors-spki-list=%s \\\n", spkiBase64)
	fmt.Printf("     https://localhost:5174\n\n")
	fmt.Printf("Or copy cert.pem and use browser cert picker:\n")
	fmt.Printf("   cp tls/cert.pem ~/server-cert.pem\n")
}

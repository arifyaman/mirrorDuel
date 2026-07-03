package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"math/big"
	"os"
	"time"
)

func main() {
	priv, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		panic(err)
	}

	serial := big.NewInt(time.Now().UnixNano())
	tmpl := x509.Certificate{
		SerialNumber: serial,
		Subject:      pkix.Name{CommonName: "localhost"},
		NotBefore:    time.Now(),
		NotAfter:     time.Now().Add(365 * 24 * time.Hour),
		KeyUsage:     x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature,
		ExtKeyUsage:  []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		IsCA:         true,
		DNSNames:     []string{"localhost"},
	}

	certDer, err := x509.CreateCertificate(rand.Reader, &tmpl, &tmpl, &priv.PublicKey, priv)
	if err != nil {
		panic(err)
	}

	if err := os.WriteFile("tls/cert.pem", pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: certDer}), 0644); err != nil {
		panic(err)
	}

	privDer, err := x509.MarshalPKCS8PrivateKey(priv)
	if err != nil {
		panic(err)
	}

	if err := os.WriteFile("tls/key.pem", pem.EncodeToMemory(&pem.Block{Type: "EC PRIVATE KEY", Bytes: privDer}), 0600); err != nil {
		panic(err)
	}

	println("[TLS] Generated tls/cert.pem and tls/key.pem")
}

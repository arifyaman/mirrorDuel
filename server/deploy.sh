#!/usr/bin/env bash
set -euo pipefail

VPS_HOST="51.195.119.32"
VPS_PORT="21021"
VPS_USER="debian"
VPS_PATH="/home/debian/apps/mirrorDuel/server"

echo "==> Building server..."
go build -o main ./cmd/server/

echo "==> Creating remote directory..."
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "mkdir -p $VPS_PATH"

echo "==> Copying binary..."
scp -P "$VPS_PORT" main "$VPS_USER@$VPS_HOST:$VPS_PATH/"

echo "==> Copying production env config..."
scp -P "$VPS_PORT" .env.production "$VPS_USER@$VPS_HOST:$VPS_PATH/.env"

echo "==> Setting up systemd service..."
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "sudo tee /etc/systemd/system/mirrorduel.service > /dev/null" <<'SERVICE'
[Unit]
Description=MirrorDuel Game Server
After=network.target

[Service]
WorkingDirectory=/home/debian/apps/mirrorDuel/server
ExecStart=/home/debian/apps/mirrorDuel/server/main
EnvironmentFile=/home/debian/apps/mirrorDuel/server/.env
Restart=always
User=debian

[Install]
WantedBy=multi-user.target
SERVICE

echo "==> Reloading systemd and enabling service..."
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "sudo systemctl daemon-reload && sudo systemctl enable mirrorduel"

echo ""
echo "Deploy complete. Start the server with:"
echo "  ssh -p $VPS_PORT $VPS_USER@$VPS_HOST 'sudo systemctl start mirrorduel'"
echo ""
echo "Check logs with:"
echo "  ssh -p $VPS_PORT $VPS_USER@$VPS_HOST 'sudo journalctl -u mirrorduel -f'"

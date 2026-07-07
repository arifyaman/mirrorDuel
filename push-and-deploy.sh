#!/usr/bin/env bash
set -euo pipefail

read -r -p "Push to production and deploy? (y/N) " REPLY
if [[ "$REPLY" != "y" && "$REPLY" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

git push

exec ./server/deploy.sh

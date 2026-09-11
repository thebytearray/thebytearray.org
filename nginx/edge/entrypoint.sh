#!/bin/sh
set -e

SITE_HOST="${SITE_HOST:-site}"
CERT_PATH="/etc/letsencrypt/live/thebytearray.org/fullchain.pem"

subst() {
  sed "s/__SITE_HOST__/${SITE_HOST}/g"
}

subst < /etc/nginx/edge/http.conf > /etc/nginx/conf.d/default.conf

nginx -g "daemon on;"
sleep 2

if [ ! -f "$CERT_PATH" ]; then
  if ! certbot certonly \
    --webroot -w /var/www/certbot \
    -d thebytearray.org -d www.thebytearray.org \
    --email contact@thebytearray.org \
    --agree-tos \
    --non-interactive \
    --rsa-key-size 4096; then
    echo "certbot failed — check logs above; then: docker compose restart edge" >&2
  fi
fi

if [ -f "$CERT_PATH" ]; then
  subst < /etc/nginx/edge/https.conf > /etc/nginx/conf.d/default.conf
  nginx -s reload
else
  echo "warning: no TLS certificate yet; serving HTTP only until certbot succeeds" >&2
fi

(
  while true; do
    sleep 43200
    certbot renew \
      --webroot -w /var/www/certbot \
      --deploy-hook "nginx -s reload" \
      --quiet 2>/dev/null || true
  done
) &

nginx -s quit
sleep 1
exec nginx -g "daemon off;"

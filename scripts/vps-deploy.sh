#!/usr/bin/env bash
# Runs on the VPS. Loads a prebuilt image tag, switches the stack to it, health
# checks, and rolls back to the previously running tag if anything is unhealthy.
#
# Expects the image to already be present locally (CI streams it via `docker load`).
#
#   DEPLOY_TAG=<sha> ./scripts/vps-deploy.sh
#
set -euo pipefail

REPO_DIR="${REPO_DIR:-/srv/thebytearray/repo}"
STATE_FILE="${STATE_FILE:-/srv/thebytearray/deployed-tag}"
ENV_FILE="${REPO_DIR}/.env"
COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.prod.yml)
HEALTH_RETRIES="${HEALTH_RETRIES:-30}"
IMAGE_PREFIX="thebytearray/website"

log() { printf '[deploy] %s\n' "$*"; }
die() { printf '[deploy] ERROR: %s\n' "$*" >&2; exit 1; }

cd "$REPO_DIR"

NEW_TAG="${DEPLOY_TAG:-}"
[ -n "$NEW_TAG" ] || die "DEPLOY_TAG not set"
docker image inspect "${IMAGE_PREFIX}:${NEW_TAG}" >/dev/null 2>&1 \
  || die "image ${IMAGE_PREFIX}:${NEW_TAG} is not loaded on this host"

PREV_TAG=""
[ -f "$STATE_FILE" ] && PREV_TAG="$(cat "$STATE_FILE")"

compose() { docker compose "${COMPOSE_FILES[@]}" "$@"; }

# A .env file in the project directory takes precedence over the shell
# environment for compose interpolation, so the tag has to be written there or
# `up` silently keeps running the previous image.
set_image_tag() {
  local tag="$1" tmp
  tmp="$(mktemp "${REPO_DIR}/.env.XXXXXX")"
  if [ -f "$ENV_FILE" ] && grep -q '^IMAGE_TAG=' "$ENV_FILE"; then
    awk -v t="$tag" '/^IMAGE_TAG=/{print "IMAGE_TAG=" t; next} {print}' "$ENV_FILE" > "$tmp"
  else
    [ -f "$ENV_FILE" ] && cat "$ENV_FILE" > "$tmp"
    printf 'IMAGE_TAG=%s\n' "$tag" >> "$tmp"
  fi
  chmod 600 "$tmp"
  mv "$tmp" "$ENV_FILE"
}

# The edge container terminates TLS and reverse-proxies to app, so the health
# check goes through the full request path rather than hitting app directly.
# Plain HTTP cannot be used: the edge 301s everything to HTTPS.
tls_health_check() {
  curl -fsS --max-time 5 \
    --resolve thebytearray.org:443:127.0.0.1 \
    https://thebytearray.org/health.html >/dev/null 2>&1
}

# Only used before certbot has ever issued a certificate, when the edge cannot
# serve HTTPS yet. Once a cert exists it is ignored, so a broken TLS terminator
# can never pass as healthy.
cert_exists() {
  local edge
  edge="$(compose ps -q edge 2>/dev/null || true)"
  [ -n "$edge" ] || return 1
  docker exec "$edge" test -f /etc/letsencrypt/live/thebytearray.org/fullchain.pem 2>/dev/null
}

app_health_check() {
  local app
  app="$(compose ps -q app 2>/dev/null || true)"
  [ -n "$app" ] || return 1
  docker exec "$app" wget -qO- http://127.0.0.1/health.html >/dev/null 2>&1
}

health_check() {
  local i preboot=0
  cert_exists || preboot=1
  for ((i = 1; i <= HEALTH_RETRIES; i++)); do
    tls_health_check && return 0
    [ "$preboot" = 1 ] && app_health_check && return 0
    sleep 2
  done
  return 1
}

# A healthy old container would pass health_check even when the tag failed to
# switch, so assert the running image is the one that was requested.
assert_running_image() {
  local expected="$1" cid actual
  cid="$(compose ps -q app 2>/dev/null || true)"
  [ -n "$cid" ] || { log "app container not found after up"; return 1; }
  actual="$(docker inspect -f '{{.Config.Image}}' "$cid" 2>/dev/null || true)"
  if [ "$actual" != "$expected" ]; then
    log "app is running '${actual}', expected '${expected}'"
    return 1
  fi
  return 0
}

activate() {
  local tag="$1"
  set_image_tag "$tag"
  IMAGE_TAG="$tag" compose up -d --no-build --remove-orphans
}

rollback() {
  [ -n "$PREV_TAG" ] || { log "no previous tag recorded; cannot roll back"; return 1; }
  docker image inspect "${IMAGE_PREFIX}:${PREV_TAG}" >/dev/null 2>&1 || {
    log "previous image ${PREV_TAG} is gone from this host; cannot roll back"
    return 1
  }
  log "rolling back to ${PREV_TAG}"
  activate "$PREV_TAG" || true
  if health_check && assert_running_image "${IMAGE_PREFIX}:${PREV_TAG}"; then
    # Record what is actually live, so a later rollback does not target the tag
    # that just failed.
    printf '%s' "${PREV_TAG}" > "$STATE_FILE"
    log "rollback to ${PREV_TAG} healthy"
    return 0
  fi
  log "rollback to ${PREV_TAG} is ALSO unhealthy - manual intervention required"
  return 1
}

log "deploying ${NEW_TAG} (previous: ${PREV_TAG:-none})"

# Sync the working tree so compose files and nginx config match the deployed image.
# A shallow clone cannot check out arbitrary SHAs, so unshallow when needed.
if [ -n "${DEPLOY_SHA:-}" ]; then
  git fetch --quiet --depth 1 origin "${DEPLOY_SHA}" 2>/dev/null || {
    git fetch --quiet --unshallow origin 2>/dev/null || git fetch --quiet origin
    git fetch --quiet --depth 1 origin "${DEPLOY_SHA}" 2>/dev/null || true
  }
  git checkout --quiet --force "${DEPLOY_SHA}"
  log "checked out ${DEPLOY_SHA}"
fi

if ! activate "$NEW_TAG"; then
  log "compose up failed"
  rollback || true
  die "deploy failed, rolled back"
fi

if health_check && assert_running_image "${IMAGE_PREFIX}:${NEW_TAG}"; then
  printf '%s' "${NEW_TAG}" > "$STATE_FILE"
  log "SUCCESS: ${NEW_TAG} is live and healthy"
  compose ps
  exit 0
fi

log "health check or image verification failed for ${NEW_TAG}"
compose logs --tail 50 app edge || true
rollback || true
die "deploy failed, rolled back"

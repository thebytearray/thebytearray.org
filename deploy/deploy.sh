#!/usr/bin/env bash
# Builds the site and publishes it to the server as a new release: uploads it,
# then runs deploy/publish-release.sh there to switch to it, verify it and roll
# back if it is not being served. Run with `npm run deploy`; the GitHub
# workflow runs the same script.
#
# The server address is kept out of the repo: set DEPLOY_HOST (user@host) in
# the environment or in a git-ignored .env.deploy file. Optional: DEPLOY_KEY
# (SSH private key), DEPLOY_KEEP (releases kept for rollback) and
# DEPLOY_SKIP_BUILD=1 (publish the dist/ that is already there).
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f .env.deploy ]; then
  set -a
  . ./.env.deploy
  set +a
fi

HOST="${DEPLOY_HOST:?Set DEPLOY_HOST (user@host) in .env.deploy or the environment}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/deploy_key}"
KEEP="${DEPLOY_KEEP:-5}"
APP=<site-dir>
SITE_HOST=thebytearray.org

SSH=(ssh -i "$KEY" -o IdentitiesOnly=yes -o BatchMode=yes)
release="$(date -u +%Y%m%d%H%M%S)"

if [ "${DEPLOY_SKIP_BUILD:-}" != 1 ]; then
  npm run build
fi
if [ ! -f dist/index.html ]; then
  echo "dist/index.html is missing: build the site first (npm run build)" >&2
  exit 1
fi
printf '%s\n' "$release" > dist/release.txt

echo "Uploading release $release to $HOST"
rsync -az --delete -e "${SSH[*]}" dist/ "$HOST:$APP/releases/.$release.tmp/"

"${SSH[@]}" "$HOST" \
  "SITE_DIR='$APP' SITE_HOST='$SITE_HOST' RELEASE='$release' KEEP_RELEASES='$KEEP' bash -s" \
  < deploy/publish-release.sh

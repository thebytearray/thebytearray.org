#!/usr/bin/env bash
# Runs on the server. Makes an uploaded release live by switching the `current`
# symlink to it in one step, checks that nginx serves it, rolls back if it does
# not, and prunes old releases. deploy/deploy.sh pipes this script over SSH.
#
# SITE_DIR       directory holding releases/ and the current symlink (required)
# SITE_HOST      the site's host name; https://<SITE_HOST>/release.txt is read back (required)
# RELEASE        name of the release, uploaded as releases/.<RELEASE>.tmp (required)
# KEEP_RELEASES  releases kept for rollback (default 5)
set -euo pipefail

SITE_DIR="${SITE_DIR:?Set SITE_DIR to the directory that holds releases/ and current}"
SITE_HOST="${SITE_HOST:?Set SITE_HOST to the host name of the site}"
RELEASE="${RELEASE:?Set RELEASE to the name of the uploaded release}"
KEEP="${KEEP_RELEASES:-5}"

cd "$SITE_DIR"

if [ ! -f "releases/.$RELEASE.tmp/index.html" ]; then
  echo "releases/.$RELEASE.tmp/index.html is missing: the upload did not finish" >&2
  exit 1
fi

previous="$(readlink current || true)"

# The upload has a temporary name so a half-copied release is never visible.
mv "releases/.$RELEASE.tmp" "releases/$RELEASE"

point_current_at() {
  ln -sfn "$1" current.tmp
  mv -Tf current.tmp current
}

point_current_at "releases/$RELEASE"
echo "Switched current to release $RELEASE (was: ${previous:-none})"

# Ask this machine's own nginx: the public address sits behind Cloudflare's
# browser check, which answers scripts with a 403.
live=""
for attempt in 1 2 3 4 5; do
  live="$(curl -fsS --max-time 10 --resolve "$SITE_HOST:443:127.0.0.1" "https://$SITE_HOST/release.txt" || true)"
  if [ "$live" = "$RELEASE" ]; then
    break
  fi
  sleep 2
done

if [ "$live" != "$RELEASE" ]; then
  echo "https://$SITE_HOST/release.txt returned '${live:-nothing}', expected '$RELEASE'" >&2
  if [ -n "$previous" ]; then
    point_current_at "$previous"
    echo "Rolled back to $previous" >&2
  fi
  rm -rf -- "releases/$RELEASE"
  exit 1
fi

# Keep the newest releases; only timestamp-named directories are ever removed.
cd releases
ls -1 | grep -E '^[0-9]{14}$' | sort -r | tail -n +"$((KEEP + 1))" | xargs -r rm -rf --

echo "Live: https://$SITE_HOST (release $RELEASE)"

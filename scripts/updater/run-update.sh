#!/bin/sh
set -e

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

cd /project

if [ ! -d .git ]; then
  echo "run-update: /project is not a git clone; skipping pull" >&2
else
  git pull --ff-only
fi

exec docker compose -f /project/docker-compose.yml up -d --build --remove-orphans

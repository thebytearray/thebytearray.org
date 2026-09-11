#!/bin/sh
set -e
cd "$(dirname "$0")/.."

command -v docker >/dev/null 2>&1 || {
  echo "Docker is required: https://docs.docker.com/get-docker/" >&2
  exit 1
}
docker compose version >/dev/null 2>&1 || {
  echo "Docker Compose v2 is required (docker compose)" >&2
  exit 1
}

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

docker compose up -d --build --remove-orphans

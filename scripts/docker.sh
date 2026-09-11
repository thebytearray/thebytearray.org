#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Config
IMAGE_NAME="thebytearray/website"
REGISTRY="${REGISTRY:-ghcr.io}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is required. Install from https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose v2 is required (docker compose plugin)"
        exit 1
    fi
}

# Build the image
build() {
    log_info "Building Docker image..."
    export DOCKER_BUILDKIT=1
    export COMPOSE_DOCKER_CLI_BUILD=1

    docker build \
        --tag "${IMAGE_NAME}:${IMAGE_TAG}" \
        --tag "${IMAGE_NAME}:latest" \
        --platform linux/amd64 \
        .

    log_info "Build complete: ${IMAGE_NAME}:${IMAGE_TAG}"
}

# Run the container
run() {
    log_info "Starting container..."

    # Stop existing container if running
    docker stop "${IMAGE_NAME}" 2>/dev/null || true
    docker rm "${IMAGE_NAME}" 2>/dev/null || true

    docker run -d \
        --name "${IMAGE_NAME}" \
        --restart unless-stopped \
        --publish 80:80 \
        --publish 443:443 \
        --env NODE_ENV=production \
        "${IMAGE_NAME}:${IMAGE_TAG}"

    log_info "Container started. Visit http://localhost"
}

# Pull latest and redeploy
update() {
    log_info "Pulling latest image..."
    docker pull "${IMAGE_NAME}:${IMAGE_TAG}"

    log_info "Recreating container..."
    docker stop "${IMAGE_NAME}" 2>/dev/null || true
    docker rm "${IMAGE_NAME}" 2>/dev/null || true
    docker run -d \
        --name "${IMAGE_NAME}" \
        --restart unless-stopped \
        --publish 80:80 \
        --publish 443:443 \
        --env NODE_ENV=production \
        "${IMAGE_NAME}:${IMAGE_TAG}"

    log_info "Update complete!"
}

# Show logs
logs() {
    docker logs -f "${IMAGE_NAME}"
}

# Stop and remove
stop() {
    log_info "Stopping container..."
    docker stop "${IMAGE_NAME}" 2>/dev/null || true
    docker rm "${IMAGE_NAME}" 2>/dev/null || true
    log_info "Container stopped."
}

# Main
COMMAND="${1:-build}"

case "${COMMAND}" in
    build)
        check_docker
        build
        ;;
    run|start)
        check_docker
        build
        run
        ;;
    update|upgrade)
        check_docker
        update
        ;;
    logs)
        logs
        ;;
    stop)
        stop
        ;;
    *)
        echo "Usage: $0 {build|run|update|logs|stop}"
        exit 1
        ;;
esac

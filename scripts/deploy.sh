#!/bin/bash
set -e

# The Byte Array - Production Deployment Script
# Usage: ./scripts/deploy.sh [options]
#
# Options:
#   --no-pull     Skip git pull before deployment
#   --staging     Deploy to staging environment

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "${SCRIPT_DIR}")"

cd "${PROJECT_ROOT}"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Parse arguments
SKIP_PULL=false
ENVIRONMENT="production"

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-pull)
            SKIP_PULL=true
            shift
            ;;
        --staging)
            ENVIRONMENT="staging"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Git pull (unless skipped)
if [ "${SKIP_PULL}" = false ] && [ -d .git ]; then
    echo "Pulling latest changes..."
    git pull --ff-only origin main
fi

# Export Docker buildkit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Determine compose files
COMPOSE_FILES="-f docker-compose.yml"

case "${ENVIRONMENT}" in
    staging)
        COMPOSE_FILES="${COMPOSE_FILES} -f docker-compose.staging.yml"
        ;;
    production)
        COMPOSE_FILES="${COMPOSE_FILES} -f docker-compose.prod.yml"
        ;;
esac

# Build and deploy
echo "Deploying to ${ENVIRONMENT}..."

if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    docker compose ${COMPOSE_FILES} down
    docker compose ${COMPOSE_FILES} up -d --build --remove-orphans
    echo "Deployment complete!"
    docker compose ${COMPOSE_FILES} ps
else
    echo "Docker not available. Building image only..."
    docker build --platform linux/amd64 -t thebytearray/website:latest .
    echo ""
    echo "Build complete. To deploy manually:"
    echo "  docker run -d --name website -p 80:80 thebytearray/website:latest"
fi

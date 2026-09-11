#!/bin/bash
set -e

# The Byte Array - Development Setup Script
# Run this after cloning the repository

set -e

echo "Setting up The Byte Array website development environment..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed."
    echo "Install from: https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "Node.js version OK: $(node -v)"

# Copy environment file
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "Creating .env from .env.example..."
        cp .env.example .env
    fi
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build (to verify setup)
echo "Building project..."
npm run build

echo ""
echo "Setup complete!"
echo ""
echo "Available commands:"
echo "  make dev       - Start development server"
echo "  make build     - Build for production"
echo "  make up        - Start Docker containers"
echo "  make logs      - View Docker logs"
echo ""
echo "For more commands: make help"

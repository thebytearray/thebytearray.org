.PHONY: help install dev build lint typecheck test preview up down logs ps clean buildx push deploy deploy-staging

# Colors
BOLD := $(shell tput bold)
GREEN := $(shell tput setaf 2)
YELLOW := $(shell tput setaf 3)
RESET := $(shell tput sgr0)

# Default target
help:
	@echo "$(BOLD)Available commands:$(RESET)"
	@echo ""
	@echo "$(GREEN)  make install$(RESET)        - Install dependencies"
	@echo "$(GREEN)  make dev$(RESET)           - Start development server"
	@echo "$(GREEN)  make build$(RESET)          - Build for production"
	@echo "$(GREEN)  make lint$(RESET)           - Run ESLint"
	@echo "$(GREEN)  make typecheck$(RESET)     - Run TypeScript compiler"
	@echo "$(GREEN)  make test$(RESET)           - Run tests"
	@echo "$(GREEN)  make preview$(RESET)         - Preview production build"
	@echo ""
	@echo "$(YELLOW)  Docker commands:$(RESET)"
	@echo "$(GREEN)  make up$(RESET)             - Start containers (production)"
	@echo "$(GREEN)  make down$(RESET)           - Stop containers"
	@echo "$(GREEN)  make logs$(RESET)           - View container logs"
	@echo "$(GREEN)  make ps$(RESET)             - List running containers"
	@echo "$(GREEN)  make clean$(RESET)          - Remove containers and volumes"
	@echo "$(GREEN)  make buildx$(RESET)         - Build multi-platform Docker image"
	@echo "$(GREEN)  make push$(RESET)            - Push image to registry"
	@echo ""
	@echo "$(YELLOW)  Deployment:$(RESET)"
	@echo "$(GREEN)  make deploy$(RESET)         - Deploy to production server"

# Development
install:
	npm ci

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

typecheck:
	npx tsc --noEmit

test:
	npm test

preview:
	npm run preview

# Docker
up:
	@echo "$(BOLD)Starting containers...$(RESET)"
	docker compose up -d --build

down:
	@echo "$(BOLD)Stopping containers...$(RESET)"
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

clean:
	docker compose down -v --remove-orphans
	docker system prune -f

rebuild:
	docker compose down
	docker compose up -d --build

buildx:
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		--tag thebytearray/website:latest \
		--push .

# Deployment
deploy:
	@echo "$(BOLD)Deploying to production...$(RESET)"
	./scripts/deploy.sh

deploy-staging:
	@echo "$(BOLD)Deploying to staging...$(RESET)"
	./scripts/deploy-staging.sh

.PHONY: help setup dev build test clean db-reset

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Initial project setup
	@bash scripts/setup.sh

dev: ## Start development servers
	@bash scripts/dev.sh

build: ## Build all applications
	npm run build

test: ## Run tests
	npm test

lint: ## Run linter
	npm run lint

format: ## Format code
	npm run format

clean: ## Clean build artifacts and dependencies
	npm run clean
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules

db-reset: ## Reset database (WARNING: deletes all data)
	cd apps/api && npx prisma migrate reset --force

db-migrate: ## Run database migrations
	cd apps/api && npx prisma migrate dev

db-studio: ## Open Prisma Studio
	cd apps/api && npx prisma studio

db-seed: ## Seed database with demo data
	cd apps/api && npx tsx prisma/seed.ts

docker-up: ## Start Docker services
	docker-compose up -d

docker-down: ## Stop Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

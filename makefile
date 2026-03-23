# Variables
NPX := npx
TSC := $(NPX) tsc
POSTCSS := $(NPX) postcss
TAILWIND := $(NPX) tailwindcss
TSX := $(NPX) tsx
PRETTIER := $(NPX) prettier
PLOP := $(NPX) plop
NEXT := $(NPX) next
YALC := $(NPX) yalc

# Default target
.DEFAULT_GOAL := help

# Download ENV
ifneq (,$(wildcard .env))
  include .env
  export
endif

# Internal Helpers
.PHONY: yalc-add-thread
yalc-add-thread: # Add yalc copy of thread, install packages
	$(YALC) add thread-ui
	npm install


.PHONY: clean-thread
clean-thread: # Remove cache and thread-ui
	rm -rf node_modules/thread-ui
	rm -rf .next/cache/webpack

.PHONY: docker-build
docker-build: # Build Docker image with build-time env vars
	docker build \
		--build-arg NEXT_PUBLIC_SUPABASE_URL=$(NEXT_PUBLIC_SUPABASE_URL) \
		--build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$(NEXT_PUBLIC_SUPABASE_ANON_KEY) \
		--build-arg NEXT_PUBLIC_BUCKET_NAME=$(NEXT_PUBLIC_BUCKET_NAME) \
		--build-arg NEXT_PUBLIC_BASE_SRC=$(NEXT_PUBLIC_BASE_SRC) \
		--build-arg NEXT_PUBLIC_API_URL=$(NEXT_PUBLIC_API_URL) \
		-t a-fisher-web-site:test .

.PHONY: docker-run
docker-run: # Run Docker container with runtime env vars from .env
	docker run -p 3000:3000 --env-file .env a-fisher-web-site:test


# Build Targets
.PHONY: help
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: build
build: ## Build Next.js Application
	$(NEXT) build

.PHONY: dev
dev: ## Start Next.js Development Server
	@echo 'Starting Development Server'
	$(NEXT) dev

.PHONY: refresh
refresh: clean-thread yalc-add-thread dev ## Reset local thread-ui instance and start server

.PHONY: up
up: docker-build docker-run ## Build and run Docker container
# Variables
NPX := npx
TSC := $(NPX) tsc
POSTCSS := $(NPX) postcss
TAILWIND := $(NPX) tailwindcss
TSX := $(NPX) tsx
PRETTIER := $(NPX) prettier
PLOP := $(NPX) plop
NEXT := $(NPX) next

# Default target
.DEFAULT_GOAL := help

# Internal Helpers
.PHONY: clean-thread
clean-thread: # Remove cache and thread-ui
	rm -rf node_modules/thread-ui
	rm -rf .next/cache/webpack


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
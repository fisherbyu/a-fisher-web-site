# Variables
NPX := npx
TSC := $(NPX) tsc
POSTCSS := $(NPX) postcss
TAILWIND := $(NPX) tailwindcss
TSX := $(NPX) tsx
PRETTIER := $(NPX) prettier
PLOP := $(NPX) plop

# Default target
.DEFAULT_GOAL := help

# Build Targets
.PHONY: help
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
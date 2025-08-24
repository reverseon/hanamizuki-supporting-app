# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Go-based web application that serves as a landing page for Kubernetes clusters in the "Ishiori" homelab. The application displays a personalized welcome page for clusters named "Hana" and "Mizuki" (Hanamizuki - Japanese for Flowering Dogwood).

## Development Commands

### Local Development
- `go run main.go` - Run the application locally (serves on port 8080 by default)
- `go mod download` - Download Go module dependencies
- `go build -o k8s-dex-client .` - Build production binary

### Docker Development
- `docker-compose -f docker/dev.yaml up` - Start development environment with hot reloading (requires Air)
- `docker-compose -f docker/prod-test.yaml up` - Test production build locally
- `docker build -f docker/Dockerfile -t k8s-landing-page .` - Build production Docker image
- `docker build -f docker/dev.Dockerfile -t k8s-landing-page-dev .` - Build development Docker image

## Architecture

### Application Structure
- **main.go**: Single-file Go web server using `net/http` and `html/template`
- **templates/index.html**: Go template with cluster name interpolation
- **static/**: Frontend assets (CSS, JS, favicon)
- **docker/**: Containerization configurations

### Key Components

#### Web Server (main.go)
- Simple HTTP server with two main handlers:
  - Root handler (`/`) serves templated index page
  - Static handler (`/static/`) serves CSS, JS, and favicon with security checks
- Environment configuration via `CLUSTER_NAME` and `PORT` variables
- Redirects unknown paths to root for security

#### Frontend (templates/index.html + static/)
- Responsive design with Japanese-inspired theming
- Template variable: `{{ .ClusterName }}` for dynamic cluster name display
- CSS custom properties for theming with dark mode support
- JavaScript features: scroll indicators, parallax effects, easter eggs (Konami code)

### Docker Setup
- **Production** (`docker/Dockerfile`): Multi-stage build with Alpine Linux, non-root user, health checks
- **Development** (`docker/dev.Dockerfile`): Hot reloading with Air, volume mounts for live editing
- Exposes port 2434 by default in containerized environments

### Environment Variables
- `CLUSTER_NAME`: Display name for the cluster (defaults to "Default Cluster")
- `PORT`: Server port (defaults to 8080 locally, 2434 in Docker)
- `GO_ENV`: Environment indicator (development/production)

### Security Features
- Non-root user in production containers
- Static file access validation (prevents directory traversal)
- Health check endpoints for container orchestration
- No directory listing for static files

## Development Notes

- No test framework currently implemented
- No CI/CD configuration present
- Uses Go 1.24+ (specified in go.mod)
- Frontend uses Inter font family and modern CSS features
- Includes accessibility features (reduced motion support, focus management)
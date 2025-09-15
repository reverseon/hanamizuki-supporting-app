# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Go-based web application that serves as a personal landing page for ishiori.net. The application displays a minimalist, aesthetically pleasing page featuring Japanese characters "イ栞" (Ishiori) with animated particle effects and a gradient background.

## Development Commands

### Local Development
- `go run main.go` - Run the application locally (serves on port 8080 by default)
- `go mod download` - Download Go module dependencies
- `go build -o ishiori-landing-page .` - Build production binary

### Docker Development
- `docker-compose -f docker/dev.yaml up` - Start development environment with hot reloading (requires Air)
- `docker-compose -f docker/prod-test.yaml up` - Test production build locally
- `docker build -f docker/Dockerfile -t ishiori-landing-page .` - Build production Docker image
- `docker build -f docker/dev.Dockerfile -t ishiori-landing-page-dev .` - Build development Docker image

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
  - Static handler (`/static/`) serves CSS and other static assets with security checks
- Environment configuration via `PORT` variable
- Redirects unknown paths to root for security

#### Frontend (templates/index.html + static/)
- Minimalist single-page design with Japanese aesthetic
- Features Japanese characters "イ栞" (Ishiori) as the main focal point
- Animated particle effects and floating animations
- Gradient background with shimmer effects
- Responsive design with mobile support
- Accessibility features (reduced motion support)
- Uses Inter and Noto Sans JP fonts from Google Fonts

### Docker Setup
- **Production** (`docker/Dockerfile`): Multi-stage build with Alpine Linux, non-root user, health checks
- **Development** (`docker/dev.Dockerfile`): Hot reloading with Air, volume mounts for live editing
- Exposes port 2434 by default in containerized environments

### Environment Variables
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
- Uses Go 1.24.5 (specified in go.mod)
- Frontend uses modern CSS animations and transforms
- Single HTML template with embedded CSS styling
- No JavaScript dependencies - pure CSS animations
- Includes accessibility features (reduced motion support)
- Domain: ishiori.net
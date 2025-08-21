# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Run the application**: `go run main.go`
- **Build the application**: `go build -o tmp/main main.go`
- **Test the application**: `go test ./...`
- **Format code**: `go fmt ./...`
- **Check for issues**: `go vet ./...`
- **Install dependencies**: `go mod tidy`
- **Run with Docker Compose (development)**: `docker-compose -f docker/dev.yaml up`
- **Build Docker image**: `docker build -f docker/Dockerfile -t k8s-dex-client .`

## Environment Setup

The application requires a `.env` file with the following variables:
- `CLIENT_ID`: OIDC client identifier
- `CLIENT_SECRET`: OIDC client secret
- `OIDC_ISSUER`: URL of the OIDC provider (Dex server)
- `CALLBACK_URL`: OAuth callback URL
- `CLIENT_CLUSTER_NAME`: Display name for the Kubernetes cluster
- `PORT`: Port number for the web server
- `APISERVER_URL`: (Optional) Kubernetes API server URL

For development, these variables are pre-configured in `docker/dev.yaml` for easy Docker Compose usage.

## Architecture Overview

This is a Kubernetes Dex OIDC client application written in Go that provides web-based authentication for Kubernetes clusters. The application implements OAuth2/OIDC flow with Dex as the identity provider.

### Core Components

- **main.go**: HTTP server setup and route registration
- **pkg/auth/claims.go**: OIDC claims parsing and user information extraction
- **pkg/middleware/auth.go**: Authentication middleware with three modes (authenticated, unauthenticated, public)
- **apis/auth/**: Authentication endpoints
  - `github/main.go`: Initiates OAuth flow, generates state, redirects to provider
  - `callback/main.go`: Handles OAuth callback, exchanges code for tokens, sets cookies
  - `logout/main.go`: Handles user logout and session cleanup
- **pages/**: Web page handlers
  - `home/main.go`: Protected home page that requires authentication
  - `login/main.go`: Login page rendering
  - `static/main.go`: Static file serving
- **templates/**: HTML templates for login and main pages
- **static/**: CSS stylesheets and favicon
- **docker/**: Container configuration
  - `Dockerfile`: Production container build
  - `dev.Dockerfile`: Development container with hot reload
  - `dev.yaml`: Docker Compose configuration for development

### Authentication Flow

1. User visits login page (`/login`)
2. User clicks "Login with GitHub" button, POSTs to `/apis/auth/github`
3. Application generates OAuth state, sets cookie, redirects to Dex
4. After authentication, Dex redirects to `/apis/auth/callback`
5. Application validates state, exchanges code for tokens, extracts claims
6. Access token stored in HTTP-only cookie, user redirected to home page
7. Protected pages use `auth.GetUserClaimsFromRequest()` to verify authentication

### Middleware System

The application uses a flexible middleware system with three authentication modes:
- **AuthModeAuthenticated**: Requires valid authentication, redirects to `/login` if not authenticated
- **AuthModeUnauthenticated**: Requires no authentication, redirects to `/` if authenticated  
- **AuthModePublic**: Allows access regardless of authentication status

Authentication state is determined by checking for a valid `access_token` cookie and validating it against the OIDC provider.

### Key Dependencies

- `github.com/coreos/go-oidc/v3`: OIDC client library
- `golang.org/x/oauth2`: OAuth2 client implementation
- `github.com/spf13/cobra`: CLI framework (imported but not actively used in main)

The `example/` directory contains reference code from the original Dex example application but is not used in the main application.
# Development Dockerfile with Air for hot reloading
FROM golang:1.24-alpine

# Install Air for hot reloading
RUN go install github.com/air-verse/air@latest

# Set working directory
WORKDIR /app

# Install dependencies for development
RUN apk add --no-cache git

# Copy go mod files first for better caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy Air configuration
COPY .air.toml ./

# Create tmp directory for Air
RUN mkdir -p tmp

# Expose port (will be configurable via environment)
EXPOSE 5555

# Run Air for hot reloading
CMD ["air"]

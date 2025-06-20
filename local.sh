#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to wait for database to be ready
wait_for_db() {
    print_status "Waiting for database to be ready..."
    sleep 2
    while ! docker exec $(docker compose ps -q db) pg_isready -U postgres > /dev/null 2>&1; do
        print_status "Database not ready yet, waiting..."
        sleep 2
    done
    print_status "Database is ready!"
}

# Function to start the development environment
up() {
    print_status "Starting development environment..."
    
    print_status "Starting database container..."
    docker compose up -d
    
    wait_for_db
    
    print_status "Starting Next.js development server..."
    npm run dev &
    NEXT_PID=$!
    
    
    print_status "Development environment is ready!"
    print_status "Next.js app is running at http://localhost:3000"
    print_status "Press Ctrl+C to stop the development server"
    
    wait $NEXT_PID
}

# Function to reset the development environment
reset() {
    print_status "Resetting development environment..."
    
    print_status "Checking for running containers..."
    if [ "$(docker compose ps -q)" ]; then
        print_status "Stopping running containers..."
        docker compose stop
    else
        print_status "No running containers found."
    fi
    
    print_status "Stopping and removing containers..."
    docker compose down -v
    
    print_status "Starting database container..."
    docker compose up -d
    
    wait_for_db
    
    print_status "Creating database tables..."
    npx drizzle-kit push --force
    
    print_status "Starting Next.js development server..."
    npm run dev &
    NEXT_PID=$!
    
    print_status "Waiting for Next.js app to start..."
    sleep 5
    
    print_status "Seeding the database..."
    curl -X POST http://localhost:3000/api/seed
    
    print_status "Development environment has been reset and is ready!"
    print_status "Next.js app is running at http://localhost:3000"
    print_status "Press Ctrl+C to stop the development server"
    
    wait $NEXT_PID
}

# Main script logic
case "$1" in
    up)
        up
        ;;
    reset)
        reset
        ;;
    *)
        echo "Usage: $0 {up|reset}"
        echo "  up    - Boot the container and start the app"
        echo "  reset - Destroy containers and recreate everything"
        exit 1
        ;;
esac 
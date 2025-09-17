#!/bin/bash
# start-local.sh
# A simple script to build and run the local Docker container for Lumoria Core

# Exit immediately if a command fails
set -e

# Build the Docker image
echo "Building Docker image..."
docker build --network=host -f Dockerfile.core -t lumoria-core:local .

# Run the Docker container
echo "Running Docker container..."
docker run -p 3000:3000 lumoria-core:local

# Access the app at http://localhost:3000
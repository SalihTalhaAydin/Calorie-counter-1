#!/bin/bash

echo "� Starting NutriAI development servers..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "❌ Missing backend/.env file"
    echo "Run ./scripts/setup-dev.sh first"
    exit 1
fi

# Start backend and mobile concurrently
npm run dev

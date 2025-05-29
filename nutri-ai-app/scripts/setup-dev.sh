#!/bin/bash

echo "íº€ Setting up NutriAI development environment..."

# Create logs directory
mkdir -p backend/logs

# Install backend dependencies
echo "í³¦ Installing backend dependencies..."
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "âœ… Created .env file from example"
    echo "âš ï¸  Please update .env with your API keys"
fi

# Install mobile dependencies
echo "í³± Installing mobile dependencies..."
cd ../mobile
npm install

# Install Expo CLI if not present
if ! command -v expo &> /dev/null; then
    echo "í³² Installing Expo CLI..."
    npm install -g @expo/cli
fi

echo "âœ… Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your API keys"
echo "2. Start MongoDB and Redis (if using locally)"
echo "3. Run 'npm run dev' from root directory"
echo ""
echo "Backend will run on: http://localhost:3001"
echo "Mobile will run on: http://localhost:19006"

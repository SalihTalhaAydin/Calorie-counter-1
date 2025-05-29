#!/bin/bash

# 🍎 Simple NutriAI Runner
# Just the essential commands

case "$1" in
  "setup")
    echo "🔧 Quick setup..."
    npm install concurrently --save-dev
    cd backend && npm install && cd ..
    cd mobile && npm install && cd ..
    echo "✅ Done! Update backend/.env with your API keys"
    ;;
    
  "dev")
    echo "🚀 Starting development..."
    npx concurrently \
      "cd backend && npm run dev" \
      "cd mobile && npm start" \
      --names "API,MOBILE" \
      --prefix-colors "blue,green"
    ;;
    
  "backend")
    echo "🖥️  Backend only..."
    cd backend && npm run dev
    ;;
    
  "mobile")
    echo "📱 Mobile only..."
    cd mobile && npm start
    ;;
    
  "ios")
    echo "📱 iOS build..."
    cd mobile && npm run ios
    ;;
    
  "android")  
    echo "🤖 Android build..."
    cd mobile && npm run android
    ;;
    
  *)
    echo "🍎 NutriAI Commands:"
    echo "  ./dev.sh setup    - Install everything"
    echo "  ./dev.sh dev      - Start both backend + mobile" 
    echo "  ./dev.sh backend  - Backend only"
    echo "  ./dev.sh mobile   - Mobile only"
    echo "  ./dev.sh ios      - Build for iOS"
    echo "  ./dev.sh android  - Build for Android"
    ;;
esac
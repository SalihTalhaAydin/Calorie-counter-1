# 1. Create and run the script
chmod +x setup_nutrition_app.sh
./setup_nutrition_app.sh

# 2. Navigate to project
cd nutri-ai-app

# 3. Setup development environment
./scripts/setup-dev.sh

# 4. Add your API keys to backend/.env
nano backend/.env

# 5. Start development
npm run dev
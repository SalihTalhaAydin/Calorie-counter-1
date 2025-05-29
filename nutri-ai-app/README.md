# 🍎 NutriAI - AI Nutrition Calculator

A cross-platform mobile app (iOS/Android) with AI-powered nutrition calculation and consistency validation.

## 🚀 Features

- **AI-Powered Calculations**: Uses GPT-4, Claude, Gemini, and DeepSeek
- **Consistency Testing**: Validate AI model reliability
- **Cross-Platform**: React Native (iOS & Android)
- **Real-time Results**: Fast nutrition calculations
- **History Tracking**: Save and review past calculations
- **Offline Support**: Basic functionality without internet

## 📱 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- Redis (optional, for caching)
- Expo CLI
- AI API Keys (OpenAI, Anthropic, Google, DeepSeek)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd nutri-ai-app

# Run setup script
./scripts/setup-dev.sh

# Update environment variables
nano backend/.env

# Start development servers
npm run dev
```

### Mobile Development

```bash
# Start mobile app
cd mobile
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## 🏗️ Architecture

```
nutri-ai-app/
├── backend/          # Node.js API server
├── mobile/           # React Native app
├── web/              # React web app (optional)
├── shared/           # Shared utilities
└── scripts/          # Development scripts
```

## 🔧 Configuration

### Backend Environment (.env)

```env
# Required API Keys
OPENAI_API_KEY=sk-proj-your-key
ANTHROPIC_API_KEY=sk-ant-your-key
GOOGLE_AI_API_KEY=your-gemini-key

# Database
MONGODB_URI=mongodb://localhost:27017/nutrition-ai

# JWT Secret
JWT_SECRET=your-secret-key
```

## 📚 API Documentation

### Calculate Nutrition
```bash
POST /api/nutrition/calculate
{
  "food": "wendys daves single no mayo",
  "model": "gpt-4"
}
```

### Test Consistency
```bash
POST /api/nutrition/test-consistency
{
  "food": "apple with peanut butter",
  "model": "gpt-4",
  "runs": 5
}
```

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
# Build and deploy
npm run build
git push heroku main
```

### Mobile (App Stores)
```bash
# Build for production
eas build --platform all

# Submit to stores
eas submit
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Email: support@nutriai.app
- Discord: [Join our community]
- Docs: [Documentation site]

---

Made with ❤️ by the NutriAI team

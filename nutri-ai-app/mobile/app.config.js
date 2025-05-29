export default {
  expo: {
    name: "NutriAI",
    slug: "nutri-ai-calculator",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.nutriai.calculator",
      buildNumber: "1"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.nutriai.calculator",
      versionCode: 1,
      permissions: ["CAMERA", "INTERNET", "VIBRATE"]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-camera",
      "expo-barcode-scanner",
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#ffffff"
        }
      ]
    ],
    extra: {
      apiUrl: process.env.NODE_ENV === 'production' 
        ? 'https://your-api.herokuapp.com/api'
        : 'http://localhost:3001/api',
      eas: {
        projectId: "your-eas-project-id"
      }
    }
  }
};

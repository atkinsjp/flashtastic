#!/bin/bash

# FlashKademy Mobile Build Script

echo "🚀 Building FlashKademy for mobile platforms..."

# Step 1: Build the web app
echo "📦 Building web application..."
npm run build

# Step 2: Sync with Capacitor
echo "🔄 Syncing with Capacitor platforms..."
npx cap sync

echo "✅ Mobile build complete!"
echo ""
echo "Next steps:"
echo "• For iOS: npx cap run ios (requires Mac + Xcode)"
echo "• For Android: npx cap run android (requires Android Studio)"
echo "• For production builds: npx cap build ios/android"
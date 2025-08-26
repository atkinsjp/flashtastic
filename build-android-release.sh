#!/bin/bash
# Build script for Android release with updated package name (com.flashkademy.app)

echo "=== FlashTastic Android Release Build Script ==="
echo "Package Name: com.flashkademy.app"
echo "Version: 3.0.0.0 (code 3)"
echo ""

# Step 1: Build web assets
echo "1. Building web assets..."
npm run build

# Step 2: Sync Capacitor
echo "2. Syncing Capacitor..."
npx cap sync android

# Step 3: Verify package name in Android files
echo "3. Verifying package name configuration..."
echo "Android build.gradle shows:"
grep "applicationId\|namespace" android/app/build.gradle

echo ""
echo "Capacitor config shows:"
grep "appId" android/app/src/main/assets/capacitor.config.json

# Step 4: Build instructions
echo ""
echo "4. To build the release .aab file:"
echo "   cd android"
echo "   ./gradlew bundleRelease"
echo ""
echo "   The .aab file will be created at:"
echo "   android/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "=== Alternative: Use PWABuilder ==="
echo "1. Go to https://www.pwabuilder.com/"
echo "2. Enter your web app URL: https://flashtastic-jimatkins753.replit.app"
echo "3. Select Android package"
echo "4. Use package name: com.flashkademy.app"
echo "5. Download the generated .aab file"
echo ""
echo "This .aab file will have the correct package name for Google Play submission."
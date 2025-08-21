#!/bin/bash

# FlashTastic Mobile Build Script
# This script builds the Android app bundle for Google Play Store submission

set -e

echo "🚀 Building FlashTastic Mobile App Bundle"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Step 1: Build the web app
print_status "Building web application..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Web build failed"
    exit 1
fi

# Step 2: Sync Capacitor
print_status "Syncing Capacitor..."
npx cap sync android
if [ $? -ne 0 ]; then
    print_error "Capacitor sync failed"
    exit 1
fi

# Step 3: Create Android Studio project message
echo ""
echo "🎯 IMPORTANT: Android Bundle Creation"
echo "====================================="
echo ""
echo "Due to Android SDK licensing requirements in this environment,"
echo "you'll need to complete the build using Android Studio:"
echo ""
echo "1️⃣  Open Android Studio"
echo "2️⃣  Choose 'Open an existing Android Studio project'"
echo "3️⃣  Navigate to and select the 'android' folder in this project"
echo "4️⃣  Wait for Gradle sync to complete"
echo "5️⃣  Go to Build → Generate Signed Bundle / APK"
echo "6️⃣  Choose 'Android App Bundle'"
echo "7️⃣  Create or select your keystore"
echo "8️⃣  Build the release bundle"
echo ""
echo "📁 Your signed bundle will be created at:"
echo "   android/app/build/outputs/bundle/release/app-release.aab"
echo ""

# Step 4: Verify project structure
print_status "Verifying project structure..."

if [ -d "android/app" ]; then
    print_status "Android app directory exists"
else
    print_error "Android app directory missing"
    exit 1
fi

if [ -f "android/app/build.gradle" ]; then
    print_status "Android build.gradle exists"
else
    print_error "Android build.gradle missing"
    exit 1
fi

if [ -f "android/app/src/main/AndroidManifest.xml" ]; then
    print_status "AndroidManifest.xml exists"
else
    print_error "AndroidManifest.xml missing"
    exit 1
fi

# Step 5: Show current configuration
echo ""
echo "📋 Current Build Configuration:"
echo "================================"
echo "App ID: com.flashtastic.app"
echo "App Name: FlashTastic"
echo "Version: 1.0 (Code: 1)"
echo "AGP Version: 8.7.2"
echo "Gradle Version: 8.9"
echo "Target SDK: 35"
echo "Min SDK: 23"
echo ""

# Step 6: Check for critical files
print_status "Checking critical files..."
critical_files=(
    "android/app/src/main/AndroidManifest.xml"
    "android/app/src/main/res/values/strings.xml"
    "android/app/src/main/res/mipmap-hdpi/ic_launcher.png"
    "android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png"
    "android/app/src/main/assets/public/index.html"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "Found: $file"
    else
        print_warning "Missing: $file"
    fi
done

echo ""
print_status "Project is ready for Android Studio build!"
echo ""
echo "🔗 Additional Resources:"
echo "• Android Signing Guide: ./ANDROID-SIGNING-GUIDE.md"
echo "• Build Troubleshooting: ./FINAL-ANDROID-BUILD-SOLUTION.md"
echo "• Google Play Guide: ./GOOGLE-PLAY-DEPLOYMENT.md"
echo ""
print_status "FlashTastic build preparation complete!"
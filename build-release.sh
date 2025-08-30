#!/bin/bash

# FlashTastic Android Build Script - Version 4.0.0.0
# This script builds the release APK with device compatibility fixes

echo "🔧 Building FlashTastic v4.0.0.0 with device compatibility fixes..."

# Check if we're in the right directory
if [ ! -d "android" ]; then
    echo "❌ Error: android directory not found. Please run this from the project root."
    exit 1
fi

# Change to android directory
cd android

echo "📦 Starting Gradle build..."

# Build the release APK
./gradlew assembleRelease

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📱 Your release APK is ready at:"
    echo "   android/app/build/outputs/apk/release/app-release.apk"
    echo ""
    echo "📊 App Details:"
    echo "   • Version: 4.0.0.0"
    echo "   • Version Code: 4" 
    echo "   • Package: com.flashkademy.app"
    echo "   • Min SDK: 21 (Android 5.0+)"
    echo "   • Target SDK: 34"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Upload this APK to Google Play Console"
    echo "   2. Verify device compatibility shows many supported devices"
    echo "   3. Submit for review and publish"
    echo ""
    echo "📋 The device compatibility issue should now be resolved!"
else
    echo "❌ Build failed. Check the errors above."
    echo "💡 Common solutions:"
    echo "   • Ensure Java 17 is installed and JAVA_HOME is set"
    echo "   • Check that Android SDK is properly configured"
    echo "   • Verify gradlew has execute permissions"
    exit 1
fi
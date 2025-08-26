#!/bin/bash
# Sign AAB file with your upload key for Google Play Console

echo "=== FlashTastic AAB Signing Script ==="
echo "This will sign your .aab file with your upload key"
echo ""

# Check if jarsigner is available
if ! command -v jarsigner &> /dev/null; then
    echo "❌ jarsigner not found. Please install Java Development Kit (JDK)"
    echo "On Windows: Download from https://www.oracle.com/java/technologies/downloads/"
    echo "On Mac: brew install openjdk"
    echo "On Linux: sudo apt install openjdk-11-jdk"
    exit 1
fi

# Variables
KEYSTORE_FILE="android/app/flashtastic-keystore.jks"
KEY_ALIAS="flashtastic"
STORE_PASS="flashtastic123"
KEY_PASS="flashtastic123"

# Check if keystore exists
if [ ! -f "$KEYSTORE_FILE" ]; then
    echo "❌ Keystore file not found: $KEYSTORE_FILE"
    echo "Please ensure the keystore file is in the correct location"
    exit 1
fi

# Ask user for AAB file location
echo "📁 Please provide the path to your unsigned .aab file from PWABuilder:"
echo "   (Example: ~/Downloads/flashtastic.aab)"
read -p "AAB file path: " AAB_FILE

# Check if AAB file exists
if [ ! -f "$AAB_FILE" ]; then
    echo "❌ AAB file not found: $AAB_FILE"
    exit 1
fi

# Create signed AAB filename
SIGNED_AAB="${AAB_FILE%.*}-signed.aab"

echo ""
echo "🔐 Signing AAB file..."
echo "Input file: $AAB_FILE"
echo "Output file: $SIGNED_AAB"
echo "Using keystore: $KEYSTORE_FILE"
echo ""

# Sign the AAB file
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
    -keystore "$KEYSTORE_FILE" \
    -storepass "$STORE_PASS" \
    -keypass "$KEY_PASS" \
    -signedjar "$SIGNED_AAB" \
    "$AAB_FILE" \
    "$KEY_ALIAS"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ AAB file successfully signed!"
    echo "📦 Signed file: $SIGNED_AAB"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Upload $SIGNED_AAB to Google Play Console"
    echo "2. The package name should now be: com.flashkademy.app"
    echo "3. Google Play should accept the signed bundle"
    echo ""
    echo "The signed AAB file is ready for Google Play submission!"
else
    echo "❌ Failed to sign AAB file"
    echo "Please check your keystore credentials and try again"
    exit 1
fi
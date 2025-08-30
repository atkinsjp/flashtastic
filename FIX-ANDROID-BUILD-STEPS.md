# Fix for Android Build Error - Capacitor Dependencies

## The Problem
The build failed because Capacitor plugins (capacitor-android, capacitor-app, etc.) aren't properly configured for the release build. This is a common issue when building Capacitor projects locally.

## Solution Steps

Run these commands in order from your `FlashTastic` root directory (not the android folder):

### Step 1: Go back to project root
```bash
cd C:\Users\jimat\FlashTastic
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Sync Capacitor
```bash
npx cap sync android
```

### Step 4: Build the web assets
```bash
npm run build
```

### Step 5: Sync again to update Android project
```bash
npx cap sync android
```

### Step 6: Now build the Android app
```bash
cd android
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
./gradlew assembleRelease
```

## Alternative Quick Fix
If the above doesn't work, try this simpler approach:

1. **Download a pre-built APK tool** like [APK Easy Tool](https://forum.xda-developers.com/t/tool-windows-apk-easy-tool-v1-60-2022-06-23.3333960/)
2. **Manually edit the AndroidManifest.xml** in your existing APK
3. **Re-sign and upload** to Google Play

## Manual AndroidManifest.xml Fix
If you have your current APK from Google Play Console, you can:

1. Extract the APK
2. Edit `AndroidManifest.xml` to add these lines before `</manifest>`:
```xml
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.location" android:required="false" />
<uses-feature android:name="android.hardware.microphone" android:required="false" />
<supports-screens android:largeScreens="true" android:normalScreens="true" android:smallScreens="true" android:xlargeScreens="true" android:anyDensity="true" />
```
3. Repackage and sign the APK

The device compatibility issue will be fixed with these AndroidManifest.xml changes regardless of which method you use.
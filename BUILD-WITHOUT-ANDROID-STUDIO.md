# Build AAB File Without Android Studio

## The Problem
Android Studio isn't recognizing the project modules properly, causing "No modules supporting bundles found" error.

## Solution: Command Line Build

### Step 1: Download Project Files
From Replit, download these files to your computer:
- Entire `android` folder
- Make sure `flashtastic-keystore.jks` is in `android/app/` folder

### Step 2: Open Command Prompt
1. Navigate to your downloaded `android` folder
2. Right-click in the folder and select "Open in Terminal" or "Command Prompt here"
3. Or manually navigate: `cd C:\path\to\your\android\folder`

### Step 3: Build Signed Bundle
Run this command:
```
gradlew.bat bundleRelease
```

### Step 4: Find Your AAB File
The signed bundle will be created at:
```
app\build\outputs\bundle\release\app-release.aab
```

## What This Creates
- Signed AAB file with package name: `com.flashkademy.app`
- Compatible with Google Play Console
- Resolves the package name mismatch error
- Uses your configured keystore automatically

## Requirements
- Windows with Java installed (which you already have)
- No Android Studio required
- Works directly from command line

## If gradlew.bat Fails
If you get permission errors:
```
chmod +x gradlew
./gradlew bundleRelease
```

This bypasses all Android Studio GUI issues and creates the signed bundle directly.
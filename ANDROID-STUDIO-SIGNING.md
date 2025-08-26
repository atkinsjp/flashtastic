# Android Studio Signing Solution

Since Java command line setup is causing issues, here's the easiest way to sign your .aab file:

## Method 1: Android Studio (Recommended)

1. **Download Android Studio** (if you don't have it):
   - Go to https://developer.android.com/studio
   - Download and install Android Studio

2. **Open your project in Android Studio**:
   - Download your entire Replit project folder
   - Open Android Studio
   - Click "Open an existing Android Studio project"
   - Select the `android` folder from your downloaded project

3. **Build signed bundle**:
   - Go to **Build** → **Generate Signed Bundle / APK**
   - Select **Android App Bundle (.aab)**
   - Click **Next**
   - For keystore: Browse and select `flashtastic-keystore.jks`
   - Key store password: `flashtastic123`
   - Key alias: `flashtastic`  
   - Key password: `flashtastic123`
   - Click **Next** → **Finish**

4. **Find your signed .aab file**:
   - Location: `android/app/build/outputs/bundle/release/app-release.aab`
   - This file has package name: `com.flashkademy.app`
   - Upload this to Google Play Console

## Method 2: Alternative Java Path Fix

If you want to fix the Java issue instead:

1. **Find your Java installation**:
   - Look in: `C:\Program Files\Java\jdk-XX\bin\`
   - Or: `C:\Program Files (x86)\Java\jdk-XX\bin\`

2. **Add Java to Windows PATH**:
   - Press Windows + R, type `sysdm.cpl`
   - Click **Environment Variables**
   - Under **System Variables**, find **Path**
   - Click **Edit** → **New**
   - Add: `C:\Program Files\Java\jdk-XX\bin\` (your actual Java path)
   - Click **OK** on all dialogs
   - Restart Command Prompt

3. **Test**: Open new Command Prompt, type `java -version`

## Expected Result
Either method will create a signed .aab file with:
- Package name: `com.flashkademy.app`
- Proper signing for Google Play Console
- Resolution of the package name mismatch error

The Android Studio method is easier and more reliable.
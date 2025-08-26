# Android Studio Signing Troubleshooting

## If "Generate Signed Bundle/APK" is Missing

### Check 1: Project Structure
Make sure you opened the `android` folder, not the root project folder:
- File → Open → select the `android` folder specifically
- Wait for "Gradle sync" to complete (bottom status bar)

### Check 2: Build Menu Location
The option should be at:
- **Build** → **Generate Signed Bundle / APK...**
- If you don't see it, try: **Build** → **Build Bundle(s) / APK(s)** → **Build Bundle(s)**

### Check 3: Project View
- Make sure you're in "Android" or "Project" view (dropdown at top of file tree)
- You should see `app` module in the project structure

### Check 4: Gradle Sync
- If project seems broken, click: **File** → **Sync Project with Gradle Files**
- Wait for sync to complete

## Alternative: Manual Build Command
If GUI options still don't appear:

1. Open **Terminal** tab at bottom of Android Studio
2. Run: `./gradlew bundleRelease`
3. Find output at: `app/build/outputs/bundle/release/app-release.aab`

## Alternative: Command Line Outside Android Studio
If Android Studio isn't working:

1. Open Command Prompt in your `android` folder
2. Run: `gradlew.bat bundleRelease` (Windows)
3. Find signed .aab at: `app\build\outputs\bundle\release\app-release.aab`

## Quick Check
The signed .aab file should contain:
- Package name: `com.flashkademy.app`
- Proper signing for Google Play Console upload
- Resolution of your package name mismatch issue

Try the Gradle command first - it's often the most reliable method.
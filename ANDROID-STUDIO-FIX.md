# Fix Android Studio Build Issues

## The Issue
"Generate App Bundles or APKs" is greyed out because the project needs to be synced and built first.

## Solution Steps

### 1. Sync Project with Gradle Files
In Android Studio:
1. Look for a notification bar at the top saying "Gradle files have changed"
2. Click **"Sync Now"** 
3. OR go to **File** → **Sync Project with Gradle Files**

### 2. Build the Project First
1. **Build** → **Make Project** (or press Ctrl+F9)
2. Wait for build to complete (check bottom status bar)
3. Fix any build errors if they appear

### 3. Alternative: Clean and Rebuild
If sync doesn't work:
1. **Build** → **Clean Project**
2. Wait for cleaning to finish
3. **Build** → **Rebuild Project**
4. Wait for rebuild to complete

### 4. Check Build Variants
1. **View** → **Tool Windows** → **Build Variants**
2. Make sure "release" is selected (not "debug")

### 5. Now Generate Bundle
After successful build:
1. **Build** → **Generate Signed Bundle/APK** (should now be enabled)
2. Select **Android App Bundle**
3. Continue with keystore creation

## Common Build Errors and Fixes

### Missing SDK
If you see SDK errors:
1. **Tools** → **SDK Manager**
2. Install missing SDK versions
3. Click **Apply** and **OK**

### Gradle Issues
If Gradle fails:
1. **File** → **Invalidate Caches and Restart**
2. Select **Invalidate and Restart**

### Dependencies Issues
1. Check internet connection
2. **File** → **Sync Project with Gradle Files** again

## What Should Happen
After syncing and building:
- No red errors in the code
- Build successful message
- "Generate Signed Bundle/APK" option becomes clickable

Then you can create your signed bundle for Google Play Store!
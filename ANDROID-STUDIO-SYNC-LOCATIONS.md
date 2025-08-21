# 🔧 Android Studio Sync & Build Issues - FlashTastic

## Issue: Gradle Sync Fails / No "Generate Signed Bundle" Option

This happens when Android Studio doesn't recognize the project as a valid Android project or Gradle sync fails.

## ✅ Solution Steps

### Step 1: Ensure Proper Java Version
Android Studio needs the project to use Java 17 for AGP 8.7.2.

**Check if sync works in terminal first:**
```bash
cd android
JAVA_HOME=/nix/store/r02i2fc56p9zk2wbh7dnfq6aaq6znafm-openjdk-17.0.7+7 \
PATH=/nix/store/r02i2fc56p9zk2wbh7dnfq6aaq6znafm-openjdk-17.0.7+7/bin:$PATH \
./gradlew tasks --all | grep bundle
```

Should show bundleRelease task available.

### Step 2: Android Studio Project Opening
1. **Launch Android Studio**
2. **Open Existing Project** (NOT "Import Project")
3. **Navigate** to your FlashTastic project directory
4. **Select the `android` folder** specifically (very important!)
5. **Click "Open"**

### Step 3: Force Gradle Sync
Once project opens:
1. **File** → **Sync Project with Gradle Files**
2. Wait for sync to complete (may take several minutes)
3. Check the "Build" tab at bottom for any errors

### Step 4: Verify Project Recognition
After successful sync, you should see:
- **Project structure** shows "app" module in project panel
- **Build** menu shows "Generate Signed Bundle / APK" option
- **Gradle** panel (right side) shows available tasks including "bundleRelease"

## 🔍 Troubleshooting Specific Issues

### Issue: "Generate Signed Bundle" Not Available
**Cause**: Android Studio doesn't recognize this as an Android app project
**Solution**: 
1. Close project
2. Delete `.idea` folder in android directory
3. Reopen project in Android Studio
4. Let it reimport and sync completely

### Issue: Gradle Sync Keeps Failing  
**Cause**: Java version mismatch or Gradle daemon issues
**Solution**:
```bash
cd android
./gradlew --stop
rm -rf .gradle
# Then reopen in Android Studio
```

### Issue: "Module not specified" Error
**Cause**: Android Studio opened wrong directory
**Solution**: Make sure you opened the `android` folder, not the root project folder

### Issue: Java Version Problems in Android Studio
**Solution**:
1. **File** → **Project Structure** → **SDK Location**
2. **Gradle Settings**: Use Gradle wrapper
3. **JDK Location**: Use Android Studio's embedded JDK (recommended)

## 📁 Verify File Structure
Your android folder should contain:
```
android/
├── app/
│   ├── build.gradle
│   └── src/main/AndroidManifest.xml
├── build.gradle
├── settings.gradle
├── gradle.properties
└── gradlew
```

## 🎯 Alternative: Command Line Build
If Android Studio sync continues to fail, you can build directly:

```bash
cd android

# Set Java 17 environment
export JAVA_HOME=/nix/store/r02i2fc56p9zk2wbh7dnfq6aaq6znafm-openjdk-17.0.7+7
export PATH=$JAVA_HOME/bin:$PATH

# Clean and build
./gradlew clean
./gradlew bundleRelease
```

**Note**: This will fail due to SDK licensing in Replit, but verifies the Gradle configuration is correct.

## 🔧 Android Studio Settings for Success

### Gradle Settings:
- **Use Gradle wrapper**: ✅ Checked
- **Gradle JVM**: Use Project JDK or Android Studio JDK

### JDK Settings:
- **Project JDK**: Android Studio default JDK (17+)
- **Gradle JVM**: Same as project JDK

### Build Tools:
- Let Android Studio download missing SDK components automatically
- Accept all license agreements when prompted

## ✅ Success Indicators

When everything works correctly:
1. **Project sync** completes without errors
2. **Build menu** shows "Generate Signed Bundle / APK"
3. **Gradle tasks** panel shows bundleRelease task
4. **Run configurations** dropdown shows "app" as available

Your FlashTastic project will then build successfully to create the signed bundle for Google Play Store.
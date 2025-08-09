# Android App Bundle Signing Guide for FlashTastic

## Step-by-Step Process

### 1. Open Android Studio
```bash
npx cap open android
```
This opens your FlashTastic project in Android Studio.

### 2. Generate Keystore (First Time Only)

#### Option A: Through Android Studio (Recommended)
1. In Android Studio: **Build** → **Generate Signed Bundle/APK**
2. Select **Android App Bundle** (not APK)
3. Click **Next**
4. Click **Create new...** (for keystore)
5. Fill out keystore details:
   - **Key store path**: Choose location (e.g., `/home/flashtastic-keystore.jks`)
   - **Password**: Create strong password (SAVE THIS!)
   - **Key alias**: `flashtastic-key`
   - **Key password**: Same as keystore password
   - **Validity**: 25 years (default)
   
6. Certificate information:
   - **First and Last Name**: Your name
   - **Organizational Unit**: FlashTastic
   - **Organization**: Your company name
   - **City**: Your city
   - **State**: Your state
   - **Country Code**: US (or your country)

#### Option B: Command Line
```bash
keytool -genkey -v -keystore flashtastic-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias flashtastic-key
```

### 3. Sign the Bundle

1. After creating keystore, Android Studio returns to signing dialog
2. Verify paths are correct:
   - **Key store path**: Your keystore location
   - **Key store password**: Enter your password
   - **Key alias**: flashtastic-key
   - **Key password**: Enter key password

3. Select build variant: **release**
4. Check **V1 (Jar Signature)** and **V2 (Full APK Signature)**
5. Click **Finish**

### 4. Locate Your Signed Bundle

Android Studio will generate the signed bundle at:
```
android/app/release/app-release.aab
```

### 5. Verify Bundle (Optional)
```bash
# Check bundle contents
bundletool build-apks --bundle=app-release.aab --output=app.apks --ks=flashtastic-keystore.jks --ks-key-alias=flashtastic-key
```

## CRITICAL: Keystore Security

### ⚠️ NEVER LOSE YOUR KEYSTORE
- **Backup your keystore file** and passwords securely
- Store in multiple secure locations (cloud storage, external drive)
- If you lose it, you can NEVER update your app on Google Play
- You would need to publish as a completely new app

### Recommended Storage:
1. **Password Manager**: Store passwords in LastPass/1Password
2. **Cloud Backup**: Upload keystore to Google Drive/Dropbox
3. **Local Backup**: Copy to external drive
4. **Team Access**: Share with trusted team members

## Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console/)
2. Create new app or select existing
3. Navigate to **Release** → **Production**
4. Click **Create new release**
5. Upload your `app-release.aab` file
6. Fill out release notes
7. Review and submit for approval

## Troubleshooting

### Build Errors
If you get build errors:
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew build
```

### Keystore Issues
- Double-check passwords (case-sensitive)
- Ensure keystore path is correct
- Verify alias name matches

### Bundle Size
Your bundle should be under 150MB for Google Play. FlashTastic is optimized and should be ~10-30MB.

## Next Steps After Upload

1. **Review process**: 1-3 days typically
2. **Testing**: Google Play will test on various devices
3. **Release**: Manual release or scheduled rollout
4. **Updates**: Always use the same keystore for future updates

Your FlashTastic app is now ready for professional distribution on Google Play Store!
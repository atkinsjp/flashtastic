# Fix Capacitor Build Issues & Sign FlashTastic Bundle

## The Problem
Capacitor plugins (capacitor-android, capacitor-app, etc.) are missing when you download from Replit. They need to be regenerated.

## Solution: Rebuild Capacitor Android Project

### Step 1: Close Android Studio
Close Android Studio completely.

### Step 2: Open PowerShell/Command Prompt
Navigate to your main project folder:
```powershell
cd "C:\Users\James\FlashTastic\FlashTastic"
```

### Step 3: Install Dependencies
```powershell
npm install
```

### Step 4: Rebuild Capacitor Android
```powershell
npx cap sync android
```

This regenerates all the Capacitor plugins that were missing.

### Step 5: Open Android Studio Again
```powershell
npx cap open android
```

OR manually open Android Studio and open the `android` folder.

### Step 6: Build Project
In Android Studio:
1. Wait for Gradle sync to complete
2. **Build** → **Make Project** (Ctrl+F9)
3. Should now build successfully

### Step 7: Generate Signed Bundle
1. **Build** → **Generate Signed Bundle/APK**
2. Select **Android App Bundle**
3. Click **Next**
4. Click **Create new...** for keystore:
   - **Key store path**: `C:\Users\James\flashtastic-keystore.jks`
   - **Password**: [Create strong password - write it down!]
   - **Key alias**: `flashtastic-key`
   - **Certificate**: Your name, FlashTastic, your city, country
5. Click **OK** → **Next**
6. Select **release** build variant
7. Click **Finish**

### Step 8: Find Your Bundle
Your signed bundle will be at:
```
C:\Users\James\FlashTastic\FlashTastic\android\app\release\app-release.aab
```

## Upload to Google Play Store
1. Go to [Google Play Console](https://play.google.com/console/)
2. Create new app: **FlashTastic**
3. Upload your `app-release.aab` file
4. Complete store listing
5. Submit for review

Your FlashTastic app will be live within 1-3 days!
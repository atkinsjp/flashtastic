# Where to Find Sync in Android Studio (New Interface)

## Method 1: Gradle Panel (Most Common)
1. Look for the **Gradle** tab on the right side of Android Studio
2. Click the **Gradle** panel to expand it
3. Click the **refresh/sync icon** (🔄) at the top of the Gradle panel

## Method 2: Notification Bar
1. Look for a **yellow notification bar** at the top that says:
   - "Gradle files have changed since last project sync"
   - "Gradle project sync needed"
2. Click **"Sync Now"** button in that notification

## Method 3: Toolbar Icons
1. Look at the **toolbar** (top of Android Studio)
2. Find the **"Sync Project with Gradle Files"** icon (🔄)
3. It looks like two arrows in a circle

## Method 4: Build Menu Alternative
1. **Build** → **Clean Project**
2. Then **Build** → **Rebuild Project**
3. This forces a sync and build

## Method 5: Elephant Icon
1. Look for a **blue elephant icon** (Gradle logo) in the toolbar
2. Click it to sync Gradle files

## What You're Looking For
After clicking any sync option, you should see:
- **"Gradle sync in progress"** message
- Progress bar at the bottom
- Eventually: **"Gradle sync finished"** 

## Once Sync is Complete
1. **Build** → **Make Project** (Ctrl+F9)
2. Wait for **"BUILD SUCCESSFUL"**
3. **Build** → **Generate Signed Bundle/APK** (should now work)

The sync is essential - it downloads dependencies and prepares your FlashTastic project for building.
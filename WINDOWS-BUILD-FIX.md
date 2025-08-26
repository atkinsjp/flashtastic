# Windows Command Line Build Fix

## The Issue
PowerShell can't find gradlew.bat because you're not in the right directory or using the wrong command format.

## Solution Steps

### Step 1: Navigate to Android Folder
In Command Prompt or PowerShell, navigate to your android folder:
```
cd "C:\path\to\your\downloaded\android\folder"
```

### Step 2: Verify gradlew.bat Exists
Check if the file is there:
```
dir gradlew.bat
```
You should see the file listed.

### Step 3: Run Build Command
Use one of these formats:

**For Command Prompt:**
```
gradlew.bat bundleRelease
```

**For PowerShell:**
```
.\gradlew.bat bundleRelease
```

**Alternative PowerShell format:**
```
& ".\gradlew.bat" bundleRelease
```

### Step 4: If gradlew.bat is Missing
If gradlew.bat doesn't exist, download the complete android folder from Replit again, making sure to get all files including:
- gradlew.bat (Windows batch file)
- gradlew (Unix script)
- gradle/wrapper/ folder

## Expected Output Location
After successful build:
```
app\build\outputs\bundle\release\app-release.aab
```

## Quick Test
Try this command to check your current directory:
```
pwd
```
Make sure you're inside the android folder that contains gradlew.bat
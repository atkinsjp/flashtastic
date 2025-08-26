# Quick Java Path Fix for Windows

## The Problem
Java JDK is installed but Windows can't find it in the command line.

## Quick Solution

### Step 1: Find Java Installation
Open File Explorer and look for Java in these locations:
- `C:\Program Files\Java\`
- `C:\Program Files (x86)\Java\`
- Look for folders like `jdk-17`, `jdk-11`, etc.

### Step 2: Add to Windows PATH
1. Press **Windows Key + R**
2. Type `sysdm.cpl` and press Enter
3. Click **Environment Variables** button
4. Under **System Variables**, find **Path** and click **Edit**
5. Click **New**
6. Add your Java path + `\bin`, example: `C:\Program Files\Java\jdk-17\bin`
7. Click **OK** on all windows

### Step 3: Restart Command Prompt
1. Close any open Command Prompt windows
2. Open a new Command Prompt
3. Test by typing: `java -version`
4. If it shows Java version, run your .bat file again

## Alternative: Use Android Studio Instead
If this is too complicated, download Android Studio and use the GUI method I described in ANDROID-STUDIO-SIGNING.md - it's much simpler and doesn't require command line setup.
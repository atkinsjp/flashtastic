@echo off
echo === FlashTastic AAB Signing for Windows ===
echo This will sign your .aab file with your upload key
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java not found. Please install Java JDK from:
    echo https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

REM Set variables
set KEYSTORE_FILE=flashtastic-keystore.jks
set KEY_ALIAS=flashtastic
set STORE_PASS=flashtastic123
set KEY_PASS=flashtastic123

REM Check if keystore exists
if not exist "%KEYSTORE_FILE%" (
    echo ERROR: Keystore file not found: %KEYSTORE_FILE%
    echo Please place flashtastic-keystore.jks in the same folder as this script
    pause
    exit /b 1
)

echo Please drag and drop your unsigned .aab file here and press Enter:
set /p AAB_FILE=

REM Remove quotes if they were added
set AAB_FILE=%AAB_FILE:"=%

REM Check if AAB file exists
if not exist "%AAB_FILE%" (
    echo ERROR: AAB file not found: %AAB_FILE%
    pause
    exit /b 1
)

REM Create signed AAB filename
for %%F in ("%AAB_FILE%") do set SIGNED_AAB=%%~dpnF-signed%%~xF

echo.
echo Signing AAB file...
echo Input file: %AAB_FILE%
echo Output file: %SIGNED_AAB%
echo Using keystore: %KEYSTORE_FILE%
echo.

REM Sign the AAB file
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore "%KEYSTORE_FILE%" -storepass "%STORE_PASS%" -keypass "%KEY_PASS%" -signedjar "%SIGNED_AAB%" "%AAB_FILE%" "%KEY_ALIAS%"

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS: AAB file successfully signed!
    echo Signed file: %SIGNED_AAB%
    echo.
    echo Next steps:
    echo 1. Upload %SIGNED_AAB% to Google Play Console
    echo 2. The package name should now be: com.flashkademy.app
    echo 3. Google Play should accept the signed bundle
    echo.
    echo The signed AAB file is ready for Google Play submission!
) else (
    echo ERROR: Failed to sign AAB file
    echo Please check your keystore credentials and try again
)

pause
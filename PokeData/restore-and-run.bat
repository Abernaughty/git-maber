@echo off
echo Pokemon Data App - Restore and Run Script
echo =======================================
echo.

echo Phase 1: Fix Git Merge Conflicts
echo ------------------------------
echo Fixing merge conflicts in batch files...

REM Fix dev.bat
echo @echo off > dev.bat
echo cd %%~dp0 >> dev.bat
echo echo Starting development server... >> dev.bat
echo pnpm dev >> dev.bat

REM Fix start.bat
echo @echo off > start.bat
echo cd %%~dp0 >> start.bat
echo pnpm start >> start.bat

REM Fix build.bat
echo @echo off > build.bat
echo cd %%~dp0 >> build.bat
echo pnpm build >> build.bat

echo Merge conflicts fixed.
echo.

echo Phase 2: Checking Node.js environment
echo ----------------------------------
where node >nul 2>&1
if %errorlevel% equ 0 (
  echo Node.js found in PATH.
  for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
  echo Node version: %NODE_VERSION%
) else (
  echo Node.js not found in PATH.
  echo.
  echo Checking common Node.js installation locations...
  
  set NODE_FOUND=0
  
  if exist "C:\Program Files\nodejs\node.exe" (
    echo Found Node.js at C:\Program Files\nodejs
    set NODE_PATH=C:\Program Files\nodejs
    set NODE_FOUND=1
  )
  
  if exist "C:\Program Files (x86)\nodejs\node.exe" (
    echo Found Node.js at C:\Program Files (x86)\nodejs
    set NODE_PATH=C:\Program Files (x86)\nodejs
    set NODE_FOUND=1
  )
  
  if exist "%APPDATA%\nvm\*\node.exe" (
    for /d %%i in ("%APPDATA%\nvm\*") do (
      if exist "%%i\node.exe" (
        echo Found Node.js in NVM directory: %%i
        set NODE_PATH=%%i
        set NODE_FOUND=1
        goto :node_found
      )
    )
  )
  
  :node_found
  if %NODE_FOUND% equ 0 (
    echo Node.js not found in common locations.
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
  )
  
  echo Setting up Node.js temporarily from %NODE_PATH%...
  set PATH=%NODE_PATH%;%PATH%
  echo Path updated temporarily.
)

echo.
echo Phase 3: Checking pnpm installation
echo --------------------------------
where pnpm >nul 2>&1
if %errorlevel% equ 0 (
  echo pnpm found in PATH.
  for /f "tokens=*" %%i in ('pnpm -v') do set PNPM_VERSION=%%i
  echo pnpm version: %PNPM_VERSION%
) else (
  echo pnpm not found in PATH.
  echo Trying to install pnpm using npm...
  
  where npm >nul 2>&1
  if %errorlevel% equ 0 (
    echo Installing pnpm globally...
    npm install -g pnpm
    if %errorlevel% equ 0 (
      echo pnpm installed successfully.
    ) else (
      echo Failed to install pnpm.
      echo.
      echo Will try to use npx as a fallback.
    )
  ) else (
    echo npm not found. Will try to use npx as a fallback.
  )
)

echo.
echo Phase 4: Running the application
echo -----------------------------

REM Try different methods to run the app
echo Method 1: Using pnpm directly...
pnpm dev >nul 2>&1
if %errorlevel% equ 0 (
  echo Application started successfully with pnpm.
  exit /b 0
)

echo Method 1 failed. Trying Method 2: Using npx...
npx pnpm dev >nul 2>&1
if %errorlevel% equ 0 (
  echo Application started successfully with npx.
  exit /b 0
)

echo Method 2 failed. Trying Method 3: Using direct path execution...
if defined NODE_PATH (
  echo Using node from %NODE_PATH%
  "%NODE_PATH%\npx" pnpm dev >nul 2>&1
  if %errorlevel% equ 0 (
    echo Application started successfully with direct path.
    exit /b 0
  )
)

echo Method 3 failed. Trying Method 4: Reinstalling dependencies...
if exist node_modules (
  echo Backing up node_modules folder...
  mkdir node_modules_backup 2>nul
  xcopy /E /I /Y node_modules node_modules_backup >nul
  echo Removing node_modules folder...
  rmdir /S /Q node_modules
)

echo Installing dependencies...
npm install
if %errorlevel% equ 0 (
  echo Dependencies installed. Trying to run again...
  npm run dev
  exit /b 0
)

echo.
echo All methods failed. Here's a final diagnostic report:

echo.
echo NODE_PATH: %NODE_PATH%
echo PATH: %PATH%
where node 2>nul && node -v
where npm 2>nul && npm -v
where pnpm 2>nul && pnpm -v
where npx 2>nul && npx -v

echo.
echo Please try the following manual steps:
echo 1. Restart your computer to refresh environment variables
echo 2. Check that Node.js is properly installed and in your PATH
echo 3. Run "npm install -g pnpm" to install pnpm globally
echo 4. In your project folder, run "pnpm install" followed by "pnpm dev"

pause

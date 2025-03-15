@echo off
echo Copying PokeData project files to your GitHub repository...

set SOURCE=C:\Users\Abernaughty\Documents\PokeData\pokedata-project
set DEST=C:\Users\Abernaughty\Documents\GitHub\git-maber\PokeData

REM Create target directory if it doesn't exist
if not exist "%DEST%" mkdir "%DEST%"

REM Copy all files except node_modules and other excluded directories
xcopy "%SOURCE%\src" "%DEST%\src\" /E /I /H /Y
xcopy "%SOURCE%\public" "%DEST%\public\" /E /I /H /Y
copy "%SOURCE%\package.json" "%DEST%\"
copy "%SOURCE%\package-lock.json" "%DEST%\"
copy "%SOURCE%\rollup.config.js" "%DEST%\"
copy "%SOURCE%\.gitignore" "%DEST%\"
copy "%SOURCE%\.env.example" "%DEST%\"
copy "%SOURCE%\README.md" "%DEST%\"

echo Files copied successfully.
echo.
echo Next steps:
echo 1. Navigate to your GitHub repository folder:
echo    cd C:\Users\Abernaughty\Documents\GitHub\git-maber
echo.
echo 2. Check the status of files:
echo    git status
echo.
echo 3. Add the new files:
echo    git add PokeData
echo.
echo 4. Commit the changes:
echo    git commit -m "Add PokeData project"
echo.
echo 5. Push to GitHub:
echo    git push
echo.
pause

@echo off
echo Adding PokeData project to your Git repository...

REM Change to the GitHub repository directory
cd C:\Users\Abernaughty\Documents\GitHub\git-maber

REM Check Git status before changes
echo Current Git status:
git status
echo.
echo Press any key to continue...
pause > nul

REM Add all PokeData files
git add PokeData

REM Commit the changes
git commit -m "Add PokeData project - Pokémon Card Price Checker"

REM Push to GitHub
git push

echo.
echo Process completed. Check GitHub to verify the changes.
echo.
pause

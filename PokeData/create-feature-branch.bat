@echo off
set /p BRANCH="Enter feature branch name (no spaces): "
echo.
echo Creating new feature branch: %BRANCH%
git checkout -b %BRANCH%
echo.
echo You are now working on branch: %BRANCH%
echo When ready to checkpoint this branch, use create-checkpoint.bat
echo To return to main branch, use: git checkout master
pause
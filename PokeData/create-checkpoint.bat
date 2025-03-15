@echo off
set /p MSG="Enter checkpoint description: "
git add .
git commit -m "Checkpoint: %MSG%"
echo.
echo Checkpoint created with description: %MSG%
echo To revert to this checkpoint, use: git checkout %RANDOM%%RANDOM%
echo (Note: The actual commit hash will be different. Use 'git log' to see the commit hash)
echo.
echo Recent checkpoints:
git log --pretty=format:"%%h - %%s" -n 5
pause
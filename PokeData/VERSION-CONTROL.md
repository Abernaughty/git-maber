# Version Control Instructions

This project uses Git for version control. The following batch scripts are available to help manage versions:

## Initial Setup
- `init-git.bat` - Initialize the Git repository and create the first checkpoint

## Creating Checkpoints
- `create-checkpoint.bat` - Create a new checkpoint with a description

## Managing Features
- `create-feature-branch.bat` - Create a new branch for a feature
- When working on a feature, use `create-checkpoint.bat` to save progress

## Rolling Back
- `rollback.bat` - Roll back to a previous checkpoint
- After testing, return to the latest version with `git checkout master`

## Common Git Commands
- `git log` - View commit history
- `git status` - See current changes
- `git checkout [commit-hash]` - Return to a specific checkpoint
- `git checkout master` - Return to the latest version
- `git branch` - List all branches
- `git checkout [branch-name]` - Switch to a branch

## Workflow Recommendations
1. Before making significant changes, create a checkpoint
2. For major features, create a feature branch
3. Test thoroughly after each checkpoint
4. If something breaks, use rollback.bat to return to a working version

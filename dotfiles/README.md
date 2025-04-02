# Dotfiles

This directory contains configuration files and system setup resources for personalizing and customizing your development environment.

## Contents

- **bashrc/** - Configuration files for Bash shell
- **drivers.txt** - List of required drivers and installation instructions
- **keys.txt** - SSH and API keys information

## Usage

These dotfiles can be used to quickly set up a new development environment with your preferred configurations and tools.

### Bash Configuration

The `bashrc` directory contains configurations for the Bash shell, including:

- Custom prompt settings
- Useful aliases and functions
- Environment variables

To use these configurations:

1. Navigate to the bashrc directory
2. Copy or symlink the desired files to your home directory
3. Source the files in your `.bashrc` or `.bash_profile`

Example:
```bash
# Copy specific config file
cp bashrc/aliases.sh ~/.bash_aliases

# Add to your .bashrc
echo "source ~/.bash_aliases" >> ~/.bashrc

# Reload bash configuration
source ~/.bashrc
```

### Drivers List

The `drivers.txt` file contains a list of drivers needed for various hardware components, along with download links and installation instructions.

### Keys Management

The `keys.txt` file contains information about SSH and API keys, including:

- Key generation instructions
- Key locations
- Services associated with each key

**Note:** This file does not contain the actual keys, only information about them.

## Adding New Configurations

When adding new dotfiles:

1. Create a meaningful name for your file
2. Add clear comments explaining what the configuration does
3. Update this README with details about the new file

## Related Resources

- [GitHub does dotfiles](https://dotfiles.github.io/)
- [Awesome dotfiles](https://github.com/webpro/awesome-dotfiles)

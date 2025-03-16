# Pokémon Card Price Checker

A web application for looking up Pokémon card pricing data based on set name and card name.

## Features

- Search for cards by set name and card name
- View detailed pricing information from various sources
- Support for multiple card variants
- Offline caching for improved performance
- Responsive design

## Installation

This project uses pnpm for package management.

1. Clone the repository:
   ```bash
   git clone https://github.com/git-maber/PokeData.git
   cd PokeData
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Development

Start the development server:

```bash
pnpm dev
```

Or use the included batch file:

```bash
dev.bat
```

The app will be available at http://localhost:3000 with hot reloading enabled.

## Production Build

Build for production:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm clean` - Clean installation files
- `pnpm prod-install` - Install production dependencies only

## Project Structure

- `src/` - Source code
  - `components/` - UI components
  - `data/` - Static data and configuration
  - `services/` - API and data services
- `public/` - Static assets
  - `build/` - Compiled code (generated)
  - `images/` - Images
  - `mock/` - Mock data for development

## License

Private
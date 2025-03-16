# Pokémon Card Price Checker

A Svelte application for checking Pokémon card prices across various marketplaces.

## Features

- Search for Pokémon cards by name and set
- Filter card sets using search functionality
- View current market prices from various sources
- Responsive design works on desktop and mobile devices
- Multiple card variant selection for same-named cards
- IndexedDB caching to reduce API calls

## Getting Started

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`

## API Integration

This application uses the PokeDATA API to fetch card information and pricing data. The API requires:
- A valid API key (JWT token)
- A subscription key

For development purposes, mock data is provided when the API is unavailable.

## Caching Strategy

The application uses IndexedDB to cache:
- The complete set list (permanently)
- Cards for each set (loaded on demand, stored permanently)

Only pricing data is fetched fresh from the API, as prices change regularly.

## Development Notes

- CORS issues may occur when connecting to the API directly from the browser
- Mock data is available in `public/mock/` for local development
- In a production environment, consider implementing server-side API calls

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
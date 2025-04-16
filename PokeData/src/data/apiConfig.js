// Environment indicator
export const ENVIRONMENT = process.env.NODE_ENV || 'development';

// Check for missing credentials and log warnings
const checkCredentials = () => {
  if (!process.env.API_KEY) {
    console.warn('API_KEY not found in environment variables. API authentication may fail.');
  }
  
  if (!process.env.API_SUBSCRIPTION_KEY) {
    console.warn('API_SUBSCRIPTION_KEY not found in environment variables. API calls may fail.');
  }
  
  if (ENVIRONMENT === 'production' && (!process.env.API_KEY || !process.env.API_SUBSCRIPTION_KEY)) {
    console.error('Missing API credentials in production environment!');
  }
};

// Run credential check
checkCredentials();

// API Configuration
export const API_CONFIG = {
  // Base URL for the API
  baseUrl: process.env.API_BASE_URL || 'https://maber-apim-test.azure-api.net/pokedata-api/v0',
  
  // API key for authentication
  apiKey: process.env.API_KEY || '',
  
  // Subscription key for API Management
  subscriptionKey: process.env.API_SUBSCRIPTION_KEY || '',
  
  // Current environment
  environment: ENVIRONMENT,
  
  // Endpoints
  endpoints: {
    pricing: '/pricing', // Get Info and Pricing for Card or Product
    sets: '/sets',      // List All Sets 
    set: '/set'         // List Cards in Set
  },
  
  // Headers function to get standard headers
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      'Content-Type': 'application/json'
    };
  },
  
  // URL builder functions
  buildPricingUrl(id) {
    return `${this.baseUrl}${this.endpoints.pricing}?id=${encodeURIComponent(id)}&asset_type=CARD`;
  },
  
  buildSetsUrl() {
    return `${this.baseUrl}${this.endpoints.sets}`;
  },
  
  buildCardsForSetUrl(setId) {
    return `${this.baseUrl}${this.endpoints.set}?set_id=${encodeURIComponent(setId)}`;
  }
};

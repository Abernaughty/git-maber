import { fetchWithProxy } from '../corsProxy';
import { API_CONFIG } from '../data/apiConfig';
import { dbService } from './storage/db';

/**
 * Helper function to sort sets by release date in descending order
 * @param {Array} sets - Array of set objects
 * @returns {Array} - Sorted array of sets
 */
function sortSetsByReleaseDate(sets) {
  return sets.sort((a, b) => {
    // Compare release dates in descending order (newest first)
    const dateA = new Date(a.release_date || 0);
    const dateB = new Date(b.release_date || 0);
    return dateB - dateA;
  });
}

/**
 * Helper function to ensure all sets have unique IDs
 * @param {Array} sets - Array of set objects
 * @returns {Array} - Array of sets with guaranteed IDs
 */
function ensureSetsHaveIds(sets) {
  if (!sets || !Array.isArray(sets)) return [];
  
  let highestId = 0;
  
  // Find the highest existing ID
  sets.forEach(set => {
    if (set.id && typeof set.id === 'number' && set.id > highestId) {
      highestId = set.id;
    }
  });
  
  // Ensure all sets have an ID
  return sets.map(set => {
    // If the set already has an ID, return it unchanged
    if (set.id) return set;
    
    // Otherwise, assign a new unique ID
    highestId += 1;
    return { ...set, id: highestId };
  });
}

/**
 * Service for Pokémon data operations
 */
export const pokeDataService = {
  /**
   * Get the list of all Pokémon card sets
   * @returns {Promise<Array>} Array of set objects
   */
  async getSetList() {
    try {
      // First try to get from cache
      const cachedSets = await dbService.getSetList();
      if (cachedSets && cachedSets.length > 0) {
        console.log('Using cached sets data');
        return sortSetsByReleaseDate(ensureSetsHaveIds(cachedSets));
      }
      
      // If not in cache, fetch from API
      const url = API_CONFIG.buildSetsUrl();
      const response = await fetchWithProxy(url, {
        headers: API_CONFIG.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure all sets have IDs
      const processedData = ensureSetsHaveIds(data);
      console.log(`Processed ${processedData.length} sets with IDs`);
      
      // Cache the results
      if (processedData && Array.isArray(processedData)) {
        await dbService.saveSetList(processedData);
      }
      
      return sortSetsByReleaseDate(processedData);
    } catch (error) {
      console.error('Error fetching sets:', error);
      // Return the fallback list which already has IDs
      console.log('Using hard-coded fallback set list due to API error');
      const { setList } = await import('../data/setList');
      return sortSetsByReleaseDate(setList);
    }
  },
  
  /**
   * Get cards for a specific set
   * @param {string} setCode - The set code
   * @param {string} setId - The set ID (required)
   * @returns {Promise<Array>} Array of card objects
   */
  async getCardsForSet(setCode, setId) {
    try {
      if (!setId) {
        console.error('Set ID is required to fetch cards');
        return [];
      }
      
      // Log any potential issues with set code
      if (!setCode) {
        console.warn('Set code is null or undefined, using fallback key for cache');
      }
      
      // Try to get from cache first
      const cachedCards = await dbService.getCardsForSet(setCode);
      if (cachedCards && cachedCards.length > 0) {
        console.log(`Using cached cards for set ${setCode}: ${cachedCards.length} cards`);
        return cachedCards;
      }
      
      console.log(`Fetching cards for set ${setCode} (ID: ${setId}) from API...`);
      
      // If not in cache, fetch from API using set_id
      const url = API_CONFIG.buildCardsForSetUrl(setId);
      console.log(`API URL for cards: ${url}`);
      
      const response = await fetchWithProxy(url, {
        headers: API_CONFIG.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API response for set ${setCode}:`, data);
      
      // Process the cards data
      let cards = [];
      
      // Determine the format of the response
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          console.log(`Response is a direct array with ${data.length} items`);
          cards = data;
        } else if (data.results && Array.isArray(data.results)) {
          console.log(`Response has a results array with ${data.results.length} items`);
          cards = data.results;
        } else if (data.cards && Array.isArray(data.cards)) {
          console.log(`Response has a cards array with ${data.cards.length} items`);
          cards = data.cards;
        } else {
          console.warn(`Unexpected data format - no recognized array structure:`, data);
          // Try to extract cards from any array property
          for (const key in data) {
            if (Array.isArray(data[key]) && data[key].length > 0 && data[key][0].name) {
              console.log(`Found potential cards array in property '${key}' with ${data[key].length} items`);
              cards = data[key];
              break;
            }
          }
        }
      } else {
        console.warn(`Unexpected response type: ${typeof data}`);
      }
      
      // Log the number of cards found
      console.log(`Found ${cards.length} cards for set ${setCode}`);
      
      // Cache the results if we have cards
      if (cards.length > 0) {
        await dbService.saveCardsForSet(setCode, cards);
      }
      
      return cards;
    } catch (error) {
      console.error(`Error fetching cards for set ${setCode}:`, error);
      return [];
    }
  },
  
  /**
   * Get pricing data for a specific card
   * @param {string} cardId - The card ID
   * @returns {Promise<Object>} Card pricing data
   */
  async getCardPricing(cardId) {
    try {
      // Try to get from cache first
      const cachedPricing = await dbService.getCardPricing(cardId);
      if (cachedPricing) {
        console.log(`Using cached pricing for card ${cardId}`);
        return cachedPricing;
      }
      
      // If not in cache, fetch from API
      const url = API_CONFIG.buildPricingUrl(cardId);
      const response = await fetchWithProxy(url, {
        headers: API_CONFIG.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the results
      if (data) {
        await dbService.storeCardPricing(cardId, data);
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching pricing for card ${cardId}:`, error);
      throw error;
    }
  },
  
  /**
   * Load mock data for testing when API is unavailable
   * @param {string} setName - The set name
   * @param {string} cardName - The card name
   * @returns {Promise<Object>} Mock card pricing data
   */
  async loadMockData(setName, cardName) {
    try {
      const response = await fetch('./mock/pricing-response.json');
      const mockData = await response.json();
      
      // Customize the mock data
      mockData.name = cardName || 'Charizard';
      mockData.set_name = setName || 'Base Set';
      
      return mockData;
    } catch (error) {
      console.error('Error loading mock data:', error);
      
      // Return minimal mock data if JSON file fails to load
      return {
        id: 'mock-id',
        name: cardName || 'Charizard',
        set_name: setName || 'Base Set',
        num: '4/102',
        rarity: 'Rare Holo',
        pricing: {
          'market': { value: 299.99, currency: 'USD' },
          'tcgplayer': { value: 305.42, currency: 'USD' }
        }
      };
    }
  }
};
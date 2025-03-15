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
    // If both have release dates, sort by date
    if (a.release_date && b.release_date) {
      return new Date(b.release_date) - new Date(a.release_date);
    }
    
    // If only one has a release date, prioritize the one with a date
    if (a.release_date && !b.release_date) return -1;
    if (!a.release_date && b.release_date) return 1;
    
    // If neither has a release date, sort by name
    return a.name.localeCompare(b.name);
  });
}

/**
 * Service for interacting with the PokeData API
 */
export const pokeDataService = {
  /**
   * Get the set list from the cache or API
   * @param {boolean} forceRefresh - Whether to bypass cache and force a refresh
   * @returns {Promise<Array>} - Array of sets
   */
  async getSetList(forceRefresh = false) {
    try {
      // Try to get from cache first, unless forceRefresh is true
      if (!forceRefresh) {
        const cachedSetList = await dbService.getSetList();
        
        if (cachedSetList) {
          console.log('Using cached set list');
          // Sort sets by release date even if from cache
          return sortSetsByReleaseDate(cachedSetList);
        }
      } else {
        console.log('Bypassing cache and forcing refresh of set list');
      }
      
      // If not in cache, fetch from API
      console.log('Set list not in cache, fetching from API...');
      const url = API_CONFIG.buildSetsUrl();
      
      console.log(`Fetching set list from: ${url}`);
      const response = await fetchWithProxy(url, {
        headers: API_CONFIG.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch set list: ${response.status}`);
      }
      
      // Parse the response
      const setsData = await response.json();
      let sets = [];
      
      if (Array.isArray(setsData)) {
        sets = setsData;
        console.log(`API returned ${sets.length} sets directly as array`);
      } else if (setsData && setsData.data && Array.isArray(setsData.data)) {
        sets = setsData.data;
        console.log(`API returned ${sets.length} sets in data field`);
      } else {
        console.warn('Unexpected API response format for sets:', setsData);
        throw new Error('Invalid API response format for sets');
      }
      
      // Sort sets by release date in descending order (most recent first)
      sets.sort((a, b) => {
        // If both have release dates, sort by date
        if (a.release_date && b.release_date) {
          return new Date(b.release_date) - new Date(a.release_date);
        }
        
        // If only one has a release date, prioritize the one with a date
        if (a.release_date && !b.release_date) return -1;
        if (!a.release_date && b.release_date) return 1;
        
        // If neither has a release date, sort by name
        return a.name.localeCompare(b.name);
      });
      
      console.log('Sets sorted by release date (most recent first)');
      
      // Save to cache for future use
      if (sets.length > 0) {
        await dbService.saveSetList(sets);
        console.log(`Cached ${sets.length} sets`);
      }
      
      return sets;
    } catch (error) {
      console.error('Error getting set list from API:', error);
      
      // If API fails, try to use the imported set list as last resort
      console.log('Falling back to imported set list data');
      try {
        const { setList } = await import('../data/setList');
        
        // Sort the imported set list by release date
        setList.sort((a, b) => {
          if (a.release_date && b.release_date) {
            return new Date(b.release_date) - new Date(a.release_date);
          }
          if (a.release_date && !b.release_date) return -1;
          if (!a.release_date && b.release_date) return 1;
          return a.name.localeCompare(b.name);
        });
        
        return setList;
      } catch (fallbackError) {
        console.error('Error loading fallback set list:', fallbackError);
        return [];
      }
    }
  },

  /**
   * Search for cards by name with caching for sets
   * @param {string} cardName - The name of the card to search for
   * @param {string} setCode - The set code to check in cache
   * @returns {Promise<Array>} - Array of matching cards
   */
  async searchCards(cardName, setCode = null) {
    console.log(`Searching for cards: '${cardName}' in set: ${setCode || 'all'}`);
    
    // If a setCode is provided, try to get cards from cache first
    if (setCode) {
      try {
        const hasCardsForSet = await dbService.hasCardsForSet(setCode);
        
        if (hasCardsForSet) {
          console.log(`Using cached cards for set ${setCode}`);
          const cards = await dbService.getCardsForSet(setCode);
          
          // Filter the cached cards by name
          const filteredCards = cards.filter(card => 
            card.name.toLowerCase().includes(cardName.toLowerCase())
          );
          
          if (filteredCards.length > 0) {
            console.log(`Found ${filteredCards.length} cards matching '${cardName}' in cache`);
            return filteredCards;
          }
          // If no matches in cache, continue to API call
          console.log(`No cards matching '${cardName}' found in cache for set ${setCode}`);
        }
      } catch (error) {
        console.error(`Error checking cache for set ${setCode}:`, error);
        // Continue to API call if cache check fails
      }
    }
    
    // If no cache or no matches in cache, make API call
    console.log(`Making API call for: '${cardName}' in set: ${setCode || 'all'}`);
    let url = API_CONFIG.buildSearchUrl(cardName);
    
    // Add set_code parameter if specified
    if (setCode) {
      url += `&set_code=${encodeURIComponent(setCode)}`;
    }
    
    console.log(`API URL: ${url}`);
    
    try {
      const response = await fetchWithProxy(url, {
        headers: API_CONFIG.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to search for card: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`API returned ${data.data ? data.data.length : 0} results`);
      
      const cards = data.data || [];
      
      // If we have cards and a setCode, cache them for future use
      if (cards.length > 0 && setCode) {
        try {
          // Group cards by set
          const cardsBySet = {};
          
          cards.forEach(card => {
            // Extract set code from the card data
            const cardSetCode = card.set_code || (card.set && card.set.code);
            
            if (cardSetCode) {
              if (!cardsBySet[cardSetCode]) {
                cardsBySet[cardSetCode] = [];
              }
              cardsBySet[cardSetCode].push(card);
            }
          });
        
          // Cache cards for each set
          for (const [code, setCards] of Object.entries(cardsBySet)) {
            await dbService.saveCardsForSet(code, setCards);
            console.log(`Cached ${setCards.length} cards for set ${code}`);
          }
        } catch (error) {
          console.error('Error caching cards:', error);
          // Continue even if caching fails
        }
      }
      
      return cards;
    } catch (error) {
      console.error(`Search API error: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Get all cards for a specific set with caching
   * @param {string} setCode - The set code
   * @param {number} setId - The set ID (optional)
   * @param {boolean} forceRefresh - Whether to bypass cache and force a refresh
   * @returns {Promise<Array>} - Array of cards in the set
   */
  async getCardsForSet(setCode, setId = null, forceRefresh = false) {
    try {
      // Try to get from cache first, unless forceRefresh is true
      if (!forceRefresh) {
        const hasCardsForSet = await dbService.hasCardsForSet(setCode);
        
        if (hasCardsForSet) {
          console.log(`Using cached cards for set ${setCode}`);
          return await dbService.getCardsForSet(setCode);
        }
      } else {
        console.log(`Bypassing cache and forcing refresh of cards for set ${setCode}`);
      }
      
      // If not in cache, we'll try different approaches in order
      
      // Try 1: If setId is provided, use the set endpoint
      if (setId) {
        try {
          const url = API_CONFIG.buildSetByIdUrl(setId);
          console.log(`Fetching cards for set ${setCode} using set endpoint: ${url}`);
          
          const response = await fetchWithProxy(url, {
            headers: API_CONFIG.getHeaders()
          });
          
          if (!response.ok) {
            throw new Error(`Failed to get cards for set ID ${setId}: ${response.status}`);
          }
          
          const responseData = await response.json();
          console.log(`API set endpoint response for set ${setCode}:`, responseData);
          
          // Handle response structure
          let cards = [];
          if (responseData && responseData.cards) {
            cards = responseData.cards;
          } else if (responseData && responseData.data && responseData.data.cards) {
            cards = responseData.data.cards;
          } else if (Array.isArray(responseData)) {
            cards = responseData;
          }
          
          console.log(`Set endpoint found ${cards.length} cards for set ${setCode}`);
          
          // Cache for future use
          if (cards.length > 0) {
            await dbService.saveCardsForSet(setCode, cards);
            console.log(`Cached ${cards.length} cards for set ${setCode}`);
          }
          
          return cards;
        } catch (setEndpointError) {
          console.error(`Error using set endpoint for ${setCode}:`, setEndpointError);
          // Continue to next approach
          console.log('Falling back to search endpoint...');
        }
      }
      
      // If not in cache, fetch from API
      // First try the search endpoint with set_code filter which is more likely to work
      const url = API_CONFIG.buildCardsForSetUrl(setCode);
      console.log(`Fetching cards for set ${setCode} from: ${url}`);
      
      try {
        const response = await fetchWithProxy(url, {
          headers: API_CONFIG.getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Failed to get cards for set ${setCode}: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log(`API response for set ${setCode}:`, responseData);
        
        // Handle response structure correctly
        let cards = [];
        if (responseData && responseData.data) {
          cards = responseData.data;
        } else if (Array.isArray(responseData)) {
          cards = responseData;
        }
        
        console.log(`Found ${cards.length} cards for set ${setCode}`);
        
        // Cache for future use
        if (cards.length > 0) {
          await dbService.saveCardsForSet(setCode, cards);
          console.log(`Cached ${cards.length} cards for set ${setCode}`);
        }
        
        return cards;
      } catch (error) {
        console.error(`Error fetching cards for set ${setCode}:`, error);
        
        // Try local data for specific sets as a fallback
        if (setCode === 'PRE') {
          console.log('Attempting to load local data for Prismatic Evolutions set');
          try {
            const localResponse = await fetch('./data/prismatic-evolutions.json');
            if (localResponse.ok) {
              const localData = await localResponse.json();
              console.log(`Loaded ${localData.length} cards from local JSON file`);
              
              // Cache the local data
              if (localData.length > 0) {
                await dbService.saveCardsForSet(setCode, localData);
              }
              
              return localData;
            }
          } catch (localError) {
            console.error('Error loading local data:', localError);
          }
        }
        
        // If all else fails, return empty array
        return [];
      }
    } catch (error) {
      console.error(`Error in getCardsForSet for ${setCode}:`, error);
      throw error;
    }
  },
  
  /**
   * Get pricing information for a specific card
   * @param {string} cardId - The ID of the card
   * @returns {Promise<Object>} - Pricing data for the card
   */
  async getCardPricing(cardId) {
    const url = API_CONFIG.buildPricingUrl(cardId);
    
    const response = await fetchWithProxy(url, {
      headers: API_CONFIG.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pricing data: ${response.status}`);
    }
    
    return await response.json();
  },
  
  /**
   * Find all cards in a specific set that match a name
   * @param {Array} cards - Array of cards from search results
   * @param {string} setName - The name of the set to find
   * @returns {Array} - All matching cards or empty array if none found
   */
  findCardsInSet(cards, setName) {
    return cards.filter(card => card.set_name === setName) || [];
  },
  
  /**
   * Load mock data for fallback purposes
   * @param {string} setName - The set name to use
   * @param {string} cardName - The card name to use
   * @returns {Promise<Object>} - Mock pricing data
   */
  async loadMockData(setName, cardName) {
    try {
      const mockSearchResponse = await fetch('./mock/search-response.json');
      if (!mockSearchResponse.ok) {
        throw new Error('Failed to load mock search data');
      }
      
      const searchData = await mockSearchResponse.json();
      const mockPricingResponse = await fetch('./mock/pricing-response.json');
      
      if (!mockPricingResponse.ok) {
        throw new Error('Failed to load mock pricing data');
      }
      
      const mockData = await mockPricingResponse.json();
      // Update mock data with requested values
      mockData.name = cardName;
      mockData.set_name = setName;
      
      return mockData;
    } catch (error) {
      console.error('Failed to load mock data:', error);
      throw error;
    }
  }
};
import { fetchWithProxy } from '../corsProxy';
import { API_CONFIG } from '../data/apiConfig';
import { dbService } from './storage/db';

/**
 * Service for interacting with the PokeData API
 */
export const pokeDataService = {
  /**
   * Get the set list from the cache or API
   * @returns {Promise<Array>} - Array of sets
   */
  async getSetList() {
    try {
      // Try to get from cache first
      const cachedSetList = await dbService.getSetList();
      
      if (cachedSetList) {
        console.log('Using cached set list');
        return cachedSetList;
      }
      
      // If not in cache, use the imported set list from data file
      // In a real app, this would come from an API call
      // For now, we'll just simulate by using the imported data
      const { setList } = await import('../data/setList');
      
      // Save to cache for future use
      await dbService.saveSetList(setList);
      
      return setList;
    } catch (error) {
      console.error('Error getting set list:', error);
      // Fallback to imported data if cache fails
      const { setList } = await import('../data/setList');
      return setList;
    }
  },

  /**
   * Search for cards by name with caching for sets
   * @param {string} cardName - The name of the card to search for
   * @param {string} setCode - The set code to check in cache
   * @returns {Promise<Array>} - Array of matching cards
   */
  async searchCards(cardName, setCode = null) {
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
            return filteredCards;
          }
          // If no matches in cache, continue to API call
        }
      } catch (error) {
        console.error(`Error checking cache for set ${setCode}:`, error);
        // Continue to API call if cache check fails
      }
    }
    
    // If no cache or no matches in cache, make API call
    const url = API_CONFIG.buildSearchUrl(cardName);
    
    const response = await fetchWithProxy(url, {
      headers: API_CONFIG.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to search for card: ${response.status}`);
    }
    
    const cards = await response.json();
    
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
        }
      } catch (error) {
        console.error('Error caching cards:', error);
        // Continue even if caching fails
      }
    }
    
    return cards;
  },
  
  /**
   * Get all cards for a specific set with caching
   * @param {string} setCode - The set code
   * @returns {Promise<Array>} - Array of cards in the set
   */
  async getCardsForSet(setCode) {
    try {
      // Try to get from cache first
      const hasCardsForSet = await dbService.hasCardsForSet(setCode);
      
      if (hasCardsForSet) {
        console.log(`Using cached cards for set ${setCode}`);
        return await dbService.getCardsForSet(setCode);
      }
      
      // If not in cache, fetch from API
      const url = `${API_CONFIG.baseUrl}/cards?set=${setCode}`;
      
      const response = await fetchWithProxy(url, {
        headers: API_CONFIG.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get cards for set ${setCode}: ${response.status}`);
      }
      
      const cards = await response.json();
      
      // Cache for future use
      await dbService.saveCardsForSet(setCode, cards);
      
      return cards;
    } catch (error) {
      console.error(`Error getting cards for set ${setCode}:`, error);
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
/**
 * IndexedDB Storage Service
 * Provides persistent storage for set list and card data
 */

// Database configuration
const DB_NAME = 'poke-data-db';
const DB_VERSION = 1;
const STORES = {
  setList: 'setList',
  cardsBySet: 'cardsBySet'
};

/**
 * Open the IndexedDB database
 * @returns {Promise<IDBDatabase>} The database instance
 */
export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error opening database:', event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.setList)) {
        db.createObjectStore(STORES.setList, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.cardsBySet)) {
        db.createObjectStore(STORES.cardsBySet, { keyPath: 'setCode' });
      }
    };
  });
};

/**
 * Database Service for managing persistent storage of card data
 */
export const dbService = {
  /**
   * Save the set list to IndexedDB
   * @param {Array} setList - The array of set objects
   * @returns {Promise<void>}
   */
  async saveSetList(setList) {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORES.setList, 'readwrite');
      const store = transaction.objectStore(STORES.setList);
      
      // We'll store the entire set list as a single record
      await store.put({
        id: 'pokemonSets',
        data: setList,
        timestamp: Date.now()
      });
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error('Error saving set list:', error);
      throw error;
    }
  },
  
  /**
   * Get the set list from IndexedDB
   * @returns {Promise<Array>} The array of set objects
   */
  async getSetList() {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORES.setList, 'readonly');
      const store = transaction.objectStore(STORES.setList);
      
      const request = store.get('pokemonSets');
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          // If we have the data in the cache, return it
          if (request.result && request.result.data) {
            resolve(request.result.data);
          } else {
            // No data found
            resolve(null);
          }
        };
        
        request.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error('Error getting set list:', error);
      throw error;
    }
  },
  
  /**
   * Save cards for a specific set to IndexedDB
   * @param {string} setCode - The set code
   * @param {Array} cards - The array of card objects for the set
   * @returns {Promise<void>}
   */
  async saveCardsForSet(setCode, cards) {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORES.cardsBySet, 'readwrite');
      const store = transaction.objectStore(STORES.cardsBySet);
      
      await store.put({
        setCode,
        cards,
        timestamp: Date.now()
      });
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error(`Error saving cards for set ${setCode}:`, error);
      throw error;
    }
  },
  
  /**
   * Get cards for a specific set from IndexedDB
   * @param {string} setCode - The set code
   * @returns {Promise<Array>} The array of card objects for the set
   */
  async getCardsForSet(setCode) {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORES.cardsBySet, 'readonly');
      const store = transaction.objectStore(STORES.cardsBySet);
      
      const request = store.get(setCode);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          // If we have the data in the cache, return it
          if (request.result && request.result.cards) {
            resolve(request.result.cards);
          } else {
            // No data found
            resolve(null);
          }
        };
        
        request.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error(`Error getting cards for set ${setCode}:`, error);
      throw error;
    }
  },
  
  /**
   * Check if we have cards for a specific set in the cache
   * @param {string} setCode - The set code
   * @returns {Promise<boolean>} True if we have the data, false otherwise
   */
  async hasCardsForSet(setCode) {
    try {
      const cards = await this.getCardsForSet(setCode);
      return cards !== null;
    } catch (error) {
      console.error(`Error checking if we have cards for set ${setCode}:`, error);
      return false;
    }
  },
  
  /**
   * Clear specific set data
   * @param {string} setCode - The set code to clear
   * @returns {Promise<void>}
   */
  async clearSetData(setCode) {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORES.cardsBySet, 'readwrite');
      const store = transaction.objectStore(STORES.cardsBySet);
      
      const request = store.delete(setCode);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`Cleared cache for set ${setCode}`);
          resolve();
        };
        request.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error(`Error clearing data for set ${setCode}:`, error);
      throw error;
    }
  },
  
  /**
   * Clear all stored data (useful for testing or resets)
   * @returns {Promise<void>}
   */
  async clearAllData() {
    try {
      const db = await openDatabase();
      const transaction = db.transaction([STORES.setList, STORES.cardsBySet], 'readwrite');
      
      transaction.objectStore(STORES.setList).clear();
      transaction.objectStore(STORES.cardsBySet).clear();
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
          console.log('All cache data cleared successfully');
          resolve();
        };
        transaction.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
};

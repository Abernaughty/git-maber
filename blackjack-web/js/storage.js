/**
 * Blackjack Storage Functions
 * Handles local storage for game state persistence
 */

// Check if localStorage is available
function isLocalStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

// Save value to localStorage with error handling
function saveToStorage(key, value) {
    if (isLocalStorageAvailable()) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            return false;
        }
    }
    return false;
}

// Load value from localStorage with error handling
function loadFromStorage(key) {
    if (isLocalStorageAvailable()) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return null;
        }
    }
    return null;
}

// Remove value from localStorage with error handling
function removeFromStorage(key) {
    if (isLocalStorageAvailable()) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Failed to remove from localStorage:', e);
            return false;
        }
    }
    return false;
}

// Clear all game data from localStorage
function clearGameData() {
    removeFromStorage('blackjack_balance');
    removeFromStorage('blackjack_previous_bet');
}

// Initialize default values if none exist
function initializeDefaultValues() {
    if (!loadFromStorage('blackjack_balance')) {
        saveToStorage('blackjack_balance', '100');
    }
    
    if (!loadFromStorage('blackjack_previous_bet')) {
        saveToStorage('blackjack_previous_bet', '5');
    }
}

// Initialize storage on script load
initializeDefaultValues();
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
    //
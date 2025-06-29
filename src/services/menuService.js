/**
 * Menu Service
 * 
 * This service follows the Single Responsibility Principle by only handling
 * menu-related data fetching operations.
 */

import { menuItems } from '../mocks/menuItems';

/**
 * Simulates a network delay
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise} - Promise that resolves after the delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches user menu items from the API
 * @returns {Promise<Array>} - Promise that resolves to menu items array
 */
export const fetchUserMenus = async () => {
  try {
    // Simula uma chamada à API com 500ms de delay
    await delay(500);
    return menuItems;
  } catch (error) {
    console.error('Error fetching user menus:', error);
    throw error;
  }
};

/**
 * Filters menu items by search term
 * @param {Array} items - Array of menu items
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} - Filtered menu items
 */
export const filterMenuItems = (items, searchTerm) => {
  if (!searchTerm.trim()) {
    return items;
  }
  
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    item.name.toLowerCase().includes(term) ||
    item.description.toLowerCase().includes(term)
  );
}; 
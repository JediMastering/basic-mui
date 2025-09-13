/**
 * Menu Service
 * 
 * This service follows the Single Responsibility Principle by only handling
 * menu-related data fetching operations.
 */
import { menuItems } from '../mocks/data/menus.js';

/**
 * Fetches user menu items from the API
 * @returns {Promise<Array>} - Promise that resolves to menu items array
 */
export const fetchUserMenus = async () => {
  // Directly return the mock data, simulating an async call
  return Promise.resolve(menuItems);
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
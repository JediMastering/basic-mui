/**
 * Menu Service
 * 
 * This service follows the Single Responsibility Principle by only handling
 * menu-related data fetching operations.
 */
import { apiRequest } from '../framework/utils/connections';

/**
 * Fetches user menu items from the API
 * @returns {Promise<Array>} - Promise that resolves to menu items array
 */
export const fetchUserMenus = async () => {
  try {
    // Simula uma chamada à API com 500ms de delay
    const response = await apiRequest({ url: '/menus', method: 'GET', useMock: true });
    return response;
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
/**
 * useMenuData - Custom hook for menu data management
 * 
 * This hook follows the Single Responsibility Principle by only handling
 * menu data fetching and state management.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchUserMenus, filterMenuItems } from '../services/menuService';

/**
 * Custom hook for managing menu data
 * @returns {Object} - Menu data and related functions
 */
export const useMenuData = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Loads menu items from the service
   */
  const loadMenuItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const items = await fetchUserMenus();
      setMenuItems(items);
      setFilteredItems(items);
    } catch (err) {
      setError(err.message);
      console.error('Error loading menu items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Updates search term and filters items
   */
  const handleSearchChange = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    const filtered = filterMenuItems(menuItems, newSearchTerm);
    setFilteredItems(filtered);
  }, [menuItems]);

  /**
   * Refreshes menu data
   */
  const refreshMenuData = useCallback(() => {
    setSearchTerm('');
    loadMenuItems();
  }, [loadMenuItems]);

  // Load menu items on mount
  useEffect(() => {
    loadMenuItems();
  }, [loadMenuItems]);

  return {
    // State
    menuItems,
    filteredItems,
    loading,
    error,
    searchTerm,
    
    // Actions
    loadMenuItems,
    handleSearchChange,
    refreshMenuData,
  };
}; 
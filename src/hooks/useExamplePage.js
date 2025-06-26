import { useState, useCallback, useMemo } from 'react';
import { 
  NAVIGATION_ITEMS_CONFIG, 
  LAYOUT_FEATURES, 
  HEADER_CONFIG, 
  SIDEBAR_CONFIG 
} from '../constants/examplePage';

/**
 * useExamplePage - Custom hook for example page logic
 * 
 * This hook follows the Single Responsibility Principle by only handling
 * example page state management and business logic.
 */
export const useExamplePage = () => {
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Event handlers
  const handleMenuClick = useCallback(() => {
    console.log('click menu button');
    setSidebarOpen(prevState => !prevState);
  }, []);

  const handleNavigationClick = useCallback((path) => {
    console.log(`Navigating to: ${path}`);
    // In a real app, you would use React Router here
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prevState => !prevState);
  }, []);

  const handleSampleAction = useCallback(() => {
    console.log('Action clicked');
  }, []);

  // Navigation configuration with click handlers
  const navigationItems = useMemo(() => 
    NAVIGATION_ITEMS_CONFIG.map(item => ({
      ...item,
      icon: <span>{item.icon}</span>,
      onClick: () => handleNavigationClick(item.path)
    })), 
    [handleNavigationClick]
  );

  // Header configuration
  const headerConfig = useMemo(() => ({
    ...HEADER_CONFIG,
    onMenuClick: handleMenuClick,
  }), [handleMenuClick]);

  // Sidebar configuration
  const sidebarConfig = useMemo(() => ({
    ...SIDEBAR_CONFIG,
    navigationItems,
  }), [navigationItems]);

  return {
    // State
    sidebarOpen,
    
    // Event handlers
    handleMenuClick,
    handleNavigationClick,
    handleToggleSidebar,
    handleSampleAction,
    
    // Configurations
    headerConfig,
    sidebarConfig,
    layoutFeatures: LAYOUT_FEATURES,
  };
}; 
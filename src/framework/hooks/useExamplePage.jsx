import { useMemo, useCallback } from 'react';
import { 
  NAVIGATION_ITEMS_CONFIG, 
  LAYOUT_FEATURES, 
  HEADER_CONFIG, 
  SIDEBAR_CONFIG 
} from '../../constants/examplePage.jsx';

/**
 * useExamplePage - Custom hook for example page-specific logic
 *
 * This hook provides the configurations and handlers required by the ExamplePage,
 * separating its specific logic from the reusable layout components.
 */
export const useExamplePage = () => {
  const handleNavigationClick = useCallback((path) => {
    console.log(`Navigating to: ${path}`);
    // In a real app, you would use React Router here
  }, []);

  const handleSampleAction = useCallback(() => {
    console.log('Action clicked');
  }, []);

  const navigationItems = useMemo(() => 
    NAVIGATION_ITEMS_CONFIG.map(item => ({
      ...item,
      icon: <span>{item.icon}</span>,
      onClick: () => handleNavigationClick(item.path)
    })), 
    [handleNavigationClick]
  );

  const headerConfig = useMemo(() => ({
    ...HEADER_CONFIG,
  }), []);

  const sidebarConfig = useMemo(() => ({
    ...SIDEBAR_CONFIG,
    navigationItems,
  }), [navigationItems]);

  return {
    // Configurations
    headerConfig,
    sidebarConfig,
    layoutFeatures: LAYOUT_FEATURES,
    
    // Event handlers
    handleSampleAction,
  };
};

import { useState, useCallback } from 'react';

/**
 * useAppLayout - Custom hook for generic application layout logic
 *
 * This hook manages the state for the main application layout,
 * such as the sidebar's open/closed state.
 */
export const useAppLayout = (initialSidebarOpen = false) => {
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarOpen);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prevState => !prevState);
  }, []);

  return {
    sidebarOpen,
    handleToggleSidebar,
  };
};

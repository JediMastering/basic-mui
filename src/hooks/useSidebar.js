import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Custom hook for managing sidebar state
 * 
 * This hook follows the Single Responsibility Principle by only handling
 * sidebar-related state management and responsive behavior.
 */
export const useSidebar = (initialState = true) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isOpen, setIsOpen] = useState(initialState);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-close sidebar on mobile when screen size changes
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const openSidebar = () => {
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  const collapseSidebar = () => {
    setIsCollapsed(true);
  };

  const expandSidebar = () => {
    setIsCollapsed(false);
  };

  return {
    isOpen,
    isCollapsed,
    isMobile,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    toggleCollapse,
    collapseSidebar,
    expandSidebar,
  };
}; 
import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Custom hook for managing sidebar state
 * 
 * This hook follows the Single Responsibility Principle by only handling
 * sidebar-related state management and responsive behavior.
 */
export const useSidebar = (initialState = false) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  console.log('useSidebar inicialização - initialState:', initialState, 'isMobile:', isMobile);
  
  const [isOpen, setIsOpen] = useState(initialState);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-close sidebar on mobile when screen size changes
  useEffect(() => {
    console.log('useSidebar useEffect - isMobile:', isMobile, 'isOpen:', isOpen);
    // Comentando temporariamente para testar
    // if (isMobile && isOpen) {
    //   console.log('Fechando sidebar no mobile');
    //   setIsOpen(false);
    // }
  }, [isMobile, isOpen]);

  const toggleSidebar = () => {
    console.log('toggleSidebar chamado, estado atual:', isOpen);
    setIsOpen(prev => {
      console.log('toggleSidebar - mudando de', prev, 'para', !prev);
      return !prev;
    });
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
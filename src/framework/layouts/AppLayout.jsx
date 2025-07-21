import React from 'react';
import ApplicationLayout from './ApplicationLayout';
import ApplicationHeader from '../components/header/ApplicationHeader';
import NavigationSidebar from '../components/navigation/NavigationSidebar';
import { useAppLayout } from '../hooks/useAppLayout';

/**
 * AppLayout - A reusable and configurable layout component
 *
 * This component provides the main application structure and is configured
 * via props, making it highly reusable.
 */
const AppLayout = ({ children, headerConfig, navigationConfig }) => {
  const { sidebarOpen, handleToggleSidebar } = useAppLayout();

  const handleNavigationClick = (item) => {
    console.log('Navigation clicked:', item);
    if (navigationConfig && navigationConfig.onNavigationClick) {
      navigationConfig.onNavigationClick(item);
    }
  };

  const augmentedHeaderConfig = {
    ...headerConfig,
    onMenuClick: handleToggleSidebar,
  };

  return (
    <>
      <NavigationSidebar 
        {...navigationConfig}
        onNavigationClick={handleNavigationClick}
        open={sidebarOpen}
        onToggle={handleToggleSidebar}
      />
      
      <ApplicationLayout
        header={<ApplicationHeader {...augmentedHeaderConfig} />}
        mainContent={children}
      />
    </>
  );
};

export default AppLayout;
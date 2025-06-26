import React from 'react';
import ApplicationLayout from '../framework/layouts/ApplicationLayout';
import ApplicationHeader from '../framework/components/header/ApplicationHeader';
import NavigationSidebar from '../framework/components/navigation/NavigationSidebar';
import ExampleContent from '../framework/components/content/ExampleContent';
import { useExamplePage } from '../hooks/useExamplePage';

/**
 * ExamplePage - Example page demonstrating the new layout
 * 
 * This component shows how to use the improved layout components
 * with proper composition and state management.
 * 
 * Features:
 * - Responsive design
 * - Collapsible sidebar
 * - Fixed header
 * - Clean component structure
 * - English naming conventions
 * - Separated concerns with custom hooks
 * - Reusable components
 */
const ExamplePage = () => {
  const {
    sidebarOpen,
    headerConfig,
    sidebarConfig,
    layoutFeatures,
    handleToggleSidebar,
    handleSampleAction,
  } = useExamplePage();

  return (
    <ApplicationLayout
      header={<ApplicationHeader {...headerConfig} />}
      sidebar={sidebarOpen ? <NavigationSidebar {...sidebarConfig} /> : null}
      mainContent={
        <ExampleContent
          layoutFeatures={layoutFeatures}
          onToggleSidebar={handleToggleSidebar}
          onSampleAction={handleSampleAction}
        />
      }
    />
  );
};

export default ExamplePage; 
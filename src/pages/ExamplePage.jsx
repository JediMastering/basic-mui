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
 * - Dynamic menu loading
 */
const ExamplePage = () => {
  const {
    sidebarOpen,
    headerConfig,
    layoutFeatures,
    handleMenuClick,
    handleToggleSidebar,
    handleSampleAction,
  } = useExamplePage();

  console.log('ExamplePage render - sidebarOpen:', sidebarOpen);

  const handleNavigationClick = (item) => {
    console.log('Navigation clicked:', item);
    // In a real app, you would use React Router here
  };

  return (
    <>
      {/* Navigation Sidebar - Connected to useExamplePage state */}
      <NavigationSidebar 
        onNavigationClick={handleNavigationClick}
        open={sidebarOpen}
        onToggle={handleMenuClick}
      />
      
      {/* Main Layout */}
      <ApplicationLayout
        header={<ApplicationHeader {...headerConfig} />}
        mainContent={
          <ExampleContent
            layoutFeatures={layoutFeatures}
            onToggleSidebar={handleToggleSidebar}
            onSampleAction={handleSampleAction}
          />
        }
      />
    </>
  );
};

export default ExamplePage; 
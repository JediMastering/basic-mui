import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import ApplicationLayout from '../framework/layouts/ApplicationLayout';
import ApplicationHeader from '../framework/components/header/ApplicationHeader';
import NavigationSidebar from '../framework/components/navigation/NavigationSidebar';

/**
 * ExamplePage - Example page demonstrating the new layout
 * 
 * This component shows how to use the improved layout components
 * with proper composition and state management.
 */
const ExamplePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMenuClick = () => {
    console.log('click menu button')
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigationClick = (path) => {
    console.log(`Navigating to: ${path}`);
    // In a real app, you would use React Router here
  };

  // Navigation items with click handlers
  const navigationItems = [
    { 
      label: 'Home', 
      icon: <span>🏠</span>, 
      path: '/home',
      onClick: () => handleNavigationClick('/home')
    },
    { 
      label: 'Dashboard', 
      icon: <span>📊</span>, 
      path: '/dashboard',
      onClick: () => handleNavigationClick('/dashboard')
    },
    { 
      label: 'Users', 
      icon: <span>👥</span>, 
      path: '/table',
      onClick: () => handleNavigationClick('/table')
    },
    { 
      label: 'Settings', 
      icon: <span>⚙️</span>, 
      path: '/settings',
      onClick: () => handleNavigationClick('/settings')
    },
    { 
      label: 'Profile', 
      icon: <span>👤</span>, 
      path: '/profile',
      onClick: () => handleNavigationClick('/profile')
    },
  ];

  // Main content component
  const MainContent = () => (
    <Box sx={{ p: 3, height: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>
        Welcome to the Example Page
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Layout Features
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This page demonstrates the improved layout with:
        </Typography>
        <ul>
          <li>Responsive design</li>
          <li>Collapsible sidebar</li>
          <li>Fixed header</li>
          <li>Clean component structure</li>
          <li>English naming conventions</li>
        </ul>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            Toggle Sidebar
          </Button>
          <Button 
            variant="outlined"
            onClick={() => console.log('Action clicked')}
          >
            Sample Action
          </Button>
        </Box>
      </Paper>
    </Box>
  );

  return (
    <ApplicationLayout
      header={
        <ApplicationHeader
          title="Example Application"
          subtitle="Improved Layout Demo"
          onMenuClick={handleMenuClick}
          showMenuButton={true}
        />
      }
      sidebar={
        sidebarOpen ? (
          <NavigationSidebar
            navigationItems={navigationItems}
            title="Main Menu"
          />
        ) : null
      }
      mainContent={<MainContent />}
    />
  );
};

export default ExamplePage; 
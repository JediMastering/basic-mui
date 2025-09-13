import React from 'react';
import { Box } from 'framework/mui';
import PropTypes from 'prop-types';

/**
 * MainLayout - Main layout component that provides the basic structure
 * 
 * This component follows the Single Responsibility Principle by only handling
 * the basic layout structure and delegating specific areas to child components.
 */
const MainLayout = ({ children, header, sidebar, mainContent }) => {
  console.log('MainLayout render - sidebar:', !!sidebar);
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      {/* Header Section */}
      {header && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '64px',
            zIndex: 1200,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 2,
          }}
        >
          {header}
        </Box>
      )}

      {/* Main Content Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: header ? '64px' : 0,
          height: header ? 'calc(100vh - 64px)' : '100vh',
          width: '100vw',
        }}
      >
        {/* Sidebar Section */}
        {sidebar && (
          <Box
            sx={{
              width: '280px',
              height: '100%',
              backgroundColor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {sidebar}
          </Box>
        )}

        {/* Main Content Section */}
        <Box
          sx={{
            flex: 1,
            height: '100%',
            backgroundColor: 'background.default',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {mainContent || children}
        </Box>
      </Box>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  sidebar: PropTypes.node,
  mainContent: PropTypes.node,
};

export default MainLayout; 
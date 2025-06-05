import React from 'react';
import { Box } from '@mui/material';
import NavigationSidebar from '../components/navigation/NavigationSidebar';

const MainLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <NavigationSidebar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 
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
      aqui1
      <NavigationSidebar />
      aqui2
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
        aqui3
        {children}
        aqui 4
      </Box>
      aqui 5
    </Box>
  );
};

export default MainLayout; 
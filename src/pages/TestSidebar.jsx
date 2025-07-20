import React from 'react';
import { Box, Button, Typography } from 'framework/mui';
import { useSidebar } from '../hooks/useSidebar';

const TestSidebar = () => {
  const sidebar = useSidebar(false); // Começa fechada

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Teste da Sidebar
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          Estado da sidebar: {sidebar.isOpen ? 'ABERTA' : 'FECHADA'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          isMobile: {sidebar.isMobile ? 'SIM' : 'NÃO'}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={sidebar.toggleSidebar}
        >
          Toggle Sidebar
        </Button>
        <Button 
          variant="outlined" 
          onClick={sidebar.openSidebar}
        >
          Abrir Sidebar
        </Button>
        <Button 
          variant="outlined" 
          onClick={sidebar.closeSidebar}
        >
          Fechar Sidebar
        </Button>
      </Box>
      
      {sidebar.isOpen && (
        <Box 
          sx={{ 
            width: 280, 
            height: 400, 
            bgcolor: 'background.paper', 
            border: 1, 
            borderColor: 'divider',
            p: 2
          }}
        >
          <Typography variant="h6">Sidebar Aberta!</Typography>
          <Typography variant="body2">
            Conteúdo da sidebar aqui...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TestSidebar; 
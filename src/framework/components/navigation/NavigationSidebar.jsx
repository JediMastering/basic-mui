import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  IconButton,
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  alpha
} from 'framework/mui';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

/**
 * NavigationSidebar - Sidebar component for navigation
 */
const NavigationSidebar = ({ onNavigationClick, open: externalOpen, onToggle }) => {
  const navigate = useNavigate();
  // Use external state if provided, otherwise use internal state
  const [internalOpen, setInternalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Determine which state to use
  const isControlled = externalOpen !== undefined && onToggle !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  console.log('NavigationSidebar render - externalOpen:', externalOpen, 'isControlled:', isControlled, 'open:', open);

  // Mock data for testing
  const mockItems = [
    { id: 1, name: 'Dashboard', icon: '/icons/dashboard.svg', path: '/dashboard', description: 'Painel de controle principal' },
    { id: 2, name: 'Usuários', icon: '/icons/users.svg', path: '/users', description: 'Gerenciamento de usuários' },
    { id: 3, name: 'Configurações', icon: '/icons/settings.svg', path: '/settings', description: 'Configurações do sistema' },
    { id: 4, name: 'Logout', icon: '/icons/logout.svg', path: '/', description: 'Sair do sistema' },
    { id: 5, name: 'Example', icon: '/icons/example.svg', path: '/example', description: 'Example page for demonstration purposes' },
    { id: 6, name: 'Table Example', icon: '/icons/table.svg', path: '/table-example', description: 'Table example page' },
  ];

  const toggleDrawer = () => {
    console.log('Toggle drawer called, current open state:', open);
    if (isControlled) {
      onToggle(); // Use external toggle
    } else {
      setInternalOpen(!internalOpen); // Use internal toggle
    }
    console.log('New open state will be:', !open);
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleItemClick = (item) => {
    if (item.path === '/') {
      localStorage.removeItem('authToken'); // Clear auth token on logout
    } 
    navigate(item.path); // Navega para a rota
    console.log('Item clicked:', item);
    if (onNavigationClick) {
      onNavigationClick(item);
    }
    console.log(`Navigating to: ${item.path}`);
    if (isControlled) {
      onToggle(); // Close using external toggle
    } else {
      setInternalOpen(false); // Close using internal state
    }
  };

  console.log('NavigationSidebar render - open state:', open);

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: 'fixed',
          zIndex: 100,
          left: 16,
          top: 16,
          bgcolor: 'primary',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'background.paper',
          }
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography sx={{zIndex:1400}} variant="h6" component="div">
              Menu
            </Typography>
            <IconButton onClick={toggleDrawer} size="small">
             <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar menu..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {mockItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <Tooltip 
                  title={item.description}
                  placement="right"
                  enterDelay={500}
                >
                  <ListItemButton
                    onClick={() => handleItemClick(item)}
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box
                        component="img"
                        src={item.icon}
                        alt={item.name}
                        sx={{
                          width: 24,
                          height: 24,
                          filter: 'brightness(0.8)'
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.name}
                      primaryTypographyProps={{
                        variant: 'body2',
                        sx: { fontWeight: 500 }
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

NavigationSidebar.propTypes = {
  onNavigationClick: PropTypes.func,
  open: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default NavigationSidebar; 
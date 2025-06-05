import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Backdrop,
  alpha
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { fetchUserMenus } from '../../../services/menuService';

const NavigationSidebar = () => {
  const [open, setOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      const items = await fetchUserMenus();
      setMenuItems(items);
      setFilteredItems(items);
    } catch (error) {
      console.error('Erro ao carregar menus:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadMenuItems();
    }
  }, [open]);

  useEffect(() => {
    const filtered = menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, menuItems]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDrawer = () => {
    if (!open) {
      setMenuItems([]); // Limpa os itens ao abrir para forçar nova requisição
      setSearchTerm('');
    }
    setOpen(!open);
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: 'fixed',
          zIndex:'99',
          left: 16,
          top: 16,
          bgcolor: 'background.paper',
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
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" component="div">
              Menu
            </Typography>
            <IconButton onClick={toggleDrawer} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Search */}
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar menu..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Menu Items */}
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {filteredItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <Tooltip 
                  title={item.description}
                  placement="right"
                  enterDelay={500}
                >
                  <ListItemButton
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

      <Backdrop
        sx={{ 
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer - 1,
          bgcolor: 'rgba(0, 0, 0, 0.3)'
        }}
        open={open}
        onClick={toggleDrawer}
      />

      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: open ? 140 : '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: (theme) => theme.zIndex.drawer + 2,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
    </>
  );
};

export default NavigationSidebar; 
import React from 'react';
import {
  Drawer,
  IconButton,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  Stack,
  Badge,
  Paper
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SIDEBAR_STATE_KEY = 'filterSidebarOpen';

const FilterSidebar = ({
  children,
  onFilter,
  onClear,
  title = 'Filtros',
  drawerWidth = 300,
  hasActiveFilters = false
}) => {
  const [open, setOpen] = React.useState(() => {
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    return savedState !== null ? JSON.parse(savedState) : false;
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    const newState = !open;
    setOpen(newState);
    if (!isMobile) {
      localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(newState));
    }
  };

  const handleFilter = () => {
    onFilter?.();
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleClear = () => {
    onClear?.();
    if (isMobile) {
      setOpen(false);
    }
  };

  const drawerContent = (
    <>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {title}
          {hasActiveFilters && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'inline-block'
              }}
            />
          )}
        </Typography>
        <IconButton onClick={handleDrawerToggle} size="small">
          {isMobile ? <CloseIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          {children}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFilter}
              startIcon={<FilterListIcon />}
              fullWidth
            >
              Filtrar
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClear}
              startIcon={<FilterAltOffIcon />}
              fullWidth
              disabled={!hasActiveFilters}
            >
              Limpar
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  );

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex',
          position: 'relative',
          minHeight: '100%',
          alignItems: 'flex-start',
          width: open ? drawerWidth : '40px'  // Ajusta dinamicamente baseado no estado do drawer
        }}
      >
        {!open && (
          <Paper
            elevation={1}
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              borderRadius: 0,
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              minHeight: 48,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
            onClick={handleDrawerToggle}
          >
            <Badge
              color="primary"
              variant="dot"
              invisible={!hasActiveFilters}
              sx={{
                '& .MuiBadge-badge': {
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  minWidth: 8
                }
              }}
            >
              <FilterListIcon 
                color="primary" 
                sx={{ 
                  fontSize: 20,
                  opacity: 0.8
                }}
              />
            </Badge>
          </Paper>
        )}

        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            position: 'relative',
            height: '100%',
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              position: 'relative',
              height: '100%',
              overflowY: 'visible',
              border: 'none',
              borderRight: 1,
              borderColor: 'divider',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {isMobile && !open && (
          <Badge
            color="primary"
            variant="dot"
            invisible={!hasActiveFilters}
            sx={{
              position: 'fixed',
              right: 16,
              bottom: 16,
              zIndex: theme.zIndex.drawer + 1,
            }}
          >
            <IconButton
              color="primary"
              onClick={handleDrawerToggle}
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: theme.shadows[2],
                '&:hover': {
                  bgcolor: 'background.paper',
                }
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Badge>
        )}
      </Box>
    </>
  );
};

export default FilterSidebar; 
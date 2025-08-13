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
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from 'framework/mui';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';

const SIDEBAR_STATE_KEY = 'filterSidebarOpen';

/**
 * FilterSidebar - Sidebar component for filtering and search functionality
 * 
 * This component handles all filtering-related UI and follows the Single
 * Responsibility Principle by focusing only on filter functionality.
 */
const FilterSidebar = ({
  children,
  onFilter,
  onClear,
  title = 'Filtros',
  drawerWidth = 300,
  hasActiveFilters = false,
  filters = [],
  onSearch,
  onSave,
  savedQueries = [],
  onAdvancedFilters
}) => {
  const [open, setOpen] = React.useState(() => {
    // const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    // return savedState !== null ? JSON.parse(savedState) : false;
    return false; // ✅ Sempre começa fechado
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

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
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
          {/* Quick Search */}
          <TextField
            size="small"
            fullWidth
            placeholder="Quick search"
            sx={{
              mb: 2,
              '& .MuiInputBase-input': { color: 'text.primary' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&:hover fieldset': { borderColor: 'text.primary' },
                '&.Mui-focused fieldset': { borderColor: 'text.primary' },
              },
              '& .MuiInputLabel-root': { color: 'text.secondary' },
              '& .MuiInputBase-input::placeholder': { color: 'text.secondary' },
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              ),
            }}
          />

          {/* Saved Queries */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              bgcolor: 'background.paper',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: 'text.primary', fontWeight: 600 }}
            >
              Saved Queries
            </Typography>
            {savedQueries.length === 0 ? (
              <>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No saved queries
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Save your searches for quick access.
                </Typography>
              </>
            ) : (
              <Stack spacing={1}>
                {savedQueries.map((query, index) => (
                  <Typography key={index} variant="body2" sx={{ color: 'text.primary' }}>
                    {query.name}
                  </Typography>
                ))}
              </Stack>
            )}
          </Paper>

          {/* Filters */}
          {filters.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: 'text.primary', fontWeight: 600 }}
              >
                General
              </Typography>
              <Stack spacing={2}>
                {filters.map((filter, index) => (
                  <FilterField key={index} {...filter} />
                ))}
              </Stack>
            </Box>
          )}

          {/* Advanced Filters Button */}
          {onAdvancedFilters && (
            <Button
              size="small"
              sx={{
                textTransform: 'none',
                mb: 2,
                color: 'primary.main',
              }}
              startIcon={<AddIcon fontSize="small" sx={{ color: 'primary.main' }} />}
              onClick={onAdvancedFilters}
            >
              Advanced Filters
            </Button>
          )}

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
              onClick={handleClear}
              startIcon={<FilterAltOffIcon />}
              fullWidth
              disabled={!hasActiveFilters}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                '&.Mui-disabled': {
                  color: 'rgba(255, 255, 255, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
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
          //Ajustar este trecho para deixar mais bonito
          <Box
            sx={{
              height: '100%',
              bgcolor: 'background.paper',
            }}
            className="filter-sidebar"
          >
             <Box
              sx={{
                position: 'sticky',
                top: 40,
                transform: 'translateY(-50%)',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  '& .MuiSvgIcon-root': {
                    color: 'primary.main',
                    transform: 'scale(1.1)'
                  }
                }
              }}
              onClick={handleDrawerToggle}
            >
            <Tooltip title="Filtros" placement="right">
              <Badge
                color="primary"
                variant="dot"
                invisible={!hasActiveFilters}
              >
                <FilterListIcon
                  color="inherit"
                  sx={{
                    fontSize: 28,
                    transition: 'all 0.2s',
                  }}
                />
              </Badge>
            </Tooltip>
            </Box>
          </Box>
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

/**
 * FilterField - Individual filter field component
 */
const FilterField = ({ type = 'text', label, options = [], ...props }) => {
  if (type === 'select') {
    return (
      <FormControl size="small" fullWidth>
        <InputLabel sx={{ color: 'text.secondary' }}>{label}</InputLabel>
        <Select
          label={label}
          sx={{
            color: 'text.primary',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'text.primary',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'text.primary',
            },
            '& .MuiSvgIcon-root': { color: 'text.primary' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: 'background.paper',
                color: 'text.primary',
              },
            },
          }}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      size="small"
      label={label}
      fullWidth
      sx={{
        '& .MuiInputBase-input': { color: 'text.primary' },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
          '&:hover fieldset': { borderColor: 'text.primary' },
          '&.Mui-focused fieldset': { borderColor: 'text.primary' },
        },
        '& .MuiInputLabel-root': { color: 'text.secondary' },
      }}
      InputLabelProps={{
        style: { color: '#aaa' },
      }}
      {...props}
    />
  );
};

FilterSidebar.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['text', 'select']),
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ),
  onFilter: PropTypes.func,
  onClear: PropTypes.func,
  title: PropTypes.string,
  drawerWidth: PropTypes.number,
  hasActiveFilters: PropTypes.bool,
  onSearch: PropTypes.func,
  onSave: PropTypes.func,
  savedQueries: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      query: PropTypes.object,
    })
  ),
  onAdvancedFilters: PropTypes.func,
};

export default FilterSidebar; 
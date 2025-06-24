import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, ListItemIcon, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PropTypes from 'prop-types';

/**
 * NavigationSidebar - Sidebar component for navigation
 * 
 * This component follows the Single Responsibility Principle by only handling
 * navigation-related functionality.
 */
const NavigationSidebar = ({ navigationItems = [], title = 'Navigation' }) => {
  // Default navigation items if none provided
  const defaultItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/home' },
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Users', icon: <PeopleIcon />, path: '/table' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { label: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
  ];

  const items = navigationItems.length > 0 ? navigationItems : defaultItems;

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Sidebar Header */}
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: 'text.primary',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Navigation List */}
      <List sx={{ flex: 1 }}>
        {items.map((item, index) => (
          <ListItemButton
            key={index}
            onClick={item.onClick}
            sx={{
              mb: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {item.icon && (
              <ListItemIcon sx={{ color: 'text.primary', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.label}
              sx={{
                '& .MuiListItemText-primary': {
                  color: 'text.primary',
                  fontWeight: 500,
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Sidebar Footer */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            display: 'block',
          }}
        >
          Application v1.0.0
        </Typography>
      </Box>
    </Box>
  );
};

NavigationSidebar.propTypes = {
  navigationItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      path: PropTypes.string,
      onClick: PropTypes.func,
    })
  ),
  title: PropTypes.string,
};

export default NavigationSidebar; 
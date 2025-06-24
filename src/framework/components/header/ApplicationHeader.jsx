import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PropTypes from 'prop-types';

/**
 * ApplicationHeader - Simple header component
 * 
 * This component follows the Single Responsibility Principle by only handling
 * header display and basic interactions.
 */
const ApplicationHeader = ({ title = 'Application', subtitle, onMenuClick, showMenuButton = true }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        px: 2,
      }}
    >
      {/* Left side - Menu button and title */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {showMenuButton && onMenuClick && (
          <IconButton
            color="inherit"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'inherit',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="subtitle2"
              sx={{
                color: 'inherit',
                opacity: 0.8,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right side - Can be extended with user actions */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Placeholder for future user actions */}
      </Box>
    </Box>
  );
};

ApplicationHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onMenuClick: PropTypes.func,
  showMenuButton: PropTypes.bool,
};

export default ApplicationHeader; 
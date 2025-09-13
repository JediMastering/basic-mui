import React from 'react';
import { Box, Typography, IconButton } from 'framework/mui';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PropTypes from 'prop-types';
import { authService } from '../../../service/authService';

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
            onClick={() => {
              console.log('Botão de menu clicado!');
              onMenuClick();
            }}
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
        <IconButton
          color="inherit"
          onClick={authService.logout}
          aria-label="logout"
        >
          <LogoutIcon />
        </IconButton>
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
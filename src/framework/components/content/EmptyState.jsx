import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PropTypes from 'prop-types';

/**
 * EmptyState - Component for displaying empty state messages
 * 
 * This component follows the Single Responsibility Principle by only handling
 * the display of empty state information.
 */
const EmptyState = ({
  icon = <InfoOutlinedIcon sx={{ fontSize: 48, mb: 2, color: 'text.primary' }} />,
  title = 'No results found',
  description = 'Try adjusting your search criteria or filters.',
  actions,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        color: 'text.secondary',
        p: 3,
      }}
    >
      {icon}
      <Typography
        variant="h6"
        sx={{
          mb: 1,
          color: 'text.primary',
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: actions ? 3 : 0,
          maxWidth: 400,
        }}
      >
        {description}
      </Typography>
      {actions && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {actions}
        </Box>
      )}
    </Box>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  actions: PropTypes.node,
};

export default EmptyState; 
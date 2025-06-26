import React, { useMemo } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { LAYOUT_FEATURES } from '../../../constants/examplePage';

/**
 * ExampleContent - Content component for the example page
 * 
 * This component follows the Single Responsibility Principle by only handling
 * the display of example content and features.
 */
const ExampleContent = ({ 
  layoutFeatures = [], 
  onToggleSidebar, 
  onSampleAction 
}) => {
  const features = layoutFeatures.length > 0 ? layoutFeatures : LAYOUT_FEATURES;

  return (
    <Box sx={{ p: 3, height: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>
        Welcome to the Example Page
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Layout Features
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This page demonstrates the improved layout with:
        </Typography>
        <ul>
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={onToggleSidebar}
          >
            Toggle Sidebar
          </Button>
          <Button 
            variant="outlined"
            onClick={onSampleAction}
          >
            Sample Action
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

ExampleContent.propTypes = {
  layoutFeatures: PropTypes.arrayOf(PropTypes.string),
  onToggleSidebar: PropTypes.func.isRequired,
  onSampleAction: PropTypes.func.isRequired,
};

export default ExampleContent; 
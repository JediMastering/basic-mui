import React from 'react';
import { Typography } from '@mui/material';

const Text = ({ value }) => (
    <Typography
        align="left"
        color="text.secondary"
        sx={{ fontSize:'12px', padding: 0, paddingLeft:'18px' }}
    >
        {value}
    </Typography>

)

export default Text;
import React from 'react';
import { Typography } from '@mui/material';

const Text = ({ value }) => (
    <Typography
        align="center"
        color="text.secondary"
        sx={{ fontSize:'12px', padding: 0 }}
    >
        {value}
    </Typography>

)

export default Text;
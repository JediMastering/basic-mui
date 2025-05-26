import { useState, useCallback } from 'react';

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  }, []);

  const handleClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return {
    snackbar: {
      ...snackbar,
      handleClose
    },
    showSnackbar
  };
}; 
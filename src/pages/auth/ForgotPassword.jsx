import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Link as MuiLink, Snackbar, Alert } from 'framework/mui';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import { apiRequest } from '../../framework/utils/connections';

const validationSchema = yup.object().shape({
  email: yup.string().email('Formato de e-mail inválido').required('E-mail é obrigatório'),
});

const ForgotPassword = () => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
    },
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      const response = await apiRequest({ url: 'api/forgot-password', method: 'POST', data });
      showSnackbar(
        response.message || 'Se um usuário com este e-mail existir em nosso sistema, um link para redefinição de senha foi enviado.',
        'success'
      );
      reset(); // Clear the form after successful submission
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      if (error.response && error.response.data && error.response.data.message) {
        showSnackbar(error.response.data.message, 'error');
      } else {
        showSnackbar('Erro ao solicitar redefinição de senha. Tente novamente.', 'error');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 2,
        backgroundColor: 'background.default',
      }}
    >
      <Box
        sx={{
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Esqueci minha senha
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Informe seu e-mail para receber um link de redefinição de senha.
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="E-mail"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
          >
            Enviar link de redefinição
          </Button>
          <MuiLink component={RouterLink} to="/" variant="body2" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
            Voltar para o login
          </MuiLink>
        </form>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;

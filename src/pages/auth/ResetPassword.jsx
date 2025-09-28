import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, Link as MuiLink, Snackbar, Alert } from 'framework/mui';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../../framework/utils/connections';

const validationSchema = yup.object().shape({
  newPassword: yup.string().min(8, 'A senha deve ter no mínimo 8 caracteres').required('Nova senha é obrigatória'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'As senhas não conferem')
    .required('Confirmação de senha é obrigatória'),
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
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

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      showSnackbar('Link inválido. Token não encontrado.', 'error');
      // Optionally redirect to forgot password page after a delay
      // setTimeout(() => navigate('/forgot-password'), 3000);
    }
  }, [token, showSnackbar, navigate]);

  const onSubmit = async (data) => {
    if (!token) {
      showSnackbar('Link inválido. Token não encontrado.', 'error');
      return;
    }

    try {
      await apiRequest({
        url: 'api/reset-password',
        method: 'POST',
        data: {
          token: token,
          newPassword: data.newPassword,
        },
      });
      showSnackbar('Sua senha foi redefinida com sucesso!', 'success');
      setTimeout(() => navigate('/'), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      if (error.response && error.response.data && error.response.data.message) {
        showSnackbar(error.response.data.message, 'error');
      } else {
        showSnackbar('Erro ao redefinir senha. Tente novamente.', 'error');
      }
      // Offer a link to request a new password reset link
      // You might want to display a button for this
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
          Redefinir Senha
        </Typography>
        {!token && (
          <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
            Link inválido. Por favor, solicite um novo link.
            <MuiLink component={RouterLink} to="/forgot-password" variant="body2" sx={{ display: 'block', mt: 1 }}>
              Solicitar novo link
            </MuiLink>
          </Typography>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nova Senha"
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                autoComplete="new-password"
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirmar Nova Senha"
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                autoComplete="new-password"
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
            disabled={!token}
          >
            Salvar nova senha
          </Button>
          {errors.root && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
              {errors.root.message}
            </Typography>
          )}
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

export default ResetPassword;

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box
} from 'framework/mui';
import { useForm } from 'react-hook-form';
import { apiRequest } from '../../utils/connections';
import { useSnackbar } from '../../hooks/useSnackbar';

const BaseFormModal = ({
  open,
  onClose,
  onSuccess,
  title,
  submitUrl,
  method: methodProp = 'POST',
  initialValues = {},
  children,
  validationSchema,
}) => {
  const { handleSubmit, control, reset, setError } = useForm({
    defaultValues: initialValues,
    resolver: validationSchema,
    mode: 'onChange'
  });

  const { showSnackbar } = useSnackbar();

  const prevOpenRef = React.useRef(open);
  const prevInitialValuesRef = React.useRef(initialValues);

  React.useEffect(() => {
    if (
      (!prevOpenRef.current && open) ||
      JSON.stringify(prevInitialValuesRef.current) !== JSON.stringify(initialValues)
    ) {
      reset(initialValues);
    }
    
    prevOpenRef.current = open;
    prevInitialValuesRef.current = initialValues;
  }, [open, initialValues, reset]);

  const onSubmit = async (data) => {
    try {
      const method = data.id ? 'PUT' : methodProp;
      await apiRequest({ url: submitUrl, method, data });
      onSuccess?.();
      onClose();
    } catch (error) {
      let message = 'Erro ao enviar formulário.';
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        if (responseData.detail) {
          message = responseData.detail;
        } else if (responseData.message) {
          message = responseData.message;
        }
        
        if (responseData.errors) {
          Object.entries(responseData.errors).forEach(([field, errors]) => {
            setError(field, {
              type: 'manual',
              message: errors.join(', '),
            });
          });
        }
      }
      showSnackbar(message, 'error');
      console.error('Erro ao enviar formulário:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {typeof children === 'function' ? children(control) : children}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BaseFormModal;
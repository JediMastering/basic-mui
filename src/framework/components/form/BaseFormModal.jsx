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
  const { handleSubmit, control, reset } = useForm({
    defaultValues: initialValues,
    resolver: validationSchema,
    mode: 'onChange'
  });

  const prevOpenRef = React.useRef(open);
  const prevInitialValuesRef = React.useRef(initialValues);

  React.useEffect(() => {
    // Only reset if the modal is opening (was closed and now is open)
    // or if initialValues have changed
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
      // Se temos um ID nos dados, significa que estamos editando, então usamos PUT
      const method = data.id ? 'PUT' : methodProp;
      await apiRequest({ url: submitUrl, method, data, useMock: true });
      onSuccess?.();
      onClose();
    } catch (error) {
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
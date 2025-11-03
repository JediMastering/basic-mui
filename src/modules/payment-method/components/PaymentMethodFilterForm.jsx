import React, { forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Box, FormControlLabel, Checkbox, Typography, FormGroup } from 'framework/mui';

const EMPTY_VALUES = {
  q: '',
  description: '',
  showActive: true,
  showInactive: false,
};

const PaymentMethodFilterForm = forwardRef(({ defaultValues, onFilter, id }, ref) => {
  const { register, handleSubmit, reset, getValues, control } = useForm({
    defaultValues: defaultValues || EMPTY_VALUES
  });

  React.useEffect(() => {
    reset(defaultValues || EMPTY_VALUES);
  }, [defaultValues, reset]);

  // Expose reset method to parent component
  React.useImperativeHandle(ref, () => ({
    clearAndResetForm: () => {
      reset(EMPTY_VALUES);
    },
    getValues: getValues,
  }));

  const handleFormSubmit = (data) => {
    // Garante que os valores booleanos estão corretos
    const processedData = {
      ...data,
      showActive: Boolean(data.showActive),
      showInactive: Boolean(data.showInactive),
    };
    onFilter(processedData);
  };

  return (
    <form id={id} onSubmit={handleSubmit(handleFormSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
        <TextField
          label="Nome"
          variant="outlined"
          size="small"
          fullWidth
          {...register('q')}
        />

        <TextField
          label="Descrição"
          variant="outlined"
          size="small"
          fullWidth
          {...register('description')}
        />

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Status
          </Typography>
          <FormGroup>
            <Controller
              name="showActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(field.value)}
                      onChange={(e) => field.onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Ativo"
                />
              )}
            />
            <Controller
              name="showInactive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(field.value)}
                      onChange={(e) => field.onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Inativo"
                />
              )}
            />
          </FormGroup>
        </Box>
      </Box>
    </form>
  );
});

export default PaymentMethodFilterForm;

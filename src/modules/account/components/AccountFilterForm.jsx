import React, { forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from 'framework/mui';
import { ACCOUNT_TYPES } from '../validation/accountValidation';

const EMPTY_VALUES = {
  q: '',
  type: '',
  showActive: true,
  showInactive: false,
};

const AccountFilterForm = forwardRef(({ defaultValues, onFilter, id }, ref) => {
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

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Conta</InputLabel>
              <Select
                {...field}
                label="Tipo de Conta"
              >
                <MenuItem value="">Todos</MenuItem>
                {ACCOUNT_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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

export default AccountFilterForm;

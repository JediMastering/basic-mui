import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Stack, FormControlLabel, Switch, FormHelperText } from 'framework/mui';
import { Controller } from 'react-hook-form';

/**
 * PaymentMethodForm Fields
 * Renders the input fields for the payment method form.
 * Props are passed down from a parent form component that uses react-hook-form.
 *  - register: RHF register function
 *  - errors: RHF errors object
 *  - control: RHF control for Controller
 */
export default function PaymentMethodForm({ register, errors, control }) {
  return (
    <Stack spacing={2} pt={1}>
      <TextField
        label="Nome"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        autoFocus
      />

      <TextField
        label="Descrição"
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
        multiline
        rows={3}
      />

      <Controller
        name="fgActive"
        control={control}
        render={({ field }) => (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  color="primary"
                />
              }
              label="Ativo"
            />
            {errors.fgActive && (
              <FormHelperText error>{errors.fgActive?.message}</FormHelperText>
            )}
          </>
        )}
      />
    </Stack>
  );
}

PaymentMethodForm.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  control: PropTypes.object.isRequired,
};

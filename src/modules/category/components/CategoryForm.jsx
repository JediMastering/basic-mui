import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Stack } from 'framework/mui';

/**
 * CategoryForm Fields
 * Renders the input fields for the category form.
 * Props are passed down from a parent form component that uses react-hook-form.
 *  - register: RHF register function
 *  - errors: RHF errors object
 */
export default function CategoryForm({ register, errors }) {
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
    </Stack>
  );
}

CategoryForm.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

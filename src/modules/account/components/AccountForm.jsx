import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from 'framework/mui';
import { Controller } from 'react-hook-form';
import { ACCOUNT_TYPES } from '../validation/accountValidation';

/**
 * AccountForm Fields
 * Renders the input fields for the account form.
 * Props are passed down from a parent form component that uses react-hook-form.
 *  - register: RHF register function
 *  - errors: RHF errors object
 *  - control: RHF control for Controller
 *  - isEdit: boolean indicating if this is an edit form (to disable initialBalance field)
 */
export default function AccountForm({ register, errors, control, isEdit = false }) {
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

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>Tipo de Conta</InputLabel>
            <Select
              {...field}
              label="Tipo de Conta"
            >
              {ACCOUNT_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {errors.type && (
              <FormHelperText>{errors.type?.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <TextField
        label="Saldo Inicial"
        {...register('initialBalance')}
        error={!!errors.initialBalance}
        helperText={
          isEdit
            ? 'Saldo inicial não pode ser alterado após criação'
            : errors.initialBalance?.message
        }
        fullWidth
        type="number"
        inputProps={{
          step: '0.01',
          min: '0'
        }}
        disabled={isEdit}
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
    </Stack>
  );
}

AccountForm.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  control: PropTypes.object.isRequired,
  isEdit: PropTypes.bool,
};

import React from 'react';
import { TextField } from 'framework/mui';
import { Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BaseFormModal from '../../framework/components/form/BaseFormModal';

const validationSchema = yup.object().shape({
  username: yup.string().required('Username é obrigatório'),
  password: yup.string().required('Password é obrigatório'),
});

const UserForm = ({ open, onClose, onSuccess, submitUrl, initialValues, method }) => {
  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
      title={initialValues?.id ? 'Editar Usuário' : 'Novo Usuário'}
      submitUrl={submitUrl}
      method={method}
      initialValues={initialValues}
      validationSchema={yupResolver(validationSchema)}
    >
      {(control) => (
        <>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Username"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </>
      )}
    </BaseFormModal>
  );
};

export default UserForm; 
import React from 'react';
import { TextField } from 'framework/mui';
import { Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BaseFormModal from '../../framework/components/form/BaseFormModal';

const validationSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  role: yup.string().required('Role é obrigatório')
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
            name="name"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Nome"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="role"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Role"
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
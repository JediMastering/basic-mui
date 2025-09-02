import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl, Chip, Box } from 'framework/mui';
import { Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BaseFormModal from '../../framework/components/form/BaseFormModal';
import { apiRequest } from '../../framework/utils/connections';

const validationSchema = yup.object().shape({
  username: yup.string().min(5, 'Username deve ter no mínimo 5 caracteres').required('Username é obrigatório'),
  password: yup.string().min(8, 'Password deve ter no mínimo 8 caracteres').required('Password é obrigatório'),
  accessGroupIds: yup.array().min(1, 'Selecione pelo menos um grupo de acesso'),
});

const UserForm = ({ open, onClose, onSuccess, submitUrl, initialValues, method }) => {
  const [accessGroups, setAccessGroups] = useState([]);

  useEffect(() => {
    if (open) {
      apiRequest({ url: 'access-groups', method: 'GET', useMock: true }).then((data) => {
        setAccessGroups(data.content);
      });
    }
  }, [open]);

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
          <FormControl fullWidth>
            <InputLabel id="access-group-label">Grupos de Acesso</InputLabel>
            <Controller
              name="accessGroupIds"
              control={control}
              defaultValue={[]}
              render={({ field, fieldState: { error } }) => (
                <Select
                  {...field}
                  labelId="access-group-label"
                  multiple
                  label="Grupos de Acesso"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const group = accessGroups.find((g) => g.id === value);
                        return <Chip key={value} label={group?.name || value} />;
                      })}
                    </Box>
                  )}
                  error={!!error}
                >
                  {accessGroups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </>
      )}
    </BaseFormModal>
  );
};

export default UserForm; 
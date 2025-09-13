import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl, Chip, Box } from 'framework/mui';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BaseFormModal from '../../framework/components/form/BaseFormModal';
import { apiRequest } from '../../framework/utils/connections';

const validationSchema = yup.object().shape({
  username: yup.string().min(5, 'Username deve ter no mínimo 5 caracteres').required('Username é obrigatório'),
  password: yup.string().min(8, 'Password deve ter no mínimo 8 caracteres').required('Password é obrigatório'),
  accessGroupIds: yup.array(),
});

const UserForm = ({ open, onClose, onSuccess, submitUrl, initialValues, method }) => {
  const [accessGroups, setAccessGroups] = useState([]);
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: '',
      password: '',
      accessGroupIds: [],
    },
  });

  const onSubmit = async (data) => {
    try {
      const reqMethod = initialValues?.id ? 'PUT' : method;
      const url = initialValues?.id ? `${submitUrl}` : submitUrl;
      await apiRequest({ url, method: reqMethod, data });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  useEffect(() => {
    if (open) {
      apiRequest({ url: 'access-groups/all', method: 'GET', useMock: false }).then((data) => {
        setAccessGroups(data);
        const formValues = initialValues
          ? { ...initialValues, accessGroupIds: initialValues.accessGroupIds || [] }
          : { username: '', password: '', accessGroupIds: [] };
        reset(formValues);
      });
    }
  }, [open, initialValues, reset]);

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      title={initialValues?.id ? 'Editar Usuário' : 'Novo Usuário'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <>
        <Controller
          name="username"
          control={control}
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
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                labelId="access-group-label"
                multiple
                label="Grupos de Acesso"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const group = accessGroups.find((g) => g.id == value);
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
    </BaseFormModal>
  );
};

export default UserForm; 
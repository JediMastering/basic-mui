import React, { forwardRef, useImperativeHandle } from 'react';
import { TextField, Stack } from 'framework/mui';
import { useForm } from 'react-hook-form';

const EMPTY_VALUES = {
  name: '',
  email: '',
  role: ''
};

const UserFilterForm = forwardRef(({ defaultValues, onFilter, id }, ref) => {
  const { register, reset, getValues } = useForm({
    defaultValues: defaultValues || EMPTY_VALUES
  });

  React.useEffect(() => {
    reset(defaultValues || EMPTY_VALUES);
  }, [defaultValues, reset]);

  useImperativeHandle(ref, () => ({
    reset: () => reset(EMPTY_VALUES),
    getValues
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onFilter) {
      onFilter();
    }
  };

  return (
    <form id={id} onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Nome"
          variant="outlined"
          size="small"
          fullWidth
          {...register('name')}
        />
        <TextField
          label="E-mail"
          variant="outlined"
          size="small"
          fullWidth
          {...register('email')}
        />
        <TextField
          label="Função"
          variant="outlined"
          size="small"
          fullWidth
          {...register('role')}
        />
      </Stack>
    </form>
  );
});

export default UserFilterForm; 
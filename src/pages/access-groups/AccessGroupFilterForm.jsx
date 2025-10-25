import React, { forwardRef, useImperativeHandle } from 'react';
import { TextField, Stack } from 'framework/mui';
import { useForm } from 'react-hook-form';

const EMPTY_VALUES = {
  name: ''
};

const AccessGroupFilterForm = forwardRef(({ defaultValues, onFilter, id }, ref) => {
  const { register, reset, getValues, handleSubmit } = useForm({
    defaultValues: defaultValues || EMPTY_VALUES
  });

  React.useEffect(() => {
    reset(defaultValues || EMPTY_VALUES);
  }, [defaultValues, reset]);

  useImperativeHandle(ref, () => ({
    reset: () => reset(EMPTY_VALUES),
    getValues
  }));

  return (
    <form id={id} onSubmit={handleSubmit(onFilter)}>
      <Stack spacing={2}>
        <TextField
          label="Nome do Grupo"
          variant="outlined"
          size="small"
          fullWidth
          {...register('name')}
        />
      </Stack>
    </form>
  );
});

export default AccessGroupFilterForm;

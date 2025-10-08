
import React, { forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, FormControlLabel, Checkbox, Box } from 'framework/mui';

const EMPTY_VALUES = {
  q: '',
  includeInactive: false,
};

const CategoryFilterForm = forwardRef(({ defaultValues, onFilter, id }, ref) => {
  const { register, handleSubmit, reset, getValues, control } = useForm({ defaultValues });

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

  return (
    <form id={id} onSubmit={handleSubmit(onFilter)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          fullWidth
          {...register('q')}
        />
        <FormControlLabel
          control={
            <Controller
              name="includeInactive"
              control={control}
              render={({ field }) => <Checkbox {...field} checked={field.value} />}
            />
          }
          label="Include Inactive"
        />
      </Box>
    </form>
  );
});

export default CategoryFilterForm;

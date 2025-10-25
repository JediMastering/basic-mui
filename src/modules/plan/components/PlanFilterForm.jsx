import React, { forwardRef, useImperativeHandle } from "react";
import TextField from "../../../framework/components/inputs/TextField";
import Stack from "../../../framework/components/layout/Stack";
import Checkbox from "../../../framework/components/inputs/Checkbox";
import FormControlLabel from "../../../framework/components/inputs/FormControlLabel";
import { useForm, Controller } from "react-hook-form";

const EMPTY_VALUES = {
  name: "",
  includeInactive: false,
};

const PlanFilterForm = forwardRef(({ defaultValues, onFilter, id }, ref) => {
  const { register, reset, getValues, control, handleSubmit } = useForm({
    defaultValues: defaultValues || EMPTY_VALUES,
  });

  React.useEffect(() => {
    reset(defaultValues || EMPTY_VALUES);
  }, [defaultValues, reset]);

  useImperativeHandle(ref, () => ({
    reset: () => reset(EMPTY_VALUES),
    getValues,
  }));

  return (
    <form id={id} onSubmit={handleSubmit(onFilter)}>
      <Stack spacing={2}>
        <TextField
          label="Nome do Plano"
          variant="outlined"
          size="small"
          fullWidth
          {...register("name")}
        />
        <Controller
          name="includeInactive"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  color="primary"
                />
              }
              label="Incluir Inativos"
            />
          )}
        />
      </Stack>
    </form>
  );
});

export default PlanFilterForm;
import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "../../../framework/components/inputs/TextField";
import Checkbox from "../../../framework/components/inputs/Checkbox";
import FormControlLabel from "../../../framework/components/inputs/FormControlLabel";
import Box from "../../../framework/components/layout/Box";
import { planValidationSchema } from "../validation/planValidation";

export const PlanForm = forwardRef(({ onSubmit, initialData, isEditMode }, ref) => {
  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(planValidationSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: "",
      features: "",
      fgActive: true,
    },
  });

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit(handleFormSubmit),
  }));

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        price: initialData.price !== undefined && initialData.price !== null ? String(initialData.price) : "",
      });
    } else {
      reset({
        name: "",
        description: "",
        price: "",
        features: "",
        fgActive: true,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    const dataToSend = {
      ...data,
      price: data.price !== "" ? parseFloat(data.price) : null,
    };
    onSubmit(dataToSend);
  };

  return (
    <Box
      component="form"
      noValidate
      sx={{ mt: 1 }}
    >
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome do Plano"
            autoFocus
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            id="description"
            label="Descrição"
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        )}
      />
      <Controller
        name="price"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            id="price"
            label="Preço"
            type="number"
            error={!!errors.price}
            helperText={errors.price?.message}
          />
        )}
      />
      <Controller
        name="features"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            id="features"
            label="Funcionalidades (separadas por vírgula)"
            error={!!errors.features}
            helperText={errors.features?.message}
          />
        )}
      />
      <Controller
        name="fgActive"
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
            label="Ativo"
          />
        )}
      />
    </Box>
  );
});
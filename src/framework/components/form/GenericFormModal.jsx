import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { requestBackend } from "../../utils/connections";

// Gera schema Yup a partir do JSON
const generateYupSchema = (schema) => {
  const shape = {};
  schema.forEach((field) => {
    let validator;
    switch (field.type) {
      case "number":
        validator = yup
          .number()
          .typeError("Deve ser um número");
        if (field.min != null)
          validator = validator.min(field.min, `Mínimo ${field.min}`);
        if (field.max != null)
          validator = validator.max(field.max, `Máximo ${field.max}`);
        break;
      case "email":
        validator = yup.string().email("Email inválido");
        break;
      case "file":
        validator = yup
          .mixed()
          .test("fileRequired", "Arquivo obrigatório", function (value) {
            if (field.required) {
              return value && value.length > 0;
            }
            return true;
          });
        break;
      default:
        validator = yup.string();
    }
    if (field.required && field.type !== "file") {
      validator = validator.required("Campo obrigatório");
    }
    shape[field.name] = validator;
  });
  return yup.object().shape(shape);
};

const GenericFormModal = ({
  open,
  onClose,
  title,
  formSchema,
  submitUrl,
  method = "POST",
  initialValues = {},
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const validationSchema = useMemo(() => generateYupSchema(formSchema), [formSchema]);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const hasFile = formSchema.some((f) => f.type === "file");
      let payload;

      if (hasFile) {
        payload = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value instanceof FileList || Array.isArray(value)) {
            Array.from(value).forEach((file) => payload.append(key, file));
          } else {
            payload.append(key, value);
          }
        });
      } else {
        payload = data;
      }

      const urlTeste = 'api/users';
      await requestBackend(
        urlTeste,
        'POST',
        data
      );

      await axios({
        method,
        url: submitUrl,
        data: payload,
        headers: hasFile ? { "Content-Type": "multipart/form-data" } : undefined
      });

      onSuccess?.();
      onClose();
      reset();
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        Object.entries(backendErrors).forEach(([field, message]) => {
          setError(field, { type: "manual", message });
        });
      } else {
        console.error("Erro ao enviar:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title || "Formulário"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          {formSchema.map((field) => (
            <Controller
              key={field.name}
              name={field.name}
              control={control}
              defaultValue={initialValues[field.name] || (field.type === "file" && field.multiple ? [] : "")}
              render={({ field: controllerField }) => {
                if (field.type === "file") {
                  return (
                    <div style={{ marginTop: 16 }}>
                      <label>{field.label}</label>
                      <input
                        type="file"
                        multiple={field.multiple}
                        onChange={(e) => controllerField.onChange(e.target.files)}
                        style={{ display: "block", marginTop: 8 }}
                      />
                      {errors[field.name]?.message && (
                        <div style={{ color: "red", fontSize: 12 }}>{errors[field.name]?.message}</div>
                      )}
                    </div>
                  );
                }

                const commonProps = {
                  ...controllerField,
                  fullWidth: true,
                  margin: "normal",
                  label: field.label,
                  error: !!errors[field.name],
                  helperText: errors[field.name]?.message,
                  ...field.props
                };

                switch (field.type) {
                  case "select":
                    return (
                      <TextField select {...commonProps}>
                        {field.options?.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    );
                  case "textarea":
                    return <TextField {...commonProps} multiline rows={field.rows || 4} />;
                  case "date":
                    return <TextField {...commonProps} type="date" InputLabelProps={{ shrink: true }} />;
                  default:
                    return <TextField value={'teste'} {...commonProps} type={field.type || "text"} />;
                }
              }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Salvar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GenericFormModal;
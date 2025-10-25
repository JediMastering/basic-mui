import * as yup from "yup";

export const planValidationSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório").max(50, "Nome deve ter no máximo 50 caracteres"),
  description: yup.string().nullable(),
  price: yup.number().nullable().transform((value, originalValue) =>
    String(originalValue).trim() === "" ? null : value
  ).typeError("Preço deve ser um número"),
  features: yup.string().nullable(),
  fgActive: yup.boolean().nullable(),
});
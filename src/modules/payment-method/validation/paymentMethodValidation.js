import * as yup from 'yup';

export const createOrUpdateSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),

  description: yup
    .string()
    .trim()
    .max(255, 'Descrição deve ter no máximo 255 caracteres')
    .nullable()
    .transform((value, originalValue) => {
      // Transforma string vazia em null
      return originalValue === '' ? null : value;
    }),

  fgActive: yup
    .boolean()
    .required('Status ativo/inativo é obrigatório'),
});

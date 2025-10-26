import * as yup from 'yup';

export const createOrUpdateSchema = yup.object({
  name: yup.string().trim().required('Nome é obrigatório').min(2, 'Nome deve ter no mínimo 2 caracteres'),
});

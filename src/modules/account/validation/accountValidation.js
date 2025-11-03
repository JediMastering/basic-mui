import * as yup from 'yup';

export const ACCOUNT_TYPES = [
  { value: 'CORRENTE', label: 'Conta Corrente' },
  { value: 'POUPANCA', label: 'Poupança' },
  { value: 'INVESTIMENTO', label: 'Investimento' },
  { value: 'DINHEIRO', label: 'Dinheiro' },
  { value: 'OUTRO', label: 'Outro' },
];

export const createOrUpdateSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  type: yup
    .string()
    .required('Tipo é obrigatório')
    .oneOf(
      ACCOUNT_TYPES.map(t => t.value),
      'Tipo de conta inválido'
    ),

  initialBalance: yup
    .number()
    .required('Saldo inicial é obrigatório')
    .min(0, 'Saldo inicial não pode ser negativo')
    .typeError('Saldo inicial deve ser um número'),

  description: yup
    .string()
    .trim()
    .max(255, 'Descrição deve ter no máximo 255 caracteres')
    .nullable()
    .transform((value, originalValue) => {
      // Transforma string vazia em null
      return originalValue === '' ? null : value;
    }),
});

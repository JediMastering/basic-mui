import * as yup from 'yup';

export const TRANSACTION_TYPES = [
  { value: 'RECEITA', label: 'Receita' },
  { value: 'DESPESA', label: 'Despesa' },
];

export const TRANSACTION_STATUS = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PAGO', label: 'Pago' },
  { value: 'RECEBIDO', label: 'Recebido' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

export const createOrUpdateSchema = yup.object({
  type: yup
    .string()
    .required('Tipo é obrigatório')
    .oneOf(
      TRANSACTION_TYPES.map(t => t.value),
      'Tipo de transação inválido'
    ),

  name: yup
    .string()
    .trim()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  description: yup
    .string()
    .trim()
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),

  issueDate: yup
    .date()
    .required('Data de emissão é obrigatória')
    .typeError('Data de emissão inválida'),

  dueDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .typeError('Data de vencimento inválida'),

  paymentDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .typeError('Data de pagamento inválida'),

  amount: yup
    .number()
    .required('Valor é obrigatório')
    .min(0.01, 'Valor deve ser maior que zero')
    .typeError('Valor deve ser um número'),

  adjustment: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .typeError('Ajuste deve ser um número'),

  categoryId: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .typeError('Categoria inválida'),

  paymentMethodId: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .typeError('Método de pagamento inválido'),

  accountId: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .typeError('Conta inválida'),

  recipientName: yup
    .string()
    .trim()
    .max(120, 'Nome do destinatário deve ter no máximo 120 caracteres')
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),

  status: yup
    .string()
    .required('Status é obrigatório')
    .oneOf(
      TRANSACTION_STATUS.map(s => s.value),
      'Status inválido'
    ),

  notes: yup
    .string()
    .trim()
    .max(5000, 'Observações devem ter no máximo 5000 caracteres')
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),
});

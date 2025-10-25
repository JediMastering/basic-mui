import * as yup from 'yup';

export const userValidationSchema = yup.object().shape({
  username: yup.string().min(5, 'Username deve ter no mínimo 5 caracteres').required('Username é obrigatório'),
  email: yup.string().email('Formato de email inválido').required('Email é obrigatório'),
  password: yup
    .string()
    .transform(value => (value === '' ? undefined : value))
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .optional(),
  passwordConfirmation: yup
    .string()
    .transform(value => (value === '' ? undefined : value))
    .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais')
    .when('password', {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.required('A confirmação da senha é obrigatória'),
      otherwise: (schema) => schema.optional(),
    }),
  accessGroupIds: yup.array(),
  photo: yup.string().nullable(),
});
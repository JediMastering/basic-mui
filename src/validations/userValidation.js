import * as yup from 'yup';

export const userValidationSchema = yup.object().shape({
  username: yup.string().min(5, 'Username deve ter no mínimo 5 caracteres').required('Username é obrigatório'),
  email: yup.string().email('Formato de email inválido').required('Email é obrigatório'),
  password: yup.string().min(8, 'Password deve ter no mínimo 8 caracteres').required('Password é obrigatório'),
  accessGroupIds: yup.array(),
  photo: yup.string().nullable(),
});
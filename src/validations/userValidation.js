import * as yup from 'yup';

export const userValidationSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  role: yup.string().required('Role é obrigatório')
});

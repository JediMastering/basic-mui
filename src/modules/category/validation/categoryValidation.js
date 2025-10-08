import * as yup from 'yup';

export const createOrUpdateSchema = yup.object({
  name: yup.string().trim().required('Name is required').min(2, 'Too short'),
});

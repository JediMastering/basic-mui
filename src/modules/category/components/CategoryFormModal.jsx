
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BaseFormModal from '../../../framework/components/form/BaseFormModal';
import CategoryForm from './CategoryForm';
import * as validation from '../validation/categoryValidation';
import { apiRequest } from '../../../framework/utils/connections';

const CategoryFormModal = ({
  open,
  onClose,
  onSuccess,
  initialValues,
}) => {
  const isEdit = !!initialValues?.id;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues || { name: '' },
    resolver: yupResolver(validation.createOrUpdateSchema),
  });

  const onSubmit = async (data) => {
    try {
      const requestConfig = {
        url: isEdit ? `api/categories/${initialValues.id}` : 'api/categories',
        method: isEdit ? 'PUT' : 'POST',
        data,
      };
      await apiRequest(requestConfig);
      onSuccess();
    } catch (error) {
      console.error('Failed to save category', error);
      // You can add snackbar error feedback here
    }
  };

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Category' : 'New Category'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <CategoryForm register={register} errors={errors} />
    </BaseFormModal>
  );
};

export default CategoryFormModal;

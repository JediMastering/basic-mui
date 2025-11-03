import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BaseFormModal from '../../../framework/components/form/BaseFormModal';
import AccountForm from './AccountForm';
import * as validation from '../validation/accountValidation';
import { apiRequest } from '../../../framework/utils/connections';

const AccountFormModal = ({
  open,
  onClose,
  onSuccess,
  initialValues,
}) => {
  const isEdit = !!initialValues?.id;
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: initialValues || {
      name: '',
      type: 'CORRENTE',
      initialBalance: 0,
      description: ''
    },
    resolver: yupResolver(validation.createOrUpdateSchema),
  });

  const onSubmit = async (data) => {
    try {
      // Get userId from token
      const token = localStorage.getItem('accessToken');
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const userId = decoded.userId || decoded.sub || decoded.id;

      const requestConfig = {
        url: isEdit ? `api/v1/accounts/${initialValues.id}` : 'api/v1/accounts',
        method: isEdit ? 'PUT' : 'POST',
        data,
        params: { userId }
      };
      await apiRequest(requestConfig);
      onSuccess();
    } catch (error) {
      console.error('Failed to save account', error);
      // You can add snackbar error feedback here
    }
  };

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar Conta' : 'Nova Conta'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AccountForm
        register={register}
        errors={errors}
        control={control}
        isEdit={isEdit}
      />
    </BaseFormModal>
  );
};

export default AccountFormModal;

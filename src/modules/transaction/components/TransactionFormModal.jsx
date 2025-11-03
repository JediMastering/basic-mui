import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BaseFormModal from '../../../framework/components/form/BaseFormModal';
import TransactionForm from './TransactionForm';
import * as validation from '../validation/transactionValidation';
import { apiRequest } from '../../../framework/utils/connections';

const TransactionFormModal = ({
  open,
  onClose,
  onSuccess,
  initialValues,
}) => {
  const isEdit = !!initialValues?.id;

  // Format dates for the form (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const defaultValues = initialValues
    ? {
        ...initialValues,
        issueDate: formatDateForInput(initialValues.issueDate),
        dueDate: formatDateForInput(initialValues.dueDate),
        paymentDate: formatDateForInput(initialValues.paymentDate),
        categoryId: initialValues.categoryId || '',
        paymentMethodId: initialValues.paymentMethodId || '',
        accountId: initialValues.accountId || '',
        adjustment: initialValues.adjustment || '',
        recipientName: initialValues.recipientName || '',
        notes: initialValues.notes || '',
        description: initialValues.description || '',
      }
    : {
        type: 'DESPESA',
        name: '',
        description: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        paymentDate: '',
        amount: '',
        adjustment: '',
        categoryId: '',
        paymentMethodId: '',
        accountId: '',
        recipientName: '',
        status: 'PENDENTE',
        notes: '',
      };

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues,
    resolver: yupResolver(validation.createOrUpdateSchema),
  });

  const onSubmit = async (data) => {
    try {
      // Get userId from token
      const token = localStorage.getItem('accessToken');
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const userId = decoded.userId || decoded.sub || decoded.id;

      // Clean up empty values
      const cleanedData = {
        ...data,
        categoryId: data.categoryId || null,
        paymentMethodId: data.paymentMethodId || null,
        accountId: data.accountId || null,
        adjustment: data.adjustment || null,
        recipientName: data.recipientName || null,
        notes: data.notes || null,
        description: data.description || null,
        dueDate: data.dueDate || null,
        paymentDate: data.paymentDate || null,
      };

      const requestConfig = {
        url: isEdit ? `api/v1/transactions/${initialValues.id}` : 'api/v1/transactions',
        method: isEdit ? 'PUT' : 'POST',
        data: cleanedData,
        params: { userId }
      };
      await apiRequest(requestConfig);
      onSuccess();
    } catch (error) {
      console.error('Failed to save transaction', error);
      // You can add snackbar error feedback here
    }
  };

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar Transação' : 'Nova Transação'}
      onSubmit={handleSubmit(onSubmit)}
      maxWidth="md"
    >
      <TransactionForm
        register={register}
        errors={errors}
        control={control}
        watch={watch}
      />
    </BaseFormModal>
  );
};

export default TransactionFormModal;

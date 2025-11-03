import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BaseFormModal from '../../../framework/components/form/BaseFormModal';
import PaymentMethodForm from './PaymentMethodForm';
import * as validation from '../validation/paymentMethodValidation';
import { apiRequest } from '../../../framework/utils/connections';

const PaymentMethodFormModal = ({
  open,
  onClose,
  onSuccess,
  initialValues,
}) => {
  const isEdit = !!initialValues?.id;
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: initialValues || { name: '', description: '', fgActive: true },
    resolver: yupResolver(validation.createOrUpdateSchema),
  });

  const onSubmit = async (data) => {
    try {
      const requestConfig = {
        url: isEdit ? `api/v1/payment-methods/${initialValues.id}` : 'api/v1/payment-methods',
        method: isEdit ? 'PUT' : 'POST',
        data,
      };
      await apiRequest(requestConfig);
      onSuccess();
    } catch (error) {
      console.error('Failed to save payment method', error);
      // You can add snackbar error feedback here
    }
  };

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar Método de Pagamento' : 'Novo Método de Pagamento'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <PaymentMethodForm register={register} errors={errors} control={control} />
    </BaseFormModal>
  );
};

export default PaymentMethodFormModal;

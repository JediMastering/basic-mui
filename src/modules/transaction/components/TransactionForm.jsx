import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid2
} from 'framework/mui';
import { Controller } from 'react-hook-form';
import {
  TRANSACTION_TYPES,
  TRANSACTION_STATUS
} from '../validation/transactionValidation';
import { apiRequest } from '../../../framework/utils/connections';

/**
 * TransactionForm Fields
 * Renders the input fields for the transaction form.
 * Props are passed down from a parent form component that uses react-hook-form.
 */
export default function TransactionForm({ register, errors, control, watch }) {
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Watch userId to get it from token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.userId || decoded.sub || decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRelatedData = async () => {
      const userId = getUserIdFromToken();
      setLoading(true);
      try {
        // Fetch categories, payment methods, and accounts in parallel
        const [categoriesData, paymentMethodsData, accountsData] = await Promise.all([
          apiRequest({ url: 'api/categories', params: { includeInactive: false } }),
          apiRequest({ url: 'api/v1/payment-methods', params: { fgActive: true } }),
          apiRequest({ url: 'api/v1/accounts', params: { userId, fgActive: true } }),
        ]);

        setCategories(categoriesData.content || []);
        setPaymentMethods(paymentMethodsData.content || []);
        setAccounts(accountsData.content || []);
      } catch (error) {
        console.error('Error fetching related data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedData();
  }, []);

  return (
    <Stack spacing={2} pt={1}>
      <Grid2 container spacing={2}>
        {/* Tipo e Status */}
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Tipo</InputLabel>
                <Select {...field} label="Tipo">
                  {TRANSACTION_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <FormHelperText>{errors.type?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select {...field} label="Status">
                  {TRANSACTION_STATUS.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && (
                  <FormHelperText>{errors.status?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid2>
      </Grid2>

      {/* Nome */}
      <TextField
        label="Nome"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        autoFocus
      />

      {/* Descrição */}
      <TextField
        label="Descrição"
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
        multiline
        rows={2}
      />

      <Grid2 container spacing={2}>
        {/* Valor e Ajuste */}
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Valor"
            {...register('amount')}
            error={!!errors.amount}
            helperText={errors.amount?.message}
            fullWidth
            type="number"
            inputProps={{
              step: '0.01',
              min: '0.01'
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Ajuste"
            {...register('adjustment')}
            error={!!errors.adjustment}
            helperText={errors.adjustment?.message}
            fullWidth
            type="number"
            inputProps={{
              step: '0.01'
            }}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2}>
        {/* Datas */}
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Data de Emissão"
            {...register('issueDate')}
            error={!!errors.issueDate}
            helperText={errors.issueDate?.message}
            fullWidth
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Data de Vencimento"
            {...register('dueDate')}
            error={!!errors.dueDate}
            helperText={errors.dueDate?.message}
            fullWidth
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Data de Pagamento"
            {...register('paymentDate')}
            error={!!errors.paymentDate}
            helperText={errors.paymentDate?.message}
            fullWidth
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2}>
        {/* Categoria, Método de Pagamento e Conta */}
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.categoryId} disabled={loading}>
                <InputLabel>Categoria</InputLabel>
                <Select {...field} label="Categoria" value={field.value || ''}>
                  <MenuItem value="">Nenhuma</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && (
                  <FormHelperText>{errors.categoryId?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Controller
            name="paymentMethodId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.paymentMethodId} disabled={loading}>
                <InputLabel>Método de Pagamento</InputLabel>
                <Select {...field} label="Método de Pagamento" value={field.value || ''}>
                  <MenuItem value="">Nenhum</MenuItem>
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.id} value={method.id}>
                      {method.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.paymentMethodId && (
                  <FormHelperText>{errors.paymentMethodId?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Controller
            name="accountId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.accountId} disabled={loading}>
                <InputLabel>Conta</InputLabel>
                <Select {...field} label="Conta" value={field.value || ''}>
                  <MenuItem value="">Nenhuma</MenuItem>
                  {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.accountId && (
                  <FormHelperText>{errors.accountId?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid2>
      </Grid2>

      {/* Nome do Destinatário */}
      <TextField
        label="Nome do Destinatário"
        {...register('recipientName')}
        error={!!errors.recipientName}
        helperText={errors.recipientName?.message}
        fullWidth
      />

      {/* Observações */}
      <TextField
        label="Observações"
        {...register('notes')}
        error={!!errors.notes}
        helperText={errors.notes?.message}
        fullWidth
        multiline
        rows={3}
      />
    </Stack>
  );
}

TransactionForm.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  control: PropTypes.object.isRequired,
  watch: PropTypes.func,
};

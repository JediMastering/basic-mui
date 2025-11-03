import React, { forwardRef, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from 'framework/mui';
import { TRANSACTION_TYPES, TRANSACTION_STATUS } from '../validation/transactionValidation';
import { apiRequest } from '../../../framework/utils/connections';

const EMPTY_VALUES = {
  q: '',
  description: '',
  type: '',
  status: '',
  startIssueDate: '',
  endIssueDate: '',
  startDueDate: '',
  endDueDate: '',
  startPaymentDate: '',
  endPaymentDate: '',
  categoryId: '',
  paymentMethodId: '',
  accountId: '',
  minAmount: '',
  maxAmount: '',
  recipientName: '',
};

const TransactionFilterForm = forwardRef(({ defaultValues, onFilter, id }, ref) => {
  const { register, handleSubmit, reset, getValues, control } = useForm({
    defaultValues: defaultValues || EMPTY_VALUES
  });

  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get userId from token
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

  React.useEffect(() => {
    reset(defaultValues || EMPTY_VALUES);
  }, [defaultValues, reset]);

  // Expose reset method to parent component
  React.useImperativeHandle(ref, () => ({
    clearAndResetForm: () => {
      reset(EMPTY_VALUES);
    },
    getValues: getValues,
  }));

  const handleFormSubmit = (data) => {
    onFilter(data);
  };

  return (
    <form id={id} onSubmit={handleSubmit(handleFormSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Busca Geral */}
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Busca
        </Typography>
        <TextField
          label="Nome"
          variant="outlined"
          size="small"
          fullWidth
          {...register('q')}
        />
        <TextField
          label="Descrição"
          variant="outlined"
          size="small"
          fullWidth
          {...register('description')}
        />
        <TextField
          label="Nome do Destinatário"
          variant="outlined"
          size="small"
          fullWidth
          {...register('recipientName')}
        />

        <Divider sx={{ my: 1 }} />

        {/* Classificação */}
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Classificação
        </Typography>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                {...field}
                label="Tipo"
              >
                <MenuItem value="">Todos</MenuItem>
                {TRANSACTION_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                {...field}
                label="Status"
              >
                <MenuItem value="">Todos</MenuItem>
                {TRANSACTION_STATUS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small" disabled={loading}>
              <InputLabel>Categoria</InputLabel>
              <Select
                {...field}
                label="Categoria"
              >
                <MenuItem value="">Todas</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Divider sx={{ my: 1 }} />

        {/* Financeiro */}
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Financeiro
        </Typography>
        <Controller
          name="paymentMethodId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small" disabled={loading}>
              <InputLabel>Método de Pagamento</InputLabel>
              <Select
                {...field}
                label="Método de Pagamento"
              >
                <MenuItem value="">Todos</MenuItem>
                {paymentMethods.map((method) => (
                  <MenuItem key={method.id} value={method.id}>
                    {method.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="accountId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small" disabled={loading}>
              <InputLabel>Conta</InputLabel>
              <Select
                {...field}
                label="Conta"
              >
                <MenuItem value="">Todas</MenuItem>
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Valor
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              label="Valor Mínimo"
              variant="outlined"
              size="small"
              type="number"
              fullWidth
              inputProps={{
                step: '0.01',
                min: '0'
              }}
              {...register('minAmount')}
            />
            <TextField
              label="Valor Máximo"
              variant="outlined"
              size="small"
              type="number"
              fullWidth
              inputProps={{
                step: '0.01',
                min: '0'
              }}
              {...register('maxAmount')}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Períodos */}
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Períodos
        </Typography>

        {/* Período de Emissão */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Data de Emissão
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              label="De"
              variant="outlined"
              size="small"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              {...register('startIssueDate')}
            />
            <TextField
              label="Até"
              variant="outlined"
              size="small"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              {...register('endIssueDate')}
            />
          </Box>
        </Box>

        {/* Período de Vencimento */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Data de Vencimento
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              label="De"
              variant="outlined"
              size="small"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              {...register('startDueDate')}
            />
            <TextField
              label="Até"
              variant="outlined"
              size="small"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              {...register('endDueDate')}
            />
          </Box>
        </Box>

        {/* Período de Pagamento */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Data de Pagamento
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              label="De"
              variant="outlined"
              size="small"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              {...register('startPaymentDate')}
            />
            <TextField
              label="Até"
              variant="outlined"
              size="small"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              {...register('endPaymentDate')}
            />
          </Box>
        </Box>
      </Box>
    </form>
  );
});

export default TransactionFilterForm;

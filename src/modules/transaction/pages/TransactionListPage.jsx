import React, { useState, useRef } from 'react';
import AppLayout from '../../../framework/layouts/AppLayout';
import CrudTable from '../../../framework/components/table/CrudTable';
import FilterSidebar from '../../../framework/components/sidebar/FilterSidebar';
import TransactionFilterForm from '../components/TransactionFilterForm';
import TransactionFormModal from '../components/TransactionFormModal';
import { Box, Chip } from 'framework/mui';
import { useExamplePage } from '../../../framework/hooks/useExamplePage';

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

/**
 * Helper to get userId from localStorage token
 */
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

const TransactionListPage = () => {
  const { sidebarConfig } = useExamplePage();
  const userId = getUserIdFromToken();

  const headerConfig = {
    title: 'Transações',
    subtitle: 'Gerencie suas receitas e despesas',
    showMenuButton: true,
  };

  const [filterValues, setFilterValues] = useState(EMPTY_VALUES);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const tableRef = useRef();
  const formRef = useRef();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const columns = [
    {
      label: 'Tipo',
      field: 'type',
      sortable: true,
      render: (value) => (
        <Chip
          label={value === 'RECEITA' ? 'Receita' : 'Despesa'}
          color={value === 'RECEITA' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      label: 'Nome',
      field: 'name',
      sortable: true,
    },
    {
      label: 'Data de Emissão',
      field: 'issueDate',
      sortable: true,
      render: formatDate,
    },
    {
      label: 'Vencimento',
      field: 'dueDate',
      sortable: true,
      render: formatDate,
    },
    {
      label: 'Valor',
      field: 'amount',
      sortable: true,
      render: formatCurrency,
    },
    {
      label: 'Total',
      field: 'total',
      sortable: true,
      render: (value) => (
        <Chip
          label={formatCurrency(value)}
          color={value >= 0 ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      label: 'Status',
      field: 'status',
      sortable: true,
      render: (value) => {
        const statusColors = {
          PENDENTE: 'warning',
          PAGO: 'success',
          RECEBIDO: 'success',
          CANCELADO: 'error'
        };
        const statusLabels = {
          PENDENTE: 'Pendente',
          PAGO: 'Pago',
          RECEBIDO: 'Recebido',
          CANCELADO: 'Cancelado'
        };
        return (
          <Chip
            label={statusLabels[value] || value}
            color={statusColors[value] || 'default'}
            size="small"
          />
        );
      },
    },
    {
      label: 'Categoria',
      field: 'categoryName',
      sortable: false,
      render: (value) => value || '-',
    },
  ];

  const handleFilter = (values) => {
    console.log('🔍 Valores recebidos do filtro:', values);

    // Processa os filtros, removendo valores vazios
    const activeFilters = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== '' && value !== false && value !== null)
    );

    // Adiciona userId aos filtros
    activeFilters.userId = userId;

    console.log('🚀 Filtros ativos:', activeFilters);

    // Verifica se está diferente do estado padrão
    const isDefaultState =
      values.q === EMPTY_VALUES.q &&
      values.description === EMPTY_VALUES.description &&
      values.type === EMPTY_VALUES.type &&
      values.status === EMPTY_VALUES.status &&
      values.startIssueDate === EMPTY_VALUES.startIssueDate &&
      values.endIssueDate === EMPTY_VALUES.endIssueDate &&
      values.startDueDate === EMPTY_VALUES.startDueDate &&
      values.endDueDate === EMPTY_VALUES.endDueDate &&
      values.startPaymentDate === EMPTY_VALUES.startPaymentDate &&
      values.endPaymentDate === EMPTY_VALUES.endPaymentDate &&
      values.categoryId === EMPTY_VALUES.categoryId &&
      values.paymentMethodId === EMPTY_VALUES.paymentMethodId &&
      values.accountId === EMPTY_VALUES.accountId &&
      values.minAmount === EMPTY_VALUES.minAmount &&
      values.maxAmount === EMPTY_VALUES.maxAmount &&
      values.recipientName === EMPTY_VALUES.recipientName;

    console.log('🎯 É estado padrão?', isDefaultState);

    setHasActiveFilters(!isDefaultState);
    setFilterValues(values);

    const searchParams = new URLSearchParams(activeFilters);
    const finalUrl = `api/v1/transactions?${searchParams.toString()}`;

    console.log('🌐 URL final:', finalUrl);

    if (tableRef.current) {
      tableRef.current.reload(finalUrl);
    }
  };

  const handleClearFilter = () => {
    formRef.current?.clearAndResetForm();
    setFilterValues(EMPTY_VALUES);

    // Aplica o filtro padrão
    handleFilter(EMPTY_VALUES);
  };

  const filterFormId = 'transaction-filter-form';

  // URL inicial com userId
  const initialUrl = `api/v1/transactions`;

  return (
    <AppLayout
      headerConfig={headerConfig}
      navigationConfig={sidebarConfig}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        <FilterSidebar
          onFilter={handleFilter}
          onClear={handleClearFilter}
          hasActiveFilters={hasActiveFilters}
          formId={filterFormId}
          persistenceKey="transaction-list-filter-sidebar-open"
        >
          <TransactionFilterForm
            ref={formRef}
            defaultValues={filterValues}
            onFilter={handleFilter}
            id={filterFormId}
          />
        </FilterSidebar>

        <Box sx={{ flexGrow: 1 }}>
          <CrudTable
            ref={tableRef}
            columns={columns}
            url={initialUrl}
            title="Transações"
            EditForm={TransactionFormModal}
            rowKey={(row) => row.id}
          />
        </Box>
      </Box>
    </AppLayout>
  );
};

export default TransactionListPage;

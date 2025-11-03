import React, { useState, useRef } from 'react';
import AppLayout from '../../../framework/layouts/AppLayout';
import CrudTable from '../../../framework/components/table/CrudTable';
import FilterSidebar from '../../../framework/components/sidebar/FilterSidebar';
import AccountFilterForm from '../components/AccountFilterForm';
import AccountFormModal from '../components/AccountFormModal';
import { Box, Chip } from 'framework/mui';
import { useExamplePage } from '../../../framework/hooks/useExamplePage';

const EMPTY_VALUES = {
  q: '',
  type: '',
  showActive: true,
  showInactive: false,
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

const AccountListPage = () => {
  const { sidebarConfig } = useExamplePage();
  const userId = getUserIdFromToken();

  const headerConfig = {
    title: 'Contas',
    subtitle: 'Gerencie suas contas bancárias e carteiras',
    showMenuButton: true,
  };

  const [filterValues, setFilterValues] = useState(EMPTY_VALUES);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const tableRef = useRef();
  const formRef = useRef();

  const columns = [
    {
      label: 'Nome',
      field: 'name',
      sortable: true,
    },
    {
      label: 'Tipo',
      field: 'type',
      sortable: true,
      render: (value) => {
        const typeLabels = {
          CORRENTE: 'Conta Corrente',
          POUPANCA: 'Poupança',
          INVESTIMENTO: 'Investimento',
          DINHEIRO: 'Dinheiro',
          OUTRO: 'Outro'
        };
        return typeLabels[value] || value;
      },
    },
    {
      label: 'Saldo Inicial',
      field: 'initialBalance',
      sortable: true,
      render: (value) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value),
    },
    {
      label: 'Saldo Atual',
      field: 'currentBalance',
      sortable: true,
      render: (value) => (
        <Chip
          label={new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(value)}
          color={value >= 0 ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      label: 'Status',
      field: 'fgActive',
      sortable: true,
      render: (value) => (value ? 'Ativo' : 'Inativo'),
    },
  ];

  const handleFilter = (values) => {
    console.log('🔍 Valores recebidos do filtro:', values);

    // Processa os filtros, removendo valores vazios
    const { showActive, showInactive, ...otherFilters } = values;

    console.log('✅ showActive:', showActive, '| showInactive:', showInactive);

    const activeFilters = Object.fromEntries(
      Object.entries(otherFilters).filter(([, value]) => value !== '' && value !== false && value !== null)
    );

    // Adiciona userId aos filtros
    activeFilters.userId = userId;

    // Lógica para o filtro de status:
    // - Se ambos marcados ou ambos desmarcados: não filtra (mostra todos)
    // - Se apenas Ativo marcado: filtra por fgActive=true
    // - Se apenas Inativo marcado: filtra por fgActive=false
    if (showActive && !showInactive) {
      activeFilters.fgActive = 'true';
      console.log('📌 Filtrando apenas ATIVOS');
    } else if (!showActive && showInactive) {
      activeFilters.fgActive = 'false';
      console.log('📌 Filtrando apenas INATIVOS');
    } else {
      console.log('📌 Mostrando TODOS (ambos marcados ou desmarcados)');
    }

    console.log('🚀 Filtros ativos:', activeFilters);

    // Verifica se está diferente do estado padrão
    const isDefaultState =
      values.q === EMPTY_VALUES.q &&
      values.type === EMPTY_VALUES.type &&
      values.showActive === EMPTY_VALUES.showActive &&
      values.showInactive === EMPTY_VALUES.showInactive;

    console.log('🎯 É estado padrão?', isDefaultState);

    setHasActiveFilters(!isDefaultState);
    setFilterValues(values);

    const searchParams = new URLSearchParams(activeFilters);
    const finalUrl = `api/v1/accounts?${searchParams.toString()}`;

    console.log('🌐 URL final:', finalUrl);

    if (tableRef.current) {
      tableRef.current.reload(finalUrl);
    }
  };

  const handleClearFilter = () => {
    formRef.current?.clearAndResetForm();
    setFilterValues(EMPTY_VALUES);

    // Aplica o filtro padrão (apenas ativos)
    handleFilter(EMPTY_VALUES);
  };

  const filterFormId = 'account-filter-form';

  // URL inicial com filtro padrão (apenas ativos) e userId
  const initialUrl = `api/v1/accounts`;

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
          persistenceKey="account-list-filter-sidebar-open"
        >
          <AccountFilterForm
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
            title="Contas"
            EditForm={AccountFormModal}
            rowKey={(row) => row.id}
          />
        </Box>
      </Box>
    </AppLayout>
  );
};

export default AccountListPage;

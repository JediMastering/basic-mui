import React, { useState, useRef } from 'react';
import AppLayout from '../../../framework/layouts/AppLayout';
import CrudTable from '../../../framework/components/table/CrudTable';
import FilterSidebar from '../../../framework/components/sidebar/FilterSidebar';
import PaymentMethodFilterForm from '../components/PaymentMethodFilterForm';
import PaymentMethodFormModal from '../components/PaymentMethodFormModal';
import { Box } from 'framework/mui';
import { useExamplePage } from '../../../framework/hooks/useExamplePage';

const EMPTY_VALUES = {
  q: '',
  description: '',
  showActive: true,
  showInactive: false,
};

const PaymentMethodListPage = () => {
  const { sidebarConfig } = useExamplePage();

  const headerConfig = {
    title: 'Métodos de Pagamento',
    subtitle: 'Gerencie os métodos de pagamento do sistema',
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
      label: 'Descrição',
      field: 'description',
      sortable: false,
      render: (value) => value || '-',
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
      values.description === EMPTY_VALUES.description &&
      values.showActive === EMPTY_VALUES.showActive &&
      values.showInactive === EMPTY_VALUES.showInactive;

    console.log('🎯 É estado padrão?', isDefaultState);

    setHasActiveFilters(!isDefaultState);
    setFilterValues(values);

    const searchParams = new URLSearchParams(activeFilters);
    const finalUrl = `api/v1/payment-methods?${searchParams.toString()}`;

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

  const filterFormId = 'payment-method-filter-form';

  // URL inicial com filtro padrão (apenas ativos)
  const initialUrl = 'api/v1/payment-methods?fgActive=true';

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
          persistenceKey="payment-method-list-filter-sidebar-open"
        >
          <PaymentMethodFilterForm
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
            title="Métodos de Pagamento"
            EditForm={PaymentMethodFormModal}
            rowKey={(row) => row.id}
          />
        </Box>
      </Box>
    </AppLayout>
  );
};

export default PaymentMethodListPage;

import React, { useState, useRef } from 'react';
import AppLayout from '../../framework/layouts/AppLayout';
import { useExamplePage } from '../../framework/hooks/useExamplePage';
import CrudTable from '../../framework/components/table/CrudTable';
import AccessGroupForm from './AccessGroupForm';
import Number from '../../framework/components/fields/Number';
import FilterSidebar from '../../framework/components/sidebar/FilterSidebar';
import AccessGroupFilterForm from './AccessGroupFilterForm';
import { Box } from 'framework/mui';

const EMPTY_VALUES = {
  q: '',
  id: '',
  name: ''
};

const AccessGroupCrudPage = () => {
  const {
    sidebarConfig,
  } = useExamplePage();

  const headerConfig = {
    title: "Grupos de Acesso",
    subtitle: "Gerencie os grupos de acesso do sistema",
    showMenuButton: true,
  };

  const [filterValues, setFilterValues] = useState(EMPTY_VALUES);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const tableRef = useRef();
  const formRef = useRef();

  const columns = [
    {
      label: 'Identificador',
      field: (row) => <Number value={row.id} />,
      sortable: true,
      columnName: 'id',
    },
    {
      label: 'Nome do Grupo',
      field: 'name',
      sortable: true,
    },
  ];

  const handleFilter = (values) => {
    const activeFilters = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value && value.trim() !== '')
    );
    setHasActiveFilters(Object.keys(activeFilters).length > 0);
    setFilterValues(values);

    const searchParams = new URLSearchParams(activeFilters);

    if (tableRef.current) {
      tableRef.current.reload(`access-groups?${searchParams.toString()}`);
    }
  };

  const handleClearFilter = () => {
    formRef.current?.reset();
    setFilterValues(EMPTY_VALUES);
    setHasActiveFilters(false);
    if (tableRef.current) {
      tableRef.current.reload('access-groups');
    }
  };

  const filterFormId = 'access-group-filter-form';

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
          persistenceKey="access-groups-crud-filter-sidebar-open"
        >
          <AccessGroupFilterForm
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
            url="access-groups"
            title="Grupos de Acesso"
            EditForm={AccessGroupForm}
            rowKey={(row) => row.id}
          />
        </Box>
      </Box>
    </AppLayout>
  );
};

export default AccessGroupCrudPage;

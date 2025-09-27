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
    headerConfig,
    sidebarConfig,
  } = useExamplePage();

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

  const handleFilter = () => {
    const values = formRef.current?.getValues() || {};
    
    const cleanedFilters = Object.entries(values).reduce((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    setFilterValues(cleanedFilters);
    setHasActiveFilters(Object.keys(cleanedFilters).length > 0);
    
    const searchParams = new URLSearchParams();
    Object.entries(cleanedFilters).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    
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

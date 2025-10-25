import React, { useState, useRef } from 'react';
import AppLayout from '../../framework/layouts/AppLayout';
import { useExamplePage } from '../../framework/hooks/useExamplePage';
import CrudTable from '../../framework/components/table/CrudTable';
import UserForm from './UserForm';
import Number from '../../framework/components/fields/Number';
import FilterSidebar from '../../framework/components/sidebar/FilterSidebar';
import UserFilterForm from './UserFilterForm';
import { Box } from 'framework/mui';
import UserPhoto from '../../components/UserPhoto';

const EMPTY_VALUES = {
  q: '',
  id: '',
  username: ''
};

const UsersCrudPage = () => {
  const {
    sidebarConfig,
  } = useExamplePage();

  const headerConfig = {
    title: "Usuários",
    subtitle: "Gerencie os usuários do sistema",
    showMenuButton: true,
  };
  const [filterValues, setFilterValues] = useState(EMPTY_VALUES);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const tableRef = useRef();
  const formRef = useRef();

  

  const columns = [
    {
      label: 'Foto',
      field: (row) => <UserPhoto userId={row.id} />,
      sortable: false,
    },
    {
      label: 'Identificador',
      field: (row) => <Number value={row.userId} />,
      sortable: true,
      columnName: 'userId',
    },
    {
      label: 'Username',
      field: 'username',
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
      tableRef.current.reload(`users?${searchParams.toString()}`);
    }
  };

  const handleClearFilter = () => {
    formRef.current?.reset();
    setFilterValues(EMPTY_VALUES);
    setHasActiveFilters(false);
    if (tableRef.current) {
      tableRef.current.reload('users');
    }
  };

  const filterFormId = 'user-filter-form';

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
          persistenceKey="users-crud-filter-sidebar-open"
        >
          <UserFilterForm
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
            url="users"
            title="Usuários"
            EditForm={UserForm}
          />
        </Box>
      </Box>
    </AppLayout>
  );
};

export default UsersCrudPage;

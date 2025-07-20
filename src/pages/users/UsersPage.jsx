import React, { useState, useRef } from 'react';
import CrudTable from '../../framework/components/table/CrudTable';
import UserForm from './UserForm';
import Number from '../../framework/components/fields/Number';
import FilterSidebar from '../../framework/components/sidebar/FilterSidebar';
import UserFilterForm from './UserFilterForm';
import { Box } from 'framework/mui';

const EMPTY_VALUES = {
  name: '',
  email: '',
  role: ''
};

const UsersPage = () => {
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
      label: 'ATP',
      field: 'name',
      sortable: true,
    },
    {
      label: 'Status 3ª',
      field: 'email',
      sortable: true,
    }
  ];

  const handleFilter = () => {
    // Pega os valores atuais do formulário
    const values = formRef.current?.getValues() || {};
    
    const cleanedFilters = Object.entries(values).reduce((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    setFilterValues(cleanedFilters);
    setHasActiveFilters(Object.keys(cleanedFilters).length > 0);
    
    // Atualiza a URL com os filtros
    const searchParams = new URLSearchParams();
    Object.entries(cleanedFilters).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    
    // Recarrega a tabela com os novos filtros
    if (tableRef.current) {
      tableRef.current.reload(`api/users?${searchParams.toString()}`);
    }
  };

  const handleClearFilter = () => {
    formRef.current?.reset();
    setFilterValues(EMPTY_VALUES);
    setHasActiveFilters(false);
    if (tableRef.current) {
      tableRef.current.reload('api/users');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <FilterSidebar
        onFilter={handleFilter}
        onClear={handleClearFilter}
        hasActiveFilters={hasActiveFilters}
      >
        <UserFilterForm
          ref={formRef}
          defaultValues={filterValues}
        />
      </FilterSidebar>

      <Box sx={{ flexGrow: 1 }}>
        <CrudTable
          ref={tableRef}
          columns={columns}
          url="api/users"
          title="Usuários"
          EditForm={UserForm}
        />
      </Box>
    </Box>
  );
};

export default UsersPage; 
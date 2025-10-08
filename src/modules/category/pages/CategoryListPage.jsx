import React, { useState, useRef } from 'react';
import AppLayout from '../../../framework/layouts/AppLayout';
import CrudTable from '../../../framework/components/table/CrudTable';
import FilterSidebar from '../../../framework/components/sidebar/FilterSidebar';
import CategoryFilterForm from '../components/CategoryFilterForm';
import CategoryFormModal from '../components/CategoryFormModal';
import { Box } from 'framework/mui';

const EMPTY_VALUES = {
  name: '',
  includeInactive: false,
};

const CategoryListPage = () => {
  // Note: useExamplePage hook is used in UserCrudPage, but it's for demo content.
  // We will use a simplified config here.
  const headerConfig = {
    title: 'Categories',
    showSearch: false,
  };

  const [filterValues, setFilterValues] = useState(EMPTY_VALUES);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const tableRef = useRef();
  const formRef = useRef();

  const columns = [
    {
      label: 'Name',
      field: 'name',
      sortable: true,
    },
    {
      label: 'Status',
      field: (row) => (row.active ? 'Active' : 'Inactive'),
      sortable: true,
      columnName: 'active',
    },
  ];

  const handleFilter = () => {
    const values = formRef.current?.getValues() || {};
    
    const cleanedFilters = Object.entries(values).reduce((acc, [key, value]) => {
      if (value) { // Value can be boolean false, so don't check for truthiness
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
      tableRef.current.reload(`api/categories?${searchParams.toString()}`);
    }
  };

  const handleClearFilter = () => {
    formRef.current?.clearAndResetForm();
    setFilterValues(EMPTY_VALUES);
    setHasActiveFilters(false);
    if (tableRef.current) {
      tableRef.current.reload('api/categories');
    }
  };

  const filterFormId = 'category-filter-form';

  return (
    <AppLayout
      headerConfig={headerConfig}
      // navigationConfig can be added if needed
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        <FilterSidebar
          onFilter={handleFilter}
          onClear={handleClearFilter}
          hasActiveFilters={hasActiveFilters}
          formId={filterFormId}
          persistenceKey="category-list-filter-sidebar-open"
        >
          <CategoryFilterForm
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
            url="api/categories"
            title="Categories"
            EditForm={CategoryFormModal}
            rowKey={(row) => row.id}
          />
        </Box>
      </Box>
    </AppLayout>
  );
};

export default CategoryListPage;
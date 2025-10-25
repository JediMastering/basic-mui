import React, { useState, useRef } from 'react';
import AppLayout from '../../../framework/layouts/AppLayout';
import CrudTable from '../../../framework/components/table/CrudTable';
import FilterSidebar from '../../../framework/components/sidebar/FilterSidebar';
import CategoryFilterForm from '../components/CategoryFilterForm';
import CategoryFormModal from '../components/CategoryFormModal';
import { Box } from 'framework/mui';
import { useExamplePage } from '../../../framework/hooks/useExamplePage';

const EMPTY_VALUES = {
  q: '',
  includeInactive: false,
};

const CategoryListPage = () => {
  const { sidebarConfig } = useExamplePage();

  const headerConfig = {
    title: 'Categories',
    subtitle: 'Gerencie as categorias do sistema',
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
      label: 'Status',
      field: (row) => (row.active ? 'Active' : 'Inactive'),
      sortable: true,
      columnName: 'active',
    },
  ];

  const handleFilter = (values) => {

    const activeFilters = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== '' && value !== false)
    );
    setHasActiveFilters(Object.keys(activeFilters).length > 0);
    setFilterValues(values);

    const searchParams = new URLSearchParams(activeFilters);

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
      navigationConfig={sidebarConfig}
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
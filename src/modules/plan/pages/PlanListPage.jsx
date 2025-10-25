import React, { useState, useRef } from "react";
import Box from "../../../framework/components/layout/Box";
import CrudTable from "../../../framework/components/table/CrudTable";
import { PlanFormModal } from "../components/PlanFormModal";
import { usePlan } from "../hooks/usePlan";
import AppLayout from "../../../framework/layouts/AppLayout";
import FilterSidebar from "../../../framework/components/sidebar/FilterSidebar";
import PlanFilterForm from "../components/PlanFilterForm";

const EMPTY_VALUES = {
  name: "",
  includeInactive: false,
};

export const PlanListPage = () => {
  const { loading, error, createPlan, updatePlan, deletePlan } = usePlan();
  const [filterValues, setFilterValues] = useState(EMPTY_VALUES);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const tableRef = useRef();
  const formRef = useRef();

  const headerConfig = {
    title: "Gerenciamento de Planos",
    showMenuButton: true,
  };

  const navigationConfig = {};

  const handleFilter = (values) => {

    const activeFilters = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== '' && value !== false)
    );
    setHasActiveFilters(Object.keys(activeFilters).length > 0);
    setFilterValues(values);

    const searchParams = new URLSearchParams(activeFilters);

    if (tableRef.current) {
      tableRef.current.reload(`api/plans?${searchParams.toString()}`);
    }
  };

  const handleClearFilter = () => {
    setFilterValues(EMPTY_VALUES);
    setHasActiveFilters(false);
    if (tableRef.current) {
      tableRef.current.reload("api/plans");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Nome", width: 200 },
    { field: "description", headerName: "Descrição", flex: 1 },
    { field: "price", headerName: "Preço", width: 120, type: "number" },
    { field: "features", headerName: "Funcionalidades", width: 250 },
    { field: "fgActive", headerName: "Ativo", width: 100, type: "boolean" },
  ];

  if (error) return <Box>Erro: {error.message}</Box>;

  return (
    <AppLayout headerConfig={headerConfig} navigationConfig={navigationConfig}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <FilterSidebar
          onFilter={handleFilter}
          onClear={handleClearFilter}
          hasActiveFilters={hasActiveFilters}
          formId="plan-filter-form"
          persistenceKey="plans-crud-filter-sidebar-open"
        >
          <PlanFilterForm
            ref={formRef}
            defaultValues={filterValues}
            onFilter={handleFilter}
            id="plan-filter-form"
          />
        </FilterSidebar>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          <CrudTable
            ref={tableRef}
            columns={columns}
            url="api/plans"
            title="Gerenciamento de Planos"
            EditForm={PlanFormModal}
            CreateForm={PlanFormModal}
            rowKey={(row) => row.id}
          />
        </Box>
      </Box>
    </AppLayout>
  );
};

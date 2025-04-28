import React, { useState } from 'react';
import SmartTable from '../framework/components/table/SmartTable';
import { Button } from '@mui/material';
import  Number  from '../framework/components/fields/Number';

// Definição das colunas
const columns = [
  {
    label: 'Identificador',
    field: (row) => <Number value={row.id} />,
    sortable: true,
    columnName: 'id'
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
  },
  //{
  //label: 'Idade',
  //field: 'idade',
  //align: 'right',
  //sortable: true,
  //},
  {
    label: 'Ações',
    field: (row) => <Button variant="outlined" size="small">Ver</Button>,
    align: 'center',
  },
];

function SmartTableExample() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleRowSelect = (rows, ids) => {
    setSelectedRows(rows);
    setSelectedIds(ids);
  };

  return (
    <div
      style={{ padding: 24 }}
    >
      {/* <pre>{JSON.stringify(selectedRows, null, 2)}</pre> */}
      <SmartTable
        columns={columns}
        url="api/users" // URL do backend
        rowKey={(row) => row.id}
        externalPageSize={50}
        onRowSelect={handleRowSelect}
        selectedRows={selectedIds}
        selectable={true}
        emptyMessage="Sem registros disponíveis"
      // actions={
      //   <div style={{ display: 'flex', gap: 8 }}>
      //     <Button variant="contained">Novo Usuário</Button>
      //     {selectedRows.length > 0 && (
      //       <Button variant="outlined" color="secondary">
      //         Remover Selecionados ({selectedRows.length})
      //       </Button>
      //     )}
      //   </div>
      // }
      />
    </div>
  );
}

export default SmartTableExample;
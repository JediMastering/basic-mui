import React, { useState } from 'react';
import SmartTable from '../framework/components/table/SmartTable';
import { Button } from '@mui/material';

// Dados de exemplo
const mockData = [
  { id: '1', nome: 'João Silva', email: 'joao@email.com', idade: 30 },
  { id: '2', nome: 'Maria Oliveira', email: 'maria@email.com', idade: 25 },
  { id: '3', nome: 'Carlos Souza', email: 'carlos@email.com', idade: 28 },
];

// Colunas da tabela
const columns = [
  {
    label: 'Nome',
    field: 'nome',
    sortable: true,
  },
  {
    label: 'Email',
    field: 'email',
    sortable: true,
  },
  {
    label: 'Idade',
    field: 'idade',
    align: 'right',
    sortable: true,
  },
  {
    label: 'Ações',
    field: (row) => <Button variant="outlined" size="small">Ver</Button>,
    align: 'center',
  },
];

function SmartTableExample() {
  const [page, setPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <div style={{ padding: 24 }}>
      <SmartTable
        data={mockData}
        columns={columns}
        rowKey={(row) => row.id}
        page={page}
        pageSize={5}
        total={mockData.length}
        onPageChange={setPage}
        onRowSelect={setSelectedRows}
        selectable={true}
        onSortChange={(column, direction) => {
          console.log(`Ordenar por ${column} em ordem ${direction}`);
        }}
        loading={false}
        emptyMessage="Sem registros disponíveis"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="contained">Novo Usuário</Button>
            {selectedRows.length > 0 && (
              <Button variant="outlined" color="secondary">
                Remover Selecionados ({selectedRows.length})
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
}

export default SmartTableExample;

import React, { useState } from 'react';
import SmartTable from '../framework/components/table/SmartTable';
import { Button } from '@mui/material';

// Mock de dados
const mockSpringResponse = {
    content: [
      { id: '1', nome: 'João Silva', email: 'joao@email.com', idade: 30 },
      { id: '2', nome: 'Maria Oliveira', email: 'maria@email.com', idade: 25 },
      { id: '3', nome: 'Carlos Souza', email: 'carlos@email.com', idade: 28 },
    ],
    totalElements: 50,
    totalPages: 10,
    size: 5,
    number: 0,
    sort: {},
    first: true,
    last: false,
    numberOfElements: 3,
    empty: false
  };
  

// Definição das colunas
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
  const [selectedRows, setSelectedRows] = useState([]); // dados selecionados
  const [selectedIds, setSelectedIds] = useState([]);   // ids selecionados
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [pageData, setPageData] = useState(mockSpringResponse);

  const handleRowSelect = (rows, ids) => {
    setSelectedRows(rows);
    setSelectedIds(ids);
    console.log('Seleção')
  };

  const handleSortChange = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
    console.log(`Ordenado por ${column} em ordem ${direction}`);
  };

  return (
    <div style={{ padding: 24 }}>
        {JSON.stringify(selectedRows)}
      <SmartTable
        data={pageData.content}
        columns={columns}
        rowKey={(row) => row.id}
        page={pageData.number}
        pageSize={pageData.size}
        total={pageData.totalElements}
        onPageChange={(newPage) => {
          // Aqui você faria a requisição para o backend
          console.log('Nova página requisitada:', newPage);
          // Simulando troca de página:
          setPageData({ ...mockSpringResponse, number: newPage });
        }}
        onRowSelect={handleRowSelect}
        selectedRows={selectedIds}
        selectable={true}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
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

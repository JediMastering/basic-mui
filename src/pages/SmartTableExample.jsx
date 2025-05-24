import React, { useState } from 'react';
import SmartTable from '../framework/components/table/SmartTable';
import { Button } from '@mui/material';
import Number from '../framework/components/fields/Number';
import SmartGenericFormModal from '../framework/components/form/SmartGenericFormModal';

function SmartTableExample() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleRowSelect = (rows, ids) => {
    setSelectedRows(rows);
    setSelectedIds(ids);
  };

  const handleOpenModal = (data = null) => {
    setEditData(data); // Define dados para edição ou null para inserção
    setModalAberto(true);
  };

  const handleCloseModal = () => {
    setModalAberto(false);
    setEditData(null);
  };

  // Definição das colunas dentro do componente para acessar handleOpenModal
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
    },
    {
      label: 'Ações',
      field: (row) => (
        <>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenModal(row)} // Abre o modal com os dados do registro
          >
            Ver
          </Button>
          <Button variant="outlined" size="small">
            Excluir
          </Button>
        </>
      ),
      align: 'center',
    },
  ];

  return (
    <>
    <p>Trabalhar agora na parte da edição do registro</p>
      <Button
        variant="contained"
        onClick={() => handleOpenModal()} // Abre o modal para inserção
        style={{ margin: '24px' }}
      >
        Novo
      </Button>
      <SmartGenericFormModal
        submitUrl="api/users"
        initialValues={editData || {}}
        open={modalAberto}
        onClose={handleCloseModal}
      />
      <div style={{ padding: 24 }}>
        <SmartTable
          columns={columns}
          url="api/users"
          rowKey={(row) => row.id}
          externalPageSize={50}
          onRowSelect={handleRowSelect}
          selectedRows={selectedIds}
          selectable={true}
          emptyMessage="Sem registros disponíveis"
        />
      </div>
    </>
  );
}

export default SmartTableExample;
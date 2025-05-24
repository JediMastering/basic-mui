import React, { useState, useRef } from 'react';
import SmartTable from '../framework/components/table/SmartTable';
import { 
  Button, 
  Box, 
  Snackbar, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import Number from '../framework/components/fields/Number';
import SmartGenericFormModal from '../framework/components/form/SmartGenericFormModal';
import { requestBackend } from '../framework/utils/connections';

function SmartTableExample() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editData, setEditData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState(false);
  const tableRef = useRef();

  const handleRowSelect = (rows, ids) => {
    setSelectedRows(rows);
    setSelectedIds(ids);
  };

  const handleOpenModal = (data = null) => {
    setEditData(data);
    setModalAberto(true);
  };

  const handleCloseModal = () => {
    setModalAberto(false);
    setEditData(null);
  };

  const handleConfirmDelete = () => {
    setConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog(false);
  };

  const handleDelete = async () => {
    setConfirmDialog(false);
    try {
      const deletePromises = selectedRows.map(async row => {
        try {
          await requestBackend("api/users/" + row.id, 'DELETE');
          return { success: true, id: row.id };
        } catch (error) {
          return { success: false, id: row.id, error };
        }
      });
      
      const results = await Promise.all(deletePromises);
      const failures = results.filter(r => !r.success);
      
      if (failures.length > 0) {
        setSnackbar({
          open: true,
          message: `Erro ao excluir ${failures.length} registro(s)`,
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: `${selectedRows.length} registro(s) excluído(s) com sucesso!`,
          severity: 'success'
        });
        
        // Limpa seleção
        setSelectedRows([]);
        setSelectedIds([]);
      }
      
      // Recarrega a tabela em qualquer caso
      if (tableRef.current) {
        tableRef.current.reload();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao processar exclusões',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
            onClick={() => handleOpenModal(row)}
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
      <Box sx={{ display: 'flex', gap: 2, margin: '24px' }}>
        <Button
          variant="contained"
          onClick={() => handleOpenModal()}
        >
          Novo
        </Button>
        {selectedRows.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Excluir ({selectedRows.length})
          </Button>
        )}
      </Box>
      <SmartGenericFormModal
        submitUrl="api/users"
        initialValues={editData || {}}
        open={modalAberto}
        onClose={handleCloseModal}
      />
      <div style={{ padding: 24 }}>
        <SmartTable
          ref={tableRef}
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
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Dialog de Confirmação */}
      <Dialog
        open={confirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir {selectedRows.length} registro(s)? Esta ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SmartTableExample;
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
  DialogActions,
  TextField
} from '@mui/material';
import { useForm, Controller } from "react-hook-form";
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const tableRef = useRef();
  
  const { control, handleSubmit, reset } = useForm();

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

  const handleOpenEditModal = () => {
    const selectedRow = selectedRows[0];
    reset({
      name: selectedRow.name,
      email: selectedRow.email
    });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    reset({
      name: '',
      email: ''
    });
  };

  const onEditSubmit = async (data) => {
    try {
      const selectedRow = selectedRows[0];
      await requestBackend(`api/users/${selectedRow.id}`, 'PUT', data);
      
      setSnackbar({
        open: true,
        message: 'Registro atualizado com sucesso!',
        severity: 'success'
      });
      
      handleCloseEditModal();
      setSelectedRows([]);
      setSelectedIds([]);
      
      if (tableRef.current) {
        tableRef.current.reload();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar registro',
        severity: 'error'
      });
    }
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
        
        setSelectedRows([]);
        setSelectedIds([]);
      }
      
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

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, margin: '24px' }}>
        <Button
          variant="contained"
          onClick={() => handleOpenModal()}
        >
          Novo
        </Button>
        {selectedRows.length === 1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenEditModal}
          >
            Editar
          </Button>
        )}
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

      <Dialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="edit-dialog-title">
          Editar Registro
        </DialogTitle>
        <form onSubmit={handleSubmit(onEditSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ATP"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Status 3ª"
                    fullWidth
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default SmartTableExample;
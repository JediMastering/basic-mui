import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { 
  Box, 
  Button,
  Snackbar,
  Alert,
  Toolbar,
  Typography
} from 'framework/mui';
import SmartTable from './SmartTable';
import DeleteConfirmationDialog from '../dialogs/DeleteConfirmationDialog';
import { useSnackbar } from '../../hooks/useSnackbar';
import { requestBackend } from '../../utils/connections';

const CrudTable = forwardRef(({
  columns,
  url,
  title,
  EditForm,
  CreateForm = EditForm,
  rowKey = row => row.id,
  pageSize = 50,
}, ref) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const tableRef = useRef();
  const { snackbar, showSnackbar } = useSnackbar();
  const [currentUrl, setCurrentUrl] = useState(url);

  // Expõe o método reload para o componente pai
  useImperativeHandle(ref, () => ({
    reload: (newUrl) => {
      if (newUrl) {
        setCurrentUrl(newUrl);
      }
      tableRef.current?.reload();
    }
  }));

  const handleRowSelect = (rows, ids) => {
    setSelectedRows(rows);
    setSelectedIds(ids);
  };

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
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
          await requestBackend(`${url}/${row.id}`, 'DELETE');
          return { success: true, id: row.id };
        } catch (error) {
          return { success: false, id: row.id, error };
        }
      });
      
      const results = await Promise.all(deletePromises);
      const failures = results.filter(r => !r.success);
      
      if (failures.length > 0) {
        showSnackbar(`Erro ao excluir ${failures.length} registro(s)`, 'error');
      } else {
        showSnackbar(`${selectedRows.length} registro(s) excluído(s) com sucesso!`, 'success');
        setSelectedRows([]);
        setSelectedIds([]);
      }
      
      tableRef.current?.reload();
    } catch (error) {
      showSnackbar('Erro ao processar exclusões', 'error');
    }
  };

  const handleCreateSuccess = () => {
    showSnackbar('Registro criado com sucesso!', 'success');
    handleCloseCreateModal();
    tableRef.current?.reload();
  };

  const handleEditSuccess = () => {
    showSnackbar('Registro atualizado com sucesso!', 'success');
    handleCloseEditModal();
    setSelectedRows([]);
    setSelectedIds([]);
    tableRef.current?.reload();
  };

  return (
    <>
      {selectedRows.length > 0 ? (
        <Toolbar
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: 1,
            margin: '24px 24px 0 24px',
          }}
        >
          <Typography sx={{ flex: '1 1 100%' }} variant="h6">
            {selectedRows.length} selecionado(s)
          </Typography>
          {selectedRows.length === 1 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenEditModal}
            >
              Editar
            </Button>
          )}
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            sx={{ ml: 2 }}
          >
            Excluir
          </Button>
        </Toolbar>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, margin: '24px' }}>
          <Button
            variant="contained"
            onClick={handleOpenCreateModal}
          >
            Novo
          </Button>
        </Box>
      )}

      <Box sx={{ padding: 3 }}>
        <SmartTable
          ref={tableRef}
          columns={columns}
          url={currentUrl}
          rowKey={rowKey}
          externalPageSize={pageSize}
          onRowSelect={handleRowSelect}
          selectedRows={selectedIds}
          selectable={true}
          emptyMessage="Sem registros disponíveis"
        />
      </Box>

      {CreateForm && (
        <CreateForm
          open={createModalOpen}
          onClose={handleCloseCreateModal}
          onSuccess={handleCreateSuccess}
          submitUrl={url}
        />
      )}

      {EditForm && selectedRows.length === 1 && (
        <EditForm
          open={editModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
          submitUrl={`${url}/${selectedRows[0].id}`}
          initialValues={selectedRows[0]}
        />
      )}

      <DeleteConfirmationDialog
        open={confirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleDelete}
        count={selectedRows.length}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={snackbar.handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={snackbar.handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
});

export default CrudTable; 
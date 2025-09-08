import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, FormControlLabel, FormGroup, Typography, Box, CircularProgress } from 'framework/mui';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BaseFormModal from '../../framework/components/form/BaseFormModal';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { apiRequest } from '../../framework/utils/connections';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const validationSchema = yup.object().shape({
  name: yup.string().required('Nome do grupo é obrigatório'),
});

const AccessGroupForm = ({ open, onClose, onSuccess, submitUrl, initialValues, method }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { control, reset, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues || { name: '', permissions: {} },
  });

  const onSubmit = async (data) => {
    try {
      const method = initialValues?.id ? 'PUT' : 'POST';
      const url = initialValues?.id ? `${submitUrl}` : submitUrl;
      await apiRequest({ url, method, data });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  useEffect(() => {
    if (open) {
      reset(initialValues || { name: '', permissions: {} });
    }
  }, [open, initialValues, reset]);


  useEffect(() => {
    apiRequest({ url: 'permissions', method: 'GET', useMock: false })
      .then(data => {
        setPermissions(data);
        setLoading(false);
      });
  }, []);

  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} itemId={String(nodes.id)} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
      {nodes.permissions && (
        <Box sx={{ ml: 4 }}>
          <FormGroup>
            <Controller
              name={`permissions.${nodes.id}.view`}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value || false} />}
                  label="Visualizar"
                />
              )}
            />
            <Controller
              name={`permissions.${nodes.id}.edit`}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value || false} />}
                  label="Editar"
                />
              )}
            />
            <Controller
              name={`permissions.${nodes.id}.delete`}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value || false} />}
                  label="Excluir"
                />
              )}
            />
          </FormGroup>
        </Box>
      )}
    </TreeItem>
  );

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      title={initialValues?.id ? 'Editar Grupo de Acesso' : 'Novo Grupo de Acesso'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Nome do Grupo"
            fullWidth
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Permissões</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ height: 400, overflow: 'auto' }}>
            <SimpleTreeView
              slots={{ collapseIcon: ExpandMoreIcon, expandIcon: ChevronRightIcon }}
            >
              {permissions.map((node) => renderTree(node))}
            </SimpleTreeView>
          </Box>
        )}
      </Box>
    </BaseFormModal>
  );
};

export default AccessGroupForm;

import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, FormControlLabel, FormGroup, Typography, Box, CircularProgress } from 'framework/mui';
import { Controller } from 'react-hook-form';
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

  useEffect(() => {
    apiRequest({ url: 'permissions', method: 'GET', useMock: true })
      .then(data => {
        setPermissions(data);
        setLoading(false);
      });
  }, []);

  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} itemId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
      {nodes.permissions && (
        <Box sx={{ ml: 4 }}>
          <FormGroup>
            <Controller
              name={`permissions.${nodes.id}.view`}
              control={control}
              defaultValue={initialValues?.permissions?.[nodes.id]?.view || false}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Visualizar"
                />
              )}
            />
            <Controller
              name={`permissions.${nodes.id}.edit`}
              control={control}
              defaultValue={initialValues?.permissions?.[nodes.id]?.edit || false}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Editar"
                />
              )}
            />
            <Controller
              name={`permissions.${nodes.id}.delete`}
              control={control}
              defaultValue={initialValues?.permissions?.[nodes.id]?.delete || false}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
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
      onSuccess={onSuccess}
      title={initialValues?.id ? 'Editar Grupo de Acesso' : 'Novo Grupo de Acesso'}
      submitUrl={submitUrl}
      method={method}
      initialValues={initialValues}
      validationSchema={yupResolver(validationSchema)}
    >
      {(control) => {
        const renderTree = (nodes) => (
          <TreeItem key={nodes.id} itemId={nodes.id} label={nodes.name}>
            {Array.isArray(nodes.children)
              ? nodes.children.map((node) => renderTree(node))
              : null}
            {nodes.permissions && (
              <Box sx={{ ml: 4 }}>
                <FormGroup>
                  <Controller
                    name={`permissions.${nodes.id}.view`}
                    control={control}
                    defaultValue={initialValues?.permissions?.[nodes.id]?.view || false}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Visualizar"
                      />
                    )}
                  />
                  <Controller
                    name={`permissions.${nodes.id}.edit`}
                    control={control}
                    defaultValue={initialValues?.permissions?.[nodes.id]?.edit || false}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Editar"
                      />
                    )}
                  />
                  <Controller
                    name={`permissions.${nodes.id}.delete`}
                    control={control}
                    defaultValue={initialValues?.permissions?.[nodes.id]?.delete || false}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
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
          <>
            <Controller
              name="name"
              control={control}
              defaultValue=""
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
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                  >
                    {permissions.map((node) => renderTree(node))}
                  </SimpleTreeView>
                </Box>
              )}
            </Box>
          </>
        );
      }}
    </BaseFormModal>
  );
};

export default AccessGroupForm;

import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Box,
  Avatar,
  Button,
  Typography,
  CircularProgress,
} from 'framework/mui';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BaseFormModal from '../../framework/components/form/BaseFormModal';
import { apiRequest } from '../../framework/utils/connections';
import { userValidationSchema } from '../../validations/userValidation';

const UserForm = ({ open, onClose, onSuccess, submitUrl, initialValues, method }) => {
  const [accessGroups, setAccessGroups] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const { control, handleSubmit, reset, setValue, watch, setError } = useForm({
    resolver: yupResolver(userValidationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      accessGroupIds: [],
      photo: null,
    },
  });

  const photo = watch('photo');
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  const fetchImage = async () => {
    if (!initialValues?.id) return;
    try {
      const blob = await apiRequest({
        url: `users/${initialValues.id}/profile-image`,
        method: 'GET',
        config: {
          responseType: 'blob',
        },
      });
      const url = URL.createObjectURL(blob);
      setPhotoPreview(url);
    } catch (error) {
      console.error('Error fetching image:', error);
      setPhotoPreview(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      let userIdForOperations = initialValues?.id;
      let finalUserData = { ...data }; // Data to be sent in the final PUT/POST

      // Se a senha não for fornecida (string vazia), remova-a do objeto de dados
      if (!finalUserData.password) {
        delete finalUserData.password;
      }

      // Remova sempre a confirmação da senha para não ser enviada
      delete finalUserData.passwordConfirmation;

      // 1. Handle new user creation (POST)
      if (!userIdForOperations) {
        const { photo, ...createUserData } = data; // Exclude photo from initial POST
        const newUserResponse = await apiRequest({ url: submitUrl, method: 'POST', data: createUserData });

        if (!newUserResponse || !newUserResponse.userId) {
          throw new Error('Erro ao criar usuário: ID não retornado pelo servidor.');
        }
        userIdForOperations = newUserResponse.userId;
        finalUserData = { ...newUserResponse, ...data }; // Merge response with form data
      }

      // 2. Handle photo deletion
      if (photoToDelete) {
        try {
          await apiRequest({
            url: `api/v1/attachments/${photoToDelete}`,
            method: 'DELETE',
          });
          finalUserData.photo = null;
        } catch (error) {
          console.error('Erro ao deletar imagem:', error);
        }
      }

      // 3. Handle photo upload
      let photoUploaded = false;
      if (selectedFile && userIdForOperations) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('entityType', 'USER');
        formData.append('entityId', userIdForOperations);

        setIsUploading(true);
        setUploadError(null);

        try {
          const response = await apiRequest({
            url: 'api/v1/attachments/upload',
            method: 'POST',
            data: formData,
            config: {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          });
          finalUserData.photo = response.id;
          photoUploaded = true;
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error);
          setUploadError('Falha no upload da imagem. Tente novamente.');
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // 4. Final update (PUT) if it's an existing user OR if a photo was uploaded for a new user
      if (initialValues?.id || photoUploaded) {
        const finalApiUrl = `${submitUrl}/${userIdForOperations}`; // Always construct with base URL + ID
        await apiRequest({ url: finalApiUrl, method: 'PUT', data: finalUserData });
      }

      onSuccess?.();
      // Reset local photo-related states
      setPhotoPreview(null);
      setSelectedFile(null);
      setPhotoToDelete(null);
      setIsUploading(false);
      setUploadError(null);

      onClose();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      if (error.response && error.response.data && error.response.data.details) {
        error.response.data.details.forEach(detail => {
          if (detail.field && detail.message) {
            setError(detail.field, { type: 'manual', message: detail.message });
          }
        });
      } else {
        // Fallback for generic errors or if the structure is different
        // You might want to use a snackbar here for general errors
        // showSnackbar('Erro ao enviar formulário. Tente novamente.', 'error');
      }
    }
  };

  const fetchAttachmentId = async () => {
    if (!initialValues?.id) return;
    try {
      const attachments = await apiRequest({
        url: `api/v1/attachments/entity/USER/${initialValues.id}`,
        method: 'GET',
      });
      if (attachments && attachments.length > 0) {
        setValue('photo', attachments[0].id);
      } else {
        setValue('photo', null);
      }
    } catch (error) {
      console.error('Error fetching attachment ID:', error);
      setValue('photo', null);
    }
  };

  useEffect(() => {
    if (open) {
      apiRequest({ url: 'access-groups/all', method: 'GET', useMock: false }).then((data) => {
        setAccessGroups(data);
        const formValues = initialValues
          ? { ...initialValues, accessGroupIds: initialValues.accessGroupIds || [], password: '', passwordConfirmation: '' }
          : { username: '', email: '', password: '', passwordConfirmation: '', accessGroupIds: [], photo: null };
        reset(formValues);
        fetchAttachmentId();
        if (initialValues?.id) {
          fetchImage();
        } else {
          setPhotoPreview(null);
        }
      });
    }
  }, [open, initialValues, reset]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoToDelete(null); // If a new file is selected, cancel any pending deletion
    }
  };

  const handleRemovePhoto = () => {
    if (photo || selectedFile) { // Allow removing newly selected file
      setPhotoToDelete(photo); // Mark the current photo for deletion
      setPhotoPreview(null);
      setValue('photo', null); // Clear the form field
      setSelectedFile(null); // Clear any pending new file upload
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      title={initialValues?.id ? 'Editar Usuário' : 'Novo Usuário'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar src={photoPreview} sx={{ width: 100, height: 100, mb: 1 }} />
            {isUploading && (
              <CircularProgress
                size={100}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
              />
            )}
          </Box>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <Box>
            <Button variant="outlined" size="small" onClick={() => fileInputRef.current.click()} disabled={isUploading || !initialValues?.id}>
              Alterar
            </Button>
            {((photo && !photoToDelete) || selectedFile) && (
              <Button variant="outlined" size="small" color="error" onClick={handleRemovePhoto} sx={{ ml: 1 }} disabled={isUploading}>
                Remover
              </Button>
            )}
          </Box>
          {!initialValues?.id && (
            <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
              Você poderá adicionar uma foto após salvar o usuário.
            </Typography>
          )}
          {uploadError && (
            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
              {uploadError}
            </Typography>
          )}
        </Box>
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Username" fullWidth error={!!error} helperText={error?.message} autoComplete="off" />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Email" fullWidth error={!!error} helperText={error?.message} autoComplete="off" />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              fullWidth
              error={!!error}
              helperText={error?.message}
              autoComplete="new-password"
            />
          )}
        />
        <Controller
          name="passwordConfirmation"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Confirmar Password"
              type="password"
              fullWidth
              error={!!error}
              helperText={error?.message}
              autoComplete="new-password"
            />
          )}
        />
        <FormControl fullWidth>
          <InputLabel id="access-group-label">Grupos de Acesso</InputLabel>
          <Controller
            name="accessGroupIds"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                labelId="access-group-label"
                multiple
                label="Grupos de Acesso"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const group = accessGroups.find((g) => g.id == value);
                      return <Chip key={value} label={group?.name || value} />;
                    })}
                  </Box>
                )}
                error={!!error}
              >
                {accessGroups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </>
    </BaseFormModal>
  );
};

export default UserForm;
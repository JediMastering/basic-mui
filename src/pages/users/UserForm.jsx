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
  const { control, handleSubmit, reset, setValue, watch } = useForm({
    resolver: yupResolver(userValidationSchema),
    defaultValues: {
      username: '',
      password: '',
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
      let currentUserId = initialValues?.id;
      let reqMethod = currentUserId ? 'PUT' : method;
      let submitApiUrl = currentUserId ? `${submitUrl}` : submitUrl;

      // If it's a new user, create the user first to get an ID
      if (!currentUserId) {
        const newUser = await apiRequest({ url: submitApiUrl, method: reqMethod, data });
        currentUserId = newUser.id; // Get the ID of the newly created user
        reqMethod = 'PUT'; // Subsequent calls will be updates
        submitApiUrl = `${submitUrl}/${currentUserId}`; // Update submit URL
      }

      // Handle photo deletion
      if (photoToDelete) {
        try {
          await apiRequest({
            url: `api/v1/attachments/${photoToDelete}`,
            method: 'DELETE',
          });
          data.photo = null; // Clear the photo from the form data
        } catch (error) {
          console.error('Erro ao deletar imagem:', error);
          // Optionally, show an error message to the user
        }
      }

      // Handle photo upload
      if (selectedFile && currentUserId) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('entityType', 'USER');
        formData.append('entityId', currentUserId);

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
          data.photo = response.id; // Update the form data with the new attachment ID
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error);
          setUploadError('Falha no upload da imagem. Tente novamente.');
          setIsUploading(false);
          return; // Stop submission if upload fails
        } finally {
          setIsUploading(false);
        }
      }

      // Finally, submit the user data (if it's an update or if it's a new user and photo was uploaded)
      await apiRequest({ url: submitApiUrl, method: reqMethod, data });
      onSuccess?.();

      // Reset local photo-related states to prevent flicker
      setPhotoPreview(null);
      setSelectedFile(null);
      setPhotoToDelete(null);
      setIsUploading(false);
      setUploadError(null);

      onClose();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
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
          ? { ...initialValues, accessGroupIds: initialValues.accessGroupIds || [] }
          : { username: '', password: '', accessGroupIds: [], photo: null };
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
            <TextField {...field} label="Username" fullWidth error={!!error} helperText={error?.message} />
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
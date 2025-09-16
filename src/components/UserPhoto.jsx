import React, { useState, useEffect } from 'react';
import { Avatar, CircularProgress } from 'framework/mui';
import { apiRequest } from '../framework/utils/connections';

const UserPhoto = ({ userId }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      apiRequest({
        url: `users/${userId}/profile-image`,
        method: 'GET',
        config: {
          responseType: 'blob',
        },
      })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        })
        .catch((error) => {
          console.error('Error fetching image:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return <CircularProgress size={40} />;
  }

  return <Avatar src={imageUrl} />;
};

export default UserPhoto;

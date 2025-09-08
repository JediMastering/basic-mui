import { apiRequest } from '../framework/utils/connections';

import api from './api';

export const login = async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data;
};

const logout = () => {
  // Remove user credentials from localStorage
  localStorage.removeItem('accessToken');
  
  // Redirect to the login page
  window.location.href = '/';
};

export const authService = {
  login,
  logout,
};

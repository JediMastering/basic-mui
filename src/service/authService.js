import { apiRequest } from '../framework/utils/connections';

const login = async (username, password) => {
  const response = await apiRequest({ url: "login", method:"post", data:{ username,  password}});

  return response
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

import { apiRequest } from '../framework/utils/connections';

export const login = async (username, password) => {
    const data = await apiRequest({
        url: 'login',
        method: 'POST',
        data: { username, password },
        useMock: false, // Assuming we are not using mock for login
    });

    if (data && data.accessToken) {
      return data;
    } else {
      // The apiRequest should throw an error on non-2xx responses,
      // so this else block might not be reached if the API returns a proper error code.
      // However, it's good to have it as a safeguard in case the API returns 200 OK with no token.
      throw new Error('Usuário ou senha inválidos');
    }
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
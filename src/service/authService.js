import { apiRequest } from '../framework/utils/connections';

const login = async (username, password) => {
  const response = await apiRequest({ url: "login", method:"post", data:{ username,  password}});

  return response
};

export const authService = {
  login,
};

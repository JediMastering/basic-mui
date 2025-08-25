import { users } from './data/users.js';

// Mocks organizados por URL e método
export const mockData = {
  '/users': {
    GET: {
      content: users,
      number: 0,
      size: 10,
      totalElements: users.length,
    },
    POST: { success: true },
    PUT: { success: true },
    DELETE: { success: true },
  },
};

// Delay em milissegundos
export const mockDelay = 500;
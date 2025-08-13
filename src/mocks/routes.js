import { users } from './data/users.js';
import { menuItems } from './data/menus.js';

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
  '/posts': {
    GET: [{ id: 10, title: 'Mocked Post' }],
  },
  '/menus': {
    GET: menuItems,
  }
};

// Delay em milissegundos
export const mockDelay = 500;
import { users } from './data/users.js';
import { accessGroups } from './data/accessGroups.js';
import { permissions } from './data/permissions.js';

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
  '/access-groups': {
    GET: {
      content: accessGroups,
      number: 0,
      size: 10,
      totalElements: accessGroups.length,
    },
    POST: { success: true },
    PUT: { success: true },
    DELETE: { success: true },
  },
  '/permissions': {
    GET: permissions,
  },
};

// Delay em milissegundos
export const mockDelay = 500;
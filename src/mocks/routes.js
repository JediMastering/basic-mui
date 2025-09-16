import { users } from './data/users.js';
import { accessGroups } from './data/accessGroups.js';
import { permissions } from './data/permissions.js';

// Mocks organizados por URL e método
export const mockData = {
  '/api/v1/attachments/upload': {
    POST: {
      "id": 1,
      "originalFileName": "download.jpeg",
      "storedFileName": "download.jpeg",
      "path": "attachments/2025/09",
      "fileType": "JPG",
      "createdAt": "2025-09-15T20:01:08.565773",
      "entityId": "24944815-db27-48f7-9dea-cd2e5791898d",
      "entityType": "USER"
    }
  },
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
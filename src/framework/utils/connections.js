import axios from 'axios';
import { users } from '../../mocks/data/users.js';

// Mocks organizados por URL e método
const mockData = {
  '/users': {
    GET: {
      content: users,
      number: 0,
      size: 10,
      totalElements: users.length,
    },
    POST: { success: true },
  },
  '/posts': {
    GET: [{ id: 10, title: 'Mocked Post' }],
  },
};

// Delay em milissegundos
const mockDelay = 500;

/**
 * Simula um delay
 * @param {number} ms
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Requisição genérica com suporte a mocks e delay
 */
export async function apiRequest({ url, method = 'GET', data, config, useMock = false }) {
  const isProd = process.env.NODE_ENV === 'production';
  const httpMethod = method.toUpperCase();

  if (!isProd && useMock) {
    const [path, queryString] = url.split('?');
    if (mockData[path]?.[httpMethod]) {
      console.log(`[MOCK] ${httpMethod} ${url} (delay ${mockDelay}ms)`);
      await wait(mockDelay);

      if (queryString) {
        const params = new URLSearchParams(queryString);
        let filteredUsers = users;

        params.forEach((value, key) => {
          filteredUsers = filteredUsers.filter(user => 
            user[key]?.toString().toLowerCase().includes(value.toLowerCase())
          );
        });

        return Promise.resolve({
          content: filteredUsers,
          number: 0,
          size: 10,
          totalElements: filteredUsers.length,
        });
      }

      return Promise.resolve(mockData[path][httpMethod]);
    }
  }

  const response = await axios({
    url,
    method: httpMethod,
    data,
    ...config,
  });

  return response.data;
}
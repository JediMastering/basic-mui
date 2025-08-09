import axios from 'axios';
import { users } from '../../mocks/users.js';

// Mocks organizados por URL e método
const mockData = {
  '/users': {
    GET: users,
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

  if (!isProd && useMock && mockData[url]?.[httpMethod]) {
    console.log(`[MOCK] ${httpMethod} ${url} (delay ${mockDelay}ms)`);
    await wait(mockDelay);
    return Promise.resolve(mockData[url][httpMethod]);
  }

  const response = await axios({
    url,
    method: httpMethod,
    data,
    ...config,
  });

  return response.data;
}
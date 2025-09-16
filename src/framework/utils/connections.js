import axios from 'axios';
import { mockData, mockDelay } from '../../mocks/routes.js';

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
  const urlbase = "http://localhost:8080"

  if (!isProd && useMock) {
    const [path, queryString] = url.split('?');
    const pathParts = path.split('/').filter(p => p);
    const rootPath = `/${pathParts[0]}`;

    if (mockData[rootPath]?.[httpMethod]) {
      console.log(`[MOCK] ${httpMethod} ${url} (delay ${mockDelay}ms)`);
      if (data) {
        console.log('[MOCK PAYLOAD]', data);
      }
      await wait(mockDelay);

      if (queryString) {
        const params = new URLSearchParams(queryString);
        let filteredData = mockData[rootPath][httpMethod].content;

        // Filtering
        params.forEach((value, key) => {
          if (key !== 'sort' && key !== 'page' && key !== 'size') {
            filteredData = filteredData.filter(item => 
              item[key]?.toString().toLowerCase().includes(value.toLowerCase())
            );
          }
        });

        // Sorting
        const sort = params.get('sort');
        if (sort) {
          const [sortCol, sortDir] = sort.split(',');
          filteredData.sort((a, b) => {
            if (a[sortCol] < b[sortCol]) return sortDir === 'asc' ? -1 : 1;
            if (a[sortCol] > b[sortCol]) return sortDir === 'asc' ? 1 : -1;
            return 0;
          });
        }

        return Promise.resolve({
          content: filteredData,
          number: 0,
          size: 10,
          totalElements: filteredData.length,
        });
      }

      return Promise.resolve(mockData[rootPath][httpMethod]);
    }
  }

  const urlrequest = urlbase + "/" + url

  // Get user credentials from localStorage
  const accessToken = localStorage.getItem('accessToken');

  // Create Authorization header if accessToken is available
  const headers = {
    ...(config?.headers || {}),
  };
  if (accessToken && url !== 'login') {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await axios({
      url: urlrequest,
      method: httpMethod,
      data,
      ...config,
      headers,
    });

    return response.data;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (url !== 'login') {
        localStorage.removeItem('accessToken');
        navigation.navigate('/');
      }
    }
    throw error;
  }
}
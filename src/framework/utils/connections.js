export async function requestBackend(url, method = 'GET', body = null, headers = {}) {
    const baseUrl = 'http://192.168.15.112:8081/';
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
  
    if (body) {
      config.body = JSON.stringify(body);
    }
  
    try {
      const response = await fetch(baseUrl + url, config);
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }
  
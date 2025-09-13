import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('user');
            // We need to use a navigation mechanism that works outside of a component.
            // A simple page reload will force a redirect to the login page if the route is protected.
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;

import axios from 'axios';

// En desarrollo usa localhost, en producción usa la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para inyectar el token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
const normalizedBaseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/$/, '') : '/api';

const api = axios.create({
    baseURL: normalizedBaseUrl,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

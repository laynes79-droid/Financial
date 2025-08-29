import axios from 'axios';

const API_URL = '/api/'; // Using relative URL to be proxied by the React dev server

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const loginUser = (credentials) => {
    return api.post('/api-token-auth/', credentials);
};

export const registerUser = (userData) => {
    return api.post('/users/', userData);
};

export default api;

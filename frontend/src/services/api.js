import axios from 'axios';

const API_URL = '/api/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const loginUser = (credentials) => {
    return api.post('/api-token-auth/', credentials);
};

export const registerUser = (userData) => {
    return api.post('/users/', userData);
};

// Account and Category services
export const getAccounts = () => {
    return api.get('/accounts/');
};

export const getCategories = () => {
    return api.get('/categories/');
};

// Transaction services
export const getTransactions = () => {
    return api.get('/transactions/');
};

export const createTransaction = (transactionData) => {
    return api.post('/transactions/', transactionData);
};

export const updateTransaction = (id, transactionData) => {
    return api.put(`/transactions/${id}/`, transactionData);
};

export const deleteTransaction = (id) => {
    return api.delete(`/transactions/${id}/`);
};

// Dashboard services
export const getDashboardData = () => {
    return api.get('/dashboard/');
};


export default api;

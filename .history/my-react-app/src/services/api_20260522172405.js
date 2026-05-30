import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080' // Your Spring Boot port
});

// Automatically append the JWT token to every request if the user is logged in
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
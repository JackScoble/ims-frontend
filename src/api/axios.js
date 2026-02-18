import axios from 'axios';

const api = axios.create({
    baseURL: 'https://silver-spork-wr99rrv7xjvv3gw49-8000.app.github.dev/api/', 
    headers: {
        'Content-Type': 'application/json',
    }
});

// THE ENTERPRISE INTERCEPTOR
api.interceptors.request.use(
    (config) => {
        // Look in local storage for the token
        const token = localStorage.getItem('access_token');
        
        // If we have one, attach it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
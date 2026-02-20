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

api.interceptors.response.use(
    (response) => {
        // If the response is good, just pass it through
        return response;
    },
    async (error) => {
        // Save the original request that failed
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized) and it haven't already tried retrying this specific request
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // Ask Django for a new access token
                    const response = await axios.post(`${api.defaults.baseURL}token/refresh/`, {
                        refresh: refreshToken
                    });

                    // Save the new access token
                    localStorage.setItem('access_token', response.data.access);

                    // Update the failed request with the new token
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

                    // Retry the exact same request
                    return api(originalRequest);
                    
                } catch (refreshError) {
                    // If the refresh token is expired, the user needs to log in again
                    console.error("Refresh token expired. Logging out.");
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
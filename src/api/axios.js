import axios from 'axios';

/**
 * The core Axios instance configured for the application.
 * Sets the base URL for all API calls and ensures payloads are sent as JSON.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/', 
    headers: {
        'Content-Type': 'application/json',
    }
});

/**
 * Request Interceptor
 * * Intercepts every outgoing HTTP request to dynamically attach the JWT access token
 * to the `Authorization` header, provided the user is logged in. This ensures 
 * protected backend endpoints receive the required authentication credentials.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * * Intercepts incoming HTTP responses to handle global error states, specifically 
 * unauthorized (401) errors. If a 401 occurs, it automatically attempts to use 
 * the refresh token to obtain a new access token and retry the original request.
 * If the refresh process fails, it aggressively clears local storage and forces 
 * the user back to the login screen.
 */
api.interceptors.response.use(
    (response) => {
        // Pass through successful responses unchanged
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an expired access token and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // Attempt to get a new access token
                    const response = await axios.post(`${api.defaults.baseURL}token/refresh/`, {
                        refresh: refreshToken
                    });

                    // Save the new access token
                    localStorage.setItem('access_token', response.data.access);

                    // Update the original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

                    // Retry the originally failed request
                    return api(originalRequest);
                    
                } catch (refreshError) {
                    // If the refresh token is also invalid/expired, log the user out
                    console.error("Refresh token expired. Logging out.");
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        }
        
        // Return any other errors to the calling function
        return Promise.reject(error);
    }
);

export default api;
import axios, { AxiosError } from 'axios';

// Create Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Your API URL from .env
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Attach Authentication Token to Every Request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = 'Token ' + token; // Match your format
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Handle All Axios Errors Globally
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            // Handle authentication issues
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
                return Promise.reject('Unauthorized - Redirecting to Login');
            }

            // Handle detailed backend validation errors
            if (error.response.data && (error.response.data as any).non_field_errors) {
                console.error('API Error:', (error.response.data as any).non_field_errors[0]);
                return Promise.reject((error.response.data as any).non_field_errors[0]);
            }
        }

        // Handle other errors (network issues, etc.)
        console.error('Axios Error:', error.message);
        return Promise.reject(error.message);
    }
);

export default api;

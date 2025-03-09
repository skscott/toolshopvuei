import { defineStore } from 'pinia';
import router from '@/router';
// import axios, { AxiosError } from 'axios';
import api from '@/utils/api';

const baseApiUrl = import.meta.env.VITE_DRF_API_URL;
const authUrl = `${baseApiUrl}/api/authenticate/`;

interface User {
    username: string;
    email?: string;
}

interface AuthState {
    user: User | null;
    returnUrl: string | null;
    token: string | null;
}

interface ErrorResponse {
    non_field_errors?: string[];
}

// ✅ Pinia store definition using the correct format
export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        returnUrl: null,
        token: localStorage.getItem('token') || null, // Ensure token is stored properly
    }),

    actions: {
        async logout() {
            try {
                const base = "http://127.0.0.1:8080";
                const baseApiUrl = `${import.meta.env.VITE_API_URL}`;
                const url = `${base}/api/logout/`;
                // const headers = get_headers(); // Ensure this function exists
                await api.post(url, {});
                localStorage.removeItem('user');
                localStorage.removeItem('token');

                router.push('/');
            } catch (error) {
                console.error('Logout Error:', error);
            }
        }
    }
});
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
        async login(username: string, password: string) {
            try {
                const data = { username, password };
                const response = await api.post(authUrl, data);

                this.token = response.data.token;
                this.user = response.data.user;

                console.log('User:', this.user);
                console.log('Token:', this.token);

                // Store in localStorage properly
                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('token', this.token);

                // Navigate to returnUrl or home
                router.push(this.returnUrl || '/');
            }
            catch (error) {
                console.error('Error fetching user data:', error);
                throw error; // The interceptor already formats the error message
            }
        },

        async logout() {
            try {
                // const headers = get_headers(); // Ensure this function exists
                const logoutUrl = `${baseApiUrl}/logout/`;

                await api.post(logoutUrl, {});
                localStorage.removeItem('user');
                localStorage.removeItem('token');

                router.push('/');
            } catch (error) {
                console.error('Logout Error:', error);
            }
        }
    }
});
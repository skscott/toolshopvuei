import { defineStore } from 'pinia';
import router from '@/router';
import axios, { AxiosError } from 'axios';

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
    token: localStorage.getItem('token') || null, // ✅ Ensure token is stored properly
  }),

  actions: {
    async login(username: string, password: string) {
      try {
        const data = { username, password };
        const response = await axios.post(authUrl, data);
        
        this.token = response.data.token;
        this.user = response.data.user;

        console.log('User:', this.user);
        console.log('Token:', this.token);

        // ✅ Store in localStorage properly
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);

        // ✅ Navigate to returnUrl or home
        router.push(this.returnUrl || '/');
      } 
      catch (error) {
        if (axios.isAxiosError(error)) {
          const msg = handleAxiosError(error); // Ensure this function exists
          throw msg;
        } else if (error instanceof Error) {
          throw error.message;
        }
      }
    },

    async logout() {
      try {
        const headers = get_headers(); // Ensure this function exists
        const logoutUrl = `${baseApiUrl}/logout/`;

        await axios.post(logoutUrl, {}, { headers });

        localStorage.removeItem('user');
        localStorage.removeItem('token');

        router.push('/auth/login2');
      } catch (error) {
        console.error('Logout Error:', error);
      }
    }
  }
});


function get_headers() {
    let token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token,
    };
    return headers;
}

function handleAxiosError(error: AxiosError<ErrorResponse>) 
{
  if (error.response && error.response.data && error.response.data.non_field_errors) {
      const errorMessage = error.response.data.non_field_errors[0];
      console.error('Axios Error:', errorMessage);
      return errorMessage
  } 
  else 
  {
      // Handle other types of Axios errors or network errors.
      console.error('Axios Error:', error.message);
      return error.message
  }
 }

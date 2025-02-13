import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';
import { handleError } from '@/lib/utils';

const baseApiUrl = import.meta.env.VITE_DRF_API_URL;
// const url = `${baseApiUrl}/api/ui-components/`;
 const url = `http://127.0.0.1:8050/ui-components/`;

export const useUIStore = defineStore('ui', {
  state: () => ({
    components: {} as Record<string, boolean>
  }),

  actions: {
    async fetchComponentVisibility() {
      try {
        console.log("Fetching component visibility...", url);
        const response = await axios.get(url);

        console.log("Fetched component visibility:", response.data);
        const visibilityData = response.data.reduce((acc: Record<string, boolean>, item) => {
          acc[item.name] = item.is_visible;
          return acc;
        }, {});
        
        this.components = visibilityData;
      } catch (error) {
        if (error instanceof AxiosError) {
            handleError(error, this); // Pass 'this' to the handleError function to update errorMessage
        }
      } finally {
          this.loading = false;
      }
    }
  }
});

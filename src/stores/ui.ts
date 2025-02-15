import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';
import { handleError } from '@/lib/utils';

const baseApiUrl = import.meta.env.VITE_DRF_API_URL;
// const url = `${baseApiUrl}/api/ui-components/`;
 const url = `http://127.0.0.1:8050/ui-components/`;

 interface UIComponent {
  id: number;
  name: string;
  is_visible: boolean;
}

export const useUIStore = defineStore('ui', {
  state: () => ({
    components: {} as Record<string, boolean>,
    ui_components: [] as UIComponent[],
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
    },
    async fetchUIComponents() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get<UIComponent[]>(url); // Replace with your API endpoint
        this.ui_components = response.data; // Assign the response data to the state
      } catch (error) {
        this.error = 'Failed to fetch UI components';
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
});

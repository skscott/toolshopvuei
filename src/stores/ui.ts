import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';
import { get_headers, get_headers_mock, handleError } from '@/lib/utils';

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
    component: {} as UIComponent,
  }),

  actions: {
    async fetchComponentVisibility() {
      try {
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
    },
    async updateComponent() {
      const id = this.component.id ?? 0;      
      this.loading = true;
      const headers = get_headers_mock();
      try {
          if (id === 0) {
              await axios.post(url, this.component, { headers }).then(request => request.data);
              this.successMessage = 'Component created successfully!';
          } else {
              await axios.put(url + id + "/", this.component, { headers }).then(request => request.data);
              await this.fetchUIComponents();
              await this.fetchComponentVisibility();
              this.successMessage = 'Component updated successfully!';
              // console.log("Success: ", this.successMessage);
          }
      } catch (error) {
          if (error instanceof AxiosError) {
              handleError(error, this); // Pass 'this' to the handleError function to update errorMessage
          }
      } finally {
          this.loading = false;
      }
    },
    async deleteComponent(id: number){
      try {
          const headers = get_headers_mock();
          const response = await axios.delete(url + id + "/", { headers}).then(request => request.data);
          this.tariff = response.data;
      }
      catch (error) {
        if (error instanceof AxiosError) {
            handleError(error, this); // Pass 'this' to the handleError function to update errorMessage
        }
    } finally {
        this.loading = false;
    }
  },
  }
});

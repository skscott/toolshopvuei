import { defineStore } from 'pinia';
// import axios, { AxiosError } from 'axios';
import api from '@/utils/api';
import { ref } from 'vue';
import { RawUIComponent } from '@/types';
import { transformUIComponent } from '@/utils/transformer';

const baseApiUrl = `${import.meta.env.VITE_API_URL}`;
const url = `${baseApiUrl}/api/ui_components/`;

interface UIComponent {
    id: number;
    name: string;
    is_visible: boolean;
}

export const useUIStore = defineStore('ui', () => {
    // Define reactive state
    const components = ref<Record<string, boolean>>({});
    const ui_components = ref<UIComponent[]>([]);
    const component = ref<UIComponent>({ id: 0, name: '', is_visible: false });
    const loading = ref(false);
    const errorMessage = ref<string | null>(null);
    const successMessage = ref('');
    const tariff = ref<any>(null);
    const error = ref<string | null>(null);

    async function fetchComponentVisibility() {
        loading.value = true;
        error.value = null;
        try {
            // Type the response as an array of RawUIComponent
            const response = await api.get<RawUIComponent[]>(url);
            // Transform each raw component into a UIComponent
            const transformedComponents = response.data.map(transformUIComponent);
            // Reduce the transformed components into a visibility map
            const visibilityData = transformedComponents.reduce(
                (acc: Record<string, boolean>, item) => {
                    acc[item.name] = item.is_visible;
                    return acc;
                },
                {} as Record<string, boolean>
            );
            components.value = visibilityData;
        } catch (err) {
            console.error(err);
            error.value = 'Failed to fetch components';
        } finally {
            loading.value = false;

        }
    }
    // Action: Fetch all UI components
    async function fetchUIComponents() {
        loading.value = true;
        errorMessage.value = null;
        try {
            const response = await api.get<UIComponent[]>(url);
            ui_components.value = response.data;
        } catch (err) {
            errorMessage.value = 'Failed to fetch UI components';
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

    // Action: Create or update a component
    async function updateComponent() {
        const id = component.value.id ?? 0;
        loading.value = true;
        try {
            if (id === 0) {
                // Create new component
                await api.post(url, component.value);
                successMessage.value = 'Component created successfully!';
            } else {
                // Update existing component
                await api.put(url + id + "/", component.value);
                // Refresh UI components and visibility data after update
                await fetchUIComponents();
                await fetchComponentVisibility();
                successMessage.value = 'Component updated successfully!';
            }
        } catch (err) {
            error.value = 'Failed to update Component';
        } finally {
            loading.value = false;
        }

    }

    // Action: Delete a component
    async function deleteComponent(id: number) {
        loading.value = true;
        try {
            const response = await api.delete(url + id + "/");
            tariff.value = response.data;
        } catch (err) {
            error.value = 'Failed to deleteComponent';
        } finally {
            loading.value = false;
        }
    }

    // Return state and actions for use in components
    return {
        components,
        ui_components,
        component,
        loading,
        errorMessage,
        successMessage,
        tariff,
        fetchComponentVisibility,
        fetchUIComponents,
        updateComponent,
        deleteComponent
    };
});

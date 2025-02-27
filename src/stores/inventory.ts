import api from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Inventory } from '@/types';

const baseApiUrl = `${import.meta.env.VITE_API_URL}`;
const url = `${baseApiUrl}/api/inventory/`;

export const useInventoryStore = defineStore('inventory', () => {
    // State
    const inventories = ref<Inventory[]>([]);
    const inventory = ref<Inventory | null>({} as Inventory); // ✅ Ensure it's always an object
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Fetch all inventories
    async function fetchInventories() {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await api.get(url); 
            inventories.value = data;
        } catch (err) {
            error.value = 'Failed to fetch inventory';
        } finally {
            loading.value = false;
        }
    }

    // Fetch single inventory
    async function fetchInventory(id: number) {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await api.get(`${url}${id}/`);
            inventory.value = data;

        } catch (err) {
            error.value = 'Failed to fetch inventory';
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

    // Update inventory
    async function updateInventory() {
        try {
            await api.patch(`${url}${inventory.value.id}/`, inventory.value);
            await fetchInventories(); // Refresh data
        } catch (err) {
            error.value = 'Failed to update inventory';
        }
    }

    // Delete inventory
    async function deleteInventory(inventoryId: number) {
        try {
            await api.delete(`${url}${inventoryId}/`);
            await fetchInventories(); // Refresh data
        } catch (err) {
            error.value = 'Failed to delete inventory';
        }
    }
    // Return state and functions
    return { inventories, inventory, loading, error, fetchInventories, fetchInventory, updateInventory, deleteInventory };
});

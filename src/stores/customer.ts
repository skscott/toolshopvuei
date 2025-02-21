import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Customer } from '@/types';

const url = `http://127.0.0.1:8050/api/customers/`;

export const useCustomerStore = defineStore('customer', () => {
    // State
    const customers = ref<Customer[]>([]);
    const customer = ref<Customer | null>({} as Customer); // ✅ Ensure it's always an object
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Fetch all customers
    async function fetchCustomers() {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await axios.get(url);
            customers.value = data;
            console.log("Fetched customers: ", customers.value);
        } catch (err) {
            error.value = 'Failed to fetch customers';
        } finally {
            loading.value = false;
        }
    }

    // Fetch single customer
    async function fetchCustomer(id: number) {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await axios.get(`${url}${id}/`);
            console.log("Fetched customer: ", data);
            customer.value = data;

        } catch (err) {
            error.value = 'Failed to fetch customer';
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

    // Update customer
    async function updateCustomer() {
        try {
            await axios.patch(`${url}${customer.value.id}/`, customer.value);
            await fetchCustomers(); // Refresh data
        } catch (err) {
            error.value = 'Failed to update customer';
        }
    }

    // Delete customer
    async function deleteCustomer(customerId: number) {
        try {
            await axios.delete(`${url}${customerId}/`);
            await fetchCustomers(); // Refresh data
        } catch (err) {
            error.value = 'Failed to delete customer';
        }
    }

    // Return state and functions
    return { customers, customer, loading, error, fetchCustomers, fetchCustomer, updateCustomer, deleteCustomer };
});

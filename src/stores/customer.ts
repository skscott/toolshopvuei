// customerStore.ts
import { get_headers_mock } from '@/lib/utils';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const url = `http://127.0.0.1:8050/api/customers/`;

export const useCustomerStore = defineStore('customer', () => {
    const customers = ref<Customer[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchCustomers() {
        loading.value = true;
        error.value = null;
        const headers = get_headers_mock();
        try {
            const response = await fetch(url);
            customers.value = await response.json();
        } catch (err) {
            error.value = 'Failed to fetch customers';
        } finally {
            loading.value = false;
        }
    }

    async function updateCustomer(customerId: string, customerData: Partial<Customer>) {
        try {
            const response = await fetch(`/api/customers/${customerId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData),
            });
            if (!response.ok) throw new Error('Failed to update customer');
            await fetchCustomers();
        } catch (err) {
            error.value = 'Failed to update customer';
        }
    }

    async function deleteCustomer(customerId: string) {
        try {
            const response = await fetch(`/api/customers/${customerId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete customer');
            await fetchCustomers();
        } catch (err) {
            error.value = 'Failed to delete customer';
        }
    }

    return { customers, loading, error, fetchCustomers, updateCustomer, deleteCustomer };
});

// Define Customer interface
interface Customer {
    name: string;
    vat_number: string;
    company_type: string;
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    contact_name: string;
    email: string;
    phone: string;
    industry: string;
    website: string | null;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}
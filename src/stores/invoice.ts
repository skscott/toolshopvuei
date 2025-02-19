import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Invoice } from '@/types';

const url = `http://127.0.0.1:8050/api/invoices/`;

export const useInvoiceStore = defineStore('invoice', () => {
    // State
    const invoices = ref<Invoice[]>([]);
    const invoice = ref<Invoice | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Fetch all invoices
    async function fetchInvoices() {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await axios.get(url);
            
            // Check if API returns a nested invoices URL
            if (data.invoices) {
                const { data: invoicesData } = await axios.get(data.invoices);
                invoices.value = invoicesData;
            } else {
                throw new Error('Invoices endpoint not found in API response');
            }

        } catch (err) {
            error.value = 'Failed to fetch invoices';
        } finally {
            loading.value = false;
        }
    }

    // Fetch single invoice
    async function fetchInvoice(id: number) {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await axios.get(`${url}${id}/`);
            invoice.value = data;
        } catch (err) {
            error.value = 'Failed to fetch invoice';
        } finally {
            loading.value = false;
        }
    }

    // Update invoice
    async function updateInvoice() {
        try {
            await axios.patch(`${url}${invoice.value.id}/`, invoice.value);
            await fetchInvoices(); // Refresh data
        } catch (err) {
            error.value = 'Failed to update invoice';
        }
    }

    // Delete invoice
    async function deleteInvoice(invoiceId: number) {
        try {
            await axios.delete(`${url}${invoiceId}/`);
            await fetchInvoices(); // Refresh data
        } catch (err) {
            error.value = 'Failed to delete invoice';
        }
    }

    // Return state and functions
    return { invoices, invoice, loading, error, fetchInvoices, fetchInvoice, updateInvoice, deleteInvoice };
});

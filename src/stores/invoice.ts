import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Invoice } from '@/types';

const baseApiUrl = `${import.meta.env.VITE_API_URL}`;
// const url = `http://127.0.0.1:8050/api/invoices/`;

export const useInvoiceStore = defineStore('invoice', () => {
    // State
    const invoices = ref<Invoice[]>([]);
    const invoice = ref<Invoice | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchFilteredInvoices(customerId?: number) {
        loading.value = true;
        const url = customerId
            ? `${baseApiUrl}/api/customers/${customerId}/invoices/`
            : `${baseApiUrl}/api/invoices/`;
    
        try {
            await fetchData(url);
        } finally {
            loading.value = false;
        }
    }

    // Fetch all invoices or filter by customerId
    let url = baseApiUrl + `/api/invoices/`;
    async function fetchData(url: string) {

        loading.value = true;
        error.value = null;
        try {
            const { data: invoicesData } = await axios.get(url);
            invoices.value = invoicesData[0].invoices;

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
            await fetchFilteredInvoices(); // Refresh data
        } catch (err) {
            error.value = 'Failed to update invoice';
        }
    }

    // Delete invoice
    async function deleteInvoice(invoiceId: number) {
        try {
            await axios.delete(`${url}${invoiceId}/`);
            await fetchFilteredInvoices(); // Refresh data
        } catch (err) {
            error.value = 'Failed to delete invoice';
        }
    }

    // Return state and functions
    return { invoices, invoice, loading, error, fetchFilteredInvoices, fetchInvoice, updateInvoice, deleteInvoice };
});

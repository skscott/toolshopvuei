// import axios from 'axios';
import api from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Invoice } from '@/types';

const baseApiUrl = `${import.meta.env.VITE_API_URL}`;
const url = `${baseApiUrl}/api/invoices/`;

export const useInvoiceStore = defineStore('invoice', () => {
    // State
    const invoices = ref<Invoice[]>([]);
    const invoice = ref<Invoice | null>(null);
    const last_invoice = ref<Invoice | null>(null);
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

    async function fetchData(url: string) {
        loading.value = true;
        error.value = null;
    
        try {
            const { data: invoicesData } = await api.get(url);
    
            // If the first item is an object with an "invoices" key, extract that
            if (Array.isArray(invoicesData) && invoicesData.length > 0 && "invoices" in invoicesData[0]) {
                invoices.value = invoicesData[0].invoices;
            } 
            // Otherwise, assume it's already a list of invoices
            else {
                invoices.value = invoicesData;
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
            const { data } = await api.get(`${url}${id}/`);
            invoice.value = data;
        } catch (err) {
            error.value = 'Failed to fetch invoice';
        } finally {
            loading.value = false;
        }
    }

    async function fetchLastInvoice() {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await api.get(`${url}last_invoice/`);
            last_invoice.value = data;
        } catch (err) {
            error.value = 'Failed to fetch last invoice';
        } finally {
            loading.value = false;
        }
    }

    // Update invoice
    async function updateInvoice() {
        try {
            await api.patch(`${url}${invoice.value.id}/`, invoice.value);
            await fetchFilteredInvoices(); // Refresh data
        } catch (err) {
            error.value = 'Failed to update invoice';
        }
    }

    // Delete invoice
    async function deleteInvoice(invoiceId: number) {
        try {
            await api.delete(`${url}${invoiceId}/`);
            await fetchFilteredInvoices(); // Refresh data
        } catch (err) {
            error.value = 'Failed to delete invoice';
        }
    }

    // Return state and functions
    return { invoices, invoice, last_invoice, loading, error, fetchFilteredInvoices, fetchInvoice, fetchLastInvoice, updateInvoice, 
        deleteInvoice };
});

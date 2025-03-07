import api from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Job } from '@/types';

const baseApiUrl = `${import.meta.env.VITE_API_URL}`;
const url = `${baseApiUrl}/api/jobs/`;

export const useJobStore = defineStore('job', () => {
    // State
    const jobs = ref<Job[]>([]);
    const job = ref<Job | null>({} as Job); // ✅ Ensure it's always an object
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchFilteredJobs(customerId?: number) {
        loading.value = true;
        const url = customerId
            ? `${baseApiUrl}/api/customers/${customerId}/jobs/`
            : `${baseApiUrl}/api/jobs/`;
    
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
            const { data: jobsData } = await api.get(url);
    
            // If the first item is an object with an "invoices" key, extract that
            if (Array.isArray(jobsData) && jobsData.length > 0 && "jobs" in jobsData[0]) {
                jobs.value = jobsData[0].jobs;
            } 
            // Otherwise, assume it's already a list of invoices
            else {
                jobs.value = jobsData;
            }
        } catch (err) {
            error.value = 'Failed to fjetch invoices';
        } finally {
            loading.value = false;
        }
    }

    // // Fetch all jobs
    // async function fetchJobsByCustomerId(customerId: number) {
    //     const custjobsurl = `${baseApiUrl}/api/customers/${customerId}/jobs/`;
    //     loading.value = true;
    //     error.value = null;
    //     try {
    //         const { data } = await api.get(custjobsurl); 
    //         if (Array.isArray(data) && data.length > 0 && "jobs" in data[0]) {
    //             jobs.value = data[0].jobs;
    //         } 

    //     } catch (err) {
    //         error.value = 'Failed to fetch jobs';
    //     } finally {
    //         loading.value = false;
    //     }
    // }
        
    // // Fetch all jobs
    // async function fetchJobs() {
    //     loading.value = true;
    //     error.value = null;
    //     try {
    //         // const headers = get_headers();
    //         const { data } = await api.get(url); 
    //         jobs.value = data;
    //     } catch (err) {
    //         error.value = 'Failed to fetch jobs';
    //     } finally {
    //         loading.value = false;
    //     }
    // }

    // Fetch single job
    async function fetchJob(id: number) {
        loading.value = true;
        error.value = null;
        try {
            // const headers = get_headers();
            const { data } = await api.get(`${url}${id}/`);
            job.value = data;

        } catch (err) {
            error.value = 'Failed to fetch job';
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

    // Update job
    async function updateJob() {
        try {
            const result = await api.patch(`${url}${job.value.id}/`, job.value);
            await fetchFilteredJobs(result.data.customer); // Refresh data
        } catch (err) {
            error.value = 'Failed to update job';
        }
    }

    // Delete job
    async function deleteJob(jobId: number) {
        try {
            const customerid =job.value?.customer_id;
            await api.delete(`${url}${jobId}/`);
            await fetchFilteredJobs(customerid); // Refresh data
        } catch (err) {
            error.value = 'Failed to delete job';
        }
    }
    // Return state and functions
    return { jobs, job, loading, error, fetchFilteredJobs, fetchJob, updateJob, deleteJob };
});

import api from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Job } from '@/types';
// import { get_headers } from './headers';

const baseApiUrl = `${import.meta.env.VITE_API_URL}`;
const url = `${baseApiUrl}/api/jobs/`;

export const useJobStore = defineStore('job', () => {
    // State
    const jobs = ref<Job[]>([]);
    const job = ref<Job | null>({} as Job); // ✅ Ensure it's always an object
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Fetch all jobs
    async function fetchJobs() {
        loading.value = true;
        error.value = null;
        try {
            // const headers = get_headers();
            const { data } = await api.get(url); 
            jobs.value = data;
        } catch (err) {
            error.value = 'Failed to fetch jobs';
        } finally {
            loading.value = false;
        }
    }

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
            await api.patch(`${url}${job.value.id}/`, job.value);
            await fetchJobs(); // Refresh data
        } catch (err) {
            error.value = 'Failed to update job';
        }
    }

    // Delete job
    async function deleteJob(jobId: number) {
        try {
            await api.delete(`${url}${jobId}/`);
            await fetchJobs(); // Refresh data
        } catch (err) {
            error.value = 'Failed to delete job';
        }
    }
    // Return state and functions
    return { jobs, job, loading, error, fetchJobs, fetchJob, updateJob, deleteJob };
});

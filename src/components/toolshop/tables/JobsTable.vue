<script setup lang="ts">

import { ref, onMounted, computed, Text, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { FilterMatchMode } from '@primevue/core/api';
import { Checkbox, Column, InputNumber, InputText, useToast } from 'primevue';
import Toast from 'primevue';
import { useJobStore } from '@/stores/job';
import { useRouter } from 'vue-router';
import { Job } from '@/types';
import { job_status } from '@/lists/job_status';
import { useValidation, requiredRule, greaterThanRule, sensibleDateRule, minLengthRule, emailRule } from '@/composables/useValidation';

const props = defineProps<{ customerId: number }>();
const customerId = computed(() => props.customerId);
const router = useRouter();
const store = useJobStore();
const selectedJobStatus = ref(null); // Holds selected invoice status object
const dropdownItems = ref(job_status); // Initialize dropdown items
const filters = ref({'global': {value: null, matchMode: FilterMatchMode.CONTAINS}});
const selectedJobs = ref();
const deleteUIDialog = false;
const deleteProductsDialog = false;
const submitted = ref(false);

let toast = useToast();

const dialogState = ref({
    editDialog: false,
    deleteDialog: false,
    deletesDialog: false,
});

// Validation stuff
const rules = {
    job_title: [requiredRule],
    description: [requiredRule],
    cost_estimate: [requiredRule, greaterThanRule(0)],
    actual_cost: [requiredRule, greaterThanRule(0)],
    status: [requiredRule],
    start_date: [requiredRule],
    end_date: [
    requiredRule,
    sensibleDateRule(
      'date_issued', () => store.job.start_date,
      'End Date', // Display name for due_date
      'Startr Date' // Display name for date_issued
    ),
  ],
};

const { errors, validate, validateField, resetValidation} = useValidation(rules);

// Belt and braces. Disable the save button if there are any errors
const hasErrors = computed(() => {
  return Object.values(errors.value).some((error) => error !== '');
});

onMounted(() => {
    store.fetchJobsByCustomerId(customerId.value);
});

// Watch for changes in store.invoice and update selectedInvoice
watch(() => store.job, (newVal) => {
    if (newVal && newVal.status) {
        selectedJobStatus.value = dropdownItems.value.find(item => item.code === newVal.status);
    }
}, { immediate: true });

// Watch for changes in selectedInvoice and update store.invoice.status
watch(selectedJobStatus, (newVal) => {
    if (newVal) {
        store.job.status = newVal.code; // Update store.invoice.status with the selected code
    }
});

function openNew(type: 'editDialog' | 'deleteDialog' | 'deletesDialog') {
    dialogState.value[type] = true;
    store.job = {} as Job 
    selectedJobStatus.value = null; // Reset selected status
    resetValidation(); // Reset validation errors
}

function editJob(job) {
    console.log("Job edit:", job);
    store.job = {...job};
    resetValidation(); 
    openDialog('editDialog');
};

function detailJob(job) {
    router.push({ path: `/toolshop/jobs/${job.id}` });
};

function findIndexById(id: number) {
    let index = -1;
    for (let i = 0; i < store.jobs.length; i++) {
        if (store.jobs[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

function saveJob() {
    submitted.value = true;

    if (store.job?.job_title?.trim()) {
        if (store.job.id) {
            store.jobs[findIndexById(store.job.id)] = store.job;
            toast.add({severity:'success', summary: 'Successful', detail: 'Job Updated', life: 3000});
        }
        else {
            store.jobs.push(store.job);
            toast.add({severity:'success', summary: 'Successful', detail: 'Job Created', life: 3000});
        }
        store.updateJob();
        closeDialog('editDialog');
        store.job = { } as Job;
    }
};

function deleteJob(job: any) {
    store.job = job;
    openDialog('deleteDialog');
};

function confirmDeleteJob() {
    console.log("Job to delete:", JSON.stringify(store.job));
    store.jobs = store.jobs.filter(val => val.id !== store.job.id);
    store.deleteJob(store.job.id);
    toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
    closeDialog('deleteDialog');    
};

function confirmDeleteSelected() {
    openDialog('deletesDialog');
};

function deleteSelectedJobs() {
    console.log("Selected Jobs:", selectedJobs);
    store.jobs = store.jobs.filter(val => !selectedJobs.value.includes(val));
    closeDialog('deletesDialog');
    selectedJobs.value = null;
    toast.add({severity:'success', summary: 'Successful', detail: 'Jobs Deleted', life: 3000});
};

function openDialog(type: 'editDialog' | 'deleteDialog' | 'deletesDialog') {
    dialogState.value[type] = true;
}

function closeDialog(type: 'editDialog' | 'deleteDialog' | 'deletesDialog') {
    dialogState.value[type] = false;
}

</script>

<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew('editDialog')" />
                <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected" :disabled="!selectedJobs || !selectedJobs.length" />
            </template>

            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                <!-- <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" /> -->
            </template>
        </Toolbar>

        <DataTable 
            :value="store.jobs" 
            v-model:selection="selectedJobs"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            tableStyle="min-width: 50rem"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="{first} : {last} of {totalRecords} UI Jobs"
            >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Manage Jobs</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                    </IconField>
                </div>
            </template>

            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="job_title" header="Job Title"></Column>
            <Column field="description" header="Description"></Column>
            <Column field="status" header="Status"></Column>
            <Column field="cost_estimate" header="Cost Estimate"></Column>
            <Column header="Actions">
            <template #body="slotProps">
                <!-- Actions Column for Edit and Delete -->
                <div class="flex gap-2">
                    <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-info p-mr-2"
                    @click="editJob(slotProps.data)" 
                    />
                    <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-danger p-mr-2"
                    @click="deleteJob(slotProps.data)" 
                    />
                </div>
        </template>
    </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="dialogState.editDialog" :style="{ width: '600px' }" header="Job Details" :modal="true">
        <div class="flex flex-col gap-6">
             <div class="card flex flex-col gap-4">
                <div class="grid grid-cols-12 gap-2">
                    <label for="job_title" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Title</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="job_title" v-model="store.job.job_title" required="true" rows="3" cols="20" fluid 
                        @blur="validateField('job_title', store.job.job_title)"/>
                        <InlineMessage v-if="errors.job_title" severity="error">{{ errors.job_title }}</InlineMessage> 
                    </div>
                    <label for="description" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Description</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="description" v-model="store.job.description" required="true" rows="3" cols="20" fluid 
                        @blur="validateField('description', store.job.description)"/>
                        <InlineMessage v-if="errors.description" severity="error">{{ errors.description }}</InlineMessage> 
                    </div>
                    <label for="start_date" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Start Date</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText type="date" id="start_date" v-model="store.job.start_date" required="true" rows="3" cols="20" fluid 
                        @blur="validateField('start_date', store.job.start_date)"/>
                        <InlineMessage v-if="errors.start_date" severity="error">{{ errors.start_date }}</InlineMessage>
                    </div>
                    <label for="end_date" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">End Date</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText type="date" id="end_date" v-model="store.job.end_date" required="true" rows="3" cols="20" fluid                         
                        @blur="validateField('end_date', store.job.end_date)"/>
                        <InlineMessage v-if="errors.end_date" severity="error">{{ errors.end_date }}</InlineMessage>
                    </div>
                    <label for="cost_estimate" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Cost Estimate</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText type="currency" id="cost_estimate" v-model="store.job.cost_estimate" required="true" rows="3" cols="20" fluid
                        @blur="validateField('cost_estimate', store.job.cost_estimate)" />
                        <InlineMessage v-if="errors.cost_estimate" severity="error">{{ errors.cost_estimate }}</InlineMessage>
                    </div>
                    <label for="actual_cost" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Actual Cost</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText type="currency" id="actual_cost" v-model="store.job.actual_cost" required="true" rows="3" cols="20" fluid 
                        @blur="validateField('actual_cost', store.job.actual_cost)" />
                        <InlineMessage v-if="errors.actual_cost" severity="error">{{ errors.actual_cost }}</InlineMessage>
                    </div>
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-9">
                        <Select id="state" v-model="selectedJobStatus" :options="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full" 
                        @blur="validateField('status', selectedJobStatus)"/>
                        <InlineMessage v-if="errors.status" severity="error">{{ errors.status }}</InlineMessage>
                    </div>   
                </div>   
            </div>
        </div>
        
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="closeDialog('editDialog')" />
            <Button label="Save" icon="pi pi-check"  :disabled="hasErrors" @click="saveJob" />
        </template>
    </Dialog>

    <Dialog v-model:visible="dialogState.deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="store.job"
                >Are you sure you want to delete <b>{{ store.job.job_title }}</b
                >?</span
            >
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="closeDialog('deleteDialog')" />
            <Button label="Yes" icon="pi pi-check" @click="confirmDeleteJob" />
        </template>
    </Dialog>

    <Dialog v-model:visible="dialogState.deletesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="store.job">Are you sure you want to delete the selected jobs?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="closeDialog('deletesDialog')" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedJobs" />
        </template>
    </Dialog>

</template>


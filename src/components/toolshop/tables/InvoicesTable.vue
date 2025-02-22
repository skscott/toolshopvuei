<script setup lang="ts">

import { ref, onMounted, computed, watchEffect, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { FilterMatchMode } from '@primevue/core/api';
import { Checkbox, Column, InputText, useToast } from 'primevue';
import Toast from 'primevue';
import { useInvoiceStore } from '@/stores/invoice';
import { Invoice } from '@/types';
import { invoice_status } from '@/lists/invoice_status';

const store = useInvoiceStore();
const props = defineProps<{ customerId: number }>();
const customerId = computed(() => props.customerId);

const selectedInvoice = ref(null); // Holds selected invoice status object
const dropdownItems = ref(invoice_status); // Initialize dropdown items

onMounted(async () => {
    await store.fetchFilteredInvoices(customerId.value);
    // Initialize selectedInvoice if store.invoice is populated
    if (store.invoice && store.invoice.status) {
        selectedInvoice.value = dropdownItems.value.find(item => item.code === store.invoice.status);
    }
});

// Watch for changes in store.invoice and update selectedInvoice
watch(() => store.invoice, (newVal) => {
    if (newVal && newVal.status) {
        selectedInvoice.value = dropdownItems.value.find(item => item.code === newVal.status);
    }
}, { immediate: true });

// Watch for changes in selectedInvoice and update store.invoice.status
watch(selectedInvoice, (newVal) => {
    if (newVal) {
        store.invoice.status = newVal.code; // Update store.invoice.status with the selected code
    }
});
const filters = ref({'global': {value: null, matchMode: FilterMatchMode.CONTAINS}});
const selectedInvoices = ref();
const deleteUIDialog = false;
const deleteProductsDialog = false;
const submitted = ref(false);

let toast = useToast();

const dialogState = ref({
    editDialog: false,
    deleteDialog: false,
    deletesDialog: false,
});

function openNew(type: 'editDialog' | 'deleteDialog' | 'deletesDialog') {
    dialogState.value[type] = true;
    store.invoice = {} as Invoice 
}

function editInvoice(invoice: Invoice) {
    console.log("Invoice edit:", invoice);
    store.invoice = {...invoice};
    openDialog('editDialog');
};

function findIndexById(id: number) {
    let index = -1;
    for (let i = 0; i < store.invoices.length; i++) {
        if (store.invoices[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

function saveInvoice() {
    submitted.value = true;
    if (store.invoice.id) {
        store.invoices[findIndexById(store.invoice.id)] = store.invoice;
        toast.add({severity:'success', summary: 'Successful', detail: 'Invoice Updated', life: 3000});
    }
    else {
        store.invoices.push(store.invoice);
        toast.add({severity:'success', summary: 'Successful', detail: 'Invoice Created', life: 3000});
    }
    store.updateInvoice();
    closeDialog('editDialog');
    store.invoice = { } as Invoice;

};

function deleteInvoice(invoice: any) {
    store.invoice = invoice;
    openDialog('deleteDialog');
};

function confirmDeleteInvoice() {
    console.log("Invoice to delete:", JSON.stringify(store.invoice));
    store.invoices = store.invoices.filter(val => val.id !== store.invoice.id);
    store.deleteInvoice(store.invoice.id);
    toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
    closeDialog('deleteDialog');    
};

function confirmDeleteSelected() {
    openDialog('deletesDialog');
};

function deleteSelectedInvoices() {
    console.log("Selected Invoices:", selectedInvoices);
    store.invoices = store.invoices.filter(val => !selectedInvoices.value.includes(val));
    closeDialog('deletesDialog');
    selectedInvoices.value = null;
    toast.add({severity:'success', summary: 'Successful', detail: 'Invoices Deleted', life: 3000});
};

function openDialog(type: 'editDialog' | 'deleteDialog' | 'deletesDialog') {
    dialogState.value[type] = true;
}

function closeDialog(type: 'editDialog' | 'deleteDialog' | 'deletesDialog') {
    dialogState.value[type] = false;
}

function getNumberRows() {
    // display a shorter table if the customer is selected
    return customerId.value ? 5 : 10;
}
</script>

<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew('editDialog')" />
                <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected" :disabled="!selectedInvoices || !selectedInvoices.length" />
            </template>

            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                <!-- <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" /> -->
            </template>
        </Toolbar>

        <DataTable 
            :value="store.invoices" 
            v-model:selection="selectedInvoices"
            dataKey="id"
            :paginator="true"
            :rows="getNumberRows()"
            :filters="filters"
            tableStyle="min-width: 50rem"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="{first} : {last} of {totalRecords} UI Invoices"
            >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Manage Invoices</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                    </IconField>
                </div>
            </template>

            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="id" header="Id"></Column>
            <Column field="invoice_number" header="Invoice Nbr."></Column>
            <Column field="total_amount" header="Total Amount"></Column>
            <Column field="status" header="Status"></Column>
            <Column field="due_date" header="Due Date"></Column>
            <Column header="Actions">
            <template #body="slotProps">
                <!-- Actions Column for Edit and Delete -->
                <div class="flex gap-2">
                    <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-info p-mr-2"
                    @click="editInvoice(slotProps.data)" 
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-danger p-mr-2"
                    @click="deleteInvoice(slotProps.data)" 
                />
            </div>
        </template>
    </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="dialogState.editDialog" :style="{ width: '600px' }" header="Invoice Details" :modal="true">
        <div class="flex flex-col gap-6">
            <div class="card flex flex-col gap-4">
                <div class="grid grid-cols-12 gap-2">
                    <label for="invoice_number" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Invoice Nbr</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="name" v-model="store.invoice.invoice_number" required="true" rows="3" cols="20" fluid />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Amount</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="name" v-model="store.invoice.total_amount" required="true" rows="3" cols="20" fluid />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-9">
                        <Select id="state" v-model="selectedInvoice" :options="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full" /> 
                    </div>
                </div>                
                <div class="grid grid-cols-12 gap-2">
                    <label for="due_date" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Due Date</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText type="date" id="name" v-model="store.invoice.due_date" required="true" rows="3" cols="20" fluid />
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="closeDialog('editDialog')" />
            <Button label="Save" icon="pi pi-check" @click="saveInvoice" />
        </template>
    </Dialog>

    <Dialog v-model:visible="dialogState.deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="store.invoice"
                >Are you sure you want to delete <b>{{ store.invoice.id }}</b
                >?</span
            >
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="closeDialog('deleteDialog')" />
            <Button label="Yes" icon="pi pi-check" @click="confirmDeleteInvoice" />
        </template>
    </Dialog>

    <Dialog v-model:visible="dialogState.deletesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="store.invoice">Are you sure you want to delete the selected invoices?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="closeDialog('deletesDialog')" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedInvoices" />
        </template>
    </Dialog>

</template>


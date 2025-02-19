<script setup lang="ts">

import { ref, onMounted, computed, Text } from 'vue';
import { useUIStore } from '@/stores/ui';
import { FilterMatchMode } from '@primevue/core/api';
import { Checkbox, Column, InputText, useToast } from 'primevue';
import Toast from 'primevue';
import { useCustomerStore } from '@/stores/customer';
import { useRouter } from 'vue-router';
import { Customer } from '@/types';

const router = useRouter();

const store = useCustomerStore();

onMounted(() => {
    store.fetchCustomers();
    console.log("Customers Table:", store.customers);
});

const filters = ref({'global': {value: null, matchMode: FilterMatchMode.CONTAINS}});
const selectedCustomers = ref();
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
    store.customer = {} as Customer 
}

function editCustomer(customer) {
    console.log("Customer edit:", customer);
    store.customer = {...customer};
    openDialog('editDialog');
};

function detailCustomer(customer) {
    router.push({ path: `/toolshop/customers/${customer.id}` });
};

function findIndexById(id: number) {
    let index = -1;
    for (let i = 0; i < store.customers.length; i++) {
        if (store.customers[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

function saveCustomer() {
    submitted.value = true;

    if (store.customer?.name?.trim()) {
        if (store.customer.id) {
            store.customers[findIndexById(store.customer.id)] = store.customer;
            toast.add({severity:'success', summary: 'Successful', detail: 'Customer Updated', life: 3000});
        }
        else {
            store.customers.push(store.customer);
            toast.add({severity:'success', summary: 'Successful', detail: 'Customer Created', life: 3000});
        }
        store.updateCustomer();
        closeDialog('editDialog');
        store.customer = { } as Customer;
    }
};

function deleteCustomer(customer: any) {
    store.customer = customer;
    openDialog('deleteDialog');
};

function confirmDeleteCustomer() {
    console.log("Customer to delete:", JSON.stringify(store.customer));
    store.customers = store.customers.filter(val => val.id !== store.customer.id);
    store.deleteCustomer(store.customer.id);
    toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
    closeDialog('deleteDialog');    
};

function confirmDeleteSelected() {
    openDialog('deletesDialog');
};

function deleteSelectedCustomers() {
    console.log("Selected Customers:", selectedCustomers);
    store.customers = store.customers.filter(val => !selectedCustomers.value.includes(val));
    closeDialog('deletesDialog');
    selectedCustomers.value = null;
    toast.add({severity:'success', summary: 'Successful', detail: 'Customers Deleted', life: 3000});
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
                <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected" :disabled="!selectedCustomers || !selectedCustomers.length" />
            </template>

            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                <!-- <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" /> -->
            </template>
        </Toolbar>

        <DataTable 
            :value="store.customers" 
            v-model:selection="selectedCustomers"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            tableStyle="min-width: 50rem"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="{first} : {last} of {totalRecords} UI Customers"
            >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Manage Customers</h4>
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
            <Column field="name" header="Name"></Column>
            <Column field="city" header="City"></Column>
            <Column field="postal_code" header="Postal Code"></Column>
            <Column header="Actions">
            <template #body="slotProps">
                <!-- Actions Column for Edit and Delete -->
                <div class="flex gap-2">
                    <Button 
                    icon="pi pi-eye" 
                    class="p-button-rounded p-button-success p-mr-2 "
                    @click="detailCustomer(slotProps.data)" 
                    />
                    <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-info p-mr-2"
                    @click="editCustomer(slotProps.data)" 
                    />
                    <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-danger p-mr-2"
                    @click="deleteCustomer(slotProps.data)" 
                    />
                </div>
        </template>
    </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="dialogState.editDialog" :style="{ width: '600px' }" header="Customer Details" :modal="true">
        <div class="flex flex-col gap-6">
             <div class="card flex flex-col gap-4">
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Name</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="name" v-model="store.customer.name" required="true" rows="3" cols="20" fluid />
                    </div>
                    <label for="city" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">City</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="name" v-model="store.customer.city" required="true" rows="3" cols="20" fluid />
                    </div>
                    <label for="postal_code" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Postal Code</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="postal_code" v-model="store.customer.postal_code" required="true" rows="3" cols="20" fluid />
                    </div>
                    <label for="country" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Country</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="postal_code" v-model="store.customer.country" required="true" rows="3" cols="20" fluid />
                    </div>
                    <label for="contact_name" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Contact Name</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="contact_name" v-model="store.customer.contact_name" required="true" rows="3" cols="20" fluid />
                    </div>
                    <label for="email" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">E-mail</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="contact_name" v-model="store.customer.email" required="true" rows="3" cols="20" fluid />
                    </div>
                    <label for="website" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Website</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="website" v-model="store.customer.website" required="true" rows="3" cols="20" fluid />
                    </div>
                </div>
            </div>
        </div>
        
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="closeDialog('editDialog')" />
            <Button label="Save" icon="pi pi-check" @click="saveCustomer" />
        </template>
    </Dialog>

    <Dialog v-model:visible="dialogState.deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="store.customer"
                >Are you sure you want to delete <b>{{ store.customer.name }}</b
                >?</span
            >
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="closeDialog('deleteDialog')" />
            <Button label="Yes" icon="pi pi-check" @click="confirmDeleteCustomer" />
        </template>
    </Dialog>

    <Dialog v-model:visible="dialogState.deletesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="store.customer">Are you sure you want to delete the selected customers?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="closeDialog('deletesDialog')" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedCustomers" />
        </template>
    </Dialog>

</template>


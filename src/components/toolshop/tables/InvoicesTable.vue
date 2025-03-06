<script setup lang="ts">

import { ref, onMounted, computed, watchEffect, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { FilterMatchMode } from '@primevue/core/api';
import { Checkbox, Column, InputText, useToast } from 'primevue';
import Toast from 'primevue';
import { useInvoiceStore } from '@/stores/invoice';
import { Invoice } from '@/types';
import { invoice_status } from '@/lists/invoice_status';
import { useValidation, requiredRule, greaterThanRule, sensibleDateRule, minLengthRule, emailRule, selectRule } from '@/composables/useValidation';

const store = useInvoiceStore();
const props = defineProps<{ customerId: number }>();
const customerId = computed(() => props.customerId);
const selectedInvoiceStatus = ref('');
const dropdownItems = ref(invoice_status); // Initialize dropdown items
let toast = useToast();

const filters = ref({'global': {value: null, matchMode: FilterMatchMode.CONTAINS}});
const selectedInvoices = ref();
const deleteUIDialog = false;
const deleteProductsDialog = false;
const submitted = ref(false);

// Validation stuff
const rules = {
    invoice_number: [requiredRule],
    date_issued: [requiredRule],
    total_amount: [requiredRule, greaterThanRule(0)],
    status: [requiredRule],
    due_date: [
    requiredRule,
    sensibleDateRule(
      'date_issued', () => store.invoice.date_issued,
      'Due Date', // Display name for due_date
      'Date Issued' // Display name for date_issued
    ),
  ],
};
const { errors, validate, validateField, resetValidation} = useValidation(rules);

// Belt and braces. Disable the save button if there are any errors
const hasErrors = computed(() => {
  return Object.values(errors.value).some((error) => error !== '');
});

onMounted(async () => {
    await store.fetchFilteredInvoices(customerId.value);
    
    // Ensure selectedInvoiceStatus is correctly initialized as a string
    if (store.invoice && store.invoice.status) {
        selectedInvoiceStatus.value = store.invoice.status; // Directly assign the string
    }
});


watch(() => store.invoice, (newVal) => {
    if (newVal && newVal.status) {
        selectedInvoiceStatus.value = newVal.status; // Ensure it's always a string
    }
}, { immediate: true });

watch(selectedInvoiceStatus, (newVal) => {
    store.invoice.status = newVal; // No longer assigning an object
});


const dialogState = ref({
    editDialog: false,
    deleteDialog: false,
    deletesDialog: false,
});

async function openNew(type: 'editDialog' | 'deleteDialog' | 'deletesDialog') {
    try{
        await store.fetchLastInvoice();
        const newId = (store.last_invoice?.id || 0) + 1; // Default to 0 if last_invoice.id is null/undefined
        const zeroFilledId = newId.toString().padStart(6, '0');
        store.invoice = { customer_id: customerId.value, invoice_number: "INV" + zeroFilledId} as Invoice;
        resetValidation(); // Reset validation errors
        dialogState.value[type] = true;
    } catch (error) {
        console.error("Error fetching last invoice:", error);
    }
}

function editInvoice(invoice: Invoice) {
    console.log("Invoice edit:", invoice);
    store.invoice = {...invoice};
    resetValidation(); // Reset validation errors
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
    try
    {
        let message = store.invoice.id ? 'Invoice Updated' : 'Invoice Created';
        if (store.invoice.id) {
            store.updateInvoice();
            store.invoices[findIndexById(store.invoice.id)] = store.invoice;
        }
        else {
            store.createInvoice();
            store.invoices.push(store.invoice);
        }
        toast.add({severity:'success', summary: 'Successful', detail: message, life: 3000});
        store.invoice = { } as Invoice;
    } 
    catch (error) {
        toast.add({severity:'error', summary: 'Error', detail: error, life: 3000});
        console.error("Error saving invoice:", error);
    }
    finally {
        closeDialog('editDialog');
    }
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
    if(type === 'editDialog') {
        store.invoice = { } as Invoice;
        resetValidation(); // Reset validation errors
    }
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
                        <InputText id="invoice_number" v-model="store.invoice.invoice_number" disabled required="true" rows="3" cols="20" fluid
                        @blur="validateField('invoice_number', store.invoice.invoice_number)"/>
                        <InlineMessage v-if="errors.invoice_number" severity="error">{{ errors.invoice_number }}</InlineMessage>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="total_amount" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Amount</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="total_amount" v-model="store.invoice.total_amount" required="true" rows="3" cols="20" fluid
                        @blur="validateField('total_amount', store.invoice.total_amount)"/>
                        <InlineMessage v-if="errors.total_amount" severity="error">{{ errors.total_amount }}</InlineMessage>
                    </div>
                </div>
                
                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-9">
                        <Select id="status"
                            v-model="selectedInvoiceStatus"
                            :options="dropdownItems"
                            optionLabel="name"
                            optionValue="value"
                            placeholder="Select One"
                            class="w-full"
                            @blur="validateField('status', selectedInvoiceStatus)"/>
                        
                        <InlineMessage v-if="errors.status" severity="error">{{ errors.status }}</InlineMessage> 
                    </div>
                </div>    

                <div class="grid grid-cols-12 gap-2">
                    <label for="date_issued" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Date Issued</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText type="date" id="date_issued" v-model="store.invoice.date_issued" required="true" rows="3" cols="20" fluid
                        @blur="validateField('date_issued', store.invoice.date_issued)"/>
                        <InlineMessage v-if="errors.date_issued" severity="error">{{ errors.date_issued }}</InlineMessage>
                    </div>
                </div>  <div class="grid grid-cols-12 gap-2">
                    <label for="due_date" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Due Date</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText type="date" id="due_date" v-model="store.invoice.due_date" required="true" rows="3" cols="20" fluid
                        @blur="validateField('due_date', store.invoice.due_date)"/>
                        <InlineMessage v-if="errors.due_date" severity="error">{{ errors.due_date }}</InlineMessage>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="closeDialog('editDialog')" />
            <Button label="Save" icon="pi pi-check" :disabled="hasErrors" @click="saveInvoice" />
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


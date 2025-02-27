<script setup lang="ts">

import { ref, onMounted, computed, Text } from 'vue';
import { useUIStore } from '@/stores/ui';
import { FilterMatchMode } from '@primevue/core/api';
import { Checkbox, Column, InputText, useToast } from 'primevue';
import Toast from 'primevue';
import { useInventoryStore } from '@/stores/inventory';
import { useRouter } from 'vue-router';
import { Inventory, InventoryItem } from '@/types';

const router = useRouter();
const store = useInventoryStore();

const props = defineProps<{ inventoryId: number }>();
const inventoryId = computed(() => props.inventoryId);

onMounted(() => {
    store.fetchInventoryItems(inventoryId.value);
});

const filters = ref({'global': {value: null, matchMode: FilterMatchMode.CONTAINS}});
const selectedInventoryItems = ref();
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
    store.inventoryItem = {} as InventoryItem;
}

function editInventoryItem(inventoryItem) {
    console.log("Inventory Item edit:", inventoryItem);
    store.inventoryItem = {...inventoryItem};
    openDialog('editDialog');
};

function detailInventoryItem(inventoryItem) {
    router.push({ path: `/toolshop/inventory/${inventoryItem.id}` });
};

function findIndexById(id: number) {
    let index = -1;
    for (let i = 0; i < store.inventoryItems.length; i++) {
        if (store.inventoryItems[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

function saveInventory() {
    submitted.value = true;

    if (store.inventoryItem?.name?.trim()) {
        if (store.inventoryItem.id) {
            store.inventoryItems[findIndexById(store.inventoryItem.id)] = store.inventoryItem;
            toast.add({severity:'success', summary: 'Successful', detail: 'Inventory Item Updated', life: 3000});
        }
        else {
            store.inventories.push(store.inventory);
            toast.add({severity:'success', summary: 'Successful', detail: 'Inventory Item Created', life: 3000});
        }
        store.updateInventory();
        closeDialog('editDialog');
        store.inventory = { } as Inventory;
    }
};

function deleteInventoryItem(inventoryItem: any) {
    store.inventoryItem = inventoryItem;
    openDialog('deleteDialog');
};

function confirmDeleteinventoryItem() {
    console.log("Inventory to delete:", JSON.stringify(store.inventoryItem));
    store.inventoryItems = store.inventoryItems.filter(val => val.id !== store.inventoryItem.id);
    store.deleteInventory(store.inventoryItem.id);
    toast.add({severity:'success', summary: 'Successful', detail: 'Inventory item deleted', life: 3000});
    closeDialog('deleteDialog');    
};

function confirmDeleteSelected() {
    openDialog('deletesDialog');
};

function deleteSelectedInventories() {
    console.log("Selected Inventory Items:", selectedInventoryItems);
    store.inventories = store.inventories.filter(val => !selectedInventoryItems.value.includes(val));
    closeDialog('deletesDialog');
    selectedInventoryItems.value = null;
    toast.add({severity:'success', summary: 'Successful', detail: 'Inventories Deleted', life: 3000});
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
                <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected" :disabled="!selectedInventoryItems || !selectedInventoryItems.length" />
            </template>

            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                <!-- <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" /> -->
            </template>
        </Toolbar>

        <DataTable 
            :value="store.inventoryItems" 
            v-model:selection="selectedInventoryItems"
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
                    <h4 class="m-0">Manage Inventory Items</h4>
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
            <Column field="description" header="Description"></Column>
            <Column field="sku" header="SKU"></Column>
            <Column header="Actions">
            <template #body="slotProps">
                <!-- Actions Column for Edit and Delete -->
                <div class="flex gap-2">
                    <Button 
                    icon="pi pi-eye" 
                    class="p-button-rounded p-button-success p-mr-2 "
                    @click="detailInventoryItem(slotProps.data)" 
                    />
                    <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-info p-mr-2"
                    @click="editInventoryItem(slotProps.data)" 
                    />
                    <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-danger p-mr-2"
                    @click="deleteInventoryItem(slotProps.data)" 
                    />
                </div>
        </template>
    </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="dialogState.editDialog" :style="{ width: '600px' }" header="Inventory Item Details" :modal="true">
        <div class="flex flex-col gap-6">
             <div class="card flex flex-col gap-4">
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Name</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="name" v-model="store.inventoryItem.name" required="true" rows="3" cols="20" fluid />
                    </div>
                    <label for="description" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Description</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="description" v-model="store.inventoryItem.description" required="true" rows="3" cols="20" fluid />
                    </div>
                    <label for ="sku" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">SKU</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="sku" v-model="store.inventoryItem.sku" required="true" cols="20" fluid />
                    </div>
                    <label for="price" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Price</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="price" v-model="store.inventoryItem.price" required="true" cols="20" fluid />
                    </div>
                    <label for="stock_quantity" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Quantity</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputNumber id="stock_quantity" v-model="store.inventoryItem.stock_quantity" required="true" cols="20" fluid />  
                    </div>
                    <label for="inventory_name" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Inventory Name</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText id="inventory_name" v-model="store.inventoryItem.inventory_name" required="true" cols="20" fluid />
                    </div>
                </div>
            </div>
        </div>
        
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="closeDialog('editDialog')" />
            <Button label="Save" icon="pi pi-check" @click="saveInventory" />
        </template>
    </Dialog>

    <Dialog v-model:visible="dialogState.deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="store.inventory"
                >Are you sure you want to delete <b>{{ store.inventory.name }}</b
                >?</span
            >
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="closeDialog('deleteDialog')" />
            <Button label="Yes" icon="pi pi-check" @click="confirmDeleteinventoryItem" />
        </template>
    </Dialog>

    <Dialog v-model:visible="dialogState.deletesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="store.inventory">Are you sure you want to delete the selected customers?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="closeDialog('deletesDialog')" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedInventories" />
        </template>
    </Dialog>

</template>


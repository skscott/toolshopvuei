<script setup lang="ts">

import { ref, onMounted, computed, Text } from 'vue';
import { useUIStore } from '@/stores/ui';
import { FilterMatchMode } from '@primevue/core/api';
import { Checkbox, Column, InputText, useToast } from 'primevue';
import Toast from 'primevue';
const store = useUIStore();
const filters = ref({'global': {value: null, matchMode: FilterMatchMode.CONTAINS}});
const selectedComponents = ref();
const deleteUIDialog = false;
const deleteProductsDialog = false;
const submitted = ref(false);

let toast = useToast();

// let component = ref({
//     id: 0,
//     name: '',
//     isVisible: false,
// });

onMounted(() => {
    store.fetchUIComponents();
});

const dialogState = ref({
    editDialog: false,
    deleteDialog: false,
});

function openNew(type: 'editDialog' | 'deleteDialog') {
    dialogState.value[type] = true;
    store.component = {
        id: 0,
        name: '',
        is_visible: false,
    };
}

function editComponent(p_component) {
    console.log("Component edit:", p_component);
    store.component = {...p_component};
    openDialog('editDialog');
};

function findIndexById(id: number) {
    let index = -1;
    for (let i = 0; i < store.ui_components.length; i++) {
        if (store.ui_components[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

function saveComponent() {
    submitted.value = true;

    if (store.component?.name?.trim()) {
        if (store.component.id) {
            store.ui_components[findIndexById(store.component.id)] = store.component;
        }
        else {
            store.ui_components.push(store.component);
            toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
        }
        store.updateComponent();
        closeDialog('editDialog');
        store.component = { id: 0, name: '', is_visible: false };
    }
};

function deleteComponent(component: any) {
    store.ui_components = store.ui_components.filter(val => val.id !== component.value.id);
    toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
    closeDialog('deleteDialog');    
};

function openDialog(type: 'editDialog' | 'deleteDialog') {
    dialogState.value[type] = true;
}

function closeDialog(type: 'editDialog' | 'deleteDialog') {
    dialogState.value[type] = false;
}

</script>

<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew('editDialog')" />
                <!-- <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" /> -->
            </template>

            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                <!-- <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" /> -->
            </template>
        </Toolbar>

        <DataTable 
            :value="store.ui_components" 
            v-model:selection="selectedComponents"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            tableStyle="min-width: 50rem"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="{first} : {last} of {totalRecords} UI Components"
            >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Manage Components</h4>
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
            <Column field="is_visible" header="Visible"></Column>
            <Column header="Actions">
            <template #body="slotProps">
                <!-- Actions Column for Edit and Delete -->
                <div class="flex gap-2">
                    <Button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-info p-mr-2"
                    @click="editComponent(slotProps.data)" 
                />
                <Button 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-danger p-mr-2"
                    @click="deleteComponent(slotProps.data)" 
                />
            </div>
        </template>
    </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="dialogState.editDialog" :style="{ width: '450px' }" header="Component Details" :modal="true">
        <div class="flex flex-col gap-6">
             <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Horizontal</div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText id="name" v-model="store.component.name" required="true" rows="3" cols="20" fluid />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="isVisible" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Visible</label>
                    <div class="col-span-12 md:col-span-10">
                        <Checkbox id="isVisible" v-model="store.component.is_visible" binary rows="3" cols="20" fluid />
                    </div>
                </div>
            </div>
        </div>
        
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="closeDialog('editDialog')" />
            <Button label="Save" icon="pi pi-check" @click="saveComponent" />
        </template>
    </Dialog>
</template>


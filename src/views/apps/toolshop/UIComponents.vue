<script setup lang="ts">

import { ref, onMounted, computed, Text } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useUIStore } from '@/stores/ui';
import { FilterMatchMode } from '@primevue/core/api';
import { Checkbox, InputText } from 'primevue';

const store = useUIStore();
const filters = ref({'global': {value: null, matchMode: FilterMatchMode.CONTAINS}});
const selectedComponents = null;
const uiDialog = false;
const deleteUIDialog = false;
const deleteProductsDialog = false;
let component = ref({
    name: '',
    isVisible: false,
});

onMounted(() => {
    store.fetchUIComponents();
});

const dialogState = ref({
    editDialog: false,
    deleteDialog: false,
});

function openNew(type: 'editDialog' | 'deleteDialog') {
    dialogState.value[type] = true;
    component.value = {
        name: '',
        isVisible: false,
    };
}

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
                    <h4 class="m-0">Manage Products</h4>
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
            <Column field="is_visible" header="Quantity"></Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="dialogState.editDialog" :style="{ width: '450px' }" header="Component Details" :modal="true">
        <div class="flex flex-col gap-6">
            <div>
                <label for="name" class="block font-bold mb-3">Name</label>
                <InputText id="name" v-model="component.name" required="true" rows="3" cols="20" fluid />
                <label for="isVisible" class="block font-bold mb-3">Visisble</label>
                <Checkbox id="isVisible" v-model="component.isVisible" rows="3" cols="20" fluid />
            </div>
        </div>
    </Dialog>
</template>


<template>
    <div>
      <h2>Manage UI Components</h2>
  
      <!-- Toolbar with Actions -->
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
          <!-- <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            outlined
            @click="confirmDeleteSelected"
            :disabled="!selectedComponents.length"
          /> -->
        </template>
        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
        </template>
      </Toolbar>
  
      <!-- DataTable -->
      <DataTable
        ref="dt"
        v-model:selection="selectedComponents"
        :value="components"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} components"
      >
        <template #header>
          <div class="flex justify-between">
            <h4 class="m-0">Manage UI Components</h4>
            <!-- <InputText v-model="filters.global.value" placeholder="Search..." /> -->
          </div>
        </template>
  
        <Column selectionMode="multiple" style="width: 3rem"></Column>
        <Column field="name" header="Component Name" sortable></Column>
  
        <Column field="visible" header="Visible">
          <template #body="slotProps">
            <ToggleButton
              v-model="slotProps.data.visible"
              onLabel="Shown"
              offLabel="Hidden"
              onIcon="pi pi-check"
              offIcon="pi pi-times"
              @change="updateComponent(slotProps.data)"
            />
          </template>
        </Column>
  
        <Column field="category" header="Category" sortable></Column>
  
        <Column :exportable="false">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editComponent(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDelete(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
  
      <!-- Dialog for Editing Components -->
      <Dialog v-model:visible="componentDialog" header="Component Details" :modal="true">
        <div>
          <label for="name">Name</label>
          <InputText id="name" v-model="component.name" required autofocus />
  
          <label for="category">Category</label>
          <Select id="category" v-model="component.category" :options="categories" optionLabel="label" placeholder="Select a Category"></Select>
  
          <label for="visible">Visible</label>
          <ToggleButton v-model="component.visible" onLabel="Shown" offLabel="Hidden" onIcon="pi pi-check" offIcon="pi pi-times" />
        </div>
  
        <template #footer>
          <Button label="Cancel" icon="pi pi-times" text @click="componentDialog = false" />
          <Button label="Save" icon="pi pi-check" @click="saveComponent" />
        </template>
      </Dialog>
  
      <!-- Confirm Delete Dialog -->
      <Dialog v-model:visible="deleteDialog" header="Confirm" :modal="true">
        <p>Are you sure you want to delete <b>{{ component.name }}</b>?</p>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteDialog = false" />
          <Button label="Yes" icon="pi pi-check" @click="deleteComponent" />
        </template>
      </Dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
//   import { FilterMatchMode } from "@primevue/api";
  import { useToast } from "primevue/usetoast";
  import axios from "axios";
  
  // Define Interface
  interface ComponentItem {
    id: string;
    name: string;
    category?: string;
    visible: boolean;
  }
  
  // State Variables
  const components = ref<ComponentItem[]>([]);
  const selectedComponents = ref<ComponentItem[] | null>(null);
  const componentDialog = ref(false);
  const deleteDialog = ref(false);
  const component = ref<Partial<ComponentItem>>({});
  // const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
  const filters = {};
  const toast = useToast();

  const categories = ref([
    { label: "Navigation", value: "Navigation" },
    { label: "Dashboard", value: "Dashboard" },
    { label: "Settings", value: "Settings" },
  ]);
  
  // Fetch Components on Mount
  onMounted(async () => {
    try {
      const response = await axios.get("/api/ui-components/");
      components.value = response.data;
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  });
  
  const editComponent = async (comp: ComponentItem) => {
    component.value = {...component.value};
    componentDialog.value = true;
};

  // Open Dialog for New Component
  const openNew = () => {
    component.value = { name: "", visible: true, category: "" };
    componentDialog.value = true;
  };
  
  // Save (Create or Update)
  const saveComponent = async () => {
    if (component.value?.name?.trim()) {
      try {
        if (component.value.id) {
          await axios.put(`/api/ui-components/${component.value.id}/`, component.value);
          const index = components.value.findIndex((c) => c.id === component.value.id);
          if (index !== -1) components.value[index] = { ...component.value } as ComponentItem;
          toast.add({ severity: "success", summary: "Updated", detail: "Component Updated", life: 3000 });
        } else {
          const response = await axios.post("/api/ui-components/", component.value);
          components.value.push(response.data);
          toast.add({ severity: "success", summary: "Created", detail: "Component Created", life: 3000 });
        }
        componentDialog.value = false;
      } catch (error) {
        console.error("Failed to save component:", error);
      }
    }
  };
  
  // Update Single Component (Toggle Visibility)
  const updateComponent = async (comp: ComponentItem) => {
    try {
      await axios.put(`/api/ui-components/${comp.id}/`, { visible: comp.visible });
    } catch (error) {
      console.error("Failed to update component:", error);
    }
  };
  
  // Confirm Deletion
  const confirmDelete = (comp: ComponentItem) => {
    component.value = comp;
    deleteDialog.value = true;
  };
  
  // Delete Component
  const deleteComponent = async () => {
    try {
      await axios.delete(`/api/ui-components/${component.value.id}/`);
      components.value = components.value.filter((c) => c.id !== component.value.id);
      deleteDialog.value = false;
    } catch (error) {
      console.error("Failed to delete component:", error);
    }
  };
  
  // Export Table Data
  const exportCSV = () => {
    const csvContent = components.value.map((c) => `${c.id},${c.name},${c.category},${c.visible}`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "components.csv";
    link.click();
  };
  </script>
  
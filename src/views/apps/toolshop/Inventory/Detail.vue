<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useInventoryStore } from '@/stores/inventory';

const store = useInventoryStore();

const props = defineProps<{ inventoryId: number }>();
const inventoryId = computed(() => props.inventoryId);
const selectedInventory = ref(null); // Holds selected Inventory object

onMounted(async () => {
    await store.fetchInventory(inventoryId.value);
});

</script>

<template>
    <Fluid>
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Inventory Detail</div>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="name">Inventory Name</label>
                    <InputText id="name" disabled type="text" v-model="store.inventory.name" />
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="state">Description</label>
                    <InputText id="zip" disabled type="text" v-model="store.inventory.description" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

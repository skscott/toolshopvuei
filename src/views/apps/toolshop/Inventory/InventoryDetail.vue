<template>
    <Detail :inventoryId=inventoryId /> 
    <div class="pt-6">
        <InventoriesItemsTable :inventoryId="inventoryId" />
    </div>
</template>

<script setup lang="ts">
import InventoriesItemsTable from '@/components/toolshop/tables/InventoryItemsTable.vue';
import Detail from '@/views/apps/toolshop/Inventory/Detail.vue';

import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

// Extract inventoryId from the route params
const inventoryId = computed(() => Number(route.params.inventoryId));

</script>
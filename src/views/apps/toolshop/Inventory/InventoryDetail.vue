<template>
    <Detail :inventoryId=inventoryId /> 
    <div class="pt-6">
        <InventoriesTable :customerId="inventoryId" />
    </div>
</template>

<script setup lang="ts">
import InventoriesTable from '@/components/toolshop/tables/InventoriesTable.vue';
import Detail from '@/views/apps/toolshop/Inventory/Detail.vue';

import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

// Extract customerId from the route params
const inventoryId = computed(() => Number(route.params.inventoryId));

</script>
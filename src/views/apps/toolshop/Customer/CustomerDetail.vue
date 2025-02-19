// Customers.vue
<template>
    <Detail :customerId="customerId" />
    <div class="pt-6">
        <InvoicesTable :customerId="customerId" />
    </div>
</template>

<script setup lang="ts">
import InvoicesTable from '@/components/toolshop/tables/InvoicesTable.vue';
import Detail from '@/views/apps/toolshop/Customer/Detail.vue';

import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

// Extract customerId from the route params
const customerId = computed(() => Number(route.params.customerId));

</script>
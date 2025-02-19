// Customers.vue
<template>
    <Detail />
    <InvoicesTable :customerId="customerId" />
</template>

<script setup lang="ts">
import InvoicesTable from '@/components/toolshop/tables/InvoicesTable.vue';
import Detail from '@/views/apps/toolshop/Customer/Detail.vue';

import { useRoute } from 'vue-router';
import { useCustomerStore } from '@/stores/customer';
import { onMounted, computed } from 'vue';

const route = useRoute();
const store = useCustomerStore();

// Extract customerId from the route params
const customerId = computed(() => Number(route.params.customerId));
alert("Customer " + customerId.value);

onMounted(() => {
    if (customerId.value) {
        store.fetchCustomer(customerId.value);
    }
});

</script>
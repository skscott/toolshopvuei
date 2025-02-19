// Customers.vue
<template>
    <div class="card">
        <h1>Customers</h1>
        <p>Welcome to the Customers page!</p>
        <CustomersTable />
    </div>
</template>

<script setup>
import CustomersTable from '@/components/toolshop/tables/CustomersTable.vue';
</script>
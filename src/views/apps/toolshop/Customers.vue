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

<style scoped>
.card {
    padding: 1rem;
    border-radius: 8px;
    background: #f9f9f9;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
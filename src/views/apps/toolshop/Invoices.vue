// Customers.vue
<template>
    <div class="card">
        <h1>Invoices</h1>
        <p>Welcome to the Invoices page!</p>
        <InvoicesTable :customerId=0 />
    </div>
</template>

<script setup>
import InvoicesTable from '@/components/toolshop/tables/InvoicesTable.vue';
</script>
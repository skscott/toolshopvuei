// CustomerTable.vue
<template>
    <div>
        <h2>Customers</h2>
        <p v-if="customerStore.loading">Loading...</p>
        <p v-if="customerStore.error" class="error">{{ customerStore.error }}</p>
        <table v-if="!customerStore.loading && !customerStore.error">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>VAT Number</th>
                    <th>Company Type</th>
                    <th>Street Address</th>
                    <th>City</th>
                    <th>Postal Code</th>
                    <th>Country</th>
                    <th>Contact Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Industry</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="customer in customerStore.customers" :key="customer.vat_number">
                    <td>{{ customer.name }}</td>
                    <td>{{ customer.vat_number }}</td>
                    <td>{{ customer.company_type }}</td>
                    <td>{{ customer.street_address }}</td>
                    <td>{{ customer.city }}</td>
                    <td>{{ customer.postal_code }}</td>
                    <td>{{ customer.country }}</td>
                    <td>{{ customer.contact_name }}</td>
                    <td>{{ customer.email }}</td>
                    <td>{{ customer.phone }}</td>
                    <td>{{ customer.industry }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCustomerStore } from '@/stores/customer';

const customerStore = useCustomerStore();

onMounted(() => {
    customerStore.fetchCustomers();
});
</script>

<style scoped>
.error {
    color: red;
}
</style>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCustomerStore } from '@/stores/customer';

const store = useCustomerStore();

const dropdownItems = ref([
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
]);

const dropdownItem = ref(null);
const props = defineProps<{ customerId: number }>();
const customerId = computed(() => props.customerId);

alert("Detail Customer ID: " + customerId.value);

onMounted(() => {
    console.log("Customer Detail:", customerId.value);
    store.fetchCustomer(customerId.value);
    console.log("Customers Table:", store.customers);

});
</script>

<template>
    <Fluid>
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Customer Detail</div>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="name">Firstname</label>
                    <InputText id="name" type="text"  v-model="store.customer.name" />
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="lastname2">Lastname</label>
                    <InputText id="lastname2" type="text" />
                </div>
            </div>

            <div class="flex flex-wrap">
                <label for="address">Address</label>
                <Textarea id="address" rows="4" />
            </div>

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="state">State</label>
                    <Select id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full" />
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="zip">Zip</label>
                    <InputText id="zip" type="text" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCustomerStore } from '@/stores/customer';

const store = useCustomerStore();

const dropdownItems = ref([
    { name: 'Great Britain', country: 'GB' },
    { name: 'Option 2', country: 'Option 2' },
    { name: 'Option 3', country: 'Option 3' }
]);

const dropdownItem = ref(null);
const props = defineProps<{ customerId: number }>();
const customerId = computed(() => props.customerId);

onMounted(() => {
    console.log("Mounted Customer Detail:", customerId.value);
    store.fetchCustomer(customerId.value);
});
const selectedCountry = ref(null); // Holds selected country object

// Watch for customer changes and update selectedCountry
watch(store.customer, (newVal) => {
  if (newVal && newVal.country) {
    selectedCountry.value = dropdownItems.value.find(item => item.country === newVal.country);
  }
}, { immediate: true });

watch(selectedCountry, (newVal) => {
  if (newVal) {
    store.customer.country = newVal.country; // Assuming country is stored as a `code`
  }
});

</script>

<template>
    <Fluid>
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Customer Detail</div>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="name">Company Name</label>
                    <InputText id="name" type="text" v-model="store.customer.name" />
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="state">Address</label>
                    <InputText id="zip" type="text" v-model="store.customer.street_address" />
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="zip">City</label>
                    <InputText id="zip" type="text" v-model="store.customer.city"/>
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="zip">Postal Code</label>
                    <InputText id="zip" type="text" v-model="store.customer.postal_code" />
                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="state">VAT Nbr</label>
                    <InputText id="name" type="text" v-model="store.customer.vat_number" />
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="zip">Email</label>
                    <InputText id="zip" type="text" v-model="store.customer.email" />
                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="state">country</label>
                    <Select id="state" v-model="selectedCountry" :options="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full" /> 
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="state">Phone Number</label>
                    <InputText id="zip" type="text" v-model="store.customer.phone" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

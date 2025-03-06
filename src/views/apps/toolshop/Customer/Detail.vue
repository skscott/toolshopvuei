<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCustomerStore } from '@/stores/customer';
import { european_countries } from '@/lists/european_countries';

const store = useCustomerStore();

let dropdownItems = ref([]); // Holds the list of countries

// const dropdownItem = ref(null);
const props = defineProps<{ customerId: number }>();
const customerId = computed(() => props.customerId);
const selectedCountry = ref(null); // Holds selected country object

onMounted(async () => {
    await store.fetchCustomer(customerId.value);
    dropdownItems.value = european_countries;
    // After fetching, set the selectedCountry based on store.customer.country
    if (store.customer && store.customer.country) {
        selectedCountry.value = dropdownItems.value.find(item => item.country === store.customer.country);
    }
});

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
                    <InputText id="name" disabled type="text" v-model="store.customer.name" />
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="street_address">Address</label>
                    <InputText id="street_address" disabled type="text" v-model="store.customer.street_address" />
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="city">City</label>
                    <InputText id="city" disabled type="text" v-model="store.customer.city"/>
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="postal_code">Postal Code</label>
                    <InputText id="postal_code" disabled type="text" v-model="store.customer.postal_code" />
                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="vat_number">VAT Nbr</label>
                    <InputText id="vat_number" disabled type="text" v-model="store.customer.vat_number" />
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="email">Email</label>
                    <InputText id="email" disabled type="text" v-model="store.customer.email" />
                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="country">Country</label>
                    <Select id="country" disabled v-model="selectedCountry" :options="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full" /> 
                </div>
                <div class="flex flex-wrap gap-2 w-full">
                    <label for="phone">Phone Number</label>
                    <InputText id="phone" disabled type="text" v-model="store.customer.phone" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

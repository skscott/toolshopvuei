// validationRules.ts
import { Ref, ref } from 'vue';

export const nameRules: Ref<((v: string) => string | boolean)[]> = ref([
    (v: string) => !!v || 'Customer name is required',
    (v: string) => (v && v.length <= 100) || 'Name must be less than 100 characters',
    (v: any) => !!v
]);

export const cityRules: Ref<((v: string) => string | boolean)[]> = ref([
    (v: string) => !!v || 'City name is required',
    (v: string) => (v && v.length <= 100) || 'Name must be less than 100 characters',
    (v: any) => !!v
]);

export const postcodeRules: Ref<((v: string) => string | boolean)[]> = ref([
    (v: string) => !!v || 'Postcode is required',
    (v: any) => !!v
]);

export const countryRules: Ref<((v: string) => string | boolean)[]> = ref([
    (v: string) => !!v || 'Country is required',
    (v: any) => !!v
]);
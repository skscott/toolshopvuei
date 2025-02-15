<script setup>
import { ref, onMounted, computed } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useUIStore } from '@/stores/ui';

const store = useUIStore();

onMounted(() => {
    store.fetchUIComponents();
});

</script>

<template>
    <div class="card">
        <DataTable :value="store.ui_components" tableStyle="min-width: 50rem">
            <Column field="id" header="Id"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="is_visible" header="Quantity"></Column>
        </DataTable>
    </div>
</template>


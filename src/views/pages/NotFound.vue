<script setup>
import LazyImageWidget from '@/components/landing/LazyImageWidget.vue';
import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();
</script>

<template>
    <section class="animate-fadein animate-duration-300 animate-ease-in landing-container mx-auto min-h-[75vh] lg:min-h-screen flex flex-col items-center justify-center">
        <LazyImageWidget class="w-64 lg:w-96" :src="'/demo/images/landing/' + (isDarkTheme ? '404-dark.png' : '404.png')" alt="404 Image" />
        <h1 class="title-h5 lg:title-h1 mt-8">Error</h1>
        <p class="body-small lg:body-large mt-2 lg:mt-4">Something gone wrong!</p>
        <router-link to="/" class="body-button bg-red-600 w-fit mt-8 hover:bg-red-500 px-4">Go to Dashboard</router-link>
    </section>
</template>

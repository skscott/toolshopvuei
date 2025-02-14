<template>
    <div>
      <h1>Welcome to the Toolshop</h1>
      <Button label="Go to Configuration" @click="$router.push('/toolshop/configuration')" />
      </div>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  </script>
  
  <style scoped>
  h1 {
    margin-bottom: 20px;
  }
  </style>
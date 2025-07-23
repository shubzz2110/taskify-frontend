<template>
  <header class="flex items-center w-full h-20 px-6 xl:px-20">
    <div
      @click="$router.push('/authentication/login')"
      class="flex items-center space-x-2.5 cursor-pointer"
    >
      <i class="pi pi-objects-column logo"></i>
      <h1 class="app-name">Taskify</h1>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped>
.logo {
  @apply text-4xl text-brand;
}
.app-name {
  @apply text-surface-0 font-normal text-3xl;
}
</style>

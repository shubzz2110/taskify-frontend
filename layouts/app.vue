<template>
  <div class="flex flex-col w-full h-full min-h-dvh overflow-hidden">
    <AppHeader />
    <div class="flex items-center w-full h-[calc(100vh-51px)] overflow-y-auto">
      <AppSidebar />
      <div class="flex flex-col w-full h-full flex-1 overflow-hidden">
        <slot />
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
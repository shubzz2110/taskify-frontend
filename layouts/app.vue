<template>
  <div class="flex flex-col w-full h-full min-h-dvh overflow-hidden">
    <AppHeader />
    <div class="flex items-center w-full h-[calc(100vh-51px)] overflow-y-auto">
      <AppSidebar />
      <div class="flex flex-col w-full h-full flex-1 overflow-hidden">
        <Transition name="fade">
          <Loading v-if="isLoading" />
        </Transition>
        <slot />
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
const { isLoading } = useLoading();
</script>

<style>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

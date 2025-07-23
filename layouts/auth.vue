<template>
  <div class="flex flex-col w-full min-h-dvh h-full">
    <AuthHeader />
      <div class="m-auto p-5 xl:p-0">
        <h1 class="text-surface-0 font-normal text-4xl text-center xl:w-max mb-3 tracking-wide">Welcome to Taskify.com</h1>
        <slot />
      </div>
    <AuthFooter />
    <Toast />
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>
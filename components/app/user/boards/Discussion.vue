<template>
  <div class="flex-1 w-full h-full max-w-[40%] p-5">
    <h1 class="text-surface-0 font-medium text-2xl">Discussion</h1>
  </div>
</template>

<script setup lang="ts">
const discussionContent = ref<string>("");
</script>

<style scoped>
.editor {
  @apply max-h-[200px];
}
</style>

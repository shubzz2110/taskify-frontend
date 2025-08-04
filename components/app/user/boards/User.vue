<template>
  <div class="flex items-center gap-2.5">
    <Avatar :class="`bg-blk-80 !text-surface-0 ${avatarClass}`" label="SH" size="normal" shape="circle" />
    <h1 :class="`text-surface-0 font-light text-base ${textClasses}`">Shubham Homkar</h1>
  </div>
</template>

<script setup lang="ts">
defineProps({
  user: {
    type: Object,
    required: true,
  },
  avatarClass: {
    type: String
  },
  textClasses: {
    type: String,
  }
});
</script>

<style scoped></style>

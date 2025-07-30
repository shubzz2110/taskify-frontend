<template>
  <div class="flex-1 flex flex-col w-full h-full overflow-hidden">
    <div class="flex w-full h-full">
      <div class="flex-1 w-full h-full max-w-[60%] p-5">
        <div class="flex flex-col gap-5">
          <h1 class="text-brand font-light text-sm leading-3">
            Task Number: 000001
          </h1>
          <h1 class="text-surface-0 font-light text-2xl">
            <span class="text-surface-400">000001 &nbsp;&nbsp;</span>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula.
          </h1>
        </div>
        <div class="flex items-center justify-between w-full h-max pt-5">
          <div class="flex items-center gap-20 h-max">
            <div class="flex items-center gap-1.5">
              <div
                class="bg-blk-80 rounded-full min-w-10 min-h-10 w-10 h-10 flex items-center justify-center"
              >
                <h1 class="text-surface-300 font-normal text-base">
                  {{ getInitials("Shubham Homkar") }}
                </h1>
              </div>
              <h1 class="text-surface-0 font-light text-sm leading-3">
                Shubham Homkar
              </h1>
            </div>
            <div class="flex items-center gap-1.5">
              <h1 class="text-surface-300 font-light text-sm leading-3">Tag</h1>
              <button
                class="flex items-center gap-2.5 text-surface-0 font-normal text-sm px-2.5 py-1 rounded-md hover:bg-blk-30 transition-all"
              >
                <i class="pi pi-plus text-xs"></i>
                Add tag
              </button>
            </div>
          </div>
          <button
            class="py-2.5 px-5 rounded-md border border-blue-500 text-surface-0"
          >
            Due on: Aug 17
          </button>
        </div>
      </div>
      <div class="w-px h-full bg-blk-30"></div>
      <div class="flex-1 w-full h-full max-w-[40%] p-5">
        <h1 class="text-surface-0 font-medium text-2xl">Discussion</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app",
  middleware: "auth-client",
});
</script>

<style scoped></style>

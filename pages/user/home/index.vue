<template>
  <div class="flex flex-col w-full h-full overflow-auto">
    <div class="flex flex-col justify-center items-center space-y-2.5 mt-10">
      <h1 class="text-surface-0 font-semibold text-lg">
        {{ moment().format("dddd, MMMM, DD") }}
      </h1>
      <h1 class="text-surface-0 font-normal text-4xl capitalize">
        {{ greeting }}, {{ authStore.user?.name.split(" ")[0] }}
      </h1>
    </div>
    <div
      class="flex items-center bg-blk-80 w-max h-max px-5 py-1.5 rounded-full gap-5 mx-auto mt-5"
    >
      <div
        class="flex items-center space-x-1.5 text-surface-400 font-normal text-sm"
      >
        <i class="pi pi-check text-xs"></i>
        <h1 class="flex items-center gap-1.5">
          <span class="text-xl font-bold">5</span>task completed
        </h1>
      </div>
      <div
        class="flex items-center space-x-1.5 text-surface-400 font-normal text-sm"
      >
        <i class="pi pi-users"></i>
        <h1 class="flex items-center gap-1.5">
          <span class="text-xl font-bold">3</span>collaborators
        </h1>
      </div>
    </div>
    <div
      class="grid grid-cols-1 xl:grid-cols-2 gap-5 py-10 px-10 w-full 2xl:max-w-[1190px] 2xl:min-w-[1190px] mx-auto"
    >
      <div class="widget-card"></div>
      <div class="widget-card"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
definePageMeta({
  layout: "app",
  middleware: "auth-client",
});

const authStore = useAuthStore()

const greet = () => {
  const date = new Date();
  const time = date.getHours();

  if (time >= 6 && time < 12) {
    return "Good morning";
  } else if (time >= 12 && time < 16) {
    return "Good afternoon";
  } else if (time >= 16 && time < 22) {
    return "Good evening";
  } else {
    return "Good night";
  }
};

const greeting = greet();
</script>

<style scoped>
.widget-card {
  @apply bg-blk-80 flex flex-col w-full h-full min-h-[24rem] p-5 rounded-md border border-blk-30;
}
</style>

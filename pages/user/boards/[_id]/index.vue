<template>
  <div class="flex-1 flex flex-col w-full h-full overflow-hidden">
    <div class="flex items-start justify-between w-full h-max px-7 pt-7">
      <div class="flex flex-col space-y-1.5">
        <div class="flex items-center gap-10 w-full h-max">
          <div
            class="flex items-center space-x-1 max-w-[22rem] overflow-hidden whitespace-nowrap"
          >
            <span class="text-2xl">&#9989;</span>
            <h1
              v-tool-tip="{
                value:
                  'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
                showDelay: 300,
                hideDelay: 300,
              }"
              class="text-surface-0 font-bold text-2xl truncate overflow-ellipsis whitespace-nowrap"
            >
              My Project Taskify Lorem ipsum dolor, sit amet consectetur
              adipisicing elit.
            </h1>
          </div>
          <button
            v-tool-tip="{
              value: 'Make this board favourite.',
              showDelay: 300,
              hideDelay: 300,
            }"
            class="text-yellow-500"
          >
            <i class="pi pi-star-fill text-2xl"></i>
          </button>
        </div>
        <p class="text-surface-400 font-normal text-sm leading-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      <Button
        label="Share"
        icon="pi pi-share-alt"
        severity="brand"
        class="w-max !px-5"
      />
    </div>
    <div
      class="flex items-center justify-between w-full h-max pt-7 px-7 border-b border-blk-30 pb-5"
    >
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="search"
          placeholder="Search for task"
          role="searchbox"
          class="xl:min-w-[24rem] !bg-blk-80"
        />
      </IconField>
      <div class="flex items-center gap-5">
        <Select
          v-tool-tip.top="{
            value: 'Change the layout',
            showDelay: 300,
            hideDelay: 300,
          }"
          class="!w-24"
          v-model="currentSelectedView"
          :options="viewItems"
          optionLabel="name"
          option-value="code"
          placeholder="Select view"
        />
        <Select
          v-tool-tip.top="{
            value: 'Sort by',
            showDelay: 300,
            hideDelay: 300,
            position: 'top',
          }"
          class="!w-44"
          v-model="currentSelectedSort"
          :options="sortItems"
          optionLabel="name"
          option-value="code"
          placeholder="Sort By"
        />
      </div>
    </div>
    <div class="flex-1 flex gap-5 py-2.5 px-7 overflow-y-hidden overflow-x-auto">
      <!-- Section -->
      <div class="flex flex-col gap-y-2 w-[300px] min-w-[300px] max-w-[300px]" v-for="(item, index) in sections" :key="index">
        <!-- Section Name and Actions -->
        <div
          class="px-2.5 py-1.5 rounded-md bg-blk-80 flex items-center justify-between"
        >
          <h1 class="text-surface-0 font-semibold text-sm leading-5">
            Section 1
          </h1>
          <div class="flex items-center gap-1.5">
            <button
              class="pi pi-plus text-surface-0 min-w-8 min-h-8 w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-800 transition-all duration-300 ease-in-out text-sm"
            ></button>
            <button
              class="pi pi-ellipsis-v text-surface-0 min-w-8 min-h-8 w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-800 transition-all duration-300 ease-in-out text-sm"
            ></button>
          </div>
        </div>
        <!-- Section Tasks -->
        <div class="flex-1 flex flex-col w-full h-full gap-2.5 overflow-y-auto">
          <div v-for="(item, index) in tasks" :key="index" class="task-card">
            <span class="indent-0">
              <h1
                class="text-surface-0 font-normal text-sm leading-5 line-clamp-2"
              >
                <span class="mr-2.5 align-middle"
                  ><button class="transition-all duration-300 ease-in-out">
                    <CheckCircleFill
                      class="fill-surface-800 hover:fill-green-900 transition-all duration-300 ease-in-out"
                    /></button></span
                >Lorem ipsum dolor sit
              </h1>
            </span>
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2.5">
                <button class="round-btn">
                  <i class="pi pi-user text-sm text-surface-800"></i>
                </button>
                <button class="round-btn">
                  <i class="pi pi-calendar-plus text-sm text-surface-800"></i>
                </button>
              </div>
              <div class="flex items-center space-x-2.5">
                <h1 class="text-surface-400 font-normal text-xs">
                  Difficulty: <span class="font-bold">Low</span>
                </h1>
                <h1 class="text-surface-400 font-normal text-xs">
                  Priority: <span class="font-bold text-blue-500">Low</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckCircleFill from "~/assets/icons/check-circle-fill.vue";

definePageMeta({
  layout: "app",
  middleware: 'auth-client',
});
const viewItems = [
  { name: "List", code: "list" },
  { name: "Card", code: "card" },
];

const sortItems = [
  { name: "Recently Added", code: "recent" },
  { name: "A - Z", code: "az" },
  { name: "Z - A", code: "za" },
];

const currentSelectedView = ref<string>("list");
const currentSelectedSort = ref<string>("recent");
const search = ref<string>("");
const tasks = ref(50)
const sections = ref(10)
</script>

<style scoped>
.round-btn {
  @apply flex items-center justify-center border border-dashed border-surface-800 rounded-full min-w-8 min-h-8 w-8 h-8 hover:bg-surface-700 transition-all duration-300 ease-in-out;
}
.task-card {
  @apply bg-blk-80 border border-blk-30 rounded-md flex flex-col justify-between w-full min-h-32 h-auto px-5 py-3.5 hover:border-surface-800 transition-all cursor-pointer gap-4.5;
}
</style>

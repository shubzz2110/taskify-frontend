<template>
  <div class="task-card transition-all duration-500 ease-in-out">
    <span class="indent-0">
      <h1 class="text-surface-0 font-normal text-sm leading-5 line-clamp-2">
        <span class="mr-2.5 align-middle"
          ><button class="transition-all duration-300 ease-in-out">
            <CheckCircleFill
              class="fill-surface-800 hover:fill-green-900 transition-all duration-300 ease-in-out"
            /></button></span
        >{{ task.title }}
      </h1>
    </span>
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center gap-2.5">
        <img
          v-if="task?.assignedTo?.avatar"
          class="rounded-full min-w-8 min-h-8 w-8 h-8"
          :src="task?.assignedTo?.avatar"
          alt="avatar"
        />
        <button v-else class="round-btn">
          <i
            v-if="task?.assignedTo?.avatar"
            class="pi pi-user text-sm text-surface-800"
          ></i>
          <span class="text-surface-100 font-normal text-sm">{{
            getInitials(task?.assignedTo?.name || "")
          }}</span>
        </button>
        <button
          v-if="task?.dueDate"
          class="text-surface-0 text-xs leading-3 font-normal"
        >
          {{ moment(task?.dueDate).format("MMM DD") }}
        </button>
        <button v-else class="round-btn">
          <i class="pi pi-calendar-plus text-sm text-surface-800"></i>
        </button>
      </div>
      <div class="flex items-center space-x-2.5">
        <div>
          <h1 class="text-surface-400 font-normal text-xs capitalize">
            Difficulty:
          </h1>
          <h6 class="font-bold text-xs capitalize leading-3 text-surface-0">
            {{ task.difficulty }}
          </h6>
        </div>
        <div class="flex flex-col">
          <h1 class="text-surface-400 font-normal text-xs capitalize">
            Priority:
          </h1>
          <h6
            class="font-bold text-xs leading-3 capitalize"
            :class="{
              'text-blue-500': task.priority === 'low',
              'text-red-500': task.priority === 'high',
              'text-yellow-500': task.priority === 'medium',
            }"
          >
            {{ task.priority }}
          </h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import CheckCircleFill from "~/assets/icons/check-circle-fill.vue";

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  taskIndex: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped></style>

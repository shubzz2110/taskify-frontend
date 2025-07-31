<template>
  <div class="flex-1 flex flex-col w-full h-full overflow-hidden">
    <div class="flex w-full h-full">
      <div class="flex-1 w-full h-full max-w-[60%] p-5 overflow-y-auto">
        <div class="flex flex-col gap-5">
          <div class="flex items-center justify-between w-full h-max">
            <h1 class="text-brand font-light text-sm leading-3">
              Task Number: 000001
            </h1>
            <div class="flex items-center gap-2.5">
              <button
                class="flex items-center justify-center px-3.5 py-1.5 rounded-md text-blue-500 transition-all duration-300 ease-in-out gap-2.5 bg-blue-950 hover:bg-opacity-80 text-sm"
              >
                <i class="pi pi-pencil text-xs"></i>
                Edit
              </button>
              <button
                class="flex items-center justify-center px-3.5 py-1.5 rounded-md text-red-500 transition-all duration-300 ease-in-out gap-2.5 bg-red-950 hover:bg-opacity-80 text-sm"
              >
                <i class="pi pi-trash text-sm"></i>
                Delete
              </button>
            </div>
          </div>
          <h1 class="text-surface-0 font-light text-2xl">
            <span class="text-surface-400">000001 &nbsp;&nbsp;</span>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula.
          </h1>
        </div>
        <div class="flex items-center justify-between w-full h-max pt-5 pb-7">
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
            class="py-2.5 px-5 rounded-md hover:bg-blk-80 text-surface-0 transition-all duration-300 ease-in-out text-sm"
          >
            Due on: 08/08/2025
          </button>
        </div>
        <div class="flex flex-col w-full min-h-80 pb-7">
          <h1 class="sub-heading">Description</h1>
          <Divider />
          <p class="text-surface-0 font-light text-base leading-6 mb-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
            voluptate sapiente, possimus doloribus ullam vero fugit cum corporis
            nostrum accusantium illo incidunt iste tenetur velit labore ratione
            architecto qui. Ad laborum, nam, eos, vero perspiciatis quia sint
            similique aliquid enim mollitia molestiae consequuntur
            necessitatibus eligendi esse debitis earum et quos.
          </p>
        </div>
        <div class="flex flex-col w-full h-auto">
          <h1 class="sub-heading">History</h1>
          <Divider />
          <!-- History -->
          <div
            class="flex items-center justify-between w-full h-max border-b border-blk-30 pb-2.5"
          >
            <div class="flex items-center gap-1 flex-grow">
              <AppUserBoardsUser :user="{}" />
              <p
                class="text-surface-100 font-light text-base leading-5 flex-grow"
              >
                created a this task.
              </p>
            </div>
            <p class="text-surface-100 font-light text-xs mb-0 min-w-32">
              07/07/2025, 07:56 AM
            </p>
          </div>
        </div>
      </div>
      <div class="w-px h-full bg-blk-30"></div>
      <AppUserBoardsDiscussion />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppUserBoardsDiscussion, AppUserBoardsUser } from "#components";

definePageMeta({
  layout: "app",
  middleware: "auth-client",
});
</script>

<style scoped>
.sub-heading {
  @apply text-surface-0 font-semibold text-lg;
}
</style>

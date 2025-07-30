<template>
  <!-- Main container for the board view -->
  <div class="flex-1 flex flex-col w-full h-full overflow-hidden">
    <!-- Conditional rendering only if board data is loaded -->
    <div
      class="flex-1 flex flex-col w-full h-full overflow-hidden"
      v-if="board"
    >
      <!-- Header section with board title, description, and actions -->
      <div class="flex items-start justify-between w-full h-max px-7 pt-7">
        <div class="flex flex-col space-y-1.5">
          <div class="flex items-center gap-10 w-full h-max">
            <div
              class="flex items-center space-x-1 max-w-[22rem] overflow-hidden whitespace-nowrap"
            >
              <span class="text-2xl">&#9989;</span>
              <h1
                v-tool-tip="{
                  value: board.title,
                  showDelay: 300,
                  hideDelay: 300,
                }"
                class="text-surface-0 font-bold text-2xl truncate overflow-ellipsis whitespace-nowrap"
              >
                {{ board.title }}
              </h1>
            </div>
            <!-- Favourite button -->
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
            {{ board.description }}
          </p>
        </div>
        <!-- Share button -->
        <Button
          label="Share"
          icon="pi pi-share-alt"
          severity="brand"
          class="w-max !px-5"
        />
      </div>

      <!-- Search, View and Sort Controls -->
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
          <IconField>
            <InputIcon
              :class="`pi ${
                currentSelectedView === 'list' ? 'pi-bars' : 'pi-th-large'
              }`"
            />
            <Select
              v-tool-tip.top="{
                value: 'Change the layout',
                showDelay: 300,
                hideDelay: 300,
              }"
              v-model="currentSelectedView"
              :options="viewItems"
              optionLabel="name"
              option-value="code"
              placeholder="Select view"
              class="xl:!w-32"
              :checkmark="true"
            />
          </IconField>
          <IconField>
            <InputIcon class="pi pi-sort" />
            <Select
              v-tool-tip.top="{
                value: 'Sort by',
                showDelay: 300,
                hideDelay: 300,
                position: 'top',
              }"
              v-model="currentSelectedSort"
              :options="sortItems"
              optionLabel="name"
              option-value="code"
              placeholder="Sort By"
              class="xl:!w-52"
              :checkmark="true"
            />
          </IconField>
        </div>
      </div>

      <!-- Main board section container for all lists and tasks -->
      <div
        class="flex-1 flex gap-5 py-2.5 px-7 overflow-y-auto overflow-x-auto"
      >
        <!-- Render each section with its tasks -->
        <div
          v-for="(section, index) in board.sections"
          :key="section._id"
          class="flex flex-col gap-y-2 w-[300px] min-w-[300px] max-w-[300px]"
        >
          <!-- Section Header with title and actions -->
          <div
            class="px-2.5 py-1.5 rounded-md bg-blk-80 flex items-center justify-between"
          >
            <h1 class="text-surface-0 font-semibold text-sm leading-5">
              {{ section.title }}
            </h1>
            <div class="flex items-center gap-1.5">
              <button
                @click.stop="showAddTaskModal(board._id, section)"
                class="pi pi-plus text-surface-0 round-btn"
              ></button>
              <button
                class="pi pi-ellipsis-v text-surface-0 round-btn"
              ></button>
            </div>
          </div>

          <!-- Tasks List with drag-n-drop support -->
          <div
            class="flex-1 flex flex-col w-full h-full gap-2.5 transition-all duration-500 ease-in-out relative"
            @drop="(e: DragEvent) => onDrop(e, section._id)"
            @dragover.prevent
            @dragenter.prevent
          >
            <AppUserBoardsTask
              v-for="(task, i) in section.tasks"
              :key="task._id"
              :draggable="true"
              @drop="(e: DragEvent) => onDrop(e, section._id, i)"
              @dragend="onDragEnd"
              @dragstart="(e: DragEvent) => onDragStart(e, task, section._id)"
              :task="task"
              :taskIndex="i"
            />
            <!-- Button to add new task -->
            <button
              @click.stop="showAddTaskModal(board._id, section)"
              class="px-2.5 py-1.5 rounded-md text-white text-sm font-normal flex items-center justify-center gap-2.5 w-max hover:bg-blk-30 transition-all self-center"
            >
              <i class="pi pi-plus text-sm"></i>
              Add Task
            </button>
          </div>

          <!-- Floating clone for dragging visual cue -->
          <AppUserBoardsTask
            v-if="isDragging && draggedTask"
            :task="draggedTask"
            :task-index="1"
            :style="draggedTaskStyle"
            class="pointer-events-none max-w-[300px] h-[128px] fixed z-[9999] translate-x-0"
          />
        </div>

        <!-- Add Section Area -->
        <div class="w-[300px] min-w-[300px] max-w-[300px]">
          <button
            v-if="!addSection"
            @click.stop="addSection = true"
            class="px-2.5 py-1.5 rounded-md bg-blk-80 text-white text-sm font-normal flex items-center gap-2.5"
          >
            <i class="pi pi-plus text-sm"></i>
            Add Section
          </button>
          <form
            v-else
            @submit.prevent="createSection"
            method="post"
            v-click-outside="closeInput"
          >
            <InputText
              v-model="sectionTitle"
              placeholder="Enter section title"
              maxlength="40"
              class="!focus:!outline-none"
              autofocus
            />
          </form>
        </div>
      </div>
    </div>

    <!-- Task Creation Modal -->
    <AppUserBoardsCreateTaskModal
      v-if="addTask"
      :showModal="addTask"
      :fetch-board="fetchBoard"
      @close-modal="addTask = false"
      :boardId="selectedBoardId || ''"
      :section="selectedSection || {}"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * This component handles board display with sections and tasks,
 * including drag-and-drop reordering, section creation, and task management.
 */

import type { Board, CreateSection, Section, Task } from "~/types/types";

// Define layout and middleware
definePageMeta({
  layout: "app",
  middleware: "auth-client",
});

// Nuxt & App utilities
const route = useRoute();
const { $axios } = useNuxtApp();
const toast = useToast();
const { startLoading, stopLoading } = useLoading();
const authStore = useAuthStore();

// View and sort options
const viewItems = [
  { name: "List", code: "list" },
  { name: "Card", code: "card" },
];

const sortItems = [
  { name: "Recently Added", code: "recent" },
  { name: "A - Z", code: "az" },
  { name: "Z - A", code: "za" },
];

// Reactive state variables
const currentSelectedView = ref("list");
const currentSelectedSort = ref("recent");
const search = ref("");
const board = ref<Board | null>(null);

// Section creation state
const addSection = ref(false);
const sectionTitle = ref("");

// Task modal state
const addTask = ref(false);
const selectedBoardId = ref<string | null>(null);
const selectedSection = ref<Section | null>(null);

// Drag-and-drop state
const draggedTask = ref<Task | null>(null);
const draggedFromSection = ref<string | null>(null);
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const draggedTaskStyle = reactive({ top: "0px", left: "0px" });

/**
 * Lifecycle: Fetch board data on mount and track cursor while dragging
 */
onMounted(() => {
  fetchBoard();
  document.addEventListener("dragover", onMouseMove);
});

/**
 * Lifecycle: Clean up drag event listener
 */
onBeforeUnmount(() => {
  document.removeEventListener("dragover", onMouseMove);
});

/**
 * Fetches the board and its sections/tasks from the server
 */
const fetchBoard = async () => {
  try {
    startLoading();
    const { data, status } = await $axios.get(
      `/board/get-board/${route.params._id}`
    );
    if (status === 200 && data?.board) {
      board.value = data.board;
    } else {
      throw new Error("Failed to load board data.");
    }
  } catch (error) {
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Fetch Error",
      detail: "Could not fetch board. Please try again.",
      life: 5000,
    });
  } finally {
    stopLoading();
  }
};

/**
 * Opens the modal to create a task under a specific board and section
 */
const showAddTaskModal = (boardId: string, section: Section) => {
  selectedBoardId.value = boardId;
  selectedSection.value = section;
  addTask.value = true;
};

// Internal flag to avoid double submission
let submitted = false;

/**
 * Closes section input or creates a section if title exists
 */
const closeInput = () => {
  if (sectionTitle.value.trim()) {
    createSection();
  } else {
    resetSectionInput();
  }
};

/**
 * Resets the section input state
 */
const resetSectionInput = () => {
  addSection.value = false;
  sectionTitle.value = "";
  submitted = false;
};

/**
 * Creates a new section under the board
 */
const createSection = async () => {
  const title = sectionTitle.value.trim();
  if (!title || submitted) return;

  try {
    submitted = true;
    startLoading();

    const sectionPayload: CreateSection = {
      title,
      createdBy: authStore.user?._id!,
      board: board.value?._id!,
      position: board.value?.sections?.length ?? 0,
    };

    const { data, status } = await $axios.post(
      "/section/create",
      sectionPayload
    );
    if (status === 200 && data?.section) {
      board.value?.sections?.push(data.section);
      resetSectionInput();
    }
  } catch (error) {
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Creation Failed",
      detail: "Could not create section. Try again.",
      life: 5000,
    });
  } finally {
    stopLoading();
    submitted = false;
  }
};

/**
 * Handles the mouse movement during dragging for visual preview
 */
const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;
  draggedTaskStyle.left = `${e.clientX - dragOffset.value.x}px`;
  draggedTaskStyle.top = `${e.clientY - dragOffset.value.y}px`;
};

/**
 * Triggered when a task starts being dragged
 */
const onDragStart = (e: DragEvent, task: Task, sectionId: string) => {
  if (!e.dataTransfer) return;

  isDragging.value = true;
  draggedTask.value = task;
  draggedFromSection.value = sectionId;

  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", task._id);
  e.dataTransfer.setDragImage(new Image(), 0, 0);

  const targetRect = (e.target as HTMLElement).getBoundingClientRect();
  dragOffset.value = {
    x: e.clientX - targetRect.left,
    y: e.clientY - targetRect.top,
  };

  draggedTaskStyle.left = `${e.clientX - dragOffset.value.x}px`;
  draggedTaskStyle.top = `${e.clientY - dragOffset.value.y}px`;

  (e.target as HTMLElement).classList.add("dragging");
};

/**
 * Triggered when dragging ends
 */
const onDragEnd = () => {
  isDragging.value = false;
  document
    .querySelectorAll(".task-card")
    .forEach((el) => el.classList.remove("dragging"));
};

/**
 * Handles dropping of a dragged task into a section or specific index
 */
const onDrop = (e: DragEvent, toSectionId: string, toIndex?: number) => {
  const task = draggedTask.value;
  const fromSectionId = draggedFromSection.value;
  if (!task || !fromSectionId || !board.value) return;

  const fromSection: Section | undefined = board?.value?.sections?.find(
    (s) => s._id === fromSectionId
  );
  const toSection: Section | undefined = board?.value?.sections?.find(
    (s) => s._id === toSectionId
  );
  if (!fromSection || !toSection) return;

  // Remove from old section
  fromSection.tasks = fromSection.tasks.filter((t) => t._id !== task._id);

  // Insert in new section or new position
  if (fromSectionId === toSectionId) {
    toIndex !== undefined
      ? fromSection.tasks.splice(toIndex, 0, task)
      : fromSection.tasks.push(task);
  } else {
    toIndex !== undefined
      ? toSection.tasks.splice(toIndex, 0, task)
      : toSection.tasks.push(task);
  }

  updateTaskPositions();
  draggedTask.value = null;
  draggedFromSection.value = null;
};

/**
 * Sends updated task positions to the backend after drag-and-drop
 */
const updateTaskPositions = async () => {
  try {
    const updatedTasks =
      board.value?.sections?.flatMap((section) =>
        section.tasks.map((task, index) => ({
          taskId: task._id,
          position: index,
          sectionId: section._id,
        }))
      ) ?? [];

    await $axios.put("/task/update-positions", { tasks: updatedTasks });
  } catch (error) {
    console.error("Failed to update positions", error);
  }
};
</script>

<style scoped>
.round-btn {
  @apply flex items-center justify-center rounded-full min-w-8 min-h-8 w-8 h-8 hover:bg-surface-700 transition-all duration-300 ease-in-out;
}
.pointer-events-none.fixed {
  transition: transform 0s linear;
  will-change: transform;
}
</style>

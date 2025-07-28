<template>
  <div class="flex-1 flex flex-col w-full h-full overflow-hidden">
    <div
      class="flex-1 flex flex-col w-full h-full overflow-hidden"
      v-if="board"
    >
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
                {{ board.title }}
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
            {{ board.description }}
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
      <div
        class="flex-1 flex gap-5 py-2.5 px-7 overflow-y-auto overflow-x-auto"
      >
        <!-- Section -->
        <div
          class="flex flex-col gap-y-2 w-[300px] min-w-[300px] max-w-[300px]"
          v-for="(section, index) in board.sections"
          :key="section._id"
        >
          <!-- Section Name and Actions -->
          <div
            class="px-2.5 py-1.5 rounded-md bg-blk-80 flex items-center justify-between"
          >
            <h1 class="text-surface-0 font-semibold text-sm leading-5">
              {{ section.title }}
            </h1>
            <div class="flex items-center gap-1.5">
              <button
                @click.stop="showAddTaskModal(board._id, section)"
                class="pi pi-plus text-surface-0 min-w-8 min-h-8 w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-800 transition-all duration-300 ease-in-out text-sm"
              ></button>
              <button
                class="pi pi-ellipsis-v text-surface-0 min-w-8 min-h-8 w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-800 transition-all duration-300 ease-in-out text-sm"
              ></button>
            </div>
          </div>
          <!-- Section Tasks -->
          <Container
            :get-child-payload="
              (i:number) => ({
                task: section.tasks[i],
                sectionIndex: index,
              })
            "
            @drop="(e:number) => onDrop(e, index)"
            :group-name="'board-drag'"
            class="flex-1 flex flex-col w-full h-full gap-2.5"
          >
            <Draggable
              v-for="task in section.tasks"
              :key="task._id"
              class="task-card"
            >
              <span class="indent-0">
                <h1
                  class="text-surface-0 font-normal text-sm leading-5 line-clamp-2"
                >
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
                    <h6
                      class="font-bold text-xs capitalize leading-3 text-surface-0"
                    >
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
            </Draggable>
            <button
              @click.stop="showAddTaskModal(board._id, section)"
              class="px-2.5 py-1.5 rounded-md text-white h-max text-sm font-normal flex items-center justify-center gap-2.5 leading-5 w-max hover:bg-blk-30 transition-all self-center"
            >
              <i class="pi pi-plus text-sm"></i>
              Add Task
            </button>
          </Container>
        </div>
        <div class="w-[300px] min-w-[300px] max-w-[300px]">
          <button
            v-if="!addSection"
            @click.stop="addSection = true"
            class="px-2.5 py-1.5 rounded-md bg-blk-80 text-white h-max text-sm font-normal flex items-center justify-center gap-2.5 leading-5 w-max"
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
import moment from "moment";
import CheckCircleFill from "~/assets/icons/check-circle-fill.vue";
import type { Board, CreateSection, Section } from "~/types/types";
import { Container, Draggable } from "vue3-smooth-dnd";

definePageMeta({
  layout: "app",
  middleware: "auth-client",
});

const route = useRoute();
const { $axios } = useNuxtApp();
const toast = useToast();
const { startLoading, stopLoading } = useLoading();
const authStore = useAuthStore();

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
const board = ref<Board | null>(null);

// Add section variables
const addSection = ref<boolean>(false);
const sectionTitle = ref<string>("");

// Add Task variables
const addTask = ref<boolean>(false);
const selectedBoardId = ref<string | null>(null);
const selectedSection = ref<Section | null>(null);

onMounted(() => {
  fetchBoard();
});

const fetchBoard = async () => {
  try {
    startLoading();
    const response = await $axios.get(`/board/get-board/${route.params._id}`);
    if (response && response.status === 200) {
      board.value = response.data?.board || null;
    } else {
      throw new Error("Unable to fetch board");
    }
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "Unexpected error",
      detail: "An unexpected error occurred. Please try again.",
      life: 5000,
    });
  } finally {
    stopLoading();
  }
};

const closeInput = () => {
  if (sectionTitle.value.trim()) {
    createSection();
  } else {
    addSection.value = false;
    sectionTitle.value = "";
    submitted = false; // just in case
  }
};

let submitted: boolean;

const createSection = async () => {
  try {
    if (submitted) return;
    const title = sectionTitle.value.trim();
    if (!title) return;

    submitted = true;

    startLoading();
    if (sectionTitle.value.trim() !== "") {
      const response = await $axios.post("/section/create", {
        title: sectionTitle.value,
        createdBy: authStore.user?._id,
        board: board.value?._id,
        position:
          board.value?.sections?.length || [].length > 0
            ? board.value?.sections?.length || 0 + 1
            : 0,
      } as CreateSection);
      if (response && response.status === 200) {
        board.value?.sections?.push(response.data.section);
        sectionTitle.value = "";
        addSection.value = false;
      }
    }
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "Unexpected error",
      detail: "An unexpected error occurred. Please try again.",
      life: 5000,
    });
  } finally {
    stopLoading();
    submitted = false;
  }
};

const showAddTaskModal = (boardId: string, section: Section) => {
  selectedBoardId.value = boardId;
  selectedSection.value = section;
  addTask.value = true;
};

const onDrop = (dropResult: any, toSectionIndex: number) => {
  const { removedIndex, addedIndex, payload } = dropResult;
  if (removedIndex === null && addedIndex === null) return;

  const fromSectionIndex = payload.sectionIndex;
  const task = payload.task;

  // Defensive checks
  const fromSection = board.value?.sections?.[fromSectionIndex];
  const toSection = board.value?.sections?.[toSectionIndex];
  if (!fromSection || !toSection) return;

  // Remove task from original section safely
  if (removedIndex !== null) {
    fromSection.tasks = [
      ...fromSection.tasks.slice(0, removedIndex),
      ...fromSection.tasks.slice(removedIndex + 1),
    ];
  }

  // Insert into new section
  if (addedIndex !== null) {
    const newTask = { ...task };
    // Optional: update section ID here
    newTask.section = toSection._id;
    toSection.tasks = [
      ...toSection.tasks.slice(0, addedIndex),
      newTask,
      ...toSection.tasks.slice(addedIndex),
    ];
  }
  console.log(board.value)
};
</script>

<style scoped>
.round-btn {
  @apply flex items-center justify-center border border-dashed border-surface-800 rounded-full min-w-8 min-h-8 w-8 h-8 hover:bg-surface-700 transition-all duration-300 ease-in-out;
}
.task-card {
  @apply bg-blk-80 border border-blk-30 rounded-md !flex flex-col justify-between w-full min-h-32 h-auto px-5 py-3.5 hover:border-surface-800 transition-all cursor-pointer gap-4.5;
}
</style>

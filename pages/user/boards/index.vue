<template>
  <div class="flex flex-col w-full h-full flex-1 overflow-hidden p-7 space-y-5">
    <div class="flex items-center gap-5 w-full h-max">
      <h1 class="heading">Boards</h1>
      <button
        @click="showCreateBoardModal = true"
        v-tool-tip="{
          value: 'Create a new board',
          showDelay: 300,
          hideDelay: 300,
        }"
        class="text-brand font-normal text-base flex items-center gap-1.5"
      >
        <i class="pi pi-plus-circle text-sm"></i>
        <h1>Create</h1>
      </button>
    </div>
    <div class="flex items-center justify-between w-full h-max">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="search"
          placeholder="Search for board"
          role="searchbox"
          class="xl:min-w-[24rem] !bg-blk-80"
        />
      </IconField>
      <div class="flex items-center gap-5">
        <IconField>
          <InputIcon :class="`pi ${currentSelectedView === 'list' ? 'pi-bars' : 'pi-th-large'}`" />
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
    <div class="flex-1 overflow-hidden flex flex-col w-full h-full">
      <DataTable
        :lazy="true"
        dataKey="_id"
        :loading="false"
        scrollable
        scroll-height="flex"
        :value="boards"
      >
        <Column
          header="Board Name"
          field="name"
          class="min-w-[20rem] max-w-[20rem] whitespace-nowrap overflow-hidden"
        >
          <template #body="{ data }">
            <h1 class="truncate overflow-hidden whitespace-nowrap">
              {{ data.title }}
            </h1>
          </template>
        </Column>
        <Column header="Favourite" field="isFavourite">
          <template #body="{ data }">
            <i
              v-if="!data.isFavourite"
              class="pi pi-star text-yellow-500 text-xl"
            ></i>
            <i v-else class="pi pi-star-fill text-yellow-500 text-xl"></i>
          </template>
        </Column>
        <Column header="Sections" field="sectionCount" />
        <Column header="Tasks" field="taskCount" />
        <Column header="Created By" field="createdBy">
          <template #body="{ data }">
            <div class="flex items-center space-x-2.5">
              <img
                class="w-8 h-8 min-h-8 min-w-8 rounded-full object-cover"
                v-if="data.createdBy.avatar"
                :src="data.createdBy.avatar"
                alt="avatar"
              />
              <div
                v-else
                class="w-8 h-8 min-h-8 min-w-8 rounded-full flex items-center justify-center bg-surface-800"
              >
                <i class="pi pi-user text-xs text-surface-300"></i>
              </div>
              <h1>{{ data.createdBy.name }}</h1>
            </div>
          </template>
        </Column>
        <Column header="Collaborators" field="collaborators">
          <template #body="{ data }">
            <h1>{{ data.collaborators || 0 }}</h1>
          </template>
        </Column>
        <Column header="Created At">
          <template #body="{ data }">
            <h1>{{ moment(data.createdAt).format("MMMM, DD, YYYY") }}</h1>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <Button
              @click="(event) => toggleRowMenu(event, data._id)"
              severity="secondary"
              rounded
              icon="pi pi-ellipsis-v"
              class="hover:!bg-blk-30 !text-surface-0"
              text
            />
            <Menu
              :ref="(el) => setMenuRef(el, data._id)"
              :id="data._id"
              :model="getMenuItems(data)"
              :popup="true"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <AppUserBoardsCreateBoardModal
      :showModal="showCreateBoardModal"
      @closeModal="showCreateBoardModal = false"
      :fetchBoards="fetchBoards"
    />
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import type { MenuItem } from "primevue/menuitem";
import type { Board } from "~/types/types";

definePageMeta({
  layout: "app",
  middleware: "auth-client",
});

const router = useRouter();
const { $axios } = useNuxtApp();
const toast = useToast();
const { startLoading, stopLoading } = useLoading();

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
const menuRefs = ref<Record<string, any>>({});
const showCreateBoardModal = ref<boolean>(false);

const search = ref<string>("");
const boards = ref([]);
// const menuItems = ref<MenuItem[]>([
// {
//   label: "View",
//   icon: "pi pi-eye",
//   command: () => router.push(`/user/boards/${data._id}`),
// },
// { label: "Edit", icon: "pi pi-pencil" },
// { label: "Delete", icon: "pi pi-trash" },
// ]);

const setMenuRef = (el: any, id: string) => {
  if (el) menuRefs.value[id] = el;
};

const getMenuItems = (board: Board): MenuItem[] => {
  return [
    {
      label: "View",
      icon: "pi pi-eye",
      command: () => router.push(`/user/boards/${board._id}`),
    },
    { label: "Edit", icon: "pi pi-pencil" },
    { label: "Delete", icon: "pi pi-trash" },
  ];
};

const toggleRowMenu = (event: Event, id: string) => {
  const menu = menuRefs.value[id];
  if (menu) menu.toggle(event);
};

onMounted(() => {
  fetchBoards();
});

const fetchBoards = async () => {
  try {
    startLoading();
    const response = await $axios.get("/board/get");
    if (response && response.status === 200) {
      boards.value = response.data.boards;
    } else {
      toast.add({
        severity: "error",
        summary: "Unexpected error",
        detail: "An unexpected error occurred. Please try again.",
        life: 5000,
      });
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
</script>

<style lang="scss" scoped></style>

<template>
  <div class="flex flex-col w-full h-full flex-1 overflow-hidden p-7 space-y-5">
    <div class="flex items-center gap-5 w-full h-max">
      <h1 class="heading">Boards</h1>
      <button
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
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">&#128512;</span>
              <h1
                class="truncate overflow-hidden whitespace-nowrap"
              >
                {{ data.name }}
              </h1>
            </div>
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
        <Column header="Sections" field="sections" />
        <Column header="Tasks" field="totalTasks" />
        <Column header="Created By" field="createdBy">
          <template #body="{ data }">
            <div class="flex items-center space-x-2.5">
              <img
                class="w-8 h-8 min-h-8 min-w-8 rounded-full object-cover"
                v-if="data.createdBy.avatarUrl"
                :src="data.createdBy.avatarUrl"
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
        <Column header="Collaborators" field="collaborators"> </Column>
        <Column header="Created At">
          <template #body="{ data }">
            <h1>{{ moment(data.createdAt).format("MMMM, DD, YYYY") }}</h1>
          </template>
        </Column>
        <!-- <Column header="Last Modified">
          <template #body="{ data }">
            <h1>{{ moment(data.updatedAt).format("MMMM, DD, YYYY, hh:mm a") }}</h1>
          </template>
        </Column> -->
        <Column header="Actions">
          <template #body="{ data }">
            <Button
              @click="(event) => toggleRowMenu(event, data.id)"
              severity="secondary"
              rounded
              icon="pi pi-ellipsis-v"
              class="hover:!bg-blk-30 !text-surface-0"
              text
            />
            <Menu
              :ref="(el) => setMenuRef(el, data.id)"
              :id="data.id"
              :model="menuItems"
              :popup="true"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import type { MenuItem } from "primevue/menuitem";

definePageMeta({
  layout: "app",
  middleware: 'auth-client',
});

const router = useRouter()

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

const search = ref<string>("");
const menuItems = ref<MenuItem[]>([
  { label: "View", icon: "pi pi-eye", command: () => router.push('/user/boards/1') },
  { label: "Edit", icon: "pi pi-pencil" },
  { label: "Delete", icon: "pi pi-trash" },
]);

const setMenuRef = (el: any, id: string) => {
  if (el) menuRefs.value[id] = el;
};

const toggleRowMenu = (event: Event, id: string) => {
  const menu = menuRefs.value[id];
  if (menu) menu.toggle(event);
};

const boards = ref([
  {
    emoji: "",
    name: "Board 1",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    isFavourite: false,
    sections: 10,
    totalTasks: 32,
    collaborators: 5,
    createdBy: {
      id: 1,
      name: "Shubham Homkar",
      avatarUrl:
        "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      email: "homkar1997@gmail.com",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    emoji: "",
    name: "Board 2",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    isFavourite: true,
    sections: 8,
    totalTasks: 63,
    collaborators: 4,
    createdBy: {
      id: 2,
      name: "Girish Homkar",
      avatarUrl:
        "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
      email: "girishhomkar65@gmail.com",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    emoji: "",
    name: "Board 3",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    isFavourite: true,
    sections: 6,
    totalTasks: 22,
    collaborators: 2,
    createdBy: {
      id: 1,
      name: "Shubham Homkar",
      avatarUrl:
        "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      email: "homkar1997@gmail.com",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    emoji: "",
    name: "Board 4",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    isFavourite: false,
    sections: 4,
    totalTasks: 66,
    collaborators: 6,
    createdBy: {
      id: 3,
      name: "Rasika Homkar",
      avatarUrl: null,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);
</script>

<style lang="scss" scoped></style>

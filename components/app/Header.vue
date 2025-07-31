<template>
  <div
    class="flex bg-blk-80 items-center justify-between w-full h-max px-5 py-2 border-b border-blk-30"
  >
    <div class="flex items-center gap-5">
      <button
        @click="toggleSidebar()"
        v-tool-tip="{
          value: 'Collapse sidebar',
          showDelay: 300,
          hideDelay: 300,
        }"
        class="text-surface-0 p-1.5 hover:bg-blk-80 flex items-center justify-center rounded-md transition-all"
      >
        <i class="pi pi-bars"></i>
      </button>
      <div class="flex items-center gap-2.5">
        <i class="pi pi-objects-column logo"></i>
        <h1 class="app-name">Taskify</h1>
      </div>
    </div>
    <!-- <IconField>
      <InputIcon class="pi pi-search" />
      <InputText
        v-model="search"
        placeholder="Search"
        role="searchbox"
        size="small"
        class="xl:min-w-[28rem] rounded-full !bg-blk-30"
      />
    </IconField> -->
    <div class="flex items-center space-x-2.5">
      <!-- <ToggleSwitch 
        @value-change="handleColorMode"
        v-model="isColorPreferenceDarkMode">
        <template #handle="{ checked }">
          <i :class="['!text-xs pi', { 'pi-moon': checked, 'pi-sun': !checked }]" />
        </template>
      </ToggleSwitch> -->
      <button
        v-tool-tip="{
          value: 'Help with Taskify',
          showDelay: 300,
          hideDelay: 300,
        }"
        class="utility-button text-surface-500 border border-surface-800"
      >
        <i class="pi pi-question text-xs"></i>
      </button>
      <button
        v-if="authStore.user && !authStore.user.avatar"
        @click="toggle"
        v-tool-tip="{ value: 'Shubham Homkar', showDelay: 300, hideDelay: 300 }"
        class="utility-button bg-pink-500 text-sm text-surface-0"
      >
        {{ getInitials(authStore.user.name) }}
      </button>
      <button v-else @click="toggle">
        <img
          :src="authStore.user?.avatar"
          alt="avatar"
          class="utility-button object-cover"
        />
      </button>
      <Popover ref="op">
        <div class="flex flex-col w-full min-w-80">
          <div class="flex items-center justify-between w-full h-max">
            <div class="flex items-center gap-2.5">
              <i class="pi pi-objects-column text-base text-brand"></i>
              <h1 class="text-surface-0 font-normal text-base leading-5">
                Taskify
              </h1>
            </div>
            <button
              @click="logout"
              class="px-3 py-1.5 rounded-md hover:bg-blk-30 text-surface-0 font-normal text-sm leading-5 flex items-center gap-2.5"
            >
              <i class="pi pi-sign-out"></i>
              <span>Logout</span>
            </button>
          </div>
          <div class="flex items-center space-x-5 w-full py-5">
            <img
              v-if="authStore.user && authStore.user.avatar"
              class="min-w-24 min-h-24 h-24 w-24 rounded-full object-cover border border-surface-300"
              :src="authStore.user.avatar"
              alt="avatar"
            />
            <div
              v-else
              class="min-w-24 min-h-24 h-24 w-24 rounded-full bg-blk-30 border border-surface-800 flex items-center justify-center"
            >
              <h1 class="text-surface-0 text-3xl capitalize">
                {{ getInitials(authStore.user?.name || "") }}
              </h1>
            </div>
            <div class="flex flex-col space-y-1.5 flex-grow">
              <h1
                class="text-surface-0 font-normal text-sm leading-4 capitalize"
              >
                {{ authStore.user?.name }}
              </h1>
              <p class="m-0 text-surface-400 font-normal text-sm">
                {{ authStore.user?.email }}
              </p>
              <button
                @click="navigateToProfile"
                class="text-sm font-normal text-blue-500 hover:text-blue-600 underline w-max"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </Popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { signOut } from "firebase/auth";

const { toggleSidebar } = useAppStore();
const { $auth } = useNuxtApp();
const authStore = useAuthStore();
const router = useRouter();

const search = ref<string>("");
const op = ref();
// const colorMode = useColorMode()
// const isColorPreferenceDarkMode = ref<boolean>(colorMode.value === 'dark' ? true : false)

// const handleColorMode = () => {
//   if(isColorPreferenceDarkMode.value) {
//     colorMode.preference = 'dark'
//   } else {
//     colorMode.preference = 'light'
//   }
// }
const toggle = (event: any) => {
  op.value.toggle(event);
};
const navigateToProfile = () => {
  router.push("/user/profile");
  op.value.toggle();
};
const logout = () => {
  signOut($auth);
  authStore.setUser(null);
  localStorage.clear();
  router.go(0);
  console.clear();
};
</script>

<style scoped>
.logo {
  @apply text-2xl text-brand;
}

.app-name {
  @apply text-surface-0 font-normal text-2xl;
}

.utility-button {
  @apply min-w-8 min-h-8 w-8 h-8 rounded-full flex items-center justify-center;
}
</style>

<template>
  <div class="flex flex-col bg-blk-80 h-full flex-1 border-r border-blk-30 transition-all duration-300 ease-in-out"
    :class="appStore.showSidebar ? 'max-w-[250px]' : 'max-w-14'">

    <div class="flex flex-col w-full space-y-2.5 py-5 border-b border-blk-30">
      <button v-for="(item, index) in navigationItems" @click="$router.push(item.url)"
        :class="{ 'bg-blk-30': currentActiveRoute === item.slug }" class="navigation-item" :key="index">
        <i :class="`pi ${item.icon}`"></i>

        <!-- Always render span, but control visibility smoothly -->
        <span class="whitespace-nowrap overflow-hidden transition-all duration-300"
          :class="appStore.showSidebar ? 'opacity-100 max-w-[150px] ml-2' : 'opacity-0 max-w-0 ml-0'">
          {{ item.name }}
        </span>
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
const appStore = useAppStore()
const route = useRoute()

const currentActiveRoute = computed(() => {
  return route.path.split('/')[2]
})

const navigationItems = ref([
  { id: 1, icon: 'pi-home', name: 'Home', slug: 'home', url: '/user/home' },
  { id: 2, icon: 'pi-list-check', name: 'Boards', slug: 'boards', url: '/user/boards' },
  { id: 3, icon: 'pi-bell', name: 'Notifications', slug: 'notifications', url: '/user/notifications' },
])

</script>

<style scoped>
.navigation-item {
  @apply text-start flex items-center gap-x-2.5 px-5 h-10 text-sm font-normal text-surface-0 hover:bg-blk-30;
}
</style>
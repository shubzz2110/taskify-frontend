export const useAppStore = defineStore("appStore", () => {
  const showSidebar = ref<boolean>(false);

  const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value
  }
  
  return {
    showSidebar,
    toggleSidebar
  }
}, { persist: true })
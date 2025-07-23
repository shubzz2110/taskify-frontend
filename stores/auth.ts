import axios from "axios";
import type { User } from "~/types/types";

export const useAuthStore = defineStore(
  "authStore",
  () => {
    const user = ref<User | null>(null);

    const setUser = (payload: User | null) => {
      user.value = payload;
    };

    return {
      user,
      setUser,
    };
  },
  { persist: true }
);

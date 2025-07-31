// plugins/axios.ts
import axios, { AxiosError, type AxiosInstance } from "axios";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const baseURL: string =
    process.env.NODE_ENV === "production"
      ? String(config.public.apiBaseUrlProd)
      : String(config.public.apiBaseUrlLocal);

  const axiosInstance: AxiosInstance = axios.create({
    baseURL,
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error.response?.data || error)
  );

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});

import axios, { AxiosError, type AxiosInstance } from "axios";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const token = useCookie("accessToken");

  const axiosInstance: AxiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl,
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const auth = getAuth();
      config.headers.Authorization = `Bearer ${await auth?.currentUser?.getIdToken()}`;
      return config;
    },
    (error: AxiosError) => Promise.reject(error.response?.data)
  );

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});

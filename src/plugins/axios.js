import { useAppStore } from "@/stores/app-store";
import axios from "axios";
export default {
  install(Vue, pinia) {
    const appStore = useAppStore(pinia);
    Vue.prototype.$axios = axios.create({
      // If user provides a full path to the API, override the baseURL and use the full path
      baseURL: "https://jsonplaceholder.typicode.com",
    });

    Vue.prototype.$axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("bearerToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        appStore.startRequest();
        return config;
      },
      (error) => {
        // Set loading status
        appStore.endRequest();
        return Promise.reject(error);
      }
    );

    Vue.prototype.$axios.interceptors.response.use(
      (response) => {
        // Set loading status
        appStore.endRequest();
        return response;
      },
      (error) => {
        // Set loading status
        appStore.endRequest();
        return Promise.reject(error);
      }
    );
  },
};

// axiosService.js
import axios from "axios";
import { UGAPP_APPLICATIONS_PATH, UG_PATH } from "@/api/api-constants.js";

import { useAppStore } from "@/stores/app-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const appStore = useAppStore();
    if (appStore.isApiCallsCancled) {
      appStore.incrementApiCount();
      return Promise.reject("Request canceled by interceptor");
    } else {
      appStore.startAxiosRequest();
      // You can modify the request config if needed
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    const appStore = useAppStore();
    appStore.endAxiosRequest();
    // You can modify the response data if needed
    return response;
  },
  async (error) => {
    const appStore = useAppStore();
    const authStore = useAuthStore();
    // checking if the unauthorized error is return is so logging out the user
    if (!appStore.isApiCallsCancled) {
      const isUnauthorizedError = await varifyUnAuthorizedErrorIsReturned(
        error
      );
      if (isUnauthorizedError) {
        authStore.logout();
      }
    }
    appStore.endAxiosRequest();
    return Promise.reject(error);
  }
);

export const varifyUnAuthorizedErrorIsReturned = async (error) => {
  if (
    error.config.url.includes(
      `${import.meta.env.VITE_API_BASE_URL}${UG_PATH}${UGAPP_APPLICATIONS_PATH}`
    )
  ) {
    return (
      error.response.data.code === 401 &&
      error.response.data.errors.includes("unauthorized")
    );
  } else {
    return false;
  }
};

// Export Axios for use in your components
export default axios;

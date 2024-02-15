import {
  UG_PATH,
  UGAPP_CONFIG_PATH,
  UGAPP_LANGUAGES_PATH,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  fetchAllLanguage() {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_CONFIG_PATH}${UGAPP_LANGUAGES_PATH}`,
      {
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
};

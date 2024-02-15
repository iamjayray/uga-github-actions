import {
  UGAPP_CONFIG_PATH,
  UGAPP_DEADLINES_PATH,
  UG_PATH,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  fetchAllDeadlines() {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_CONFIG_PATH}${UGAPP_DEADLINES_PATH}`,
      {
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
};

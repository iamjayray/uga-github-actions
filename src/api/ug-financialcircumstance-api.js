import {
  UGAPP_CONFIG_PATH,
  UGAPP_FINANCIALCIRCUMSTANCES_PATH,
  UG_PATH,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  fetchAllFinancialCircumstance() {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_CONFIG_PATH}${UGAPP_FINANCIALCIRCUMSTANCES_PATH}`,
      {
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
};

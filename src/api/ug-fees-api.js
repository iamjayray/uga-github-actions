import {
  UGAPP_CONFIG_PATH,
  UGAPP_APPLICATIONS_PATH,
  UGAPP_FEES_PATH,
  UG_PATH,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  fetchAllApplicationFees() {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_CONFIG_PATH}${UGAPP_FEES_PATH}`,
      {
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  getApplicationFee(accessToken, applicationId) {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_FEES_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
};
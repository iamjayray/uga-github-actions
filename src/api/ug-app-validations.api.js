import {
  UGAPP_APPLICATIONS_PATH,
  UG_PATH,
  VALIDATION_PATH,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  getAppValidationSchema(accessToken, applicationId) {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${VALIDATION_PATH}`,
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

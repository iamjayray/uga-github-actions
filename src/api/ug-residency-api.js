import {
  UGAAP_RESIDENCYANSWERS_PATH,
  UGAPP_APPLICATIONS_PATH,
  UGAPP_AZRESIDENCY_PATH,
  UGAPP_CONFIG_PATH,
  UG_PATH,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  fetchApplicationArizonaResidencyAnswers(accessToken, applicationId) {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAAP_RESIDENCYANSWERS_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  saveArizonaResidencyAnswers(accessToken, applicationId, formData) {
    return axios.post(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAAP_RESIDENCYANSWERS_PATH}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  deleteArizonaResidencyAnswers(accessToken, applicationId) {
    return axios.delete(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAAP_RESIDENCYANSWERS_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  fetchArizonaResidencyConfigurations() {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_CONFIG_PATH}${UGAPP_AZRESIDENCY_PATH}`,
      {
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
};

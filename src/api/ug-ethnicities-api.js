import {
  UG_PATH,
  UGAPP_APPLICATIONS_PATH,
  UGAPP_ETHNICITIES_PATH,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  fetchAllApplicationEthnicity(accessToken, applicationId) {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_ETHNICITIES_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  createApplicationEthnicity(accessToken, applicationId, payloadData) {
    return axios.post(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_ETHNICITIES_PATH}`,
      payloadData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  deleteApplicationEthnicity(accessToken, applicationId, ethnicityId) {
    return axios.delete(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_ETHNICITIES_PATH}/${ethnicityId}`,
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

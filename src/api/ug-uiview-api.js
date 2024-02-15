import {
  UG_PATH,
  UGAPP_UI_PATH,
  UGAPP_VIEW_INFO_PATH,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  fetchApplicationViewInfo(accessToken, applicationId) {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_UI_PATH}${UGAPP_VIEW_INFO_PATH}/${applicationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  createApplicationViewInfo(
    accessToken,
    applicationId,
    previousScreen,
    currentScreen
  ) {
    return axios.post(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_UI_PATH}${UGAPP_VIEW_INFO_PATH}/${applicationId}`,
      {
        appId: applicationId,
        previousScreen: previousScreen,
        currentScreen: currentScreen,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  updateApplicationViewInfo(accessToken, applicationId, payloadData) {
    return axios.put(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_UI_PATH}${UGAPP_VIEW_INFO_PATH}/${applicationId}`,
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
};

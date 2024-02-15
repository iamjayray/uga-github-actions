import {
  UGAPP_APPLICATIONS_PATH,
  UGAPP_CONFIG_PATH,
  UGAPP_SARQUESTIONRESPONSES_PATH,
  UGAPP_SARQUESTIONS_PATH,
  UG_PATH,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  fetchSarQuestionConfigurations() {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_CONFIG_PATH}${UGAPP_SARQUESTIONS_PATH}`,
      {
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  fetchAllApplicationSarQuestionResponse(accessToken, applicationId) {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_SARQUESTIONRESPONSES_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  fetchApplicationSarQuestionResponse(
    accessToken,
    applicationId,
    questionCode
  ) {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_SARQUESTIONRESPONSES_PATH}/${questionCode}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  createApplicationSarQuestionResponse(
    accessToken,
    applicationId,
    questionCode,
    payloadData
  ) {
    return axios.post(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_SARQUESTIONRESPONSES_PATH}/${questionCode}`,
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
  updateApplicationSarQuestionResponse(
    accessToken,
    applicationId,
    questionCode,
    payloadData
  ) {
    return axios.put(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_SARQUESTIONRESPONSES_PATH}/${questionCode}`,
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
  deleteApplicationSarQuestionResponse(
    accessToken,
    applicationId,
    questionCode
  ) {
    return axios.delete(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_SARQUESTIONRESPONSES_PATH}/${questionCode}`,
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

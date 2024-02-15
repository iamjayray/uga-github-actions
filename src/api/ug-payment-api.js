import {
  UG_PATH,
  UGAPP_APPLICATIONS_PATH,
  UGAPP_PAYMENTS_PATH,
  UGAPP_PAYMENT_GATEWAY_PATH,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  fetchApplicationPayment(accessToken, applicationId) {
    return axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_PAYMENTS_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  createApplicationPayment(accessToken, applicationId, form) {
    return axios.post(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_PAYMENTS_PATH}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  createPaymentGatewayRedirect(accessToken, applicationId, form) {
    return axios.post(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_PAYMENT_GATEWAY_PATH}/redirects`,
      form,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  authorizePayment(accessToken, applicationId, form) {
    return axios.post(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_APPLICATIONS_PATH}/${applicationId}${UGAPP_PAYMENT_GATEWAY_PATH}/authorizations`,
      form,
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

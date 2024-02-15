import {
  UGAPP_SUPPORT_TICKETS_PATH,
  UGAPP_UI_PATH,
  UG_PATH,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  createSupportTicket(
    accessToken,
    ticketType,
    subject,
    description,
    applicationId
  ) {
    return axios.post(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${UGAPP_UI_PATH}${UGAPP_SUPPORT_TICKETS_PATH}`,
      {
        ticketType: ticketType,
        subject: subject,
        description: description,
        appId: applicationId,
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
};

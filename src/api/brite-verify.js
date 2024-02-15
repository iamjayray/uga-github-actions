import axios from "@/services/axiosService.js";
import { BRITE_VERIFY_URL } from "@/api/api-constants.js";

export const validateBriteVerifyAddressAndPhone = (payload) => {
  return axios({
    url: BRITE_VERIFY_URL,
    headers: {
      Authorization: `ApiKey: ${import.meta.env.VITE_BRITE_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "post",
    data: JSON.stringify(payload),
  });
};

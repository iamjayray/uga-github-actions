import {
  DATA_POTLUCK_BASE,
  DATA_POTLUCK_CODESET_PATH,
  DATA_POTLUCK_COUNTRY,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export const fetchAllStatesOfUs = () => {
  return axios.get(
    `${DATA_POTLUCK_BASE}${DATA_POTLUCK_CODESET_PATH}${DATA_POTLUCK_COUNTRY}/USA`
  );
};

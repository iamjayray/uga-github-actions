import {
  OAUTH_CALLBACK_PATH,
  UG_PATH,
  USER_ACCOUNTS,
  USER_ASURITE_TOKEN_PATH,
  USER_FORGOT_PASSWORD,
  USER_RESEND_CODE,
  USER_RESET_PASSWORD,
  USER_SIGN_IN,
  USER_SIGN_UP,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  signUp(email, password) {
    // creates a user account
    return axios.post(
      `${import.meta.env.VITE_API_BASE_URL}${UG_PATH}${USER_SIGN_UP}`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  signIn(email, password) {
    // sign in a user account
    return axios.post(
      `${import.meta.env.VITE_API_BASE_URL}${UG_PATH}${USER_SIGN_IN}`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  fetchAsuriteToken(code) {
    // fetch jwt token based on code received during initial handshake
    return axios.post(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${UG_PATH}${USER_ASURITE_TOKEN_PATH}`,
      {
        code: code,
        redirectUri: `${import.meta.env.VITE_HOSTNAME}${OAUTH_CALLBACK_PATH}/`,
      },
      {
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  forgotPassword(email) {
    // initiate forgot password
    return axios.post(
      `${import.meta.env.VITE_API_BASE_URL}${UG_PATH}${USER_FORGOT_PASSWORD}`,
      {
        email: email,
      },
      {
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  resendCode(email) {
    // sends confirmation code to email again
    return axios.post(
      `${import.meta.env.VITE_API_BASE_URL}${UG_PATH}${USER_RESEND_CODE}`,
      {
        email: email,
      },
      {
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  resetPassword(code, email, password) {
    // change password
    return axios.post(
      `${import.meta.env.VITE_API_BASE_URL}${UG_PATH}${USER_RESET_PASSWORD}`,
      {
        code: code,
        email: email,
        password: password,
      },
      {
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
      }
    );
  },
  fetchUserAccounts(accessToken) {
    return axios.get(
      `${import.meta.env.VITE_API_BASE_URL}${UG_PATH}${USER_ACCOUNTS}`,
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

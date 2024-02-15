import userApi from "@/api/user-api.js";
import { useAppStore } from "@/stores/app-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useUserStore } from "@/stores/user-store.js";
import Cookies from "js-cookie";
import { defineStore } from "pinia";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    token: Cookies.get("access_token"),
  }),
  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },
    isAsuLogin() {
      // user-store
      const userStore = useUserStore();

      return /^[\w.+-]+@asu\.edu$/.test(userStore.email);
    },
  },
  actions: {
    setToken(token) {
      Cookies.set("access_token", token, {
        secure: true,
        sameSite: true,
        expires: 30,
      });
      this.token = Cookies.get("access_token");
    },

    async login(email, password) {
      try {
        const { data } = await userApi.signIn(email, password);

        if (data.code === 200) {
          this.setToken(data.data.accessToken);
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async finalizeOAuthLogin(code) {
      try {
        if (code) {
          // 2. send code to ASURITE_TOKEN_PATH to get a JWT
          const { data } = await userApi.fetchAsuriteToken(code);

          // 3. Get the JWT Token, set the state's token
          if (data.code === 200) {
            // set the token with new jwt token
            this.setToken(data.data.accessToken);
          }

          return data;
        } else {
          return {
            code: 400,
            errors: [
              {
                errorCode: 406,
                message:
                  "We did not receive code from ASU SSO!, Please contact our support team to for escalation. Thank you for your cooperation.",
              },
            ],
          };
        }
      } catch (error) {
        return error.response.data;
      }
    },
    logout() {
      // reset all states
      // app-store
      const appStore = useAppStore();
      appStore.$reset();

      // config-store
      const configStore = useConfigStore();
      configStore.$reset();

      // ug-application-store
      const ugApplicationStore = useUgApplicationStore();
      ugApplicationStore.$reset();

      // user-store
      const userStore = useUserStore();
      userStore.$reset();

      // reset token
      this.token = null;

      // remove access_token cookie
      Cookies.remove("access_token");
    },
  },
});

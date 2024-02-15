<template>
  <main id="main-content" data-cy="auth-handler-view">
    <div class="position-relative">
      <b-overlay
        class="mt-space-xxxl"
        :show="true"
        rounder="lg"
        opacity="0.8"
        bg-color="dark"
      >
        <template #overlay>
          <base-loading />
        </template>
      </b-overlay>
    </div>
  </main>
</template>

<script>
import { useAuthStore } from "@/stores/auth-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { mapState, mapActions } from "pinia";
import { BOverlay } from "bootstrap-vue";
import { EnumPageNames } from "@/content/enum-app.js";
import { EnumNameTypes } from "@/content/enum-ug-application.js";
import BaseLoading from "@/components/base-components/BaseLoading.vue";
import jwt_decode from "jwt-decode";

export default {
  name: "ImpersonationAuthHandlerView",
  metaInfo() {
    return {
      title: `Authenticating...`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "b-overlay": BOverlay,
    "base-loading": BaseLoading,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      appId: null,
    };
  },
  computed: {
    ...mapState(useAuthStore, {
      authToken: "token",
      isLoggedIn: "isLoggedIn",
    }),
    ...mapState(useAppStore, {
      isUndergradApplicationSubmitted: "isUndergradApplicationSubmitted",
      selectedUndergradApplicationId: "selectedUndergradApplicationId",
    }),
  },
  methods: {
    ...mapActions(useAuthStore, {
      setToken: "setToken",
      logout: "logout",
    }),
    ...mapActions(useAppStore, {
      populateUndergradApplications: "populateUndergradApplications",
    }),
    ...mapActions(useUgApplicationStore, {
      applicationPatchUiViewInfo: "patchUiViewInfo",
    }),
    handleAlertModalClose() {
      this.$router.push({ name: EnumPageNames.PageHome });
    },
  },
  async created() {
    try {
      if (!this.$route.query.token || !this.$route.query.appId) {
        throw new Error("Token and appId is not available in the route query");
      } else {
        const decodedToken = jwt_decode(this.$route.query.token);
        this.appId = this.$route.query.appId;
        const userType = decodedToken.scope.includes(
          EnumNameTypes.ReadSelfScope
        )
          ? EnumNameTypes.UserTypeSelf
          : EnumNameTypes.UserTypeAdmin;
        // checking if the usertype is admin
        if (userType === EnumNameTypes.UserTypeAdmin) {
          // set the token
          this.setToken(this.$route.query.token);
          // populate the applications
          const response = await this.populateUndergradApplications(
            this.$route.query.token
          );
          if (response.code !== 200) {
            throw new Error(response.errors || "Populate application error");
          }
          // checking if the appid is same
          if (this.selectedUndergradApplicationId !== this.appId) {
            throw new Error(
              `Application not found with this id ${this.appId} .`
            );
          } else {
            // checking if the admin scope is write
            if (decodedToken.scope.includes(EnumNameTypes.WriteAdminScope)) {
              // if the application is submitted redirecting the user to preview page else to review page
              this.$router.push({
                name: this.isUndergradApplicationSubmitted
                  ? EnumPageNames.PageUndergradPreview
                  : EnumPageNames.PageUndergradReview,
                params: { id: this.appId },
              });
            } else {
              // admin read scope: pushing to review page
              if (this.isUndergradApplicationSubmitted) {
                this.$router.push({
                  name: EnumPageNames.PageUndergradPreview,
                  params: { id: this.appId },
                });
              } else {
                throw new Error(
                  "Scope is not matching with the application status."
                );
              }
            }
          }
        } else {
          // token contains user self scope
          throw new Error("Invalid admin scope");
        }
      }
    } catch (error) {
      this.$track({
        event: "app_error",
        action: "admin_impersonation",
        location: this.$router.currentRoute.fullPath,
        message: error.toString(),
      });
      await this.logout();
      this.$router.push({ name: EnumPageNames.PageError });
    }
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <b-overlay
    :show="applicationSubmissionInProgress"
    rounded="lg"
    opacity="0.9"
    variant="light-2"
    blur="3px"
    :class="{ 'new-animation-loader': applicationSubmissionInProgress }"
  >
    <template #overlay>
      <ug-app-submit-loader
        v-if="applicationSubmissionInProgress"
        :value="progressBarValue"
      />
    </template>
  </b-overlay>
</template>

<script>
import UgAppSubmitAnimation from "@/components/ugapp-components/UgAppSubmitAnimation.vue";
import { mapActions, mapState } from "pinia";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { EnumPageNames, EnumApiConstants } from "@/content/enum-app.js";
import { extractGoogleClientId } from "@/services/UtilityService.js";
import { isEmpty } from "radash";
import { BOverlay } from "bootstrap-vue";

export default {
  name: "NelnetHandlerView",
  data() {
    return {
      loading: false,
      appId: null,
    };
  },
  computed: {
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useAppStore, {
      selectedUndergradApplicationId: "selectedUndergradApplicationId",
      applicationSubmissionInProgress: "applicationSubmissionInProgress",
      progressBarValue: "progressBarValue",
    }),
  },
  methods: {
    ...mapActions(useUgApplicationStore, {
      authorizePayment: "authorizePaymentGateWayRedirection",
      getPaymentDetails: "getApplicationPaymentInfo",
      getApplicationValidations: "getValidations",
      submitUgApplication: "submitApplication",
      applicationPatchUiViewInfo: "patchUiViewInfo",
      applicationCreateNotification: "createNotification",
      postPayLaterRequest: "addApplicationPayment",
    }),
    ...mapActions(useAppStore, {
      populateUndergradApplications: "populateUndergradApplications",
      appProgressBarValue: "appProgressBarValue",
      appSubmitApplicationClicked: "appSubmitApplicationClicked",
    }),
    async completeApplicationSubmission() {
      try {
        // checking validation before app submission
        const validationResponse = await this.triggerValidation();
        if (!isEmpty(validationResponse.data)) {
          this.triggerErrorGtm(400, JSON.stringify(validationResponse.data));
          throw new Error(JSON.stringify(validationResponse.data));
        }
        // submit the application
        const ugAppSubmissionStatus = await this.submitUgApplication(
          this.authToken,
          this.appId,
          {
            submitted: true,
          }
        );
        if (ugAppSubmissionStatus.code === 200) {
          this.appProgressBarValue(70);
          // step-3 notification for edplus-salesforce
          await this.applicationCreateNotification(
            this.authToken,
            this.appId,
            EnumApiConstants.SalesforceEdPlus,
            {
              googleClientId: extractGoogleClientId(),
            }
          );
          this.appProgressBarValue(80);
          await this.populateUndergradApplications(this.authToken);
          // step-4: update ui-view-info record
          this.appProgressBarValue(100);
          await this.updateUiViewInfo(EnumPageNames.PageUndergradDashboard);
        } else {
          const isDuplicateApp =
            ugAppSubmissionStatus?.code === 400 &&
            ugAppSubmissionStatus?.data
              ?.toString()
              ?.includes("DUPLICATE_APP_FOUND_MS");
          this.triggerErrorGtm(
            ugAppSubmissionStatus?.code || 500,
            ugAppSubmissionStatus?.data ||
              "something went wrong while application submission"
          );
          this.appSubmitApplicationClicked(false);
          this.$router.push({
            name: EnumPageNames.PageError,
            query: isDuplicateApp ? { code: "ERRAPP" } : null,
          });
        }
      } catch (error) {
        this.appSubmitApplicationClicked(false);
        this.$router.push({
          name: EnumPageNames.PageError,
        });
      }
    },

    async queryHandler(to) {
      const queryResp = to.fullPath.split("?");
      if (!isEmpty(to.query) && queryResp.length > 1) {
        this.appId = to.query.persistedAppId;
        this.loading = true;
        const applicationId = to.query.orderNumber;
        const form = {
          gatewayResponseParameters: queryResp[1],
        };

        try {
          this.appProgressBarValue(50);
          // authirize payment
          await this.authorizePayment(this.authToken, applicationId, form);
          await this.completeApplicationSubmission();
        } catch (error) {
          this.triggerErrorGtm(
            error.response?.data?.code || 500,
            error.response?.data?.errors || "something went wrong"
          );
          // calling default paylater
          this.appProgressBarValue(50);
          await this.handleDefaultPayLater();
        }
      } else {
        this.appId = this.selectedUndergradApplicationId;
        this.appProgressBarValue(50);
        await this.handleDefaultPayLater();
      }
    },
    async handleDefaultPayLater() {
      // only process if the appId exist on the store else push them to error page
      if (!this.appId) {
        this.$router.push({ name: EnumPageNames.PageError });
        this.appSubmitApplicationClicked(false);
        return;
      }
      //  process paylater payment
      const payLaterPayload = {
        paymentType: "Mail Pending",
        paymentCode: "ME",
      };
      const paymentReq = await this.postPayLaterRequest(
        this.authToken,
        this.appId,
        payLaterPayload
      );
      if (paymentReq.data.code === 201) {
        // submit application
        this.appProgressBarValue(60);
        await this.completeApplicationSubmission();
      } else {
        // check if payment already exist
        const paymentInfo = await this.getPaymentDetails(
          this.authToken,
          this.appId
        );
        if (paymentInfo.data.code === 200 && paymentInfo.data.data.length > 0) {
          this.appProgressBarValue(60);
          await this.completeApplicationSubmission();
        } else {
          this.$router.push({ name: EnumPageNames.PageError });
        }
        this.loading = false;
      }
    },

    async triggerValidation() {
      try {
        const data = await this.getApplicationValidations(
          this.authToken,
          this.appId
        );
        if (data.code !== 200) {
          throw new Error(data.response?.data?.errors);
        }
        return data;
      } catch (error) {
        this.triggerErrorGtm(
          error?.response?.data?.code || "something went wrong",
          error.response?.data?.errors || "something went wrong"
        );
        this.appSubmitApplicationClicked(false);
        this.$router.push({ name: EnumPageNames.PageError });
      }
    },

    async updateUiViewInfo(screenName) {
      const payload = {
        appId: this.appId,
        currentScreen: screenName,
        previousScreen: EnumPageNames.PageUndergradReview,
      };
      let response = null;
      if (screenName !== EnumPageNames.PageProfile) {
        response = await this.applicationPatchUiViewInfo(
          this.authToken,
          this.appId,
          payload
        );
      }
      if (!response || response.code === 201) {
        const params = { id: this.appId };
        if (screenName === EnumPageNames.PageUndergradDashboard) {
          this.$track({
            event: "form",
            action: "application form submit",
            name: "onsubmit",
            type: "submit",
            region: "footer",
            section: "primary footer",
            text: "application form submitted",
            currentScreen: screenName,
            previousScreen: EnumPageNames.PageUndergradReview,
          });
          // adding this parameter so that the store populate can be skipped in the LayoutUndergradPostApp after app submission
          params.SkipStorePopulate = true;
        }
        this.$router.push({
          name: screenName,
          params: params,
        });
      } else {
        this.triggerErrorGtm(response.code, response.errors);
        this.$router.push({ name: EnumPageNames.PageError });
      }
    },
    triggerErrorGtm(code, errors) {
      this.$track({
        event: "app_error",
        action: "nelnet_handler",
        location: this.$router.currentRoute.fullPath,
        code: code,
        message: errors.toString(),
      });
    },
  },
  components: {
    "b-overlay": BOverlay,
    "ug-app-submit-loader": UgAppSubmitAnimation,
  },
  async mounted() {
    await this.queryHandler(this.$route);
  },
  created() {
    this.appSubmitApplicationClicked(true);
  },
  metaInfo() {
    return {
      title: `Authorizing payment... | Undergraduate Application`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  watch: {
    $route: {
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <b-overlay
    :show="loading"
    rounded="lg"
    opacity="0.9"
    variant="light-2"
    blur="3px"
    data-cy="portal-layout"
  >
    <template #overlay>
      <base-loader v-if="progressBarLoaderTotalRequests <= 0"></base-loader>
      <base-progress-bar
        v-else
        :value="generalProgressBarPercentage"
      ></base-progress-bar>
    </template>
    <!-- main section of the page -->
    <div id="ug-app-dashboard" class="min-vh-100">
      <!-- skip to main content -->
      <div class="skip-link" data-cy="portal-layout-skip-to-main-content">
        <a href="#main-content">Skip to main content</a>
      </div>

      <!-- admin header -->
      <template v-if="userType === EnumNameTypes.UserTypeAdmin">
        <ug-app-admin-header id="ug-add-admin"></ug-app-admin-header>
      </template>
      <template v-else>
        <!-- header  -->
        <portal-header></portal-header>
        <!-- beta-banner  -->
        <base-beta-banner
          class="sticky-top d-none d-lg-block"
        ></base-beta-banner>
      </template>
      <template v-if="isStoreDataPopulated">
        <transition name="portal-layout">
          <!-- router view -->
          <router-view :key="$route.fullPath"></router-view>
        </transition>
      </template>
    </div>
    <!-- footer -->
    <base-footer></base-footer>
  </b-overlay>
</template>

<script>
import { BOverlay } from "bootstrap-vue";
import BaseFooter from "@/components/base-components/BaseFooter.vue";
import PortalHeader from "@/components/portal-components/PortalHeader.vue";
import UgAppAdminHeader from "@/components/ugapp-components/UgAppAdminHeader.vue";
import { useAuthStore } from "@/stores/auth-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { mapState, mapActions } from "pinia";
import jwt_decode from "jwt-decode";
import BaseLoader from "@/components/base-components/BaseLoading.vue";
import BaseProgressBar from "@/components/base-components/BaseProgressBar.vue";
import BaseBetaBanner from "@/components/base-components/BaseBetaBanner.vue";
import { EnumPageNames } from "@/content/enum-app.js";
import { EnumNameTypes } from "@/content/enum-ug-application.js";

export default {
  name: "LayoutPortal",
  components: {
    "portal-header": PortalHeader,
    "ug-app-admin-header": UgAppAdminHeader,
    "base-footer": BaseFooter,
    "b-overlay": BOverlay,
    "base-loader": BaseLoader,
    "base-progress-bar": BaseProgressBar,
    "base-beta-banner": BaseBetaBanner,
  },
  data() {
    return {
      enumPageNames: EnumPageNames,
      EnumNameTypes: EnumNameTypes,
      isStoreDataPopulated: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useAppStore, {
      loading: "loading",
      hasUndergradApplications: "hasUndergradApplications",
      selectedUndergradApplication: "selectedUndergradApplication",
      generalProgressBarPercentage: "generalProgressBarPercentage",
      progressBarLoaderTotalRequests: "progressBarLoaderTotalRequests",
      progressBarLoaderCurrentRequest: "progressBarLoaderCurrentRequest",
      apisCount: "apisCount",
    }),
    ...mapState(useUserStore, {
      userEmail: "email",
      userType: "userType",
    }),
  },
  methods: {
    ...mapActions(useAppStore, {
      populateUndergradApplications: "populateUndergradApplications",
      updateProgressBarLoaderTotalRequests:
        "updateProgressBarLoaderTotalRequests",
      updateProgressBarLoaderCurrentRequests:
        "updateProgressBarLoaderCurrentRequests",
      updateCancelApiCallsStatus: "updateCancelApiCallsStatus",
      resetApiCallsCount: "resetApiCallsCount",
    }),
    ...mapActions(useConfigStore, {
      populateConfigPronouns: "populatePronouns",
      populateConfigGenders: "populateGenders",
      populateConfigCountries: "populateCountries",
    }),
    ...mapActions(useUgApplicationStore, {
      populateUgAppUiViewInfo: "populateUiViewInfo",
      populateInstitutionStatus: "populateInstitutionStatus",
      populateApplicationProgramOfInterests:
        "populateApplicationProgramOfInterests",
      populateSarQuestionsResponses: "populateSarQuestionsResponses",
      populateApplicationAddresses: "populateApplicationAddresses",
    }),
    ...mapActions(useUserStore, {
      populateUserId: "populateUserId",
      populateUserAsuId: "populateAsuId",
      populateUserEmail: "populateEmail",
      populateUserType: "populateUserType",
      populateUserNames: "populateNames",
      populateUserPhones: "populateUserPhones",
      populateReceiveInfoBySMS: "populateReceiveInfoBySMS",
      populateUserPreferredFirstName: "populatePreferredFirstName",
      populateUserDateOfBirth: "populateDateOfBirth",
      populateUserBirthCountry: "populateBirthCountry",
      populateUserCitizenCountry: "populateCitizenCountry",
      populateUserVisaCode: "populateVisaCode",
      populateUserAttendedAsu: "populateAttendedAsu",
      populateUserFirstGeneration: "populateFirstGeneration",
      populateUserPronouns: "populatePronouns",
      populateUserGenders: "populateGenders",
      populateUserSex: "populateSex",
      populateUserPrimaryLanguageAtHome: "populatePrimaryLanguageAtHome",
      populateUserPrimaryLanguageAtHomeOther:
        "populatePrimaryLanguageAtHomeOther",
      populateUserSsn: "populateSocialSecurityNumber",
    }),
    triggerErrorGtm(code, errors) {
      this.$track({
        event: "app_error",
        action: "layout_portal",
        location: this.$router.currentRoute.fullPath,
        code: code,
        message: errors.toString(),
      });
    },
    async firstBatchPromises() {
      const firstBatchPromises = [
        Promise.resolve(this.populateUndergradApplications(this.authToken)),
        Promise.resolve(this.populateConfigPronouns()),
        Promise.resolve(this.populateConfigGenders()),
        Promise.resolve(this.populateConfigCountries()),
      ];

      return await Promise.allSettled(firstBatchPromises);
    },
    async secondBatchPromises() {
      const secondBatchPromises = [
        Promise.resolve(
          this.populateUgAppUiViewInfo(
            this.authToken,
            this.selectedUndergradApplication?.appId
          )
        ),
        Promise.resolve(
          this.populateUserNames(
            this.authToken,
            this.selectedUndergradApplication?.appId
          )
        ),
        Promise.resolve(
          this.populateUserPronouns(
            this.authToken,
            this.selectedUndergradApplication?.appId
          )
        ),
        Promise.resolve(
          this.populateUserGenders(
            this.authToken,
            this.selectedUndergradApplication?.appId
          )
        ),
        Promise.resolve(
          this.populateApplicationProgramOfInterests(
            this.authToken,
            this.selectedUndergradApplication?.appId
          )
        ),
        Promise.resolve(
          this.populateUserPhones(
            this.authToken,
            this.selectedUndergradApplication?.appId
          )
        ),
        Promise.resolve(
          this.populateSarQuestionsResponses(
            this.authToken,
            this.selectedUndergradApplication?.appId
          )
        ),
        Promise.resolve(
          this.populateApplicationAddresses(
            this.authToken,
            this.selectedUndergradApplication?.appId
          )
        ),
      ];

      return await Promise.allSettled(secondBatchPromises);
    },
  },
  async created() {
    let firstBatchError = false;
    let secondBatchError = false;

    // populate user-store: userId, email, userType
    const decodedToken = jwt_decode(this.authToken);
    this.populateUserId(decodedToken.user_id);
    if (
      decodedToken.scope.includes(EnumNameTypes.ReadAdminScope) ||
      decodedToken.scope.includes(EnumNameTypes.WriteAdminScope)
    ) {
      this.populateUserType(EnumNameTypes.UserTypeAdmin);
    }

    // setting the store varible to cancle the api calls
    this.updateCancelApiCallsStatus(true);
    // calling the batch promisses to get the total number of api calls happening
    await this.firstBatchPromises();
    await this.secondBatchPromises();
    // resetting the api call toggel
    this.updateCancelApiCallsStatus(false);
    // updating the total api requests count
    this.updateProgressBarLoaderTotalRequests(this.apisCount);
    // resetting the count
    this.resetApiCallsCount();

    // firstBatchPromises
    const firstBatchPromiseResults = await this.firstBatchPromises();

    firstBatchPromiseResults.forEach((result) => {
      if (result.value.code >= 400 && result.value.code <= 599) {
        firstBatchError = true || firstBatchError;
        // fire error data layer event
        this.triggerErrorGtm(result.value.code, result.value.errors);
      }
    });

    if (!firstBatchError) {
      if (this.hasUndergradApplications) {
        // create promises for all API calls which needs appId
        const secondBatchPromiseResults = await this.secondBatchPromises();

        secondBatchPromiseResults.forEach((result) => {
          if (result.value.code >= 400 && result.value.code <= 599) {
            secondBatchError = true || secondBatchError;
            // fire error data layer event
            this.triggerErrorGtm(result.value.code, result.value.errors);
          }
        });
      }
    }

    // end request

    if (!firstBatchError && !secondBatchError) {
      if (this.hasUndergradApplications) {
        // populate user-store attributes
        const applicantInfo = this.selectedUndergradApplication["userInfo"];
        this.populateUserPreferredFirstName(
          applicantInfo["preferredFirstName"]
        );
        this.populateUserDateOfBirth(applicantInfo["dateOfBirth"]);
        this.populateUserAttendedAsu(applicantInfo["attendedASU"]);
        this.populateUserFirstGeneration(applicantInfo["firstGeneration"]);
        this.populateUserSex(applicantInfo["sex"]);
        this.populateUserBirthCountry(applicantInfo["birthCountry"]);
        this.populateUserCitizenCountry(applicantInfo["citizenCountry"]);
        this.populateUserVisaCode(applicantInfo["visaCode"]);
        this.populateUserSsn(applicantInfo["ssn"]);
        this.populateUserAsuId(applicantInfo["asuId"]);
        this.populateUserPrimaryLanguageAtHome(
          applicantInfo["primaryLanguageAtHome"]
        );
        this.populateUserPrimaryLanguageAtHomeOther(
          applicantInfo["primaryLanguageAtHomeOther"]
        );
        this.populateInstitutionStatus(
          this.selectedUndergradApplication["instStatus"]
        );
        this.populateUserEmail(applicantInfo["email"]);
        this.populateReceiveInfoBySMS();
      }

      this.isStoreDataPopulated = true;
    } else {
      this.$router.push({ name: this.enumPageNames.PageError });
    }
  },
};
</script>

<style lang="scss" scoped>
.portal-layout-enter-active {
  transition: opacity 0.4s ease-in;
}
.portal-layout-enter {
  opacity: 0;
}
</style>

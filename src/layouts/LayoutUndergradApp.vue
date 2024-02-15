<template>
  <b-overlay
    :show="loading || applicationSubmissionInProgress"
    rounded="lg"
    opacity="0.9"
    variant="light-2"
    blur="3px"
    data-cy="undergrad-app-layout"
    :class="{ 'new-animation-loader': applicationSubmissionInProgress }"
  >
    <template #overlay>
      <template v-if="!applicationSubmissionInProgress">
        <base-loader v-if="isBaseLoaderVisible"></base-loader>
        <base-progress-bar
          v-else
          :value="generalProgressBarPercentage"
        ></base-progress-bar>
      </template>
      <ug-app-submit-loader v-else :value="progressBarValue" />
    </template>
    <!-- main section of the page -->
    <div id="ug-app-layout" class="min-vh-100">
      <!-- skip to main content -->
      <div
        class="skip-link"
        data-cy="undergrad-app-layout-skip-to-main-content"
      >
        <a href="#main-content">Skip to main content</a>
      </div>
      <!-- admin header -->
      <template v-if="userType === EnumNameTypes.UserTypeAdmin">
        <ug-app-admin-header id="ug-add-admin"></ug-app-admin-header>
      </template>
      <!-- user header -->
      <template v-else>
        <ug-app-header id="ug-app-header"></ug-app-header>
        <!-- beta-banner  -->
        <base-beta-banner
          class="sticky-top d-none d-lg-block"
        ></base-beta-banner>
      </template>
      <template v-if="isStoreDataPopulated">
        <transition name="ugapp-layout">
          <!-- router view -->
          <router-view :key="$route.fullPath"></router-view>
        </transition>
      </template>
    </div>
    <!-- Unsaved changes alert modal -->
    <base-unsaved-changes-alert-modal
      :isVisible="isUnsavedChangesModelVisible"
      @close="handleUnsavedChangesAlertModalClose"
      @leaveWithOutSaving="handleLeaveWithOutSaving"
      @backToSave="handleUnsavedChangesAlertModalClose"
    ></base-unsaved-changes-alert-modal>

    <ug-app-floating-need-help-button
      v-if="isFloatingNeedHelpButtonVisible"
    ></ug-app-floating-need-help-button>
    <!-- footer -->
    <ug-app-footer @backClick="handleFooterBackClick"></ug-app-footer>
  </b-overlay>
</template>

<script>
import UgAppFooter from "@/components/ugapp-components/UgAppFooter.vue";
import UgAppHeader from "@/components/ugapp-components/UgAppHeader.vue";
import UgAppAdminHeader from "@/components/ugapp-components/UgAppAdminHeader.vue";
import { useConfigStore } from "@/stores/config-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { BOverlay } from "bootstrap-vue";
import { useAppStore } from "@/stores/app-store.js";
import { mapActions, mapState } from "pinia";
import { EnumPageNames } from "@/content/enum-app.js";
import UgAppSubmitAnimation from "@/components/ugapp-components/UgAppSubmitAnimation.vue";
import { EnumNameTypes } from "@/content/enum-ug-application.js";
import BaseLoader from "@/components/base-components/BaseLoading.vue";
import BaseProgressBar from "@/components/base-components/BaseProgressBar.vue";
import BaseBetaBanner from "@/components/base-components/BaseBetaBanner.vue";
import BaseUnsavedChangesAlertModal from "@/components/base-components/BaseUnsavedChangesAlertModal.vue";
import UgAppFloatingNeedHelpButton from "@/components/ugapp-components/UgAppFloatingNeedHelpButton.vue";
import jwt_decode from "jwt-decode";

export default {
  name: "LayoutUndergradApp",
  components: {
    "ug-app-header": UgAppHeader,
    "ug-app-admin-header": UgAppAdminHeader,
    "b-overlay": BOverlay,
    "ug-app-footer": UgAppFooter,
    "base-loader": BaseLoader,
    "base-progress-bar": BaseProgressBar,
    "base-beta-banner": BaseBetaBanner,
    "base-unsaved-changes-alert-modal": BaseUnsavedChangesAlertModal,
    "ug-app-floating-need-help-button": UgAppFloatingNeedHelpButton,
    "ug-app-submit-loader": UgAppSubmitAnimation,
  },
  data() {
    return {
      enumPageNames: EnumPageNames,
      EnumNameTypes: EnumNameTypes,
      isStoreDataPopulated: false,
      backButtonPayload: null,
      isUnsavedChangesModelVisible: false,
      footerBackButtonClicked: false,
      isFloatingNeedHelpButtonVisible: false,
      appId: null,
    };
  },
  watch: {
    applicationIsCurrentPageHasUnsavedChanges(newValue) {
      if (newValue) {
        window.addEventListener("beforeunload", this.onConfirmRefresh);
      } else {
        window.removeEventListener("beforeunload", this.onConfirmRefresh);
      }
    },
  },
  computed: {
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useUgApplicationStore, {
      applicationId: "appId",
      applicationCurrentScreen: "currentScreen",
      applicationIsCurrentPageHasUnsavedChanges:
        "isCurrentPageHasUnsavedChanges",
      applicationRedirectRouteName: "redirectRouteName",
    }),
    ...mapState(useAppStore, {
      loading: "loading",
      applicationSubmissionInProgress: "applicationSubmissionInProgress",
      progressBarValue: "progressBarValue",
      hasUndergradApplications: "hasUndergradApplications",
      selectedUndergradApplication: "selectedUndergradApplication",
      generalProgressBarPercentage: "generalProgressBarPercentage",
      progressBarLoaderTotalRequests: "progressBarLoaderTotalRequests",
      progressBarLoaderCurrentRequest: "progressBarLoaderCurrentRequest",
      apisCount: "apisCount",
    }),
    ...mapState(useUserStore, {
      userType: "userType",
    }),
    isBaseLoaderVisible() {
      return this.progressBarLoaderTotalRequests <= 0;
    },
  },

  methods: {
    ...mapActions(useConfigStore, {
      populateConfigBirthCountries: "populateBirthCountries",
      populateConfigCitizenCountries: "populateCitizenCountries",
      populateConfigHomeAddressCountries: "populateHomeAddressCountries",
      populateConfigInternationlAddressCountries:
        "populateInternationalAddressCountries",
      populateconfigShippingAddressCountries:
        "populateShippingAddressCountries",
      populateConfigCorporatePartners: "populateCorporatePartners",
      populateConfigEthnicities: "populateEthnicities",
      populateConfigPrimaryLanguagesAtHome: "populatePrimaryLanguagesAtHome",
      populateConfigPrimaryLanguagesAtHomeOther:
        "populatePrimaryLanguagesAtHomeOther",
      populateConfigVisaPermitTypes: "populateVisaPermitTypes",
      populateConfigDeadlines: "populateDeadlines",
      populateConfigFees: "populateFees",
      populateConfigFinancialCircumstances: "populateFinancialCircumstances",
      populateConfigHighSchoolAcademicYears: "populateHighSchoolAcademicYears",
      populateConfigHighSchoolCourses: "populateHighSchoolCourses",
      populateConfigHighSchoolCourseLevels: "populateHighSchoolCourseLevels",
      populateConfigHighSchoolCourseSubjects:
        "populateHighSchoolCourseSubjects",
      populateConfigHighSchoolGpaScales: "populateHighSchoolGpaScales",
      populateConfigHighSchoolGradeScaleTypes:
        "populateHighSchoolGradeScaleTypes",
      populateConfigHighSchoolGrades: "populateHighSchoolGrades",
      populateConfigHighSchoolTermTypes: "populateHighSchoolTermTypes",
      populateConfigPronouns: "populatePronouns",
      populateConfigTribes: "populateTribes",
      populateConfigUserTypeLocations: "populateUserTypeLocations",
      populateConfigHighSchoolCountries: "populateHighSchoolCountries",
      populateConfigInstitutionCountries: "populateInstitutionCountries",
      populateConfigUsStateCities: "populateUsStateCities",
      populateConfigStatesLicensedtoPracticeRN:
        "populateStatesLicensedtoPracticeRN",
      populateConfigPrograms: "populatePrograms",
      preselectConfigHomeAddressCountryState:
        "preselectHomeAddressCountryState",
      preselectConfigEthnicities: "preselectEthnicities",
      preselectConfigInternationalAddressCountryState:
        "preselectInternationalAddressCountryState",
      preselectConfigShippingAddressCountryState:
        "preselectShippingAddressCountryState",
      preselectConfigCorpratePartners: "preselectCorpratePartners",
      preselectConfigStatesLicensedToPracticeRn:
        "preselectStatesLicensedToPracticeRn",
      preselectConfigPrimaryLanguageAtHome: "preselectPrimaryLanguageAtHome",
      preselectConfigCitizenCountry: "preselectCitizenCountry",
      preselectConfigBirthCountry: "preselectBirthCountry",
      preselectConfigUserVisaType: "preselectUserVisaType",
      populateConfigAzResidency: "populateAzResidency",
      populateConfigSarQuestions: "populateSarQuestions",
      populateConfigTerms: "populateTerms",
      populateConfigCountries: "populateCountries",
    }),
    ...mapActions(useUgApplicationStore, {
      getApplication: "getApplication",
      populateApplicationId: "populateApplicationId",
      populateApplicationResidencyAnswers:
        "populateApplicationResidencyAnswers",
      populateUsStates: "populateUsStates",
      populateApplicationStarted: "populateAppStarted",
      populateApplicationFormerNames: "populateApplicationFormerNames",
      populateApplicationAddresses: "populateApplicationAddresses",
      populateUiViewInfo: "populateUiViewInfo",
      populateEthnicities: "populateEthnicities",
      populateApplicationGuardians: "populateApplicationGuardians",
      populateSarQuestionsResponses: "populateSarQuestionsResponses",
      patchUiViewInfo: "patchUiViewInfo",
      populateApplicationHighSchoolCourseWorks:
        "populateApplicationHighSchoolCourseWorks",
      populateApplicationHighSchools: "populateApplicationHighSchools",
      populateApplicationHighSchoolAcademics:
        "populateApplicationHighSchoolAcademics",
      populateApplicationProgramOfInterests:
        "populateApplicationProgramOfInterests",
      populateApplicationOtherInstitutions:
        "populateApplicationOtherInstitutions",
      populateApplicationMilitaryAffiliations:
        "populateApplicationMilitaryAffiliations",
      updateCurrentPageUnsavedChanges: "updateCurrentPageUnsavedChanges",
      updateRedirectRouteName: "updateRedirectRouteName",
      populateInstitutionStatus: "populateInstitutionStatus",
      populateUgAppUiViewInfo: "populateUiViewInfo",
      populateApplicationVisaSupplementals:
        "populateApplicationVisaSupplementals",
    }),
    ...mapActions(useAppStore, {
      populateUndergradApplications: "populateUndergradApplications",
      updateCancelApiCallsStatus: "updateCancelApiCallsStatus",
      updateProgressBarLoaderTotalRequests:
        "updateProgressBarLoaderTotalRequests",
      resetApiCallsCount: "resetApiCallsCount",
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
      populateUserSex: "populateSex",
      populateUserPrimaryLanguageAtHome: "populatePrimaryLanguageAtHome",
      populateUserPrimaryLanguageAtHomeOther:
        "populatePrimaryLanguageAtHomeOther",
      populateUserSsn: "populateSocialSecurityNumber",
      populateUserPronouns: "populatePronouns",
      populateUserGenders: "populateGenders",
    }),
    ...mapActions(useAuthStore, { logout: "logout" }),
    async handleFooterBackClick(event) {
      if (this.applicationIsCurrentPageHasUnsavedChanges) {
        this.$router.push({
          name: event.currentScreen,
          params: { id: event.appId },
        });
        this.updateRedirectRouteName(event.currentScreen);
        this.footerBackButtonClicked = true;
        this.backButtonPayload = event;
      } else {
        const response = await this.updateUiViewInfo(event);
        if (response.code === 201) {
          this.$router.push({
            name: this.applicationCurrentScreen,
            params: { id: event.appId },
          });
        }
      }
    },
    async updateUiViewInfo(payload) {
      const response = await this.patchUiViewInfo(
        this.authToken,
        payload.appId,
        payload
      );
      return response;
    },
    handleUnsavedChangesAlertModalClose() {
      this.isUnsavedChangesModelVisible = false;
      this.backButtonPayload = null;
      this.footerBackButtonClicked = false;
      this.updateRedirectRouteName(null);
    },
    async handleLeaveWithOutSaving() {
      const appId = this.$route.params.id;
      const redirectRouteName = this.applicationRedirectRouteName
        ? this.applicationRedirectRouteName
        : this.enumPageNames.PageDashboard;
      // resetting all the fields
      this.updateCurrentPageUnsavedChanges(false);
      this.updateRedirectRouteName(null);
      this.isUnsavedChangesModelVisible = false;
      // if user has click back button from footer updating the UIViewInfo
      if (this.footerBackButtonClicked) {
        const response = await this.updateUiViewInfo(this.backButtonPayload);
        this.footerBackButtonClicked = false;
        this.backButtonPayload = null;
        if (response.code === 201) {
          this.$router.push({
            name: this.applicationCurrentScreen,
            params: { id: appId },
          });
        }
      } else {
        // checking if the user has clicked on signout
        if (redirectRouteName === this.enumPageNames.PageUserLogin) {
          this.logout();
        }
        this.$router.push({ name: redirectRouteName });
      }
    },
    onConfirmRefresh(event) {
      event.preventDefault();
      return (event.returnValue = "");
    },
    triggerErrorGtm(code, errors) {
      this.$track({
        event: "app_error",
        action: "layout_undergrad_app",
        location: this.$router.currentRoute.fullPath,
        code: code,
        message: errors.toString(),
      });
    },
    floatingNeedHelpButton() {
      let scrollPos = window.scrollY;
      const headerPos = document.getElementById("ug-app-header");
      this.isFloatingNeedHelpButtonVisible =
        scrollPos >= headerPos?.getBoundingClientRect().height;
    },
    async firstBatchPromises() {
      const firtstBatchPromises = [
        Promise.resolve(this.getApplication(this.authToken, this.appId)),
        Promise.resolve(this.populateUndergradApplications(this.authToken)),
        Promise.resolve(this.populateConfigHomeAddressCountries()),
        Promise.resolve(this.populateConfigBirthCountries()),
        Promise.resolve(this.populateConfigCitizenCountries()),
        Promise.resolve(this.populateConfigCorporatePartners()),
        Promise.resolve(this.populateConfigEthnicities()),
        Promise.resolve(this.populateConfigInstitutionCountries()),
        Promise.resolve(this.populateConfigUsStateCities()),
        Promise.resolve(this.populateConfigStatesLicensedtoPracticeRN()),
        Promise.resolve(this.populateConfigPrograms()),
        Promise.resolve(this.populateConfigHighSchoolCountries()),
        Promise.resolve(this.populateConfigUserTypeLocations()),
        Promise.resolve(this.populateConfigTribes()),
        Promise.resolve(this.populateConfigPronouns()),
        Promise.resolve(this.populateconfigShippingAddressCountries()),
        Promise.resolve(this.populateConfigInternationlAddressCountries()),
        Promise.resolve(this.populateConfigHighSchoolTermTypes()),
        Promise.resolve(this.populateConfigHighSchoolGrades()),
        Promise.resolve(this.populateConfigHighSchoolGradeScaleTypes()),
        Promise.resolve(this.populateConfigHighSchoolGpaScales()),
        Promise.resolve(this.populateConfigHighSchoolCourseSubjects()),
        Promise.resolve(this.populateConfigHighSchoolCourseLevels()),
        Promise.resolve(this.populateConfigHighSchoolCourses()),
        Promise.resolve(this.populateConfigHighSchoolAcademicYears()),
        Promise.resolve(this.populateConfigFinancialCircumstances()),
        Promise.resolve(this.populateConfigFees()),
        Promise.resolve(this.populateConfigDeadlines()),
        Promise.resolve(this.populateConfigVisaPermitTypes()),
        Promise.resolve(this.populateConfigPrimaryLanguagesAtHomeOther()),
        Promise.resolve(this.populateConfigPrimaryLanguagesAtHome()),
        Promise.resolve(this.populateUsStates()),
        Promise.resolve(this.populateConfigAzResidency()),
        Promise.resolve(this.populateConfigSarQuestions()),
        Promise.resolve(this.populateConfigTerms()),
        Promise.resolve(this.populateConfigCountries()),
      ];
      return await Promise.allSettled(firtstBatchPromises);
    },
    async secondBatchPromises() {
      const secondBatchPromises = [
        Promise.resolve(this.populateUserPronouns(this.authToken, this.appId)),
        Promise.resolve(this.populateUserGenders(this.authToken, this.appId)),
        Promise.resolve(
          this.populateUgAppUiViewInfo(this.authToken, this.appId)
        ),
        Promise.resolve(this.populateUserNames(this.authToken, this.appId)),
        Promise.resolve(this.populateUserPhones(this.authToken, this.appId)),
        Promise.resolve(
          this.populateApplicationFormerNames(this.authToken, this.appId)
        ),
        Promise.resolve(
          this.populateApplicationAddresses(this.authToken, this.appId)
        ),
        Promise.resolve(this.populateEthnicities(this.authToken, this.appId)),
        Promise.resolve(
          this.populateApplicationGuardians(this.authToken, this.appId)
        ),
        Promise.resolve(
          this.populateApplicationHighSchools(this.authToken, this.appId)
        ),
        Promise.resolve(
          this.populateApplicationProgramOfInterests(this.authToken, this.appId)
        ),
        Promise.resolve(
          this.populateApplicationOtherInstitutions(this.authToken, this.appId)
        ),
        Promise.resolve(
          this.populateSarQuestionsResponses(this.authToken, this.appId)
        ),
        Promise.resolve(
          this.populateApplicationHighSchoolCourseWorks(
            this.authToken,
            this.appId
          )
        ),
        Promise.resolve(
          this.populateApplicationResidencyAnswers(this.authToken, this.appId)
        ),
        Promise.resolve(
          this.populateApplicationMilitaryAffiliations(
            this.authToken,
            this.appId
          )
        ),
        Promise.resolve(
          this.populateApplicationVisaSupplementals(this.authToken, this.appId)
        ),
      ];

      return await Promise.allSettled(secondBatchPromises);
    },
    async thirdBatchPromises() {
      const thirdBatchPromises = [
        Promise.resolve(
          this.populateApplicationHighSchoolAcademics(
            this.authToken,
            this.appId
          )
        ),
        Promise.resolve(this.preselectConfigHomeAddressCountryState()),
        Promise.resolve(this.preselectConfigInternationalAddressCountryState()),
        Promise.resolve(this.preselectConfigShippingAddressCountryState()),
      ];

      return await Promise.allSettled(thirdBatchPromises);
    },
  },
  async created() {
    // populate user-store: userId, email
    const decodedToken = jwt_decode(this.authToken);
    this.populateUserId(decodedToken.user_id);
    if (
      decodedToken.scope.includes(EnumNameTypes.ReadAdminScope) ||
      decodedToken.scope.includes(EnumNameTypes.WriteAdminScope)
    ) {
      this.populateUserType(EnumNameTypes.UserTypeAdmin);
    }

    let firstBatchError = false;
    let secondBatchError = false;
    let thirdBatchError = false;

    // get appId from path-param
    this.appId = this.$route.params.id;

    // setting the store varible to cancle the api calls
    this.updateCancelApiCallsStatus(true);
    // calling the batch promisses to get the total number of api calls happening
    await this.firstBatchPromises();
    await this.secondBatchPromises();
    await this.thirdBatchPromises();
    // resetting the api call toggel
    this.updateCancelApiCallsStatus(false);
    // updating the total api requests count
    this.updateProgressBarLoaderTotalRequests(this.apisCount);
    // resetting the count
    this.resetApiCallsCount();

    // batch-1 promises: applicationInstance and configOptions
    const firstBatchPromiseResults = await this.firstBatchPromises();

    firstBatchPromiseResults.forEach((result) => {
      if (result.value.code >= 400 && result.value.code <= 599) {
        firstBatchError = true || firstBatchError;
        // fire error data layer event
        this.triggerErrorGtm(result.value.code, result.value.errors);
      }
    });

    if (!firstBatchError) {
      // prepare secondBatch - for getting application related data from related entities
      const secondBatchPromiseResults = await this.secondBatchPromises();

      secondBatchPromiseResults.forEach((result) => {
        if (result.value.code >= 400 && result.value.code <= 599) {
          secondBatchError = true || secondBatchError;
          this.triggerErrorGtm(result.value.code, result.value.errors);
        }
      });
    }

    if (!firstBatchError || !secondBatchError) {
      // prepare third batch - for preseting the config options and populate data which are dependent on previous batch data
      const thirdBatchPromiseResults = await this.thirdBatchPromises();

      thirdBatchPromiseResults.forEach((result) => {
        if (result.value.code >= 400 && result.value.code <= 599) {
          thirdBatchError = true || thirdBatchError;
          this.triggerErrorGtm(result.value.code, result.value.errors);
        }
      });
    }

    if (
      !firstBatchError &&
      !secondBatchError &&
      !thirdBatchError &&
      this.hasUndergradApplications
    ) {
      // populate user-store attributes
      const applicantInfo = this.selectedUndergradApplication["userInfo"];
      this.populateUserPreferredFirstName(applicantInfo["preferredFirstName"]);
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

      // Presetting the selected state for the config options which dosent have any api dependency
      this.preselectConfigPrimaryLanguageAtHome();
      this.preselectConfigCitizenCountry();
      this.preselectConfigBirthCountry();
      this.preselectConfigEthnicities();
      this.preselectConfigCorpratePartners();
      this.preselectConfigStatesLicensedToPracticeRn();
      this.preselectConfigUserVisaType();

      this.isStoreDataPopulated = true;

      if (this.$route.name !== this.applicationCurrentScreen) {
        this.$router.push({
          name: this.applicationCurrentScreen,
          params: { id: this.appId },
        });
      }
    } else {
      this.$router.push({ name: this.enumPageNames.PageError });
    }

    // blocking user to change the page with unsaved changes and displaying the alert modal
    this.$router.beforeEach((to, from, next) => {
      if (this.applicationIsCurrentPageHasUnsavedChanges) {
        if (!this.applicationRedirectRouteName) {
          this.updateRedirectRouteName(to.name);
        }
        this.isUnsavedChangesModelVisible = true;
        false;
      } else {
        next();
      }
    });

    // TODO: figure out a way to pass error message for 404 page
  },
  mounted() {
    // setting the unsaved changes state value to false initially
    this.updateCurrentPageUnsavedChanges(false);
    window.addEventListener("scroll", () => {
      this.floatingNeedHelpButton();
    });
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.onConfirmRefresh);
    window.removeEventListener("scroll", this.floatingNeedHelpButton);
  },
};
</script>

<style lang="scss" scoped>
.ugapp-layout-enter-active {
  transition: opacity 0.4s ease-in;
}
.ugapp-layout-enter {
  opacity: 0;
}
.loader {
  position: fixed;
  left: 45%;
  top: 45%;
}
</style>

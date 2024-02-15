<template>
  <main id="main-content" data-cy="arizona-residency-view">
    <div class="bg-light-1 px-space-xxs pt-space-sm">
      <div
        class="arizona-residency container bg-white pt-space-md pb-space-xxl px-space-sm p-lg-space-xl min-vh-100"
      >
        <!-- page title -->
        <section
          id="page_title"
          data-cy="arizon-residency-page-heading-and-eta"
        >
          <div class="row">
            <div class="col-12">
              <h1 class="h1-medium">
                <span class="bg-secondary">{{ pageData.intro.title }}</span>
              </h1>
              <div class="eta py-space-xxs">
                <div
                  class="intro-text"
                  v-if="isValidResident || applicationIsEligibleForProp308"
                >
                  <p class="text-dark-1">
                    <font-awesome-icon
                      icon="fa-sharp fa-solid fa-clock"
                      size="xs"
                    />
                    <span v-html="pageData.intro.eta"></span>
                  </p>
                  <p class="text-dark-1 m-0">
                    {{ pageData.intro.introduction }}
                  </p>
                </div>
                <base-alert
                  v-else
                  alert-type="success"
                  iconVariant="success"
                  text="Based on the information you provided, it appears that you are not a resident of the United States. Therefore, this page is not necessary. Please continue to the next step."
                  :isDismissible="false"
                  class="mt-space-sm"
                ></base-alert>
              </div>
            </div>
          </div>
        </section>
        <hr class="my-space-lg" />
        <template v-if="isValidResident">
          <!-- section Domicile -->
          <section-domicile
            :content="pageData.sectionDomicile"
            :isFormSubmitClicked="isSubmitted"
            @isFormInvalid="handleDomicileValidation"
            :allUsStates="allUsStates"
            v-model="form.sectionDomicile"
          ></section-domicile>
          <template v-if="isAZResidentOrStudiedInUs">
            <!-- section enrollment -->
            <section-enrollment
              ref="section-enrollment"
              :content="pageData.sectionEnrollment"
              :isFormSubmitClicked="isSubmitted"
              @isFormInvalid="handleEnrollmentValidation"
              :allUsStates="allUsStates"
              v-model="form.sectionEnrollment"
            />
            <!-- sectionDependent -->
            <section-dependency
              v-if="isDisplayDependentTaxSection"
              :isRequired="isDisplayDependentTaxSection"
              ref="section-dependency"
              :content="pageData.sectionDependent"
              :isFormSubmitClicked="isSubmitted"
              @isFormInvalid="handleDependencyValidation"
              v-model="form.sectionDependent"
            />
            <!-- section driver license -->
            <section-driver-license
              :content="pageData.sectionDriverLicense"
              :isFormSubmitClicked="isSubmitted"
              @isFormInvalid="handleDriverLicenseValidation"
              :allUsStates="allUsStates"
              v-model="form.sectionDriverLicense"
            />
            <!-- section vehicle -->
            <section-vehicle
              :content="pageData.sectionVehicle"
              :isFormSubmitClicked="isSubmitted"
              @isFormInvalid="handleVehicleValidation"
              :allUsStates="allUsStates"
              v-model="form.sectionVehicle"
            />
            <!-- section taxes -->
            <section-taxes
              :content="pageData.sectionTax"
              :isFormSubmitClicked="isSubmitted"
              @isFormInvalid="handleTaxesValidation"
              :allUsStates="allUsStates"
              v-model="form.sectionTax"
            />
            <!-- section financial support -->
            <section-financial-support
              :content="pageData.sectionFinancialSupport"
              :isFormSubmitClicked="isSubmitted"
              :isTaxClaimedAsDependent="
                form.sectionDependent?.isTaxClaimedAsDependent?.value
              "
              @isFormInvalid="handleFinancialSupportValidation"
              v-model="form.sectionFinancialSupport"
            />
            <!-- section employment -->
            <section-employment
              :content="pageData.sectionEmployment"
              :isFormSubmitClicked="isSubmitted"
              v-if="isDisplayEmploymentSection"
              :allUsStates="allUsStates"
              @isFormInvalid="handleEmploymentValidation"
              v-model="form.sectionEmployment"
            />
          </template>
          <!-- sectionActiveMilitary -->
          <section-military-active-duty
            :content="pageData.sectionMilitaryActiveDuty"
            :isFormSubmitClicked="isSubmitted"
            v-if="isActiveMilitary"
            :allUsStates="allUsStates"
            @isFormInvalid="handleMilitaryActiveDutyValidation"
            v-model="form.sectionMilitaryActiveDuty"
          />
          <!-- sectionVeteran -->
          <section-veteran
            :content="pageData.sectionVeteran"
            :allUsStates="allUsStates"
            v-if="isVeteran"
            :isFormSubmitClicked="isSubmitted"
            @isFormInvalid="handleVeteranValidation"
            v-model="form.sectionVeteran"
          >
            <template #slot-voter-id>
              <section-vote
                :content="pageData.sectionVote"
                :isFormSubmitClicked="isSubmitted"
                :allUsStates="allUsStates"
                @isFormInvalid="handleMVoteValidation"
                v-model="form.sectionVote"
              />
            </template>
            <template #slot-driver-license v-if="!isAZResidentOrStudiedInUs">
              <section-driver-license
                :content="pageData.sectionDriverLicense"
                :isFormSubmitClicked="isSubmitted"
                @isFormInvalid="handleMDriverLicenseValidation"
                :allUsStates="allUsStates"
                v-model="form.sectionDriverLicense"
              />
            </template>
          </section-veteran>
          <!-- sectionMilitaryDependency -->
          <section-military-dependency
            v-if="isMilitaryDependent"
            :content="pageData.sectionMilitaryDependency"
            :allUsStates="allUsStates"
            :isFormSubmitClicked="isSubmitted"
            @isFormInvalid="handleMilitaryDependencyValidation"
            v-model="form.sectionMilitaryDependency"
          >
            <template #slot-voter-id>
              <section-vote
                :content="pageData.sectionVote"
                :isFormSubmitClicked="isSubmitted"
                :allUsStates="allUsStates"
                @isFormInvalid="handleMDVoteValidation"
                v-model="form.sectionVote"
              />
            </template>
            <template #slot-driver-license v-if="!isAZResidentOrStudiedInUs">
              <section-driver-license
                :content="pageData.sectionDriverLicense"
                :isFormSubmitClicked="isSubmitted"
                @isFormInvalid="handleMDDriverLicenseValidation"
                :allUsStates="allUsStates"
                v-model="form.sectionDriverLicense"
              />
            </template>
          </section-military-dependency>
          <!-- sectionNativeAmerican -->
          <section-native-american
            :content="pageData.sectionNativeAmerican"
            v-if="isNativeAmerican"
            :isFormSubmitClicked="isSubmitted"
            @isFormInvalid="handleNativeAmericanValidation"
            v-model="form.sectionNativeAmerican"
          />
          <!-- section legal guardian -->
          <section-legal-guardian
            :allUsStates="allUsStates"
            v-if="isLegalGuardianSectionVisible"
            v-model="form.sectionLegalGuardian"
            :content="pageData.sectionLegalGuardian"
            :isFormSubmitClicked="isSubmitted"
            @isFormInvalid="handleLegalGuardianValidation"
          ></section-legal-guardian>
          <!-- section marriage -->
          <section-married
            :content="pageData.sectionMarried"
            :allUsStates="allUsStates"
            v-if="isSectionMarriedVisible"
            :hasSpousalSupport="hasSpousalFinancialSupport"
            :isFormSubmitClicked="isSubmitted"
            @isFormInvalid="handleMarriedValidation"
            v-model="form.sectionMarried"
          />
        </template>
        <!-- PROP: 308 -->
        <template v-if="applicationIsEligibleForProp308">
          <section-prop-308
            :content="pageData.sectionProp308"
            :isFormSubmitClicked="isSubmitted"
            @isFormInvalid="handleProp308Validation"
            v-model="form.sectionProp308"
            :allUsStates="allUsStates"
          ></section-prop-308>
        </template>
      </div>
    </div>
  </main>
</template>

<script>
// data
import data from "@/content/arizona-residency.json";
import { EnumPageNames, EnumApiConstants } from "@/content/enum-app.js";
import AcceptedVisaTypes from "@/content/valid-visa-types.json";
import { EnumNameTypes, EnumAzResidency } from "@/content/enum-ug-application";
//pinia store
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import { mapActions, mapState } from "pinia";
// vuelidate
import { validationMixin } from "vuelidate";
import { requiredIf } from "vuelidate/lib/validators";
// plugins
// components
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import SectionDomicile from "@/components/ugapp-components/az-residency/SectionDomicile.vue";
import SectionEnrollment from "@/components/ugapp-components/az-residency/SectionEnrollment.vue";
import SectionDependency from "@/components/ugapp-components/az-residency/SectionDependency.vue";
import SectionDriverLicense from "@/components/ugapp-components/az-residency/SectionDriverLicense.vue";
import SectionVehicle from "@/components/ugapp-components/az-residency/SectionVehicle.vue";
import SectionTaxes from "@/components/ugapp-components/az-residency/SectionTaxes.vue";
import SectionEmployment from "@/components/ugapp-components/az-residency/SectionEmployment.vue";
import SectionMilitaryActiveDuty from "@/components/ugapp-components/az-residency/SectionMilitaryActiveDuty.vue";
import SectionVote from "@/components/ugapp-components/az-residency/SectionVote.vue";
import SectionMilitaryDependency from "@/components/ugapp-components/az-residency/SectionMilitaryDependency.vue";
import SectionVeteran from "@/components/ugapp-components/az-residency/SectionVeteran.vue";
import SectionNativeAmerican from "@/components/ugapp-components/az-residency/SectionNativeAmerican.vue";
import SectionLegalGuardian from "@/components/ugapp-components/az-residency/SectionLegalGuardian.vue";
import SectionMarried from "@/components/ugapp-components/az-residency/SectionMarried.vue";
import SectionFinancialSupport from "@/components/ugapp-components/az-residency/SectionFinancialSupport.vue";
import SectionProp308 from "@/components/ugapp-components/az-residency/SectionProp308.vue";
// Utilities
import * as _ from "lodash";
import { extractGoogleClientId } from "@/services/UtilityService.js";

export default {
  name: "UgAppArizonaResidency",
  metaInfo() {
    return {
      title: `${this.pageData.intro.title} | Undergraduate Application`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  data() {
    return {
      pageData: data,
      isSubmitted: false,
      initialFormData: {},
      form: {},
      isSectionDomicileValid: false,
      isSectionEnrollmentValid: false,
      isSectionDependencyValid: false,
      isSectionDriverLicenseValid: false,
      isSectionVehicleValid: false,
      isSectionTaxesValid: false,
      isSectionEmploymentValid: false,
      isSectionMilitaryActiveDutyValid: false,
      isSectionMilitaryDependencyValid: false,
      isSectionVeteranValid: false,
      isSectionNativeAmericanValid: false,
      isSectionLegalGuardianValid: false,
      isSectionMarriedValid: false,
      isSectionFinancialSupportValid: false,
      isSectionMVoteValid: false,
      isSectionMDriverLicenseValid: false,
      isSectionMDDriverLicenseValid: false,
      isSectionMDVoteValid: false,
      isSectionProp308Valid: false,
      // validation logic
      alert: {
        show: false,
        text: null,
        type: null,
      },
      footerSubmitActionListenner: null,
    };
  },
  mixins: [validationMixin],
  components: {
    "base-alert": BaseAlert,
    "section-domicile": SectionDomicile,
    "section-enrollment": SectionEnrollment,
    "section-dependency": SectionDependency,
    "section-driver-license": SectionDriverLicense,
    "section-vehicle": SectionVehicle,
    "section-taxes": SectionTaxes,
    "section-employment": SectionEmployment,
    "section-military-active-duty": SectionMilitaryActiveDuty,
    "section-vote": SectionVote,
    "section-military-dependency": SectionMilitaryDependency,
    "section-veteran": SectionVeteran,
    "section-native-american": SectionNativeAmerican,
    "section-legal-guardian": SectionLegalGuardian,
    "section-married": SectionMarried,
    "section-financial-support": SectionFinancialSupport,
    "section-prop-308": SectionProp308,
  },
  watch: {
    form: {
      handler(newValue) {
        if (!this.$v.$anyDirty) {
          this.initialFormData = _.cloneDeep(this.form);
        }
        if (!_.isEqual(newValue, this.initialFormData)) {
          this.applicationUpdateCurrentPageUnsavedChanges(true);
        } else {
          this.applicationUpdateCurrentPageUnsavedChanges(false);
        }
        this.applicationUpdateCurrentPageStatus({
          anyDirty: this.$v.$anyDirty,
          anyError: this.$v.$anyError,
        });
      },
      deep: true,
    },
    isAZResidentOrStudiedInUs(newValue) {
      if (!newValue) {
        this.form.sectionEnrollment = null;
        this.form.sectionDependent = null;
        this.form.sectionVehicle = null;
        this.form.sectionTax = null;
        this.form.sectionFinancialSupport = null;
        this.form.sectionEmployment = null;
        // resetting the sectionDriverLicense if it is not displayed in any other sections
        if (
          !(
            this.isMilitaryDependent &&
            this.form.sectionMilitaryDependency?.selectSectorOfMilitary
              ?.value === "veteran"
          ) &&
          !this.isVeteran
        )
          this.form.sectionDriverLicense = null;
      }
    },
    "form.sectionMilitaryDependency": {
      handler(newValue) {
        if (
          this.isMilitaryDependent &&
          newValue?.selectSectorOfMilitary?.value !== "veteran"
        ) {
          this.form.sectionVote = null;
          if (!this.isAZResidentOrStudiedInUs) {
            this.form.sectionDriverLicense = null;
          }
        }
      },
      deep: true,
    },
    isSectionMarriedVisible(newValue) {
      if (!newValue) {
        this.form.sectionMarried = null;
      }
    },
    isLegalGuardianSectionVisible(newValue) {
      if (!newValue) {
        this.form.sectionLegalGuardian = null;
      }
    },
  },
  computed: {
    ...mapState(useAuthStore, {
      authToken: "token",
    }),
    ...mapState(useConfigStore, {
      selectedEthnicity: "selectedEthnicity",
      tribes: "tribes",
    }),
    ...mapState(useUserStore, {
      userAge: "userAge",
      userCitizenCountry: "citizenCountry",
      userVisaCode: "visaCode",
      userType: "userType",
    }),
    ...mapState(useUgApplicationStore, {
      pagePayload: "azResidencyPayload",
      allUsStates: "allUsStates",
      militaryaffiliations: "militaryaffiliations",
      highSchools: "highSchools",
      applicationCurrentScreen: "currentScreen",
      applicationPreviousScreen: "previousScreen",
      applicationIsEligibleForProp308: "isEligibleForProp308",
    }),
    ...mapState(useAppStore, {
      apisCount: "apisCount",
    }),
    isSectionMarriedVisible() {
      return (
        (this.isAZResident && this.isOlderThan18) ||
        this.hasSpousalFinancialSupport
      );
    },
    hasSpousalFinancialSupport() {
      return !!(
        this.form.sectionFinancialSupport?.inputSpouseSupport &&
        parseInt(this.form.sectionFinancialSupport?.inputSpouseSupport) > 0
      );
    },
    isValidResident() {
      return (
        AcceptedVisaTypes.some((item) => item.value === this.userVisaCode) ||
        this.userCitizenCountry === EnumAzResidency.usCountryCode
      );
    },
    isNativeAmerican() {
      return this.selectedEthnicity.some((ethnicity) =>
        this.tribes.some(
          (tribe) => ethnicity.culturalOriginCode === tribe.culturalOriginCode
        )
      );
    },
    isAZResident() {
      return (
        this.form.sectionDomicile?.permanentHome?.value ===
        EnumNameTypes.AzStateCode
      );
    },
    getGraduationSchool() {
      const recentGraduatedSchool = this.highSchools.filter(
        (item) => item.gradYear && item.gradMonth
      );
      return recentGraduatedSchool;
    },
    hasStudiedInAz() {
      const recentGraduatedSchool = this.getGraduationSchool;
      if (recentGraduatedSchool && recentGraduatedSchool.length > 0) {
        return recentGraduatedSchool.some(
          (item) => item.state === EnumNameTypes.AzStateCode
        );
      } else {
        return false;
      }
    },
    isActiveMilitary() {
      return (
        this.militaryaffiliations.status === EnumAzResidency.statusActiveDuty ||
        this.militaryaffiliations.status ===
          EnumAzResidency.statusArmedForces ||
        this.militaryaffiliations.status === EnumAzResidency.statusNationalGuard
      );
    },
    isVeteran() {
      return this.militaryaffiliations.status === EnumAzResidency.statusVeteran;
    },
    isMilitaryDependent() {
      return (
        this.militaryaffiliations.status ===
        EnumAzResidency.spouseOrDependentValue
      );
    },
    isOlderThan24() {
      return this.userAge > 24;
    },
    isYoungerThan24() {
      return this.userAge <= 24;
    },
    isOlderThan18() {
      return this.userAge >= 18;
    },
    isYoungerThan18() {
      return this.userAge < 18;
    },
    isDisplayEmploymentSection() {
      return (
        (this.isAZResident || this.hasStudiedInAz) &&
        (this.form?.sectionFinancialSupport?.inputEmploymentSupport > 0 ||
          this.isOlderThan18)
      );
    },
    isLegalGuardianSectionVisible() {
      return (
        !this.isOlderThan24 ||
        this.form?.sectionFinancialSupport?.inputParentOrGuardianSupport > 0
      );
    },
    isAZResidentOrStudiedInUs() {
      return this.isValidResident && (this.isAZResident || this.hasStudiedInAz);
    },
    isSectionMDVoteAndMDDriverLicenseRequired() {
      return (
        this.isValidResident &&
        this.isMilitaryDependent &&
        this.form.sectionMilitaryDependency?.selectSectorOfMilitary?.value ===
          "veteran"
      );
    },
    isDisplayDependentTaxSection() {
      return this.isYoungerThan24 && this.isAZResidentOrStudiedInUs;
    },
  },
  async created() {
    let isSubmissionHasError = false;
    this.footerSubmitActionListenner = useUgApplicationStore().$onAction(
      async ({ name }) => {
        if (name === "submitForm") {
          this.handleSectionValidation();
          try {
            if (this.$v.$invalid) {
              this.scrollToErrorInput();
              return;
            }

            this.$track({
              event: "form",
              action: "click",
              name: "onclick",
              type: "click",
              region: "footer",
              section: "primary footer",
              text: "save",
              current_screen: EnumPageNames.PageUndergradArizonaResidency,
              previous_screen: EnumPageNames.PageUndergradMyHighSchoolGrades,
            });
            // Calculating the total number of API's that will be called during the submit
            this.updateCancelApiCallsStatus(true);
            // Note: All the functions or stores actions which contains an API call is called here
            // to get the total count of the API calls that will be happening during the submit
            if (this.isValidResident || this.applicationIsEligibleForProp308) {
              await this.submitForm({
                token: this.authToken,
                appId: this.$route.params.id,
                formData: this.form,
              });
            }
            await this.createNotification();
            await this.updateUiViewInfo();
            this.updateCancelApiCallsStatus(false);
            this.updateProgressBarLoaderTotalRequests(this.apisCount);
            this.resetApiCallsCount();

            let response = { code: 201 };
            // if the user is eligible to fill the details submitting the form else skipping the form submit
            // step-1: submit arizona residency record
            if (this.isValidResident || this.applicationIsEligibleForProp308) {
              response = await this.submitForm({
                token: this.authToken,
                appId: this.$route.params.id,
                formData: this.form,
              });
            }
            this.applicationUpdateCurrentPageUnsavedChanges(false);
            if (response.code === 201) {
              // step-2: update ui-view-info record
              const uiViewInfoResponse = await this.updateUiViewInfo();
              if (uiViewInfoResponse.code === 201) {
                this.$track({
                  event: "form",
                  action: "submit",
                  name: "onsubmit",
                  type: "submit",
                  region: "footer",
                  section: "primary footer",
                  text: "save",
                  current_screen: EnumPageNames.PageUndergradReview,
                  previous_screen: EnumPageNames.PageUndergradArizonaResidency,
                });
                this.$router.push({
                  name: this.applicationCurrentScreen,
                  params: { id: this.$route.params.id },
                });
              } else {
                isSubmissionHasError = true;
                // fire error data layer event
                this.triggerErrorGtm(
                  uiViewInfoResponse.code,
                  uiViewInfoResponse.errors
                );
              }
              // step-3: notification for edplus-salesforce
              const notificationResponse = await this.createNotification();
              if (notificationResponse.code !== 200) {
                // fire error data layer event
                this.triggerErrorGtm(
                  notificationResponse.code,
                  notificationResponse.errors
                );
              }
            } else {
              this.alert.type = "error";
              this.alert.text = response?.errors[0];
              this.alert.show = true;
              isSubmissionHasError = true;
              // fire error data layer event
              this.triggerErrorGtm(response.code, response.errors);
            }
          } catch (error) {
            console.log(error);
            this.alert.type = "error";
            this.alert.text = "Something went wrong";
            this.alert.show = true;
            isSubmissionHasError = true;
          }
          if (isSubmissionHasError) {
            this.$router.push({ name: EnumPageNames.PageError });
          }
        }
      }
    );
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
  methods: {
    ...mapActions(useUgApplicationStore, {
      submitForm: "addApplicationResidencyAnswers",
      applicationPatchUiViewInfo: "patchUiViewInfo",
      applicationUpdateCurrentPageUnsavedChanges:
        "updateCurrentPageUnsavedChanges",
      applicationUpdateCurrentPageStatus: "updateCurrentPageStatus",
      applicationCreateNotification: "createNotification",
    }),
    ...mapActions(useAppStore, {
      updateCancelApiCallsStatus: "updateCancelApiCallsStatus",
      resetProgressBarRequests: "resetProgressBarRequests",
      updateProgressBarLoaderTotalRequests:
        "updateProgressBarLoaderTotalRequests",
      resetApiCallsCount: "resetApiCallsCount",
    }),
    handleSectionValidation() {
      this.$v.$touch();
      this.isSubmitted = true;
      setTimeout(() => {
        this.isSubmitted = false;
      }, 2000);
    },
    async createNotification() {
      return await this.applicationCreateNotification(
        this.authToken,
        this.$route.params.id,
        EnumApiConstants.SalesforceEdPlus,
        {
          googleClientId: extractGoogleClientId(),
        }
      );
    },
    async updateUiViewInfo() {
      const payload = {
        appId: this.$route.params.id,
        currentScreen: EnumPageNames.PageUndergradReview,
        previousScreen: EnumPageNames.PageUndergradArizonaResidency,
      };
      return await this.applicationPatchUiViewInfo(
        this.authToken,
        this.$route.params.id,
        payload
      );
    },
    scrollToErrorInput() {
      this.$nextTick(() => {
        const errorInputs = document.getElementsByClassName("is-invalid");
        if (errorInputs.length > 0) {
          errorInputs[0].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    },
    handleDomicileValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionDomicileValid.$model = value;
      });
    },
    handleEnrollmentValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionEnrollmentValid.$model = value;
      });
    },
    handleDependencyValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionDependencyValid.$model = value;
      });
    },
    handleDriverLicenseValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionDriverLicenseValid.$model = value;
      });
    },
    handleVehicleValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionVehicleValid.$model = value;
      });
    },
    handleTaxesValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionTaxesValid.$model = value;
      });
    },
    handleEmploymentValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionEmploymentValid.$model = value;
      });
    },
    handleMilitaryActiveDutyValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionMilitaryActiveDutyValid.$model = value;
      });
    },
    handleMilitaryDependencyValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionMilitaryDependencyValid.$model = value;
      });
    },
    handleVeteranValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionVeteranValid.$model = value;
      });
    },
    handleNativeAmericanValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionNativeAmericanValid.$model = value;
      });
    },
    handleLegalGuardianValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionLegalGuardianValid.$model = value;
      });
    },
    handleMarriedValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionMarriedValid.$model = value;
      });
    },
    handleFinancialSupportValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionFinancialSupportValid.$model = value;
      });
    },
    handleMVoteValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionMVoteValid.$model = value;
      });
    },
    handleMDriverLicenseValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionMDriverLicenseValid.$model = value;
      });
    },
    handleMDVoteValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionMDVoteValid.$model = value;
      });
    },
    handleMDDriverLicenseValidation(value) {
      this.$nextTick(() => {
        this.$v.isSectionMDDriverLicenseValid.$model = value;
      });
    },
    handleProp308Validation(value) {
      this.$nextTick(() => {
        this.$v.isSectionProp308Valid.$model = value;
      });
    },
    triggerErrorGtm(code, errors) {
      this.$track({
        event: "app_error",
        action: "arizona_residency",
        location: this.$router.currentRoute.fullPath,
        code: code,
        message: errors.toString(),
      });
    },
  },
  validations: {
    isSectionDomicileValid: {
      required: requiredIf(function () {
        return this.isValidResident;
      }),
      hasError: function (value) {
        return !this.isValidResident || !value;
      },
    },
    isSectionEnrollmentValid: {
      required: requiredIf(function () {
        return this.isAZResidentOrStudiedInUs;
      }),
      hasError: function (value) {
        return !this.isAZResidentOrStudiedInUs || !value;
      },
    },
    isSectionDependencyValid: {
      required: requiredIf(function () {
        return this.isDisplayDependentTaxSection;
      }),
      hasError: function (value) {
        return !this.isDisplayDependentTaxSection || !value;
      },
    },
    isSectionDriverLicenseValid: {
      required: requiredIf(function () {
        return this.isAZResidentOrStudiedInUs;
      }),
      hasError: function (value) {
        return !this.isAZResidentOrStudiedInUs || !value;
      },
    },
    isSectionVehicleValid: {
      required: requiredIf(function () {
        return this.isAZResidentOrStudiedInUs;
      }),
      hasError: function (value) {
        return !this.isAZResidentOrStudiedInUs || !value;
      },
    },
    isSectionTaxesValid: {
      required: requiredIf(function () {
        return this.isAZResidentOrStudiedInUs;
      }),
      hasError: function (value) {
        return !this.isAZResidentOrStudiedInUs || !value;
      },
    },
    isSectionFinancialSupportValid: {
      required: requiredIf(function () {
        return this.isAZResidentOrStudiedInUs;
      }),
      hasError: function (value) {
        return !this.isAZResidentOrStudiedInUs || !value;
      },
    },
    isSectionEmploymentValid: {
      required: requiredIf(function () {
        return this.isDisplayEmploymentSection;
      }),
      hasError: function (value) {
        return !this.isDisplayEmploymentSection || !value;
      },
    },
    isSectionMilitaryActiveDutyValid: {
      required: requiredIf(function () {
        return this.isValidResident && this.isActiveMilitary;
      }),
      hasError: function (value) {
        return !(this.isValidResident && this.isActiveMilitary) || !value;
      },
    },
    isSectionVeteranValid: {
      required: requiredIf(function () {
        return this.isValidResident && this.isVeteran;
      }),
      hasError: function (value) {
        return !(this.isValidResident && this.isVeteran) || !value;
      },
    },
    isSectionMVoteValid: {
      required: requiredIf(function () {
        return this.isValidResident && this.isVeteran;
      }),
      hasError: function (value) {
        return !(this.isValidResident && this.isVeteran) || !value;
      },
    },
    isSectionMDriverLicenseValid: {
      required: requiredIf(function () {
        return this.isVeteran && !this.isAZResidentOrStudiedInUs;
      }),
      hasError: function (value) {
        return !(this.isVeteran && !this.isAZResidentOrStudiedInUs) || !value;
      },
    },
    isSectionMilitaryDependencyValid: {
      required: requiredIf(function () {
        return this.isValidResident && this.isMilitaryDependent;
      }),
      hasError: function (value) {
        return !(this.isValidResident && this.isMilitaryDependent) || !value;
      },
    },
    isSectionMDVoteValid: {
      required: requiredIf(function () {
        return this.isSectionMDVoteAndMDDriverLicenseRequired;
      }),
      hasError: function (value) {
        return !this.isSectionMDVoteAndMDDriverLicenseRequired || !value;
      },
    },
    isSectionMDDriverLicenseValid: {
      required: requiredIf(function () {
        return (
          this.isSectionMDVoteAndMDDriverLicenseRequired &&
          !this.isAZResidentOrStudiedInUs
        );
      }),
      hasError: function (value) {
        return (
          !(
            this.isSectionMDVoteAndMDDriverLicenseRequired &&
            !this.isAZResidentOrStudiedInUs
          ) || !value
        );
      },
    },
    isSectionNativeAmericanValid: {
      required: requiredIf(function () {
        return this.isValidResident && this.isNativeAmerican;
      }),
      hasError: function (value) {
        return !(this.isValidResident && this.isNativeAmerican) || !value;
      },
    },
    isSectionLegalGuardianValid: {
      required: requiredIf(function () {
        return this.isValidResident && this.isLegalGuardianSectionVisible;
      }),
      hasError: function (value) {
        return (
          !(this.isValidResident && this.isLegalGuardianSectionVisible) ||
          !value
        );
      },
    },
    isSectionMarriedValid: {
      required: requiredIf(function () {
        return (
          (this.isAZResident && this.isOlderThan18) ||
          this.hasSpousalFinancialSupport
        );
      }),
      hasError: function (value) {
        return (
          !(
            (this.isAZResident && this.isOlderThan18) ||
            this.hasSpousalFinancialSupport
          ) || !value
        );
      },
    },
    isSectionProp308Valid: {
      required: requiredIf(function () {
        return this.applicationIsEligibleForProp308;
      }),
      hasError: function (value) {
        return !this.applicationIsEligibleForProp308 || !value;
      },
    },
  },
  destroyed() {
    this.footerSubmitActionListenner();
  },
  async mounted() {
    // if userthpe is admin and my information page is not submitted redirecting them to my info page
    let appId = this.$route.params.id;
    if (
      this.userType === EnumNameTypes.UserTypeAdmin &&
      !this.userCitizenCountry
    ) {
      const payload = {
        appId: appId,
        currentScreen: EnumPageNames.PageUndergradMyInformation,
        previousScreen: EnumPageNames.PageUndergradReview,
      };
      await this.applicationPatchUiViewInfo(this.authToken, appId, payload);
      this.$router.push({
        name: this.applicationCurrentScreen,
        params: { id: appId },
      });
    }
  },
};
</script>

<style scoped>
.arizona-residency {
  border-radius: 19px;
}
</style>

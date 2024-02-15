<template>
  <main id="main-content" data-cy="my-schools-view">
    <div class="bg-light-1 px-space-xxs pt-space-sm">
      <div
        class="my-schools container bg-white pt-space-md pb-space-xxl px-space-sm p-lg-space-xl"
      >
        <!-- section heading and eta -->
        <section data-cy="my-schools-heading-and-cta">
          <div class="row">
            <div class="col-12">
              <h1 class="h1-medium">
                <span class="bg-secondary">{{ pageData.title }}</span>
              </h1>
              <p class="text-medium text-lg-large text-dark-1 m-0 pt-space-xxs">
                <font-awesome-icon
                  icon="fa-sharp fa-solid fa-clock"
                  class="fa-lg"
                />
                <span v-html="pageData.eta"></span>
              </p>
            </div>
          </div>
        </section>
        <!-- END -->
        <template v-if="form.schools">
          <hr class="mt-space-sm mb-space-md mt-space-md mb-lg-space-lg" />
          <!-- Most recent school -->
          <section
            id="recent_high_school"
            data-cy="my-schools-most-recent-school"
          >
            <section-high-schools
              :compData="pageData.school"
              v-model="form.schools"
              :isFormSubmitClicked="formSubmitClicked"
              @updateErrorState="handleHighSchoolErrorState"
            ></section-high-schools>
          </section>
        </template>
        <!-- END -->
        <hr class="mt-space-sm mb-space-md mt-space-md mb-lg-space-lg" />
        <!-- Colleges and universities -->
        <template v-if="form.college.institutions">
          <section
            id="colleges_universities"
            data-cy="my-schools-college-and-universities"
          >
            <section-college-and-universities
              :compData="pageData.college"
              v-model="form.college"
              :isFutureGraduate="isFutureGraduate"
              :isFormSubmitClicked="formSubmitClicked"
              @updateErrorState="handleCollegeErrorState"
            ></section-college-and-universities>
          </section>
        </template>

        <!-- END -->
        <template
          v-if="
            form.college.attendedCollege &&
            form.college.attendedCollege.value ===
              MySchoolsConstants.attendedCollegeYes
          "
        >
          <hr class="mt-space-sm mb-space-md mt-space-md mb-lg-space-lg" />

          <!-- Eligibility to return to colleges -->
          <section
            id="eiligibility_to_college"
            data-cy="my-schools-eligibility-to-return-to-colleges"
          >
            <div class="row">
              <!-- Is eligible to return to college -->
              <div class="col-12 col-lg-10">
                <b-form-group
                  data-cy="my-schools-is-eligible-to-return-to-colleges"
                  id="group_eiligibility_to_college"
                  :aria-label="pageData.eligibilityToReturn.label"
                  label-class="pb-0"
                  class="mb-0 position-relative"
                >
                  <template #label>
                    <label
                      for="eiligibility_to_college_radio"
                      class="mb-space-md"
                    >
                      <h3 class="h3-large">
                        {{ pageData.eligibilityToReturn.label }}
                      </h3>
                      <p class="mt-space-sm mb-0 col-lg-10 px-0">
                        {{ pageData.eligibilityToReturn.text }}
                      </p>
                    </label>
                  </template>
                  <base-radio-group
                    name="eiligibility_to_college_radio"
                    :options="pageData.eligibilityToReturn.options"
                    v-model="$v.form.iseligibleToReturnToColleges.$model"
                    aria-describedby="input-live-help input-live-feedback"
                    :class="{
                      'is-invalid':
                        $v.form.iseligibleToReturnToColleges.$dirty &&
                        $v.form.iseligibleToReturnToColleges.$error,
                    }"
                    @change="handleEligibleToReturnToCollegesChange"
                  >
                  </base-radio-group>
                  <b-form-invalid-feedback
                    v-if="!$v.form.iseligibleToReturnToColleges.required"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    This is a required field.
                  </b-form-invalid-feedback>
                </b-form-group>
              </div>
              <!-- ineligible college or universities details -->
              <template
                v-if="
                  form.iseligibleToReturnToColleges?.value ===
                  MySchoolsConstants.eligibleToReturnCollegeNo
                "
              >
                <section-previous-college-eligibility
                  :compData="pageData.eligibilityToReturn.first"
                  v-model="form.ineligibleToReturnCollege.first"
                  :isFormSubmitClicked="formSubmitClicked"
                  name="first"
                  @updateErrorState="handleReturnToCollegeErrorState"
                ></section-previous-college-eligibility>

                <!-- second object ineligible college or universities details -->
                <section-previous-college-eligibility
                  class="mt-space-sm"
                  v-if="!isReturnToCollegeComponentHasError"
                  :compData="pageData.eligibilityToReturn.second"
                  v-model="form.ineligibleToReturnCollege.second"
                  name="second"
                  :isFieldsRequired="false"
                  :isFormSubmitClicked="formSubmitClicked"
                  @updateErrorState="handleReturnToCollegeErrorStateTwo"
                ></section-previous-college-eligibility>
              </template>
            </div>
          </section>
          <!-- END -->
        </template>
        <hr class="mt-space-sm mb-space-md mt-space-md mb-lg-space-lg" />
        <!-- Transcript policy -->
        <section id="transcript_policy" data-cy="my-schools-transcript-policy">
          <div class="row">
            <div class="col-12">
              <h3 class="h3-large mb-space-sm">
                {{ pageData.transcriptPolicy.title }}
              </h3>
              <p class="mb-space-sm">{{ pageData.transcriptPolicy.text }}</p>
              <a
                id="transcript_guide"
                href="javascript:void(0)"
                class="text-primary font-weight-bold text-underline"
                @click="handleTranscriptGuideClick"
              >
                {{ pageData.transcriptPolicy.subText }}
              </a>
              <!-- transcript policy acknowledgement -->
              <b-form-group
                data-cy="transcript-policy-acknowledgement"
                id="group_policy_acknowledgement"
                :aria-label="pageData.transcriptPolicy.acknowledgement"
                label-class="pb-0"
                class="twox-checkbox mb-0 mt-space-xs mt-lg-space-sm position-relative"
              >
                <b-form-checkbox
                  id="policy_acknowledgement"
                  v-model="$v.form.transcriptPolicyAcknowledge.$model"
                  name="policy_acknowledgement_checkbox"
                  value="Yes"
                  :unchecked-value="null"
                  :state="
                    $v.form.transcriptPolicyAcknowledge.$dirty &&
                    $v.form.transcriptPolicyAcknowledge.$error
                      ? false
                      : null
                  "
                  class="text-large font-weight-bold"
                  aria-describedby="input-live-help input-live-feedback"
                >
                  {{ pageData.transcriptPolicy.acknowledgement }}
                </b-form-checkbox>
                <b-form-invalid-feedback
                  :force-show="
                    $v.form.transcriptPolicyAcknowledge.$dirty &&
                    $v.form.transcriptPolicyAcknowledge.$error
                  "
                  class="mt-space-xxs"
                >
                  <font-awesome-icon
                    icon="fa-sharp fa-regular fa-circle-exclamation"
                    size="xs"
                  />
                  This is a required field.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        </section>
        <!-- END -->

        <!-- sidebar for transcripts guide -->
        <b-sidebar
          visible
          id="transcripts_guide_sidebar"
          v-model="showSidebar"
          right
          bg-variant="white"
          no-header
          backdrop-variant="dark-2"
          backdrop
          shadow
          @hidden="sidebarClosed"
        >
          <template #default="{ hide }">
            <div data-cy="transcript-guide-sidebar">
              <div class="bg-white p-space-sm">
                <button
                  @click="hide"
                  id="back_button"
                  class="btn bg-white rounded-0 text-medium border-0 p-0"
                >
                  <span>
                    <font-awesome-icon
                      icon="fa-arrow-left"
                      class="mr-space-xxs"
                    ></font-awesome-icon
                    >Back</span
                  >
                </button>
              </div>
              <div class="p-space-sm px-lg-space-xl pb-lg-space-xl">
                <img
                  :src="images[sidebarData.image]"
                  alt="sidebar image"
                  class="img-fluid mb-space-xs mb-lg-space-sm"
                />
                <h2 class="h2-medium" id="sidebar_title">
                  {{ sidebarData.title }}
                </h2>
                <hr
                  class="mt-space-xs mb-lg-space-md mt-lg-space-sm mb-space-lg"
                />
                <template v-for="item in sidebarData.items">
                  <div :key="item.title">
                    <h3 class="h3-large mb-space-xs">
                      {{ item.title }}
                    </h3>
                    <p class="mb-space-md mb-lg-space-lg">{{ item.text }}</p>
                  </div>
                </template>
                <span class="text-muted text-xs">{{
                  sidebarData.additionalTip
                }}</span>
              </div>
            </div>
          </template>
        </b-sidebar>
        <!-- END -->
      </div>
    </div>
  </main>
</template>

<script>
import {
  required,
  requiredIf,
  numeric,
  minLength,
} from "vuelidate/lib/validators";
import {
  BFormGroup,
  BFormInvalidFeedback,
  BFormCheckbox,
  BSidebar,
  VBTooltip,
} from "bootstrap-vue";
import * as _ from "lodash";
import pageData from "@/content/my-schools.json";
import { EnumPageNames, EnumApiConstants } from "@/content/enum-app.js";
import { MySchoolsConstants } from "@/content/enum-ug-application.js";
import MonthOptions from "@/content/months.json";
import { validationMixin } from "vuelidate";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import transcriptImg from "@/assets/img/certificate.svg";
import SectionPreviousCollegeEligibility from "@/components/ugapp-components/my-schools/SectionPreviousCollegeEligibility.vue";
import SectionHighSchools from "@/components/ugapp-components/my-schools/SectionHighSchools.vue";
import SectionCollegeAndUniversities from "@/components/ugapp-components/my-schools/SectionCollegeAndUniversities.vue";
import { mapActions, mapState } from "pinia";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { useUserStore } from "@/stores/user-store";
import { extractGoogleClientId } from "@/services/UtilityService.js";

export default {
  name: "UgAppMySchoolsView",
  mixins: [validationMixin],
  directives: {
    "b-tooltip": VBTooltip,
  },
  metaInfo() {
    return {
      title: `${this.pageData.title} | Undergraduate Application`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "base-radio-group": BaseRadioGroup,
    "b-form-group": BFormGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-checkbox": BFormCheckbox,
    "b-sidebar": BSidebar,
    "section-high-schools": SectionHighSchools,
    "section-college-and-universities": SectionCollegeAndUniversities,
    "section-previous-college-eligibility": SectionPreviousCollegeEligibility,
  },
  data() {
    return {
      MySchoolsConstants: MySchoolsConstants,
      appId: null,
      formSubmissionError: [],
      pageData: pageData,
      images: {
        transcriptImg,
      },
      monthOptions: [],
      sidebarData: {},
      formSubmitClicked: false,
      showSidebar: false,
      isHighSchoolComponentHasError: false,
      isCollegeComponentHasError: false,
      isReturnToCollegeComponentHasError: false,
      isReturnToCollegeComponentHasErrorTwo: false,
      form: {
        schools: null,
        college: {
          attendedCollege: null,
          totelSemisterCredits: null,
          institutions: null,
        },
        iseligibleToReturnToColleges: null,
        ineligibleToReturnCollege: {
          first: {
            name: null,
            reasons: {
              academicRelated: null,
              studentConduct: null,
              other: null,
              explaination: null,
            },
          },
          second: {
            name: null,
            reasons: {
              academicRelated: null,
              studentConduct: null,
              other: null,
              explaination: null,
            },
          },
        },
        transcriptPolicyAcknowledge: null,
      },
      initialFormData: {},
      isDataBindingComplete: false,
      footerSubmitActionListenner: null,
    };
  },
  validations: {
    isHighSchoolComponentHasError: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
    isCollegeComponentHasError: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
    isReturnToCollegeComponentHasError: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
    isReturnToCollegeComponentHasErrorTwo: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
    form: {
      schools: {
        required,
        minLength: minLength(1),
      },
      college: {
        attendedCollege: { required },
        totelSemisterCredits: {
          required: requiredIf((event) => {
            return (
              event.attendedCollege?.value ===
              MySchoolsConstants.attendedCollegeYes
            );
          }),
          numeric,
        },
        institutions: {
          required: requiredIf((event) => {
            return (
              event.attendedCollege?.value ===
              MySchoolsConstants.attendedCollegeYes
            );
          }),
          minLength: minLength(1),
        },
      },
      iseligibleToReturnToColleges: {
        required: requiredIf((event) => {
          return (
            event.college.attendedCollege?.value ===
            MySchoolsConstants.attendedCollegeYes
          );
        }),
      },
      transcriptPolicyAcknowledge: {
        required,
      },
    },
  },
  watch: {
    $v: {
      handler(newValue) {
        if (
          this.isDataBindingComplete &&
          (!_.isEqual(this.form, this.initialFormData) ||
            (!newValue.form.$anyDirty && newValue.$anyError))
        ) {
          this.applicationUpdateCurrentPageUnsavedChanges(true);
        } else {
          this.applicationUpdateCurrentPageUnsavedChanges(false);
        }
        this.applicationUpdateCurrentPageStatus({
          anyDirty: newValue.$anyDirty,
          anyError: newValue.$anyError,
        });
      },
      deep: true,
    },
    "form.college.attendedCollege": {
      handler(newValue) {
        if (
          !newValue ||
          newValue.value !== MySchoolsConstants.attendedCollegeYes
        ) {
          this.form.iseligibleToReturnToColleges = null;
          this.form.ineligibleToReturnCollege = {
            first: {
              name: null,
              reasons: {
                academicRelated: null,
                studentConduct: null,
                other: null,
                explaination: null,
              },
            },
            second: {
              name: null,
              reasons: {
                academicRelated: null,
                studentConduct: null,
                other: null,
                explaination: null,
              },
            },
          };
          this.isReturnToCollegeComponentHasError = false;
          this.isReturnToCollegeComponentHasErrorTwo = false;
        }
      },
      deep: true,
    },
    isReturnToCollegeComponentHasError(newValue) {
      if (newValue && this.isDataBindingComplete) {
        this.form.ineligibleToReturnCollege.second = {
          name: null,
          reasons: {
            academicRelated: null,
            studentConduct: null,
            other: null,
            explaination: null,
          },
        };
        this.isReturnToCollegeComponentHasErrorTwo = false;
      }
    },
  },
  computed: {
    ...mapState(useUgApplicationStore, {
      applicationMySchoolsSar: "mySchoolsSar",
      applicationOtherInstitutions: "otherInstitutions",
      applicationHighSchools: "highSchools",
      applicationCurrentScreen: "currentScreen",
      applicationPreviousScreen: "previousScreen",
      applicationInstitutionStatus: "institutionStatus",
      applicationformerNames: "formerNames",
    }),
    ...mapState(useConfigStore, {
      configHighSchoolCountries: "highSchoolCountries",
      configHighSchoolStates: "highSchoolStates",
      configUsStateCities: "usStateCities",
      configUsaHighSchools: "usaHighSchools",
      configInstitutionCountries: "institutionCountries",
      configInstitutionStates: "institutionStates",
      configInstitutions: "institutions",
    }),
    ...mapState(useUserStore, {
      userLegalName: "legalName",
    }),
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useAppStore, {
      apisCount: "apisCount",
    }),
    yearOptions() {
      const currentDate = new Date();
      const dateCopy = new Date(currentDate);
      dateCopy.setFullYear(currentDate.getFullYear() - 100);

      var options = [];
      for (
        var i = dateCopy.getFullYear();
        i < currentDate.getFullYear() + 10;
        i++
      ) {
        options.push({ text: `${i}`, value: i });
      }

      return options.sort((a, b) =>
        a.value > b.value ? -1 : b.value > a.value ? 1 : 0
      );
    },
    isFutureGraduate() {
      let graduateSchool = [];
      if (this.form.schools) {
        graduateSchool = this.form.schools
          .slice()
          .filter(
            (item) => item.graduationDate.month && item.graduationDate.year
          );
      }
      if (graduateSchool.length > 0) {
        const currentDate = new Date();
        const month = parseInt(graduateSchool[0].graduationDate.month?.value);
        const year = parseInt(graduateSchool[0].graduationDate.year?.value);
        return (
          year > currentDate.getFullYear() ||
          (year === currentDate.getFullYear() && month > currentDate.getMonth())
        );
      }
      return false;
    },
  },
  methods: {
    ...mapActions(useUgApplicationStore, {
      applicationSubmitMySchools: "submitMySchools",
      applicationPatchUiViewInfo: "patchUiViewInfo",
      applicationUpdateCurrentPageUnsavedChanges:
        "updateCurrentPageUnsavedChanges",
      applicationUpdateCurrentPageStatus: "updateCurrentPageStatus",
      applicationCreateNotification: "createNotification",
    }),
    ...mapActions(useConfigStore, {
      configSelectHighSchoolCountry: "selectHighSchoolCountry",
      configDeselectHighSchoolCountry: "deselectHighSchoolCountry",
      configPopulateHighSchoolStates: "populateHighSchoolStates",
      configPopulateUsaHighSchools: "populateUsaHighSchools",
      configSelectInstitutionCountry: "selectInstitutionCountry",
      configDeselectInstitutionCountry: "deselectInstitutionCountry",
      configPopulateInstitutionStates: "populateInstitutionStates",
      configPopulateInstitutions: "populateInstitutions",
    }),
    ...mapActions(useAppStore, {
      updateCancelApiCallsStatus: "updateCancelApiCallsStatus",
      resetProgressBarRequests: "resetProgressBarRequests",
      updateProgressBarLoaderTotalRequests:
        "updateProgressBarLoaderTotalRequests",
      resetApiCallsCount: "resetApiCallsCount",
    }),
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
    async handleSaveClick() {
      this.$v.$touch();

      this.formSubmitClicked = true;
      if (this.$v.$anyError) {
        this.scrollToErrorInput();
        setTimeout(() => {
          // resetting to listen for the next click
          this.formSubmitClicked = false;
        }, 2000);
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
        current_screen: EnumPageNames.PageUndergradMySchools,
        previous_screen: EnumPageNames.PageUndergradMyProgram,
      });

      // Calculating the total number of API's that will be called during the submit
      this.updateCancelApiCallsStatus(true);
      // Note: All the functions or stores actions which contains an API call is called here
      // to get the total count of the API calls that will be happening during the submit
      await this.applicationSubmitMySchools(
        this.authToken,
        this.appId,
        this.form
      );
      await this.createNotification();
      await this.updateUiViewInfo();
      this.updateCancelApiCallsStatus(false);
      this.updateProgressBarLoaderTotalRequests(this.apisCount);
      this.resetApiCallsCount();

      // step-1: submit my schools record
      const formResponses = await this.applicationSubmitMySchools(
        this.authToken,
        this.appId,
        this.form
      );
      let hasError = false;
      formResponses.forEach((error) => {
        if (
          error.status === "rejected" ||
          (error.value.code !== 200 && error.value.code !== 201)
        ) {
          hasError = true;
          // fire error data layer event
          this.triggerErrorGtm(error.value?.code, error.value?.errors);
        }
      });
      this.applicationUpdateCurrentPageUnsavedChanges(false);
      if (hasError) {
        this.$router.push({ name: EnumPageNames.PageError });
      } else {
        // step-2: notification for edplus-salesforce
        const notificationResponse = await this.createNotification();
        if (notificationResponse.code !== 200) {
          // fire error data layer event;
          this.triggerErrorGtm(
            notificationResponse.code,
            notificationResponse.errors
          );
        }
        // step-3: update ui-view-info record
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
            current_screen: this.applicationCurrentScreen,
            previous_screen: this.applicationPreviousScreen,
          });
          this.$router.push({
            name: this.applicationCurrentScreen,
            params: { id: this.appId },
          });
        } else {
          this.triggerErrorGtm(
            uiViewInfoResponse.code,
            uiViewInfoResponse.errors
          );
          this.$router.push({ name: EnumPageNames.PageError });
        }
      }
    },
    async createNotification() {
      return await this.applicationCreateNotification(
        this.authToken,
        this.appId,
        EnumApiConstants.SalesforceEdPlus,
        {
          googleClientId: extractGoogleClientId(),
        }
      );
    },
    async updateUiViewInfo() {
      const payload = {
        appId: this.appId,
        currentScreen:
          this.applicationPreviousScreen === EnumPageNames.PageUndergradReview
            ? EnumPageNames.PageUndergradReview
            : EnumPageNames.PageUndergradMyHighSchoolGrades,
        previousScreen:
          this.applicationPreviousScreen === EnumPageNames.PageUndergradReview
            ? EnumPageNames.PageUndergradArizonaResidency
            : EnumPageNames.PageUndergradMySchools,
      };
      return await this.applicationPatchUiViewInfo(
        this.authToken,
        this.appId,
        payload
      );
    },
    handleHighSchoolErrorState(value) {
      this.$v.isHighSchoolComponentHasError.$model = value;
    },
    handleCollegeErrorState(value) {
      this.$v.isCollegeComponentHasError.$model = value;
    },
    handleReturnToCollegeErrorState(value) {
      this.$v.isReturnToCollegeComponentHasError.$model = value;
    },
    handleReturnToCollegeErrorStateTwo(value) {
      this.$v.isReturnToCollegeComponentHasErrorTwo.$model = value;
    },
    handleTranscriptGuideClick() {
      this.$track({
        event: "modal",
        action: "open",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "transcript policy",
        text: "which transcripts do i need to send?",
      });
      Object.assign(
        this.sidebarData,
        this.pageData.transcriptPolicy.transcriptRequirements
      );
      this.showSidebar = true;
    },
    handleEligibleToReturnToCollegesChange(event) {
      if (event.value === MySchoolsConstants.eligibleToReturnCollegeYes) {
        this.form.ineligibleToReturnCollege = {
          first: {
            name: null,
            reasons: {
              academicRelated: null,
              studentConduct: null,
              other: null,
              explaination: null,
            },
          },
          second: {
            name: null,
            reasons: {
              academicRelated: null,
              studentConduct: null,
              other: null,
              explaination: null,
            },
          },
        };
        this.isReturnToCollegeComponentHasError = false;
        this.isReturnToCollegeComponentHasErrorTwo = false;
      }
    },
    sidebarClosed() {
      this.$track({
        event: "modal",
        action: "close",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "transcript policy",
        text: "back",
      });
    },
    getUsCityOptions(stateCode) {
      let cityOptions = [];

      const city = this.configUsStateCities.filter(
        (item) => item.stateCode === stateCode
      );
      if (city.length > 0) {
        cityOptions = city[0].cities.map((item) => {
          return {
            text: item,
            value: item,
          };
        });
      }
      return cityOptions.length > 0 ? cityOptions : [];
    },

    getMonthAndYearOptionBasedOnValue(month, year) {
      const monthOption = this.monthOptions.filter(
        (item) => parseInt(item.value) === parseInt(month)
      );
      const yearOption = this.yearOptions.filter((item) => item.text === year);
      return {
        month: monthOption.length > 0 ? monthOption[0] : null,
        year: yearOption.length > 0 ? yearOption[0] : null,
      };
    },

    updatSarQuestionsWithState() {
      //transcriptPolicyAcknowledge
      if (this.applicationHighSchools.length > 0) {
        this.form.transcriptPolicyAcknowledge =
          MySchoolsConstants.transcriptAcknowledge;
      }
      // attendedCollege
      if (this.applicationMySchoolsSar.college.attendedCollege) {
        const option = this.pageData.college.attendedCollege.options.filter(
          (item) =>
            item.value === this.applicationMySchoolsSar.college.attendedCollege
        );
        if (option.length > 0) {
          this.form.college.attendedCollege = option[0];
        }
      }
      // college  total semister credits
      this.form.college.totelSemisterCredits =
        this.applicationMySchoolsSar.college.totelSemisterCredits;

      // is eligible to return to college
      if (this.applicationMySchoolsSar.iseligibleToReturnToColleges) {
        const option = this.pageData.eligibilityToReturn.options.filter(
          (item) =>
            item.value ===
            this.applicationMySchoolsSar.iseligibleToReturnToColleges
        );
        if (option.length > 0) {
          this.form.iseligibleToReturnToColleges = option[0];
        }
      }
      // ineligibleToReturnCollege
      Object.keys(this.form.ineligibleToReturnCollege).forEach((key) => {
        // name
        this.form.ineligibleToReturnCollege[key].name =
          this.applicationMySchoolsSar.ineligibleToReturnCollege[key].name;

        // reasons
        if (
          this.applicationMySchoolsSar.ineligibleToReturnCollege[key].reasons
            .academicRelated
        ) {
          const option = this.pageData.eligibilityToReturn[
            key
          ].reasons.academicRelated.options.filter(
            (item) =>
              item.value ===
              this.applicationMySchoolsSar.ineligibleToReturnCollege[key]
                .reasons.academicRelated
          );
          if (option.length > 0) {
            this.form.ineligibleToReturnCollege[key].reasons.academicRelated =
              option[0];
          }
        }
        // student conduct
        if (
          this.applicationMySchoolsSar.ineligibleToReturnCollege[key].reasons
            .studentConduct
        ) {
          const option = this.pageData.eligibilityToReturn[
            key
          ].reasons.studentConduct.options.filter(
            (item) =>
              item.value ===
              this.applicationMySchoolsSar.ineligibleToReturnCollege[key]
                .reasons.studentConduct
          );
          if (option.length > 0) {
            this.form.ineligibleToReturnCollege[key].reasons.studentConduct =
              option[0];
          }
        }
        // other
        if (
          this.applicationMySchoolsSar.ineligibleToReturnCollege[key].reasons
            .other
        ) {
          const option = this.pageData.eligibilityToReturn[
            key
          ].reasons.other.options.filter(
            (item) =>
              item.value ===
              this.applicationMySchoolsSar.ineligibleToReturnCollege[key]
                .reasons.other
          );
          if (option.length > 0) {
            this.form.ineligibleToReturnCollege[key].reasons.other = option[0];
          }
        }
        // explaination
        this.form.ineligibleToReturnCollege[key].reasons.explaination =
          this.applicationMySchoolsSar.ineligibleToReturnCollege[
            key
          ].reasons.explaination;
      });
    },
    async updateHighSchoolWithState() {
      const highschools = [];
      await Promise.all(
        this.applicationHighSchools.map(async (school) => {
          let data = {
            highSchoolId: school.highSchoolId,
            country: null,
            state: null,
            sais: school.sais,
            city: null,
            highSchool: null,
            schoolName: null,
            dateFirstAttended: { month: null, year: null },
            dateLastAttended: { month: null, year: null },
            graduationDate: {
              month: null,
              year: null,
            },
            nameOnTranscript: null,
          };
          // country
          const country = this.configHighSchoolCountries.filter(
            (country) => country.countryCode === school.country
          );
          if (country.length > 0) {
            data.country = country[0];
            this.configDeselectHighSchoolCountry();
            this.configSelectHighSchoolCountry(country[0]);
            const response = await this.configPopulateHighSchoolStates();
            if (response.code !== 200) {
              this.triggerErrorGtm(response.code, response.errors);
            }
          }
          // state
          const state = this.configHighSchoolStates.filter(
            (state) => state.stateCode === school.state
          );
          if (state.length > 0) {
            data.state = state[0];
          } else {
            data.state = school.state;
          }
          // city
          if (data.country.countryCode === MySchoolsConstants.usCountryCode) {
            const cityOptions = await this.getUsCityOptions(
              data.state.stateCode
            );
            const option = await cityOptions.filter(
              (city) => city.value === school.city
            );
            if (option.length > 0) {
              data.city = option[0];

              const params = `schoolTypeCode=HS&countryCode=USA&stateCode=${data.state.stateCode}&city=${option[0].value}`;
              const response = await this.configPopulateUsaHighSchools(params);
              if (response.code !== 200) {
                this.triggerErrorGtm(response.code, response.errors);
              }
            }
          } else {
            data.city = school.city;
          }
          // highschool
          if (data.country.countryCode === MySchoolsConstants.usCountryCode) {
            const highSchoolOptions = [
              ...this.configUsaHighSchools,
              ...this.pageData.school.highSchool.options,
            ];
            const option = highSchoolOptions.filter(
              (item) =>
                item.text.slice(0, 30) === school.name &&
                item.value === school.extOrgId
            );
            if (option.length > 0) {
              data.highSchool = option[0];
            } else {
              const notInListOption = highSchoolOptions.filter(
                (item) => item.value === MySchoolsConstants.schoolNotInList
              );
              data.highSchool = notInListOption[0];
              data.schoolName = school.name;
            }
          } else {
            data.schoolName = school.name;
          }

          // dates
          if (school.gradMonth && school.gradYear) {
            data.graduationDate = this.getMonthAndYearOptionBasedOnValue(
              school.gradMonth,
              school.gradYear
            );
          } else {
            data.dateFirstAttended = this.getMonthAndYearOptionBasedOnValue(
              school.startMonth,
              school.startYear
            );
            data.dateLastAttended = this.getMonthAndYearOptionBasedOnValue(
              school.endMonth,
              school.endYear
            );
          }
          const names = [...this.applicationformerNames];
          names.push(this.userLegalName);
          let transcriptName = names.filter(
            (item) => item.id === school.transcriptNameId
          );
          data.nameOnTranscript =
            transcriptName.length > 0 ? transcriptName[0] : null;

          highschools.push(data);
        })
      );
      this.form.schools = highschools;
    },
    async updateInstitutionWithState() {
      // attendedCollege
      const attendedCollege =
        this.pageData.college.attendedCollege.options.filter(
          (item) => item.value === this.applicationInstitutionStatus
        );
      this.form.college.attendedCollege =
        attendedCollege.length > 0 ? attendedCollege[0] : null;
      // institutions
      const institutions = [];
      await Promise.all(
        this.applicationOtherInstitutions.map(async (institute) => {
          let data = {
            otherInstitutionId: institute.otherInstitutionId,
            country: null,
            state: null,
            city: null,
            institute: null,
            customInstituteName: null,
            degreeAwarded: null,
            degreeConcentration: null,
            dateFirstAttended: { month: null, year: null },
            dateLastAttended: { month: null, year: null },
            nameOnTranscript: null,
          };
          // country
          const country = this.configInstitutionCountries.filter(
            (country) => country.countryCode === institute.countryCode
          );
          if (country.length > 0) {
            data.country = country[0];
            this.configDeselectInstitutionCountry();
            this.configSelectInstitutionCountry(country[0]);
            const response = await this.configPopulateInstitutionStates();
            if (response.code !== 200) {
              this.triggerErrorGtm(response.code, response.errors);
            }
          }
          // states
          const state = this.configInstitutionStates.filter(
            (item) => item.stateCode === institute.stateProvince
          );
          if (state.length > 0) {
            data.state = state[0];
          } else {
            data.state = institute.stateProvince;
          }
          // city
          if (data.country.countryCode === MySchoolsConstants.usCountryCode) {
            const cityOptions = this.getUsCityOptions(data.state.stateCode);
            const option = await cityOptions.filter(
              (city) => city.value === institute.city
            );
            if (option.length > 0) {
              data.city = option[0];
            }
          } else {
            data.city = institute.city;
          }
          let params = `schoolTypeCode=Col&schoolTypeCode=UNV&schoolTypeCode=2YR&schoolTypeCode=4YR&schoolTypeCode=VOC&countryCode=${institute.countryCode}&stateCode=${institute.stateProvince}`;

          const response = await this.configPopulateInstitutions(params);
          if (response.code !== 200) {
            this.triggerErrorGtm(response.code, response.errors);
          }
          // institute
          const notListedOption = {
            text: MySchoolsConstants.instituteNotListed,
            value: MySchoolsConstants.instituteNotListed,
          };
          const instituteOption = this.configInstitutions.filter(
            (item) =>
              item.text.slice(0, 50) === institute.name &&
              item.value === institute.extOrgId
          );
          if (instituteOption.length > 0) {
            data.institute = instituteOption[0];
          } else {
            data.institute = notListedOption;
            data.customInstituteName = institute.name;
          }
          // degreeAwarded
          const degreeOption =
            this.pageData.college.institution.degreeAwarded.options.filter(
              (item) => item.value === institute.degreeCode
            );
          if (degreeOption.length > 0) {
            data.degreeAwarded = degreeOption[0];
          }
          // degree concentration
          data.degreeConcentration = institute.concentration;
          // dates
          data.dateFirstAttended = this.getMonthAndYearOptionBasedOnValue(
            institute.firstAttendedMonth,
            institute.firstAttendedYear
          );
          data.dateLastAttended = this.getMonthAndYearOptionBasedOnValue(
            institute.lastAttendedMonth,
            institute.lastAttendedYear
          );
          const names = [...this.applicationformerNames];
          names.push(this.userLegalName);
          let transcriptName = names.filter(
            (item) => item.id === institute.transcriptNameId
          );
          data.nameOnTranscript =
            transcriptName.length > 0 ? transcriptName[0] : null;
          institutions.push(data);
        })
      );
      this.form.college.institutions = institutions;
    },
    triggerErrorGtm(code, errors) {
      this.$track({
        event: "app_error",
        action: "my_schools",
        location: this.$router.currentRoute.fullPath,
        code: code,
        message: errors?.toString(),
      });
    },
  },
  async created() {
    this.footerSubmitActionListenner = useUgApplicationStore().$onAction(
      async ({ name }) => {
        if (name === "submitForm") {
          this.handleSaveClick();
        }
      }
    );
    try {
      this.monthOptions = MonthOptions.sort((a, b) =>
        a.order > b.order ? 1 : b.order > a.order ? -1 : 0
      );
      this.appId = this.$route.params.id;
      const response = await Promise.allSettled([
        this.updateHighSchoolWithState(),
        this.updateInstitutionWithState(),
        this.updatSarQuestionsWithState(),
      ]);
      response.forEach((item) => {
        if (item.status === "fulfilled") {
          this.isDataBindingComplete = true;
        }
      });
    } catch (error) {
      this.$router.push({ name: EnumPageNames.PageError });
    }
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
    this.initialFormData = _.cloneDeep(this.form);
  },
  destroyed() {
    this.footerSubmitActionListenner();
  },
};
</script>

<style lang="scss" scoped>
.my-schools {
  border-radius: 19px;
}
</style>

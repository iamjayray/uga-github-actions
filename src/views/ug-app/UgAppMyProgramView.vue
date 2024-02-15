<template>
  <main id="main-content" data-cy="my-programs-view">
    <div class="bg-light-1 px-space-xxs pt-space-sm">
      <div
        class="my-asu-program container bg-white pt-space-md pb-space-xxl px-space-sm p-lg-space-xl"
      >
        <!-- section heading and eta -->
        <section>
          <div class="row" data-cy="my-programs-heading-cta">
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
              <p class="mt-space-xs mt-lg-space-md text-dark-1 mb-0">
                <span>{{ pageData.subText }} </span>
                <a
                  href="javascript:void(0)"
                  class="font-weight-bold text-underline"
                  @click="handleAcademicCalendarClick"
                  >{{ pageData.academicCalander.label }}</a
                >
              </p>
            </div>
          </div>
        </section>
        <!-- END -->
        <hr class="mt-space-sm mb-space-md mt-lg-space-md mb-lg-space-lg" />

        <base-alert
          v-if="firstMajorAlert.visible"
          alert-type="error"
          :isDismissible="true"
          :text="firstMajorAlert.text"
          class="is-invalid mb-space-lg"
          data-cy="select-first-choice-program-alert"
          @dismissed="handleFirstMajorErrorAlertClose"
        ></base-alert>

        <!-- selected programs -->
        <section-selected-programs
          id="selected_programs"
          :selectedPrograms="programsSelected"
          :isSecondMajorRequired="showBackUpMajorAlert"
          @program-change="handleProgramChangeClick"
        ></section-selected-programs>

        <section-programs
          v-if="isProgramSectionVisible"
          :programsSelected="form.programsSelected"
          @viewProgram="handleViewDetailsClick"
          @chooseProgram="handleChooseProgramClick"
        ></section-programs>
        <!-- RN to BSN program -->
        <section
          v-if="isRnToBsnSectionVisible"
          id="rn_to_bsn_form"
          data-cy="my-programs-rn-to-bsn"
        >
          <section-rn-to-bsn
            :compData="pageData.rnToBsn"
            v-model="form.rnToBsn"
            :isFormSubmitClicked="formSubmitClicked"
            @updateErrorState="handleRnToBsnErrorState"
          ></section-rn-to-bsn>
        </section>

        <!-- Lastly, are you interested in any of the following? -->
        <section
          v-if="!isProgramSectionVisible"
          data-cy="my-programs-other-interests"
        >
          <section-other-interests
            v-model="form.otherInterests"
            :compData="pageData.interestedInAnything"
          ></section-other-interests>
        </section>
        <!-- academic calender sidebar -->
        <b-sidebar
          visible
          id="academic_calendar_sidebar"
          v-model="isAcademicCalenderSidebarVisible"
          right
          bg-variant="white"
          no-header
          backdrop-variant="dark-2"
          backdrop
          shadow
          @hidden="academicCalenderSidebarClosed"
          data-cy="my-programs-academic-calendar-sidebar"
        >
          <template #default="{ hide }">
            <div class="bg-white p-space-sm">
              <button
                @click="hide"
                class="btn bg-white rounded-0 text-medium border-0 p-0"
                data-cy="my-programs-academic-calendar-sidebar-back-button"
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
            <div
              class="p-space-sm px-lg-space-xl pb-lg-space-xl"
              data-cy="my-programs-academic-calendar-sidebar-content"
            >
              <img
                src="@/assets/img/certificate.svg"
                alt="sidebar image"
                class="img-fluid mb-space-xs mb-lg-space-sm"
              />
              <h2 class="h2-medium">
                {{ pageData.academicCalander.sidebarData.title }}
              </h2>
              <hr
                class="mt-space-xs mb-lg-space-md mt-lg-space-sm mb-space-lg"
              />
              <template
                v-for="item in pageData.academicCalander.sidebarData.items"
              >
                <div :key="item.title" class="mb-space-md mb-lg-space-lg">
                  <h3 class="h3-large mb-space-xs">
                    {{ item.title }}
                  </h3>
                  <template v-for="calander in item.calanders">
                    <div :key="calander.title">
                      <span class="font-weight-bold">
                        {{ calander.title }}
                      </span>
                      <span>{{ calander.text }}</span>
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </template>
        </b-sidebar>
        <!-- END -->

        <!-- Program details sidebar -->
        <b-sidebar
          visible
          id="programs_details_sidebar"
          v-model="isProgramSidebarVisible"
          right
          bg-variant="white"
          no-header
          backdrop-variant="dark-2"
          backdrop
          shadow
          @hidden="programSidebarClosed"
          data-cy="my-programs-programs-details-sidebar"
        >
          <template #default="{ hide }">
            <div class="bg-white p-space-sm">
              <button
                @click="hide"
                class="btn bg-white rounded-0 text-medium border-0 p-0"
                data-cy="my-programs-programs-details-sidebar-back-button"
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
            <template v-if="programDetails">
              <div
                class="p-space-sm px-lg-space-xl pb-lg-space-xl"
                data-cy="my-programs-programs-details-sidebar-content"
              >
                <h3 class="h3-small mb-space-xs mb-lg-space-sm">
                  <span class="bg-secondary px-space-xxs py-space-xxxs"
                    >Degree</span
                  >
                </h3>
                <h2 class="h2-medium">
                  {{ programDetails.acadPlanDescription }}
                </h2>
                <hr />
                <h3 class="h3-medium my-space-xs my-lg-space-sm">
                  Description
                </h3>
                <hr />
                <p
                  class="mb-space-md"
                  v-html="programDetails.fullDescription"
                ></p>
                <h3
                  class="h3-medium my-space-xs my-lg-space-sm"
                  v-if="programDetails.admissionsRequirementsText"
                >
                  Program Requirements
                  <hr />
                </h3>
                <div
                  class="mb-0"
                  v-html="programDetails.admissionsRequirementsText"
                ></div>
              </div>
            </template>
          </template>
        </b-sidebar>
        <!-- Program confirm model -->
        <b-modal
          v-model="isProgramConfirmModelVisible"
          ref="program-confirm-model"
          centered
          hide-header
          hide-footer
          modal-class="rounded-0"
          body-class="p-0"
          size="md"
          :no-close-on-backdrop="true"
          :no-close-on-esc="true"
          data-cy="my-programs-confirm-program-modal"
        >
          <template v-if="isProgramConfirmModelVisible">
            <div
              class="px-space-sm px-lg-space-lg pt-space-md pt-lg-space-lg pb-space-sm pb-lg-space-md position-relative"
            >
              <!-- close button -->
              <button
                class="close-cross btn btn-white p-0 position-absolute"
                @click="handleProgramModelCloseClick"
                data-cy="my-programs-confirm-program-modal-close-cross-button"
                aria-label="close modal"
              >
                <font-awesome-icon
                  icon="fa-xmark"
                  class="text-light-5"
                  size="xl"
                ></font-awesome-icon>
              </button>
              <div
                class="mb-space-md"
                data-cy="my-programs-confirm-program-modal-content"
              >
                <p
                  class="d-inline bg-dark-3 py-space-xxxs pl-space-xxxs pr-space-xxs text-white text-small"
                >
                  Step {{ programConfirmationCurrentStep }} of 2
                </p>
                <h3 class="h3-large mt-space-xs mb-space-xxs">
                  {{ this.programDetails.acadPlanDescription }}
                </h3>
                <hr class="my-0" />
                <p class="text-dark-1 mb-0">ASU Online</p>
                <template v-if="programConfirmationCurrentStep === 2">
                  <p class="text-dark-1 mt-space-xxs">
                    {{ programStartDate }}
                  </p>
                </template>
              </div>
              <!-- if program sessions are not avalable -->
              <template v-if="!isProgramSessionsAvailable">
                <p class="font-weight-bold">
                  This program is not available to start in
                  <span>{{ getFirstProgramSession }}</span>
                </p>
                <p class="text-small text-dark-1 mb-space-xxs">
                  The term you select for your backup program must be within the
                  same semester as the first program you selected.
                </p>
                <p class="text-small text-dark-1 mb-space-lg">
                  Choose a different backup program or change the start term for
                  the first program you selected.
                </p>
              </template>
              <template v-else>
                <!-- program start date radio input -->
                <div v-if="programConfirmationCurrentStep === 1">
                  <b-form-group
                    id="group_program_select_date"
                    aria-label="When would you like to start?"
                    label-class="pb-0"
                    class="mb-0 mt-space-xs position-relative"
                    data-cy="my-programs-confirm-program-modal-select-date-group"
                  >
                    <template #label>
                      <label for="program_select_date">
                        <p class="font-weight-bold">
                          When would you like to start?
                        </p>
                        <p
                          v-if="programsSelected.length > 0"
                          class="text-small text-dark-1"
                        >
                          The term you select for your backup program must be
                          within the same semester as the first program you
                          selected
                        </p>
                      </label>
                    </template>
                    <b-form-radio-group
                      id="program_select_date"
                      button-variant="primary"
                      stacked
                      text-field="text"
                      value-field="text"
                      v-model="$v.programStartDate.$model"
                      :options="sortSessionOptions"
                      :state="
                        $v.programStartDate.$dirty && $v.programStartDate.$error
                          ? false
                          : null
                      "
                      name="program-select-date"
                    ></b-form-radio-group>
                    <b-form-invalid-feedback
                      :force-show="
                        $v.programStartDate.$dirty && $v.programStartDate.$error
                      "
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      This is a required field.
                    </b-form-invalid-feedback>
                  </b-form-group>
                </div>

                <template v-else>
                  <!-- Backup major alert -->
                  <div
                    class="card p-lg-space-md p-space-sm animate__animated animate__zoomIn my-space-lg"
                    v-if="
                      programDetails.applicantsMustChooseSecondMajor &&
                      programsSelected.length === 0
                    "
                  >
                    <div class="row">
                      <div class="col-2">
                        <img
                          src="@/assets/img/triangle-exclamation-solid.svg"
                          alt="alert icon"
                          class="img-fluid"
                        />
                      </div>
                      <div class="col-10">
                        <h3 class="h3-small mb-space-xxs">
                          Backup program required
                        </h3>
                        <p class="mb-0 text-dark-1 text-small">
                          This program has higher admission requirements. After
                          you save this choice, you’ll need to select a backup
                          program in case you don’t meet the requirements of
                          your first choice.
                        </p>
                      </div>
                    </div>
                  </div>
                  <!-- review program requirements -->
                  <div
                    v-if="programDetails.admissionsRequirementsText"
                    data-cy="my-programs-confirm-program-modal-program-requirements"
                  >
                    <a
                      href="#"
                      @click="
                        showProgramRequirements = !showProgramRequirements
                      "
                      class="d-flex justify-content-between w-100 mb-space-md text-dark-3"
                    >
                      <h3 class="text-small h3-small">
                        Review program requirements
                      </h3>
                      <font-awesome-icon
                        icon="fa-chevron-down"
                        class="my-auto"
                        :class="{ 'fa-rotate-180': showProgramRequirements }"
                      ></font-awesome-icon>
                    </a>
                    <b-collapse
                      v-model="showProgramRequirements"
                      class="mb-space-md"
                    >
                      <p
                        id="requirement-text"
                        class="mb-0 text-dark-1 text-xs"
                        v-html="programDetails.admissionsRequirementsText"
                      ></p>
                    </b-collapse>
                  </div>
                </template>

                <!-- Back and save buttons -->
                <div class="d-flex mt-space-sm mt-lg-space-md">
                  <button
                    v-if="programConfirmationCurrentStep === 2"
                    class="btn btn-white p-0 text-dark-1"
                    @click="handleProgramConfirmBackClick"
                    data-cy="my-programs-confirm-program-modal-back-button"
                  >
                    Back
                  </button>
                  <button
                    class="btn btn-white p-0 ml-auto"
                    @click="handleProgramConfirmSaveClick"
                    data-cy="my-programs-confirm-program-modal-save-button"
                  >
                    {{
                      programConfirmationCurrentStep === 1
                        ? "Next"
                        : "Save choice"
                    }}
                    <font-awesome-icon icon="arrow-right"></font-awesome-icon>
                  </button>
                </div>
              </template>
            </div>
          </template>
          <div class="py-space-xxxs bg-secondary"></div>
        </b-modal>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import SectionSelectedPrograms from "@/components/ugapp-components/my-programs/SectionSelectedPrograms.vue";
import SectionRnToBsn from "@/components/ugapp-components/my-programs/SectionRnToBsn.vue";
import SectionPrograms from "@/components/ugapp-components/my-programs/SectionPrograms.vue";
import SectionOtherInterests from "@/components/ugapp-components/my-programs/SectionOtherInterests.vue";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import { useConfigStore } from "@/stores/config-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { validationMixin } from "vuelidate";
import { required, requiredIf, minLength } from "vuelidate/lib/validators";
import pageData from "@/content/my-asu-program.json";
import months from "@/content/months.json";
import { EnumPageNames, EnumApiConstants } from "@/content/enum-app.js";
import { MyProgramConstants } from "@/content/enum-ug-application.js";
import * as _ from "lodash";
import { extractGoogleClientId } from "@/services/UtilityService.js";

import {
  BSidebar,
  BModal,
  VBToggle,
  BFormRadioGroup,
  BCollapse,
  BFormGroup,
  BFormInvalidFeedback,
} from "bootstrap-vue";
export default {
  name: "UgAppMyAsuProgramView",
  mixins: [validationMixin],
  metaInfo() {
    return {
      title: `${this.pageData.title} | Undergraduate Application`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "section-selected-programs": SectionSelectedPrograms,
    "section-rn-to-bsn": SectionRnToBsn,
    "section-programs": SectionPrograms,
    "section-other-interests": SectionOtherInterests,
    "base-alert": BaseAlert,
    "b-sidebar": BSidebar,
    "b-modal": BModal,
    "b-form-radio-group": BFormRadioGroup,
    "b-form-group": BFormGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-collapse": BCollapse,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      firstMajorAlert: {
        visible: false,
        text: null,
      },
      showBackUpMajorAlert: false,
      pageData: pageData,
      appId: null,
      isLazyMounted: false,
      showProgramRequirements: false,
      isAcademicCalenderSidebarVisible: false,
      isProgramSidebarVisible: false,
      isProgramConfirmModelVisible: false,
      programConfirmationCurrentStep: 1,
      programsSelected: [],
      programDetails: null,
      backupMajorAlert: false,
      monthOptions: null,
      programConfirmStartDateOptions: [],
      programSelections: {
        required: false,
        primarySelection: null,
        backupSelection: null,
      },
      programStartDate: null,
      form: {
        programsSelected: [],
        otherInterests: [],
        rnToBsn: {
          isLicensed: null,
          license: {
            state: null,
            number: null,
            expirationDate: {
              day: null,
              month: null,
              year: null,
            },
            disciplinaryActionTaken: null,
          },
          dateScheduledForNclexrn: {
            day: null,
            month: null,
            year: null,
          },
          employer: null,
          partnerCode: null,
          releaseInfoToEmployer: null,
          communityColleges: null,
          reverseTransferAggrement: null,
        },
      },
      isRnToBsnComponentHasError: false,
      isDataBindingComplete: false,
      initialFormData: {},
      footerSubmitActionListenner: null,
      formSubmitClicked: false,
    };
  },
  validations: {
    programStartDate: {
      required: requiredIf(function () {
        return this.isProgramConfirmModelVisible;
      }),
    },
    isRnToBsnComponentHasError: {
      required,
      hasError: function (value) {
        return !this.isRnToBsnSectionVisible || !value;
      },
    },
    form: {
      programsSelected: {
        required,
        minLength: minLength(1),
      },
    },
  },
  watch: {
    "form.programsSelected": {
      handler(newValue) {
        this.firstMajorAlert.visible = false;
        this.programsSelected = newValue
          .slice()
          .sort((a, b) =>
            parseInt(a.payloadData.priority) > parseInt(b.payloadData.priority)
              ? 1
              : -1
          );
      },
      deep: true,
    },
    form: {
      handler(newValue) {
        if (
          this.isDataBindingComplete &&
          !_.isEqual(newValue, this.initialFormData)
        ) {
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
    programConfirmationCurrentStep(val) {
      if (val === 2 && this.programDetails.applicantsMustChooseSecondMajor) {
        this.backupMajorAlert = true;
      }
    },
  },
  computed: {
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useUgApplicationStore, {
      applicationMyAsuProgramSar: "myAsuProgramSar",
      applicationAsuProgramsOtherInterests: "asuProgramsOtherInterests",
      applicationProgramOfInterests: "programOfInterests",
      applicationCurrentScreen: "currentScreen",
      applicationPreviousScreen: "previousScreen",
      applicationUpdateCurrentPageStatus: "updateCurrentPageStatus",
    }),
    ...mapState(useConfigStore, {
      configSelectedStatesLicensedtoPracticeRN:
        "selectedStatesLicensedtoPracticeRN",
    }),
    ...mapState(useAppStore, {
      apisCount: "apisCount",
    }),
    sortSessionOptions() {
      return this.programConfirmStartDateOptions.slice().sort((a, b) => {
        const dateA = new Date(a.sessionEndDate);
        const dateB = new Date(b.sessionEndDate);
        return dateA - dateB;
      });
    },
    isAdditionalMajorAlertVisible() {
      return (
        this.form.programsSelected[0]?.highAdmissionProgram &&
        this.form.programsSelected.length === 1
      );
    },
    isFirstMajorAlertVisible() {
      const isFirstMajorSelected = this.form.programsSelected.some(
        (item) => item.payloadData.priority === "1"
      );
      return !isFirstMajorSelected;
    },
    isProgramSectionVisible() {
      return (
        this.form.programsSelected.length === 0 ||
        (this.form.programsSelected[0]?.highAdmissionProgram &&
          this.form.programsSelected.length < 2 &&
          this.form.programsSelected[0]?.payloadData.priority === "1") ||
        (this.form.programsSelected.length === 1 &&
          this.form.programsSelected[0]?.payloadData.priority === "2")
      );
    },
    isRnToBsnSectionVisible() {
      let isProgramSelectedRnToBsn = false;
      this.form.programsSelected.forEach((program) => {
        if (
          program.acadPlanCode === MyProgramConstants.rnToBsnPlanCode &&
          program.subPlanCode === MyProgramConstants.rnToBsnSubplanCode
        ) {
          isProgramSelectedRnToBsn = true;
        }
      });
      return isProgramSelectedRnToBsn;
    },
    yearOptions() {
      const currentDate = new Date();
      const dateCopy = new Date(currentDate);
      dateCopy.setFullYear(currentDate.getFullYear() - 50);
      var options = [];
      for (
        var i = dateCopy.getFullYear();
        i < currentDate.getFullYear() + 50;
        i++
      ) {
        options.push({ text: `${i}`, value: i });
      }

      return options.sort((a, b) =>
        a.value > b.value ? -1 : b.value > a.value ? 1 : 0
      );
    },
    isProgramSessionsAvailable() {
      // checking if sortSessionOptions is not a empty array and atleast one session should be available without disabled for user to choose
      return (
        this.sortSessionOptions.length > 0 &&
        this.sortSessionOptions.filter((item) => !item.disabled).length > 0
      );
    },
    getFirstProgramSession() {
      return this.programsSelected.length > 0
        ? this.programsSelected[0].startDate.split("-")[0]
        : "";
    },
  },
  methods: {
    ...mapActions(useAppStore, {
      updateCancelApiCallsStatus: "updateCancelApiCallsStatus",
      resetProgressBarRequests: "resetProgressBarRequests",
      updateProgressBarLoaderTotalRequests:
        "updateProgressBarLoaderTotalRequests",
      resetApiCallsCount: "resetApiCallsCount",
    }),
    ...mapActions(useUgApplicationStore, {
      applicationSubmitMyAsuProgramForm: "submitMyAsuProgramForm",
      applicationPatchUiViewInfo: "patchUiViewInfo",
      applicationUpdateCurrentPageUnsavedChanges:
        "updateCurrentPageUnsavedChanges",
      applicationCreateNotification: "createNotification",
    }),
    ...mapActions(useConfigStore, {
      configPopulateProgramDetail: "populateProgramDetail",
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
      this.formSubmitClicked = true;
      this.firstMajorAlert.visible = this.isFirstMajorAlertVisible;
      this.firstMajorAlert.text =
        this.form.programsSelected.length === 1
          ? "Please select the first program."
          : "Please select a program.";
      if (this.isAdditionalMajorAlertVisible) {
        this.showBackUpMajorAlert = true;
        this.scrollToErrorInput();
        setTimeout(() => {
          // resetting to listen for the next click
          this.formSubmitClicked = false;
        }, 2000);
        return;
      }
      this.$v.$touch();
      if (this.$v.$anyError || this.isProgramSectionVisible) {
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
        current_screen: EnumPageNames.PageUndergradMyProgram,
        previous_screen: EnumPageNames.PageUndergradMyInformation,
      });
      // Reseting the RN tp BSN inputs if the perticular course is not selected
      if (!this.isRnToBsnSectionVisible) {
        this.resetRnToBsnInputs();
      }

      // Calculating the total number of API's that will be called during the submit
      this.updateCancelApiCallsStatus(true);
      // Note: All the functions or stores actions which contains an API call is called here
      // to get the total count of the API calls that will be happening during the submit
      await this.applicationSubmitMyAsuProgramForm(
        this.authToken,
        this.appId,
        this.form
      );
      await this.createNotification();
      await this.updateUiViewInfo();
      this.updateCancelApiCallsStatus(false);
      this.updateProgressBarLoaderTotalRequests(this.apisCount);
      this.resetApiCallsCount();

      // step-1: submit my programs record
      const formResponses = await this.applicationSubmitMyAsuProgramForm(
        this.authToken,
        this.appId,
        this.form
      );
      let hasError = false;
      formResponses.forEach((error) => {
        if (error.value.code !== 200 && error.value.code !== 201) {
          hasError = true;
          // fire error data layer event
          this.triggerErrorGtm(error.value.code, error.value.errors);
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
            : EnumPageNames.PageUndergradMySchools,
        previousScreen:
          this.applicationPreviousScreen === EnumPageNames.PageUndergradReview
            ? EnumPageNames.PageUndergradArizonaResidency
            : EnumPageNames.PageUndergradMyProgram,
      };
      return await this.applicationPatchUiViewInfo(
        this.authToken,
        this.appId,
        payload
      );
    },
    handleAcademicCalendarClick() {
      this.isAcademicCalenderSidebarVisible = true;
      this.$track({
        event: "modal",
        action: "open",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "my asu program",
        text: "academic calendar",
      });
    },
    academicCalenderSidebarClosed() {
      this.$track({
        event: "modal",
        action: "close",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "my asu program",
        text: "back",
      });
    },
    async handleViewDetailsClick(program) {
      if (
        !this.programDetails ||
        (this.programDetails &&
          this.programDetails.acadPlanCode !== program.acadPlanCode)
      ) {
        const response = await this.configPopulateProgramDetail(
          program.acadPlanCode
        );
        if (response.code == 200) {
          this.programDetails = response.data;
        } else {
          this.triggerErrorGtm(response.code, response.errors);
        }
        this.programDetails.acadPlanDescription = program.title;
      }
      this.isProgramSidebarVisible = true;
      this.$track({
        event: "collapse",
        action: "open",
        name: "onclick",
        type: "click",
        region: "main content",
        section: program.title.toLowerCase(),
        text: "view details",
      });
    },
    async handleChooseProgramClick(program) {
      if (
        !this.programDetails ||
        (this.programDetails &&
          this.programDetails.acadPlanCode !== program.acadPlanCode)
      ) {
        const response = await this.configPopulateProgramDetail(
          program.acadPlanCode
        );
        if (response.code == 200) {
          this.programDetails = response.data;
        } else {
          this.triggerErrorGtm(response.code, response.errors);
        }
      }
      this.programDetails.acadPlanDescription = program.title;
      this.programDetails.subPlanCode = program.subPlanCode;
      // application deadlines options
      if (this.programDetails.applicationDeadlines) {
        const startDateOptions = [];
        this.programDetails.applicationDeadlines.forEach((option) => {
          if (option.campus === MyProgramConstants.campusOnline) {
            const data = {
              ...option,
              text: option.strmDescription?.toLowerCase(),
              value: `${option.strm}-${option.session}`,
              disabled:
                this.form.programsSelected[0] &&
                option.strm !== this.form.programsSelected[0].payloadData.term,
            };
            if (option.session === MyProgramConstants.sessionA) {
              data.text = `${data.text} - (Session A)`;
            } else if (option.session === MyProgramConstants.sessionB) {
              data.text = `${data.text} - (Session B)`;
            }
            startDateOptions.push(data);
          }
        });
        // presetting the start date if there is only one option to select
        const presetStartDate = startDateOptions.filter(
          (item) => !item.disabled
        );
        this.programStartDate =
          presetStartDate.length === 1 ? presetStartDate[0].text : null;
        this.programConfirmStartDateOptions = startDateOptions;
      }
      this.isProgramConfirmModelVisible = true;
      this.$v.programStartDate.$reset();
      this.$track({
        event: "modal",
        action: "open",
        name: "onclick",
        type: "click",
        region: "main content",
        section: program.title.toLowerCase(),
        text: "choose this program",
      });
    },
    programSidebarClosed() {
      // gtm
    },
    handleProgramConfirmBackClick() {
      this.programConfirmationCurrentStep = 1;
    },
    handleProgramConfirmSaveClick() {
      this.$v.programStartDate.$touch();
      if (this.$v.programStartDate.$anyError) {
        return;
      }
      if (this.programConfirmationCurrentStep === 1) {
        this.programConfirmationCurrentStep = 2;
      } else {
        const data = {
          title: this.programDetails.acadPlanDescription,
          acadPlanCode: this.programDetails.acadPlanCode,
          shortTitle: this.programDetails.degreeDescriptionShort,
          startDate: this.programStartDate,
          highAdmissionProgram:
            this.programDetails.applicantsMustChooseSecondMajor,
          type: "new",
          subPlanCode: this.programDetails.subPlanCode,
          payloadData: {
            priority:
              this.form.programsSelected.length === 0
                ? "1"
                : this.form.programsSelected.length === 1 &&
                  this.form.programsSelected[0].payloadData.priority === "1"
                ? "2"
                : "1",
            programCode: this.programDetails.acadProgramCode,
            planCode: this.programDetails.acadPlanCode,
            subPlanCode: this.programDetails.subPlanCode,
            location: MyProgramConstants.campusOnline,
          },
        };
        const term = this.programConfirmStartDateOptions.filter(
          (item) => item.text === this.programStartDate
        );
        if (term.length > 0) {
          data.payloadData.term = term[0].strm;
          data.payloadData.session = term[0].session;
        }
        this.form.programsSelected.push(data);
        this.form.programsSelected = this.form.programsSelected.sort((a, b) =>
          a.payloadData.priority > b.payloadData.priority ? 1 : -1
        );
        setTimeout(() => {
          const scrollToSelectedProgramSection =
            document.getElementById("selected_programs");
          scrollToSelectedProgramSection.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 500);
        this.resetProgramSelectInputs();
      }
    },
    handleProgramModelCloseClick() {
      this.resetProgramSelectInputs();
    },
    resetProgramSelectInputs() {
      this.isProgramConfirmModelVisible = false;
      this.programConfirmationCurrentStep = 1;
      this.programStartDate = null;
      this.programConfirmStartDateOptions = [];
      this.$v.programStartDate.$reset();
    },
    handleProgramChangeClick(acadPlanCode, priority) {
      let program = this.form.programsSelected.map((item) => {
        return item;
      });

      const index = program.findIndex(
        (item) =>
          item.acadPlanCode === acadPlanCode &&
          item.payloadData.priority === priority
      );
      program = program.filter((item, pos) => pos !== index);
      this.form.programsSelected = program;
    },
    getDaysOption(totalDays) {
      let daysOption = [];
      for (let index = 1; index <= totalDays; index++) {
        const day = index < 9 ? `0${index}` : `${index}`;
        daysOption.push({ text: day, value: day });
      }
      return daysOption;
    },
    resetRnToBsnInputs() {
      this.form.rnToBsn = {
        isLicensed: null,
        license: {
          state: null,
          number: null,
          expirationDate: {
            day: null,
            month: null,
            year: null,
          },
          disciplinaryActionTaken: null,
        },
        dateScheduledForNclexrn: {
          day: null,
          month: null,
          year: null,
        },
        employer: null,
        partnerCode: null,
        releaseInfoToEmployer: null,
        communityColleges: null,
        reverseTransferAggrement: null,
      };
    },
    async updateSarQuestionsWithState() {
      // Other interests
      this.form.otherInterests = this.applicationAsuProgramsOtherInterests;
      // RN To BSN
      // isLicensed
      if (this.applicationMyAsuProgramSar.rnToBsn.isLicensed) {
        const data = this.pageData.rnToBsn.licensed.options.filter(
          (item) =>
            item.value === this.applicationMyAsuProgramSar.rnToBsn.isLicensed
        );
        if (data.length > 0) {
          this.form.rnToBsn.isLicensed = data[0];
        }
      }
      // license
      // state
      if (this.configSelectedStatesLicensedtoPracticeRN) {
        this.form.rnToBsn.license.state =
          this.configSelectedStatesLicensedtoPracticeRN;
      }

      // number
      this.form.rnToBsn.license.number =
        this.applicationMyAsuProgramSar.rnToBsn.license.number;

      // Expiration date
      if (this.applicationMyAsuProgramSar.rnToBsn.license.expirationDate) {
        const date =
          this.applicationMyAsuProgramSar.rnToBsn.license.expirationDate;
        // Month
        const month = this.monthOptions.filter(
          (option) => option.value == date.substring(5, 7)
        );
        if (month.length > 0) {
          this.form.rnToBsn.license.expirationDate.month = month[0];
        }
        // day
        const licenseExpirationDays = this.getDaysOption(31);
        const day = licenseExpirationDays.filter(
          (option) => option.value == date.substring(8, 10)
        );
        if (day.length > 0) {
          this.form.rnToBsn.license.expirationDate.day = day[0];
        }
        // year
        const yearOption = this.yearOptions.filter(
          (item) => item.text === date.substring(0, 4)
        );
        this.form.rnToBsn.license.expirationDate.year =
          yearOption.length > 0 ? yearOption[0] : null;
      }
      // disciplinaryActionTaken
      if (
        this.applicationMyAsuProgramSar.rnToBsn.license.disciplinaryActionTaken
      ) {
        const option = this.pageData.rnToBsn.desciplinaryActions.options.filter(
          (item) =>
            item.value ===
            this.applicationMyAsuProgramSar.rnToBsn.license
              .disciplinaryActionTaken
        );
        if (option.length > 0) {
          this.form.rnToBsn.license.disciplinaryActionTaken = option[0];
        }
      }
      // dateScheduledForNclexrn
      if (this.applicationMyAsuProgramSar.rnToBsn.dateScheduledForNclexrn) {
        const date =
          this.applicationMyAsuProgramSar.rnToBsn.dateScheduledForNclexrn;
        // Month
        const month = this.monthOptions.filter(
          (option) => option.value == date.substring(5, 7)
        );
        if (month.length > 0) {
          this.form.rnToBsn.dateScheduledForNclexrn.month = month[0];
        }
        const dateScheduledForNclexrnDays = this.getDaysOption(31);
        // day
        const day = dateScheduledForNclexrnDays.filter(
          (option) => option.value == date.substring(8, 10)
        );
        if (day.length > 0) {
          this.form.rnToBsn.dateScheduledForNclexrn.day = day[0];
        }
        // year
        const yearOption = this.yearOptions.filter(
          (item) => item.text === date.substring(0, 4)
        );
        this.form.rnToBsn.dateScheduledForNclexrn.year =
          yearOption.length > 0 ? yearOption[0] : null;
      }
      // employer
      this.form.rnToBsn.employer =
        this.applicationMyAsuProgramSar.rnToBsn.employer;
      // Partnercode
      this.form.rnToBsn.partnerCode =
        this.applicationMyAsuProgramSar.rnToBsn.partnerCode;
      // releaseInfoToEmployer
      if (this.applicationMyAsuProgramSar.rnToBsn.releaseInfoToEmployer) {
        const option =
          this.pageData.rnToBsn.releaseInfoToEmployer.options.filter(
            (item) =>
              item.value ===
              this.applicationMyAsuProgramSar.rnToBsn.releaseInfoToEmployer
          );
        if (option.length > 0) {
          this.form.rnToBsn.releaseInfoToEmployer = option[0];
        }
      }
      // communityColleges
      if (this.applicationMyAsuProgramSar.rnToBsn.communityColleges) {
        const option = this.pageData.rnToBsn.communityCollege.options.filter(
          (item) =>
            item.value ===
            this.applicationMyAsuProgramSar.rnToBsn.communityColleges
        );
        if (option.length > 0) {
          this.form.rnToBsn.communityColleges = option[0];
        }
      }
      // reverseTransferAggrement
      if (this.applicationMyAsuProgramSar.rnToBsn.reverseTransferAggrement) {
        const option =
          this.pageData.rnToBsn.reverseTransferAgreement.options.filter(
            (item) =>
              item.value ===
              this.applicationMyAsuProgramSar.rnToBsn.reverseTransferAggrement
          );
        if (option.length > 0) {
          this.form.rnToBsn.reverseTransferAggrement = option[0];
        }
      }
    },
    async updateSelectedProgramWithState() {
      const response = await Promise.allSettled(
        this.applicationProgramOfInterests.map(async (program) => {
          const response = await this.configPopulateProgramDetail(program.plan);
          const data = response.data;
          if (response.code === 200) {
            const programData = {
              title: data.acadPlanDescription,
              acadPlanCode: data.acadPlanCode,
              shortTitle: data.degreeDescriptionShort,
              highAdmissionProgram: data.applicantsMustChooseSecondMajor,
              subPlanCode: program.subplan,
              payloadData: {
                priority: program.priority,
                programCode: program.program,
                planCode: program.plan,
                location: program.campus,
                term: program.term,
                session: program.session,
                subPlanCode: program.subplan,
              },
            };
            // updating the Title if it has subplan
            if (program.subplan) {
              const subplan = data.subplans.filter(
                (item) => item.acadSubPlanCode === program.subplan
              );
              if (subplan.length > 0) {
                programData.title =
                  programData.title + ` - ${subplan[0].description}`;
              }
            }
            programData.title =
              programData.title + `, ${data.degreeDescriptionShort}`;
            // startDate
            const startDate = data.applicationDeadlines.filter(
              (item) =>
                item.strm === program.term &&
                item.campus === program.campus &&
                item.session === program.session
            );
            if (startDate.length > 0) {
              let startDateTest = startDate[0].strmDescription?.toLowerCase();
              if (startDate[0].session === MyProgramConstants.sessionA) {
                startDateTest = `${startDateTest} - (Session A)`;
              } else if (startDate[0].session === MyProgramConstants.sessionB) {
                startDateTest = `${startDateTest} - (Session B)`;
              }
              programData.startDate = startDateTest;
              programData.payloadData.session = startDate[0].session;
            }
            this.form.programsSelected.push(programData);
          } else {
            this.triggerErrorGtm(response.code, response.errors);
          }
          return data;
        })
      );
      return response;
    },
    handleFirstProgramChangeClick() {
      this.backupMajorAlert = false;
      this.form.programsSelected = [];
    },
    triggerErrorGtm(code, errors) {
      this.$track({
        event: "app_error",
        action: "my_program",
        location: this.$router.currentRoute.fullPath,
        code: code,
        message: errors?.toString(),
      });
      this.$router.push({ name: EnumPageNames.PageError });
    },
    handleRnToBsnErrorState(value) {
      this.$v.isRnToBsnComponentHasError.$model = value;
    },
    handleFirstMajorErrorAlertClose() {
      this.firstMajorAlert.visible = false;
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

    this.monthOptions = months.sort((a, b) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0
    );

    this.appId = this.$route.params.id;
    // Preset form data with state
    const response = await Promise.allSettled([
      this.updateSelectedProgramWithState(),
      this.updateSarQuestionsWithState(),
    ]);
    response.forEach((item) => {
      if (item.status === "fulfilled") {
        this.isDataBindingComplete = true;
      }
    });
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
.my-asu-program {
  border-radius: 19px;
}
.close-cross {
  right: 24px;
  top: 36px;
}
.fade-enter-active {
  transition: opacity 2s;
}
.fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

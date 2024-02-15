<template>
  <main id="main-content" data-cy="review-up-app-review-view">
    <div class="bg-light-1 px-space-xxs pt-space-sm">
      <div
        class="my-review container bg-white pt-space-md pb-space-xxl p-lg-space-xl"
      >
        <section data-cy="review-page-heading-and-eta">
          <div class="row">
            <div class="col-12">
              <h1 class="h1-medium">
                <span class="bg-secondary pr-space-xxxs">{{
                  pageData.title
                }}</span>
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

        <hr class="my-space-md my-lg-space-lg" />
        <b-alert
          v-model="appHasValidations"
          variant="danger"
          class="col-md-10 col-12 p-md-space-md is-invalid"
          data-cy="review-validation-errors"
        >
          <p class="text-danger font-weight-bold">
            <font-awesome-icon :icon="['fasr', 'circle-exclamation']" />
            Please correct the following items:
          </p>
          <template v-for="page in Object.keys(ugApplicationErrors)">
            <template v-if="ugApplicationErrors[page].length > 0">
              <div :data-cy="`page-${page}-errors`" class="page" :key="page">
                <p class="font-weight-bold mb-0">
                  {{
                    page !== "miscellaneous"
                      ? getAppScreenNames(page)
                      : "Miscellaneous"
                  }}
                </p>
                <ul class="pl-space-sm">
                  <li
                    class=""
                    v-for="(err, index) in ugApplicationErrors[page]"
                    :key="`${page}-${err}-${index}`"
                  >
                    {{ err.split(":")[1] }}
                  </li>
                </ul>
              </div>
            </template>
          </template>
        </b-alert>
        <!-- Certify your application -->
        <section data-cy="review-certify-your-application">
          <div class="row">
            <div class="col-12">
              <div class="px-gutter px-lg-0">
                <h3 class="h3-large mb-space-xs mb-lg-space-sm">
                  {{ pageData.text }}
                </h3>
                <p class="text-medium text-dark-2">{{ pageData.subText }}</p>
              </div>

              <!-- My profile -->
              <section-details-collapse
                data-cy="review-my-profile"
                :compData="applicationMyProfileDetails"
                collapseId="my-profile-page-contents"
                :validationErrors="ugApplicationErrors['ug-app-profile-errors']"
                @editClicked="handleEditClick"
              ></section-details-collapse>
              <!-- My information -->
              <section-details-collapse
                data-cy="review-my-information"
                :compData="applicationMyInformationDetails"
                :validationErrors="ugApplicationErrors['ug-app-my-information']"
                collapseId="my-information-page-contents"
                bgVariant="white"
                @editClicked="handleEditClick"
              ></section-details-collapse>
              <!-- My programs -->
              <section-details-collapse
                data-cy="review-my-programs"
                :compData="applicationMyProgramsDetails"
                collapseId="my-programs-page-contents"
                :validationErrors="ugApplicationErrors['ug-app-my-program']"
                @editClicked="handleEditClick"
              ></section-details-collapse>
              <!-- My schools -->
              <section-details-collapse
                data-cy="review-my-schools"
                :compData="applicationMySchoolsDetails"
                collapseId="my-schools-page-contents"
                :validationErrors="ugApplicationErrors['ug-app-my-schools']"
                bgVariant="white"
                @editClicked="handleEditClick"
              ></section-details-collapse>
              <!-- highSchoolGrades -->
              <section-details-collapse
                data-cy="review-my-high-school-grades"
                v-if="
                  isDetailsCollapseVisible(
                    applicationMyHighSchoolGradesDetails.data,
                    ugApplicationErrors['ug-app-my-high-school-grades']
                  )
                "
                :validationErrors="
                  ugApplicationErrors['ug-app-my-high-school-grades']
                "
                :compData="applicationMyHighSchoolGradesDetails"
                collapseId="my-high-school-grades-page-contents"
                @editClicked="handleEditClick"
              ></section-details-collapse>

              <!-- AZ residency -->
              <section-details-collapse
                data-cy="review-arizona-residency"
                v-if="
                  isDetailsCollapseVisible(
                    applicationMyArizonaResidencyDetails.data,
                    ugApplicationErrors['ug-app-arizona-residency']
                  )
                "
                :compData="applicationMyArizonaResidencyDetails"
                :validationErrors="
                  ugApplicationErrors['ug-app-arizona-residency']
                "
                collapseId="arizona-residency-page-contents"
                bgVariant="white"
                @editClicked="handleEditClick"
              ></section-details-collapse>
            </div>
          </div>
        </section>
        <!-- END -->
        <template v-if="isArizonaCollegeConsentSectionVisible">
          <hr class="my-space-md my-lg-space-lg" />

          <!-- Arizona community college transcript consent -->
          <section
            data-cy="review-arizona-community-college-transcript-consent"
          >
            <div class="row">
              <div class="col-12">
                <h3
                  class="h3-large mb-space-sm mb-lg-space-md pb-lg-space-xxxs"
                >
                  {{ pageData.azCommunityCollegeConsent.title }}
                </h3>
                <h3 class="h3-medium mb-space-xs">
                  {{ pageData.azCommunityCollegeConsent.subTitle }}
                </h3>
                <p class="text-large mb-space-md">
                  {{ pageData.azCommunityCollegeConsent.text }}
                </p>
                <!-- Consent -->
                <b-form-group
                  data-cy="review-arizona-community-college-transcript-consent-checkbox"
                  id="group_az_community_college_consent"
                  aria-label="form arizona community college transcript consent"
                  label-class="pb-0"
                  class="twox-checkbox position-relative mb-space-md"
                >
                  <b-form-checkbox
                    id="az_community_college_consent_checkbox"
                    v-model="$v.form.azCollegeTranscriptConsent.$model"
                    name="Authorization"
                    value="Y"
                    :unchecked-value="null"
                    :state="
                      $v.form.azCollegeTranscriptConsent.$dirty &&
                      $v.form.azCollegeTranscriptConsent.$error
                        ? false
                        : null
                    "
                    class="font-weight-bold text-large mt-0"
                    aria-describedby="input-live-help input-live-feedback"
                  >
                    <span>Authorization</span>
                  </b-form-checkbox>
                  <b-form-invalid-feedback
                    :force-show="
                      $v.form.azCollegeTranscriptConsent.$dirty &&
                      $v.form.azCollegeTranscriptConsent.$error
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
                <!-- authoization items -->
                <ul class="text-large pl-space-sm mb-space-md">
                  <template
                    v-for="item in pageData.azCommunityCollegeConsent
                      .authorizationItems"
                  >
                    <li :key="item" v-html="item" class="mb-space-xs"></li>
                  </template>
                </ul>
                <p class="text-large mb-0">
                  {{ pageData.azCommunityCollegeConsent.subText }}
                </p>
              </div>
            </div>
          </section>
          <!-- END -->
        </template>
        <hr class="my-space-md my-lg-space-lg" />
        <!-- Application Affidavit -->
        <section data-cy="review-application-affidavit">
          <div class="row">
            <div class="col-12">
              <h3 class="h3-large mb-space-sm mb-lg-space-md">
                {{ pageData.applicationAffidavit.title }}
              </h3>
              <p class="mb-space-sm">
                {{ pageData.applicationAffidavit.text }}
              </p>
              <!-- Submitting Official Transcripts (For Degree-Seeking Students) -->
              <div
                class="mb-space-sm"
                data-cy="review-submitting-official-transcripts"
              >
                <h3 class="h3-medium mb-space-xxs pb-space-xxxs">
                  {{ pageData.applicationAffidavit.officialTranscripts.title }}
                </h3>
                <p class="mb-0">
                  {{ pageData.applicationAffidavit.officialTranscripts.text }}
                </p>
              </div>
              <!-- Academic Integrity -->
              <div class="mb-space-sm" data-cy="review-academic-integrity">
                <h3 class="h3-medium mb-space-xxs pb-space-xxxs">
                  {{ pageData.applicationAffidavit.academicInterity.title }}
                </h3>
                <p class="mb-0">
                  {{ pageData.applicationAffidavit.academicInterity.text }}
                </p>
              </div>
              <!-- Prohibition Against Discrimination, Harassment and Retaliation -->
              <div
                data-cy="review-prohibition-against-discrimination-harassment-and-retaliation"
              >
                <h3 class="h3-medium mb-space-xxs pb-space-xxxs">
                  {{
                    pageData.applicationAffidavit
                      .prohibitionAgainstDescrimination.title
                  }}
                </h3>
                <div
                  class="mb-space-sm"
                  v-html="
                    pageData.applicationAffidavit
                      .prohibitionAgainstDescrimination.text
                  "
                ></div>
                <!-- contacts -->
                <template
                  v-for="contact in pageData.applicationAffidavit
                    .prohibitionAgainstDescrimination.contacts"
                >
                  <p :key="contact.title" class="mb-space-xxs">
                    <span class="font-weight-bold mr-space-xxxs">{{
                      contact.title
                    }}</span>
                    <span>{{ contact.text }}</span>
                  </p>
                </template>
                <a
                  :href="
                    pageData.applicationAffidavit
                      .prohibitionAgainstDescrimination.cta.link
                  "
                  :target="
                    pageData.applicationAffidavit
                      .prohibitionAgainstDescrimination.cta.target
                  "
                  class="text-underline font-weight-bold"
                  >{{
                    pageData.applicationAffidavit
                      .prohibitionAgainstDescrimination.cta.label
                  }}</a
                >
                <p class="mt-space-sm mb-space-md">
                  {{ pageData.applicationAffidavit.subText }}
                </p>

                <!-- Acknowledgement -->
                <b-form-group
                  data-cy="review-acknowledgement"
                  id="group_acknowledgement"
                  aria-label="form acknowledgement"
                  label-class="pb-0"
                  class="twox-checkbox mb-0 position-relative col-lg-10 px-0"
                >
                  <b-form-checkbox
                    id="acknowledgement_checkbox"
                    v-model="$v.form.acknowledged.$model"
                    name="receive_info_vie_sms_checkbox"
                    value="Yes"
                    :unchecked-value="null"
                    :state="
                      $v.form.acknowledged.$dirty && $v.form.acknowledged.$error
                        ? false
                        : null
                    "
                    class="font-weight-bold text-large"
                    aria-describedby="input-live-help input-live-feedback"
                  >
                    <span
                      >I, {{ userLegalFullName }}, certify that all information
                      is correct and complete and I agree to the terms of this
                      affidavit.
                    </span>
                  </b-form-checkbox>
                  <b-form-invalid-feedback
                    :force-show="
                      $v.form.acknowledged.$dirty && $v.form.acknowledged.$error
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
            </div>
          </div>
        </section>
        <!-- END -->
        <template v-if="userType === EnumNameTypes.UserTypeSelf">
          <hr class="my-space-md my-lg-space-lg" />
          <!-- Pay your application fee -->
          <section data-cy="review-payment-section">
            <div class="row">
              <div class="col-12">
                <h2 class="h2-medium mb-space-md">
                  {{ pageData.applicationFee.title }}
                </h2>
                <!-- If app fee is waived -->
                <template v-if="isAppFeeWaived">
                  <base-alert
                    :isDismissible="false"
                    alertType="success"
                    iconVariant="success"
                    class="col-12 col-lg-6 px-0"
                    data-cy="review-app-fee-waived"
                  >
                    <template #body>
                      <div class="font-weight-normal text-small">
                        Your application fee has been waived. If all your
                        information is correct, you may proceed and submit your
                        application.
                      </div>
                    </template>
                  </base-alert>
                </template>
                <!-- If app fee is payed -->
                <template v-else-if="isPaymentCompleted">
                  <div data-cy="review-payment-completed">
                    <p class="text-dark-2">
                      {{ pageData.applicationFee.text }}
                    </p>
                    <p class="font-weight-bold my-space-sm" id="payment_amount">
                      Amount due: ${{ applicationFeeAmount }}
                    </p>
                    <base-alert
                      :isDismissible="false"
                      alertType="success"
                      iconVariant="success"
                      textWeight="normal"
                      class="col-12 col-lg-6 px-0"
                      :text="completedPaymentAlertMessage"
                      id="completed_alert_message"
                    >
                    </base-alert>
                  </div>
                </template>
                <!-- If app payment is not completed -->
                <template v-else>
                  <div data-cy="review-app-payment">
                    <p class="text-dark-2 mb-space-md">
                      {{ pageData.applicationFee.text }}
                    </p>
                    <div
                      class="px-space-sm py-space-xs border d-inline-block mb-space-md"
                      id="application_fee"
                    >
                      <p class="font-weight-bold mb-space-xxs pb-space-xxxs">
                        AMOUNT DUE
                      </p>
                      <h3 class="h3-xl text-success-100">
                        ${{ applicationFeeAmount }}
                      </h3>
                    </div>

                    <b-form-group
                      id="group_payment_option"
                      :aria-label="pageData.applicationFee.payment.label"
                      label-class="pb-0"
                      class="mb-0 position-relative"
                      data-cy="review-payment-option-group"
                    >
                      <template #label>
                        <label
                          for="education_benefit_radio"
                          class="mb-space-sm"
                        >
                          <h3 class="h3-small">
                            {{ pageData.applicationFee.payment.label }}
                          </h3>
                        </label>
                      </template>
                      <base-radio-group
                        name="payment_radio"
                        :options="pageData.applicationFee.payment.options"
                        v-model="$v.form.paymentMethod.$model"
                        aria-describedby="input-live-help input-live-feedback"
                        :class="{
                          'is-invalid':
                            $v.form.paymentMethod.$dirty &&
                            $v.form.paymentMethod.$error,
                        }"
                      >
                      </base-radio-group>
                      <b-form-invalid-feedback
                        v-if="!$v.form.paymentMethod.required"
                      >
                        <font-awesome-icon
                          icon="fa-sharp fa-regular fa-circle-exclamation"
                          size="xs"
                        />
                        This is a required field.
                      </b-form-invalid-feedback>
                      <div
                        class="col-lg-6 col-12 px-0"
                        v-if="form.paymentMethod"
                      >
                        <base-alert
                          id="payment_option_alert"
                          alert-type="info"
                          iconVariant="dark-3"
                          :text="
                            form.paymentMethod?.value ===
                            EnumReviewPage.PayLater
                              ? pageData.applicationFee.payment
                                  .paylaterAlertMessage
                              : pageData.applicationFee.payment
                                  .payNowAlertMessage
                          "
                          textSize="small"
                          textWeight="normal"
                          :isDismissible="false"
                        ></base-alert>
                      </div>
                    </b-form-group>
                  </div>
                </template>
              </div>
            </div>
          </section>
        </template>
      </div>
    </div>
  </main>
</template>

<script>
import pageData from "@/content/review.json";
import { validationMixin } from "vuelidate";
import { required, requiredIf } from "vuelidate/lib/validators";
import { isEmpty } from "radash";
import {
  BFormGroup,
  BFormCheckbox,
  BFormInvalidFeedback,
  VBToggle,
  BAlert,
} from "bootstrap-vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import SectionDetailsCollapse from "@/components/ugapp-components/review/SectionDetailsCollapse.vue";
import { mapActions, mapState } from "pinia";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import { PAYMENT_GATEWAY_CALLBACK_PATH } from "@/api/api-constants.js";
import {
  EnumStringConstants,
  EnumReviewPage,
  EnumNameTypes,
} from "@/content/enum-ug-application";
import { EnumPageNames, EnumApiConstants } from "@/content/enum-app.js";
import { extractGoogleClientId } from "@/services/UtilityService.js";
import * as _ from "lodash";
export default {
  name: "UgAppReviewView",
  mixins: [validationMixin],
  metaInfo() {
    return {
      title: `Review | Undergraduate Application`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "b-form-group": BFormGroup,
    "b-alert": BAlert,
    "b-form-checkbox": BFormCheckbox,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "base-radio-group": BaseRadioGroup,
    "base-alert": BaseAlert,
    "section-details-collapse": SectionDetailsCollapse,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      EnumNameTypes: EnumNameTypes,
      EnumReviewPage: EnumReviewPage,
      appHasValidations: false,
      pageData: pageData,
      applicationErrors: {},
      appId: null,
      isArizonaCollegeConsentSectionVisible: false,
      isPaymentCompleted: null,
      completedPaymentAlertMessage: null,
      form: {
        acknowledged: null,
        azCollegeTranscriptConsent: null,
        paymentMethod: null,
      },
      initialFormData: {},
      footerSubmitActionListenner: null,
    };
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
  },
  validations: {
    form: {
      acknowledged: {
        required,
      },
      azCollegeTranscriptConsent: {
        required: requiredIf(function () {
          return this.isArizonaCollegeConsentSectionVisible;
        }),
      },
      paymentMethod: {
        required: requiredIf(function () {
          return (
            !this.isAppFeeWaived &&
            !this.isPaymentCompleted &&
            this.userType === EnumNameTypes.UserTypeSelf
          );
        }),
      },
    },
  },
  computed: {
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useUgApplicationStore, {
      applicationMyProfileDetails: "myProfileDetails",
      applicationMyInformationDetails: "myInformationDetails",
      applicationMyProgramsDetails: "myProgramsDetails",
      applicationMySchoolsDetails: "mySchoolsDetails",
      applicationMyHighSchoolGradesDetails: "myHighSchoolGradesDetails",
      applicationMyArizonaResidencyDetails: "myArizonaResidencyDetails",
      applicationOtherInstitutions: "otherInstitutions",
      applicationReviewSar: "reviewSar",
      applicationWaiver: "waiver",
      applicationFeeAmount: "feeAmount",
      ugApplicationErrors: "applicationErrors",
      submitUgApplication: "submitApplication",
      applicationCurrentScreen: "currentScreen",
    }),
    ...mapState(useUserStore, {
      userLegalFullName: "legalFullName",
      userType: "userType",
    }),
    ...mapState(useAppStore, ["loading"]),
    ...mapState(useConfigStore, {
      configInstitutions: "institutions",
      selectedCorporatePartner: "selectedCorporatePartner",
    }),
    isAppFeeWaived() {
      return this.applicationWaiver === "true";
    },
  },
  async created() {
    this.appId = this.$route.params.id;
    this.appHasValidations = await this.triggerValidation();
    this.footerSubmitActionListenner = useUgApplicationStore().$onAction(
      async ({ name }) => {
        if (name === "submitForm") {
          this.handleSubmitApplicationClick();
        }
      }
    );
    // populating the sar questions from state
    this.form.azCollegeTranscriptConsent =
      this.applicationReviewSar.azCollegeTranscriptConsent;
    // populating the arizona community institutions
    let params = `schoolTypeCode=2YR&countryCode=USA&stateCode=AZ`;
    const response = await this.configPopulateInstitutions(params);
    // checking if the arizona college consent should be displayed
    if (response.code === 200) {
      this.applicationOtherInstitutions.forEach((item) => {
        if (
          response.data.some((ele) => ele.externalOrgId === item.extOrgId) &&
          item.degreeCode === EnumStringConstants.NONE
        ) {
          this.isArizonaCollegeConsentSectionVisible = true;
        }
      });
    } else if (this.userType === EnumNameTypes.UserTypeSelf) {
      this.triggerErrorGtm(response.code, response.errors);
      this.$router.push({ name: EnumPageNames.PageError });
    }
    // populating application waivers and fee
    const waiversResponse = await this.populateApplicationWaivers(
      this.authToken,
      this.appId
    );
    // checking for usertype and current screen to skip the page to be redirected to 500 when api fails
    // Skiping if the user is admin or the current screen is not review page
    if (
      waiversResponse.code !== 200 &&
      this.userType === EnumNameTypes.UserTypeSelf &&
      this.applicationCurrentScreen === EnumPageNames.PageUndergradReview
    ) {
      this.triggerErrorGtm(waiversResponse.code, waiversResponse.errors);
      this.$router.push({ name: EnumPageNames.PageError });
    }
    let feeResponse = await this.populateApplicationFee(
      this.authToken,
      this.appId
    );
    // If the fee amount is available pushing to error page
    if (
      feeResponse.code !== 200 &&
      this.userType === EnumNameTypes.UserTypeSelf &&
      this.applicationCurrentScreen === EnumPageNames.PageUndergradReview
    ) {
      this.triggerErrorGtm(feeResponse.code, feeResponse.errors);
      this.$router.push({ name: EnumPageNames.PageError });
    }

    // check if payment already exist
    const paymentInfo = await this.getPaymentDetails(
      this.authToken,
      this.appId
    );
    if (paymentInfo.code === 200) {
      this.isPaymentCompleted = paymentInfo.data?.length > 0;
      // setting the payment completed alert message
      if (
        this.isPaymentCompleted &&
        paymentInfo.data[0].paymentType === "Mail Pending" &&
        (paymentInfo.data[0].paymentCode === "MA" ||
          paymentInfo.data[0].paymentCode === "ME")
      ) {
        this.completedPaymentAlertMessage =
          this.pageData.applicationFee.paymentCompletedConfirmMessage.payLater;
      } else {
        this.completedPaymentAlertMessage =
          this.pageData.applicationFee.paymentCompletedConfirmMessage.payNow;
      }
    }
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
  methods: {
    ...mapActions(useUgApplicationStore, {
      applicationPatchUiViewInfo: "patchUiViewInfo",
      submitReviewForm: "submitReviewForm",
      applicationCreateNotification: "createNotification",
      populateApplicationWaivers: "populateApplicationWaivers",
      populateApplicationFee: "populateApplicationFee",
      submitForPaymentGateWayRedirectUrl: "submitForPaymentGateWayRedirectUrl",
      applicationUpdateCurrentPageUnsavedChanges:
        "updateCurrentPageUnsavedChanges",
      postPayLaterRequest: "addApplicationPayment",
      applicationUpdateCurrentPageStatus: "updateCurrentPageStatus",
      getApplicationValidations: "getValidations",
      getAppScreenNames: "getScreenNames",
      getPaymentDetails: "getApplicationPaymentInfo",
    }),
    ...mapActions(useAppStore, {
      populateUndergradApplications: "populateUndergradApplications",
      appSubmitApplicationClicked: "appSubmitApplicationClicked",
      appProgressBarValue: "appProgressBarValue",
      updateSelectedPaymentType: "updateSelectedPaymentType",
      resetProgressBarRequests: "resetProgressBarRequests",
    }),
    ...mapActions(useConfigStore, {
      configPopulateInstitutions: "populateInstitutions",
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
    handleSelectedPaymentType(event) {
      this.$track({
        event: "select",
        action: "click",
        name: "onclick",
        type: "checkbox",
        region: "main content",
        section: "choose a payment option",
        text: event.text.toLowerCase(),
        component: "pay your application fee",
      });
    },
    async handleSubmitApplicationClick() {
      if (this.appHasValidations) {
        this.scrollToErrorInput();
        return;
      }
      if (this.form.paymentMethod?.value === EnumReviewPage.PayNow) {
        this.updateSelectedPaymentType();
      }
      this.$v.$touch();
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
          text: "submit application",
          current_screen: EnumPageNames.PageUndergradReview,
          previous_screen: EnumPageNames.PageUndergradArizonaResidency,
        });
        // update the appSubmitApplicationClicked to "true" to toggle different animation
        this.appSubmitApplicationClicked(true);
        // step-1: submit review record
        const formResponses = await this.submitReviewForm(
          this.authToken,
          this.appId,
          this.form
        );
        formResponses.forEach((error) => {
          if (error.value.code !== 200 && error.value.code !== 201) {
            this.$router.push({ name: EnumPageNames.PageError });
            this.triggerErrorGtm(error.value.code, error.value.errors);
          }
        });
        this.applicationUpdateCurrentPageUnsavedChanges(false);
        // checking if app fee is waived or payment is already completed
        if (this.isAppFeeWaived || this.isPaymentCompleted) {
          // update appProgressBarValue with n% value
          await this.completeApplicationSubmission();
        } else {
          // if user selected pay now get the redirect url and redirect to payment page
          if (
            this.userType !== EnumNameTypes.UserTypeAdmin &&
            this.form.paymentMethod?.value === EnumReviewPage.PayNow
          ) {
            const { data } = await this.submitForPaymentGateWayRedirectUrl(
              this.authToken,
              this.appId,
              {
                clientRedirectUrl: `${
                  import.meta.env.VITE_HOSTNAME
                }${PAYMENT_GATEWAY_CALLBACK_PATH}?persistedAppId=${this.appId}`,
              }
            );
            if (data.code === 200) {
              this.appProgressBarValue(25);
              window.location.replace(data.data.redirectUrl);
            }
          } else {
            // step-1 paylater process payments
            const payLaterPayload = {
              paymentType: "Mail Pending",
              paymentCode: "MA",
            };
            const paymentReq = await this.postPayLaterRequest(
              this.authToken,
              this.appId,
              payLaterPayload
            );
            if (paymentReq.data.code === 201) {
              // Complete the application submission
              await this.completeApplicationSubmission();
            } else {
              this.triggerErrorGtm(paymentReq.code, paymentReq.errors);
              this.$router.push({ name: EnumPageNames.PageError });
            }
          }
        }
      } catch (error) {
        this.triggerErrorGtm(
          error.response?.data?.code || 500,
          error.response?.data?.errors || "something went wrong"
        );
        this.appSubmitApplicationClicked(false);
        this.$router.push({ name: EnumPageNames.PageError });
      }
    },
    async completeApplicationSubmission() {
      try {
        this.appProgressBarValue(25);
        // checking validation before app submission
        const validationResponse = await this.triggerValidation();
        if (!isEmpty(validationResponse.data)) {
          this.triggerErrorGtm(400, JSON.stringify(validationResponse.data));
          throw new Error(JSON.stringify(validationResponse.data));
        }
        this.appProgressBarValue(40);
        // submit the application
        const ugAppSubmissionStatus = await this.submitUgApplication(
          this.authToken,
          this.appId,
          {
            submitted: true,
          }
        );
        this.appProgressBarValue(60);
        if (ugAppSubmissionStatus.code === 200) {
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
          this.appProgressBarValue(100);
          // step-4: update ui-view-info record
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
      }
    },
    async handleEditClick(screenName) {
      this.updateUiViewInfo(screenName);
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
    async triggerValidation() {
      try {
        const data = await this.getApplicationValidations(
          this.authToken,
          this.appId
        );
        if (data.code !== 200) {
          throw new Error(data.response?.data?.errors);
        }
        return !isEmpty(data.data);
      } catch (error) {
        this.triggerErrorGtm(
          error?.response?.data?.code || "something went wrong",
          error.response?.data?.errors || "something went wrong"
        );
        this.appSubmitApplicationClicked(false);
        this.$router.push({ name: EnumPageNames.PageError });
      }
    },
    triggerErrorGtm(code, errors) {
      this.$track({
        event: "app_error",
        action: "review",
        location: this.$router.currentRoute.fullPath,
        code: code,
        message: errors.toString(),
      });
    },
    isDetailsCollapseVisible(data, error) {
      return !isEmpty(data) || !isEmpty(error);
    },
  },
  destroyed() {
    this.footerSubmitActionListenner();
  },
};
</script>

<style lang="scss" scoped>
.my-review {
  border-radius: 19px;
}
.not-collapsed {
  .collapse-icon {
    rotate: -180deg;
  }
}
.collapse-icon {
  transition: all 0.5s;
  font-size: 16px;
}
@media (min-width: 992px) {
  .collapse-icon {
    font-size: 32px;
  }
}
.collapse-title {
  max-width: 60%;
}
a:focus {
  outline: none !important;
}
</style>

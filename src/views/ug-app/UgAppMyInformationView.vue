<template>
  <main id="main-content" data-cy="my-information-view">
    <b-alert
      v-model="toast.show"
      class="position-fixed fixed-top m-0 rounded-0"
      style="z-index: 2000"
      :variant="toast.variant"
      dismissible
    >
      {{ toast.message }}
    </b-alert>
    <div class="bg-light-1 px-space-xxs pt-space-sm">
      <div
        class="my-information-page container bg-white pt-space-md pb-space-xxl px-space-sm p-lg-space-xl"
      >
        <!-- section heading and eta -->
        <section data-cy="my-info-heading-eta">
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
        <hr class="my-space-md mb-lg-space-lg" />
        <!-- former/alternate name -->
        <section id="former_name" data-cy="my-info-former-name">
          <section-former-name
            :compData="pageData.formerName"
            v-model="form.formerNames"
            :isFormSubmitClicked="formSubmitClicked"
            @updateErrorState="handleFormerNameErrorState"
          ></section-former-name>
        </section>
        <!-- END -->
        <hr class="my-space-md mb-lg-space-lg" />
        <!-- Section Legal sex -->
        <section id="legal_sex" data-cy="my-info-legal-sex">
          <section-legal-sex
            :compData="pageData.legalSex"
            v-model="form.legalSex"
            :isFormSubmitClicked="formSubmitClicked"
            @updateErrorState="handleLegalSexErrorState"
          ></section-legal-sex>
        </section>
        <!-- END -->
        <hr class="my-space-md mb-lg-space-lg" />
        <!-- Section primary Language -->
        <section id="primary_language" data-cy="my-info-primary-language">
          <section-primary-language
            :compData="pageData.primaryLanguage"
            v-model="form.primaryLanguage"
            :isFormSubmitClicked="formSubmitClicked"
            @updateErrorState="handlePrimaryLanguageErrorState"
          ></section-primary-language>
        </section>
        <!-- END -->
        <hr class="my-space-md mb-lg-space-lg" />
        <!-- Section Home address and phone -->
        <section id="home_address" data-cy="my-info-home-address">
          <section-home-address
            :compData="pageData.homeAddress"
            v-model="form.homeAddress"
            :isFormSubmitClicked="formSubmitClicked"
            @updateErrorState="handleHomeAddressErrorState"
          ></section-home-address>
        </section>
        <!-- END -->
        <hr class="my-space-md mb-lg-space-lg" />
        <!-- Section ethnic/racial background -->
        <section
          id="ethnic_racial_background"
          data-cy="my-info-ethnic-racial-background"
        >
          <section-ethnic-or-racial-background
            :compData="pageData.ethnicOrRacial"
            v-model="form.ethnicOrRacialBackground"
          ></section-ethnic-or-racial-background>
        </section>
        <!-- END -->
        <hr class="my-space-md mb-lg-space-lg" />
        <!-- section US citizenship -->
        <section id="us_citizenship" data-cy="my-info-us-citizenship">
          <section-us-citizenship
            :compData="pageData.usCitizenship"
            v-model="form.usCitizenship"
            :homeAddress="form.homeAddress"
            :isFormSubmitClicked="formSubmitClicked"
            @updateErrorState="handleUsCitizenshipErrorState"
          ></section-us-citizenship>
        </section>
        <!-- END -->
        <hr class="my-space-md mb-lg-space-lg" />
        <!-- Section parent or legal guardian -->

        <!-- <template v-if="userAge <= 24"> -->
        <section
          id="parent_or_legal_guardian"
          data-cy="my-info-parent-legal-guardian"
          class="my-space-md"
        >
          <section-guardian-details
            :compData="pageData.guardian"
            v-model="form.guardians"
            :userAge="userAge"
            :isFormSubmitClicked="formSubmitClicked"
            :authToken="authToken"
            :appId="appId"
            @updateErrorState="handleGuardianDetailsErrorState"
          ></section-guardian-details>
        </section>
        <!-- </template> -->
        <!-- END -->

        <hr class="my-space-md mb-lg-space-lg" />
        <!-- Section Previous ASU Affiliation -->
        <section
          id="previous_asu_affiliation"
          data-cy="my-info-prevoius-asu-affiliation"
        >
          <section-previous-asu-affiliation
            :compData="pageData.asuAffiliation"
            v-model="form.asuAffiliation"
            :isFormSubmitClicked="formSubmitClicked"
            @updateErrorState="handleAsuAffiliationErrorState"
          ></section-previous-asu-affiliation>
        </section>
        <!-- END -->
        <hr class="my-space-md mb-lg-space-lg" />
        <!-- Section Affiliation to U.S. Uniformed Services -->
        <section
          id="us_uniformed_services"
          data-cy="my-info-us-uniformed-services"
        >
          <section-uniformerd-services
            :compData="pageData.usUniformedServices"
            v-model="form.usUniformedServices"
            :isFormSubmitClicked="formSubmitClicked"
            @updateErrorState="handleUniformedServicesErrorState"
          ></section-uniformerd-services>
        </section>
        <!-- END -->
        <hr class="my-space-md mb-lg-space-lg" />
        <!-- Section Partner benefits -->
        <section id="partner_benefits" data-cy="my-info-partner-benefits">
          <section-partner-benefits
            :compData="pageData.partnerBenefits"
            v-model="form.partnerBenefits"
            :isFormSubmitClicked="formSubmitClicked"
            @updateErrorState="handlePartnerBenefitsErrorState"
          ></section-partner-benefits>
        </section>
        <!-- END -->
        <hr class="my-space-md mb-lg-space-lg" />
      </div>
    </div>
    <!-- briteverify modal -->
    <b-modal
      lazy
      v-model="showBriteVerifyModal"
      centered
      hide-footer
      header-class="border-0 pb-0"
      body-class="px-lg-space-lg pb-space-md pt-0"
    >
      <div class="text-small" data-cy="my-info-briteverify-alert-modal">
        <p data-cy="my-info-briteverify-alert-modal-heading">
          <b>{{
            isBriteVerifyError.addressCorrected
              ? "The address you entered has been updated to:"
              : "The address you entered could not be verified:"
          }}</b>
        </p>
        <table
          class="table col-lg-10 col-12"
          data-cy="my-info-briteverify-alert-modal-address-table"
        >
          <!-- Address -->
          <template v-if="isBriteVerifyError.addressError">
            <tr>
              <td class="pl-0 border-0">Country</td>
              <td class="border-0">
                {{ this.briteverifiedAddress.countryCode.text }}
              </td>
            </tr>
            <tr>
              <td class="pl-0 text-dark-1">Address line 1</td>
              <td class="text-break">
                {{ this.briteverifiedAddress.street1 }}
              </td>
            </tr>
            <tr>
              <td class="pl-0 text-dark-1">Address line 2</td>
              <td class="text-break">
                {{ this.briteverifiedAddress.street2 }}
              </td>
            </tr>
            <tr>
              <td class="pl-0 text-dark-1">City</td>
              <td>
                {{ this.briteverifiedAddress.city }}
              </td>
            </tr>
            <tr>
              <td class="pl-0 text-dark-1">State</td>
              <td>
                {{ this.briteverifiedAddress.stateProvince.description }}
              </td>
            </tr>
            <tr>
              <td class="pl-0 text-dark-1">Zip/Postal code</td>
              <td>
                {{ this.briteverifiedAddress.postalCode }}
              </td>
            </tr>
          </template>
        </table>
      </div>
      <div class="d-flex bg-light-1 p-space-sm" data-cy="status-alert">
        <img
          src="@/assets/img/question-circle-solid.svg"
          alt="question circle"
          height="24px"
          class="my-auto"
        />
        <p class="text-small text-dark-1 mb-0 ml-space-sm my-auto">
          Would you like to change this information or submit it as is?
        </p>
      </div>
      <div class="form-actions text-right mt-space-sm pt-space-xxxs">
        <button
          class="btn btn-link text-dark-1 font-weight-bold p-0"
          @click="handleBriteValidationClose()"
          data-cy="my-info-briteverify-alert-modal-back-button"
        >
          Go back and change
        </button>
        <button
          class="btn btn-dark-3 px-space-sm ml-space-md"
          @click="handleBrightValidationIgnore()"
          data-cy="my-info-briteverify-alert-modal-submit-button"
        >
          Submit
        </button>
      </div>
    </b-modal>
  </main>
</template>

<script>
import pageData from "@/content/my-information.json";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { VBTooltip, BAlert } from "bootstrap-vue";
import * as _ from "lodash";
import { MyInfoConstants } from "@/content/enum-ug-application.js";
import { EnumPageNames, EnumApiConstants } from "@/content/enum-app.js";
import { mapActions, mapState } from "pinia";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { extractGoogleClientId } from "@/services/UtilityService.js";
import SectionLegalSex from "@/components/ugapp-components/my-information/SectionLegalSex.vue";
import SectionPrimaryLanguage from "@/components/ugapp-components/my-information/SectionPrimaryLanguage.vue";
import SectionPreviousAsuAffiliation from "@/components/ugapp-components/my-information/SectionPreviousAsuAffiliation.vue";
import SectionPartnerBenefits from "@/components/ugapp-components/my-information/SectionPartnerBenefits.vue";
import SectionGuardianDetails from "@/components/ugapp-components/my-information/SectionGuardianDetails.vue";
import SectionUsCitizenship from "@/components/ugapp-components/my-information/SectionUsCitizenship.vue";
import SectionFormerName from "@/components/ugapp-components/my-information/SectionFormerName.vue";
import SectionHomeAddress from "@/components/ugapp-components/my-information/SectionHomeAddress.vue";
import SectionUniformerdServices from "@/components/ugapp-components/my-information/SectionUniformerdServices.vue";
import SectionEthnicOrRacialBackground from "@/components/ugapp-components/my-information/SectionEthnicOrRacialBackground.vue";

export default {
  name: "UgAppMyInformationView",
  mixins: [validationMixin],
  directives: {
    "b-tooltip": VBTooltip,
  },
  components: {
    "section-legal-sex": SectionLegalSex,
    "section-primary-language": SectionPrimaryLanguage,
    "section-previous-asu-affiliation": SectionPreviousAsuAffiliation,
    "section-partner-benefits": SectionPartnerBenefits,
    "section-guardian-details": SectionGuardianDetails,
    "section-us-citizenship": SectionUsCitizenship,
    "section-former-name": SectionFormerName,
    "section-home-address": SectionHomeAddress,
    "section-uniformerd-services": SectionUniformerdServices,
    "section-ethnic-or-racial-background": SectionEthnicOrRacialBackground,
    "b-alert": BAlert,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      pageData: pageData,
      appId: null,
      toast: {
        show: false,
        variant: null,
        message: null,
      },
      showBriteVerifyModal: false,
      formSubmitClicked: false,
      // form variables
      isLegalSexComponentHasError: false,
      isPrimaryLanguageComponentHasError: false,
      isAsuAffiliationComponentHasError: false,
      isPartnerBenefitsComponentHasError: false,
      isGuardianDetailsComponentHasError: false,
      isUsCitizenshipComponentHasError: false,
      isFormerNameComponentHasError: false,
      isHomeAndAddressComponentHasError: false,
      isUniformedServicesComponentHasError: false,
      isBriteVerifyError: {
        addressError: false,
        addressCorrected: false,
        ignored: false,
        success: false,
      },
      briteverifiedAddress: null,
      form: {
        formerNames: [],
        legalSex: null,
        primaryLanguage: { selectValue: null, inputValue: null },
        homeAddress: {
          type: MyInfoConstants.permanentAddressType,
          countryCode: null,
          street1: null,
          street2: "",
          city: null,
          stateProvince: null,
          postalCode: null,
        },
        ethnicOrRacialBackground: {
          hispanicOrLatino: {
            isHispanicOrLatino: null,
            origin: null,
          },
          race: [],
          primaryRace: null,
        },
        usCitizenship: {
          isUsCitizen: null,
          countryOfBirth: null,
          ssn: null,
          typeOfVisa: null,
          countryOfCitizenShip: null,
          cityOfBirth: null,
          otherVisaChoices: null,
          issuingI20: null,
          intAddress: {
            type: MyInfoConstants.intAddressType,
            countryCode: null,
            street1: null,
            street2: "",
            city: null,
            stateProvince: null,
            postalCode: null,
          },
          shippingAddressType: null,
          shippingAddress: {
            type: MyInfoConstants.i20AddressType,
            countryCode: null,
            street1: null,
            street2: null,
            city: null,
            stateProvince: null,
            postalCode: null,
          },
        },
        guardians: [],
        asuAffiliation: {
          affiliations: [],
          affiliateId: null,
        },
        usUniformedServices: {
          relation: null,
          status: null,
          branch: null,
          appliedForBenefit: null,
          requestTranscript: null,
        },
        partnerBenefits: {
          educationBenefit: null,
          currentEmployer: null,
        },
      },
      initialFormData: {},
      isDataBindingComplete: false,
      footerSubmitActionListenner: null,
    };
  },
  watch: {
    form: {
      handler(newValue) {
        if (
          this.isDataBindingComplete &&
          (!_.isEqual(newValue, this.initialFormData) ||
            (!this.$v.$anyDirty && this.$v.$anyError))
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
  },
  validations: {
    isFormerNameComponentHasError: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
    isLegalSexComponentHasError: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
    isPrimaryLanguageComponentHasError: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
    isAsuAffiliationComponentHasError: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
    isHomeAndAddressComponentHasError: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
    isPartnerBenefitsComponentHasError: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
    isGuardianDetailsComponentHasError: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
    isUsCitizenshipComponentHasError: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
    isUniformedServicesComponentHasError: {
      required,
      hasError: function (value) {
        return !value;
      },
    },
  },
  computed: {
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useUgApplicationStore, {
      applicationFormerNames: "formerNames",
      applicationGuardians: "guardians",
      applicationMyInfoSar: "myInfoSar",
      applicationAddress: "address",
      applicationAsuAffiliations: "asuAffiliations",
      applicationCurrentScreen: "currentScreen",
      applicationPreviousScreen: "previousScreen",
      applicationMilitaryaffiliations: "militaryaffiliations",
      applicationVisaSupplementals: "visaSupplementals",
    }),
    ...mapState(useUserStore, {
      userSex: "sex",
      userPrimaryLanguageAtHomeOther: "primaryLanguageAtHomeOther",
      userVisaCode: "visaCode",
      userSsn: "ssn",
      userAsuId: "asuId",
      userAge: "userAge",
    }),
    ...mapState(useConfigStore, {
      configVisaPermitTypes: "visaPermitTypes",
      configCorporatePartners: "corporatePartners",
      configSelectedPrimaryLanguageAtHome: "selectedPrimaryLanguageAtHome",
      configSelectedHomeAddressCountry: "selectedHomeAddressCountry",
      configSelectedHomeAddressState: "selectedHomeAddressState",
      configSelectedInternationalAddressCountry:
        "selectedInternationalAddressCountry",
      configSelectedInternationalAddressState:
        "selectedInternationalAddressState",
      configSelectedShippingAddressCountry: "selectedShippingAddressCountry",
      configSelectedShippingAddressState: "selectedShippingAddressState",
      configSelectedBirthCountry: "selectedBirthCountry",
      configSelectedCitizenCountry: "selectedCitizenCountry",
      configSelectedCorporatePartner: "selectedCorporatePartner",
      configHomeAddressStates: "homeAddressStates",
    }),
    ...mapState(useAppStore, {
      apisCount: "apisCount",
      isApiCallsCancled: "isApiCallsCancled",
    }),
    isCurrentEmployerDetailsRequired() {
      return (
        this.form.partnerBenefits.educationBenefit?.value ===
        MyInfoConstants.partnerEducationBenefit
      );
    },
    shouldBriteVerify() {
      return ["USA", "CAN"].includes(this.form.homeAddress.countryCode.value);
    },
  },
  methods: {
    ...mapActions(useUgApplicationStore, {
      applicationSubmitMyInformation: "submitMyInformation",
      applicationPatchUiViewInfo: "patchUiViewInfo",
      applicationUpdateCurrentPageUnsavedChanges:
        "updateCurrentPageUnsavedChanges",
      applicationUpdateCurrentPageStatus: "updateCurrentPageStatus",
      applicationCreateNotification: "createNotification",
      applicationBriteVerifyValidation: "makeBriteVerifyValidation",
    }),
    ...mapActions(useConfigStore, {
      configSelectHomeAddressState: "selectHomeAddressState",
      configDeselectHomeAddressState: "deselectHomeAddressState",
    }),
    ...mapActions(useAppStore, {
      updateCancelApiCallsStatus: "updateCancelApiCallsStatus",
      resetProgressBarRequests: "resetProgressBarRequests",
      updateProgressBarLoaderTotalRequests:
        "updateProgressBarLoaderTotalRequests",
      updateProgressBarLoaderCurrentRequests:
        "updateProgressBarLoaderCurrentRequests",
      resetApiCallsCount: "resetApiCallsCount",
    }),
    handleFormerNameErrorState(value) {
      this.$v.isFormerNameComponentHasError.$model = value;
    },
    handleGuardianDetailsErrorState(value) {
      this.$v.isGuardianDetailsComponentHasError.$model = value;
    },
    handleUsCitizenshipErrorState(value) {
      this.$v.isUsCitizenshipComponentHasError.$model = value;
    },
    handleHomeAddressErrorState(value) {
      this.$v.isHomeAndAddressComponentHasError.$model = value;
    },
    handleUniformedServicesErrorState(value) {
      this.$v.isUniformedServicesComponentHasError.$model = value;
    },
    handleLegalSexErrorState(value) {
      this.$v.isLegalSexComponentHasError.$model = value;
    },
    handlePrimaryLanguageErrorState(value) {
      this.$v.isPrimaryLanguageComponentHasError.$model = value;
    },
    handleAsuAffiliationErrorState(value) {
      this.$v.isAsuAffiliationComponentHasError.$model = value;
    },
    handlePartnerBenefitsErrorState(value) {
      this.$v.isPartnerBenefitsComponentHasError.$model = value;
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
        current_screen: EnumPageNames.PageUndergradMyInformation,
        previous_screen: EnumPageNames.PageUndergradMyInformation,
      });

      // Calculating the total number of API's that will be called during the submit
      this.updateCancelApiCallsStatus(true);
      // Note: All the functions or stores actions which contains an API call is called here
      // to get the total count of the API calls that will be happening during the submit
      if (this.shouldBriteVerify && !this.isBriteVerifyError.ignored) {
        await this.handleBriteValidation();
      }
      await this.applicationSubmitMyInformation(
        this.authToken,
        this.appId,
        this.form
      );
      await this.createNotification();
      await this.updateUiViewInfo();
      this.updateCancelApiCallsStatus(false);
      this.updateProgressBarLoaderTotalRequests(this.apisCount);
      this.resetApiCallsCount();

      // TODO: ignoring brite verify integration
      if (this.shouldBriteVerify && !this.isBriteVerifyError.ignored) {
        await this.handleBriteValidation();
        if (!this.isBriteVerifyError.success) {
          this.updateProgressBarLoaderTotalRequests(0);
          this.updateProgressBarLoaderCurrentRequests(0);
          return;
        }
      }

      // step-1: submit my info record
      const formResponses = await this.applicationSubmitMyInformation(
        this.authToken,
        this.appId,
        this.form
      );
      let isSubmissionHasError = false;
      formResponses.forEach((error) => {
        if (error.value.code !== 200 && error.value.code !== 201) {
          isSubmissionHasError = true;
          // fire error data layer event
          this.triggerErrorGtm(error.value.code, error.value.errors);
        }
      });
      this.applicationUpdateCurrentPageUnsavedChanges(false);
      if (isSubmissionHasError) {
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
          newApplicationAccountCreation: true,
        }
      );
    },
    async updateUiViewInfo() {
      const payload = {
        appId: this.appId,
        currentScreen:
          this.applicationPreviousScreen === EnumPageNames.PageUndergradReview
            ? EnumPageNames.PageUndergradReview
            : EnumPageNames.PageUndergradMyProgram,
        previousScreen:
          this.applicationPreviousScreen === EnumPageNames.PageUndergradReview
            ? EnumPageNames.PageUndergradArizonaResidency
            : EnumPageNames.PageUndergradMyInformation,
      };
      return await this.applicationPatchUiViewInfo(
        this.authToken,
        this.appId,
        payload
      );
    },

    async updateHomeAddressWithState() {
      // address
      const homeAddress = this.applicationAddress(
        MyInfoConstants.permanentAddressType
      );
      if (homeAddress) {
        let address = { ...homeAddress };

        // selecting country
        if (this.configSelectedHomeAddressCountry) {
          address.countryCode = this.configSelectedHomeAddressCountry;
        }
        // selecting state
        if (this.configSelectedHomeAddressState) {
          address.stateProvince = this.configSelectedHomeAddressState;
        } else {
          address.stateProvince = homeAddress.stateProvince;
        }
        this.form.homeAddress = { ...address };
      }
    },
    async updateUsCitizenShipWithState() {
      // isUsCitizen
      if (this.configSelectedCitizenCountry) {
        let isUsCitizenOption = null;
        if (
          this.configSelectedCitizenCountry.value !==
          MyInfoConstants.usCountryCode
        ) {
          isUsCitizenOption = this.pageData.usCitizenship.options.filter(
            (option) => !option.value
          );
        } else {
          isUsCitizenOption = this.pageData.usCitizenship.options.filter(
            (option) => option.value
          );
        }
        this.form.usCitizenship.isUsCitizen = isUsCitizenOption[0];
      }
      // countryOfBirth
      if (this.configSelectedBirthCountry) {
        this.form.usCitizenship.countryOfBirth =
          this.configSelectedBirthCountry;
      }
      // SSN
      // If ssn already exist setting it to "000000000" as we are getting only "**********" as value from backend
      this.form.usCitizenship.ssn = this.userSsn ? "000000000" : null;
      // typeOfVisa
      if (this.userVisaCode) {
        const visa = this.pageData.usCitizenship.typeOfVisa.options.filter(
          (option) => option.visaPermitTypeCode === this.userVisaCode
        );
        if (visa.length > 0) {
          this.form.usCitizenship.typeOfVisa = visa[0];
        } else {
          this.form.usCitizenship.typeOfVisa =
            this.pageData.usCitizenship.typeOfVisa.options.filter(
              (option) =>
                option.visaPermitTypeCode === MyInfoConstants.visaPermitOther
            )[0];

          const otherVisaChoices = this.configVisaPermitTypes.filter(
            (visa) => visa.visaPermitTypeCode === this.userVisaCode
          );
          if (otherVisaChoices.length > 0) {
            this.form.usCitizenship.otherVisaChoices = otherVisaChoices[0];
          }
        }
      }
      // countryOfCitizenship
      if (this.configSelectedCitizenCountry) {
        this.form.usCitizenship.countryOfCitizenShip =
          this.configSelectedCitizenCountry;
      }
      // cityOfBirth
      this.form.usCitizenship.cityOfBirth =
        this.applicationMyInfoSar.usCitizenship.cityOfBirth;
      // issuingI20
      if (this.applicationVisaSupplementals?.studentVisaStatus) {
        const issuingI20 =
          this.pageData.usCitizenship.issuingI20.options.filter(
            (option) =>
              option.value ===
              this.applicationVisaSupplementals?.studentVisaStatus
          );
        if (issuingI20.length > 0) {
          this.form.usCitizenship.issuingI20 = issuingI20[0];
        }
      }
      //  Int address
      const intAddress = this.applicationAddress(
        MyInfoConstants.intAddressType
      );
      if (intAddress) {
        const internationalAddress = { ...intAddress };

        // selecting country
        if (this.configSelectedInternationalAddressCountry) {
          internationalAddress.countryCode =
            this.configSelectedInternationalAddressCountry;
        }
        // selecting state
        if (this.configSelectedInternationalAddressState) {
          internationalAddress.stateProvince =
            this.configSelectedInternationalAddressState;
        } else {
          internationalAddress.stateProvince = intAddress.stateProvince;
        }
        this.form.usCitizenship.intAddress = { ...internationalAddress };
      }
      // Shipping address
      const shippingAddress = this.applicationAddress(
        MyInfoConstants.i20AddressType
      );
      if (shippingAddress) {
        const shipAddress = { ...shippingAddress };

        // selecting country
        if (this.configSelectedShippingAddressCountry) {
          shipAddress.countryCode = this.configSelectedShippingAddressCountry;
        }
        // selecting states
        if (this.configSelectedShippingAddressState) {
          shipAddress.stateProvince = this.configSelectedShippingAddressState;
        } else {
          shipAddress.stateProvince = shippingAddress.stateProvince;
        }
        this.form.usCitizenship.shippingAddress = { ...shipAddress };
      }
    },
    updateGuardiansWithState() {
      this.applicationGuardians.forEach((ele) => {
        const data = { ...ele };
        const relation = this.pageData.guardian.guardianRelation.options.filter(
          (option) => option.value === data.guardianRelation
        );
        // relation
        if (relation.length > 0) {
          data.guardianRelation = relation[0];
        }
        // highestSchoolingLevel
        if (data.highestSchoolingLevel) {
          const schooling =
            this.pageData.guardian.highestSchoolingLevel.options.filter(
              (option) => option.text === data.highestSchoolingLevel
            );
          if (schooling.length > 0) {
            data.highestSchoolingLevel = schooling[0];
          }
        }
        // isLiving
        if (data.isLiving !== null) {
          const living = this.pageData.guardian.isLiving.options.filter(
            (option) => option.value === data.isLiving
          );
          if (living.length > 0) {
            data.isLiving = living[0];
          }
        }
        // previousAsuStudent
        if (data.previousAsuStudent !== null) {
          const asuStudent =
            this.pageData.guardian.previousAsuStudent.options.filter(
              (option) => option.value === data.previousAsuStudent
            );
          if (asuStudent.length > 0) {
            data.previousAsuStudent = asuStudent[0];
          }
        }
        this.form.guardians.push(data);
      });
    },
    updateAsuAffiliationWithState() {
      this.form.asuAffiliation.affiliations = this.applicationAsuAffiliations;
      this.form.asuAffiliation.affiliateId = this.userAsuId;
    },
    updateUsUniformedServicesWithState() {
      // relation and status
      const status = this.pageData.usUniformedServices.status.options.filter(
        (item) => item.value === this.applicationMilitaryaffiliations.status
      );
      let relation = null;
      if (status.length > 0) {
        this.form.usUniformedServices.status = status[0];
        relation = this.pageData.usUniformedServices.relation.options.filter(
          (item) =>
            item.value ===
            MyInfoConstants.uniformedService.serviceMemberOrVeteranValue
        );
      } else {
        relation = this.pageData.usUniformedServices.relation.options.filter(
          (item) => item.value === this.applicationMilitaryaffiliations.status
        );
      }
      this.form.usUniformedServices.relation =
        relation.length > 0 ? relation[0] : null;

      // Branch of service
      if (this.applicationMilitaryaffiliations.branch) {
        let options = null;

        if (
          this.applicationMilitaryaffiliations.status ===
          MyInfoConstants.uniformedService.statusNationalGuard
        ) {
          options =
            this.pageData.usUniformedServices.branch.nationalGuardOptions;
        } else if (
          this.applicationMilitaryaffiliations.status ===
          MyInfoConstants.uniformedService.statusArmedForces
        ) {
          options = this.pageData.usUniformedServices.branch.armedForceOptions;
        } else {
          options = this.pageData.usUniformedServices.branch.defaultOptions;
        }
        const selectedBranch = options.filter(
          (option) =>
            option.value === this.applicationMilitaryaffiliations.branch
        );
        this.form.usUniformedServices.branch =
          selectedBranch.length > 0 ? selectedBranch[0] : null;
      }
      // applied for benefits
      if (this.applicationMilitaryaffiliations.vaEducationBenefits) {
        const option =
          this.pageData.usUniformedServices.appliedForBenefit.options.filter(
            (option) =>
              option.value ===
              this.applicationMilitaryaffiliations.vaEducationBenefits
          );
        this.form.usUniformedServices.appliedForBenefit =
          option.length > 0 ? option[0] : null;
      }
      // requestTranscript
      if (this.applicationMilitaryaffiliations.jointServiceTranscript) {
        const option =
          this.pageData.usUniformedServices.requestTranscript.options.filter(
            (option) =>
              option.value ===
              this.applicationMilitaryaffiliations.jointServiceTranscript
          );
        this.form.usUniformedServices.requestTranscript =
          option.length > 0 ? option[0] : null;
      }
    },
    updatePartnerBenefitsWithState() {
      // educationBenefit
      if (this.applicationMyInfoSar.partnerBenefits.educationBenefit) {
        const educationBenefit = this.pageData.partnerBenefits.options.filter(
          (option) =>
            option.value ===
            this.applicationMyInfoSar.partnerBenefits.educationBenefit
        );
        if (educationBenefit.length > 0) {
          this.form.partnerBenefits.educationBenefit = educationBenefit[0];
        }
      }
      // currentEmployer
      if (this.configSelectedCorporatePartner) {
        this.form.partnerBenefits.currentEmployer =
          this.configSelectedCorporatePartner;
      }
    },
    async handleBriteValidation() {
      // resetting the error fields
      this.isBriteVerifyError.addressError = false;
      this.isBriteVerifyError.addressCorrected = false;
      this.briteverifiedAddress = null;
      try {
        const payload = {
          address: {
            address1: this.form.homeAddress?.street1 || " ",
            address2: this.form.homeAddress?.street2 || " ",
            city: this.form.homeAddress?.city || " ",
            state: this.form.homeAddress?.stateProvince?.stateCode || " ",
            zip: this.form.homeAddress?.postalCode || " ",
          },
        };
        const briteValidationPromise = [];
        briteValidationPromise.push(this.validateAddressAndPhone(payload));
        const reqSettled = await Promise.allSettled(briteValidationPromise);
        reqSettled.forEach((fulfilled) => {
          if (fulfilled.status === "rejected") {
            throw fulfilled.reason;
          }
        });
        this.isBriteVerifyError.success = !this.isBriteVerifyError.addressError;
        this.showBriteVerifyModal = !this.isBriteVerifyError.success;
      } catch (err) {
        // checking if the API's are cancled for calculating the API count for progress bar
        // so that default briteverify ignore is not triggred
        if (!this.isApiCallsCancled) {
          this.toast = {
            show: true,
            message:
              "Something went wrong while validating address. Please try again later.",
            variant: "danger",
          };
          this.handleBrightValidationIgnore();
        }
      }
    },
    async handleBriteValidationClose() {
      this.showBriteVerifyModal = false;
      this.isBriteVerifyError.ignored = false;
      this.isBriteVerifyError.success = false;
    },
    async handleBrightValidationIgnore() {
      this.showBriteVerifyModal = false;
      this.isBriteVerifyError.ignored = true;
      this.isBriteVerifyError.success = false;
      // if address corrected, appending the corrected address details to the form field
      if (this.isBriteVerifyError.addressCorrected) {
        this.form.homeAddress = this.briteverifiedAddress;
        // Selecting the state in config store
        this.configDeselectHomeAddressState();
        this.configSelectHomeAddressState(this.form.homeAddress.stateProvince);
      }
      await this.handleSaveClick();
    },
    async validateAddressAndPhone(payload) {
      const { data } = await this.applicationBriteVerifyValidation(payload);
      // storing the copy of user entered address
      this.briteverifiedAddress = _.cloneDeep(this.form.homeAddress);
      // if any data is corrected by briteverify updating it
      if (data.address?.status === "valid" && data.address.corrected === true) {
        this.briteverifiedAddress.street1 = data.address?.address1 || " ";
        this.briteverifiedAddress.street2 = data.address?.address2 || " ";
        this.briteverifiedAddress.city = data.address?.city || " ";
        this.briteverifiedAddress.postalCode = data.address?.zip || " ";
        // state
        if (this.configHomeAddressStates.length > 0) {
          const state = this.configHomeAddressStates.filter(
            (item) => item.value === data.address?.state
          );
          if (state.length > 0) {
            this.briteverifiedAddress.stateProvince = state[0];
          }
        } else {
          this.briteverifiedAddress.stateProvince = data.address?.state;
        }
        // updating the addressCorrected status field to true
        this.isBriteVerifyError.addressCorrected = true;
      }
      if (data.address?.status !== "valid" || data.address.corrected === true) {
        this.isBriteVerifyError.addressError = true;
      }
    },
    triggerErrorGtm(code, errors) {
      this.$track({
        event: "app_error",
        action: "my_information",
        location: this.$router.currentRoute.fullPath,
        code: code,
        message: errors?.toString(),
      });
    },
  },
  metaInfo() {
    return {
      title: `${this.pageData.title} | Undergraduate Application`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  async created() {
    this.footerSubmitActionListenner = useUgApplicationStore().$onAction(
      async ({ name }) => {
        if (name === "submitForm") {
          this.handleSaveClick();
        }
      }
    );

    this.appId = this.$route.params.id;
    // Former names
    this.form.formerNames = this.applicationFormerNames;
    // legalsex
    const legalSex = this.pageData.legalSex.options.filter(
      (item) => item.value === this.userSex
    );
    this.form.legalSex = legalSex.length > 0 ? legalSex[0] : null;
    // primary language
    this.form.primaryLanguage.selectValue =
      this.configSelectedPrimaryLanguageAtHome;
    this.form.primaryLanguage.inputValue = this.userPrimaryLanguageAtHomeOther;
    // Guardians
    const response = await Promise.allSettled([
      this.updateGuardiansWithState(),
      this.updateHomeAddressWithState(),
      this.updateUsCitizenShipWithState(),
      this.updateUsUniformedServicesWithState(),
      this.updateAsuAffiliationWithState(),
      this.updatePartnerBenefitsWithState(),
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
.my-information-page {
  border-radius: 19px;
}
</style>

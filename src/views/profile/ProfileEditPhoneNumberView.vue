<template>
  <main id="main-content" data-cy="profile-edit-phone-number-view">
    <section class="py-space-lg">
      <div class="container">
        <div class="col-12 offset-lg-3 col-lg-6">
          <div class="row">
            <div class="col-12">
              <p class="bg-dark-3 text-light-1 d-inline p-space-xxxs">
                Applicant profile
              </p>

              <hr class="my-space-md" />

              <!-- alert -->
              <base-alert
                v-if="alert.show"
                :alert-type="alert.type"
                :text="alert.text"
                @dismissed="handleAlertDismissedEvent"
                data-cy="profile-edit-phone-number-alert"
              ></base-alert>

              <!-- form -->
              <div id="update-phone-number-form-container">
                <b-form
                  id="update-phone-number-form"
                  novalidate
                  @submit.stop.prevent="handledUpdatePhoneNumberSubmit"
                >
                  <!-- main phone number -->
                  <base-input-phone-number
                    id="main_phone"
                    v-model="$v.form.mainPhone.$model"
                    label="Phone number"
                    label-size="large"
                    :countries="configCountries"
                    :returnThreeLetterCountryCode="true"
                    :onErrorMsg="mainPhoneErrorMessage($v.form.mainPhone)"
                    data-cy="profile-edit-phone-number-main-phone"
                  ></base-input-phone-number>

                  <!-- is this a mobile number -->
                  <b-form-group
                    id="group_is_a_mobile_number"
                    aria-label="Is this a mobile number?"
                    label-class="pb-0"
                    class="mb-0 position-relative mt-space-sm mt-lg-space-md mb-space-xxs mb-lg-space-xs"
                    data-cy="profile-edit-phone-number-is-a-mobile-number"
                  >
                    <template #label>
                      <label for="is_a_mobile_number" class="mb-space-xs">
                        <p class="text-large font-weight-bold mb-0">
                          Is this a mobile number?
                        </p>
                      </label>
                    </template>
                    <base-radio-group
                      name="is_a_mobile_number"
                      :options="radioOptions"
                      v-model="$v.form.isMobileNumberEntered.$model"
                      aria-describedby="input-live-help input-live-feedback"
                      :class="{
                        'is-invalid':
                          $v.form.isMobileNumberEntered.$dirty &&
                          $v.form.isMobileNumberEntered.$error,
                      }"
                      @change="handleIsMobileNumberStatusChange"
                    >
                    </base-radio-group>
                    <b-form-invalid-feedback
                      v-if="!$v.form.isMobileNumberEntered.required"
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      This is a required field.
                    </b-form-invalid-feedback>
                  </b-form-group>

                  <!-- Mobile phone number -->
                  <template v-if="isMobilePhoneVisible">
                    <base-input-phone-number
                      id="mobile_phone"
                      v-model="$v.form.mobilePhone.$model"
                      label="Mobile phone number"
                      label-size="large"
                      :isOptional="true"
                      :countries="configCountries"
                      :returnThreeLetterCountryCode="true"
                      class="mb-space-sm mb-lg-space-md"
                      :onErrorMsg="mobilePhoneErrorMessage($v.form.mobilePhone)"
                      data-cy="profile-edit-phone-number-mobile-phone"
                    ></base-input-phone-number>
                  </template>

                  <!-- receive info vis SMS -->
                  <b-form-group
                    id="group_receive_info_via_sms"
                    aria-label="Want to stay engaged with ASU via SMS messaging?"
                    label-class="pb-0"
                    class="mb-0 position-relative mb-space-md mb-lg-space-lg"
                    data-cy="profile-edit-phone-number-receive-info-via-sms"
                  >
                    <template #label>
                      <label for="receive_info_via_sms" class="mb-space-xs">
                        <p class="text-large font-weight-bold mb-0">
                          Want to stay engaged with ASU via SMS messaging?
                        </p>
                      </label>
                    </template>
                    <base-radio-group
                      name="receive_info_via_sms"
                      :options="radioOptions"
                      v-model="$v.form.receiveInfoBySMS.$model"
                      aria-describedby="input-live-help input-live-feedback"
                      :class="{
                        'is-invalid':
                          $v.form.receiveInfoBySMS.$dirty &&
                          $v.form.receiveInfoBySMS.$error,
                      }"
                    >
                    </base-radio-group>
                    <b-form-invalid-feedback
                      v-if="!$v.form.receiveInfoBySMS.required"
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      This is a required field.
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <!-- form-cta -->
                  <div>
                    <b-button
                      type="submit"
                      variant="dark-3"
                      class="px-space-sm mr-space-md"
                      :disabled="submitDisabled"
                      data-cy="profile-edit-phone-number-submit-button"
                    >
                      <div v-if="!showLoader" class="d-inline">
                        <span class="mr-space-xxs">Save</span>
                      </div>
                      <div v-else class="d-inline">
                        <span>Saving </span>
                        <span
                          class="spinner-grow spinner-grow-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span class="sr-only">Loading...</span>
                        <span
                          class="spinner-grow spinner-grow-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span class="sr-only">Loading...</span>
                        <span
                          class="spinner-grow spinner-grow-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span class="sr-only">Loading...</span>
                      </div>
                    </b-button>
                    <router-link
                      :to="{ name: EnumPageNames.PageProfile }"
                      class="text-decoration-none text-dark-1 font-weight-bold"
                      data-cy="profile-edit-phone-number-cancel-button"
                    >
                      Cancel
                    </router-link>
                  </div>
                </b-form>
              </div>
            </div>
          </div>
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
        <div
          class="text-small"
          data-cy="profile-update-phone-number-briteverify-alert-modal"
        >
          <!-- Phone numbers -->
          <p
            v-if="
              isBriteVerifyError.mainPhoneError ||
              isBriteVerifyError.mobilePhoneError
            "
            data-cy="profile-update-phone-number-briteverify-alert-modal-heading"
          >
            <b>The phone number you entered could not be verified:</b>
          </p>
          <table
            class="briteverify-modal-table border-0 table col-lg-10 col-12"
            data-cy="my-profile-phone-number-update-briteverify-alert-modal-phone-table"
          >
            <tr v-if="isBriteVerifyError.mainPhoneError" class="border-bottom">
              <td class="pl-0 text-dark-1">Phone number</td>
              <td>
                {{ this.mainPhone }}
              </td>
            </tr>
            <tr v-if="isBriteVerifyError.mobilePhoneError">
              <td class="pl-0 text-dark-1">Mobile phone</td>
              <td>{{ this.mobilePhone }}</td>
            </tr>
          </table>
        </div>
        <div class="d-flex bg-light-1 p-space-sm">
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
            @click="handleBriteValidationModalClose()"
            data-cy="profile-update-phone-number-briteverify-alert-modal-back-button"
          >
            Go back and change
          </button>
          <button
            class="btn btn-dark-3 px-space-sm ml-space-md"
            @click="handleBriteValidationModalSubmit()"
            data-cy="profile-update-phone-number-briteverify-alert-modal-submit-button"
          >
            Submit
          </button>
        </div>
      </b-modal>
    </section>
  </main>
</template>

<script>
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInvalidFeedback,
} from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import BaseInputPhoneNumber from "@/components/base-components/BaseInputPhoneNumber.vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import { EnumPageNames } from "@/content/enum-app.js";
import {
  EnumNameTypes,
  MyInfoConstants,
} from "@/content/enum-ug-application.js";
import { useUserStore } from "@/stores/user-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { mapActions, mapState } from "pinia";

export default {
  name: "ProfileEditPhoneNumberView",
  mixins: [validationMixin],
  components: {
    "b-form": BForm,
    "b-form-group": BFormGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-button": BButton,
    "base-alert": BaseAlert,
    "base-input-phone-number": BaseInputPhoneNumber,
    "base-radio-group": BaseRadioGroup,
  },
  metaInfo() {
    return {
      title: "Profile | Edit Phone NUmber",
      titleTemplate: "%s - Arizona State University",
    };
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      showLoader: false,
      submitDisabled: false,
      alert: {
        show: false,
        text: null,
        type: "error",
      },
      radioOptions: [
        {
          text: "Yes",
          value: "Y",
        },
        {
          text: "No",
          value: "N",
        },
      ],
      mainPhone: null,
      mobilePhone: null,
      isBriteVerifyError: {
        mainPhoneError: false,
        mobilePhoneError: false,
        ignored: false,
        success: false,
      },
      showBriteVerifyModal: false,
      form: {
        mainPhone: {
          phoneType: EnumNameTypes.mainPhoneType,
          countryCode: null,
          areaCode: null,
          phoneNumber: null,
          isValid: false,
        },
        isMobileNumberEntered: null,
        mobilePhone: {
          phoneType: EnumNameTypes.mobilePhoneType,
          countryCode: null,
          areaCode: null,
          phoneNumber: null,
          isValid: false,
        },
        receiveInfoBySMS: null,
      },
    };
  },
  validations: {
    form: {
      mainPhone: {
        isValid: {
          required,
          hasError: function (value) {
            return value;
          },
        },
      },
      isMobileNumberEntered: {
        required,
      },
      mobilePhone: {
        isValid: {
          required,
          hasError: function (value) {
            return (
              value ||
              !this.isMobilePhoneVisible ||
              (!this.form.mobilePhone.areaCode &&
                !this.form.mobilePhone.phoneNumber)
            );
          },
        },
        notSameAsMain: function (value) {
          return (
            !this.isMobilePhoneVisible ||
            value.countryCode !== this.form.mainPhone.countryCode ||
            value.areaCode !== this.form.mainPhone.areaCode ||
            value.phoneNumber !== this.form.mainPhone.phoneNumber
          );
        },
      },
      receiveInfoBySMS: {
        required,
      },
    },
  },
  computed: {
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useUserStore, {
      userPhone: "phone",
      userReceiveInfoBySMS: "receiveInfoBySMS",
    }),
    ...mapState(useAppStore, {
      selectedUndergradApplicationId: "selectedUndergradApplicationId",
    }),
    ...mapState(useConfigStore, {
      selectedHomeAddressCountry: "selectedHomeAddressCountry",
      configCountries: "countries",
    }),
    ...mapState(useUgApplicationStore, {
      applicationAddress: "address",
    }),
    isMobilePhoneVisible() {
      return this.form.isMobileNumberEntered?.value === "N";
    },
    shouldBriteVerify() {
      const phones = [
        {
          ...this.form.mainPhone,
        },
        {
          ...this.form.mobilePhone,
        },
      ];
      return phones.find(
        (item) =>
          item.countryCode === EnumNameTypes.UsCountryCode ||
          item.countryCode === EnumNameTypes.CaCountryCode
      );
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      submitUserPhoneDetails: "submitPhoneDetails",
      submitUserReceiveInfoBySMS: "submitReceiveInfoBySMS",
    }),
    ...mapActions(useUgApplicationStore, {
      applicationBriteVerifyValidation: "makeBriteVerifyValidation",
    }),
    ...mapActions(useConfigStore, {
      populateHomeAddressCountries: "populateHomeAddressCountries",
      selectHomeAddressCountry: "selectHomeAddressCountry",
    }),
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
      updateisGeneralLoaderVisibleStatus: "updateisGeneralLoaderVisibleStatus",
    }),
    async initializeFormValues() {
      // initialize form models with state value

      const mainPhone = this.userPhone(EnumNameTypes.mainPhoneType);
      const mobilePhone = this.userPhone(EnumNameTypes.mobilePhoneType);

      // if mainPhone/mobilePhone dosent contain country code value getting the permanent address country to pre populate the phone fields
      if (
        mainPhone &&
        !mainPhone.countryCode &&
        !this.selectedHomeAddressCountry
      ) {
        await this.populateHomeAddressCountries();
        const homeAddress = this.applicationAddress(
          MyInfoConstants.permanentAddressType
        );
        if (homeAddress) {
          this.selectHomeAddressCountry({
            countryCode: homeAddress.countryCode,
          });
        }
      }

      // main phone number
      if (mainPhone) {
        this.form.mainPhone.countryCode = mainPhone.countryCode
          ? mainPhone.countryCode
          : this.selectedHomeAddressCountry?.countryCodeTwoChar;
        this.form.mainPhone.areaCode = mainPhone.areaCode;
        this.form.mainPhone.phoneNumber = mainPhone.phoneNumber;
      }
      // mobile phone
      if (mobilePhone) {
        this.form.mobilePhone.countryCode = mobilePhone.countryCode
          ? mobilePhone.countryCode
          : this.selectedHomeAddressCountry?.countryCodeTwoChar;
        this.form.mobilePhone.areaCode = mobilePhone.areaCode;
        this.form.mobilePhone.phoneNumber = mobilePhone.phoneNumber;
      }
      // is this a mobile phone
      // checking if main and mobile phone are contains same value if so then this field value is yes
      if (mainPhone) {
        const isBothNumbersSame =
          mainPhone.phoneNumber === mobilePhone?.phoneNumber &&
          mainPhone.areaCode === mobilePhone?.areaCode &&
          mainPhone.countryCode === mobilePhone?.countryCode;

        this.form.isMobileNumberEntered = this.radioOptions.filter((item) =>
          isBothNumbersSame ? item.value === "Y" : item.value === "N"
        )[0];
        // Stay engaged via sms
        const receiveInfoBySms = this.radioOptions.filter((item) => {
          if (this.userReceiveInfoBySMS) {
            return item.value === this.userReceiveInfoBySMS;
          } else {
            return item.value === "N";
          }
        });
        this.form.receiveInfoBySMS =
          receiveInfoBySms.length > 0 ? receiveInfoBySms[0] : null;
      }
    },
    async handledUpdatePhoneNumberSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.updateisGeneralLoaderVisibleStatus(false);
      this.submitDisabled = true;
      this.showLoader = true;

      try {
        if (!this.isBriteVerifyError.ignored) {
          await this.handleBriteValidation();
          if (
            !this.isBriteVerifyError.success &&
            !this.isBriteVerifyError.ignored
          ) {
            this.showLoader = false;
            this.submitDisabled = false;
            this.updateisGeneralLoaderVisibleStatus(true);
            return;
          }
        }
        // if MAIN number is mobile number saving the same number in mobile number as well
        if (this.form.isMobileNumberEntered.value === "Y") {
          this.form.mobilePhone.countryCode = this.form.mainPhone.countryCode;
          this.form.mobilePhone.areaCode = this.form.mainPhone.areaCode;
          this.form.mobilePhone.phoneNumber = this.form.mainPhone.phoneNumber;
        }

        const phones = [
          {
            ...this.form.mainPhone,
          },
          {
            ...this.form.mobilePhone,
          },
        ];

        const promisses = [
          Promise.resolve(
            this.submitUserPhoneDetails(
              this.authToken,
              this.selectedUndergradApplicationId,
              phones
            )
          ),
          Promise.resolve(
            this.submitUserReceiveInfoBySMS(
              this.authToken,
              this.selectedUndergradApplicationId,
              this.form.receiveInfoBySMS?.value
            )
          ),
        ];

        const promiseResults = await Promise.allSettled(promisses);
        promiseResults.forEach((result) => {
          if (result.value.code >= 400 && result.value.code <= 599) {
            this.alert.text = result.value.errors[0];
            this.alert.type = "error";
            this.alert.show = true;
            throw new Error(result.value?.errors);
          }
        });
        this.updateisGeneralLoaderVisibleStatus(true);
        this.$router.push({ name: this.EnumPageNames.PageProfile });
      } catch (error) {
        // reset form values with state value
        this.initializeFormValues();

        // reset vuelidate validations
        this.$v.form.$reset();

        // reset showLoader and submitDisabled
        this.showLoader = false;
        this.submitDisabled = false;
        this.updateisGeneralLoaderVisibleStatus(true);
      }
    },
    async handleBriteValidation() {
      if (!this.shouldBriteVerify) {
        this.handleBrightValidationIgnore();
        return;
      }
      // resetting the error fields
      this.isBriteVerifyError.mainPhoneError = false;
      this.isBriteVerifyError.mobilePhoneError = false;

      let mobilePhone;
      let mainPhone;
      // main Phone
      if (
        this.form.mainPhone.countryCode === EnumNameTypes.UsCountryCode ||
        this.form.mainPhone.countryCode === EnumNameTypes.CaCountryCode
      ) {
        // if country code is USA adding the dailcode and areacode along with the phone number
        if (this.form.mainPhone.countryCode === EnumNameTypes.UsCountryCode) {
          mainPhone =
            "+1" +
            this.form.mainPhone.areaCode +
            this.form.mainPhone.phoneNumber;
        } else {
          mainPhone = this.form.mainPhone.phoneNumber;
        }
      }
      // mobile Phone
      if (
        this.form.mobilePhone.countryCode === EnumNameTypes.UsCountryCode ||
        this.form.mobilePhone.countryCode == EnumNameTypes.CaCountryCode
      ) {
        // if country code is USA adding the dailcode and areacode along with the phone number
        if (this.form.mobilePhone.countryCode === EnumNameTypes.UsCountryCode) {
          mobilePhone =
            "+1" +
            this.form.mobilePhone.areaCode +
            this.form.mobilePhone.phoneNumber;
        } else {
          mobilePhone = this.form.mobilePhone.phoneNumber;
        }
      }
      this.mobilePhone = mobilePhone;
      this.mainPhone = mainPhone;

      try {
        const briteValidationPromise = [];
        if (mainPhone) {
          briteValidationPromise.push(
            this.validatePhone({ phone: mainPhone }, "mainPhone")
          );
        }
        // checking if the isMobile number entered value is N
        if (mobilePhone && this.form.isMobileNumberEntered.value === "N") {
          briteValidationPromise.push(
            this.validatePhone(
              {
                phone: mobilePhone,
              },
              "mobilePhone"
            )
          );
        }
        const reqSettled = await Promise.allSettled(briteValidationPromise);
        reqSettled.forEach((fulfilled) => {
          if (fulfilled.status === "rejected") {
            throw fulfilled.reason;
          }
        });
        this.isBriteVerifyError.success = !(
          this.isBriteVerifyError.mainPhoneError ||
          this.isBriteVerifyError.mobilePhoneError
        );
        this.showBriteVerifyModal = !this.isBriteVerifyError.success;
      } catch (err) {
        this.handleBrightValidationIgnore();
      }
    },
    async handleBrightValidationIgnore() {
      this.showBriteVerifyModal = false;
      this.isBriteVerifyError.ignored = true;
      this.isBriteVerifyError.success = false;
    },
    async handleBriteValidationModalClose() {
      this.showBriteVerifyModal = false;
      this.isBriteVerifyError.ignored = false;
      this.isBriteVerifyError.success = false;
    },
    async handleBriteValidationModalSubmit() {
      this.handleBrightValidationIgnore();
      await this.handledUpdatePhoneNumberSubmit();
    },
    async validatePhone(payload, phoneType) {
      const { data } = await this.applicationBriteVerifyValidation(payload);
      if (data.phone.status !== "valid") {
        if (phoneType === "mainPhone") {
          this.isBriteVerifyError.mainPhoneError = true;
        } else {
          this.isBriteVerifyError.mobilePhoneError = true;
        }
      }
    },
    handleAlertDismissedEvent() {
      this.alert.show = false;
    },
    handleIsMobileNumberStatusChange(event) {
      if (event.value === "N") {
        this.form.mobilePhone.countryCode = null;
        this.form.mobilePhone.areaCode = null;
        this.form.mobilePhone.phoneNumber = null;
      }
    },
    mainPhoneErrorMessage(error) {
      const messages = [];
      if (error.$dirty && !error.$model.phoneNumber && !error.$model.areaCode) {
        messages.push("This is a required field.");
      } else if (error.$dirty && error.isValid.$invalid) {
        messages.push("Enter a valid phone number.");
      }
      return messages;
    },
    mobilePhoneErrorMessage(error) {
      const messages = [];
      if (error.$dirty && error.isValid.$invalid) {
        messages.push("Enter a valid phone number.");
      } else if (error.$dirty && !error.notSameAsMain) {
        messages.push("Mobile number should not be same as phone number.");
      }
      return messages;
    },
  },
  created() {
    this.initializeFormValues();
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
};
</script>

<style lang="scss" scoped>
.briteverify-modal-table {
  th,
  td {
    border-style: none;
  }
}
</style>

<template>
  <section class="py-space-lg">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <p class="mb-space-md mb-lg-space-lg text-large">
            Begin your new application by providing your legal name and
            birthday.
          </p>

          <!-- error-alert -->
          <base-alert
            v-if="alert.show"
            :alert-type="alert.type"
            :text="alert.text"
            @dismissed="handleAlertDismissedEvent"
          ></base-alert>

          <div id="create-application-form-container">
            <b-form
              id="create-application-form"
              novalidate
              @submit.stop.prevent="handleCreateApplicationSubmit"
            >
              <!-- row: firstName && preferredFirstName -->
              <b-form-row>
                <!-- firstName -->
                <div class="col-12 col-lg-5">
                  <b-form-group
                    data-cy="create-application-first-name-group"
                    id="first-name-group"
                    aria-label="first name group"
                    label="First name"
                    label-for="first-name"
                    label-class="font-weight-bold"
                    class="position-relative mb-0 pb-space-sm"
                  >
                    <template #label>
                      <label
                        for="preferred-first-name"
                        class="font-weight-bold"
                      >
                        First name
                        <span
                          class="ml-space-xs tool-tip-icon"
                          tabindex="0"
                          v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
                          title="This is your name that appears on documents such as your birth certificate or social security card. This is required to match your application to your transcripts."
                        >
                          <font-awesome-icon
                            icon="fa-sharp fa-solid fa-circle-info"
                            size="xl"
                            class="fa-icon text-dark-1"
                          />
                        </span>
                      </label>
                    </template>
                    <b-form-input
                      id="first-name"
                      type="text"
                      placeholder="Enter your legal first name"
                      v-model="$v.form.firstName.$model"
                      :state="
                        $v.form.firstName.$dirty
                          ? !$v.form.firstName.$error
                          : null
                      "
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      {{ firstNameErrorMessage }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </div>
                <!-- preferredFirstName -->
                <div class="col-12 offset-lg-1 col-lg-6">
                  <b-form-group
                    data-cy="create-application-preferred-first-name-group"
                    id="preferred-first-name-group"
                    aria-label="preferred first name group"
                    label-for="preferred-first-name"
                    label-class="font-weight-bold"
                    class="mb-space-md"
                  >
                    <template #label>
                      <label
                        for="preferred-first-name"
                        class="font-weight-bold"
                      >
                        Preferred first name
                        <span
                          class="ml-space-xs bg-light-3 text-xs px-space-xxs py-lg-space-xxxs font-weight-normal"
                        >
                          Optional
                        </span>
                        <span
                          class="ml-space-xs tool-tip-icon"
                          tabindex="0"
                          v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
                          title="Fill out this field if the first name you prefer to be called is different from your legal first name."
                        >
                          <font-awesome-icon
                            icon="fa-sharp fa-solid fa-circle-info"
                            size="xl"
                            class="fa-icon text-dark-1"
                          />
                        </span>
                      </label>
                    </template>
                    <b-form-input
                      id="preferred-first-name"
                      v-model="$v.form.preferredFirstName.$model"
                      type="text"
                      placeholder="Enter your preferred first name"
                      :state="
                        $v.form.preferredFirstName.$dirty
                          ? !$v.form.preferredFirstName.$error
                          : null
                      "
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      {{ preferredFirstNameErrorMessage }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </div>
              </b-form-row>

              <!-- row: middleName && lastName -->
              <b-form-row>
                <div class="col-12 col-lg-5">
                  <b-form-group
                    data-cy="create-application-middle-name-group"
                    id="middle-name-group"
                    aria-label="middle name group"
                    label-for="middle-name"
                    label-class="font-weight-bold"
                    class="mb-space-md"
                  >
                    <template #label>
                      <label for="middle-name" class="font-weight-bold">
                        Middle name
                        <span
                          class="ml-space-xs bg-light-3 text-xs px-space-xxs py-lg-space-xxxs font-weight-normal"
                        >
                          Optional
                        </span>
                      </label>
                    </template>
                    <b-form-input
                      id="middle-name"
                      v-model="$v.form.middleName.$model"
                      type="text"
                      placeholder="Enter your legal middle name"
                      :state="
                        $v.form.middleName.$dirty
                          ? !$v.form.middleName.$error
                          : null
                      "
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      {{ middleNameErrorMessage }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </div>

                <!-- lastName -->
                <div class="col-12 offset-lg-1 col-lg-6">
                  <!-- lastName -->
                  <b-form-group
                    data-cy="create-application-last-name-group"
                    id="last-name-group"
                    aria-label="last name group"
                    label="Last name"
                    label-for="last-name"
                    label-class="font-weight-bold mb-space-xs"
                    class="position-relative mb-0 pb-space-sm"
                  >
                    <b-form-input
                      id="last-name"
                      type="text"
                      placeholder="Enter your legal last name"
                      v-model="$v.form.lastName.$model"
                      :state="
                        $v.form.lastName.$dirty
                          ? !$v.form.lastName.$error
                          : null
                      "
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      {{ lastNameErrorMessage }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </div>
              </b-form-row>

              <!-- row: suffix && dateOfBirth -->
              <b-form-row>
                <!-- suffix -->
                <div class="col-12 col-lg-5">
                  <b-form-group
                    data-cy="create-application-suffix-group"
                    id="suffix-group"
                    aria-label="suffix group"
                    class="mb-space-md"
                    label-for="suffix"
                  >
                    <template #label>
                      <label for="suffix" class="font-weight-bold">
                        Suffix
                        <span
                          class="ml-space-xs bg-light-3 text-xs px-space-xxs py-lg-space-xxxs font-weight-normal"
                        >
                          Optional
                        </span>
                      </label>
                    </template>

                    <base-select
                      id="create-application-suffix-select"
                      v-model="form.suffix"
                      :options="suffixOptions"
                      placeholder-text="Please select one"
                    ></base-select>
                  </b-form-group>
                </div>

                <!-- dob -->
                <div class="col-12 offset-lg-1 col-lg-6">
                  <p class="mb-space-xs font-weight-bold">Birthday</p>

                  <div
                    class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center"
                  >
                    <!-- month -->
                    <b-form-group
                      data-cy="create-application-birth-month-group"
                      id="month-group"
                      aria-label="month-group"
                      class="col-12 col-lg-5 px-0 pl-lg-0 pr-lg-space-xs position-relative mb-0 pb-space-sm"
                    >
                      <base-select
                        id="create-application-birth-month"
                        v-model="$v.form.birthMonth.$model"
                        :options="monthOptions"
                        placeholder-text="Month"
                        @input="handleBirthdayMonthInput"
                        :on-error-msg="birthdayMonthErrorMessages"
                      ></base-select>
                    </b-form-group>

                    <!-- day -->
                    <b-form-group
                      data-cy="create-application-birth-day-group"
                      id="day-group"
                      aria-label="day-group"
                      class="col-12 col-lg-3 px-0 pl-lg-0 pr-lg-space-xs position-relative mb-0 pb-space-sm"
                    >
                      <base-select
                        id="create-application-birth-day"
                        v-model="$v.form.birthDay.$model"
                        :options="birthdayDayOptions"
                        placeholder-text="Day"
                        :on-error-msg="birthdayDayErrorMessages"
                      ></base-select>
                    </b-form-group>

                    <!-- year -->
                    <b-form-group
                      data-cy="create-application-birth-year-group"
                      id="year-group"
                      aria-label="year-group"
                      class="col-12 col-lg-4 px-0 position-relative mb-0 pb-space-sm"
                    >
                      <base-select
                        id="create-application-birth-year"
                        v-model="$v.form.birthYear.$model"
                        :options="birthdayYearOptions"
                        placeholder-text="Year"
                        :on-error-msg="birthdayYearErrorMessages"
                        @input="handleBirthdayYearInput"
                      ></base-select>
                    </b-form-group>
                  </div>
                </div>
              </b-form-row>
              <!-- row: Phone number && is this a mobile number -->
              <b-form-row>
                <!-- main phone number -->
                <div
                  class="col-12 col-lg-5"
                  data-cy="create-application-main-phone-number"
                >
                  <base-input-phone-number
                    id="main_phone"
                    v-model="$v.form.mainPhone.$model"
                    label="Phone number"
                    label-size="medium"
                    :countries="configCountries"
                    :returnThreeLetterCountryCode="true"
                    :onErrorMsg="mainPhoneErrorMessage"
                    class="mb-space-md"
                  ></base-input-phone-number>
                </div>

                <!-- is this a mobile number -->
                <template v-if="displayIsThisMobileNumberRadioInput">
                  <div class="col-12 offset-lg-1 col-lg-6">
                    <b-form-group
                      id="group_is_a_mobile_number"
                      aria-label="Is this a mobile number?"
                      label-class="pb-0"
                      class="mb-space-xs position-relative"
                      data-cy="create-application-is-mobile-number-group"
                    >
                      <template #label>
                        <label for="is_a_mobile_number" class="mb-space-xs">
                          <p class="text-medium font-weight-bold mb-0">
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
                  </div>
                </template>
              </b-form-row>
              <!-- row: Mobile Phone number && Stay engaged with ASU via SMS -->
              <template
                v-if="
                  displayIsThisMobileNumberRadioInput &&
                  form.isMobileNumberEntered
                "
              >
                <b-form-row>
                  <!-- Mobile phone number -->
                  <template v-if="isMobilePhoneInputVisible">
                    <div class="col-12 col-lg-5">
                      <base-input-phone-number
                        data-cy="create-application-mobile-phone-number"
                        id="mobile_phone"
                        v-model="$v.form.mobilePhone.$model"
                        label="Mobile phone number"
                        label-size="medium"
                        :isOptional="true"
                        :countries="configCountries"
                        :returnThreeLetterCountryCode="true"
                        :onErrorMsg="mobilePhoneErrorMessage"
                        class="mb-space-md mb-lg-space-lg"
                      ></base-input-phone-number>
                    </div>
                  </template>

                  <!-- receive info vis SMS -->
                  <div
                    class="col-12 col-lg-6"
                    :class="{ 'offset-lg-1': isMobilePhoneInputVisible }"
                  >
                    <b-form-group
                      id="group_receive_info_via_sms"
                      aria-label="Want to stay engaged with ASU via SMS messaging?"
                      label-class="pb-0"
                      class="mb-space-sm mb-lg-space-md position-relative"
                      data-cy="create-application-receive-info-via-sms-group"
                    >
                      <template #label>
                        <label for="receive_info_via_sms" class="mb-space-xs">
                          <p class="text-medium font-weight-bold mb-0">
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
                  </div>
                </b-form-row>
              </template>
              <!-- row:submit -->
              <b-form-row>
                <div
                  class="col-12 col-lg-3 text-vent"
                  data-cy="create-application-submit-button"
                >
                  <b-button
                    type="submit"
                    variant="secondary"
                    :disabled="isCreateApplicationSubmitDisabled"
                  >
                    <div v-if="!showLoader" class="d-inline">
                      <span class="mr-space-xxs">Start new application</span>
                      <font-awesome-icon icon="arrow-right"></font-awesome-icon>
                    </div>
                    <div v-else class="d-inline">
                      <span>Starting </span>
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
                </div>
              </b-form-row>
            </b-form>
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
              data-cy="create-application-briteverify-alert-modal"
            >
              <!-- Phone numbers -->
              <p
                data-cy="create-application-briteverify-alert-modal-heading"
                v-if="
                  isBriteVerifyError.mainPhoneError ||
                  isBriteVerifyError.mobilePhoneError
                "
              >
                <b>The phone number you entered could not be verified:</b>
              </p>
              <table
                class="briteverify-modal-table table col-lg-10 col-12"
                data-cy="create-application-briteverify-alert-modal-phone-table"
              >
                <tr
                  v-if="isBriteVerifyError.mainPhoneError"
                  class="border-bottom"
                >
                  <td class="border-0 pl-0 text-dark-1">Phone number</td>
                  <td class="border-0">
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
                data-cy="create-application-briteverify-alert-modal-back-button"
              >
                Go back and change
              </button>
              <button
                class="btn btn-dark-3 px-space-sm ml-space-md"
                @click="handleBriteValidationModalSubmit()"
                data-cy="create-application-briteverify-alert-modal-submit-button"
              >
                Submit
              </button>
            </div>
          </b-modal>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import { EnumNameTypes } from "@/content/enum-ug-application.js";
import MonthOptions from "@/content/months.json";
import NameSuffixOptions from "@/content/name-suffix.json";
import { useAuthStore } from "@/stores/auth-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BFormRow,
  VBTooltip,
} from "bootstrap-vue";
import { mapActions, mapState } from "pinia";
import { validationMixin } from "vuelidate";
import { maxLength, required, helpers } from "vuelidate/lib/validators";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import BaseInputPhoneNumber from "@/components/base-components/BaseInputPhoneNumber.vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import { EnumPageNames, EnumApiConstants } from "@/content/enum-app.js";
import { getDaysInMonth } from "date-fns";
import { extractGoogleClientId } from "@/services/UtilityService.js";

export default {
  name: "UgAppFormCreateApplication",
  mixins: [validationMixin],
  directives: {
    "b-tooltip": VBTooltip,
  },
  components: {
    "b-form": BForm,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-row": BFormRow,
    "base-select": BaseSelect,
    "b-button": BButton,
    "base-alert": BaseAlert,
    "base-input-phone-number": BaseInputPhoneNumber,
    "base-radio-group": BaseRadioGroup,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      EnumApiConstants: EnumApiConstants,
      suffixOptions: [],
      monthOptions: [],
      birthdayDayOptions: [],
      showLoader: false,
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
      // Form fields
      form: {
        firstName: null,
        preferredFirstName: null,
        middleName: null,
        lastName: null,
        suffix: null,
        birthMonth: null,
        birthDay: null,
        birthYear: null,
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
      firstName: {
        required,
        maxLength: maxLength(25),
        validName: function (value) {
          return /^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(value);
        },
      },
      preferredFirstName: {
        maxLength: maxLength(30),
        validName: function (value) {
          return (
            !helpers.req(value) || /^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(value)
          );
        },
      },
      middleName: {
        maxLength: maxLength(25),
        validName: function (value) {
          return (
            !helpers.req(value) || /^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(value)
          );
        },
      },
      lastName: {
        required,
        maxLength: maxLength(30),
        validName: function (value) {
          return /^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(value);
        },
      },
      birthDay: {
        required,
      },
      birthMonth: {
        value: {
          required,
        },
      },
      birthYear: {
        required,
      },
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
              !this.isMobilePhoneInputVisible ||
              (!this.form.mobilePhone.areaCode &&
                !this.form.mobilePhone.phoneNumber)
            );
          },
        },
        notSameAsMain: function (value) {
          return (
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
    ...mapState(useConfigStore, {
      configCountries: "countries",
    }),
    firstNameErrorMessage() {
      let message = null;
      if (!this.$v.form.firstName.required) {
        message = "This is a required field.";
      } else if (!this.$v.form.firstName.maxLength) {
        message = "The first name should not be more than 25 characters.";
      } else if (!this.$v.form.firstName.validName) {
        message =
          "The first name can only contain letters, spaces and hyphens (-).";
      }

      return message;
    },
    preferredFirstNameErrorMessage() {
      let message = null;
      if (!this.$v.form.preferredFirstName.maxLength) {
        message =
          "The preferred first name should not be more than 30 characters.";
      } else if (!this.$v.form.preferredFirstName.validName) {
        message =
          "The preferred first name can only contain letters, spaces and hyphens (-).";
      }

      return message;
    },
    middleNameErrorMessage() {
      let message = null;
      if (!this.$v.form.middleName.maxLength) {
        message = "The middle name should not be more than 25 characters.";
      } else if (!this.$v.form.middleName.validName) {
        message =
          "The middle name can only contain letters, spaces and hyphens (-).";
      }

      return message;
    },
    lastNameErrorMessage() {
      let message = null;
      if (!this.$v.form.lastName.required) {
        message = "This is a required field.";
      } else if (!this.$v.form.lastName.maxLength) {
        message = "The last name should not be more than 30 characters.";
      } else if (!this.$v.form.lastName.validName) {
        message =
          "The last name can only contain letters, spaces and hyphens (-).";
      }

      return message;
    },
    birthdayYearOptions() {
      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear() - 4);

      const dateCopy = new Date(currentDate);
      dateCopy.setFullYear(currentDate.getFullYear() - 100);

      var options = [];
      for (var i = dateCopy.getFullYear(); i < currentDate.getFullYear(); i++) {
        options.push({ text: `${i}`, value: i });
      }

      return options.sort((a, b) =>
        a.value > b.value ? -1 : b.value > a.value ? 1 : 0
      );
    },
    birthdayMonthErrorMessages() {
      let messages = [];

      if (this.$v.form.birthMonth.$dirty && this.$v.form.birthMonth.$error) {
        if (!this.$v.form.birthMonth.required) {
          messages.push("This is a required field");
        }
      }

      return messages;
    },
    birthdayDayErrorMessages() {
      let messages = [];

      if (this.$v.form.birthDay.$dirty && this.$v.form.birthDay.$error) {
        if (!this.$v.form.birthDay.required) {
          messages.push("This is a required field.");
        }
      }

      return messages;
    },
    birthdayYearErrorMessages() {
      let messages = [];

      if (this.$v.form.birthYear.$dirty && this.$v.form.birthYear.$error) {
        if (!this.$v.form.birthYear.required) {
          messages.push("This is a required field.");
        }
      }

      return messages;
    },
    mainPhoneErrorMessage() {
      const messages = [];
      if (
        this.$v.form.mainPhone.$dirty &&
        !this.$v.form.mainPhone.$model.phoneNumber &&
        !this.$v.form.mainPhone.$model.areaCode
      ) {
        messages.push("This is a required field.");
      } else if (
        this.$v.form.mainPhone.$dirty &&
        this.$v.form.mainPhone.isValid.$invalid
      ) {
        messages.push("Enter a valid phone number");
      }
      return messages;
    },
    mobilePhoneErrorMessage() {
      const messages = [];
      if (
        this.$v.form.mobilePhone.$dirty &&
        this.$v.form.mobilePhone.isValid.$invalid
      ) {
        messages.push("Enter a valid phone number");
      } else if (
        this.$v.form.mobilePhone.$dirty &&
        !this.$v.form.mobilePhone.notSameAsMain
      ) {
        messages.push("Mobile number should not be same as phone number.");
      }
      return messages;
    },

    isCreateApplicationSubmitDisabled() {
      return this.$v.form.$invalid || this.showLoader;
    },
    displayIsThisMobileNumberRadioInput() {
      return !this.$v.form.mainPhone.$invalid;
    },
    isMobilePhoneInputVisible() {
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
    ...mapActions(useUgApplicationStore, {
      createUgApplication: "createApplication",
      addUgApplicationUiViewInfo: "addUiViewInfo",
      applicationBriteVerifyValidation: "makeBriteVerifyValidation",
      applicationCreateNotification: "createNotification",
    }),
    ...mapActions(useUserStore, {
      submitUserPhoneDetails: "submitPhoneDetails",
      submitUserReceiveInfoBySMS: "submitReceiveInfoBySMS",
    }),
    ...mapActions(useAppStore, {
      updateisGeneralLoaderVisibleStatus: "updateisGeneralLoaderVisibleStatus",
    }),
    generateMonthDayOptions(days) {
      let options = [];
      let result = 0;

      for (var i = 0; i < days; i++) {
        result = i + 1;

        options.push({
          text: `${result}`,
          value: result < 10 ? `0${result}` : `${result}`,
        });
      }

      return options;
    },

    handleBirthdayMonthInput() {
      // update birthdayDayOptions
      this.updateDayOptions();
    },
    handleBirthdayYearInput() {
      // update birthdayDayOptions
      this.updateDayOptions();
    },

    updateDayOptions() {
      // getting the total number of days in a month using getDaysInMonth method using month and year selected.
      // If month and year are not selected using Jan and 2000 as defalut month and year to get the days options
      let days = getDaysInMonth(
        new Date(
          this.form.birthYear ? this.form.birthYear.value : "2000",
          this.form.birthMonth ? this.form.birthMonth?.monthIndex : "0"
        )
      );

      this.birthdayDayOptions = this.generateMonthDayOptions(days);

      // resetting the birthDay if it's not available in the options
      if (
        this.form.birthDay &&
        !this.birthdayDayOptions.some(
          (item) => item.value === this.form.birthDay?.value
        )
      ) {
        this.form.birthDay = null;
      }
    },

    async handleCreateApplicationSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      // fire data layer event
      this.$track({
        event: "form",
        action: "click",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "welcome",
        text: "start new application",
      });
      // updating the visibility of general loader to false
      this.updateisGeneralLoaderVisibleStatus(false);
      this.showLoader = true;

      if (!this.isBriteVerifyError.ignored) {
        await this.handleBriteValidation();
        if (
          !this.isBriteVerifyError.success &&
          !this.isBriteVerifyError.ignored
        ) {
          this.showLoader = false;
          return;
        }
      }

      const userInfo = {
        preferredFirstName: this.form.preferredFirstName,
        dateOfBirth: `${this.form.birthYear.value}-${this.form.birthMonth.value}-${this.form.birthDay.value}T00:00:00.000`,
      };
      const name = {
        firstName: this.form.firstName,
        middleName: this.form.middleName,
        lastName: this.form.lastName,
        suffix: this.form.suffix ? this.form.suffix.value : null,
        nameType: EnumNameTypes.Legal,
      };

      // step-1: create ug-application
      const applicationResponse = await this.createUgApplication(
        this.authToken,
        userInfo,
        name
      );

      if (applicationResponse.code === 201) {
        const appId = applicationResponse.data.appId;

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

        // submitting the phone details,ReceiveInfoBySMS and UI view info
        const promisses = [
          Promise.resolve(
            this.submitUserPhoneDetails(this.authToken, appId, phones)
          ),
          Promise.resolve(
            this.submitUserReceiveInfoBySMS(
              this.authToken,
              appId,
              this.form.receiveInfoBySMS?.value
            )
          ),
          Promise.resolve(
            this.addUgApplicationUiViewInfo(
              this.authToken,
              appId,
              EnumPageNames.PageUndergradMyInformation,
              EnumPageNames.PageUndergradMyInformation
            )
          ),
        ];

        const promiseResults = await Promise.allSettled(promisses);
        promiseResults.forEach((result) => {
          if (result.value.code >= 400 && result.value.code <= 599) {
            this.triggerErrorGtm(result.value?.code, result.value?.errors);
          }
        });

        // making salesforce Notification
        const notificationResponse = await this.applicationCreateNotification(
          this.authToken,
          appId,
          EnumApiConstants.SalesforceEdPlus,
          {
            googleClientId: extractGoogleClientId(),
            newApplicationAccountCreation: true,
          }
        );

        if (notificationResponse.code !== 200) {
          // fire error data layer event;
          this.triggerErrorGtm(
            notificationResponse.code,
            notificationResponse.errors
          );
        }

        // fire data layer event
        this.$track({
          event: "form",
          action: "new application submit",
          name: "onsubmit",
          type: "submit",
          region: "main content",
          section: "welcome",
          text: "new application created",
          current_screen: EnumPageNames.PageUndergradMyInformation,
          previous_screen: EnumPageNames.PageUndergradMyInformation,
        });

        // reset showLoader
        this.showLoader = false;
        // resetting the visibility of general loader
        this.updateisGeneralLoaderVisibleStatus(true);
        // fire success event
        this.$emit("ug-application-created", applicationResponse.data.appId);
      } else {
        // reset form values
        this.resetFormFields();
        // reset vuelidate validations
        this.$v.form.$reset();

        // display error
        this.alert.text = applicationResponse.errors[0];
        this.alert.show = true;

        // reset showLoader
        this.showLoader = false;
        // resetting the visibility of general loader
        this.updateisGeneralLoaderVisibleStatus(true);

        // fire data layer event
        this.triggerErrorGtm(
          applicationResponse.code,
          applicationResponse.errors
        );
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
        this.form.mainPhone.countryCode == EnumNameTypes.CaCountryCode
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
        if (mobilePhone) {
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
      await this.handleCreateApplicationSubmit();
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
    resetFormFields() {
      this.form.firstName = null;
      this.form.preferredFirstName = null;
      this.form.middleName = null;
      this.form.lastName = null;
      this.form.suffix = null;
      this.form.birthMonth = null;
      this.form.birthDay = null;
      this.form.birthYear = null;
      this.form.mainPhone = {
        phoneType: EnumNameTypes.mainPhoneType,
        countryCode: null,
        areaCode: null,
        phoneNumber: null,
        isValid: false,
      };
      this.form.isMobileNumberEntered = null;
      this.form.mobilePhone = {
        phoneType: EnumNameTypes.mobilePhoneType,
        countryCode: null,
        areaCode: null,
        phoneNumber: null,
        isValid: false,
      };
      this.form.receiveInfoBySMS = null;
    },
    triggerErrorGtm(code, errors) {
      this.$track({
        event: "app_error",
        action: "create-undergrad-application",
        location: this.$router.currentRoute.fullPath,
        code: code,
        message: errors.toString(),
      });
    },
  },
  created() {
    // populate data from static json files
    this.suffixOptions = NameSuffixOptions;

    this.monthOptions = MonthOptions.sort((a, b) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0
    );
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

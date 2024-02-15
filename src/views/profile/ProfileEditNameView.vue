<template>
  <main id="main-content" data-cy="profile-edit-name-view">
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
                data-cy="edit-name-alert"
              ></base-alert>

              <!-- form -->
              <div id="update-name-form-container">
                <b-form
                  id="update-name-form"
                  novalidate
                  @submit.stop.prevent="handledUpdateNameSubmit"
                >
                  <!-- firstName -->
                  <b-form-group
                    data-cy="profile-edit-name-first-name-group"
                    id="first-name-group"
                    aria-label="first-name-group"
                    label="First name"
                    label-for="first-name"
                    label-class="font-weight-bold"
                    class="position-relative mb-0 pb-space-sm"
                  >
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

                  <!-- middleName -->
                  <b-form-group
                    data-cy="profile-edit-name-middle-name-group"
                    id="middle-name-group"
                    aria-label="middle-name-group"
                    class="position-relative mb-0 pb-space-sm"
                  >
                    <template #label>
                      <label for="middle-name" class="font-weight-bold">
                        Middle name
                        <span
                          class="ml-space-xs bg-light-3 px-space-xxs py-lg-space-xxxs font-weight-normal"
                        >
                          Optional
                        </span>
                      </label>
                    </template>
                    <b-form-input
                      id="middle-name"
                      type="text"
                      placeholder="Enter your legal middle name"
                      v-model="$v.form.middleName.$model"
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

                  <!-- lastName -->
                  <b-form-group
                    data-cy="profile-edit-name-last-name-group"
                    id="last-name-group"
                    aria-label="last-name-group"
                    label="Last name"
                    label-for="last-name"
                    label-class="font-weight-bold"
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

                  <!-- suffix -->
                  <b-form-group
                    data-cy="profile-edit-name-suffix-group"
                    id="suffix-group"
                    aria-label="suffix group"
                    class="mb-space-xl"
                    label-for="suffix"
                  >
                    <template #label>
                      <label for="suffix" class="font-weight-bold">
                        Suffix
                        <span
                          class="ml-space-xs bg-light-3 px-space-xxs py-lg-space-xxxs font-weight-normal"
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

                  <!-- form-cta -->
                  <div data-cy="profile-edit-name-form-cta">
                    <b-button
                      type="submit"
                      variant="dark-3"
                      class="px-space-sm mr-space-md"
                      :disabled="submitDisabled"
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
    </section>
  </main>
</template>

<script>
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  VBTooltip,
} from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import { maxLength, required, helpers } from "vuelidate/lib/validators";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import { EnumPageNames } from "@/content/enum-app.js";
import NameSuffixOptions from "@/content/name-suffix.json";
import { useUserStore } from "@/stores/user-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { mapActions, mapState } from "pinia";

export default {
  name: "ProfileEditNameView",
  mixins: [validationMixin],
  directives: { "b-tooltip": VBTooltip },
  components: {
    "b-form": BForm,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "base-select": BaseSelect,
    "b-button": BButton,
    "base-alert": BaseAlert,
  },
  metaInfo() {
    return {
      title: "Profile | Edit Name",
      titleTemplate: "%s - Arizona State University",
    };
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      suffixOptions: [],
      showLoader: false,
      submitDisabled: false,
      alert: {
        show: false,
        text: null,
        type: "error",
      },
      form: {
        firstName: null,
        middleName: null,
        lastName: null,
        suffix: null,
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
    },
  },
  computed: {
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useUserStore, {
      userLegalNameId: "legalNameId",
      userLegalFirstName: "legalFirstName",
      userLegalMiddleName: "legalMiddleName",
      userLegalLastName: "legalLastName",
      userLegalSuffix: "legalSuffix",
    }),
    ...mapState(useAppStore, {
      selectedUndergradApplicationId: "selectedUndergradApplicationId",
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
        message = "The last name should not be more than 25 characters.";
      } else if (!this.$v.form.lastName.validName) {
        message =
          "The last name can only contain letters, spaces and hyphens (-).";
      }

      return message;
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      updateUserLegalName: "updateLegalName",
    }),
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
      updateisGeneralLoaderVisibleStatus: "updateisGeneralLoaderVisibleStatus",
    }),
    initializeFormValues() {
      // initialize form models with state value
      this.form.firstName = this.userLegalFirstName;
      this.form.middleName = this.userLegalMiddleName;
      this.form.lastName = this.userLegalLastName;

      // setting form.suffix
      const suffixValueFilterResult = this.suffixOptions.filter(
        (item) => item.value === this.userLegalSuffix
      );
      if (suffixValueFilterResult.length > 0) {
        this.form.suffix = suffixValueFilterResult[0];
      }
    },
    async handledUpdateNameSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.submitDisabled = true;
      this.showLoader = true;
      // updating the visibility of general loader to false
      this.updateisGeneralLoaderVisibleStatus(false);

      const payloadData = {
        firstName: this.form.firstName,
        middleName: this.form.middleName,
        lastName: this.form.lastName,
        suffix: this.form.suffix ? this.form.suffix.value : null,
      };

      const response = await this.updateUserLegalName(
        this.authToken,
        this.selectedUndergradApplicationId,
        this.userLegalNameId,
        payloadData
      );

      // reset showLoader and submitDisabled
      this.showLoader = false;
      this.submitDisabled = false;
      // resetting the visibility of general loader
      this.updateisGeneralLoaderVisibleStatus(true);

      if (response.code === 200) {
        // route user to profile screen
        this.$router.push({ name: this.EnumPageNames.PageProfile });
      } else {
        // reset form values with state value
        this.initializeFormValues();

        // reset vuelidate validations
        this.$v.form.$reset();

        // show error
        this.alert.text = response.errors[0];
        this.alert.type = "error";
        this.alert.show = true;
      }
    },
    handleAlertDismissedEvent() {
      this.alert.show = false;
    },
  },
  created() {
    // populate data from static json files
    this.suffixOptions = NameSuffixOptions;

    this.initializeFormValues();
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
};
</script>

<style lang="scss" scoped></style>

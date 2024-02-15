<template>
  <main id="main-content" data-cy="profile-new-password-view">
    <section class="py-space-lg">
      <div class="container">
        <div class="row">
          <div class="col-12 offset-lg-3 col-lg-6">
            <!-- content-block -->
            <div data-cy="profile-new-password-content-block">
              <h1 class="h1-small mb-space-md">Set new password</h1>
              <p class="mb-space-lg">
                To validate your request, a verification code has been sent to
                your registered email address. (Check your spam folder if you
                can't find it.) This code is only valid for 24 hours.
              </p>
            </div>

            <base-alert
              v-if="alert.show"
              :alert-type="alert.type"
              :text="alert.text"
              @dismissed="handleAlertDismissedEvent"
            ></base-alert>

            <!-- reset-password form block -->
            <div
              id="reset-password-form-block"
              data-cy="profile-new-password-reset-password-form-block"
            >
              <b-form
                id="reset-password-form"
                novalidate
                @submit.stop.prevent="handleResetPasswordSubmit"
              >
                <!-- email -->
                <b-form-group
                  data-cy="profile-new-password-email-group"
                  id="email-group"
                  aria-label="email group"
                  label="Email"
                  label-class="font-weight-bold mb-space-xxs pb-0"
                  class="position-relative mb-0 pb-space-md"
                >
                  <b-form-input
                    id="email"
                    v-model="$v.form.email.$model"
                    type="email"
                    placeholder="Enter your email address"
                    :state="$v.form.email.$dirty ? !$v.form.email.$error : null"
                  ></b-form-input>
                  <b-form-invalid-feedback v-if="!$v.form.email.required">
                    This is a required field.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback v-if="!$v.form.email.maxLength">
                    The email cannot be more than 50 characters long.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback v-if="!$v.form.email.email">
                    Invalid email format.
                  </b-form-invalid-feedback>
                </b-form-group>

                <!-- verificationCode -->
                <b-form-group
                  data-cy="profile-new-password-verification-code-group"
                  id="verification-code-group"
                  aria-label="verification code group"
                  label="Verification code"
                  label-class="font-weight-bold mb-space-xxs pb-0"
                  class="position-relative mb-0 pb-space-md"
                >
                  <b-form-input
                    id="verificationCode"
                    v-model="$v.form.verificationCode.$model"
                    type="text"
                    placeholder="Enter code"
                    :state="
                      $v.form.verificationCode.$dirty
                        ? !$v.form.verificationCode.$error
                        : null
                    "
                  ></b-form-input>

                  <b-form-invalid-feedback
                    v-if="!$v.form.verificationCode.required"
                  >
                    This is a required field.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-if="!$v.form.verificationCode.numeric"
                  >
                    The verification code can only be numbers.
                  </b-form-invalid-feedback>
                </b-form-group>

                <!-- password -->
                <b-form-group
                  data-cy="profile-new-password-password-group"
                  id="password-group"
                  aria-label="password group"
                  class="position-relative mb-0 pb-space-sm"
                >
                  <template #label>
                    <label for="password" class="font-weight-bold">
                      New password
                    </label>
                    <p class="mb-0 text-dark-1 text-small">
                      Passwords must be at least 10 characters long and must
                      include the following requirements:
                    </p>
                    <ul class="text-dark-1 text-small mt-space-xxs">
                      <li>Contains at least 1 number (0-9)</li>
                      <li>Contains at least 1 uppercase (A-Z) letter</li>
                      <li>Contains at least 1 lowercase (a-z) letter</li>
                    </ul>
                  </template>
                  <base-input-password
                    id="password"
                    v-model="$v.form.password.$model"
                    placeholder="Enter your password"
                    :is-input-valid="
                      $v.form.password.$dirty ? !$v.form.password.$error : null
                    "
                    :on-error-msg="passwordErrorMessages"
                  ></base-input-password>
                </b-form-group>

                <div
                  class="mb-space-md mt-space-xs"
                  data-cy="profile-new-password-reset-password-submit-button"
                >
                  <b-button
                    type="submit"
                    variant="secondary"
                    :disabled="isResetPasswordSubmitDisabled"
                  >
                    <span v-if="!showLoader">Set new password</span>
                    <div v-else class="d-inline">
                      <span>Setting </span>
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
                <div data-cy="profile-new-password-return-to-profile">
                  <a
                    href="javascript:void(0)"
                    @click="handleProfileClick"
                    class="text-underline"
                  >
                    Return to profile
                  </a>
                </div>
              </b-form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import BaseInputPassword from "@/components/base-components/BaseInputPassword.vue";
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
} from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import {
  email,
  maxLength,
  minLength,
  numeric,
  required,
} from "vuelidate/lib/validators";
import { useUserStore } from "@/stores/user-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { mapActions, mapState } from "pinia";
import { EnumPageNames } from "@/content/enum-app.js";

export default {
  name: "UserNewPasswordView",
  mixins: [validationMixin],
  metaInfo() {
    return {
      title: "Profile | New Password",
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "b-form": BForm,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-button": BButton,
    "base-input-password": BaseInputPassword,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "base-alert": BaseAlert,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      showLoader: false,
      alert: {
        show: false,
        text: false,
        type: false,
      },
      form: {
        email: null,
        verificationCode: null,
        password: null,
      },
    };
  },
  validations: {
    form: {
      email: {
        required,
        maxLength: maxLength(50),
        email,
      },
      verificationCode: {
        required,
        numeric,
      },
      password: {
        required,
        minLength: minLength(10),
        containsUppercase: function (value) {
          return /[A-Z]/.test(value);
        },
        containsLowercase: function (value) {
          return /[a-z]/.test(value);
        },
        containsNumber: function (value) {
          return /[0-9]/.test(value);
        },
      },
    },
  },
  computed: {
    ...mapState(useUserStore, {
      userEmail: "email",
    }),
    passwordErrorMessages() {
      var messages = [];

      if (!this.$v.form.password.required) {
        messages.push("This is a required field");
      } else if (!this.$v.form.password.minLength) {
        messages.push("The password must be at least 10 characters long.");
      } else if (!this.$v.form.password.containsUppercase) {
        messages.push("The password must contain at least 1 uppercase letter.");
      } else if (!this.$v.form.password.containsLowercase) {
        messages.push("The password must contain at least 1 lowercase letter.");
      } else if (!this.$v.form.password.containsNumber) {
        messages.push("The password must contain at least 1 number.");
      }

      return messages;
    },
    isResetPasswordSubmitDisabled() {
      return this.$v.form.$invalid || this.showLoader;
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      resetPassword: "resetPassword",
    }),
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
      updateisGeneralLoaderVisibleStatus: "updateisGeneralLoaderVisibleStatus",
    }),
    async handleResetPasswordSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.showLoader = true;
      // updating the visibility of general loader to false
      this.updateisGeneralLoaderVisibleStatus(false);

      const response = await this.resetPassword(
        this.form.verificationCode,
        this.form.email,
        this.form.password
      );

      if (response.code === 200) {
        this.showLoader = false;
        this.$router.push({
          name: this.EnumPageNames.PageProfileNewPasswordConfirm,
        });
        // resetting the visibility of general loader
        this.updateisGeneralLoaderVisibleStatus(true);
      } else {
        // reset form values
        this.form.verificationCode = null;
        this.form.email = this.userEmail;
        this.form.password = null;

        // reset vuelidate validations
        this.$v.$reset();

        // display error
        this.alert.type = "error";
        this.alert.text = response.errors[0];
        this.alert.show = true;

        // reset showLoader
        this.showLoader = false;
        // resetting the visibility of general loader
        this.updateisGeneralLoaderVisibleStatus(true);

        // fire data layer event
      }
    },
    handleProfileClick() {
      // direct user to login page
      this.$router.push({ name: this.EnumPageNames.PageProfile });
    },
    handleAlertDismissedEvent() {
      this.alert.show = false;
    },
  },
  created() {
    // set form initial value
    this.form.email = this.userEmail;
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
};
</script>

<style lang="scss" scoped></style>

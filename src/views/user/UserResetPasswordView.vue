<template>
  <main id="main-content" data-cy="user-reset-password-view">
    <section class="py-space-lg">
      <div class="container">
        <div class="row">
          <div class="col-12 offset-lg-3 col-lg-6">
            <!-- content block -->
            <div data-cy="user-reset-password-content-block">
              <h1 class="h1-small mb-space-sm">Reset password</h1>
              <p class="mb-space-md">
                Enter the email address associated with your account and
                <strong>we'll send you a verification code</strong> to reset
                your password.
              </p>
            </div>

            <!-- alert -->
            <base-alert
              v-if="alert.show"
              :alert-type="alert.type"
              :text="alert.text"
              @dismissed="handleAlertDismissedEvent"
              data-cy="reset-password-alert"
            ></base-alert>

            <!-- forgot password form -->
            <div id="reset-password-block">
              <b-form
                id="reset-password-form"
                novalidate
                @submit.stop.prevent="handleResetPasswordSubmit"
              >
                <!-- email -->
                <b-form-group
                  data-cy="user-reset-password-email-group"
                  id="email-group"
                  aria-label="email group"
                  label="Email"
                  label-class="font-weight-bold mb-space-xs pb-0"
                  class="position-relative mb-0 pb-space-sm"
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
                  <b-form-invalid-feedback v-if="!$v.form.email.email">
                    Invalid email format.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback v-if="!$v.form.email.maxLength">
                    The first name cannot be more than 50 characters long.
                  </b-form-invalid-feedback>
                </b-form-group>

                <div class="mb-space-md mt-space-xs">
                  <b-button
                    type="submit"
                    variant="secondary"
                    :disabled="isForgotPasswordSubmitDisabled"
                  >
                    <span v-if="!showLoader">Send code</span>
                    <div v-else class="d-inline">
                      <span>Sending </span>
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

                <div data-cy="user-reset-password-return-to-login-screen">
                  <a
                    href="javascript:void(0)"
                    @click="handleLoginClick"
                    class="text-underline"
                  >
                    Return to login screen.
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
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
} from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import { email, required, maxLength } from "vuelidate/lib/validators";
import { useUserStore } from "@/stores/user-store.js";
import { mapActions } from "pinia";
import { EnumPageNames } from "@/content/enum-app.js";

export default {
  name: "UserResetPasswordView",
  mixins: [validationMixin],
  metaInfo() {
    return {
      title: `User | Reset Password`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "b-form": BForm,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-button": BButton,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "base-alert": BaseAlert,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      showLoader: false,
      alert: {
        show: false,
        text: null,
        type: null,
      },
      form: { email: null },
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
        maxLength: maxLength(50),
      },
    },
  },
  computed: {
    isForgotPasswordSubmitDisabled() {
      return this.$v.form.$invalid || this.showLoader;
    },
  },
  methods: {
    ...mapActions(useUserStore, { forgotPassword: "forgotPassword" }),
    async handleResetPasswordSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.showLoader = true;

      const response = await this.forgotPassword(this.form.email);

      if (response.code === 200) {
        this.showLoader = false;

        // route user to new-password page
        this.$router.push({
          name: EnumPageNames.PageUserNewPassword,
        });
      } else {
        // reset form values
        this.form.email = null;

        // reset vuelidate validations
        this.$v.$reset();

        // display error
        this.alert.type = "error";
        this.alert.text = response?.errors
          ? response.errors[0]
          : "Error occured";
        this.alert.show = true;

        // reset showLoader
        this.showLoader = false;

        // fire data layer event
      }
    },
    handleLoginClick() {
      // direct user to login screen
      this.$router.push({ name: EnumPageNames.PageUserLogin });
    },
    handleAlertDismissedEvent() {
      this.alert.show = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>

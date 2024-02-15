<template>
  <main id="main-content" data-cy="profile-reset-password-view">
    <section class="py-space-lg">
      <div class="container">
        <!-- row-title -->
        <div class="row" data-cy="profile-reset-password-title">
          <div class="col-12 offset-lg-3 col-lg-6">
            <h1 class="h1-small mb-space-md">Reset password</h1>
          </div>
        </div>

        <!-- row-content -->
        <div class="row" data-cy="profile-reset-password-content">
          <div class="col-12 offset-lg-3 col-lg-6">
            <div v-if="authIsAsuLogin">
              <p class="mb-space-md">
                Since you are currently logged in with your ASURITE account, you
                may change your ASURITE password at
                <a
                  href="http://asu.edu/changepassword"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-underline text-dark-3"
                >
                  asu.edu/changepassword</a
                >.
              </p>
              <a href="javascript:void(0)" @click="handleProfileClick">
                Return to profile
              </a>
            </div>
            <div v-else>
              <p class="mb-space-md">
                Enter the email address associated with your account and
                <strong>we'll send you a verification code</strong> to reset
                your password.
              </p>
            </div>
          </div>
        </div>

        <!-- row-reset-password-form -->
        <div
          v-if="!authIsAsuLogin"
          class="row"
          data-cy="profile-reset-password-reset-password-form"
        >
          <div class="col-12 offset-lg-3 col-lg-6">
            <!-- alert -->
            <base-alert
              v-if="alert.show"
              :alert-type="alert.type"
              :text="alert.text"
              @dismissed="handleAlertDismissedEvent"
            ></base-alert>

            <div id="reset-password-block">
              <b-form
                id="reset-password-form"
                data-cy="profile-reset-password-reset-password-form"
                novalidate
                @submit.stop.prevent="handleResetPasswordSubmit"
              >
                <!-- email -->
                <b-form-group
                  data-cy="profile-reset-password-reset-password-email-group"
                  id="email-group"
                  aria-label="email group"
                  label="Email"
                  class="position-relative pb-space-lg"
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
                    The email cannot be more than 50 characters long.
                  </b-form-invalid-feedback>
                </b-form-group>

                <div
                  class="mb-space-md"
                  data-cy="profile-reset-password-reset-password-send-code-button"
                >
                  <b-button
                    type="submit"
                    variant="secondary"
                    :disabled="isSubmitDisabled"
                  >
                    <div v-if="!showLoader" class="d-inline">
                      <span class="mr-space-xxs">Send code</span>
                    </div>
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

                <div data-cy="profile-reset-password-return-to-profile">
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
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
} from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import { email, required, maxLength } from "vuelidate/lib/validators";
import { useAuthStore } from "@/stores/auth-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { mapState, mapActions } from "pinia";
import { EnumPageNames } from "@/content/enum-app.js";

export default {
  name: "ProfileResetPasswordView",
  mixins: [validationMixin],
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
      alert: { show: false, text: null, type: null },
      form: { email: null },
    };
  },
  metaInfo() {
    return {
      title: "Profile | Reset Password",
      titleTemplate: "%s - Arizona State University",
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
    ...mapState(useAuthStore, {
      authIsAsuLogin: "isAsuLogin",
    }),
    ...mapState(useUserStore, { userEmail: "email" }),
    isSubmitDisabled() {
      return this.$v.form.$invalid || this.showLoader;
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      forgotPassword: "forgotPassword",
    }),
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
      updateisGeneralLoaderVisibleStatus: "updateisGeneralLoaderVisibleStatus",
    }),
    initializeFormValues() {
      this.form.email = this.userEmail;
    },
    async handleResetPasswordSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.showLoader = true;
      // updating the visibility of general loader to false
      this.updateisGeneralLoaderVisibleStatus(false);

      const response = await this.forgotPassword(this.form.email);

      // reset showLoader
      this.showLoader = false;
      // resetting the visibility of general loader
      this.updateisGeneralLoaderVisibleStatus(true);

      if (response.code === 200) {
        // route user to new-password page;
        this.$router.push({ name: this.EnumPageNames.PageProfileNewPassword });
      } else {
        // reset form value
        this.initializeFormValues();

        // reset vuelidate validations
        this.$v.$reset();

        // display error
        this.alert.type = "error";
        this.alert.text = response.errors[0];
        this.alert.show = true;
      }
    },
    handleAlertDismissedEvent() {
      this.alert.show = false;
    },
    handleProfileClick() {
      // direct user to login screen
      this.$router.push({ name: this.EnumPageNames.PageProfile });
    },
  },
  created() {
    this.initializeFormValues();
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
};
</script>

<style lang="scss" scoped></style>

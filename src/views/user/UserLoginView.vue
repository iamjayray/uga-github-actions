<template>
  <main id="main-content" data-cy="user-login-view">
    <section class="py-space-lg">
      <div class="container">
        <div class="row">
          <div class="col-12 offset-lg-3 col-lg-6">
            <!-- create-account -->
            <div
              class="d-flex flex-row align-items-center justify-content-start mb-space-sm"
            >
              <!-- create account link -->
              <a
                href="javascript:void(0)"
                @click="handleCreateAccountLink"
                data-cy="user-login-create-account-link"
                ><font-awesome-icon
                  icon="fa-solid fa-user-plus"
                  class="text-dark-1"
                ></font-awesome-icon
                ><span
                  class="text-small text-dark-1 ml-space-xxs font-weight-bold"
                  >Create account</span
                ></a
              >
            </div>

            <!-- generic error alert -->
            <base-alert
              v-if="alert.show"
              :alert-type="alert.type"
              :text="alert.text"
              :isIconVisible="!isVerifyEmailAlertVisible"
              @dismissed="handleAlertDismissedEvent"
              data-cy="user-login-alert"
            >
              <template #body v-if="isVerifyEmailAlertVisible">
                <div class="pl-lg-space-sm">
                  <p>
                    <font-awesome-icon
                      icon="fa-solid fa-circle-exclamation"
                      size="lg"
                      class="text-danger mr-space-xs"
                    />
                    <span class="font-weight-bold text-danger"
                      >Verify your email address</span
                    >
                  </p>
                  <p>
                    Please click the verification link we sent to your email.
                    Then return to this page to log in.
                  </p>
                  <a
                    href="javascript:void(0)"
                    class="text-dark-3 text-underline"
                    @click="handleResendEmailVerificationClick"
                    >Resend email verification</a
                  >
                </div>
              </template>
            </base-alert>

            <!-- login-form -->
            <div
              class="bg-light-1 px-space-sm py-space-md"
              data-cy="user-login-login-section"
            >
              <!-- login section -->
              <h1 class="h1-small mb-space-md">Log in to continue</h1>

              <div>
                <a
                  href="javascript:void(0)"
                  class="btn btn-secondary"
                  @click="handleAsuLogin"
                  data-cy="user-login-with-asu"
                >
                  Log in with ASURITE
                </a>
              </div>

              <div class="py-space-md">
                <hr />
              </div>

              <div id="login-form-container">
                <b-form
                  id="login-form"
                  @submit.stop.prevent="handleLoginSubmit"
                >
                  <!-- email -->
                  <b-form-group
                    data-cy="user-login-email-group"
                    id="email-group"
                    aria-label="email group"
                    label="Email"
                    label-class="font-weight-bold mb-space-xxs pb-0"
                    class="position-relative mb-0 pb-space-md"
                  >
                    <b-form-input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      v-model="$v.form.email.$model"
                      :state="
                        $v.form.email.$dirty ? !$v.form.email.$error : null
                      "
                    ></b-form-input>
                    <b-form-invalid-feedback v-if="!$v.form.email.required">
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      This is a required field.
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback v-if="!$v.form.email.email">
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      Invalid email format.
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback v-if="!$v.form.email.isAsuEmail">
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      if you already have an asu email address, please login
                      with your ASURITE ID.
                    </b-form-invalid-feedback>
                  </b-form-group>

                  <!-- password -->

                  <b-form-group
                    data-cy="user-login-password-group"
                    id="password-group"
                    aria-label="password group"
                    label="Password"
                    label-class="font-weight-bold pb-0 mb-space-xxs"
                    class="position-relative mb-0 pb-space-md"
                  >
                    <base-input-password
                      id="password"
                      v-model="$v.form.password.$model"
                      placeholder="Enter your password"
                      :is-input-valid="
                        $v.form.password.$dirty
                          ? !$v.form.password.$error
                          : null
                      "
                      :on-error-msg="passwordErrorMessages"
                    ></base-input-password>
                  </b-form-group>

                  <div
                    class="d-flex flex-row justify-content-start align-items-center mt-space-md"
                  >
                    <b-button
                      type="submit"
                      variant="secondary"
                      :disabled="isLoginSubmitDisabled"
                    >
                      <span v-if="!showLoader">Log in</span>
                      <div v-else class="d-inline">
                        <span>Logging in </span>
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
                    <a
                      href="javascript:void(0)"
                      @click="handleResetPasswordClick"
                      class="text-underline ml-space-sm text-dark-3"
                    >
                      Reset password
                    </a>
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
import { useUserStore } from "@/stores/user-store";
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
import { email, required } from "vuelidate/lib/validators";
import { useAuthStore } from "@/stores/auth-store.js";
import { mapState, mapActions } from "pinia";
import { EnumPageNames } from "@/content/enum-app.js";

export default {
  name: "UserLoginView",
  mixins: [validationMixin],
  metaInfo() {
    return {
      title: `User | Login`,
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
        text: null,
        type: null,
      },
      form: {
        email: null,
        password: null,
      },
      isVerifyEmailAlertVisible: false,
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
        isAsuEmail: function (value) {
          return !/^[\w.+-]+@asu\.edu$/.test(value);
        },
      },
      password: {
        required,
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
        messages.push("This is a required field.");
      }

      return messages;
    },
    isLoginSubmitDisabled() {
      return this.$v.form.$invalid || this.showLoader;
    },
  },
  methods: {
    ...mapActions(useAuthStore, ["login"]),
    ...mapActions(useUserStore, {
      populateEmail: "populateEmail",
    }),
    handleCreateAccountLink() {
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal click",
        region: "main content",
        section: "log in to continue",
        text: "create account",
        component: "log in to continue",
      });

      // direct user to create account page
      this.$router.push({ name: EnumPageNames.PageUserCreateAccount });
    },
    handleAsuLogin() {
      // fire datalayer event
      this.$track({
        event: "form",
        action: "login",
        name: "onlogin",
        type: "account login",
        region: "main content",
        section: "log in to continue",
        text: "login with asurite",
      });

      // direct user to SSO login url
      window.location.href = import.meta.env.VITE_ASURITE_LOGIN_URL;
    },
    handleResetPasswordClick() {
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal click",
        region: "main content",
        section: "log in to continue",
        text: "reset password",
        component: "log in to continue",
      });

      // direct user to reset password page
      this.$router.push({ name: EnumPageNames.PageUserResetPassword });
    },
    async handleLoginSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      // fire data layer
      this.$track({
        event: "form",
        action: "click",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "log in to continue",
        text: "log in",
      });

      this.showLoader = true;

      const response = await this.login(this.form.email, this.form.password);

      if (response.code === 200) {
        // fire datalayer event
        this.$track({
          event: "form",
          action: "login",
          name: "onlogin",
          type: "account login",
          region: "main content",
          section: "log in to continue",
          text: "log in successful",
          email: this.form.email,
        });

        // hide loader
        this.showLoader = false;

        // direct user to dashboard page
        this.$router.push({ name: EnumPageNames.PageDashboard });
      } else {
        // storing the entered email
        // checking if the api failed because of unverified email address
        if (response.errors.includes("Must verify email address.")) {
          this.isVerifyEmailAlertVisible = true;
          this.alert.text = null;
          // storing the email so that it can be used for resending the verify email
          this.populateEmail(this.form.email);
        } else {
          // display error
          this.isVerifyEmailAlertVisible = false;
          this.alert.text = response.errors[0];
        }
        // triggering the error alert
        this.alert.type = "error";
        this.alert.show = true;
        // reset form values
        this.form.email = null;
        this.form.password = null;

        // reset vuelidate validations
        this.$v.$reset();

        this.$nextTick(() => {
          const errorAlert = document.getElementsByClassName("alert");
          if (errorAlert.length > 0) {
            errorAlert[0].scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        });

        // reset showLoader
        this.showLoader = false;

        // fire data layer event
        this.$track({
          event: "app_error",
          action: "login",
          location: this.$router.currentRoute.fullPath,
          code: response.code,
          message: response.errors.toString(),
        });
      }
    },
    handleAlertDismissedEvent() {
      this.alert.show = false;
      this.isVerifyEmailAlertVisible = false;
    },
    handleResendEmailVerificationClick() {
      this.alert.show = false;
      this.isVerifyEmailAlertVisible = false;
      // using the "resendVerificationEmail" param to trigger the resend email automatically in created hook on user/verify-email page
      this.$router.push({
        name: EnumPageNames.PageUserVerifyEmail,
        params: { resendVerificationEmail: true },
      });
    },
  },
  mounted() {
    // presettign the email value from store
    if (this.userEmail) {
      this.form.email = this.userEmail;
    }
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <main id="main-content" data-cy="user-create-account-view">
    <section class="py-space-lg py-lg-space-xxl">
      <div class="container">
        <div class="row">
          <!-- form column -->
          <div
            class="col-12 col-lg-6 mb-space-lg mb-lg-0"
            data-cy="user-create-account-user-create-account-form"
          >
            <div class="mb-space-md mb-lg-space-lg">
              <h1 class="h1-medium bg-secondary px-space-xxs d-inline">
                Create an account
              </h1>
            </div>
            <p class="mb-space-md">
              If you already have an account or an ASURITE User ID (ASU email
              address),
              <a
                href="javascript:void(0)"
                aria-label="log in here"
                @click.prevent="handleLoginClick"
                class="text-underline"
                data-cy="user-create-account-login-link"
                >log in here</a
              >.
            </p>

            <!-- alert-->
            <base-alert
              v-if="alert.show"
              :alert-type="alert.type"
              :text="alert.text"
              @dismissed="handleAlertDismissedEvent"
              data-cy="user-create-account-alert"
            ></base-alert>

            <div class="create-account-form">
              <b-form
                id="create-account-form"
                novalidate
                @submit.stop.prevent="handleCreateAccountSubmit"
              >
                <!-- email -->
                <b-form-group
                  data-cy="user-create-account-email-group"
                  id="email-group"
                  aria-label="email group"
                  class="position-relative mb-0 pb-space-lg"
                >
                  <template #label>
                    <label for="email" class="font-weight-bold">
                      Email
                      <span
                        class="ml-space-xs"
                        tabindex="0"
                        v-b-tooltip
                        title="We ask for your email to create a login for your new account. You can log in at any time to complete your application. We may also use your email to communicate with you regarding your application for ASU."
                      >
                        <font-awesome-icon
                          icon="fa-sharp fa-regular fa-circle-question"
                        ></font-awesome-icon>
                      </span>
                    </label>
                  </template>
                  <b-form-input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    v-model="$v.form.email.$model"
                    :state="$v.form.email.$dirty ? !$v.form.email.$error : null"
                  ></b-form-input>

                  <b-form-invalid-feedback v-if="!$v.form.email.required">
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    This is a required field.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback v-if="!$v.form.email.maxLength">
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    The email cannot be more than 50 characters long.
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
                    Please log in with your ASURITE ID.
                  </b-form-invalid-feedback>
                </b-form-group>

                <!-- confirmEmail -->
                <b-form-group
                  data-cy="user-create-account-confirm-email-group"
                  id="confirm-email-group"
                  aria-label="confirm email group"
                  label="Retype email"
                  label-for="confirm-email"
                  label-class="font-weight-bold"
                  class="position-relative mb-0 pb-space-lg"
                >
                  <b-form-input
                    id="confirm-email"
                    v-model="$v.form.confirmedEmail.$model"
                    type="email"
                    placeholder="Re-type your email address"
                    :state="
                      $v.form.confirmedEmail.$dirty
                        ? !$v.form.confirmedEmail.$error
                        : null
                    "
                  ></b-form-input>
                  <b-form-invalid-feedback
                    v-if="!$v.form.confirmedEmail.required"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    This is a required field.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-if="!$v.form.confirmedEmail.maxLength"
                  >
                    The email cannot be more than 50 characters long.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-if="
                      $v.form.confirmedEmail.required &&
                      $v.form.confirmedEmail.email &&
                      $v.form.confirmedEmail.maxLength &&
                      !$v.form.confirmedEmail.sameAsEmail
                    "
                  >
                    Email does not match.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-if="
                      $v.form.confirmedEmail.required &&
                      $v.form.confirmedEmail.email &&
                      $v.form.confirmedEmail.maxLength &&
                      $v.form.confirmedEmail.sameAsEmail &&
                      !$v.form.confirmedEmail.isAsuEmail
                    "
                  >
                    Please login with your asu email address.
                  </b-form-invalid-feedback>
                </b-form-group>

                <!-- password -->
                <b-form-group
                  data-cy="user-create-account-password-group"
                  id="password-group"
                  aria-label="password group"
                  class="position-relative mb-0 pb-space-lg"
                >
                  <template #label>
                    <label for="preferred-first-name" class="font-weight-bold">
                      Password
                    </label>
                    <p class="mb-0 text-dark-1 text-small">
                      Passwords must be at least 10 characters long and must
                      include the following requirements:
                    </p>
                    <ul class="text-dark-1 text-small mt-space-xxs">
                      <li>Contains at least 1 number (0-9)</li>
                      <li>Contains at least 1 uppercase letter (A-Z)</li>
                      <li>Contains at least 1 lowercase letter (a-z)</li>
                    </ul>
                  </template>
                  <base-input-password
                    id="password"
                    placeholder="Enter your password"
                    v-model="$v.form.password.$model"
                    :is-input-valid="
                      $v.form.password.$dirty ? !$v.form.password.$error : null
                    "
                    :on-error-msg="passwordErrorMessages"
                  ></base-input-password>
                </b-form-group>

                <!-- confirm password -->
                <b-form-group
                  data-cy="user-create-account-confirm-password-group"
                  id="confirm-password-group"
                  aria-label="confirm password group"
                  label="Retype password"
                  label-for="confirm-password"
                  label-class="font-weight-bold"
                  class="position-relative mb-0 pb-space-lg"
                >
                  <base-input-password
                    id="confirm-password"
                    placeholder="Retype your password"
                    v-model="$v.form.confirmedPassword.$model"
                    :is-input-valid="
                      $v.form.confirmedPassword.$dirty
                        ? !$v.form.confirmedPassword.$error
                        : null
                    "
                    :on-error-msg="confirmedPasswordErrorMessages"
                  ></base-input-password>
                </b-form-group>

                <!-- submit button -->
                <div
                  class="mt-space-xs"
                  data-cy="user-create-account-create-account-button"
                >
                  <b-button
                    type="submit"
                    variant="secondary"
                    :disabled="isCreateAccountDisabled"
                  >
                    <span v-if="!showLoader">Create account</span>

                    <div v-else class="d-inline">
                      <span>Creating </span>
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
              </b-form>
            </div>
          </div>

          <!-- cards column -->
          <div
            class="col-12 offset-lg-1 col-lg-5 mb-space-md"
            data-cy="user-create-account-user-create-account-cards"
          >
            <div class="row">
              <div class="col-12">
                <div
                  class="px-space-md py-space-lg border border-light-4 mb-space-md"
                >
                  <div class="mb-space-xs">
                    <img
                      src="@/assets/img/raised-hand-icon.svg"
                      alt="raised hand"
                      class="img-fluid"
                    />
                  </div>
                  <p class="text-large font-weight-bold">
                    Not an online student?
                  </p>
                  <p class="mb-0 text-small">
                    You’ve reached our new application. This application
                    currently only supports students pursing a fully online
                    degree program. If you’re interested in an on-campus, ASU
                    Sync, ASU Local, nondegree or student visa-eligible program,
                    please
                    <a
                      href="javascript:void(0)"
                      class="text-dark-3 text-underline"
                      @click.prevent="handleLegacyAppLinkClick"
                      >create an account here</a
                    >.
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <portal-block-app-quick-facts></portal-block-app-quick-facts>
              </div>
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
import { useUserStore } from "@/stores/user-store";
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  VBTooltip,
} from "bootstrap-vue";
import { mapActions } from "pinia";
import { validationMixin } from "vuelidate";
import {
  email,
  maxLength,
  minLength,
  required,
  sameAs,
} from "vuelidate/lib/validators";
import { EnumPageNames } from "@/content/enum-app.js";
import PortaBlockAppQuickFacts from "@/components/portal-components/PortalBlockAppQuickFacts.vue";

export default {
  name: "UserCreateAccountView",
  components: {
    "b-form": BForm,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-button": BButton,
    "base-input-password": BaseInputPassword,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "base-alert": BaseAlert,
    "portal-block-app-quick-facts": PortaBlockAppQuickFacts,
  },
  metaInfo() {
    return {
      title: `User | Create Account`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  mixins: [validationMixin],
  directives: {
    "b-tooltip": VBTooltip,
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
        confirmedEmail: null,
        password: null,
        confirmedPassword: null,
      },
    };
  },
  validations: {
    form: {
      email: {
        required,
        maxLength: maxLength(50),
        email,
        isAsuEmail: function (value) {
          return !/^[\w.+-]+@asu\.edu$/.test(value);
        },
      },
      confirmedEmail: {
        required,
        maxLength: maxLength(50),
        email,
        isAsuEmail: function (value) {
          return !/^[\w.+-]+@asu\.edu$/.test(value);
        },
        sameAsEmail: sameAs("email"),
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
      confirmedPassword: {
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
        sameAsPassword: sameAs("password"),
      },
    },
  },
  computed: {
    passwordErrorMessages() {
      let messages = [];

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
    confirmedPasswordErrorMessages() {
      var messages = [];

      if (!this.$v.form.confirmedPassword.required) {
        messages.push("This is a required field");
      } else if (!this.$v.form.confirmedPassword.minLength) {
        messages.push("The password must be at least 10 characters long.");
      } else if (!this.$v.form.confirmedPassword.containsUppercase) {
        messages.push("The password must contain at least 1 uppercase letter.");
      } else if (!this.$v.form.confirmedPassword.containsLowercase) {
        messages.push("The password must contain at least 1 lowercase letter.");
      } else if (!this.$v.form.confirmedPassword.containsNumber) {
        messages.push("The password must contain at least 1 number.");
      } else if (!this.$v.form.confirmedPassword.sameAsPassword) {
        messages.push("Both passwords must match.");
      }

      return messages;
    },
    isCreateAccountDisabled() {
      return this.$v.form.$invalid || this.showLoader;
    },
  },
  methods: {
    ...mapActions(useUserStore, ["createAccount"]),
    handleLoginClick() {
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal click",
        region: "main content",
        section: "create an account",
        text: "log in here",
        component: "create an account",
      });

      // direct user to the login page
      this.$router.push({ name: EnumPageNames.PageUserLogin });
    },
    handleLegacyAppLinkClick() {
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal click",
        region: "main content",
        section: "attention international students",
        text: "create an account here",
        component: "create an account",
      });

      // open link in new tab
      window.open(import.meta.env.VITE_LEGACY_UGAPP_URL, "_blank");
    },
    async handleCreateAccountSubmit() {
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
        section: "create an account",
        text: "create account",
      });

      this.showLoader = true;

      // create account
      const response = await this.createAccount(
        this.form.email,
        this.form.password
      );

      if (response.code === 201) {
        // fire data layer event
        this.$track({
          event: "form",
          action: "application account submit",
          name: "onsubmit",
          type: "submit",
          region: "main content",
          section: "create an account",
          text: "application account created",
          email: this.form.email.toLowerCase(),
          retype_email: this.form.email.toLowerCase(),
        });

        // hide loader
        this.showLoader = false;

        // direct user to verify-email
        this.$router.push({ name: EnumPageNames.PageUserVerifyEmail });
      } else {
        // reset form values
        this.form.email = null;
        this.form.confirmedEmail = null;
        this.form.password = null;
        this.form.confirmedPassword = null;

        // reset vuelidate validations
        this.$v.form.$reset();

        // display error
        this.alert.type = "error";
        this.alert.text = response.errors[0];
        this.alert.show = true;

        // reset showLoader
        this.showLoader = false;

        // fire data layer event
        this.$track({
          event: "app_error",
          action: "create-account",
          location: this.$router.currentRoute.fullPath,
          code: response.code,
          message: response.errors.toString(),
        });
      }
    },
    handleAlertDismissedEvent() {
      this.alert.show = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>

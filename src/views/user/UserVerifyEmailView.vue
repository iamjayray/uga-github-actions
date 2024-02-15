<template>
  <main id="main-content" data-cy="user-verify-email-view">
    <section class="py-space-lg py-lg-space-xxl">
      <div class="container">
        <div class="row">
          <div
            class="col-12 col-lg-6 mb-space-xl mb-lg-0 px-space-md px-lg-gutter"
          >
            <!-- alert -->
            <base-alert
              v-if="alert.show"
              :alert-type="alert.type"
              :text="alert.text"
              @dismissed="handleAlertDismissedEvent"
              data-cy="user-verify-email-alert"
            ></base-alert>
            <div
              class="verify-email-block"
              data-cy="user-verify-email-verify-email-block"
            >
              <div
                class="d-flex flex-row align-items-center justify-content-start mb-space-lg"
              >
                <img
                  src="@/assets/img/verify-email-icon.svg"
                  alt="verify-email"
                  class="img-fluid"
                />
              </div>
              <div data-cy="user-verify-email-step-one">
                <h1 class="h1-small mb-space-sm">Step 1: Check your email</h1>
                <p class="mb-space-md">
                  To continue your application, click the verification link we
                  sent to <strong>{{ userEmail }}</strong
                  >. The link is only valid for 24 hours.
                </p>
                <p class="mb-space-md text-dark-1 text-small">
                  Can't find it? Check your spam folder or click the button
                  below to resend the verification.
                </p>
                <button
                  class="btn btn-light-3"
                  @click="handleResendEmailClick"
                  :disabled="showLoader"
                  data-cy="user-verify-email-resend-email-button"
                >
                  <div v-if="showLoader" class="d-inline">
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

                  <span v-else>Resend email verification</span>
                </button>
              </div>
              <hr class="my-space-md my-lg-space-lg" />

              <div data-cy="user-verify-email-step-two">
                <h1 class="h1-small mb-space-sm">
                  Step 2: Return to the login page
                </h1>
                <p class="mb-space-md">
                  Once you’ve verified your email address, log in to continue
                  your application.
                </p>
                <a
                  href="javascript:void(0)"
                  @click.prevent="handleLoginClick"
                  class="btn btn-secondary"
                  data-cy="user-verify-email-login-button"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
          <!-- cards column -->
          <div
            class="col-12 offset-lg-1 col-lg-5 mb-space-md px-space-md px-lg-gutter"
            data-cy="user-verify-email-cards-column"
          >
            <div class="row">
              <div class="col-12">
                <div
                  class="px-space-md py-space-lg border border-light-4 mb-space-sm mb-lg-space-md"
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
                      href="https://webapp4.asu.edu/uga_admissionsapp/"
                      target="_blank"
                      @click="handleInternationalStudentLinkClick"
                      class="text-dark-3 text-underline"
                    >
                      create an account here</a
                    >.
                  </p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <portal-block-app-quick-facts />
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
import { mapState, mapActions } from "pinia";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import { EnumPageNames } from "@/content/enum-app.js";
import PortaBlockAppQuickFacts from "@/components/portal-components/PortalBlockAppQuickFacts.vue";

export default {
  name: "UserVerifyEmailView",
  metaInfo() {
    return {
      title: `User | Verify Email`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "base-alert": BaseAlert,
    "portal-block-app-quick-facts": PortaBlockAppQuickFacts,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      showLoader: false,
      alert: {
        show: false,
        type: null,
        text: null,
      },
    };
  },
  computed: {
    ...mapState(useUserStore, {
      userEmail: "email",
    }),
  },

  methods: {
    handleInternationalStudentLinkClick() {
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: "attention international students",
        text: "please create an account here instead",
      });
    },
    ...mapActions(useUserStore, {
      resendVerificationEmail: "resendVerificationEmail",
    }),
    handleLoginClick() {
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: "verify your email",
        text: "log in",
      });

      // direct user to the login page
      this.$router.push({ name: EnumPageNames.PageUserLogin });
    },
    async handleResendEmailClick() {
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: "verify your email",
        text: "resend email verification",
      });
      this.showLoader = true;

      const response = await this.resendVerificationEmail(this.userEmail);
      if (response.code === 200) {
        this.alert.type = "success";
        this.alert.text = "We have successfully sent you the email.";
      } else {
        this.alert.type = "error";
        // checkig if the error response contains the below error message then returning the custom error text
        if (
          response.errors.includes(
            "You've requested an email message too many times. Please try again later."
          )
        ) {
          this.alert.text =
            "The email verification link can only be sent five times per hour. Please try again later or call 866-277-6589 for support.";
        } else {
          this.alert.text = response.errors[0];
        }
      }
      this.alert.show = true;
      this.showLoader = false;
      this.$nextTick(() => {
        const errorAlert = document.getElementsByClassName("alert");
        if (errorAlert.length > 0) {
          errorAlert[0].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    },
    handleAlertDismissedEvent() {
      this.alert.show = false;
    },
  },
  async created() {
    if (this.$route.params.resendVerificationEmail) {
      await this.handleResendEmailClick();
    }
  },
};
</script>

<style lang="scss" scoped></style>

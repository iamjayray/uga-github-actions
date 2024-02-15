<template>
  <div class="row" data-cy="form-need-help">
    <div class="col-12">
      <h2 class="h2-medium mb-space-xs" data-cy="need-help-title">
        Need help? Contact us.
      </h2>
      <p class="text-dark-1 mb-space-md">
        We're here to assist you every step of the way.
      </p>
      <div class="mb-space-sm">
        <div
          class="d-flex flex-column flex-lg-row align-items-stretch justify-content-between"
        >
          <!-- enrollment-support -->
          <div data-cy="form-need-help-enrollment-support">
            <div class="d-flex align-items-start justify-content-start">
              <div class="mr-space-xs">
                <img
                  src="@/assets/img/app-enrollment-support.svg"
                  alt="login"
                  class="img-fluid"
                  data-cy="enrollment-support-image"
                />
              </div>
              <div>
                <p class="font-weight-bold" data-cy="enrollment-support-title">
                  Enrollment support
                </p>
                <a
                  href="tel:+1-866-277-6589"
                  class="text-underline mb-space-xxs"
                  data-cy="enrollment-support-phone"
                >
                  866-277-6589
                </a>
                <p
                  class="text-xs text-dark-1 mb-0"
                  data-cy="enrollment-support-hours"
                >
                  Call for immediate support.
                </p>
                <p class="text-xs text-dark-1 mb-space-sm">
                  Monday through Friday, 6 a.m. to 6 p.m. (Arizona time)
                </p>
                <a
                  href="mailto:enrollmentonline@asu.edu"
                  class="text-underline"
                  data-cy="enrollment-support-email"
                >
                  enrollmentonline@asu.edu
                </a>
                <p class="text-xs text-dark-1 mb-space-sm">
                  Response within one to two business days
                </p>
              </div>
            </div>
          </div>
          <!-- technical-support -->
          <div
            class="mt-space-sm mt-lg-0"
            data-cy="form-need-help-technical-support"
          >
            <div class="d-flex align-items-start justify-content-start">
              <div class="mr-space-xs">
                <img
                  src="@/assets/img/app-technical-support.svg"
                  alt="login"
                  class="img-fluid"
                  data-cy="technical-support-image"
                />
              </div>
              <div>
                <p class="font-weight-bold" data-cy="technical-support-title">
                  Technical support
                </p>
                <a
                  href="tel:+1-855-278-5080"
                  class="text-underline mb-space-xxs"
                  data-cy="technical-support-phone"
                >
                  855-278-5080
                </a>
                <p
                  class="text-xs text-dark-1 mb-space-sm"
                  data-cy="technical-support-hours"
                >
                  Available 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- case-create form block -->
      <div
        v-if="appSelectedUndergradApplicationId"
        data-cy="form-need-help-case-create-form-block"
      >
        <p class="text-large font-weight-bold mb-space-xs">
          Do you need support for any of the following?
        </p>
        <p class="text-dark-1" data-cy="support-options-description">
          You can continue with the rest of your application, then we'll reach
          out within one to two business days to address your request.
        </p>
        <p class="text-dark-1 mb-space-sm" data-cy="support-options-note">
          If your program of choice is not available, please select the closest
          match, and we will help you change it once you submit your
          application.
        </p>

        <!-- alert -->
        <base-alert
          v-if="alert.show"
          :alert-type="alert.type"
          :text="alert.text"
          :isDismissible="false"
          data-cy="support-alert"
        ></base-alert>

        <b-form novalidate @submit.stop.prevent="handleCreateSupportSubmit">
          <!-- radio options -->
          <b-form-group
            data-cy="form-need-help-support-options-group"
            aria-label="support options"
            class="position-relative mb-0 pb-space-md"
          >
            <b-form-radio
              v-for="(item, index) in supportOptions"
              :key="index"
              v-model="form.support"
              name="support-radio"
              class="mb-space-xs"
              :value="item.value"
              :data-cy="`support-option-${item.value}`"
            >
              <span class="text-large" data-cy="support-option-text">{{
                item.text
              }}</span>
            </b-form-radio>
            <b-form-invalid-feedback
              v-if="!$v.form.support.required"
              data-cy="support-options-error"
            >
              This is a required field.
            </b-form-invalid-feedback>
          </b-form-group>
          <!-- textarea -->
          <b-form-group
            data-cy="form-need-help-additional-comments-group"
            aria-label="support additional comments"
            class="position-relative mb-0 pb-space-md"
          >
            <template #label>
              <p
                class="text-large font-weight-bold"
                data-cy="additional-comments-label"
              >
                Additional comments
                <span
                  class="ml-space-sm bg-light-3 text-xs px-space-xxs py-lg-space-xxxs"
                  data-cy="additional-comments-optional"
                >
                  Optional
                </span>
              </p>
            </template>
            <b-form-textarea
              rows="5"
              v-model="form.description"
              placeholder="Share any specific questions, comments or additional information that may help with your request."
              data-cy="additional-comments-textarea"
            ></b-form-textarea>
            <b-form-invalid-feedback
              v-if="!$v.form.description.maxLength"
              data-cy="additional-comments-error"
            >
              The comments cannot be more than 32000 characters long.
            </b-form-invalid-feedback>
          </b-form-group>
          <!-- submit button -->
          <div
            class="mt-space-sm"
            data-cy="form-need-help-submit-help-request-button"
          >
            <b-button
              type="submit"
              variant="primary"
              :disabled="isCreateSupportDisabled"
              data-cy="submit-help-request-button"
            >
              <span v-if="!showLoader">Submit help request</span>

              <div v-else class="d-inline">
                <span>Submitting </span>
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
  </div>
</template>

<script>
import {
  BForm,
  BFormGroup,
  BFormInvalidFeedback,
  BFormTextarea,
  BFormRadio,
  BButton,
} from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/app-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import { EnumApiConstants } from "@/content/enum-app.js";

export default {
  name: "PortalFormNeedHelp",
  mixins: [validationMixin],
  components: {
    "b-form": BForm,
    "b-form-group": BFormGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-textarea": BFormTextarea,
    "b-form-radio": BFormRadio,
    "b-button": BButton,
    "base-alert": BaseAlert,
  },
  data() {
    return {
      EnumApiConstants: EnumApiConstants,
      showLoader: false,
      alert: {
        show: false,
        text: null,
        type: null,
      },
      supportOptions: [
        {
          text: "I don't want to be an online student.",
          value: "I don't want to be an online student.",
        },
        {
          text: "I can't find the program I want.",
          value: "I can't find the program I want.",
        },
        {
          text: "I have a visa-related issue.",
          value: "I have a visa-related issue.",
        },
      ],
      form: {
        support: null,
        description: null,
      },
    };
  },
  validations: {
    form: {
      support: {
        required,
        maxLength: maxLength(255),
      },
      description: {
        maxLength: maxLength(32000),
      },
    },
  },
  computed: {
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useAppStore, {
      appSelectedUndergradApplicationId: "selectedUndergradApplicationId",
    }),
    isCreateSupportDisabled() {
      return this.$v.form.$invalid || this.showLoader;
    },
  },
  methods: {
    ...mapActions(useAppStore, {
      addAppSupportTicket: "addSupportTicket",
    }),
    async handleCreateSupportSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.showLoader = true;
      const sanitizedDescription = this.form.description
        ? this.form.description.replace(
            /(<([^>]+)>|\r\n|\r\n\t|\n|\r|\t)/gm,
            ""
          )
        : null;
      // create support-ticket
      const response = await this.addAppSupportTicket(
        this.authToken,
        this.EnumApiConstants.SalesforceEdPlus,
        this.form.support,
        sanitizedDescription,
        this.appSelectedUndergradApplicationId
      );

      // reset form values
      this.form.support = null;
      this.form.description = null;

      // reset vuelidate validations
      this.$v.form.$reset();

      // reset showLoader
      this.showLoader = false;

      if (response.code === 201) {
        // display success message
        this.alert.type = "success";
        this.alert.text =
          "Your request has been sent. Please continue with your application and we will reach out to you within one to two business days.";
        this.alert.show = true;
      } else {
        // display error
        this.alert.type = "error";
        this.alert.text = response.errors[0];
        this.alert.show = true;

        // fire data layer event
      }

      // reset the alert after 3 seconds
      setTimeout(() => {
        this.alert.type = null;
        this.alert.text = null;
        this.alert.show = null;
      }, 8000);
    },
  },
};
</script>

<style lang="scss" scoped></style>

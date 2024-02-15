<template>
  <main id="main-content" data-cy="profile-edit-preferred-first-name">
    <section class="py-space-lg">
      <div class="container">
        <div class="col-12 offset-lg-3 col-lg-6">
          <div class="row">
            <div class="col-12">
              <div class="mb-space-md">
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
                  data-cy="preferred-first-name-alert"
                ></base-alert>

                <!-- form -->
                <div id="update-preferred-first-name-form-container">
                  <b-form
                    id="update-preferred-first-name-form"
                    novalidate
                    @submit.stop.prevent="handleUpdatePreferredFirstName"
                  >
                    <b-form-group
                      data-cy="profile-edit-preferred-first-name-preferred-first-name-group"
                      id="preferred-first-name-group"
                      aria-label="preferred first name group"
                      class="position-relative mb-space-md pb-space-sm"
                    >
                      <template #label>
                        <label
                          for="preferred-first-name"
                          class="font-weight-bold mb-space-xs"
                        >
                          Preferred first name
                          <span
                            class="ml-space-xs bg-light-3 px-space-xxs py-lg-space-xxxs font-weight-normal"
                          >
                            Optional
                          </span>
                          <span
                            class="ml-space-xs"
                            tabindex="0"
                            v-b-tooltip
                            title="Fill out this field if the first name you prefer to be called is different from your legal first name."
                          >
                            <font-awesome-icon
                              icon="fa-sharp fa-regular fa-circle-question"
                            ></font-awesome-icon>
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
                    <div
                      data-cy="profile-edit-preferred-first-name-save-button"
                    >
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
      </div>
    </section>
  </main>
</template>

<script>
import {
  BForm,
  BButton,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  VBTooltip,
} from "bootstrap-vue";
import { useAppStore } from "@/stores/app-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { mapState, mapActions } from "pinia";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import { EnumPageNames } from "@/content/enum-app.js";
import { validationMixin } from "vuelidate";
import { maxLength, helpers } from "vuelidate/lib/validators";

export default {
  name: "ProfileEditPreferredFirstNameView",
  mixins: [validationMixin],
  directives: {
    "b-tooltip": VBTooltip,
  },
  components: {
    "b-button": BButton,
    "b-form": BForm,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "base-alert": BaseAlert,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      submitDisabled: false,
      showLoader: false,
      alert: { show: false, text: null, type: null },
      form: { preferredFirstName: null },
    };
  },
  metaInfo() {
    return {
      title: "Profile | Edit Preferred First Name",
      titleTemplate: "%s - Arizona State University",
    };
  },
  validations: {
    form: {
      preferredFirstName: {
        maxLength: maxLength(30),
        validName: function (value) {
          return (
            !helpers.req(value) || /^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(value)
          );
        },
      },
    },
  },
  computed: {
    ...mapState(useAppStore, {
      selectedUndergradApplicationId: "selectedUndergradApplicationId",
    }),
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useUserStore, { userPreferredFirstName: "preferredFirstName" }),
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
  },
  methods: {
    ...mapActions(useUserStore, {
      updatePreferredFirstName: "updatePreferredFirstName",
    }),
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
      updateisGeneralLoaderVisibleStatus: "updateisGeneralLoaderVisibleStatus",
    }),
    initializeFormValues() {
      // initialize form models with state value
      this.form.preferredFirstName = this.userPreferredFirstName;
    },
    async handleUpdatePreferredFirstName() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.submitDisabled = true;
      this.showLoader = true;
      // updating the visibility of general loader to false
      this.updateisGeneralLoaderVisibleStatus(false);

      const payloadData = { preferredFirstName: this.form.preferredFirstName };

      // api call to update
      const response = await this.updatePreferredFirstName(
        this.authToken,
        this.selectedUndergradApplicationId,
        payloadData
      );

      // reset showLoader and submitDisabled
      this.showLoader = false;
      this.submitDisabled = false;
      // resetting the visibility of general loader
      this.updateisGeneralLoaderVisibleStatus(true);

      if (response.code === 200) {
        // route user to profile page
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
    this.initializeFormValues();
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
};
</script>

<style lang="scss" scoped></style>

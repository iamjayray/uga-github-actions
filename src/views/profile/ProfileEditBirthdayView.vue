<template>
  <main id="main-content" data-cy="profile-edit-birthday-view">
    <section class="py-space-lg">
      <div class="container">
        <div class="row">
          <div class="col-12 offset-lg-3 col-lg-6">
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
                data-cy="birthday-edit-alert"
              ></base-alert>

              <!-- form -->
              <div id="update-dob-form-container">
                <b-form
                  id="update-date-of-birth-form"
                  novalidate
                  @submit.stop.prevent="handleUpdateDateOfBirthSubmit"
                >
                  <p class="mb-space-xs text-large font-weight-bold">
                    Birthday
                  </p>
                  <div
                    class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center"
                  >
                    <!-- month -->
                    <b-form-group
                      data-cy="profile-edit-birthday-update-dob-month-group"
                      id="month-group"
                      aria-label="month-group"
                      class="col-12 col-lg-5 px-0 pl-lg-0 pr-lg-space-xs position-relative mb-0 pb-space-sm"
                    >
                      <base-select
                        id="update-dob-month"
                        v-model="$v.form.dobMonth.$model"
                        :options="dobMonthOptions"
                        placeholder-text="Month"
                        @input="handleDobMonthInput"
                        :on-error-msg="dobMonthErrorMessages"
                      ></base-select>
                    </b-form-group>

                    <!-- day -->
                    <b-form-group
                      data-cy="profile-edit-birthday-update-dob-day-group"
                      id="day-group"
                      aria-label="day-group"
                      class="col-12 col-lg-3 px-0 pl-lg-0 pr-lg-space-xs position-relative mb-0 pb-space-sm"
                    >
                      <base-select
                        id="update-dob-day"
                        v-model="$v.form.dobDay.$model"
                        :options="dobDayOptions"
                        placeholder-text="Day"
                        :on-error-msg="dobDayErrorMessages"
                      ></base-select>
                    </b-form-group>

                    <!-- year -->
                    <b-form-group
                      data-cy="profile-edit-birthday-update-dob-year-group"
                      id="year-group"
                      aria-label="year-group"
                      class="col-12 col-lg-4 px-0 pl-lg-0 pr-lg-space-xs position-relative mb-0 pb-space-sm"
                    >
                      <base-select
                        id="update-dob-year"
                        v-model="$v.form.dobYear.$model"
                        :options="dobYearOptions"
                        placeholder-text="Year"
                        :on-error-msg="dobYearErrorMessages"
                        @input="handleDobYearInput"
                      ></base-select>
                    </b-form-group>
                  </div>
                  <div>
                    <b-button
                      type="submit"
                      variant="dark-3"
                      class="px-space-sm mr-space-md"
                      :disabled="submitDisabled"
                      data-cy="profile-edit-birthday-save-button"
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
import { BForm, BButton, BFormGroup, VBTooltip } from "bootstrap-vue";
import { useAppStore } from "@/stores/app-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { mapState, mapActions } from "pinia";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import { EnumPageNames } from "@/content/enum-app.js";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import MonthOptions from "@/content/months.json";
import { getDaysInMonth } from "date-fns";

export default {
  name: "ProfileEditBirthdayView",
  mixins: [validationMixin],
  directives: {
    "b-tooltip": VBTooltip,
  },
  metaInfo() {
    return {
      title: "Profile | Edit Date of Birth",
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "b-button": BButton,
    "b-form": BForm,
    "b-form-group": BFormGroup,
    "base-alert": BaseAlert,
    "base-select": BaseSelect,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      MonthOptions: MonthOptions,
      dobMonthOptions: [],
      dobDayOptions: [],
      dobYearOptions: [],
      submitDisabled: false,
      showLoader: false,
      alert: { show: false, text: null, type: null },
      form: { dobMonth: null, dobDay: null, dobYear: null },
    };
  },
  validations: {
    form: {
      dobMonth: {
        required,
      },
      dobDay: {
        required,
      },
      dobYear: {
        required,
      },
    },
  },
  computed: {
    ...mapState(useAppStore, {
      selectedUndergradApplicationId: "selectedUndergradApplicationId",
    }),
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useUserStore, {
      userDobMonth: "dobMonth",
      userDobDay: "dobDay",
      userDobYear: "dobYear",
    }),
    dobMonthErrorMessages() {
      let messages = [];

      if (this.$v.form.dobMonth.$dirty && this.$v.form.dobMonth.$error) {
        if (!this.$v.form.dobMonth.required) {
          messages.push("This is a required field");
        }
      }

      return messages;
    },
    dobDayErrorMessages() {
      let messages = [];

      if (this.$v.form.dobDay.$dirty && this.$v.form.dobDay.$error) {
        if (!this.$v.form.dobDay.required) {
          messages.push("This is a required field");
        }
      }

      return messages;
    },
    dobYearErrorMessages() {
      let messages = [];

      if (this.$v.form.dobYear.$dirty && this.$v.form.dobYear.$error) {
        if (!this.$v.form.dobYear.required) {
          messages.push("This is a required field");
        }
      }

      return messages;
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      updateUserDateOfBirth: "updateDateOfBirth",
    }),
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
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
    generateDobYearOptions() {
      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear() - 4);

      const dateCopy = new Date(currentDate);
      dateCopy.setFullYear(currentDate.getFullYear() - 100);

      var options = [];
      for (var i = dateCopy.getFullYear(); i < currentDate.getFullYear(); i++) {
        options.push({ text: `${i}`, value: i });
      }

      this.dobYearOptions = options.sort((a, b) =>
        a.value > b.value ? -1 : b.value > a.value ? 1 : 0
      );
    },
    initializeFormValues() {
      // initialize form models with state value

      // setting form.dobYear
      const dobYearFilterResult = this.dobYearOptions.filter(
        (item) => item.value === this.userDobYear
      );
      if (dobYearFilterResult.length > 0) {
        this.form.dobYear = dobYearFilterResult[0];
      }

      // setting form.dobMonth
      const dobMonthFilterResult = this.dobMonthOptions.filter(
        (item) => item.value === this.userDobMonth
      );
      if (dobMonthFilterResult.length > 0) {
        this.form.dobMonth = dobMonthFilterResult[0];

        this.updateDayOptions();
      }

      // setting form.dobDay
      const dobDayFilterResult = this.dobDayOptions.filter(
        (item) => item.value === this.userDobDay
      );
      if (dobDayFilterResult.length > 0) {
        this.form.dobDay = dobDayFilterResult[0];
      }
    },
    handleDobMonthInput() {
      this.updateDayOptions();
    },
    handleDobYearInput() {
      this.updateDayOptions();
    },
    updateDayOptions() {
      // getting the total number of days in a month using getDaysInMonth method using month and year selected.
      // If month and year are not selected using Jan and 2000 as defalut month and year to get the days options
      let days = getDaysInMonth(
        new Date(
          this.form.dobYear ? this.form.dobYear.value : "2000",
          this.form.dobMonth ? this.form.dobMonth?.monthIndex : "0"
        )
      );
      this.dobDayOptions = this.generateMonthDayOptions(days);

      // resetting the dobDay if it's not available in the options
      if (
        this.form.dobDay &&
        !this.dobDayOptions.some(
          (item) => item.value === this.form.dobDay?.value
        )
      ) {
        this.form.dobDay = null;
      }
    },
    async handleUpdateDateOfBirthSubmit() {
      this.$v.form.$touch();

      if (this.$v.form.$anyError) {
        return;
      }
      // updating the visibility of general loader to false
      this.updateisGeneralLoaderVisibleStatus(false);
      this.submitDisabled = true;
      this.showLoader = true;

      const payloadData = {
        dateOfBirth: `${this.form.dobYear.value}-${this.form.dobMonth.value}-${this.form.dobDay.value}T00:00:00.000`,
      };

      // api call to update
      const response = await this.updateUserDateOfBirth(
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
    // populate data from static json files
    this.dobMonthOptions = this.MonthOptions.sort((a, b) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0
    );
    this.generateDobYearOptions();
    // initialize form data from state
    this.initializeFormValues();
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
};
</script>

<style lang="scss" scoped></style>

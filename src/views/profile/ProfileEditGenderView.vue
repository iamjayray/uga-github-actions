<template>
  <main id="main-content" data-cy="profile-edit-gender-view">
    <section class="py-space-lg">
      <div class="container">
        <div class="col-12 offset-lg-2 col-lg-8">
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
                data-cy="edit-gender-alert"
              ></base-alert>

              <!-- form -->
              <div>
                <b-form
                  id="update-gender-form"
                  novalidate
                  @submit.stop.prevent="handleUpdateGenderSubmit"
                >
                  <b-form-group
                    data-cy="profile-edit-gender-gender-group"
                    id="gender-group"
                    class="mb-space-md mb-lg-space-xl"
                    aria-label="gender-group"
                  >
                    <template #label>
                      <label
                        for="gender"
                        class="text-large font-weight-bold mb-space-md"
                      >
                        Gender identity
                        <span
                          class="ml-space-xs"
                          tabindex="0"
                          v-b-tooltip
                          title="Choose the option that best represents you. This information helps us provide a personalized experience."
                        >
                          <font-awesome-icon
                            icon="fa-sharp fa-regular fa-circle-question"
                          ></font-awesome-icon>
                        </span>
                      </label>
                    </template>

                    <base-radio-group
                      name="gender"
                      :options="genderOptions"
                      v-model="form.gender"
                    ></base-radio-group>
                  </b-form-group>

                  <div
                    id="update-gender-submit"
                    data-cy="profile-edit-gender-update-gender-submit"
                  >
                    <b-button
                      type="submit"
                      variant="dark-3"
                      class="px-space-sm mr-space-md"
                      :disabled="isSubmitDisabled"
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
import { BButton, BForm, BFormGroup, VBTooltip } from "bootstrap-vue";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/app-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { EnumPageNames } from "@/content/enum-app.js";

export default {
  name: "ProfileEditGenderView",
  directives: { "b-tooltip": VBTooltip },
  components: {
    "b-form": BForm,
    "b-form-group": BFormGroup,
    "b-button": BButton,
    "base-alert": BaseAlert,
    "base-radio-group": BaseRadioGroup,
  },
  metaInfo() {
    return {
      title: "Profile | Edit Gender",
      titleTemplate: "%s - Arizona State University",
    };
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      genderOptions: [],
      showLoader: false,
      submitDisabled: false,
      alert: {
        show: false,
        text: null,
        type: "error",
      },
      form: {
        gender: null,
      },
    };
  },
  computed: {
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useAppStore, {
      selectedUndergradApplicationId: "selectedUndergradApplicationId",
    }),
    ...mapState(useConfigStore, {
      configGenders: "genders",
    }),
    ...mapState(useUserStore, {
      userGenders: "genders",
    }),
    isSubmitDisabled() {
      return this.form.gender === null || this.submitDisabled;
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      addUserGenders: "addGenders",
      updateUserGenders: "updateGenders",
    }),
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
      updateisGeneralLoaderVisibleStatus: "updateisGeneralLoaderVisibleStatus",
    }),
    initializeFormValues() {
      if (this.userGenders.length > 0) {
        const filterResult = this.genderOptions.filter(
          (item) =>
            item.genderIdentity === this.userGenders[0]["genderIdentity"]
        );

        if (filterResult.length > 0) {
          this.form.gender = filterResult[0];
        }
      }
    },
    async handleUpdateGenderSubmit() {
      // updating the visibility of general loader to false
      this.updateisGeneralLoaderVisibleStatus(false);
      this.submitDisabled = true;
      this.showLoader = true;

      let response = null;
      let payload = [{ genderIdentity: this.form.gender.genderIdentity }];

      // case-1: if userGenders does not exist
      if (this.userGenders.length === 0) {
        response = await this.addUserGenders(
          this.authToken,
          this.selectedUndergradApplicationId,
          payload
        );
      } else {
        // case-2: if userGenders does exist
        response = await this.updateUserGenders(
          this.authToken,
          this.selectedUndergradApplicationId,
          payload
        );
      }

      // resetting the visibility of general loader
      this.updateisGeneralLoaderVisibleStatus(true);

      if (response.code === 201 || response.code === 200) {
        // route user to profile page
        this.$router.push({ name: this.EnumPageNames.PageProfile });
      } else {
        // reset form values
        this.initializeFormValues();

        // reset flags
        this.showLoader = false;
        this.submitDisabled = false;

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
    //populate gender options
    this.genderOptions = this.configGenders.map((item) => {
      return { ...item, text: item.genderIdentity, value: item.genderIdentity };
    });

    // form model with state value
    this.initializeFormValues();
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <main id="main-content" data-cy="profile-edit-pronoun-view">
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
                data-cy="edit-pronoun-alert"
              ></base-alert>

              <!-- form -->
              <div id="update-pronoun-form-container">
                <b-form
                  id="update-pronoun-form"
                  novalidate
                  @submit.stop.prevent="handleUpdatePronounSubmit"
                >
                  <b-form-group
                    data-cy="profile-edit-pronoun-pronoun-group"
                    id="pronoun-group"
                    class="mb-space-md mb-lg-space-xl"
                    aria-label="pronoun-group"
                  >
                    <template #label>
                      <label
                        for="pronoun"
                        class="text-large font-weight-bold mb-space-md"
                      >
                        Pronouns
                        <span
                          class="ml-space-xs"
                          tabindex="0"
                          v-b-tooltip
                          title="Please let us know your preferred pronouns. This information helps us provide a personalized experience."
                        >
                          <font-awesome-icon
                            icon="fa-sharp fa-regular fa-circle-question"
                          ></font-awesome-icon>
                        </span>
                      </label>
                    </template>

                    <base-radio-group
                      name="pronoun"
                      :options="pronounOptions"
                      v-model="form.pronoun"
                    ></base-radio-group>
                  </b-form-group>

                  <div
                    id="update-pronoun-submit"
                    data-cy="profile-edit-pronoun-update-pronoun-save-button"
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
  name: "ProfileEditPronounView",
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
      title: "Profile | Edit Pronouns",
      titleTemplate: "%s - Arizona State University",
    };
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      pronounOptions: [],
      showLoader: false,
      submitDisabled: false,
      alert: {
        show: false,
        text: null,
        type: "error",
      },
      form: {
        pronoun: null,
      },
    };
  },
  computed: {
    ...mapState(useAuthStore, {
      authToken: "token",
    }),
    ...mapState(useAppStore, {
      selectedUndergradApplicationId: "selectedUndergradApplicationId",
    }),
    ...mapState(useConfigStore, {
      configPronouns: "pronouns",
    }),
    ...mapState(useUserStore, {
      userPronouns: "pronouns",
    }),
    isSubmitDisabled() {
      return this.form.pronoun === null || this.submitDisabled;
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      addUserPronouns: "addPronouns",
      updateUserPronouns: "updatePronouns",
    }),
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
      updateisGeneralLoaderVisibleStatus: "updateisGeneralLoaderVisibleStatus",
    }),
    initializeFormValues() {
      // initialize form model with state value
      if (this.userPronouns.length > 0) {
        let filterResult = this.pronounOptions.filter(
          (item) => item.pronoun === this.userPronouns[0]["pronoun"]
        );

        if (filterResult.length > 0) {
          this.form.pronoun = filterResult[0];
        }
      }
    },
    async handleUpdatePronounSubmit() {
      this.submitDisabled = true;
      this.showLoader = true;
      // updating the visibility of general loader to false
      this.updateisGeneralLoaderVisibleStatus(false);

      let response = null;
      let payload = [{ pronoun: this.form.pronoun.pronoun }];

      // case-1: if userPronouns does not exist => create
      if (this.userPronouns.length === 0) {
        response = await this.addUserPronouns(
          this.authToken,
          this.selectedUndergradApplicationId,
          payload
        );
      } else {
        // case-2: if userPronouns does exist => update
        response = await this.updateUserPronouns(
          this.authToken,
          this.selectedUndergradApplicationId,
          payload
        );
      }

      if (response.code === 201 || response.code === 200) {
        // route user to profile page
        this.$router.push({ name: this.EnumPageNames.PageProfile });
        // resetting the visibility of general loader
        this.updateisGeneralLoaderVisibleStatus(true);
      } else {
        // reset form values
        this.initializeFormValues();

        // reset flags
        this.showLoader = false;
        this.submitDisabled = false;
        // resetting the visibility of general loader
        this.updateisGeneralLoaderVisibleStatus(true);

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
    // populate pronounOptions from configOptions
    this.pronounOptions = this.configPronouns.map((item) => {
      return { ...item, text: item.pronoun, value: item.pronoun };
    });

    // form model with state value
    this.initializeFormValues();
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
};
</script>

<style lang="scss" scoped></style>

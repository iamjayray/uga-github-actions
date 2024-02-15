<template>
  <main id="main-content" data-cy="profile-index-view">
    <section class="py-space-lg">
      <div class="container">
        <div class="row">
          <div class="col-12 offset-lg-3 col-lg-6">
            <!-- row-user-info -->
            <div class="row" data-cy="profile-index-user-info">
              <div class="col-12">
                <div class="mb-space-md">
                  <p class="bg-dark-3 text-light-1 d-inline p-space-xxxs">
                    Applicant profile
                  </p>
                </div>

                <!-- avatar-block -->
                <div v-if="hasUndergradApplications">
                  <div
                    class="d-flex flex-row align-items-start justify-content-start"
                  >
                    <b-avatar size="48px" variant="secondary"></b-avatar>
                    <div class="ml-space-xs">
                      <p
                        id="user_name"
                        class="font-weight-bold mb-space-xxxs text-large"
                      >
                        Welcome, {{ userFormattedFullName }}
                      </p>
                      <p id="user_app_id" class="text-small text-dark-2 mb-0">
                        Application ID: {{ selectedUndergradApplicationId }}
                      </p>
                    </div>
                  </div>
                  <hr class="my-space-sm my-lg-space-md" />
                </div>
              </div>
            </div>

            <!-- row-personal-info -->
            <div
              v-if="hasUndergradApplications"
              class="row"
              data-cy="profile-index-personal-info"
            >
              <div class="col-12">
                <p class="text-large text-dark-2 mb-space-xs">
                  Personal Information
                </p>
                <!-- legal name -->
                <div class="mb-space-sm" data-cy="profile-index-legal-name">
                  <div
                    class="d-flex align-items-center justify-content-between"
                  >
                    <p class="text-dark-2 text-xs font-weight-bold">
                      Legal name
                    </p>

                    <router-link
                      v-if="!isUndergradAppSubmitted"
                      :to="{ name: EnumPageNames.PageProfileEditName }"
                      @click.native="handleRouteChange('Legal name')"
                      class="text-dark-3 mb-space-xs"
                    >
                      <span class="mr-space-xxs font-weight-bold">
                        {{ userLegalFullName }}
                      </span>
                      <font-awesome-icon
                        icon="fa-pencil"
                        class="text-dark-2"
                      ></font-awesome-icon>
                    </router-link>

                    <p v-else class="text-dark-3 font-weight-bold">
                      {{ userLegalFullName }}
                    </p>
                  </div>
                  <hr class="my-0" />
                </div>

                <!-- preferred first name -->
                <div
                  class="mb-space-sm"
                  data-cy="profile-index-preferred-first-name"
                >
                  <div
                    class="d-flex align-items-center justify-content-between"
                  >
                    <p class="text-dark-2 text-xs font-weight-bold">
                      Preferred first name
                      <span
                        class="ml-space-xs"
                        v-b-tooltip
                        title="What name would you like us to use when we communicate with you?"
                      >
                        <font-awesome-icon
                          icon="fa-sharp fa-regular fa-circle-question"
                        ></font-awesome-icon>
                      </span>
                    </p>

                    <router-link
                      @click.native="handleRouteChange('Preferred first name')"
                      v-if="!isUndergradAppSubmitted"
                      :to="{
                        name: EnumPageNames.PageProfileEditPreferredFirstName,
                      }"
                      class="text-dark-2 mb-space-xs"
                    >
                      <span class="mr-space-xxs font-weight-bold">
                        {{ displayPreferredFirstName }}
                      </span>
                      <font-awesome-icon
                        icon="fa-pencil"
                        class="text-dark-2"
                      ></font-awesome-icon>
                    </router-link>
                    <p v-else class="text-dark-3 font-weight-bold">
                      {{ displayPreferredFirstName }}
                    </p>
                  </div>
                  <hr class="my-0" />
                </div>

                <!-- birthday -->
                <div class="mb-space-sm" data-cy="profile-index-birthday">
                  <div
                    class="d-flex align-items-center justify-content-between"
                  >
                    <p class="text-dark-2 text-xs font-weight-bold">Birthday</p>

                    <router-link
                      @click.native="handleRouteChange('Birthday')"
                      v-if="!isUndergradAppSubmitted"
                      :to="{ name: EnumPageNames.PageProfileEditBirthday }"
                      class="text-dark-2 mb-space-xs"
                    >
                      <span class="mr-space-xxs font-weight-bold">
                        {{ userFormattedBirthday }}
                      </span>
                      <font-awesome-icon
                        icon="fa-pencil"
                        class="text-dark-2"
                      ></font-awesome-icon>
                    </router-link>
                    <p v-else class="text-dark-3 font-weight-bold">
                      {{ userFormattedBirthday }}
                    </p>
                  </div>
                  <hr class="my-0" />
                </div>

                <!-- pronouns -->
                <div class="mb-space-sm" data-cy="profile-index-pronouns">
                  <div
                    class="d-flex align-items-center justify-content-between"
                  >
                    <p class="text-dark-2 text-xs font-weight-bold">
                      Pronouns
                      <span
                        class="ml-space-xs"
                        v-b-tooltip
                        title="Please let us know your preferred pronouns. This information helps us provide a personalized experience."
                      >
                        <font-awesome-icon
                          icon="fa-sharp fa-regular fa-circle-question"
                        ></font-awesome-icon>
                      </span>
                    </p>

                    <router-link
                      v-if="!isUndergradAppSubmitted"
                      :to="{ name: EnumPageNames.PageProfileEditPronoun }"
                      @click.native="handleRouteChange('Pronouns')"
                      class="text-dark-2 mb-space-xs"
                    >
                      <span class="mr-space-xxs font-weight-bold">
                        {{ displayPronoun }}
                      </span>
                      <font-awesome-icon
                        icon="fa-pencil"
                        class="text-dark-2"
                      ></font-awesome-icon>
                    </router-link>
                    <p v-else class="text-dark-3 font-weight-bold">
                      {{ displayPronoun }}
                    </p>
                  </div>
                  <hr class="my-0" />
                </div>

                <!-- gender-identity -->
                <div
                  class="mb-space-xl"
                  data-cy="profile-index-gender-identity"
                >
                  <div
                    class="d-flex align-items-center justify-content-between"
                  >
                    <p class="text-dark-2 text-xs font-weight-bold">
                      Gender identity
                      <span
                        class="ml-space-xs"
                        v-b-tooltip
                        title="Choose the option that best represents you. This information helps us provide a personalized experience."
                      >
                        <font-awesome-icon
                          icon="fa-sharp fa-regular fa-circle-question"
                        ></font-awesome-icon>
                      </span>
                    </p>

                    <router-link
                      v-if="!isUndergradAppSubmitted"
                      @click.native="handleRouteChange('Gender identity')"
                      :to="{ name: EnumPageNames.PageProfileEditGender }"
                      class="text-dark-2 mb-space-xs"
                    >
                      <span class="mr-space-xxs font-weight-bold">
                        {{ displayGender }}
                      </span>
                      <font-awesome-icon
                        icon="fa-pencil"
                        class="text-dark-2"
                      ></font-awesome-icon>
                    </router-link>
                    <p v-else class="text-dark-3 font-weight-bold">
                      {{ displayGender }}
                    </p>
                  </div>
                  <hr class="my-0" />
                </div>
              </div>
            </div>

            <!-- row-account-info -->
            <div class="row" data-cy="profile-index-account-info">
              <div class="col-12">
                <p class="text-large text-dark-2 mb-space-md">
                  Account Information
                </p>

                <!-- email -->
                <div class="mb-space-sm">
                  <div
                    class="d-flex align-items-center justify-content-between"
                    data-cy="profile-index-account-info-email"
                  >
                    <p class="text-dark-2 text-xs font-weight-bold">Email</p>
                    <p class="font-weight-bold mb-space-xs text-right">
                      {{ userEmail }}
                    </p>
                  </div>
                  <hr class="my-0" />
                </div>

                <!-- password -->
                <template v-if="userType === EnumNameTypes.UserTypeSelf">
                  <div class="mb-space-sm">
                    <div
                      class="d-flex align-items-center justify-content-between"
                      data-cy="profile-index-account-info-password"
                    >
                      <p class="text-dark-2 text-xs font-weight-bold">
                        Password
                      </p>
                      <router-link
                        :to="{ name: EnumPageNames.PageProfileResetPassword }"
                        class="text-dark-2 mb-space-xs text-underline"
                      >
                        Reset password
                      </router-link>
                    </div>
                    <hr class="my-0" />
                  </div>
                </template>

                <!-- main phone -->
                <div
                  class="mb-space-sm"
                  data-cy="profile-index-account-info-main-phone-number"
                >
                  <div
                    class="d-flex align-items-center justify-content-between"
                  >
                    <p class="text-dark-2 text-xs font-weight-bold">
                      Phone number
                    </p>

                    <router-link
                      v-if="!isUndergradAppSubmitted"
                      :to="{ name: EnumPageNames.PageProfileEditPhoneNumber }"
                      class="text-dark-2 mb-space-xs"
                    >
                      <span class="mr-space-xxs font-weight-bold">
                        {{ displayMainPhoneNumber }}
                      </span>
                      <font-awesome-icon
                        icon="fa-pencil"
                        class="text-dark-2"
                      ></font-awesome-icon>
                    </router-link>
                    <p v-else class="text-dark-3 font-weight-bold">
                      {{ displayMainPhoneNumber }}
                    </p>
                  </div>
                  <hr class="my-0" />
                </div>

                <!-- mobile phone number -->
                <template v-if="displayMobilePhoneNumber">
                  <div
                    class="mb-space-sm"
                    data-cy="profile-index-account-info-mobile-phone-number"
                  >
                    <div
                      class="d-flex align-items-center justify-content-between"
                    >
                      <p class="text-dark-2 text-xs font-weight-bold">
                        Mobile phone number
                      </p>

                      <router-link
                        v-if="!isUndergradAppSubmitted"
                        :to="{ name: EnumPageNames.PageProfileEditPhoneNumber }"
                        class="text-dark-2 mb-space-xs"
                      >
                        <span class="mr-space-xxs font-weight-bold">
                          {{ displayMobilePhoneNumber }}
                        </span>
                        <font-awesome-icon
                          icon="fa-pencil"
                          class="text-dark-2"
                        ></font-awesome-icon>
                      </router-link>
                      <p v-else class="text-dark-3 font-weight-bold">
                        {{ displayMobilePhoneNumber }}
                      </p>
                    </div>
                    <hr class="my-0" />
                  </div>
                </template>

                <!-- SMS messaging -->
                <div
                  class="mb-space-sm"
                  data-cy="profile-index-account-info-receive-info-by-sms"
                >
                  <div
                    class="d-flex align-items-center justify-content-between"
                  >
                    <p class="text-dark-2 text-xs font-weight-bold">
                      Want to stay engaged with ASU via SMS messaging
                    </p>

                    <router-link
                      v-if="!isUndergradAppSubmitted"
                      :to="{ name: EnumPageNames.PageProfileEditPhoneNumber }"
                      class="text-dark-2 mb-space-xs"
                    >
                      <span class="mr-space-xxs font-weight-bold">
                        {{ displayReceiveInfoBySMS }}
                      </span>
                      <font-awesome-icon
                        icon="fa-pencil"
                        class="text-dark-2"
                      ></font-awesome-icon>
                    </router-link>
                    <p v-else class="text-dark-3 font-weight-bold">
                      {{ displayReceiveInfoBySMS }}
                    </p>
                  </div>
                  <hr class="my-0" />
                </div>
              </div>
            </div>

            <!-- row-cta -->
            <div class="row" data-cy="profile-index-return-to-dashboard-cta">
              <div class="col-12">
                <router-link
                  :to="{ name: EnumPageNames.PageDashboard }"
                  class="btn btn-primary mb-space-lg"
                >
                  Return to dashboard
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { BAvatar, VBTooltip } from "bootstrap-vue";
import { EnumPageNames } from "@/content/enum-app.js";
import { EnumNameTypes } from "@/content/enum-ug-application.js";
import { EnumStringConstants } from "@/content/enum-ug-application.js";
import { useUserStore } from "@/stores/user-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { mapState, mapActions } from "pinia";

export default {
  name: "ProfileIndexView",
  directives: { "b-tooltip": VBTooltip },
  components: {
    "b-avatar": BAvatar,
  },
  metaInfo() {
    return {
      title: "Profile | Home",
      titleTemplate: "%s - Arizona State University",
    };
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      EnumNameTypes: EnumNameTypes,
      EnumStringConstants: EnumStringConstants,
    };
  },
  computed: {
    ...mapState(useUserStore, {
      userEmail: "email",
      userFormattedFullName: "formattedFullName",
      userLegalFullName: "legalFullName",
      userPreferredFirstName: "preferredFirstName",
      userFormattedBirthday: "formattedDob",
      userPronouns: "pronouns",
      userGenders: "genders",
      userType: "userType",
      userPhone: "phone",
      userReceiveInfoBySMS: "receiveInfoBySMS",
    }),
    ...mapState(useAppStore, {
      selectedUndergradApplicationId: "selectedUndergradApplicationId",
      isUndergradAppSubmitted: "isUndergradApplicationSubmitted",
      hasUndergradApplications: "hasUndergradApplications",
    }),
    displayPreferredFirstName() {
      return this.userPreferredFirstName
        ? this.userPreferredFirstName
        : this.isUndergradAppSubmitted
        ? "N/A"
        : "Add one";
    },
    displayPronoun() {
      return this.userPronouns.length > 0
        ? this.userPronouns[0]["pronoun"]
        : this.isUndergradAppSubmitted
        ? "N/A"
        : "Select";
    },
    displayGender() {
      // choose between otherValue vs value depending on genderIdentity

      let label = this.isUndergradAppSubmitted ? "N/A" : "Select";

      if (this.userGenders.length > 0) {
        if (
          this.userGenders[0].genderIdentity === this.EnumStringConstants.OTHER
        ) {
          label = this.userGenders[0].otherValue;
        } else {
          label = this.userGenders[0].genderIdentity;
        }
      }

      return label;
    },
    displayMainPhoneNumber() {
      const phone = this.userPhone(EnumNameTypes.mainPhoneType);
      // adding +1 US dialing code in the begining if the areacode is available
      return phone
        ? `${phone.areaCode ? `+1${phone.areaCode}` : ""}${phone.phoneNumber}`
        : "N/A";
    },
    displayMobilePhoneNumber() {
      const mainPhone = this.userPhone(EnumNameTypes.mainPhoneType);
      const mobilePhone = this.userPhone(EnumNameTypes.mobilePhoneType);
      if (!mobilePhone) {
        return "N/A";
      }
      // adding +1 US dialing code in the begining if the areacode is available
      return mainPhone.areaCode !== mobilePhone.areaCode ||
        mainPhone.phoneNumber !== mobilePhone.phoneNumber
        ? `${mobilePhone.areaCode ? `+1${mobilePhone.areaCode}` : ""}${
            mobilePhone.phoneNumber
          }`
        : null;
    },
    displayReceiveInfoBySMS() {
      return !this.userReceiveInfoBySMS
        ? "N/A"
        : this.userReceiveInfoBySMS === "Y"
        ? "Yes"
        : "No";
    },
  },
  methods: {
    handleRouteChange(section) {
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: section.toLowerCase(),
        text: "edit pencil",
        component: "personal information",
      });
    },
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
    }),
  },
  created() {
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
};
</script>

<style lang="scss" scoped></style>

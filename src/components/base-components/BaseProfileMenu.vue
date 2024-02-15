<template>
  <div class="position-relative" data-cy="profile-menu">
    <!-- Profile button -->
    <b-avatar
      aria-label="Profile menu"
      button
      :src="image"
      :variant="variant"
      size="46px"
      class="font-weight-bold profile-menu-button"
      :class="{ 'border border-dark-3': isProfileDropDownVisible }"
      @click="avatarButtonClick"
      data-cy="profile-menu-button"
    ></b-avatar>
    <!-- Profile Dropdown -->
    <template v-if="isProfileDropDownVisible">
      <div
        class="profile-dropdown bg-white border mt-space-xxs mr-space-xxxs p-space-sm position-absolute"
        data-cy="profile-dropdown"
      >
        <!-- block-user-info -->
        <div v-if="hasUndergradApplications" data-cy="profile-menu-user-info">
          <div class="d-flex px-space-xxxs pt-space-xxxs">
            <b-avatar
              :src="image"
              class="mr-space-xs font-weight-bold"
              size="46px"
              :variant="variant"
            ></b-avatar>
            <div class="pl-space-xxxs">
              <p class="text-large font-weight-bold mb-space-xxxs">
                {{ name }}
              </p>
              <p class="text-xs mb-0">{{ email }}</p>
            </div>
          </div>
          <hr class="my-space-sm" />
        </div>

        <!-- block-dashboard-link -->
        <div
          class="px-space-xxxs mb-space-sm pb-space-xxxs"
          v-if="!isUserTypeAdmin"
        >
          <router-link
            :to="{ name: EnumPageNames.PageDashboard }"
            @click="handleDashboardCtaClick"
            class="text-dark-2 text-decoration-none"
            data-cy="profile-menu-dashboard-button"
          >
            <font-awesome-icon
              icon="fa-gauge-high"
              class="mr-space-xs text-dark-1"
            ></font-awesome-icon>
            Dashboard
          </router-link>
        </div>

        <!-- block-edit-profile-link -->
        <div v-if="!isUserTypeAdmin">
          <div class="px-space-xxxs mb-space-sm pb-space-xxxs">
            <router-link
              :to="{ name: EnumPageNames.PageProfile }"
              @click="handleEditProfileLinkClick"
              class="text-dark-2 text-decoration-none"
              data-cy="profile-menu-edit-profile-button"
            >
              <font-awesome-icon
                icon="fa-pencil"
                class="mr-space-xs text-dark-1"
              ></font-awesome-icon>
              Edit profile
            </router-link>
          </div>
          <hr class="mb-space-sm pb-space-xxxs" />
        </div>

        <!-- block-signout-link -->
        <div>
          <button
            class="px-space-xxxs text-dark-2 border-0 bg-white"
            @click="handleSignOutClick"
            data-cy="profile-menu-sign-out-button"
          >
            <font-awesome-icon
              icon="fa-right-from-bracket"
              class="mr-space-xs text-dark-1"
            ></font-awesome-icon>
            <span> Sign out </span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { BAvatar } from "bootstrap-vue";
import { useUserStore } from "@/stores/user-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { mapState } from "pinia";
import { EnumPageNames } from "@/content/enum-app.js";

export default {
  name: "BaseProfileMenu",
  components: {
    "b-avatar": BAvatar,
  },
  props: {
    image: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: "secondary",
    },
    isUserTypeAdmin: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      isProfileDropDownVisible: false,
    };
  },
  computed: {
    ...mapState(useAppStore, {
      hasUndergradApplications: "hasUndergradApplications",
    }),
    ...mapState(useUserStore, {
      userEmail: "email",
      userFullName: "formattedFullName",
      adminEmail: "adminEmail",
      adminName: "adminName",
    }),
    email() {
      return this.isUserTypeAdmin ? this.adminEmail : this.userEmail;
    },
    name() {
      return this.isUserTypeAdmin ? this.adminName : this.userFullName;
    },
  },
  methods: {
    avatarButtonClick() {
      this.isProfileDropDownVisible = !this.isProfileDropDownVisible;
      this.$track({
        event: "collapse",
        action: this.isProfileDropDownVisible ? "open" : "close",
        name: "onclick",
        type: "click",
        region: "navbar",
        section: "main navbar",
        text: "profile logo",
      });
    },
    handleDashboardCtaClick(event) {
      this.$emit("dashboardClick", event);
    },
    handleEditProfileLinkClick(event) {
      this.$emit("editProfileClick", event);
    },
    handleSignOutClick(event) {
      this.$emit("signOutClick", event);
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-menu-button {
  width: fit-content;
  box-shadow: 0px 3px 6px #00000019;
}
.profile-dropdown {
  box-shadow: 0px 3px 6px #0000001c;
  min-width: 330px;
  right: 0px;
  z-index: 1024;
}
</style>

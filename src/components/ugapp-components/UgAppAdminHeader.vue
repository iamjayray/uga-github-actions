<template>
  <header
    class="app-admin-header border-bottom border-danger"
    data-cy="ug-app-admin-header"
  >
    <div class="container px-0">
      <div
        class="d-flex px-space-md px-lg-space-sm py-space-xs px-lg-gutter py-lg-space-sm"
      >
        <router-link
          target="_self"
          :to="{ name: EnumPageNames.PageHome }"
          class="my-auto"
        >
          <img
            src="@/assets/img/asu-vertical-logo.png"
            alt="asu logo"
            class="asu-header-logo"
          />
        </router-link>
        <div class="mx-lg-space-md my-auto d-none d-lg-block">
          <h3 class="h3-medium">Admin View</h3>
          <p class="text-small text-dark-2 mb-0">
            Application ID : {{ appId }}
          </p>
        </div>
        <div class="mx-lg-space-md my-auto d-flex d-lg-none">
          <p
            class="admin-view-label mx-space-xs my-auto font-weight-bold text-small d-lg-none"
          >
            Admin View
          </p>
          <p class="text-xs text-dark-2 mb-0 my-auto">
            Application ID : {{ appId }}
          </p>
        </div>
        <button
          class="btn text-small bg-white border border-dark-1 py-space-xxs px-space-xs my-auto d-none d-lg-block"
          @click="handleAdminHomeClick"
          data-cy="admin-home-button"
        >
          Admin home
        </button>
        <button
          class="btn text-small bg-white border border-dark-1 py-space-xxs px-space-xs my-auto ml-space-xs d-none d-lg-block"
          @click="handleSearchApplicationClick"
          data-cy="admin-search-for-another-app-button"
        >
          Search for another application
        </button>
        <!-- Base profile menu -->
        <div class="ml-auto d-none d-lg-flex">
          <base-profile-menu
            @signOutClick="handleSignOutClick"
            :isUserTypeAdmin="true"
          ></base-profile-menu>
        </div>
        <!-- END -->

        <!-- Mobile contents -->
        <button
          v-b-toggle.mobile-nav-collapse
          class="btn p-0 rounded-0 d-lg-none ml-auto my-auto"
        >
          <span class="when-closed">
            <font-awesome-icon
              icon="fa-bars"
              size="xl"
              aria-label="menu icon"
            ></font-awesome-icon>
          </span>
          <span class="when-open">
            <font-awesome-icon
              icon="fa-times"
              size="xl"
              aria-label="close icon"
            ></font-awesome-icon>
          </span>
        </button>
      </div>
    </div>
    <!-- Mobile nav collapse -->
    <b-collapse
      is-nav
      id="mobile-nav-collapse"
      class="d-lg-none mobile-collapse position-absolute w-100 border-bottom border-top border-danger"
      @shown="handleMobileMenuCollapse('open')"
      @hidden="handleMobileMenuCollapse('close')"
    >
      <div class="container px-0">
        <div class="px-space-md pt-space-sm mt-space-xxxs pb-space-md">
          <!-- block-user-info -->
          <div v-if="hasUndergradApplications" class="d-flex mb-space-sm">
            <b-avatar
              class="mr-space-xs font-weight-bold"
              size="46px"
              variant="secondary"
            ></b-avatar>
            <div>
              <p class="text-large font-weight-bold mb-space-xxxs">
                {{ adminFullName }}
              </p>
              <p class="text-xs mb-0">{{ adminEmail }}</p>
            </div>
          </div>
          <button
            class="btn text-small bg-white border border-dark-1 py-space-xxs px-space-xs mb-space-sm d-block"
            @click="handleAdminHomeClick"
          >
            Admin home
          </button>
          <button
            class="btn text-small bg-white border border-dark-1 py-space-xxs px-space-xs"
            @click="handleSearchApplicationClick"
          >
            Search for another application
          </button>
          <hr class="my-space-sm pb-space-xxxs" />
          <!-- block-sign-out-link -->
          <div>
            <a
              href="javascript:void(0)"
              class="text-dark-2 text-large text-decoration-none"
              @click="handleSignOutClick"
            >
              <font-awesome-icon
                icon="fa-right-from-bracket"
                class="mr-space-xs text-dark-1"
              ></font-awesome-icon>
              <span> Sign out</span>
            </a>
          </div>
        </div>
      </div>
    </b-collapse>
  </header>
</template>

<script>
import { BAvatar, BCollapse, VBToggle } from "bootstrap-vue";
import { useAppStore } from "@/stores/app-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { mapState, mapActions } from "pinia";
import { EnumPageNames } from "@/content/enum-app.js";
import BaseProfileMenu from "@/components/base-components/BaseProfileMenu.vue";

export default {
  name: "UgAppAdminHeader",
  components: {
    "base-profile-menu": BaseProfileMenu,
    "b-collapse": BCollapse,
    "b-avatar": BAvatar,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      appId: null,
    };
  },
  computed: {
    ...mapState(useAppStore, {
      hasUndergradApplications: "hasUndergradApplications",
    }),
    ...mapState(useAuthStore, {
      token: "token",
    }),
    ...mapState(useUserStore, {
      adminEmail: "adminEmail",
      adminFullName: "adminName",
    }),
    ...mapState(useUgApplicationStore, {
      applicationIsCurrentPageHasUnsavedChanges:
        "isCurrentPageHasUnsavedChanges",
    }),
  },
  methods: {
    ...mapActions(useAppStore, {
      populateUndergradApplications: "populateUndergradApplications",
    }),
    ...mapActions(useAuthStore, { logout: "logout" }),
    ...mapActions(useUgApplicationStore, {
      updateRedirectRouteName: "updateRedirectRouteName",
    }),
    ...mapActions(useUserStore, {
      populateAdminInfo: "populateAdminInfo",
    }),
    handleMobileMenuCollapse(action) {
      // fire data layer event
      this.$track({
        event: "collapse",
        action: action,
        name: "onclick",
        type: "click",
        region: "navbar",
        section: "main navbar",
        text: "menu button mobile",
      });
    },
    handleSignOutClick() {
      this.updateRedirectRouteName(EnumPageNames.PageUserLogin);
      // if any unsaved changes are there in app-page skipping the "logout" operation
      if (!this.applicationIsCurrentPageHasUnsavedChanges) {
        this.logout();
      }
      this.$router.push({ name: EnumPageNames.PageUserLogin });
    },
    async handleAdminHomeClick() {
      await this.logout();
      window.location.replace(import.meta.env.VITE_LEGACY_UGAPP_ADMIN_HOME_URL);
    },
    async handleSearchApplicationClick() {
      await this.logout();
      window.location.replace(import.meta.env.VITE_LEGACY_UGAPP_ADMIN_EDIT_URL);
    },
  },
  async created() {
    this.appId = this.$route.params.id;
    this.populateAdminInfo(this.token);
  },
};
</script>

<style lang="scss" scoped>
.app-header {
  box-shadow: 0px 3px 6px #0000001c;
}
.asu-header-logo {
  height: 36px;
  @media (max-width: 991px) {
    height: 24px;
  }
}
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
.mobile-collapse {
  z-index: 1024;
  box-shadow: 0px 3px 6px #00000010;
  background-color: #fff0f0 !important;
}
.app-admin-header {
  background-color: #fff0f0 !important;
}
.admin-view-label {
  width: min-content;
}
</style>

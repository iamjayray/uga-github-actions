<template>
  <header class="bg-light-1 app-header" data-cy="ug-app-header">
    <div class="container px-0">
      <div class="d-flex px-space-sm py-space-xs px-lg-gutter py-lg-space-sm">
        <router-link target="_self" :to="{ name: EnumPageNames.PageHome }">
          <img
            src="@/assets/img/asu-vertical-logo.png"
            alt="asu logo"
            class="my-auto asu-header-logo"
          />
        </router-link>
        <p
          class="d-lg-none badge badge-dark-3 rounded-0 my-auto px-space-xxs py-space-xxxs ml-space-xs"
        >
          Beta
        </p>
        <div class="ml-auto d-none d-lg-flex">
          <!-- need-help-sidebar -->
          <portal-link-desktop-need-help></portal-link-desktop-need-help>

          <!-- Base profile menu -->
          <base-profile-menu
            @dashboardClick="handleDashboardCtaClick"
            @editProfileClick="handleProfileCtaClick"
            @signOutClick="handleSignOutClick"
          ></base-profile-menu>
          <!-- END -->
        </div>

        <!-- Mobile contents -->
        <button
          v-b-toggle.mobile-nav-collapse
          class="btn p-0 rounded-0 d-lg-none ml-auto my-auto"
          aria-label="header collapse button"
          data-cy="ug-app-header-mobile-collapse-toggle-button"
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
      class="d-lg-none mobile-collapse position-absolute w-100 bg-white"
      @shown="handleMobileMenuCollapse('open')"
      @hidden="handleMobileMenuCollapse('close')"
    >
      <!-- beta-banner -->
      <base-beta-banner></base-beta-banner>

      <div class="container px-0">
        <div class="px-space-sm pt-space-sm mt-space-xxxs pb-space-md">
          <!-- block-user-info -->
          <div
            v-if="hasUndergradApplications"
            class="d-flex mb-space-md pb-space-xxxs"
            data-cy="ug-app-header-mobile-collapse-user-info"
          >
            <b-avatar
              class="mr-space-xs font-weight-bold"
              size="46px"
              variant="secondary"
            ></b-avatar>
            <div>
              <p class="text-large font-weight-bold mb-space-xxxs">
                {{ userFullName }}
              </p>
              <p class="text-xs mb-0">{{ userEmail }}</p>
            </div>
          </div>

          <!-- block-dashboard-link -->
          <div class="text-large mb-space-md">
            <router-link
              :to="{ name: EnumPageNames.PageDashboard }"
              @click="handleDashboardCtaClick"
              class="text-dark-2 text-decoration-none"
              data-cy="ug-app-header-mobile-collapse-dashboard-button"
            >
              <font-awesome-icon
                icon="fa-gauge-high"
                class="mr-space-xs text-dark-1"
              ></font-awesome-icon>
              Dashboard
            </router-link>
          </div>
          <!-- block-edit-profile-link -->
          <div class="text-large mb-space-md">
            <router-link
              :to="{ name: EnumPageNames.PageProfile }"
              @click="handleProfileCtaClick"
              class="text-dark-2 text-decoration-none"
              data-cy="ug-app-header-mobile-collapse-edit-profile-button"
            >
              <font-awesome-icon
                icon="fa-pencil"
                class="mr-space-xs text-dark-1"
              ></font-awesome-icon>
              Edit profile
            </router-link>
          </div>
          <!-- block-sign-out-link -->
          <div class="mb-space-md">
            <button
              class="text-dark-2 px-0 text-large border-0 bg-white"
              @click="handleSignOutClick"
              data-cy="ug-app-header-mobile-collapse-sign-out-button"
            >
              <font-awesome-icon
                icon="fa-right-from-bracket"
                class="mr-space-xs text-dark-1"
              ></font-awesome-icon>
              <span> Sign out</span>
            </button>
          </div>
          <hr class="mb-space-sm pb-space-xxxs" />
          <portal-link-mobile-need-help></portal-link-mobile-need-help>
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
import BaseBetaBanner from "@/components/base-components/BaseBetaBanner.vue";
import PortalLinkDesktopNeedHelp from "@/components/portal-components/PortalLinkDesktopNeedHelp.vue";
import PortalLinkMobileNeedHelp from "@/components/portal-components/PortalLinkMobileNeedHelp.vue";

export default {
  name: "UgAppHeader",
  components: {
    "base-profile-menu": BaseProfileMenu,
    "base-beta-banner": BaseBetaBanner,
    "b-collapse": BCollapse,
    "b-avatar": BAvatar,
    "portal-link-desktop-need-help": PortalLinkDesktopNeedHelp,
    "portal-link-mobile-need-help": PortalLinkMobileNeedHelp,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
    };
  },
  computed: {
    ...mapState(useAppStore, {
      hasUndergradApplications: "hasUndergradApplications",
    }),
    ...mapState(useUserStore, {
      userEmail: "email",
      userFullName: "formattedFullName",
    }),
    ...mapState(useUgApplicationStore, {
      applicationIsCurrentPageHasUnsavedChanges:
        "isCurrentPageHasUnsavedChanges",
    }),
  },
  methods: {
    ...mapActions(useAuthStore, { logout: "logout" }),
    ...mapActions(useUgApplicationStore, {
      updateRedirectRouteName: "updateRedirectRouteName",
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
    handleDashboardCtaClick() {
      this.updateRedirectRouteName(EnumPageNames.PageDashboard);
    },
    handleProfileCtaClick() {
      this.updateRedirectRouteName(EnumPageNames.PageProfile);
    },
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
}
</style>

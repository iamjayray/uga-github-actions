<template>
  <div data-cy="mobile-need-help">
    <a
      v-b-toggle.portal-mobile-need-help
      href="javascript:void(0)"
      class="text-large text-dark-2 text-decoration-none mr-space-xs"
      data-cy="mobile-need-help-button"
    >
      <font-awesome-icon
        icon="fa-sharp fa-regular fa-circle-question"
        class="mr-space-xs"
      ></font-awesome-icon>
      <span>Need help?</span>
    </a>

    <b-sidebar
      id="portal-mobile-need-help"
      aria-label="need help? contact us"
      shadow
      backdrop
      right
      bg-variant="white"
      no-header
      :no-header-close="true"
      header-class="p-0"
      @shown="handleNeedHelpSidebar('open')"
      @hidden="handleNeedHelpSidebar('close')"
      data-cy="mobile-need-help-sidebar"
    >
      <!-- content to place in body of the sidebar -->
      <template v-slot:default="{ hide }">
        <!-- header -->
        <div class="px-space-sm pt-space-md">
          <a
            href="javascript:void(0)"
            @click="handleExit(hide)"
            class="font-weight-bold mb-0 text-dark-3"
            data-cy="mobile-need-help-sidebar-back-button"
          >
            <font-awesome-icon
              icon="fa-arrow-left"
              class="mr-space-xs"
            ></font-awesome-icon>
            <span>Back</span>
          </a>
        </div>
        <!-- body -->
        <portal-form-need-help
          class="no-gutters px-space-md py-space-md px-lg-space-lg py-lg-space-lg"
        ></portal-form-need-help>
      </template>
    </b-sidebar>
  </div>
</template>
<script>
import { BSidebar, VBToggle } from "bootstrap-vue";
import PortalFormNeedHelp from "@/components/portal-components/PortalFormNeedHelp.vue";

export default {
  name: "PortalLinkMobileNeedHelp",
  directives: {
    "b-toggle": VBToggle,
  },
  components: {
    "b-sidebar": BSidebar,
    "portal-form-need-help": PortalFormNeedHelp,
  },
  methods: {
    handleExit(hideScope) {
      if (hideScope) {
        // closes the sidebar
        hideScope();
      }
    },
    handleNeedHelpSidebar(action) {
      // fire data layer event
      this.$track({
        event: "collapse",
        action: action,
        name: "onclick",
        type: "click",
        region: "navbar",
        section: "main navbar",
        text: "need help?",
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>

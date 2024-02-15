<template>
  <div class="help-menu-buttons position-fixed">
    <!-- Help button -->
    <button
      class="help-button border-0 rounded-circle rounded-circle d-flex bg-dark-3 text-white justify-content-center align-items-center"
      v-b-tooltip.hover.left="{
        customClass: 'mr-space-xs',
        variant: 'dark-1',
      }"
      title="Help"
      v-b-toggle.ug-app-floating-need-help
      data-cy="ug-app-floating-need-help-button"
    >
      <font-awesome-icon
        icon="fa-sharp fa-solid fa-question"
        class="fa-2xl"
      ></font-awesome-icon>
    </button>
    <!-- END -->

    <b-sidebar
      id="ug-app-floating-need-help"
      aria-label="need help? contact us"
      shadow
      right
      backdrop
      backdrop-variant="light-2"
      bg-variant="white"
      no-header
      :no-header-close="true"
      header-class="p-0"
      @shown="handleNeedHelpSidebar('open')"
      @hidden="handleNeedHelpSidebar('close')"
      data-cy="ug-app-floating-need-help-sidebar"
    >
      <!-- content to place in body of the sidebar -->
      <template v-slot:default="{ hide }">
        <!-- header -->
        <div class="px-space-sm pt-space-md">
          <a
            href="javascript:void(0)"
            @click="handleExit(hide)"
            class="font-weight-bold mb-0 text-dark-3"
            data-cy="ug-app-floating-need-help-sidebar-back-button"
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
import { BSidebar, VBToggle, VBTooltip } from "bootstrap-vue";
import PortalFormNeedHelp from "@/components/portal-components/PortalFormNeedHelp.vue";
export default {
  name: "UgAppFloatingNeedHelpButton",
  directives: {
    "b-tooltip": VBTooltip,
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
        region: "main content",
        section: "main navbar",
        text: "need help?",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.help-menu-buttons {
  bottom: 130px;
  @media (min-width: 992px) {
    bottom: 120px;
    right: 36px;
  }
  right: 16px;
  z-index: 1024;
  .help-button {
    width: 64px;
    height: 64px;
    box-shadow: 0px 3px 6px #00000019;
  }
}
</style>

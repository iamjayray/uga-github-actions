<template>
  <section class="bg-light-2" data-cy="beta-banner">
    <div class="container">
      <div class="row">
        <div class="col-12 px-space-sm px-lg-gutter py-space-xs">
          <p class="text-xs mb-0 desclaimer-text">
            <span
              class="badge badge-dark-3 rounded-0 px-space-xxs py-space-xxxs d-none d-lg-inline"
              >Beta</span
            ><strong
              >&nbsp;You have early access to our redesigned application for ASU
              Online students.</strong
            >&nbsp;
            <a
              href="javascript:void(0)"
              @click="handleFeedbackFormModalOpen"
              class="text-primary text-xs text-underline"
            >
              Provide feedback</a
            >
            to help improve the future of our admissions process.
          </p>
        </div>
      </div>
    </div>

    <!-- feedback-modal -->
    <b-modal
      ref="bbb-feedback-modal"
      centered
      hide-header
      hide-footer
      body-class="p-0"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
    >
      <div class="p-space-lg">
        <!-- row: cancel button -->
        <div class="row" data-cy="close-feedback-button">
          <div class="col-12">
            <a
              href="javascript:void(0)"
              @click="handleFeedbackFormModalClose"
              role="button"
              aria-label="close feedback"
              class="d-flex flex-row justify-content-end align-items-center"
            >
              <font-awesome-icon
                icon="xmark"
                class="text-dark-1"
                size="2x"
              ></font-awesome-icon>
            </a>
          </div>
        </div>

        <!-- row: title -->
        <div class="row">
          <div class="col-12">
            <portal-form-feedback
              @cancel="handleFeedbackFormModalClose"
              @form-submit="handleFeedbackFormModalClose"
            ></portal-form-feedback>
          </div>
        </div>
      </div>
    </b-modal>
  </section>
</template>

<script>
import { BModal } from "bootstrap-vue";
import PortalFormFeedback from "@/components/portal-components/PortalFormFeedback.vue";

export default {
  name: "BaseBetaBanner",
  components: {
    "b-modal": BModal,
    "portal-form-feedback": PortalFormFeedback,
  },
  methods: {
    handleFeedbackFormModalOpen() {
      // fire data layer event
      this.$track({
        event: "modal",
        action: "open",
        name: "onclick",
        type: "click",
        region: "header",
        section: "beta banner",
        text: "provide feedback",
        component: "feedback-modal",
      });

      // show modal
      this.$refs["bbb-feedback-modal"].show();
    },
    handleFeedbackFormModalClose() {
      // fire data layer event
      this.$track({
        event: "modal",
        action: "close",
        name: "onclick",
        type: "click",
        region: "header",
        section: "beta banner",
        text: "provide feedback",
        component: "feedback-modal",
      });

      // close modal
      this.$refs["bbb-feedback-modal"].hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.feedback-close {
  size: 1.5em;
}
</style>

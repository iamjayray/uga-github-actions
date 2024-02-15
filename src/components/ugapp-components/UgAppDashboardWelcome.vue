<template>
  <div
    class="border border-light-4"
    :class="{ 'application-submitted': isApplicationSubmitted }"
    data-cy="ug-app-dashboard-welcome"
  >
    <div
      class="section-welcome py-space-sm pl-space-sm mr-lg-space-xs pt-lg-space-md pl-lg-space-md pb-lg-space-xs position-relative overflow-hidden"
      :style="
        'background-image:url(' + require('@/assets/img/mountain.png') + ');'
      "
    >
      <div class="row">
        <div class="col-10 col-lg-6">
          <!-- Pre application submission text -->
          <template v-if="!isApplicationSubmitted">
            <h2 class="h2-medium">
              <span class="bg-secondary">{{ userName }},</span> you’re a few
              steps away from becoming a Sun Devil
            </h2>
          </template>
          <!-- Post application submission text -->
          <template v-else>
            <h2 class="h2-medium mb-space-xs pb-space-xxxs">
              <span class="bg-secondary">Congratulations</span> on applying to
              ASU
            </h2>
            <p class="mb-0 mb-lg-space-md">
              Review your next steps below and expect an enrollment coach to
              reach out for further support.
            </p>
          </template>
        </div>
      </div>
      <!-- lottie player -->
      <template v-if="isApplicationSubmitted">
        <dotlottie-player
          :src="lottieSource"
          mode="normal"
          loop
          autoplay
          crossorigin="anonymous"
          class="lottie-container position-absolute"
        ></dotlottie-player>
      </template>
    </div>
    <!-- Feedback alert -->
    <template v-if="isApplicationSubmitted">
      <div>
        <b-alert
          :show="isFeedBackAlertVisible"
          class="feedback-alert d-lg-flex p-space-sm pl-lg-space-md py-lg-space-xs border-0 mb-0 rounded-0 position-relative"
          data-cy="feedback-alert"
        >
          <p class="my-auto mr-space-md">
            Let us know about your application experience.
          </p>
          <button
            data-cy="ug-app-dashboard-welcome-feedback-button"
            class="btn btn-dark-3 px-space-sm py-space-xxs text-xs mt-space-xs mt-lg-0"
            @click="handleFeedbackFormModalOpen"
          >
            Provide your feedback
          </button>
          <a
            href="javascript:void(0)"
            @click="handleAlertClose"
            class="feedback-alert-close-button text-decoration-none ml-auto my-auto"
            aria-label="close alert"
          >
            <font-awesome-icon
              icon="fa-times"
              size="xl"
              class="text-dark-1"
              aria-label="close icon"
            ></font-awesome-icon>
          </a>
        </b-alert>

        <!-- user-feedback-modal -->
        <b-modal
          ref="user-feedback-modal"
          centered
          hide-header
          hide-footer
          body-class="p-0"
          :no-close-on-backdrop="true"
          :no-close-on-esc="true"
        >
          <div
            class="p-space-lg"
            data-cy="ug-app-dashboard-welcome-feedback-modal"
          >
            <!-- row: cancel button -->
            <div class="row mb-space-xs">
              <div class="col-12">
                <a
                  href="javascript:void(0)"
                  @click="handleFeedbackFormModalClose"
                  class="d-flex flex-row justify-content-end align-items-center"
                  aria-label="close modal"
                >
                  <font-awesome-icon
                    icon="xmark"
                    class="text-dark-1"
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
      </div>
    </template>
  </div>
</template>

<script>
import { BAlert, BModal } from "bootstrap-vue";
import PortalFormFeedback from "@/components/portal-components/PortalFormFeedback.vue";
import "@dotlottie/player-component";
import animationData from "@/assets/animations/congratulations.json";
export default {
  name: "UgAppDashboardWelcome",
  components: {
    "b-alert": BAlert,
    "b-modal": BModal,
    "portal-form-feedback": PortalFormFeedback,
  },
  props: {
    isApplicationSubmitted: {
      type: Boolean,
      required: true,
    },
    userName: {
      type: String,
      default: "",
    },
    isFeedBackAlertVisible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    handleAlertClose() {
      this.$emit("feedbackAlertClosed");
    },
    handleFeedbackFormModalOpen() {
      this.$refs["user-feedback-modal"].show();
      // TODO: - data layer tracking
    },
    handleFeedbackFormModalClose() {
      this.$refs["user-feedback-modal"].hide();
      // TODO: - data layer tracking
    },
  },
  computed: {
    lottieSource() {
      return JSON.stringify(animationData);
    },
  },
};
</script>
<style lang="scss" scoped>
.section-welcome {
  background-repeat: no-repeat;
  background-position: right bottom;
  background-size: contain;
  @media (max-width: 768px) {
    background-size: auto 58px;
  }
}
.application-submitted {
  .section-welcome {
    background-size: auto 193px;
    @media (max-width: 991px) {
      background-image: none !important;
    }
  }
}
.feedback-alert {
  background-color: var(--secondary-100);
}
.lottie-container {
  top: 0px;
  width: 100%;
  @media (min-width: 991px) {
    width: 50%;
    right: 0px;
  }
}
</style>

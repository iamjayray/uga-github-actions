<template>
  <div class="container">
    <div class="row">
      <div class="mx-space-sm">
        <!-- Progress bar -->
        <b-progress
          id="progress-bar"
          class="mt-space-sm border rounded-pill"
          variant="primary"
          :value="value"
          animated
        ></b-progress>

        <!-- Status text -->
        <span
          class="d-flex justify-content-center mt-space-sm text-primary text-center text-small font-weight-bold"
          id="status-text"
        >
          {{ statusText }}
        </span>

        <!-- Animation data -->
        <div class="mt-space-md">
          <dotlottie-player
            :src="lottieSource"
            loop
            autoplay
            mode="normal"
          ></dotlottie-player>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EnumPageNames } from "@/content/enum-app.js";
import animationData from "@/assets/animations/asu-checking-your-info.json";
import "@dotlottie/player-component";
import { BProgress } from "bootstrap-vue";
import { useAppStore } from "@/stores/app-store.js";
import { mapState } from "pinia";

export default {
  name: "BaseSubmittedLoading",
  components: {
    "b-progress": BProgress,
  },
  data() {
    return {
      animationData: animationData,
    };
  },
  props: {
    value: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapState(useAppStore, {
      isPaymentTypePayNow: "isPaymentTypePayNow",
    }),
    lottieSource() {
      return JSON.stringify(this.animationData);
    },
    statusText() {
      if (
        this.isPaymentTypePayNow ||
        this.$route.name === EnumPageNames.PagePaymentNelnetCallback
      ) {
        return this.$route.name === EnumPageNames.PagePaymentNelnetCallback
          ? "Almost there! We're completing the submission of your application."
          : "We're reviewing your application. This shouldn't take long.";
      } else {
        return this.value <= 66
          ? "Please wait as we process your application..."
          : "Almost there! We're finishing up...";
      }
    },
  },
};
</script>

<style scoped>
@media (max-width: 767px) {
  #status-text {
    padding: 12px;
  }
}
</style>

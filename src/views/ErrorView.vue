<template>
  <main id="main-content" data-cy="error-view">
    <section class="py-space-xxl">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="mb-space-lg">
              <h1 class="h1-small bg-secondary p-space-xxs d-inline">
                Apply to ASU Online
              </h1>
            </div>
            <h2 v-if="isDuplicateApplication" class="h2-small mb-space-md">
              An application already exists for this user.
            </h2>
            <h2 v-else class="h2-small mb-space-md">
              Something went wrong and the server could not complete your
              request.
            </h2>
            <p class="mb-space-lg text-dark-1">Error code: 500</p>
            <p>
              Please try again later or return to the dashboard to continue your
              application.
            </p>
            <p class="mb-space-md">
              If the problem persists, please contact technical support below.
            </p>

            <router-link
              :to="{ name: EnumPageNames.PageDashboard }"
              class="btn btn-primary"
            >
              Return to dashboard
            </router-link>
          </div>
        </div>
      </div>
    </section>
    <portal-section-support></portal-section-support>
  </main>
</template>

<script>
import { EnumPageNames } from "@/content/enum-app.js";
import { useAppStore } from "@/stores/app-store.js";
import { mapActions } from "pinia";
import PortalSectionSupport from "@/components/portal-components/PortalSectionSupport.vue";

export default {
  name: "ErrorView",
  metaInfo() {
    return {
      title: `500 | Something went wrong`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "portal-section-support": PortalSectionSupport,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
    };
  },
  computed: {
    isDuplicateApplication() {
      return this.$route.query?.code === "ERRAPP";
    },
  },
  methods: {
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

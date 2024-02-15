<template>
  <main id="main-content" data-cy="not-found-view">
    <section class="py-space-xxl">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="mb-space-lg">
              <h1 class="h1-small bg-secondary p-space-xxs d-inline">
                Apply to ASU Online
              </h1>
            </div>
            <h2 class="h2-small mb-space-md">
              The page you're looking for doesn't exist.
            </h2>
            <p class="mb-space-lg text-dark-1">Error code: 404</p>
            <p class="mb-space-md">
              Don't worry, you can return to the dashboard and continue your
              application.
            </p>

            <router-link
              :to="{
                name: isLoggedIn
                  ? EnumPageNames.PageDashboard
                  : EnumPageNames.PageHome,
              }"
              class="btn btn-primary"
            >
              <span class="text-white">
                {{ isLoggedIn ? "Return to dashboard" : "Return to home page" }}
              </span>
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
import PortalSectionSupport from "@/components/portal-components/PortalSectionSupport.vue";
import { useAuthStore } from "@/stores/auth-store.js";
import { mapState } from "pinia";

export default {
  name: "NotFoundView",
  metaInfo() {
    return {
      title: `404 | Page Not Found`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "portal-section-support": PortalSectionSupport,
  },
  computed: {
    ...mapState(useAuthStore, { isLoggedIn: "isLoggedIn" }),
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
    };
  },
};
</script>

<style lang="scss" scoped></style>

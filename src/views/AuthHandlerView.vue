<template>
  <main id="main-content" data-cy="auth-handler-view">
    <div class="position-relative">
      <b-overlay
        class="mt-space-xxxl"
        :show="true"
        rounder="lg"
        opacity="0.8"
        bg-color="dark"
      >
        <template #overlay>
          <base-loading />
        </template>
      </b-overlay>
    </div>
  </main>
</template>

<script>
import { useAuthStore } from "@/stores/auth-store.js";
import { mapActions } from "pinia";
import BaseLoading from "@/components/base-components/BaseLoading.vue";
import { BOverlay } from "bootstrap-vue";
import { EnumPageNames } from "@/content/enum-app.js";

export default {
  name: "AuthHandlerView",
  metaInfo() {
    return {
      title: `Authenticating...`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "b-overlay": BOverlay,
    "base-loading": BaseLoading,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
    };
  },
  methods: {
    ...mapActions(useAuthStore, {
      finalizeOAuthLogin: "finalizeOAuthLogin",
    }),
  },
  async created() {
    // code query param from the URL
    const urlParams = new URLSearchParams(window.location.search);

    // call finalizeOAuthLogin action in auth module
    const response = await this.finalizeOAuthLogin(urlParams.get("code"));

    if (response.code === 200) {
      this.$router.push({ name: EnumPageNames.PageDashboard });
    } else {
      this.$router.push({ name: EnumPageNames.PageError });
    }
  },
};
</script>

<style lang="scss" scoped></style>

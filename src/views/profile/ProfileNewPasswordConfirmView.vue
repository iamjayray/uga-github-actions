<template>
  <main id="main-content" data-cy="profile-new-password-confirm-password">
    <section class="py-space-lg">
      <div class="container">
        <div class="row">
          <div class="col-12 offset-lg-3 col-lg-6 text-center">
            <h1 class="h1-small mb-space-xs">Your password has been reset!</h1>
            <a
              href="javascript:void(0)"
              class="text-underline"
              @click="handleProfileClick"
            >
              Return to profile
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { EnumPageNames } from "@/content/enum-app";
import { useAppStore } from "@/stores/app-store.js";
import { mapActions } from "pinia";

export default {
  name: "ProfileNewPasswordConfirmView",
  data() {
    return {
      enumPageNames: EnumPageNames,
    };
  },
  metaInfo() {
    return {
      title: "Profile | Password reset confirmation",
      titleTemplate: "%s - Arizona State University",
    };
  },
  methods: {
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
    }),
    handleProfileClick() {
      // direct user to profile page
      this.$router.push({ name: this.enumPageNames.PageProfile });
    },
  },
  created() {
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
};
</script>

<style lang="scss" scoped></style>

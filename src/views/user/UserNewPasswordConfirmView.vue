<template>
  <main id="main-content" data-cy="user-new-password-confirm-view">
    <section class="py-space-lg">
      <div class="container">
        <div class="row">
          <div class="col-12 offset-lg-3 col-lg-6 text-center">
            <h1 class="h1-small mb-space-xs">Your password has been reset!</h1>
            <a
              href="javascript:void(0)"
              class="text-underline"
              @click="handleLoginClick"
            >
              Return to login screen
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { EnumPageNames } from "@/content/enum-app.js";
export default {
  name: "UserNewPasswordConfirmView",
  metaInfo() {
    return {
      title: `User | Confirm Password`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  data() {
    return {
      enumPageNames: EnumPageNames,
    };
  },
  methods: {
    handleLoginClick() {
      // direct user to login page
      this.$router.push({ name: this.enumPageNames.PageUserLogin });
    },
  },
};
</script>

<style lang="scss" scoped></style>

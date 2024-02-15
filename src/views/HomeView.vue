<template>
  <main id="main-content" data-cy="home-view">
    <section class="pt-space-lg pb-space-xxl">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="mb-space-lg">
              <h1
                class="h1-small bg-secondary d-inline px-space-xs py-space-xxs"
              >
                Apply to ASU Online
              </h1>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-lg-5 mb-space-lg h-100">
            <div
              class="px-space-xl py-space-lg border border-light-4 text-center"
              data-cy="home-already-have-an-account"
            >
              <div class="mb-space-sm">
                <img
                  src="@/assets/img/app-login-icon.svg"
                  alt="login"
                  class="img-fluid"
                />
              </div>
              <h2 class="h2-small mb-space-sm">Already have an account?</h2>
              <p class="text-small text-dark-1 mb-space-lg">
                If you already have an account or an ASURITE ID (ASU email
                address), log in here.
              </p>

              <a
                href="javascript:void(0)"
                @click.prevent="handleLoginClick"
                aria-label="log in"
                class="btn btn-secondary text-small py-space-xs px-space-sm"
                >Log in</a
              >
            </div>
          </div>
          <div class="col-12 offset-lg-1 col-lg-5 h-100">
            <div
              class="px-space-xl py-space-lg border border-light-4 text-center"
              data-cy="home-start-an-application"
            >
              <div class="mb-space-sm">
                <img
                  src="@/assets/img/app-start-icon.svg"
                  alt="login"
                  class="img-fluid"
                />
              </div>
              <h2 class="h2-small mb-space-sm">Start an application</h2>
              <p class="text-small text-dark-1 mb-space-lg">
                Ready to apply to ASU Online? Create an account to get started.
              </p>

              <a
                href="javascript:void(0)"
                @click.prevent="handleCreateAccountClick"
                aria-label="create account"
                class="btn btn-dark-3 text-small py-space-xs px-space-sm"
                >Create account</a
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { EnumPageNames } from "@/content/enum-app.js";
export default {
  name: "HomeView",
  metaInfo() {
    return {
      title: `Admissions`,
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
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: "already have an account?",
        text: "log in",
        component: "apply to asu online",
      });

      // route user to login page
      this.$router.push({ name: this.enumPageNames.PageUserLogin });
    },
    handleCreateAccountClick() {
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: "start an application",
        text: "create account",
        component: "apply to asu online",
      });

      // route user to login page
      this.$router.push({ name: this.enumPageNames.PageUserCreateAccount });
    },
  },
};
</script>

<style lang="scss" scoped></style>

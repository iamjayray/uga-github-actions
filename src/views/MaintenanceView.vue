<template>
  <div id="page-container">
    <!-- header -->
    <header class="bg-white border-bottom sticky-top">
      <section data-cy="maintenance-header">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <!-- nav -->
              <nav
                class="navbar px-0 py-space-xxs py-lg-space-sm navbar-light navbar-expand-lg"
              >
                <a
                  href="#"
                  target="_self"
                  class="pl-space-xxs pl-md-0 d-lg-block"
                >
                  <img
                    src="@/assets/img/asu-vertical-logo.png"
                    alt="Arizona State University"
                    class="ah-brand-logo"
                  />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </header>

    <!-- main -->
    <main id="main-content">
      <section
        class="pt-space-xl pb-space-xxl"
        data-cy="maintenance-main-content"
      >
        <div class="container">
          <div class="row">
            <div class="col-12 offset-lg-2 col-lg-8 text-center">
              <div class="mb-space-lg">
                <h1 class="h1-small bg-secondary p-space-xxs d-inline">
                  Apply to ASU Online
                </h1>
              </div>
              <h2 class="h2-small mb-space-md">
                We're temporarily down for maintenance.
              </h2>

              <p class="mb-space-lg">
                We apologize for the inconvenience. We’re expecting to be back
                online at 8 a.m., so please try again later.
              </p>

              <div>
                <img
                  src="@/assets/img/app-maintenance.svg"
                  alt="maintenance"
                  class="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- footer -->
    <base-footer id="page-footer"></base-footer>
  </div>
</template>

<script>
import BaseFooter from "@/components/base-components/BaseFooter.vue";
export default {
  name: "MaintenanceView",
  metaInfo() {
    return {
      title: `Maintenance | Admissions`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "base-footer": BaseFooter,
  },
};
</script>

<style lang="scss" scoped>
#page-container {
  position: relative;
  min-height: 100vh;
}

#main-content {
  padding-bottom: 156px; /* Footer height */
}

#page-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 156px; /* Footer height */
}
.ah-brand-logo {
  max-height: 36px;
}
</style>

<template>
  <header class="bg-white">
    <section data-cy="default-base-header">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <!-- nav -->
            <nav
              class="navbar px-0 py-space-xs py-lg-space-sm navbar-light navbar-expand-lg justify-content-start align-items-center"
            >
              <router-link
                :to="{ name: EnumPageNames.PageHome }"
                target="_self"
                class="pl-space-xxs pl-md-0 d-lg-block"
              >
                <img
                  src="@/assets/img/asu-vertical-logo.png"
                  alt="Arizona State University"
                  class="ah-brand-logo"
                />
              </router-link>
              <p
                class="d-block d-lg-none badge badge-dark-3 rounded-0 px-space-xxs py-space-xxxs ml-space-xs mt-space-xs"
              >
                Beta
              </p>
            </nav>
          </div>
        </div>
      </div>
    </section>

    <!-- base-beta-banner -->
    <base-beta-banner></base-beta-banner>
  </header>
</template>

<script>
import BaseBetaBanner from "@/components/base-components/BaseBetaBanner.vue";
import { EnumPageNames } from "@/content/enum-app.js";

export default {
  name: "BaseHeader",
  components: {
    "base-beta-banner": BaseBetaBanner,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
    };
  },
};
</script>

<style lang="scss" scoped>
.ah-brand-logo {
  max-height: 24px;
}

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) {
}

// Medium devices (tablets, 768px and up)
@media (min-width: 768px) {
}

// Large devices (desktops, 992px and up)
@media (min-width: 992px) {
  .ah-brand-logo {
    max-height: 36px;
  }
}

// Extra large devices (large desktops, 1200px and up)
@media (min-width: 1200px) {
}
</style>

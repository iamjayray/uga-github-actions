<template>
  <div>
    <!-- skip to main content -->
    <div class="skip-link" data-cy="default-layout-skip-to-main-content">
      <a href="#main-content">Skip to main content</a>
    </div>

    <!-- header -->
    <base-header></base-header>

    <!-- main -->

    <transition name="default-layout" appear>
      <!-- router view -->
      <router-view :key="$route.fullPath"></router-view>
    </transition>

    <!-- footer -->
    <base-footer></base-footer>
  </div>
</template>

<script>
import BaseFooter from "@/components/base-components/BaseFooter.vue";
import BaseHeader from "@/components/base-components/BaseHeader.vue";

export default {
  name: "App",
  components: {
    "base-header": BaseHeader,
    "base-footer": BaseFooter,
  },
};
</script>

<style lang="scss" scoped>
.default-layout-enter-active {
  transition: opacity 0.4s ease-in;
}
.default-layout-enter {
  opacity: 0;
}
</style>

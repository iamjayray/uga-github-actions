<template>
  <div id="app">
    <template v-if="layout">
      <component :is="layout">
        <router-view :key="$route.fullPath"></router-view>
      </component>
    </template>
    <template v-else>
      <router-view :key="$route.fullPath"></router-view>
    </template>
  </div>
</template>

<script>
export default {
  name: "App",
  metaInfo() {
    return {
      link: [
        {
          rel: "canonical",
          href: `${import.meta.env.VITE_HOSTNAME}${this.$route.path.replace(
            /\/$/,
            ""
          )}/`,
        },
      ],
    };
  },
  computed: {
    layout() {
      return this.$route?.meta?.layout || null;
    },
  },
};
</script>

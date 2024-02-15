import AppAnalytics from "@/plugins/app-analytics";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ModalPlugin, VBTooltip } from "bootstrap-vue";
import { PiniaVuePlugin, createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import { useAppStore } from "@/stores/app-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useUserStore } from "@/stores/user-store.js";
import Vue from "vue";
import VueMeta from "vue-meta";

// themes & styles
import "@/assets/styles/app-theme.scss";

// project-based plugins
import Axios from "@/plugins/axios";
import "@/plugins/fontawesome";

// fontawesome global component
Vue.component("font-awesome-icon", FontAwesomeIcon);

// app
import App from "./App.vue";
import router from "./router";

// pinia
Vue.use(PiniaVuePlugin);
// create store instance
const pinia = createPinia();
pinia.use(createPersistedState({ storage: window.sessionStorage }));

// global plugins and directives
Vue.use(AppAnalytics);
Vue.use(Axios, pinia);

// vue-meta
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
});
Vue.directive("b-tooltip", VBTooltip);
// The this.$bvModal injection is only available when using the full BootstrapVue plugin or the ModalPlugin plugin. It is not available if importing just the b-modal
Vue.use(ModalPlugin);
// vue instance
new Vue({
  router,
  pinia: pinia,
  render: (h) => h(App),
}).$mount("#app");
// store instances for cypress assertions
if (window.Cypress) {
  window.appStore = useAppStore();
  window.authStore = useAuthStore();
  window.configStore = useConfigStore();
  window.ugApplicationStore = useUgApplicationStore();
  window.userStore = useUserStore();
}

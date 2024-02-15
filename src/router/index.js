import { EnumPageNames } from "@/content/enum-app.js";
import { EnumNameTypes } from "@/content/enum-ug-application.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import jwt_decode from "jwt-decode";
import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "./app-router";

Vue.use(VueRouter);

// configure vue-router
const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: routes,
});

const populateUserType = (authStore, userStore) => {
  const decodedToken = jwt_decode(authStore.token);
  if (
    decodedToken.scope.includes(EnumNameTypes.ReadAdminScope) ||
    decodedToken.scope.includes(EnumNameTypes.WriteAdminScope)
  ) {
    userStore.populateUserType(EnumNameTypes.UserTypeAdmin);
  }
};

const handleAuthRoute = async (
  to,
  from,
  next,
  authStore,
  appStore,
  userStore,
  ugAppStore
) => {
  const onSubmitApplicationAllowedProfilePages = [
    EnumPageNames.PageDashboard,
    EnumPageNames.PageProfile,
    EnumPageNames.PageProfileResetPassword,
    EnumPageNames.PageProfileNewPassword,
    EnumPageNames.PageProfileNewPasswordConfirm,
  ];
  if (authStore.isLoggedIn) {
    if (!appStore.hasUndergradApplications) {
      await appStore.populateUndergradApplications(authStore.token);
    }
    // populating the usertype if user is already logged in.
    populateUserType(authStore, userStore);

    const appId = appStore.selectedUndergradApplicationId;
    // if usertype is admin
    if (userStore.userType === EnumNameTypes.UserTypeAdmin) {
      if (appStore.isUndergradApplicationSubmitted) {
        to.meta.visibleForAdmin && to.meta.requiresAppSubmission
          ? next()
          : next({
              name: EnumPageNames.PageUndergradPreview,
              params: { id: appId },
            });
      } else {
        to.meta.visibleForAdmin && !to.meta.requiresAppSubmission
          ? next()
          : next({
              name: ugAppStore.currentScreen,
              params: { id: appId },
            });
      }
    } else {
      // if userType is self
      if (to.meta.requiresAppSubmission) {
        appStore.isUndergradApplicationSubmitted
          ? next()
          : next({ name: EnumPageNames.PageDashboard });
      } else {
        !appStore.isUndergradApplicationSubmitted ||
        onSubmitApplicationAllowedProfilePages.includes(to.name)
          ? next()
          : next({ name: EnumPageNames.PageDashboard });
      }
    }
  } else {
    next({
      name: EnumPageNames.PageUserLogin,
    });
  }
};

const handleNonAuthRoute = async (to, from, next, authStore) => {
  const onAuthPages = [
    EnumPageNames.PageHome,
    EnumPageNames.PageOAuth2CallBack,
    EnumPageNames.PageUserCreateAccount,
    EnumPageNames.PageUserVerifyEmail,
    EnumPageNames.PageUserLogin,
    EnumPageNames.PageUserResetPassword,
    EnumPageNames.PageUserNewPassword,
    EnumPageNames.PageUserNewPasswordConfirm,
  ];
  authStore.isLoggedIn && onAuthPages.includes(to.name)
    ? next({ name: EnumPageNames.PageDashboard })
    : next();
};

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const ugAppStore = useUgApplicationStore();
  // scroll to top and reset the loader
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (to.meta.requiresAuth) {
    await handleAuthRoute(
      to,
      from,
      next,
      authStore,
      appStore,
      userStore,
      ugAppStore
    );
  } else {
    await handleNonAuthRoute(to, from, next, authStore);
  }
});

export default router;

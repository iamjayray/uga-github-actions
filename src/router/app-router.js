import DefaultLayout from "@/layouts/Default.vue";
import LayoutPortal from "@/layouts/LayoutPortal.vue";
import LayoutUndergradPostApp from "@/layouts/LayoutUndergradPostApp.vue";
import LayoutUndergradApp from "@/layouts/LayoutUndergradApp.vue";
import AuthHandlerView from "@/views/AuthHandlerView.vue";
import DashboardView from "@/views/DashboardView.vue";
import PostSubmissionDashboardView from "@/views/ug-app/UgAppDashboardView.vue";
import ErrorView from "@/views/ErrorView.vue";
import HomeView from "@/views/HomeView.vue";
import MaintenanceView from "@/views/MaintenanceView.vue";
import NelnetHandlerView from "@/views/NelnetHandlerView.vue";
import ImpersonationAuthHandlerView from "@/views/ImpersonationAuthHandlerView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

import {
  EnumPageNames,
  EnumUndergradAppScreenLabels,
} from "@/content/enum-app";

export const routes = [
  {
    path: "/",
    name: EnumPageNames.PageHome,
    component: HomeView,
    meta: {
      layout: DefaultLayout,
      requiresAuth: false,
    },
  },
  {
    path: "/dashboard",
    name: EnumPageNames.PageDashboard,
    component: DashboardView,
    meta: {
      layout: LayoutPortal,
      requiresAuth: true,
    },
  },
  {
    path: "/oauth2/callback",
    name: EnumPageNames.PageOAuth2CallBack,
    component: AuthHandlerView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/impersonate/callback",
    name: EnumPageNames.PageImpersonationCallBack,
    component: ImpersonationAuthHandlerView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/payment/nelnet/callback",
    name: EnumPageNames.PagePaymentNelnetCallback,
    component: NelnetHandlerView,
    meta: {
      requiresAuth: true,
      visibleForAdmin: true,
    },
  },
  {
    path: "/user",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "create",
        name: EnumPageNames.PageUserCreateAccount,
        component: () => import("@/views/user/UserCreateAccountView.vue"),
      },
      {
        path: "verify-email",
        name: EnumPageNames.PageUserVerifyEmail,
        component: () => import("@/views/user/UserVerifyEmailView.vue"),
      },
      {
        path: "login",
        name: EnumPageNames.PageUserLogin,
        component: () => import("@/views/user/UserLoginView.vue"),
      },
      {
        path: "reset-password",
        name: EnumPageNames.PageUserResetPassword,
        component: () => import("@/views/user/UserResetPasswordView.vue"),
      },
      {
        path: "new-password",
        name: EnumPageNames.PageUserNewPassword,
        component: () => import("@/views/user/UserNewPasswordView.vue"),
      },
      {
        path: "new-password-confirm",
        name: EnumPageNames.PageUserNewPasswordConfirm,
        component: () => import("@/views/user/UserNewPasswordConfirmView.vue"),
      },
    ],
  },
  {
    path: "/profile",
    component: () => import("@/layouts/LayoutPortal.vue"),
    children: [
      {
        path: "",
        name: EnumPageNames.PageProfile,
        component: () => import("@/views/profile/ProfileIndexView.vue"),
        meta: { requiresAuth: true, visibleForAdmin: true },
      },
      {
        path: "reset-password",
        name: EnumPageNames.PageProfileResetPassword,
        component: () => import("@/views/profile/ProfileResetPasswordView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "new-password",
        name: EnumPageNames.PageProfileNewPassword,
        component: () => import("@/views/profile/ProfileNewPasswordView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "new-password-confirm",
        name: EnumPageNames.PageProfileNewPasswordConfirm,
        component: () =>
          import("@/views/profile/ProfileNewPasswordConfirmView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "edit-name",
        name: EnumPageNames.PageProfileEditName,
        component: () => import("@/views/profile/ProfileEditNameView.vue"),
        meta: { requiresAuth: true, visibleForAdmin: true },
      },
      {
        path: "edit-preferred-first-name",
        name: EnumPageNames.PageProfileEditPreferredFirstName,
        component: () =>
          import("@/views/profile/ProfileEditPreferredFirstNameView.vue"),
        meta: { requiresAuth: true, visibleForAdmin: true },
      },
      {
        path: "edit-birthday",
        name: EnumPageNames.PageProfileEditBirthday,
        component: () => import("@/views/profile/ProfileEditBirthdayView.vue"),
        meta: { requiresAuth: true, visibleForAdmin: true },
      },
      {
        path: "edit-pronoun",
        name: EnumPageNames.PageProfileEditPronoun,
        component: () => import("@/views/profile/ProfileEditPronounView.vue"),
        meta: { requiresAuth: true, visibleForAdmin: true },
      },
      {
        path: "edit-gender",
        name: EnumPageNames.PageProfileEditGender,
        component: () => import("@/views/profile/ProfileEditGenderView.vue"),
        meta: { requiresAuth: true, visibleForAdmin: true },
      },
      {
        path: "edit-phone-number",
        name: EnumPageNames.PageProfileEditPhoneNumber,
        component: () =>
          import("@/views/profile/ProfileEditPhoneNumberView.vue"),
        meta: { requiresAuth: true, visibleForAdmin: true },
      },
    ],
  },
  {
    path: "/ug-app/:id",
    component: () => import("@/views/ug-app/UgAppHomeView.vue"),
    redirect: () => {
      return { path: "/dashboard" };
    },
    children: [
      {
        path: "my-information",
        name: EnumPageNames.PageUndergradMyInformation,
        component: () => import("@/views/ug-app/UgAppMyInformationView.vue"),
        qualifiedName: EnumUndergradAppScreenLabels.PageUndergradMyInformation,
        displayInNav: true,
        meta: {
          requiresAuth: true,
          visibleForAdmin: true,
          layout: LayoutUndergradApp,
        },
      },
      {
        path: "my-program",
        name: EnumPageNames.PageUndergradMyProgram,
        component: () => import("@/views/ug-app/UgAppMyProgramView.vue"),
        displayInNav: true,
        qualifiedName: EnumUndergradAppScreenLabels.PageUndergradMyProgram,
        meta: {
          requiresAuth: true,
          visibleForAdmin: true,
          layout: LayoutUndergradApp,
        },
      },
      {
        path: "my-schools",
        name: EnumPageNames.PageUndergradMySchools,
        component: () => import("@/views/ug-app/UgAppMySchoolsView.vue"),
        displayInNav: true,
        qualifiedName: EnumUndergradAppScreenLabels.PageUndergradMySchools,
        meta: {
          requiresAuth: true,
          visibleForAdmin: true,
          layout: LayoutUndergradApp,
        },
      },
      {
        path: "my-high-school-grades",
        name: EnumPageNames.PageUndergradMyHighSchoolGrades,
        component: () =>
          import("@/views/ug-app/UgAppMyHighSchoolGradesView.vue"),
        displayInNav: true,
        qualifiedName:
          EnumUndergradAppScreenLabels.PageUndergradMyHighSchoolGrades,
        meta: {
          requiresAuth: true,
          visibleForAdmin: true,
          layout: LayoutUndergradApp,
        },
      },
      {
        path: "arizona-residency",
        name: EnumPageNames.PageUndergradArizonaResidency,
        component: () => import("@/views/ug-app/UgAppArizonaResidencyView.vue"),
        displayInNav: true,
        qualifiedName:
          EnumUndergradAppScreenLabels.PageUndergradArizonaResidency,
        meta: {
          requiresAuth: true,
          visibleForAdmin: true,
          layout: LayoutUndergradApp,
        },
      },
      {
        path: "review",
        name: EnumPageNames.PageUndergradReview,
        component: () => import("@/views/ug-app/UgAppReviewView.vue"),
        displayInNav: true,
        qualifiedName: EnumUndergradAppScreenLabels.PageUndergradReview,
        meta: {
          requiresAuth: true,
          visibleForAdmin: true,
          layout: LayoutUndergradApp,
        },
      },
    ],
  },
  {
    path: "/ug-app/:id/dashboard",
    name: EnumPageNames.PageUndergradDashboard,
    component: PostSubmissionDashboardView,
    meta: {
      layout: LayoutUndergradPostApp,
      requiresAppSubmission: true,
      requiresAuth: true,
    },
  },
  {
    path: "/ug-app/:id/preview",
    name: EnumPageNames.PageUndergradPreview,
    component: () => import("@/views/ug-app/UgAppPreviewView.vue"),
    meta: {
      layout: LayoutUndergradPostApp,
      requiresAuth: true,
      visibleForAdmin: true,
      requiresAppSubmission: true,
    },
  },
  {
    path: "/maintenance",
    name: EnumPageNames.PageMaintenance,
    component: MaintenanceView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/error",
    name: EnumPageNames.PageError,
    component: ErrorView,
    meta: {
      layout: DefaultLayout,
      requiresAuth: false,
    },
  },
  {
    path: "/404",
    name: EnumPageNames.PageNotFound,
    component: NotFoundView,
    meta: {
      layout: DefaultLayout,
      requiresAuth: false,
    },
  },

  { path: "*", redirect: "/404" },
];

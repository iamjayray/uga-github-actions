<template>
  <main id="main-content" data-cy="app-dashboard-up-app-dashboard-view">
    <div class="container px-space-sm px-lg-0">
      <!-- Welcome Start -->
      <section class="py-space-sm px-lg-0" data-cy="welcome-start">
        <ug-app-dashboard-welcome
          :isApplicationSubmitted="true"
          :isFeedBackAlertVisible="isFeedBackAlertVisible"
          @feedbackAlertClosed="handleFeedbackAlertClose"
        ></ug-app-dashboard-welcome>
      </section>

      <!-- Next Steps -->
      <section data-cy="app-dashboard-next-steps">
        <div class="row pt-space-sm pt-lg-space-lg">
          <div class="col-12 col-lg-8 pr-lg-space-xxl">
            <h1 class="h1-small">{{ pageData.title }}</h1>
            <hr class="my-space-xxs" />

            <div
              class="mt-space-md pt-space-xxs pt-lg-space-xs"
              v-if="isQTRAlertVisible"
            >
              <b-alert
                :show="isQTRAlertVisible"
                variant="danger"
                class="py-space-md py-lg-space-sm px-space-sm px-lg-space-lg position-relative"
                @dismissed="handleQTRAlertClose"
                data-cy="qtr-alert"
              >
                <!-- close button -->
                <a
                  href="javascript:void(0)"
                  @click="handleQTRAlertClose"
                  class="qtr-close-button text-decoration-none position-absolute bg-white border border-light-4 rounded-circle d-flex"
                  aria-label="close alert"
                >
                  <font-awesome-icon
                    icon="fa-times"
                    class="alert-close text-dark-3 my-auto mx-auto"
                    aria-label="close icon"
                  ></font-awesome-icon>
                </a>
                <div>
                  <div class="d-flex">
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="lg"
                      class="text-danger my-auto pr-space-xxs mr-space-xxxs"
                    />
                    <p class="text-danger font-weight-bold my-auto">
                      {{ pageData.sectionQtr.title }}
                    </p>
                  </div>
                  <div
                    class="pt-space-sm"
                    v-html="pageData.sectionQtr.text"
                  ></div>
                </div>
              </b-alert>
            </div>

            <!-- Base List Timeline -->
            <div
              class="mt-space-md pt-space-xxs pt-lg-0 mt-lg-space-lg"
              data-cy="app-dashboard-base-list-timeline"
            >
              <base-list-timeline
                :items="pageData.sectionListTimeline"
                @ctaClick="handleTimelineCtaClick"
              ></base-list-timeline>
            </div>
          </div>

          <!-- Application Summary -->
          <div
            class="col-12 col-lg-4 pl-lg-0 mb-space-xl"
            data-cy="app-dashboard-application-summary"
          >
            <div class="pb-space-xs">
              <div
                class="bg-light-1 px-space-md py-space-md pb-lg-space-lg mb-space-xs"
              >
                <h3 class="h3-large mb-space-sm mb-lg-space-md">
                  {{ pageData.sectionApplicationSummary.title }}
                </h3>
                <!-- Application Id -->
                <p class="mb-space-xxs">
                  <span
                    >{{
                      pageData.sectionApplicationSummary.applicationIdLabel
                    }}:
                  </span>
                  <span class="font-weight-bold">{{
                    applicationSummary.applicationId
                  }}</span>
                </p>
                <!-- Program -->
                <p class="mb-space-xxs">
                  <span
                    >{{ pageData.sectionApplicationSummary.programLabel }}:
                  </span>
                  <span class="font-weight-bold">{{
                    applicationSummary.program
                  }}</span>
                </p>
                <!-- Location -->
                <p class="mb-space-xxs">
                  <span
                    >{{ pageData.sectionApplicationSummary.locationLabel }}:
                  </span>
                  <span class="font-weight-bold">{{
                    applicationSummary.location
                  }}</span>
                </p>
                <!-- Term -->
                <p class="mb-space-sm mb-lg-space-md">
                  <span
                    >{{ pageData.sectionApplicationSummary.termLabel }}:
                  </span>
                  <span class="font-weight-bold">{{
                    applicationSummary.term
                  }}</span>
                </p>
                <!-- View Submitted Application -->
                <a
                  data-cy="app-dashboard-view-submitted-application-btn"
                  class="text-underline"
                  @click="
                    handleViewSubmittedApplicationClick(
                      pageData.sectionApplicationSummary.title,
                      pageData.sectionApplicationSummary.cta.label
                    )
                  "
                  href="javascript:void(0)"
                  >{{ pageData.sectionApplicationSummary.cta.label }}
                </a>
              </div>
            </div>
            <!--  Need More Help -->
            <div class="position-relative">
              <div
                class="mt-space-lg mt-lg-space-xl"
                data-cy="app-dashboard-need-more-help"
              >
                <img
                  src="@/assets/img/question.svg"
                  alt="question"
                  class="question-icon position-absolute"
                  width="52px"
                  height="52px"
                />
                <div
                  class="bg-dark-3 px-space-sm pl-lg-space-md pt-space-lg pb-space-md py-space-md"
                >
                  <p class="text-large font-weight-bold text-secondary">
                    {{ pageData.sectionHelp.title }}
                  </p>
                  <p
                    class="text-small mt-space-xxs mb-space-sm text-white font-weight-bold"
                  >
                    {{ pageData.sectionHelp.text }}
                  </p>

                  <!-- help items -->
                  <template v-for="item in pageData.sectionHelp.helpItems">
                    <div :key="item.text" class="d-flex mb-space-sm">
                      <p class="text-white text-small mr-space-xxs mb-0">
                        {{ item.title }}
                      </p>
                      <div>
                        <a
                          @click="
                            handleNeedHelpLinksClick(
                              pageData.sectionHelp.title,
                              item.cta.label
                            )
                          "
                          :href="item.cta.link"
                          class="text-underline text-secondary text-small"
                          >{{ item.cta.label }}
                        </a>
                        <p
                          v-for="text in item.texts"
                          :key="text"
                          class="text-light-1 text-xs mt-space-xxxs mb-0"
                        >
                          {{ text }}
                        </p>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- application submission alert modal -->
      <b-modal
        ref="application-submitted-modal"
        size="lg"
        centered
        hide-header
        hide-footer
        body-class="p-0"
        :no-close-on-backdrop="true"
        :no-close-on-esc="true"
      >
        <div
          class="p-space-md p-lg-space-xl"
          data-cy="app-dashboard-application-submission-alert"
        >
          <!-- row: title -->

          <div class="row m-0">
            <div class="col-12 px-0 position-relative">
              <div class="lottie-container">
                <dotlottie-player
                  v-if="isLottiePlayerVisible"
                  :src="lottieSource"
                  loop
                  autoplay
                  mode="normal"
                ></dotlottie-player>
              </div>
              <h1 class="h1-small mt-space-xl pt-space-xs">
                <span class="bg-secondary">{{
                  pageData.sectionAppSubmittedModal.title
                }}</span>
              </h1>
              <p class="text-large my-space-sm my-lg-space-md">
                <span>{{ pageData.sectionAppSubmittedModal.text }}</span>
                <span class="font-weight-bold">{{ userEmail }}</span
                >.
              </p>
              <p class="text-white text-lg font-weight-bold">
                <span class="bg-dark-3 p-space-xxxs">{{
                  pageData.sectionAppSubmittedModal.stayOnTrackText
                }}</span>
              </p>
              <p class="mb-space-sm mb-lg-space-md text-large">
                {{ pageData.sectionAppSubmittedModal.subText }}
              </p>
              <button
                @click="
                  handleApplicationSubmittedCtaClick(
                    pageData.sectionAppSubmittedModal.title,
                    pageData.sectionAppSubmittedModal.ctaLabel
                  )
                "
                class="btn btn-secondary text-large float-right d-flex py-space-xxs px-space-sm"
              >
                <span>{{ pageData.sectionAppSubmittedModal.ctaLabel }}</span>
                <font-awesome-icon
                  icon="arrow-right"
                  class="ml-space-xxs pl-space-xxxs my-auto"
                />
              </button>
            </div>
          </div>
        </div>
      </b-modal>
    </div>
  </main>
</template>

<script>
import pageData from "@/content/dashboard.json";
import "@dotlottie/player-component";
import animationData from "@/assets/animations/app-submitted.json";
import { EnumPageNames } from "@/content/enum-app.js";
import { MyProgramConstants } from "@/content/enum-ug-application.js";
import BaseListTimeline from "@/components/base-components/BaseListTimeline.vue";
import UgAppDashboardWelcome from "@/components/ugapp-components/UgAppDashboardWelcome.vue";
import { BAlert, BModal } from "bootstrap-vue";
import { useUserStore } from "@/stores/user-store";
import { useAuthStore } from "@/stores/auth-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { mapState, mapActions } from "pinia";

export default {
  name: "UgAppDashboardView",
  components: {
    "ug-app-dashboard-welcome": UgAppDashboardWelcome,
    "base-list-timeline": BaseListTimeline,
    "b-alert": BAlert,
    "b-modal": BModal,
  },
  metaInfo() {
    return {
      title: `Dashboard | Undergraduate Application`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  data() {
    return {
      animationData: animationData,
      isFeedBackAlertVisible: true,
      isQTRAlertVisible: true,
      pageData,
      appId: null,
      isLottiePlayerVisible: false,
      applicationSummary: {
        applicationId: null,
        program: null,
        location: null,
        term: null,
      },
    };
  },
  methods: {
    ...mapActions(useUgApplicationStore, {
      applicationPatchUiViewInfo: "patchUiViewInfo",
      applicationUpdateFeedbackAlertClosed:
        "updateDashboardFeedbackAlertClosedStatus",
      applicationUpdateQTRAlertClosed: "updateDashboardQTRAlertClosedStatus",
    }),
    ...mapActions(useConfigStore, {
      configPopulateProgramDetail: "populateProgramDetail",
    }),
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
    }),
    handleViewSubmittedApplicationClick(section, text) {
      this.$router.push({
        name: EnumPageNames.PageUndergradPreview,
        params: { id: this.appId },
      });
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: section.toLowerCase(),
        text: text.toLowerCase(),
      });
    },
    handleNeedHelpLinksClick(section, text) {
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "external link",
        region: "main content",
        section: section.toLowerCase(),
        text: text.toLowerCase(),
      });
    },
    handleTimelineCtaClick(event) {
      this.$track(event);
    },
    handleApplicationSubmittedCtaClick(section, text) {
      this.$refs["application-submitted-modal"].hide();
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: section.toLowerCase(),
        text: text.toLowerCase(),
      });
    },
    handleFeedbackAlertClose() {
      this.isFeedBackAlertVisible = false;
      this.applicationUpdateFeedbackAlertClosed(true);
    },
    handleQTRAlertClose() {
      this.isQTRAlertVisible = false;
      this.applicationUpdateQTRAlertClosed(true);
    },
  },

  computed: {
    ...mapState(useUserStore, {
      getName: "legalName",
      userEmail: "email",
    }),
    ...mapState(useUgApplicationStore, {
      applicationProgramOfInterests: "programOfInterests",
      applicationPreviousScreen: "previousScreen",
      applicationDashboardFeedbackAlertClosed: "dashboardFeedbackAlertClosed",
      applicationQTRAlertClosed: "dashboardQTRAlertClosed",
    }),
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useConfigStore, {
      configTerms: "terms",
    }),
    applicationSummaryKeys() {
      return pageData.applicationSummary.applicationSummaryKeys;
    },
    lottieSource() {
      return JSON.stringify(animationData);
    },
  },
  async mounted() {
    this.applicationSummary.applicationId = this.$route.params.id;
    document
      .getElementById("fill_fafsa_link")
      .addEventListener("click", (evnt) => {
        this.$track({
          event: "link",
          action: "click",
          name: "onclick",
          type: "external link",
          region: "main content",
          section: "fill out the fafsa",
          text: evnt.target.innerText.toLowerCase(),
        });
      });
    // Checking for the previous screen and displaying the application submittion modal
    if (this.applicationPreviousScreen === EnumPageNames.PageUndergradReview) {
      this.$refs["application-submitted-modal"].show();
      setTimeout(() => {
        this.isLottiePlayerVisible = true;
      }, 500);
      const payload = {
        appId: this.appId,
        currentScreen: EnumPageNames.PageUndergradDashboard,
        previousScreen: EnumPageNames.PageUndergradDashboard,
      };
      const response = await this.applicationPatchUiViewInfo(
        this.authToken,
        this.appId,
        payload
      );
      if (response.code !== 201) {
        this.$track({
          event: "app_error",
          action: "post_app_dashboard",
          location: this.$router.currentRoute.fullPath,
          code: response.code,
          message: response.errors?.toString(),
        });
      }
    }
  },
  async created() {
    this.appId = this.$route.params.id;
    let term = null;
    let title = null;
    if (this.applicationProgramOfInterests.length > 0) {
      const firstChoiceProgram = this.applicationProgramOfInterests.filter(
        (item) => item.priority === "1"
      );
      if (firstChoiceProgram.length >= 1) {
        const programDetails = await this.configPopulateProgramDetail(
          firstChoiceProgram[0].plan
        );
        if (programDetails.code === 200) {
          // title
          title = programDetails.data.acadPlanDescription;
          if (
            firstChoiceProgram[0].subplan &&
            programDetails.data.subplans?.length > 0
          ) {
            const subplan = programDetails.data.subplans.filter(
              (item) => item.acadSubPlanCode === firstChoiceProgram[0].subplan
            );
            if (subplan.length > 0) {
              title = title + ` - ${subplan[0].description}`;
            }
          }
          title = title + `, ${programDetails.data.degreeDescriptionShort}`;
          // term
          const termDetail = this.configTerms[firstChoiceProgram[0].term];
          if (termDetail) {
            term = termDetail.description;
            if (firstChoiceProgram[0].session === MyProgramConstants.sessionA) {
              term = `${term} - (Session A)`;
            } else if (
              firstChoiceProgram[0].session === MyProgramConstants.sessionB
            ) {
              term = `${term} - (Session B)`;
            }
          }
        } else {
          this.$track({
            event: "app_error",
            action: "post_app_dashboard",
            location: this.$router.currentRoute.fullPath,
            code: programDetails.code,
            message: programDetails.errors.toString(),
          });
        }
      }
    }
    this.applicationSummary = {
      applicationId: this.appId,
      program: title,
      location: "ASU Online",
      term: term,
    };

    this.isFeedBackAlertVisible = !this.applicationDashboardFeedbackAlertClosed;
    this.isQTRAlertVisible = !this.applicationQTRAlertClosed;

    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
};
</script>

<style lang="scss" scoped>
.question-icon {
  top: -28px;
  left: 30px;
}
.lottie-container {
  position: absolute;
  height: 241px;
  top: -100px;
  left: -30px;
}
.qtr-close-button {
  width: 32px;
  height: 32px;
  right: 12px;
  top: 12px;
}
</style>

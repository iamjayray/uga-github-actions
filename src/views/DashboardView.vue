<template>
  <main id="main-content" data-cy="dashboard-dashboard-view">
    <!-- section-welcome -->
    <section
      class="pt-space-lg pb-space-sm pb-lg-space-md"
      data-cy="dashboard-section-welcome"
    >
      <div class="container">
        <div
          class="row no-gutters section-welcome"
          :style="
            'background-image:url(' +
            require('@/assets/img/mountain.png') +
            ');'
          "
        >
          <div class="col-12 border border-light-4">
            <div
              class="col-10 col-lg-7 pt-space-xs pt-lg-space-md pb-space-xs pl-space-xs pl-lg-space-md"
            >
              <h1 class="h1-small">
                <span class="bg-secondary p-space-xxxs">{{
                  welcomeCaptionLabel
                }}</span
                >&nbsp;You're a few steps away from becoming a Sun Devil.
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- section-new-application -->
    <ugapp-form-create-application
      v-if="!hasUndergradApplications"
      @ug-application-created="handleUndergradApplicationCreated"
    ></ugapp-form-create-application>

    <!-- section-continue-application -->
    <section
      v-if="hasUndergradApplications"
      class="py-space-sm pt-lg-space-sm pb-lg-space-lg"
      data-cy="dashboard-section-continue-application"
    >
      <div class="container">
        <!-- title-row -->
        <div class="row">
          <div class="col-12">
            <h2 class="h2-small mb-space-sm">
              Applications for
              <span>{{ userEmail }}</span>
            </h2>
          </div>
        </div>
        <!-- card-row -->
        <div class="row">
          <div class="col-12 col-lg-7">
            <p class="text-dark-1">Undergraduate</p>
            <!-- application-card (in-progress)-->
            <section
              class="border p-space-sm p-lg-space-md"
              v-if="!isSelectedUndergradAppSubmitted"
            >
              <!-- application status and ID -->
              <div
                class="d-flex align-items-center justify-content-between mb-space-xs"
              >
                <p
                  class="text-small bg-dark-3 text-white d-inline-block p-space-xxxs font-weight-bold mb-0"
                >
                  In progress
                </p>
                <p class="text-small mb-0 text-dark-1">
                  Application ID: {{ selectedUndergradApplication.appId }}
                </p>
              </div>

              <!-- program and location  -->
              <div class="mb-space-md">
                <p class="text-large mb-0 font-weight-bold">
                  {{ applicationCardTitle }}
                </p>
                <p class="mb-0 text-dark-1">ASU Online</p>
              </div>

              <!-- last-viewed and CTA -->
              <div
                class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between"
              >
                <p
                  v-if="!isSelectedUndergradAppSubmitted"
                  class="mb-lg-0 text-dark-1"
                >
                  <span class="font-weight-bold"
                    >Step {{ ugAppCurrentScreenStep }}:</span
                  >
                  {{ ugAppCurrentScreenLabel }}
                </p>
                <b-button
                  data-cy="dashboard-continue-application-button"
                  @click.prevent="
                    handleUndergradApplicationContinue('continue')
                  "
                  class="btn btn-secondary"
                >
                  <span class="mr-space-xxs">Continue</span>
                  <font-awesome-icon icon="arrow-right"></font-awesome-icon>
                </b-button>
              </div>
            </section>

            <!-- application-card (submitted)-->
            <section class="border p-space-sm p-lg-space-md" v-else>
              <!-- application status and ID -->
              <div
                class="d-flex align-items-center justify-content-between mb-space-xs"
              >
                <p
                  class="text-small bg-dark-3 text-white d-inline-block p-space-xxxs font-weight-bold mb-0"
                >
                  Submitted
                </p>
                <p class="text-small mb-0 text-dark-1">
                  Application ID: {{ selectedUndergradApplication.appId }}
                </p>
              </div>

              <!-- program and location  -->
              <div class="mb-space-md">
                <p class="text-large mb-0 font-weight-bold">
                  {{ applicationCardTitle }}
                </p>
                <p class="mb-0 text-dark-1">ASU Online</p>
              </div>

              <!-- last-viewed and CTA -->
              <div
                class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between"
              >
                <p class="mb-lg-0 text-dark-1 font-weight-bold">
                  Submitted on {{ formattedSubmissionDate }}
                </p>
                <b-button
                  data-cy="dashboard-view-application-button"
                  variant="dark-3"
                  @click.prevent="
                    handleUndergradApplicationContinue('view application')
                  "
                >
                  <span class="mr-space-xxs text-white">View application</span>
                  <font-awesome-icon
                    class="text-white"
                    icon="arrow-right"
                  ></font-awesome-icon>
                </b-button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>

    <!-- form in-progress (faq) -->
    <section
      v-if="!isSelectedUndergradAppSubmitted"
      data-cy="dashboard-form-in-progress"
    >
      <!-- horizontal-line -->
      <section class="py-space-xs">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <hr class="my-0" />
            </div>
          </div>
        </div>
      </section>

      <!-- section-need-help-and-faq -->
      <section class="py-space-lg">
        <div class="container">
          <div class="row">
            <!-- column-faq -->
            <div class="col-12 col-lg-4">
              <!-- row-need-help  -->
              <div class="row no-gutters" data-cy="dashboard-need-help">
                <div class="col-12">
                  <div class="need-help-bg px-space-sm pb-space-sm mb-space-lg">
                    <div class="mb-space-xs">
                      <img
                        src="@/assets/img/grad-cap-and-laptop.svg"
                        alt="need help?"
                        class="img-fluid"
                      />
                    </div>
                    <p class="text-white font-weight-bold">
                      I am looking to pursue ASU Online.
                    </p>
                    <a
                      v-b-toggle.portal-dashboard-need-help
                      href="javascript:void(0)"
                      class="text-underline text-secondary font-weight-bold text-small"
                      id="open_needhelp_sidebar_link"
                    >
                      If this is incorrect, let us know.
                    </a>
                    <b-sidebar
                      id="portal-dashboard-need-help"
                      aria-label="need help? contact us"
                      shadow
                      right
                      backdrop
                      backdrop-variant="light-2"
                      bg-variant="white"
                      no-header
                      :no-header-close="true"
                      header-class="p-0"
                      @shown="handleNeedHelpSidebar('open')"
                      @hidden="handleNeedHelpSidebar('close')"
                    >
                      <!-- content to place in body of the sidebar -->
                      <template v-slot:default="{ hide }">
                        <div data-cy="dashboard-needhelp-sidebar">
                          <!-- header -->
                          <div class="px-space-sm pt-space-md">
                            <a
                              href="javascript:void(0)"
                              @click="handleNeedHelpExit('exit', hide)"
                              class="back-button font-weight-bold mb-0 text-dark-3"
                            >
                              <font-awesome-icon
                                icon="fa-arrow-left"
                                class="mr-space-xs"
                              ></font-awesome-icon>
                              <span>Back</span>
                            </a>
                          </div>
                          <!-- body -->
                          <portal-form-need-help
                            class="px-space-lg py-space-lg"
                          ></portal-form-need-help>
                        </div>
                      </template>
                    </b-sidebar>
                  </div>
                </div>
              </div>

              <!-- row-faq -->
              <div
                class="row no-gutters mb-space-md mb-lg-0"
                data-cy="dashboard-faqs"
              >
                <div class="col-12">
                  <h2 class="h2-medium mb-space-sm">Application FAQ</h2>
                  <collapse-item
                    id="faqs"
                    v-for="item in faqs"
                    :key="item.id"
                    :collapse-id="item.id"
                    :title="item.title"
                    :display-number="false"
                    class="mb-space-xs"
                    @collapseShown="handleFaqCollapse('open', item.title)"
                    @collapseHidden="handleFaqCollapse('close', item.title)"
                  >
                    <div v-html="item.description"></div>
                  </collapse-item>
                </div>
              </div>
            </div>

            <!-- column-content -->
            <div class="col-12 offset-lg-1 col-lg-7">
              <div class="row no-gutters">
                <div class="col-12">
                  <h2 class="h2-medium mb-space-xs">Why ASU Online?</h2>
                  <p class="mb-space-md">
                    At Arizona State University, we offer more online programs
                    than any other university ranked in the top 20 — without
                    compromising quality. No matter which program you choose, we
                    have the resources and experience to provide you with the
                    best online education possible.
                  </p>
                </div>
              </div>

              <div class="row">
                <div class="col-12 col-lg-6 pb-space-sm">
                  <card-icon
                    :icon-source="require('@/assets/img/forks-up.svg')"
                    icon-alt="top-ranked programs"
                    title="Top-ranked programs"
                    title-size="medium"
                    :display-cta="false"
                    class="mb-space-sm h-100"
                  >
                    <p class="mb-0">
                      With 300+ programs, we have a degree or certificate for
                      nearly every career path and passion. ASU Online courses
                      are custom designed by our renowned faculty to provide you
                      with the most current and relevant content.
                    </p>
                  </card-icon>
                </div>
                <div class="col-12 col-lg-6 pb-space-sm">
                  <card-icon
                    :icon-source="require('@/assets/img/certificate.svg')"
                    icon-alt="same faculty, same degree"
                    title="Same faculty, same degree"
                    title-size="medium"
                    :display-cta="false"
                    class="mb-space-lg h-100"
                  >
                    <p class="mb-0">
                      You’ll follow the same curriculum and learn from the same
                      faculty as on-campus students. Your diploma and
                      transcripts will not specify “online,” as you’ll earn your
                      degree from Arizona State University.
                    </p>
                  </card-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>

    <!-- form submitted (need help) -->
    <section
      v-else
      class="border bg-light-1 pt-space-xl"
      data-cy="dashboard-form-submitted"
    >
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h2 class="h2-medium mb-space-xs">Need help? Contact us.</h2>
            <p class="text-dark-1 mb-space-md">
              We're here to assist you every step of the way.
            </p>
            <div class="mb-space-sm d-lg-flex">
              <!-- Enrollment-support -->
              <div
                class="d-flex align-items-start"
                data-cy="dashboard-enrollment-support"
              >
                <img
                  src="@/assets/img/app-enrollment-support.svg"
                  alt="login"
                  class="img-fluid mr-space-xs"
                />
                <div>
                  <p class="font-weight-bold">Enrollment support</p>
                  <a
                    href="tel:+1-866-277-6589"
                    class="text-underline mb-space-xxs"
                  >
                    866-277-6589
                  </a>
                  <p class="text-xs text-dark-1 mb-0">
                    Call for immediate support.
                  </p>
                  <p class="text-xs text-dark-1 mb-space-sm">
                    Monday through Friday, 6 a.m. to 6 p.m. (Arizona time)
                  </p>
                  <a
                    href="mailto:enrollmentonline@asu.edu"
                    class="text-underline"
                  >
                    enrollmentonline@asu.edu
                  </a>
                  <p class="text-xs text-dark-1 mb-space-sm">
                    Response within one to two business days
                  </p>
                </div>
              </div>
              <!-- Technical support -->
              <div
                class="d-flex align-items-start ml-lg-space-sm"
                data-cy="dashboard-technical-support"
              >
                <img
                  src="@/assets/img/app-technical-support.svg"
                  alt="login"
                  class="img-fluid mr-space-xs"
                />
                <div>
                  <p class="font-weight-bold">Technical support</p>
                  <a
                    href="tel:+1-855-278-5080"
                    class="text-underline mb-space-xxs"
                  >
                    855-278-5080
                  </a>
                  <p class="text-xs text-dark-1 mb-space-sm">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import UgAppFormCreateApplication from "@/components/ugapp-components/UgAppFormCreateApplication.vue";
import ApplicationFAQs from "@/content/application-faqs.json";
import { useAppStore } from "@/stores/app-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import CardIcon from "@rds/card-icon";
import CollapseItem from "@rds/collapse-item";
import { mapState, mapActions } from "pinia";
import { EnumPageNames } from "@/content/enum-app.js";
import { useUserStore } from "@/stores/user-store.js";
import { BSidebar, VBToggle, BButton } from "bootstrap-vue";
import PortalFormNeedHelp from "@/components/portal-components/PortalFormNeedHelp.vue";
import { capitalize } from "radash";

export default {
  name: "DashboardView",
  directives: { "b-toggle": VBToggle },
  metaInfo() {
    return {
      title: `Dashboard | Admissions`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "card-icon": CardIcon,
    "collapse-item": CollapseItem,
    "ugapp-form-create-application": UgAppFormCreateApplication,
    "b-sidebar": BSidebar,
    "portal-form-need-help": PortalFormNeedHelp,
    "b-button": BButton,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      showLoader: false,
      faqs: [],
      applicationCardTitle: "Continue your application",
    };
  },
  computed: {
    ...mapState(useAppStore, {
      hasUndergradApplications: "hasUndergradApplications",
      selectedUndergradApplication: "selectedUndergradApplication",
      isSelectedUndergradAppSubmitted: "isUndergradApplicationSubmitted",
      formattedSubmissionDate: "formattedSubmissionDate",
    }),
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useUgApplicationStore, {
      ugAppCurrentScreen: "currentScreen",
      ugAppCurrentScreenStep: "currentScreenStep",
      ugAppCurrentScreenLabel: "currentScreenLabel",
      applicationProgramOfInterests: "programOfInterests",
    }),
    ...mapState(useUserStore, {
      userEmail: "email",
      userFirstName: "formattedFirstName",
    }),
    welcomeCaptionLabel() {
      return this.userFirstName ? capitalize(this.userFirstName) : "Welcome!";
    },
  },
  methods: {
    ...mapActions(useConfigStore, {
      configPopulateProgramDetail: "populateProgramDetail",
    }),
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
    }),
    ...mapActions(useUgApplicationStore, {
      applicationPatchUiViewInfo: "patchUiViewInfo",
    }),
    handleNeedHelpExit(eventText, hideScope) {
      if (hideScope) {
        // closes the sidebar
        hideScope();
      }
    },
    handleUndergradApplicationCreated(createdApplicationId) {
      // route user to my-information screen
      this.$router.push({
        name: this.EnumPageNames.PageUndergradMyInformation,
        params: { id: createdApplicationId },
      });
    },
    async handleUndergradApplicationContinue(text) {
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: this.applicationCardTitle.toLowerCase(),
        text: text,
        component: "application-card",
      });
      if (this.isSelectedUndergradAppSubmitted) {
        if (
          this.ugAppCurrentScreen !== this.EnumPageNames.PageUndergradDashboard
        ) {
          const payload = {
            appId: this.selectedUndergradApplication.appId,
            currentScreen: this.EnumPageNames.PageUndergradDashboard,
            previousScreen: this.EnumPageNames.PageUndergradDashboard,
          };
          await this.applicationPatchUiViewInfo(
            this.authToken,
            this.selectedUndergradApplication.appId,
            payload
          );
        }
        this.$router.push({
          name: this.EnumPageNames.PageUndergradDashboard,
          params: { id: this.selectedUndergradApplication.appId },
        });
        return;
      }
      // route user to app's current-screen
      this.$router.push({
        name: this.ugAppCurrentScreen,
        params: { id: this.selectedUndergradApplication.appId },
      });
    },
    handleFaqCollapse(action, text) {
      // fire data layer event
      this.$track({
        event: "collapse",
        action: action,
        name: "onclick",
        type: "click",
        region: "main content",
        section: "application faq",
        text: text.toLowerCase(),
        component: "application faq",
      });
    },
    handleNeedHelpSidebar(action) {
      // fire data layer event
      this.$track({
        event: "collapse",
        action: action,
        name: "onclick",
        type: "click",
        region: "main content",
        section: "i am looking to pursue asu online",
        text: "if this is incorrect, click here",
        component: "need-help-sidebar",
      });
    },
  },
  async created() {
    // populate faqs
    this.faqs = ApplicationFAQs;
    // update application card title (if app submitted)
    if (this.isSelectedUndergradAppSubmitted) {
      if (this.applicationProgramOfInterests?.length > 0) {
        const firstChoiceProgram = this.applicationProgramOfInterests.filter(
          (item) => item.priority === "1"
        );
        if (firstChoiceProgram?.length >= 1) {
          const programDetails = await this.configPopulateProgramDetail(
            firstChoiceProgram[0].plan
          );
          if (programDetails.code === 200) {
            let title = programDetails.data.acadPlanDescription;
            if (
              firstChoiceProgram[0].subplan &&
              programDetails.data.subplans?.length > 0
            ) {
              const subplan = programDetails.data.subplans.filter(
                (item) => item.acadSubPlanCode === firstChoiceProgram[0].subplan
              );
              if (subplan?.length > 0) {
                title = `${title} - ${subplan[0].description}`;
              }
            }
            this.applicationCardTitle = `${title}, ${programDetails.data.degreeDescriptionShort}`;
          }
        }
      }
    }

    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
};
</script>

<style lang="scss" scoped>
.section-welcome {
  background-repeat: no-repeat;
  background-position: right bottom;
  background-size: contain;
  @media (max-width: 768px) {
    background-size: auto 58px;
  }
}

.need-help-bg {
  background-image: linear-gradient(#ffffff 38%, #191919 0);
}
</style>

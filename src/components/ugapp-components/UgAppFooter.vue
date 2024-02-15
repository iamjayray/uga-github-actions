<template>
  <footer class="section-footer sticky-footer" data-cy="up-app-footer">
    <!-- Progress bar -->
    <div
      class="progress-bar bg-primary"
      data-cy="up-app-footer-progress-bar"
    ></div>
    <!-- END -->
    <div class="container">
      <div
        class="d-flex pt-space-sm pb-space-md py-lg-space-md justify-content-between align-items-center"
      >
        <div class="py-lg-space-xxs">
          <!-- desktop Stepper -->
          <ul class="stepper pl-0 mb-0 my-auto d-none d-lg-block">
            <li
              class="d-flex float-left"
              v-for="(step, index) in ugAppChildren"
              :class="{
                completed: isActiveRouteCompleted(step.name),
                incomplete: !isActiveRouteCompleted(step.name),
                active: isActiveRoute(step.name),
              }"
              :key="step.name"
            >
              <!-- Completed/Step icon with tooltip -->
              <template v-if="isActiveRouteCompleted(step.name)">
                <font-awesome-icon
                  :id="`stepper-tooltip-target-${index}`"
                  class="completed-icon text-success"
                  icon="fa-check-circle"
                  aria-label="menu icon"
                ></font-awesome-icon>
              </template>
              <template v-else>
                <p
                  :id="`stepper-tooltip-target-${index}`"
                  class="stepper-index text-center text-dark-1 font-weight-bold mb-0"
                >
                  {{ index + 1 }}
                </p>
              </template>
              <!-- </div> -->
              <b-tooltip
                :target="`stepper-tooltip-target-${index}`"
                triggers="hover"
                custom-class="text-xs mb-space-xxs"
                variant="dark-2"
              >
                {{ step.qualifiedName }}
              </b-tooltip>
              <!-- END -->
              <div class="step-info ml-space-xxs">
                <p class="text-large font-weight-bold text-primary mb-0">
                  {{ step.qualifiedName }}
                </p>
              </div>
              <template v-if="index < ugAppChildren.length - 1">
                <font-awesome-icon
                  icon="fa-chevron-right"
                  class="text-light-5 mx-space-xxs mt-space-xxxs"
                ></font-awesome-icon>
              </template>
            </li>
          </ul>
          <!-- mobile step details -->
          <div class="ml-space-xs my-auto d-lg-none">
            <p class="mb-space-xxxs text-small text-primary font-weight-bold">
              Step {{ currentScreenStep }} of 6
            </p>
            <p class="text-dark-1 mb-0 text-xs">
              {{ currentRouteQualifiedName }}
            </p>
          </div>
        </div>
        <div v-if="isNavigationButtonsVisible">
          <!-- Back Button -->
          <button
            class="back-button btn btn-white mr-space-sm text-dark-1 text-small ml-auto p-0"
            @click="handleBackButtonClick"
            v-if="showBackButton"
            data-cy="up-app-footer-back-button"
          >
            Back
          </button>
          <button
            :disabled="loading"
            class="save-button btn btn-primary px-space-xs py-space-xxs"
            @click="handleSaveButtonClick"
            data-cy="up-app-desktop-footer-save-button"
          >
            {{ saveButtonText }}
          </button>
          <!-- END -->
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { BTooltip } from "bootstrap-vue";
import { mapActions, mapState } from "pinia";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import { EnumApiConstants, EnumPageNames } from "@/content/enum-app.js";
import { useAppStore } from "@/stores/app-store";

export default {
  name: "UgAppFooter",
  components: {
    "b-tooltip": BTooltip,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      isMobileStepperDetailsVisible: false,
      isNavigationButtonsVisible: true,
    };
  },
  computed: {
    ...mapState(useUgApplicationStore, {
      currentScreen: "currentScreen",
      previousScreen: "previousScreen",
      screenStatus: "screenStatus",
      currentScreenLabel: "currentScreenLabel",
      currentScreenStep: "currentScreenStep",
      isCurrentPageHasUnsavedChanges: "isCurrentPageHasUnsavedChanges",
      currentPageStatus: "currentPageStatus",
    }),
    ...mapState(useAppStore, ["loading"]),
    showBackButton() {
      return this.$route.name !== EnumPageNames.PageUndergradMyInformation;
    },
    currentRouteQualifiedName() {
      return this.currentScreenLabel;
    },
    ugAppChildren() {
      const ugAppRoute = this.$router.options.routes.find((route) =>
        route.path.includes(EnumApiConstants.UgAppPath)
      );
      const ugAppChildren = ugAppRoute?.children?.filter(
        (route) => route.displayInNav
      );
      return ugAppChildren;
    },
    saveButtonText() {
      return this.$route.name === this.EnumPageNames.PageUndergradReview
        ? "Submit application"
        : !this.isCurrentPageHasUnsavedChanges &&
          this.currentPageStatus &&
          !this.currentPageStatus.anyError
        ? "Continue"
        : "Save";
    },
  },
  watch: {
    saveButtonText() {
      this.isNavigationButtonsVisible = false;
      setTimeout(() => {
        this.isNavigationButtonsVisible = true;
      }, 100);
    },
  },
  methods: {
    ...mapActions(useUgApplicationStore, ["submitForm"]),
    isActiveRoute(routeName) {
      return this.$route.name === routeName;
    },
    isActiveRouteCompleted(routeName) {
      return this.screenStatus[routeName] === "completed";
    },
    handleBackButtonClick() {
      const payload = {
        appId: this.$route.params.id,
      };
      // if previous screen is review, on back click pushing the user back to review page.
      if (this.previousScreen === EnumPageNames.PageUndergradReview) {
        payload.currentScreen = EnumPageNames.PageUndergradReview;
        payload.previousScreen = EnumPageNames.PageUndergradArizonaResidency;
      } else {
        payload.currentScreen =
          this.ugAppChildren[this.currentScreenStep - 2].name;
        payload.previousScreen =
          this.currentScreenStep - 3 < 0
            ? this.ugAppChildren[this.currentScreenStep - 2].name
            : this.ugAppChildren[this.currentScreenStep - 3].name;
      }
      this.$emit("backClick", payload);
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "footer",
        section: "primary footer",
        text: "back",
        current_screen: this.currentScreen,
        previous_screen: this.previousScreen,
      });
    },
    handleSaveButtonClick() {
      this.submitForm();
    },
    handleNextButtonClick() {
      if (this.activeStepIndex < this.appStepperDetails.length - 1) {
        this.activeStepIndex += 1;
        this.isSaveButtonVisible = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.section-footer {
  background: var(--white);
  bottom: 0px;
  width: 100%;
  box-shadow: 0px 3px 6px #00000029;
  z-index: 24;
  .stepper {
    .stepper-index {
      width: 28px;
      height: 28px;
      border: 2px solid var(--dark-1);
      border-radius: 20px;
    }
    .step-info {
      max-width: 0px;
      position: absolute;
      opacity: 0;
      white-space: nowrap;
    }
    .completed-icon {
      height: 28px;
    }

    li.completed.active,
    li.incomplete.active {
      .step-info {
        max-width: 100vw !important;
        position: relative;
        opacity: 1;
        transition: all 2s;
      }
    }

    li.incomplete.active {
      .stepper-index {
        display: block !important;
        background-color: var(--primary);
        color: white !important;
        border-color: var(--primary) !important;
      }
    }

    .completed-icon,
    .stepper-index {
      z-index: 2;
    }
    a:focus {
      outline: none !important;
    }
  }
  .btn:focus {
    box-shadow: none;
  }
  .progress-bar {
    transition: all 1s;
    bottom: auto;
    left: 0;
    width: 100%;
    height: 6px;
    z-index: 3;
  }
  .progress-bar-background {
    z-index: 2;
    bottom: auto;
    left: 0;
    width: 100%;
    height: 6px;
  }
}
.sticky-footer {
  position: sticky;
  bottom: 0;
}
@media (max-width: 992px) {
  .save-button,
  .back-button {
    font-size: 14px;
  }
}
</style>

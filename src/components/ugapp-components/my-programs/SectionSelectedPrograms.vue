<template>
  <section class="container">
    <!-- backUpSelectionInProgress -->
    <div class="row">
      <div class="col-12" v-if="backUpMajorSelectionInProgress">
        <div class="d-flex">
          <div class="icon mr-space-xs">
            <font-awesome-icon
              class="download-icon"
              icon="fa-light fa-circle-check"
              size="xl"
            ></font-awesome-icon>
          </div>
          <div class="title w-100">
            <a
              href="javascript:void(0)"
              v-b-toggle.collapse-1-inner
              class="text-decoration-none text-dark-3"
              data-cy="my-programs-selected-program-collapse-button"
            >
              <h3 class="h3-small mr-space-xs mb-space-xxxs">
                First program selection
                <font-awesome-icon
                  class="collapse-icon ml-space-xxxs"
                  icon="fa-chevron-down"
                ></font-awesome-icon>
              </h3>
              <p class="m-0" data-cy="my-programs-program-title">
                {{ firstProgram.title }}
              </p>
            </a>
            <b-collapse id="collapse-1-inner" class="w-100">
              <div
                class="d-lg-flex align-content-center justify-content-between"
              >
                <div class="title">
                  <p
                    data-cy="my-programs-program-start-date"
                    class="text-dark-1 mb-space-xxxs"
                  >
                    {{ firstProgram.startDate }}
                  </p>
                  <p class="text-dark-1 mb-lg-0">ASU Online</p>
                </div>
                <a
                  href="javascript:void(0)"
                  class="font-weight-bold text-underline"
                  data-cy="my-programs-selected-program-change-selection-button"
                  @click="triggerProgramChange(firstProgram)"
                >
                  <font-awesome-icon
                    icon="fa-pencil"
                    class="mr-space-xxs"
                  ></font-awesome-icon>
                  <span>Change selection</span>
                </a>
              </div>
            </b-collapse>
          </div>
        </div>
        <div
          class="col-lg-8 p-0 my-space-md p-lg-space-sm selected-program-warning"
        >
          <div class="d-flex">
            <div class="icon mr-space-xs">
              <span
                class="download-icon bg-secondary rounded-circle d-flex align-items-center justify-content-center"
              >
                <font-awesome-icon
                  icon="fa-solid fa-arrow-down"
                  size="lg"
                ></font-awesome-icon>
              </span>
            </div>
            <div
              class="card-info"
              data-cy="my-programs-selected-programs-backup-program-card"
            >
              <h3 class="h3-large">Choose a backup program</h3>
              <p class="mb-0 pt-space-sm">
                The first program you selected has higher admission requirements
                than most programs. Select a second program without higher
                admission requirements as a backup.
              </p>
              <base-alert
                v-if="isSecondMajorRequired"
                alert-type="error"
                class="mt-space-sm is-invalid"
                text="You must select a backup program to continue."
                :isDismissible="false"
              ></base-alert>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12" v-else>
        <div
          class="selected-program pb-space-md pb-lg-space-lg"
          v-for="program in selectedPrograms"
          :key="program.title"
          data-cy="my-programs-selected-program"
        >
          <h3 class="h3-large mb-space-xxs">
            {{ program.payloadData.priority === "1" ? "First" : "Backup" }}
            program selection
          </h3>
          <hr />

          <div class="mt-space-sm mt-lg-space-md d-flex">
            <div
              class="check-icon my-auto bg-secondary rounded-circle d-flex align-items-center justify-content-center mr-space-sm mr-lg-space-xl"
            >
              <font-awesome-icon
                icon="fa-sharp fa-solid fa-check"
                size="lg"
              ></font-awesome-icon>
            </div>
            <div class="d-lg-flex w-100">
              <div>
                <h3
                  data-cy="my-programs-program-title"
                  class="h3-small mb-space-xxxs"
                >
                  {{ program.title }}
                </h3>
                <p
                  data-cy="my-programs-program-start-date"
                  class="text-dark-1 mb-space-xxxs"
                >
                  {{ program.startDate }}
                </p>
                <p class="text-dark-1 mb-0">ASU Online</p>
              </div>
              <div class="mt-space-xs my-lg-auto ml-lg-auto">
                <a
                  href="javascript:void(0)"
                  class="font-weight-bold text-underline"
                  data-cy="my-programs-selected-program-change-selection-button"
                  @click="triggerProgramChange(program)"
                >
                  <font-awesome-icon
                    icon="fa-pencil"
                    class="mr-space-xxs"
                  ></font-awesome-icon>
                  <span>Change selection</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- programSelected -->
  </section>
</template>
<script>
import { BCollapse, VBToggle } from "bootstrap-vue";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
export default {
  data() {
    return {
      // InProgress|Done|IGNORED
      backUpProgramSelectionStatus: "IGNORED",
    };
  },
  components: {
    "b-collapse": BCollapse,
    "base-alert": BaseAlert,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  props: {
    isSecondMajorRequired: {
      type: Boolean,
      default: false,
    },
    selectedPrograms: {
      type: Array,
      required: true,
    },
  },
  methods: {
    triggerProgramChange({ acadPlanCode, payloadData }) {
      this.$emit("program-change", acadPlanCode, payloadData.priority);
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: "accountancy, bs",
        text: "change selection",
        component:
          payloadData.priority === "1"
            ? "first program selection"
            : "backup program selection",
      });
    },
  },
  computed: {
    firstProgram() {
      return this.selectedPrograms[0];
    },
    backUpMajorSelectionInProgress() {
      return (
        this.selectedPrograms.length > 0 &&
        this.selectedPrograms[0].highAdmissionProgram &&
        this.selectedPrograms.length !== 2
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.check-icon {
  width: 34px !important;
  height: 32px !important;
}
.download-icon {
  width: 34px !important;
  height: 34px !important;
}
.selected-program-warning {
  @media (min-width: 992px) {
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 20px;
  }
}
</style>

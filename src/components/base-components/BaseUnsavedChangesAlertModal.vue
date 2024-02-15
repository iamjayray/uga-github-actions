<template>
  <div>
    <b-modal
      ref="unsaved-changes-alert-modal"
      v-model="isModalVisible"
      centered
      hide-header
      hide-footer
      body-class="p-0"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
    >
      <div
        class="unsaved-changes-model p-space-md"
        data-cy="ug-app-unsaved-changes-alert-modal"
      >
        <!-- row: cancel button -->
        <div
          class="row model-close-button position-absolute"
          data-cy="cancel-button"
        >
          <div class="col-12">
            <a
              href="javascript:void(0)"
              @click="handleCloseClick"
              class="d-flex flex-row justify-content-end align-items-center pt-space-md pr-space-md"
              aria-label="close modal"
              data-cy="ug-app-unsaved-changes-alert-modal-close-cross-button"
            >
              <font-awesome-icon
                icon="xmark"
                class="text-light-5"
                size="2x"
              ></font-awesome-icon>
            </a>
          </div>
        </div>
        <!-- row: content -->
        <div
          class="row mt-space-md"
          data-cy="ug-app-unsaved-changes-alert-modal-content"
        >
          <div class="col-12">
            <h2 class="h2-medium">This page has unsaved changes</h2>
            <p class="mt-space-md mb-0">
              To save your progress on this page, please go back and click the
              "Save" button. Other pages you've fully completed will
              automatically be saved.
            </p>
            <hr class="my-space-lg" />
            <div class="d-flex justify-content-end">
              <button
                class="btn btn-white p-0 text-dark-1"
                @click="handleLeaveWithOutSaving"
                data-cy="ug-app-unsaved-changes-alert-modal-leave-without-saving-button"
              >
                Leave without saving
              </button>
              <button
                @click="handleBackToSaveClick"
                class="ml-space-md btn btn-dark-3 px-space-xs"
                data-cy="ug-app-unsaved-changes-alert-modal-go-back-to-save-button"
              >
                Go back to save
              </button>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BModal } from "bootstrap-vue";
export default {
  name: "BaseUnsavedChangesAlertModal",
  components: {
    "b-modal": BModal,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isModalVisible: {
      get() {
        return this.isVisible;
      },
      set() {},
    },
  },
  methods: {
    handleCloseClick() {
      this.$emit("close");
    },
    handleLeaveWithOutSaving() {
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: "this page has unsaved changes",
        text: "leave without saving",
      });
      this.$emit("leaveWithOutSaving");
    },
    handleBackToSaveClick() {
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: "this page has unsaved changes",
        text: "go back to save",
      });
      this.$emit("backToSave");
    },
  },
};
</script>

<style lang="scss" scoped>
.model-close-button {
  top: 0px;
  right: 0px;
}
</style>

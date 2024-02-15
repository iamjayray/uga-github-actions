<template>
  <b-alert
    show
    :dismissible="isDismissible"
    :variant="alertVariant"
    class="d-flex py-space-sm py-lg-space-xs pl-space-sm pr-space-md pr-lg-space-xl"
    @dismissed="handleDismissedEvent"
  >
    <font-awesome-icon
      v-if="isIconVisible"
      :icon="alertIcon"
      size="2xl"
      class="my-auto mr-space-sm mr-lg-space-lg"
      :class="iconClass"
    />
    <div class="my-auto" :class="textClass" v-html="text"></div>
    <slot name="body"></slot>
  </b-alert>
</template>

<script>
import { BAlert } from "bootstrap-vue";

export default {
  name: "BaseAlert",
  components: {
    "b-alert": BAlert,
  },
  props: {
    text: {
      type: String,
      default: null,
    },
    textWeight: {
      type: String,
      default: "bold",
    },
    textSize: {
      type: String,
      default: "medium",
    },
    isDismissible: {
      type: Boolean,
      default: true,
    },
    iconVariant: {
      type: String,
      default: "dark-3",
    },
    isIconVisible: {
      type: Boolean,
      default: true,
    },
    // Accepted values: info|warning|success|danger
    alertType: {
      type: String,
      default: "success",
      validator: (value) => {
        return value.match(/(info|warning|success|error)/);
      },
    },
  },
  data() {
    return {
      type: {
        info: {
          faIcon: "fa-solid fa-circle-info",
          variant: "info",
        },
        warning: {
          faIcon: "fa-solid fa-bell",
          variant: "warning",
        },
        success: {
          faIcon: "fa-sharp fa-solid fa-circle-check",
          variant: "success",
        },
        error: {
          faIcon: "fa-solid fa-triangle-exclamation",
          variant: "danger",
        },
      },
    };
  },
  computed: {
    alertVariant() {
      return this.type[this.alertType]["variant"];
    },
    alertIcon() {
      return this.type[this.alertType]["faIcon"];
    },
    textClass() {
      return `text-${this.textSize} font-weight-${this.textWeight}`;
    },
    iconClass() {
      return `text-${this.iconVariant}`;
    },
  },
  methods: {
    handleDismissedEvent() {
      this.$emit("dismissed");
    },
  },
};
</script>

<style lang="scss" scoped></style>

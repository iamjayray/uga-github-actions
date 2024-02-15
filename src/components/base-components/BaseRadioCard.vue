<template>
  <div
    class="card-radio-parent"
    :class="{
      'is-active': inputValue == option.value,
    }"
  >
    <b-form-radio
      class="base-radio-card border border-light-4 w-100 m-0 h-100 position-relative"
      :value="option.value"
      :class="{
        'is-invalid': onErrorMsg.length > 0,
      }"
      v-model="inputValue"
      :name="name"
    >
      <div
        class="check-mark position-absolute bg-dark-3 rounded-circle"
        v-if="inputValue == option.value"
      >
        <font-awesome-icon
          icon="fa-sharp fa-solid fa-circle-check"
          class="fa-icon text-secondary"
        ></font-awesome-icon>
      </div>
      <div
        v-else
        class="border position-absolute rounded-circle check-mark"
      ></div>
      <slot name="body"></slot>
    </b-form-radio>
    <b-form-invalid-feedback :force-show="onErrorMsg.length > 0">
      <ul class="list-unstyled mb-0">
        <li v-for="msg in onErrorMsg" :key="msg">
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          {{ msg }}
        </li>
      </ul>
    </b-form-invalid-feedback>
  </div>
</template>

<script>
import { BFormRadio, BFormInvalidFeedback } from "bootstrap-vue";
export default {
  name: "BaseRadioCard",
  components: {
    "b-form-radio": BFormRadio,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  props: {
    value: {
      // Helps with 2way binding
      // option value
      type: String,
      default: null,
    },
    option: {
      // { text: "Option text", value: "option value" }
      type: Object,
      required: true,
    },
    onErrorMsg: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        if (newValue == this.option.value) {
          // string
          this.$emit("input", newValue);
          // { text: "Option text", value: "option value" }
          this.$emit("change", this.option);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.is-invalid {
  border-color: var(--danger) !important;
  border-bottom-width: 8px !important;
}
</style>

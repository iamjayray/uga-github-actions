<template>
  <div class="masked-input position-relative">
    <input
      type="text"
      placeholder="XXX-XX-XXXX"
      v-imask="maskDetails"
      :value="value"
      @accept="onAccept"
      @focus="focusTrigger"
      @blur="inputBlurred"
      class="form-control"
      :state="isInputValid"
      :class="{ 'is-invalid': !isInputValid && isInputValid !== null }"
    />
    <!-- Error message -->
    <b-form-invalid-feedback>
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
import { IMaskDirective } from "vue-imask";
import { BFormInvalidFeedback } from "bootstrap-vue";
export default {
  name: "BaseInputSSN",
  components: {
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  directives: {
    imask: IMaskDirective,
  },
  props: {
    // Helps with presetting the masked value
    value: {
      type: String,
      default: null,
    },
    isInputValid: {
      type: Boolean,
    },
    onErrorMsg: {
      type: Array,
      default: () => [],
    },
    isSsnPreFilled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      maskDetails: {
        mask: "XXX-XX-XXXX",
        definitions: {
          X: {
            mask: "0",
            displayChar: "X",
          },
        },
      },
    };
  },
  methods: {
    onAccept(event) {
      const value = event.detail.value.replaceAll("-", "");
      if (!this.isSsnPreFilled) {
        this.maskDetails.mask = "000-00-0000";
      }
      this.$emit("input", value);
      this.$emit("change", value);
    },
    focusTrigger() {
      this.maskDetails.mask = this.isSsnPreFilled
        ? "XXX-XX-XXXX"
        : "000-00-0000";
    },
    inputBlurred() {
      this.maskDetails.mask = this.isSsnPreFilled
        ? "XXX-XX-XXXX"
        : "XXX-XX-0000";
    },
  },
};
</script>
<style lang="scss"></style>

<template>
  <div class="app-base-input position-relative" data-cy="input-password">
    <b-form-input
      class="base-input-password rounded-0 text-large text-dark-1 border-light-4 position-relative"
      v-model="inputValue"
      :type="isPasswordVisible ? 'text' : 'password'"
      :placeholder="placeholder"
      :state="isInputValid"
      aria-describedby="input-live-help input-live-feedback"
    >
    </b-form-input>
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
    <div class="password-visibility-icon position-absolute">
      <a
        href="javascript:void(0)"
        class="text-decoration-none text-dark-3"
        @click="handlePasswordVisibility"
        role="button"
        aria-label="show or hide password"
      >
        <font-awesome-icon
          :icon="isPasswordVisible ? 'fa-eye' : 'fa-eye-slash'"
          aria-label="menu icon"
          class="fa-icon"
        ></font-awesome-icon>
      </a>
    </div>
  </div>
</template>

<script>
import { BFormInput, BFormInvalidFeedback } from "bootstrap-vue";
export default {
  name: "BaseInputPassword",
  components: {
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  props: {
    // Helps with 2way binding
    value: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: "Enter your password",
    },
    isInputValid: {
      type: Boolean,
      default: null,
    },
    onErrorMsg: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isPasswordVisible: false,
    };
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
  methods: {
    handlePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
  },
};
</script>

<style lang="scss" scoped>
.password-visibility-icon {
  top: 1.13rem;
  right: 2rem;
  .fa-icon {
    width: 20px !important;
  }
}
</style>

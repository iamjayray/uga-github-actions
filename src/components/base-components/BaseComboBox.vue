<template>
  <div
    class="combobox"
    role="combobox"
    aria-haspopup="listbox"
    aria-label="Select an option"
    :aria-controls="uniqueId"
    aria-expanded="true"
  >
    <b-dropdown
      lazy
      block
      no-caret
      variant="white"
      class="custom-combo-box"
      size="md"
      menu-class="w-100"
      :class="{ 'chevron-rotate': isDropdownOpen }"
      @show="handleOpenDropdown"
      @hide="handleCloseDropdown"
      :aria-expanded="isDropdownOpen"
      role="listbox"
      :id="uniqueId"
    >
      <!-- Chevron -->
      <template #button-content>
        <span
          class="chevron-down-solid d-flex justify-content-between text-muted font-weight-normal"
        >
          {{ getSelectedOptionsLength }}
          <font-awesome-icon
            :icon="['fas', 'chevron-down']"
            size="xs"
            class="chevron mt-space-xxxs"
          />
        </span>
      </template>

      <!-- Options -->
      <b-dropdown-form>
        <b-form-checkbox
          v-for="(option, index) in options"
          :key="option.text"
          v-model="option.checked"
          @change="toggleCheckbox(option, option.checked, index)"
          @keydown.arrow-up.native.prevent="handleArrowUp(index)"
          @keydown.arrow-down.native.prevent="handleArrowDown(index)"
          :aria-checked="!!option.checked"
          :aria-labelledby="'option-' + index"
          ref="checkboxRefs"
        >
          {{ option.text }}
        </b-form-checkbox>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
import { BDropdown, BDropdownForm, BFormCheckbox } from "bootstrap-vue";

export default {
  name: "BaseComboBox",
  components: {
    "b-dropdown": BDropdown,
    "b-dropdown-form": BDropdownForm,
    "b-form-checkbox": BFormCheckbox,
  },
  props: {
    // Receives an array of objects with the following structure: { text: string, value: string }
    options: {
      type: Array,
      default: () => [],
    },
    // Receives a string to be displayed as the placeholder
    placeHolder: {
      type: String,
      default: "Selected",
    },
    // Two way binding for the selectedOptions (v-model)
    value: {
      type: Array,
      default: () => [],
    },
    uniqueId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    // Array of selected options
    isDropdownOpen: false,
    focusedIndex: 0,
  }),
  methods: {
    // Toggles the checkbox and adds/removes the option from the selectedOptions array
    toggleCheckbox(option, isChecked, index) {
      if (!isChecked) {
        this.selectedOptions = this.selectedOptions.filter(
          (item) => item.value !== option.value
        );
        this.$emit("uncheck", option);
      } else {
        this.selectedOptions.push(option);
        this.$emit("check", option);
      }
      this.focusedIndex = index;
    },
    // Opens and closes the dropdown
    handleOpenDropdown() {
      this.isDropdownOpen = true;
      this.$emit("open");
    },
    handleCloseDropdown() {
      this.isDropdownOpen = false;
      this.$emit("close");
    },
    // Handles the arrow up and down keys (accessibility)
    handleArrowUp(currentIndex) {
      if (currentIndex === 0) return;
      else this.focusedIndex = currentIndex - 1;
      this.$refs.checkboxRefs[this.focusedIndex].focus();
    },
    handleArrowDown(currentIndex) {
      if (currentIndex === this.options.length - 1) return;
      else this.focusedIndex = currentIndex + 1;
      this.$refs.checkboxRefs[this.focusedIndex].focus();
    },
  },
  computed: {
    // Returns the length of the selectedOptions array
    getSelectedOptionsLength() {
      if (this.selectedOptions?.length > 0) {
        return `${this.placeHolder}: (${this.selectedOptions.length})`;
      } else return this.placeHolder;
    },
    selectedOptions: {
      get() {
        this.options.forEach((option) => {
          option.checked = this.value
            ? Array.isArray(this.value)
              ? this.value.some((item) => item.value === option.value)
              : this.value.value === option.value
            : false;
        });

        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  created() {
    // Check for any initially checked items in the options prop
    this.selectedOptions = this.options.filter((option) => option.checked);
  },
  updated() {
    if (this.isDropdownOpen) {
      this.$nextTick(() => this.$refs.checkboxRefs[this.focusedIndex].focus());
    }
  },
};
</script>

<style lang="scss" scoped></style>

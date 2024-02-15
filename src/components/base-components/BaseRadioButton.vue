<template>
  <div class="radio-parent">
    <label
      class="radio-button-label border rounded mb-0 p-space-xs bg-white text-dark-1"
      :class="{ active: inputValue === option.value }"
    >
      <span class="mr-space-xs font-weight-bold">{{ option.text }}</span
      ><input
        type="radio"
        :name="name"
        ref="radio"
        :value="option.value"
        v-model="inputValue"
      />
    </label>
  </div>
</template>

<script>
export default {
  name: "BaseRadioButton",
  props: {
    // Helps with 2way binding
    // { text: "Option 1", value: "option1" }
    value: {
      type: Object,
      default: null,
    },
    option: {
      // { text: "Option 1", value: "option1" }
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    inputValue: {
      get() {
        return this.value?.value;
      },
      set() {
        this.$emit("input", this.option);
        this.$emit("change", this.option);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <div class="d-flex flex-wrap" data-cy="radio-group">
    <base-radio-button
      v-for="option in options"
      :key="option.text"
      :option="option"
      :name="name"
      v-model="inputValue"
      @change="handleInputChange"
      class="mr-space-xs mr-lg-space-md mb-space-xs"
    ></base-radio-button>
  </div>
</template>

<script>
import BaseRadioButton from "@/components/base-components/BaseRadioButton.vue";
export default {
  name: "BaseRadioGroup",
  components: {
    "base-radio-button": BaseRadioButton,
  },
  props: {
    // Helps with 2way binding
    // { text: "Option 1", value: "option1" }
    value: {
      type: Object,
      default: null,
    },
    options: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleInputChange(option) {
      this.$emit("change", option);
    },
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
};
</script>

<style lang="scss" scoped></style>

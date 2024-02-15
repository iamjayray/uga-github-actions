<template>
  <div class="row">
    <div class="col-12 border-top pt-space-md pt-lg-space-lg">
      <h3 class="h3-large mb-space-xxs mb-lg-space-xs d-flex">
        <span class="my-auto">{{ compData.label }}</span>
        <span
          class="my-auto ml-space-xxs ml-lg-space-sm bg-light-3 text-xs px-space-xxs py-lg-space-xxxs"
        >
          Optional
        </span>
      </h3>
      <b-form-group
        class="mb-space-sm"
        data-cy="my-programs-other-interests-interest-group"
      >
        <b-form-checkbox-group
          id="interested_in_anything_checkbox_group"
          v-model="otherInterests"
          stacked
          value-field="value"
          text-field="text"
          :options="compData.options"
          name="interested_in_anything_checkbox"
          class="text-small"
        ></b-form-checkbox-group>
      </b-form-group>
      <p class="text-dark-1 text-small col-12 col-lg-8 px-0">
        {{ compData.subText }}
      </p>
    </div>
  </div>
</template>

<script>
import { BFormGroup, BFormCheckboxGroup } from "bootstrap-vue";
export default {
  name: "SectionOtherInterests",
  props: {
    // Helps with two way binding of data
    value: {
      type: Array,
      default: null,
    },
    compData: {
      type: Object,
      required: true,
    },
  },
  components: {
    "b-form-group": BFormGroup,
    "b-form-checkbox-group": BFormCheckboxGroup,
  },
  data() {
    return {
      otherInterests: [],
    };
  },
  watch: {
    otherInterests(newValue) {
      this.$emit("input", newValue);
    },
  },
  mounted() {
    this.otherInterests = this.value;
  },
};
</script>

<style lang="scss" scoped></style>

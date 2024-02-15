<template>
  <section id="native_american" data-cy="arizona-residency-native-american">
    <div class="row">
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-is-native-american"
          id="radio_isNativeAmerican"
          :aria-label="content.isNativeAmerican.label"
          label-class="pb-0"
          class="mb-space-xs mb-lg-space-md position-relative"
        >
          <template #label>
            <label
              for="isNativeAmerican_radio"
              class="mb-lg-space-xxs font-weight-bold"
            >
              <span class="my-auto"> {{ content.isNativeAmerican.label }}</span>
            </label>
          </template>
          <base-radio-group
            name="employment_radio_isNativeAmerican"
            id="isNativeAmerican_radio"
            :options="content.isNativeAmerican.options"
            v-model="$v.form.isNativeAmerican.$model"
            :class="{
              'is-invalid':
                $v.form.isNativeAmerican.$dirty &&
                $v.form.isNativeAmerican.$error,
            }"
          >
          </base-radio-group>
          <!-- Error message -->
          <b-form-invalid-feedback v-if="!$v.form.isNativeAmerican.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
    </div>
  </section>
</template>

<script>
import formHelpers from "@/mixins/form-helpers";
import { BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import { required } from "vuelidate/lib/validators";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import { mapState } from "pinia";
export default {
  name: "SectionNativeAmerican",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        isNativeAmerican: null,
      },
    };
  },
  props: {
    content: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Object,
      default: () => {},
    },
    isFormSubmitClicked: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isFormSubmitClicked: {
      handler(val) {
        if (val) {
          this.$v.$touch();
        }
      },
      immediate: true,
    },
    form: {
      handler: function (val) {
        this.$emit("input", val || this.form);
      },
      deep: true,
    },
    $v: {
      handler(val) {
        this.$emit("isFormInvalid", val.$invalid);
      },
      deep: true,
    },
  },
  components: {
    "base-radio-group": BaseRadioGroup,
    "b-form-group": BFormGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  computed: {
    ...mapState(useUgApplicationStore, ["sectionNativeAmerican"]),
  },
  created() {
    this.form.isNativeAmerican = this.sectionNativeAmerican.isNativeAmerican;
  },
  validations: {
    form: {
      isNativeAmerican: {
        required,
      },
    },
  },
  mounted() {
    this.$emit("isFormInvalid", this.$v.$invalid);
  },
};
</script>

<style scoped></style>

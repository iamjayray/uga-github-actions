<template>
  <!-- section dependency for tax purpose -->
  <section id="dependent_claim" data-cy="arizona-residency-dependent-claim">
    <div class="row">
      <!-- Were you claimed as a dependent for income tax purposes by a parent or legal guardian for %current_year-1% or %current_year-2%? -->
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-group-is-tax-claimed-as-dependent"
          id="radio_isTaxClaimedAsDependent"
          :aria-label="formatContent(content.isTaxClaimedAsDependent.label)"
          label-class="pb-0"
          class="mb-space-xs mb-lg-space-md position-relative"
        >
          <template #label>
            <label for="DOM_AZ_radio" class="mb-lg-space-xxs font-weight-bold">
              <span class="my-auto">
                {{ formatContent(content.isTaxClaimedAsDependent.label) }}</span
              >
            </label>
          </template>
          <base-radio-group
            name="radio_isTaxClaimedAsDependent"
            :options="content.isTaxClaimedAsDependent.options"
            v-model="$v.form.isTaxClaimedAsDependent.$model"
            :class="{
              'is-invalid':
                $v.form.isTaxClaimedAsDependent.$dirty &&
                $v.form.isTaxClaimedAsDependent.$error,
            }"
          >
          </base-radio-group>
          <!-- Error message -->
          <b-form-invalid-feedback
            v-if="!$v.form.isTaxClaimedAsDependent.required"
          >
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
import { useUgApplicationStore } from "@/stores/ug-application-store";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import { BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import { requiredIf } from "vuelidate/lib/validators";
import { mapState } from "pinia";

export default {
  name: "SectionDependency",
  mixins: [formHelpers, validationMixin],
  data() {
    return {
      form: {
        isTaxClaimedAsDependent: null,
      },
    };
  },
  components: {
    "base-radio-group": BaseRadioGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-group": BFormGroup,
  },
  props: {
    content: {
      type: Object,
      default: () => {},
    },
    isRequired: {
      type: Boolean,
      default: false,
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
  validations: {
    form: {
      isTaxClaimedAsDependent: {
        required: requiredIf(function () {
          return this.isRequired;
        }),
      },
    },
  },
  computed: {
    ...mapState(useUgApplicationStore, {
      sectionDependent: "sectionDependent",
    }),
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
  created() {
    this.form.isTaxClaimedAsDependent =
      this.sectionDependent?.isTaxClaimedAsDependent;
    this.form = { ...(this.value || this.form) };
  },
  mounted() {
    this.$emit("isFormInvalid", this.$v.$invalid);
    if (!this.isRequired) {
      this.form.isTaxClaimedAsDependent = null;
    }
  },
};
</script>

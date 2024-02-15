<template>
  <!-- section tax information -->
  <section id="taxes" data-cy="arizona-residency-taxes">
    <div class="row">
      <!-- Did you file taxes in Arizona last year? -->
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-group-is-filed-tax-last-year"
          id="radio_isFiledTaxLastYear"
          :aria-label="formatContent(content.isFiledTaxLastYear.label)"
          label-class="pb-0"
          class="mb-space-xs mb-lg-space-md position-relative"
        >
          <template #label>
            <label
              for="isFiledTaxLastYear_radio"
              class="mb-lg-space-xxs font-weight-bold"
            >
              <span class="my-auto">
                {{ formatContent(content.isFiledTaxLastYear.label) }}</span
              >
            </label>
          </template>
          <base-radio-group
            name="isFiledTaxLastYear_radio"
            :options="content.isFiledTaxLastYear.options"
            @change="handleIsFiledTaxLastYearChange"
            v-model="$v.form.isFiledTaxLastYear.$model"
            :class="{
              'is-invalid':
                $v.form.isFiledTaxLastYear.$dirty &&
                $v.form.isFiledTaxLastYear.$error,
            }"
          >
          </base-radio-group>
          <!-- Error message -->
          <b-form-invalid-feedback v-if="!$v.form.isFiledTaxLastYear.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <!-- where did you file taxes last year -->
      <div class="col-12 mt-space-sm" v-if="isTaxFiledLastYear">
        <b-form-group
          data-cy="arizona-residency-group-select-state-filed-tax"
          id="group-selectStateFiledTax"
          :aria-label="formatContent(content.selectStateFiledTax.label)"
          class="mb-space-md"
          label-class="pb-0"
          label-for="selectStateFiledTax"
        >
          <template #label>
            <label
              :for="`select-state-${content.selectStateFiledTax.psKey}`"
              class="font-weight-bold"
            >
              {{ formatContent(content.selectStateFiledTax.label) }}
            </label>
          </template>
          <base-select
            :id="`select-state-${content.selectStateFiledTax.psKey}`"
            :options="allUsStates"
            v-model="$v.form.selectStateFiledTax.$model"
            :onErrorMsg="validateSelect($v.form.selectStateFiledTax)"
            placeholderText="Select a state"
            class="col-lg-5 px-0 col-12"
          ></base-select>
        </b-form-group>
      </div>
    </div>
  </section>
</template>

<script>
import formHelpers from "@/mixins/form-helpers";
import { EnumNameTypes } from "@/content/enum-ug-application";
import { BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";

import { mapState } from "pinia";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";

import { validationMixin } from "vuelidate";
import { required, requiredIf } from "vuelidate/lib/validators";
export default {
  name: "SectionVehicle",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        isFiledTaxLastYear: null,
        selectStateFiledTax: null,
      },
    };
  },
  computed: {
    ...mapState(useUgApplicationStore, {
      sectionTax: "sectionTax",
    }),
    isTaxFiledLastYear() {
      return this.form.isFiledTaxLastYear?.value === EnumNameTypes.Yes;
    },
  },
  created() {
    this.form.isFiledTaxLastYear = this.sectionTax?.isFiledTaxLastYear;
    this.form.selectStateFiledTax = this.sectionTax?.selectStateFiledTax;
  },
  mounted() {
    this.$emit("isFormInvalid", this.$v.$invalid);
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
    allUsStates: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    "base-radio-group": BaseRadioGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-group": BFormGroup,
    "base-select": BaseSelect,
  },
  validations: {
    form: {
      isFiledTaxLastYear: {
        required,
      },
      selectStateFiledTax: {
        required: requiredIf(function () {
          return this.isTaxFiledLastYear;
        }),
      },
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
  methods: {
    handleIsFiledTaxLastYearChange(val) {
      this.form.isFiledTaxLastYear = val;
      if (val.value !== EnumNameTypes.Yes) {
        this.form.selectStateFiledTax = null;
      }
    },
  },
};
</script>

<style scoped></style>

<template>
  <!-- employment changes -->
  <section id="veteran" data-cy="arizona-residency-veteran">
    <div class="row">
      <!-- selectService -->
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-select-service"
          id="group-selectService"
          :aria-label="content.selectService.label"
          class="mb-space-md"
          label-class="pb-0"
          label-for="selectService"
        >
          <template #label>
            <label
              :for="`select-state-${content.selectService.psKey}`"
              class="font-weight-bold"
            >
              {{ content.selectService.label }}
            </label>
          </template>
          <base-select
            :id="`select-state-${content.selectService.psKey}`"
            :options="content.selectService.options"
            v-model="$v.form.selectService.$model"
            @change="handleSelectServiceChange"
            :onErrorMsg="validateSelect($v.form.selectService)"
            :placeholderText="`${content.selectService.placeholder}`"
            class="col-lg-5 px-0 col-12"
          ></base-select>
        </b-form-group>
      </div>
      <!-- isEligibleFor30or33ChapterBenefits -->
      <div class="col-12 mt-space-sm" v-if="showChapter30or33">
        <b-form-group
          data-cy="arizona-residency-is-eligible-for-30-or-33-chapter-benefits"
          id="radio_isEligibleFor30or33ChapterBenefits"
          :aria-label="content.isEligibleFor30or33ChapterBenefits.label"
          label-class="pb-0"
          class="mb-space-xs mb-lg-space-md position-relative"
        >
          <template #label>
            <label
              for="isEligibleFor30or33ChapterBenefits_radio"
              class="mb-lg-space-xxs font-weight-bold"
            >
              <span class="my-auto">
                {{ content.isEligibleFor30or33ChapterBenefits.label }}</span
              >
            </label>
          </template>
          <base-radio-group
            name="employment_radio_isEligibleFor30or33ChapterBenefits"
            id="isEligibleFor30or33ChapterBenefits_radio"
            :options="content.isEligibleFor30or33ChapterBenefits.options"
            v-model="$v.form.isEligibleFor30or33ChapterBenefits.$model"
            :class="{
              'is-invalid':
                $v.form.isEligibleFor30or33ChapterBenefits.$dirty &&
                $v.form.isEligibleFor30or33ChapterBenefits.$error,
            }"
          >
          </base-radio-group>
          <!-- Error message -->
          <b-form-invalid-feedback
            v-if="!$v.form.isEligibleFor30or33ChapterBenefits.required"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <!-- dateOfRetirement -->
      <ug-app-month-year-select
        data-cy="arizona-residency-veteran-date-of-retirement"
        v-model="$v.form.dateOfRetirement.$model"
        :content="content.dateOfRetirement"
        :id="content.dateOfRetirement.psKey"
        :onErrorMsg="validateSelect($v.form.dateOfRetirement)"
      ></ug-app-month-year-select>
    </div>
    <slot name="slot-driver-license"></slot>
    <slot name="slot-voter-id"></slot>
  </section>
</template>

<script>
import formHelpers from "@/mixins/form-helpers";
import { validationMixin } from "vuelidate";
import { required, requiredIf } from "vuelidate/lib/validators";
import { BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import UgAppMonthYearSelect from "@/components/ugapp-components/UgAppMonthYearSelect.vue";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import { mapState } from "pinia";
export default {
  name: "SectionVeteran",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        selectService: null,
        isEligibleFor30or33ChapterBenefits: null,
        dateOfRetirement: null,
      },
    };
  },
  computed: {
    ...mapState(useUgApplicationStore, ["sectionVeteran"]),
    showChapter30or33() {
      return this.form.selectService && this.form.selectService?.value !== "H";
    },
  },
  created() {
    this.form.selectService = this.sectionVeteran.selectService;
    this.form.isEligibleFor30or33ChapterBenefits =
      this.sectionVeteran.isEligibleFor30or33ChapterBenefits;
    this.form.dateOfRetirement = this.sectionVeteran.dateOfRetirement;
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
    "ug-app-month-year-select": UgAppMonthYearSelect,
    "base-radio-group": BaseRadioGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-group": BFormGroup,
    "base-select": BaseSelect,
  },
  methods: {
    handleSelectServiceChange(val) {
      if (val.value === "H") {
        this.form.isEligibleFor30or33ChapterBenefits = null;
      }
    },
  },
  validations: {
    form: {
      selectService: {
        required,
      },
      isEligibleFor30or33ChapterBenefits: {
        required: requiredIf(function () {
          return this.showChapter30or33;
        }),
      },
      dateOfRetirement: {
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

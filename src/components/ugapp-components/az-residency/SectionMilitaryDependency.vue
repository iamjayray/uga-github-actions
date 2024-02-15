<template>
  <section
    id="military_dependency"
    data-cy="arizona-residency-military-dependency"
  >
    <div class="row">
      <!-- selectSectorOfMilitary -->
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-select-sector-of-military"
          id="group-selectSectorOfMilitary"
          :aria-label="content.selectSectorOfMilitary.label"
          class="mb-space-md"
          label-class="pb-0"
          label-for="selectSectorOfMilitary"
        >
          <template #label>
            <label
              for="`select-state-${content.selectSectorOfMilitary.psKey}`"
              class="font-weight-bold"
            >
              {{ content.selectSectorOfMilitary.label }}
            </label>
          </template>
          <base-select
            :id="`select-state-${content.selectSectorOfMilitary.psKey}`"
            :options="content.selectSectorOfMilitary.options"
            @change="handleSelectSectorOfMilitaryChange"
            v-model="$v.form.selectSectorOfMilitary.$model"
            :onErrorMsg="validateSelect($v.form.selectSectorOfMilitary)"
            :placeholderText="`${content.selectSectorOfMilitary.placeholder}`"
            class="col-lg-5 px-0 col-12"
          ></base-select>
        </b-form-group>
      </div>

      <template v-if="isVeteran">
        <!-- veteran dependency -->
        <div class="col-12" data-cy="arizona-residency-veteran-dependency">
          <slot name="slot-voter-id"></slot>

          <slot name="slot-driver-license"></slot>
        </div>
        <!-- dateGuardianRetired -->
        <ug-app-month-year-select
          data-cy="arizona-residency-military-dependency-date-guardian-retaired"
          v-model="$v.form.dateGuardianRetired.$model"
          :content="content.dateGuardianRetired"
          :id="content.dateGuardianRetired.psKey"
          :onErrorMsg="validateSelect($v.form.dateGuardianRetired)"
        ></ug-app-month-year-select>
        <!-- isEligibleFor30or33ChapterBenefits -->
        <div class="col-12 mt-space-sm">
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
      </template>
      <!-- show below section of the student is not a veteran dependent -->
      <template v-if="isNotVeteran">
        <!-- selectStateGuardianStationed  shown only -->
        <div class="col-12 mt-space-sm">
          <b-form-group
            data-cy="arizona-residency-select-state-guardian-stationed"
            id="group-selectStateGuardianStationed"
            :aria-label="content.selectStateGuardianStationed.label"
            class="mb-space-md"
            label-class="pb-0"
            label-for="selectStateGuardianStationed"
          >
            <template #label>
              <label
                :for="`select-state-${content.selectStateGuardianStationed.psKey}`"
                class="font-weight-bold"
              >
                {{ content.selectStateGuardianStationed.label }}
              </label>
            </template>
            <base-select
              :id="`select-state-${content.selectStateGuardianStationed.psKey}`"
              :options="allUsStates"
              v-model="$v.form.selectStateGuardianStationed.$model"
              :onErrorMsg="validateSelect($v.form.selectStateGuardianStationed)"
              :placeholderText="`${content.selectStateGuardianStationed.placeholder}`"
              class="col-lg-5 px-0 col-12"
            ></base-select>
          </b-form-group>
        </div>
        <!-- selectStateGuardianLegalResidence -->
        <div class="col-12 mt-space-sm" v-if="isNotAZresident">
          <b-form-group
            data-cy="arizona-residency-select-state-guardian-legal-residence"
            id="group-selectStateGuardianLegalResidence"
            :aria-label="content.selectStateGuardianLegalResidence.label"
            class="mb-space-md"
            label-class="pb-0"
            label-for="selectStateGuardianLegalResidence"
          >
            <template #label>
              <label
                for="`select-state-${content.selectStateGuardianLegalResidence.psKey}`"
                class="font-weight-bold"
              >
                {{ content.selectStateGuardianLegalResidence.label }}
              </label>
            </template>
            <base-select
              :id="`select-state-${content.selectStateGuardianLegalResidence.psKey}`"
              :options="allUsStates"
              v-model="$v.form.selectStateGuardianLegalResidence.$model"
              :onErrorMsg="
                validateSelect($v.form.selectStateGuardianLegalResidence)
              "
              :placeholderText="`${content.selectStateGuardianLegalResidence.placeholder}`"
              class="col-lg-5 px-0 col-12"
            ></base-select>
          </b-form-group>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import formHelpers from "@/mixins/form-helpers";
import { BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import UgAppMonthYearSelect from "@/components/ugapp-components/UgAppMonthYearSelect.vue";
import { validationMixin } from "vuelidate";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import { mapState } from "pinia";

import { required, requiredIf } from "vuelidate/lib/validators";
export default {
  name: "SectionMilitaryDependency",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        selectSectorOfMilitary: null,
        selectStateGuardianStationed: null,
        selectStateGuardianLegalResidence: null,
        dateGuardianRetired: null,
        isEligibleFor30or33ChapterBenefits: null,
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
    sectionVoterIdInfo: {
      type: Object,
      default: () => {},
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
  computed: {
    ...mapState(useUgApplicationStore, ["sectionMilitaryDependency"]),
    isVeteran() {
      return (
        this.form.selectSectorOfMilitary &&
        this.form?.selectSectorOfMilitary?.value === "veteran"
      );
    },
    isNotAZresident() {
      return (
        this.form.selectStateGuardianStationed &&
        this.form.selectStateGuardianStationed?.value !== "AZ"
      );
    },
    isNotVeteran() {
      return (
        this.form.selectSectorOfMilitary &&
        // TODO: Make this an ENUM logic
        ["active", "reserve", "guard"].includes(
          this.form?.selectSectorOfMilitary?.value
        )
      );
    },
  },
  created() {
    this.form.selectSectorOfMilitary =
      this.sectionMilitaryDependency?.selectSectorOfMilitary;
    this.form.selectStateGuardianLegalResidence =
      this.sectionMilitaryDependency?.selectStateGuardianLegalResidence;
    this.form.selectStateGuardianStationed =
      this.sectionMilitaryDependency?.selectStateGuardianStationed;
    this.form.dateGuardianRetired =
      this.sectionMilitaryDependency?.dateGuardianRetired;
    this.form.isEligibleFor30or33ChapterBenefits =
      this.sectionMilitaryDependency?.isEligibleFor30or33ChapterBenefits;
  },
  components: {
    "ug-app-month-year-select": UgAppMonthYearSelect,
    "base-radio-group": BaseRadioGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-group": BFormGroup,
    "base-select": BaseSelect,
  },
  methods: {
    handleSelectSectorOfMilitaryChange(val) {
      if (val.value === "veteran") {
        this.form.selectStateGuardianStationed = null;
        this.form.selectStateGuardianLegalResidence = null;
      } else {
        this.form.dateGuardianRetired = null;
        this.form.isEligibleFor30or33ChapterBenefits = null;
      }
    },
  },
  validations: {
    form: {
      selectSectorOfMilitary: {
        required,
      },
      selectStateGuardianStationed: {
        required: requiredIf(function () {
          return this.isNotVeteran;
        }),
      },
      selectStateGuardianLegalResidence: {
        required: requiredIf(function () {
          return this.isNotVeteran && this.isNotAZresident;
        }),
      },
      dateGuardianRetired: {
        required: requiredIf(function () {
          return this.form?.selectSectorOfMilitary?.value === "veteran";
        }),
      },
      isEligibleFor30or33ChapterBenefits: {
        required: requiredIf(function () {
          return this.form?.selectSectorOfMilitary?.value === "veteran";
        }),
      },
    },
  },
  mounted() {
    this.$emit("isFormInvalid", this.$v.$invalid);
  },
};
</script>

<style scoped></style>

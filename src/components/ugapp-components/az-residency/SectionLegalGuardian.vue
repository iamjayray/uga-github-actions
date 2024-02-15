<template>
  <!-- employment changes -->
  <section id="legal_guardian" data-cy="arizona-residency-legal-guardian">
    <div class="row">
      <!-- stateParentLives -->
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-group-state-parent-lives"
          id="group-stateParentLives"
          :aria-label="content.stateParentLives.label"
          class="mb-space-md"
          label-class="pb-0"
          label-for="select-stateParentLives"
        >
          <template #label>
            <label
              :for="`select-state-${content.stateParentLives.psKey}`"
              class="font-weight-bold"
            >
              {{ content.stateParentLives.label }}
            </label>
          </template>
          <base-select
            :id="`select-state-${content.stateParentLives.psKey}`"
            :options="allUsStates"
            :content="content.stateParentLives"
            @change="handleStateParentLives"
            v-model="$v.form.stateParentLives.$model"
            :onErrorMsg="validateSelect($v.form.stateParentLives)"
            :placeholderText="`${content.stateParentLives.placeholder}`"
            class="col-lg-5 px-0 col-12"
          ></base-select>
        </b-form-group>
      </div>
      <template v-if="isAzResident">
        <!-- select parent relation staying -->
        <div class="col-12 mt-space-sm">
          <b-form-group
            data-cy="arizona-residency-group-select-parent-relationship"
            id="group-selectParentRelationship"
            :aria-label="content.selectParentRelationship.label"
            class="mb-space-md"
            label-class="pb-0"
            label-for="selectParentRelationship"
          >
            <template #label>
              <label
                for="`select-state-${content.selectParentRelationship.psKey}`"
                class="font-weight-bold"
              >
                {{ content.selectParentRelationship.label }}
              </label>
            </template>
            <base-select
              :id="`select-state-${content.selectParentRelationship.psKey}`"
              :options="content.selectParentRelationship.options"
              v-model="$v.form.selectParentRelationship.$model"
              :onErrorMsg="validateSelect($v.form.selectParentRelationship)"
              :placeholderText="`${content.selectParentRelationship.placeholder}`"
              class="col-lg-5 px-0 col-12"
            ></base-select>
          </b-form-group>
        </div>
        <!-- dateParentMovedToAz -->
        <ug-app-month-year-select
          data-cy="arizona-residency-legal-guardian-date-parent-moved-to-az"
          v-model="$v.form.dateParentMovedToAz.$model"
          :content="content.dateParentMovedToAz"
          :id="content.dateParentMovedToAz.psKey"
          :onErrorMsg="validateSelect($v.form.dateParentMovedToAz)"
        ></ug-app-month-year-select>
        <!-- isParentFiledTaxLastYear -->
        <div class="col-12 mt-space-sm">
          <b-form-group
            data-cy="arizona-residency-group-is-parent-filed-tax-last-year"
            id="radio_isParentFiledTaxLastYear"
            :aria-label="formatContent(content.isParentFiledTaxLastYear.label)"
            label-class="pb-0"
            class="mb-space-xs mb-lg-space-md position-relative"
          >
            <template #label>
              <label
                for="isParentFiledTaxLastYear_radio"
                class="mb-lg-space-xxs font-weight-bold"
              >
                <span class="my-auto">
                  {{
                    formatContent(content.isParentFiledTaxLastYear.label)
                  }}</span
                >
              </label>
            </template>
            <base-radio-group
              name="radio_isParentFiledTaxLastYear"
              id="isParentFiledTaxLastYear_radio"
              :options="content.isParentFiledTaxLastYear.options"
              v-model="$v.form.isParentFiledTaxLastYear.$model"
              :class="{
                'is-invalid':
                  $v.form.isParentFiledTaxLastYear.$dirty &&
                  $v.form.isParentFiledTaxLastYear.$error,
              }"
            >
            </base-radio-group>
            <!-- Error message -->
            <b-form-invalid-feedback
              v-if="!$v.form.isParentFiledTaxLastYear.required"
            >
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation"
                size="xs"
              />
              This is a required field.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <!-- selectStateParentFiledTax -->
        <div class="col-12 mt-space-sm" v-if="hasParentsFiledTax">
          <b-form-group
            data-cy="arizona-residency-group-select-state-parent-filed-tax"
            id="group-selectStateParentFiledTax"
            :aria-label="content.selectStateParentFiledTax.label"
            class="mb-space-md"
            label-class="pb-0"
            label-for="selectStateParentFiledTax"
          >
            <template #label>
              <label
                :for="`select-state-${content.selectStateParentFiledTax.psKey}`"
                class="font-weight-bold"
              >
                {{ content.selectStateParentFiledTax.label }}
              </label>
            </template>
            <base-select
              :id="`select-state-${content.selectStateParentFiledTax.psKey}`"
              :options="allUsStates"
              v-model="$v.form.selectStateParentFiledTax.$model"
              :onErrorMsg="validateSelect($v.form.selectStateParentFiledTax)"
              :placeholderText="`${content.selectStateParentFiledTax.placeholder}`"
              class="col-lg-5 px-0 col-12"
            ></base-select>
          </b-form-group>
        </div>
        <!-- isParentHavingLicenseInAz -->
        <div class="col-12 mt-space-sm">
          <b-form-group
            data-cy="arizona-residency-is-parent-having-license-in-az"
            id="radio_isParentHavingLicenseInAz"
            :aria-label="content.isParentHavingLicenseInAz.label"
            label-class="pb-0"
            class="mb-space-xs mb-lg-space-md position-relative"
          >
            <template #label>
              <label
                for="isParentHavingLicenseInAz_radio"
                class="mb-lg-space-xxs font-weight-bold"
              >
                <span class="my-auto">
                  {{ content.isParentHavingLicenseInAz.label }}</span
                >
              </label>
            </template>
            <base-radio-group
              name="employment_radio_isParentHavingLicenseInAz"
              id="isParentHavingLicenseInAz_radio"
              :options="content.isParentHavingLicenseInAz.options"
              v-model="$v.form.isParentHavingLicenseInAz.$model"
              :class="{
                'is-invalid':
                  $v.form.isParentHavingLicenseInAz.$dirty &&
                  $v.form.isParentHavingLicenseInAz.$error,
              }"
            >
            </base-radio-group>
            <!-- Error message -->
            <b-form-invalid-feedback
              v-if="!$v.form.isParentHavingLicenseInAz.required"
            >
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation"
                size="xs"
              />
              This is a required field.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <!-- isParentEmployedInAz -->
        <div class="col-12 mt-space-sm">
          <b-form-group
            data-cy="arizona-residency-is-parent-employed-in-az"
            id="radio_isParentEmployedInAz"
            :aria-label="content.isParentEmployedInAz.label"
            label-class="pb-0"
            class="mb-space-xs mb-lg-space-md position-relative"
          >
            <template #label>
              <label
                for="isParentEmployedInAz_radio"
                class="mb-lg-space-xxs font-weight-bold"
              >
                <span class="my-auto">
                  {{ content.isParentEmployedInAz.label }}</span
                >
              </label>
            </template>
            <base-radio-group
              name="employment_radio_isParentEmployedInAz"
              id="isParentEmployedInAz_radio"
              :options="content.isParentEmployedInAz.options"
              v-model="$v.form.isParentEmployedInAz.$model"
              :class="{
                'is-invalid':
                  $v.form.isParentEmployedInAz.$dirty &&
                  $v.form.isParentEmployedInAz.$error,
              }"
            >
            </base-radio-group>
            <!-- Error message -->
            <b-form-invalid-feedback
              v-if="!$v.form.isParentEmployedInAz.required"
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
    </div>
  </section>
</template>

<script>
import { BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import UgAppMonthYearSelect from "@/components/ugapp-components/UgAppMonthYearSelect.vue";
import { EnumNameTypes } from "@/content/enum-ug-application";
import formHelpers from "@/mixins/form-helpers";
import { validationMixin } from "vuelidate";
import { required, requiredIf } from "vuelidate/lib/validators";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import { mapState } from "pinia";

export default {
  name: "SectionLegalGuardian",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        stateParentLives: null,
        selectParentRelationship: null,
        dateParentMovedToAz: null,
        isParentFiledTaxLastYear: null,
        selectStateParentFiledTax: null,
        isParentHavingLicenseInAz: null,
        isParentEmployedInAz: null,
      },
    };
  },
  computed: {
    ...mapState(useUgApplicationStore, ["sectionLegalGuardian"]),
    isAzResident() {
      return this.form.stateParentLives?.value === EnumNameTypes.AzStateCode;
    },
    hasParentsFiledTax() {
      return this.form.isParentFiledTaxLastYear?.value === EnumNameTypes.Yes;
    },
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
    handleStateParentLives(val) {
      // reset the values if the user changes the parent's state as we should not send the other stuff.
      if (val?.value !== EnumNameTypes.AzStateCode) {
        this.form.selectParentRelationship = null;
        this.form.dateParentMovedToAz = null;
        this.form.isParentFiledTaxLastYear = null;
        this.form.selectStateParentFiledTax = null;
        this.form.isParentHavingLicenseInAz = null;
        this.form.isParentEmployedInAz = null;
      }
    },
  },
  created() {
    this.form.stateParentLives = this.sectionLegalGuardian.stateParentLives;
    this.form.selectParentRelationship =
      this.sectionLegalGuardian.selectParentRelationship;
    this.form.dateParentMovedToAz =
      this.sectionLegalGuardian.dateParentMovedToAz;
    this.form.isParentFiledTaxLastYear =
      this.sectionLegalGuardian.isParentFiledTaxLastYear;
    this.form.selectStateParentFiledTax =
      this.sectionLegalGuardian.selectStateParentFiledTax;
    this.form.isParentHavingLicenseInAz =
      this.sectionLegalGuardian.isParentHavingLicenseInAz;
    this.form.isParentEmployedInAz =
      this.sectionLegalGuardian.isParentEmployedInAz;
  },
  validations: {
    form: {
      stateParentLives: {
        required,
      },
      selectParentRelationship: {
        required: requiredIf(function () {
          return this.isAzResident;
        }),
      },
      dateParentMovedToAz: {
        required: requiredIf(function () {
          return this.isAzResident;
        }),
      },
      isParentFiledTaxLastYear: {
        required: requiredIf(function () {
          return this.isAzResident;
        }),
      },
      selectStateParentFiledTax: {
        required: requiredIf(function () {
          return this.isAzResident && this.hasParentsFiledTax;
        }),
      },
      isParentHavingLicenseInAz: {
        required: requiredIf(function () {
          return this.isAzResident;
        }),
      },
      isParentEmployedInAz: {
        required: requiredIf(function () {
          return this.isAzResident;
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

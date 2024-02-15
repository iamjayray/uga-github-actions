<template>
  <div class="driver-license" data-cy="arizona-residency-driver-license">
    <!-- Do you have a current driver’s license or state issued ID? -->
    <div class="col-12 mt-space-sm p-0">
      <b-form-group
        data-cy="arizona-residency-is-having-license"
        id="radio_isHavingLicense"
        :aria-label="formatContent(content.isHavingLicense.label)"
        label-class="pb-0"
        class="mb-space-xs mb-lg-space-md position-relative"
      >
        <template #label>
          <label
            for="isHavingLicense_radio"
            class="mb-lg-space-xxs font-weight-bold"
          >
            <span class="my-auto">
              {{ formatContent(content.isHavingLicense.label) }}</span
            >
          </label>
        </template>
        <base-radio-group
          name="isHavingLicense"
          :options="content.isHavingLicense.options"
          @change="handleIsHavingLicenseChange"
          v-model="$v.form.isHavingLicense.$model"
          :class="{
            'is-invalid':
              $v.form.isHavingLicense.$dirty && $v.form.isHavingLicense.$error,
          }"
        >
        </base-radio-group>
        <!-- Error message -->
        <b-form-invalid-feedback v-if="!$v.form.isHavingLicense.required">
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <!-- Which state issued your driver’s license or state ID? -->
    <div class="col-12 mt-space-sm p-0" v-if="isLicensed">
      <b-form-group
        data-cy="arizona-residency-group-select-state-license-issued"
        id="group-selectStateLicenseIssued"
        :aria-label="content.selectStateLicenseIssued.label"
        class="mb-space-md"
        label-class="pb-0"
        label-for="state_selectStateLicenseIssued"
      >
        <template #label>
          <label for="state_selectStateLicenseIssued" class="font-weight-bold">
            {{ content.selectStateLicenseIssued.label }}
          </label>
        </template>
        <base-select
          :id="`select-state-${content.selectStateLicenseIssued.psKey}`"
          :options="allUsStates"
          v-model="$v.form.selectStateLicenseIssued.$model"
          :onErrorMsg="validateSelect($v.form.selectStateLicenseIssued)"
          placeholderText="Select a state"
          @change="handleSelectStateLicenseIssuedChange"
          class="col-lg-5 px-0 col-12"
        ></base-select>
      </b-form-group>
    </div>
    <!-- When was your Arizona driver’s license or ID first issued? -->
    <ug-app-month-year-select
      data-cy="arizona-residency-driver-license-issued-date"
      v-if="isAZDriver"
      class="p-0"
      v-model="$v.form.dateLicenseIssued.$model"
      :content="content.dateLicenseIssued"
      :id="content.dateLicenseIssued.psKey"
      :onErrorMsg="validateSelect($v.form.dateLicenseIssued)"
    ></ug-app-month-year-select>
  </div>
</template>

<script>
import formHelpers from "@/mixins/form-helpers";
import { BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import UgAppMonthYearSelect from "@/components/ugapp-components/UgAppMonthYearSelect.vue";

import { mapState } from "pinia";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { EnumNameTypes } from "@/content/enum-ug-application.js";
import { validationMixin } from "vuelidate";
import { required, requiredIf } from "vuelidate/lib/validators";
export default {
  name: "SectionDriverLicense",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        isHavingLicense: null,
        selectStateLicenseIssued: null,
        dateLicenseIssued: null,
      },
    };
  },
  components: {
    "ug-app-month-year-select": UgAppMonthYearSelect,
    "base-radio-group": BaseRadioGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-group": BFormGroup,
    "base-select": BaseSelect,
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
  validations: {
    form: {
      isHavingLicense: {
        required,
      },
      selectStateLicenseIssued: {
        required: requiredIf(function () {
          return this.isLicensed;
        }),
      },
      dateLicenseIssued: {
        required: requiredIf(function () {
          return this.isAZDriver;
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
  computed: {
    ...mapState(useUgApplicationStore, {
      sectionDriverLicense: "sectionDriverLicense",
    }),
    isLicensed() {
      return this.form.isHavingLicense?.value === EnumNameTypes.Yes;
    },
    isAZDriver() {
      return (
        this.form.selectStateLicenseIssued?.value ===
          EnumNameTypes.AzStateCode && this.isLicensed
      );
    },
  },
  created() {
    this.form.isHavingLicense = this.sectionDriverLicense?.isHavingLicense;
    this.form.selectStateLicenseIssued =
      this.sectionDriverLicense?.selectStateLicenseIssued;
    this.form.dateLicenseIssued = this.sectionDriverLicense?.dateLicenseIssued;
  },
  methods: {
    resetForm() {
      this.form.isHavingLicense = null;
      this.form.selectStateLicenseIssued = null;
      this.form.dateLicenseIssued = null;
    },
    handleIsHavingLicenseChange(val) {
      if (val.value === EnumNameTypes.No) {
        this.form.selectStateLicenseIssued = null;
        this.form.dateLicenseIssued = null;
      }
    },
    handleSelectStateLicenseIssuedChange(val) {
      if (val.value !== EnumNameTypes.AzStateCode) {
        this.form.dateLicenseIssued = null;
      }
    },
  },
  mounted() {
    this.$emit("isFormInvalid", this.$v.$invalid);
  },
};
</script>

<style scoped></style>

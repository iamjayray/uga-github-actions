<template>
  <!-- employment changes -->
  <section id="employment" data-cy="arizona-residency-employment-changes">
    <div class="row">
      <!-- Are you currently employed? -->
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-is-employed"
          id="radio_isEmployed"
          :aria-label="content.isEmployed.label"
          label-class="pb-0"
          class="mb-space-xs mb-lg-space-md position-relative"
        >
          <template #label>
            <label
              for="isEmployed_radio"
              class="mb-lg-space-xxs font-weight-bold"
            >
              <span class="my-auto"> {{ content.isEmployed.label }}</span>
            </label>
          </template>
          <base-radio-group
            name="employment_radio_isEmployed"
            id="isEmployed_radio"
            @change="handleIsEmployedChange"
            :options="content.isEmployed.options"
            v-model="$v.form.isEmployed.$model"
            :class="{
              'is-invalid':
                $v.form.isEmployed.$dirty && $v.form.isEmployed.$error,
            }"
          >
          </base-radio-group>
          <!-- Error message -->
          <b-form-invalid-feedback v-if="!$v.form.isEmployed.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <!-- if is employed is true -->
      <template v-if="isEmployed">
        <!-- Where is your primary work location? -->
        <div class="col-12 mt-space-sm">
          <b-form-group
            data-cy="arizona-residency-group-select-state-employed"
            id="group-selectStateEmployed"
            :aria-label="content.selectStateEmployed.label"
            class="mb-space-md"
            label-class="pb-0"
            label-for="state_selectStateEmployed"
          >
            <template #label>
              <label
                for="`select-state-${content.selectStateEmployed.psKey}`"
                class="font-weight-bold"
              >
                {{ content.selectStateEmployed.label }}
              </label>
            </template>
            <base-select
              :id="`select-state-${content.selectStateEmployed.psKey}`"
              :options="allUsStates"
              @change="handleSelectStateEmployedChange"
              v-model="$v.form.selectStateEmployed.$model"
              :onErrorMsg="validateSelect($v.form.selectStateEmployed)"
              :placeholderText="`${content.selectStateEmployed.placeholder}`"
              class="col-lg-5 px-0 col-12"
            ></base-select>
          </b-form-group>
        </div>
        <!-- When did you start working? -->
        <ug-app-month-year-select
          data-cy="arizona-residency-employed-date"
          v-model="$v.form.dateEmployed.$model"
          v-if="isEmployedInAz"
          :content="content.dateEmployed"
          :id="content.dateEmployed.psKey"
          :onErrorMsg="validateSelect($v.form.dateEmployed)"
        ></ug-app-month-year-select>
      </template>
      <template v-if="notEmployed">
        <!-- Were you employed in the last 12 months? -->
        <div class="col-12 mt-space-sm">
          <b-form-group
            data-cy="arizona-residency-is-employed-in-last-12m"
            id="radio_isEmployedInLast12m"
            :aria-label="content.isEmployedInLast12m.label"
            label-class="pb-0"
            class="mb-space-xs mb-lg-space-md position-relative"
          >
            <template #label>
              <label
                for="isEmployedInLast12m"
                class="mb-lg-space-xxs font-weight-bold"
              >
                <span class="my-auto">
                  {{ content.isEmployedInLast12m.label }}</span
                >
              </label>
            </template>
            <base-radio-group
              name="radio_isEmployedInLast12m"
              id="isEmployedInLast12m"
              @change="handleIsEmployedInLast12mChange"
              :options="content.isEmployedInLast12m.options"
              v-model="$v.form.isEmployedInLast12m.$model"
              :class="{
                'is-invalid':
                  $v.form.isEmployedInLast12m.$dirty &&
                  $v.form.isEmployedInLast12m.$error,
              }"
            >
            </base-radio-group>
            <!-- Error message -->
            <b-form-invalid-feedback
              v-if="!$v.form.isEmployedInLast12m.required"
            >
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation"
                size="xs"
              />
              This is a required field.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <!-- Where were you employed in the last 12 months? -->
        <div class="col-12 mt-space-sm" v-if="isEmployedInLast12m">
          <b-form-group
            data-cy="arizona-residency-group-select-state-employed-last-12m"
            id="group-selectStateEmployedLast12m"
            :aria-label="content.selectStateEmployedLast12m.label"
            class="mb-space-md"
            label-class="pb-0"
            label-for="state_selectStateEmployedLast12m"
          >
            <template #label>
              <label
                :for="`select-state-${content.selectStateEmployedLast12m.psKey}`"
                class="font-weight-bold"
              >
                {{ content.selectStateEmployedLast12m.label }}
              </label>
            </template>
            <base-select
              :id="`select-state-${content.selectStateEmployedLast12m.psKey}`"
              :options="allUsStates"
              v-model="$v.form.selectStateEmployedLast12m.$model"
              :onErrorMsg="validateSelect($v.form.selectStateEmployedLast12m)"
              :placeholderText="`${content.selectStateEmployedLast12m.placeholder}`"
              class="col-lg-5 px-0 col-12"
            ></base-select>
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
import { mapState } from "pinia";
import { useUgApplicationStore } from "../../../stores/ug-application-store";
export default {
  name: "SectionEmployment",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        isEmployed: null,
        selectStateEmployed: null,
        dateEmployed: null,
        isEmployedInLast12m: null,
        selectStateEmployedLast12m: null,
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
  methods: {
    handleIsEmployedChange(val) {
      if (val?.value === EnumNameTypes.No) {
        this.form.selectStateEmployed = null;
        this.form.dateEmployed = null;
        this.form.isEmployedInLast12m = null;
        this.form.selectStateEmployedLast12m = null;
      }
    },
    handleSelectStateEmployedChange(val) {
      if (val?.value !== EnumNameTypes.AzStateCode) {
        this.form.dateEmployed = null;
      }
    },
    handleIsEmployedInLast12mChange(val) {
      if (val?.value === EnumNameTypes.No) {
        this.form.selectStateEmployedLast12m = null;
      }
    },
  },
  computed: {
    ...mapState(useUgApplicationStore, ["sectionEmployment"]),
    isEmployed() {
      return this.form.isEmployed?.value === EnumNameTypes.Yes;
    },
    isEmployedInAz() {
      return this.form.selectStateEmployed?.value === EnumNameTypes.AzStateCode;
    },
    notEmployed() {
      return this.form.isEmployed?.value === EnumNameTypes.No;
    },
    isEmployedInLast12m() {
      return this.form.isEmployedInLast12m?.value === EnumNameTypes.Yes;
    },
  },
  components: {
    "ug-app-month-year-select": UgAppMonthYearSelect,
    "base-radio-group": BaseRadioGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-group": BFormGroup,
    "base-select": BaseSelect,
  },
  created() {
    this.form.isEmployed = this.sectionEmployment?.isEmployed;
    this.form.selectStateEmployed = this.sectionEmployment?.selectStateEmployed;
    this.form.dateEmployed = this.sectionEmployment?.dateEmployed;
    this.form.isEmployedInLast12m = this.sectionEmployment?.isEmployedInLast12m;
    this.form.selectStateEmployedLast12m =
      this.sectionEmployment?.selectStateEmployedLast12m;
  },
  validations: {
    form: {
      isEmployed: {
        required: required,
      },
      selectStateEmployed: {
        required: requiredIf(function () {
          return this.isEmployed;
        }),
      },
      dateEmployed: {
        required: requiredIf(function () {
          return this.isEmployed && this.isEmployedInAz;
        }),
      },
      isEmployedInLast12m: {
        required: requiredIf(function () {
          return this.notEmployed;
        }),
      },
      selectStateEmployedLast12m: {
        required: requiredIf(function () {
          return this.notEmployed && this.isEmployedInLast12m;
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

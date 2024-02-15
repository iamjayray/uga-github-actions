<template>
  <!-- employment changes -->
  <section id="sectionMarried" data-cy="arizona-residency-section-married">
    <div class="row">
      <!-- isMarried -->
      <div class="col-12 mt-space-sm" v-if="!hasSpousalSupport">
        <b-form-group
          data-cy="arizona-residency-is-married"
          id="radio_isMarried"
          :aria-label="content.isMarried.label"
          label-class="pb-0"
          class="mb-space-xs mb-lg-space-md position-relative"
        >
          <template #label>
            <label
              for="isMarried_radio"
              class="mb-lg-space-xxs font-weight-bold"
            >
              <span class="my-auto"> {{ content.isMarried.label }}</span>
            </label>
          </template>
          <base-radio-group
            name="employment_radio_isMarried"
            id="isMarried_radio"
            @change="handleIsMarriedChange"
            :options="content.isMarried.options"
            v-model="$v.form.isMarried.$model"
            :class="{
              'is-invalid':
                $v.form.isMarried.$dirty && $v.form.isMarried.$error,
            }"
          >
            {{ content.isMarried.options }}
          </base-radio-group>
          <!-- Error message -->
          <b-form-invalid-feedback v-if="!$v.form.isMarried.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <template v-if="isMarried">
        <div class="col-12 mt-space-sm">
          <b-form-group
            data-cy="arizona-residency-is-married-state-spouse-lives"
            id="group-selectStateSpouseLives"
            :aria-label="content.selectStateSpouseLives.label"
            class="mb-space-md"
            label-class="pb-0"
            label-for="select-state-spouse-lives"
          >
            <template #label>
              <label
                :for="`select-state-${content.selectStateSpouseLives.psKey}`"
                class="font-weight-bold"
              >
                {{ content.selectStateSpouseLives.label }}
              </label>
            </template>
            <base-select
              :id="`select-state-${content.selectStateSpouseLives.psKey}`"
              :options="allUsStates"
              v-model="$v.form.selectStateSpouseLives.$model"
              :onErrorMsg="validateSelect($v.form.selectStateSpouseLives)"
              :placeholderText="`${content.selectStateSpouseLives.placeholder}`"
              class="col-lg-5 px-0 col-12"
            ></base-select>
          </b-form-group>
        </div>
        <!-- dateSpouseMovedToAz -->
        <template v-if="isSpouseLivesInAZ">
          <ug-app-month-year-select
            data-cy="arizona-residency-is-married-date-spouse-moved-to-az"
            v-model="$v.form.dateSpouseMovedToAz.$model"
            :content="content.dateSpouseMovedToAz"
            :id="content.dateSpouseMovedToAz.psKey"
            :onErrorMsg="validateSelect($v.form.dateSpouseMovedToAz)"
          ></ug-app-month-year-select>
          <!-- isSpouseHavingValidId -->
          <div class="col-12 mt-space-sm">
            <b-form-group
              data-cy="arizona-residency-is-married-spouse-has-valid-id"
              id="radio_isSpouseHavingValidId"
              :aria-label="content.isSpouseHavingValidId.label"
              label-class="pb-0"
              class="mb-space-xs mb-lg-space-md position-relative"
            >
              <template #label>
                <label
                  for="isSpouseHavingValidId_radio"
                  class="mb-lg-space-xxs font-weight-bold"
                >
                  <span class="my-auto">
                    {{ content.isSpouseHavingValidId.label }}</span
                  >
                </label>
              </template>
              <base-radio-group
                name="employment_radio_isSpouseHavingValidId"
                id="isSpouseHavingValidId_radio"
                :options="content.isSpouseHavingValidId.options"
                v-model="$v.form.isSpouseHavingValidId.$model"
                :class="{
                  'is-invalid':
                    $v.form.isSpouseHavingValidId.$dirty &&
                    $v.form.isSpouseHavingValidId.$error,
                }"
              >
              </base-radio-group>
              <!-- Error message -->
              <b-form-invalid-feedback
                v-if="!$v.form.isSpouseHavingValidId.required"
              >
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                This is a required field.
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
          <template v-if="spouseHasValidId">
            <!-- selectStateValidIdIssued -->
            <div class="col-12 mt-space-sm">
              <b-form-group
                data-cy="arizona-residency-is-married-state-issued-id"
                id="group-selectStateValidIdIssued"
                :aria-label="content.selectStateValidIdIssued.label"
                class="mb-space-md"
                label-class="pb-0"
                label-for="select-state-valid-id-issued"
              >
                <template #label>
                  <label
                    :for="`select-state-${content.selectStateValidIdIssued.psKey}`"
                    class="font-weight-bold"
                  >
                    {{ content.selectStateValidIdIssued.label }}
                  </label>
                </template>
                <base-select
                  :id="`select-state-${content.selectStateValidIdIssued.psKey}`"
                  :options="allUsStates"
                  v-model="$v.form.selectStateValidIdIssued.$model"
                  :onErrorMsg="validateSelect($v.form.selectStateValidIdIssued)"
                  :placeholderText="`${content.selectStateValidIdIssued.placeholder}`"
                  class="col-lg-5 px-0 col-12"
                ></base-select>
              </b-form-group>
            </div>
            <!-- dateSpouseObtainedId -->
            <template v-if="spouseHasValidIdInAZ">
              <ug-app-month-year-select
                data-cy="arizona-residency-is-married-id-obtained-date"
                v-model="$v.form.dateSpouseObtainedId.$model"
                :content="content.dateSpouseObtainedId"
                :id="content.dateSpouseObtainedId.psKey"
                :onErrorMsg="validateSelect($v.form.dateSpouseObtainedId)"
              ></ug-app-month-year-select>
            </template>
          </template>
          <!-- isSpouseFileTax -->
          <div class="col-12 mt-space-sm">
            <b-form-group
              data-cy="arizona-residency-is-married-spouse-file-taxes"
              id="radio_isSpouseFileTax"
              :aria-label="formatContent(content.isSpouseFileTax.label)"
              label-class="pb-0"
              class="mb-space-xs mb-lg-space-md position-relative"
            >
              <template #label>
                <label
                  for="isSpouseFileTax_radio"
                  class="mb-lg-space-xxs font-weight-bold"
                >
                  <span class="my-auto">
                    {{ formatContent(content.isSpouseFileTax.label) }}</span
                  >
                </label>
              </template>
              <base-radio-group
                name="employment_radio_isSpouseFileTax"
                id="isSpouseFileTax_radio"
                :options="content.isSpouseFileTax.options"
                v-model="$v.form.isSpouseFileTax.$model"
                :class="{
                  'is-invalid':
                    $v.form.isSpouseFileTax.$dirty &&
                    $v.form.isSpouseFileTax.$error,
                }"
              >
              </base-radio-group>
              <!-- Error message -->
              <b-form-invalid-feedback v-if="!$v.form.isSpouseFileTax.required">
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                This is a required field.
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
          <!-- selectStateSpouseFiledTax -->
          <div class="col-12 mt-space-sm" v-if="spousePaysTax">
            <b-form-group
              data-cy="arizona-residency-is-married-state-spouse-file-taxes"
              id="group-selectStateSpouseFiledTax"
              :aria-label="content.selectStateSpouseFiledTax.label"
              class="mb-space-md"
              label-class="pb-0"
              label-for="select-state-spouse-filed-tax"
            >
              <template #label>
                <label
                  :for="`select-state-${content.selectStateSpouseFiledTax.psKey}`"
                  class="font-weight-bold"
                >
                  {{ content.selectStateSpouseFiledTax.label }}
                </label>
              </template>
              <base-select
                :id="`select-state-${content.selectStateSpouseFiledTax.psKey}`"
                :options="allUsStates"
                v-model="$v.form.selectStateSpouseFiledTax.$model"
                :onErrorMsg="validateSelect($v.form.selectStateSpouseFiledTax)"
                :placeholderText="`${content.selectStateSpouseFiledTax.placeholder}`"
                class="col-lg-5 px-0 col-12"
              ></base-select>
            </b-form-group>
          </div>
        </template>
        <!-- isSpouseEmployed -->
        <div class="col-12 mt-space-sm">
          <b-form-group
            data-cy="arizona-residency-is-married-is-spouse-employed"
            id="radio_isSpouseEmployed"
            :aria-label="content.isSpouseEmployed.label"
            label-class="pb-0"
            class="mb-space-xs mb-lg-space-md position-relative"
          >
            <template #label>
              <label
                for="isSpouseEmployed_radio"
                class="mb-lg-space-xxs font-weight-bold"
              >
                <span class="my-auto">
                  {{ content.isSpouseEmployed.label }}</span
                >
              </label>
            </template>
            <base-radio-group
              name="employment_radio_isSpouseEmployed"
              id="isSpouseEmployed_radio"
              :options="content.isSpouseEmployed.options"
              v-model="$v.form.isSpouseEmployed.$model"
              :class="{
                'is-invalid':
                  $v.form.isSpouseEmployed.$dirty &&
                  $v.form.isSpouseEmployed.$error,
              }"
            >
            </base-radio-group>
            <!-- Error message -->
            <b-form-invalid-feedback v-if="!$v.form.isSpouseEmployed.required">
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation"
                size="xs"
              />
              This is a required field.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <template v-if="isSpouseEmployed">
          <!-- selectStateSpouseEmployed -->
          <div class="col-12 mt-space-sm">
            <b-form-group
              data-cy="arizona-residency-is-married-state-spouse-employed"
              id="group-selectStateSpouseEmployed"
              :aria-label="content.selectStateSpouseEmployed.label"
              class="mb-space-md"
              label-class="pb-0"
              label-for="select-state-spouse-employed"
            >
              <template #label>
                <label
                  :for="`select-state-${content.selectStateSpouseEmployed.psKey}`"
                  class="font-weight-bold"
                >
                  {{ content.selectStateSpouseEmployed.label }}
                </label>
              </template>
              <base-select
                :id="`select-state-${content.selectStateSpouseEmployed.psKey}`"
                :options="allUsStates"
                @change="handleSpouseEmployedStateChange"
                v-model="$v.form.selectStateSpouseEmployed.$model"
                :onErrorMsg="validateSelect($v.form.selectStateSpouseEmployed)"
                :placeholderText="`${content.selectStateSpouseEmployed.placeholder}`"
                class="col-lg-5 px-0 col-12"
              ></base-select>
            </b-form-group>
          </div>
          <!-- dateSpouseEmploymentStarted -->
          <ug-app-month-year-select
            v-if="isSpouseEmployedInAZ"
            data-cy="arizona-residency-is-married-date-spouse-employed"
            v-model="$v.form.dateSpouseEmploymentStarted.$model"
            :content="content.dateSpouseEmploymentStarted"
            :id="content.dateSpouseEmploymentStarted.psKey"
            :onErrorMsg="validateSelect($v.form.dateSpouseEmploymentStarted)"
          ></ug-app-month-year-select>
        </template>
        <!-- isSpouseEmployedInAnyUni -->
        <div class="col-12 mt-space-sm">
          <b-form-group
            id="radio_isSpouseEmployedInAnyUni"
            data-cy="arizona-residency-is-married-spouse-employed-in-any-uni"
            :aria-label="content.isSpouseEmployedInAnyUni.label"
            label-class="pb-0"
            class="mb-space-xs mb-lg-space-md position-relative"
          >
            <template #label>
              <label
                for="isSpouseEmployedInAnyUni_radio"
                class="mb-lg-space-xxs font-weight-bold"
              >
                <span class="my-auto">
                  {{ content.isSpouseEmployedInAnyUni.label }}</span
                >
              </label>
            </template>
            <base-radio-group
              name="employment_radio_isSpouseEmployedInAnyUni"
              id="isSpouseEmployedInAnyUni_radio"
              :options="content.isSpouseEmployedInAnyUni.options"
              v-model="$v.form.isSpouseEmployedInAnyUni.$model"
              :class="{
                'is-invalid':
                  $v.form.isSpouseEmployedInAnyUni.$dirty &&
                  $v.form.isSpouseEmployedInAnyUni.$error,
              }"
            >
            </base-radio-group>
            <!-- Error message -->
            <b-form-invalid-feedback
              v-if="!$v.form.isSpouseEmployedInAnyUni.required"
            >
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation"
                size="xs"
              />
              This is a required field.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <!-- isSpouseDependent -->
        <div class="col-12 mt-space-sm">
          <b-form-group
            data-cy="arizona-residency-is-married-spouse-dependent"
            id="radio_isSpouseDependent"
            :aria-label="content.isSpouseDependent.label"
            label-class="pb-0"
            class="mb-space-xs mb-lg-space-md position-relative"
          >
            <template #label>
              <label
                for="isSpouseDependent_radio"
                class="mb-lg-space-xxs font-weight-bold"
              >
                <span class="my-auto">
                  {{ content.isSpouseDependent.label }}</span
                >
              </label>
            </template>
            <base-radio-group
              name="employment_radio_isSpouseDependent"
              id="isSpouseDependent_radio"
              :options="content.isSpouseDependent.options"
              v-model="$v.form.isSpouseDependent.$model"
              :class="{
                'is-invalid':
                  $v.form.isSpouseDependent.$dirty &&
                  $v.form.isSpouseDependent.$error,
              }"
            >
            </base-radio-group>
            <!-- Error message -->
            <b-form-invalid-feedback v-if="!$v.form.isSpouseDependent.required">
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
import formHelpers from "@/mixins/form-helpers";
import { EnumNameTypes } from "@/content/enum-ug-application";
import { BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import UgAppMonthYearSelect from "@/components/ugapp-components/UgAppMonthYearSelect.vue";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import { mapState } from "pinia";
import { validationMixin } from "vuelidate";
import { requiredIf } from "vuelidate/lib/validators";
export default {
  name: "SectionMarried",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        isMarried: null,
        selectStateSpouseLives: null,
        dateSpouseMovedToAz: null,
        isSpouseHavingValidId: null,
        selectStateValidIdIssued: null,
        dateSpouseObtainedId: null,
        isSpouseEmployed: null,
        isSpouseFileTax: null,
        selectStateSpouseFiledTax: null,
        selectStateSpouseEmployed: null,
        dateSpouseEmploymentStarted: null,
        isSpouseEmployedInAnyUni: null,
        isSpouseDependent: null,
      },
    };
  },
  computed: {
    ...mapState(useUgApplicationStore, ["sectionMarried"]),
    isMarried() {
      return (
        this.form.isMarried?.value === EnumNameTypes.Yes ||
        this.hasSpousalSupport
      );
    },
    isSpouseLivesInAZ() {
      return (
        this.form.selectStateSpouseLives?.value === EnumNameTypes.AzStateCode
      );
    },
    spouseHasValidId() {
      return this.form.isSpouseHavingValidId?.value === EnumNameTypes.Yes;
    },
    spouseHasValidIdInAZ() {
      return (
        this.form.selectStateValidIdIssued?.value === EnumNameTypes.AzStateCode
      );
    },
    spousePaysTax() {
      return this.form.isSpouseFileTax?.value === EnumNameTypes.Yes;
    },
    isSpouseEmployed() {
      return this.form.isSpouseEmployed?.value === EnumNameTypes.Yes;
    },
    isSpouseEmployedInAZ() {
      return (
        this.form.selectStateSpouseEmployed?.value === EnumNameTypes.AzStateCode
      );
    },
    isMarriedAndLivesInAZ() {
      return this.isMarried && this.isSpouseLivesInAZ;
    },
    spousalSupportSection() {
      return (
        this.form.isMarried?.value === EnumNameTypes.Yes &&
        this.form.selectStateSpouseLives &&
        this.form.selectStateSpouseLives.value !== EnumNameTypes.AzStateCode
      );
    },
  },
  created() {
    this.form.isMarried = this.sectionMarried?.isMarried;
    this.form.selectStateSpouseLives =
      this.sectionMarried?.selectStateSpouseLives;
    this.form.dateSpouseMovedToAz = this.sectionMarried?.dateSpouseMovedToAz;
    this.form.isSpouseHavingValidId =
      this.sectionMarried?.isSpouseHavingValidId;
    this.form.selectStateValidIdIssued =
      this.sectionMarried?.selectStateValidIdIssued;
    this.form.dateSpouseObtainedId = this.sectionMarried?.dateSpouseObtainedId;
    this.form.isSpouseEmployed = this.sectionMarried?.isSpouseEmployed;
    this.form.selectStateSpouseEmployed =
      this.sectionMarried?.selectStateSpouseEmployed;
    this.form.dateSpouseEmploymentStarted =
      this.sectionMarried?.dateSpouseEmploymentStarted;
    this.form.isSpouseEmployedInAnyUni =
      this.sectionMarried?.isSpouseEmployedInAnyUni;
    this.form.isSpouseDependent = this.sectionMarried?.isSpouseDependent;
    this.form.isSpouseFileTax = this.sectionMarried?.isSpouseFileTax;
    this.form.selectStateSpouseFiledTax =
      this.sectionMarried?.selectStateSpouseFiledTax;
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
    hasSpousalSupport: {
      type: Boolean,
      default: null,
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
    hasSpousalSupport(newValue) {
      if (newValue) {
        // setting the married field to null if spousal support is available
        this.form.isMarried = null;
      }
    },
  },
  components: {
    "ug-app-month-year-select": UgAppMonthYearSelect,
    "base-radio-group": BaseRadioGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-group": BFormGroup,
    "base-select": BaseSelect,
  },

  validations: {
    form: {
      isMarried: {
        required: requiredIf(function () {
          return !this.hasSpousalSupport;
        }),
      },
      selectStateSpouseLives: {
        required: requiredIf(function () {
          return this.isMarried;
        }),
      },
      dateSpouseMovedToAz: {
        required: requiredIf(function () {
          return this.isMarriedAndLivesInAZ;
        }),
      },
      isSpouseHavingValidId: {
        required: requiredIf(function () {
          return this.isMarriedAndLivesInAZ;
        }),
      },
      selectStateValidIdIssued: {
        required: requiredIf(function () {
          return this.isMarriedAndLivesInAZ && this.spouseHasValidId;
        }),
      },
      dateSpouseObtainedId: {
        required: requiredIf(function () {
          return (
            this.isMarriedAndLivesInAZ &&
            this.spouseHasValidId &&
            this.spouseHasValidIdInAZ
          );
        }),
      },
      isSpouseFileTax: {
        required: requiredIf(function () {
          return this.isMarriedAndLivesInAZ;
        }),
      },
      selectStateSpouseFiledTax: {
        required: requiredIf(function () {
          return (
            (this.isMarriedAndLivesInAZ || this.spousalSupport) &&
            this.spousePaysTax
          );
        }),
      },
      isSpouseEmployed: {
        required: requiredIf(function () {
          return this.isMarriedAndLivesInAZ || this.hasSpousalSupport;
        }),
      },
      selectStateSpouseEmployed: {
        required: requiredIf(function () {
          return (
            (this.isMarriedAndLivesInAZ || this.hasSpousalSupport) &&
            this.isSpouseEmployed
          );
        }),
      },
      dateSpouseEmploymentStarted: {
        required: requiredIf(function () {
          return (
            (this.isMarriedAndLivesInAZ || this.hasSpousalSupport) &&
            this.isSpouseEmployed &&
            this.isSpouseEmployedInAZ
          );
        }),
      },
      isSpouseEmployedInAnyUni: {
        required: requiredIf(function () {
          return this.isMarriedAndLivesInAZ || this.hasSpousalSupport;
        }),
      },
      isSpouseDependent: {
        required: requiredIf(function () {
          return this.isMarriedAndLivesInAZ || this.hasSpousalSupport;
        }),
      },
    },
  },
  methods: {
    handleSpouseEmployedStateChange(val) {
      if (val?.value !== EnumNameTypes.AzStateCode) {
        this.form.dateSpouseEmploymentStarted = null;
      }
    },
    handleIsMarriedChange() {
      this.form.selectStateSpouseLives = null;
      this.form.dateSpouseMovedToAz = null;
      this.form.isSpouseHavingValidId = null;
      this.form.selectStateValidIdIssued = null;
      this.form.dateSpouseObtainedId = null;
      this.form.isSpouseEmployed = null;
      this.form.selectStateSpouseEmployed = null;
      this.form.dateSpouseEmploymentStarted = null;
      this.form.isSpouseEmployedInAnyUni = null;
      this.form.isSpouseDependent = null;
    },
    handleSpouseEmployedChange(val) {
      if (val?.value !== EnumNameTypes.Yes) {
        this.form.dateSpouseEmploymentStarted = null;
        this.form.selectStateSpouseEmployed = null;
      }
    },
    resetForm() {
      this.form.isMarried = null;
      this.form.selectStateSpouseLives = null;
      this.form.dateSpouseMovedToAz = null;
      this.form.isSpouseHavingValidId = null;
      this.form.selectStateValidIdIssued = null;
      this.form.dateSpouseObtainedId = null;
      this.form.isSpouseEmployed = null;
      this.form.selectStateSpouseEmployed = null;
      this.form.dateSpouseEmploymentStarted = null;
      this.form.isSpouseEmployedInAnyUni = null;
      this.form.isSpouseDependent = null;
      this.form.isSpouseFileTax = null;
      this.form.selectStateSpouseFiledTax = null;
    },
  },
  mounted() {
    // setting the married field to null if spousal support is available
    if (this.hasSpousalSupport) {
      this.form.isMarried = null;
    }
    this.$emit("isFormInvalid", this.$v.$invalid);
  },
};
</script>

<style scoped></style>

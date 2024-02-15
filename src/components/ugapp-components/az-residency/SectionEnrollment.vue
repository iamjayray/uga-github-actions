<template>
  <section id="enrollment" data-cy="arizon-residency-enrollment">
    <div class="row">
      <!-- Are you currently enrolled at another college or university? -->
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-is-enrolled-in-another-uni"
          id="radio_isEnrolledInAnotherUni"
          :aria-label="content.isEnrolledInAnotherUni.label"
          label-class="pb-0"
          class="mb-space-xs position-relative"
        >
          <template #label>
            <label
              for="isEnrolledInAnotherUni_radio"
              class="mb-lg-space-xxs font-weight-bold"
            >
              <span class="my-auto">
                {{ content.isEnrolledInAnotherUni.label }}</span
              >
            </label>
          </template>
          <base-radio-group
            id="isEnrolledInAnotherUni_radio"
            name="radio_isEnrolledInAnotherUni"
            :options="content.isEnrolledInAnotherUni.options"
            @change="handleIsEnrolledInAnotherUniChange"
            v-model="$v.form.isEnrolledInAnotherUni.$model"
            :class="{
              'is-invalid':
                $v.form.isEnrolledInAnotherUni.$dirty &&
                $v.form.isEnrolledInAnotherUni.$error,
            }"
          >
          </base-radio-group>
          <!-- Error message -->
          <b-form-invalid-feedback
            v-if="!$v.form.isEnrolledInAnotherUni.required"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <!-- enrolled location and enrolled place -->
      <div class="col-12" v-if="isEnrolledInAnotherUni">
        <div class="row">
          <!-- Where are you currently enrolled? -->
          <div class="col-lg-5 col-12 pr-lg-0 mr-lg-gutter">
            <b-form-group
              data-cy="arizona-residency-input-enrolled-location"
              id="group-inputEnrolledLocation"
              :aria-label="content.inputEnrolledLocation.label"
              class="mb-space-md position-relative"
              label-class="pb-0"
            >
              <template #label>
                <label class="font-weight-bold" for="text-ENRL_LOC1">
                  {{ content.inputEnrolledLocation.label }}
                </label>
              </template>
              <b-form-input
                id="text-ENRL_LOC1"
                type="text"
                :placeholder="content.inputEnrolledLocation.placeholder"
                v-model.trim="$v.form.inputEnrolledLocation.$model"
                :state="
                  $v.form.inputEnrolledLocation.$dirty
                    ? !$v.form.inputEnrolledLocation.$error
                    : null
                "
              ></b-form-input>

              <b-form-invalid-feedback
                v-if="!$v.form.inputEnrolledLocation.required"
              >
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                This is a required field.
              </b-form-invalid-feedback>
              <b-form-invalid-feedback
                v-else-if="!$v.form.inputEnrolledLocation.maxLength"
              >
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                Should not be more than 1000 characters.
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
          <!-- In which state is that school located? -->
          <div class="col-lg-5 col-12 pl-lg-0 ml-lg-gutter">
            <b-form-group
              data-cy="arizona-residency-select-state-enrolled"
              id="group-selectStateEnrolled"
              :aria-label="content.selectStateEnrolled.label"
              class="mb-space-md"
              label-class="pb-0"
              label-for="selectStateEnrolled"
            >
              <template #label>
                <label
                  :for="`select-${content.selectStateEnrolled.psKey}`"
                  class="font-weight-bold"
                >
                  {{ content.selectStateEnrolled.label }}
                </label>
              </template>
              <base-select
                :id="`select-${content.selectStateEnrolled.psKey}`"
                :options="allUsStates"
                v-model="$v.form.selectStateEnrolled.$model"
                :onErrorMsg="validateSelect($v.form.selectStateEnrolled)"
                :placeholderText="content.selectStateEnrolled.placeholder"
                class="position-relative"
              ></base-select>
            </b-form-group>
          </div>
        </div>
      </div>
      <!-- Were you enrolled at this school during the %current_year% and %last_year% calendar year? -->
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-is-enroll-AZ-ed-current-or-last-year"
          id="radio_DOM_AZ"
          :aria-label="
            formatContent(content.isEnrollAZedCurrentOrLastYear.label)
          "
          label-class="pb-0"
          class="mb-space-xs mb-lg-space-md position-relative"
        >
          <template #label>
            <label for="DOM_AZ_radio" class="mb-lg-space-xxs font-weight-bold">
              <span class="my-auto">
                {{
                  formatContent(content.isEnrollAZedCurrentOrLastYear.label)
                }}</span
              >
            </label>
          </template>
          <base-radio-group
            name="radio_DOM_AZ"
            :options="content.isEnrollAZedCurrentOrLastYear.options"
            v-model="form.isEnrollAZedCurrentOrLastYear"
            :class="{
              'is-invalid':
                $v.form.isEnrollAZedCurrentOrLastYear.$dirty &&
                $v.form.isEnrollAZedCurrentOrLastYear.$error,
            }"
          >
          </base-radio-group>
          <!-- Error message -->
          <b-form-invalid-feedback
            v-if="!$v.form.isEnrollAZedCurrentOrLastYear.required"
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
import { BFormInput, BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import { required, requiredIf, maxLength } from "vuelidate/lib/validators";
import formHelpers from "@/mixins/form-helpers";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import { mapState } from "pinia";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import { EnumNameTypes } from "@/content/enum-ug-application.js";
export default {
  name: "SectionEnrollment",
  mixins: [formHelpers, validationMixin],
  data() {
    return {
      form: {
        isEnrolledInAnotherUni: null,
        inputEnrolledLocation: null,
        selectStateEnrolled: null,
        isEnrollAZedCurrentOrLastYear: null,
      },
    };
  },
  computed: {
    ...mapState(useUgApplicationStore, {
      sectionEnrollment: "sectionEnrollment",
    }),
    isEnrolledInAnotherUni() {
      return this.form.isEnrolledInAnotherUni?.value === EnumNameTypes.Yes;
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
    monthOptions: {
      type: Array,
      default: () => [],
    },
    yearOptions: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    "b-form-input": BFormInput,
    "base-radio-group": BaseRadioGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-group": BFormGroup,
    "base-select": BaseSelect,
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
  validations: {
    form: {
      isEnrolledInAnotherUni: {
        required: required,
      },
      inputEnrolledLocation: {
        required: requiredIf(function () {
          return this.form.isEnrolledInAnotherUni?.value === EnumNameTypes.Yes;
        }),
        maxLength: maxLength(1000),
      },
      selectStateEnrolled: {
        required: requiredIf(function () {
          return this.form.isEnrolledInAnotherUni?.value === EnumNameTypes.Yes;
        }),
      },
      isEnrollAZedCurrentOrLastYear: {
        required: required,
      },
    },
  },
  created() {
    this.form = { ...(this.value || this.form) };
    this.form.isEnrolledInAnotherUni =
      this.sectionEnrollment.isEnrolledInAnotherUni;
    this.form.inputEnrolledLocation =
      this.sectionEnrollment.inputEnrolledLocation;
    this.form.selectStateEnrolled = this.sectionEnrollment.selectStateEnrolled;
    this.form.isEnrollAZedCurrentOrLastYear =
      this.sectionEnrollment.isEnrollAZedCurrentOrLastYear;
  },
  methods: {
    handleIsEnrolledInAnotherUniChange(val) {
      if (val?.value !== EnumNameTypes.Yes) {
        this.form.inputEnrolledLocation = null;
        this.form.selectStateEnrolled = null;
      }
    },
  },
  mounted() {
    this.$emit("isFormInvalid", this.$v.$invalid);
  },
};
</script>

<style scoped></style>

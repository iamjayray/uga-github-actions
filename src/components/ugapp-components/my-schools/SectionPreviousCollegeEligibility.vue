<template>
  <!-- college or university name -->
  <div data-cy="my-schools-previous-college-eligibility">
    <div class="col-12">
      <b-form-group
        :data-cy="`my-schools-${name}-group-school-schoolname`"
        :id="`${name}_group_ineligible-institute-name`"
        :aria-label="compData.collegeLabel"
        label-class="pb-0"
        class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
      >
        <template #label>
          <label
            :for="`${name}_ineligible-institute-name`"
            class="mb-space-xs mb-lg-space-sm"
          >
            <h3 class="h3-small">
              {{ compData.collegeLabel }}
            </h3>
          </label>
        </template>
        <div class="col-12 col-lg-5 px-0 pr-lg-space-sm">
          <b-form-input
            :id="`${name}_ineligible-institute-name`"
            placeholder="Enter your text"
            v-model.trim="$v.ineligibleToReturnCollege.name.$model"
            :state="
              $v.ineligibleToReturnCollege.name.$dirty &&
              $v.ineligibleToReturnCollege.name.$error
                ? false
                : null
            "
            aria-describedby="input-live-help input-live-feedback"
          >
          </b-form-input>
          <b-form-invalid-feedback
            v-if="!$v.ineligibleToReturnCollege.name.required"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </div>
      </b-form-group>
    </div>
    <!-- reasons  -->
    <div
      class="col-12"
      v-if="isReasonsInputsVisible"
      data-cy="my-schools-reasons"
    >
      <h3 class="h3-large mt-space-md mt-lg-space-lg">
        {{ compData.reasons.title }}
      </h3>
      <!-- academic related -->
      <b-form-group
        :data-cy="`my-schools-${name}-group-academic-related`"
        :id="`${name}_group_academic_related`"
        :aria-label="compData.reasons.academicRelated.label"
        label-class="pb-0"
        class="mb-0 mt-space-xs mt-lg-space-sm position-relative"
      >
        <template #label>
          <label :for="`${name}_academic_related_radio`" class="mb-space-md">
            <h3 class="h3-small">
              {{ compData.reasons.academicRelated.label }}
            </h3>
          </label>
        </template>
        <base-radio-group
          :name="`${name}_academic_related_radio`"
          :options="compData.reasons.academicRelated.options"
          v-model="$v.ineligibleToReturnCollege.reasons.academicRelated.$model"
          aria-describedby="input-live-help input-live-feedback"
          :class="{
            'is-invalid':
              $v.ineligibleToReturnCollege.reasons.academicRelated.$dirty &&
              $v.ineligibleToReturnCollege.reasons.academicRelated.$error,
          }"
        >
        </base-radio-group>
        <b-form-invalid-feedback
          v-if="!$v.ineligibleToReturnCollege.reasons.academicRelated.required"
        >
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
      <!-- student conduct -->
      <b-form-group
        :data-cy="`my-schools-${name}-group-student-conduct`"
        :id="`${name}_group_student_conduct`"
        :aria-label="compData.reasons.studentConduct.label"
        label-class="pb-0"
        class="mb-0 mt-space-xs mt-lg-space-sm position-relative"
      >
        <template #label>
          <label :for="`${name}student_conduct_radio`" class="mb-space-md">
            <h3 class="h3-small">
              {{ compData.reasons.studentConduct.label }}
            </h3>
          </label>
        </template>
        <base-radio-group
          :name="`${name}student_conduct_radio`"
          :options="compData.reasons.studentConduct.options"
          v-model="$v.ineligibleToReturnCollege.reasons.studentConduct.$model"
          aria-describedby="input-live-help input-live-feedback"
          :class="{
            'is-invalid':
              $v.ineligibleToReturnCollege.reasons.studentConduct.$dirty &&
              $v.ineligibleToReturnCollege.reasons.studentConduct.$error,
          }"
        >
        </base-radio-group>
        <b-form-invalid-feedback
          v-if="!$v.ineligibleToReturnCollege.reasons.studentConduct.required"
        >
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
      <!-- other -->
      <b-form-group
        :data-cy="`my-schools-${name}-group-other-reason`"
        :id="`${name}_group_other_reason`"
        :aria-label="compData.reasons.other.label"
        label-class="pb-0"
        class="mb-0 mt-space-xs mt-lg-space-sm position-relative"
      >
        <template #label>
          <label :for="`${name}other_reason_radio`" class="mb-space-md">
            <h3 class="h3-small">
              {{ compData.reasons.other.label }}
            </h3>
          </label>
        </template>
        <base-radio-group
          :name="`${name}other_reason_radio`"
          :options="compData.reasons.other.options"
          v-model="$v.ineligibleToReturnCollege.reasons.other.$model"
          aria-describedby="input-live-help input-live-feedback"
          :class="{
            'is-invalid':
              $v.ineligibleToReturnCollege.reasons.other.$dirty &&
              $v.ineligibleToReturnCollege.reasons.other.$error,
          }"
        >
        </base-radio-group>
        <b-form-invalid-feedback
          v-if="!$v.ineligibleToReturnCollege.reasons.other.required"
        >
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
      <!-- explaination for ineligibility -->
      <b-form-group
        :data-cy="`my-schools-${name}-group-ineligibility-explaination`"
        :id="`${name}_group_ineligibility_explaination`"
        :aria-label="compData.collegeLabel"
        label-class="pb-0"
        class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
      >
        <template #label>
          <label
            :for="`${name}_ineligibility_explaination`"
            class="mb-space-xs mb-lg-space-sm"
          >
            <h3 class="h3-small">
              {{ compData.reasons.explainationLabel }}
            </h3>
          </label>
        </template>
        <div class="col-12 col-lg-5 px-0 pr-lg-space-sm">
          <b-form-input
            :id="`${name}_ineligibility_explaination`"
            placeholder="Enter your text"
            v-model.trim="
              $v.ineligibleToReturnCollege.reasons.explaination.$model
            "
            :state="
              $v.ineligibleToReturnCollege.reasons.explaination.$dirty &&
              $v.ineligibleToReturnCollege.reasons.explaination.$error
                ? false
                : null
            "
            aria-describedby="input-live-help input-live-feedback"
          >
          </b-form-input>
          <b-form-invalid-feedback
            v-if="!$v.ineligibleToReturnCollege.reasons.explaination.required"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </div>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import {
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  VBTooltip,
} from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import { requiredIf } from "vuelidate/lib/validators";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";

export default {
  name: "SectionPreviousCollegeEligibility",
  mixins: [validationMixin],
  directives: {
    "b-tooltip": VBTooltip,
  },
  components: {
    "base-radio-group": BaseRadioGroup,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },

  props: {
    value: {
      type: Object,
      default: null,
    },
    name: {
      type: String,
      default: "",
    },
    compData: {
      type: Object,
      required: true,
    },
    isFormSubmitClicked: {
      type: Boolean,
      required: true,
    },
    isFieldsRequired: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    ineligibleToReturnCollege: {
      handler: function (newVal) {
        this.$emit("input", newVal);
        this.updateComponentErrorState();
      },
      deep: true,
    },
    isFormSubmitClicked(newValue) {
      if (newValue) {
        this.$v.ineligibleToReturnCollege.$touch();
      }
    },
    isReasonsInputsVisible(newVal) {
      if (!newVal) {
        this.ineligibleToReturnCollege = {
          name: null,
          reasons: {
            academicRelated: null,
            studentConduct: null,
            other: null,
            explaination: null,
          },
        };
      }
    },
  },
  data() {
    return {
      ineligibleToReturnCollege: {
        name: null,
        reasons: {
          academicRelated: null,
          studentConduct: null,
          other: null,
          explaination: null,
        },
      },
    };
  },
  validations: {
    ineligibleToReturnCollege: {
      name: {
        required: requiredIf(function () {
          return this.isInputsRequired;
        }),
      },
      reasons: {
        academicRelated: {
          required: requiredIf(function () {
            return this.isInputsRequired;
          }),
        },
        studentConduct: {
          required: requiredIf(function () {
            return this.isInputsRequired;
          }),
        },
        other: {
          required: requiredIf(function () {
            return this.isInputsRequired;
          }),
        },
        explaination: {
          required: requiredIf(function () {
            return this.isInputsRequired;
          }),
        },
      },
    },
  },
  methods: {
    updateComponentErrorState() {
      this.$emit(
        "updateErrorState",
        this.$v.ineligibleToReturnCollege.$invalid
      );
    },
  },
  computed: {
    isReasonsInputsVisible() {
      if (this.isFieldsRequired || this.ineligibleToReturnCollege.name) {
        return true;
      } else {
        return false;
      }
    },
    isInputsRequired() {
      return (
        this.isFieldsRequired ||
        (!this.isFieldsRequired && this.ineligibleToReturnCollege.name)
      );
    },
  },
  mounted() {
    this.updateComponentErrorState();
    if (this.value && Object.keys(this.value).length > 0) {
      Object.assign(this.ineligibleToReturnCollege, this.value);
    }
  },
};
</script>
<style lang="scss" scoped>
.my-schools {
  border-radius: 19px;
}
</style>

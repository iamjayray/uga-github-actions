<template>
  <section id="prop-308" data-cy="arizona-residency-prop-308">
    <div class="row">
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-prop-308-permanentHome"
          id="group-gpa-scale"
          :aria-label="content.permanentHome.label"
          class="mb-space-md"
          label-class="pb-0"
          label-for="select-state-permanentHome"
        >
          <template #label>
            <label for="state_domicile" class="font-weight-bold h2-medium">
              Residency
            </label>
            <p class="font-weight-bold">
              <span>{{ content.permanentHome.label }}</span>
              <span
                class="ml-space-xs"
                tabindex="0"
                v-b-tooltip
                :title="content.permanentHome.tooltip"
              >
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-question"
                ></font-awesome-icon>
              </span>
            </p>
          </template>
          <base-select
            id="select-state-permanentHome"
            :options="allUsStates"
            v-model="$v.form.permanentHome.$model"
            placeholderText="Select a state"
            :onErrorMsg="validateSelect($v.form.permanentHome)"
            class="col-lg-5 px-0 col-12"
          ></base-select>
        </b-form-group>
      </div>
      <!-- Did you (or will you) graduate from an Arizona public or private high school, or homeschool equivalent, or obtain an Arizona high school equivalency diploma, e.g, GED? -->
      <div class="col-12">
        <b-form-group
          data-cy="arizona-residency-group-isGraduateFromAZPublicSchool"
          id="radio_isGraduateFromAZPublicSchool"
          :aria-label="content.isGraduateFromAZPublicSchool.label"
          label-class="pb-0"
          class="mb-space-xs mb-lg-space-md position-relative"
        >
          <template #label>
            <label
              for="isGraduateFromAZPublicSchool_radio"
              class="mb-lg-space-xxs font-weight-bold"
            >
              <span class="my-auto">
                {{ content.isGraduateFromAZPublicSchool.label }}</span
              >
              <span class="ml-space-xs" id="tooltip-target-1" tabindex="0">
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-question"
                ></font-awesome-icon>
              </span>
            </label>
            <b-tooltip target="tooltip-target-1" triggers="hover">
              <span
                v-html="content.isGraduateFromAZPublicSchool.tooltip"
              ></span>
            </b-tooltip>
          </template>
          <base-radio-group
            name="radio_isGraduateFromAZPublicSchool"
            :options="content.isGraduateFromAZPublicSchool.options"
            @change="handleIsGraduateFromAZPublicSchoolChange"
            v-model="$v.form.isGraduateFromAZPublicSchool.$model"
            :class="{
              'is-invalid':
                $v.form.isGraduateFromAZPublicSchool.$dirty &&
                $v.form.isGraduateFromAZPublicSchool.$error,
            }"
          >
          </base-radio-group>
          <!-- Error message -->
          <b-form-invalid-feedback
            v-if="!$v.form.isGraduateFromAZPublicSchool.required"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <template v-if="isAttendAZPublicSchoolInputVisible">
        <!-- Did you (or will you) attend an Arizona public or private high school, or homeschool while physically present in Arizona for a minimum of two years? -->
        <div class="col-12">
          <b-form-group
            data-cy="arizona-residency-group-isAttendAZPublicSchool"
            id="radio_isAttendAZPublicSchool"
            :aria-label="content.isAttendAZPublicSchool.label"
            label-class="pb-0"
            class="mb-space-xs mb-lg-space-md position-relative"
          >
            <template #label>
              <label
                for="isAttendAZPublicSchool_radio"
                class="mb-lg-space-xxs font-weight-bold"
              >
                <span class="my-auto">
                  {{ content.isAttendAZPublicSchool.label }}</span
                >
              </label>
            </template>
            <base-radio-group
              name="radio_isAttendAZPublicSchool"
              :options="content.isAttendAZPublicSchool.options"
              v-model="$v.form.isAttendAZPublicSchool.$model"
              :class="{
                'is-invalid':
                  $v.form.isAttendAZPublicSchool.$dirty &&
                  $v.form.isAttendAZPublicSchool.$error,
              }"
            >
            </base-radio-group>
            <!-- Error message -->
            <b-form-invalid-feedback
              v-if="!$v.form.isAttendAZPublicSchool.required"
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
import {
  BFormGroup,
  BFormInvalidFeedback,
  VBTooltip,
  BTooltip,
} from "bootstrap-vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import { EnumNameTypes } from "@/content/enum-ug-application";
import formHelpers from "@/mixins/form-helpers";
import { validationMixin } from "vuelidate";
import { required, requiredIf } from "vuelidate/lib/validators";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import { mapState } from "pinia";
export default {
  name: "SectionProp308",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        permanentHome: null,
        isGraduateFromAZPublicSchool: null,
        isAttendAZPublicSchool: null,
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
  components: {
    "base-radio-group": BaseRadioGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-group": BFormGroup,
    "b-tooltip": BTooltip,
    "base-select": BaseSelect,
  },
  directives: {
    "b-tooltip": VBTooltip,
  },
  validations: {
    form: {
      permanentHome: {
        required,
      },
      isGraduateFromAZPublicSchool: {
        required,
      },
      isAttendAZPublicSchool: {
        required: requiredIf(function () {
          return this.isAttendAZPublicSchoolInputVisible;
        }),
      },
    },
  },
  computed: {
    ...mapState(useUgApplicationStore, {
      stateValue: "sectionProp308",
    }),
    isAttendAZPublicSchoolInputVisible() {
      return (
        this.form.isGraduateFromAZPublicSchool?.value === EnumNameTypes.Yes
      );
    },
  },
  created() {
    this.form.permanentHome = this.stateValue.permanentHome;
    this.form.isGraduateFromAZPublicSchool =
      this.stateValue.isGraduateFromAZPublicSchool;
    this.form.isAttendAZPublicSchool = this.stateValue.isAttendAZPublicSchool;
  },
  mounted() {
    this.$emit("isFormInvalid", this.$v.$invalid);
  },
  methods: {
    handleIsGraduateFromAZPublicSchoolChange(item) {
      if (!item || item?.value !== EnumNameTypes.Yes) {
        this.form.isAttendAZPublicSchool = null;
      }
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
};
</script>

<style lang="scss" scoped></style>

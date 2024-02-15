<template>
  <section id="domicile" data-cy="arizona-residency-domicile">
    <div class="row">
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-domicile-group-permanent-home"
          id="group-permanent-home"
          :aria-label="content.permanentHome.label"
          class="mb-space-md"
          label-class="pb-0"
          label-for="select-state-permanentHome"
        >
          <template #label>
            <label for="state_domicile" class="font-weight-bold h2-medium">
              Residency
            </label>
            <p>
              {{ content.permanentHome.label }}
            </p>
          </template>
          <base-select
            id="select-state-permanentHome"
            :options="allUsStates"
            v-model="$v.form.permanentHome.$model"
            @change="handlePermanentHomeChange"
            placeholderText="Select a state"
            :onErrorMsg="validateSelect($v.form.permanentHome)"
            class="col-lg-5 px-0 col-12"
          ></base-select>
        </b-form-group>
      </div>
      <!-- show only if student is from arizona -->
      <template v-if="_isArizonaState">
        <!-- Have you been living in Arizona continuously for the last 12 months? -->
        <div class="col-12 mt-space-sm">
          <b-form-group
            data-cy="arizona-residency-group-isAzResident12m"
            id="radio_isAzResident12m"
            :aria-label="content.isAzResident12m.label"
            label-class="pb-0"
            class="mb-space-xs mb-lg-space-md position-relative"
          >
            <template #label>
              <label
                for="isAzResident12m_radio"
                class="mb-lg-space-xxs font-weight-bold"
              >
                <span class="my-auto">
                  {{ content.isAzResident12m.label }}</span
                >
              </label>
            </template>
            <base-radio-group
              name="radio_isAzResident12m"
              :options="content.isAzResident12m.options"
              @change="handleIsAzResident12mChange"
              v-model="$v.form.isAzResident12m.$model"
              :class="{
                'is-invalid':
                  $v.form.isAzResident12m.$dirty &&
                  $v.form.isAzResident12m.$error,
              }"
            >
            </base-radio-group>
            <!-- Error message -->
            <b-form-invalid-feedback v-if="!$v.form.isAzResident12m.required">
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation"
                size="xs"
              />
              This is a required field.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <template v-if="_isAzResident12m">
          <!-- When did you begin living in Arizona? -->
          <ug-app-month-year-select
            v-model="$v.form.dateMovedToAz.$model"
            :content="content.dateMovedToAz"
            :id="content.dateMovedToAz.psKey"
            :onErrorMsg="validateSelect($v.form.dateMovedToAz)"
            data-cy="arizona-residency-group-dateMovedToAz"
          ></ug-app-month-year-select>
        </template>
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
  name: "SectionDomicile",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        permanentHome: null,
        isAzResident12m: null,
        dateMovedToAz: null,
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
    "ug-app-month-year-select": UgAppMonthYearSelect,
    "base-radio-group": BaseRadioGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-group": BFormGroup,
    "base-select": BaseSelect,
  },
  validations: {
    form: {
      permanentHome: {
        required,
      },
      isAzResident12m: {
        required: requiredIf(function () {
          return this._isArizonaState;
        }),
      },
      dateMovedToAz: {
        required: requiredIf(function () {
          return this._isArizonaState && this._isAzResident12m;
        }),
      },
    },
  },
  computed: {
    ...mapState(useUgApplicationStore, {
      stateValue: "sectionDomicile",
    }),
    _isArizonaState() {
      return this.form.permanentHome?.value === EnumNameTypes.AzStateCode;
    },
    _isAzResident12m() {
      return this.form.isAzResident12m?.value === EnumNameTypes.Yes;
    },
  },
  created() {
    this.form.permanentHome = this.stateValue.permanentHome;
    this.form.isAzResident12m = this.stateValue.isAzResident12m;
    this.form.dateMovedToAz = this.stateValue.dateMovedToAz;
  },
  mounted() {
    this.$emit("isFormInvalid", this.$v.$invalid);
  },
  methods: {
    handlePermanentHomeChange(val) {
      if (val?.value !== EnumNameTypes.AzStateCode) {
        this.form.isAzResident12m = null;
        this.form.dateMovedToAz = null;
      }
    },
    handleIsAzResident12mChange(val) {
      if (val?.value !== EnumNameTypes.Yes) {
        this.form.dateMovedToAz = null;
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

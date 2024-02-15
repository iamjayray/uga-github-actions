<template>
  <div class="row">
    <div class="col-12">
      <b-form-group
        id="group_asu_affiliation"
        :aria-label="compData.label"
        label-class="pb-0"
        class="mb-0 position-relative"
        data-cy="my-info-prevoius-asu-affiliation-affiliations-group"
      >
        <template #label>
          <label for="asu_affiliation_checkbox_group" class="mb-space-xxs">
            <h3 class="h3-large d-flex mb-space-sm">
              <span class="my-auto"> {{ compData.label }}</span>
              <span
                class="ml-space-xs ml-lg-space-sm tool-tip-icon"
                tabindex="0"
                v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
                :title="compData.tooltip"
              >
                <font-awesome-icon
                  icon="fa-sharp fa-solid fa-circle-info"
                  size="xl"
                  class="fa-icon text-dark-1"
                />
              </span>
            </h3>
            <p class="mb-0">{{ compData.text }}</p>
          </label>
        </template>
        <b-form-checkbox-group
          id="asu_affiliation_checkbox_group"
          v-model="$v.form.affiliations.$model"
          stacked
          :options="compData.options"
          name="asu_affiliation_checkbox"
          class="text-small"
          value-field="value"
          text-field="text"
          :state="
            $v.form.affiliations.$dirty && $v.form.affiliations.$error
              ? false
              : null
          "
          aria-describedby="input-live-help input-live-feedback"
        ></b-form-checkbox-group>
        <b-form-invalid-feedback
          :force-show="
            $v.form.affiliations.$dirty && $v.form.affiliations.$error
          "
        >
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <!-- What is your ASU Affiliate ID? -->
    <div class="col-12 col-lg-5 mt-space-xs pt-lg-space-xxs">
      <b-form-group
        id="group_asu_affiliate_id"
        :aria-label="compData.label"
        label-class="pb-0"
        class="mb-0 position-relative"
        data-cy="my-info-prevoius-asu-affiliation-affiliate-id-group"
      >
        <template #label>
          <label for="asu_affiliate_id_input" class="mb-space-xs"
            ><h3 class="h3-small d-flex">
              <span class="my-auto"> {{ compData.affiliateId.label }}</span>
              <span
                class="my-auto ml-space-xxs ml-lg-space-sm bg-light-3 text-xs px-space-xxs py-lg-space-xxxs"
              >
                Optional
              </span>
            </h3>
          </label>
        </template>
        <b-form-input
          id="asu_affiliate_id_input"
          :placeholder="compData.affiliateId.placeholder"
          v-model.trim="$v.form.affiliateId.$model"
          :state="
            $v.form.affiliateId.$dirty && $v.form.affiliateId.$error
              ? false
              : null
          "
          aria-describedby="input-live-help input-live-feedback"
        >
        </b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.affiliateId.numeric">
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This should contain only numbers.
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else-if="
            !$v.form.affiliateId.minLength || !$v.form.affiliateId.maxLength
          "
        >
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          Should contain 10 characters.
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import {
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BFormCheckboxGroup,
  VBTooltip,
} from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  numeric,
} from "vuelidate/lib/validators";
export default {
  name: "SectionPreviousAsuAffiliation",
  mixins: [validationMixin],
  directives: {
    "b-tooltip": VBTooltip,
  },
  props: {
    // Helps with two way binding of data
    value: {
      type: Object,
      default: null,
    },
    compData: {
      type: Object,
      required: true,
    },
    isFormSubmitClicked: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-checkbox-group": BFormCheckboxGroup,
  },
  data() {
    return {
      footerSaveButtonClicked: false,
      form: {
        affiliations: [],
        affiliateId: null,
      },
    };
  },
  validations: {
    form: {
      affiliations: {
        required,
      },
      affiliateId: {
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(10),
      },
    },
  },
  watch: {
    isFormSubmitClicked(newValue) {
      if (newValue) {
        this.$v.$touch();
        this.footerSaveButtonClicked = true;
      }
    },
    form: {
      handler(newValue) {
        this.$emit("input", newValue);
        this.$emit("updateErrorState", this.$v.form.$invalid);
      },
      deep: true,
    },
  },
  mounted() {
    this.form = this.value;
    this.$emit("updateErrorState", this.$v.form.$invalid);
  },
};
</script>

<style lang="scss" scoped></style>

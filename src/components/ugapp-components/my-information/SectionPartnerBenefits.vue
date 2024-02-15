<template>
  <div class="row">
    <div class="col-12">
      <!-- plan to use education benefit-->
      <b-form-group
        id="group_education_benefit"
        :aria-label="compData.label"
        label-class="pb-0"
        class="mb-0 position-relative"
        data-cy="my-info-partner-benefits-education-benefit-group"
      >
        <template #label>
          <label for="education_benefit_radio" class="mb-space-sm">
            <h3 class="h3-large d-flex">
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
          </label>
          <p
            class="mb-0 mb-lg-space-xxs pb-lg-space-xxxs text-medium font-weight-bold"
            v-html="compData.text"
          ></p>
        </template>
        <base-radio-group
          name="education_benefit_radio"
          :options="compData.options"
          v-model="$v.form.educationBenefit.$model"
          aria-describedby="input-live-help input-live-feedback"
          :class="{
            'is-invalid':
              $v.form.educationBenefit.$dirty &&
              $v.form.educationBenefit.$error,
          }"
          @change="handleEducationBenefitChange"
        >
        </base-radio-group>
        <b-form-invalid-feedback v-if="!$v.form.educationBenefit.required">
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
      <!-- What is the name of your current employer? -->
      <template v-if="isCurrentEmployerDetailsRequired">
        <b-form-group
          id="group_current_employer"
          :aria-label="compData.currentEmployer.label"
          label-class="pb-0"
          label-for="current_employer_select"
          class="mb-0 mt-space-md position-relative"
          data-cy="my-info-partner-benefits-current-employer-group"
        >
          <template #label>
            <label for="current_employer_select" class="mb-space-xs">
              <h3 class="h3-small">
                {{ compData.currentEmployer.label }}
              </h3>
            </label>
          </template>

          <base-select
            id="current_employer_select"
            :options="getConfigCorporatePartners"
            v-model="$v.form.currentEmployer.$model"
            :onErrorMsg="selectErrorMsg($v.form.currentEmployer)"
            :placeholderText="compData.currentEmployer.placeholder"
            class="col-12 col-lg-5 px-0 pr-lg-gutter"
            @select="handleCurrentEmployerSelect"
          ></base-select>
        </b-form-group>
      </template>
    </div>
  </div>
</template>

<script>
import { BFormGroup, BFormInvalidFeedback, VBTooltip } from "bootstrap-vue";
import { mapActions, mapState } from "pinia";
import { useConfigStore } from "@/stores/config-store.js";
import { MyInfoConstants } from "@/content/enum-ug-application.js";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import { validationMixin } from "vuelidate";
import { required, requiredIf } from "vuelidate/lib/validators";
import * as _ from "lodash";
export default {
  name: "SectionPartnerBenefits",
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
    "base-select": BaseSelect,
    "base-radio-group": BaseRadioGroup,
    "b-form-group": BFormGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  data() {
    return {
      footerSaveButtonClicked: false,
      form: {
        educationBenefit: null,
        currentEmployer: null,
      },
    };
  },
  validations: {
    form: {
      educationBenefit: { required },
      currentEmployer: {
        required: requiredIf(function () {
          return this.isCurrentEmployerDetailsRequired;
        }),
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
  computed: {
    ...mapState(useConfigStore, {
      configCorporatePartners: "corporatePartners",
    }),
    isCurrentEmployerDetailsRequired() {
      return (
        this.form.educationBenefit?.value ===
        MyInfoConstants.partnerEducationBenefit
      );
    },
    getConfigCorporatePartners() {
      return _.sortBy(this.configCorporatePartners, "text");
    },
  },
  methods: {
    ...mapActions(useConfigStore, {
      configSelectCorporatePartner: "selectCorporatePartner",
      configDeselectCorporatePartner: "deselectCorporatePartner",
    }),
    handleEducationBenefitChange(event) {
      if (
        this.form.currentEmployer &&
        event.value !== MyInfoConstants.partnerEducationBenefit
      ) {
        this.form.currentEmployer = null;
        this.configDeselectCorporatePartner();
      }
      this.$track({
        event: "select",
        action: "click",
        name: "onclick",
        type: "checkbox",
        region: "main content",
        section:
          "do you plan to use an education benefit or scholarship through an employer, corporation, foundation or other asu education partner?",
        text: event.text.toLowerCase(),
        component: "partner benefits",
      });
    },
    handleCurrentEmployerSelect(event) {
      this.configDeselectCorporatePartner();
      this.configSelectCorporatePartner(event);
    },
    selectErrorMsg(error) {
      const errMsg = [];
      if (error.$dirty && !error.required) {
        errMsg.push("This is a required field.");
      }
      return errMsg;
    },
  },
  mounted() {
    this.form = this.value;
    this.$emit("updateErrorState", this.$v.form.$invalid);
  },
};
</script>

<style lang="scss" scoped></style>

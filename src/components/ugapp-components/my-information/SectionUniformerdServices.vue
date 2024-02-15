<template>
  <div class="row">
    <div class="col-12">
      <b-form-group
        id="group_us_uniformed_services"
        :aria-label="compData.label"
        label-class="pb-0"
        label-for="us_uniformed_services_select"
        class="mb-0 position-relative"
        data-cy="my-info-us-uniformed-services-relation-group"
      >
        <template #label>
          <label
            for="us_uniformed_services_select"
            class="mb-space-xs mb-lg-space-sm"
          >
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
          <p class="mb-space-md pb-space-xxxs text-medium">
            {{ compData.text }}
          </p>
        </template>
        <base-select
          id="us_uniformed_services_select"
          :options="compData.relation.options"
          v-model="$v.usUniformedServices.relation.$model"
          :onErrorMsg="selectErrorMsg($v.usUniformedServices.relation)"
          :placeholderText="compData.relation.placeholder"
          class="col-12 col-lg-5 px-0 pr-lg-gutter"
          @select="handleRelationSelect"
        ></base-select>
      </b-form-group>
      <template v-if="isUsUniformedInputsRequired">
        <div>
          <!-- Choose the status that best applies to you: -->
          <template v-if="isUsUniformedRelationSelectedServiceMember">
            <!-- status -->
            <b-form-group
              id="group_service_member_status"
              :aria-label="compData.status.label"
              label-class="pb-0"
              class="mb-0 mt-space-sm mt-lg-space-md position-relative"
              data-cy="my-info-us-uniformed-services-status-group"
            >
              <template #label>
                <label for="status_radio" class="mb-space-xxs">
                  <h3 class="h3-small">
                    {{ compData.status.label }}
                  </h3>
                </label>
              </template>
              <base-radio-group
                name="status_radio"
                :options="compData.status.options"
                v-model="$v.usUniformedServices.status.$model"
                aria-describedby="input-live-help input-live-feedback"
                :class="{
                  'is-invalid':
                    $v.usUniformedServices.status.$dirty &&
                    $v.usUniformedServices.status.$error,
                }"
              >
              </base-radio-group>
              <b-form-invalid-feedback
                v-if="!$v.usUniformedServices.status.required"
              >
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                This is a required field.
              </b-form-invalid-feedback>
            </b-form-group>
          </template>
          <!-- Select your branch of service: -->
          <b-form-group
            id="group_service_branch"
            :aria-label="compData.branch.label"
            label-class="pb-0"
            label-for="service_branch_select"
            class="mt-space-sm mt-lg-space-md position-relative"
            data-cy="my-info-us-uniformed-services-branch-group"
          >
            <template #label>
              <label for="service_branch_select" class="mb-space-xs">
                <h3 class="h3-small">
                  {{
                    usUniformedServices.relation.value ===
                    MyInfoConstants.uniformedService.serviceMemberOrVeteranValue
                      ? compData.branch.membersLabel
                      : compData.branch.spouseLabel
                  }}
                </h3>
              </label>
            </template>

            <base-select
              id="service_branch_select"
              :options="getBranchOptions"
              v-model="$v.usUniformedServices.branch.$model"
              :onErrorMsg="selectErrorMsg($v.usUniformedServices.branch)"
              :placeholderText="compData.branch.placeholder"
              class="col-12 col-lg-5 px-0 pr-lg-gutter"
            ></base-select>
          </b-form-group>
          <!-- Veterans educational benefits -->
          <b-form-group
            id="group_veterans_benefits"
            :aria-label="compData.appliedForBenefit.label"
            label-class="pb-0"
            class="mb-0 mt-space-sm mt-lg-space-md position-relative"
            data-cy="my-info-us-uniformed-services-veterans-benefits-group"
          >
            <template #label>
              <label for="veterans_benefits_radio" class="mb-space-xxs">
                <h3 class="h3-small">
                  {{ compData.appliedForBenefit.label }}
                </h3>
              </label>
            </template>
            <base-radio-group
              name="veterans_benefits_radio"
              :options="compData.appliedForBenefit.options"
              v-model="$v.usUniformedServices.appliedForBenefit.$model"
              aria-describedby="input-live-help input-live-feedback"
              :class="{
                'is-invalid':
                  $v.usUniformedServices.appliedForBenefit.$dirty &&
                  $v.usUniformedServices.appliedForBenefit.$error,
              }"
            >
            </base-radio-group>
            <b-form-invalid-feedback
              v-if="!$v.usUniformedServices.appliedForBenefit.required"
            >
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation"
                size="xs"
              />
              This is a required field.
            </b-form-invalid-feedback>
          </b-form-group>
          <!-- Request Joint service transcript -->
          <template v-if="isUsUniformedRelationSelectedServiceMember">
            <b-form-group
              id="group_request_transcripts"
              :aria-label="compData.requestTranscript.label"
              label-class="pb-0"
              class="mb-0 mt-space-sm mt-lg-space-md position-relative"
              data-cy="my-info-us-uniformed-services-request-transcript-group"
            >
              <template #label>
                <label for="request_transcripts_radio" class="mb-space-xxs">
                  <h3 class="h3-small">
                    {{ compData.requestTranscript.label }}
                  </h3>
                </label>
              </template>
              <base-radio-group
                name="request_transcripts_radio"
                :options="compData.requestTranscript.options"
                v-model="$v.usUniformedServices.requestTranscript.$model"
                aria-describedby="input-live-help input-live-feedback"
                :class="{
                  'is-invalid':
                    $v.usUniformedServices.requestTranscript.$dirty &&
                    $v.usUniformedServices.requestTranscript.$error,
                }"
              >
              </base-radio-group>
              <b-form-invalid-feedback
                v-if="!$v.usUniformedServices.requestTranscript.required"
              >
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                This is a required field.
              </b-form-invalid-feedback>
            </b-form-group>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, requiredIf } from "vuelidate/lib/validators";
import { BFormGroup, BFormInvalidFeedback, VBTooltip } from "bootstrap-vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import { MyInfoConstants } from "@/content/enum-ug-application.js";
export default {
  name: "SectionUniformedServices",
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
      default: null,
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
      MyInfoConstants: MyInfoConstants,
      usUniformedServices: {
        relation: null,
        status: null,
        branch: null,
        appliedForBenefit: null,
        requestTranscript: null,
      },
    };
  },
  validations: {
    usUniformedServices: {
      relation: { required },
      status: {
        required: requiredIf(function () {
          return this.isUsUniformedRelationSelectedServiceMember;
        }),
      },
      branch: {
        required: requiredIf(function () {
          return this.isUsUniformedInputsRequired;
        }),
      },
      appliedForBenefit: {
        required: requiredIf(function () {
          return this.isUsUniformedInputsRequired;
        }),
      },
      requestTranscript: {
        required: requiredIf(function () {
          return this.isUsUniformedRelationSelectedServiceMember;
        }),
      },
    },
  },
  watch: {
    usUniformedServices: {
      handler() {
        this.$emit("input", this.usUniformedServices);
        this.$emit("updateErrorState", this.$v.usUniformedServices.$invalid);
      },
      deep: true,
    },
    isFormSubmitClicked(newValue) {
      if (newValue) {
        this.$v.usUniformedServices.$touch();
      }
    },
    getBranchOptions(newValue) {
      // reseting the status value if the value selected is not availabel in the options
      if (this.usUniformedServices.branch) {
        const index = newValue.findIndex(
          (ele) => ele.value === this.usUniformedServices.branch.value
        );
        if (index === -1) {
          this.usUniformedServices.branch = null;
        }
      }
    },
  },
  computed: {
    isUsUniformedRelationSelectedServiceMember() {
      return (
        this.usUniformedServices.relation?.value ===
        MyInfoConstants.uniformedService.serviceMemberOrVeteranValue
      );
    },
    isUsUniformedInputsRequired() {
      return (
        this.usUniformedServices.relation &&
        this.usUniformedServices.relation?.value !==
          MyInfoConstants.uniformedService.noneOfOptionsValue
      );
    },
    getBranchOptions() {
      if (
        this.usUniformedServices.relation?.value ===
        MyInfoConstants.uniformedService.serviceMemberOrVeteranValue
      ) {
        if (
          this.usUniformedServices.status?.value ===
          MyInfoConstants.uniformedService.statusNationalGuard
        ) {
          return this.compData.branch.nationalGuardOptions;
        } else if (
          this.usUniformedServices.status?.value ===
          MyInfoConstants.uniformedService.statusArmedForces
        ) {
          return this.compData.branch.armedForceOptions;
        }
      }
      return this.compData.branch.defaultOptions;
    },
  },
  methods: {
    selectErrorMsg(error) {
      const errMsg = [];
      if (error.$dirty && !error.required) {
        errMsg.push("This is a required field.");
      }
      return errMsg;
    },
    handleRelationSelect(event) {
      if (
        event.value === MyInfoConstants.uniformedService.spouseOrDependentValue
      ) {
        this.usUniformedServices.status = null;
        this.usUniformedServices.requestTranscript = null;
      } else if (
        event.value === MyInfoConstants.uniformedService.noneOfOptionsValue
      ) {
        this.usUniformedServices = {
          relation: event,
          status: null,
          branch: null,
          appliedForBenefit: null,
          requestTranscript: null,
        };
      }
      this.$track({
        event: "select",
        action: "click",
        name: "onclick",
        type: "select affiliation",
        region: "main content",
        section: "affiliation to u.s. uniformed services",
        text: event.text.toLowerCase(),
      });
    },
  },
  mounted() {
    if (this.value && Object.keys(this.value).length > 0) {
      Object.assign(this.usUniformedServices, this.value);
    }
    this.$emit("updateErrorState", this.$v.usUniformedServices.$invalid);
  },
};
</script>
<style lang="scss" scoped></style>

<template>
  <section id="sectionVehicle" data-cy="arizona-residency-section-vehicle">
    <div class="row">
      <!-- Do you own or operate a car, motorcycle or other motor vehicle? -->
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-group-is-owns-vehicle"
          id="radio_isOwnsVehicle"
          :aria-label="formatContent(content.isOwnsVehicle.label)"
          label-class="pb-0"
          class="mb-space-xs mb-lg-space-md position-relative"
        >
          <template #label>
            <label
              for="isOwnsVehicle_radio"
              class="mb-lg-space-xxs font-weight-bold"
            >
              <span class="my-auto">
                {{ formatContent(content.isOwnsVehicle.label) }}</span
              >
            </label>
          </template>
          <base-radio-group
            name="isOwnsVehicle_radio"
            :options="content.isOwnsVehicle.options"
            @change="handleIsOwnsVehicleChange"
            v-model="$v.form.isOwnsVehicle.$model"
            :class="{
              'is-invalid':
                $v.form.isOwnsVehicle.$dirty && $v.form.isOwnsVehicle.$error,
            }"
          >
          </base-radio-group>
          <!-- Error message -->
          <b-form-invalid-feedback v-if="!$v.form.isOwnsVehicle.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <!-- Is this vehicle registered in the state of Arizona? -->
      <div class="col-12 mt-space-sm" v-if="doesOwnsVehicle">
        <b-form-group
          data-cy="arizona-residency-group-is-vehicle-registered-in-az"
          id="radio_isVehicleRegisteredInAZ"
          :aria-label="formatContent(content.isVehicleRegisteredInAZ.label)"
          label-class="pb-0"
          class="mb-space-xs mb-lg-space-md position-relative"
        >
          <template #label>
            <label
              for="isVehicleRegisteredInAZ_radio"
              class="mb-lg-space-xxs font-weight-bold"
            >
              <span class="my-auto">
                {{ formatContent(content.isVehicleRegisteredInAZ.label) }}</span
              >
            </label>
          </template>
          <base-radio-group
            name="isVehicleRegisteredInAZ_radio"
            :options="content.isVehicleRegisteredInAZ.options"
            @change="handleIsVehicleRegisteredInAZChange"
            v-model="$v.form.isVehicleRegisteredInAZ.$model"
            :class="{
              'is-invalid':
                $v.form.isVehicleRegisteredInAZ.$dirty &&
                $v.form.isVehicleRegisteredInAZ.$error,
            }"
          >
          </base-radio-group>
          <!-- Error message -->
          <b-form-invalid-feedback
            v-if="!$v.form.isVehicleRegisteredInAZ.required"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <!-- When was your vehicle registered in Arizona? -->
      <ug-app-month-year-select
        data-cy="arizona-residency-section-vehicle-registered-date"
        v-if="isAZVehicle"
        v-model="$v.form.dateVehicleRegistered.$model"
        :content="content.dateVehicleRegistered"
        :id="content.dateVehicleRegistered.psKey"
        :onErrorMsg="validateSelect($v.form.dateVehicleRegistered)"
      ></ug-app-month-year-select>
    </div>
  </section>
</template>

<script>
import formHelpers from "@/mixins/form-helpers";
import { BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import UgAppMonthYearSelect from "@/components/ugapp-components/UgAppMonthYearSelect.vue";
import { EnumNameTypes } from "@/content/enum-ug-application.js";
import { mapState } from "pinia";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";

import { validationMixin } from "vuelidate";
import { required, requiredIf } from "vuelidate/lib/validators";
export default {
  name: "SectionVehicle",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        isOwnsVehicle: null,
        isVehicleRegisteredInAZ: null,
        dateVehicleRegistered: null,
      },
    };
  },
  components: {
    "ug-app-month-year-select": UgAppMonthYearSelect,
    "base-radio-group": BaseRadioGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-group": BFormGroup,
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
      isOwnsVehicle: {
        required,
      },
      isVehicleRegisteredInAZ: {
        required: requiredIf(function () {
          return this.doesOwnsVehicle;
        }),
      },
      dateVehicleRegistered: {
        required: requiredIf(function () {
          return this.isAZVehicle;
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
      sectionVehicle: "sectionVehicle",
    }),
    doesOwnsVehicle() {
      return this.form.isOwnsVehicle?.value === EnumNameTypes.Yes;
    },
    isAZVehicle() {
      return this.form.isVehicleRegisteredInAZ?.value === EnumNameTypes.Yes;
    },
  },
  created() {
    this.form.isOwnsVehicle = this.sectionVehicle?.isOwnsVehicle;
    this.form.isVehicleRegisteredInAZ =
      this.sectionVehicle?.isVehicleRegisteredInAZ;
    this.form.dateVehicleRegistered =
      this.sectionVehicle?.dateVehicleRegistered;
  },
  mounted() {
    this.$emit("isFormInvalid", this.$v.$invalid);
  },
  methods: {
    handleIsOwnsVehicleChange(val) {
      if (val?.value !== EnumNameTypes.Yes) {
        this.form.isVehicleRegisteredInAZ = null;
        this.form.dateVehicleRegistered = null;
      }
    },
    handleIsVehicleRegisteredInAZChange(val) {
      if (val?.value !== EnumNameTypes.Yes) {
        this.form.dateVehicleRegistered = null;
      }
    },
  },
};
</script>

<style scoped></style>

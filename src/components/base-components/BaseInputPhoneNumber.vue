<template>
  <b-form-group
    :id="`input-group-${id}`"
    :aria-label="label"
    label-class="pb-0 mb-0"
    :label-for="`phone_input_${id}`"
    class="mb-0 position-relative base-phone-number-input"
  >
    <template #label>
      <label :for="`phone_input_${id}`" class="mb-space-xs">
        <p class="mb-0 d-flex">
          <span :class="labelClass" class="my-auto"> {{ label }}</span>
          <span
            v-if="isOptional"
            class="my-auto ml-space-xxs ml-lg-space-sm bg-light-3 text-xs px-space-xxs py-lg-space-xxxs"
          >
            Optional
          </span>
        </p>
      </label>
    </template>
    <vue-phone-number-input
      v-model="phoneNumber"
      :default-country-code="countryCode"
      @update="handleUpdate"
      @phone-number-blur="handlePhoneBlur"
      :class="onErrorMsg.length > 0 ? 'is-invalid' : 'is-valid'"
      :translations="{
        phoneNumberLabel: 'Enter phone number',
      }"
    >
    </vue-phone-number-input>

    <template v-for="error in onErrorMsg">
      <b-form-invalid-feedback
        :key="`${id}-${error}`"
        :force-show="true"
        class="position-relative"
      >
        <font-awesome-icon
          icon="fa-sharp fa-regular fa-circle-exclamation"
          size="xs"
        />
        {{ error }}
      </b-form-invalid-feedback>
    </template>
  </b-form-group>
</template>

<script>
import VuePhoneNumberInput from "vue-phone-number-input";
import { BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";

export default {
  name: "BaseInputPhoneNumber",
  components: {
    "vue-phone-number-input": VuePhoneNumberInput,
    "b-form-group": BFormGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  props: {
    // Helps with presetting the value
    // {
    //   areaCode: null,
    //   phoneNumber: null,
    //   countryCode: null,
    //   phoneType: null,
    // }
    value: {
      type: Object,
      default: () => {
        return {
          areaCode: null,
          phoneNumber: null,
          countryCode: null,
          phoneType: null,
        };
      },
    },
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    labelSize: {
      type: String,
      default: "lg",
    },
    labelWeight: {
      type: String,
      default: "bold",
    },
    placeholder: {
      type: String,
      defalut: "Enter phone number",
    },
    onErrorMsg: {
      type: Array,
      default: () => [],
    },
    isOptional: {
      type: Boolean,
      default: false,
    },
    countries: {
      type: Array,
      default: null,
    },
    returnThreeLetterCountryCode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      phone: {
        isValid: true,
        areaCode: null,
        phoneNumber: null,
        countryCode: null,
        phoneType: null,
      },
      phoneNumber: "",
      countryCode: "US",
    };
  },
  computed: {
    labelClass() {
      return `text-${this.labelSize} font-weight-${this.labelWeight}`;
    },
  },
  methods: {
    handleUpdate({
      isValid,
      countryCode,
      nationalNumber,
      formattedNumber,
      phoneNumber,
    }) {
      this.phone.isValid = isValid;
      let country = [];
      // checking if three-char country code needs to be returned
      if (this.returnThreeLetterCountryCode && this.countries) {
        country = this.countries.filter(
          (item) => item.countryCodeTwoChar === countryCode
        );
      }
      this.phone.countryCode =
        country.length > 0 ? country[0].countryCode : countryCode;
      // if national number is not available returning the phon number field
      if (!nationalNumber) {
        this.phone.phoneNumber =
          countryCode === "US" ? phoneNumber?.slice(3) : phoneNumber;
        this.phone.areaCode =
          countryCode === "US" ? phoneNumber?.slice(0, 3) : null;
      } else {
        this.phone.phoneNumber =
          countryCode === "US" ? nationalNumber?.slice(3) : formattedNumber;
        this.phone.areaCode =
          countryCode === "US" ? nationalNumber?.slice(0, 3) : null;
      }

      this.$emit("input", this.phone);
    },
    handlePhoneBlur() {
      this.$emit("blur", this.phone);
    },
  },
  mounted() {
    // two way binding
    if (this.value?.phoneNumber) {
      // if countryCode is US adding the area code
      if (this.value.countryCode === "US" || this.value.countryCode === "USA") {
        this.phoneNumber += `+1${this.value.areaCode}`;
      }
      this.phoneNumber += this.value.phoneNumber;
      let country = [];
      // checking if the three-char country code needs be returned if so, countrycode used for two-way binding will also be 3 char, converting it to 2 char for prefilling
      if (this.returnThreeLetterCountryCode && this.countries) {
        country = this.countries.filter(
          (item) => item.value === this.value.countryCode
        );
      }
      this.countryCode =
        country.length > 0
          ? country[0].countryCodeTwoChar
          : this.value.countryCode;
    }
    this.phone.phoneType = this.value.phoneType;
  },
};
</script>
<style lang="scss" scoped></style>

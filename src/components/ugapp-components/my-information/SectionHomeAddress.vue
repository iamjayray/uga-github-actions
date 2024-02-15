<template>
  <div class="row">
    <!-- country -->
    <div class="col-12">
      <b-form-group
        id="group_home_country"
        :aria-label="compData.label"
        label-class="pb-0"
        label-for="home-country-select"
        class="mb-0 position-relative"
        data-cy="my-info-home-address-country-group"
      >
        <template #label>
          <label for="home-country-select" class="mb-space-xs mb-lg-space-sm">
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
            class="mb-space-xs mb-lg-space-md pb-space-xxxs text-large text-dark-2"
          >
            {{ compData.text }}
          </p>
        </template>
        <base-select
          id="home-country-select"
          :options="configHomeAddressCountries"
          v-model="$v.form.countryCode.$model"
          :onErrorMsg="selectErrorMsg($v.form.countryCode)"
          :placeholderText="compData.placeholder"
          class="col-12 col-lg-5 px-0 pr-lg-gutter"
          @select="handleCountrySelect"
        ></base-select>
      </b-form-group>
    </div>
    <template v-if="form.countryCode">
      <!-- Address Line 1 -->
      <div class="col-12 col-lg-5 mr-lg-gutter mt-space-md">
        <b-form-group
          id="group_address_line_1"
          :aria-label="compData.addressLine1Label"
          label-class="pb-0"
          class="mb-0 position-relative"
          data-cy="my-info-home-address-address-line-1-group"
        >
          <template #label>
            <label
              for="address_line_1_input"
              class="mb-space-xs mb-lg-space-sm"
            >
              <h3 class="h3-small">
                {{ compData.addressLine1Label }}
              </h3>
            </label>
          </template>
          <b-form-input
            id="address_line_1_input"
            placeholder="Enter your text"
            :state="$v.form.street1.$dirty ? !$v.form.street1.$error : null"
            v-model.trim="$v.form.street1.$model"
            aria-describedby="input-live-help input-live-feedback"
          >
          </b-form-input>
          <b-form-invalid-feedback v-if="!$v.form.street1.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.form.street1.maxLength">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            Should not be more than 42 characters.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <!-- Address Line 2 -->
      <div class="col-12 col-lg-5 ml-lg-gutter mt-space-md">
        <b-form-group
          id="group_address_line_2"
          :aria-label="compData.addressLine2Label"
          label-class="pb-0"
          class="mb-0 position-relative"
          data-cy="my-info-home-address-address-line-2-group"
        >
          <template #label>
            <label
              for="address_line_2_input"
              class="mb-space-xs mb-lg-space-sm"
            >
              <h3 class="h3-small d-flex">
                <span class="my-auto">{{ compData.addressLine2Label }}</span>
                <span
                  class="ml-space-sm my-auto bg-light-3 text-xs px-space-xxs py-lg-space-xxxs"
                  >Optional</span
                >
              </h3>
            </label>
          </template>
          <b-form-input
            id="address_line_2_input"
            placeholder="Enter your text"
            v-model.trim="$v.form.street2.$model"
            aria-describedby="input-live-help input-live-feedback"
            :state="$v.form.street2.$dirty ? !$v.form.street2.$error : null"
          >
          </b-form-input>
          <b-form-invalid-feedback v-if="!$v.form.street2.maxLength">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            Should not be more than 42 characters.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <!-- City -->
      <div class="col-12 col-lg-5 mr-lg-gutter mt-space-md">
        <b-form-group
          id="group_city"
          :aria-label="compData.cityLabel"
          label-class="pb-0"
          class="mb-0 position-relative"
          data-cy="my-info-home-address-city-group"
        >
          <template #label>
            <label for="city_input" class="mb-space-xs mb-lg-space-sm">
              <h3 class="h3-small">
                {{ compData.cityLabel }}
              </h3>
            </label>
          </template>
          <b-form-input
            id="city_input"
            placeholder="Enter your text"
            :state="$v.form.city.$dirty ? !$v.form.city.$error : null"
            v-model.trim="$v.form.city.$model"
            aria-describedby="input-live-help input-live-feedback"
          >
          </b-form-input>
          <!-- Error message -->
          <b-form-invalid-feedback v-if="!$v.form.city.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-else-if="!$v.form.city.maxLength">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            The city should not be more than 30 characters.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <!-- State -->
      <div class="col-12 col-lg-5 ml-lg-gutter mt-space-md">
        <b-form-group
          id="group_state"
          :aria-label="compData.state.label"
          label-class="pb-0 mb-0"
          label-for="address_state"
          class="mb-0 position-relative"
          data-cy="my-info-home-address-state-group"
        >
          <template #label>
            <label for="address_state" class="mb-space-xs mb-lg-space-sm">
              <h3 class="h3-small">
                {{ compData.state.label }}
              </h3>
            </label>
          </template>
          <template v-if="configHomeAddressStates.length !== 0">
            <base-select
              id="address_state"
              :options="configHomeAddressStates"
              v-model="$v.form.stateProvince.$model"
              :onErrorMsg="selectErrorMsg($v.form.stateProvince)"
              :placeholderText="compData.state.placeholder"
              @select="handleStateSelect"
            ></base-select>
          </template>
          <template v-else>
            <b-form-input
              id="address_state"
              :state="
                $v.form.stateProvince.$dirty
                  ? !$v.form.stateProvince.$error
                  : null
              "
              placeholder="Enter your text"
              v-model.trim="$v.form.stateProvince.$model"
              aria-describedby="input-live-help input-live-feedback"
            >
            </b-form-input>
            <!-- Error message -->
            <b-form-invalid-feedback v-if="!$v.form.stateProvince.required">
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation"
                size="xs"
              />
              This is a required field.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback
              v-else-if="!$v.form.stateProvince.maxLength"
            >
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation"
                size="xs"
              />
              The state should not be more than 30 characters.
            </b-form-invalid-feedback>
          </template>
        </b-form-group>
      </div>
      <!-- ZIP / Postal Code -->
      <div class="col-12 col-lg-5 mr-lg-gutter mt-space-md">
        <b-form-group
          id="group_zip_code"
          :aria-label="compData.zipCodeLabel"
          label-class="pb-0"
          class="mb-0 position-relative"
          data-cy="my-info-home-address-zip-code-group"
        >
          <template #label>
            <label for="zip_code_input" class="mb-space-xs mb-lg-space-sm">
              <h3 class="h3-small">
                {{ compData.zipCodeLabel }}
              </h3>
            </label>
          </template>
          <b-form-input
            id="zip_code_input"
            placeholder="Enter your text"
            :state="
              $v.form.postalCode.$dirty ? !$v.form.postalCode.$error : null
            "
            v-model.trim="$v.form.postalCode.$model"
            aria-describedby="input-live-help input-live-feedback"
          >
          </b-form-input>
          <!-- Error message -->
          <b-form-invalid-feedback v-if="!$v.form.postalCode.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-else-if="!$v.form.postalCode.maxLength">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            The zip/postal code should not be more than 12 characters.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-else-if="!$v.form.postalCode.validCode">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            {{
              form.countryCode?.value === MyInfoConstants.usCountryCode
                ? "The zip/postal code can only contain integers and one hyphen (-) in between the strings."
                : "The zip/postal code can only contain letters, integers and one hyphen (-) in between the strings."
            }}
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <!-- phone numbers info -->
      <div class="col-12 mt-space-md">
        <div class="row" data-cy="my-info-home-address-phone-numbers-info">
          <div class="col-12 col-lg-7">
            <div
              class="d-flex px-space-xxs px-lg-space-sm pt-space-xs pb-space-xxs text-dark-2 bg-light-1"
            >
              <font-awesome-icon
                icon="fa-circle-user"
                class="my-lg-auto fa-xl"
              />
              <div class="ml-space-xs">
                <p class="text-medium font-weight-bold mb-space-xxs">
                  {{ compData.formInfo.title }}
                </p>
                <div class="text-small mb-space-xxxs">
                  <span>{{ compData.formInfo.text }}</span>
                  <router-link
                    :to="{ name: EnumPageNames.PageProfile }"
                    target="_self"
                    class="text-primary text-underline"
                    >profile</router-link
                  >
                  <span>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import {
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  VBTooltip,
} from "bootstrap-vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import { mapActions, mapState } from "pinia";
import { useConfigStore } from "@/stores/config-store.js";
import { MyInfoConstants } from "@/content/enum-ug-application.js";
import { EnumPageNames } from "@/content/enum-app.js";

export default {
  name: "SectionHomeAddress",
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
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  data() {
    return {
      MyInfoConstants: MyInfoConstants,
      EnumPageNames: EnumPageNames,
      form: {
        type: MyInfoConstants.permanentAddressType,
        countryCode: null,
        street1: null,
        street2: "",
        city: null,
        stateProvince: null,
        postalCode: null,
      },
    };
  },
  validations: {
    form: {
      countryCode: { required },
      street1: {
        required,
        maxLength: maxLength(42),
      },
      street2: {
        maxLength: maxLength(42),
      },
      city: { required, maxLength: maxLength(30) },
      stateProvince: {
        required,
        maxLength: function (value) {
          return this.configHomeAddressStates.length > 0 || value?.length <= 30;
        },
      },
      postalCode: {
        required,
        maxLength: maxLength(12),
        validCode: function (value) {
          if (this.form.countryCode?.value === MyInfoConstants.usCountryCode) {
            return /^(?!-)(?!.*-$)(?!.*-.*-)[0-9-]{1,12}$/.test(value);
          } else {
            return /^(?!-)(?!.*-$)(?!.*-.*-)[A-Za-z0-9-]{1,12}$/.test(value);
          }
        },
      },
    },
  },
  watch: {
    form: {
      handler() {
        this.$emit("input", this.form);
        this.$emit("updateErrorState", this.$v.form.$invalid);
      },
      deep: true,
    },
    isFormSubmitClicked(newValue) {
      if (newValue) {
        this.$v.form.$touch();
      }
    },
    configHomeAddressStates: {
      handler(newValue) {
        // reseting the state value when the options are updated when country is selected.
        if (newValue.length > 0) {
          if (this.form.stateProvince) {
            const index = newValue.findIndex(
              (ele) => ele.value === this.form.stateProvince?.value
            );
            if (index === -1) {
              this.form.stateProvince = null;
              this.configDeselectHomeAddressState();
            }
          }
        } else {
          this.form.stateProvince = null;
          this.configDeselectHomeAddressState();
        }
        this.$v.form.stateProvince.$reset();
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(useConfigStore, {
      configHomeAddressCountries: "homeAddressCountries",
      configHomeAddressStates: "homeAddressStates",
    }),
    isAreaCodeInputVisible() {
      return this.form.countryCode?.value === MyInfoConstants.usCountryCode;
    },
  },
  methods: {
    ...mapActions(useConfigStore, {
      configSelectHomeAddressCountry: "selectHomeAddressCountry",
      configDeselectHomeAddressCountry: "deselectHomeAddressCountry",
      configPopulateHomeAddressStates: "populateHomeAddressStates",
      configSelectHomeAddressState: "selectHomeAddressState",
      configDeselectHomeAddressState: "deselectHomeAddressState",
    }),
    selectErrorMsg(error) {
      const errMsg = [];
      if (error.$dirty && !error.required) {
        errMsg.push("This is a required field.");
      }
      return errMsg;
    },
    async handleCountrySelect(event) {
      await this.configDeselectHomeAddressCountry();
      await this.configSelectHomeAddressCountry(event);
      const response = await this.configPopulateHomeAddressStates();
      if (response.code !== 200) {
        // fire error data layer event
        this.$track({
          event: "app_error",
          action: "my_information",
          location: this.$router.currentRoute.fullPath,
          code: response.code,
          message: response.errors.toString(),
        });
      }
    },
    async handleStateSelect(event) {
      await this.configDeselectHomeAddressState();
      await this.configSelectHomeAddressState(event);
    },
  },
  mounted() {
    if (this.value && Object.keys(this.value).length > 0) {
      Object.assign(this.form, this.value);
    }
  },
};
</script>
<style lang="scss" scoped></style>

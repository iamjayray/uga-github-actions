<template>
  <div class="row mb-space-lg">
    <div class="col-12">
      <h3 class="h3-large d-flex mb-space-sm mb-lg-space-lg">
        {{ compData.title }}
      </h3>
    </div>
    <!-- Are you licensed in good standing to practice as an RN? -->
    <div class="col-12">
      <b-form-group
        id="group_is_licensed"
        :aria-label="compData.licensed.label"
        label-class="pb-0"
        class="mb-0 position-relative"
        data-cy="my-programs-rn-to-bsn-is-licensed-group"
      >
        <template #label>
          <label
            for="licensed_standing_practice"
            class="mb-space-sm mb-lg-space-md"
          >
            <h3 class="h3-small">
              {{ compData.licensed.label }}
            </h3>
          </label>
        </template>
        <base-radio-group
          name="licensed_standing_practice"
          :options="compData.licensed.options"
          v-model="$v.rnToBsn.isLicensed.$model"
          aria-describedby="input-live-help input-live-feedback"
          :class="{
            'is-invalid':
              $v.rnToBsn.isLicensed.$dirty && $v.rnToBsn.isLicensed.$error,
          }"
        >
        </base-radio-group>
        <b-form-invalid-feedback v-if="!$v.rnToBsn.isLicensed.required">
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <!-- In what state are you licensed to practice as a registered nurse? -->
    <div class="col-12">
      <b-form-group
        id="group_licensed_state"
        :aria-label="compData.licensedState.label"
        label-class="pb-0"
        label-for="licensed_state_select"
        class="mb-0 mt-space-xs position-relative"
        data-cy="my-programs-rn-to-bsn-licensed-state-group"
      >
        <template #label>
          <label for="licensed_state_select" class="mb-space-xs"
            ><h3 class="h3-small">
              {{ compData.licensedState.label }}
            </h3>
          </label>
        </template>
        <base-select
          id="licensed_state_select"
          :options="configStatesLicensedtoPracticeRN"
          v-model="$v.rnToBsn.license.state.$model"
          :onErrorMsg="selectErrorMsg($v.rnToBsn.license.state)"
          :placeholderText="compData.licensedState.placeholder"
          @change="handleLicensedStateSelect"
          class="col-12 col-lg-5 px-0 pr-lg-gutter"
        ></base-select>
      </b-form-group>
    </div>
    <!-- RN license number -->
    <div class="col-12">
      <b-form-group
        id="group_license_number"
        :aria-label="compData.rnLicensenumber.label"
        label-class="pb-0"
        class="mb-0 mt-space-md position-relative"
        data-cy="my-programs-rn-to-bsn-license-number-group"
      >
        <template #label>
          <label for="license_number_input" class="mb-space-xs"
            ><h3 class="h3-small">
              {{ compData.rnLicensenumber.label }}
            </h3>
          </label>
        </template>
        <div class="col-12 col-lg-5 px-0 pr-lg-gutter">
          <b-form-input
            id="license_number_input"
            :placeholder="compData.rnLicensenumber.placeholder"
            :state="
              $v.rnToBsn.license.number.$dirty
                ? !$v.rnToBsn.license.number.$error
                : null
            "
            v-model.trim="$v.rnToBsn.license.number.$model"
            aria-describedby="input-live-help input-live-feedback"
          >
          </b-form-input>
          <b-form-invalid-feedback v-if="!$v.rnToBsn.license.number.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            v-else-if="!$v.rnToBsn.license.number.numeric"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            Should contain only numeric characters.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            v-else-if="!$v.rnToBsn.license.number.maxLength"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            The number should not be more than 1000 characters.
          </b-form-invalid-feedback>
        </div>
      </b-form-group>
    </div>
    <!-- License expiration date -->
    <div class="col-12">
      <b-form-group
        id="group_license_expiration_date"
        :aria-label="compData.expirationLabel"
        label-class="pb-0"
        label-for="license_expiration_date_input"
        class="mb-0 mt-space-md position-relative"
        data-cy="my-programs-rn-to-bsn-license-expiration-date-group"
      >
        <template #label>
          <label for="license_expiration_date_input" class="mb-space-xs"
            ><h3 class="h3-small">
              {{ compData.expirationLabel }}
            </h3>
          </label>
        </template>
        <div class="d-lg-flex">
          <!-- month -->
          <base-select
            id="license_expiration_month_select"
            :options="monthOptions"
            v-model="$v.rnToBsn.license.expirationDate.month.$model"
            :onErrorMsg="
              selectErrorMsg($v.rnToBsn.license.expirationDate.month)
            "
            placeholderText="Month"
            class="col-12 col-lg-2 mb-space-sm mb-lg-0 px-0 mr-lg-space-sm"
          ></base-select>
          <!-- Day -->
          <base-select
            id="license_expiration_day_select"
            :options="licenseExpirationDayOptions"
            v-model="$v.rnToBsn.license.expirationDate.day.$model"
            :onErrorMsg="selectErrorMsg($v.rnToBsn.license.expirationDate.day)"
            placeholderText="Day"
            class="col-12 col-lg-2 mb-space-sm mb-lg-0 px-0 mr-lg-space-sm"
          ></base-select>
          <!-- Year -->
          <div class="col-12 col-lg-2 mb-space-sm mb-lg-0 px-0">
            <base-select
              id="license_expiration_year_select"
              :options="yearOptions"
              v-model="$v.rnToBsn.license.expirationDate.year.$model"
              :onErrorMsg="
                selectErrorMsg($v.rnToBsn.license.expirationDate.year)
              "
              placeholderText="Year"
            ></base-select>
          </div>
        </div>
      </b-form-group>
    </div>
    <!-- Is your license encumbered (disciplinary action by the State Board of Nursing)? -->
    <div class="col-12">
      <b-form-group
        id="license_disciplinary_action_group"
        :aria-label="compData.desciplinaryActions.label"
        label-class="pb-0"
        class="mb-0 mt-space-md position-relative"
        data-cy="my-programs-rn-to-bsn-license-disciplinary-action-group"
      >
        <template #label>
          <label for="license_disciplinary_action" class="mb-space-md w-100">
            <h3 class="h3-small mb-space-sm">
              {{ compData.desciplinaryActions.label }}
            </h3>
            <p class="mb-0 col-12 col-lg-6 px-0">
              {{ compData.desciplinaryActions.text }}
            </p>
          </label>
        </template>
        <base-radio-group
          name="license_disciplinary_action"
          :options="compData.desciplinaryActions.options"
          v-model="$v.rnToBsn.license.disciplinaryActionTaken.$model"
          aria-describedby="input-live-help input-live-feedback"
          :class="{
            'is-invalid':
              $v.rnToBsn.license.disciplinaryActionTaken.$dirty &&
              $v.rnToBsn.license.disciplinaryActionTaken.$error,
          }"
        >
        </base-radio-group>
        <b-form-invalid-feedback
          v-if="!$v.rnToBsn.license.disciplinaryActionTaken.required"
        >
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <!-- If you do not have your RN license, you must take NCLEX-RN within 12 weeks of completing the associate degree or diploma in nursing. Date scheduled to take NCLEX-RN -->
    <div class="col-12">
      <b-form-group
        id="group_date_scheduled_for_nclexrn"
        :aria-label="compData.dateScheduledForNclexrnLabel"
        label-class="pb-0"
        label-for="date_scheduled_for_nclexrn_input"
        class="mb-0 mt-space-xs position-relative"
        data-cy="my-programs-rn-to-bsn-date-scheduled-for-nclexrn-group"
      >
        <template #label>
          <label
            for="date_scheduled_for_nclexrn_input"
            class="mb-space-xs w-100"
            ><h3 class="h3-small mb-space-sm">
              {{ compData.dateScheduledForNclexrn.label }}
            </h3>
            <p class="mb-0 col-12 col-lg-6 px-0">
              {{ compData.dateScheduledForNclexrn.subText }}
            </p>
          </label>
        </template>

        <div class="d-lg-flex">
          <!-- month -->
          <base-select
            id="nclex_rn_month_select"
            :options="monthOptions"
            v-model="$v.rnToBsn.dateScheduledForNclexrn.month.$model"
            :onErrorMsg="
              selectErrorMsg($v.rnToBsn.dateScheduledForNclexrn.month)
            "
            placeholderText="Month"
            class="col-12 col-lg-2 mb-space-sm mb-lg-0 px-0 mr-lg-space-sm"
          ></base-select>
          <!-- Day -->
          <base-select
            id="nclex_rn_day_select"
            :options="nclexrnDayOptions"
            v-model="$v.rnToBsn.dateScheduledForNclexrn.day.$model"
            :onErrorMsg="selectErrorMsg($v.rnToBsn.dateScheduledForNclexrn.day)"
            placeholderText="Day"
            class="col-12 col-lg-2 mb-space-sm mb-lg-0 px-0 mr-lg-space-sm"
          ></base-select>
          <!-- Year -->
          <div class="col-12 col-lg-2 mb-space-sm mb-lg-0 px-0">
            <base-select
              id="nclex_rn_year_select"
              :options="yearOptions"
              v-model="$v.rnToBsn.dateScheduledForNclexrn.year.$model"
              :onErrorMsg="
                selectErrorMsg($v.rnToBsn.dateScheduledForNclexrn.year)
              "
              placeholderText="Year"
            ></base-select>
          </div>
        </div>
      </b-form-group>
    </div>
    <!-- Employer -->
    <div class="col-12">
      <b-form-group
        id="group_employer"
        :aria-label="compData.employer.label"
        label-class="pb-0"
        class="mb-0 mt-space-xs mt-lg-space-md position-relative"
        data-cy="my-programs-rn-to-bsn-employer-group"
      >
        <template #label>
          <label for="employer_input" class="mb-space-xs"
            ><h3 class="h3-small">
              {{ compData.employer.label }}
            </h3>
          </label>
        </template>
        <div class="col-12 col-lg-5 px-0 pr-lg-gutter">
          <b-form-input
            id="employer_input"
            :placeholder="compData.employer.placeholder"
            :state="
              $v.rnToBsn.employer.$dirty ? !$v.rnToBsn.employer.$error : null
            "
            v-model.trim="$v.rnToBsn.employer.$model"
            aria-describedby="input-live-help input-live-feedback"
          >
          </b-form-input>
          <b-form-invalid-feedback v-if="!$v.rnToBsn.employer.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </div>
      </b-form-group>
    </div>
    <!-- Partner Code if applicable (obtained through an information session at your place of employment). You may or may not have a Partner Code. -->
    <div class="col-12">
      <b-form-group
        id="group_partner_code"
        :aria-label="compData.partnerCode.label"
        label-class="pb-0"
        class="mb-0 mt-space-md position-relative"
        data-cy="my-programs-rn-to-bsn-partner-code-group"
      >
        <template #label>
          <label
            for="partner_code_input"
            class="mb-space-sm mb-lg-space-md w-100"
            ><h3 class="h3-small mb-space-sm">
              {{ compData.partnerCode.label }}
            </h3>
            <p class="mb-0 col-12 col-lg-6 px-0">
              {{ compData.partnerCode.subText }}
            </p>
          </label>
        </template>
        <div class="col-12 col-lg-5 px-0 pr-lg-gutter">
          <b-form-input
            id="partner_code_input"
            :placeholder="compData.partnerCode.placeholder"
            v-model.trim="isValidPartnerCode"
            aria-describedby="input-live-help input-live-feedback"
          >
          </b-form-input>
        </div>
      </b-form-group>
    </div>
    <!-- I authorize ASU to release my name and graduation information to my employer. -->
    <div class="col-12">
      <b-form-group
        id="release_info_to_employer_group"
        :aria-label="compData.releaseInfoToEmployer.label"
        label-class="pb-0"
        class="mb-0 mt-space-md position-relative"
        data-cy="my-programs-rn-to-bsn-release_info_to_employer_group"
      >
        <template #label>
          <label
            for="release_info_to_employer"
            class="mb-space-sm mb-lg-space-md"
          >
            <h3 class="h3-small">
              {{ compData.releaseInfoToEmployer.label }}
            </h3>
          </label>
        </template>
        <base-radio-group
          name="release_info_to_employer"
          :options="compData.releaseInfoToEmployer.options"
          v-model="$v.rnToBsn.releaseInfoToEmployer.$model"
          aria-describedby="input-live-help input-live-feedback"
          :class="{
            'is-invalid':
              $v.rnToBsn.releaseInfoToEmployer.$dirty &&
              $v.rnToBsn.releaseInfoToEmployer.$error,
          }"
        >
        </base-radio-group>
        <b-form-invalid-feedback
          v-if="!$v.rnToBsn.releaseInfoToEmployer.required"
        >
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <!-- If you are pursuing an RN-BSN Pathway from one of the Arizona Community Colleges, please indicate which one: -->
    <div class="col-12">
      <b-form-group
        id="group_community_college"
        :aria-label="compData.communityCollege.label"
        label-class="pb-0"
        label-for="community_college_select"
        class="mb-0 mt-space-xs position-relative"
        data-cy="my-programs-rn-to-bsn-community-college-group"
      >
        <template #label>
          <label for="community_college_select" class="mb-space-xs"
            ><h3 class="h3-small">
              {{ compData.communityCollege.label }}
            </h3>
          </label>
        </template>
        <base-select
          id="community_college_select"
          :options="compData.communityCollege.options"
          :selectAllowEmpty="true"
          v-model="rnToBsn.communityColleges"
          :placeholderText="compData.communityCollege.placeholder"
          class="col-12 col-lg-5 px-0 pr-lg-gutter"
        ></base-select>
      </b-form-group>
    </div>
    <!-- Reverse Transfer Agreement? -->
    <div class="col-12">
      <b-form-group
        id="reverse_transfer_group"
        :aria-label="compData.reverseTransferAgreement.label"
        label-class="pb-0"
        class="mb-0 mt-space-md position-relative"
        data-cy="my-programs-rn-to-bsn-reverse-transfer-group"
      >
        <template #label>
          <label for="reverse_transfer" class="mb-space-sm mb-lg-space-md">
            <h3 class="h3-small">
              {{ compData.reverseTransferAgreement.label }}
            </h3>
          </label>
        </template>
        <base-radio-group
          name="reverse_transfer"
          :options="compData.reverseTransferAgreement.options"
          v-model="$v.rnToBsn.reverseTransferAggrement.$model"
          aria-describedby="input-live-help input-live-feedback"
          :class="{
            'is-invalid':
              $v.rnToBsn.reverseTransferAggrement.$dirty &&
              $v.rnToBsn.reverseTransferAggrement.$error,
          }"
        >
        </base-radio-group>
        <b-form-invalid-feedback
          v-if="!$v.rnToBsn.reverseTransferAggrement.required"
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
</template>

<script>
import {
  BFormInput,
  BFormGroup,
  BFormInvalidFeedback,
  VBTooltip,
} from "bootstrap-vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import months from "@/content/months.json";
import { EnumPageNames } from "@/content/enum-app.js";
import { validationMixin } from "vuelidate";
import { required, maxLength, numeric } from "vuelidate/lib/validators";
import { getDaysInMonth } from "date-fns";
import { mapActions, mapState } from "pinia";
import { useConfigStore } from "@/stores/config-store.js";

export default {
  name: "SectionRnToBsn",
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
    "b-form-input": BFormInput,
    "base-radio-group": BaseRadioGroup,
    "b-form-group": BFormGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      footerSaveButtonClicked: false,
      monthOptions: null,
      licenseExpirationDayOptions: [],
      nclexrnDayOptions: [],
      rnToBsn: {
        isLicensed: null,
        license: {
          state: null,
          number: null,
          expirationDate: {
            day: null,
            month: null,
            year: null,
          },
          disciplinaryActionTaken: null,
        },
        dateScheduledForNclexrn: {
          day: null,
          month: null,
          year: null,
        },
        employer: null,
        partnerCode: null,
        releaseInfoToEmployer: null,
        communityColleges: null,
        reverseTransferAggrement: null,
      },
    };
  },
  validations: {
    rnToBsn: {
      isLicensed: {
        required,
      },
      license: {
        state: {
          required,
        },
        number: {
          required,
          numeric,
          maxLength: maxLength(1000),
        },
        expirationDate: {
          month: {
            required,
          },
          day: {
            required,
          },
          year: {
            required,
          },
        },
        disciplinaryActionTaken: {
          required,
        },
      },
      dateScheduledForNclexrn: {
        month: {
          required,
        },
        day: {
          required,
        },
        year: {
          required,
        },
      },
      employer: {
        required,
      },
      releaseInfoToEmployer: {
        required,
      },
      reverseTransferAggrement: {
        required,
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
    rnToBsn: {
      handler(newValue) {
        this.$emit("input", newValue);
        this.$emit("updateErrorState", this.$v.rnToBsn.$invalid);
      },
      deep: true,
    },
    "rnToBsn.license.expirationDate.month": {
      handler() {
        this.generateLicenseExpirationDayOptions();
      },
      deep: true,
    },
    "rnToBsn.dateScheduledForNclexrn.month": {
      handler() {
        this.generateNclexrnDayOptions();
      },
      deep: true,
    },
    "rnToBsn.license.expirationDate.year": {
      handler() {
        this.generateLicenseExpirationDayOptions();
      },
      deep: true,
    },
    "rnToBsn.dateScheduledForNclexrn.year": {
      handler() {
        this.generateNclexrnDayOptions();
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(useConfigStore, {
      configStatesLicensedtoPracticeRN: "statesLicensedtoPracticeRN",
    }),
    isValidPartnerCode: {
      get() {
        return this.rnToBsn.partnerCode;
      },
      set(value) {
        this.rnToBsn.partnerCode = value?.length <= 0 ? null : value;
      },
    },
    yearOptions() {
      const currentDate = new Date();
      const dateCopy = new Date(currentDate);
      dateCopy.setFullYear(currentDate.getFullYear() - 50);
      var options = [];
      for (
        var i = dateCopy.getFullYear();
        i < currentDate.getFullYear() + 50;
        i++
      ) {
        options.push({ text: `${i}`, value: i });
      }

      return options.sort((a, b) =>
        a.value > b.value ? -1 : b.value > a.value ? 1 : 0
      );
    },
  },
  methods: {
    ...mapActions(useConfigStore, {
      configDeselectStatesLicensedtoPracticeRN:
        "deselectStatesLicensedtoPracticeRN",
      configSelectStatesLicensedtoPracticeRN:
        "selectStatesLicensedtoPracticeRN",
    }),
    selectErrorMsg(error) {
      const errMsg = [];
      if (error.$dirty && !error.required) {
        errMsg.push("This is a required field.");
      }
      return errMsg;
    },
    handleLicensedStateSelect(event) {
      this.configDeselectStatesLicensedtoPracticeRN();
      this.configSelectStatesLicensedtoPracticeRN(event);
    },
    getDaysOption(totalDays) {
      let daysOption = [];
      for (let index = 1; index <= totalDays; index++) {
        const day = index < 9 ? `0${index}` : `${index}`;
        daysOption.push({ text: day, value: day });
      }
      return daysOption;
    },
    generateLicenseExpirationDayOptions() {
      let days = getDaysInMonth(
        new Date(
          this.rnToBsn.license.expirationDate.year
            ? this.rnToBsn.license.expirationDate.year?.value
            : "2000",
          this.rnToBsn.license.expirationDate.month
            ? this.rnToBsn.license.expirationDate.month?.monthIndex
            : "0"
        )
      );
      this.licenseExpirationDayOptions = this.getDaysOption(days);
      // removing if the date is selected before the month is selected and its not present in the options
      if (parseInt(this.rnToBsn.license.expirationDate.day?.value) > days) {
        this.$v.rnToBsn.license.expirationDate.day.$model = null;
      }
    },
    generateNclexrnDayOptions() {
      let days = getDaysInMonth(
        new Date(
          this.rnToBsn.dateScheduledForNclexrn.year
            ? this.rnToBsn.dateScheduledForNclexrn.year?.value
            : "2000",
          this.rnToBsn.dateScheduledForNclexrn.month
            ? this.rnToBsn.dateScheduledForNclexrn.month?.monthIndex
            : "0"
        )
      );
      this.nclexrnDayOptions = this.getDaysOption(days);
      // removing if the date is selected before the month is selected and its not present in the options
      if (parseInt(this.rnToBsn.dateScheduledForNclexrn.day?.value) > days) {
        this.$v.rnToBsn.dateScheduledForNclexrn.day.$model = null;
      }
    },
  },
  created() {
    this.monthOptions = months.sort((a, b) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0
    );
  },
  mounted() {
    this.rnToBsn = this.value;
    this.$emit("updateErrorState", this.$v.rnToBsn.$invalid);
  },
};
</script>

<style lang="scss" scoped></style>

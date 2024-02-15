<template>
  <div class="row">
    <div class="col-12">
      <!-- Primary language spoken at home -->
      <b-form-group
        id="group_primary_language_select"
        :aria-label="compData.label"
        label-class="pb-0"
        label-for="primary_language_select"
        class="mb-0 position-relative"
        data-cy="my-info-primary-language-select-group"
      >
        <template #label>
          <label
            for="primary_language_select"
            class="mb-space-xs mb-lg-space-md"
          >
            <h3 class="h3-large">
              {{ compData.label }}
            </h3>
          </label>
        </template>
        <base-select
          id="primary_language_select"
          :options="configPrimaryLanguagesAtHome"
          v-model="$v.form.selectValue.$model"
          :onErrorMsg="selectErrorMsg($v.form.selectValue)"
          :placeholderText="compData.placeholder"
          class="col-12 col-lg-5 px-0 pr-lg-gutter"
          @select="handlePrimaryLanguageSelect"
        ></base-select>
      </b-form-group>
      <!-- Enter your primary Language -->
      <template v-if="isPrimaryLanguageInputValueRequired">
        <b-form-group
          id="group_primary_language_input"
          :aria-label="compData.languageInputLabel"
          label-class="pb-0"
          class="mb-0 col-12 col-lg-5 px-0 pr-lg-gutter mt-space-md"
          data-cy="my-info-primary-language-input-group"
        >
          <template #label>
            <label
              for="primary_language_input"
              class="mb-space-xs mb-lg-space-sm"
            >
              <h3 class="h3-small">
                {{ compData.languageInputLabel }}
              </h3>
            </label>
          </template>
          <b-form-input
            id="primary_language_input"
            placeholder="Enter your text"
            :state="
              $v.form.inputValue.$dirty ? !$v.form.inputValue.$error : null
            "
            v-model.trim="$v.form.inputValue.$model"
            aria-describedby="input-live-help input-live-feedback"
          >
          </b-form-input>
          <!-- Error message -->
          <b-form-invalid-feedback v-if="!$v.form.inputValue.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </b-form-group>
      </template>
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
import { MyInfoConstants } from "@/content/enum-ug-application.js";
import { mapActions, mapState } from "pinia";
import { useConfigStore } from "@/stores/config-store.js";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import { validationMixin } from "vuelidate";
import { required, requiredIf } from "vuelidate/lib/validators";
export default {
  name: "SectionPrimaryLanguage",
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
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  data() {
    return {
      footerSaveButtonClicked: false,
      form: {
        selectValue: null,
        inputValue: null,
      },
    };
  },
  validations: {
    form: {
      selectValue: {
        required,
      },
      inputValue: {
        required: requiredIf(function () {
          return this.isPrimaryLanguageInputValueRequired;
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
      configPrimaryLanguagesAtHome: "primaryLanguagesAtHome",
    }),
    isPrimaryLanguageInputValueRequired() {
      return (
        this.form.selectValue?.value === MyInfoConstants.primaryLanguageOther
      );
    },
  },
  methods: {
    ...mapActions(useConfigStore, {
      configSelectPrimaryLanguageAtHome: "selectPrimaryLanguageAtHome",
      configDeselectPrimaryLanguageAtHome: "deselectPrimaryLanguageAtHome",
    }),
    handlePrimaryLanguageSelect(event) {
      this.configDeselectPrimaryLanguageAtHome();
      this.configSelectPrimaryLanguageAtHome(event);
      if (
        this.form.inputValue &&
        event.value !== MyInfoConstants.primaryLanguageOther
      ) {
        this.form.inputValue = null;
      }
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

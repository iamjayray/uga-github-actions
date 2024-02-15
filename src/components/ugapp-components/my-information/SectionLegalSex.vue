<template>
  <div class="row">
    <div class="col-12">
      <!-- Legal sex -->
      <b-form-group
        id="group_legal_sex"
        :aria-label="compData.label"
        label-class="pb-0"
        class="mb-space-xxs position-relative"
        data-cy="my-info-legal-sex-group"
      >
        <template #label>
          <label for="legal_sex_radio" class="mb-space-sm">
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
        </template>
        <base-radio-group
          name="legal_sex_group"
          :options="compData.options"
          v-model="$v.legalSex.$model"
          :class="{
            'is-invalid': $v.legalSex.$dirty && $v.legalSex.$error,
          }"
        >
        </base-radio-group>
        <!-- Error message -->
        <b-form-invalid-feedback v-if="!$v.legalSex.required">
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
      <div class="row" data-cy="my-info-legal-sex-gender-pronoun-info">
        <div class="col-12 col-lg-7">
          <div
            class="d-flex px-space-xxs px-lg-space-sm pt-space-xs pb-space-xxs text-dark-2 bg-light-1"
          >
            <font-awesome-icon icon="fa-circle-user" class="my-lg-auto fa-xl" />
            <div class="ml-space-xs">
              <p class="text-medium font-weight-bold mb-space-xxs">
                {{ compData.formInfo.title }}
              </p>
              <div class="text-small mb-space-xxxs">
                <span>{{ compData.formInfo.text }}</span>
                <router-link
                  :to="{ name: EnumPageNames.PageProfile }"
                  @click.native="handleProfileLinkClick()"
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
  </div>
</template>

<script>
import { BFormGroup, BFormInvalidFeedback, VBTooltip } from "bootstrap-vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import { EnumPageNames } from "@/content/enum-app.js";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
  name: "SectionLegalSex",
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
  methods: {
    handleProfileLinkClick() {
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: "gender and pronouns",
        text: "profile",
      });
    },
  },
  components: {
    "base-radio-group": BaseRadioGroup,
    "b-form-group": BFormGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  data() {
    return {
      EnumPageNames: EnumPageNames,
      footerSaveButtonClicked: false,
      legalSex: null,
    };
  },
  validations: {
    legalSex: {
      required,
    },
  },
  watch: {
    isFormSubmitClicked(newValue) {
      if (newValue) {
        this.$v.$touch();
        this.footerSaveButtonClicked = true;
      }
    },
    legalSex(newValue) {
      this.$emit("input", newValue);
      this.$emit("updateErrorState", this.$v.legalSex.$invalid);
    },
  },
  mounted() {
    this.legalSex = this.value;
    this.$emit("updateErrorState", this.$v.legalSex.$invalid);
  },
};
</script>

<style lang="scss" scoped></style>

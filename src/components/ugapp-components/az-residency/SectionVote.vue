<template>
  <div class="voters-section" data-cy="arizona-residency-voters-section">
    <!-- isRegisteredToVote -->
    <div class="col-12 mt-space-sm p-0">
      <b-form-group
        data-cy="arizona-residency-is-registered-to-vote"
        id="radio_isRegisteredToVote"
        :aria-label="content.isRegisteredToVote.label"
        label-class="pb-0"
        class="mb-space-xs mb-lg-space-md position-relative"
      >
        <template #label>
          <label
            for="isRegisteredToVote_radio"
            class="mb-lg-space-xxs font-weight-bold"
          >
            <span class="my-auto"> {{ content.isRegisteredToVote.label }}</span>
          </label>
        </template>
        <base-radio-group
          name="employment_radio_isRegisteredToVote"
          id="isRegisteredToVote_radio"
          @change="handleIsRegisteredToVote"
          :options="content.isRegisteredToVote.options"
          v-model="$v.form.isRegisteredToVote.$model"
          :class="{
            'is-invalid':
              $v.form.isRegisteredToVote.$dirty &&
              $v.form.isRegisteredToVote.$error,
          }"
        >
        </base-radio-group>
        <!-- Error message -->
        <b-form-invalid-feedback v-if="!$v.form.isRegisteredToVote.required">
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <!-- selectStateRegisteredToVote -->
    <div class="col-12 mt-space-sm p-0" v-if="isRegisteredToVote">
      <b-form-group
        data-cy="arizona-residency-select-state-registered-to-vote"
        id="group-selectStateRegisteredToVote"
        :aria-label="content.selectStateRegisteredToVote.label"
        class="mb-space-md"
        label-class="pb-0"
        label-for="selectStateRegisteredToVote"
      >
        <template #label>
          <label
            :for="`select-state-${content.selectStateRegisteredToVote.psKey}`"
            class="font-weight-bold"
          >
            {{ content.selectStateRegisteredToVote.label }}
          </label>
        </template>
        <base-select
          :id="`select-state-${content.selectStateRegisteredToVote.psKey}`"
          :options="allUsStates"
          v-model="$v.form.selectStateRegisteredToVote.$model"
          :onErrorMsg="validateSelect($v.form.selectStateRegisteredToVote)"
          :placeholderText="`${content.selectStateRegisteredToVote.placeholder}`"
          class="col-lg-5 px-0 col-12"
        ></base-select>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import formHelpers from "@/mixins/form-helpers";
import { EnumNameTypes } from "@/content/enum-ug-application";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import { BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import { mapState } from "pinia";
import { validationMixin } from "vuelidate";
import { required, requiredIf } from "vuelidate/lib/validators";
export default {
  name: "SectionVote",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        isRegisteredToVote: null,
        selectStateRegisteredToVote: null,
      },
    };
  },
  computed: {
    ...mapState(useUgApplicationStore, ["sectionVote"]),
    isRegisteredToVote() {
      return this.form.isRegisteredToVote?.value === EnumNameTypes.Yes;
    },
  },
  created() {
    this.form.isRegisteredToVote = this.sectionVote.isRegisteredToVote;
    this.form.selectStateRegisteredToVote =
      this.sectionVote.selectStateRegisteredToVote;
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
  components: {
    "base-radio-group": BaseRadioGroup,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-form-group": BFormGroup,
    "base-select": BaseSelect,
  },
  methods: {
    handleIsRegisteredToVote(val) {
      if (val?.value === EnumNameTypes.No) {
        this.form.selectStateRegisteredToVote = null;
      }
    },
  },
  validations: {
    form: {
      isRegisteredToVote: {
        required,
      },
      selectStateRegisteredToVote: {
        required: requiredIf(function () {
          return this.isRegisteredToVote;
        }),
      },
    },
  },
  mounted() {
    this.$emit("isFormInvalid", this.$v.$invalid);
  },
};
</script>

<style scoped></style>

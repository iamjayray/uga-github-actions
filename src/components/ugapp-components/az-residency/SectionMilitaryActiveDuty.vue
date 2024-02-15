<template>
  <!-- employment changes -->
  <section id="active_military" data-cy="arizona-residency-active-military">
    <div class="row">
      <!-- selectStateStationed -->
      <div class="col-12 mt-space-sm">
        <b-form-group
          data-cy="arizona-residency-select-state-stationed"
          id="group-selectStateStationed"
          :aria-label="content.selectStateStationed.label"
          class="mb-space-md"
          label-class="pb-0"
          label-for="selectStateStationed"
        >
          <template #label>
            <label
              :for="`select-state-${content.selectStateStationed.psKey}`"
              class="font-weight-bold"
            >
              {{ content.selectStateStationed.label }}
            </label>
          </template>
          <base-select
            :id="`select-state-${content.selectStateStationed.psKey}`"
            :options="allUsStates"
            @change="handleSelectStateStationedChange"
            v-model="$v.form.selectStateStationed.$model"
            :onErrorMsg="validateSelect($v.form.selectStateStationed)"
            :placeholderText="`${content.selectStateStationed.placeholder}`"
            class="col-lg-5 px-0 col-12"
          ></base-select>
        </b-form-group>
      </div>
      <!-- selectStateOfLegalResidence -->
      <div class="col-12 mt-space-sm" v-if="notStationedInAZ">
        <b-form-group
          data-cy="arizona-residency-select-state-of-legal-residence"
          id="group-selectStateOfLegalResidence"
          :aria-label="content.selectStateOfLegalResidence.label"
          class="mb-space-md"
          label-class="pb-0"
          label-for="selectStateOfLegalResidence"
        >
          <template #label>
            <label
              :for="`select-state-${content.selectStateOfLegalResidence.psKey}`"
              class="font-weight-bold"
            >
              {{ content.selectStateOfLegalResidence.label }}
            </label>
          </template>
          <base-select
            :id="`select-state-${content.selectStateOfLegalResidence.psKey}`"
            :options="allUsStates"
            v-model="$v.form.selectStateOfLegalResidence.$model"
            :onErrorMsg="validateSelect($v.form.selectStateOfLegalResidence)"
            :placeholderText="`${content.selectStateOfLegalResidence.placeholder}`"
            class="col-lg-5 px-0 col-12"
          ></base-select>
        </b-form-group>
      </div>
    </div>
  </section>
</template>

<script>
import formHelpers from "@/mixins/form-helpers";
import { BFormGroup } from "bootstrap-vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import { validationMixin } from "vuelidate";
import { required, requiredIf } from "vuelidate/lib/validators";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import { mapState } from "pinia";
import { EnumNameTypes } from "@/content/enum-ug-application";

export default {
  name: "sectionMilitaryActiveDuty",
  mixins: [validationMixin, formHelpers],
  data() {
    return {
      form: {
        selectStateStationed: null,
        selectStateOfLegalResidence: null,
      },
    };
  },
  computed: {
    ...mapState(useUgApplicationStore, ["sectionMilitaryActiveDuty"]),
    notStationedInAZ() {
      return (
        this.form.selectStateStationed &&
        this.form.selectStateStationed?.value !== EnumNameTypes.AzStateCode
      );
    },
  },
  created() {
    this.form.selectStateStationed =
      this.sectionMilitaryActiveDuty?.selectStateStationed;
    this.form.selectStateOfLegalResidence =
      this.sectionMilitaryActiveDuty?.selectStateOfLegalResidence;
  },
  components: {
    "b-form-group": BFormGroup,
    "base-select": BaseSelect,
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
    allUsStates: {
      type: Array,
      default: () => [],
    },
    isFormSubmitClicked: {
      type: Boolean,
      default: false,
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
  methods: {
    handleSelectStateStationedChange(val) {
      if (val?.value === EnumNameTypes.AzStateCode) {
        this.form.selectStateOfLegalResidence = null;
      }
    },
  },
  validations: {
    form: {
      selectStateStationed: {
        required,
      },
      selectStateOfLegalResidence: {
        required: requiredIf(function () {
          return this.notStationedInAZ;
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

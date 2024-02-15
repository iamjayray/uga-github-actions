<template>
  <section
    class="financial-support"
    data-cy="arizona-residency-financial-support"
  >
    <div class="row">
      <!-- introduction -->
      <div class="col-md-10 col-12 mt-space-sm">
        <h3 class="h3-small">
          {{ content.title }}
          <span
            class="ml-space-xs tool-tip-icon"
            tabindex="0"
            v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
            :title="content.tooltip"
          >
            <font-awesome-icon
              icon="fa-sharp fa-solid fa-circle-info"
              size="xl"
              class="fa-icon text-dark-1"
            />
          </span>
        </h3>
        <p class="mt-space-sm" v-html="content.text"></p>
      </div>
    </div>
    <div
      data-cy="arizona-residency-financial-table"
      class="financial-table"
      :class="{
        'is-invalid': $v.$dirty && ($v.total.$invalid || $v.form.$invalid),
      }"
    >
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>% of support</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(source, index) in financialSource" :key="index">
            <td>
              <label :for="`input-${source.value}`">{{ source.text }}</label>
            </td>
            <td class="position-relative">
              <b-form-group
                :id="`group-${source.value}`"
                :aria-label="`enter ${source.text}`"
                class="mb-0"
              >
                <b-form-input
                  :id="`input-${source.value}`"
                  @keydown="handleKeyDown"
                  @focus="handleFocus(source.value)"
                  @blur="handleInput(source.value)"
                  class="financial-form-control text-center"
                  type="text"
                  v-model="form[source.value]"
                  :state="getInputState(source.value)"
                ></b-form-input>
              </b-form-group>
            </td>
          </tr>
          <tr class="ignore-border">
            <td class="py-0 bg-white"></td>
            <td class="py-0">
              <div class="d-flex justify-content-between">
                <p class="text-small text-dark-3">Total sum</p>
                <p class="text-small text-dark-3">
                  {{ total }}
                  <span v-if="total === 100">
                    <font-awesome-icon
                      icon="fa-sharp fa-solid fa-circle-check"
                      class="fa-icon text-success"
                    ></font-awesome-icon>
                  </span>
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Table errors -->
      <b-form-invalid-feedback
        class="position-relative"
        :force-show="errorMessages.length > 0"
      >
        <ul class="list-unstyled mb-0">
          <li v-for="msg in errorMessages" :key="msg">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            {{ msg }}
          </li>
        </ul>
      </b-form-invalid-feedback>
    </div>
    <template v-if="isOtherOptionsShown">
      <b-form-group
        data-cy="arizona-residency-other-options"
        :label="otherOptions.label"
        labelClass="font-weight-bold mb-space-xs"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-checkbox-group
          v-model="groupOtherSelect"
          @change="handleGroupOtherSelect"
          :state="
            $v.groupOtherSelect.$dirty ? !$v.groupOtherSelect.$invalid : null
          "
          :options="
            otherOptions.map((option) => {
              return { text: option.text, value: option.value };
            })
          "
          :aria-describedby="ariaDescribedby"
          stacked
        ></b-form-checkbox-group>
      </b-form-group>
      <template v-if="isNotaShown">
        <div class="col-lg-5 col-12 p-0">
          <b-form-group
            :id="`group-inputOtherSourceNota`"
            :label="content.otherOptions.inputOtherSourceNota.label"
            label-class="font-weight-bold mb-space-xs"
            :aria-label="`enter ${content.otherOptions.inputOtherSourceNota.label}`"
            label-for="input-inputOtherSourceNota"
            class="mb-0"
            data-cy="arizona-residency-custom-support-source-input"
          >
            <b-form-input
              :id="`input-inputOtherSourceNota`"
              type="text"
              v-model.trim="$v.inputOtherSourceNota.$model"
              :state="
                $v.inputOtherSourceNota.$dirty
                  ? !$v.inputOtherSourceNota.$error
                  : null
              "
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.inputOtherSourceNota.required">
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation"
                size="xs"
              />
              This is a required field.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback
              v-else-if="!$v.inputOtherSourceNota.maxLength"
            >
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation"
                size="xs"
              />
              Should not be more than 1000 characters.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
      </template>
    </template>
  </section>
</template>

<script>
import {
  BFormCheckboxGroup,
  BFormGroup,
  BFormInput,
  VBTooltip,
  BFormInvalidFeedback,
} from "bootstrap-vue";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import { mapState } from "pinia";
import { validationMixin } from "vuelidate";
import { requiredIf, integer, maxLength } from "vuelidate/lib/validators";
import { EnumNameTypes } from "@/content/enum-ug-application";

export default {
  name: "SectionFinancialSupport",
  components: {
    "b-form-checkbox-group": BFormCheckboxGroup,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  data() {
    return {
      form: {},
      groupOtherSelect: [],
      inputOtherSourceNota: null,
      total: 0,
    };
  },
  mixins: [validationMixin],
  validations: {
    form: {
      inputParentOrGuardianSupport: {
        required: requiredIf(function () {
          return this.isTaxClaimedAsDependent === EnumNameTypes.Yes;
        }),
        minValue: function (value) {
          return this.isTaxClaimedAsDependent === EnumNameTypes.Yes
            ? value >= 50
            : true;
        },
        integer,
      },
      inputEmploymentSupport: {
        integer,
      },
      inputFinancialAidSupport: {
        integer,
      },
      inputSpouseSupport: {
        integer,
      },
      inputOtherSourceSupport: {
        integer,
      },
    },
    inputOtherSourceNota: {
      required: requiredIf(function () {
        return this.form.inputOtherSourceSupportOther === EnumNameTypes.Yes;
      }),
      maxLength: maxLength(1000),
    },
    total: {
      maxValue: function (value) {
        return value == 100;
      },
    },
    groupOtherSelect: {
      required: requiredIf(function () {
        return this.form.inputOtherSourceSupport > 0;
      }),
    },
  },
  props: {
    isFormSubmitClicked: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Object,
      default: () => {},
    },
    isTaxClaimedAsDependent: {
      type: String,
      default: EnumNameTypes.No,
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    disableParentInput: {
      type: Boolean,
      default: true,
    },
    directives: {
      "b-tooltip": VBTooltip,
    },
  },
  computed: {
    ...mapState(useUgApplicationStore, ["sectionFinancialSupport"]),
    isNotaShown() {
      return this.form.inputOtherSourceSupportOther === EnumNameTypes.Yes;
    },
    isOtherOptionsShown() {
      return Number(this.form?.inputOtherSourceSupport) > 0;
    },
    otherOptions() {
      return this.content.otherOptions.source;
    },
    financialSource() {
      return this.content.source;
    },
    errorMessages() {
      const errors = [];
      if (
        this.$v.form.inputParentOrGuardianSupport.$dirty &&
        !this.$v.form.inputParentOrGuardianSupport.required
      ) {
        errors.push("Parent or guardian support is required");
      }
      if (
        this.$v.form.inputParentOrGuardianSupport.$dirty &&
        !this.$v.form.inputParentOrGuardianSupport.minValue
      ) {
        errors.push("Parent or guardian support must be at least 50%");
      }
      if (this.$v.$dirty && !this.$v.total.maxValue) {
        errors.push("Total must be equal to 100%");
      }
      this.financialSource.forEach((item) => {
        if (
          this.$v.form[item.value].$dirty &&
          !this.$v.form[item.value].integer
        ) {
          if (
            !errors.includes("Please enter a whole number with no decimals")
          ) {
            errors.push("Please enter a whole number with no decimals");
          }
        }
      });
      return errors;
    },
  },
  watch: {
    inputOtherSourceNota: {
      handler(val) {
        this.$emit("input", {
          ...this.form,
          inputOtherSourceNota: val,
        });
      },
    },
    // change: UAA-1533
    isOtherOptionsShown(val) {
      if (!val) {
        this.groupOtherSelect = [];
        this.otherOptions.forEach((option) => {
          // delete values from the form if the other options are not shown
          this.$delete(this.form, option.value);
        });
      }
    },
    $v: {
      handler(val) {
        this.$emit("isFormInvalid", val.$invalid);
      },
      deep: true,
    },
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
        this.updateTotal();
        this.$emit("input", val || this.form);
      },
      deep: true,
    },
    value: {
      handler(val) {
        this.form = val || {};
      },
      immediate: true,
    },
    isTaxClaimedAsDependent(newValue) {
      const formData = { ...this.form };
      if (
        newValue === EnumNameTypes.Yes &&
        !formData.inputParentOrGuardianSupport
      ) {
        formData.inputParentOrGuardianSupport = 50;
      }
      this.form = formData;
    },
  },
  created() {
    const formData = { ...this.sectionFinancialSupport };
    // presetting the financial source to 0 by default
    this.financialSource.forEach((source) => {
      if (!formData[source.value]) {
        formData[source.value] = 0;
      }
    });
    this.form = { ...formData };
    this.inputOtherSourceNota =
      this.sectionFinancialSupport?.inputOtherSourceNota;
    // add all the other options to the groupOtherSelect if its on the form
    this.groupOtherSelect = this.otherOptions
      .filter((option) => this.form[option.value] === EnumNameTypes.Yes)
      .map((option) => option.value);

    if (this.isTaxClaimedAsDependent === EnumNameTypes.Yes) {
      this.form.inputParentOrGuardianSupport = 50;
    }
  },
  methods: {
    handleInput(source) {
      // Using parseInt to remove the leading zeros in the input
      if (this.form[source]) {
        this.form[source] = parseInt(this.form[source]);
      }
      if (this.form[source] === "") {
        this.form[source] = 0;
      }
    },
    handleFocus(value) {
      if (this.form[value] === 0) {
        this.form[value] = "";
      }
    },
    handleKeyDown(e) {
      // regex to allow only numbers and decimal
      if (
        !/^[0-9]*\.?[0-9]*$/.test(e.key) &&
        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
          e.key
        )
      ) {
        e.preventDefault();
      }
    },
    updateTotal() {
      this.$v.total.$model = this.financialSource.reduce((acc, curr) => {
        if (this.form[curr.value] && !isNaN(this.form[curr.value])) {
          acc += parseFloat(this.form[curr.value]);
        }
        return acc;
      }, 0);
    },
    handleGroupOtherSelect(current) {
      this.otherOptions.map((option) => {
        if (current.includes(option.value)) {
          this.$set(this.form, option.value, EnumNameTypes.Yes);
        } else {
          this.$set(this.form, option.value, EnumNameTypes.No);
        }
      });
    },
    getInputState(source) {
      if (this.$v.form[source]) {
        this.$v.form[source].$touch();
        return this.$v.form[source].$dirty && this.$v.form[source].$error
          ? !this.$v.form[source].$error
          : null;
      }
    },
  },
  mounted() {
    this.$emit("isFormInvalid", this.$v.$invalid);
  },
};
</script>

<style lang="scss" scoped>
.financial-form-control {
  height: 36px;
  padding: 5px;
  font-size: 14px;
}

thead {
  border: 2px solid #ebebeb;
}
.table-main-border {
  border: 2px solid #ebebeb;
}

tr {
  th,
  td {
    padding: 0.9rem;
  }
  td:nth-of-type(1),
  th:nth-of-type(1) {
    background: var(--light-2);
    border-left: 2px solid var(--light-1);
  }
  td:nth-of-type(2),
  th:nth-of-type(2) {
    border-right: 2px solid var(--light-1);
  }
}
.text-small {
  font-size: 12px;
}
.ignore-border {
  td {
    border: 0 !important;
    padding-top: 0.5rem !important;
    border-top: 2px solid var(--light-1) !important;
  }
}
.is-invalid {
  th,
  thead,
  td {
    border-color: var(--danger) !important;
  }
}
</style>

<template>
  <div :class="{ 'is-invalid': onErrorMsg.length > 0 }">
    <v-select
      v-model="selected"
      :options="options"
      :show-labels="false"
      :allow-empty="selectAllowEmpty"
      label="text"
      track-by="value"
      :placeholder="placeholderText"
      :multiple="isMultiSelect"
      :pushTags="true"
      :close-on-select="!isMultiSelect"
      :clear-on-select="!isMultiSelect"
      @option:selected="handleSelect"
      @option:deselecting="handleRemove"
      @open="handleDropdownOpen('open')"
      @close="handleDropdownClose('close')"
      @search="handleSearch"
      :append-to-body="true"
      :disabled="isDisabled"
    >
      <!-- If multiSelect, showing the total number of options selected in place of placeholder -->
      <template v-if="isMultiSelect" #selected-option="{ text }">
        {{ text }}
      </template>
      <!-- END -->
    </v-select>
    <b-form-invalid-feedback
      :force-show="onErrorMsg.length > 0"
      :class="invalidFeedbackClass"
    >
      <ul class="list-unstyled mb-0">
        <li v-for="msg in onErrorMsg" :key="msg">
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          {{ msg }}
        </li>
      </ul>
    </b-form-invalid-feedback>
  </div>
</template>

<script>
import { BFormInvalidFeedback } from "bootstrap-vue";
import * as _ from "lodash";
import vSelect from "vue-select";
export default {
  name: "BaseSelect",
  components: {
    "v-select": vSelect,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  props: {
    value: {
      // Helps with 2way binding
      // { text: "Option 1", value: "option1" } OR  [{ text: "Option 1", value: "option1" },{ text: "Option 2", value: "option2" },...]  or null
      type: [Object, Array],
      default: null,
    },
    isMultiSelect: {
      type: Boolean,
      default: false,
    },
    // Options for all select box must be an array null will be an error from the component
    options: {
      // [{ text: "Option 1", value: "option1" },{ text: "Option 2", value: "option2" },...]
      type: Array,
      required: true,
    },
    placeholderText: {
      type: String,
      default: "Choose one...",
    },
    onErrorMsg: {
      type: Array,
      default: () => [],
    },
    // Only for multiselect to show when options are selected
    selectAllowEmpty: {
      type: Boolean,
      default: false,
    },
    invalidFeedbackClass: {
      type: String,
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selected: {
      get() {
        // Checking if the v-model value prop value is empty object/array
        return this.value;
      },
      set(newValue) {
        //{ text: "Option 1", value: "option1" } OR an array of objects: [{ text: "Option 1", value: "option1" },{ text: "Option 2", value: "option2" },...]
        if (!this.isMultiSelect) {
          this.$emit("input", newValue);
          this.$emit("change", newValue);
        } else {
          this.$emit("input", _.cloneDeep(newValue));
          this.$emit("change", _.cloneDeep(newValue));
        }
      },
    },
  },
  methods: {
    handleSelect(selectedOption) {
      this.$emit("select", selectedOption);
    },
    handleRemove(removedOption) {
      this.$emit("remove", removedOption);
    },
    handleDropdownOpen(state) {
      this.$emit("dropdown-toggle", state);
    },
    handleDropdownClose(state) {
      this.$emit("dropdown-toggle", state);
    },
    handleSearch(query) {
      this.$emit("search", query);
    },
  },
};
</script>

<style lang="scss" scoped></style>

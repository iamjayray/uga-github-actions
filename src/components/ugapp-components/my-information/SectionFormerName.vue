<template>
  <div class="row">
    <div class="col-12">
      <h3 class="h3-large mb-space-xs pb-0 mb-lg-space-sm d-flex">
        <span class="my-auto">{{ compData.label }}</span>
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
      <p
        class="text-dark-2 text-large mb-space-sm mb-lg-space-md pb-lg-space-xxxs"
      >
        {{ compData.text }}
      </p>
      <!-- former/alternate names table -->
      <template v-if="isFormerDetailTableVisible">
        <div class="col-12 col-lg-6 px-0 pb-space-xs">
          <table class="table" data-cy="my-info-former-name-table">
            <thead>
              <tr
                class="font-weight-bold border-bottom pb-space-xxs mb-space-md"
              >
                <th scope="col" colspan="2" class="border-top-0">
                  {{ compData.namesTabelLabel }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(name, index) in formerNameDetails">
                <tr
                  v-if="isFormerNameValueVisible(name.type)"
                  :key="`former-name-${name.firstName}-${index}`"
                >
                  <td class="border-0 text-wrap text-break">
                    {{ name.firstName }}
                    {{ name.lastName }}
                  </td>
                  <td class="ml-auto border-0 d-flex">
                    <a
                      href="javascript:void(0)"
                      class="edit-underline btn btn-link p-0 ml-auto rounded-0"
                      @click="handleEditformerNameClick(index)"
                    >
                      <font-awesome-icon icon="fa-pencil" />
                      Edit
                    </a>
                    <a
                      href="javascript:void(0)"
                      class="text-dark-3 ml-space-xs"
                      @click="handleRemoveformerNameClick(index)"
                      aria-label="delete formar name"
                    >
                      <font-awesome-icon icon="fa-circle-xmark" />
                    </a>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </template>
      <!-- Former name inputs -->
      <template v-if="isformerNameSectionVisible">
        <div class="col-12 col-lg-5 px-0 pr-lg-gutter">
          <!-- First name -->
          <b-form-group
            id="group_former_first_name"
            :aria-label="compData.firstName.label"
            label-class="pb-0"
            class="mb-space-md"
            data-cy="my-info-former-name-first-name-group"
          >
            <template #label>
              <label
                for="former_first_name_input"
                class="mb-space-xs mb-lg-space-sm"
              >
                <h3 class="h3-small">
                  {{ compData.firstName.label }}
                </h3>
              </label>
            </template>
            <b-form-input
              id="former_first_name_input"
              class="text-dark-1 text-large"
              placeholder="Enter your former or alternate first name"
              v-model="$v.formerName.firstName.$model"
              :state="
                $v.formerName.firstName.$dirty
                  ? !$v.formerName.firstName.$error
                  : null
              "
            >
            </b-form-input>
            <template
              v-for="error in nameErrorMsg(
                $v.formerName.firstName,
                'first name'
              )"
            >
              <b-form-invalid-feedback :key="`last_name_${error}`">
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                {{ error }}
              </b-form-invalid-feedback>
            </template>
          </b-form-group>
          <!-- Last name -->
          <b-form-group
            id="group_former_last_name"
            :aria-label="compData.lastName.label"
            label-class="pb-0"
            class="mb-space-sm"
            data-cy="my-info-former-name-last-name-group"
          >
            <template #label>
              <label
                for="former_first_name_input"
                class="mb-space-xs mb-lg-space-sm pt-space-xs"
              >
                <h3 class="h3-small">
                  {{ compData.lastName.label }}
                </h3>
              </label>
            </template>
            <b-form-input
              id="former_last_name_input"
              class="text-dark-1 text-large"
              placeholder="Enter your former or alternate last name"
              v-model="$v.formerName.lastName.$model"
              :state="
                $v.formerName.lastName.$dirty
                  ? !$v.formerName.lastName.$error
                  : null
              "
            >
            </b-form-input>
            <template
              v-for="error in nameErrorMsg($v.formerName.lastName, 'last name')"
            >
              <b-form-invalid-feedback :key="`last_name_${error}`">
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                {{ error }}
              </b-form-invalid-feedback>
            </template>
          </b-form-group>
          <!-- Save and cancle buttons -->
          <div class="mt-space-lg d-flex">
            <button
              class="btn btn-white text-dark-1 mr-space-xs mr-lg-space-md ml-auto"
              @click="handleformerCancleClick"
              data-cy="my-info-former-name-cancel-form-button"
            >
              {{ compData.cancelCtaLabel }}
            </button>
            <button
              class="btn btn-dark-3 text-white"
              @click="handleformerSaveClick"
              data-cy="my-info-former-name-save-form-button"
            >
              {{ compData.saveCtaLabel }}
            </button>
          </div>
          <div class="col-12">
            <!-- Error message to click on save button -->
            <b-form-invalid-feedback
              :force-show="
                $v.formerName.$dirty &&
                !$v.formerName.$invalid &&
                footerSaveButtonClicked
              "
              :class="{
                'is-invalid':
                  $v.formerName.$dirty &&
                  !$v.formerName.$invalid &&
                  footerSaveButtonClicked,
              }"
            >
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation "
                size="xs"
              />
              Click on save to add the former or alternate name(s).
            </b-form-invalid-feedback>
          </div>
        </div>
      </template>
      <template v-else>
        <button
          :disabled="isAddFormerNameButtonDisabled"
          class="btn btn-white border border-light-4 text-dark-2 px-space-sm d-flex"
          @click="handleNewformerNameClick"
          data-cy="my-info-former-name-add-new-button"
        >
          <font-awesome-icon
            icon="fa-circle-plus"
            class="fa-lg mr-space-xxs text-dark-1 py-space-xxxs"
          />
          <span class="my-auto">{{ compData.addNameCtaLabel }}</span>
        </button>
        <p
          v-if="isAddFormerNameButtonDisabled"
          class="mt-space-xs mb-0 text-danger"
          data-cy="my-info-former-name-max-limit-message"
        >
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
            class="mr-space-xxxs"
          />Reached maximum limit
        </p>
      </template>

      <!-- confirm delete model -->
      <b-modal
        ref="former-name-confirm-delete-modal"
        centered
        hide-header
        hide-footer
        body-class="p-0"
        :no-close-on-backdrop="true"
        :no-close-on-esc="true"
        data-cy="my-info-former-name-confirm-delete-modal"
      >
        <div class="model-content p-space-md">
          <!-- row: cancel button -->
          <div class="row model-close-button position-absolute">
            <div class="col-12">
              <a
                href="javascript:void(0)"
                @click="handleConfirmDeleteModalClose"
                class="d-flex flex-row justify-content-end align-items-center mt-space-md mr-space-md"
                data-cy="my-info-former-name-modal-close-cross-button"
                aria-label="close modal"
              >
                <font-awesome-icon
                  icon="xmark"
                  class="text-light-5"
                  size="2x"
                ></font-awesome-icon>
              </a>
            </div>
          </div>
          <!-- row: content -->
          <div class="row mt-space-md">
            <div class="col-12">
              <h2 class="h2-medium">Are you sure you want to delete?</h2>
              <p class="mt-space-md mb-0">This action cannot be undone.</p>
              <hr class="my-space-lg" />
              <div class="d-flex justify-content-end">
                <button
                  class="btn btn-white p-0 text-dark-1"
                  @click="handleConfirmDeleteModalClose"
                  data-cy="my-info-former-name-modal-close-button"
                >
                  Cancel
                </button>
                <button
                  @click="handleConfirmDeleteClick"
                  class="ml-space-md btn btn-dark-3 text-white px-space-xs"
                  data-cy="my-info-former-name-modal-delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import {
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  VBTooltip,
  BModal,
} from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import { requiredIf, maxLength } from "vuelidate/lib/validators";
import { MyInfoConstants } from "@/content/enum-ug-application.js";
import { useUserStore } from "@/stores/user-store.js";
import { mapState } from "pinia";
export default {
  name: "SectionFormerName",
  mixins: [validationMixin],
  directives: {
    "b-tooltip": VBTooltip,
  },
  props: {
    // Helps with two way binding of data
    value: {
      type: Array,
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
    "b-modal": BModal,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  data() {
    return {
      isformerNameSectionVisible: false,
      formerNameEditIndex: null,
      formerNameDeleteIndex: null,
      isformerNameEditing: false,
      footerSaveButtonClicked: false,
      formerName: { firstName: null, lastName: null },
    };
  },
  validations: {
    formerName: {
      firstName: {
        required: requiredIf(function () {
          return this.isformerNameSectionVisible;
        }),
        validName: function (value) {
          return /^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(value);
        },
        duplicateFormerName: function () {
          return (
            !this.isformerNameSectionVisible ||
            !this.isDuplicateFormerNameEntered
          );
        },
        maxLength: maxLength(25),
      },
      lastName: {
        required: requiredIf(function () {
          return this.isformerNameSectionVisible;
        }),
        validName: function (value) {
          return /^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(value);
        },
        duplicateFormerName: function () {
          return (
            !this.isformerNameSectionVisible ||
            !this.isDuplicateFormerNameEntered
          );
        },
        maxLength: maxLength(30),
      },
    },
  },
  watch: {
    isFormSubmitClicked(newValue) {
      if (newValue && this.isformerNameSectionVisible) {
        this.$v.formerName.$touch();
        this.footerSaveButtonClicked = true;
      }
    },
    isformerNameSectionVisible() {
      this.updateComponentErrorState();
    },
  },
  computed: {
    ...mapState(useUserStore, {
      userLegalName: "legalName",
    }),
    formerNameDetails: {
      get() {
        if (this.value) {
          return this.value;
        } else {
          return [];
        }
      },
      set() {},
    },
    isAddFormerNameButtonDisabled() {
      const formerDetails = this.formerNameDetails.filter(
        (name) => !name.type || name.type !== MyInfoConstants.typeDelete
      );
      return formerDetails.length >= 10;
    },
    isFormerDetailTableVisible() {
      const formerDetails = this.formerNameDetails.filter(
        (name) => !name.type || name.type !== MyInfoConstants.typeDelete
      );
      return formerDetails.length > 0 && !this.isformerNameEditing;
    },
    isDuplicateFormerNameEntered() {
      const formerDetails = this.formerNameDetails.filter(
        (name, index) =>
          (!name.type || name.type !== MyInfoConstants.typeDelete) &&
          (!this.isformerNameEditing || this.formerNameEditIndex !== index)
      );
      let response = formerDetails.some(
        (item) =>
          item.firstName === this.formerName.firstName &&
          item.lastName === this.formerName.lastName
      );
      // checking if the former name entered is same as legal name
      if (
        this.userLegalName.firstName === this.formerName.firstName &&
        this.userLegalName.lastName === this.formerName.lastName
      ) {
        response = true;
      }
      return response;
    },
  },
  methods: {
    handleConfirmDeleteModalClose() {
      this.$refs["former-name-confirm-delete-modal"].hide();
    },
    handleConfirmDeleteClick() {
      this.$refs["former-name-confirm-delete-modal"].hide();

      let filteredFormerName = null;
      if (this.formerNameDetails[this.formerNameDeleteIndex].id) {
        // setting the type to delete as this needs to be deleted from the database during save
        filteredFormerName = [...this.formerNameDetails];
        filteredFormerName[this.formerNameDeleteIndex].type =
          MyInfoConstants.typeDelete;
      } else {
        filteredFormerName = this.formerNameDetails.filter(
          (name, index) => index !== this.formerNameDeleteIndex
        );
      }
      this.$emit("input", filteredFormerName);
    },

    handleNewformerNameClick() {
      this.isformerNameSectionVisible = true;
      this.$track({
        event: "collapse",
        action: "open",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "former or alternate name(s)",
        text: "add a former name",
      });
    },
    handleformerSaveClick() {
      this.$v.formerName.$touch();
      if (this.$v.formerName.$anyError) {
        return;
      }
      this.isformerNameSectionVisible = false;
      const formerNameData = [...this.formerNameDetails];
      if (!this.isformerNameEditing) {
        // adding the type to new so that it can be pushed to database while saving
        formerNameData.push({
          ...this.formerName,
          type: MyInfoConstants.typeNew,
        });
      } else {
        formerNameData[this.formerNameEditIndex] = this.formerName;
        if (formerNameData[this.formerNameEditIndex].id) {
          // Setting the type to update if the id exists (Former name is already present in database)
          formerNameData[this.formerNameEditIndex].type =
            MyInfoConstants.typeUpdate;
        } else {
          // If the former name is added newly and updated again keeping the type to new as it need to be added newly to database
          formerNameData[this.formerNameEditIndex].type =
            MyInfoConstants.typeNew;
        }
        this.isformerNameEditing = false;
      }
      // Emitting the updated data to v-model
      this.$emit("input", formerNameData);
      this.resetFormerNameDetails();
    },
    handleformerCancleClick() {
      this.isformerNameSectionVisible = false;
      this.isformerNameEditing = false;
      this.resetFormerNameDetails();
    },
    handleRemoveformerNameClick(pos) {
      this.formerNameDeleteIndex = pos;
      this.$refs["former-name-confirm-delete-modal"].show();
    },
    handleEditformerNameClick(index) {
      Object.assign(this.formerName, this.formerNameDetails[index]);
      this.formerNameEditIndex = index;
      this.isformerNameEditing = true;
      this.isformerNameSectionVisible = true;
    },
    updateComponentErrorState() {
      if (this.isformerNameSectionVisible || this.$v.formerName.$invalid) {
        // component has error fields
        this.$emit("updateErrorState", true);
      } else {
        // component has no error fields
        this.$emit("updateErrorState", false);
      }
    },
    resetFormerNameDetails() {
      this.formerName = { firstName: null, lastName: null };
      this.$v.formerName.$reset();
      this.footerSaveButtonClicked = false;
    },
    isFormerNameValueVisible(type) {
      return type !== MyInfoConstants.typeDelete;
    },
    nameErrorMsg(error, nameType) {
      const errMsg = [];
      if (error.$dirty && !error.required) {
        errMsg.push("This is a required field.");
      } else if (error.$dirty && !error.validName) {
        errMsg.push(
          "The former/alternate " +
            nameType +
            " can only contain letters, spaces and hyphens (-)."
        );
      } else if (error.$dirty && !error.duplicateFormerName) {
        errMsg.push("Name already exists enter a different name.");
      } else if (error.$dirty && !error.maxLength) {
        const maxLength = nameType === "first name" ? "25" : "30";
        errMsg.push(
          "The " +
            nameType +
            " should not be more than " +
            maxLength +
            " characters."
        );
      }
      return errMsg;
    },
  },
  mounted() {
    this.updateComponentErrorState();
  },
};
</script>

<style lang="scss" scoped>
.edit-underline {
  border-bottom: 2px solid var(--primary);
  line-height: normal;
}
.model-close-button {
  right: 0px;
  top: 0px;
}
.model-content {
  border-bottom: 8px solid var(--secondary);
}
</style>

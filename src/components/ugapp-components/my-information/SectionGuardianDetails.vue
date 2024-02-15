<template>
  <div class="row">
    <div class="col-12">
      <h3 class="h3-large d-flex mb-space-sm">
        <span class="my-auto"> {{ compData.label }}</span>
        <span
          class="my-auto ml-space-xxs ml-lg-space-sm bg-light-3 text-xs px-space-xxs py-lg-space-xxxs"
        >
          Optional
        </span>
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
    </div>
    <!-- Parent or legal guardian table -->
    <template v-if="isGuardianTableVisible">
      <div class="col-12 pb-space-xs mt-space-xs">
        <div class="row">
          <div class="col-12 col-lg-6">
            <table
              class="table"
              data-cy="my-info-parent-legal-guardian-details-table"
            >
              <thead>
                <tr
                  class="font-weight-bold border-bottom pb-space-xxs mb-space-md"
                >
                  <th scope="col" colspan="2" class="border-top-0">
                    {{ compData.tabelLabel }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(name, index) in legalGuardianDetails">
                  <tr
                    v-if="isGuardianNameValueVisible(name.type)"
                    :key="`guardian-name-${name.firstName}-${index}`"
                  >
                    <td class="border-0 text-wrap text-break">
                      {{ name.firstName }}
                      {{ name.lastName }}
                    </td>
                    <td class="ml-auto border-0 d-flex">
                      <a
                        href="javascript:void(0)"
                        class="edit-underline btn btn-link p-0 ml-auto rounded-0"
                        @click="handleEditGuardianDetailsClick(index)"
                      >
                        <font-awesome-icon icon="fa-pencil" />
                        Edit
                      </a>
                      <a
                        href="javascript:void(0)"
                        class="text-dark-3 ml-space-xs"
                        @click="handleRemoveGuardianDetailsClick(index)"
                        aria-label="delete guardian detail"
                      >
                        <font-awesome-icon icon="fa-circle-xmark" />
                      </a>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
    <!-- Input fields -->
    <template v-if="isGuardianDetailsFormVisible">
      <!-- First name-->
      <div class="col-12 col-lg-5 mr-lg-gutter">
        <b-form-group
          id="group_guardian_first_name"
          :aria-label="`Guardian ${compData.firstnameLabel}`"
          label-class="pb-0"
          class="mb-space-md mb-lg-space-sm position-relative"
          data-cy="my-info-parent-legal-guardian-first-name-group"
        >
          <template #label>
            <label
              for="guardian_first_name_input"
              class="mb-space-xxs mb-lg-space-xs"
            >
              <h3 class="h3-small">
                {{ compData.firstnameLabel }}
              </h3>
            </label>
          </template>
          <b-form-input
            id="guardian_first_name_input"
            placeholder="Enter your text"
            autocomplete="off"
            name="guardian_fn_input"
            v-model.trim="$v.guardianDetails.firstName.$model"
            :state="
              $v.guardianDetails.firstName.$dirty
                ? !$v.guardianDetails.firstName.$error
                : null
            "
            aria-describedby="input-live-help input-live-feedback"
          >
          </b-form-input>
          <b-form-invalid-feedback
            v-if="!$v.guardianDetails.firstName.required"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            v-else-if="!$v.guardianDetails.firstName.validName"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            The first name can only contain letters and hyphens (-).
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            v-else-if="!$v.guardianDetails.firstName.maxLength"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            The first name should not be more than 50 characters.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <!-- Last name -->
      <div class="col-12 col-lg-5 ml-lg-gutter">
        <b-form-group
          id="group_guardian_last_name"
          :aria-label="`Guardian ${compData.lastNameLabel}`"
          label-class="pb-0"
          class="mb-space-md mb-lg-space-sm position-relative"
          data-cy="my-info-parent-legal-guardian-last-name-group"
        >
          <template #label>
            <label
              for="guardian_last_name_input"
              class="mb-space-xxs mb-lg-space-xs"
            >
              <h3 class="h3-small">
                {{ compData.lastNameLabel }}
              </h3>
            </label>
          </template>
          <b-form-input
            id="guardian_last_name_input"
            placeholder="Enter your text"
            autocomplete="off"
            name="guardian_lat_input"
            v-model.trim="$v.guardianDetails.lastName.$model"
            :state="
              $v.guardianDetails.lastName.$dirty
                ? !$v.guardianDetails.lastName.$error
                : null
            "
            aria-describedby="input-live-help input-live-feedback"
          >
          </b-form-input>
          <b-form-invalid-feedback v-if="!$v.guardianDetails.lastName.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            v-else-if="!$v.guardianDetails.lastName.validName"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            The last name can only contain letters and hyphens (-).
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            v-else-if="!$v.guardianDetails.lastName.maxLength"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            The last name should not be more than 50 characters.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <!-- Is this person living? -->
      <div class="col-12">
        <b-form-group
          id="group_guardian_is_living"
          :aria-label="compData.isLiving.label"
          label-class="pb-0"
          class="mb-space-sm position-relative"
          data-cy="my-info-parent-legal-guardian-is-living-group"
        >
          <template #label>
            <label for="guardian_is_living_radio">
              <h3 class="h3-small">
                {{ compData.isLiving.label }}
              </h3>
            </label>
          </template>
          <base-radio-group
            name="guardian_is_living_radio"
            :options="compData.isLiving.options"
            v-model="$v.guardianDetails.isLiving.$model"
            aria-describedby="input-live-help input-live-feedback"
            :class="{
              'is-invalid':
                $v.guardianDetails.isLiving.$dirty &&
                $v.guardianDetails.isLiving.$error,
            }"
            @change="handleIsLivingRadioChange"
          >
          </base-radio-group>
          <b-form-invalid-feedback v-if="!$v.guardianDetails.isLiving.required">
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <template v-if="guardianDetails.isLiving">
        <!-- Email and phone number -->
        <template v-if="isEmailAndPhoneInputsVisible">
          <!-- Email address -->
          <div class="col-12 col-lg-5 mr-lg-gutter mb-space-sm">
            <b-form-group
              id="group_guardian_email"
              :aria-label="compData.emailAddressLabel"
              label-class="pb-0"
              class="mb-0 mt-space-xxs position-relative"
              data-cy="my-info-parent-legal-guardian-email-group"
            >
              <template #label>
                <label
                  for="guardian_email_input"
                  class="mb-space-xxs mb-lg-space-xs"
                >
                  <h3 class="h3-small d-flex">
                    <span class="my-auto">{{
                      compData.emailAddressLabel
                    }}</span>
                    <span
                      class="ml-space-sm my-auto bg-light-3 text-xs px-space-xxs py-lg-space-xxxs"
                      >Optional</span
                    >
                  </h3>
                </label>
              </template>
              <b-form-input
                id="guardian_email_input"
                placeholder="Enter your text"
                autocomplete="off"
                name="guardian_eml_input"
                v-model.trim="$v.guardianDetails.email.$model"
                :state="
                  $v.guardianDetails.email.$dirty &&
                  $v.guardianDetails.email.$error
                    ? false
                    : null
                "
                aria-describedby="input-live-help input-live-feedback"
              >
              </b-form-input>
              <b-form-invalid-feedback v-if="!$v.guardianDetails.email.email">
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                Please enter a valid email
              </b-form-invalid-feedback>
              <b-form-invalid-feedback
                v-else-if="!$v.guardianDetails.email.maxLength"
              >
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                Should not be more than 50 characters.
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
          <!-- Phone number -->
          <div class="col-12 col-lg-5 ml-lg-gutter mb-space-sm">
            <b-form-group
              id="group_guardian_phone_number"
              :aria-label="compData.phoneNumberLabel"
              label-class="pb-0"
              class="mb-0 mt-space-xxs position-relative"
              data-cy="my-info-parent-legal-guardian-phone-number-group"
            >
              <template #label>
                <label
                  for="guardian_phone_number_input"
                  class="mb-space-xxs mb-lg-space-xs"
                >
                  <h3 class="h3-small d-flex">
                    <span class="my-auto">{{ compData.phoneNumberLabel }}</span>
                    <span
                      class="ml-space-sm my-auto bg-light-3 text-xs px-space-xxs py-lg-space-xxxs"
                      >Optional</span
                    >
                  </h3>
                </label>
              </template>
              <b-form-input
                id="guardian_phone_number_input"
                placeholder="0000000000"
                autocomplete="off"
                name="guardian_phn_input"
                v-model.trim="$v.guardianDetails.phoneNumber.$model"
                :state="
                  $v.guardianDetails.phoneNumber.$dirty &&
                  $v.guardianDetails.phoneNumber.$error
                    ? false
                    : null
                "
                aria-describedby="input-live-help input-live-feedback"
              >
              </b-form-input>
              <b-form-invalid-feedback
                v-if="!$v.guardianDetails.phoneNumber.maxLength"
              >
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                Should not be more than 15 characters.
              </b-form-invalid-feedback>
              <b-form-invalid-feedback
                v-else-if="!$v.guardianDetails.phoneNumber.numeric"
              >
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                This should contain only numbers.
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
        </template>
        <!-- guardianRelation -->
        <div class="col-12 col-lg-5 mr-lg-gutter">
          <b-form-group
            id="group_guardian_relation"
            :aria-label="compData.guardianRelation.label"
            label-class="pb-0"
            label-for="guardian_guardianRelation_select"
            class="mb-space-md mb-lg-space-sm position-relative"
            data-cy="my-info-parent-legal-guardian-relation-group"
          >
            <template #label>
              <label
                for="guardian_guardianRelation_select"
                class="mb-space-xxs mb-lg-space-xs"
              >
                <h3 class="h3-small">
                  {{ compData.guardianRelation.label }}
                </h3>
              </label>
            </template>
            <base-select
              id="guardian_guardianRelation_select"
              :options="compData.guardianRelation.options"
              v-model="$v.guardianDetails.guardianRelation.$model"
              :onErrorMsg="selectErrorMsg($v.guardianDetails.guardianRelation)"
              :placeholderText="compData.guardianRelation.placeholder"
            ></base-select>
          </b-form-group>
        </div>
        <!-- Highest level of highestSchoolingLevel completed -->
        <div class="col-12 col-lg-5 ml-lg-gutter">
          <b-form-group
            id="group_guardian_highest_level_highestSchoolingLevel"
            :aria-label="compData.highestSchoolingLevel.label"
            label-class="pb-0"
            label-for="guardian_highestSchoolingLevel_select"
            class="mb-space-md mb-lg-space-sm position-relative"
            data-cy="my-info-parent-legal-guardian-highest-schooling-level-group"
          >
            <template #label>
              <label
                for="guardian_highestSchoolingLevel_select"
                class="mb-space-xxs mb-lg-space-xs"
              >
                <h3 class="h3-small">
                  {{ compData.highestSchoolingLevel.label }}
                </h3>
              </label>
            </template>
            <base-select
              id="guardian_highestSchoolingLevel_select"
              :options="compData.highestSchoolingLevel.options"
              v-model="$v.guardianDetails.highestSchoolingLevel.$model"
              :placeholderText="compData.highestSchoolingLevel.placeholder"
              :onErrorMsg="
                selectErrorMsg($v.guardianDetails.highestSchoolingLevel)
              "
              :selectAllowEmpty="true"
            ></base-select>
          </b-form-group>
        </div>
        <!-- Did this guardian attend ASU? -->
        <div class="col-12">
          <b-form-group
            id="group_guardian_attended_asu"
            :aria-label="compData.previousAsuStudent.label"
            label-class="pb-0"
            class="mb-space-sm position-relative"
            data-cy="my-info-parent-legal-guardian-attended-asu-group"
          >
            <template #label>
              <label for="guardian_attended_asu_radio">
                <h3 class="h3-small">
                  {{ compData.previousAsuStudent.label }}
                </h3>
              </label>
            </template>
            <base-radio-group
              name="guardian_attended_asu_radio"
              :options="compData.previousAsuStudent.options"
              v-model="$v.guardianDetails.previousAsuStudent.$model"
              :class="{
                'is-invalid':
                  $v.guardianDetails.previousAsuStudent.$dirty &&
                  $v.guardianDetails.previousAsuStudent.$error,
              }"
              aria-describedby="input-live-help input-live-feedback"
            >
            </base-radio-group>
            <b-form-invalid-feedback
              v-if="!$v.guardianDetails.previousAsuStudent.required"
            >
              <font-awesome-icon
                icon="fa-sharp fa-regular fa-circle-exclamation"
                size="xs"
              />
              This is a required field.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
      </template>
      <!-- Alert message -->
      <template v-if="isAlertMessageVisible">
        <div class="col-12 col-lg-5">
          <base-alert
            :isDismissible="false"
            alertType="error"
            :text="compData.requiredAlertMessage"
            textWeight="normal"
            textSize="small"
          ></base-alert>
        </div>
      </template>
      <!-- Save and clear all button -->
      <div class="col-12 mt-space-sm d-flex">
        <button
          class="btn btn-dark-3 text-white"
          @click="handleGuardianDetailSaveClick"
          data-cy="my-info-parent-legal-guardian-form-save-button"
        >
          Save
        </button>
        <button
          class="btn btn-white text-dark-1 ml-space-xs"
          @click="handleGuardianDetailClearFieldsClick"
          data-cy="my-info-parent-legal-guardian-form-cancel-button"
        >
          {{ isGuardinDetailsEditing ? "Cancel" : "Clear fields" }}
        </button>
      </div>
    </template>
    <!-- Add additional parent or guardian button -->
    <template v-else>
      <button
        :disabled="isAddAdditionalGuardianButtonDisabled"
        class="btn btn-white border border-light-4 text-dark-2 px-space-sm d-flex"
        @click="handleNewGuardianClick"
        data-cy="my-info-parent-legal-guardian-add-new-guardian-button"
      >
        <font-awesome-icon
          icon="fa-circle-plus"
          class="fa-lg mr-space-xxs text-dark-1 py-space-xxxs"
        />
        <span class="my-auto">{{ compData.addNewGuardianLabel }}</span>
      </button>
    </template>
    <!-- Error message to click on save button -->
    <div class="col-12 ml-gutter">
      <b-form-invalid-feedback
        :force-show="
          $v.guardianDetails.$dirty &&
          !$v.guardianDetails.$invalid &&
          footerSaveButtonClicked
        "
        :class="{
          'is-invalid':
            $v.guardianDetails.$dirty &&
            !$v.guardianDetails.$invalid &&
            footerSaveButtonClicked,
        }"
      >
        <font-awesome-icon
          icon="fa-sharp fa-regular fa-circle-exclamation"
          size="xs"
        />
        Click on save to add the guardian details.
      </b-form-invalid-feedback>
    </div>

    <!-- confirm delete model -->
    <b-modal
      ref="guardian-confirm-delete-modal"
      centered
      hide-header
      hide-footer
      body-class="p-0"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      data-cy="my-info-parent-legal-guardian-confirm-delete-modal"
    >
      <div class="model-content p-space-md">
        <!-- row: cancel button -->
        <div class="row model-close-button position-absolute">
          <div class="col-12">
            <a
              href="javascript:void(0)"
              @click="handleConfirmDeleteModalClose"
              class="d-flex flex-row justify-content-end align-items-center mt-space-md mr-space-md"
              data-cy="my-info-parent-legal-guardian-modal-close-cross-button"
              aria-label="close madal"
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
                data-cy="my-info-parent-legal-guardian-modal-close-button"
              >
                Cancel
              </button>
              <button
                @click="handleConfirmDeleteClick"
                class="ml-space-md btn btn-dark-3 text-white px-space-xs"
                data-cy="my-info-parent-legal-guardian-modal-delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
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
import {
  requiredIf,
  maxLength,
  email,
  numeric,
} from "vuelidate/lib/validators";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import { MyInfoConstants } from "@/content/enum-ug-application.js";
import * as _ from "lodash";
export default {
  name: "SectionGuardianDetails",
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
    userAge: {
      type: Number,
      default: null,
    },
    isFormSubmitClicked: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    "b-modal": BModal,
    "base-select": BaseSelect,
    "base-radio-group": BaseRadioGroup,
    "base-alert": BaseAlert,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  watch: {
    isFormSubmitClicked(newValue) {
      if (
        (newValue &&
          this.isGuardiansDetailsRequired &&
          this.isGuardianDetailsFormVisible) ||
        this.$v.$anyDirty
      ) {
        this.$v.$touch();
        this.footerSaveButtonClicked = true;
      }
    },
    $v: {
      handler() {
        this.updateComponentErrorState();
      },
      deep: true,
    },
  },
  data() {
    return {
      guardianDetails: {
        firstName: null,
        lastName: null,
        guardianRelation: null,
        highestSchoolingLevel: null,
        previousAsuStudent: null,
        isLiving: null,
        email: null,
        phoneNumber: null,
      },
      isGuardianDetailsFormVisible: true,
      guardianDetailsEditIndex: null,
      isGuardinDetailsEditing: false,
      footerSaveButtonClicked: false,
    };
  },
  validations: {
    guardianDetails: {
      firstName: {
        required: requiredIf(function () {
          return this.isGuardiansDetailsRequired;
        }),
        validName: function (value) {
          return /^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(value);
        },
        maxLength: maxLength(50),
      },
      lastName: {
        required: requiredIf(function () {
          return this.isGuardiansDetailsRequired;
        }),
        validName: function (value) {
          return /^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(value);
        },
        maxLength: maxLength(50),
      },
      isLiving: {
        required: requiredIf(function () {
          return this.isGuardiansDetailsRequired;
        }),
      },
      guardianRelation: {
        required: requiredIf(function () {
          return this.isGuardiansDetailsRequired;
        }),
      },
      highestSchoolingLevel: {
        required: requiredIf(function () {
          return this.isGuardiansDetailsRequired;
        }),
      },
      previousAsuStudent: {
        required: requiredIf(function () {
          return this.isGuardiansDetailsRequired;
        }),
      },
      email: {
        email,
        maxLength: maxLength(50),
      },
      phoneNumber: {
        numeric,
        maxLength: maxLength(15),
      },
    },
  },
  computed: {
    legalGuardianDetails: {
      get() {
        if (this.value) {
          return this.value;
        } else {
          return [];
        }
      },
      set() {},
    },
    isAddAdditionalGuardianButtonDisabled() {
      return (
        this.getGuardianDetailsLength >= 2 && !this.isGuardianDetailsFormVisible
      );
    },
    isGuardiansDetailsRequired() {
      if (
        !_.isEmpty(this.guardianDetails.firstName) ||
        !_.isEmpty(this.guardianDetails.lastName) ||
        !_.isEmpty(this.guardianDetails.isLiving)
      ) {
        return true;
      } else {
        return false;
      }
    },
    isEmailAndPhoneInputsVisible() {
      return this.guardianDetails.isLiving?.value;
    },
    isAlertMessageVisible() {
      return this.$v.guardianDetails.$dirty && this.$v.guardianDetails.$invalid;
    },
    getGuardianDetailsLength() {
      const guardianDetails = this.legalGuardianDetails.filter(
        (guardian) =>
          !guardian.type || guardian.type !== MyInfoConstants.typeDelete
      );
      return guardianDetails.length;
    },
    isGuardianTableVisible() {
      const guardianDetails = this.legalGuardianDetails.filter(
        (guardian) =>
          !guardian.type || guardian.type !== MyInfoConstants.typeDelete
      );
      return guardianDetails?.length > 0 && !this.isGuardinDetailsEditing;
    },
  },
  methods: {
    isGuardianNameValueVisible(type) {
      return type !== MyInfoConstants.typeDelete;
    },
    handleConfirmDeleteModalClose() {
      this.$refs["guardian-confirm-delete-modal"].hide();
    },
    handleConfirmDeleteClick() {
      this.$refs["guardian-confirm-delete-modal"].hide();
      let filteredDetails = null;
      if (
        this.legalGuardianDetails[this.guardianDetailsDeleteIndex].guardianId
      ) {
        // setting the type to delete as this needs to be deleted from the database during save
        filteredDetails = [...this.legalGuardianDetails];
        filteredDetails[this.guardianDetailsDeleteIndex].type =
          MyInfoConstants.typeDelete;
      } else {
        filteredDetails = this.legalGuardianDetails.filter(
          (name, index) => index !== this.guardianDetailsDeleteIndex
        );
      }
      this.$emit("input", filteredDetails);
      const guardianDetails = filteredDetails.filter(
        (guardian) =>
          !guardian.type || guardian.type !== MyInfoConstants.typeDelete
      );
      if (guardianDetails.length === 0) {
        this.isGuardianDetailsFormVisible = true;
      }
    },

    handleIsLivingRadioChange(event) {
      if (event.text === MyInfoConstants.isGuardianLivingNoValue) {
        this.guardianDetails.email = null;
        this.guardianDetails.phoneNumber = null;
      }
    },
    handleRemoveGuardianDetailsClick(pos) {
      this.guardianDetailsDeleteIndex = pos;
      this.$refs["guardian-confirm-delete-modal"].show();
    },
    handleGuardianDetailSaveClick() {
      this.$v.$touch();
      if (
        !this.isGuardiansDetailsRequired ||
        this.$v.guardianDetails.$anyError
      ) {
        return;
      }
      const guardiansData = this.legalGuardianDetails;
      if (!this.isGuardinDetailsEditing) {
        guardiansData.push({
          ...this.guardianDetails,
          type: MyInfoConstants.typeNew,
        });
      } else {
        if (guardiansData[this.guardianDetailsEditIndex].guardianId) {
          // Setting the type to update if the id exists (guardian details is already present in database)
          guardiansData[this.guardianDetailsEditIndex] = this.guardianDetails;
          guardiansData[this.guardianDetailsEditIndex].type =
            MyInfoConstants.typeUpdate;
        } else {
          // If the guardian details is added newly and updated again keeping the type to new as it need to be added newly to database
          guardiansData[this.guardianDetailsEditIndex] = this.guardianDetails;
          guardiansData[this.guardianDetailsEditIndex].type =
            MyInfoConstants.typeNew;
        }
      }
      this.$emit("input", guardiansData);
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: "parent or legal guardian",
        text: "save",
      });
      this.resetGuardianDetails();
      this.isGuardianDetailsFormVisible = false;
    },
    handleGuardianDetailClearFieldsClick() {
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: "parent or legal guardian",
        text: this.isGuardinDetailsEditing ? "cancel" : "clear fields",
      });
      this.resetGuardianDetails();
      if (this.getGuardianDetailsLength === 0) {
        this.isGuardianDetailsFormVisible = true;
      } else {
        this.isGuardianDetailsFormVisible = false;
      }
    },
    handleEditGuardianDetailsClick(index) {
      Object.assign(this.guardianDetails, this.legalGuardianDetails[index]);
      this.isGuardianDetailsFormVisible = true;
      this.guardianDetailsEditIndex = index;
      this.isGuardinDetailsEditing = true;
    },
    handleNewGuardianClick() {
      this.isGuardianDetailsFormVisible = true;
    },
    resetGuardianDetails() {
      this.guardianDetails = {
        firstName: null,
        lastName: null,
        guardianRelation: null,
        highestSchoolingLevel: null,
        previousAsuStudent: null,
        isLiving: null,
        email: null,
        phoneNumber: null,
      };
      this.isGuardinDetailsEditing = false;
      this.$v.$reset();
      this.footerSaveButtonClicked = false;
    },
    selectErrorMsg(error) {
      const errMsg = [];
      if (error.$dirty && !error.required) {
        errMsg.push("This is a required field.");
      }
      return errMsg;
    },
    updateComponentErrorState() {
      if (
        (this.isGuardianDetailsFormVisible &&
          this.isGuardiansDetailsRequired) ||
        (this.$v.$anyDirty && this.$v.$invalid)
      ) {
        // component has error fields
        this.$emit("updateErrorState", true);
      } else {
        // component has no error fields
        this.$emit("updateErrorState", false);
      }
    },
    isFormerNameValueVisible(type) {
      return type !== MyInfoConstants.typeDelete;
    },
  },
  mounted() {
    if (this.legalGuardianDetails.length >= 1) {
      this.isGuardianDetailsFormVisible = false;
    }
    this.updateComponentErrorState();
  },
};
</script>

<style lang="scss" scoped>
.model-close-button {
  right: 0px;
  top: 0px;
}
.model-content {
  border-bottom: 8px solid var(--secondary);
}
.edit-underline {
  border-bottom: 2px solid var(--primary);
  line-height: normal;
}
</style>

<template>
  <div class="row" data-cy="my-schools-high-schools">
    <div class="col-12">
      <!-- title -->
      <h3 class="h3-large d-flex mb-space-xs mb-lg-space-sm">
        <span>{{ compData.title }}</span>
        <span
          class="ml-space-xs ml-lg-space-sm tool-tip-icon"
          tabindex="0"
          v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
          :title="compData.toolTip"
        >
          <font-awesome-icon
            icon="fa-sharp fa-solid fa-circle-info"
            size="xl"
            class="fa-icon text-dark-1"
          />
        </span>
      </h3>
    </div>
    <!-- schools table -->
    <template v-if="isHighSchoolDetailTableVisible">
      <div
        class="col-12 col-lg-6"
        data-cy="my-schools-high-school-details-table"
      >
        <table class="table">
          <thead>
            <tr class="font-weight-bold border-bottom pb-space-xxs mb-space-md">
              <th scope="col" colspan="2" class="border-0">High schools</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(school, index) in highSchoolDetails">
              <tr
                v-if="isHighSchoolValueVisible(school.type, index)"
                :key="`school-${school.nameOnTranscript}-${index}`"
              >
                <td class="border-0 text-wrap text-break">
                  {{
                    school.country.value === "USA" &&
                    school.highSchool.value !==
                      "My High School is not on the list"
                      ? school.highSchool.text
                      : school.schoolName
                  }}
                </td>
                <td class="ml-auto border-0 d-flex">
                  <button
                    class="edit-underline btn btn-link p-0 ml-auto rounded-0"
                    :disabled="isSchoolDetailsEditing"
                    @click="handleEditSchoolClick(index)"
                    data-cy="my-schools-high-school-details-table-edit-school"
                  >
                    <font-awesome-icon icon="fa-pencil" />
                    Edit
                  </button>
                  <a
                    data-cy="my-schools-high-school-details-table-delete-school"
                    href="javascript:void(0)"
                    class="text-dark-3 ml-space-xs"
                    @click="handleRemoveSchoolClick(index)"
                    aria-label="delete school"
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
    <!-- high school inputs -->
    <template v-if="isSchoolInputsVisible">
      <!-- country -->
      <div class="col-12">
        <b-form-group
          data-cy="my-schools-high-school-country"
          id="group_high_school_country"
          aria-label="country"
          label-class="pb-0"
          label-for="high_school_country_select"
          class="mb-0 mt-space-xs mt-lg-space-sm position-relative"
        >
          <base-select
            id="high_school_country_select"
            :options="configHighSchoolCountries"
            v-model="$v.school.country.$model"
            :onErrorMsg="selectErrorMsg($v.school.country)"
            :placeholderText="compData.country.placeholder"
            class="col-12 col-lg-5 px-0 pr-lg-space-md"
            @change="handleSchoolCountryChange"
          ></base-select>
        </b-form-group>
      </div>
      <template v-if="school.country">
        <!-- state -->
        <div class="col-12 col-lg-5 mr-lg-gutter">
          <b-form-group
            data-cy="my-schools-high-school-state"
            id="group_school_state"
            :aria-label="compData.state.label"
            label-class="pb-0"
            label-for="school_state"
            class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
          >
            <template #label>
              <label for="school_state" class="mb-space-xs mb-lg-space-sm">
                <h3 class="h3-small">
                  {{ compData.state.label }}
                </h3>
              </label>
            </template>
            <!-- select dropdown if country is US -->
            <template v-if="configHighSchoolStates.length > 0">
              <base-select
                id="school_state"
                :options="configHighSchoolStates"
                v-model="$v.school.state.$model"
                :onErrorMsg="selectErrorMsg($v.school.state)"
                :placeholderText="compData.state.placeholder"
                @change="handleStateChange"
              ></base-select>
            </template>

            <!-- input text box is country is not US -->
            <template v-else>
              <b-form-input
                id="school_state"
                placeholder="Enter your text"
                v-model.trim="$v.school.state.$model"
                :state="
                  $v.school.state.$dirty && $v.school.state.$error
                    ? false
                    : null
                "
                aria-describedby="input-live-help input-live-feedback"
              >
              </b-form-input>
              <b-form-invalid-feedback v-if="!$v.school.state.required">
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                This is a required field.
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="!$v.school.state.maxLength">
                <font-awesome-icon
                  icon="fa-sharp fa-regular fa-circle-exclamation"
                  size="xs"
                />
                The state should not be more than 30 characters.
              </b-form-invalid-feedback>
            </template>
          </b-form-group>
        </div>
        <!-- city -->
        <template v-if="school.state || configHighSchoolStates.length <= 0">
          <div class="col-12 col-lg-5 mr-lg-gutter">
            <b-form-group
              data-cy="my-schools-high-school-city"
              id="group_school_city"
              :aria-label="compData.city.label"
              label-class="pb-0"
              label-for="school_city"
              class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
            >
              <template #label>
                <label for="school_city" class="mb-space-xs mb-lg-space-sm">
                  <h3 class="h3-small">
                    {{ compData.city.label }}
                  </h3>
                </label>
              </template>
              <!-- select dropdown if country is US -->
              <template v-if="getCityOptions.length > 0">
                <base-select
                  id="school_city"
                  :options="getCityOptions"
                  v-model="$v.school.city.$model"
                  :onErrorMsg="selectErrorMsg($v.school.city)"
                  :placeholderText="compData.city.placeholder"
                  @change="handleCityChange"
                ></base-select>
              </template>
              <!-- input text box is country is not US -->
              <template v-else>
                <b-form-input
                  id="school_city"
                  placeholder="Enter your text"
                  v-model.trim="$v.school.city.$model"
                  :state="
                    $v.school.city.$dirty && $v.school.city.$error
                      ? false
                      : null
                  "
                  aria-describedby="input-live-help input-live-feedback"
                >
                </b-form-input>
                <b-form-invalid-feedback v-if="!$v.school.city.required">
                  <font-awesome-icon
                    icon="fa-sharp fa-regular fa-circle-exclamation"
                    size="xs"
                  />
                  This is a required field.
                </b-form-invalid-feedback>
                <b-form-invalid-feedback v-else-if="!$v.school.city.maxLength">
                  <font-awesome-icon
                    icon="fa-sharp fa-regular fa-circle-exclamation"
                    size="xs"
                  />
                  The city should not be more than 30 characters.
                </b-form-invalid-feedback>
              </template>
            </b-form-group>
          </div>
        </template>
        <template
          v-if="
            school.city ||
            configHighSchoolStates.length <= 0 ||
            (school.state && getCityOptions.length <= 0)
          "
        >
          <!-- SAIS -->
          <template v-if="isSaisInputVisible">
            <div class="col-12 col-lg-5 mr-lg-gutter">
              <b-form-group
                data-cy="my-schools-high-school-sais"
                id="group_sais"
                :aria-label="compData.sais.label"
                label-class="pb-0"
                class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
              >
                <template #label>
                  <label for="school_sais" class="mb-space-xs mb-lg-space-sm">
                    <h3 class="h3-small d-flex">
                      <span class="my-auto">
                        {{ compData.sais.label }}
                      </span>
                      <span
                        class="ml-space-xs ml-lg-space-sm tool-tip-icon"
                        tabindex="0"
                        v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
                        :title="compData.sais.toolTip"
                      >
                        <font-awesome-icon
                          icon="fa-sharp fa-solid fa-circle-info"
                          size="xl"
                          class="fa-icon text-dark-1"
                        />
                      </span>
                      <span
                        class="ml-space-sm my-auto bg-light-3 text-xs px-space-xxs py-lg-space-xxxs"
                      >
                        Optional
                      </span>
                    </h3>
                  </label>
                </template>
                <b-form-input
                  id="school_sais"
                  :placeholder="compData.sais.placeholder"
                  v-model.trim="$v.school.sais.$model"
                  :state="
                    $v.school.sais.$dirty && $v.school.sais.$error
                      ? false
                      : null
                  "
                  aria-describedby="input-live-help input-live-feedback"
                >
                </b-form-input>
                <b-form-invalid-feedback v-if="!$v.school.sais.maxLength">
                  <font-awesome-icon
                    icon="fa-sharp fa-regular fa-circle-exclamation"
                    size="xs"
                  />
                  The SAIS should not be more than 10 characters.
                </b-form-invalid-feedback>
                <b-form-invalid-feedback v-else-if="!$v.school.sais.numeric">
                  <font-awesome-icon
                    icon="fa-sharp fa-regular fa-circle-exclamation"
                    size="xs"
                  />
                  The SAIS can only contain numbers.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </template>
          <!-- high school -->
          <template v-if="isSchoolCountrySelectedUS">
            <div class="col-12 col-lg-5 mr-lg-gutter">
              <b-form-group
                data-cy="my-schools-high-school-high-school"
                id="group_school_highschool"
                :aria-label="compData.highSchool.label"
                label-class="pb-0"
                label-for="school_highschool"
                class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
              >
                <template #label>
                  <label
                    for="school_highschool"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-small d-flex">
                      <span class="my-auto">{{
                        compData.highSchool.label
                      }}</span>
                      <span
                        class="ml-space-xs ml-lg-space-sm tool-tip-icon"
                        tabindex="0"
                        v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
                        :title="compData.highSchool.toolTip"
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
                <base-select
                  id="school_highschool"
                  :options="getHighSchoolOptions"
                  v-model="$v.school.highSchool.$model"
                  :onErrorMsg="selectErrorMsg($v.school.highSchool)"
                  :placeholderText="compData.highSchool.placeholder"
                  @change="handleHighschoolChange"
                ></base-select>
              </b-form-group>
            </div>
          </template>
          <!-- school name -->
          <template v-if="isSchoolNameVisible">
            <div class="col-12 col-lg-5 mr-lg-gutter">
              <b-form-group
                data-cy="my-schools-high-school-school-name"
                id="group_school_schoolname"
                :aria-label="compData.highSchool.customNameLabel"
                label-class="pb-0"
                class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
              >
                <template #label>
                  <label
                    for="school_schoolname"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-small">
                      {{ compData.highSchool.customNameLabel }}
                    </h3>
                  </label>
                </template>
                <b-form-input
                  id="school_schoolname"
                  placeholder="Enter your text"
                  v-model.trim="$v.school.schoolName.$model"
                  :state="
                    $v.school.schoolName.$dirty && $v.school.schoolName.$error
                      ? false
                      : null
                  "
                  aria-describedby="input-live-help input-live-feedback"
                >
                </b-form-input>
                <b-form-invalid-feedback v-if="!$v.school.schoolName.required">
                  <font-awesome-icon
                    icon="fa-sharp fa-regular fa-circle-exclamation"
                    size="xs"
                  />
                  This is a required field.
                </b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else-if="!$v.school.schoolName.maxLength"
                >
                  <font-awesome-icon
                    icon="fa-sharp fa-regular fa-circle-exclamation"
                    size="xs"
                  />
                  The name should not be more than 30 characters.
                </b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else-if="!$v.school.schoolName.duplicatedName"
                  class="position-relative"
                >
                  <font-awesome-icon
                    icon="fa-sharp fa-regular fa-circle-exclamation"
                    size="xs"
                  />
                  Enter different school name as this name is already entered.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </template>
          <!-- Date first attended -->
          <template v-if="isSchoolDateFirstAndLastAttendedVisible">
            <div class="col-12">
              <b-form-group
                data-cy="my-schools-high-school-first-date"
                id="group_school_first_date"
                :aria-label="compData.highSchool.firstAttendedLabel"
                label-class="pb-0"
                label-for="school_first_date"
                class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
              >
                <template #label>
                  <label
                    for="school_first_date"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-medium">
                      {{ compData.highSchool.firstAttendedLabel }}
                    </h3>
                  </label>
                </template>

                <div class="row">
                  <!-- month -->
                  <div
                    class="col-12 col-md-6 col-lg-3 mr-lg-gutter mb-space-sm mb-md-0"
                    id="school_first_date"
                  >
                    <base-select
                      id="school_first_date_month"
                      :options="getFirstAttendedMonthOptions"
                      v-model="$v.school.dateFirstAttended.month.$model"
                      :onErrorMsg="
                        selectErrorMsg($v.school.dateFirstAttended.month)
                      "
                      placeholderText="Select Month"
                      class="position-relative"
                    ></base-select>
                  </div>
                  <!-- year -->
                  <div class="col-12 col-md-6 col-lg-3 ml-lg-gutter">
                    <base-select
                      id="school_first_date_year"
                      :options="yearOptions"
                      v-model="$v.school.dateFirstAttended.year.$model"
                      :onErrorMsg="
                        selectErrorMsg($v.school.dateFirstAttended.year)
                      "
                      placeholderText="Select Year"
                      class="position-relative"
                    ></base-select>
                  </div>
                </div>
              </b-form-group>
            </div>
            <!-- Date last attended -->
            <div class="col-12">
              <b-form-group
                data-cy="my-schools-high-school-last-date"
                id="group_school_last_date"
                :aria-label="compData.highSchool.lastAttendedLabel"
                label-class="pb-0"
                label-for="school_last_date"
                class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
              >
                <template #label>
                  <label
                    for="school_last_date"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-medium">
                      {{ compData.highSchool.lastAttendedLabel }}
                    </h3>
                  </label>
                </template>

                <div class="row">
                  <!-- month -->
                  <div
                    class="col-12 col-md-6 col-lg-3 mr-lg-gutter mb-space-sm mb-md-0"
                    id="school_last_date"
                  >
                    <base-select
                      id="school_last_date_month"
                      :options="getLastAttendedMonthOptions"
                      v-model="$v.school.dateLastAttended.month.$model"
                      :onErrorMsg="
                        lastAttendedDateErrorMsg(
                          $v.school.dateLastAttended.month
                        )
                      "
                      invalidFeedbackClass="position-relative"
                      placeholderText="Select Month"
                    ></base-select>
                  </div>
                  <!-- year -->
                  <div class="col-12 col-md-6 col-lg-3 ml-lg-gutter">
                    <base-select
                      id="school_last_date_year"
                      :options="yearOptions"
                      v-model="$v.school.dateLastAttended.year.$model"
                      :onErrorMsg="
                        lastAttendedDateErrorMsg(
                          $v.school.dateLastAttended.year
                        )
                      "
                      placeholderText="Select Year"
                      invalidFeedbackClass="position-relative"
                    ></base-select>
                  </div>
                </div>
              </b-form-group>
            </div>
          </template>

          <!-- Graduation date -->
          <template v-else>
            <div class="col-12">
              <b-form-group
                data-cy="my-schools-high-school-graduation-date"
                id="group_school_graduation_date"
                :aria-label="compData.graduationDateLabel"
                label-class="pb-0"
                label-for="school_graduation_date"
                class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
              >
                <template #label>
                  <label
                    for="school_graduation_date"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-small">
                      {{ compData.graduationDateLabel }}
                    </h3>
                  </label>
                </template>

                <div class="row">
                  <!-- month -->
                  <div
                    class="col-12 col-md-6 col-lg-3 mr-lg-gutter mb-space-sm mb-md-0"
                    id="school_graduation_date"
                  >
                    <base-select
                      id="school_graduation_date_month"
                      :options="getGraduateMonthOptions"
                      v-model="$v.school.graduationDate.month.$model"
                      :onErrorMsg="
                        selectErrorMsg($v.school.graduationDate.month)
                      "
                      placeholderText="Select Month"
                      class="position-relative"
                    ></base-select>
                  </div>
                  <!-- year -->
                  <div class="col-12 col-md-6 col-lg-3 ml-lg-gutter">
                    <base-select
                      id="school_graduation_date_year"
                      :options="graduateYearOptions"
                      v-model="$v.school.graduationDate.year.$model"
                      :onErrorMsg="
                        selectErrorMsg($v.school.graduationDate.year)
                      "
                      placeholderText="Select Year"
                      class="position-relative"
                    ></base-select>
                  </div>
                </div>
              </b-form-group>
            </div>
          </template>
          <!-- name in transcript -->
          <name-on-transcript-select
            id="school"
            :title="compData.transcriptNameLabel"
            v-model="$v.school.nameOnTranscript.$model"
          ></name-on-transcript-select>
        </template>
      </template>
      <!-- submit and cancel buttons -->
      <template v-if="isSaveAndCancleButtonVisible">
        <div class="col-12 mt-space-md d-flex">
          <button
            class="btn btn-dark-3 text-white"
            @click="handleSchoolSaveClick"
            data-cy="my-schools-save-button"
          >
            {{ compData.saveCtaLabel }}
          </button>
          <button
            v-if="isCancelButtonVisible"
            class="btn btn-white text-dark-1 ml-space-sm p-0 my-auto"
            data-cy="my-schools-cancel-buttons"
            @click="handleSchoolCancleClick"
          >
            {{ compData.cancelCtaLabel }}
          </button>
        </div>
        <b-form-invalid-feedback
          :force-show="!$v.school.$invalid && $v.$dirty"
          class="ml-gutter position-relative"
          :class="{
            'is-invalid': !$v.school.$invalid && $v.$dirty,
          }"
        >
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          Click 'Save school' to complete this step.
        </b-form-invalid-feedback>
      </template>
    </template>
    <!-- new high school button -->
    <template v-else>
      <div class="col-12">
        <button
          :disabled="isAddNewSchoolButtonDisabled"
          class="btn btn-white border border-light-4 text-dark-2 px-space-sm d-flex"
          @click="handleNewSchoolClick"
          data-cy="my-schools-new-high-school-button"
        >
          <font-awesome-icon
            icon="fa-circle-plus"
            class="fa-lg mr-space-xxs text-dark-1 py-space-xxxs"
          />
          <span class="my-auto">Add a high school</span>
        </button>
        <p
          v-if="isAddNewSchoolButtonDisabled"
          class="mt-space-xs mb-0 text-danger"
        >
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
            class="mr-space-xxxs"
          />Reached maximum limit
        </p>
      </div>
    </template>

    <!-- confirm delete model -->
    <b-modal
      ref="highschools-confirm-delete-modal"
      centered
      hide-header
      hide-footer
      body-class="p-0"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
    >
      <div
        class="model-content p-space-md"
        data-cy="highschool-confirm-delete-modal"
      >
        <!-- row: cancel button -->
        <div class="row model-close-button position-absolute">
          <div class="col-12" data-cy="my-schools-cancel-button">
            <a
              href="javascript:void(0)"
              @click="handleConfirmDeleteModalClose"
              class="d-flex flex-row justify-content-end align-items-center pt-space-md pr-space-md"
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
        <div class="row mt-space-md" data-cy="my-schools-content">
          <div class="col-12">
            <h2 class="h2-medium">Are you sure you want to delete?</h2>
            <p class="mt-space-md mb-0">This action cannot be undone.</p>
            <hr class="my-space-lg" />
            <div class="d-flex justify-content-end">
              <button
                class="btn btn-white p-0 text-dark-1"
                id="cancel_button"
                @click="handleConfirmDeleteModalClose"
              >
                Cancel
              </button>
              <button
                id="delete_button"
                @click="handleConfirmDeleteClick"
                class="ml-space-md btn btn-dark-3 text-white px-space-xs"
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
import { requiredIf, maxLength, numeric } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import MonthOptions from "@/content/months.json";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import NameOnTranscriptSelect from "@/components/ugapp-components/my-schools/NameOnTranscriptSelect.vue";
import { useConfigStore } from "@/stores/config-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { mapActions, mapState } from "pinia";
import { MySchoolsConstants } from "@/content/enum-ug-application.js";
import * as _ from "lodash";

export default {
  name: "SectionHighSchools",
  mixins: [validationMixin],
  directives: {
    "b-tooltip": VBTooltip,
  },
  components: {
    "b-modal": BModal,
    "base-select": BaseSelect,
    "name-on-transcript-select": NameOnTranscriptSelect,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  props: {
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
  data() {
    return {
      MySchoolsConstants: MySchoolsConstants,
      highSchoolDetails: [],
      monthOptions: [],
      isSchoolInputsVisible: true,
      isSchoolDetailsEditing: false,
      schoolEditIndex: null,
      schoolDeleteIndex: null,
      isCancelButtonVisible: false,
      isGraduationSchoolDeleted: false,
      school: {
        country: null,
        state: null,
        sais: null,
        city: null,
        highSchool: null,
        schoolName: null,
        dateFirstAttended: { month: null, year: null },
        dateLastAttended: { month: null, year: null },
        graduationDate: {
          month: null,
          year: null,
        },
        nameOnTranscript: null,
      },
    };
  },
  validations: {
    school: {
      dateFirstAttended: {
        month: {
          required: requiredIf(function () {
            return (
              this.isSchoolInputsVisible &&
              this.isSchoolDateFirstAndLastAttendedVisible
            );
          }),
        },
        year: {
          required: requiredIf(function () {
            return (
              this.isSchoolInputsVisible &&
              this.isSchoolDateFirstAndLastAttendedVisible
            );
          }),
        },
      },
      dateLastAttended: {
        month: {
          required: requiredIf(function () {
            return (
              this.isSchoolInputsVisible &&
              this.isSchoolDateFirstAndLastAttendedVisible
            );
          }),
          minValue: function (value) {
            return (
              !this.isSchoolInputsVisible ||
              !this.isSchoolDateFirstAndLastAttendedVisible ||
              parseInt(this.school.dateFirstAttended.year?.value) <
                parseInt(this.school.dateLastAttended.year?.value) ||
              parseInt(this.school.dateFirstAttended.month?.value) <
                parseInt(value?.value)
            );
          },
        },
        year: {
          required: requiredIf(function () {
            return (
              this.isSchoolInputsVisible &&
              this.isSchoolDateFirstAndLastAttendedVisible
            );
          }),
          minValue: function (value) {
            return (
              !this.isSchoolInputsVisible ||
              !this.isSchoolDateFirstAndLastAttendedVisible ||
              parseInt(this.school.dateFirstAttended.year?.value) <=
                parseInt(value?.value)
            );
          },
        },
      },
      country: {
        required: requiredIf(function () {
          return this.isSchoolInputsVisible;
        }),
      },
      state: {
        required: requiredIf(function () {
          return this.isSchoolInputsVisible;
        }),
        maxLength: function (value) {
          return (
            !this.isSchoolInputsVisible ||
            this.configHighSchoolStates.length > 0 ||
            value?.length <= 30
          );
        },
      },
      sais: {
        maxLength: maxLength(10),
        numeric,
      },
      city: {
        required: requiredIf(function () {
          return this.isSchoolInputsVisible;
        }),
        maxLength: maxLength(30),
      },
      highSchool: {
        required: requiredIf(function () {
          return this.isSchoolInputsVisible && this.isSchoolCountrySelectedUS;
        }),
      },
      schoolName: {
        required: requiredIf(function () {
          return this.isSchoolNameVisible;
        }),
        maxLength: maxLength(30),
        duplicatedName: function () {
          return (
            !this.isSchoolInputsVisible ||
            !this.isSchoolNameVisible ||
            !this.isDuplicateSchoolNameEntered
          );
        },
      },
      graduationDate: {
        month: {
          required: requiredIf(function () {
            return (
              this.isSchoolInputsVisible &&
              !this.isSchoolDateFirstAndLastAttendedVisible
            );
          }),
        },
        year: {
          required: requiredIf(function () {
            return (
              this.isSchoolInputsVisible &&
              !this.isSchoolDateFirstAndLastAttendedVisible
            );
          }),
        },
      },
      nameOnTranscript: {
        required: requiredIf(function () {
          return this.isSchoolInputsVisible;
        }),
      },
    },
  },
  watch: {
    isFormSubmitClicked(newValue) {
      if (newValue && this.isSchoolInputsVisible) {
        this.$v.school.$touch();
      }
    },
    isSchoolInputsVisible() {
      this.updateComponentErrorState();
    },
    getHighSchoolOptions: {
      handler(newValue) {
        if (
          this.school.highSchool &&
          !newValue.some((item) => {
            return item.value === this.school.highSchool.value;
          })
        ) {
          this.school.highSchool = null;
        }
      },
      deep: true,
    },
    getFirstAttendedMonthOptions: {
      handler(newValue) {
        if (
          this.school.dateFirstAttended.month &&
          !newValue.some(
            (item) => item.value === this.school.dateFirstAttended.month?.value
          )
        ) {
          this.school.dateFirstAttended.month = null;
        }
      },
      deep: true,
    },
    getLastAttendedMonthOptions: {
      handler(newValue) {
        if (
          this.school.dateLastAttended.month &&
          !newValue.some(
            (item) => item.value === this.school.dateLastAttended.month?.value
          )
        ) {
          this.school.dateLastAttended.month = null;
        }
      },
      deep: true,
    },
    getGraduateMonthOptions: {
      handler(newValue) {
        if (
          this.school.graduationDate.month &&
          !newValue.some(
            (item) => item.value === this.school.graduationDate.month?.value
          )
        ) {
          this.school.graduationDate.month = null;
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(useUgApplicationStore, {
      applicationHighSchools: "highSchools",
    }),
    ...mapState(useConfigStore, {
      configHighSchoolCountries: "highSchoolCountries",
      configHighSchoolStates: "highSchoolStates",
      configUsStateCities: "usStateCities",
      configUsaHighSchools: "usaHighSchools",
    }),
    isSaveAndCancleButtonVisible() {
      return (
        (this.isSchoolDetailsEditing && !this.isGraduationSchoolDeleted) ||
        (this.highschoolDetailsLength > 0 && !this.isGraduationSchoolDeleted) ||
        (this.school.country &&
          (this.school.state || this.configHighSchoolStates.length === 0) &&
          (this.school.city || !this.isSchoolCountrySelectedUS))
      );
    },
    isHighSchoolDetailTableVisible() {
      return this.isSchoolDetailsEditing
        ? this.highschoolDetailsLength > 1
        : this.highschoolDetailsLength > 0;
    },
    getGraduateMonthOptions() {
      const currentDate = new Date();
      if (
        !this.school.graduationDate.year ||
        this.school.graduationDate.year?.value !== currentDate.getFullYear() + 5
      ) {
        return this.monthOptions;
      } else {
        return this.monthOptions.filter(
          (item) => item.monthIndex <= currentDate.getMonth()
        );
      }
    },
    getFirstAttendedMonthOptions() {
      const currentDate = new Date();
      if (
        !this.school.dateFirstAttended.year ||
        this.school.dateFirstAttended.year?.value !== currentDate.getFullYear()
      ) {
        return this.monthOptions;
      } else {
        return this.monthOptions.filter(
          (item) => item.monthIndex <= currentDate.getMonth()
        );
      }
    },
    getLastAttendedMonthOptions() {
      const currentDate = new Date();
      if (
        !this.school.dateLastAttended.year ||
        this.school.dateLastAttended.year?.value !== currentDate.getFullYear()
      ) {
        return this.monthOptions;
      } else {
        return this.monthOptions.filter(
          (item) => item.monthIndex <= currentDate.getMonth()
        );
      }
    },
    isSaisInputVisible() {
      return (
        this.isSchoolCountrySelectedUS &&
        this.school.state?.value === MySchoolsConstants.arizonaStateCode
      );
    },
    getCityOptions() {
      let cityOptions = [];
      if (this.isSchoolCountrySelectedUS && this.school.state) {
        const city = this.configUsStateCities.filter(
          (item) => item.stateCode === this.school.state.stateCode
        );
        if (city.length > 0) {
          cityOptions = city[0].cities.map((item) => {
            return {
              text: item,
              value: item,
            };
          });
        }
      }
      return cityOptions.length > 0 ? cityOptions : [];
    },
    getHighSchoolOptions() {
      let options = [
        ...this.configUsaHighSchools,
        ...this.compData.highSchool.options,
      ];
      const schools = this.highSchoolDetails.filter((item, index) => {
        if (this.isSchoolDetailsEditing && this.schoolEditIndex === index) {
          return false;
        } else {
          return !item.type || item.type !== MySchoolsConstants.typeDelete;
        }
      });
      options = options.filter(
        (item) =>
          !schools.some(
            (school) =>
              school.highSchool?.text === item.text &&
              (!school.schoolName ||
                school.schoolName !== item.text.slice(0, 30)) &&
              item.text !== MySchoolsConstants.schoolNotInList
          )
      );
      return options;
    },
    isSchoolDateFirstAndLastAttendedVisible() {
      // Checking if the graduationschool is deleted and adding again
      if (this.isGraduationSchoolDeleted) {
        return false;
      }
      if (this.isSchoolDetailsEditing) {
        return this.highSchoolDetails[this.schoolEditIndex].graduationDate
          .month &&
          this.highSchoolDetails[this.schoolEditIndex].graduationDate.year
          ? false
          : true;
      } else {
        const data = this.highSchoolDetails.filter(
          (item) =>
            (!item.type || item.type !== MySchoolsConstants.typeDelete) &&
            item.graduationDate.month &&
            item.graduationDate.year
        );
        return data.length > 0 ? true : false;
      }
    },
    isSchoolCountrySelectedUS() {
      return this.school.country?.value === MySchoolsConstants.usCountryCode;
    },
    isSchoolNameVisible() {
      return (
        this.isSchoolInputsVisible &&
        (this.school.country?.value !== MySchoolsConstants.usCountryCode ||
          this.school.highSchool?.value === MySchoolsConstants.schoolNotInList)
      );
    },
    graduateYearOptions() {
      const currentDate = new Date();
      const dateCopy = new Date(currentDate);
      dateCopy.setFullYear(currentDate.getFullYear() - 100);
      var options = [];
      for (
        var i = dateCopy.getFullYear();
        i < currentDate.getFullYear() + 6;
        i++
      ) {
        options.push({ text: `${i}`, value: i });
      }

      return options.sort((a, b) =>
        a.value > b.value ? -1 : b.value > a.value ? 1 : 0
      );
    },
    yearOptions() {
      const currentDate = new Date();
      const dateCopy = new Date(currentDate);
      dateCopy.setFullYear(currentDate.getFullYear() - 100);

      var options = [];
      for (
        var i = dateCopy.getFullYear();
        i <= currentDate.getFullYear();
        i++
      ) {
        options.push({ text: `${i}`, value: i });
      }

      return options.sort((a, b) =>
        a.value > b.value ? -1 : b.value > a.value ? 1 : 0
      );
    },
    highschoolDetailsLength() {
      const highSchoolDetails = this.highSchoolDetails.filter(
        (name) => !name.type || name.type !== MySchoolsConstants.typeDelete
      );
      return highSchoolDetails.length;
    },
    isDuplicateSchoolNameEntered() {
      let isDuplicate = false;
      const schools = this.highSchoolDetails.filter((item, index) => {
        if (this.isSchoolDetailsEditing && this.schoolEditIndex === index) {
          return false;
        } else {
          return !item.type || item.type !== MySchoolsConstants.typeDelete;
        }
      });
      if (schools.length > 0) {
        schools.forEach((school) => {
          if (
            school.highSchool?.text.trim() === this.school.schoolName?.trim() ||
            school.schoolName?.trim() === this.school.schoolName?.trim()
          ) {
            isDuplicate = true;
          }
        });
      }
      return isDuplicate;
    },
    isAddNewSchoolButtonDisabled() {
      const highSchoolDetails = this.highSchoolDetails.filter(
        (name) => !name.type || name.type !== MySchoolsConstants.typeDelete
      );
      return !this.isSchoolInputsVisible && highSchoolDetails.length >= 10;
    },
  },
  methods: {
    ...mapActions(useConfigStore, {
      configSelectHighSchoolCountry: "selectHighSchoolCountry",
      configDeselectHighSchoolCountry: "deselectHighSchoolCountry",
      configPopulateHighSchoolStates: "populateHighSchoolStates",
      configPopulateUsaHighSchools: "populateUsaHighSchools",
    }),
    handleConfirmDeleteModalClose() {
      this.$refs["highschools-confirm-delete-modal"].hide();
    },
    async handleConfirmDeleteClick() {
      this.$refs["highschools-confirm-delete-modal"].hide();
      let filteredHighSchools = null;
      // Checking if the graduation school is getting deleted
      if (
        !this.highSchoolDetails[this.schoolDeleteIndex].graduationDate.month &&
        !this.highSchoolDetails[this.schoolDeleteIndex].graduationDate.year
      ) {
        if (this.highSchoolDetails[this.schoolDeleteIndex].highSchoolId) {
          // setting the type to delete as this needs to be deleted from the database during save
          filteredHighSchools = [...this.highSchoolDetails];
          filteredHighSchools[this.schoolDeleteIndex].type =
            MySchoolsConstants.typeDelete;
        } else {
          filteredHighSchools = this.highSchoolDetails.filter(
            (name, index) => index !== this.schoolDeleteIndex
          );
        }
        this.highSchoolDetails = filteredHighSchools;
        this.$emit("input", filteredHighSchools);

        if (this.highschoolDetailsLength === 0) {
          this.isSchoolInputsVisible = true;
          this.isCancelButtonVisible = false;
        }
      } else {
        // If graduatuion schools is deleted converting it to edit and resetting all the fields
        this.isGraduationSchoolDeleted = true;
        await this.handleEditSchoolClick(this.schoolDeleteIndex);
        this.resetSchoolForm();
      }
    },
    selectErrorMsg(error) {
      const errMsg = [];
      if (error.$dirty && !error.required) {
        errMsg.push("This is a required field.");
      }
      return errMsg;
    },
    lastAttendedDateErrorMsg(error) {
      const errMsg = [];
      if (error.$dirty && !error.required) {
        errMsg.push("This is a required field.");
      } else if (error.$dirty && !error.minValue) {
        errMsg.push(
          "Last attended date should not be before first attended date."
        );
      }
      return errMsg;
    },
    handleSchoolSaveClick() {
      this.$v.school.$touch();
      if (this.$v.school.$anyError) {
        return;
      }
      const highSchoolsData = [...this.highSchoolDetails];
      if (!this.isSchoolDetailsEditing) {
        highSchoolsData.push({
          ...this.school,
          type: MySchoolsConstants.typeNew,
        });
      } else {
        const highSchoolId = highSchoolsData[this.schoolEditIndex].highSchoolId;
        highSchoolsData[this.schoolEditIndex] = { ...this.school };
        if (highSchoolId) {
          highSchoolsData[this.schoolEditIndex].type =
            MySchoolsConstants.typeUpdate;
          highSchoolsData[this.schoolEditIndex].highSchoolId = highSchoolId;
        } else {
          highSchoolsData[this.schoolEditIndex].type =
            MySchoolsConstants.typeNew;
        }
        this.isSchoolDetailsEditing = false;
        this.isGraduationSchoolDeleted = false;
      }
      this.highSchoolDetails = highSchoolsData;
      this.$emit("input", highSchoolsData);
      this.isSchoolInputsVisible = false;
      this.isCancelButtonVisible = true;
      this.resetSchoolForm();
    },
    handleSchoolCancleClick() {
      this.isSchoolInputsVisible = false;
      this.isSchoolDetailsEditing = false;
      this.resetSchoolForm();
    },
    async handleEditSchoolClick(pos) {
      this.schoolEditIndex = pos;
      this.isSchoolDetailsEditing = true;
      this.school = _.cloneDeep(this.highSchoolDetails[pos]);
      this.configDeselectHighSchoolCountry();
      this.configSelectHighSchoolCountry(this.school.country);
      await this.handleCityChange(this.school.city);
      this.school.highSchool = this.highSchoolDetails[pos].highSchool;
      const response = await this.configPopulateHighSchoolStates();
      if (response.code !== 200) {
        this.triggerErrorGtm(response.code, response.errors);
      }
      this.isSchoolInputsVisible = true;
      this.isCancelButtonVisible = this.isGraduationSchoolDeleted
        ? false
        : true;
    },
    handleRemoveSchoolClick(pos) {
      this.schoolDeleteIndex = pos;
      this.$refs["highschools-confirm-delete-modal"].show();
    },
    resetSchoolForm() {
      this.$v.school.$reset();
      this.school = {
        country: null,
        state: null,
        sais: null,
        city: null,
        highSchool: null,
        schoolName: null,
        graduationDate: {
          month: null,
          year: null,
        },
        dateFirstAttended: { month: null, year: null },
        dateLastAttended: { month: null, year: null },
        nameOnTranscript: null,
      };
    },
    handleNewSchoolClick() {
      this.$track({
        event: "collapse",
        action: "open",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "high schools",
        text: "add a high school",
        component: "current or most recent high school",
      });
      this.isSchoolInputsVisible = true;
      this.isCancelButtonVisible = true;
    },
    async handleSchoolCountryChange(event) {
      this.school.state = null;
      this.school.city = null;
      this.configDeselectHighSchoolCountry();
      if (event) {
        this.configSelectHighSchoolCountry(event);
        const response = await this.configPopulateHighSchoolStates();
        if (response.code !== 200) {
          this.triggerErrorGtm(response.code, response.errors);
        }
      }
      if (event?.countryCode !== MySchoolsConstants.usCountryCode) {
        this.school.highSchool = null;
      }
    },
    handleStateChange() {
      this.school.city = null;
      this.school.sais = null;
    },
    async handleCityChange(event) {
      // populating the usa high schools
      if (this.isSchoolCountrySelectedUS) {
        const params = `schoolTypeCode=HS&countryCode=USA&stateCode=${this.school.state?.stateCode}&city=${event?.value}`;
        const response = await this.configPopulateUsaHighSchools(params);
        if (response.code !== 200) {
          this.triggerErrorGtm(response.code, response.errors);
        }
      }
    },
    updateComponentErrorState() {
      if (this.isSchoolInputsVisible || this.$v.school.$invalid) {
        // component has error fields
        this.$emit("updateErrorState", true);
      } else {
        // component has no error fields
        this.$emit("updateErrorState", false);
      }
    },
    isHighSchoolValueVisible(type, index) {
      return this.isSchoolDetailsEditing
        ? this.schoolEditIndex !== index &&
            type !== MySchoolsConstants.typeDelete
        : type !== MySchoolsConstants.typeDelete;
    },
    handleHighschoolChange(event) {
      if (event?.value !== MySchoolsConstants.schoolNotInList) {
        this.school.schoolName = null;
      }
    },
    triggerErrorGtm(code, errors) {
      this.$track({
        event: "app_error",
        action: "my_schools",
        location: this.$router.currentRoute.fullPath,
        code: code,
        message: errors.toString(),
      });
    },
  },
  async created() {
    this.monthOptions = MonthOptions.sort((a, b) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0
    );
  },
  mounted() {
    this.updateComponentErrorState();
    this.highSchoolDetails = this.value ? [...this.value] : [];
    if (this.highSchoolDetails.length > 0) {
      this.isSchoolInputsVisible = false;
    }
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

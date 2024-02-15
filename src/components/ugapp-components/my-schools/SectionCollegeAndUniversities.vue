<template>
  <div class="row" data-cy="my-schools-college-and-universities">
    <!-- title -->
    <div class="col-12">
      <h3 class="h3-large d-flex mb-space-xs mb-lg-space-sm">
        <span>{{ compData.title }}</span>
        <span
          class="ml-space-xs ml-lg-space-sm my-auto tool-tip-icon"
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
      <p class="col-lg-9 px-0 text-dark-1 mb-space-sm mb-lg-space-lg">
        {{ compData.text }}
      </p>
    </div>
    <!-- attended college or universities -->
    <div class="col-12">
      <b-form-group
        data-cy="my-schools-attended-college"
        id="group_attended_college"
        :aria-label="compData.attendedCollege.label"
        label-class="pb-0"
        class="mb-0 position-relative"
      >
        <template #label>
          <label for="request_transcripts_radio" class="mb-space-md">
            <h3 class="h3-small">
              {{ compData.attendedCollege.label }}
            </h3>
          </label>
        </template>
        <base-radio-group
          name="request_transcripts_radio"
          :options="compData.attendedCollege.options"
          v-model="$v.college.attendedCollege.$model"
          aria-describedby="input-live-help input-live-feedback"
          :class="{
            'is-invalid':
              $v.college.attendedCollege.$dirty &&
              $v.college.attendedCollege.$error,
          }"
          @change="handleAttendedCollegeChange"
        >
        </base-radio-group>
        <b-form-invalid-feedback v-if="!$v.college.attendedCollege.required">
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <template
      v-if="
        college.attendedCollege?.value === MySchoolsConstants.attendedCollegeYes
      "
    >
      <!-- total semister credits -->
      <div class="col-12" v-if="!isFutureGraduate">
        <b-form-group
          data-cy="my-schools-total-semester-credits"
          id="group_semister_credits"
          :aria-label="compData.semesterCreditsLabel"
          label-class="pb-0"
          class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
        >
          <template #label>
            <label for="semister_credits" class="mb-space-xs mb-lg-space-sm">
              <h3 class="h3-small">
                {{ compData.semesterCreditsLabel }}
              </h3>
            </label>
          </template>
          <b-form-input
            id="semister_credits"
            class="text-dark-1 col-4 col-lg-2"
            v-model.trim="$v.college.totelSemisterCredits.$model"
            :state="
              $v.college.totelSemisterCredits.$dirty &&
              $v.college.totelSemisterCredits.$error
                ? false
                : null
            "
            aria-describedby="input-live-help input-live-feedback"
          >
          </b-form-input>
          <b-form-invalid-feedback
            v-if="!$v.college.totelSemisterCredits.required"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This is a required field.
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            v-if="!$v.college.totelSemisterCredits.numeric"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            This should contain only numbers.
          </b-form-invalid-feedback>
        </b-form-group>
        <!-- transfer credit guide -->
        <p class="mt-space-xs pt-space-xxxs mb-space-md mb-lg-space-lg">
          Reference the
          <a
            href="javascript:void(0)"
            @click="handleTransferGuideClick"
            class="font-weight-bold text-underline"
            >Transfer Credit Guide</a
          >
          for additional help.
        </p>
      </div>
      <!-- Institutions tabel -->
      <div class="col-12">
        <h3 class="h3-medium">
          {{ compData.institution.title }}
        </h3>
        <!-- Institutions tabel -->
        <template v-if="isInstitutionDetailTableVisible">
          <div
            class="col-12 col-lg-6 px-0"
            data-cy="my-schools-institution-detail-table"
          >
            <table class="table">
              <thead>
                <tr
                  class="font-weight-bold border-bottom pb-space-xxs mb-space-md"
                >
                  <th scope="col" colspan="2" class="border-0">Institutions</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(institution, index) in college.institutions">
                  <tr
                    :key="`institute-${institution.nameOnTranscript}-${index}`"
                    v-if="isInstitutionValueVisible(institution.type, index)"
                  >
                    <td class="border-0 text-wrap text-break">
                      <span
                        v-if="
                          institution.institute?.value !==
                          MySchoolsConstants.instituteNotListed
                        "
                      >
                        {{ institution.institute.text }}
                      </span>
                      <span v-else>{{ institution.customInstituteName }}</span>
                    </td>
                    <td class="ml-auto border-0 d-flex">
                      <button
                        class="edit-underline btn btn-link p-0 ml-auto rounded-0"
                        :disabled="isInstituteDetailsEditing"
                        @click="handleEditInstituteClick(index)"
                        data-cy="my-schools-institution-details-table-edit-institite"
                      >
                        <font-awesome-icon icon="fa-pencil" />
                        Edit
                      </button>
                      <a
                        data-cy="my-schools-institution-details-table-delete-institite"
                        href="javascript:void(0)"
                        class="text-dark-3 ml-space-xs"
                        @click="handleRemoveInstituteClick(index)"
                        aria-label="delete institution"
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
      </div>
      <!-- Institution inputs -->
      <template v-if="isInstituteInputsVisible">
        <!-- country -->
        <div class="col-12">
          <b-form-group
            data-cy="my-schools-institution-country"
            id="group_institute_country"
            :aria-label="compData.institution.country.label"
            label-class="pb-0"
            label-for="institute_country_select"
            class="mb-0 mt-space-xs mt-lg-space-sm position-relative"
          >
            <template #label>
              <label
                for="institute_country_select"
                class="mb-space-xs mb-lg-space-sm"
              >
                <h3 class="h3-small">
                  {{ compData.institution.country.label }}
                </h3>
              </label>
            </template>
            <base-select
              id="institute_country_select"
              :options="configInstitutionCountries"
              v-model="$v.institution.country.$model"
              :onErrorMsg="selectErrorMsg($v.institution.country)"
              :placeholderText="compData.institution.country.placeholder"
              class="col-12 col-lg-5 px-0 pr-lg-space-md"
              @change="handleInstituteCountryChange"
            ></base-select>
          </b-form-group>
        </div>
        <template v-if="institution.country">
          <!-- state -->
          <div class="col-12 col-lg-5 mr-lg-gutter">
            <b-form-group
              data-cy="my-schools-institution-state"
              id="group_institute_state"
              :aria-label="compData.institution.state.label"
              label-class="pb-0"
              label-for="institute_state"
              class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
            >
              <template #label>
                <label for="institute_state" class="mb-space-xs mb-lg-space-sm">
                  <h3 class="h3-small">
                    {{ compData.institution.state.label }}
                  </h3>
                </label>
              </template>
              <!-- select dropdown if country is US -->
              <template v-if="configInstitutionStates.length > 0">
                <base-select
                  id="institute_state"
                  :options="configInstitutionStates"
                  v-model="$v.institution.state.$model"
                  :onErrorMsg="selectErrorMsg($v.institution.state)"
                  :placeholderText="compData.institution.state.placeholder"
                  @change="handleStateChange"
                ></base-select>
              </template>
              <!-- input text box is country is not US -->
              <template v-else>
                <b-form-input
                  id="institute_state"
                  placeholder="Enter your text"
                  v-model.trim="$v.institution.state.$model"
                  :state="
                    $v.institution.state.$dirty && $v.institution.state.$error
                      ? false
                      : null
                  "
                  aria-describedby="input-live-help input-live-feedback"
                >
                </b-form-input>
                <b-form-invalid-feedback v-if="!$v.institution.state.required">
                  <font-awesome-icon
                    icon="fa-sharp fa-regular fa-circle-exclamation"
                    size="xs"
                  />
                  This is a required field.
                </b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else-if="!$v.institution.state.maxLength"
                >
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
          <template
            v-if="institution.state || configInstitutionStates.length <= 0"
          >
            <div class="col-12 col-lg-5 mr-lg-gutter">
              <b-form-group
                data-cy="my-schools-institution-city"
                id="group_institute_city"
                :aria-label="compData.institution.city.label"
                label-class="pb-0"
                label-for="institute_city"
                class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
              >
                <template #label>
                  <label
                    for="institute_city"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-small">
                      {{ compData.institution.city.label }}
                    </h3>
                  </label>
                </template>
                <!-- select dropdown if country is US -->
                <template v-if="getCityOptions.length > 0">
                  <base-select
                    id="institute_city"
                    :options="getCityOptions"
                    v-model="$v.institution.city.$model"
                    :onErrorMsg="selectErrorMsg($v.institution.city)"
                    :placeholderText="compData.institution.city.placeholder"
                    @change="handleCityChange"
                  ></base-select>
                </template>
                <!-- input text box is country is not US -->
                <template v-else>
                  <b-form-input
                    id="institute_city"
                    placeholder="Enter your text"
                    v-model.trim="$v.institution.city.$model"
                    :state="
                      $v.institution.city.$dirty && $v.institution.city.$error
                        ? false
                        : null
                    "
                    aria-describedby="input-live-help input-live-feedback"
                  >
                  </b-form-input>
                  <b-form-invalid-feedback v-if="!$v.institution.city.required">
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    This is a required field.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="!$v.institution.city.maxLength"
                  >
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
              institution.city ||
              configInstitutionStates.length <= 0 ||
              (institution.state && getCityOptions.length <= 0)
            "
          >
            <!-- Institution -->
            <div class="col-12 col-lg-5 mr-lg-gutter">
              <b-form-group
                data-cy="my-schools-institution-institute"
                id="group_institute_institution"
                :aria-label="compData.institution.institute.label"
                label-class="pb-0"
                label-for="institute_institution"
                class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
              >
                <template #label>
                  <label
                    for="institute_institution"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-small">
                      {{ compData.institution.institute.label }}
                    </h3>
                  </label>
                </template>
                <base-select
                  id="institute_institution"
                  :options="getInstitutionsOptions"
                  v-model="$v.institution.institute.$model"
                  :onErrorMsg="selectErrorMsg($v.institution.institute)"
                  :placeholderText="compData.institution.institute.placeholder"
                  @change="handleInstituteChange"
                ></base-select>
              </b-form-group>
            </div>
            <!-- Custom instute name -->
            <template
              v-if="
                institution.institute?.value ===
                MySchoolsConstants.instituteNotListed
              "
            >
              <div class="col-12 col-lg-5 mr-lg-gutter">
                <b-form-group
                  data-cy="my-schools-institution-custom-institute-name"
                  id="group_institute_name"
                  :aria-label="
                    compData.institution.institute.customInstituteLabel
                  "
                  label-class="pb-0"
                  class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
                >
                  <template #label>
                    <label
                      for="institute_name"
                      class="mb-space-xs mb-lg-space-sm"
                    >
                      <h3 class="h3-small">
                        {{
                          compData.institution.institute.customInstituteLabel
                        }}
                      </h3>
                    </label>
                  </template>
                  <b-form-input
                    id="institute_name"
                    placeholder="Enter your text"
                    v-model.trim="$v.institution.customInstituteName.$model"
                    :state="
                      $v.institution.customInstituteName.$dirty &&
                      $v.institution.customInstituteName.$error
                        ? false
                        : null
                    "
                    aria-describedby="input-live-help input-live-feedback"
                  >
                  </b-form-input>
                  <b-form-invalid-feedback
                    v-if="!$v.institution.customInstituteName.required"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    This is a required field.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="!$v.institution.customInstituteName.maxLength"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    The name should not be more than 50 characters.
                  </b-form-invalid-feedback>
                </b-form-group>
              </div>
            </template>
            <!-- Degree awarded -->
            <div class="col-12 col-lg-5 mr-lg-gutter">
              <b-form-group
                data-cy="my-schools-institution-degree-awarded"
                id="group_institute_degree_awarded"
                :aria-label="compData.institution.degreeAwarded.label"
                label-class="pb-0"
                label-for="institute_degree_awarded"
                class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
              >
                <template #label>
                  <label
                    for="institute_degree_awarded"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-small">
                      {{ compData.institution.degreeAwarded.label }}
                    </h3>
                  </label>
                </template>
                <base-select
                  id="institute_degree_awarded"
                  :options="compData.institution.degreeAwarded.options"
                  v-model="$v.institution.degreeAwarded.$model"
                  :onErrorMsg="selectErrorMsg($v.institution.degreeAwarded)"
                  :placeholderText="
                    compData.institution.degreeAwarded.placeholder
                  "
                  @change="handleDegreeAwardedChange"
                ></base-select>
              </b-form-group>
            </div>
            <!-- Degree concentration -->
            <div
              v-if="isDegreeConcentrationVisible"
              class="col-12 col-lg-5 mr-lg-gutter"
            >
              <b-form-group
                data-cy="my-schools-institution-degree-concentration"
                id="group_institute_degree_concentration"
                :aria-label="compData.institution.DegreeConcentration.label"
                label-class="pb-0"
                class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
              >
                <template #label>
                  <label
                    for="institute_degree_concentration"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-small">
                      {{ compData.institution.DegreeConcentration.label }}
                    </h3>
                  </label>
                </template>
                <b-form-input
                  id="institute_degree_concentration"
                  :placeholder="
                    compData.institution.DegreeConcentration.placeholder
                  "
                  v-model.trim="$v.institution.degreeConcentration.$model"
                  :state="
                    $v.institution.degreeConcentration.$dirty &&
                    $v.institution.degreeConcentration.$error
                      ? false
                      : null
                  "
                  aria-describedby="input-live-help input-live-feedback"
                >
                </b-form-input>
                <b-form-invalid-feedback
                  v-if="!$v.institution.degreeConcentration.required"
                >
                  <font-awesome-icon
                    icon="fa-sharp fa-regular fa-circle-exclamation"
                    size="xs"
                  />
                  This is a required field.
                </b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else-if="!$v.institution.degreeConcentration.maxLength"
                >
                  <font-awesome-icon
                    icon="fa-sharp fa-regular fa-circle-exclamation"
                    size="xs"
                  />
                  The degree concentration should not be more than 30
                  characters.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
            <!-- Date first attended -->
            <div class="col-12">
              <b-form-group
                data-cy="my-schools-institution-date-first-attended"
                id="group_institute_first_date"
                :aria-label="compData.institution.firstAttendedLabel"
                label-class="pb-0"
                label-for="institute_first_date"
                class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
              >
                <template #label>
                  <label
                    for="institute_first_date"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-small">
                      {{ compData.institution.firstAttendedLabel }}
                    </h3>
                  </label>
                </template>

                <div class="row">
                  <!-- month -->
                  <div
                    class="col-12 col-md-6 col-lg-3 mr-lg-gutter mb-space-sm mb-md-0"
                    id="institute_first_date"
                  >
                    <base-select
                      id="institute_first_date_month"
                      :options="getFirstAttendedMonthOptions"
                      v-model="$v.institution.dateFirstAttended.month.$model"
                      :onErrorMsg="
                        selectErrorMsg($v.institution.dateFirstAttended.month)
                      "
                      placeholderText="Select Month"
                      class="position-relative"
                    ></base-select>
                  </div>
                  <!-- year -->
                  <div class="col-12 col-md-6 col-lg-3 ml-lg-gutter">
                    <base-select
                      id="institute_first_date_year"
                      :options="yearOptions"
                      v-model="$v.institution.dateFirstAttended.year.$model"
                      :onErrorMsg="
                        selectErrorMsg($v.institution.dateFirstAttended.year)
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
                data-cy="my-schools-institution-date-last-attended"
                id="group_institute_last_date"
                :aria-label="compData.institution.lastAttendedLabel"
                label-class="pb-0"
                label-for="institute_last_date"
                class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
              >
                <template #label>
                  <label
                    for="institute_last_date"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-small">
                      {{ compData.institution.lastAttendedLabel }}
                    </h3>
                  </label>
                </template>

                <div class="row">
                  <!-- month -->
                  <div
                    class="col-12 col-md-6 col-lg-3 mr-lg-gutter mb-space-sm mb-md-0"
                    id="institute_last_date"
                  >
                    <base-select
                      id="institute_last_date_month"
                      :options="getLastAttendedMonthOptions"
                      v-model="$v.institution.dateLastAttended.month.$model"
                      :onErrorMsg="
                        lastAttendedDateErrorMsg(
                          $v.institution.dateLastAttended.month
                        )
                      "
                      placeholderText="Select Month"
                      invalidFeedbackClass="position-relative"
                    ></base-select>
                  </div>
                  <!-- year -->
                  <div class="col-12 col-md-6 col-lg-3 ml-lg-gutter">
                    <base-select
                      id="institute_last_date_year"
                      :options="yearOptions"
                      v-model="$v.institution.dateLastAttended.year.$model"
                      :onErrorMsg="
                        lastAttendedDateErrorMsg(
                          $v.institution.dateLastAttended.year
                        )
                      "
                      placeholderText="Select Year"
                      invalidFeedbackClass="position-relative"
                    ></base-select>
                  </div>
                </div>
              </b-form-group>
            </div>

            <!-- name in transcript -->
            <name-on-transcript-select
              id="institute"
              :title="compData.institution.transcriptNameLabel"
              v-model="$v.institution.nameOnTranscript.$model"
            ></name-on-transcript-select>
          </template>
        </template>
        <!-- submit and cancel buttons -->
        <template v-if="isSaveAndCancleButtonVisible">
          <div class="col-12 mt-space-md d-flex">
            <button
              class="btn btn-dark-3 text-white"
              @click="handleInstituteSaveClick"
              data-cy="my-schools-institution-save-buttons"
            >
              {{ compData.institution.saveCtaLabel }}
            </button>
            <button
              v-if="institutionDetailsLength >= 1"
              class="btn btn-white text-dark-1 ml-space-sm p-0 my-auto"
              @click="handleInstituteCancleClick"
              data-cy="my-schools-institution-cancel-buttons"
            >
              {{ compData.institution.cancelCtaLabel }}
            </button>
          </div>
          <b-form-invalid-feedback
            :force-show="!$v.institution.$invalid && $v.$dirty"
            class="ml-gutter position-relative"
            :class="{
              'is-invalid': !$v.institution.$invalid && $v.$dirty,
            }"
          >
            <font-awesome-icon
              icon="fa-sharp fa-regular fa-circle-exclamation"
              size="xs"
            />
            Please click on save institution button to complete this step!
          </b-form-invalid-feedback>
        </template>
      </template>
      <!-- new institution button -->
      <template v-else>
        <div class="col-12">
          <button
            class="btn btn-white border border-light-4 text-dark-2 px-space-sm d-flex"
            @click="handleNewInstituteClick"
            data-cy="my-schools-new-institution-button"
          >
            <font-awesome-icon
              icon="fa-circle-plus"
              class="fa-lg mr-space-xxs text-dark-1 py-space-xxxs"
            />
            <span class="my-auto">Add a school</span>
          </button>
        </div>
      </template>
    </template>

    <!-- sidebar for Transfer Credit Guide and transcripts guide -->
    <b-sidebar
      visible
      id="transfet_credit_guide_sidebar"
      v-model="showSidebar"
      right
      bg-variant="white"
      no-header
      backdrop-variant="dark-2"
      backdrop
      shadow
      @hidden="sidebarClosed"
    >
      <template #default="{ hide }">
        <div class="bg-white p-space-sm" data-cy="my-schools-back-button">
          <button
            @click="hide"
            class="btn bg-white rounded-0 text-medium border-0 p-0"
          >
            <span>
              <font-awesome-icon
                icon="fa-arrow-left"
                class="mr-space-xxs"
              ></font-awesome-icon
              >Back</span
            >
          </button>
        </div>
        <div
          class="p-space-sm px-lg-space-xl pb-lg-space-xl"
          data-cy="my-schools-content"
        >
          <img
            :src="images[sidebarData.image]"
            alt="sidebar image"
            class="img-fluid mb-space-xs mb-lg-space-sm"
          />
          <h2 class="h2-medium">{{ sidebarData.title }}</h2>
          <hr class="mt-space-xs mb-lg-space-md mt-lg-space-sm mb-space-lg" />
          <template v-for="item in sidebarData.items">
            <div :key="item.title">
              <h3 class="h3-large mb-space-xs">
                {{ item.title }}
              </h3>
              <p class="mb-space-md mb-lg-space-lg">{{ item.text }}</p>
            </div>
          </template>
        </div>
      </template>
    </b-sidebar>
    <!-- END -->
    <!-- confirm delete model -->
    <b-modal
      ref="institutions-confirm-delete-modal"
      centered
      hide-header
      hide-footer
      body-class="p-0"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
    >
      <div
        class="model-content p-space-md"
        data-cy="institution-confirm-delete-modal"
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
        <div class="row mt-space-md">
          <div class="col-12" data-cy="my-schools-content">
            <h2 class="h2-medium">Are you sure you want to delete?</h2>
            <p class="mt-space-md mb-0">This action cannot be undone.</p>
            <hr class="my-space-lg" />
            <div class="d-flex justify-content-end">
              <button
                id="cancel_button"
                class="btn btn-white p-0 text-dark-1"
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
  BSidebar,
  BModal,
} from "bootstrap-vue";
import {
  required,
  requiredIf,
  numeric,
  minLength,
  maxLength,
} from "vuelidate/lib/validators";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import NameOnTranscriptSelect from "@/components/ugapp-components/my-schools/NameOnTranscriptSelect.vue";
import transferGuideImg from "@/assets/img/arrows-shuffle.svg";
import MonthOptions from "@/content/months.json";
import { validationMixin } from "vuelidate";
import { useConfigStore } from "@/stores/config-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { mapActions, mapState } from "pinia";
import { MySchoolsConstants } from "@/content/enum-ug-application.js";
import * as _ from "lodash";
export default {
  name: "SectionCollegeAndUniversities",
  mixins: [validationMixin],
  directives: {
    "b-tooltip": VBTooltip,
  },
  components: {
    "b-sidebar": BSidebar,
    "base-select": BaseSelect,
    "name-on-transcript-select": NameOnTranscriptSelect,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "base-radio-group": BaseRadioGroup,
    "b-modal": BModal,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    compData: {
      type: Object,
      required: true,
    },
    isFormSubmitClicked: {
      type: Boolean,
      required: true,
    },
    isFutureGraduate: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      MySchoolsConstants: MySchoolsConstants,
      images: {
        transferGuideImg,
      },
      monthOptions: [],
      showSidebar: false,
      sidebarData: {},
      isInstituteInputsVisible: true,
      isInstituteDetailsEditing: false,
      instituteEditIndex: null,
      instituteDeleteIndex: null,
      institution: {
        country: null,
        state: null,
        city: null,
        institute: null,
        customInstituteName: null,
        degreeAwarded: null,
        degreeConcentration: null,
        dateFirstAttended: { month: null, year: null },
        dateLastAttended: { month: null, year: null },
        nameOnTranscript: null,
      },
      college: {
        attendedCollege: null,
        totelSemisterCredits: null,
        institutions: [],
      },
    };
  },
  watch: {
    isFutureGraduate() {
      this.updateTotalCreditValue();
    },
    isFormSubmitClicked(newValue) {
      if (newValue) {
        this.$v.$touch();
        this.updateComponentErrorState();
      }
    },
    isInstituteInputsVisible() {
      this.updateComponentErrorState();
    },
    college: {
      handler() {
        this.$emit("input", this.college);
        this.updateComponentErrorState();
      },
      deep: true,
    },
    getInstitutionsOptions: {
      handler(newValue) {
        if (this.institution.institute) {
          const institute = newValue.filter(
            (item) => item.value === this.institution.institute.value
          );
          if (institute.length === 0) {
            this.institution.institute = null;
          }
        }
      },
      deep: true,
    },
    getFirstAttendedMonthOptions: {
      handler(newValue) {
        if (
          this.institution.dateFirstAttended.month &&
          !newValue.some(
            (item) =>
              item.value === this.institution.dateFirstAttended.month?.value
          )
        ) {
          this.institution.dateFirstAttended.month = null;
        }
      },
      deep: true,
    },
    getLastAttendedMonthOptions: {
      handler(newValue) {
        if (
          this.institution.dateLastAttended.month &&
          !newValue.some(
            (item) =>
              item.value === this.institution.dateLastAttended.month?.value
          )
        ) {
          this.institution.dateLastAttended.month = null;
        }
      },
      deep: true,
    },
  },

  validations: {
    institution: {
      country: {
        required: requiredIf(function () {
          return this.isInstituteInputsRequired;
        }),
      },
      state: {
        required: requiredIf(function () {
          return this.isInstituteInputsRequired;
        }),
        maxLength: function (value) {
          return (
            !this.isInstituteInputsRequired ||
            this.configInstitutionStates.length > 0 ||
            value?.length <= 30
          );
        },
      },
      city: {
        required: requiredIf(function () {
          return this.isInstituteInputsRequired;
        }),
        maxLength: maxLength(30),
      },
      institute: {
        required: requiredIf(function () {
          return this.isInstituteInputsRequired;
        }),
      },
      customInstituteName: {
        required: requiredIf(function () {
          return (
            this.isInstituteInputsRequired &&
            this.institution.institute?.value ===
              MySchoolsConstants.instituteNotListed
          );
        }),
        maxLength: maxLength(50),
      },
      degreeAwarded: {
        required: requiredIf(function () {
          return this.isInstituteInputsRequired;
        }),
      },
      degreeConcentration: {
        required: requiredIf(function () {
          return (
            this.isInstituteInputsRequired && this.isDegreeConcentrationVisible
          );
        }),
        maxLength: maxLength(30),
      },
      dateFirstAttended: {
        month: {
          required: requiredIf(function () {
            return this.isInstituteInputsRequired;
          }),
        },
        year: {
          required: requiredIf(function () {
            return this.isInstituteInputsRequired;
          }),
        },
      },
      dateLastAttended: {
        month: {
          required: requiredIf(function () {
            return this.isInstituteInputsRequired;
          }),
          minValue: function (value) {
            return (
              !this.isInstituteInputsRequired ||
              parseInt(this.institution.dateFirstAttended.year?.value) <
                parseInt(this.institution.dateLastAttended.year?.value) ||
              parseInt(this.institution.dateFirstAttended.month?.value) <
                parseInt(value?.value)
            );
          },
        },
        year: {
          required: requiredIf(function () {
            return this.isInstituteInputsRequired;
          }),
          minValue: function (value) {
            return (
              !this.isInstituteInputsRequired ||
              parseInt(this.institution.dateFirstAttended.year?.value) <=
                parseInt(value?.value)
            );
          },
        },
      },
      nameOnTranscript: {
        required: requiredIf(function () {
          return this.isInstituteInputsRequired;
        }),
      },
    },
    college: {
      attendedCollege: { required },
      totelSemisterCredits: {
        required: requiredIf((event) => {
          return (
            event.attendedCollege?.value ===
            MySchoolsConstants.attendedCollegeYes
          );
        }),
        numeric,
      },
      institutions: {
        required: requiredIf((event) => {
          return (
            event.attendedCollege?.value ===
            MySchoolsConstants.attendedCollegeYes
          );
        }),
        minLength: minLength(1),
      },
    },
  },
  computed: {
    ...mapState(useUgApplicationStore, {
      applicationMySchoolsSar: "mySchoolsSar",
      applicationOtherInstitutions: "otherInstitutions",
    }),
    ...mapState(useConfigStore, {
      configInstitutionCountries: "institutionCountries",
      configInstitutionStates: "institutionStates",
      configUsStateCities: "usStateCities",
      configInstitutions: "institutions",
    }),
    isSaveAndCancleButtonVisible() {
      return (
        this.isInstituteDetailsEditing ||
        this.institutionDetailsLength > 0 ||
        (this.institution.country &&
          (this.institution.state ||
            this.configInstitutionStates.length === 0) &&
          (this.institution.city || !this.isInstituteCountrySelectedUS))
      );
    },
    getFirstAttendedMonthOptions() {
      const currentDate = new Date();
      if (
        !this.institution.dateFirstAttended.year ||
        this.institution.dateFirstAttended.year?.value !==
          currentDate.getFullYear()
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
        !this.institution.dateLastAttended.year ||
        this.institution.dateLastAttended.year?.value !==
          currentDate.getFullYear()
      ) {
        return this.monthOptions;
      } else {
        return this.monthOptions.filter(
          (item) => item.monthIndex <= currentDate.getMonth()
        );
      }
    },

    getInstitutionsOptions() {
      const options = [];
      this.configInstitutions.forEach((option) => {
        if (!options.some((item) => item.text === option.text)) {
          options.push(option);
        }
      });
      options.push({
        text: MySchoolsConstants.instituteNotListed,
        value: MySchoolsConstants.instituteNotListed,
      });
      return options;
    },
    getCityOptions() {
      let cityOptions = [];
      if (this.isInstituteCountrySelectedUS && this.institution.state) {
        const city = this.configUsStateCities.filter(
          (item) => item.stateCode === this.institution.state.stateCode
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
    institutionDetailsLength() {
      const institutionDetails = this.college.institutions.filter(
        (item) => !item.type || item.type !== MySchoolsConstants.typeDelete
      );
      return institutionDetails.length;
    },
    isInstitutionDetailTableVisible() {
      return this.isInstituteDetailsEditing
        ? this.institutionDetailsLength > 1
        : this.institutionDetailsLength > 0;
    },
    isInstituteInputsRequired() {
      return (
        this.college.attendedCollege?.value ===
          MySchoolsConstants.attendedCollegeYes && this.isInstituteInputsVisible
      );
    },
    isInstituteCountrySelectedUS() {
      return (
        this.institution.country?.value === MySchoolsConstants.usCountryCode
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
    isDegreeConcentrationVisible() {
      return (
        this.institution.degreeAwarded &&
        this.institution.degreeAwarded.value !==
          MySchoolsConstants.noDegreeAwardedValue
      );
    },
  },
  methods: {
    ...mapActions(useConfigStore, {
      configSelectInstitutionCountry: "selectInstitutionCountry",
      configDeselectInstitutionCountry: "deselectInstitutionCountry",
      configPopulateInstitutionStates: "populateInstitutionStates",
      configPopulateInstitutions: "populateInstitutions",
    }),

    isInstitutionValueVisible(type, index) {
      return this.isInstituteDetailsEditing
        ? this.instituteEditIndex !== index &&
            type !== MySchoolsConstants.typeDelete
        : type !== MySchoolsConstants.typeDelete;
    },
    handleConfirmDeleteModalClose() {
      this.$refs["institutions-confirm-delete-modal"].hide();
    },
    handleConfirmDeleteClick() {
      this.$refs["institutions-confirm-delete-modal"].hide();
      let institutions = this.college.institutions;
      if (institutions[this.instituteDeleteIndex].otherInstitutionId) {
        institutions[this.instituteDeleteIndex].type =
          MySchoolsConstants.typeDelete;
      } else {
        institutions = this.college.institutions.filter(
          (name, index) => index !== this.instituteDeleteIndex
        );
      }

      this.college.institutions = [...institutions];

      if (this.institutionDetailsLength === 0) {
        this.isInstituteInputsVisible = true;
      }
    },
    handleDegreeAwardedChange(newValue) {
      if (newValue.value === MySchoolsConstants.noDegreeAwardedValue) {
        this.institution.degreeConcentration = null;
      }
    },
    sidebarClosed() {
      // GTM for sidebar closed
    },
    handleNewInstituteClick() {
      this.$track({
        event: "collapse",
        action: "open",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "colleges and universities",
        text: "add a school",
      });
      this.isInstituteInputsVisible = true;
    },
    handleInstituteCancleClick() {
      this.isInstituteInputsVisible = false;
      this.isInstituteDetailsEditing = false;
      this.resetInstituteForm();
    },
    async handleInstituteCountryChange(event) {
      this.institution.state = null;
      this.institution.city = null;
      this.configDeselectInstitutionCountry();
      if (event) {
        this.configSelectInstitutionCountry(event);
        const response = await this.configPopulateInstitutionStates();
        if (response.code !== 200) {
          this.triggerErrorGtm(response.code, response.errors);
        }
        // populating the institution options only if there is no states option
        if (response.data.length === 0) {
          this.populateInstitutionsOptions();
        }
      }
    },
    async handleEditInstituteClick(pos) {
      this.instituteEditIndex = pos;
      this.isInstituteDetailsEditing = true;
      this.institution = _.cloneDeep(this.college.institutions[pos]);
      this.configDeselectInstitutionCountry();
      this.configSelectInstitutionCountry(this.institution.country);
      const response = await this.configPopulateInstitutionStates();
      if (response.code !== 200) {
        this.triggerErrorGtm(response.code, response.errors);
      }
      this.populateInstitutionsOptions();
      this.isInstituteInputsVisible = true;
    },
    handleTransferGuideClick() {
      Object.assign(this.sidebarData, this.compData.transferCreditGuide);
      this.showSidebar = true;
    },
    handleInstituteSaveClick() {
      this.$v.institution.$touch();
      if (this.$v.institution.$anyError) {
        return;
      }

      if (!this.isInstituteDetailsEditing) {
        this.college.institutions.push({
          ...this.institution,
          type: MySchoolsConstants.typeNew,
        });
      } else {
        this.college.institutions[this.instituteEditIndex] = this.institution;
        if (
          this.college.institutions[this.instituteEditIndex].otherInstitutionId
        ) {
          this.college.institutions[this.instituteEditIndex].type =
            MySchoolsConstants.typeUpdate;
        } else {
          this.college.institutions[this.instituteEditIndex].type =
            MySchoolsConstants.typeNew;
        }
        this.isInstituteDetailsEditing = false;
      }
      this.isInstituteInputsVisible = false;
      this.resetInstituteForm();
    },
    handleRemoveInstituteClick(pos) {
      this.instituteDeleteIndex = pos;
      this.$refs["institutions-confirm-delete-modal"].show();
    },
    resetInstituteForm() {
      this.$v.institution.$reset();
      this.institution = {
        country: null,
        state: null,
        city: null,
        institute: null,
        customInstituteName: null,
        degreeAwarded: null,
        degreeConcentration: null,
        dateFirstAttended: { month: null, year: null },
        dateLastAttended: { month: null, year: null },
        graduationDate: {
          month: null,
          year: null,
        },
        nameOnTranscript: null,
      };
    },
    updateComponentErrorState() {
      if (
        this.$v.$invalid ||
        (this.college.attendedCollege?.value ===
          MySchoolsConstants.attendedCollegeYes &&
          this.isInstituteInputsVisible)
      ) {
        // component has error fields
        this.$emit("updateErrorState", true);
      } else {
        // component has no error fields
        this.$emit("updateErrorState", false);
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
    handleAttendedCollegeChange(event) {
      this.$track({
        event: "select",
        action: "click",
        name: "onclick",
        type: "checkbox",
        region: "main content",
        section:
          "have you previously attended or are you currently attending a college or university?",
        text: event.text.toLowerCase(),
        component: "colleges and universities",
      });
      this.updateTotalCreditValue();
      if (event.value != MySchoolsConstants.attendedCollegeYes) {
        if (this.college.institutions.length > 0) {
          this.college.institutions = this.college.institutions.filter(
            (item) => item.otherInstitutionId
          );
        }
        if (this.college.institutions.length > 0) {
          this.college.institutions = this.college.institutions.map((item) => {
            const data = item;
            data.type = MySchoolsConstants.typeDelete;
            return data;
          });
        }
        this.isInstituteInputsVisible = true;
        this.resetInstituteForm();
      }
    },
    async handleStateChange() {
      this.institution.city = null;
      if (!this.isInstituteCountrySelectedUS) {
        this.populateInstitutionsOptions();
      }
    },
    handleCityChange() {
      this.populateInstitutionsOptions();
    },
    async populateInstitutionsOptions() {
      let params = `schoolTypeCode=Col&schoolTypeCode=UNV&schoolTypeCode=2YR&schoolTypeCode=4YR&schoolTypeCode=VOC&countryCode=${this.institution.country?.countryCode}`;
      if (this.institution.state?.value) {
        params = `${params}&stateCode=${this.institution.state.value}`;
      }
      if (this.isInstituteCountrySelectedUS && this.institution.city?.value) {
        params = `${params}&city=${this.institution.city.value}`;
      }

      const response = await this.configPopulateInstitutions(params);
      if (response.code !== 200) {
        this.triggerErrorGtm(response.code, response.errors);
      }
    },
    handleInstituteChange(event) {
      if (event?.value !== MySchoolsConstants.instituteNotListed) {
        this.institution.customInstituteName = null;
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
    updateTotalCreditValue() {
      if (
        this.isFutureGraduate ||
        (this.college.attendedCollege &&
          this.college.attendedCollege.value !==
            MySchoolsConstants.attendedCollegeYes)
      ) {
        this.college.totelSemisterCredits = "0";
      } else {
        this.college.totelSemisterCredits = null;
      }
    },
  },
  async created() {
    this.monthOptions = MonthOptions.sort((a, b) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0
    );
  },
  mounted() {
    this.updateComponentErrorState();
    if (this.value && Object.keys(this.value).length > 0) {
      Object.assign(this.college, this.value);
    }
    if (this.college.institutions.length > 0) {
      this.isInstituteInputsVisible = false;
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

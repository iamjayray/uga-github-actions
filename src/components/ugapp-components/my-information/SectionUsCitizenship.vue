<template>
  <div class="row">
    <!-- U.S. Citizenship -->
    <div class="col-12">
      <b-form-group
        id="group_us_citizen"
        :aria-label="compData.label"
        label-class="pb-0"
        class="mb-0 position-relative"
        data-cy="my-info-us-citizenship-is-us-citizen-group"
      >
        <template #label>
          <label for="us_citizen_radio" class="mb-space-sm">
            <h3 class="h3-large d-flex">
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
          </label>
          <p class="mb-space-sm mb-lg-space-md text-dark-2">
            {{ compData.text }}
          </p>
        </template>
        <base-radio-group
          name="us_citizen_radio"
          :options="compData.options"
          v-model="$v.usCitizenship.isUsCitizen.$model"
          aria-describedby="input-live-help input-live-feedback"
          :class="{
            'is-invalid':
              $v.usCitizenship.isUsCitizen.$dirty &&
              $v.usCitizenship.isUsCitizen.$error,
          }"
          @change="handleUsCitizenshipStatusChange"
        >
        </base-radio-group>
        <b-form-invalid-feedback v-if="!$v.usCitizenship.isUsCitizen.required">
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <!-- US citizen -->
    <template v-if="isUsCitizenSelected">
      <!-- Country of Birth -->
      <div class="col-12 col-lg-5 mr-lg-gutter">
        <b-form-group
          id="group_birth_country"
          :aria-label="compData.countryOfBirth.label"
          label-class="pb-0"
          label-for="country_of_birth"
          class="mb-0 mt-space-sm position-relative"
          data-cy="my-info-us-citizenship-birth-country-group"
        >
          <template #label>
            <label for="country_of_birth" class="mb-space-xs">
              <h3 class="h3-small d-flex">
                <span class="my-auto">{{ compData.countryOfBirth.label }}</span>
                <span
                  class="ml-space-xs ml-lg-space-sm tool-tip-icon"
                  tabindex="0"
                  v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
                  :title="compData.countryOfBirth.tooltip"
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
            id="country_of_birth"
            :options="configBirthCountries"
            v-model="$v.usCitizenship.countryOfBirth.$model"
            :onErrorMsg="selectErrorMsg($v.usCitizenship.countryOfBirth)"
            :placeholderText="compData.countryOfBirth.placeholder"
            @select="handleBirthCountrySelect"
          ></base-select>
        </b-form-group>
      </div>
      <!-- Social Security Number -->
      <div class="col-12 col-lg-5 ml-lg-gutter">
        <b-form-group
          id="group_ssn"
          :aria-label="compData.USssn.label"
          label-class="pb-0"
          class="mb-0 mt-space-sm position-relative"
          data-cy="my-info-us-citizenship-ssn-group"
        >
          <template #label>
            <label
              for="social_security_number"
              class="mb-space-xs pb-space-xxs"
            >
              <h3 class="h3-small d-flex">
                <span class="my-auto"> {{ compData.USssn.label }}</span>
                <span
                  class="ml-space-xs ml-lg-space-sm tool-tip-icon"
                  tabindex="0"
                  v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
                  :title="compData.USssn.tooltip"
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
          <base-input-ssn
            id="social_security_number"
            v-model="$v.usCitizenship.ssn.$model"
            :isInputValid="
              $v.usCitizenship.ssn.$dirty && $v.usCitizenship.ssn.$error
                ? false
                : null
            "
            :onErrorMsg="ssnErrorMsg"
            :isSsnPreFilled="isSsnPreFilled"
            @change="handleSsnChange"
          ></base-input-ssn>
        </b-form-group>
      </div>
    </template>
    <!-- Not a US citizen -->
    <template v-if="isNonUsCitizenSelected">
      <!-- What type of Visa will you be holding? -->
      <div class="col-12 col-lg-5 mr-lg-gutter">
        <b-form-group
          id="group_type_of_visa"
          aria-label="Type of visa"
          label-class="pb-0"
          label-for="type_of_visa"
          class="mb-0 mt-space-sm position-relative"
          data-cy="my-info-us-citizenship-visa-type-group"
        >
          <template #label>
            <label for="type_of_visa" class="mb-space-xs mb-lg-space-sm">
              <h3 class="h3-small d-flex">
                <span class="my-auto">
                  What
                  <a
                    href="javascript:void(0)"
                    class="text-primary text-underline"
                    @click="handleTypeOfVisaCtaClick"
                    >type of visa</a
                  >
                  will you be holding?
                </span>
                <span
                  class="ml-space-xs ml-lg-space-sm tool-tip-icon"
                  tabindex="0"
                  v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
                  :title="compData.typeOfVisa.tooltip"
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
            id="type_of_visa"
            :options="compData.typeOfVisa.options"
            v-model="$v.usCitizenship.typeOfVisa.$model"
            :onErrorMsg="selectErrorMsg($v.usCitizenship.typeOfVisa)"
            :placeholderText="compData.typeOfVisa.placeholder"
          ></base-select>
        </b-form-group>
        <!-- F1 visa error message -->
        <template v-if="usCitizenship.typeOfVisa?.value === 'Student_(F1)'">
          <div
            class="f1-visa-error-msg d-flex pl-space-xs pr-space-sm py-space-xs mt-space-xs border border-danger"
            data-cy="my-info-us-citizenship-f1-visa-warning"
          >
            <font-awesome-icon
              icon="fa-solid fa-triangle-exclamation"
              size="2xl"
              class="pr-space-xs"
            />
            <div class="text-small text-dark-3">
              <p class="mb-lg-space-sm">
                {{ compData.f1VisaError.text }}
              </p>
              <p class="mb-0">
                <span>
                  {{ compData.f1VisaError.subText }}
                </span>
                <a
                  @click="handleF1VisaErrorCtaClick"
                  v-b-toggle.ug-app-f1-visa-error-need-help
                  href="javascript:void(0)"
                  class="text-underline text-dark-3"
                  >click here</a
                >
                <span>.</span>
              </p>
            </div>
          </div>
        </template>
      </div>

      <template v-if="usCitizenship.typeOfVisa">
        <div class="col-12">
          <div class="row">
            <!-- Country of Citizenship -->
            <div class="col-12 col-lg-5 mr-lg-gutter">
              <b-form-group
                id="group_citizenship_country"
                :aria-label="compData.countryOfCitizenship.label"
                label-class="pb-0"
                label-for="country_of_citizenship"
                class="mb-0 mt-space-xs mt-lg-space-sm position-relative"
                data-cy="my-info-us-citizenship-citizenship-country-group"
              >
                <template #label>
                  <label
                    for="country_of_citizenship"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-small d-flex">
                      <span class="my-auto">
                        {{ compData.countryOfCitizenship.label }}</span
                      >
                    </h3>
                  </label>
                </template>

                <base-select
                  id="country_of_citizenship"
                  :options="getCitizenCountryOptions"
                  v-model="$v.usCitizenship.countryOfCitizenShip.$model"
                  :onErrorMsg="
                    selectErrorMsg($v.usCitizenship.countryOfCitizenShip)
                  "
                  :placeholderText="compData.countryOfCitizenship.placeholder"
                  @select="handleCitizenCountrySelect"
                ></base-select>
              </b-form-group>
            </div>
            <!-- Country of Birth -->
            <div class="col-12 col-lg-5 ml-lg-gutter">
              <b-form-group
                id="group_birth_country"
                :aria-label="compData.countryOfBirth.label"
                label-class="pb-0"
                label-for="country_of_birth"
                class="mb-0 mt-space-xs mt-lg-space-sm position-relative"
                data-cy="my-info-us-citizenship-birth-country-group"
              >
                <template #label>
                  <label
                    for="country_of_birth"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-small d-flex">
                      <span class="my-auto">
                        {{ compData.countryOfBirth.label }}
                      </span>
                      <span
                        class="ml-space-xs ml-lg-space-sm tool-tip-icon"
                        tabindex="0"
                        v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
                        :title="compData.countryOfBirth.tooltip"
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
                  id="country_of_birth"
                  :options="configBirthCountries"
                  v-model="$v.usCitizenship.countryOfBirth.$model"
                  :onErrorMsg="selectErrorMsg($v.usCitizenship.countryOfBirth)"
                  :placeholderText="compData.countryOfBirth.placeholder"
                  @select="handleBirthCountrySelect"
                ></base-select>
              </b-form-group>
            </div>
            <!-- City of Birth -->
            <template v-if="isUsCitizenshipCityOfBirthRequired">
              <div class="col-12 col-lg-5 mr-lg-space-md">
                <b-form-group
                  id="group_birth_city"
                  :aria-label="compData.cityOfBirthLabel"
                  label-class="pb-0"
                  class="mb-0 mt-space-xs mt-lg-space-sm position-relative"
                  data-cy="my-info-us-citizenship-birth-city-group"
                >
                  <template #label>
                    <label
                      for="city_of_birth_input"
                      class="mb-space-xs mb-lg-space-sm"
                    >
                      <h3 class="h3-small">
                        {{ compData.cityOfBirthLabel }}
                      </h3>
                    </label>
                  </template>
                  <b-form-input
                    id="city_of_birth_input"
                    placeholder="Enter your text"
                    v-model.trim="$v.usCitizenship.cityOfBirth.$model"
                    :state="
                      $v.usCitizenship.cityOfBirth.$dirty
                        ? !$v.usCitizenship.cityOfBirth.$error
                        : null
                    "
                    aria-describedby="input-live-help input-live-feedback"
                  >
                  </b-form-input>
                  <b-form-invalid-feedback
                    v-if="!$v.usCitizenship.cityOfBirth.required"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    This is a required field.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="!$v.usCitizenship.cityOfBirth.validText"
                    class="position-relative"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    The city of Birth can only contain letters, spaces and
                    hyphens (-).
                  </b-form-invalid-feedback>
                </b-form-group>
              </div>
            </template>
            <!-- Other Visa Choices -->
            <template v-if="isUsCitizenshipOtherVisaChoisesRequired">
              <div class="col-12 col-lg-5 mr-lg-space-md">
                <b-form-group
                  id="group_other_visa_choices"
                  :aria-label="compData.otherVisaChoices.label"
                  label-class="pb-0"
                  label-for="other_visa_choices"
                  class="mb-0 mt-space-xs mt-lg-space-sm position-relative"
                  data-cy="my-info-us-citizenship-other-visa-group"
                >
                  <template #label>
                    <label
                      for="other_visa_choices"
                      class="mb-space-xs mb-lg-space-sm"
                    >
                      <h3 class="h3-small d-flex">
                        <span class="my-auto">
                          {{ compData.otherVisaChoices.label }}</span
                        >
                      </h3>
                    </label>
                  </template>

                  <base-select
                    id="other_visa_choices"
                    :options="getOtherVisaChoicesOptions"
                    v-model="$v.usCitizenship.otherVisaChoices.$model"
                    :onErrorMsg="
                      selectErrorMsg($v.usCitizenship.otherVisaChoices)
                    "
                    :placeholderText="compData.otherVisaChoices.placeholder"
                    @select="handleOtherVisaChoicesSelect"
                  ></base-select>
                </b-form-group>
              </div>
            </template>
            <!-- Social Security Number (if applicable) -->
            <div class="col-12 col-lg-5">
              <b-form-group
                id="group_ssn"
                :aria-label="compData.nonUSssnLabel"
                label-class="pb-0"
                class="mb-0 mt-space-xs mt-lg-space-sm"
                data-cy="my-info-us-citizenship-ssn-group"
              >
                <template #label>
                  <label
                    for="non_us_social_security_number"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-small">
                      {{ compData.nonUSssnLabel }}
                    </h3>
                  </label>
                </template>
                <base-input-ssn
                  id="non_us_social_security_number"
                  v-model="$v.usCitizenship.ssn.$model"
                  :isInputValid="
                    $v.usCitizenship.ssn.$dirty && $v.usCitizenship.ssn.$error
                      ? false
                      : null
                  "
                  :onErrorMsg="ssnErrorMsg"
                  :isSsnPreFilled="isSsnPreFilled"
                  @change="handleSsnChange"
                ></base-input-ssn>
              </b-form-group>
            </div>
            <!-- issuing an I-20 -->
            <template v-if="isIssuingI20SectionVisible">
              <div class="col-12">
                <b-form-group
                  id="group_issuing_i20"
                  :aria-label="compData.issuingI20.label"
                  label-class="pb-0"
                  class="mb-0 mt-space-xs mt-lg-space-sm position-relative"
                  data-cy="my-info-us-citizenship-issuing-i20-group"
                >
                  <template #label>
                    <label for="issuing_i20_radio" class="mb-space-xxs">
                      <h3 class="h3-small">
                        {{ compData.issuingI20.label }}
                      </h3>
                    </label>
                  </template>
                  <base-radio-group
                    name="issuing_i20_radio"
                    :options="compData.issuingI20.options"
                    v-model="$v.usCitizenship.issuingI20.$model"
                    aria-describedby="input-live-help input-live-feedback"
                    :class="{
                      'is-invalid':
                        $v.usCitizenship.issuingI20.$dirty &&
                        $v.usCitizenship.issuingI20.$error,
                    }"
                  >
                  </base-radio-group>
                  <b-form-invalid-feedback
                    v-if="!$v.usCitizenship.issuingI20.required"
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
            <!-- International and shipping address -->
            <template v-if="isInternationalAddressVisible">
              <div
                class="col-12"
                data-cy="my-info-us-citizenship-international-address"
              >
                <h3 class="h3-large mt-space-xs mt-lg-space-md">
                  {{ compData.intAddressLabel }}
                </h3>
                <!-- Country -->
                <b-form-group
                  id="group_int_address_country"
                  :aria-label="compData.address.country.label"
                  label-class="pb-0"
                  label-for="intl_address_country_select"
                  class="mb-0 mt-lg-space-md position-relative"
                  data-cy="my-info-us-citizenship-int-add-country-group"
                >
                  <template #label>
                    <label
                      for="intl_address_country_select"
                      class="mb-space-sm"
                    >
                      <h3 class="h3-small">
                        {{ compData.address.country.label }}
                      </h3>
                    </label>
                  </template>
                  <base-select
                    id="intl_address_country_select"
                    :options="getIntAddressCountryOptions"
                    v-model="$v.usCitizenship.intAddress.countryCode.$model"
                    :onErrorMsg="
                      selectErrorMsg($v.usCitizenship.intAddress.countryCode)
                    "
                    :placeholderText="compData.address.country.placeholder"
                    class="col-12 col-lg-5 px-0 pr-lg-gutter"
                    @change="handleIntAddressCountrySelect"
                  ></base-select>
                </b-form-group>
                <!-- Address line 1 -->
                <b-form-group
                  id="group_int_address_line_1"
                  :aria-label="compData.address.addressLine1.label"
                  label-class="pb-0"
                  class="mb-0 mt-space-xs mt-lg-space-sm col-12 col-lg-5 px-0 pr-lg-gutter"
                  data-cy="my-info-us-citizenship-int-add-address-line-1-group"
                >
                  <template #label>
                    <label
                      for="int_address_line_1_input"
                      class="mb-space-xs mb-lg-space-sm"
                    >
                      <h3 class="h3-small">
                        {{ compData.address.addressLine1.label }}
                      </h3>
                    </label>
                  </template>
                  <b-form-input
                    id="int_address_line_1_input"
                    :placeholder="compData.address.addressLine1.placeholder"
                    :state="
                      $v.usCitizenship.intAddress.street1.$dirty
                        ? !$v.usCitizenship.intAddress.street1.$error
                        : null
                    "
                    v-model.trim="$v.usCitizenship.intAddress.street1.$model"
                    aria-describedby="input-live-help input-live-feedback"
                  >
                  </b-form-input>
                  <!-- Error message -->
                  <b-form-invalid-feedback
                    v-if="!$v.usCitizenship.intAddress.street1.required"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    This is a required field.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-if="!$v.usCitizenship.intAddress.street1.maxLength"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    Should not be more than 42 characters.
                  </b-form-invalid-feedback>
                </b-form-group>
                <!-- Address line 2 -->
                <b-form-group
                  id="group_int_address_line_2"
                  :aria-label="compData.address.addressLine2.label"
                  label-class="pb-0"
                  class="mb-0 mt-space-xs mt-lg-space-sm col-12 col-lg-5 px-0 pr-lg-gutter"
                  data-cy="my-info-us-citizenship-int-add-address-line-2-group"
                >
                  <template #label>
                    <label
                      for="int_address_line_2_input"
                      class="mb-space-xs mb-lg-space-sm"
                    >
                      <h3 class="h3-small">
                        {{ compData.address.addressLine2.label }}
                      </h3>
                    </label>
                  </template>
                  <b-form-input
                    id="int_address_line_2_input"
                    :placeholder="compData.address.addressLine2.placeholder"
                    v-model.trim="$v.usCitizenship.intAddress.street2.$model"
                    aria-describedby="input-live-help input-live-feedback"
                    :state="
                      $v.usCitizenship.intAddress.street2.$dirty
                        ? !$v.usCitizenship.intAddress.street2.$error
                        : null
                    "
                  >
                  </b-form-input>
                  <b-form-invalid-feedback
                    v-if="!$v.usCitizenship.intAddress.street2.maxLength"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    Should not be more than 42 characters.
                  </b-form-invalid-feedback>
                </b-form-group>
                <!-- City -->
                <b-form-group
                  id="group_int_address_city"
                  :aria-label="compData.address.cityLabel"
                  label-class="pb-0"
                  class="mb-0 mt-space-xs mt-lg-space-sm col-12 col-lg-5 px-0 pr-lg-gutter"
                  data-cy="my-info-us-citizenship-int-add-city-group"
                >
                  <template #label>
                    <label
                      for="int_address_city_input"
                      class="mb-space-xs mb-lg-space-sm"
                    >
                      <h3 class="h3-small">
                        {{ compData.address.cityLabel }}
                      </h3>
                    </label>
                  </template>
                  <b-form-input
                    id="int_address_city_input"
                    placeholder="Enter your text"
                    :state="
                      $v.usCitizenship.intAddress.city.$dirty
                        ? !$v.usCitizenship.intAddress.city.$error
                        : null
                    "
                    v-model.trim="$v.usCitizenship.intAddress.city.$model"
                    aria-describedby="input-live-help input-live-feedback"
                  >
                  </b-form-input>
                  <!-- Error message -->
                  <b-form-invalid-feedback
                    v-if="!$v.usCitizenship.intAddress.city.required"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    This is a required field.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="!$v.usCitizenship.intAddress.city.maxLength"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    The city should not be more than 30 characters.
                  </b-form-invalid-feedback>
                </b-form-group>
                <!-- State / Province / Region -->
                <b-form-group
                  id="group_int_address_state"
                  :aria-label="compData.address.stateLabel"
                  label-class="pb-0"
                  label-for="int_address_state_input"
                  class="mb-0 mt-space-xs mt-lg-space-sm col-12 col-lg-5 px-0 pr-lg-gutter"
                  data-cy="my-info-us-citizenship-int-add-state-group"
                >
                  <template #label>
                    <label
                      for="int_address_state_input"
                      class="mb-space-xs mb-lg-space-sm"
                    >
                      <h3 class="h3-small">
                        {{ compData.address.stateLabel }}
                      </h3>
                    </label>
                  </template>

                  <template v-if="configIntAddressStates.length !== 0">
                    <base-select
                      id="int_address_state"
                      :options="configIntAddressStates"
                      v-model="$v.usCitizenship.intAddress.stateProvince.$model"
                      :onErrorMsg="
                        selectErrorMsg(
                          $v.usCitizenship.intAddress.stateProvince
                        )
                      "
                      placeholderText="Select the state"
                      @select="handleIntAddressStateSelect"
                    ></base-select>
                  </template>
                  <template v-else>
                    <b-form-input
                      id="int_address_state"
                      :state="
                        $v.usCitizenship.intAddress.stateProvince.$dirty
                          ? !$v.usCitizenship.intAddress.stateProvince.$error
                          : null
                      "
                      placeholder="Enter your text"
                      v-model.trim="
                        $v.usCitizenship.intAddress.stateProvince.$model
                      "
                      aria-describedby="input-live-help input-live-feedback"
                    >
                    </b-form-input>
                  </template>
                  <!-- Error message -->
                  <b-form-invalid-feedback
                    v-if="!$v.usCitizenship.intAddress.stateProvince.required"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    This is a required field.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="
                      !$v.usCitizenship.intAddress.stateProvince.maxLength
                    "
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    The state should not be more than 30 characters.
                  </b-form-invalid-feedback>
                </b-form-group>
                <!-- Zip / Postal code -->
                <b-form-group
                  id="group_int_address_zip_code"
                  :aria-label="compData.address.zipCodeLabel"
                  label-class="pb-0"
                  class="mb-0 mt-space-xs mt-lg-space-sm col-12 col-lg-5 px-0 pr-lg-gutter"
                  data-cy="my-info-us-citizenship-int-add-zip-code-group"
                >
                  <template #label>
                    <label
                      for="int_address_zip_code_input"
                      class="mb-space-xs mb-lg-space-sm"
                    >
                      <h3 class="h3-small">
                        {{ compData.address.zipCodeLabel }}
                      </h3>
                    </label>
                  </template>
                  <b-form-input
                    id="int_address_zip_code_input"
                    placeholder="Enter your text"
                    :state="
                      $v.usCitizenship.intAddress.postalCode.$dirty
                        ? !$v.usCitizenship.intAddress.postalCode.$error
                        : null
                    "
                    v-model.trim="$v.usCitizenship.intAddress.postalCode.$model"
                    aria-describedby="input-live-help input-live-feedback"
                  >
                  </b-form-input>
                  <!-- Error message -->
                  <b-form-invalid-feedback
                    v-if="!$v.usCitizenship.intAddress.postalCode.required"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    This is a required field.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="
                      !$v.usCitizenship.intAddress.postalCode.maxLength
                    "
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    The zip/postal code should not be more than 12 characters.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="
                      !$v.usCitizenship.intAddress.postalCode.validCode
                    "
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    {{
                      usCitizenship.intAddress.countryCode?.value ===
                      MyInfoConstants.usCountryCode
                        ? "The zip/postal code can only contain integers and one hyphen (-) in between the strings."
                        : "The zip/postal code can only contain letters, integers and one hyphen (-) in between the strings."
                    }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </div>
            </template>
            <!-- I-20 shipping address -->
            <template v-if="isShippingAddressVisible">
              <div class="col-12">
                <b-form-group
                  id="group_i20_shipping_address"
                  :aria-label="compData.shippingAddress.label"
                  label-class="pb-0"
                  label-for="i20_shipping_address"
                  class="mb-0 mt-space-sm mt-lg-space-lg position-relative"
                  data-cy="my-info-us-citizenship-shipping-address-options-group"
                >
                  <template #label>
                    <label
                      for="i20_shipping_address"
                      class="mb-space-xs mb-lg-space-md"
                    >
                      <h3 class="h3-large">
                        {{ compData.shippingAddress.label }}
                      </h3>
                    </label>
                    <p>
                      {{ compData.shippingAddress.text }}
                    </p>
                  </template>
                  <base-select
                    id="i20_shipping_address"
                    :options="i20ShippingAddressOptions"
                    v-model="$v.usCitizenship.shippingAddressType.$model"
                    :onErrorMsg="
                      selectErrorMsg($v.usCitizenship.shippingAddressType)
                    "
                    :placeholderText="compData.shippingAddress.placeholder"
                    class="col-12 col-lg-5 px-0 pr-lg-gutter"
                    @change="handleShippingAddressChange"
                  ></base-select>
                </b-form-group>
                <!-- Other shipping address -->
                <template v-if="isShippingAddressInputsVisible">
                  <!-- Country -->
                  <b-form-group
                    id="group_shipping_address_country"
                    :aria-label="compData.address.country.label"
                    label-class="pb-0"
                    label-for="shipping_address_country_select"
                    class="mb-0 mt-lg-space-md position-relative"
                    data-cy="my-info-us-citizenship-shipping-add-country-group"
                  >
                    <template #label>
                      <label
                        for="shipping_address_country_select"
                        class="mb-space-sm"
                      >
                        <h3 class="h3-small">
                          {{ compData.address.country.label }}
                        </h3>
                      </label>
                    </template>
                    <base-select
                      id="shipping_address_country_select"
                      :options="configShippingAddressCountries"
                      v-model="
                        $v.usCitizenship.shippingAddress.countryCode.$model
                      "
                      :onErrorMsg="
                        selectErrorMsg(
                          $v.usCitizenship.shippingAddress.countryCode
                        )
                      "
                      :placeholderText="compData.address.country.placeholder"
                      class="col-12 col-lg-5 px-0 pr-lg-gutter"
                      @select="handleShippingAddressCountrySelect"
                    ></base-select>
                  </b-form-group>
                  <!-- Address line 1 -->
                  <b-form-group
                    id="group_shipping_address_line_1"
                    :aria-label="compData.address.addressLine1.label"
                    label-class="pb-0"
                    class="mb-0 mt-space-xs mt-lg-space-sm col-12 col-lg-5 px-0 pr-lg-gutter"
                    data-cy="my-info-us-citizenship-shipping-add-address-line-1-group"
                  >
                    <template #label>
                      <label
                        for="shipping_address_line_1_input"
                        class="mb-space-xs mb-lg-space-sm"
                      >
                        <h3 class="h3-small">
                          {{ compData.address.addressLine1.label }}
                        </h3>
                      </label>
                    </template>
                    <b-form-input
                      id="shipping_address_line_1_input"
                      :placeholder="compData.address.addressLine1.placeholder"
                      :state="
                        $v.usCitizenship.shippingAddress.street1.$dirty
                          ? !$v.usCitizenship.shippingAddress.street1.$error
                          : null
                      "
                      v-model.trim="
                        $v.usCitizenship.shippingAddress.street1.$model
                      "
                      aria-describedby="input-live-help input-live-feedback"
                    >
                    </b-form-input>
                    <!-- Error message -->
                    <b-form-invalid-feedback
                      v-if="!$v.usCitizenship.shippingAddress.street1.required"
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      This is a required field.
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback
                      v-if="!$v.usCitizenship.shippingAddress.street1.maxLength"
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      Should not be more than 42 characters.
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <!-- Address line 2 -->
                  <b-form-group
                    id="group_shipping_address_line_2"
                    :aria-label="compData.address.addressLine2.label"
                    label-class="pb-0"
                    class="mb-0 mt-space-xs mt-lg-space-sm col-12 col-lg-5 px-0 pr-lg-gutter"
                    data-cy="my-info-us-citizenship-shipping-add-address-line-2-group"
                  >
                    <template #label>
                      <label
                        for="shipping_address_line_2_input"
                        class="mb-space-xs mb-lg-space-sm"
                      >
                        <h3 class="h3-small">
                          {{ compData.address.addressLine2.label }}
                        </h3>
                      </label>
                    </template>
                    <b-form-input
                      id="shipping_address_line_2_input"
                      :placeholder="compData.address.addressLine2.placeholder"
                      v-model.trim="
                        $v.usCitizenship.shippingAddress.street2.$model
                      "
                      aria-describedby="input-live-help input-live-feedback"
                      :state="
                        $v.usCitizenship.shippingAddress.street2.$dirty
                          ? !$v.usCitizenship.shippingAddress.street2.$error
                          : null
                      "
                    >
                    </b-form-input>
                    <b-form-invalid-feedback
                      v-if="!$v.usCitizenship.shippingAddress.street2.maxLength"
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      Should not be more than 42 characters.
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <!-- City -->
                  <b-form-group
                    id="group_shipping_address_city"
                    :aria-label="compData.address.cityLabel"
                    label-class="pb-0"
                    class="mb-0 mt-space-xs mt-lg-space-sm col-12 col-lg-5 px-0 pr-lg-gutter"
                    data-cy="my-info-us-citizenship-shipping-add-city-group"
                  >
                    <template #label>
                      <label
                        for="shipping_address_city_input"
                        class="mb-space-xs mb-lg-space-sm"
                      >
                        <h3 class="h3-small">
                          {{ compData.address.cityLabel }}
                        </h3>
                      </label>
                    </template>
                    <b-form-input
                      id="shipping_address_city_input"
                      placeholder="Enter your text"
                      :state="
                        $v.usCitizenship.shippingAddress.city.$dirty
                          ? !$v.usCitizenship.shippingAddress.city.$error
                          : null
                      "
                      v-model.trim="
                        $v.usCitizenship.shippingAddress.city.$model
                      "
                      aria-describedby="input-live-help input-live-feedback"
                    >
                    </b-form-input>
                    <!-- Error message -->
                    <b-form-invalid-feedback
                      v-if="!$v.usCitizenship.shippingAddress.city.required"
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      This is a required field.
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback
                      v-else-if="
                        !$v.usCitizenship.shippingAddress.city.maxLength
                      "
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      The city should not be more than 30 characters.
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <!-- State / Province / Region -->
                  <b-form-group
                    id="group_shipping_address_state"
                    :aria-label="compData.address.stateLabel"
                    label-class="pb-0"
                    label-for="shipping_address_state_input"
                    class="mb-0 mt-space-xs mt-lg-space-sm col-12 col-lg-5 px-0 pr-lg-gutter"
                    data-cy="my-info-us-citizenship-shipping-add-state-group"
                  >
                    <template #label>
                      <label
                        for="shipping_address_state_input"
                        class="mb-space-xs mb-lg-space-sm"
                      >
                        <h3 class="h3-small">
                          {{ compData.address.stateLabel }}
                        </h3>
                      </label>
                    </template>

                    <template v-if="configShippingAddressStates.length !== 0">
                      <base-select
                        id="shipping_address_state"
                        :options="configShippingAddressStates"
                        v-model="
                          $v.usCitizenship.shippingAddress.stateProvince.$model
                        "
                        :onErrorMsg="
                          selectErrorMsg(
                            $v.usCitizenship.shippingAddress.stateProvince
                          )
                        "
                        placeholderText="Select the state"
                        @select="handleShippingAddressStateSelect"
                      ></base-select>
                    </template>
                    <template v-else>
                      <b-form-input
                        id="shipping_address_state"
                        :state="
                          $v.usCitizenship.shippingAddress.stateProvince.$dirty
                            ? !$v.usCitizenship.shippingAddress.stateProvince
                                .$error
                            : null
                        "
                        placeholder="Enter your text"
                        v-model.trim="
                          $v.usCitizenship.shippingAddress.stateProvince.$model
                        "
                        aria-describedby="input-live-help input-live-feedback"
                      >
                      </b-form-input>
                    </template>

                    <!-- Error message -->
                    <b-form-invalid-feedback
                      v-if="
                        !$v.usCitizenship.shippingAddress.stateProvince.required
                      "
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      This is a required field.
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback
                      v-else-if="
                        !$v.usCitizenship.shippingAddress.stateProvince
                          .maxLength
                      "
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      The state should not be more than 30 characters.
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <!-- Zip / Postal code -->
                  <b-form-group
                    id="group_shipping_address_zip_code"
                    :aria-label="compData.address.zipCodeLabel"
                    label-class="pb-0"
                    class="mb-0 mt-space-xs mt-lg-space-sm col-12 col-lg-5 px-0 pr-lg-gutter"
                    data-cy="my-info-us-citizenship-shipping-add-zip-code-group"
                  >
                    <template #label>
                      <label
                        for="shipping_address_zip_code_input"
                        class="mb-space-xs mb-lg-space-sm"
                      >
                        <h3 class="h3-small">
                          {{ compData.address.zipCodeLabel }}
                        </h3>
                      </label>
                    </template>
                    <b-form-input
                      id="shipping_address_zip_code_input"
                      placeholder="Enter your text"
                      :state="
                        $v.usCitizenship.shippingAddress.postalCode.$dirty
                          ? !$v.usCitizenship.shippingAddress.postalCode.$error
                          : null
                      "
                      v-model.trim="
                        $v.usCitizenship.shippingAddress.postalCode.$model
                      "
                      aria-describedby="input-live-help input-live-feedback"
                    >
                    </b-form-input>
                    <!-- Error message -->
                    <b-form-invalid-feedback
                      v-if="
                        !$v.usCitizenship.shippingAddress.postalCode.required
                      "
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      This is a required field.
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback
                      v-else-if="
                        !$v.usCitizenship.shippingAddress.postalCode.maxLength
                      "
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      The zip/postal code should not be more than 12 characters.
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback
                      v-else-if="
                        !$v.usCitizenship.shippingAddress.postalCode.validCode
                      "
                    >
                      <font-awesome-icon
                        icon="fa-sharp fa-regular fa-circle-exclamation"
                        size="xs"
                      />
                      {{
                        usCitizenship.shippingAddress.countryCode?.value ===
                        MyInfoConstants.usCountryCode
                          ? "The zip/postal code can only contain integers and one hyphen (-) in between the strings."
                          : "The zip/postal code can only contain letters, integers and one hyphen (-) in between the strings."
                      }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </template>
              </div>
            </template>
          </div>
        </div>
      </template>
    </template>
    <!-- types of visa sidebar -->
    <b-sidebar
      visible
      id="visa_sidebar"
      v-model="showSidebar"
      right
      bg-variant="white"
      no-header
      backdrop-variant="dark-2"
      backdrop
      shadow
      @hidden="sidebarClosed"
      data-cy="my-info-us-citizenship-types-of-visa-sidebar"
    >
      <template #default="{ hide }">
        <div class="bg-white p-space-sm">
          <button
            @click="hide"
            class="btn bg-white rounded-0 text-medium border-0 p-0"
            data-cy="my-info-us-citizenship-back-button"
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
        <div class="p-space-sm px-lg-space-xl pb-lg-space-xl">
          <img
            src="@/assets/img/arrows-shuffle.svg"
            alt="sidebar image"
            class="img-fluid mb-space-xs mb-lg-space-sm"
          />
          <h2 class="h2-medium">
            {{ compData.typeOfVisa.sidebarData.title }}
          </h2>
          <hr class="mt-space-xs mb-lg-space-md mt-lg-space-sm mb-space-lg" />
          <template v-for="item in compData.typeOfVisa.sidebarData.items">
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
    <!-- Need help sidebar -->
    <b-sidebar
      id="ug-app-f1-visa-error-need-help"
      aria-label="need help? contact us"
      shadow
      right
      backdrop
      backdrop-variant="light-2"
      bg-variant="white"
      no-header
      :no-header-close="true"
      header-class="p-0"
      @hidden="handleNeedHelpSidebar('close')"
      data-cy="my-info-us-citizenship-us-citizenship-need-help-sidebar"
    >
      <!-- content to place in body of the sidebar -->
      <template v-slot:default="{ hide }">
        <!-- header -->
        <div class="px-space-sm pt-space-md">
          <a
            href="javascript:void(0)"
            @click="handleExit(hide)"
            class="font-weight-bold mb-0 text-dark-3"
            data-cy="my-info-us-citizenship-back-button"
          >
            <font-awesome-icon
              icon="fa-arrow-left"
              class="mr-space-xs"
            ></font-awesome-icon>
            <span>Back</span>
          </a>
        </div>
        <!-- body -->
        <portal-form-need-help
          class="no-gutters px-space-md py-space-md px-lg-space-lg py-lg-space-lg"
        ></portal-form-need-help>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  requiredIf,
  minLength,
  maxLength,
} from "vuelidate/lib/validators";
import {
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BSidebar,
  VBTooltip,
  VBToggle,
} from "bootstrap-vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";
import BaseInputSSN from "@/components/base-components/BaseInputSSN.vue";
import PortalFormNeedHelp from "@/components/portal-components/PortalFormNeedHelp.vue";
import { MyInfoConstants } from "@/content/enum-ug-application.js";
import { mapActions, mapState } from "pinia";
import { useConfigStore } from "@/stores/config-store.js";
export default {
  name: "SectionUsCitizenship",
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
    homeAddress: {
      type: Object,
      default: null,
    },
    isFormSubmitClicked: {
      type: Boolean,
      default: null,
    },
  },
  mixins: [validationMixin],
  directives: {
    "b-tooltip": VBTooltip,
    "b-toggle": VBToggle,
  },
  components: {
    "base-select": BaseSelect,
    "base-radio-group": BaseRadioGroup,
    "base-input-ssn": BaseInputSSN,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-sidebar": BSidebar,
    "portal-form-need-help": PortalFormNeedHelp,
  },
  watch: {
    usCitizenship: {
      handler() {
        this.$emit("input", this.usCitizenship);
        this.$emit("updateErrorState", this.$v.usCitizenship.$invalid);
      },
      deep: true,
    },
    isFormSubmitClicked(newValue) {
      if (newValue) {
        this.$v.usCitizenship.$touch();
      }
    },
    configIntAddressStates: {
      handler(newValue) {
        // reseting the state value when the options are updated when country is selected.
        if (newValue.length > 0) {
          if (this.usCitizenship.intAddress.stateProvince) {
            const index = newValue.findIndex(
              (ele) =>
                ele.value === this.usCitizenship.intAddress.stateProvince.value
            );
            if (index === -1) {
              this.usCitizenship.intAddress.stateProvince = null;
              this.configDeselectConfigIntAddressState();
            }
          }
        } else {
          this.usCitizenship.intAddress.stateProvince = null;
          this.configDeselectConfigIntAddressState();
        }
        this.$v.usCitizenship.intAddress.stateProvince.$reset();
      },
      deep: true,
    },
    configShippingAddressStates: {
      handler(newValue) {
        // reseting the state value when the options are updated when country is selected.
        if (newValue.length > 0) {
          if (this.usCitizenship.shippingAddress.stateProvince) {
            const index = newValue.findIndex(
              (ele) =>
                ele.value ===
                this.usCitizenship.shippingAddress.stateProvince.value
            );
            if (index === -1) {
              this.usCitizenship.shippingAddress.stateProvince = null;
              this.configDeselectShippingAddressState();
            }
          }
        } else if (
          this.usCitizenship.shippingAddressType?.value ===
          MyInfoConstants.usCitizenship.visaOther
        ) {
          this.usCitizenship.shippingAddress.stateProvince = null;
          this.configDeselectShippingAddressState();
        }
        this.$v.usCitizenship.shippingAddress.stateProvince.$reset();
      },
      deep: true,
    },
    isUsCitizenshipCityOfBirthRequired(newValue) {
      if (!newValue) {
        this.usCitizenship.cityOfBirth = null;
      }
    },
    isUsCitizenshipOtherVisaChoisesRequired(newValue) {
      if (!newValue) {
        this.usCitizenship.otherVisaChoices = null;
        this.configDeselectConfigVisaPermitType();
      }
    },
    isIssuingI20SectionVisible(newValue) {
      if (!newValue) {
        this.usCitizenship.issuingI20 = null;
      }
    },
    isShippingAddressVisible(newValue) {
      if (!newValue) {
        this.usCitizenship.shippingAddressType = null;
        this.usCitizenship.shippingAddress = {
          type: MyInfoConstants.i20AddressType,
          countryCode: null,
          street1: null,
          street2: "",
          city: null,
          stateProvince: null,
          postalCode: null,
        };
      }
    },
    isInternationalAddressVisible(newValue) {
      if (!newValue) {
        this.usCitizenship.intAddress = {
          type: MyInfoConstants.intAddressType,
          countryCode: null,
          street1: null,
          street2: "",
          city: null,
          stateProvince: null,
          postalCode: null,
        };
      }
    },
    homeAddress: {
      handler() {
        this.generateI20ShippingAddressOptions();
      },
      deep: true,
    },
    "usCitizenship.intAddress": {
      handler() {
        this.generateI20ShippingAddressOptions();
      },
      deep: true,
    },
  },
  data() {
    return {
      MyInfoConstants: MyInfoConstants,
      showSidebar: false,
      isSsnPreFilled: false,
      i20ShippingAddressOptions: null,
      usCitizenship: {
        isUsCitizen: null,
        countryOfBirth: null,
        ssn: null,
        typeOfVisa: null,
        countryOfCitizenShip: null,
        cityOfBirth: null,
        otherVisaChoices: null,
        issuingI20: null,
        intAddress: {
          type: MyInfoConstants.intAddressType,
          countryCode: null,
          street1: null,
          street2: "",
          city: null,
          stateProvince: null,
          postalCode: null,
        },
        shippingAddressType: null,
        shippingAddress: {
          type: MyInfoConstants.i20AddressType,
          countryCode: null,
          street1: null,
          street2: null,
          city: null,
          stateProvince: null,
          postalCode: null,
        },
      },
    };
  },
  validations: {
    usCitizenship: {
      isUsCitizen: {
        required,
      },
      countryOfBirth: { required },
      ssn: {
        required: requiredIf(function () {
          return this.isUsCitizenSelected;
        }),
        minLength: minLength(9),
      },
      typeOfVisa: {
        required: requiredIf(function () {
          return this.isNonUsCitizenSelected;
        }),
      },
      countryOfCitizenShip: {
        required: requiredIf(function () {
          return this.isNonUsCitizenSelected;
        }),
      },
      cityOfBirth: {
        required: requiredIf(function () {
          return this.isUsCitizenshipCityOfBirthRequired;
        }),
        validText: function (value) {
          return (
            !this.isUsCitizenshipCityOfBirthRequired ||
            /^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(value)
          );
        },
      },
      otherVisaChoices: {
        required: requiredIf(function () {
          return this.isUsCitizenshipOtherVisaChoisesRequired;
        }),
      },
      issuingI20: {
        required: requiredIf(function () {
          return this.isIssuingI20SectionVisible;
        }),
      },
      intAddress: {
        countryCode: {
          required: requiredIf(function () {
            return this.isInternationalAddressVisible;
          }),
        },
        street1: {
          required: requiredIf(function () {
            return this.isInternationalAddressVisible;
          }),
          maxLength: maxLength(42),
        },
        street2: {
          maxLength: maxLength(42),
        },
        city: {
          required: requiredIf(function () {
            return this.isInternationalAddressVisible;
          }),
          maxLength: maxLength(30),
        },
        stateProvince: {
          required: requiredIf(function () {
            return this.isInternationalAddressVisible;
          }),
          maxLength: function (value) {
            return (
              !this.isInternationalAddressVisible ||
              this.configIntAddressStates.length > 0 ||
              value?.length <= 30
            );
          },
        },
        postalCode: {
          required: requiredIf(function () {
            return this.isInternationalAddressVisible;
          }),
          maxLength: maxLength(12),
          validCode: function (value) {
            if (!this.isIntandShippingaAddressVisible) {
              return true;
            }
            if (
              this.usCitizenship.intAddress.countryCode?.value ===
              MyInfoConstants.usCountryCode
            ) {
              return /^(?!-)(?!.*-$)(?!.*-.*-)[0-9-]{1,12}$/.test(value);
            } else {
              return /^(?!-)(?!.*-$)(?!.*-.*-)[A-Za-z0-9-]{1,12}$/.test(value);
            }
          },
        },
      },
      shippingAddressType: {
        required: requiredIf(function () {
          return this.isShippingAddressVisible;
        }),
      },
      shippingAddress: {
        countryCode: {
          required: requiredIf(function () {
            return this.isShippingAddressVisible;
          }),
        },
        street1: {
          required: requiredIf(function () {
            return this.isShippingAddressVisible;
          }),
          maxLength: maxLength(42),
        },
        street2: {
          maxLength: maxLength(42),
        },
        city: {
          required: requiredIf(function () {
            return this.isShippingAddressVisible;
          }),
          maxLength: maxLength(30),
        },
        stateProvince: {
          required: requiredIf(function () {
            return this.isShippingAddressVisible;
          }),
          maxLength: function (value) {
            return (
              !this.isShippingAddressVisible ||
              !this.isShippingAddressInputsVisible ||
              this.configShippingAddressStates.length > 0 ||
              value?.length <= 30
            );
          },
        },
        postalCode: {
          required: requiredIf(function () {
            return this.isShippingAddressVisible;
          }),
          maxLength: maxLength(12),
          validCode: function (value) {
            if (!this.isIntandShippingaAddressVisible) {
              return true;
            }
            if (
              this.usCitizenship.shippingAddress.countryCode?.value ===
              MyInfoConstants.usCountryCode
            ) {
              return /^(?!-)(?!.*-$)(?!.*-.*-)[0-9-]{1,12}$/.test(value);
            } else {
              return /^(?!-)(?!.*-$)(?!.*-.*-)[A-Za-z0-9-]{1,12}$/.test(value);
            }
          },
        },
      },
    },
  },
  computed: {
    ...mapState(useConfigStore, {
      configBirthCountries: "birthCountries",
      configCitizenCountries: "citizenCountries",
      configVisaPermitTypes: "visaPermitTypes",
      configIntAddressCountries: "internationalAddressCountries",
      configIntAddressStates: "internationalAddressStates",
      configShippingAddressCountries: "shippingAddressCountries",
      configShippingAddressStates: "shippingAddressStates",
    }),
    isIssuingI20SectionVisible() {
      return (
        this.isNonUsCitizenSelected &&
        (this.usCitizenship.typeOfVisa?.value ===
          MyInfoConstants.usCitizenship.visaExchangeVisitor ||
          this.usCitizenship.typeOfVisa?.value ===
            MyInfoConstants.usCitizenship.visaStudentF1 ||
          this.usCitizenship.otherVisaChoices?.value ===
            MyInfoConstants.usCitizenship.visaStudentF2)
      );
    },
    isInternationalAddressVisible() {
      return (
        this.isNonUsCitizenSelected &&
        this.usCitizenship.typeOfVisa?.value ===
          MyInfoConstants.usCitizenship.visaStudentF1 &&
        this.homeAddress.countryCode?.value === MyInfoConstants.usCountryCode
      );
    },
    isShippingAddressVisible() {
      return (
        this.isNonUsCitizenSelected &&
        this.usCitizenship.typeOfVisa?.value ===
          MyInfoConstants.usCitizenship.visaStudentF1
      );
    },
    isUsCitizenSelected() {
      return this.usCitizenship.isUsCitizen?.value;
    },
    isNonUsCitizenSelected() {
      if (this.usCitizenship.isUsCitizen?.value === false) {
        return true;
      } else {
        return false;
      }
    },
    isUsCitizenshipCityOfBirthRequired() {
      return (
        this.isNonUsCitizenSelected &&
        this.usCitizenship.typeOfVisa?.value ==
          MyInfoConstants.usCitizenship.visaStudentF1
      );
    },
    isUsCitizenshipOtherVisaChoisesRequired() {
      return (
        this.isNonUsCitizenSelected &&
        this.usCitizenship.typeOfVisa?.value ==
          MyInfoConstants.usCitizenship.visaOther
      );
    },
    getCitizenCountryOptions() {
      return this.configCitizenCountries.filter(
        (country) => country.countryCode !== MyInfoConstants.usCountryCode
      );
    },
    getIntAddressCountryOptions() {
      return this.configIntAddressCountries.filter(
        (country) => country.countryCode !== MyInfoConstants.usCountryCode
      );
    },
    isShippingAddressInputsVisible() {
      return (
        this.usCitizenship.shippingAddressType?.value ===
        MyInfoConstants.usCitizenship.shippingAddressTypeOtherValue
      );
    },
    getOtherVisaChoicesOptions() {
      return this.configVisaPermitTypes.filter(
        (visa) =>
          !this.compData.typeOfVisa.options.some(
            (item) => item.visaPermitTypeCode === visa.visaPermitTypeCode
          )
      );
    },
    ssnErrorMsg() {
      let errMsg = [];
      if (!this.$v.usCitizenship.ssn.required) {
        errMsg.push("This is a required field.");
      }
      if (!this.$v.usCitizenship.ssn.minLength) {
        errMsg.push("Must be 9 characters.");
      }
      return errMsg;
    },
  },
  methods: {
    ...mapActions(useConfigStore, {
      configSelectBirthCountry: "selectBirthCountry",
      configDeselectBirthCountry: "deselectBirthCountry",
      configSelectCitizenCountry: "selectCitizenCountry",
      configDeselectCitizenCountry: "deselectCitizenCountry",
      configSelectConfigVisaPermitType: "selectVisaPermitType",
      configDeselectConfigVisaPermitType: "deselectVisaPermitType",
      configSelectConfigIntAddressCountry: "selectIntAddressCountry",
      configDeselectConfigIntAddressCountry: "deselectIntAddressCountry",
      configSelectConfigIntAddressState: "selectIntAddressState",
      configDeselectConfigIntAddressState: "deselectIntAddressState",
      configPopulateConfigIntAddressStates:
        "populateInternationalAddressStates",
      configSelectShippingAddressCountry: "selectShippingAddressCountry",
      configDeselectShippingAddressCountry: "deselectShippingAddressCountry",
      configSelectShippingAddressState: "selectShippingAddressState",
      configDeselectShippingAddressState: "deselectShippingAddressState",
      configPopulateShippingAddressStates: "populateShippingAddressStates",
    }),
    async handleShippingAddressChange() {
      if (
        this.usCitizenship.shippingAddressType &&
        this.usCitizenship.shippingAddressType.value !==
          MyInfoConstants.usCitizenship.visaOther
      ) {
        this.usCitizenship.shippingAddress =
          this.usCitizenship.shippingAddressType.address;
        await this.handleShippingAddressCountrySelect(
          this.usCitizenship.shippingAddressType.address.countryCode
        );
        if (
          this.usCitizenship.shippingAddressType.address.stateProvince?.value
        ) {
          await this.handleShippingAddressStateSelect(
            this.usCitizenship.shippingAddressType.address.stateProvince
          );
        }
      } else {
        this.usCitizenship.shippingAddress = {
          type: MyInfoConstants.i20AddressType,
          countryCode: null,
          street1: null,
          street2: null,
          city: null,
          stateProvince: null,
          postalCode: null,
        };
      }
    },
    getAddressInSingleLineFormat(address) {
      let option = null;
      if (
        address.countryCode &&
        address.street1 &&
        address.stateProvince &&
        address.city &&
        address.postalCode
      ) {
        // Single line address
        const singleLineAddress = `${address.street1} ${address.street2}, ${
          address.city
        }, ${
          typeof address.stateProvince === "object"
            ? address.stateProvince.value
            : address.stateProvince
        }, ${address.postalCode}, ${address.countryCode.value}`;
        // option
        option = {
          text: singleLineAddress,
          value: singleLineAddress,
          address: {
            countryCode: address.countryCode,
            street1: address.street1,
            street2: address.street2,
            city: address.city,
            stateProvince: address.stateProvince,
            postalCode: address.postalCode,
            type: MyInfoConstants.i20AddressType,
          },
        };
        return option;
      } else {
        return false;
      }
    },
    // I20 address in single line format for I20 shipping address options
    generateI20ShippingAddressOptions() {
      let options = [];
      const homeAddress = this.getAddressInSingleLineFormat(this.homeAddress);
      const intAddress = this.getAddressInSingleLineFormat(
        this.usCitizenship.intAddress
      );
      if (homeAddress) {
        options.push({ ...homeAddress, type: "home" });
      }
      if (intAddress) {
        options.push({ ...intAddress, type: "int" });
      }
      options.push({ text: "Other", value: "Other", type: "Other" });
      // If home address or int address is selected and then they are updated, updating the shipping address as well.
      if (
        this.usCitizenship.shippingAddressType &&
        this.usCitizenship.shippingAddressType.type !== "Other"
      ) {
        const address = options.filter(
          (option) =>
            option.type === this.usCitizenship.shippingAddressType.type
        );
        this.$v.usCitizenship.shippingAddressType.$model =
          address.length > 0 ? address[0] : null;
        this.handleShippingAddressChange();
      }
      this.i20ShippingAddressOptions = options;
    },
    selectErrorMsg(error) {
      const errMsg = [];
      if (error.$dirty && !error.required) {
        errMsg.push("This is a required field.");
      }
      return errMsg;
    },
    handleBirthCountrySelect(event) {
      this.configDeselectBirthCountry();
      this.configSelectBirthCountry(event);
    },
    handleCitizenCountrySelect(event) {
      this.configDeselectCitizenCountry();
      this.configSelectCitizenCountry(event);
    },
    handleOtherVisaChoicesSelect(event) {
      this.configDeselectConfigVisaPermitType();
      this.configSelectConfigVisaPermitType(event);
    },
    async handleIntAddressCountrySelect(event) {
      this.configDeselectConfigIntAddressCountry();
      if (event) {
        this.configSelectConfigIntAddressCountry(event);
        const response = await this.configPopulateConfigIntAddressStates();
        if (response.code !== 200) {
          // fire error data layer event
          this.$track({
            event: "app_error",
            action: "my_information",
            location: this.$router.currentRoute.fullPath,
            code: response.code,
            message: response.errors.toString(),
          });
        }
      }
    },
    handleIntAddressStateSelect(event) {
      this.configDeselectConfigIntAddressState();
      this.configSelectConfigIntAddressState(event);
    },
    async handleShippingAddressCountrySelect(event) {
      this.configDeselectShippingAddressCountry(event);
      this.configSelectShippingAddressCountry(event);
      const response = await this.configPopulateShippingAddressStates();
      if (response.code !== 200) {
        // fire error data layer event
        this.$track({
          event: "app_error",
          action: "my_information",
          location: this.$router.currentRoute.fullPath,
          code: response.code,
          message: response.errors.toString(),
        });
      }
    },
    handleShippingAddressStateSelect(event) {
      this.configDeselectShippingAddressState();
      this.configSelectShippingAddressState(event);
    },
    handleTypeOfVisaCtaClick() {
      this.showSidebar = true;
    },
    sidebarClosed() {
      // gtm...
    },
    handleSsnChange() {
      if (this.isSsnPreFilled) {
        this.usCitizenship.ssn = null;
        this.isSsnPreFilled = false;
      }
    },
    handleF1VisaErrorCtaClick() {
      this.$track({
        event: "collapse",
        action: "open",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "what type of visa will you be holding?",
        text: "click here",
        component: "u.s. citizenship",
      });
    },
    handleExit(hideScope) {
      if (hideScope) {
        // closes the sidebar
        hideScope();
      }
    },
    handleNeedHelpSidebar(action) {
      // fire data layer event
      this.$track({
        event: "collapse",
        action: action,
        name: "onclick",
        type: "click",
        region: "navbar",
        section: "main navbar",
        text: "need help?",
      });
    },
    handleUsCitizenshipStatusChange(event) {
      this.$track({
        event: "select",
        action: "click",
        name: "onclick",
        type: "checkbox",
        region: "main content",
        section: "u.s. citizenship",
        text: event.text.toLowerCase(),
      });
      if (event?.value) {
        this.usCitizenship.typeOfVisa = null;
        this.configDeselectConfigVisaPermitType();
        const usCountry = this.configBirthCountries.filter(
          (item) => item.value === MyInfoConstants.usCountryCode
        );
        if (usCountry.length > 0) {
          this.usCitizenship.countryOfCitizenShip = usCountry[0];
          this.configDeselectCitizenCountry();
          this.configSelectCitizenCountry(usCountry[0]);
        }
      } else {
        if (
          this.usCitizenship.countryOfCitizenShip?.value ===
          MyInfoConstants.usCountryCode
        ) {
          this.usCitizenship.countryOfCitizenShip = null;
          this.configDeselectCitizenCountry();
        }
      }
    },
  },
  async mounted() {
    if (this.value && Object.keys(this.value).length > 0) {
      Object.assign(this.usCitizenship, this.value);
    }
    // populating the shipping address type
    await this.generateI20ShippingAddressOptions();
    // updating the shippingAddressType if shipping address is already present
    const shippingAddress = this.getAddressInSingleLineFormat(
      this.usCitizenship.shippingAddress
    );
    if (shippingAddress) {
      const address = this.i20ShippingAddressOptions.filter(
        (option) => option.value === shippingAddress.value
      );
      if (address.length > 0) {
        this.usCitizenship.shippingAddressType = address[0];
      } else {
        const otherOption = this.i20ShippingAddressOptions.filter(
          (option) => option.value === "Other"
        );
        this.usCitizenship.shippingAddressType =
          otherOption.length > 0 ? otherOption[0] : null;
      }
    }

    // checking if the SSN needs to be prefilled
    if (this.usCitizenship.ssn) {
      this.isSsnPreFilled = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.f1-visa-error-msg {
  background-color: #f7dddd;
}
</style>

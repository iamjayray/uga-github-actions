<template>
  <div class="row">
    <div class="col-12">
      <label
        for="ethnic_or_racial_background"
        class="mb-space-xs mb-lg-space-md"
      >
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
      <!-- Is the applicant Hispanic/Latino? -->

      <b-form-group
        id="group_hispanic_latino"
        :aria-label="compData.isHispanicOrLatino.label"
        label-class="pb-0"
        class="mb-space-sm"
        data-cy="my-info-ethic-racial-background-is-hispanic-latino-group"
      >
        <template #label>
          <label for="hispanic_latino_radio" class="mb-space-xs">
            <h3 class="h3-small d-flex">
              <span class="my-auto">
                {{ compData.isHispanicOrLatino.label }}
              </span>
              <span
                class="my-auto ml-space-xxs ml-lg-space-sm bg-light-3 text-xs px-space-xxs py-lg-space-xxxs"
              >
                Optional
              </span>
            </h3>
          </label>
        </template>
        <base-radio-group
          name="hispanic_latino_radio"
          :options="compData.isHispanicOrLatino.options"
          v-model="ethnicOrRacialBackground.hispanicOrLatino.isHispanicOrLatino"
          @change="handleHispanicLatinoRadioChange"
        >
        </base-radio-group>
      </b-form-group>
      <!-- Select Hispanic/Latino origin -->
      <template v-if="isHispanicOrLatinoOriginRequired">
        <b-form-group
          id="group_hispanic_latino_origin"
          :aria-label="compData.isHispanicOrLatino.originLabel"
          label-class="pb-0"
          label-for="hispanic_latino_origin"
          class="mb-space-sm mb-lg-space-md position-relative"
          data-cy="my-info-ethic-racial-background-hispanic-latino-origin-group"
        >
          <template #label>
            <label
              for="hispanic_latino_origin"
              class="mb-space-xs mb-lg-space-md"
            >
              <h3 class="h3-small">
                {{ compData.isHispanicOrLatino.originLabel }}
              </h3>
            </label>
          </template>

          <base-select
            id="hispanic_latino_origin"
            :options="getHispanicLatinoOriginOptions"
            v-model="ethnicOrRacialBackground.hispanicOrLatino.origin"
            placeholderText="Select origin"
            class="col-12 col-lg-5 px-0 pr-lg-gutter"
            @change="handleHispanicLatinoOriginSelect"
          ></base-select>
        </b-form-group>
      </template>
      <!-- What is the applicants race? -->
      <b-form-group
        id="group_race"
        :aria-label="compData.isHispanicOrLatino.label"
        label-class="pb-0"
        label-for="select_race"
        class="mb-0"
        data-cy="my-info-ethic-racial-background-race-group"
      >
        <template #label>
          <label for="applicants_race" class="mb-space-xs mb-lg-space-md">
            <h3 class="h3-small d-flex">
              <span class="my-auto"> {{ compData.race.label }}</span>
              <span
                class="my-auto ml-space-xxs ml-lg-space-sm bg-light-3 text-xs px-space-xxs py-lg-space-xxxs"
              >
                Optional
              </span>
            </h3>
          </label>
          <p class="mb-space-md pb-space-xxxs">
            {{ compData.race.text }}
          </p>
        </template>
        <base-select
          id="applicants_race"
          :isMultiSelect="true"
          :options="raceOptions"
          v-model="ethnicOrRacialBackground.race"
          :placeholderText="compData.race.placeholder"
          class="col-12 col-lg-5 px-0 pr-lg-gutter"
          @change="updatePrimaryRaceOptions"
        ></base-select>
      </b-form-group>
      <!-- Origin select based on race values -->
      <template v-for="race in ethnicOrRacialBackground.race">
        <div v-if="race.isOriginAvailable" :key="`origin-${race.value}`">
          <b-form-group
            :id="`group_${race.text}_origin`"
            :aria-label="`Select ${race.text} origin`"
            label-class="pb-0"
            class="mt-space-sm mt-lg-space-md mb-0 position-relative"
            label-for="select_origin"
            :data-cy="getOriginUniqueDataCyId(race.text)"
          >
            <template #label>
              <label :for="`${race.text}_origin`" class="mb-space-xs">
                <h3 class="h3-small">
                  {{ `Select ${race.text} origin` }}
                </h3>
              </label>
            </template>

            <base-select
              :id="`${race.text}_origin`"
              :options="getOriginOptions(race.ethnicCategoryCode)"
              v-model="race.origin"
              placeholderText="Select origin"
              class="col-12 col-lg-5 px-0 pr-lg-gutter"
              @change="handleOriginSelect($event, race.ethnicCategoryCode)"
            ></base-select>
          </b-form-group>
        </div>
      </template>
      <!-- Primary ethnicities / races if applicants race is >=2 -->
      <template v-if="primaryRaceOptions.length >= 2">
        <b-form-group
          :id="`group_primary_race`"
          :aria-label="compData.primaryRaceLabel"
          label-class="pb-0"
          label-for="select_primary_race"
          class="mt-space-sm mt-lg-space-md mb-0 position-relative"
          data-cy="my-info-ethic-racial-background-primary-race-group"
        >
          <template #label>
            <label for="primary_race_select" class="mb-space-xs">
              <h3 class="h3-small">
                {{ compData.primaryRaceLabel }}
              </h3>
            </label>
          </template>
          <base-select
            id="primary_race_select"
            :options="primaryRaceOptions"
            v-model="ethnicOrRacialBackground.primaryRace"
            placeholderText="Select primary race"
            class="col-12 col-lg-5 px-0 pr-lg-gutter"
            @change="handlePrimaryRaceSelect"
          ></base-select>
        </b-form-group>
      </template>
    </div>
  </div>
</template>

<script>
import { MyInfoConstants } from "@/content/enum-ug-application.js";
import { BFormGroup, VBTooltip } from "bootstrap-vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import BaseRadioGroup from "@/components/base-components/BaseRadioGroup.vue";

import { mapActions, mapState } from "pinia";
import { useConfigStore } from "@/stores/config-store.js";
export default {
  name: "SectionEthnicOrRacialBackground",
  directives: {
    "b-tooltip": VBTooltip,
  },
  components: {
    "base-select": BaseSelect,
    "base-radio-group": BaseRadioGroup,
    "b-form-group": BFormGroup,
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
  },
  data() {
    return {
      raceOptions: [],
      primaryRaceOptions: [],
      ethnicOrRacialBackground: {
        hispanicOrLatino: {
          isHispanicOrLatino: null,
          origin: null,
        },
        race: [],
        primaryRace: null,
      },
    };
  },
  watch: {
    ethnicOrRacialBackground: {
      handler() {
        this.updatePrimaryRaceOptions();
        this.$emit("input", this.ethnicOrRacialBackground);
      },
      deep: true,
    },
    "ethnicOrRacialBackground.race"(newValue, oldValue) {
      // new race selected
      if (newValue.length > oldValue.length) {
        const addedRace = newValue.filter(
          (newEle) =>
            !oldValue.some(
              (oldEle) =>
                newEle.ethnicCategoryCode === oldEle.ethnicCategoryCode
            )
        );

        if (addedRace.length > 0) {
          this.configSelectEthnicity(addedRace[0].ethnicCategoryCode);
          // selecting the default ethnic group
          this.configSelectEthnicityGroup(
            addedRace[0].ethnicCategoryCode,
            addedRace[0].ethnicCategoryCode
          );
        }
      } else if (newValue.length < oldValue.length) {
        const removedRace = oldValue.filter(
          (oldEle) =>
            !newValue.some(
              (newEle) =>
                oldEle.ethnicCategoryCode === newEle.ethnicCategoryCode
            )
        );
        if (removedRace.length > 0) {
          this.configDeselectEthnicity(removedRace[0].ethnicCategoryCode);
          this.configDeselectEthnicityGroup(removedRace[0].ethnicCategoryCode);
        }
        // race unselected
      }
    },
    primaryRaceOptions: {
      handler(newValue) {
        if (
          this.ethnicOrRacialBackground.primaryRace &&
          !newValue.some(
            (item) =>
              item.value === this.ethnicOrRacialBackground.primaryRace.value &&
              item.text === this.ethnicOrRacialBackground.primaryRace.text
          )
        ) {
          this.configDeselectPrimaryRace();
          this.ethnicOrRacialBackground.primaryRace = null;
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(useConfigStore, {
      configEthnicities: "ethnicities",
    }),
    isHispanicOrLatinoOriginRequired() {
      return (
        this.ethnicOrRacialBackground.hispanicOrLatino.isHispanicOrLatino
          ?.value === MyInfoConstants.isHispanicLatinoValue
      );
    },
    getHispanicLatinoOriginOptions() {
      const hispanicLatinoData = this.configEthnicities.filter(
        (option) =>
          option.ethnicCategoryDescription ===
          MyInfoConstants.hispanicLatinoText
      );
      const options = [];
      hispanicLatinoData[0].ethnicGroups.forEach((option) => {
        if (
          hispanicLatinoData[0].ethnicCategoryCode !== option.ethnicGroupCode
        ) {
          options.push({
            ...option,
            text: option.ethnicGroupDescription,
            value: option.ethnicGroupCode,
          });
        }
      });
      return options;
    },
  },
  methods: {
    ...mapActions(useConfigStore, {
      configSelectEthnicity: "selectEthnicity",
      configDeselectEthnicity: "deselectEthnicity",
      configSelectEthnicityGroup: "selectEthnicityGroup",
      configDeselectEthnicityGroup: "deselectEthnicityGroup",
      configSelectPrimaryRace: "selectPrimaryRace",
      configDeselectPrimaryRace: "deselectPrimaryRace",
    }),
    updatePrimaryRaceOptions() {
      let options = [];
      this.ethnicOrRacialBackground.race.forEach((race) => {
        options.push({
          ethnicCategoryCode: race.ethnicCategoryCode,
          ethnicCategoryDescription: race.ethnicCategoryDescription,
          text: race.origin ? race.origin.text : race.ethnicCategoryDescription,
          value: race.ethnicCategoryCode,
        });
      });
      // Adding hispanic latino to the primary race option if selected
      if (
        this.ethnicOrRacialBackground.hispanicOrLatino.isHispanicOrLatino
          ?.value === MyInfoConstants.isHispanicLatinoValue
      ) {
        const hispanicLatinoData = this.configEthnicities.filter(
          (option) =>
            option.ethnicCategoryDescription ===
            MyInfoConstants.hispanicLatinoText
        );
        if (hispanicLatinoData.length > 0) {
          options.push({
            ethnicCategoryCode: hispanicLatinoData[0].ethnicCategoryCode,
            ethnicCategoryDescription:
              hispanicLatinoData[0].ethnicCategoryDescription,
            text: this.ethnicOrRacialBackground.hispanicOrLatino.origin
              ? this.ethnicOrRacialBackground.hispanicOrLatino.origin.text
              : hispanicLatinoData[0].ethnicCategoryDescription,
            value: hispanicLatinoData[0].ethnicCategoryCode,
          });
        }
      }
      this.primaryRaceOptions = options;
    },
    getOriginOptions(ethnicCategoryCode) {
      const originOptions = [];
      const option = this.configEthnicities.filter(
        (item) => item.ethnicCategoryCode === ethnicCategoryCode
      );
      if (option.length >= 1) {
        option[0].ethnicGroups.forEach((item) => {
          if (item.ethnicGroupCode !== ethnicCategoryCode) {
            originOptions.push({
              ...item,
              text: item.ethnicGroupDescription,
              value: item.ethnicGroupCode,
              selected: item.selected,
            });
          }
        });
      }
      return originOptions.sort((a, b) => a.text.localeCompare(b.text));
    },
    selectErrorMsg(error) {
      const errMsg = [];
      if (error.$dirty && !error.required) {
        errMsg.push("This is a required field.");
      }
      return errMsg;
    },
    handleOriginSelect(event, ethnicCategoryCode) {
      this.configDeselectEthnicityGroup(ethnicCategoryCode);
      this.configSelectEthnicityGroup(
        ethnicCategoryCode,
        event ? event.ethnicGroupCode : ethnicCategoryCode
      );
    },
    handleHispanicLatinoOriginSelect(event) {
      const hispanicLatinoData = this.configEthnicities.filter(
        (option) =>
          option.ethnicCategoryDescription ===
          MyInfoConstants.hispanicLatinoText
      );
      this.configDeselectEthnicityGroup(
        hispanicLatinoData[0].ethnicCategoryCode
      );
      this.configSelectEthnicityGroup(
        hispanicLatinoData[0].ethnicCategoryCode,
        event ? event.ethnicGroupCode : hispanicLatinoData[0].ethnicCategoryCode
      );
    },
    handleHispanicLatinoRadioChange(event) {
      const hispanicLatinoData = this.configEthnicities.filter(
        (option) =>
          option.ethnicCategoryDescription ===
          MyInfoConstants.hispanicLatinoText
      );
      if (hispanicLatinoData.length > 0) {
        if (event.value === MyInfoConstants.isHispanicLatinoValue) {
          this.configSelectEthnicity(hispanicLatinoData[0].ethnicCategoryCode);
          // selecting the default ethnic group
          this.configSelectEthnicityGroup(
            hispanicLatinoData[0].ethnicCategoryCode,
            hispanicLatinoData[0].ethnicCategoryCode
          );
        } else {
          this.configDeselectEthnicity(
            hispanicLatinoData[0].ethnicCategoryCode
          );
          if (this.ethnicOrRacialBackground.hispanicOrLatino.origin) {
            this.ethnicOrRacialBackground.hispanicOrLatino.origin = null;
            this.configDeselectEthnicityGroup(
              hispanicLatinoData[0].ethnicCategoryCode
            );
          }
        }
      }
    },
    handlePrimaryRaceSelect(event) {
      this.configDeselectPrimaryRace();
      this.configSelectPrimaryRace(event.ethnicCategoryCode);
    },
    populateRaceOptions() {
      let options = this.configEthnicities
        .slice()
        .filter(
          (option) =>
            option.ethnicCategoryDescription !==
              MyInfoConstants.hispanicLatinoText &&
            option.ethnicCategoryDescription !==
              MyInfoConstants.notResportedEthnicity
        );
      options.forEach((option) => {
        let item = {
          ethnicCategoryCode: option.ethnicCategoryCode,
          ethnicCategoryDescription: option.ethnicCategoryDescription,
          text: option.ethnicCategoryDescription,
          value: option.ethnicCategoryCode,
          origin: null,
          isOriginAvailable: option.ethnicGroups.length > 1,
          selected: option.selected,
          preferredReference: option.preferredReference,
        };
        this.raceOptions.push(item);
      });
    },
    getOriginUniqueDataCyId(race) {
      return `my-info-ethic-racial-background-${race
        .toLowerCase()
        .replace(" ", "-")}-race-origin-group`;
    },
  },
  created() {
    if (this.value && Object.keys(this.value).length > 0) {
      Object.assign(this.ethnicOrRacialBackground, this.value);
    }
    // populateing the race options
    this.populateRaceOptions();
    // 2way binding data
    // checking if Hispanic/Latino is selected
    const hispanicLatinoData = this.configEthnicities.filter(
      (option) =>
        option.ethnicCategoryDescription === MyInfoConstants.hispanicLatinoText
    );
    if (hispanicLatinoData.length > 0 && hispanicLatinoData[0].selected) {
      this.ethnicOrRacialBackground.hispanicOrLatino.isHispanicOrLatino =
        this.compData.isHispanicOrLatino.options.filter(
          (option) => option.value === MyInfoConstants.isHispanicLatinoValue
        )[0];
      this.ethnicOrRacialBackground.hispanicOrLatino.origin =
        this.getHispanicLatinoOriginOptions.filter(
          (option) => option.selected
        )[0];
    }
    // Other races

    this.raceOptions.forEach((option) => {
      if (option.selected) {
        const selectedRace = option;
        if (selectedRace.isOriginAvailable) {
          const originOptions = this.getOriginOptions(
            selectedRace.ethnicCategoryCode
          );
          selectedRace.origin = originOptions.filter(
            (group) => group.selected
          )[0];
        }
        this.ethnicOrRacialBackground.race.push(selectedRace);
      }
    });
    // primary race
    this.updatePrimaryRaceOptions();
    const primaryRace = this.primaryRaceOptions.filter((item) =>
      this.configEthnicities.some(
        (ele) =>
          ele.ethnicCategoryCode === item.ethnicCategoryCode &&
          ele.preferredReference
      )
    );
    this.ethnicOrRacialBackground.primaryRace =
      primaryRace.length > 0 ? primaryRace[0] : null;
  },
};
</script>
<style lang="scss" scoped></style>

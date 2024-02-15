import asuDplApi from "@/api/asu-dpl-api.js";
import ugAztribesApi from "@/api/ug-aztribes-api.js";
import ugDeadlinesApi from "@/api/ug-deadlines-api";
import ugFeesApi from "@/api/ug-fees-api";
import ugFinancialcircumstanceApi from "@/api/ug-financialcircumstance-api";
import ugResidencyApi from "@/api/ug-residency-api.js";
import ugGenderApi from "@/api/ug-gender-api.js";
import ugHighschoolApi from "@/api/ug-highschool-api.js";
import ugLanguageApi from "@/api/ug-language-api.js";
import ugPronounApi from "@/api/ug-pronoun-api.js";
import ugSarApi from "@/api/ug-sar-api.js";
import ugUsertypeApi from "@/api/ug-usertype-api.js";
import { MyInfoConstants } from "@/content/enum-ug-application.js";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import { useUserStore } from "@/stores/user-store";
import { defineStore } from "pinia";
import onlineCampusAcceptedSubplans from "@/content/online-campus-accepted-subplans.json";
import { capitalize } from "radash";

export const useConfigStore = defineStore({
  id: "config",
  persist: true,
  state: () => ({
    // asu-data-potluck-api
    birthCountries: [],
    birthStates: [],
    citizenCountries: [],
    citizenStates: [],
    homeAddressCountries: [],
    homeAddressStates: [],
    internationalAddressCountries: [],
    internationalAddressStates: [],
    shippingAddressCountries: [],
    shippingAddressStates: [],
    highSchoolCountries: [],
    highSchoolStates: [],
    institutionCountries: [],
    institutionStates: [],
    corporatePartners: [],
    ethnicities: [],
    primaryLanguagesAtHome: [],
    primaryLanguagesAtHomeOther: [],
    visaPermitTypes: [],
    usStateCities: [],
    usaHighSchools: [],
    institutions: [],
    statesLicensedtoPracticeRN: [],
    campuses: [],
    // ug-app-api
    azResidency: [],
    deadlines: [],
    fees: [],
    financialCircumstances: [],
    genders: [],
    highSchoolAcademicYears: [],
    highSchoolCourses: [],
    highSchoolCourseLevels: [],
    highSchoolCourseSubjects: [],
    highSchoolGpaScales: [],
    highSchoolGradeScaleTypes: [],
    highSchoolGrades: [],
    highSchoolTermTypes: [],
    pronouns: [],
    sarQuestions: [],
    tribes: [],
    userTypeLocations: [],
    allUsStates: [],
    programs: [],
    terms: [],
    countries: [],
  }),
  getters: {
    selectedBirthCountry(state) {
      const result =
        state.birthCountries.length > 0
          ? state.birthCountries.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedBirthCountryCode() {
      return this.selectedBirthCountry
        ? this.selectedBirthCountry.countryCode
        : null;
    },
    selectedBirthState(state) {
      const result =
        state.birthStates.length > 0
          ? state.birthStates.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedCitizenCountry(state) {
      const result =
        state.citizenCountries.length > 0
          ? state.citizenCountries.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedCitizenState(state) {
      const result =
        state.citizenStates.length > 0
          ? state.citizenStates.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedHomeAddressCountry(state) {
      const result =
        state.homeAddressCountries.length > 0
          ? state.homeAddressCountries.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedHomeAddressState(state) {
      const result =
        state.homeAddressStates.length > 0
          ? state.homeAddressStates.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedInternationalAddressCountry(state) {
      const result =
        state.internationalAddressCountries.length > 0
          ? state.internationalAddressCountries.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedInternationalAddressState(state) {
      const result =
        state.internationalAddressStates.length > 0
          ? state.internationalAddressStates.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedShippingAddressCountry(state) {
      const result =
        state.shippingAddressCountries.length > 0
          ? state.shippingAddressCountries.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedShippingAddressState(state) {
      const result =
        state.shippingAddressStates.length > 0
          ? state.shippingAddressStates.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedCorporatePartner(state) {
      const result =
        state.corporatePartners.length > 0
          ? state.corporatePartners.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedPrimaryLanguageAtHome(state) {
      const result =
        state.primaryLanguagesAtHome.length > 0
          ? state.primaryLanguagesAtHome.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedPrimaryLanguageAtHomeOther(state) {
      const result =
        state.primaryLanguagesAtHomeOther.length > 0
          ? state.primaryLanguagesAtHomeOther.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedVisaPermitType(state) {
      const result =
        state.visaPermitTypes.length > 0
          ? state.visaPermitTypes.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedDeadline(state) {
      const result =
        state.deadlines.length > 0
          ? state.deadlines.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedFee(state) {
      const result =
        state.fees.length > 0 ? state.fees.filter((item) => item.selected) : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedFinancialCircumstance(state) {
      const result =
        state.financialCircumstances.length > 0
          ? state.financialCircumstances.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedGender(state) {
      const result =
        state.genders.length > 0
          ? state.genders.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedHighSchoolAcademicYear(state) {
      const result =
        state.highSchoolAcademicYears.length > 0
          ? state.highSchoolAcademicYears.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedHighSchoolCourse(state) {
      const result =
        state.highSchoolCourses.length > 0
          ? state.highSchoolCourses.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedHighSchoolCourseLevel(state) {
      const result =
        state.highSchoolCourseLevels.length > 0
          ? state.highSchoolCourseLevels.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedHighSchoolGpaScale(state) {
      const result =
        state.highSchoolGpaScales.length > 0
          ? state.highSchoolGpaScales.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedHighSchoolGradeScaleType(state) {
      const result =
        state.highSchoolGradeScaleTypes.length > 0
          ? state.highSchoolGradeScaleTypes.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedHighSchoolGrade(state) {
      const result =
        state.highSchoolGrades.length > 0
          ? state.highSchoolGrades.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedHighSchoolTermType(state) {
      const result =
        state.highSchoolTermTypes.length > 0
          ? state.highSchoolTermTypes.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedPronoun(state) {
      const result =
        state.pronouns.length > 0
          ? state.pronouns.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedTribe(state) {
      const result =
        state.tribes.length > 0
          ? state.tribes.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedUserTypeLocation(state) {
      const result =
        state.userTypeLocations.length > 0
          ? state.userTypeLocations.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
    selectedEthnicity(state) {
      const selectedEthnicities = [];
      state.ethnicities.forEach((element) => {
        if (element.selected) {
          const selectedOrigin = element.ethnicGroups.filter(
            (group) => group.selected
          );
          selectedEthnicities.push({
            ethnicGroupCode: element.ethnicCategoryCode,
            culturalOriginCode: selectedOrigin[0].ethnicGroupCode,
            reportingPreference: element.preferredReference,
          });
        }
      });
      return selectedEthnicities;
    },
    selectedEthnicitiesWithDetails(state) {
      const selectedEthnicities = [];
      state.ethnicities.forEach((element) => {
        if (element.selected) {
          const selectedOrigin = element.ethnicGroups.filter(
            (group) => group.selected
          );
          selectedEthnicities.push({
            ethnicGroupCode: element.ethnicCategoryCode,
            culturalOriginCode: selectedOrigin[0].ethnicGroupCode,
            reportingPreference: element.preferredReference,
            originText: selectedOrigin[0].ethnicGroupDescription,
          });
        }
      });
      return selectedEthnicities.sort(
        (a, b) => Number(b.reportingPreference) - Number(a.reportingPreference)
      );
    },
    degreePrograms(state) {
      const programs = [];
      state.programs.forEach((program) => {
        if (
          program.campusesOffered.some((item) => item.campusCode === "ONLNE")
        ) {
          const programDetail = {
            acadPlanCode: program.acadPlanCode,
            title: program.acadPlanDescription,
            shortTitle: program.degreeDescriptionShort,
            subPlanCode: null,
            applicationDeadlines: program.applicationDeadlines,
            applicantsMustChooseSecondMajor:
              program.applicantsMustChooseSecondMajor,
          };
          programDetail.college =
            program.owners?.length > 0
              ? program.owners[0].collegeAlphaSortDescription
              : null;
          if (program.planCategories) {
            programDetail.interestAreas = program.planCategories.map(
              (categories) => {
                return categories.categoryDescription;
              }
            );
          } else {
            programDetail.interestAreas = [];
          }
          // checking if the proram has subplan and if they are accepted for ONLINE
          if (
            program.subplans?.length > 0 &&
            onlineCampusAcceptedSubplans.some(
              (item) => item.acadPlanCode === program.acadPlanCode
            )
          ) {
            const acceptedSubplans = onlineCampusAcceptedSubplans.filter(
              (item) => item.acadPlanCode === program.acadPlanCode
            );
            if (
              acceptedSubplans.length > 0 &&
              acceptedSubplans[0].subPlans.length > 0
            ) {
              program.subplans.forEach((item) => {
                if (
                  acceptedSubplans[0].subPlans.includes(item.acadSubPlanCode)
                ) {
                  const data = { ...programDetail };
                  data.title = `${data.title} - ${item.description}, ${programDetail.shortTitle}`;
                  data.subPlanCode = item.acadSubPlanCode;
                  programs.push(data);
                }
              });
            }
          }
          programDetail.title = `${programDetail.title}, ${programDetail.shortTitle}`;
          programs.push(programDetail);
        }
      });
      return programs;
    },
    selectedStatesLicensedtoPracticeRN(state) {
      const result =
        state.statesLicensedtoPracticeRN.length > 0
          ? state.statesLicensedtoPracticeRN.filter((item) => item.selected)
          : [];

      return result.length > 0 ? result[0] : null;
    },
  },
  actions: {
    async populateUsStateCities() {
      try {
        const { status, data } =
          await asuDplApi.fetchExternalOrganizationsUsaStatesCities();
        this.usStateCities = data;

        return { code: status, data: this.usStateCities };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async populatePrograms() {
      try {
        const { status, data } = await asuDplApi.fetchAcademicPlans();
        this.programs = data;
        return { code: status, data: this.programs };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async populateTerms() {
      try {
        const { status, data } = await asuDplApi.fetchTerms();
        this.terms = data;
        return { code: status, data: this.terms };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async populateUsaHighSchools(params) {
      try {
        const { status, data } = await asuDplApi.fetchExternalOrganizations(
          params
        );
        this.usaHighSchools = data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.externalOrgId,
          };
        });

        return { code: status, data: this.usaHighSchools };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async populateInstitutions(params) {
      try {
        const { status, data } = await asuDplApi.fetchExternalOrganizations(
          params
        );
        this.institutions = data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.externalOrgId,
          };
        });

        return { code: status, data: this.institutions };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async populateProgramDetail(programId) {
      try {
        const { status, data } = await asuDplApi.fetchAcademicPlanDetail(
          programId
        );

        return { code: status, data: data };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    // NOTE: populateCampuses is  not used anywhere as currently we have only "online" courses
    async populateCampuses() {
      try {
        const { status, data } = await asuDplApi.fetchCampuses();
        this.campuses = data.map((item) => {
          return { ...item, text: item.description, value: item.campusCode };
        });

        return { code: status, data: this.campuses };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    // birthCountries
    async populateBirthCountries() {
      try {
        const { status, data } = await asuDplApi.fetchCountries();
        this.birthCountries = data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.countryCode,
          };
        });

        return { code: status, data: this.birthCountries };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectBirthCountry(instance) {
      const index = this.birthCountries.findIndex(
        (item) => item.countryCode === instance.countryCode
      );

      if (index !== -1) {
        this.birthCountries[index]["selected"] = true;
      }
    },
    deselectBirthCountry() {
      const index = this.birthCountries.findIndex((item) => item.selected);

      if (index !== -1) {
        this.birthCountries[index]["selected"] = false;
      }
    },
    // birthStates
    async populateBirthStates() {
      // TODO:
    },
    selectBirthState(instance) {
      const index = this.birthStates.findIndex(
        (item) => item.stateCode === instance.stateCode
      );

      if (index !== -1) {
        this.birthStates[index]["selected"] = true;
      }
    },
    deselectBirthState(instance) {
      const index = this.birthStates.findIndex(
        (item) => item.stateCode === instance.stateCode
      );

      if (index !== -1) {
        this.birthStates[index]["selected"] = false;
      }
    },
    // citizenCountries
    async populateCitizenCountries() {
      try {
        const { status, data } = await asuDplApi.fetchCountries();
        this.citizenCountries = data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.countryCode,
          };
        });

        return { code: status, data: this.citizenCountries };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectCitizenCountry(instance) {
      const index = this.citizenCountries.findIndex(
        (item) => item.countryCode === instance.countryCode
      );

      if (index !== -1) {
        this.citizenCountries[index]["selected"] = true;
      }
    },
    deselectCitizenCountry() {
      const index = this.citizenCountries.findIndex((item) => item.selected);

      if (index !== -1) {
        this.citizenCountries[index]["selected"] = false;
      }
    },
    // citizenStates
    async populateCitizenStates() {
      // TODO:
    },
    selectCitizenState(instance) {
      const index = this.citizenStates.findIndex(
        (item) => item.stateCode === instance.stateCode
      );

      if (index !== -1) {
        this.citizenStates[index]["selected"] = true;
      }
    },
    deselectCitizenState(instance) {
      const index = this.citizenStates.findIndex(
        (item) => item.stateCode === instance.stateCode
      );

      if (index !== -1) {
        this.citizenStates[index]["selected"] = false;
      }
    },

    // HomeAddressCountries
    async populateHomeAddressCountries() {
      try {
        const { status, data } = await asuDplApi.fetchCountries();
        this.homeAddressCountries = data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.countryCode,
          };
        });
        return { code: status, data: this.homeAddressCountries };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async selectHomeAddressCountry(instance) {
      const index = this.homeAddressCountries.findIndex(
        (item) => item.countryCode === instance.countryCode
      );
      if (index !== -1) {
        this.homeAddressCountries[index]["selected"] = true;
      }
    },
    async deselectHomeAddressCountry() {
      const index = this.homeAddressCountries.findIndex(
        (item) => item.selected
      );

      if (index !== -1) {
        this.homeAddressCountries[index]["selected"] = false;
      }
    },
    // homeAddressStates
    async populateHomeAddressStates() {
      try {
        const selectedCountryCode = this.homeAddressCountries.filter(
          (item) => item.selected
        );
        if (selectedCountryCode.length > 0) {
          const response = await asuDplApi.fetchCountryDetail(
            selectedCountryCode[0].countryCode
          );

          this.homeAddressStates = response.data.states.map((item) => {
            return {
              ...item,
              selected: false,
              text: item.description,
              value: item.stateCode,
            };
          });

          return { code: response.status, data: this.homeAddressStates };
        } else {
          return { code: 400, errors: ["No country found"] };
        }
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async selectHomeAddressState(instance) {
      const index = this.homeAddressStates.findIndex(
        (item) => item.stateCode === instance.stateCode
      );

      if (index !== -1) {
        this.homeAddressStates[index]["selected"] = true;
      }
    },
    async deselectHomeAddressState() {
      const index = this.homeAddressStates.findIndex((item) => item.selected);

      if (index !== -1) {
        this.homeAddressStates[index]["selected"] = false;
      }
    },
    // internationalAddressCountries
    async populateInternationalAddressCountries() {
      try {
        const { status, data } = await asuDplApi.fetchCountries();
        this.internationalAddressCountries = data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.countryCode,
          };
        });
        return { code: status, data: this.internationalAddressCountries };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async selectIntAddressCountry(instance) {
      const index = this.internationalAddressCountries.findIndex(
        (item) => item.countryCode === instance.countryCode
      );

      if (index !== -1) {
        this.internationalAddressCountries[index]["selected"] = true;
      }
    },
    async deselectIntAddressCountry() {
      const index = this.internationalAddressCountries.findIndex(
        (item) => item.selected
      );

      if (index !== -1) {
        this.internationalAddressCountries[index]["selected"] = false;
      }
    },
    // internationalAddressStates
    async populateInternationalAddressStates() {
      try {
        const selectedCountryCode = this.internationalAddressCountries.filter(
          (item) => item.selected
        );
        if (selectedCountryCode.length > 0) {
          const { status, data } = await asuDplApi.fetchCountryDetail(
            selectedCountryCode[0].countryCode
          );
          this.internationalAddressStates = data.states.map((item) => {
            return {
              ...item,
              selected: false,
              text: item.description,
              value: item.stateCode,
            };
          });

          return { code: status, data: this.internationalAddressStates };
        } else {
          return { code: 400, errors: ["No country found"] };
        }
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async selectIntAddressState(instance) {
      const index = this.internationalAddressStates.findIndex(
        (item) => item.stateCode === instance.stateCode
      );

      if (index !== -1) {
        this.internationalAddressStates[index]["selected"] = true;
      }
    },
    async deselectIntAddressState() {
      const index = this.internationalAddressStates.findIndex(
        (item) => item.selected
      );

      if (index !== -1) {
        this.internationalAddressStates[index]["selected"] = false;
      }
    },

    // populateShippingAddressCountries
    async populateShippingAddressCountries() {
      try {
        const { status, data } = await asuDplApi.fetchCountries();
        this.shippingAddressCountries = data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.countryCode,
          };
        });
        return { code: status, data: this.shippingAddressCountries };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async selectShippingAddressCountry(instance) {
      const index = this.shippingAddressCountries.findIndex(
        (item) => item.countryCode === instance.countryCode
      );

      if (index !== -1) {
        this.shippingAddressCountries[index]["selected"] = true;
      }
    },
    async deselectShippingAddressCountry() {
      const index = this.shippingAddressCountries.findIndex(
        (item) => item.selected
      );

      if (index !== -1) {
        this.shippingAddressCountries[index]["selected"] = false;
      }
    },
    // ShippingAddressStates
    async populateShippingAddressStates() {
      try {
        const selectedCountryCode = this.shippingAddressCountries.filter(
          (item) => item.selected
        );
        if (selectedCountryCode.length > 0) {
          const { status, data } = await asuDplApi.fetchCountryDetail(
            selectedCountryCode[0].countryCode
          );

          this.shippingAddressStates = data.states.map((item) => {
            return {
              ...item,
              selected: false,
              text: item.description,
              value: item.stateCode,
            };
          });

          return { code: status, data: this.shippingAddressStates };
        } else {
          return { code: 400, errors: ["No country found"] };
        }
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async selectShippingAddressState(instance) {
      const index = this.shippingAddressStates.findIndex(
        (item) => item.stateCode === instance.stateCode
      );

      if (index !== -1) {
        this.shippingAddressStates[index]["selected"] = true;
      }
    },
    async deselectShippingAddressState() {
      const index = this.shippingAddressStates.findIndex(
        (item) => item.selected
      );

      if (index !== -1) {
        this.shippingAddressStates[index]["selected"] = false;
      }
    },
    // highSchool
    async populateHighSchoolCountries() {
      try {
        const { status, data } = await asuDplApi.fetchCountries();
        this.highSchoolCountries = data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.countryCode,
          };
        });
        return { code: status, data: this.highSchoolCountries };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async selectHighSchoolCountry(instance) {
      const index = this.highSchoolCountries.findIndex(
        (item) => item.countryCode === instance.countryCode
      );

      if (index !== -1) {
        this.highSchoolCountries[index]["selected"] = true;
      }
    },
    async deselectHighSchoolCountry() {
      const index = this.highSchoolCountries.findIndex((item) => item.selected);

      if (index !== -1) {
        this.highSchoolCountries[index]["selected"] = false;
      }
    },
    // Highschool states
    async populateHighSchoolStates() {
      try {
        const selectedCountryCode = this.highSchoolCountries.filter(
          (item) => item.selected
        );
        const { status, data } = await asuDplApi.fetchCountryDetail(
          selectedCountryCode[0].countryCode
        );
        this.highSchoolStates = await data.states.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.stateCode,
          };
        });

        return { code: status, data: this.highSchoolStates };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async selectHighSchoolState(instance) {
      const index = this.highSchoolStates.findIndex(
        (item) => item.stateCode === instance.stateCode
      );

      if (index !== -1) {
        this.highSchoolStates[index]["selected"] = true;
      }
    },
    async deselectHighSchoolState() {
      const index = this.highSchoolStates.findIndex((item) => item.selected);

      if (index !== -1) {
        this.highSchoolStates[index]["selected"] = false;
      }
    },

    // Institution
    async populateInstitutionCountries() {
      try {
        const { status, data } = await asuDplApi.fetchCountries();
        this.institutionCountries = data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.countryCode,
          };
        });
        return { code: status, data: this.institutionCountries };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async selectInstitutionCountry(instance) {
      const index = this.institutionCountries.findIndex(
        (item) => item.countryCode === instance.countryCode
      );

      if (index !== -1) {
        this.institutionCountries[index]["selected"] = true;
      }
    },
    async deselectInstitutionCountry() {
      const index = this.institutionCountries.findIndex(
        (item) => item.selected
      );

      if (index !== -1) {
        this.institutionCountries[index]["selected"] = false;
      }
    },
    // Institution states
    async populateInstitutionStates() {
      try {
        const selectedCountryCode = this.institutionCountries.filter(
          (item) => item.selected
        );
        const { status, data } = await asuDplApi.fetchCountryDetail(
          selectedCountryCode[0].countryCode
        );
        this.institutionStates = data.states.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.stateCode,
          };
        });

        return { code: status, data: this.institutionStates };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async selectInstitutionStates(instance) {
      const index = this.institutionStates.findIndex(
        (item) => item.stateCode === instance.stateCode
      );

      if (index !== -1) {
        this.institutionStates[index]["selected"] = true;
      }
    },
    async deselectInstitutionStates() {
      const index = this.institutionStates.findIndex((item) => item.selected);

      if (index !== -1) {
        this.institutionStates[index]["selected"] = false;
      }
    },

    // corporatePartners
    async populateCorporatePartners() {
      try {
        const { status, data } =
          await asuDplApi.fetchUndegraduateAdmissionsCorporatePartners();
        this.corporatePartners = data.map((item) => {
          return {
            ...item,
            selected: false,
            text: capitalize(item.corporatePartnerDescription),
            value: item.corporatePartnerDescription,
          };
        });
        return { code: status, data: this.corporatePartners };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectCorporatePartner(instance) {
      const index = this.corporatePartners.findIndex(
        (item) =>
          item.corporatePartnerDescription ===
          instance.corporatePartnerDescription
      );

      if (index !== -1) {
        this.corporatePartners[index]["selected"] = true;
      }
    },
    deselectCorporatePartner() {
      const index = this.corporatePartners.findIndex((item) => item.selected);

      if (index !== -1) {
        this.corporatePartners[index]["selected"] = false;
      }
    },
    // ethnicities
    async populateEthnicities() {
      try {
        const response = await asuDplApi.fetchEthnicities();

        if (response.status === 200) {
          // add selected:false to ethnicGroups of each ethnicCategory
          const ethnicity = [];

          response.data.forEach((element) => {
            const groupIndex = element.ethnicGroups.filter(
              (group) =>
                group.ethnicGroupDescription ===
                element.ethnicCategoryDescription
            );

            const data = {
              ...element,
              ethnicCategoryCode:
                groupIndex.length > 0
                  ? groupIndex[0].ethnicGroupCode
                  : element.ethnicGroups[0].ethnicGroupCode,
              selected: false,
              preferredReference: false,
            };

            data.ethnicGroups = data.ethnicGroups.map((group) => {
              return { ...group, selected: false };
            });

            ethnicity.push(data);
          });

          // update state
          this.ethnicities = ethnicity;

          return { code: response.status, data: ethnicity };
        }
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectEthnicity(ethnicCategoryCode) {
      this.ethnicities.forEach((ethnicCategory, index) => {
        if (ethnicCategory.ethnicCategoryCode === ethnicCategoryCode) {
          this.ethnicities[index].selected = true;
          // Selecting the ethnic group if it contains only one
          if (this.ethnicities[index].ethnicGroups.length === 1) {
            this.ethnicities[index].ethnicGroups[0].selected = true;
          }
        }
      });
    },
    deselectEthnicity(ethnicCategoryCode) {
      this.ethnicities.forEach((ethnicCategory, index) => {
        if (ethnicCategory.ethnicCategoryCode === ethnicCategoryCode) {
          this.ethnicities[index].selected = false;
          // deselecting the ethnic group if it contains only one
          if (this.ethnicities[index].ethnicGroups.length === 1) {
            this.ethnicities[index].ethnicGroups[0].selected = false;
          }
        }
      });
    },
    selectEthnicityGroup(ethnicCategoryCode, ethnicGroupCode) {
      this.ethnicities.forEach((ethnicCategory, ctgIndex) => {
        if (ethnicCategory.ethnicCategoryCode === ethnicCategoryCode) {
          ethnicCategory.ethnicGroups.forEach((ethnicGroup, grpIndex) => {
            if (ethnicGroup.ethnicGroupCode === ethnicGroupCode) {
              this.ethnicities[ctgIndex].ethnicGroups[grpIndex].selected = true;
            }
          });
        }
      });
    },
    deselectEthnicityGroup(ethnicCategoryCode) {
      this.ethnicities.forEach((ethnicCategory, ctgIndex) => {
        if (ethnicCategory.ethnicCategoryCode === ethnicCategoryCode) {
          const groupIndex = ethnicCategory.ethnicGroups.findIndex(
            (item) => item.selected
          );
          if (groupIndex >= 0) {
            this.ethnicities[ctgIndex].ethnicGroups[
              groupIndex
            ].selected = false;
          }
        }
      });
    },
    selectPrimaryRace(ethnicCategoryCode) {
      const index = this.ethnicities.findIndex(
        (item) => item.ethnicCategoryCode === ethnicCategoryCode
      );
      if (index >= 0) {
        this.ethnicities[index].preferredReference = true;
      }
    },
    deselectPrimaryRace() {
      const index = this.ethnicities.findIndex(
        (item) => item.preferredReference
      );
      if (index >= 0) {
        this.ethnicities[index].preferredReference = false;
      }
    },
    // primaryLanguagesAtHome
    async populatePrimaryLanguagesAtHome() {
      try {
        const { data } = await ugLanguageApi.fetchAllLanguage();
        this.primaryLanguagesAtHome = data.data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.language,
            value: item.languageCode3,
          };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectPrimaryLanguageAtHome(instance) {
      const index = this.primaryLanguagesAtHome.findIndex(
        (item) => item.languageCode3 === instance.languageCode3
      );

      if (index !== -1) {
        this.primaryLanguagesAtHome[index]["selected"] = true;
      }
    },
    deselectPrimaryLanguageAtHome() {
      const index = this.primaryLanguagesAtHome.findIndex(
        (item) => item.selected
      );

      if (index !== -1) {
        this.primaryLanguagesAtHome[index]["selected"] = false;
      }
    },
    // primaryLanguagesAtHomeOther
    async populatePrimaryLanguagesAtHomeOther() {
      try {
        const { data } = await ugLanguageApi.fetchAllLanguage();
        this.primaryLanguagesAtHomeOther = data.data.map((item) => {
          return { ...item, selected: false };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectPrimaryLanguageAtHomeOther(instance) {
      const index = this.primaryLanguagesAtHomeOther.findIndex(
        (item) => item.languageCode3 === instance.languageCode3
      );

      if (index !== -1) {
        this.primaryLanguagesAtHomeOther[index]["selected"] = true;
      }
    },
    deselectPrimaryLanguageAtHomeOther(instance) {
      const index = this.primaryLanguagesAtHomeOther.findIndex(
        (item) => item.languageCode3 === instance.languageCode3
      );

      if (index !== -1) {
        this.primaryLanguagesAtHomeOther[index]["selected"] = false;
      }
    },
    // visaPermitTypes
    async populateVisaPermitTypes() {
      try {
        const { status, data } = await asuDplApi.fetchVisaPermitTypes();
        this.visaPermitTypes = data.map((item) => {
          return {
            ...item,
            selected: false,
            text: `${item.visaPermitTypeCode} - ${item.description}`,
            value: item.visaPermitTypeCode,
          };
        });

        return { code: status, data: this.visaPermitTypes };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectVisaPermitType(instance) {
      const index = this.visaPermitTypes.findIndex(
        (item) => item.visaPermitTypeCode === instance.visaPermitTypeCode
      );

      if (index !== -1) {
        this.visaPermitTypes[index]["selected"] = true;
      }
    },
    deselectVisaPermitType() {
      const index = this.visaPermitTypes.findIndex((item) => item.selected);

      if (index !== -1) {
        this.visaPermitTypes[index]["selected"] = false;
      }
    },
    // azResidency
    async populateAzResidency() {
      try {
        const { data } =
          await ugResidencyApi.fetchArizonaResidencyConfigurations();
        this.azResidency = data.data;
        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
      // TODO:
    },
    // deadlines
    async populateDeadlines() {
      try {
        const { data } = await ugDeadlinesApi.fetchAllDeadlines();
        this.deadlines = data.data.map((item) => {
          return { ...item, selected: false };
        });

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    selectDeadline(instance) {
      const index = this.deadlines.findIndex((item) => item.id === instance.id);

      if (index !== -1) {
        this.deadlines[index]["selected"] = true;
      }
    },
    deselectDeadline(instance) {
      const index = this.deadlines.findIndex((item) => item.id === instance.id);

      if (index !== -1) {
        this.deadlines[index]["selected"] = false;
      }
    },
    // fees
    async populateFees() {
      try {
        const { data } = await ugFeesApi.fetchAllApplicationFees();
        this.fees = data.data.map((item) => {
          return { ...item, selected: false };
        });

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    selectFees(instance) {
      const index = this.fees.findIndex((item) => item.id === instance.id);

      if (index !== -1) {
        this.fees[index]["selected"] = true;
      }
    },
    deselectFees(instance) {
      const index = this.fees.findIndex((item) => item.id === instance.id);

      if (index !== -1) {
        this.fees[index]["selected"] = false;
      }
    },
    // financialCircumstances
    async populateFinancialCircumstances() {
      try {
        const { data } =
          await ugFinancialcircumstanceApi.fetchAllFinancialCircumstance();
        this.financialCircumstances = data.data.map((item) => {
          return { ...item, selected: false };
        });

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    selectFinancialCircumstance(instance) {
      const index = this.financialCircumstances.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.financialCircumstances[index]["selected"] = true;
      }
    },
    deselectFinancialCircumstance(instance) {
      const index = this.financialCircumstances.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.financialCircumstances[index]["selected"] = false;
      }
    },
    // genders
    async populateGenders() {
      try {
        const { data } = await ugGenderApi.fetchAllGender();
        this.genders = data.data.map((item) => {
          return {
            ...item,
            selected: false,
          };
        });

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    selectGender(instance) {
      const index = this.genders.findIndex(
        (item) => item.text === instance.text
      );

      if (index !== -1) {
        this.genders[index]["selected"] = true;
      }
    },
    deselectGender() {
      const index = this.genders.findIndex((item) => item.selected);

      if (index !== -1) {
        this.genders[index]["selected"] = false;
      }
    },
    // highSchoolAcademicYears
    async populateHighSchoolAcademicYears() {
      try {
        const { data } = await ugHighschoolApi.fetchAllHighSchoolAcademicYear();
        this.highSchoolAcademicYears = data.data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.acadYear,
            value: item.id,
          };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectHighSchoolAcademicYear(instance) {
      const index = this.highSchoolAcademicYears.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolAcademicYears[index]["selected"] = true;
      }
    },
    deselectHighSchoolAcademicYear(instance) {
      const index = this.highSchoolAcademicYears.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolAcademicYears[index]["selected"] = false;
      }
    },
    // highSchoolCourses
    async populateHighSchoolCourses() {
      try {
        const { data } = await ugHighschoolApi.fetchAllHighSchoolCourse();
        this.highSchoolCourses = data.data.map((item) => {
          return { ...item, selected: false, text: item.name, value: item.id };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectHighSchoolCourse(instance) {
      const index = this.highSchoolCourses.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolCourses[index]["selected"] = true;
      }
    },
    deselectHighSchoolCourse(instance) {
      const index = this.highSchoolCourses.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolCourses[index]["selected"] = false;
      }
    },
    // highSchoolCourseLevels
    async populateHighSchoolCourseLevels() {
      try {
        const { data } = await ugHighschoolApi.fetchAllHighSchoolCourseLevel();
        this.highSchoolCourseLevels = data.data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.name,
            value: item.id,
          };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectHighSchoolCourseLevel(instance) {
      const index = this.highSchoolCourseLevels.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolCourseLevels[index]["selected"] = true;
      }
    },
    deselectHighSchoolCourseLevel(instance) {
      const index = this.highSchoolCourseLevels.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolCourseLevels[index]["selected"] = false;
      }
    },

    async populateHighSchoolCourseSubjects() {
      try {
        const { data } =
          await ugHighschoolApi.fetchAllHighSchoolCourseSubject();
        this.highSchoolCourseSubjects = data.data.map((item) => {
          return { ...item, selected: false };
        });

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    selectHighSchoolCourseSubjects(instance) {
      const index = this.highSchoolCourseSubjects.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolCourseLevels[index]["selected"] = true;
      }
    },
    deselectHighSchoolCourseSubjects(instance) {
      const index = this.highSchoolCourseSubjects.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolCourseLevels[index]["selected"] = false;
      }
    },

    // highSchoolGpaScales
    async populateHighSchoolGpaScales() {
      try {
        const { data } = await ugHighschoolApi.fetchAllHighSchoolGpaScale();
        this.highSchoolGpaScales = data.data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.scaleDisplay,
            value: item.id,
          };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectHighSchoolGpaScale(instance) {
      const index = this.highSchoolGpaScales.findIndex(
        (item) => item.psScaleName === instance.psScaleName
      );

      if (index !== -1) {
        this.highSchoolGpaScales[index]["selected"] = true;
      }
    },
    deselectHighSchoolGpaScale() {
      const index = this.highSchoolGpaScales.findIndex((item) => item.selected);

      if (index !== -1) {
        this.highSchoolGpaScales[index]["selected"] = false;
      }
    },
    // highSchoolGradeScaleTypes
    async populateHighSchoolGradeScaleTypes() {
      try {
        const { data } = await ugHighschoolApi.fetchAllHighSchoolGpaScaleType();
        this.highSchoolGradeScaleTypes = data.data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.displayScaleTypeName,
            value: item.displayScaleTypeName,
          };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectHighSchoolGradeScaleType(instance) {
      const index = this.highSchoolGradeScaleTypes.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolGradeScaleTypes[index]["selected"] = true;
      }
    },
    deselectHighSchoolGradeScaleType() {
      const index = this.highSchoolGradeScaleTypes.findIndex(
        (item) => item.selected
      );

      if (index !== -1) {
        this.highSchoolGradeScaleTypes[index]["selected"] = false;
      }
    },
    // highSchoolGrades
    async populateHighSchoolGrades() {
      try {
        const { data } = await ugHighschoolApi.fetchAllHighSchoolGrade();
        this.highSchoolGrades = data.data.map((item) => {
          return { ...item, selected: false, text: item.grade, value: item.id };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectHighSchoolGrade(instance) {
      const index = this.highSchoolGrades.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolGrades[index]["selected"] = true;
      }
    },
    deselectHighSchoolGrade(instance) {
      const index = this.highSchoolGrades.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolGrades[index]["selected"] = false;
      }
    },
    // highSchoolTermTypes
    async populateHighSchoolTermTypes() {
      try {
        const { data } = await ugHighschoolApi.fetchAllHighSchoolTermType();
        this.highSchoolTermTypes = data.data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.typeName,
            value: item.id,
          };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectHighSchoolTermType(instance) {
      const index = this.highSchoolTermTypes.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolTermTypes[index]["selected"] = true;
      }
    },
    deselectHighSchoolTermType(instance) {
      const index = this.highSchoolTermTypes.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.highSchoolTermTypes[index]["selected"] = false;
      }
    },
    // pronouns
    async populatePronouns() {
      try {
        const { data } = await ugPronounApi.fetchAllPronoun();
        this.pronouns = data.data.map((item) => {
          return { ...item, selected: false };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectPronoun(instance) {
      const index = this.pronouns.findIndex((item) => item.id === instance.id);

      if (index !== -1) {
        this.pronouns[index]["selected"] = true;
      }
    },
    deselectPronoun(instance) {
      const index = this.pronouns.findIndex((item) => item.id === instance.id);

      if (index !== -1) {
        this.pronouns[index]["selected"] = false;
      }
    },
    // sarQuestions
    async populateSarQuestions() {
      try {
        const { data } = await ugSarApi.fetchSarQuestionConfigurations();
        this.sarQuestions = data.data.map((item) => {
          return { ...item, selected: false };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    // tribes
    async populateTribes() {
      try {
        const { data } = await ugAztribesApi.fetchAllAzTribes();
        this.tribes = data.data.map((item) => {
          return { ...item, selected: false };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectTribe(instance) {
      const index = this.tribes.findIndex(
        (item) => item.culturalOriginCode === instance.culturalOriginCode
      );

      if (index !== -1) {
        this.tribes[index]["selected"] = true;
      }
    },
    deselectTribe(instance) {
      const index = this.tribes.findIndex(
        (item) => item.culturalOriginCode === instance.culturalOriginCode
      );

      if (index !== -1) {
        this.tribes[index]["selected"] = true;
      }
    },
    // userTypeLocations
    async populateUserTypeLocations() {
      try {
        const { data } = await ugUsertypeApi.fetchAllUserTypeLocation();
        this.userTypeLocations = data.data.map((item) => {
          return { ...item, selected: false };
        });

        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    selectUserTypeLocation(instance) {
      const index = this.userTypeLocations.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.userTypeLocations[index]["selected"] = true;
      }
    },
    deselectUserTypeLocation(instance) {
      const index = this.userTypeLocations.findIndex(
        (item) => item.id === instance.id
      );

      if (index !== -1) {
        this.userTypeLocations[index]["selected"] = false;
      }
    },
    async populateStatesLicensedtoPracticeRN() {
      try {
        const { status, data } = await asuDplApi.fetchCountryDetail("USA");

        this.statesLicensedtoPracticeRN = data.states.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.stateCode,
          };
        });
        return { code: status, data: this.statesLicensedtoPracticeRN };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async selectStatesLicensedtoPracticeRN(instance) {
      const index = this.statesLicensedtoPracticeRN.findIndex(
        (item) => item.stateCode === instance?.stateCode
      );

      if (index !== -1) {
        this.statesLicensedtoPracticeRN[index]["selected"] = true;
      }
    },
    async deselectStatesLicensedtoPracticeRN() {
      const index = this.statesLicensedtoPracticeRN.findIndex(
        (item) => item.selected
      );

      if (index !== -1) {
        this.statesLicensedtoPracticeRN[index]["selected"] = false;
      }
    },
    async populateCountries() {
      try {
        const { status, data } = await asuDplApi.fetchCountries();
        this.countries = data.map((item) => {
          return {
            ...item,
            selected: false,
            text: item.description,
            value: item.countryCode,
          };
        });

        return { code: status, data: this.countries };
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },

    // pre selecting the config options based on data from respective store
    // primary language
    preselectPrimaryLanguageAtHome() {
      const userStore = useUserStore();
      if (userStore.primaryLanguageAtHome) {
        this.selectPrimaryLanguageAtHome({
          languageCode3: userStore.primaryLanguageAtHome,
        });
      }
    },
    // Home address country and state
    async preselectHomeAddressCountryState() {
      const ugApplicationStore = useUgApplicationStore();
      const homeAddress = ugApplicationStore.address(
        MyInfoConstants.permanentAddressType
      );
      let response = { code: 200 };
      if (homeAddress) {
        this.selectHomeAddressCountry({ countryCode: homeAddress.countryCode });
        response = await this.populateHomeAddressStates();
        this.selectHomeAddressState({ stateCode: homeAddress.stateProvince });
      }
      return response;
    },
    // Ethnic/racial background
    preselectEthnicities() {
      const ugApplicationStore = useUgApplicationStore();
      if (ugApplicationStore.ethnicities.length > 0) {
        ugApplicationStore.ethnicities.forEach((element) => {
          this.selectEthnicity(element.ethnicGroupCode);
          this.selectEthnicityGroup(
            element.ethnicGroupCode,
            element.culturalOriginCode
          );
          if (element.reportingPreference) {
            this.selectPrimaryRace(element.ethnicGroupCode);
          }
        });
      }
    },
    // Citizen country
    preselectCitizenCountry() {
      const userStore = useUserStore();
      if (userStore.citizenCountry) {
        this.selectCitizenCountry({ countryCode: userStore.citizenCountry });
      }
    },
    // Birth country
    preselectBirthCountry() {
      const userStore = useUserStore();
      if (userStore.birthCountry) {
        this.selectBirthCountry({ countryCode: userStore.birthCountry });
      }
    },
    // international address country and state
    async preselectInternationalAddressCountryState() {
      const ugApplicationStore = useUgApplicationStore();
      const intAddress = ugApplicationStore.address(
        MyInfoConstants.intAddressType
      );
      let response = { code: 200 };
      if (intAddress) {
        this.selectIntAddressCountry({ countryCode: intAddress.countryCode });
        response = await this.populateInternationalAddressStates();
        this.selectIntAddressState({ stateCode: intAddress.stateProvince });
      }
      return response;
    },
    // shipping address country and state
    async preselectShippingAddressCountryState() {
      const ugApplicationStore = useUgApplicationStore();
      const shippingAddress = ugApplicationStore.address(
        MyInfoConstants.i20AddressType
      );
      let response = { code: 200 };
      if (shippingAddress) {
        this.selectShippingAddressCountry({
          countryCode: shippingAddress.countryCode,
        });
        response = await this.populateShippingAddressStates();
        this.selectShippingAddressState({
          stateCode: shippingAddress.stateProvince,
        });
      }
      return response;
    },
    // corprate Partners
    preselectCorpratePartners() {
      const ugApplicationStore = useUgApplicationStore();
      if (ugApplicationStore.myInfoSar.partnerBenefits.currentEmployer) {
        this.selectCorporatePartner({
          corporatePartnerDescription:
            ugApplicationStore.myInfoSar.partnerBenefits.currentEmployer,
        });
      }
    },
    // statesLicensedtoPracticeRN
    preselectStatesLicensedToPracticeRn() {
      const ugApplicationStore = useUgApplicationStore();
      if (ugApplicationStore.myAsuProgramSar.rnToBsn.license.state) {
        this.selectStatesLicensedtoPracticeRN({
          stateCode: ugApplicationStore.myAsuProgramSar.rnToBsn.license.state,
        });
      }
    },
    preselectUserVisaType() {
      const userStore = useUserStore();
      if (userStore.visaCode) {
        this.selectVisaPermitType({
          visaPermitTypeCode: userStore.visaCode,
        });
      }
    },
  },
});

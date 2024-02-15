import {
  ACAD_PLANS_PATH,
  ACAD_PLAN_PATH,
  CAMPUSES_PATH,
  CODESET_PATH,
  COUNTRIES_PATH,
  COUNTRY_PATH,
  ETHNICITIES_PATH,
  EXTERNAL_ORGANIZATIONS_PATH,
  EXTERNAL_ORGANIZATION_PATH,
  TERMS_PATH,
  TERM_PATH,
  UNDERGRADUATE_ADMISSIONS_CORPORATE_PARTNERS_PATH,
  USA_STATE_CITIES_PATH,
  VISA_PERMIT_TYPES,
} from "@/api/api-constants.js";
import axios from "@/services/axiosService.js";

export default {
  fetchAcademicPlans() {
    return axios.get(
      `${
        import.meta.env.VITE_ASU_DPL_BASE_URL
      }${CODESET_PATH}${ACAD_PLANS_PATH}?degreeType=UG&majorMapGeneral.campus=ONLNE&include=planCategories&include=subplans&include=campusesOffered&include=applicationDeadlines&include=applicantsMustChooseSecondMajor&filter=activeInDegreeSearch`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  fetchAcademicPlanDetail(academicPlanCode) {
    return axios.get(
      `${
        import.meta.env.VITE_ASU_DPL_BASE_URL
      }${CODESET_PATH}${ACAD_PLAN_PATH}/${academicPlanCode}?include=*`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  fetchCampuses() {
    return axios.get(
      `${import.meta.env.VITE_ASU_DPL_BASE_URL}${CODESET_PATH}${CAMPUSES_PATH}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  fetchCountries() {
    return axios.get(
      `${
        import.meta.env.VITE_ASU_DPL_BASE_URL
      }${CODESET_PATH}${COUNTRIES_PATH}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  fetchCountryDetail(countryCode) {
    return axios.get(
      `${
        import.meta.env.VITE_ASU_DPL_BASE_URL
      }${CODESET_PATH}${COUNTRY_PATH}/${countryCode}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  fetchEthnicities() {
    return axios.get(
      `${
        import.meta.env.VITE_ASU_DPL_BASE_URL
      }${CODESET_PATH}${ETHNICITIES_PATH}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  fetchExternalOrganizations(params) {
    return axios.get(
      `${
        import.meta.env.VITE_ASU_DPL_BASE_URL
      }${CODESET_PATH}${EXTERNAL_ORGANIZATIONS_PATH}?${params}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  fetchExternalOrganizationDetail(externalOrganizationId) {
    return axios.get(
      `${
        import.meta.env.VITE_ASU_DPL_BASE_URL
      }${CODESET_PATH}${EXTERNAL_ORGANIZATION_PATH}/${externalOrganizationId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  fetchExternalOrganizationsUsaStatesCities() {
    return axios.get(
      `${
        import.meta.env.VITE_ASU_DPL_BASE_URL
      }${CODESET_PATH}${EXTERNAL_ORGANIZATIONS_PATH}${USA_STATE_CITIES_PATH}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  fetchTerms() {
    return axios.get(
      `${import.meta.env.VITE_ASU_DPL_BASE_URL}${CODESET_PATH}${TERMS_PATH}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  fetchTermDetail(strm) {
    return axios.get(
      `${
        import.meta.env.VITE_ASU_DPL_BASE_URL
      }${CODESET_PATH}${TERM_PATH}/${strm}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  fetchUndegraduateAdmissionsCorporatePartners() {
    return axios.get(
      `${
        import.meta.env.VITE_ASU_DPL_BASE_URL
      }${CODESET_PATH}${UNDERGRADUATE_ADMISSIONS_CORPORATE_PARTNERS_PATH}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  fetchVisaPermitTypes() {
    return axios.get(
      `${
        import.meta.env.VITE_ASU_DPL_BASE_URL
      }${CODESET_PATH}${VISA_PERMIT_TYPES}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
};

import ugAddressesApi from "@/api/ug-addresses-api.js";
import ugApplicationApi from "@/api/ug-application-api.js";
import ugEthnicities from "@/api/ug-ethnicities-api.js";
import ugGuardianApi from "@/api/ug-guardian-api.js";
import ugHighschoolApi from "@/api/ug-highschool-api.js";
import ugNameApi from "@/api/ug-name-api.js";
import ugOtherinstitutionApi from "@/api/ug-otherinstitution-api.js";
import ugProgramofinterestsApi from "@/api/ug-programofinterests-api.js";
import ugSarApi from "@/api/ug-sar-api.js";
import ugUiviewApi from "@/api/ug-uiview-api.js";
import ugMilitaryaffiliationsApi from "@/api/ug-militaryaffiliations-api";
import ugAppValidationsApi from "@/api/ug-app-validations.api";
import validationMap from "@/content/validation-map.json";
import ugPaymentApi from "@/api/ug-payment-api";
import ugWaiversApi from "@/api/ug-waivers-api";
import ugFeesApi from "@/api/ug-fees-api";
import ugVisasupplementalsApi from "@/api/ug-visasupplementals-api";
import { useConfigStore } from "@/stores/config-store";
import { validateBriteVerifyAddressAndPhone } from "@/api/brite-verify.js";
import {
  EnumPageNames,
  EnumUndergradAppScreenLabels,
} from "@/content/enum-app.js";
import {
  EnumSarCodes,
  MyInfoConstants,
} from "@/content/enum-ug-application.js";
import { useUserStore } from "@/stores/user-store";
import { useAppStore } from "@/stores/app-store";
import { defineStore } from "pinia";
import asuDplApi from "@/api/asu-dpl-api";
import { invert, unique } from "radash";
import {
  EnumNameTypes,
  EnumAzResidency,
} from "@/content/enum-ug-application.js";
import ugResidencyApi from "@/api/ug-residency-api.js";
import {
  getAnswersFromApi,
  findState,
  extractPsKeys,
  findContentOptions,
  generateFormattedAddress,
  generateFormattedSarAnswers,
  prepareResidencyQuestionMapping,
  generateInstitutionDetail,
  generateSchoolDetail,
  generateProgramDetail,
  generateFormattedCourseWorks,
  generateFormattedProgramOfInterest,
  generateFormattedDate,
  generateSingleLineAddress,
  getProfileErrorMap,
  applicationMyInformationDetailsErrors,
  applicationMyProgramsDetailsErrors,
  applicationMySchoolsDetailsErrors,
  applicationMyHighSchoolGradesDetailsErrors,
  applicationMyArizonaResidencyDetailsErrors,
  applicationMiscellaneousDetailsErrors,
} from "@/services/UtilityService.js";
import { crush, isObject, keys, get } from "radash";
// TODO: Use radash instead of lodash
import * as _ from "lodash";
import monthOptions from "@/content/months.json";
import myInfoContent from "@/content/my-information.json";
import myProgramContent from "@/content/my-asu-program.json";
import mySchoolContent from "@/content/my-schools.json";
import myHighSchoolGradesContent from "@/content/my-high-school-grades.json";
import arizonaResidencyContent from "@/content/arizona-residency.json";

export const useUgApplicationStore = defineStore({
  id: "ugApplication",
  persist: true,
  state: () => ({
    appId: null,
    // ================== az residency store starts ==================
    sectionDomicile: null,
    sectionDependent: null,
    sectionEnrollment: null,
    sectionDriverLicense: null,
    sectionVehicle: null,
    sectionTax: null,
    // NOTE: sectionFinancialSupport is an object, should not be null
    sectionFinancialSupport: {},
    sectionEmployment: null,
    sectionMilitaryActiveDuty: null,
    sectionVeteran: null,
    sectionVote: null,
    sectionMilitaryDependency: null,
    sectionNativeAmerican: null,
    sectionLegalGuardian: null,
    sectionMarried: null,
    sectionProp308: null,
    // ================== az residency store ends ==================
    formerNames: [],
    addresses: [],
    azResidencyPayload: {},
    ethnicities: [],
    configCountries: [],
    guardians: [],
    visaSupplementals: null,
    myInfoSar: {
      usCitizenship: {
        cityOfBirth: null,
      },
      asuAffiliation: {
        affiliations: {
          affiliationASUCOMMDGS: null,
          affiliationASUCOMMNDG: null,
          affiliationASUCOMGLLN: null,
          affiliationASUCOMGFA: null,
          affiliationASUCOMEMPL: null,
          affiliationASUCOMSUMM: null,
          affiliationASUCOMOTH: null,
          affiliationASUCOMNVR: null,
        },
      },
      partnerBenefits: {
        educationBenefit: null,
        currentEmployer: null,
      },
    },
    myHighSchoolGradesSar: {
      gradePath: null,
    },
    institutionStatus: null,
    otherInstitutions: [],
    payment: null,
    feeAmount: null,
    programOfInterests: [],
    mySchoolsSar: {
      college: {
        totelSemisterCredits: null,
      },
      iseligibleToReturnToColleges: null,
      ineligibleToReturnCollege: {
        first: {
          name: null,
          reasons: {
            academicRelated: null,
            studentConduct: null,
            other: null,
            explaination: null,
          },
        },
        second: {
          name: null,
          reasons: {
            academicRelated: null,
            studentConduct: null,
            other: null,
            explaination: null,
          },
        },
      },
    },
    myAsuProgramSar: {
      otherInterests: {
        otherInterestPRELAW: null,
        otherInterestPREMED: null,
        otherInterestPREVET: null,
        otherInterestAPPQNAME11: null,
      },
      rnToBsn: {
        isLicensed: null,
        license: {
          state: null,
          number: null,
          expirationDate: null,
          disciplinaryActionTaken: null,
        },
        dateScheduledForNclexrn: null,
        employer: null,
        partnerCode: null,
        releaseInfoToEmployer: null,
        communityColleges: null,
        reverseTransferAggrement: null,
      },
    },
    reviewSar: {
      azCollegeTranscriptConsent: null,
    },
    residencyAnswers: [],
    sarQuestionResponses: null, // should be a object where key is the questionCode
    sarAnswers: null,
    waiver: null,
    highSchools: [],
    highSchoolCourseWorks: [],
    highSchoolAcademics: {
      currentUnweightedGpa: null,
      gpaScaleId: null,
      classRank: null,
      classSize: null,
      gradingScaleId: null,
    },
    militaryaffiliations: {
      status: null,
      branch: null,
      vaEducationBenefits: null,
      jointServiceTranscript: null,
    },
    source: [],
    uiViewInfo: {
      previousScreen: null,
      currentScreen: null,
    },
    adminUiViewInfo: {
      currentScreen: null,
      previousScreen: null,
    },

    createdAt: null,
    allUsStates: [],
    // To check for the page change via any buttons/links when there are unsaved changes in the page
    isCurrentPageHasUnsavedChanges: false,
    currentPageStatus: null,
    redirectRouteName: null,
    dashboardFeedbackAlertClosed: null,
    dashboardQTRAlertClosed: null,
    // TODO: populate this on layout
    // If any of the field are complete on the pageload then its a complete
    screenStatus: {
      "ug-app-my-information": "incomplete",
      "ug-app-my-program": "incomplete",
      "ug-app-my-schools": "incomplete",
      "ug-app-my-high-school-grades": "incomplete",
      "ug-app-arizona-residency": "incomplete",
    },
    applicationErrors: {
      "ug-app-profile-errors": [],
      "ug-app-my-information": [],
      "ug-app-my-program": [],
      "ug-app-my-schools": [],
      "ug-app-my-high-school-grades": [],
      "ug-app-arizona-residency": [],
      miscellaneous: [],
    },
  }),
  getters: {
    getValidationMap() {
      return _.groupBy(_.keys(validationMap), (value) => validationMap[value]);
    },
    address(state) {
      return (addressType) => {
        const address = state.addresses.filter(
          (address) => address.type === addressType
        );
        return address.length > 0 ? address[0] : null;
      };
    },
    asuAffiliations(state) {
      const data = [];
      Object.keys(state.myInfoSar.asuAffiliation.affiliations).map((item) => {
        if (state.myInfoSar.asuAffiliation.affiliations[item] === "Y") {
          data.push(item);
        }
      });
      return data;
    },
    asuProgramsOtherInterests(state) {
      const data = [];
      Object.keys(state.myAsuProgramSar.otherInterests).map((item) => {
        if (state.myAsuProgramSar.otherInterests[item] === "Y") {
          data.push(item);
        }
      });
      return data;
    },
    currentScreen(state) {
      const userStore = useUserStore();
      if (userStore.userType === EnumNameTypes.UserTypeSelf) {
        return state.uiViewInfo.currentScreen !== null
          ? state.uiViewInfo.currentScreen
          : EnumPageNames.PageUndergradMyInformation;
      } else {
        return state.adminUiViewInfo.currentScreen !== null
          ? state.adminUiViewInfo.currentScreen
          : EnumPageNames.PageUndergradReview;
      }
    },
    previousScreen(state) {
      const userStore = useUserStore();
      if (userStore.userType === EnumNameTypes.UserTypeSelf) {
        return state.uiViewInfo.previousScreen !== null
          ? state.uiViewInfo.previousScreen
          : EnumPageNames.PageUndergradMyInformation;
      } else {
        return state.adminUiViewInfo.previousScreen !== null
          ? state.adminUiViewInfo.previousScreen
          : EnumPageNames.PageUndergradArizonaResidency;
      }
    },
    currentScreenStep() {
      let step = 0;
      if (this.currentScreen !== null) {
        switch (this.currentScreen) {
          case EnumPageNames.PageUndergradMyInformation:
            step = 1;
            break;
          case EnumPageNames.PageUndergradMyProgram:
            step = 2;
            break;
          case EnumPageNames.PageUndergradMySchools:
            step = 3;
            break;
          case EnumPageNames.PageUndergradMyHighSchoolGrades:
            step = 4;
            break;
          case EnumPageNames.PageUndergradArizonaResidency:
            step = 5;
            break;
          case EnumPageNames.PageUndergradReview:
            step = 6;
            break;
          case EnumPageNames.PageUndergradDashboard:
            step = 7;
            break;
        }
      }
      return step;
    },
    currentScreenLabel() {
      let label = "N/A";
      if (this.currentScreen !== null) {
        switch (this.currentScreen) {
          case EnumPageNames.PageUndergradMyInformation:
            label = EnumUndergradAppScreenLabels.PageUndergradMyInformation;
            break;
          case EnumPageNames.PageUndergradMyProgram:
            label = EnumUndergradAppScreenLabels.PageUndergradMyProgram;
            break;
          case EnumPageNames.PageUndergradMySchools:
            label = EnumUndergradAppScreenLabels.PageUndergradMySchools;
            break;
          case EnumPageNames.PageUndergradMyHighSchoolGrades:
            label =
              EnumUndergradAppScreenLabels.PageUndergradMyHighSchoolGrades;
            break;
          case EnumPageNames.PageUndergradArizonaResidency:
            label = EnumUndergradAppScreenLabels.PageUndergradArizonaResidency;
            break;
          case EnumPageNames.PageUndergradReview:
            label = EnumUndergradAppScreenLabels.PageUndergradReview;
            break;
          case EnumPageNames.PageUndergradDashboard:
            label = EnumUndergradAppScreenLabels.PageUndergradAppDashboard;
            break;
          case "ug-app-profile-errors":
            label = "Profile";
            break;
          case "ug-app-common-errors":
            label = "Common errors";
            break;
        }
      }
      return label;
    },
    isEligibleForProp308() {
      const userStore = useUserStore();
      // checking if the visatype is DCDA/UD
      if (
        userStore.visaCode === EnumAzResidency.visaTypeUD ||
        userStore.visaCode === EnumAzResidency.visaTypeDACA
      ) {
        const graduationSchool = this.highSchools.filter(
          (item) => item.gradYear && item.gradMonth
        );
        // returning true if graduated school state is Arizona and school name is not HiSet
        return (
          graduationSchool.length > 0 &&
          graduationSchool[0].state === EnumNameTypes.AzStateCode &&
          (graduationSchool[0].name !== EnumAzResidency.hisetSchool.name ||
            (graduationSchool[0].name === EnumAzResidency.hisetSchool.name &&
              graduationSchool[0].extOrgId !==
                EnumAzResidency.hisetSchool.extOrgId))
        );
      } else {
        return false;
      }
    },
    myProfileDetails() {
      try {
        const userStore = useUserStore();
        let currentId = 0;
        let details = [
          {
            text: "Legal name",
            value: userStore.legalFullName,
            id: `${++currentId}`,
          },
          {
            text: "Preferred first name",
            value: userStore.preferredFirstName
              ? userStore.preferredFirstName
              : "",
            id: `${++currentId}`,
          },
          {
            text: "Date of birth",
            value: userStore.formattedDob,
            id: `${++currentId}`,
          },
        ];
        // pronouns
        let pronouns = "";
        if (userStore.pronouns.length > 0) {
          userStore.pronouns.forEach((item, index) => {
            if (index >= 1) {
              pronouns = pronouns + "</br>";
            }
            pronouns = pronouns + item.pronoun;
          });
        }
        details.push({
          text: "Pronouns",
          value: pronouns,
          id: `${++currentId}`,
        });
        // genders
        let genders = "";
        if (userStore.genders.length > 0) {
          userStore.genders.forEach((item, index) => {
            if (index >= 1) {
              genders = genders + "</br>";
            }
            genders = genders + item.genderIdentity;
          });
        }
        details.push({
          text: "Gender identity",
          value: genders,
          id: `${++currentId}`,
        });
        // email
        details.push({
          text: "Email",
          value: userStore.email,
          id: `${++currentId}`,
        });

        // main phone
        const mainPhone = userStore.phone(EnumNameTypes.mainPhoneType);
        if (mainPhone) {
          details.push({
            text: "Phone",
            value: mainPhone.areaCode
              ? `+1${mainPhone.areaCode}${mainPhone.phoneNumber}`
              : mainPhone.phoneNumber,
            id: `${++currentId}`,
          });
        }
        // mobile phone
        const mobilePhone = userStore.phone(EnumNameTypes.mobilePhoneType);
        if (mobilePhone) {
          const isMainAndMobilePhoneAreSame =
            mainPhone.areaCode === mobilePhone.areaCode &&
            mainPhone.phoneNumber === mobilePhone.phoneNumber;

          if (!isMainAndMobilePhoneAreSame) {
            details.push({
              text: "Mobile phone",
              value: mobilePhone.areaCode
                ? `+1${mobilePhone.areaCode}${mobilePhone.phoneNumber}`
                : mobilePhone.phoneNumber,
              id: `${++currentId}`,
            });
          }
        }
        // Mobile SMS
        details.push({
          text: "Mobile SMS",
          value: !userStore.receiveInfoBySMS
            ? null
            : userStore.receiveInfoBySMS === "Y"
            ? "Yes"
            : "No",
          id: `${++currentId}`,
        });

        // removing any null or empty values
        details = details.filter(
          (item) => item.value !== null || !_.isEmpty(item.value)
        );
        const groupedData = _.groupBy(details, (detail) => {
          return detail.id.split(".")[0];
        });
        return {
          title: "Profile",
          data: groupedData,
          editCtaLink: EnumPageNames.PageProfile,
        };
      } catch (error) {
        console.error(error);
        return {};
      }
    },
    myInformationDetails() {
      try {
        const userStore = useUserStore();
        const configStore = useConfigStore();
        let details = [];
        let currentId = 0;
        // formerNames
        let formerNames = "";
        this.formerNames.forEach((name, index) => {
          if (index >= 1) {
            formerNames = formerNames + "</br>";
          }
          formerNames = formerNames + `${name.firstName} ${name.lastName}`;
        });
        details.push({
          text: myInfoContent.formerName.previewLabel,
          value: formerNames ? formerNames : "None",
          id: `${++currentId}`,
        });
        // Legalsex
        const legalSex = myInfoContent.legalSex.options.filter(
          (item) => item.value === userStore.sex
        );
        details.push({
          text: myInfoContent.legalSex.label,
          value: legalSex.length > 0 ? legalSex[0].text : null,
          id: `${++currentId}`,
        });
        // PrimaryLanguage
        const primaryLanguage =
          configStore.selectedPrimaryLanguageAtHome?.value !==
          MyInfoConstants.primaryLanguageOther
            ? configStore.selectedPrimaryLanguageAtHome?.text
            : userStore.primaryLanguageAtHomeOther;
        details.push({
          text: myInfoContent.primaryLanguage.label,
          value: primaryLanguage,
          id: `${++currentId}`,
        });

        // Address
        const address = generateSingleLineAddress(
          this.address(MyInfoConstants.permanentAddressType),
          configStore.selectedHomeAddressCountry,
          configStore.selectedHomeAddressState
        );
        details.push({
          text: myInfoContent.homeAddress.previewAddressLabel,
          value: address,
          id: `${++currentId}`,
        });
        // Ethnic an racial background
        let ethnicity = "";
        configStore.selectedEthnicitiesWithDetails.forEach((item, index) => {
          if (index >= 1) {
            ethnicity = ethnicity + "</br>";
          }
          const text = item.reportingPreference
            ? `${item.originText} (Reporting Preferred)`
            : item.originText;
          ethnicity = ethnicity + text;
        });
        details.push({
          text: myInfoContent.ethnicOrRacial.label,
          value: ethnicity ? ethnicity : "None",
          id: `${++currentId}`,
        });
        //  US citizenship
        // is us citizen
        let isUsCitizen = myInfoContent.usCitizenship.options.filter(
          (option) => {
            if (userStore.citizenCountry) {
              return userStore.citizenCountry !== MyInfoConstants.usCountryCode
                ? !option.value
                : option.value;
            } else {
              return false;
            }
          }
        );
        details.push({
          text: myInfoContent.usCitizenship.label,
          value: isUsCitizen.length > 0 ? isUsCitizen[0].text : "None",
          id: `${++currentId}`,
        });
        // type of visa
        const visaType = myInfoContent.usCitizenship.typeOfVisa.options.filter(
          (item) => item.visaPermitTypeCode === userStore.visaCode
        );
        details.push({
          text: myInfoContent.usCitizenship.typeOfVisa.previewLabel,
          value:
            visaType.length > 0
              ? visaType[0].text
              : configStore.selectedVisaPermitType
              ? configStore.selectedVisaPermitType.text
              : null,
          id: `${++currentId}`,
        });
        // citizen country
        details.push({
          text: myInfoContent.usCitizenship.countryOfCitizenship.label,
          value: configStore.selectedCitizenCountry
            ? configStore.selectedCitizenCountry?.text
            : null,
          id: `${++currentId}`,
        });
        // country of birth
        details.push({
          text: myInfoContent.usCitizenship.countryOfBirth.label,
          value: configStore.selectedBirthCountry
            ? configStore.selectedBirthCountry?.text
            : null,
          id: `${++currentId}`,
        });
        // city of birth
        details.push({
          text: myInfoContent.usCitizenship.cityOfBirthLabel,
          value: this.myInfoSar.usCitizenship.cityOfBirth,
          id: `${++currentId}`,
        });
        // SSN
        details.push({
          text: myInfoContent.usCitizenship.USssn.label,
          value: userStore.ssn,
          id: `${++currentId}`,
        });
        // issuing I-20
        if (this.visaSupplementals?.studentVisaStatus) {
          const issuingI20 =
            myInfoContent.usCitizenship.issuingI20.options.filter(
              (item) => item.value === this.visaSupplementals?.studentVisaStatus
            );
          details.push({
            text: myInfoContent.usCitizenship.issuingI20.label,
            value: issuingI20.length > 0 ? issuingI20[0].text : null,
            id: `${++currentId}`,
          });
        }
        // international address
        const intAddress = this.address(MyInfoConstants.intAddressType);
        let formattedIntAddress = null;
        if (intAddress) {
          formattedIntAddress = generateSingleLineAddress(
            intAddress,
            configStore.selectedInternationalAddressCountry,
            configStore.selectedInternationalAddressState
          );
        }
        details.push({
          text: myInfoContent.usCitizenship.intAddressLabel,
          value: formattedIntAddress,
          id: `${++currentId}`,
        });
        // I-20 address
        const shippingAddress = this.address(MyInfoConstants.i20AddressType);
        let formattedShippingAddress = null;
        if (shippingAddress) {
          formattedShippingAddress = generateSingleLineAddress(
            shippingAddress,
            configStore.selectedShippingAddressCountry,
            configStore.selectedShippingAddressState
          );
        }
        details.push({
          text: myInfoContent.usCitizenship.shippingAddress.label,
          value: formattedShippingAddress,
          id: `${++currentId}`,
        });
        // parent and legal guardian
        this.guardians.forEach((item, index) => {
          currentId += 1;
          details.push({
            text:
              index === 0
                ? myInfoContent.guardian.label
                : myInfoContent.guardian.previewAdditionalGuardianLabel,
            value: item.guardianName,
            id: `${currentId}.1`,
          });
          details.push({
            text: myInfoContent.guardian.guardianRelation.previewLabel,
            value: item.guardianRelation,
            id: `${currentId}.2`,
          });
          details.push({
            text: myInfoContent.guardian.highestSchoolingLevel.previewLabel,
            value: item.highestSchoolingLevel,
            id: `${currentId}.3`,
          });
          const attendedAsu =
            myInfoContent.guardian.previousAsuStudent.options.filter(
              (option) => option.value === item.previousAsuStudent
            );
          details.push({
            text: myInfoContent.guardian.previousAsuStudent.previewLabel,
            value: attendedAsu[0].text,
            id: `${currentId}.4`,
          });
        });
        // previous asu affiliation
        currentId += 1;
        let asuAffiliations = "";
        myInfoContent.asuAffiliation.options.filter((item) => {
          if (this.myInfoSar.asuAffiliation.affiliations[item.value] === "Y") {
            if (!_.isEmpty(asuAffiliations)) {
              asuAffiliations = asuAffiliations + "</br>";
            }
            asuAffiliations = asuAffiliations + item.text;
          }
        });
        details.push({
          text: myInfoContent.asuAffiliation.previewLabel,
          value: !_.isEmpty(asuAffiliations) ? asuAffiliations : "None",
          id: `${currentId}.1`,
        });
        // AffiliationId
        details.push({
          text: myInfoContent.asuAffiliation.affiliateId.previewLabel,
          value: userStore.asuId ? userStore.asuId : "None",
          id: `${currentId}.2`,
        });

        // uniformed services
        // status
        currentId += 1;
        let statusValue = null;
        const relation =
          myInfoContent.usUniformedServices.relation.options.filter(
            (item) => item.value === this.militaryaffiliations.status
          );
        if (relation.length > 0) {
          statusValue = relation[0].text;
        } else {
          const status =
            myInfoContent.usUniformedServices.status.options.filter(
              (item) => item.value === this.militaryaffiliations.status
            );
          statusValue = status.length > 0 ? status[0].text : null;
        }
        details.push({
          text: myInfoContent.usUniformedServices.relation.previewLabel,
          value: statusValue,
          id: `${currentId}.1`,
        });
        if (
          this.militaryaffiliations.status !==
          MyInfoConstants.uniformedService.noneOfOptionsValue
        ) {
          // Branch
          // getting the branch options based on the status value
          const branchOptions =
            this.militaryaffiliations.status ===
            MyInfoConstants.uniformedService.statusNationalGuard
              ? myInfoContent.usUniformedServices.branch.nationalGuardOptions
              : this.militaryaffiliations.status ===
                MyInfoConstants.uniformedService.statusArmedForces
              ? myInfoContent.usUniformedServices.branch.armedForceOptions
              : myInfoContent.usUniformedServices.branch.defaultOptions;

          const branch = branchOptions.filter(
            (item) => item.value === this.militaryaffiliations.branch
          );
          details.push({
            text: myInfoContent.usUniformedServices.branch.previewLabel,
            value: branch.length > 0 ? branch[0].text : null,
            id: `${currentId}.2`,
          });
          // appliedForBenefit
          const appliedForBenefit =
            myInfoContent.usUniformedServices.appliedForBenefit.options.filter(
              (item) =>
                item.value === this.militaryaffiliations.vaEducationBenefits
            );
          details.push({
            text: myInfoContent.usUniformedServices.appliedForBenefit.label,
            value:
              appliedForBenefit.length > 0 ? appliedForBenefit[0].text : null,
            id: `${currentId}.3`,
          });
          //Joint Service Transcript
          const requestTranscript =
            myInfoContent.usUniformedServices.requestTranscript.options.filter(
              (item) =>
                item.value === this.militaryaffiliations.jointServiceTranscript
            );
          details.push({
            text: myInfoContent.usUniformedServices.requestTranscript.label,
            value:
              requestTranscript.length > 0 ? requestTranscript[0].text : null,
            id: `${currentId}.4`,
          });
        }

        // partner benefits
        currentId += 1;
        const educationBenefit = myInfoContent.partnerBenefits.options.filter(
          (item) =>
            item.value === this.myInfoSar.partnerBenefits.educationBenefit
        );
        details.push({
          text: myInfoContent.partnerBenefits.text,
          value: educationBenefit.length > 0 ? educationBenefit[0].text : null,
          id: `${currentId}.1`,
        });
        // employer
        details.push({
          text: myInfoContent.partnerBenefits.currentEmployer.previewLabel,
          value: configStore.selectedCorporatePartner
            ? configStore.selectedCorporatePartner.text
            : null,
          id: `${currentId}.2`,
        });
        // removing any null or empty values
        details = details.filter(
          (item) => item.value !== null || !_.isEmpty(item.value)
        );

        const groupedData = _.groupBy(details, (detail) => {
          return detail.id.split(".")[0];
        });

        // END of my information data populating for review page
        return {
          title: EnumUndergradAppScreenLabels.PageUndergradMyInformation,
          data: groupedData,
          editCtaLink: EnumPageNames.PageUndergradMyInformation,
        };
      } catch (error) {
        console.error(error);
        return {};
      }
    },
    myProgramsDetails() {
      try {
        const configStore = useConfigStore();
        let details = [];
        let currentId = 0;
        // First choice program
        const firstProgram = this.programOfInterests.filter(
          (item) => item.priority === "1"
        );
        if (firstProgram.length > 0) {
          const program = generateProgramDetail(firstProgram[0], configStore);

          if (program) {
            currentId += 1;
            details.push({
              text: myProgramContent.degreePreviewLabels.first.title,
              value: program.title,
              id: `${currentId}.1`,
            });
            details.push({
              text: myProgramContent.degreePreviewLabels.first.location,
              value: program.location,
              id: `${currentId}.2`,
            });
            details.push({
              text: myProgramContent.degreePreviewLabels.first.term,
              value: program.term,
              id: `${currentId}.3`,
            });
          }
        }
        // Second choice program
        const secondProgram = this.programOfInterests.filter(
          (item) => item.priority === "2"
        );
        if (secondProgram.length > 0) {
          const program = generateProgramDetail(secondProgram[0], configStore);
          if (program) {
            currentId += 1;
            details.push({
              text: myProgramContent.degreePreviewLabels.second.title,
              value: program.title,
              id: `${currentId}.1`,
            });
            details.push({
              text: myProgramContent.degreePreviewLabels.second.location,
              value: program.location,
              id: `${currentId}.2`,
            });
            details.push({
              text: myProgramContent.degreePreviewLabels.second.term,
              value: program.term,
              id: `${currentId}.3`,
            });
          }
        }
        // RN to BSN Questions
        // Is Licensed
        const isLicensed = myProgramContent.rnToBsn.licensed.options.filter(
          (item) => item.value === this.myAsuProgramSar.rnToBsn.isLicensed
        );
        details.push({
          text: myProgramContent.rnToBsn.licensed.label,
          value: isLicensed.length > 0 ? isLicensed[0].text : null,
          id: `${++currentId}`,
        });
        // licensed state
        details.push({
          text: myProgramContent.rnToBsn.licensedState.label,
          value: configStore.selectedStatesLicensedtoPracticeRN
            ? configStore.selectedStatesLicensedtoPracticeRN.text
            : null,
          id: `${++currentId}`,
        });
        // RN license number
        details.push({
          text: myProgramContent.rnToBsn.rnLicensenumber.label,
          value: this.myAsuProgramSar.rnToBsn.license.number,
          id: `${++currentId}`,
        });
        // License expiration date
        details.push({
          text: myProgramContent.rnToBsn.expirationLabel,
          value: this.myAsuProgramSar.rnToBsn.license.expirationDate,
          id: `${++currentId}`,
        });
        // disciplinaryActionTaken
        const disciplinaryActionTaken =
          myProgramContent.rnToBsn.desciplinaryActions.options.filter(
            (item) =>
              item.value ===
              this.myAsuProgramSar.rnToBsn.license.disciplinaryActionTaken
          );
        details.push({
          text: myProgramContent.rnToBsn.desciplinaryActions.label,
          value:
            disciplinaryActionTaken.length > 0
              ? disciplinaryActionTaken[0].text
              : null,
          id: `${++currentId}`,
        });
        //dateScheduledForNclexrn
        details.push({
          text: myProgramContent.rnToBsn.dateScheduledForNclexrn.label,
          value: this.myAsuProgramSar.rnToBsn.dateScheduledForNclexrn,
          id: `${++currentId}`,
        });
        // Employer
        details.push({
          text: myProgramContent.rnToBsn.employer.label,
          value: this.myAsuProgramSar.rnToBsn.employer,
          id: `${++currentId}`,
        });
        // partner code
        details.push({
          text: myProgramContent.rnToBsn.partnerCode.previewLabel,
          value: this.myAsuProgramSar.rnToBsn.partnerCode,
          id: `${++currentId}`,
        });
        // releaseInfoToEmployer

        const releaseInfoToEmployer =
          myProgramContent.rnToBsn.releaseInfoToEmployer.options.filter(
            (item) =>
              item.value === this.myAsuProgramSar.rnToBsn.releaseInfoToEmployer
          );
        details.push({
          text: myProgramContent.rnToBsn.releaseInfoToEmployer.label,
          value:
            releaseInfoToEmployer.length > 0
              ? releaseInfoToEmployer[0].text
              : null,
          id: `${++currentId}`,
        });
        // communityColleges
        const communityColleges =
          myProgramContent.rnToBsn.communityCollege.options.filter(
            (item) =>
              item.value === this.myAsuProgramSar.rnToBsn.communityColleges
          );
        details.push({
          text: myProgramContent.rnToBsn.communityCollege.label,
          value:
            communityColleges.length > 0 ? communityColleges[0].text : null,
          id: `${++currentId}`,
        });

        // reverseTransferAggrement
        const reverseTransferAggrement =
          myProgramContent.rnToBsn.reverseTransferAgreement.options.filter(
            (item) =>
              item.value ===
              this.myAsuProgramSar.rnToBsn.reverseTransferAggrement
          );
        details.push({
          text: myProgramContent.rnToBsn.reverseTransferAgreement.label,
          value:
            reverseTransferAggrement.length > 0
              ? reverseTransferAggrement[0].text
              : null,
          id: `${++currentId}`,
        });
        //otherInterests
        myProgramContent.interestedInAnything.options.forEach(
          (element, index) => {
            currentId += 1;
            details.push({
              text: element.previewLabel,
              value:
                this.myAsuProgramSar.otherInterests[element.value] === "Y"
                  ? "Yes"
                  : "No",
              id: `${currentId}.${index + 1}`,
            });
          }
        );
        // END of my asu program data populating for review page
        // removing any null or empty values
        details = details.filter(
          (item) => item.value !== null || !_.isEmpty(item.value)
        );

        const groupedData = _.groupBy(details, (detail) => {
          return detail.id.split(".")[0];
        });

        return {
          title: EnumUndergradAppScreenLabels.PageUndergradMyProgram,
          data: groupedData,
          editCtaLink: EnumPageNames.PageUndergradMyProgram,
        };
      } catch (error) {
        console.error(error);
        return {};
      }
    },
    mySchoolsDetails() {
      try {
        const userStore = useUserStore();
        let details = [];
        let currentId = 0;
        // Graduated school
        details.push({
          text: mySchoolContent.previewLabels.schools.graduationSchoolTitle,
          value: " ",
          id: `${++currentId}`,
          type: "title",
        });
        const graduateSchool = this.highSchools.filter(
          (item) => item.gradMonth && item.gradYear
        );
        if (graduateSchool.length > 0) {
          const data = generateSchoolDetail(
            graduateSchool[0],
            userStore.names,
            monthOptions
          );
          currentId += 1;
          keys(data).forEach((key, index) => {
            details.push({
              text: mySchoolContent.previewLabels.schools[key],
              value: data[key],
              id: `${currentId}.${index + 1}`,
            });
          });
        }
        // other schools
        const otherSchools = this.highSchools.filter(
          (item) => !item.gradMonth && !item.gradYear
        );
        if (otherSchools.length > 0) {
          // title
          currentId += 1;
          details.push({
            text: mySchoolContent.previewLabels.schools.pastSchoolTitle,
            value: " ",
            id: `${currentId}`,
            type: "title",
          });

          otherSchools.forEach((school) => {
            currentId += 1;
            const data = generateSchoolDetail(
              school,
              userStore.names,
              monthOptions
            );
            keys(data).forEach((key, index) => {
              details.push({
                text: mySchoolContent.previewLabels.schools[key],
                value: data[key],
                id: `${currentId}.${index + 1}`,
              });
            });
          });
        }
        if (this.otherInstitutions.length > 0) {
          currentId += 1;
          details.push({
            text: mySchoolContent.previewLabels.otherInstitutions.title,
            value: " ",
            id: `${currentId}`,
            type: "title",
          });
        }
        // Colleges/universities
        this.otherInstitutions.forEach((institute) => {
          currentId += 1;
          const data = generateInstitutionDetail(
            institute,
            userStore.names,
            monthOptions,
            mySchoolContent.college.institution.degreeAwarded.options
          );
          keys(data).forEach((key, index) => {
            details.push({
              text: mySchoolContent.previewLabels.otherInstitutions[key],
              value: data[key],
              id: `${currentId}.${index + 1}`,
            });
          });
        });
        // semister Credits
        details.push({
          text: mySchoolContent.college.transferCreditGuide.title,
          value: this.mySchoolsSar.college.totelSemisterCredits,
          id: `${++currentId}`,
        });
        // iseligibleToReturnToColleges
        const iseligibleToReturnToColleges =
          mySchoolContent.college.attendedCollege.options.filter(
            (item) =>
              item.value === this.mySchoolsSar.iseligibleToReturnToColleges
          );
        details.push({
          text: mySchoolContent.eligibilityToReturn.text,
          value:
            iseligibleToReturnToColleges.length > 0
              ? iseligibleToReturnToColleges[0].text
              : null,
          id: `${++currentId}`,
        });
        // ineligible To return to college
        Object.keys(this.mySchoolsSar.ineligibleToReturnCollege).forEach(
          (key) => {
            currentId += 1;
            details.push({
              text: mySchoolContent.eligibilityToReturn[key].collegeLabel,
              value: this.mySchoolsSar.ineligibleToReturnCollege[key].name,
              id: `${currentId}.1`,
            });
            // academicRelated;
            details.push({
              text: mySchoolContent.eligibilityToReturn[key].reasons
                .academicRelated.label,
              value:
                this.mySchoolsSar.ineligibleToReturnCollege[key].reasons
                  .academicRelated,
              id: `${currentId}.3`,
            });
            // studentConduct
            details.push({
              text: mySchoolContent.eligibilityToReturn[key].reasons
                .studentConduct.label,
              value:
                this.mySchoolsSar.ineligibleToReturnCollege[key].reasons
                  .studentConduct,
              id: `${currentId}.4`,
            });
            // other
            details.push({
              text: mySchoolContent.eligibilityToReturn[key].reasons.other
                .label,
              value:
                this.mySchoolsSar.ineligibleToReturnCollege[key].reasons.other,
              id: `${currentId}.5`,
            });
            // explaination
            details.push({
              text: mySchoolContent.eligibilityToReturn[key].reasons
                .explainationLabel,
              value:
                this.mySchoolsSar.ineligibleToReturnCollege[key].reasons
                  .explaination,
              id: `${currentId}.6`,
            });
          }
        );
        // END of my schools data populating for review page
        // removing any null or empty values
        details = details.filter(
          (item) => item.value !== null || !_.isEmpty(item.value)
        );

        const groupedData = _.groupBy(details, (detail) => {
          return detail.id.split(".")[0];
        });
        return {
          title: EnumUndergradAppScreenLabels.PageUndergradMySchools,
          data: groupedData,
          editCtaLink: EnumPageNames.PageUndergradMySchools,
        };
      } catch (error) {
        console.error(error);
        return {};
      }
    },
    myHighSchoolGradesDetails() {
      try {
        const userStore = useUserStore();
        let isFutureGraduate = false;
        const highschool = this.highSchools.filter(
          (item) => item.gradYear && item.gradMonth
        );
        if (highschool.length > 0) {
          const currentDate = new Date();
          const month = parseInt(highschool[0].gradMonth);
          const year = parseInt(highschool[0].gradYear);
          if (
            (year > currentDate.getFullYear() ||
              (year === currentDate.getFullYear() &&
                month > currentDate.getMonth())) &&
            highschool[0].extOrgId !== "1100040290"
          ) {
            isFutureGraduate = true;
          }
        }

        const configStore = useConfigStore();
        let details = [];
        let currentId = 0;
        if (userStore.isValidVisaType || isFutureGraduate) {
          // self reported
          details.push({
            text: myHighSchoolGradesContent.previewLabels.selfReported,
            value: this.myHighSchoolGradesSar.gradePath,
            id: `${++currentId}`,
          });

          // Overall academics
          if (this.highSchoolAcademics) {
            // Unweighted GPA/Scale
            const scale = configStore.highSchoolGpaScales.filter(
              (item) => item.value === this.highSchoolAcademics.gpaScaleId
            );
            if (
              this.highSchoolAcademics.currentUnweightedGpa &&
              scale.length > 0
            ) {
              details.push({
                text: myHighSchoolGradesContent.previewLabels
                  .unweightedGpaAndScale,
                value: `${this.highSchoolAcademics.currentUnweightedGpa} / ${scale[0].text}`,
                id: `${++currentId}`,
              });
            }
            // Class rank and size
            details.push({
              text: myHighSchoolGradesContent.previewLabels.classRankSize,
              value:
                this.highSchoolAcademics.classRank &&
                this.highSchoolAcademics.classSize
                  ? `${this.highSchoolAcademics.classRank} / ${this.highSchoolAcademics.classSize}`
                  : null,
              id: `${++currentId}`,
            });
            //grading system
            const scaleType = configStore.highSchoolGradeScaleTypes.filter(
              (item) => item.id === this.highSchoolAcademics.gradingScaleId
            );
            details.push({
              text: myHighSchoolGradesContent.previewLabels.gradingSystem,
              value: scaleType.length > 0 ? scaleType[0].text : null,
              id: `${++currentId}`,
            });
          }
          // courseWorks
          if (this.highSchoolAcademics?.gradingScaleId) {
            configStore.highSchoolCourseSubjects.forEach((subject, index) => {
              currentId += 1;
              const courseWork = this.highSchoolCourseWorks.filter(
                (item) => item.subjectId === subject.id
              );
              let courses = "";
              courseWork.forEach((item, i) => {
                if (i > 0) {
                  courses = courses + "</br>";
                }
                if (item.courseTitleAlternateText) {
                  courses = courses + item.courseTitleAlternateText;
                } else {
                  const course = configStore.highSchoolCourses.filter(
                    (course) => course.value === item.courseId
                  );
                  courses = courses + course[0].text;
                }
              });
              details.push({
                text: subject.subjectName,
                value: courses,
                id: `${currentId + index + 1}`,
              });
            });
          }
        }
        // removing any null or empty values
        details = details.filter(
          (item) => item.value !== null || !_.isEmpty(item.value)
        );
        let groupedData = {};
        if (details.length > 0) {
          groupedData = _.groupBy(details, (detail) => {
            return detail.id.split(".")[0];
          });
        }
        return {
          title: EnumUndergradAppScreenLabels.PageUndergradMyHighSchoolGrades,
          data: groupedData,
          editCtaLink: EnumPageNames.PageUndergradMyHighSchoolGrades,
        };
      } catch (error) {
        console.error(error);
        return {};
      }
    },
    myArizonaResidencyDetails(state) {
      const userStore = useUserStore();
      // preparing the details
      try {
        let details = [];
        const configStore = useConfigStore();
        const questionMapping = prepareResidencyQuestionMapping(
          configStore.azResidency
        );
        if (userStore.isValidVisaType || this.isEligibleForProp308) {
          const psKeys = extractPsKeys();
          keys(crush(psKeys)).forEach((key) => {
            const value = get(state, key);
            const psKey = get(psKeys, key);
            const question = questionMapping[psKey];
            if (question && value) {
              details.push({
                text: question.text,
                value: isObject(value) ? value.text : value,
                id: question.questionId,
                psKey: psKey,
              });
            }
          });
        }
        // removing any null or empty values
        details = details.filter(
          (item) => item.value !== null || !_.isEmpty(item.value)
        );
        details = unique(details, (detail) => detail.text && detail.id);

        // updating the permanent home text if user is not eligible for Prop308
        const index = details.findIndex(
          (item) =>
            item.psKey ===
            arizonaResidencyContent.sectionDomicile.permanentHome.psKey
        );
        if (index !== -1) {
          details[index].text = this.isEligibleForProp308
            ? arizonaResidencyContent.sectionProp308.permanentHome.label
            : arizonaResidencyContent.sectionDomicile.permanentHome.label;
        }

        let groupedData = {};
        if (details.length > 0) {
          groupedData = _.groupBy(details, (detail) => {
            return detail.id.split(".")[0];
          });
        }
        return {
          title: EnumUndergradAppScreenLabels.PageUndergradArizonaResidency,
          data: groupedData,
          editCtaLink: EnumPageNames.PageUndergradArizonaResidency,
        };
      } catch (error) {
        console.error(error);
        return {};
      }
    },
  },
  actions: {
    // saving my info form
    async submitMyInformation(token, appId, form) {
      const formData = _.cloneDeep(form);
      const userStore = useUserStore();
      const configStore = useConfigStore();

      const response = await Promise.allSettled([
        this.submitFormerName(token, appId, formData.formerNames),
        this.submitHomeAddress(token, appId, formData.homeAddress),
        this.submitEthnicityAndRace(token, appId, configStore),
        this.submitParentsAndLegalGuardian(token, appId, formData.guardians),
        this.submitMilitaryAffiliations(
          token,
          appId,
          formData.usUniformedServices
        ),
        this.submitMyInfoSarQuestions(token, appId, formData, EnumSarCodes),
        this.submitUsCitizenshipAndMyInfoUserDetails(
          token,
          appId,
          formData,
          userStore,
          configStore
        ),
      ]);
      return response;
    },
    // Saving my asu programs form
    async submitMyAsuProgramForm(token, appId, form) {
      const formData = _.cloneDeep(form);

      const response = await Promise.allSettled([
        this.submitprograms(token, appId, formData.programsSelected),
        this.submitMyAsuProgramSarQuestions(
          token,
          appId,
          formData,
          EnumSarCodes
        ),
      ]);
      return response;
    },
    // saving my schools form
    async submitMySchools(token, appId, formData) {
      const response = await Promise.allSettled([
        this.submitHighSchools(token, appId, formData.schools),
        this.submitInstitutionStatus(
          token,
          appId,
          formData.college.attendedCollege
        ),
        this.submitInstitutions(token, appId, formData.college.institutions),
        this.submitMyschoolsSarQuestions(token, appId, formData, EnumSarCodes),
      ]);
      return response;
    },
    // my High school grades
    async submitMyHighSchoolGrades(token, appId, form) {
      const formData = _.cloneDeep(form);

      const response = await Promise.allSettled([
        this.submitHighSchoolSar(token, appId, formData, EnumSarCodes),
        this.submitHighSchoolAcademics(token, appId, formData.overallAcademics),
        this.submitHighSchoolCourseWorks(
          token,
          appId,
          formData.highSchoolCourses
        ),
      ]);
      return response;
    },
    // review
    async submitReviewForm(token, appId, form) {
      const formData = _.cloneDeep(form);
      const response = await Promise.allSettled([
        this.submitReviewSar(token, appId, formData, EnumSarCodes),
      ]);
      return response;
    },
    async submitForPaymentGateWayRedirectUrl(token, appId, form) {
      const response = await ugPaymentApi.createPaymentGatewayRedirect(
        token,
        appId,
        form
      );
      return response;
    },
    async authorizePaymentGateWayRedirection(token, appId, form) {
      const response = await ugPaymentApi.authorizePayment(token, appId, form);
      return response;
    },

    async getApplicationPaymentInfo(token, appId) {
      try {
        const { data } = await ugPaymentApi.fetchApplicationPayment(
          token,
          appId
        );
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // Submit sar questions
    async submitSarResponse(token, appId, state, formData, EnumSarCodes) {
      const sarFormatterAnswers = generateFormattedSarAnswers(
        state,
        formData,
        EnumSarCodes
      );
      let responses = await Promise.all(
        sarFormatterAnswers.map(async (element) => {
          let response = null;
          switch (element.httpRequest) {
            case "post":
              response = await this.addApplicationSarQuestionResponses(
                token,
                appId,
                element.code,
                element.payload
              );

              break;
            case "patch":
              response = await this.patchApplicationSarQuestionResponses(
                token,
                appId,
                element.code,
                element.payload
              );

              break;
            case "delete":
              response = await this.removeApplicationSarQuestionResponses(
                token,
                appId,
                element.code
              );
          }
          response.element = element;
          return response;
        })
      );
      return responses;
    },

    // application
    populateApplicationId(appId) {
      this.appId = appId;
    },
    async populateUsStates() {
      try {
        const { data } = await asuDplApi.fetchCountryDetail(
          EnumNameTypes.UsCountryCode
        );
        this.allUsStates = data.states.map((item) => {
          return {
            value: item.stateCode,
            text: item.description,
          };
        });
        // add Outside the U.S. or Not Listed key value to the top of the array
        this.allUsStates.unshift({
          value: EnumAzResidency.OutsideUsOption,
          text: EnumAzResidency.OutsideUsOption,
        });
        return data;
      } catch (error) {
        return {
          code: error.response.status,
          errors: [error.response.data.error],
        };
      }
    },
    async getApplication(token, applicationId) {
      try {
        const { data } = await ugApplicationApi.fetchApplication(
          token,
          applicationId
        );
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async createApplication(token, userInfo, name) {
      try {
        const { data } = await ugApplicationApi.createApplication(
          token,
          userInfo,
          name
        );

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async updateApplication() {},
    async submitApplication(token, applicationId, payload) {
      try {
        const { data } = await ugApplicationApi.submitFinalApplication(
          token,
          applicationId,
          payload
        );
        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    async createNotification(token, applicationId, endpointEnum, payloadData) {
      try {
        const { data } = await ugApplicationApi.createNotification(
          token,
          applicationId,
          endpointEnum,
          payloadData
        );

        return data;
      } catch (error) {
        return error.response?.data;
      }
    },

    // Visa Supplementals
    async populateApplicationVisaSupplementals(token, applicationId) {
      try {
        const { data } =
          await ugVisasupplementalsApi.fetchApplicationVisaSupplementals(
            token,
            applicationId
          );

        if (data.code === 201) {
          this.visaSupplementals = data.data;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addApplicationVisaSupplementals(token, applicationId, body) {
      try {
        const { data } =
          await ugVisasupplementalsApi.createApplicationVisaSupplementals(
            token,
            applicationId,
            body
          );
        if (data.code === 201) {
          this.visaSupplementals = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async removeApplicationVisaSupplementals(token, applicationId) {
      try {
        const { data } =
          await ugVisasupplementalsApi.deleteApplicationVisaSupplementals(
            token,
            applicationId
          );
        if (data.code === 200) {
          this.visaSupplementals = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    //former name
    async populateApplicationFormerNames(token, applicationId) {
      try {
        const { data } = await ugNameApi.fetchAllApplicationName(
          token,
          applicationId
        );

        if (data.code === 200) {
          this.formerNames = data.data.filter(
            (name) => name.nameType === "former"
          );
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addApplicationFormerName(token, applicationId, body) {
      try {
        const { data } = await ugNameApi.createApplicationName(
          token,
          applicationId,
          body
        );
        if (data.code === 201) {
          this.formerNames = data.data.filter(
            (item) => item.nameType === "former"
          );
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async patchApplicationFormerName(token, applicationId, body, nameId) {
      try {
        const { data } = await ugNameApi.updateApplicationName(
          token,
          applicationId,
          nameId,
          body
        );
        if (data.code === 200) {
          const index = this.formerNames.findIndex(
            (name) => name.id === nameId
          );
          if (index >= 0) {
            this.formerNames[index] = data.data;
          }
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async removeApplicationFormerName(token, applicationId, nameId) {
      try {
        const { data } = await ugNameApi.deleteApplicationName(
          token,
          applicationId,
          nameId
        );
        if (data.code === 200) {
          this.formerNames = this.formerNames.filter(
            (name) => name.id !== nameId
          );
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    // addresses
    async populateApplicationAddresses(token, appId) {
      try {
        const { data } = await ugAddressesApi.fetchAllApplicationAddress(
          token,
          appId
        );
        if (data.code === 200) {
          this.addresses = data.data;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addApplicationAddress(token, appId, address) {
      try {
        const { data } = await ugAddressesApi.createApplicationAddress(
          token,
          appId,
          address
        );
        if (data.code === 201) {
          this.addresses.push(data.data);
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async patchApplicationAddress(token, appId, address, addressId) {
      try {
        const { data } = await ugAddressesApi.updateApplicationAddress(
          token,
          appId,
          addressId,
          address
        );
        if (data.code === 200) {
          const index = this.addresses.findIndex(
            (address) => address.addressId === addressId
          );
          if (index >= 0) {
            this.addresses[index] = data.data;
          }
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async removeApplicationAddress(token, appId, addressId) {
      try {
        const response = await ugAddressesApi.deleteApplicationAddress(
          token,
          appId,
          addressId
        );
        if (response.status === 200) {
          this.addresses = this.addresses.filter(
            (address) => address.addressId !== addressId
          );
        }
        return { code: response.status, data: this.addresses };
      } catch (error) {
        return error.response.data;
      }
    },
    //ethnicities
    async populateEthnicities(token, appId) {
      try {
        const { data } = await ugEthnicities.fetchAllApplicationEthnicity(
          token,
          appId
        );
        if (data.code === 200) {
          this.ethnicities = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addApplicationEthnicity(token, appId, payload) {
      try {
        const { data } = await ugEthnicities.createApplicationEthnicity(
          token,
          appId,
          payload
        );
        if (data.code === 201) {
          this.ethnicities = [...this.ethnicities, data.data];
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async removeApplicationEthnicity(token, appId, ethnicGroupCode) {
      try {
        const { data } = await ugEthnicities.deleteApplicationEthnicity(
          token,
          appId,
          ethnicGroupCode
        );
        if (data.code === 200) {
          this.ethnicities = this.ethnicities.filter(
            (ele) => ele.ethnicGroupCode !== ethnicGroupCode
          );
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // guardians
    async populateApplicationGuardians(token, appId) {
      try {
        const { data } = await ugGuardianApi.fetchAllApplicationGuardian(
          token,
          appId
        );

        if (data.code === 200) {
          this.guardians = data.data;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addApplicationGuardian(token, appId, payload) {
      try {
        const { data } = await ugGuardianApi.createApplicationGuardian(
          token,
          appId,
          payload
        );
        if (data.code === 201) {
          this.guardians.push(data.data);
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async patchApplicationGuardian(token, appId, payload, guardianId) {
      try {
        const { data } = await ugGuardianApi.updateApplicationGuardian(
          token,
          appId,
          guardianId,
          payload
        );
        if (data.code === 200) {
          const guardianIndex = this.guardians.findIndex(
            (ele) => ele.guardianId === guardianId
          );
          this.guardians[guardianIndex] = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async removeApplicationGuardian(token, appId, guardianId) {
      try {
        const { data } = await ugGuardianApi.deleteApplicationGuardian(
          token,
          appId,
          guardianId
        );
        if (data.code === 200) {
          this.guardians = this.guardians.filter(
            (ele) => ele.guardianId !== guardianId
          );
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    //otherInstitutions
    async populateApplicationOtherInstitutions(token, appId) {
      try {
        const { data } =
          await ugOtherinstitutionApi.fetchAllApplicationOtherInstitution(
            token,
            appId
          );
        if (data.code === 200) {
          // TODO: remove this and directly assign the value once the api is fixed
          this.otherInstitutions = data.data.map((item) => {
            return {
              otherInstitutionId: item.otherInstitutionId,
              extOrgId: item.instExtOrgID,
              name: item.instName,
              countryCode: item.instCountry,
              stateProvince: item.instState,
              city: item.instCity,
              degreeCode: item.instDegree,
              concentration: item.instConcentration,
              firstAttendedMonth: item.instFirstAttendedMonth,
              firstAttendedYear: item.instFirstAttendedYear,
              lastAttendedMonth: item.instLastAttendedMonth,
              lastAttendedYear: item.instLastAttendedYear,
              transcriptNameId: item.transcriptNameId,
            };
          });
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addApplicationOtherInstitution(token, appId, payload) {
      try {
        const { data } =
          await ugOtherinstitutionApi.createApplicationOtherInstitution(
            token,
            appId,
            payload
          );
        if (data.code === 201) {
          // TODO: remove this and directly assign the value once the api is fixed
          this.otherInstitutions = data.data.map((item) => {
            return {
              otherInstitutionId: item.otherInstitutionId,
              extOrgId: item.instExtOrgID,
              name: item.instName,
              countryCode: item.instCountry,
              stateProvince: item.instState,
              city: item.instCity,
              degreeCode: item.instDegree,
              concentration: item.instConcentration,
              firstAttendedMonth: item.instFirstAttendedMonth,
              firstAttendedYear: item.instFirstAttendedYear,
              lastAttendedMonth: item.instLastAttendedMonth,
              lastAttendedYear: item.instLastAttendedYear,
              transcriptNameId: item.transcriptNameId,
            };
          });
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async patchApplicationOtherInstitution(
      token,
      appId,
      payload,
      otherInstitutionId
    ) {
      try {
        const { data } =
          await ugOtherinstitutionApi.updateApplicationOtherInstitution(
            token,
            appId,
            payload,
            otherInstitutionId
          );
        if (data.code === 200) {
          const index = this.otherInstitutions.findIndex(
            (item) => item.otherInstitutionId === otherInstitutionId
          );
          // TODO: remove this and directly assign the value once the api is fixed
          if (index >= 0) {
            this.otherInstitutions[index] = {
              ...payload,
              otherInstitutionId: otherInstitutionId,
            };
          }
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async removeApplicationOtherInstitution(token, appId, otherInstitutionId) {
      try {
        const { data } =
          await ugOtherinstitutionApi.deleteApplicationOtherInstitution(
            token,
            appId,
            otherInstitutionId
          );
        if (data.code === 200) {
          this.otherInstitutions = this.otherInstitutions.filter(
            (item) => item.otherInstitutionId !== otherInstitutionId
          );
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // payments
    async getApplicationPayment() {},
    async addApplicationPayment(token, appId, payload) {
      try {
        const response = await ugPaymentApi.createApplicationPayment(
          token,
          appId,
          payload
        );
        return response;
      } catch (error) {
        return error.response.data;
      }
    },
    // programOfInterests
    async populateApplicationProgramOfInterests(token, appId) {
      try {
        const { data } =
          await ugProgramofinterestsApi.fetchAllApplicationProgramOfInterest(
            token,
            appId
          );

        if (data.code === 200) {
          this.programOfInterests = data.data;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addApplicationProgramOfInterest(token, appId, payload) {
      try {
        const { data } =
          await ugProgramofinterestsApi.createApplicationProgramOfInterest(
            token,
            appId,
            payload
          );
        if (data.code === 201) {
          this.programOfInterests.push(data.data);
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async removeApplicationProgramOfInterest(token, appId, priority) {
      try {
        const { data } =
          await ugProgramofinterestsApi.deleteApplicationProgramOfInterest(
            token,
            appId,
            priority
          );
        if (data.code === 200) {
          this.programOfInterests = this.programOfInterests.filter(
            (item) => item.priority !== priority
          );
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // sarQuestionResponses
    async populateSarQuestionsResponses(token, appId) {
      try {
        const { data } = await ugSarApi.fetchAllApplicationSarQuestionResponse(
          token,
          appId
        );
        if (data.code === 200) {
          this.sarAnswers = data.data;

          const keys = Object.keys(EnumSarCodes);
          // Fetching each page sar questions code from enum
          keys.forEach(async (key) => {
            const sarCodeObject = crush(EnumSarCodes[key]);
            Object.keys(sarCodeObject).map(async (element) => {
              const index = data.data.findIndex(
                (item) => item.name === sarCodeObject[element]
              );
              _.set(
                this[key],
                element,
                index >= 0 ? data.data[index].answer : null
              );
            });
          });
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async getApplicationSarQuestionResponses() {},
    async addApplicationSarQuestionResponses(
      token,
      appId,
      questionCode,
      payload
    ) {
      try {
        const { data } = await ugSarApi.createApplicationSarQuestionResponse(
          token,
          appId,
          questionCode,
          payload
        );
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async patchApplicationSarQuestionResponses(
      token,
      appId,
      questionCode,
      payload
    ) {
      try {
        const { data } = await ugSarApi.updateApplicationSarQuestionResponse(
          token,
          appId,
          questionCode,
          payload
        );
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async removeApplicationSarQuestionResponses(token, appId, questionCode) {
      try {
        const { data } = await ugSarApi.deleteApplicationSarQuestionResponse(
          token,
          appId,
          questionCode
        );
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // waivers
    async populateApplicationWaivers(token, appId) {
      try {
        const { data } = await ugWaiversApi.fetchAllApplicationWaivers(
          token,
          appId
        );

        if (data.code === 200) {
          this.waiver = data.data.hasWaiver;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // fee amount
    async populateApplicationFee(token, appId) {
      try {
        const { data } = await ugFeesApi.getApplicationFee(token, appId);

        if (data.code === 200) {
          this.feeAmount = data.data.fee;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // validate
    async validateApplication() {},
    // highSchools
    async populateApplicationHighSchools(token, appId) {
      try {
        const { data } = await ugHighschoolApi.fetchAllApplicationHighSchool(
          token,
          appId
        );
        if (data.code === 200) {
          this.highSchools = data.data;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addApplicationHighSchool(token, appId, payload) {
      try {
        const { data } = await ugHighschoolApi.createApplicationHighSchool(
          token,
          appId,
          payload
        );
        if (data.code === 201) {
          this.highSchools = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async patchApplicationHighSchool(token, appId, payload, highSchoolId) {
      try {
        const { data } = await ugHighschoolApi.updateApplicationHighSchool(
          token,
          appId,
          payload,
          highSchoolId
        );
        if (data.code === 200) {
          const index = this.highSchools.findIndex(
            (school) => school.highSchoolId === highSchoolId
          );
          this.highSchools[index] = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async removeApplicationHighSchool(token, appId, highSchoolId) {
      try {
        const { data } = await ugHighschoolApi.deleteApplicationHighSchool(
          token,
          appId,
          highSchoolId
        );
        if (data.code === 200) {
          this.highSchools = this.highSchools.filter(
            (item) => item.highSchoolId !== highSchoolId
          );
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // highSchoolCourseWorks
    async populateApplicationHighSchoolCourseWorks(token, appId) {
      try {
        const { data } =
          await ugHighschoolApi.fetchAllApplicationHighSchoolCourseWork(
            token,
            appId
          );
        if (data.code === 200) {
          this.highSchoolCourseWorks = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addApplicationHighSchoolCourseWorks(token, appId, payload) {
      try {
        const { data } =
          await ugHighschoolApi.createApplicationHighSchoolCourseWork(
            token,
            appId,
            payload
          );
        if (data.code === 201) {
          this.highSchoolCourseWorks = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async patchApplicationHighSchoolCourseWorks(
      token,
      appId,
      payload,
      courseWorkId
    ) {
      try {
        const { data } =
          await ugHighschoolApi.updateApplicationHighSchoolCourseWork(
            token,
            appId,
            payload,
            courseWorkId
          );
        if (data.code === 200) {
          const index = this.highSchoolCourseWorks.findIndex(
            (item) => item.highSchoolCourseworkId === courseWorkId
          );
          this.highSchoolCourseWorks[index] = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async removeApplicationHighSchoolCourseWorks(token, appId, courseWorkId) {
      try {
        const { data } =
          await ugHighschoolApi.deleteApplicationHighSchoolCourseWork(
            token,
            appId,
            courseWorkId
          );
        if (data.code === 200) {
          this.highSchoolCourseWorks = this.highSchoolCourseWorks.filter(
            (item) => item.highSchoolCourseworkId !== courseWorkId
          );
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // highSchoolAcademics
    async populateApplicationHighSchoolAcademics(token, appId) {
      try {
        const graduateSchool = this.highSchools.filter(
          (item) => item.gradMonth && item.gradYear
        );
        if (graduateSchool.length > 0) {
          const { data } =
            await ugHighschoolApi.fetchAllApplicationHighSchoolAcademics(
              token,
              appId
            );
          if (data.code === 200) {
            this.highSchoolAcademics = data.data;
          }
          return data;
        } else {
          return { code: 200 };
        }
      } catch (error) {
        return error.response.data;
      }
    },
    async addApplicationHighSchoolAcademics(token, appId, payload) {
      try {
        const { data } =
          await ugHighschoolApi.createApplicationHighSchoolAcademics(
            token,
            appId,
            payload
          );
        if (data.code === 201) {
          this.highSchoolAcademics = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async deleteApplicationHighSchoolAcademics(token, appId) {
      try {
        const { data } =
          await ugHighschoolApi.deleteApplicationHighSchoolAcademics(
            token,
            appId
          );
        if (data.code === 200) {
          this.highSchoolAcademics = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // Militaryaffiliations
    async populateApplicationMilitaryAffiliations(token, appId) {
      try {
        const { data } =
          await ugMilitaryaffiliationsApi.fetchApplicationMilitaryAffiliations(
            token,
            appId
          );
        if (data.code === 200) {
          this.militaryaffiliations = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addApplicationMilitaryAffiliations(token, appId, payload) {
      try {
        const { data } =
          await ugMilitaryaffiliationsApi.createApplicationMilitaryAffiliations(
            token,
            appId,
            payload
          );
        if (data.code === 201) {
          this.militaryaffiliations = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // push
    async pushToEdPlusSalesforce() {},
    // sources
    async getApplicationSources() {},
    // uiViewInfo
    async populateUiViewInfo(token, applicationId) {
      try {
        const { data } = await ugUiviewApi.fetchApplicationViewInfo(
          token,
          applicationId
        );

        this.uiViewInfo.previousScreen = data.data?.previousScreen;
        this.uiViewInfo.currentScreen = data.data?.currentScreen;

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addUiViewInfo(token, applicationId, previousScreen, currentScreen) {
      try {
        const { data } = await ugUiviewApi.createApplicationViewInfo(
          token,
          applicationId,
          previousScreen,
          currentScreen
        );

        this.uiViewInfo.previousScreen = data.data.previousScreen;
        this.uiViewInfo.currentScreen = data.data.currentScreen;

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async patchUiViewInfo(token, applicationId, payloadData) {
      try {
        const userStore = useUserStore();
        const appStore = useAppStore();
        // if userType is self or application is submitted updating the view info in DB
        if (
          userStore.userType === EnumNameTypes.UserTypeSelf ||
          appStore.isUndergradApplicationSubmitted
        ) {
          const { data } = await ugUiviewApi.updateApplicationViewInfo(
            token,
            applicationId,
            payloadData
          );

          this.uiViewInfo.previousScreen = data.data?.previousScreen;
          this.uiViewInfo.currentScreen = data.data?.currentScreen;

          return data;
        } else {
          // if usertype is admin and application is not submitted updating the adminUiViewInfo
          this.adminUiViewInfo.previousScreen = payloadData.previousScreen;
          this.adminUiViewInfo.currentScreen = payloadData.currentScreen;
          return {
            code: 201,
            data: payloadData,
          };
        }
      } catch (error) {
        return error.response?.data;
      }
    },
    updateCurrentPageUnsavedChanges(value) {
      this.isCurrentPageHasUnsavedChanges = value;
    },
    updateCurrentPageStatus(value) {
      this.currentPageStatus = value;
    },
    updateRedirectRouteName(name) {
      this.redirectRouteName = name;
    },
    // residencyAnswers
    async populateApplicationResidencyAnswers(token, appId) {
      try {
        const { data } =
          await ugResidencyApi.fetchApplicationArizonaResidencyAnswers(
            token,
            appId
          );
        this.residencyAnswers = data.data;

        const psKeyMap = extractPsKeys();

        await Promise.allSettled([
          this.populateSectionDomicile(psKeyMap.sectionDomicile),
          this.populateSectionEnrollment(psKeyMap.sectionEnrollment),
          this.populateSectionDependent(psKeyMap.sectionDependent),
          this.populateSectionDriverLicense(psKeyMap.sectionDriverLicense),
          this.populateSectionVehicle(psKeyMap.sectionVehicle),
          this.populateSectionTax(psKeyMap.sectionTax),
          this.populateFinancialSupport(psKeyMap.sectionFinancialSupport),
          this.populateSectionEmployment(psKeyMap.sectionEmployment),
          this.populateSectionMilitaryActiveDuty(
            psKeyMap.sectionMilitaryActiveDuty
          ),
          this.populateSectionVeteran(psKeyMap.sectionVeteran),
          this.populateSectionVote(psKeyMap.sectionVote),
          this.populateSectionMilitaryDependency(
            psKeyMap.sectionMilitaryDependency
          ),
          this.populateSectionNativeAmerican(psKeyMap.sectionNativeAmerican),
          this.populateSectionLegalGuardian(psKeyMap.sectionLegalGuardian),
          this.populateSectionMarried(psKeyMap.sectionMarried),
          this.populateSectionProp308(psKeyMap.sectionProp308),
        ]);
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addApplicationResidencyAnswers({ token, appId, formData }) {
      const filteredObject = { ...formData };
      // remove empty values and values less than zero from financial support section
      if (formData.sectionFinancialSupport) {
        const filteredFinancialSupport = {};
        for (const [key, value] of Object.entries(
          formData.sectionFinancialSupport
        )) {
          if (isNaN(value) && value !== undefined && value !== null) {
            filteredFinancialSupport[key] = value;
          }
          if (!isNaN(value) && Number(value) > 0) {
            filteredFinancialSupport[key] = value;
          }
        }
        filteredObject.sectionFinancialSupport = filteredFinancialSupport;
      }
      try {
        const convertedData = [];
        const prepareKeyMappings = extractPsKeys();
        for (const [key, value] of Object.entries(filteredObject)) {
          if (value) {
            Object.keys(value).map((item) => {
              convertedData.push({
                key: prepareKeyMappings[key][item],
                answer: value[item]?.value || value[item],
              });
            });
          }
        }
        // remove duplicate keys
        const uniqueKeys = [
          ...new Set(convertedData.map((item) => item.key)),
        ].map((key) => {
          return convertedData.find((item) => item.key === key);
        });
        // remove values form financial support section if user has any value less than 0

        this.azResidencyPayload = formData;
        const { data } = await ugResidencyApi.saveArizonaResidencyAnswers(
          token,
          appId,
          JSON.stringify(uniqueKeys)
        );
        if (data.code === 201) {
          // this.residencyAnswers = data.data;
          // POST response data is not same as GET responce data so currently updating the store variable by calling the populate action.
          // TODO: uncomment the above line and remove the below line once the api is fixed.
          await this.populateApplicationResidencyAnswers(token, appId);
          return data;
        }
      } catch (error) {
        return error.response?.data;
      }
    },
    async deleteApplicationResidencyAnswers(token, appId) {
      try {
        const { data } = await ugResidencyApi.deleteArizonaResidencyAnswers(
          token,
          appId
        );
        if (data.code === 200) {
          this.residencyAnswers = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    populateSectionDomicile(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionDomicile = {
        permanentHome: findState(apiResp.permanentHome, this.allUsStates),
        isAzResident12m: findContentOptions(
          "sectionDomicile",
          "isAzResident12m",
          apiResp.isAzResident12m
        ),
        dateMovedToAz: apiResp.dateMovedToAz ?? null,
      };
    },
    populateSectionEnrollment(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionEnrollment = {
        isEnrolledInAnotherUni: findContentOptions(
          "sectionEnrollment",
          "isEnrolledInAnotherUni",
          apiResp.isEnrolledInAnotherUni
        ),
        inputEnrolledLocation: apiResp.inputEnrolledLocation ?? null,
        selectStateEnrolled: findState(
          apiResp.selectStateEnrolled,
          this.allUsStates
        ),
        isEnrollAZedCurrentOrLastYear: findContentOptions(
          "sectionEnrollment",
          "isEnrollAZedCurrentOrLastYear",
          apiResp.isEnrollAZedCurrentOrLastYear
        ),
      };
    },
    populateSectionDependent(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionDependent = {
        isTaxClaimedAsDependent: findContentOptions(
          "sectionDependent",
          "isTaxClaimedAsDependent",
          apiResp.isTaxClaimedAsDependent
        ),
      };
    },
    populateSectionDriverLicense(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionDriverLicense = {
        isHavingLicense: findContentOptions(
          "sectionDriverLicense",
          "isHavingLicense",
          apiResp.isHavingLicense
        ),
        selectStateLicenseIssued: findState(
          apiResp.selectStateLicenseIssued,
          this.allUsStates
        ),
        dateLicenseIssued: apiResp.dateLicenseIssued ?? null,
      };
    },
    populateSectionVehicle(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionVehicle = {
        isOwnsVehicle: findContentOptions(
          "sectionVehicle",
          "isOwnsVehicle",
          apiResp.isOwnsVehicle
        ),
        isVehicleRegisteredInAZ: findContentOptions(
          "sectionVehicle",
          "isVehicleRegisteredInAZ",
          apiResp.isVehicleRegisteredInAZ
        ),
        dateVehicleRegistered: apiResp.dateVehicleRegistered ?? null,
      };
    },
    populateSectionTax(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionTax = {
        isFiledTaxLastYear: findContentOptions(
          "sectionTax",
          "isFiledTaxLastYear",
          apiResp.isFiledTaxLastYear
        ),
        selectStateFiledTax: findState(
          apiResp.selectStateFiledTax,
          this.allUsStates
        ),
      };
    },
    populateFinancialSupport(psMapping) {
      const invertedEnum = invert(psMapping);
      const apiResp = {};
      this.residencyAnswers.forEach((answer) => {
        const key = invertedEnum[answer.key];
        if (key) {
          apiResp[key] = answer.answer;
        }
      });
      this.sectionFinancialSupport = apiResp ?? {};
    },
    populateSectionEmployment(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionEmployment = {
        isEmployed: findContentOptions(
          "sectionEmployment",
          "isEmployed",
          apiResp.isEmployed
        ),
        selectStateEmployed: findState(
          apiResp.selectStateEmployed,
          this.allUsStates
        ),
        dateEmployed: apiResp.dateEmployed ?? null,
        isEmployedInLast12m: findContentOptions(
          "sectionEmployment",
          "isEmployedInLast12m",
          apiResp.isEmployedInLast12m
        ),
        selectStateEmployedLast12m: findState(
          apiResp.selectStateEmployedLast12m,
          this.allUsStates
        ),
      };
    },
    populateSectionMilitaryActiveDuty(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionMilitaryActiveDuty = {
        selectStateStationed: findState(
          apiResp.selectStateStationed,
          this.allUsStates
        ),
        selectStateOfLegalResidence: findState(
          apiResp.selectStateOfLegalResidence,
          this.allUsStates
        ),
      };
    },
    populateSectionVeteran(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionVeteran = {
        selectService: findContentOptions(
          "sectionVeteran",
          "selectService",
          apiResp.selectService
        ),
        isEligibleFor30or33ChapterBenefits: findContentOptions(
          "sectionVeteran",
          "isEligibleFor30or33ChapterBenefits",
          apiResp.isEligibleFor30or33ChapterBenefits
        ),
        dateOfRetirement: apiResp.dateOfRetirement ?? null,
      };
    },
    populateSectionVote(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionVote = {
        isRegisteredToVote: findContentOptions(
          "sectionVote",
          "isRegisteredToVote",
          apiResp.isRegisteredToVote
        ),
        selectStateRegisteredToVote: findState(
          apiResp.selectStateRegisteredToVote,
          this.allUsStates
        ),
      };
    },
    populateSectionMilitaryDependency(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionMilitaryDependency = {
        selectSectorOfMilitary: findContentOptions(
          "sectionMilitaryDependency",
          "selectSectorOfMilitary",
          apiResp.selectSectorOfMilitary
        ),
        selectStateGuardianStationed: findState(
          apiResp.selectStateGuardianStationed,
          this.allUsStates
        ),
        selectStateGuardianLegalResidence: findState(
          apiResp.selectStateGuardianLegalResidence,
          this.allUsStates
        ),
        dateGuardianRetired: apiResp.dateGuardianRetired ?? null,
        isEligibleFor30or33ChapterBenefits: findContentOptions(
          "sectionMilitaryDependency",
          "isEligibleFor30or33ChapterBenefits",
          apiResp.isEligibleFor30or33ChapterBenefits
        ),
      };
    },
    populateSectionNativeAmerican(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionNativeAmerican = {
        isNativeAmerican: findContentOptions(
          "sectionNativeAmerican",
          "isNativeAmerican",
          apiResp.isNativeAmerican
        ),
      };
    },
    populateSectionLegalGuardian(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionLegalGuardian = {
        stateParentLives: findState(apiResp.stateParentLives, this.allUsStates),
        selectParentRelationship: findContentOptions(
          "sectionLegalGuardian",
          "selectParentRelationship",
          apiResp.selectParentRelationship
        ),
        dateParentMovedToAz: apiResp.dateParentMovedToAz ?? null,
        isParentFiledTaxLastYear: findContentOptions(
          "sectionLegalGuardian",
          "isParentFiledTaxLastYear",
          apiResp.isParentFiledTaxLastYear
        ),
        selectStateParentFiledTax: findState(
          apiResp.selectStateParentFiledTax,
          this.allUsStates
        ),
        isParentHavingLicenseInAz: findContentOptions(
          "sectionLegalGuardian",
          "isParentHavingLicenseInAz",
          apiResp.isParentHavingLicenseInAz
        ),
        isParentEmployedInAz: findContentOptions(
          "sectionLegalGuardian",
          "isParentEmployedInAz",
          apiResp.isParentEmployedInAz
        ),
      };
    },
    populateSectionMarried(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionMarried = {
        isMarried: findContentOptions(
          "sectionMarried",
          "isMarried",
          apiResp.isMarried
        ),
        selectStateSpouseLives: findState(
          apiResp.selectStateSpouseLives,
          this.allUsStates
        ),
        dateSpouseMovedToAz: apiResp.dateSpouseMovedToAz ?? null,
        isSpouseHavingValidId: findContentOptions(
          "sectionMarried",
          "isSpouseHavingValidId",
          apiResp.isSpouseHavingValidId
        ),
        selectStateValidIdIssued: findState(
          apiResp.selectStateValidIdIssued,
          this.allUsStates
        ),
        dateSpouseObtainedId: apiResp.dateSpouseObtainedId ?? null,
        isSpouseEmployed: findContentOptions(
          "sectionMarried",
          "isSpouseEmployed",
          apiResp.isSpouseEmployed
        ),
        selectStateSpouseEmployed: findState(
          apiResp.selectStateSpouseEmployed,
          this.allUsStates
        ),
        dateSpouseEmploymentStarted:
          apiResp.dateSpouseEmploymentStarted ?? null,
        isSpouseEmployedInAnyUni: findContentOptions(
          "sectionMarried",
          "isSpouseEmployedInAnyUni",
          apiResp.isSpouseEmployedInAnyUni
        ),
        isSpouseDependent: findContentOptions(
          "sectionMarried",
          "isSpouseDependent",
          apiResp.isSpouseDependent
        ),
        isSpouseFileTax: findContentOptions(
          "sectionMarried",
          "isSpouseFileTax",
          apiResp.isSpouseFileTax
        ),
        selectStateSpouseFiledTax: findState(
          apiResp.selectStateSpouseFiledTax,
          this.allUsStates
        ),
      };
    },
    populateSectionProp308(psMapping) {
      const apiResp = getAnswersFromApi(psMapping, this.residencyAnswers);
      this.sectionProp308 = {
        permanentHome: findState(apiResp.permanentHome, this.allUsStates),
        isGraduateFromAZPublicSchool: findContentOptions(
          "sectionProp308",
          "isGraduateFromAZPublicSchool",
          apiResp.isGraduateFromAZPublicSchool
        ),
        isAttendAZPublicSchool: findContentOptions(
          "sectionProp308",
          "isAttendAZPublicSchool",
          apiResp.isAttendAZPublicSchool
        ),
      };
    },

    populateInstitutionStatus(value) {
      this.institutionStatus = value;
    },
    async updateInstitutionStatus(token, appId, value) {
      try {
        const { data } = await ugApplicationApi.updateApplication(
          token,
          appId,
          {
            instStatus: value,
          }
        );
        if (data.code === 200) {
          this.institutionStatus = value;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // My information page section vise form submission
    // Former Name
    async submitFormerName(token, appId, formerNames) {
      // former name
      const editOrDeleteNames = formerNames.filter(
        (item) => item.type && item.type !== "new"
      );
      let responses = await Promise.all(
        editOrDeleteNames.map(async (name) => {
          const body = {
            firstName: name.firstName,
            lastName: name.lastName,
            nameType: "former",
          };
          let response = { code: 200 };
          switch (name.type) {
            case "update":
              response = await this.patchApplicationFormerName(
                token,
                appId,
                body,
                name.id
              );
              break;
            case "delete":
              response = await this.removeApplicationFormerName(
                token,
                appId,
                name.id
              );
          }
          return response;
        })
      );
      const postPayload = [];
      formerNames.forEach((name) => {
        if (name.type && name.type === "new") {
          postPayload.push({
            firstName: name.firstName,
            lastName: name.lastName,
            nameType: "former",
          });
        }
      });
      if (postPayload.length > 0) {
        const response = await this.addApplicationFormerName(
          token,
          appId,
          postPayload
        );
        responses.push(response);
      }
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );

      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "Former or alternate name.",
        };
      } else {
        const updatedData = _.cloneDeep(this.formerNames);
        this.formerNames = updatedData;
        return {
          code: 200,
          message: "success",
          section: "Former or alternate name.",
        };
      }
    },
    // Home address
    async submitHomeAddress(token, appId, homeAddress) {
      let responses = [];
      // Address
      const address = generateFormattedAddress(homeAddress);
      const permanentAddress = this.addresses.filter(
        (address) => address.type === "PERMANENT"
      );
      if (
        permanentAddress.length > 0 &&
        !_.isEqual(permanentAddress[0], address)
      ) {
        // deleting the id before calling the patch call
        delete address.addressId;
        const response = await this.patchApplicationAddress(
          token,
          appId,
          address,
          permanentAddress[0].addressId
        );
        responses.push(response);
      } else if (permanentAddress.length === 0) {
        const response = await this.addApplicationAddress(
          token,
          appId,
          address
        );
        responses.push(response);
      }
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "Home address",
        };
      } else {
        return {
          code: 200,
          message: "success",
          section: "Home address",
        };
      }
    },
    // Ethnicity and race
    async submitEthnicityAndRace(token, appId, configStore) {
      let responses = [];
      const selectedEthnicities = configStore.selectedEthnicity;
      let addEthnicities = null;
      if (this.ethnicities.length > 0) {
        addEthnicities = selectedEthnicities.filter((ethnicity) => {
          if (this.ethnicities.some((ele) => _.isEqual(ele, ethnicity))) {
            return false;
          } else {
            return true;
          }
        });
      } else {
        addEthnicities = selectedEthnicities;
      }
      const deleteEthnicities = this.ethnicities.filter((ethnicity) => {
        if (selectedEthnicities.some((ele) => _.isEqual(ele, ethnicity))) {
          return false;
        } else {
          return true;
        }
      });
      if (deleteEthnicities.length > 0) {
        await Promise.all(
          deleteEthnicities.map(async (ele) => {
            const response = await this.removeApplicationEthnicity(
              token,
              appId,
              ele.ethnicGroupCode
            );
            responses.push(response);
          })
        );
      }
      if (addEthnicities.length > 0) {
        const response = await this.addApplicationEthnicity(
          token,
          appId,
          addEthnicities
        );
        responses.push(response);
      }

      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "Ethnicity and race.",
        };
      } else {
        this.ethnicities = selectedEthnicities;
        return {
          code: 200,
          message: "success",
          section: "Ethnicity and race.",
        };
      }
    },
    // US citizenship
    async submitUsCitizenship(token, appId, usCitizenship, configStore) {
      let responses = [];
      // International and shipping address
      // international address
      if (
        configStore.selectedHomeAddressCountry.countryCode ===
          MyInfoConstants.usCountryCode &&
        usCitizenship.typeOfVisa?.value ===
          MyInfoConstants.usCitizenship.visaStudentF1
      ) {
        const intAddress = generateFormattedAddress(usCitizenship.intAddress);

        let intResponse = { code: 200 };
        const existingIntAddress = this.addresses.filter(
          (address) => address.type === intAddress.type
        );
        if (
          existingIntAddress.length > 0 &&
          !_.isEqual(existingIntAddress[0], intAddress)
        ) {
          // deleting the id before calling the patch call
          delete intAddress.addressId;
          intResponse = await this.patchApplicationAddress(
            token,
            appId,
            intAddress,
            existingIntAddress[0].addressId
          );
        } else if (existingIntAddress.length === 0) {
          intResponse = await this.addApplicationAddress(
            token,
            appId,
            intAddress
          );
        }
        responses.push(intResponse);
      } else {
        // deleting the address in database
        // international address
        const existingIntAddress = this.addresses.filter(
          (address) => address.type === "SEVIS"
        );
        if (existingIntAddress.length > 0) {
          const response = await this.removeApplicationAddress(
            token,
            appId,
            existingIntAddress[0].addressId
          );
          responses.push(response);
        }
      }

      // I-20 shipping address

      if (
        usCitizenship.typeOfVisa?.value ===
        MyInfoConstants.usCitizenship.visaStudentF1
      ) {
        // Shipping address
        const shippingAddress = generateFormattedAddress(
          usCitizenship.shippingAddress
        );
        let shippingResponse = { code: 200 };
        const existingShippingAddress = this.addresses.filter(
          (address) => address.type === shippingAddress.type
        );
        if (existingShippingAddress.length > 0) {
          shippingAddress.addressId = existingShippingAddress[0].addressId;
        }
        if (
          existingShippingAddress.length > 0 &&
          !_.isEqual(existingShippingAddress[0], shippingAddress)
        ) {
          // deleting the id before calling the patch call
          delete shippingAddress.addressId;
          shippingResponse = await this.patchApplicationAddress(
            token,
            appId,
            shippingAddress,
            existingShippingAddress[0].addressId
          );
        } else if (existingShippingAddress.length === 0) {
          shippingResponse = await this.addApplicationAddress(
            token,
            appId,
            shippingAddress
          );
        }
        responses.push(shippingResponse);
      } else {
        // deleting the address in database
        const existingShippingAddress = this.addresses.filter(
          (address) => address.type === "I20"
        );
        if (existingShippingAddress.length > 0) {
          const response = await this.removeApplicationAddress(
            token,
            appId,
            existingShippingAddress[0].addressId
          );
          responses.push(response);
        }
      }

      // issuing I-20
      if (
        usCitizenship.issuingI20 &&
        (!this.visaSupplementals ||
          this.visaSupplementals?.studentVisaStatus !==
            usCitizenship.issuingI20?.value)
      ) {
        const response = await this.addApplicationVisaSupplementals(
          token,
          appId,
          {
            studentVisaStatus: usCitizenship.issuingI20.value,
          }
        );
        responses.push(response);
      } else if (
        !usCitizenship.issuingI20 &&
        this.visaSupplementals?.studentVisaStatus
      ) {
        const response = await this.removeApplicationVisaSupplementals(
          token,
          appId
        );
        responses.push(response);
      }

      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return responses[0];
      } else {
        return {
          code: 200,
        };
      }
    },
    // Parents and legal guardian
    async submitParentsAndLegalGuardian(token, appId, guardians) {
      const editOrDeleteGuardian = [];
      const addGuardians = [];
      guardians.forEach((guardian) => {
        if (guardian.type) {
          const payload = {
            firstName: guardian.firstName,
            lastName: guardian.lastName,
            email: guardian.email,
            phoneNumber: !_.isEmpty(guardian.phoneNumber)
              ? guardian.phoneNumber
              : null,
            guardianRelation: guardian.guardianRelation
              ? guardian.guardianRelation.value
              : null,
            highestSchoolingLevel: guardian.highestSchoolingLevel
              ? guardian.highestSchoolingLevel.text
              : null,
            isLiving: guardian.isLiving ? guardian.isLiving.value : null,
            previousAsuStudent: guardian.previousAsuStudent
              ? guardian.previousAsuStudent.value
              : null,
          };
          if (guardian.type === "new") {
            addGuardians.push(payload);
          } else {
            editOrDeleteGuardian.push({
              guardianId: guardian.guardianId,
              type: guardian.type,
              payload: payload,
            });
          }
        }
      });
      let responses = [];
      const response = await Promise.all(
        editOrDeleteGuardian.map(async (guardian) => {
          let response = { code: 200 };
          if (guardian.type) {
            switch (guardian.type) {
              case "update":
                response = await this.patchApplicationGuardian(
                  token,
                  appId,
                  guardian.payload,
                  guardian.guardianId
                );
                break;
              case "delete":
                response = await this.removeApplicationGuardian(
                  token,
                  appId,
                  guardian.guardianId
                );
            }
          }
          return response;
        })
      );
      responses = [...response];
      // post call
      if (addGuardians.length > 0) {
        for (const guardian of addGuardians) {
          const response = await await this.addApplicationGuardian(
            token,
            appId,
            guardian
          );
          responses.push(response);
        }
      }
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "Guardian details",
        };
      } else {
        const updatedData = _.cloneDeep(this.guardians);
        this.guardians = updatedData;
        return {
          code: 200,
          message: "success",
          section: "Guardian details",
        };
      }
    },
    async submitMilitaryAffiliations(token, appId, militaryaffiliations) {
      let payload = {
        status: militaryaffiliations.relation.value,
        branch: militaryaffiliations.branch
          ? militaryaffiliations.branch?.value
          : "NA",
        vaEducationBenefits: militaryaffiliations.appliedForBenefit
          ? militaryaffiliations.appliedForBenefit.value
          : "NA",
        jointServiceTranscript: militaryaffiliations.requestTranscript
          ? militaryaffiliations.requestTranscript.value
          : "NA",
      };
      if (
        militaryaffiliations.relation.value ===
        MyInfoConstants.uniformedService.serviceMemberOrVeteranValue
      ) {
        payload.status = militaryaffiliations.status.value;
      }
      let response = { code: 200 };
      if (!_.isEqual(payload, this.militaryaffiliations)) {
        response = await this.addApplicationMilitaryAffiliations(
          token,
          appId,
          payload
        );
      }
      return {
        ...response,
        section: "military affiliation",
      };
    },
    async submitMyInfoSarQuestions(token, appId, formData, EnumSarCodes) {
      // Formatting the asuaffiliation data as required for sar submission
      const asuAffiliationFormattedData = {
        ...this.myInfoSar.asuAffiliation.affiliations,
      };
      Object.keys(asuAffiliationFormattedData).map((key) => {
        if (formData.asuAffiliation.affiliations.includes(key)) {
          asuAffiliationFormattedData[key] = "Y";
        } else {
          asuAffiliationFormattedData[key] = null;
        }
      });
      formData.asuAffiliation.affiliations = asuAffiliationFormattedData;
      // SAR question form submission
      let responses = await this.submitSarResponse(
        token,
        appId,
        this.myInfoSar,
        formData,
        EnumSarCodes.myInfoSar
      );
      responses.forEach((item) => {
        if (item.code === 200 || item.code === 201) {
          _.set(this.myInfoSar, item.element.path, item.element.payload.answer);
        }
      });
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "Sar questions",
        };
      } else {
        return {
          code: 200,
          message: "success",
          section: "Sar questions",
        };
      }
    },
    async submitUsCitizenshipAndMyInfoUserDetails(
      token,
      appId,
      formData,
      userStore,
      configStore
    ) {
      let responses = [];
      // legalsex
      if (userStore.sex !== formData.legalSex.value) {
        const response = await userStore.updateUserSex(
          token,
          appId,
          formData.legalSex.value
        );
        responses.push(response);
      }
      // primary language
      if (
        formData.primaryLanguage.selectValue?.value !==
        userStore.primaryLanguageAtHome
      ) {
        const response = await userStore.updatePrimaryLanguageAtHome(
          token,
          appId,
          formData.primaryLanguage.selectValue?.value
        );
        responses.push(response);
      }
      // primary langugae at home other
      if (
        formData.primaryLanguage.selectValue?.value ===
          MyInfoConstants.visaPermitOther &&
        formData.primaryLanguage.inputValue !==
          userStore.primaryLanguageAtHomeOther
      ) {
        const response = await userStore.updatePrimaryLanguageAtHomeOther(
          token,
          appId,
          formData.primaryLanguage.inputValue
        );
        responses.push(response);
      }
      // Birth country
      if (
        userStore.birthCountry !==
        formData.usCitizenship.countryOfBirth.countryCode
      ) {
        const response = await userStore.updateBirthCountry(
          token,
          appId,
          formData.usCitizenship.countryOfBirth.countryCode
        );
        responses.push(response);
      }
      // SSN
      if (
        (userStore.ssn && !formData.usCitizenship.ssn) ||
        (!userStore.ssn && formData.usCitizenship.ssn) ||
        formData.usCitizenship.ssn !== "000000000"
      ) {
        const response = await userStore.updateSocialSecurityNumber(
          token,
          appId,
          formData.usCitizenship.ssn
        );
        responses.push(response);
      }
      // Visa
      if (!formData.usCitizenship.isUsCitizen.value) {
        let response = { code: 200 };
        if (
          userStore.visaCode !==
            formData.usCitizenship.typeOfVisa?.visaPermitTypeCode &&
          formData.usCitizenship.typeOfVisa?.visaPermitTypeCode !== "oth"
        ) {
          response = await userStore.updateVisaCode(
            token,
            appId,
            formData.usCitizenship.typeOfVisa?.visaPermitTypeCode
          );
        } else if (
          userStore.visaCode !==
            formData.usCitizenship.typeOfVisa?.visaPermitTypeCode &&
          userStore.visaCode !==
            formData.usCitizenship.otherVisaChoices?.visaPermitTypeCode
        ) {
          response = await userStore.updateVisaCode(
            token,
            appId,
            formData.usCitizenship.otherVisaChoices?.visaPermitTypeCode
          );
        }
        responses.push(response);
      } else if (userStore.visaCode) {
        const visa = null;
        const response = await userStore.updateVisaCode(token, appId, visa);
        responses.push(response);
      }
      // citizen country
      if (
        userStore.citizenCountry !==
        formData.usCitizenship.countryOfCitizenShip?.countryCode
      ) {
        const response = await userStore.updateCitizenCountry(
          token,
          appId,
          formData.usCitizenship.countryOfCitizenShip
            ? formData.usCitizenship.countryOfCitizenShip?.countryCode
            : null
        );
        responses.push(response);
      }
      // ASU affiliation ID
      if (userStore.asuId !== formData.asuAffiliation.affiliateId) {
        const response = await userStore.updateAsuId(
          token,
          appId,
          formData.asuAffiliation.affiliateId
        );
        responses.push(response);
      }
      // submitting US citizenship International address and shipping address at the end of user info details
      // as there is a dependency of storing visatype in database before submitting the address
      const usCitizenshipResponse = await this.submitUsCitizenship(
        token,
        appId,
        formData.usCitizenship,
        configStore
      );
      responses.push(usCitizenshipResponse);

      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "User info details",
        };
      } else {
        return {
          code: 200,
          message: "success",
          section: "User info details",
        };
      }
    },
    // My schools page section vise form submission
    // Highschools
    async submitHighSchools(token, appId, schools) {
      const editOrDeleteSchools = [];
      const newSchoolsPayload = [];
      schools.forEach((school) => {
        if (school.type) {
          const payload = {
            extOrgId: null,
            name: null,
            country: school.country.countryCode,
            state:
              typeof school.state === "object"
                ? school.state.stateCode
                : school.state,
            city:
              typeof school.city === "object" ? school.city.value : school.city,
            gradMonth: school.graduationDate.month
              ? school.graduationDate.month.value
              : null,
            gradYear: school.graduationDate.year
              ? school.graduationDate.year.text
              : null,
            startMonth: school.dateFirstAttended.month
              ? school.dateFirstAttended.month.value
              : null,
            startYear: school.dateFirstAttended.year
              ? school.dateFirstAttended.year.text
              : null,
            endMonth: school.dateLastAttended.month
              ? school.dateLastAttended.month.value
              : null,
            endYear: school.dateLastAttended.year
              ? school.dateLastAttended.year.text
              : null,
            sais: school.sais,
            transcriptNameId: school.nameOnTranscript.value,
          };
          // highschool name and extOrgId
          if (!school.schoolName) {
            payload.name = school.highSchool.text.slice(0, 30);
            payload.extOrgId = school.highSchool.value;
            payload.ceeb = school.highSchool.atpCode;
          } else {
            payload.name = school.schoolName;
          }
          if (school.type === "new") {
            newSchoolsPayload.push(payload);
          } else {
            editOrDeleteSchools.push({
              highSchoolId: school.highSchoolId,
              type: school.type,
              payload: payload,
            });
          }
        }
      });
      let responses = [];
      const response = await Promise.all(
        editOrDeleteSchools.map(async (school) => {
          let response = { code: 200 };
          if (school.type) {
            switch (school.type) {
              case "update":
                response = await this.patchApplicationHighSchool(
                  token,
                  appId,
                  school.payload,
                  school.highSchoolId
                );
                break;
              case "delete":
                response = await this.removeApplicationHighSchool(
                  token,
                  appId,
                  school.highSchoolId
                );
            }
          }
          return response;
        })
      );
      responses = [...response];
      // postCall
      if (newSchoolsPayload.length > 0) {
        const response = await this.addApplicationHighSchool(
          token,
          appId,
          newSchoolsPayload
        );
        responses.push(response);
      }
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "Highschool details",
        };
      } else {
        const updatedData = _.cloneDeep(this.highSchools);
        this.highSchools = updatedData;
        return {
          code: 200,
          message: "success",
          section: "Highschool details",
        };
      }
    },
    async submitInstitutionStatus(token, appId, institutionStatus) {
      let response = null;
      if (this.institutionStatus !== institutionStatus?.value) {
        response = await this.updateInstitutionStatus(
          token,
          appId,
          institutionStatus ? institutionStatus.value : institutionStatus
        );
      }
      if (response) {
        return { ...response, section: "Institution status" };
      } else {
        return {
          code: 200,
          message: "success",
          section: "Institution status",
        };
      }
    },
    // Institutions
    async submitInstitutions(token, appId, institutions) {
      const editOrDeleteInstitutions = [];
      const newInstitutionsPayload = [];
      institutions.forEach((institute) => {
        if (institute.type) {
          const payload = {
            extOrgId: null,
            name: null,
            countryCode: institute.country.countryCode,
            stateProvince: isObject(institute.state)
              ? institute.state.stateCode
              : institute.state,
            city: isObject(institute.city)
              ? institute.city.value
              : institute.city,
            degreeCode: institute.degreeAwarded.value,
            concentration: institute.degreeConcentration,
            firstAttendedMonth: institute.dateFirstAttended.month
              ? institute.dateFirstAttended.month.value
              : null,
            firstAttendedYear: institute.dateFirstAttended.year
              ? institute.dateFirstAttended.year.text
              : null,
            lastAttendedMonth: institute.dateLastAttended.month
              ? institute.dateLastAttended.month.value
              : null,
            lastAttendedYear: institute.dateLastAttended.year
              ? institute.dateLastAttended.year.text
              : null,
            transcriptNameId: institute.nameOnTranscript.value,
          };
          // highschool name and extOrgId
          if (!institute.customInstituteName) {
            payload.name = institute.institute.text.slice(0, 50);
            payload.extOrgId = institute.institute.value;
          } else {
            payload.name = institute.customInstituteName;
          }
          if (institute.type === "new") {
            newInstitutionsPayload.push(payload);
          } else {
            editOrDeleteInstitutions.push({
              otherInstitutionId: institute.otherInstitutionId,
              type: institute.type,
              payload: payload,
            });
          }
        }
      });
      let responses = [];
      const response = await Promise.all(
        editOrDeleteInstitutions.map(async (institute) => {
          let response = { code: 200 };
          if (institute.type) {
            switch (institute.type) {
              case "update":
                response = await this.patchApplicationOtherInstitution(
                  token,
                  appId,
                  institute.payload,
                  institute.otherInstitutionId
                );
                break;
              case "delete":
                response = await this.removeApplicationOtherInstitution(
                  token,
                  appId,
                  institute.otherInstitutionId
                );
            }
          }
          return response;
        })
      );

      responses = [...response];

      // postCall
      if (newInstitutionsPayload.length > 0) {
        const response = await this.addApplicationOtherInstitution(
          token,
          appId,
          newInstitutionsPayload
        );
        responses.push(response);
      }
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "Institution details",
        };
      } else {
        const updatedData = _.cloneDeep(this.otherInstitutions);
        this.otherInstitutions = updatedData;
        return {
          code: 200,
          message: "success",
          section: "Institution details",
        };
      }
    },
    //  SAR questions
    async submitMyschoolsSarQuestions(token, appId, formData, EnumSarCodes) {
      let sarResponse = await this.submitSarResponse(
        token,
        appId,
        this.mySchoolsSar,
        formData,
        EnumSarCodes.mySchoolsSar
      );
      sarResponse.forEach((item) => {
        if (item.code === 200 || item.code === 201) {
          _.set(
            this.mySchoolsSar,
            item.element.path,
            item.element.payload.answer
          );
        }
      });
      sarResponse = sarResponse.filter(
        (item) => item.code !== 200 && item.code !== 201
      );
      if (sarResponse.length > 0) {
        return {
          ...sarResponse[0],
          section: "Sar questions",
        };
      } else {
        return {
          code: 200,
          message: "success",
          section: "Sar questions",
        };
      }
    },
    // END of My schools page form submissions

    // My asu programs
    async submitMyAsuProgramSarQuestions(token, appId, formData, EnumSarCodes) {
      // formatting the other interest as required
      const otherInterestsData = { ...this.myAsuProgramSar.otherInterests };
      Object.keys(otherInterestsData).map((key) => {
        if (formData.otherInterests.includes(key)) {
          otherInterestsData[key] = "Y";
        } else {
          otherInterestsData[key] = "N";
        }
      });
      formData.otherInterests = otherInterestsData;
      // Formatting the licence expiration date
      if (formData.rnToBsn.license.expirationDate.month) {
        formData.rnToBsn.license.expirationDate = generateFormattedDate(
          formData.rnToBsn.license.expirationDate.month.value,
          formData.rnToBsn.license.expirationDate.day.value,
          formData.rnToBsn.license.expirationDate.year.value
        );
      } else {
        formData.rnToBsn.license.expirationDate = null;
      }
      // Formatting the Nclexrn date
      if (formData.rnToBsn.dateScheduledForNclexrn.month) {
        formData.rnToBsn.dateScheduledForNclexrn = generateFormattedDate(
          formData.rnToBsn.dateScheduledForNclexrn.month.value,
          formData.rnToBsn.dateScheduledForNclexrn.day.value,
          formData.rnToBsn.dateScheduledForNclexrn.year.value
        );
      } else {
        formData.rnToBsn.dateScheduledForNclexrn = null;
      }
      let responses = await this.submitSarResponse(
        token,
        appId,
        this.myAsuProgramSar,
        formData,
        EnumSarCodes.myAsuProgramSar
      );
      responses.forEach((item) => {
        if (item.code === 200 || item.code === 201) {
          _.set(
            this.myAsuProgramSar,
            item.element.path,
            item.element.payload.answer
          );
        }
      });
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "Sar questions",
        };
      } else {
        return {
          code: 200,
          message: "success",
          section: "Sar questions",
        };
      }
    },
    async submitprograms(token, appId, programs) {
      let addPrograms = null;
      let deletePrograms = null;
      const programOfInterest = generateFormattedProgramOfInterest(
        this.programOfInterests
      );
      if (programOfInterest.length > 0) {
        addPrograms = programs.filter((program) => {
          if (
            programOfInterest.some((ele) => _.isEqual(ele, program.payloadData))
          ) {
            return false;
          } else {
            return true;
          }
        });
      } else {
        addPrograms = programs;
      }
      deletePrograms = programOfInterest.filter((program) => {
        if (programs.some((ele) => _.isEqual(ele.payloadData, program))) {
          return false;
        } else {
          return true;
        }
      });
      let responses = [];
      // deleting programs
      let deleteResponses = await Promise.all(
        deletePrograms.map(async (program) => {
          const response = await this.removeApplicationProgramOfInterest(
            token,
            appId,
            program.priority
          );
          return response;
        })
      );
      // adding programs
      const createResponses = [];
      if (addPrograms.length >= 1) {
        // submitting firstchoice program
        const response = await this.addApplicationProgramOfInterest(
          token,
          appId,
          addPrograms[0].payloadData
        );
        createResponses.push(response);
        // submitting secondchoice program
        if (addPrograms.length > 1) {
          const response = await this.addApplicationProgramOfInterest(
            token,
            appId,
            addPrograms[1].payloadData
          );
          createResponses.push(response);
        }
      }
      responses = [...deleteResponses, ...createResponses];
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "Programs section",
        };
      } else {
        return {
          code: 200,
          message: "success",
          section: "Programs section",
        };
      }
    },
    // END of my asu programs

    // High school grades
    async submitHighSchoolCourseWorks(token, appId, courses) {
      const formattedCourses = generateFormattedCourseWorks(courses);

      const editOrDeleteCourseWorks = [];
      const newCourseWorksPayload = [];
      formattedCourses.forEach((course) => {
        if (course.type) {
          if (course.type === "new") {
            newCourseWorksPayload.push(course.payload);
          } else {
            editOrDeleteCourseWorks.push(course);
          }
        }
      });
      let responses = [];
      const response = await Promise.all(
        editOrDeleteCourseWorks.map(async (course) => {
          let response = null;
          switch (course.type) {
            case "update":
              response = await this.patchApplicationHighSchoolCourseWorks(
                token,
                appId,
                course.payload,
                course.id
              );
              break;
            case "delete":
              response = await this.removeApplicationHighSchoolCourseWorks(
                token,
                appId,
                course.id
              );
          }
          return response;
        })
      );

      responses = [...response];

      // postCall
      if (newCourseWorksPayload.length > 0) {
        const response = await this.addApplicationHighSchoolCourseWorks(
          token,
          appId,
          newCourseWorksPayload
        );
        responses.push(response);
      }
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "Highschool course works",
        };
      } else {
        const updatedData = _.cloneDeep(this.highSchoolCourseWorks);
        this.highSchoolCourseWorks = updatedData;
        return {
          code: 200,
          message: "success",
          section: "Highschool course works",
        };
      }
    },
    async submitHighSchoolSar(token, appId, formData, EnumSarCodes) {
      // SAR question form submission
      let responses = await this.submitSarResponse(
        token,
        appId,
        this.myHighSchoolGradesSar,
        formData,
        EnumSarCodes.myHighSchoolGradesSar
      );
      responses.forEach((item) => {
        if (item.code === 200 || item.code === 201) {
          _.set(
            this.myHighSchoolGradesSar,
            item.element.path,
            item.element.payload.answer
          );
        }
      });
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "Sar questions",
        };
      } else {
        return {
          code: 200,
          message: "success",
          section: "Sar questions",
        };
      }
    },

    async submitHighSchoolAcademics(token, appId, overallAcademics) {
      const payload = {
        currentUnweightedGpa: overallAcademics?.unweightedGpa,
        classSize: !_.isEmpty(overallAcademics?.classRankSize?.size)
          ? overallAcademics?.classRankSize?.size
          : null,
        classRank: !_.isEmpty(overallAcademics?.classRankSize?.rank)
          ? overallAcademics?.classRankSize?.rank
          : null,
        gpaScaleId: overallAcademics.gpaScale
          ? overallAcademics.gpaScale?.value
          : null,
        gradingScaleId: overallAcademics.gradingSystem
          ? overallAcademics.gradingSystem?.id
          : null,
      };
      let response = { code: 200 };
      if (
        overallAcademics.delete &&
        this.highSchoolAcademics &&
        !_.isEqual(payload, this.highSchoolAcademics)
      ) {
        response = await this.deleteApplicationHighSchoolAcademics(
          token,
          appId
        );
      } else if (
        !overallAcademics.delete &&
        !_.isEqual(payload, this.highSchoolAcademics)
      ) {
        response = await this.addApplicationHighSchoolAcademics(
          token,
          appId,
          payload
        );
      }
      return {
        ...response,
        section: "Overall academics",
      };
    },
    // review
    async submitReviewSar(token, appId, formData, EnumSarCodes) {
      // SAR question form submission
      let responses = await this.submitSarResponse(
        token,
        appId,
        this.reviewSar,
        formData,
        EnumSarCodes.reviewSar
      );
      responses.forEach((item) => {
        if (item.code === 200 || item.code === 201) {
          _.set(this.reviewSar, item.element.path, item.element.payload.answer);
        }
      });
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "Sar questions",
        };
      } else {
        return {
          code: 200,
          message: "success",
          section: "Sar questions",
        };
      }
    },
    async submitForm() {
      // Dummy form to trigger form on the page level
    },

    async makeBriteVerifyValidation(payload) {
      return await validateBriteVerifyAddressAndPhone(payload);
    },
    async getValidations(token, appId) {
      const { data } = await ugAppValidationsApi.getAppValidationSchema(
        token,
        appId
      );
      const configStore = useConfigStore();
      const questionMapping = prepareResidencyQuestionMapping(
        configStore.azResidency
      );
      this.applicationErrors = {
        "ug-app-profile-errors": getProfileErrorMap(
          data,
          this.getValidationMap["ug-app-profile-errors"]
        ),
        "ug-app-my-information": applicationMyInformationDetailsErrors(
          data,
          this.getValidationMap["ug-app-my-information"]
        ),
        "ug-app-my-schools": applicationMySchoolsDetailsErrors(
          data,
          this.getValidationMap["ug-app-my-schools"]
        ),
        "ug-app-my-program": applicationMyProgramsDetailsErrors(
          data,
          this.getValidationMap["ug-app-my-program"]
        ),
        "ug-app-my-high-school-grades":
          applicationMyHighSchoolGradesDetailsErrors(
            data,
            this.getValidationMap["ug-app-my-high-school-grades"]
          ),
        "ug-app-arizona-residency": applicationMyArizonaResidencyDetailsErrors(
          data,
          this.getValidationMap["ug-app-arizona-residency"],
          questionMapping
        ),
        miscellaneous: applicationMiscellaneousDetailsErrors(
          data,
          this.getValidationMap["miscellaneous"]
        ),
      };
      return data;
    },
    getScreenNames(screen) {
      let label = "N/A";
      if (screen !== null) {
        switch (screen) {
          case EnumPageNames.PageUndergradMyInformation:
            label = EnumUndergradAppScreenLabels.PageUndergradMyInformation;
            break;
          case EnumPageNames.PageUndergradMyProgram:
            label = EnumUndergradAppScreenLabels.PageUndergradMyProgram;
            break;
          case EnumPageNames.PageUndergradMySchools:
            label = EnumUndergradAppScreenLabels.PageUndergradMySchools;
            break;
          case EnumPageNames.PageUndergradMyHighSchoolGrades:
            label =
              EnumUndergradAppScreenLabels.PageUndergradMyHighSchoolGrades;
            break;
          case EnumPageNames.PageUndergradArizonaResidency:
            label = EnumUndergradAppScreenLabels.PageUndergradArizonaResidency;
            break;
          case EnumPageNames.PageUndergradReview:
            label = EnumUndergradAppScreenLabels.PageUndergradReview;
            break;
          case EnumPageNames.PageUndergradDashboard:
            label = EnumUndergradAppScreenLabels.PageUndergradAppDashboard;
            break;
          case "ug-app-profile-errors":
            label = "Profile";
            break;
          case "ug-app-common-errors":
            label = "Common errors";
            break;
        }
      }
      return label;
    },
    updateDashboardFeedbackAlertClosedStatus(status) {
      this.dashboardFeedbackAlertClosed = status;
    },
    updateDashboardQTRAlertClosedStatus(status) {
      this.dashboardQTRAlertClosed = status;
    },
  },
});

export const EnumNameTypes = {
  Legal: "legal",
  Former: "former",
  Yes: "Y",
  No: "N",
  AzStateCode: "AZ",
  UsCountryCode: "USA",
  CaCountryCode: "CAN",
  WriteAdminScope:
    "https://api.adms-aaa.apps.asu.edu/scopes/person/write:admin",
  ReadAdminScope: "https://api.adms-aaa.apps.asu.edu/scopes/person/read:admin",
  ReadSelfScope: "https://api.adms-aaa.apps.asu.edu/scopes/person/read:self",
  UserTypeSelf: "self",
  UserTypeAdmin: "admin",
  mainPhoneType: "MAIN",
  mobilePhoneType: "MOBILE",
};

export const EnumStringConstants = {
  NONE_NEITHER: "None/Neither",
  OTHER: "Other",
  IDENTITY_NOT_LISTED: "Identity not listed",
  PREFER_NOT_DISCLOSE: "Prefer not to disclose",
  NONE: "none",
};

// NOTE: The order and structure of these values is important it should map to useUgApplicationStore's myInfoSar
export const EnumSarCodes = {
  profileSar: {
    receiveInfoViaSmsSarCode: "PI2TMBLSMS",
  },
  myInfoSar: {
    usCitizenship: {
      cityOfBirth: "BIRTHCITY",
    },
    asuAffiliation: {
      affiliations: {
        affiliationASUCOMMDGS: "ASUCOMMDGS",
        affiliationASUCOMMNDG: "ASUCOMMNDG",
        affiliationASUCOMGLLN: "ASUCOMGLLN",
        affiliationASUCOMGFA: "ASUCOMGFA",
        affiliationASUCOMEMPL: "ASUCOMEMPL",
        affiliationASUCOMSUMM: "ASUCOMSUMM",
        affiliationASUCOMOTH: "ASUCOMOTH",
        affiliationASUCOMNVR: "ASUCOMNVR",
      },
    },
    partnerBenefits: {
      educationBenefit: "CORPPRTYN",
      currentEmployer: "CORPPRTNM",
    },
  },
  myHighSchoolGradesSar: {
    gradePath: "SLFRPTQ1",
  },
  mySchoolsSar: {
    college: {
      totelSemisterCredits: "TTLCOLLCRD",
    },
    iseligibleToReturnToColleges: "PAC12Q1",
    ineligibleToReturnCollege: {
      first: {
        name: "PAC12Q2",
        reasons: {
          academicRelated: "PAC12Q3",
          studentConduct: "PAC12Q4",
          other: "PAC12Q5",
          explaination: "PAC12Q5EXP",
        },
      },
      second: {
        name: "PAC12Q6",
        reasons: {
          academicRelated: "PAC12Q7",
          studentConduct: "PAC12Q8",
          other: "PAC12Q9",
          explaination: "PAC12Q9EXP",
        },
      },
    },
  },
  myAsuProgramSar: {
    otherInterests: {
      otherInterestPRELAW: "PRELAW",
      otherInterestPREMED: "PREMED",
      otherInterestPREVET: "PREVET",
      otherInterestAPPQNAME11: "APPQNAME11",
    },
    rnToBsn: {
      isLicensed: "APPQNAME1",
      license: {
        state: "APPQNAME2",
        number: "APPQNAME3",
        expirationDate: "APPQNAME4",
        disciplinaryActionTaken: "APPQNAME5",
      },
      dateScheduledForNclexrn: "APPQNAME6",
      employer: "APPQNAME7",
      partnerCode: "APPQNAME8",
      releaseInfoToEmployer: "APPQNAME9",
      communityColleges: "APPQNAME10",
      reverseTransferAggrement: "REVTRNQ",
    },
  },
  reviewSar: {
    azCollegeTranscriptConsent: "REVTRNQ",
  },
};

export const MyInfoConstants = {
  primaryLanguageOther: "oth",
  permanentAddressType: "PERMANENT",
  i20AddressType: "I20",
  intAddressType: "SEVIS",
  partnerEducationBenefit: "Y",
  usCountryCode: "USA",
  visaPermitOther: "oth",
  hispanicLatinoText: "Hispanic/Latino",
  isHispanicLatinoValue: "Y",
  notResportedEthnicity: "Not Reported",
  uniformedService: {
    serviceMemberOrVeteranValue: "I am a U.S. service member or veteran",
    spouseOrDependentValue:
      "Spouse/Dependent of a U.S. service member or veteran",
    noneOfOptionsValue: "None of these options apply",
    statusNationalGuard: "National Guard",
    statusArmedForces: "Armed Forces Reserve",
  },
  usCitizenship: {
    visaExchangeVisitor: "Exchange_Visitor(J1)",
    visaStudentF1: "Student_(F1)",
    visaOther: "Other",
    shippingAddressTypeOtherValue: "Other",
    visaStudentF2: "F2",
  },
  isGuardianLivingNoValue: "No",
  typeNew: "new",
  typeUpdate: "update",
  typeDelete: "delete",
};

export const EnumReviewPage = {
  PayLater: "Pay_later",
  PayNow: "Pay_now_(Visa_Mastercard_or_Discover)",
};

export const MyProgramConstants = {
  rnToBsnPlanCode: "NUNURDBSN",
  rnToBsnSubplanCode: "NURRNBSN",
  sessionA: "SESA",
  sessionB: "SESB",
  campusOnline: "ONLNE",
  grades: {
    "1stSemesterGrade": "grades_first_semester",
    "2ndSemesterGrade": "grades_second_semester",
    "1stQuarterGrade": "grades_first_quarter",
    "2ndQuarterGrade": "grades_second_quarter",
    "3rdQuarterGrade": "grades_third_quarter",
    "4thQuarterGrade": "grades_fourth_quarter",
    "1stTrimesterGrade": "grades_first_trimester",
    "2ndTrimesterGrade": "grades_second_trimester",
    "3rdTrimesterGrade": "grades_third_trimester",
    yearGrade: "grades_year",
  },
};
export const MySchoolsConstants = {
  attendedCollegeYes: "attended/attending college",
  eligibleToReturnCollegeYes: "Y",
  eligibleToReturnCollegeNo: "N",
  transcriptAcknowledge: "Yes",
  usCountryCode: "USA",
  arizonaStateCode: "AZ",
  schoolNotInList: "My High School is not on the list",
  instituteNotListed: "Not listed",
  noDegreeAwardedValue: "none",
  typeNew: "new",
  typeUpdate: "update",
  typeDelete: "delete",
};
export const MyHighSchoolConstants = {
  gradePathYes: "Y",
  gradePathNo: "N",
  courseNameOther: [
    "Other (specify)",
    "Other I (specify)",
    "Other II (specify)",
    "Other III (specify)",
  ],
  seniorAcadYear: "Senior/12",
  gradeSystemHunderedPonts: "100 point based",
  duration: {
    fullYear: "Full Year",
    quarterly: "Quarterly",
    trimester: "Trimester",
    semister: "Semester",
  },
  typeNew: "new",
  typeUpdate: "update",
  typeDelete: "delete",
  usCountryCode: "USA",
};

export const EnumAzResidency = {
  OutsideUsOption: "Outside the U.S. or Not Listed",
  usCountryCode: "USA",
  spouseOrDependentValue:
    "Spouse/Dependent of a U.S. service member or veteran",
  statusNationalGuard: "National Guard",
  statusArmedForces: "Armed Forces Reserve",
  statusVeteran: "Veteran",
  statusActiveDuty: "Active Duty",
  visaTypeDACA: "DACA",
  visaTypeUD: "UD",
  hisetSchool: {
    name: "HiSet",
    extOrgId: "1100040290",
  },
};

export const ASUColors = {
  primary: "#8c1d40",
  secondary: "#ffc627",
  "dark-1": "#747474",
  "dark-2": "#484848",
  "light-5": "#bfbfbf",
  "light-4": "#d0d0d0",
};

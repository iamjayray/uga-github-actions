import AcceptedVisaTypes from "../../../src/content/valid-visa-types.json";
import residencyContent from "../../../src/content/arizona-residency.json";
import { EnumAzResidency } from "../../../src/content/enum-ug-application.js";

let access_token = null;
let appId = null;
let userDetails = null;
let testCaseType = null;

let currentScenario = Cypress.env("configFile")
  ?.split("/")
  ?.pop()
  ?.replace(".json", "");

describe("Populate User details", () => {
  before(() => {
    // Get user details from fixture
    cy.fixture("users").then((users) => {
      userDetails = users[users.length - 1];
    });
    cy.readFile(`cypress/config/constants.json`).then(({ testCaseTypes }) => {
      testCaseType = testCaseTypes.uatTesting;
    });
  });

  it("populate userdetails and visit arizona residency page", () => {
    cy.login(userDetails.email, userDetails.password);
    // Intercept config get calls
    cy.getCookie("access_token").then((item) => {
      access_token = item.value;
      cy.populateUgApplications(access_token).then((response) => {
        if (response.data.length > 0) {
          appId = response.data[0].appId;
        }
        // set current screen as my-information
        cy.setUIViewInfo(
          access_token,
          appId,
          "ug-app-my-high-school-grades",
          "ug-app-arizona-residency"
        );
        // populate other user details
        cy.populateUserDetails(appId, access_token, testCaseType);
      });
    });
  });
});

describe(`My Arizona Residency Tests: ${currentScenario}`, () => {
  let config, userDetails;

  before(() => {
    try {
      // Get user details from fixture
      cy.fixture("users").then((users) => {
        userDetails = users[users.length - 1];
      });

      // Get file from Cypres env variable
      cy.readFile(`${Cypress.env("configFile")}`).then(
        (data) => (config = data)
      );
    } catch (error) {
      console.error("Error during setup:", error);
    }
  });

  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/arizona-residency`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });

  it("handle master suite", () => {
    const {
      sectionDomicile,
      sectionEnrollment,
      sectionDependent,
      sectionDriverLicense,
      sectionVehicle,
      sectionTax,
      sectionFinancialSupport,
      sectionEmployment,
      sectionMilitaryActiveDuty,
      sectionLegalGuardian,
      sectionMarried,
      sectionNativeAmerican,
      sectionVeteran,
      sectionVote,
      sectionMilitaryDependency,
      sectionProp308,
    } = config.arizonaResidency;

    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");

    cy.get('[data-cy="arizon-residency-page-heading-and-eta"]').contains(
      "Arizona residency"
    );

    // checking the eligibility
    let isEligibleToFillDetails = null;
    if (sectionProp308) {
      cy.get("[data-cy='arizona-residency-view']", {
        timeout: 30000,
      }).then(() => {
        cy.handleBaseSingleSelect({
          selector: '[data-cy="arizona-residency-prop-308-permanentHome"]',
          text: sectionProp308.permanentHome.text,
          required: true,
          errorMessage: config.errorMessage,
        });

        // Did you (or will you) graduate from an Arizona public or private high school, or homeschool equivalent, or obtain an Arizona high school equivalency diploma, e.g, GED?
        cy.handleRadioButton({
          radioSelector: `[data-cy="arizona-residency-group-isGraduateFromAZPublicSchool"] [data-cy="radio-group"] > div:nth-of-type(${
            sectionProp308.isGraduateFromAZPublicSchool.text.toLowerCase() ===
            "yes"
              ? 1
              : 2
          }) > label`,
        });

        // Did you (or will you) attend an Arizona public or private high school, or homeschool while physically present in Arizona for a minimum of two years?
        cy.handleRadioButton({
          radioSelector: `[data-cy="arizona-residency-group-isAttendAZPublicSchool"] [data-cy="radio-group"] > div:nth-of-type(${
            sectionProp308.isAttendAZPublicSchool.text.toLowerCase() === "yes"
              ? 1
              : 2
          }) > label`,
        });
      });
    } else {
      cy.get("[data-cy='arizona-residency-view']", {
        timeout: 30000,
      }).then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.userStore().then((userStore) => {
            isEligibleToFillDetails =
              userStore.citizenCountry === "USA" ||
              AcceptedVisaTypes.some(
                (item) => item.value === userStore.visaCode
              );
            // if user is not eligible to fill details
            if (!isEligibleToFillDetails) {
              // checking if the alert is visible
              cy.get(
                '[data-cy="arizon-residency-page-heading-and-eta"]'
              ).contains(
                "Based on the information you provided, it appears that you are not a resident of the United States. Therefore, this page is not necessary. Please continue to the next step."
              );
            } else {
              // if user is eligible to fill details
              // SECTION: Domicile
              cy.handleBaseSingleSelect({
                selector:
                  '[data-cy="arizona-residency-domicile-group-permanent-home"]',
                text: sectionDomicile.permanentHome.text,
                required: true,
                errorMessage: config.errorMessage,
              });

              if (
                sectionDomicile.permanentHome.text.toLowerCase() === "arizona"
              ) {
                // living in Arizona continuously for the last 12 months
                cy.handleRadioButton({
                  radioSelector: `[data-cy="arizona-residency-group-isAzResident12m"] [data-cy="radio-group"] > div:nth-of-type(${
                    sectionDomicile.isAzResident12m.text.toLowerCase() === "yes"
                      ? 1
                      : 2
                  }) > label`,
                });
                // begin living in Arizona
                cy.handleResidencyDateSelect({
                  selector: '[data-cy="arizona-residency-group-dateMovedToAz"]',
                  month: sectionDomicile.dateMovedToAz.substring(5, 7),
                  year: sectionDomicile.dateMovedToAz.substring(0, 4),
                  errorMessage: config.errorMessage,
                });
              }
              // checking if the student is studied in US Arizona
              let isStudiedInUS = false;
              const recentGraduatedSchool = ugAppStore.highSchools.filter(
                (item) => item.gradYear && item.gradMonth
              );
              if (recentGraduatedSchool && recentGraduatedSchool.length > 0) {
                isStudiedInUS = recentGraduatedSchool.some(
                  (item) => item.state === "AZ"
                );
              }
              const isAZResidentOrStudiedInUs =
                sectionDomicile.permanentHome.text.toLowerCase() ===
                  "arizona" || isStudiedInUS;

              // checking if eligible to fill rest of the domicile related questions
              if (isAZResidentOrStudiedInUs) {
                // section Enrollement
                // is enrolled
                cy.handleRadioButton({
                  radioSelector: `[data-cy="arizona-residency-is-enrolled-in-another-uni"] [data-cy="radio-group"] > div:nth-of-type(${
                    sectionEnrollment.isEnrolledInAnotherUni.text.toLowerCase() ===
                    "yes"
                      ? 1
                      : 2
                  }) > label`,
                });
                if (
                  sectionEnrollment.isEnrolledInAnotherUni.text.toLowerCase() ===
                  "yes"
                ) {
                  // college name
                  cy.handleBaseInput({
                    selector:
                      '[data-cy="arizona-residency-input-enrolled-location"]',
                    text: sectionEnrollment.inputEnrolledLocation,
                    errorMessage: config.errorMessage,
                  });
                  // state
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="arizona-residency-select-state-enrolled"]',
                    text: sectionEnrollment.selectStateEnrolled.text,
                    errorMessage: config.errorMessage,
                  });
                }
                // enrolled at any Arizona college or university in 2023 or 2022 calendar year
                cy.handleRadioButton({
                  radioSelector: `[data-cy="arizona-residency-is-enroll-AZ-ed-current-or-last-year"] [data-cy="radio-group"] > div:nth-of-type(${
                    sectionEnrollment.isEnrollAZedCurrentOrLastYear.text.toLowerCase() ===
                    "yes"
                      ? 1
                      : 2
                  }) > label`,
                });
                // section Enrollement END

                // section dependent
                if (userStore.userAge <= 24) {
                  cy.handleRadioButton({
                    radioSelector: `[data-cy="arizona-residency-group-is-tax-claimed-as-dependent"] [data-cy="radio-group"] > div:nth-of-type(${
                      sectionDependent.isTaxClaimedAsDependent.text.toLowerCase() ===
                      "yes"
                        ? 1
                        : 2
                    }) > label`,
                  });
                }
                // section dependent END

                // section driver license
                // have a current driver’s license
                cy.handleRadioButton({
                  radioSelector: `[data-cy="arizona-residency-is-having-license"] [data-cy="radio-group"] > div:nth-of-type(${
                    sectionDriverLicense.isHavingLicense.text.toLowerCase() ===
                    "yes"
                      ? 1
                      : 2
                  }) > label`,
                });
                if (
                  sectionDriverLicense.isHavingLicense.text.toLowerCase() ===
                  "yes"
                ) {
                  // which state was your license issued
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="arizona-residency-group-select-state-license-issued"]',
                    text: sectionDriverLicense.selectStateLicenseIssued.text,
                    errorMessage: config.errorMessage,
                  });
                  // When was your license issued
                  if (
                    sectionDriverLicense.selectStateLicenseIssued.text.toLowerCase() ===
                    "arizona"
                  ) {
                    cy.handleResidencyDateSelect({
                      selector:
                        '[data-cy="arizona-residency-driver-license-issued-date"]',
                      month: sectionDriverLicense.dateLicenseIssued.substring(
                        5,
                        7
                      ),
                      year: sectionDriverLicense.dateLicenseIssued.substring(
                        0,
                        4
                      ),
                      errorMessage: config.errorMessage,
                    });
                  }
                }
                // section driver license END
                // section vehicle
                cy.handleRadioButton({
                  radioSelector: `[data-cy="arizona-residency-group-is-owns-vehicle"] [data-cy="radio-group"] > div:nth-of-type(${
                    sectionVehicle.isOwnsVehicle.text.toLowerCase() === "yes"
                      ? 1
                      : 2
                  }) > label`,
                });
                if (sectionVehicle.isOwnsVehicle.text.toLowerCase() === "yes") {
                  // vehicle registered in the state of Arizona
                  cy.handleRadioButton({
                    radioSelector: `[data-cy="arizona-residency-group-is-vehicle-registered-in-az"] [data-cy="radio-group"] > div:nth-of-type(${
                      sectionVehicle.isVehicleRegisteredInAZ.text.toLowerCase() ===
                      "yes"
                        ? 1
                        : 2
                    }) > label`,
                  });
                  // When was your vehicle registered
                  if (
                    sectionVehicle.isVehicleRegisteredInAZ.text.toLowerCase() ===
                    "yes"
                  ) {
                    cy.handleResidencyDateSelect({
                      selector:
                        '[data-cy="arizona-residency-section-vehicle-registered-date"]',
                      month: sectionVehicle.dateVehicleRegistered.substring(
                        5,
                        7
                      ),
                      year: sectionVehicle.dateVehicleRegistered.substring(
                        0,
                        4
                      ),
                      errorMessage: config.errorMessage,
                    });
                  }
                }
                // section vehicle END
                // section taxes
                cy.handleRadioButton({
                  radioSelector: `[data-cy="arizona-residency-group-is-filed-tax-last-year"] [data-cy="radio-group"] > div:nth-of-type(${
                    sectionTax.isFiledTaxLastYear.text.toLowerCase() === "yes"
                      ? 1
                      : 2
                  }) > label`,
                });
                // Where did or where will you file your state taxes
                if (
                  sectionTax.isFiledTaxLastYear.text.toLowerCase() === "yes"
                ) {
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="arizona-residency-group-select-state-filed-tax"]',
                    text: sectionTax.selectStateFiledTax.text,
                    errorMessage: config.errorMessage,
                  });
                }
                // section taxes END
                // section financial support
                residencyContent.sectionFinancialSupport.source.forEach(
                  (source) => {
                    if (sectionFinancialSupport[source.value]) {
                      cy.handleBaseInput({
                        selector: `[data-cy="arizona-residency-financial-table"] #group-${source.value}`,
                        text: sectionFinancialSupport[source.value],
                        errorMessage: config.errorMessage,
                      });
                    }
                  }
                );
                // other supports
                if (sectionFinancialSupport.inputOtherSourceSupport) {
                  let otherSupports = [];
                  residencyContent.sectionFinancialSupport.otherOptions.source.forEach(
                    (source) => {
                      if (sectionFinancialSupport[source.value]) {
                        otherSupports.push(source.value);
                      }
                    }
                  );
                  cy.get(
                    `[data-cy="arizona-residency-other-options"] [type="checkbox"]`
                  ).check(otherSupports, { force: true });

                  //  custom source of support
                  if (otherSupports.includes("inputOtherSourceSupportOther")) {
                    cy.handleBaseInput({
                      selector: `[data-cy="arizona-residency-custom-support-source-input"]`,
                      text: sectionFinancialSupport.inputOtherSourceNota,
                      errorMessage: config.errorMessage,
                    });
                  }
                }
                // section financial support END
                // section employment
                if (
                  sectionFinancialSupport.inputEmploymentSupport ||
                  userStore.userAge >= 18
                ) {
                  // currently employed
                  cy.handleRadioButton({
                    radioSelector: `[data-cy="arizona-residency-is-employed"] [data-cy="radio-group"] > div:nth-of-type(${
                      sectionEmployment.isEmployed.text.toLowerCase() === "yes"
                        ? 1
                        : 2
                    }) > label`,
                  });
                  if (
                    sectionEmployment.isEmployed.text.toLowerCase() === "yes"
                  ) {
                    cy.handleBaseSingleSelect({
                      selector:
                        '[data-cy="arizona-residency-group-select-state-employed"]',
                      text: sectionEmployment.selectStateEmployed.text,
                      errorMessage: config.errorMessage,
                    });
                    if (
                      sectionEmployment.selectStateEmployed.text.toLowerCase() ===
                      "arizona"
                    ) {
                      cy.handleResidencyDateSelect({
                        selector: '[data-cy="arizona-residency-employed-date"]',
                        month: sectionEmployment.dateEmployed.substring(5, 7),
                        year: sectionEmployment.dateEmployed.substring(0, 4),
                        errorMessage: config.errorMessage,
                      });
                    }
                  } else {
                    cy.handleRadioButton({
                      radioSelector: `[data-cy="arizona-residency-is-employed-in-last-12m"] [data-cy="radio-group"] > div:nth-of-type(${
                        sectionEmployment.isEmployedInLast12m.text.toLowerCase() ===
                        "yes"
                          ? 1
                          : 2
                      }) > label`,
                    });
                    if (
                      sectionEmployment.isEmployedInLast12m.text.toLowerCase() ===
                      "yes"
                    ) {
                      cy.handleBaseSingleSelect({
                        selector:
                          '[data-cy="arizona-residency-group-select-state-employed-last-12m"]',
                        text: sectionEmployment.selectStateEmployedLast12m.text,
                        errorMessage: config.errorMessage,
                      });
                    }
                  }
                }
                // section employment END
              }

              // SECTION: Domicile END
              // SECTION: Active Military
              if (
                ugAppStore.militaryaffiliations.status ===
                  EnumAzResidency.statusActiveDuty ||
                ugAppStore.militaryaffiliations.status ===
                  EnumAzResidency.statusArmedForces ||
                ugAppStore.militaryaffiliations.status ===
                  EnumAzResidency.statusNationalGuard
              ) {
                cy.handleBaseSingleSelect({
                  selector:
                    '[data-cy="arizona-residency-select-state-stationed"]',
                  text: sectionMilitaryActiveDuty.selectStateStationed.text,
                  errorMessage: config.errorMessage,
                });
                if (
                  sectionMilitaryActiveDuty.selectStateStationed.text.toLowerCase() !==
                  "arizona"
                ) {
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="arizona-residency-select-state-of-legal-residence"]',
                    text: sectionMilitaryActiveDuty.selectStateStationed.text,
                    errorMessage: config.errorMessage,
                  });
                }
              }
              // SECTION: Active Military END
              // SECTION: Veteran
              if (
                ugAppStore.militaryaffiliations?.status ===
                EnumAzResidency.statusVeteran
              ) {
                //  Which character of service is noted on your DD-214
                cy.handleBaseSingleSelect({
                  selector: '[data-cy="arizona-residency-select-service"]',
                  text: sectionVeteran.selectService.text,
                  errorMessage: config.errorMessage,
                });
                // eligible for Chapter 30 or Chapter 33 benefits
                if (
                  sectionVeteran.selectService.text.toLowerCase() !==
                  "honorable"
                ) {
                  cy.handleRadioButton({
                    radioSelector: `[data-cy="arizona-residency-is-eligible-for-30-or-33-chapter-benefits"] [data-cy="radio-group"] > div:nth-of-type(${
                      sectionVeteran.isEligibleFor30or33ChapterBenefits.text.toLowerCase() ===
                      "yes"
                        ? 1
                        : 2
                    }) > label`,
                  });
                }
                // When were you discharged or released from active duty
                cy.handleResidencyDateSelect({
                  selector:
                    '[data-cy="arizona-residency-veteran-date-of-retirement"]',
                  month: sectionVeteran.dateOfRetirement.substring(5, 7),
                  year: sectionVeteran.dateOfRetirement.substring(0, 4),
                  errorMessage: config.errorMessage,
                });
                // section vote
                // Are you registered to vote
                cy.handleRadioButton({
                  radioSelector: `[data-cy="arizona-residency-is-registered-to-vote"] [data-cy="radio-group"] > div:nth-of-type(${
                    sectionVote.isRegisteredToVote.text.toLowerCase() === "yes"
                      ? 1
                      : 2
                  }) > label`,
                });
                // which state are you registered to vote
                if (
                  sectionVote.isRegisteredToVote.text.toLowerCase() === "yes"
                ) {
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="arizona-residency-select-state-registered-to-vote"]',
                    text: sectionVote.selectStateRegisteredToVote.text,
                    errorMessage: config.errorMessage,
                  });
                }
                // section vote END
                // Section drivers license
                if (!isAZResidentOrStudiedInUs) {
                  // have a current driver’s license
                  cy.handleRadioButton({
                    radioSelector: `[data-cy="arizona-residency-is-having-license"] [data-cy="radio-group"] > div:nth-of-type(${
                      sectionVeteran.driversLicenseOrStateId.isHavingLicense.toLowerCase() ===
                      "yes"
                        ? 1
                        : 2
                    }) > label`,
                  });
                  if (
                    sectionVeteran.driversLicenseOrStateId.isHavingLicense.toLowerCase() ===
                    "yes"
                  ) {
                    // which state was your license issued
                    cy.handleBaseSingleSelect({
                      selector:
                        '[data-cy="arizona-residency-group-select-state-license-issued"]',
                      text: sectionVeteran.driversLicenseOrStateId
                        .selectStateLicenseIssued,
                      errorMessage: config.errorMessage,
                    });
                    // When was your license issued
                    if (
                      sectionVeteran.driversLicenseOrStateId.selectStateLicenseIssued.toLowerCase() ===
                      "arizona"
                    ) {
                      cy.handleResidencyDateSelect({
                        selector:
                          '[data-cy="arizona-residency-driver-license-issued-date"]',
                        month:
                          sectionVeteran.driversLicenseOrStateId.dateLicenseIssued.substring(
                            5,
                            7
                          ),
                        year: sectionVeteran.driversLicenseOrStateId.dateLicenseIssued.substring(
                          0,
                          4
                        ),
                        errorMessage: config.errorMessage,
                      });
                    }
                  }
                }
                // Section drivers license END
              }
              // SECTION: Veteran END
              // SECTION: Military Dependency
              if (
                ugAppStore.militaryaffiliations.status ===
                EnumAzResidency.spouseOrDependentValue
              ) {
                // SectorOfMilitary
                cy.handleBaseSingleSelect({
                  selector:
                    '[data-cy="arizona-residency-select-sector-of-military"]',
                  text: sectionMilitaryDependency.selectSectorOfMilitary.text,
                  errorMessage: config.errorMessage,
                });
                if (
                  sectionMilitaryDependency.selectSectorOfMilitary.text.toLowerCase() ===
                  "veteran"
                ) {
                  // section vote
                  // Are you registered to vote
                  cy.handleRadioButton({
                    radioSelector: `[data-cy="arizona-residency-is-registered-to-vote"] [data-cy="radio-group"] > div:nth-of-type(${
                      sectionVote.isRegisteredToVote.text.toLowerCase() ===
                      "yes"
                        ? 1
                        : 2
                    }) > label`,
                  });
                  // which state are you registered to vote
                  if (
                    sectionVote.isRegisteredToVote.text.toLowerCase() === "yes"
                  ) {
                    cy.handleBaseSingleSelect({
                      selector:
                        '[data-cy="arizona-residency-select-state-registered-to-vote"]',
                      text: sectionVote.selectStateRegisteredToVote.text,
                      errorMessage: config.errorMessage,
                    });
                  }
                  // section vote END
                  // Section drivers license
                  if (!isAZResidentOrStudiedInUs) {
                    // have a current driver’s license
                    cy.handleRadioButton({
                      radioSelector: `[data-cy="arizona-residency-is-having-license"] [data-cy="radio-group"] > div:nth-of-type(${
                        sectionMilitaryDependency.driversLicenseOrStateId.isHavingLicense.toLowerCase() ===
                        "yes"
                          ? 1
                          : 2
                      }) > label`,
                    });
                    if (
                      sectionMilitaryDependency.driversLicenseOrStateId.isHavingLicense.toLowerCase() ===
                      "yes"
                    ) {
                      // which state was your license issued
                      cy.handleBaseSingleSelect({
                        selector:
                          '[data-cy="arizona-residency-group-select-state-license-issued"]',
                        text: sectionMilitaryDependency.driversLicenseOrStateId
                          .selectStateLicenseIssued,
                        errorMessage: config.errorMessage,
                      });
                      // When was your license issued
                      if (
                        sectionMilitaryDependency.driversLicenseOrStateId.selectStateLicenseIssued.toLowerCase() ===
                        "arizona"
                      ) {
                        cy.handleResidencyDateSelect({
                          selector:
                            '[data-cy="arizona-residency-driver-license-issued-date"]',
                          month:
                            sectionMilitaryDependency.driversLicenseOrStateId.dateLicenseIssued.substring(
                              5,
                              7
                            ),
                          year: sectionMilitaryDependency.driversLicenseOrStateId.dateLicenseIssued.substring(
                            0,
                            4
                          ),
                          errorMessage: config.errorMessage,
                        });
                      }
                    }
                  }
                  // Section drivers license END
                  // dateGuardianRetired
                  cy.handleResidencyDateSelect({
                    selector:
                      '[data-cy="arizona-residency-military-dependency-date-guardian-retaired"]',
                    month:
                      sectionMilitaryDependency.dateGuardianRetired.substring(
                        5,
                        7
                      ),
                    year: sectionMilitaryDependency.dateGuardianRetired.substring(
                      0,
                      4
                    ),
                    errorMessage: config.errorMessage,
                  });
                  // eligible for Chapter 30 or Chapter 33 benefits
                  cy.handleRadioButton({
                    radioSelector: `[data-cy="arizona-residency-is-eligible-for-30-or-33-chapter-benefits"] [data-cy="radio-group"] > div:nth-of-type(${
                      sectionMilitaryDependency.isEligibleFor30or33ChapterBenefits.text.toLowerCase() ===
                      "yes"
                        ? 1
                        : 2
                    }) > label`,
                  });
                } else {
                  // Where is your spouse/parent/guardian currently stationed
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="arizona-residency-select-state-guardian-stationed"]',
                    text: sectionMilitaryDependency.selectStateGuardianStationed
                      .text,
                    errorMessage: config.errorMessage,
                  });
                  // What is your spouse/parent/guardians state of legal residence
                  if (
                    sectionMilitaryDependency.selectStateGuardianStationed.text.toLowerCase() !==
                    "arizona"
                  ) {
                    cy.handleBaseSingleSelect({
                      selector:
                        '[data-cy="arizona-residency-select-state-guardian-legal-residence"]',
                      text: sectionMilitaryDependency.selectStateGuardianLegalResidence,
                      errorMessage: config.errorMessage,
                    });
                  }
                }
              }
              // SECTION: Military Dependency END
              // SECTION: Native American
              cy.configStore().then((configStore) => {
                if (
                  configStore.selectedEthnicity.some((ethnicity) =>
                    configStore.tribes.some(
                      (tribe) =>
                        ethnicity.culturalOriginCode ===
                        tribe.culturalOriginCode
                    )
                  )
                ) {
                  cy.handleRadioButton({
                    radioSelector: `[data-cy="arizona-residency-is-native-american"] [data-cy="radio-group"] > div:nth-of-type(${
                      sectionNativeAmerican.isNativeAmerican.text.toLowerCase() ===
                      "yes"
                        ? 1
                        : 2
                    }) > label`,
                  });
                }
              });
              // SECTION: Native American END
              // SECTION: Legal guardian
              if (
                userStore.userAge <= 24 ||
                sectionFinancialSupport.inputParentOrGuardianSupport !== "0"
              ) {
                // state
                cy.handleBaseSingleSelect({
                  selector:
                    '[data-cy="arizona-residency-group-state-parent-lives"]',
                  text: sectionLegalGuardian.stateParentLives.text,
                  errorMessage: config.errorMessage,
                });
                if (
                  sectionLegalGuardian.stateParentLives.text.toLowerCase() ===
                  "arizona"
                ) {
                  // Which parent or legal guardian lives in Arizona
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="arizona-residency-group-select-parent-relationship"]',
                    text: sectionLegalGuardian.selectParentRelationship.text,
                    errorMessage: config.errorMessage,
                  });
                  // When did your parent(s) or legal guardian(s) begin living in Arizona continuously
                  cy.handleResidencyDateSelect({
                    selector:
                      '[data-cy="arizona-residency-legal-guardian-date-parent-moved-to-az"]',
                    month: sectionLegalGuardian.dateParentMovedToAz.substring(
                      5,
                      7
                    ),
                    year: sectionLegalGuardian.dateParentMovedToAz.substring(
                      0,
                      4
                    ),
                    errorMessage: config.errorMessage,
                  });
                  // Did or will your parent(s) or legal guardian(s) file a state income tax return for the 2022 tax year?
                  cy.handleRadioButton({
                    radioSelector: `[data-cy="arizona-residency-group-is-parent-filed-tax-last-year"] [data-cy="radio-group"] > div:nth-of-type(${
                      sectionLegalGuardian.isParentFiledTaxLastYear.text.toLowerCase() ===
                      "yes"
                        ? 1
                        : 2
                    }) > label`,
                  });
                  // In which state did, or will, your parent(s) or legal guardian(s) file state income taxes?
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="arizona-residency-group-select-state-parent-filed-tax"]',
                    text: sectionLegalGuardian.stateParentLives.text,
                    errorMessage: config.errorMessage,
                  });
                  // Does either parent or legal guardian have a current Arizona driver license?
                  cy.handleRadioButton({
                    radioSelector: `[data-cy="arizona-residency-is-parent-having-license-in-az"] [data-cy="radio-group"] > div:nth-of-type(${
                      sectionLegalGuardian.isParentHavingLicenseInAz.text.toLowerCase() ===
                      "yes"
                        ? 1
                        : 2
                    }) > label`,
                  });
                  // Is either parent or legal guardian employed in Arizona?
                  cy.handleRadioButton({
                    radioSelector: `[data-cy="arizona-residency-is-parent-employed-in-az"] [data-cy="radio-group"] > div:nth-of-type(${
                      sectionLegalGuardian.isParentEmployedInAz.text.toLowerCase() ===
                      "yes"
                        ? 1
                        : 2
                    }) > label`,
                  });
                }
              }
              // SECTION: Legal guardian END
              // SECTION: Married
              if (
                (sectionDomicile.permanentHome.text.toLowerCase() ===
                  "arizona" &&
                  userStore.userAge >= 18) ||
                sectionFinancialSupport?.inputSpouseSupport !== 0
              ) {
                // is married
                if (sectionFinancialSupport?.inputSpouseSupport === 0) {
                  cy.handleRadioButton({
                    radioSelector: `[data-cy="arizona-residency-is-married"] [data-cy="radio-group"] > div:nth-of-type(${
                      sectionMarried.isMarried.text.toLowerCase() === "yes"
                        ? 1
                        : 2
                    }) > label`,
                  });
                }
                if (
                  parseInt(sectionFinancialSupport?.inputSpouseSupport) > 0 ||
                  sectionMarried?.isMarried.text.toLowerCase() === "yes"
                ) {
                  // In which state does your spouse currently live?
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="arizona-residency-is-married-state-spouse-lives"]',
                    text: sectionMarried.selectStateSpouseLives.text,
                    errorMessage: config.errorMessage,
                  });
                  // When did your spouse begin living in Arizona
                  if (
                    sectionMarried.selectStateSpouseLives.text.toLowerCase() ===
                    "arizona"
                  ) {
                    cy.handleResidencyDateSelect({
                      selector:
                        '[data-cy="arizona-residency-is-married-date-spouse-moved-to-az"]',
                      month: sectionMarried.dateSpouseMovedToAz.substring(5, 7),
                      year: sectionMarried.dateSpouseMovedToAz.substring(0, 4),
                      errorMessage: config.errorMessage,
                    });
                    // Does your spouse have a valid drivers license or state-issued ID
                    cy.handleRadioButton({
                      radioSelector: `[data-cy="arizona-residency-is-married-spouse-has-valid-id"] [data-cy="radio-group"] > div:nth-of-type(${
                        sectionMarried.isSpouseHavingValidId.text.toLowerCase() ===
                        "yes"
                          ? 1
                          : 2
                      }) > label`,
                    });
                    // What state issued this drivers license or state ID?
                    if (
                      sectionMarried.isSpouseHavingValidId.text.toLowerCase() ===
                      "yes"
                    ) {
                      cy.handleBaseSingleSelect({
                        selector:
                          '[data-cy="arizona-residency-is-married-state-issued-id"]',
                        text: sectionMarried.selectStateValidIdIssued.text,
                        errorMessage: config.errorMessage,
                      });
                      if (
                        sectionMarried.selectStateValidIdIssued.text.toLowerCase() ===
                        "arizona"
                      ) {
                        cy.handleResidencyDateSelect({
                          selector:
                            '[data-cy="arizona-residency-is-married-id-obtained-date"]',
                          month: sectionMarried.dateSpouseObtainedId.substring(
                            5,
                            7
                          ),
                          year: sectionMarried.dateSpouseObtainedId.substring(
                            0,
                            4
                          ),
                          errorMessage: config.errorMessage,
                        });
                      }
                    }
                    // Did or will your spouse file a state income tax return for the 2022 tax year?
                    cy.handleRadioButton({
                      radioSelector: `[data-cy="arizona-residency-is-married-spouse-file-taxes"] [data-cy="radio-group"] > div:nth-of-type(${
                        sectionMarried.isSpouseFileTax.text.toLowerCase() ===
                        "yes"
                          ? 1
                          : 2
                      }) > label`,
                    });
                    // In which state did, or will, your spouse file state income taxes?
                    if (
                      sectionMarried.isSpouseFileTax.text.toLowerCase() ===
                      "yes"
                    ) {
                      cy.handleBaseSingleSelect({
                        selector:
                          '[data-cy="arizona-residency-is-married-state-spouse-file-taxes"]',
                        text: sectionMarried.selectStateSpouseFiledTax.text,
                        errorMessage: config.errorMessage,
                      });
                    }
                    // Is your spouse employed?
                    cy.handleRadioButton({
                      radioSelector: `[data-cy="arizona-residency-is-married-is-spouse-employed"] [data-cy="radio-group"] > div:nth-of-type(${
                        sectionMarried.isSpouseEmployed.text.toLowerCase() ===
                        "yes"
                          ? 1
                          : 2
                      }) > label`,
                    });
                    if (
                      sectionMarried.isSpouseEmployed.text.toLowerCase() ===
                      "yes"
                    ) {
                      // In which state is your spouse employed?
                      cy.handleBaseSingleSelect({
                        selector:
                          '[data-cy="arizona-residency-is-married-state-spouse-employed"]',
                        text: sectionMarried.selectStateSpouseEmployed.text,
                        errorMessage: config.errorMessage,
                      });
                      // When did your spouses employment at this location begin?
                      if (
                        sectionMarried.selectStateSpouseEmployed.text.toLowerCase() ===
                        "arizona"
                      ) {
                        cy.handleResidencyDateSelect({
                          selector:
                            '[data-cy="arizona-residency-is-married-date-spouse-employed"]',
                          month:
                            sectionMarried.dateSpouseEmploymentStarted.substring(
                              5,
                              7
                            ),
                          year: sectionMarried.dateSpouseEmploymentStarted.substring(
                            0,
                            4
                          ),
                          errorMessage: config.errorMessage,
                        });
                      }
                      // Is your spouse currently enrolled at ASU or any other college or university?
                      cy.handleRadioButton({
                        radioSelector: `[data-cy="arizona-residency-is-married-spouse-employed-in-any-uni"] [data-cy="radio-group"] > div:nth-of-type(${
                          sectionMarried.isSpouseEmployedInAnyUni.text.toLowerCase() ===
                          "yes"
                            ? 1
                            : 2
                        }) > label`,
                      });
                      //
                      cy.handleRadioButton({
                        radioSelector: `[data-cy="arizona-residency-is-married-spouse-dependent"] [data-cy="radio-group"] > div:nth-of-type(${
                          sectionMarried.isSpouseDependent.text.toLowerCase() ===
                          "yes"
                            ? 1
                            : 2
                        }) > label`,
                      });
                    }
                  }
                }
              }
              // SECTION: Married END
            }
            //  details input end
          });
        });
      });
    }
    // SECTION: handle save button
    cy.handleButton({
      buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
    }).then(() => {
      cy.wait("@notificationIntercept", { timeout: 30000 });

      cy.url().should("include", `ug-app/${appId}/review`);
    });
  });
});

import myInfoContent from "../../../src/content/my-information.json";

let access_token = null;
let appId = null;
let userDetails = null;
let testCaseType = null;

let currentScenario = Cypress.env("configFile")
  ?.split("/")
  ?.pop()
  ?.replace(".json", "");

// briteverify valid response to skip the modal
const briteverifyResponse = {
  address: {
    address1: "9355 N 91st St Unit 107",
    address2: " ",
    city: "Scottsdale",
    state: "AZ",
    zip: "85258-5007",
    status: "valid",
    errors: [],
    corrected: false,
  },
  duration: 0.416469476,
};

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

  it("populate userdetails and visit my info page", () => {
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
          "ug-app-my-information",
          "ug-app-my-information"
        );
        // populate other user details
        cy.populateUserDetails(appId, access_token, testCaseType);
      });
    });
  });
});

describe(`My Information Tests: ${currentScenario}`, () => {
  let config;

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

    cy.visit(`ug-app/${appId}/my-information`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });

  it("handle master suite", () => {
    cy.intercept("GET", `${Cypress.env("dplBaseUrl")}/codeset/country/*`).as(
      "stateApiIntercept"
    );

    const {
      formerNames,
      primaryLanguage,
      homeAddress,
      ethnicOrRacialBackground,
      usCitizenship,
      guardians,
      asuAffiliation,
      usUniformedServices,
      partnerBenefits,
    } = config.myInformation;

    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");

    cy.intercept(
      "POST",
      `https://bpi.briteverify.com/api/public/v1/fullverify`,
      briteverifyResponse
    ).as("briteverifyIntercept");

    cy.get("[data-cy='my-information-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          // SECTION: handle section former name
          let formerNameLength = ugAppStore.formerNames.length;
          formerNames.forEach((formerName) => {
            if (formerNameLength < 10) {
              // Add former name
              cy.handleButton({
                buttonSelector:
                  '[data-cy="my-info-former-name-add-new-button"]',
              });
              cy.handleButton({
                buttonSelector:
                  '[data-cy="my-info-former-name-save-form-button"]',
              });
              // Handle first name and last name inputs using the abstract function
              cy.handleBaseInput({
                selector: '[data-cy="my-info-former-name-first-name-group"]',
                text: formerName.firstName,
                required: true,
                errorMessage: config.errorMessage,
              });
              cy.handleBaseInput({
                selector: '[data-cy="my-info-former-name-last-name-group"]',
                text: formerName.lastName,
                required: true,
                errorMessage: config.errorMessage,
              });
              cy.handleButton({
                buttonSelector:
                  '[data-cy="my-info-former-name-save-form-button"]',
              });
              // checking if the table is updated
              cy.get('[data-cy="my-info-former-name-table"]')
                .contains(
                  "td",
                  `${formerName.firstName} ${formerName.lastName}`
                )
                .should("be.visible");
              // Updating the length
              formerNameLength++;
            } else {
              cy.log(
                `former name limit exceeded, Unable to enter name ${formerName.firstName} ${formerName.lastName}`
              );
            }
          });
          // if 10 former names entered checking if the add new button is disabled
          cy.get('[data-cy="my-info-former-name-add-new-button"]').should(
            formerNameLength < 10 ? "be.visible" : "be.disabled"
          );
          // SECTION: Former name END

          // SECTION: handle legal sex
          // Select radio options (M/F)
          cy.get(`[data-cy='my-info-legal-sex'] [type="radio"]`).check(
            userDetails.sex.toLowerCase() === "male" ? "M" : "F"
          );
          // SECTION: legal sex END

          // SECTION: handle primary language spoken at home
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-info-primary-language-select-group"]',
            text: primaryLanguage.selectValue.language,
            required: true,
            errorMessage: config.errorMessage,
          });
          // other language
          if (primaryLanguage.selectValue.language === "Other") {
            cy.handleBaseInput({
              selector: '[data-cy="my-info-primary-language-input-group"]',
              text: primaryLanguage.selectValue.otherLanguage,
              required: true,
              errorMessage: config.errorMessage,
            });
          }
          // SECTION: primary language END

          // // SECTION: handle home address and phone
          // Select country
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-info-home-address-country-group"]',
            text: homeAddress.countryCode.text,
            errorMessage: config.errorMessage,
          });
          cy.wait("@stateApiIntercept");
          if (typeof homeAddress.stateProvince === "object") {
            // Select state from dropdown
            cy.handleBaseSingleSelect({
              selector: '[data-cy="my-info-home-address-state-group"]',
              text: homeAddress.stateProvince.text,
              errorMessage: config.errorMessage,
            });
          } else {
            // Enter state in the input
            cy.handleBaseInput({
              selector: '[data-cy="my-info-home-address-state-group"]',
              text: homeAddress.stateProvince,
              errorMessage: config.errorMessage,
            });
          }

          // address line 1
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-address-line-1-group"]',
            text: homeAddress.street1,
            required: true,
            errorMessage: config.errorMessage,
          });

          // address line 2
          if (homeAddress.street2) {
            cy.handleBaseInput({
              selector: '[data-cy="my-info-home-address-address-line-2-group"]',
              text: homeAddress.street2,
              errorMessage: config.errorMessage,
            });
          }

          // Enter city
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-city-group"]',
            text: homeAddress.city,
            required: true,
            errorMessage: config.errorMessage,
          });

          // Enter zip code
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-zip-code-group"]',
            text: homeAddress.postalCode,
            required: true,
            errorMessage: config.errorMessage,
          });

          // SECTION: handle ethnic/racial background
          let totalRaceEntered = 0; // using this variable to determine if primary race is needed
          if (ethnicOrRacialBackground.hispanicOrLatino) {
            cy.handleRadioButton({
              radioSelector: `[data-cy='my-info-ethic-racial-background-is-hispanic-latino-group']  div:nth-of-type(${
                ethnicOrRacialBackground.hispanicOrLatino.text === "Yes" ? 1 : 2
              }) > label`,
            });
            if (ethnicOrRacialBackground.hispanicOrLatino.text === "Yes") {
              totalRaceEntered++;
            }
          }
          if (
            ethnicOrRacialBackground.hispanicOrLatino.text === "Yes" &&
            ethnicOrRacialBackground.hispanicOrLatino.text
          ) {
            // Select option from dropdown
            cy.handleBaseSingleSelect({
              selector:
                '[data-cy="my-info-ethic-racial-background-hispanic-latino-origin-group"]',
              text: ethnicOrRacialBackground.hispanicOrLatino.text,
              required: false,
              errorMessage: config.errorMessage,
            });
          }

          // get race values

          if (ethnicOrRacialBackground.race > 0) {
            let race = [];
            ethnicOrRacialBackground.race.forEach((item) => {
              race.push(item.text);
              totalRaceEntered++;
            });
            // Select race from dropdown
            cy.handleBaseMultiSelect({
              inputSelector:
                '[data-cy="my-info-ethic-racial-background-race-group"] input',
              textArray: race,
              required: false,
              clearSelector:
                '[data-cy="my-info-ethic-racial-background-race-group"] button > svg',
              errorSelector: "div.invalid-feedback",
              errorMessage: config.errorMessage,
            });
            ethnicOrRacialBackground.race.forEach((item) => {
              const originSelecter = `my-info-ethic-racial-background-${item.text
                .toLowerCase()
                .replace(" ", "-")}-race-origin-group`;
              // checking if the race has origin select input
              cy.get('[data-cy="my-info-ethnic-racial-background"]').then(
                (section) => {
                  if (
                    section.find(`[data-cy="${originSelecter}"]`).length > 0 &&
                    item.origin
                  ) {
                    cy.handleBaseSingleSelect({
                      selector: `[data-cy="${originSelecter}"]`,
                      text: item.origin,
                      errorMessage: config.errorMessage,
                    });
                  }
                }
              );
            });
          }
          // Select primary race from dropdown
          if (totalRaceEntered > 1 && ethnicOrRacialBackground.primaryRace) {
            cy.handleBaseSingleSelect({
              selector:
                '[data-cy="my-info-ethic-racial-background-primary-race-group"]',
              text: ethnicOrRacialBackground.primaryRace.text,
              errorMessage: config.errorMessage,
            });
          }
          // SECTION: ethnic/racial background END

          // SECTION: handle U.S. citizenship
          //is US citizen
          cy.handleRadioButton({
            radioSelector: `[data-cy='my-info-us-citizenship-is-us-citizen-group'] [data-cy='radio-group'] > div:nth-of-type(${
              usCitizenship.isUsCitizen.value ? 1 : 2
            }) > label`,
          });
          if (usCitizenship.isUsCitizen.value) {
            // Birth country
            cy.handleBaseSingleSelect({
              selector:
                '[data-cy="my-info-us-citizenship-birth-country-group"]',
              text: usCitizenship.countryOfBirth.text,
              required: true,
              errorMessage: config.errorMessage,
            });
            // SSN
            cy.handleBaseInput({
              selector: '[data-cy="my-info-us-citizenship-ssn-group"]',
              text: userDetails.ssn,
              required: true,
              errorMessage: config.errorMessage,
            });
          } else {
            // visa type
            cy.handleBaseSingleSelect({
              selector: '[data-cy="my-info-us-citizenship-visa-type-group"]',
              text: usCitizenship.typeOfVisa.text,
              required: true,
              errorMessage: config.errorMessage,
            });
            // citizen country
            cy.handleBaseSingleSelect({
              selector:
                '[data-cy="my-info-us-citizenship-citizenship-country-group"]',
              text: usCitizenship.countryOfCitizenShip.text,
              required: true,
              errorMessage: config.errorMessage,
            });
            // Birth country
            cy.handleBaseSingleSelect({
              selector:
                '[data-cy="my-info-us-citizenship-birth-country-group"]',
              text: usCitizenship.countryOfBirth.text,
              required: true,
              errorMessage: config.errorMessage,
            });
            // SSN
            if (usCitizenship.ssn) {
              cy.handleBaseInput({
                selector: '[data-cy="my-info-us-citizenship-ssn-group"]',
                text: userDetails.ssn,
                errorMessage: config.errorMessage,
              });
            }
            cy.get('[data-cy="my-info-us-citizenship"]').then((section) => {
              // other visa choice
              if (
                section.find(
                  `[data-cy="my-info-us-citizenship-other-visa-group"]`
                ).length > 0
              ) {
                cy.handleBaseSingleSelect({
                  selector: `[data-cy="my-info-us-citizenship-other-visa-group"]`,
                  text: usCitizenship.otherVisaChoices,
                  required: true,
                  errorMessage: config.errorMessage,
                });
              }
              // city of birth
              if (
                section.find(
                  `[data-cy="my-info-us-citizenship-birth-city-group"]`
                ).length > 0
              ) {
                cy.handleBaseInput({
                  selector:
                    '[data-cy="my-info-us-citizenship-birth-city-group"]',
                  text: usCitizenship.cityOfBirth,
                  errorMessage: config.errorMessage,
                });
              }
              // purposes of issuing an I-20
              if (
                section.find(
                  `[data-cy="my-info-us-citizenship-issuing-i20-group"]`
                ).length > 0
              ) {
                cy.handleRadioButton({
                  radioSelector: `[data-cy='my-info-us-citizenship-issuing-i20-group'] [data-cy='radio-group'] > div:nth-of-type(${
                    usCitizenship.issuingI20.text.toLowerCase() === "yes"
                      ? 1
                      : 2
                  }) > label`,
                });
              }
            });
            if (
              usCitizenship.typeOfVisa.text.toLowerCase() === "student (f-1)"
            ) {
              if (
                homeAddress.countryCode.text.toLowerCase() === "united states"
              ) {
                // international address
                // Select country
                cy.handleBaseSingleSelect({
                  selector:
                    '[data-cy="my-info-us-citizenship-int-add-country-group"]',
                  text: usCitizenship.intAddress.countryCode.text,
                  errorMessage: config.errorMessage,
                });
                cy.wait("@stateApiIntercept");
                if (
                  typeof usCitizenship.intAddress.stateProvince === "object"
                ) {
                  // Select state from dropdown
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="my-info-us-citizenship-int-add-state-group"]',
                    text: usCitizenship.intAddress.stateProvince.text,
                    errorMessage: config.errorMessage,
                  });
                } else {
                  // Enter state in the input
                  cy.handleBaseInput({
                    selector:
                      '[data-cy="my-info-us-citizenship-int-add-state-group"]',
                    text: usCitizenship.intAddress.stateProvince,
                    errorMessage: config.errorMessage,
                  });
                }
                // address line 1
                cy.handleBaseInput({
                  selector:
                    '[data-cy="my-info-us-citizenship-int-add-address-line-1-group"]',
                  text: usCitizenship.intAddress.street1,
                  required: true,
                  errorMessage: config.errorMessage,
                });
                // address line 2
                if (usCitizenship.intAddress.street2) {
                  cy.handleBaseInput({
                    selector:
                      '[data-cy="my-info-us-citizenship-int-add-address-line-2-group"]',
                    text: usCitizenship.intAddress.street2,
                    errorMessage: config.errorMessage,
                  });
                }
                // Enter city
                cy.handleBaseInput({
                  selector:
                    '[data-cy="my-info-us-citizenship-int-add-city-group"]',
                  text: usCitizenship.intAddress.city,
                  required: true,
                  errorMessage: config.errorMessage,
                });
                // Enter zip code
                cy.handleBaseInput({
                  selector:
                    '[data-cy="my-info-us-citizenship-int-add-zip-code-group"]',
                  text: usCitizenship.intAddress.postalCode,
                  required: true,
                  errorMessage: config.errorMessage,
                });
              }
              cy.handleBaseSingleSelect({
                selector: `[data-cy="my-info-us-citizenship-shipping-address-options-group"]`,
                text: usCitizenship.shippingAddressType.text,
                required: true,
                errorMessage: config.errorMessage,
              });
              if (
                usCitizenship.shippingAddressType.type.toLowerCase() === "other"
              ) {
                // shipping address
                // Select country
                cy.handleBaseSingleSelect({
                  selector:
                    '[data-cy="my-info-us-citizenship-shipping-add-country-group"]',
                  text: usCitizenship.shippingAddress.countryCode.text,
                  errorMessage: config.errorMessage,
                });
                cy.wait("@stateApiIntercept");
                if (
                  typeof usCitizenship.shippingAddress.stateProvince ===
                  "object"
                ) {
                  // Select state from dropdown
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="my-info-us-citizenship-shipping-add-state-group"]',
                    text: usCitizenship.shippingAddress.stateProvince.text,
                    errorMessage: config.errorMessage,
                  });
                } else {
                  // Enter state in the input
                  cy.handleBaseInput({
                    selector:
                      '[data-cy="my-info-us-citizenship-shipping-add-state-group"]',
                    text: usCitizenship.shippingAddress.stateProvince,
                    errorMessage: config.errorMessage,
                  });
                }
                // address line 1
                cy.handleBaseInput({
                  selector:
                    '[data-cy="my-info-us-citizenship-shipping-add-address-line-1-group"]',
                  text: usCitizenship.shippingAddress.street1,
                  required: true,
                  errorMessage: config.errorMessage,
                });
                // address line 2
                if (usCitizenship.shippingAddress.street2) {
                  cy.handleBaseInput({
                    selector:
                      '[data-cy="my-info-us-citizenship-shipping-add-address-line-2-group"]',
                    text: usCitizenship.shippingAddress.street2,
                    errorMessage: config.errorMessage,
                  });
                }
                // Enter city
                cy.handleBaseInput({
                  selector:
                    '[data-cy="my-info-us-citizenship-shipping-add-city-group"]',
                  text: usCitizenship.shippingAddress.city,
                  required: true,
                  errorMessage: config.errorMessage,
                });

                // Enter zip code
                cy.handleBaseInput({
                  selector:
                    '[data-cy="my-info-us-citizenship-shipping-add-zip-code-group"]',
                  text: usCitizenship.shippingAddress.postalCode,
                  required: true,
                  errorMessage: config.errorMessage,
                });
              }
            }
          }
          // SECTION: U.S. citizenship END

          // SECTION: handle Guardians details
          let guardiansLength = ugAppStore.guardians.length;
          guardians.forEach((guardian) => {
            if (guardiansLength < 2) {
              // // Add former name
              if (guardiansLength > 0) {
                cy.handleButton({
                  buttonSelector:
                    '[data-cy="my-info-parent-legal-guardian-add-new-guardian-button"]',
                });
              }
              cy.handleButton({
                buttonSelector:
                  '[data-cy="my-info-parent-legal-guardian-form-save-button"]',
              });
              // first name
              cy.handleBaseInput({
                selector:
                  '[data-cy="my-info-parent-legal-guardian-first-name-group"]',
                text: guardian.firstName,
                errorMessage: config.errorMessage,
              });
              // last name
              cy.handleBaseInput({
                selector:
                  '[data-cy="my-info-parent-legal-guardian-last-name-group"]',
                text: guardian.lastName,
                errorMessage: config.errorMessage,
              });
              // is person living
              cy.handleRadioButton({
                radioSelector: `[data-cy='my-info-parent-legal-guardian-is-living-group']  div:nth-of-type(${
                  guardian.isLiving.value ? 1 : 2
                }) > label`,
              });
              if (guardian.isLiving.value) {
                // email
                if (guardian.email) {
                  cy.handleBaseInput({
                    selector:
                      '[data-cy="my-info-parent-legal-guardian-email-group"]',
                    text: guardian.email,
                    errorMessage: config.errorMessage,
                  });
                }
                // phone number
                if (guardian.phoneNumber) {
                  cy.handleBaseInput({
                    selector:
                      '[data-cy="my-info-parent-legal-guardian-phone-number-group"]',
                    text: guardian.phoneNumber,
                    errorMessage: config.errorMessage,
                  });
                }
              }
              // relation
              cy.handleBaseSingleSelect({
                selector:
                  '[data-cy="my-info-parent-legal-guardian-relation-group"]',
                text: guardian.guardianRelation.text,
                required: true,
                errorMessage: config.errorMessage,
              });
              //level of schooling completed
              cy.handleBaseSingleSelect({
                selector:
                  '[data-cy="my-info-parent-legal-guardian-highest-schooling-level-group"]',
                text: guardian.highestSchoolingLevel.text,
                required: true,
                errorMessage: config.errorMessage,
              });
              // attended asu
              cy.handleRadioButton({
                radioSelector: `[data-cy='my-info-parent-legal-guardian-attended-asu-group']  div:nth-of-type(${
                  guardian.previousAsuStudent.value ? 1 : 2
                }) > label`,
              });
              cy.handleButton({
                buttonSelector:
                  '[data-cy="my-info-parent-legal-guardian-form-save-button"]',
              });
              // checking if the table is updated
              cy.get('[data-cy="my-info-parent-legal-guardian-details-table"')
                .contains("td", `${guardian.firstName} ${guardian.lastName}`)
                .should("be.visible");
              // Updating the length
              guardiansLength++;
            } else {
              cy.log(
                `guardian details limit excedded, Unable to enter name ${guardian.firstName} ${guardian.lastName}`
              );
            }
          });
          // SECTION: Guardian details END

          // SECTION: handle previous ASU affiliation
          // get affiliation checkbox values
          let affiliations = [];
          myInfoContent.asuAffiliation.options.forEach((option) => {
            if (asuAffiliation.affiliations.includes(option.text)) {
              affiliations.push(option.value);
            }
          });
          // selecting the items
          cy.get(
            `[data-cy="my-info-prevoius-asu-affiliation"] [type="checkbox"]`
          ).check(affiliations, { force: true });
          // affiliation id
          if (asuAffiliation.affiliationId) {
            cy.handleBaseInput({
              selector:
                '[data-cy="my-info-prevoius-asu-affiliation-affiliate-id-group"]',
              text: userDetails.asuAffiliationId,
              errorMessage: config.errorMessage,
            });
          }
          // SECTION: previous ASU affiliation END

          // SECTION: handle affiliation to U.S. uniformed services
          cy.handleBaseSingleSelect({
            selector: `[data-cy="my-info-us-uniformed-services-relation-group"]`,
            text: usUniformedServices.relation.text,
            required: true,
            errorMessage: config.errorMessage,
          });
          if (
            usUniformedServices.relation.text.toLowerCase() !==
            "none of these options apply to me"
          ) {
            if (
              usUniformedServices.relation.text.toLowerCase() ===
              "i am a u.s. service member or veteran"
            ) {
              // status
              cy.get(
                `[data-cy="my-info-us-uniformed-services-status-group"] [type="radio"]`
              ).check(usUniformedServices.status.text);
              // Request transcript
              cy.handleRadioButton({
                radioSelector: `[data-cy="my-info-us-uniformed-services-request-transcript-group"] [data-cy="radio-group"] > div:nth-of-type(${
                  usUniformedServices.requestTranscript.text.toLowerCase() ===
                  "yes"
                    ? 1
                    : 2
                }) > label`,
              });
            }
            // branch of service
            cy.handleBaseSingleSelect({
              selector:
                '[data-cy="my-info-us-uniformed-services-branch-group"]',
              text: usUniformedServices.branch.text,
              required: true,
              errorMessage: config.errorMessage,
            });
            // Education benefits
            cy.handleRadioButton({
              radioSelector: `[data-cy="my-info-us-uniformed-services-veterans-benefits-group"] [data-cy='radio-group'] > div:nth-of-type(${
                usUniformedServices.appliedForBenefit.text.toLowerCase() ===
                "yes"
                  ? 1
                  : 2
              }) > label`,
            });
          }
          // SECTION: affiliation to U.S. uniformed services END

          // SECTION: handle partner benefits
          cy.handleRadioButton({
            radioSelector: `[data-cy='my-info-partner-benefits-education-benefit-group'] div:nth-of-type(${
              partnerBenefits.educationBenefit.text.toLowerCase() === "yes"
                ? 1
                : 2
            }) > label`,
          });
          if (partnerBenefits.educationBenefit.text.toLowerCase() === "yes") {
            cy.handleBaseSingleSelect({
              selector:
                "[data-cy='my-info-partner-benefits-current-employer-group']",
              text: partnerBenefits.currentEmployer.text,
              required: true,
              errorMessage: config.errorMessage,
            });
          }
          // SECTION: partner benefits END

          // SECTION: handle save button
          cy.handleButton({
            buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
          }).then(() => {
            if (
              homeAddress.countryCode.countryCode === "USA" ||
              homeAddress.countryCode.countryCode === "CA"
            ) {
              cy.wait("@briteverifyIntercept");
            }
            cy.wait("@notificationIntercept", { timeout: 30000 });
            cy.url(`ug-app/${appId}/my-program`);
          });
        });
      });
  });
});

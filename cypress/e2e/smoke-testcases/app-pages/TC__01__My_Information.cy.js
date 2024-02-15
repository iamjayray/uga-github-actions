/* eslint-disable cypress/unsafe-to-chain-command */
import { MyInfoConstants } from "../../../../src/content/enum-ug-application";

let access_token = null;
let appId = null;
let userDetails = null;
let config;
let testCaseType = null;

describe("populate userdetails and load config from smoke-testing for my-information", () => {
  before(() => {
    // Get user details from fixture
    cy.fixture("users").then((users) => {
      userDetails = users[0];
    });
    // Get file from Cypres env variable
    cy.readFile(`cypress/config/smoke-testing/my-information.json`).then(
      (data) => (config = data)
    );
    cy.readFile(`cypress/config/constants.json`).then(({ testCaseTypes }) => {
      testCaseType = testCaseTypes.smokeTesting;
    });
  });

  beforeEach(() => {
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
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
      });
    });
  });

  it("reset my-information page details", () => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);

    cy.get("[data-cy='my-information-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.userStore().then((userStore) => {
            cy.resetMyInformationPage(
              ugAppStore,
              userStore,
              access_token,
              appId
            ).then(() => {
              cy.populateUserDetails(appId, access_token, testCaseType);
            });
          });
        });
      });
  });
});

describe("my-information page UI assertions", () => {
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("testing the header and floating need help button", () => {
    // changing the view port to mobile
    cy.viewport(390, 844);
    cy.get("[data-cy='my-information-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.get("[data-cy='ug-app-header']").should("be.visible");
        // making a change and trying to navigate to profile pages
        cy.get(`[data-cy='my-info-legal-sex'] [type="radio"]`).check("M");

        // toggle the header
        cy.get(
          "[data-cy='ug-app-header-mobile-collapse-toggle-button']"
        ).click();

        // profile
        cy.get(
          "[data-cy='ug-app-header-mobile-collapse-edit-profile-button']"
        ).click();
        cy.get('[data-cy="ug-app-unsaved-changes-alert-modal"]').should(
          "be.visible"
        );
        cy.get(
          '[data-cy="ug-app-unsaved-changes-alert-modal-go-back-to-save-button"]'
        ).click();
        // dashboard
        cy.get(
          "[data-cy='ug-app-header-mobile-collapse-dashboard-button']"
        ).click();
        cy.get('[data-cy="ug-app-unsaved-changes-alert-modal"]').should(
          "be.visible"
        );
        cy.get(
          '[data-cy="ug-app-unsaved-changes-alert-modal-leave-without-saving-button"]'
        ).click();
        cy.get("[data-cy='dashboard-continue-application-button']", {
          timeout: 10000,
        }).click();

        cy.get("[data-cy='my-information-view']", {
          timeout: 20000,
        })
          .should("be.visible")
          .then(() => {
            cy.get(
              "[data-cy='ug-app-header-mobile-collapse-toggle-button']"
            ).click();
            // signout
            // dashboard
            cy.get(
              "[data-cy='ug-app-header-mobile-collapse-sign-out-button']"
            ).click();
          });
      });
  });

  it("verify all the section are visible on the page", () => {
    // former name section
    cy.get('[data-cy="my-info-former-name"]').should("be.visible");
    // add former name button
    cy.get('[data-cy="my-info-former-name-add-new-button"]')
      .should("be.visible")
      .click();
    // first and last name
    cy.get('[data-cy="my-info-former-name-first-name-group"]').should(
      "be.visible"
    );
    cy.get('[data-cy="my-info-former-name-last-name-group"]').should(
      "be.visible"
    );
    // save and cancle buttons
    cy.get('[data-cy="my-info-former-name-save-form-button"]').should(
      "be.visible"
    );
    cy.get('[data-cy="my-info-former-name-cancel-form-button"]').should(
      "be.visible"
    );
    // legal Sex
    cy.get('[data-cy="my-info-legal-sex"]').should("be.visible");
    cy.get('[data-cy="my-info-legal-sex-group"]').should("be.visible");
    cy.get('[data-cy="my-info-legal-sex-group"] .radio-parent').should(
      "have.length",
      2
    );
    // primary language
    cy.get('[data-cy="my-info-primary-language"]').should("be.visible");
    cy.get('[data-cy="my-info-primary-language-select-group"]').should(
      "be.visible"
    );
    // selecting the other option to check if the custom is visible
    cy.handleBaseSingleSelect({
      selector: '[data-cy="my-info-primary-language-select-group"]',
      text: "other",
      errorMessage: config.errorMessage,
    });
    cy.get('[data-cy="my-info-primary-language-input-group"]').should(
      "be.visible"
    );

    // home address and phone
    cy.get('[data-cy="my-info-home-address"]').should("be.visible");
    // country
    cy.get('[data-cy="my-info-home-address-country-group"]').should(
      "be.visible"
    );
    cy.handleBaseSingleSelect({
      selector: '[data-cy="my-info-home-address-country-group"]',
      text: "united states",
      errorMessage: config.errorMessage,
    });
    // address line 1
    cy.get('[data-cy="my-info-home-address-address-line-1-group"]').should(
      "be.visible"
    );
    // address line 2
    cy.get('[data-cy="my-info-home-address-address-line-2-group"]').should(
      "be.visible"
    );
    // city
    cy.get('[data-cy="my-info-home-address-city-group"]').should("be.visible");
    // state
    cy.get('[data-cy="my-info-home-address-state-group"]').should("be.visible");
    // zip/postal code
    cy.get('[data-cy="my-info-home-address-zip-code-group"]').should(
      "be.visible"
    );
    // section Ethnic/racial background
    cy.get('[data-cy="my-info-ethnic-racial-background"] ').should(
      "be.visible"
    );
    // Are you Hispanic/Latino?
    cy.get(
      '[data-cy="my-info-ethic-racial-background-is-hispanic-latino-group"] '
    ).should("be.visible");
    // What is your race?
    cy.get('[data-cy="my-info-ethic-racial-background-race-group"] ').should(
      "be.visible"
    );
    // U.S. citizenship
    cy.get('[data-cy="my-info-us-citizenship"] ').should("be.visible");
    cy.get('[data-cy="my-info-us-citizenship-is-us-citizen-group"] ').should(
      "be.visible"
    );
    // Parent or legal guardian
    cy.get('[data-cy="my-info-parent-legal-guardian"] ').should("be.visible");
    // first name
    cy.get(
      '[data-cy="my-info-parent-legal-guardian-first-name-group"] '
    ).should("be.visible");
    // last name
    cy.get('[data-cy="my-info-parent-legal-guardian-last-name-group"] ').should(
      "be.visible"
    );
    // is person living
    cy.get('[data-cy="my-info-parent-legal-guardian-is-living-group"] ').should(
      "be.visible"
    );
    // save and clear buttons
    cy.get(
      '[data-cy="my-info-parent-legal-guardian-form-save-button"] '
    ).should("be.visible");
    cy.get(
      '[data-cy="my-info-parent-legal-guardian-form-cancel-button"] '
    ).should("be.visible");
    // previus asu affiliations
    cy.get('[data-cy="my-info-prevoius-asu-affiliation"] ').should(
      "be.visible"
    );
    cy.get(
      '[data-cy="my-info-prevoius-asu-affiliation-affiliations-group"] '
    ).should("be.visible");
    cy.get(
      '[data-cy="my-info-prevoius-asu-affiliation-affiliate-id-group"] '
    ).should("be.visible");
    // us uniformed services
    cy.get('[data-cy="my-info-us-uniformed-services"] ').should("be.visible");
    cy.get('[data-cy="my-info-us-uniformed-services-relation-group"] ').should(
      "be.visible"
    );
    // partner benefits
    cy.get('[data-cy="my-info-partner-benefits"] ').should("be.visible");
    cy.get(
      '[data-cy="my-info-partner-benefits-education-benefit-group"] '
    ).should("be.visible");

    // floating need help button
    cy.get("[data-cy='ug-app-floating-need-help-button']").should("be.visible");
    // open the sidebar
    cy.get("[data-cy='ug-app-floating-need-help-button']").click();
    // close it
    cy.get("[data-cy='ug-app-floating-need-help-sidebar-back-button']").click();
  });
});

// SECTION: Former name
describe("formerNames tests", () => {
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("table to be empty and have add former name button", () => {
    cy.get("[data-cy='my-information-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          let formerNameLength = ugAppStore.formerNames.length;
          expect(formerNameLength).to.be.equal(0);
          // table should be empty and not be visible initially in the dom and add former name button should be visible
          cy.get('[data-cy="my-info-former-name"]')
            .find('[data-cy="my-info-former-name-table"]')
            .should("not.exist");
        });
      });
  });

  it("add, remove, and edit functionality with cancel and save buttons visibility", () => {
    cy.get("[data-cy='my-information-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          let formerNameLength = ugAppStore.formerNames.length;
          expect(formerNameLength).to.be.equal(0);
          // add a name and check for table existence
          // Add former name
          cy.handleButton({
            buttonSelector: '[data-cy="my-info-former-name-add-new-button"]',
          });
          cy.handleButton({
            buttonSelector: '[data-cy="my-info-former-name-save-form-button"]',
          });
          // Handle first name and last name inputs using the abstract function
          cy.handleBaseInput({
            selector: '[data-cy="my-info-former-name-first-name-group"]',
            text: "A",
          });
          cy.handleBaseInput({
            selector: '[data-cy="my-info-former-name-last-name-group"]',
            text: "J",
          });
          cy.handleButton({
            buttonSelector: '[data-cy="my-info-former-name-save-form-button"]',
          });
          // checking if the table is updated
          cy.get('[data-cy="my-info-former-name-table"]')
            .contains("td", `${"A"} ${"J"}`)
            .should("be.visible");

          // edit the former name
          cy.get('[data-cy="my-info-former-name-table"] a').first().click();

          // check for cancel and save buttons to be visible
          cy.get('[data-cy="my-info-former-name-cancel-form-button"]').should(
            "be.visible"
          );
          cy.get('[data-cy="my-info-former-name-save-form-button"]').should(
            "be.visible"
          );

          // check for first name and last name inputs to be as expected
          cy.get('[data-cy="my-info-former-name-first-name-group"]')
            .find("input")
            .should("have.value", "A");
          cy.get('[data-cy="my-info-former-name-last-name-group"]')
            .find("input")
            .should("have.value", "J");

          // Handle first name and last name inputs using the abstract function
          cy.handleBaseInput({
            selector: '[data-cy="my-info-former-name-first-name-group"]',
            text: "AA",
          });
          cy.handleBaseInput({
            selector: '[data-cy="my-info-former-name-last-name-group"]',
            text: "JJ",
          });
          // Save button
          cy.handleButton({
            buttonSelector: '[data-cy="my-info-former-name-save-form-button"]',
          });
          // checking if the table is updated
          cy.get('[data-cy="my-info-former-name-table"]')
            .contains("td", `${"AA"} ${"JJ"}`)
            .should("be.visible");

          // remove the former name
          cy.get('[data-cy="my-info-former-name-table"] a').last().click();
          // check for delete and cancel buttons to be visible
          cy.get("[data-cy='my-info-former-name-modal-close-button']").should(
            "be.visible"
          );
          cy.get("[data-cy='my-info-former-name-modal-delete-button']").should(
            "be.visible"
          );
          // click on delete button
          cy.get("[data-cy='my-info-former-name-modal-delete-button']").click();
          // check for table to be empty
          cy.get('[data-cy="my-info-former-name"]')
            .find('[data-cy="my-info-former-name-table"]')
            .should("not.exist");
          // check formerName length to be 0
          expect(ugAppStore.formerNames.length).to.be.equal(0);
        });
      });
  });

  it("checking max length former name", () => {
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/names`,
      config.sectionFormerName.formerNamesMaxLength
    ).as("getFormerNames");

    cy.get("[data-cy='my-information-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          const formerNameLength = ugAppStore.formerNames.length;
          expect(formerNameLength).to.be.equal(10);
          // if 10 former names entered checking if the add new button is disabled
          cy.get('[data-cy="my-info-former-name-add-new-button"]').should(
            formerNameLength < 10 ? "be.visible" : "be.disabled"
          );
          // if 10 former names entered checking if the error message is displayed
          cy.get('[data-cy="my-info-former-name-max-limit-message"]')
            .should("be.visible")
            .and("contain", "Reached maximum limit");
        });
      });
  });

  it("checking all error messages", () => {
    cy.get("[data-cy='my-information-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        // Add former name
        cy.handleButton({
          buttonSelector: '[data-cy="my-info-former-name-add-new-button"]',
        });

        config.sectionFormerName.formerNamesErrorMessages.forEach(
          (formerName) => {
            // Handle first name
            cy.get('[data-cy="my-info-former-name-first-name-group"]').type(
              formerName.firstName
            );
            cy.get(
              '[data-cy="my-info-former-name-first-name-group"] div.invalid-feedback'
            )
              .should("be.visible")
              .contains(formerName.errorMessage);
            cy.get('[data-cy="my-info-former-name-first-name-group"]').clear();

            // Handle last name
            cy.get('[data-cy="my-info-former-name-last-name-group"]').type(
              formerName.lastName
            );
            cy.get(
              '[data-cy="my-info-former-name-last-name-group"] div.invalid-feedback'
            )
              .should("be.visible")
              .contains(formerName.errorMessage);
            cy.get('[data-cy="my-info-former-name-last-name-group"]').clear();
          }
        );
      });
  });
});

// SECTION: Primary language spoken at home
describe("primary language tests", () => {
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("checking input box for english", () => {
    cy.get('[data-cy="my-info-primary-language-select-group"] input').as(
      "primaryLanguageChoice"
    );
    cy.get("@primaryLanguageChoice").type(
      config.sectionPrimaryLanguage.primaryLanguage.primaryLanguage
    );
    cy.get("@primaryLanguageChoice").type("{enter}");
  });

  it("checking input box for other", () => {
    cy.get('[data-cy="my-info-primary-language-select-group"] input').as(
      "primaryLanguageChoice"
    );
    cy.get("@primaryLanguageChoice").type(
      config.sectionPrimaryLanguage.primaryLanguage.otherLanguage
    );
    cy.get("@primaryLanguageChoice").type("{enter}");
    cy.get('[data-cy="my-info-primary-language-input-group"] input').as(
      "primaryLanguageInput"
    );
    cy.get("@primaryLanguageInput").should("be.visible");
    cy.get("@primaryLanguageInput").type("English{enter}");
  });
});

// SECTION: Home address
describe("home address tests", () => {
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("home address UI assertions", () => {
    // home address and phone
    cy.get('[data-cy="my-info-home-address"]').should("be.visible");
    // country
    cy.get('[data-cy="my-info-home-address-country-group"]').should(
      "be.visible"
    );
    cy.handleBaseSingleSelect({
      selector: '[data-cy="my-info-home-address-country-group"]',
      text: config.sectionHomeAddress.homeAddress.country,
    });
    // address line 1
    cy.get('[data-cy="my-info-home-address-address-line-1-group"]').should(
      "be.visible"
    );
    // address line 2
    cy.get('[data-cy="my-info-home-address-address-line-2-group"]').should(
      "be.visible"
    );
    // city
    cy.get('[data-cy="my-info-home-address-city-group"]').should("be.visible");
    // state
    cy.get('[data-cy="my-info-home-address-state-group"]').should("be.visible");
    // zip/postal code
    cy.get('[data-cy="my-info-home-address-zip-code-group"]').should(
      "be.visible"
    );

    // Checking if the phone number info is visible
    cy.get('[data-cy="my-info-home-address-phone-numbers-info"]').should(
      "be.visible"
    );
    // navigate to profile page by clicking on the link
    cy.get('[data-cy="my-info-home-address-phone-numbers-info"] a')
      .should("be.visible")
      .contains("profile")
      .click();
  });
});

// SECTION: Ethnic/racial background
describe("ethnical/racial background tests", () => {
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("is student is Hispanic/Latino and if 'isOriginAvailable'", () => {
    let race = [];
    cy.handleRadioButton({
      radioSelector: `[data-cy='my-info-ethic-racial-background-is-hispanic-latino-group']  div:nth-of-type(${1}) > label`,
    });
    // Select some option from dropdown
    cy.handleBaseSingleSelect({
      selector:
        '[data-cy="my-info-ethic-racial-background-hispanic-latino-origin-group"]',
      text: config.sectionEthnicities.hispanic,
    });

    cy.configStore().then((store) => {
      let options = store.ethnicities
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
          isOriginAvailable: option.ethnicGroups.length > 1,
        };
        race.push(item);
      });

      race.forEach((item) => {
        cy.get(
          `[data-cy="my-info-ethic-racial-background-race-group"] input`
        ).type(`${item.ethnicCategoryDescription}{enter}`);
        if (item.isOriginAvailable) {
          cy.get(
            `[data-cy="my-info-ethic-racial-background-${item.ethnicCategoryDescription
              .toLowerCase()
              .replace(" ", "-")}-race-origin-group"]`
          ).should("exist");
        }
        cy.get(
          '[data-cy="my-info-ethic-racial-background-primary-race-group"]'
        ).should("exist");
      });
    });
  });

  it("is student not Hispanic/Latino and if 'isOriginAvailable' is not eligible", () => {
    cy.handleRadioButton({
      radioSelector: `[data-cy='my-info-ethic-racial-background-is-hispanic-latino-group']  div:nth-of-type(${1}) > label`,
    });
    // Select option from dropdown
    cy.handleBaseSingleSelect({
      selector:
        '[data-cy="my-info-ethic-racial-background-hispanic-latino-origin-group"]',
      text: config.sectionEthnicities.hispanic,
    });

    cy.get('[data-cy="my-info-ethic-racial-background-race-group"] input').type(
      "Black{enter}"
    );
    cy.get(
      '[data-cy="my-info-ethic-racial-background-primary-race-group"]'
    ).should("exist");

    cy.get('[data-cy="my-info-ethic-racial-background-race-group"] input').type(
      "White{enter}"
    );
    cy.get(
      '[data-cy="my-info-ethic-racial-background-primary-race-group"]'
    ).should("exist");
  });
});

// SECTION: U S Citizenship
describe("US citizenship tests", () => {
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("if user opts selection as 'is an U S citizen'", () => {
    cy.handleRadioButton({
      radioSelector: `[data-cy='my-info-us-citizenship-is-us-citizen-group'] [data-cy='radio-group'] > div:nth-of-type(${1}) > label`,
    });
    // should be visible
    cy.get('[data-cy="my-info-us-citizenship-ssn-group"]').should("be.visible");
    cy.get('[data-cy="my-info-us-citizenship-birth-country-group"]').should(
      "be.visible"
    );
    // should not be visible
    cy.get('[data-cy="my-info-us-citizenship"]')
      .find('[data-cy="my-info-us-citizenship-visa-type-group"] input')
      .should("not.exist");
  });

  it("if user opts selection as 'is not an U S citizen'", () => {
    cy.handleRadioButton({
      radioSelector: `[data-cy='my-info-us-citizenship-is-us-citizen-group'] [data-cy='radio-group'] > div:nth-of-type(${2}) > label`,
    });
    cy.get('[data-cy="my-info-us-citizenship-visa-type-group"]').should(
      "be.visible"
    );
    cy.get('[data-cy="my-info-us-citizenship-visa-type-group"] input').type(
      config.sectionUSCitizenship.usVisaTypeF1 + "{enter}"
    );
    // should exist
    cy.get('[data-cy="my-info-us-citizenship"]')
      .find('[data-cy="my-info-us-citizenship-ssn-group"]')
      .should("exist");
    cy.get('[data-cy="my-info-us-citizenship"]')
      .find('[data-cy="my-info-us-citizenship-birth-country-group"]')
      .should("exist");
  });

  it("if user opts selection as 'visa type f-1 and i-20 section to be visible'", () => {
    //is US citizen
    cy.handleRadioButton({
      radioSelector: `[data-cy='my-info-us-citizenship-is-us-citizen-group'] [data-cy='radio-group'] > div:nth-of-type(${2}) > label`,
    });
    // visa type
    cy.handleBaseSingleSelect({
      selector: '[data-cy="my-info-us-citizenship-visa-type-group"]',
      text: config.sectionUSCitizenship.usVisaTypeF1,
    });
    // alert for f-1 visa type
    cy.get('[data-cy="my-info-us-citizenship-f1-visa-warning"]').should(
      "be.visible"
    );
    // should be visible
    cy.get('[data-cy="my-info-us-citizenship-issuing-i20-group"]').should(
      "be.visible"
    );
    cy.get(
      '[data-cy="my-info-us-citizenship-shipping-address-options-group"]'
    ).should("be.visible");
  });

  it("if user opts selection as 'visa type j-1 and i-20 section to be visible'", () => {
    //is US citizen
    cy.handleRadioButton({
      radioSelector: `[data-cy='my-info-us-citizenship-is-us-citizen-group'] [data-cy='radio-group'] > div:nth-of-type(${2}) > label`,
    });
    // visa type
    cy.handleBaseSingleSelect({
      selector: '[data-cy="my-info-us-citizenship-visa-type-group"]',
      text: config.sectionUSCitizenship.usVisaTypeExchangeVisitorJ1,
    });
    cy.get('[data-cy="my-info-us-citizenship-issuing-i20-group"]').should(
      "be.visible"
    );
  });

  it("if user opts selection as 'other as visa choice and other visa choices dropdown to be visible'", () => {
    // is US citizen
    cy.handleRadioButton({
      radioSelector: `[data-cy='my-info-us-citizenship-is-us-citizen-group'] [data-cy='radio-group'] > div:nth-of-type(${2}) > label`,
    });
    // visa type
    cy.handleBaseSingleSelect({
      selector: '[data-cy="my-info-us-citizenship-visa-type-group"]',
      text: config.sectionUSCitizenship.other,
    });
    cy.get('[data-cy="my-info-us-citizenship-other-visa-group"]').should(
      "be.visible"
    );
  });

  it("if user opts selection 'international shipping address and if selected U S as home address'", () => {
    // select home address as US
    cy.handleBaseSingleSelect({
      selector: '[data-cy="my-info-home-address-country-group"]',
      text: config.sectionHomeAddress.homeAddress.country,
    });
    // is US citizen
    cy.handleRadioButton({
      radioSelector: `[data-cy='my-info-us-citizenship-is-us-citizen-group'] [data-cy='radio-group'] > div:nth-of-type(${2}) > label`,
    });
    // visa type
    cy.handleBaseSingleSelect({
      selector: '[data-cy="my-info-us-citizenship-visa-type-group"]',
      text: config.sectionUSCitizenship.usVisaTypeF1,
    });
    cy.get('[data-cy="my-info-us-citizenship-international-address"]').should(
      "be.visible"
    );
    cy.get('[data-cy="my-info-us-citizenship-issuing-i20-group"]').should(
      "be.visible"
    );
    cy.get(
      '[data-cy="my-info-us-citizenship-shipping-address-options-group"]'
    ).should("be.visible");
  });
});

// SECTION: Parent or legal guardian
describe("parent or legal guardian tests", () => {
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("parent or legal guardian 'yes' as a selection", () => {
    cy.ugApplicationStore().then((ugAppStore) => {
      let guardiansLength = ugAppStore.guardians.length;
      expect(guardiansLength).to.be.equal(0);
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-first-name-group"]'
      ).should("exist");
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-last-name-group"]'
      ).should("exist");

      // is person living?
      // select yes as a selection
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-is-living-group"] div:nth-of-type(1) > label'
      ).click();
      // check for visible fields in UI
      cy.get('[data-cy="my-info-parent-legal-guardian-email-group"]').should(
        "be.visible"
      );
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-phone-number-group"]'
      ).should("be.visible");
      cy.get('[data-cy="my-info-parent-legal-guardian-relation-group"]').should(
        "be.visible"
      );
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-highest-schooling-level-group"]'
      ).should("be.visible");
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-attended-asu-group"]'
      ).should("be.visible");
      // save and cancel buttons
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-form-save-button"]'
      ).should("be.visible");
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-form-cancel-button"]'
      ).should("be.visible");
    });
  });

  it("parent or legal guardian 'no' as a selection", () => {
    cy.ugApplicationStore().then((ugAppStore) => {
      let guardiansLength = ugAppStore.guardians.length;
      expect(guardiansLength).to.be.equal(0);
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-first-name-group"]'
      ).should("exist");
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-last-name-group"]'
      ).should("exist");
      // is person living?
      // select yes as a selection
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-is-living-group"] div:nth-of-type(2) > label'
      ).click();
      // check for not visible fields in UI
      cy.get('[data-cy="my-info-parent-legal-guardian"]')
        .find('[data-cy="my-info-parent-legal-guardian-email-group"]')
        .should("not.exist");
      cy.get('[data-cy="my-info-parent-legal-guardian"]')
        .find('[data-cy="my-info-parent-legal-guardian-phone-number-group"]')
        .should("not.exist");
      // check for visible fields in UI
      cy.get('[data-cy="my-info-parent-legal-guardian-relation-group"]').should(
        "be.visible"
      );
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-highest-schooling-level-group"]'
      ).should("be.visible");
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-attended-asu-group"]'
      ).should("be.visible");
      // save and cancel buttons
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-form-save-button"]'
      ).should("be.visible");
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-form-cancel-button"]'
      ).should("be.visible");
    });
  });

  it("table by adding an item and edit, save, and delete actions", () => {
    cy.ugApplicationStore().then((ugAppStore) => {
      let guardiansLength = ugAppStore.guardians.length;
      expect(guardiansLength).to.be.equal(0);
      cy.get('[data-cy="my-info-parent-legal-guardian-first-name-group"]')
        .type("AA")
        .type("{enter}");
      cy.get('[data-cy="my-info-parent-legal-guardian-last-name-group"]')
        .type("BB")
        .type("{enter}");
      // is person living?
      // select yes as a selection
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-is-living-group"] div:nth-of-type(1) > label'
      ).click();
      cy.get('[data-cy="my-info-parent-legal-guardian-email-group"] input')
        .type("test@asu.edu")
        .type("{enter}");
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-phone-number-group"] input'
      )
        .type("0123456789")
        .type("{enter}");
      cy.get('[data-cy="my-info-parent-legal-guardian-relation-group"] input')
        .type("mother")
        .type("{enter}");
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-highest-schooling-level-group"] input'
      )
        .type("high school")
        .type("{enter}");
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-attended-asu-group"] div:nth-of-type(1) > label'
      ).click();
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-form-save-button"]'
      ).click();
      cy.get('[data-cy="my-info-parent-legal-guardian-details-table"')
        .contains("td", "AA BB")
        .should("be.visible");
      // edit the guardian name from the table and check for persistence
      cy.get('[data-cy="my-info-parent-legal-guardian-details-table"] a')
        .first()
        .click();
      cy.get('[data-cy="my-info-parent-legal-guardian-first-name-group"]')
        .find("input")
        .should("have.value", "AA");
      cy.get('[data-cy="my-info-parent-legal-guardian-last-name-group"]')
        .find("input")
        .should("have.value", "BB");
      cy.get('[data-cy="my-info-parent-legal-guardian-email-group"]')
        .find("input")
        .should("have.value", "test@asu.edu");
      cy.get('[data-cy="my-info-parent-legal-guardian-phone-number-group"]')
        .find("input")
        .should("have.value", "0123456789");
      cy.get('[data-cy="my-info-parent-legal-guardian-relation-group"]')
        .find("input")
        .should("exist");
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-highest-schooling-level-group"]'
      )
        .find("input")
        .should("exist");
      // change first name and last name and check for updated table
      cy.get('[data-cy="my-info-parent-legal-guardian-first-name-group"]')
        .find("input")
        .clear()
        .type("CC")
        .type("{enter}");
      cy.get('[data-cy="my-info-parent-legal-guardian-last-name-group"]')
        .find("input")
        .clear()
        .type("DD")
        .type("{enter}");
      cy.get(
        '[data-cy="my-info-parent-legal-guardian-form-save-button"]'
      ).click();

      cy.get('[data-cy="my-info-parent-legal-guardian-details-table"')
        .contains("td", "CC DD")
        .should("be.visible");
      // delete the guardian name from the table and check for updated table
      cy.get('[data-cy="my-info-parent-legal-guardian-details-table"] a')
        .last()
        .click();
      cy.get(
        "[data-cy='my-info-parent-legal-guardian-modal-close-button']"
      ).should("be.visible");
      cy.get(
        "[data-cy='my-info-parent-legal-guardian-modal-delete-button']"
      ).should("be.visible");
      // click on delete button
      cy.get(
        "[data-cy='my-info-parent-legal-guardian-modal-delete-button']"
      ).click();
      // check if table does not exist
      cy.get('[data-cy="my-info-parent-legal-guardian"')
        .find('[data-cy="my-info-parent-legal-guardian-details-table"]')
        .should("not.exist");
    });
  });

  it("checking max-length table by adding n item", () => {
    cy.ugApplicationStore().then((ugAppStore) => {
      const guardiansArray = [
        {
          firstName: "AA",
          lastName: "BB",
          email: "test@asu.edu",
          number: "0123456789",
          relation: "mother",
          schooling: "high school",
        },
        {
          firstName: "CC",
          lastName: "DD",
          email: "test@asu.edu",
          number: "0123456789",
          relation: "father",
          schooling: "high school",
        },
      ];
      let guardiansLength = ugAppStore.guardians.length;
      expect(guardiansLength).to.be.equal(0);
      guardiansArray.forEach((guardian) => {
        cy.get('[data-cy="my-info-parent-legal-guardian-first-name-group"]')
          .type(guardian.firstName)
          .type("{enter}");
        cy.get('[data-cy="my-info-parent-legal-guardian-last-name-group"]')
          .type(guardian.lastName)
          .type("{enter}");
        // is person living?
        // select yes as a selection
        cy.get(
          '[data-cy="my-info-parent-legal-guardian-is-living-group"] div:nth-of-type(1) > label'
        ).click();
        cy.get('[data-cy="my-info-parent-legal-guardian-email-group"] input')
          .type(guardian.email)
          .type("{enter}");
        cy.get(
          '[data-cy="my-info-parent-legal-guardian-phone-number-group"] input'
        )
          .type(guardian.number)
          .type("{enter}");
        cy.get('[data-cy="my-info-parent-legal-guardian-relation-group"] input')
          .type(guardian.relation)
          .type("{enter}");
        cy.get(
          '[data-cy="my-info-parent-legal-guardian-highest-schooling-level-group"] input'
        )
          .type(guardian.schooling)
          .type("{enter}");
        cy.get(
          '[data-cy="my-info-parent-legal-guardian-attended-asu-group"] div:nth-of-type(1) > label'
        ).click();
        cy.get(
          '[data-cy="my-info-parent-legal-guardian-form-save-button"]'
        ).click();
        cy.get('[data-cy="my-info-parent-legal-guardian-details-table"')
          .contains("td", "AA BB")
          .should("be.visible");
        guardiansLength++;
        if (guardiansLength < 2) {
          cy.get(
            '[data-cy="my-info-parent-legal-guardian-add-new-guardian-button"]'
          ).click();
        } else if (guardiansLength === 2) {
          cy.get(
            '[data-cy="my-info-parent-legal-guardian-add-new-guardian-button"]'
          ).should("be.disabled");
        }
      });
    });
  });
});

// SECTION: Previous ASU affiliation
describe("previous ASU affiliation tests", () => {
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("checking previous asu affiliation UI visibility", () => {
    cy.get('[data-cy="my-info-prevoius-asu-affiliation-affiliations-group"]')
      .should("be.visible")
      .and("exist");
    cy.get('[data-cy="my-info-prevoius-asu-affiliation"]')
      .should("be.visible")
      .and("exist");
    // What is your ASU Affiliate ID? should be visible
    cy.get('[data-cy="my-info-prevoius-asu-affiliation"] input')
      .should("be.visible")
      .and("exist");
  });
});

// SECTION: US uniformed services
describe("us uniformed services tests", () => {
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("us uniformed services dependent", () => {
    cy.handleBaseSingleSelect({
      selector: `[data-cy="my-info-us-uniformed-services-relation-group"]`,
      text: config.sectionMilitaryAffiliation.areYouAffiliatedAsDependent,
    });
    // should be visible
    cy.get('[data-cy="my-info-us-uniformed-services-branch-group"]').should(
      "be.visible"
    );
    cy.get(
      '[data-cy="my-info-us-uniformed-services-veterans-benefits-group"]'
    ).should("be.visible");
    // should not be visible
    cy.get('[data-cy="my-info-us-citizenship"')
      .find('[data-cy="my-info-us-uniformed-services-status-group"]')
      .should("not.exist");
  });

  it("us uniformed service member or veteran", () => {
    cy.handleBaseSingleSelect({
      selector: `[data-cy="my-info-us-uniformed-services-relation-group"]`,
      text: config.sectionMilitaryAffiliation.areYouAffiliatedAsServiceMember,
    });
    cy.get('[data-cy="my-info-us-uniformed-services-status-group"]').should(
      "be.visible"
    );
    cy.get('[data-cy="my-info-us-uniformed-services-branch-group"]').should(
      "be.visible"
    );
    cy.get(
      '[data-cy="my-info-us-uniformed-services-veterans-benefits-group"]'
    ).should("be.visible");
    cy.get(
      '[data-cy="my-info-us-uniformed-services-request-transcript-group"]'
    ).should("be.visible");
  });

  it("none of this options apply to me", () => {
    cy.handleBaseSingleSelect({
      selector: `[data-cy="my-info-us-uniformed-services-relation-group"]`,
      text: config.sectionMilitaryAffiliation.areYouAffiliatedAsNone,
    });

    cy.get('[data-cy="my-info-us-citizenship"')
      .find('[data-cy="my-info-us-uniformed-services-branch-group"]')
      .should("not.exist");

    cy.get('[data-cy="my-info-us-citizenship"')
      .find('[data-cy="my-info-us-uniformed-services-veterans-benefits-group"]')
      .should("not.exist");

    cy.get('[data-cy="my-info-us-citizenship"')
      .find('[data-cy="my-info-us-uniformed-services-status-group"]')
      .should("not.exist");

    cy.get('[data-cy="my-info-us-citizenship"')
      .find('[data-cy="my-info-us-uniformed-services-branch-group"]')
      .should("not.exist");

    cy.get('[data-cy="my-info-us-citizenship"')
      .find('[data-cy="my-info-us-uniformed-services-veterans-benefits-group"]')
      .should("not.exist");

    cy.get('[data-cy="my-info-us-citizenship"')
      .find(
        '[data-cy="my-info-us-uniformed-services-request-transcript-group"]'
      )
      .should("not.exist");
  });
});

// SECTION: Partner benefits
describe("partner benefits tests", () => {
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("partner benefits 'yes' as a selection", () => {
    // select yes for partner benefits
    cy.get(
      `[data-cy='my-info-partner-benefits-education-benefit-group'] div:nth-of-type(1) > label`
    ).click();
    // type in current employer group
    cy.get(
      "[data-cy='my-info-partner-benefits-current-employer-group'] input"
    ).type(config.sectionPartnerBenefits.choice);
    // check for current employer group to be visible
    cy.get(
      '[data-cy="my-info-partner-benefits-current-employer-group"]'
    ).should("be.visible");
  });

  it("partner benefits 'no' as a selection", () => {
    // select no for partner benefits
    cy.get(
      `[data-cy='my-info-partner-benefits-education-benefit-group'] div:nth-of-type(2) > label`
    );
    // check for current employer group to not be visible
    cy.get('[data-cy="my-info-partner-benefits-education-benefit-group"]')
      .find("[data-cy='my-info-partner-benefits-current-employer-group']")
      .should("not.exist");
  });
});

describe("two-way data binding tests", () => {
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("checking two-way data binding for all fields", () => {
    const {
      application,
      names,
      addresses,
      ethnicities,
      guardians,
      militaryaffiliations,
      visasupplementals,
      sarquestionresponses,
    } = config.twoWayDataBinding.responses;

    const apis = [
      {
        url: `${Cypress.env("baseUrl")}/api/ug/applications`,
        response: application,
      },
      {
        url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/names`,
        response: names,
      },
      {
        url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/addresses`,
        response: addresses,
      },
      {
        url: `${Cypress.env(
          "baseUrl"
        )}/api/ug/applications/${appId}/ethnicities`,
        response: ethnicities,
      },
      {
        url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/guardians`,
        response: guardians,
      },
      {
        url: `${Cypress.env(
          "baseUrl"
        )}/api/ug/applications/${appId}/militaryaffiliations`,
        response: militaryaffiliations,
      },
      {
        url: `${Cypress.env(
          "baseUrl"
        )}/api/ug/applications/${appId}/visasupplementals`,
        response: visasupplementals,
      },
      {
        url: `${Cypress.env(
          "baseUrl"
        )}/api/ug/applications/${appId}/sarquestionresponses`,
        response: sarquestionresponses,
      },
    ];

    apis.forEach((api) => cy.intercept("GET", api.url, api.response));

    cy.get('[data-cy="my-information-view"]', {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.configStore().then((configStore) => {
            cy.userStore().then((userStore) => {
              // SECTION: Former name
              const formerNames = ugAppStore.formerNames.length;
              const allNames = ugAppStore.formerNames;
              expect(formerNames).to.be.equal(1);
              cy.get('[data-cy="my-info-former-name-table"]')
                .contains(
                  "td",
                  `${allNames[0].firstName} ${allNames[0].lastName}`
                )
                .should("be.visible");

              // SECTION: Primary language spoken at home
              if (userStore.primaryLanguageAtHome == "ace") {
                cy.get(
                  '[data-cy="my-info-primary-language-select-group"] .vs__selected'
                ).contains("Aceh");
              }

              // SECTION: Home address
              cy.get(
                '[data-cy="my-info-home-address-country-group"] .vs__selected'
              ).contains(configStore.selectedHomeAddressCountry.text);
              cy.get(
                '[data-cy="my-info-home-address-address-line-1-group"] input'
              ).should("have.value", ugAppStore.addresses[0].street1);
              cy.get(
                '[data-cy="my-info-home-address-address-line-2-group"] input'
              ).should("have.value", ugAppStore.addresses[0].street2);
              cy.get(
                '[data-cy="my-info-home-address-city-group"] input'
              ).should("have.value", ugAppStore.addresses[0].city);
              cy.get(
                '[data-cy="my-info-home-address-state-group"] input'
              ).should("have.value", ugAppStore.addresses[0].stateProvince);

              // SECTION: Ethnic/racial background
              cy.get(
                '[data-cy="my-info-ethic-racial-background-hispanic-latino-origin-group"] .vs__selected'
              ).contains("Argentinian");
              cy.get(
                '[data-cy="my-info-ethic-racial-background-race-group"] .vs__selected'
              ).contains("Asian");
              cy.get(
                '[data-cy="my-info-ethic-racial-background-asian-race-origin-group"] .vs__selected'
              ).contains("Asian Indian");
              cy.get(
                '[data-cy="my-info-ethic-racial-background-american-indian/alaska native-race-origin-group"] .vs__selected'
              ).contains("Abenaki");
              cy.get(
                '[data-cy="my-info-ethic-racial-background-primary-race-group"] .vs__selected'
              ).contains("Abenaki");

              // SECTION: U S Citizenship
              if (userStore.citizenCountry === "USA") {
                cy.get(
                  '[data-cy="my-info-us-citizenship-is-us-citizen-group"] :checked'
                )
                  .should("be.checked")
                  .and("have.value", "true");
              }
              cy.get(
                '[data-cy="my-info-us-citizenship-ssn-group"] input'
              ).should("have.value", "XXX-XX-XXXX");
              cy.get(
                '[data-cy="my-info-us-citizenship-birth-country-group"] .vs__selected'
              ).contains("Afghanistan");

              // SECTION: Parent or legal guardian
              cy.get('[data-cy="my-info-parent-legal-guardian-details-table"')
                .contains(
                  "td",
                  ugAppStore.guardians[0].firstName +
                    " " +
                    ugAppStore.guardians[0].lastName
                )
                .should("be.visible");

              // SECTION: US uniformed services
              cy.get(
                '[data-cy="my-info-us-uniformed-services-relation-group"] .vs__selected'
              ).contains("service member");
              cy.get(
                '[data-cy="my-info-us-uniformed-services-branch-group"] .vs__selected'
              ).contains("United States Army");
              cy.get(
                '[data-cy="my-info-us-uniformed-services-status-group"] :checked'
              )
                .should("be.checked")
                .and("have.value", ugAppStore.militaryaffiliations.status);

              cy.get(
                '[data-cy="my-info-us-uniformed-services-veterans-benefits-group"] :checked'
              )
                .should("be.checked")
                .and(
                  "have.value",
                  ugAppStore.militaryaffiliations.vaEducationBenefits
                );

              // SECTION: Partner benefits
              cy.get(
                '[data-cy="my-info-partner-benefits-education-benefit-group"] :checked'
              )
                .should("be.checked")
                .and(
                  "have.value",
                  ugAppStore.myInfoSar.partnerBenefits.educationBenefit
                );
              cy.get(
                '[data-cy="my-info-partner-benefits-current-employer-group"] .vs__selected'
              ).contains("Amazon career choice");
            });
          });
        });
      });
  });

  it("two-way data binding tests for no a U S citizen, i20, and service member", () => {
    const { application, addresses, militaryaffiliations } =
      config.twoWayDataBindingI20AndMilitary.responses;

    const apis = [
      {
        url: `${Cypress.env("baseUrl")}/api/ug/applications`,
        response: application,
      },
      {
        url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/addresses`,
        response: addresses,
      },
      {
        url: `${Cypress.env(
          "baseUrl"
        )}/api/ug/applications/${appId}/militaryaffiliations`,
        response: militaryaffiliations,
      },
    ];

    apis.forEach((api) => {
      cy.intercept("GET", api.url, api.response);
    });

    cy.visit(`ug-app/${appId}/my-information`);

    cy.get('[data-cy="my-information-view"]', {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          // SECTION: International address
          cy.get(
            '[data-cy="my-info-us-citizenship-visa-type-group"] .vs__selected'
          )
            .contains("Student (F-1)")
            .should("be.visible");

          cy.get(
            '[data-cy="my-info-us-citizenship-citizenship-country-group"] .vs__selected'
          )
            .contains("India")
            .should("be.visible");

          cy.get(
            '[data-cy="my-info-us-citizenship-birth-country-group"] .vs__selected'
          )
            .contains("India")
            .should("be.visible");

          // I-20 shipping address
          cy.get(
            '[data-cy="my-info-us-citizenship-shipping-address-options-group"]'
          ).should("be.visible");

          // SECTION: US uniformed services
          cy.get(
            '[data-cy="my-info-us-uniformed-services-relation-group"] .vs__selected'
          )
            .contains("spouse/dependent")
            .should("be.visible");
          cy.get(
            '[data-cy="my-info-us-uniformed-services-branch-group"] .vs__selected'
          )
            .contains("United States Army")
            .should("be.visible");
          cy.get(
            '[data-cy="my-info-us-uniformed-services-veterans-benefits-group"] :checked'
          )
            .should("be.checked")
            .and(
              "have.value",
              ugAppStore.militaryaffiliations.vaEducationBenefits
            );
        });
      });
  });
});

describe("BriteVerify testing for home address", () => {
  before(() => {
    const { myInformation } = config.prefillPageDetails;

    cy.login(userDetails.email, userDetails.password);
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    cy.visit(`ug-app/${appId}/my-information`);
    cy.get("[data-cy=my-information-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.configStore().then((configStore) => {
            configStore.selectHomeAddressCountry(
              myInformation.homeAddress.countryCode
            );
            // submitting my info details
            cy.submitMyInformationDetails(
              ugAppStore,
              myInformation,
              access_token,
              appId
            );
            cy.wait(20000);
            cy.populateUserDetails(appId, access_token, testCaseType);
          });
        });
      });
  });
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);

    cy.intercept("GET", `${Cypress.env("dplBaseUrl")}/codeset/country/*`).as(
      "stateApiIntercept"
    );
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");
  });
  it("US invalid address", () => {
    const { address, response } = config.briteVerifyTestDetails.invalidDetails;
    // intercepting the briteverify response
    cy.intercept(
      "POST",
      `https://bpi.briteverify.com/api/public/v1/fullverify`,
      response
    ).as("briteverifyIntercept");
    cy.get("[data-cy=my-information-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        // submitting the address details
        // Select country
        cy.handleBaseSingleSelect({
          selector: '[data-cy="my-info-home-address-country-group"]',
          text: address.countryCode.text,
          errorMessage: config.errorMessage,
        });
        cy.wait("@stateApiIntercept");
        if (typeof address.stateProvince === "object") {
          // Select state from dropdown
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-info-home-address-state-group"]',
            text: address.stateProvince.text,
          });
        } else {
          // Enter state in the input
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-state-group"]',
            text: address.stateProvince,
          });
        }

        // address line 1
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-address-line-1-group"]',
          text: address.street1,
        });

        // address line 2
        if (address.street2) {
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-address-line-2-group"]',
            text: address.street2,
          });
        }

        // Enter city
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-city-group"]',
          text: address.city,
        });

        // Enter zip code
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-zip-code-group"]',
          text: address.postalCode,
        });

        // click save button
        cy.get("[data-cy='up-app-desktop-footer-save-button']").click();
        cy.wait("@briteverifyIntercept");
        cy.get('[data-cy="my-info-briteverify-alert-modal"]').should(
          "be.visible"
        );
        cy.get('[data-cy="my-info-briteverify-alert-modal-heading"]').should(
          "contain",
          "The address you entered could not be verified:"
        );
        // checking the address details
        cy.get('[data-cy="my-info-briteverify-alert-modal-address-table"]')
          .children()
          .should("contain", "Country")
          .and("contain", `${address.countryCode.text}`)
          .and("contain", "Address line 1")
          .and("contain", `${address.street1}`)
          .and("contain", "Address line 2")
          .and("contain", `${address.street2}`)
          .and("contain", "City")
          .and("contain", `${address.city}`)
          .and("contain", "State")
          .and("contain", `${address.stateProvince.text}`)
          .and("contain", "Zip/Postal code")
          .and("contain", `${address.postalCode}`);

        // checking if the alert message to update the detils is displayed
        cy.get('[data-cy="status-alert"]')
          .should("be.visible")
          .contains(
            "Would you like to change this information or submit it as is?"
          );
        cy.get('[data-cy="my-info-briteverify-alert-modal-submit-button"]')
          .scrollIntoView()
          .should("be.visible");
        cy.get(
          '[data-cy="my-info-briteverify-alert-modal-back-button"]'
        ).should("be.visible");

        // clicking the back button and checking if the user is still on my info page
        cy.get(
          '[data-cy="my-info-briteverify-alert-modal-back-button"]'
        ).click();
        cy.url(`ug-app/${appId}/my-information`);
        // click on save button and submitting the details even if its invalid
        cy.get('[data-cy="up-app-desktop-footer-save-button"]').click();
        cy.wait("@briteverifyIntercept");
        cy.get('[data-cy="my-info-briteverify-alert-modal"]').should(
          "be.visible"
        );
        cy.get('[data-cy="my-info-briteverify-alert-modal-submit-button"]')
          .scrollIntoView()
          .click();
        cy.wait("@notificationIntercept", { timeout: 30000 });
        cy.url(`ug-app/${appId}/my-program`);
      });
  });
  it("US valid address", () => {
    const { address, response } = config.briteVerifyTestDetails.validDetails;
    // intercepting the briteverify response
    cy.intercept(
      "POST",
      `https://bpi.briteverify.com/api/public/v1/fullverify`,
      response
    ).as("briteverifyIntercept");

    cy.get("[data-cy=my-information-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        // submitting the address details
        // Select country
        cy.handleBaseSingleSelect({
          selector: '[data-cy="my-info-home-address-country-group"]',
          text: address.countryCode.text,
          errorMessage: config.errorMessage,
        });
        cy.wait("@stateApiIntercept");
        if (typeof address.stateProvince === "object") {
          // Select state from dropdown
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-info-home-address-state-group"]',
            text: address.stateProvince.text,
          });
        } else {
          // Enter state in the input
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-state-group"]',
            text: address.stateProvince,
          });
        }

        // address line 1
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-address-line-1-group"]',
          text: address.street1,
        });

        // address line 2
        if (address.street2) {
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-address-line-2-group"]',
            text: address.street2,
          });
        }

        // Enter city
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-city-group"]',
          text: address.city,
        });

        // Enter zip code
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-zip-code-group"]',
          text: address.postalCode,
        });

        // click save button
        cy.get("[data-cy='up-app-desktop-footer-save-button']").click();
        cy.wait("@briteverifyIntercept");
        // verifying the model is not displayed
        cy.get("body")
          .find('[data-cy="my-info-briteverify-alert-modal"]')
          .should("not.exist");
        cy.wait("@notificationIntercept", { timeout: 30000 });
        cy.url(`ug-app/${appId}/my-program`);
      });
  });

  it("US briteverify corrected address", () => {
    const { address, response } =
      config.briteVerifyTestDetails.correctedDetails;

    // intercepting the briteverify response
    cy.intercept(
      "POST",
      `https://bpi.briteverify.com/api/public/v1/fullverify`,
      response
    ).as("briteverifyIntercept");
    cy.get("[data-cy=my-information-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        // submitting the address details
        // Select country
        cy.handleBaseSingleSelect({
          selector: '[data-cy="my-info-home-address-country-group"]',
          text: address.countryCode.text,
          errorMessage: config.errorMessage,
        });
        cy.wait("@stateApiIntercept");
        if (typeof address.stateProvince === "object") {
          // Select state from dropdown
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-info-home-address-state-group"]',
            text: address.stateProvince.text,
          });
        } else {
          // Enter state in the input
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-state-group"]',
            text: address.stateProvince,
          });
        }
        // address line 1
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-address-line-1-group"]',
          text: address.street1,
        });
        // address line 2
        if (address.street2) {
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-address-line-2-group"]',
            text: address.street2,
          });
        }
        // Enter city
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-city-group"]',
          text: address.city,
        });
        // Enter zip code
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-zip-code-group"]',
          text: address.postalCode,
        });

        // click save button
        cy.get("[data-cy='up-app-desktop-footer-save-button']").click();
        cy.wait("@briteverifyIntercept");
        cy.get('[data-cy="my-info-briteverify-alert-modal"]').should(
          "be.visible"
        );
        // checking if the updated alert text is displayed
        cy.get('[data-cy="my-info-briteverify-alert-modal-heading"]').should(
          "contain",
          "The address you entered has been updated to:"
        );
        // checking the address details and verifying the updated details are displayed
        cy.get('[data-cy="my-info-briteverify-alert-modal-address-table"]')
          .children()
          .and("contain", "Country")
          .and("contain", `${address.countryCode.text}`)
          .and("contain", "Address line 1")
          .and("contain", `${address.street1}`)
          .and("contain", "Address line 2")
          .and("contain", `${address.street2}`)
          .and("contain", "City")
          .and("contain", `${address.city}`)
          .and("contain", "State")
          .and("contain", `${address.stateProvince.text}`)
          .and("contain", "Zip/Postal code")
          .and("not.contain", `${address.postalCode}`)
          .and("contain", `${response.address.zip}`);

        // checing if the alert message to update the detils is displayed
        cy.get('[data-cy="status-alert"]')
          .should("be.visible")
          .contains(
            "Would you like to change this information or submit it as is?"
          );
        cy.get('[data-cy="my-info-briteverify-alert-modal"]').scrollTo(
          "bottom",
          { ensureScrollable: false }
        );
        cy.get(
          '[data-cy="my-info-briteverify-alert-modal-submit-button"]'
        ).should("be.visible");
        cy.get(
          '[data-cy="my-info-briteverify-alert-modal-back-button"]'
        ).should("be.visible");
        // clicking the back button and checking if the user is still on my info page
        cy.get(
          '[data-cy="my-info-briteverify-alert-modal-back-button"]'
        ).click();
        cy.url(`ug-app/${appId}/my-information`);
        // click on save button and submitting the details even if its invalid
        cy.get('[data-cy="up-app-desktop-footer-save-button"]').click();
        cy.wait("@briteverifyIntercept");
        cy.get('[data-cy="my-info-briteverify-alert-modal"]').should(
          "be.visible"
        );
        cy.get(
          '[data-cy="my-info-briteverify-alert-modal-submit-button"]'
        ).click();
        cy.wait("@notificationIntercept", { timeout: 30000 });
        cy.url(`ug-app/${appId}/my-program`);
      });
  });

  it("Verifying the briteverify is triggered for Canada country", () => {
    const { address, response } =
      config.briteVerifyTestDetails.canadaAddressDetails;
    // intercepting the briteverify response
    cy.intercept(
      "POST",
      `https://bpi.briteverify.com/api/public/v1/fullverify`,
      response
    ).as("briteverifyIntercept");
    cy.get("[data-cy=my-information-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        // submitting the address details
        // Select country
        cy.handleBaseSingleSelect({
          selector: '[data-cy="my-info-home-address-country-group"]',
          text: address.countryCode.text,
          errorMessage: config.errorMessage,
        });
        cy.wait("@stateApiIntercept");
        if (typeof address.stateProvince === "object") {
          // Select state from dropdown
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-info-home-address-state-group"]',
            text: address.stateProvince.text,
          });
        } else {
          // Enter state in the input
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-state-group"]',
            text: address.stateProvince,
          });
        }
        // address line 1
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-address-line-1-group"]',
          text: address.street1,
        });
        // address line 2
        if (address.street2) {
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-address-line-2-group"]',
            text: address.street2,
          });
        }
        // Enter city
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-city-group"]',
          text: address.city,
        });
        // Enter zip code
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-zip-code-group"]',
          text: address.postalCode,
        });
        // click save button
        cy.get("[data-cy='up-app-desktop-footer-save-button']").click();
        cy.wait("@briteverifyIntercept");
        cy.get('[data-cy="my-info-briteverify-alert-modal"]').should(
          "be.visible"
        );
      });
  });

  it("Verifying the briteverify is not triggered for country other than US and CA", () => {
    const { address } = config.briteVerifyTestDetails.nonUSandCAAddressDetails;
    cy.get("[data-cy=my-information-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        // submitting the address details
        // Select country
        cy.handleBaseSingleSelect({
          selector: '[data-cy="my-info-home-address-country-group"]',
          text: address.countryCode.text,
          errorMessage: config.errorMessage,
        });
        cy.wait("@stateApiIntercept");
        if (typeof address.stateProvince === "object") {
          // Select state from dropdown
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-info-home-address-state-group"]',
            text: address.stateProvince.text,
          });
        } else {
          // Enter state in the input
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-state-group"]',
            text: address.stateProvince,
          });
        }
        // address line 1
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-address-line-1-group"]',
          text: address.street1,
        });
        // address line 2
        if (address.street2) {
          cy.handleBaseInput({
            selector: '[data-cy="my-info-home-address-address-line-2-group"]',
            text: address.street2,
          });
        }
        // Enter city
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-city-group"]',
          text: address.city,
        });
        // Enter zip code
        cy.handleBaseInput({
          selector: '[data-cy="my-info-home-address-zip-code-group"]',
          text: address.postalCode,
        });

        // click save button
        cy.get("[data-cy='up-app-desktop-footer-save-button']").click();
        cy.get("body")
          .find('[data-cy="my-info-briteverify-alert-modal"]')
          .should("not.exist");
        cy.wait("@notificationIntercept", { timeout: 30000 });
        cy.url(`ug-app/${appId}/my-program`);
      });
  });
});

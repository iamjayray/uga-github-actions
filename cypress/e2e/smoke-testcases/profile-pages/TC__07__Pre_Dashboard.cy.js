/// <reference types="cypress"/>

import { faker } from "@faker-js/faker";

let userDetails = null;
let appId = null;
let access_token = null;
let interceptCounter = 0;
let config = {
  responses: {
    post: {
      uiViewInfo: {
        code: 201,
        data: {
          previousScreen: "ug-app-my-information",
          currentScreen: "ug-app-my-information",
        },
      },
    },
    get: {
      beforeAppCreation: { applications: { code: 200, data: [] } },
    },
  },
};

describe("User Pre Dashboard Tests", () => {
  before(() => {
    cy.fixture("users")
      .then((users) => {
        userDetails = users[1];
      })
      .then(() => {
        // Login
        cy.login(userDetails.email, userDetails.password);
        // Intercept config get calls
        cy.getCookie("access_token").then((item) => {
          access_token = item.value;
          cy.populateUgApplications(access_token).then((response) => {
            console.log(response);
            if (response.data.length > 0) {
              appId = response.data[0].appId;
            }
          });

          cy.visit("/dashboard");
          cy.get('[data-cy="dashboard-dashboard-view"]', {
            timeout: 20000,
          })
            .should("be.visible")
            .then(() => {
              cy.authStore().then((authStore) => {
                authStore.logout();
              });
            });
        });
      });
  });

  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);

    if (interceptCounter === 0) {
      cy.intercept(
        "GET",
        `${Cypress.env("baseUrl")}/api/ug/applications`,
        config.responses.get.beforeAppCreation.applications
      );
      interceptCounter++;
    }
    cy.intercept("POST", `${Cypress.env("baseUrl")}/api/ug/applications`, {
      code: 201,
      data: { appId: appId },
    }).as("applications");

    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/ui/view-info/${appId}`,
      config.responses.post.uiViewInfo
    ).as("uiViewInfo");

    cy.visit("/dashboard");
  });

  afterEach(() => {
    interceptCounter = 0;
    cy.authStore().then((authStore) => {
      authStore.logout();
    });
  });

  it("handle create application with valid phone numbers", () => {
    cy.intercept(
      "POST",
      `https://bpi.briteverify.com/api/public/v1/fullverify`,
      (req) => {
        req.reply({
          phone: {
            number: req.body.phone,
            service_type: "land",
            phone_location: "business",
            status: "valid",
            errors: [],
          },
        });
      }
    ).as("briteverifyIntercept");

    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/phones`,
      (req) => {
        req.reply({
          code: 200,
          data: {
            phoneId: req.body.phoneType === "MAIN" ? "1" : "2",
            areaCode: req.body.areaCode,
            phoneNumber: req.body.phoneNumber,
            phoneType: req.body.phoneType,
            countryCode: req.body.countryCode,
          },
        });
      }
    ).as("phones");
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/sarquestionresponses/*`,
      (req) => {
        req.reply({
          code: 201,
          data: {
            answer: req.body.answer,
            name: null,
          },
        });
      }
    ).as("sarResponses");

    const gender = faker.person.sex();
    const dob = faker.date.birthdate({
      min: 1919,
      max: new Date().getFullYear(),
      mode: "year",
    });

    // Submit button to be disabled
    cy.get('[data-cy="create-application-submit-button"] .btn')
      .should("be.disabled")
      .and("have.text", "Start new application");

    // Create application first name
    cy.handleBaseInput({
      selector: "[data-cy='create-application-first-name-group']",
      text: faker.person.firstName(gender),
      required: true,
      errorSelector: "div.invalid-feedback",
      errorMessage: "This is a required field.",
    });

    // Create application preferred first name
    cy.handleBaseInput({
      selector: "[data-cy='create-application-preferred-first-name-group']",
      text: faker.person.firstName(gender),
      required: false,
    });

    // Create application middle name
    cy.handleBaseInput({
      selector: "[data-cy='create-application-middle-name-group']",
      text: faker.person.middleName(gender),
      required: false,
    });

    // Create application last name
    cy.handleBaseInput({
      selector: "[data-cy='create-application-last-name-group']",
      text: faker.person.lastName(gender),
      required: true,
      errorSelector: "div.invalid-feedback",
      errorMessage: "This is a required field.",
    });

    // suffix
    cy.handleBaseSingleSelect({
      selector: "[data-cy='create-application-suffix-group']",
      text: faker.person.suffix(),
      required: false,
    });

    // Create application birth date
    cy.handleBaseSingleSelect({
      selector: "[data-cy='create-application-birth-month-group']",
      text: dob.toLocaleString("default", { month: "long" }),
      required: false,
    });

    cy.handleBaseSingleSelect({
      selector: "[data-cy='create-application-birth-day-group']",
      text: dob.getDate(),
      required: false,
    });

    cy.handleBaseSingleSelect({
      selector: "[data-cy='create-application-birth-year-group']",
      text: dob.getFullYear(),
      required: false,
    });

    // main phone number
    cy.handleBasePhoneNumberInput({
      selector: "[data-cy='create-application-main-phone-number']",
      country: "United States",
      phoneNumber: "4804804800",
      required: false,
    });

    // is mobile number
    cy.get(
      `[data-cy='create-application-is-mobile-number-group'] [type="radio"]`
    ).check("N");

    // mobile phone number
    cy.handleBasePhoneNumberInput({
      selector: "[data-cy='create-application-mobile-phone-number']",
      country: "United States",
      phoneNumber: "2012212121",
      required: false,
    });

    // receive info via SMS
    cy.get(
      `[data-cy='create-application-receive-info-via-sms-group'] [type="radio"]`
    ).check("Y");

    // Submit button to be enabled
    cy.get('[data-cy="create-application-submit-button"] .btn')
      .should("be.enabled")
      .and("have.text", "Start new application");

    // Click the submit button
    cy.handleButton({
      buttonSelector: '[data-cy="create-application-submit-button"] .btn',
    });

    // Wait for apis to be called
    cy.wait("@applications", { timeout: 30000 });
    cy.wait("@uiViewInfo", { timeout: 30000 });

    // Assert url to be /my-information
    cy.url().should("include", "/my-information");
  });
  it("handle create application with invalid phone numbers", () => {
    cy.intercept(
      "POST",
      `https://bpi.briteverify.com/api/public/v1/fullverify`,
      (req) => {
        req.reply({
          phone: {
            number: req.body.phone,
            service_type: "land",
            phone_location: "business",
            status: "invalid",
            errors: [],
          },
        });
      }
    ).as("briteverifyIntercept");

    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/phones`,
      (req) => {
        req.reply({
          code: 200,
          data: {
            phoneId: req.body.phoneType === "MAIN" ? "1" : "2",
            areaCode: req.body.areaCode,
            phoneNumber: req.body.phoneNumber,
            phoneType: req.body.phoneType,
            countryCode: req.body.countryCode,
          },
        });
      }
    ).as("phones");
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/sarquestionresponses/*`,
      (req) => {
        req.reply({
          code: 201,
          data: {
            answer: req.body.answer,
            name: null,
          },
        });
      }
    ).as("phones");

    const gender = faker.person.sex();
    const dob = faker.date.birthdate({
      min: 1919,
      max: new Date().getFullYear(),
      mode: "year",
    });

    // Submit button to be disabled
    cy.get('[data-cy="create-application-submit-button"] .btn')
      .should("be.disabled")
      .and("have.text", "Start new application");

    // Create application first name
    cy.handleBaseInput({
      selector: "[data-cy='create-application-first-name-group']",
      text: faker.person.firstName(gender),
      required: true,
      errorSelector: "div.invalid-feedback",
      errorMessage: "This is a required field.",
    });

    // Create application preferred first name
    cy.handleBaseInput({
      selector: "[data-cy='create-application-preferred-first-name-group']",
      text: faker.person.firstName(gender),
      required: false,
    });

    // Create application middle name
    cy.handleBaseInput({
      selector: "[data-cy='create-application-middle-name-group']",
      text: faker.person.middleName(gender),
      required: false,
    });

    // Create application last name
    cy.handleBaseInput({
      selector: "[data-cy='create-application-last-name-group']",
      text: faker.person.lastName(gender),
      required: true,
      errorSelector: "div.invalid-feedback",
      errorMessage: "This is a required field.",
    });

    // suffix
    cy.handleBaseSingleSelect({
      selector: "[data-cy='create-application-suffix-group']",
      text: faker.person.suffix(),
      required: false,
    });

    // Create application birth date
    cy.handleBaseSingleSelect({
      selector: "[data-cy='create-application-birth-month-group']",
      text: dob.toLocaleString("default", { month: "long" }),
      required: false,
    });

    cy.handleBaseSingleSelect({
      selector: "[data-cy='create-application-birth-day-group']",
      text: dob.getDate(),
      required: false,
    });

    cy.handleBaseSingleSelect({
      selector: "[data-cy='create-application-birth-year-group']",
      text: dob.getFullYear(),
      required: false,
    });

    // main phone number
    cy.handleBasePhoneNumberInput({
      selector: "[data-cy='create-application-main-phone-number']",
      country: "United States",
      phoneNumber: "4804804800",
      required: false,
    });

    // is mobile number
    cy.get(
      `[data-cy='create-application-is-mobile-number-group'] [type="radio"]`
    ).check("N");

    // mobile phone number
    cy.handleBasePhoneNumberInput({
      selector: "[data-cy='create-application-mobile-phone-number']",
      country: "Canada",
      phoneNumber: "5062345678",
      required: false,
    });

    // receive info via SMS
    cy.get(
      `[data-cy='create-application-receive-info-via-sms-group'] [type="radio"]`
    ).check("Y");

    // Submit button to be enabled
    cy.get('[data-cy="create-application-submit-button"] .btn')
      .should("be.enabled")
      .and("have.text", "Start new application");

    // Click the submit button
    cy.handleButton({
      buttonSelector: '[data-cy="create-application-submit-button"] .btn',
    });

    cy.wait("@briteverifyIntercept");
    cy.get('[data-cy="create-application-briteverify-alert-modal"]').should(
      "be.visible"
    );
    cy.get(
      '[data-cy="create-application-briteverify-alert-modal-heading"]'
    ).should("contain", "The phone number you entered could not be verified:");
    // checking the address details
    cy.get('[data-cy="create-application-briteverify-alert-modal-phone-table"]')
      .children()
      .should("contain", "Phone number")
      .and("contain", `4804804800`)
      .and("contain", "Mobile phone")
      .and("contain", `5062345678`);

    // checking submit and Go back and change buttons are visible
    cy.get(
      "[data-cy='create-application-briteverify-alert-modal-back-button']"
    ).should("be.visible");
    cy.get(
      "[data-cy='create-application-briteverify-alert-modal-submit-button']"
    ).should("be.visible");

    // submitting from the modal
    cy.get(
      "[data-cy='create-application-briteverify-alert-modal-submit-button']"
    ).click();
    // Wait for apis to be called
    cy.wait("@applications", { timeout: 30000 });
    cy.wait("@uiViewInfo", { timeout: 30000 });

    // Assert url to be /my-information
    cy.url().should("include", "/my-information");
  });
  it("handle create application with non US and CA phone numbers", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/phones`,
      (req) => {
        req.reply({
          code: 200,
          data: {
            phoneId: req.body.phoneType === "MAIN" ? "1" : "2",
            areaCode: req.body.areaCode,
            phoneNumber: req.body.phoneNumber,
            phoneType: req.body.phoneType,
            countryCode: req.body.countryCode,
          },
        });
      }
    ).as("phones");
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/sarquestionresponses/*`,
      (req) => {
        req.reply({
          code: 201,
          data: {
            answer: req.body.answer,
            name: null,
          },
        });
      }
    ).as("phones");

    const gender = faker.person.sex();
    const dob = faker.date.birthdate({
      min: 1919,
      max: new Date().getFullYear(),
      mode: "year",
    });

    // Submit button to be disabled
    cy.get('[data-cy="create-application-submit-button"] .btn')
      .should("be.disabled")
      .and("have.text", "Start new application");

    // Create application first name
    cy.handleBaseInput({
      selector: "[data-cy='create-application-first-name-group']",
      text: faker.person.firstName(gender),
      required: true,
      errorSelector: "div.invalid-feedback",
      errorMessage: "This is a required field.",
    });

    // Create application preferred first name
    cy.handleBaseInput({
      selector: "[data-cy='create-application-preferred-first-name-group']",
      text: faker.person.firstName(gender),
      required: false,
    });

    // Create application middle name
    cy.handleBaseInput({
      selector: "[data-cy='create-application-middle-name-group']",
      text: faker.person.middleName(gender),
      required: false,
    });

    // Create application last name
    cy.handleBaseInput({
      selector: "[data-cy='create-application-last-name-group']",
      text: faker.person.lastName(gender),
      required: true,
      errorSelector: "div.invalid-feedback",
      errorMessage: "This is a required field.",
    });

    // suffix
    cy.handleBaseSingleSelect({
      selector: "[data-cy='create-application-suffix-group']",
      text: faker.person.suffix(),
      required: false,
    });

    // Create application birth date
    cy.handleBaseSingleSelect({
      selector: "[data-cy='create-application-birth-month-group']",
      text: dob.toLocaleString("default", { month: "long" }),
      required: false,
    });

    cy.handleBaseSingleSelect({
      selector: "[data-cy='create-application-birth-day-group']",
      text: dob.getDate(),
      required: false,
    });

    cy.handleBaseSingleSelect({
      selector: "[data-cy='create-application-birth-year-group']",
      text: dob.getFullYear(),
      required: false,
    });

    // main phone number
    cy.handleBasePhoneNumberInput({
      selector: "[data-cy='create-application-main-phone-number']",
      country: "United Kingdom",
      phoneNumber: "7400232123",
      required: false,
    });

    // is mobile number
    cy.get(
      `[data-cy='create-application-is-mobile-number-group'] [type="radio"]`
    ).check("Y");

    // mobile phone number
    cy.get("body")
      .find('[data-cy="create-application-mobile-phone-number"]')
      .should("not.exist");

    // receive info via SMS
    cy.get(
      `[data-cy='create-application-receive-info-via-sms-group'] [type="radio"]`
    ).check("Y");

    // Submit button to be enabled
    cy.get('[data-cy="create-application-submit-button"] .btn')
      .should("be.enabled")
      .and("have.text", "Start new application");

    // Click the submit button
    cy.handleButton({
      buttonSelector: '[data-cy="create-application-submit-button"] .btn',
    });

    cy.get("body")
      .find('[data-cy="create-application-briteverify-alert-modal"]')
      .should("not.exist");
    // Wait for apis to be called
    cy.wait("@applications", { timeout: 30000 });
    cy.wait("@uiViewInfo", { timeout: 30000 });

    // Assert url to be /my-information
    cy.url().should("include", "/my-information");
  });
});

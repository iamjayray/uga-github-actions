/* eslint-disable no-undef */
/// <reference types="cypress"/>

import { faker } from "@faker-js/faker";

let userDetails = null;
let config = null;

let currentScenario = Cypress.env("configFile")
  ?.split("/")
  ?.pop()
  ?.replace(".json", "");

describe(`User Create Account Tests: ${currentScenario}`, () => {
  before(() => {
    // Get file from Cypres env variable
    cy.readFile(`${Cypress.env("configFile")}`).then((data) => (config = data));
  });
  it("handle account creation", () => {
    // Fill in the email and confirm email fields
    const emailInput = `cypress+${faker.string
      .uuid()
      ?.substring(0, 29)}@test.asu.edu`;
    const passwordInput = "Qwerty1234";

    cy.api({
      method: "POST",
      url: `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/sign-up`,
      headers: {
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
      body: {
        email: emailInput,
        password: passwordInput,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      cy.readFile("cypress/fixtures/users.json").then((existingData) => {
        // Define the new user data to append
        const newUser = {
          email: emailInput,
          password: passwordInput,
        };
        newUser.sex = faker.person.sex();
        newUser.firstName = faker.person.firstName(newUser.sex);
        newUser.lastName = faker.person.lastName(newUser.sex);
        newUser.middleName = faker.person.middleName(newUser.sex);
        newUser.suffix = faker.person.suffix();
        newUser.ssn = faker.string.numeric({
          length: 9,
          allowLeadingZeros: false,
        });
        newUser.asuAffiliationId = faker.string.numeric({
          length: 10,
          allowLeadingZeros: false,
        });

        // Append the new user data to the existing data
        const updatedData = [...existingData, newUser];
        // Write the updated data back to the JSON file
        cy.writeFile("cypress/fixtures/users.json", updatedData);
      });
    });
  });

  it("handle Application creation", () => {
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
    cy.intercept("POST", `${Cypress.env("baseUrl")}/api/ug/applications`).as(
      "applicationIntercept"
    );

    cy.fixture("users").then((users) => {
      userDetails = users[users.length - 1];

      cy.api({
        method: "POST",
        url: `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/sign-in`,
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
        body: {
          email: userDetails.email,
          password: userDetails.password,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.writeFile(
          `cypress/fixtures/api-responses/login.json`,
          JSON.stringify(response.body)
        );
        cy.setCookie("access_token", response.body.data.accessToken, {
          secure: true,
          sameSite: "no_restriction",
          expires: 30,
        });

        cy.visit("/dashboard");

        const applicationDetails = config.appCreationDetails;

        // Submit button to be disabled
        cy.get('[data-cy="create-application-submit-button"] .btn')
          .should("be.disabled")
          .and("have.text", "Start new application");

        // Create application first name
        cy.handleBaseInput({
          selector: "[data-cy='create-application-first-name-group']",
          text: userDetails.firstName,
          required: true,
          errorSelector: "div.invalid-feedback",
          errorMessage: "This is a required field.",
        });

        // Create application preferred first name
        cy.handleBaseInput({
          selector: "[data-cy='create-application-preferred-first-name-group']",
          text: "A",
          required: false,
        });

        // Create application middle name
        cy.handleBaseInput({
          selector: "[data-cy='create-application-middle-name-group']",
          text: userDetails.middleName,
          required: false,
        });

        // Create application last name
        cy.handleBaseInput({
          selector: "[data-cy='create-application-last-name-group']",
          text: userDetails.lastName,
          required: true,
          errorSelector: "div.invalid-feedback",
          errorMessage: "This is a required field.",
        });

        // suffix
        cy.handleBaseSingleSelect({
          selector: "[data-cy='create-application-suffix-group']",
          text: userDetails.suffix,
          required: false,
        });

        // Create application birth date
        cy.handleBaseSingleSelect({
          selector: "[data-cy='create-application-birth-month-group']",
          text: applicationDetails.dob.month,
          required: false,
        });

        cy.handleBaseSingleSelect({
          selector: "[data-cy='create-application-birth-day-group']",
          text: applicationDetails.dob.date,
          required: false,
        });

        cy.handleBaseSingleSelect({
          selector: "[data-cy='create-application-birth-year-group']",
          text: applicationDetails.dob.year,
          required: false,
        });

        // main phone number
        cy.handleBasePhoneNumberInput({
          selector: "[data-cy='create-application-main-phone-number']",
          country: applicationDetails.mainPhone.country,
          phoneNumber: applicationDetails.mainPhone.phoneNumber,
          required: false,
        });

        // is mobile number
        cy.get(
          `[data-cy='create-application-is-mobile-number-group'] [type="radio"]`
        ).check(applicationDetails.isMobileNumberEntered?.value);

        // mobile phone number
        if (
          applicationDetails.isMobileNumberEntered?.value === "N" &&
          applicationDetails.mobilePhone?.phoneNumber
        ) {
          cy.handleBasePhoneNumberInput({
            selector: "[data-cy='create-application-mobile-phone-number']",
            country: applicationDetails.mobilePhone.country,
            phoneNumber: applicationDetails.mobilePhone.phoneNumber,
            required: false,
          });
        }

        // receive info via SMS
        cy.get(
          `[data-cy='create-application-receive-info-via-sms-group'] [type="radio"]`
        ).check(applicationDetails.receiveInfoBySMS?.value);

        // Submit button to be enabled
        cy.get('[data-cy="create-application-submit-button"] .btn')
          .should("be.enabled")
          .and("have.text", "Start new application");

        // Click the submit button
        cy.handleButton({
          buttonSelector: '[data-cy="create-application-submit-button"] .btn',
        });
        cy.wait("@applicationIntercept").then(({ response }) => {
          expect(response.body?.code).to.eq(201);
          cy.url(`ug-app/${response.body?.data?.appId}/my-information`, {
            timeout: 30000,
          });
        });
      });
    });
  });
});

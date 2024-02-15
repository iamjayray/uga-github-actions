/// <reference types="cypress"/>

import { faker } from "@faker-js/faker";

describe("User Create Account Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[data-cy="home-start-an-application"] a').click();
  });

  it("handle account creation", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/sign-up`,
      { code: 201, data: {} }
    ).as("signUpIntercept");
    // Fill in the email and confirm email fields
    const emailInput = `cypress+${faker.string
      .uuid()
      ?.substring(0, 29)}@test.asu.edu`;
    const passwordInput = "Qwerty1234";

    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-email-group"]',
      text: emailInput,
      required: true,
      errorMessage: "This is a required field",
    });

    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-confirm-email-group"]',
      text: emailInput,
      required: true,
      errorMessage: "This is a required field",
    });

    // Fill in the password fields
    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-password-group"]',
      text: passwordInput,
      required: true,
      errorMessage: "This is a required field",
    });

    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-confirm-password-group"]',
      text: passwordInput,
      required: true,
      errorMessage: "This is a required field",
    });

    // Click the verification checkbox
    cy.handleButton({
      buttonSelector:
        '[data-cy="user-create-account-create-account-button"] button',
    });

    // Check if the step one message is visible and contains the correct text
    cy.get("[data-cy='user-verify-email-step-one'] .h1-small").should(
      "be.visible"
    );
    cy.get("[data-cy='user-verify-email-step-one'] .h1-small")
      .should("be.visible")
      .contains("Step 1: Check your email");

    // Check if the step two message is visible and contains the correct text
    cy.get("[data-cy='user-verify-email-step-two'] .h1-small").should(
      "be.visible"
    );
    cy.get("[data-cy='user-verify-email-step-two'] .h1-small")
      .should("be.visible")
      .contains("Step 2: Return to the login page");

    // Check for resend email functionality
    cy.get('[data-cy="user-verify-email-resend-email-button"]')
      .should("be.visible")
      .click();

    // Check for login button functionality
    cy.get('[data-cy="user-verify-email-login-button"]')
      .should("be.visible")
      .click();

    cy.url("user/login");
  });

  it("handle account creation with API fail case", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/sign-up`,
      { code: 500, errors: ["errors"] }
    ).as("signUpIntercept");
    // Fill in the email and confirm email fields
    const emailInput = `cypress+${faker.string
      .uuid()
      ?.substring(0, 29)}@test.asu.edu`;
    const passwordInput = "Qwerty1234";

    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-email-group"]',
      text: emailInput,
      required: true,
      errorMessage: "This is a required field",
    });

    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-confirm-email-group"]',
      text: emailInput,
      required: true,
      errorMessage: "This is a required field",
    });

    // Fill in the password and test all the validation assertions
    // 1 Upper case letter
    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-password-group"]',
      text: "aaaaaaaaaaaaaaaaaa",
      required: true,
      errorMessage: "This is a required field",
    });

    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-confirm-password-group"]',
      text: "aaaaaaaaaaaaaaaaaa",
      required: true,
      errorMessage: "This is a required field",
    });
    // 1 Lowercase Letter
    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-password-group"]',
      text: "AAAAAAAAAAAA",
    });

    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-confirm-password-group"]',
      text: "AAAAAAAAAAAA",
    });
    // 1 number
    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-password-group"]',
      text: "AAAAAAAAAAAa",
    });

    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-confirm-password-group"]',
      text: "AAAAAAAAAAAa",
    });
    // passwords not matching
    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-password-group"]',
      text: "AAAAAAAAAAaaa1",
    });

    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-confirm-password-group"]',
      text: "AAAAAAAAAAAa11",
    });

    // correct password
    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-password-group"]',
      text: passwordInput,
    });

    cy.handleBaseInput({
      selector: '[data-cy="user-create-account-confirm-password-group"]',
      text: passwordInput,
    });

    cy.handleButton({
      buttonSelector:
        '[data-cy="user-create-account-create-account-button"] button',
    });
    cy.wait("@signUpIntercept");
    cy.get('[data-cy="user-create-account-alert"]').should("be.visible");
    cy.get('[data-cy="user-create-account-alert"] .close')
      .should("be.visible")
      .click();
    cy.get('[data-cy="user-create-account-login-link"]')
      .should("be.visible")
      .click();
    cy.url("user/login");
  });
});

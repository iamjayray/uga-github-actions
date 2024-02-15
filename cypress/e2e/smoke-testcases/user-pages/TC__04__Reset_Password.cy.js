/// <reference types="cypress"/>

const config = {
  expectedText: {
    resetPasswordFormHeaderText: "Set new password",
    emailInputLabel: "Email",
    verificationCodeInputLabel: "Verification code",
    passwordInputLabel:
      " Passwords must be at least 10 characters long and must include the following requirements: ",
  },
};

describe("User Reset Password Tests", () => {
  let userDetails;

  before(() => {
    cy.fixture("users").then((users) => {
      userDetails = users[1];
    });
  });

  beforeEach(() => {
    // Visit the application's homepage before each test
    cy.visit("/");
  });

  it("should handle reset password", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/forgot-password`,
      {
        code: 200,
        data: {
          email: userDetails.email,
        },
      }
    ).as("forgetPasswordIntercept");
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/useraccounts/cognito/confirm-forgot-password`,
      {
        code: 200,
        data: {
          passwordChanged: true,
          email: userDetails.email,
        },
      }
    ).as("confirmForgetPasswordIntercept");
    // Click the login button
    cy.get('[data-cy="home-already-have-an-account"] a').click();

    // Click the "Reset Password" link
    cy.get(
      "[data-cy='user-login-login-section'] .d-flex .text-underline"
    ).click();

    // Alias for email input and type the email
    cy.handleBaseInput({
      selector: '[data-cy="user-reset-password-email-group"]',
      text: userDetails.email,
    });

    // Click the submit button
    cy.handleButton({
      buttonSelector: '[data-cy="user-reset-password-view"] button',
    });

    // Assertion checks

    // Check the header text of the reset password form
    cy.get("[data-cy='user-new-password-view'] .h1-small").should(
      "have.text",
      config.expectedText.resetPasswordFormHeaderText
    );

    // Check the label text of the email input field
    cy.get("[data-cy='user-new-password-email-group'] legend").should(
      "have.text",
      config.expectedText.emailInputLabel
    );
    // Checking if the email is already prefilled
    cy.get("[data-cy='user-new-password-email-group'] input").should(
      "have.value",
      userDetails.email
    );
    // Entering the verification code
    cy.get(`[data-cy='user-new-password-verification-code-group'] input`).type(
      "121211"
    );
    // Enter new password
    // Check the minimum length error
    cy.get(`[data-cy='user-new-password-password-group'] input`).type("1");
    cy.get(
      "[data-cy='user-new-password-password-group'] .invalid-feedback"
    ).contains("The password must be at least 10 characters long.");
    // checking for all the conditions are met
    // 1 Uppercase letter error
    cy.get(`[data-cy='user-new-password-password-group'] input`).clear();
    cy.get(`[data-cy='user-new-password-password-group'] input`).type(
      "passwordtest"
    );
    cy.get(
      "[data-cy='user-new-password-password-group'] .invalid-feedback"
    ).contains("The password must contain at least 1 uppercase letter.");
    // 1 Lowercase letter error
    cy.get(`[data-cy='user-new-password-password-group'] input`).clear();
    cy.get(`[data-cy='user-new-password-password-group'] input`).type(
      "1111111111A"
    );
    cy.get(
      "[data-cy='user-new-password-password-group'] .invalid-feedback"
    ).contains("The password must contain at least 1 lowercase letter.");
    // 1 number error
    cy.get(`[data-cy='user-new-password-password-group'] input`).clear();
    cy.get(`[data-cy='user-new-password-password-group'] input`).type(
      "passwordTest"
    );
    cy.get(
      "[data-cy='user-new-password-password-group'] .invalid-feedback"
    ).contains("The password must contain at least 1 number.");

    // Valid password
    cy.get(`[data-cy='user-new-password-password-group'] input`).clear();
    cy.get(`[data-cy='user-new-password-password-group'] input`).type(
      "passwordTest1"
    );
    // click submit button
    cy.get(`[data-cy='reset-password-submit-button']`).click();
    cy.wait("@confirmForgetPasswordIntercept");
    // checking the password confirm page is visible
    cy.url().should("include", "/user/new-password-confirm");
    cy.get("[data-cy='user-new-password-confirm-view'] h1").should(
      "have.text",
      "Your password has been reset!"
    );
    // returning to login page
    cy.get("[data-cy='user-new-password-confirm-view'] a").click();
    cy.url().should("include", "/user/login");
  });

  it("reset password when forgot-password API fail case", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/forgot-password`,
      { statusCode: 500 }
    ).as("forgetPasswordIntercept");
    // Click the login button
    cy.get('[data-cy="home-already-have-an-account"] a').click();

    // Click the "Reset Password" link
    cy.get(
      "[data-cy='user-login-login-section'] .d-flex .text-underline"
    ).click();

    // Alias for email input and type the email
    cy.handleBaseInput({
      selector: '[data-cy="user-reset-password-email-group"]',
      text: userDetails.email,
    });

    // Click the submit button
    cy.handleButton({
      buttonSelector: '[data-cy="user-reset-password-view"] button',
    });

    cy.wait("@forgetPasswordIntercept");
    cy.get('[data-cy="reset-password-alert"]').should("be.visible");
    cy.get('[data-cy="reset-password-alert"] .close').click();
    // go to login page

    cy.get('[data-cy="user-reset-password-return-to-login-screen"] a')
      .should("be.visible")
      .click();
  });

  it("reset password when confirm-password API fail case", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/forgot-password`,
      {
        code: 200,
        data: {
          email: userDetails.email,
        },
      }
    ).as("forgetPasswordIntercept");
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/useraccounts/cognito/confirm-forgot-password`,
      {
        code: 500,
        errors: ["errors"],
      }
    ).as("confirmForgetPasswordIntercept");
    // Click the login button
    cy.get('[data-cy="home-already-have-an-account"] a').click();

    // Click the "Reset Password" link
    cy.get(
      "[data-cy='user-login-login-section'] .d-flex .text-underline"
    ).click();

    // Alias for email input and type the email
    cy.handleBaseInput({
      selector: '[data-cy="user-reset-password-email-group"]',
      text: userDetails.email,
    });

    // Click the submit button
    cy.handleButton({
      buttonSelector: '[data-cy="user-reset-password-view"] button',
    });

    // Entering the verification code
    cy.get(`[data-cy='user-new-password-verification-code-group'] input`).type(
      "121211"
    );
    // Enter new password
    cy.get(`[data-cy='user-new-password-password-group'] input`).clear();
    cy.get(`[data-cy='user-new-password-password-group'] input`).type(
      "passwordTest1"
    );
    // click submit button
    cy.get(`[data-cy='reset-password-submit-button']`).click();
    cy.wait("@confirmForgetPasswordIntercept");
    // checking the password confirm page is visible

    cy.get('[data-cy="new-password-alert"]').should("be.visible");
    cy.get('[data-cy="new-password-alert"] .close')
      .should("be.visible")
      .click();

    // returning to login page
    cy.get("[data-cy='user-new-password-return-to-profile'] a").click();
    cy.url().should("include", "/user/login");
  });
});

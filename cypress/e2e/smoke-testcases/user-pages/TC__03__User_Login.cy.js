/// <reference types="cypress"/>

let userDetails = null;
const config = {
  loginDetails: {
    invalidEmail: "dummy@test.com",
    invalidPassword: "DummyPassKey1234",
  },
};

describe("User Login Tests", () => {
  before(() => {
    cy.fixture("users").then((users) => {
      userDetails = users[1];
    });
  });

  beforeEach(() => {
    cy.visit("/"); // Navigate to the home page
  });

  it("handles successful login", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/sign-in`
    ).as("signInIntercept");

    // Login with valid email and password
    cy.get('[data-cy="home-already-have-an-account"] a').click();
    // Clear input before typing
    cy.get('[data-cy="user-login-email-group"] input').clear();
    cy.get('[data-cy="user-login-email-group"] input').type(userDetails.email);
    cy.get('[data-cy="user-login-password-group"] input').type(
      userDetails.password
    );
    cy.get('[data-cy="user-login-login-section"] button').click();
    cy.wait("@signInIntercept");
    cy.get("@signInIntercept").then(({ response }) => {
      if (response.body.code === 200 || response.body.code === 201) {
        cy.writeFile(
          `cypress/fixtures/api-responses/login.json`,
          JSON.stringify(response.body)
        );
      }
    });

    // Ensure successful login message is visible
    cy.get(".h1-small")
      .should("not.be.null")
      .should(($element) => {
        expect($element).to.contain(
          "You're a few steps away from becoming a Sun Devil"
        );
      });

    // Assert cookies
    cy.getCookie("access_token")
      .should("exist")
      .should("have.property", "value");

    // Assert authStore
    cy.authStore().then((authStore) => {
      expect(authStore.isLoggedIn).to.be.true;
      expect(authStore.isAsuLogin).to.be.false;
      expect(authStore.token).to.not.be.undefined;
    });
  });

  it("handles logout after successful login", () => {
    // Login with valid email and password
    cy.get('[data-cy="home-already-have-an-account"] a').click();
    // Clear input before typing
    cy.get('[data-cy="user-login-email-group"] input').clear();
    cy.get('[data-cy="user-login-email-group"] input').type(userDetails.email);
    cy.get('[data-cy="user-login-password-group"] input').type(
      userDetails.password
    );
    cy.get('[data-cy="user-login-login-section"] button').click();
    // Ensure successful login message is visible
    cy.get(".h1-small")
      .should("not.be.null")
      .should(($element) => {
        expect($element).to.contain(
          "You're a few steps away from becoming a Sun Devil"
        );
      });

    // Logout
    cy.handleButton({
      buttonSelector: '[data-cy="profile-menu-button"]', // Click profile dropdown
    });
    cy.handleButton({
      buttonSelector: '[data-cy="profile-menu-sign-out-button"]', // Click logout button
    });

    // Assert cookies
    cy.getCookie("access_token").should("not.exist");

    // Assert authStore
    cy.authStore().then((authStore) => {
      expect(authStore.isLoggedIn).to.be.false;
      expect(authStore.isAsuLogin).to.be.false;
      expect(authStore.token).to.be.null;
    });
  });

  it("handles incorrect login attempt", () => {
    // Perform incorrect login steps with invalid email
    cy.get('[data-cy="home-already-have-an-account"] a').click();
    cy.get('[data-cy="user-login-email-group"] input').type(
      config.loginDetails.invalidEmail
    );
    cy.get('[data-cy="user-login-password-group"] input').type(
      config.loginDetails.invalidPassword
    );
    cy.get('[data-cy="user-login-login-section"] button').click();

    // Ensure error message is visible
    cy.get(".alert").should("be.visible").contains("Email not found");
    cy.get(".alert .close").click();
    cy.get('[data-cy="user-login-create-account-link"]').click();
    cy.url("user/create");
  });

  it("handle incorrect email validation", () => {
    cy.handleButton({
      buttonSelector: '[data-cy="home-already-have-an-account"] .btn',
    });

    const falseScenarios = [
      {
        email: "abc",
        error: "This is a required field",
      },
      {
        email: "abc@abc",
        error: "This is a required field",
      },
      {
        email: "abc@abc.a",
        error: "This is a required field",
      },
    ];

    falseScenarios.forEach((scenario) => {
      cy.handleBaseInput({
        selector: '[data-cy="user-login-email-group"]',
        text: scenario.email,
        required: true,
        errorSelector: "div.invalid-feedback",
        errorMessage: scenario.error,
      });
    });
  });
});

describe("User Login Tests with not verified email", () => {
  before(() => {
    cy.fixture("users").then((users) => {
      userDetails = users[1];
    });
  });

  beforeEach(() => {
    cy.visit("/");
    // Intercept the request before each test
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/sign-in`,
      {
        code: 400,
        errors: ["Must verify email address."],
      }
    ).as("signInIntercept");

    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/resend-code`,
      {
        code: 200,
        data: {
          emailSent: true,
          email: userDetails.email,
        },
      }
    ).as("resendCodeIntercept");
  });

  it("handles b-alert for not verified email login attempt", () => {
    // Trigger the login action
    cy.get('[data-cy="home-already-have-an-account"] a').click();
    // Clear input before typing
    cy.get('[data-cy="user-login-email-group"] input').clear();
    cy.get('[data-cy="user-login-email-group"] input').type(userDetails.email);
    cy.get('[data-cy="user-login-password-group"] input').type(
      userDetails.password
    );
    cy.get('[data-cy="user-login-login-section"] button').click();

    // Wait for the interception and log the details
    cy.wait("@signInIntercept").then(() => {
      cy.get("[data-cy='user-login-alert']").should("be.visible");
      cy.get("[data-cy='user-login-alert'] span").should(
        "contain",
        "Verify your email address"
      );
      cy.get("[data-cy='user-login-alert'] a").click();

      cy.url().should("include", "/user/verify-email");
      cy.get('[data-cy="user-verify-email-alert"]').should("be.visible");
      cy.get('[data-cy="user-verify-email-alert"]').should(
        "contain",
        "We have successfully sent you the email"
      );
    });
  });
});

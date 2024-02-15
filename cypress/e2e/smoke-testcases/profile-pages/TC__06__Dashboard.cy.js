/// <reference types="cypress"/>
let userDetails = null;

describe("User Dashboard Tests", () => {
  before(() => {
    cy.fixture("users").then((users) => {
      userDetails = users[1];
    });
  });

  beforeEach(() => {
    cy.login(userDetails.email, userDetails.password);
    cy.visit("/dashboard");
  });

  it("handle need help with successful support request", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/ui/supporttickets`
    ).as("supportTickets");
    // Submit need help sidebar
    cy.handleButton({
      buttonSelector: '[data-cy="desktop-need-help-button"]',
    }); // Click the need help button

    cy.handleRadioButton({
      radioSelector:
        "[data-cy='portal-layout-header'] > div.container [data-cy='form-need-help-support-options-group'] > div > div:nth-of-type(2) [data-cy='support-option-text']",
    }); // Click a radio button

    cy.get(
      `[data-cy='portal-layout-header'] > div.container [data-cy='additional-comments-textarea']`
    )
      .should("be.visible")
      .then(($input) => {
        const currentText = $input.val();
        if (currentText !== "TEST") {
          // Clear input field if already has text and type new text
          if (currentText) {
            cy.get(
              `[data-cy='portal-layout-header'] > div.container [data-cy='additional-comments-textarea']`
            ).clear();
          }
          cy.get(
            `[data-cy='portal-layout-header'] > div.container [data-cy='additional-comments-textarea']`
          ).type("TEST");
        }
      }); // Type text in the textarea

    cy.handleButton({
      buttonSelector:
        "[data-cy='portal-layout-header'] > div.container [data-cy='form-need-help-submit-help-request-button'] span",
    }); // Click a button

    cy.wait("@supportTickets");
    cy.get("[data-cy='support-alert']").should("be.visible");

    cy.handleButton({
      buttonSelector: '[data-cy="desktop-need-help-sidebar-back-button"] span',
    }); // Click the back button

    // Need help open and close by back button
    cy.handleButton({
      buttonSelector: '[data-cy="desktop-need-help-button"]',
    }); // Click the need help button again

    cy.handleButton({
      buttonSelector: '[data-cy="desktop-need-help-sidebar-back-button"] span',
    }); // Click the back button
  });

  it("handle need help with API failure", () => {
    cy.intercept("POST", `${Cypress.env("baseUrl")}/api/ug/ui/supporttickets`, {
      code: "500",
      errors: ["Unable to submit the request"],
    }).as("supportTickets");
    // Submit need help sidebar
    cy.handleButton({
      buttonSelector: '[data-cy="desktop-need-help-button"]',
    }); // Click the need help button

    cy.handleRadioButton({
      radioSelector:
        "[data-cy='portal-layout-header'] > div.container [data-cy='form-need-help-support-options-group'] > div > div:nth-of-type(2) [data-cy='support-option-text']",
    }); // Click a radio button

    cy.get(
      `[data-cy='portal-layout-header'] > div.container [data-cy='additional-comments-textarea']`
    )
      .should("be.visible")
      .then(($input) => {
        const currentText = $input.val();
        if (currentText !== "TEST") {
          // Clear input field if already has text and type new text
          if (currentText) {
            cy.get(
              `[data-cy='portal-layout-header'] > div.container [data-cy='additional-comments-textarea']`
            ).clear();
          }
          cy.get(
            `[data-cy='portal-layout-header'] > div.container [data-cy='additional-comments-textarea']`
          ).type("TEST");
        }
      }); // Type text in the textarea

    cy.handleButton({
      buttonSelector:
        "[data-cy='portal-layout-header'] > div.container [data-cy='form-need-help-submit-help-request-button'] span",
    }); // Click a button

    cy.wait("@supportTickets");
    cy.get("[data-cy='support-alert']").should("be.visible");
  });

  it("test FAQ's and needhelp sidebar link above FQA", () => {
    cy.get('[data-cy="dashboard-need-help"]').should("be.visible");
    cy.get('[data-cy="dashboard-need-help"] #open_needhelp_sidebar_link')
      .should("be.visible")
      .click();
    // checking if the sidebar is visible
    cy.get('[data-cy="dashboard-needhelp-sidebar"]').should("be.visible");
    // closing the sidebar
    cy.get('[data-cy="dashboard-needhelp-sidebar"] .back-button')
      .should("be.visible")
      .click();
    // checking if the FAQ section is visible
    cy.get('[data-cy="dashboard-faqs"]').should("be.visible");
    cy.get('[data-cy="dashboard-faqs"] #faqs').each((collapse) => {
      cy.wrap(collapse).find("a").should("have.class", "collapsed");
      cy.wrap(collapse).find("a").click();
      cy.wrap(collapse).find("a").should("have.class", "not-collapsed");
      cy.wrap(collapse).find("a").click();
    });
  });
});

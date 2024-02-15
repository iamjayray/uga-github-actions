/// <reference types="cypress"/>

describe("Homepage Tests", () => {
  const config = {
    modalHeaderText: " Please rate your experience with the ASU Application. ",
    feedbackText: "TEST",
    cancelButtonText: "Cancel",
    submitButtonText: "Submit",
    applyTitleText: "Apply to ASU Online",
    loginButtonText: "Log in",
    createAccountButtonText: "Create account",
    servicesMenuItemsText: [
      "Maps and Locations",
      "Jobs",
      "Directory",
      "Contact ASU",
      "My ASU",
    ],
  };

  beforeEach(() => {
    cy.visit("/");
  });

  it("handle beta banner", () => {
    // Open feedback modal
    cy.handleButton({ buttonSelector: "[data-cy='beta-banner'] a" });

    // Click on rating within the feedback modal
    cy.handleButton({ buttonSelector: "span:nth-of-type(5) path" });

    // todo: Can common function be created for contains logic, basically it will be UI assertions
    // Check for the presence of specific text within the modal
    cy.get('[data-cy="portal-form-feedback"] .mb-space-sm').contains(
      config.modalHeaderText
    );
    // Check for the presence of "Cancel" and "Submit" buttons
    cy.get(".flex-row .bg-white").contains(config.cancelButtonText);
    cy.get(".flex-row .btn-secondary").contains(config.submitButtonText);

    // Enter text into a textarea
    cy.get(`#feedback_textarea`)
      .should("be.visible")
      .then(($input) => {
        const currentText = $input.val();
        if (currentText !== config.feedbackText) {
          // Clear input field if already has text and type new text
          if (currentText) {
            cy.get(`#feedback_textarea`).clear();
          }
          cy.get(`#feedback_textarea`).type(config.feedbackText);
        }
      });

    // Click the "Submit" button in the feedback modal
    cy.handleButton({ buttonSelector: "button" });

    // Close the feedback modal by clicking a specific element
    cy.handleButton({ buttonSelector: "[data-cy='beta-banner'] a" });
    cy.handleButton({
      buttonSelector: "[data-cy='close-feedback-button'] path",
    });

    // Close the feedback modal by clicking another specific element
    cy.handleButton({ buttonSelector: "[data-cy='beta-banner'] a" });
    cy.handleButton({ buttonSelector: ".flex-row .bg-white" });
  });

  it("handle ui elements", () => {
    // Check the visibility of UI elements
    cy.get(".ah-brand-logo").should("be.visible");
    cy.get(".h1-small").contains(config.applyTitleText);
    cy.get('[data-cy="home-already-have-an-account"] .btn').contains(
      config.loginButtonText
    );
    cy.get('[data-cy="home-start-an-application"] .btn').contains(
      config.createAccountButtonText
    );

    config.servicesMenuItemsText.forEach((text) => {
      cy.get(
        '[data-cy="default-footer-university-services-menu"] .container .row .col'
      ).contains(text);
    });
  });
});

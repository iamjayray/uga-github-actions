describe("Error page assertions", () => {
  it("ui assertion for Error page", () => {
    cy.visit("/error");

    cy.get('[data-cy="default-base-header"]')
      .should("exist")
      .should("be.visible");

    cy.get('[data-cy="error-view"] h1')
      .should("exist")
      .should("be.visible")
      .contains("Apply to ASU Online");

    cy.get('[data-cy="error-view"] h2')
      .should("exist")
      .should("be.visible")
      .contains(
        "Something went wrong and the server could not complete your request."
      );

    cy.get('[data-cy="error-view"] a')
      .should("exist")
      .should("be.visible")
      .contains("Return to dashboard");

    cy.get('[data-cy="default-footer-university-services-menu"]')
      .should("exist")
      .should("be.visible");

    cy.get('[data-cy="default-footer-university-legal-compliance-menu"]')
      .should("exist")
      .should("be.visible");
  });
});

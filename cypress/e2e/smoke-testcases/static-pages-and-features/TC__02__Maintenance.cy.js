describe("Maintenance page assertions", () => {
  it("ui assertion for maintenance page", () => {
    // Check the visibility of UI elements
    cy.visit("/maintenance");

    cy.get('[data-cy="maintenance-header"]')
      .should("exist")
      .should("be.visible");

    cy.get('[data-cy="maintenance-header"] img')
      .should("exist")
      .should("be.visible")
      .should("have.attr", "src")
      .should("include", "asu-vertical-logo.png");

    cy.get('[data-cy="maintenance-main-content"] h1')
      .should("exist")
      .should("be.visible")
      .contains("Apply to ASU Online");

    cy.get('[data-cy="maintenance-main-content"] h2')
      .should("exist")
      .should("be.visible")
      .contains("We're temporarily down for maintenance.");

    cy.get('[data-cy="maintenance-main-content"] p')
      .should("exist")
      .should("be.visible")
      .contains(
        "We apologize for the inconvenience. We’re expecting to be back online at 8 a.m., so please try again later."
      );

    cy.get('[data-cy="default-footer-university-services-menu"]')
      .should("exist")
      .should("be.visible");

    cy.get('[data-cy="default-footer-university-legal-compliance-menu"]')
      .should("exist")
      .should("be.visible");
  });
});

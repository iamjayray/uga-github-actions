let userDetails = null;

describe("404 page assertions", () => {
  before(() => cy.fixture("users").then((users) => (userDetails = users[0])));

  it("ui assertion for 404 page and is not logged in", () => {
    cy.visit("/404");

    cy.get('[data-cy="not-found-view"]').should("exist").should("be.visible");

    cy.get('[data-cy="not-found-view"] h1')
      .should("exist")
      .should("be.visible")
      .contains("Apply to ASU Online");

    cy.get('[data-cy="not-found-view"] h2')
      .should("exist")
      .should("be.visible")
      .contains("The page you're looking for doesn't exist.");

    cy.get('[data-cy="not-found-view"] a span')
      .should("exist")
      .should("be.visible")
      .contains(`Return to home page`);

    cy.get('[data-cy="default-footer-university-services-menu"]')
      .should("exist")
      .should("be.visible");

    cy.get('[data-cy="default-footer-university-legal-compliance-menu"]')
      .should("exist")
      .should("be.visible");
  });

  it("ui assertion for 404 page and is logged in", () => {
    cy.login(userDetails.email, userDetails.password);

    cy.visit("/404");

    cy.get('[data-cy="not-found-view"] a span')
      .should("exist")
      .should("be.visible")
      .contains(`Return to dashboard`);
  });
});

describe("User verify email testcases", () => {
  it("Verify email valid response", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/resend-code`,
      { code: 200 }
    ).as("resendCode");
    cy.visit("/user/verify-email");
    // resend email
    cy.get("[data-cy='user-verify-email-resend-email-button']").click();
    cy.wait("@resendCode");
    cy.get('[data-cy="user-verify-email-alert"]').should("be.visible");
    cy.get("[data-cy='user-verify-email-login-button']").click();
  });
  it("Verify email in-valid response", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/resend-code`,
      { code: 500, errors: ["error"] }
    ).as("resendCode");
    cy.visit("/user/verify-email");
    // resend email
    cy.get("[data-cy='user-verify-email-resend-email-button']").click();
    cy.wait("@resendCode");
    cy.get('[data-cy="user-verify-email-alert"]').should("be.visible");
    cy.get('[data-cy="user-verify-email-alert"]').should(
      "have.class",
      "alert-danger"
    );
  });
});

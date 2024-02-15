describe("My Profile Pages Before App Submit Tests", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      // Login
      cy.login(users[1].email, users[1].password);
      cy.visit("/profile");
    });
  });

  it("handle before app submit profile pages", () => {
    cy.get("[data-cy='profile-menu']").click();
    cy.get("[data-cy='profile-menu-edit-profile-button']").click();
    cy.url().should("include", "profile");

    // visit and check profile page edit-name and assert it to not navigate to edit-name route
    cy.visit(`profile/edit-name`);
    cy.url().should("include", "profile/edit-name");

    // visit and check profile page edit-preferred-first-name and assert it to not navigate to edit-preferred-first-name route
    cy.visit(`profile/edit-preferred-first-name`);
    cy.url().should("include", "profile/edit-preferred-first-name");

    // visit and check profile page edit-birthday and assert it to not navigate to edit-birthday route
    cy.visit(`profile/edit-birthday`);
    cy.url().should("include", "profile/edit-birthday");

    // visit and check profile page edit-pronoun and assert it to not navigate to edit-pronoun route
    cy.visit(`profile/edit-pronoun`);
    cy.url().should("include", "profile/edit-pronoun");

    // visit and check profile page edit-gender and assert it to not navigate to edit-gender route
    cy.visit(`profile/edit-gender`);
    cy.url().should("include", "profile/edit-gender");

    // visit and check profile page edit-phone-number and assert it to not navigate to edit-phone-number route
    cy.visit(`profile/edit-phone-number`);
    cy.url().should("include", "profile/edit-phone-number");
  });
});

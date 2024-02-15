let access_token = null;
let appId = null;

describe("My Profile Edit Pronouns Tests", () => {
  before(() => {
    cy.fixture("users").then((users) => {
      // Login
      cy.login(users[1].email, users[1].password);
      cy.getCookie("access_token").then((item) => {
        access_token = item.value;
        cy.populateUgApplications(access_token).then((response) => {
          if (response.data.length > 0) {
            appId = response.data[0].appId;
          }
        });
      });
    });
  });
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      // Login
      cy.login(users[1].email, users[1].password);
      cy.visit(`profile/edit-pronoun`);
    });
  });

  it("handle pronouns", () => {
    cy.handleRadioButton({
      radioSelector: `[data-cy='profile-edit-pronoun-pronoun-group'] [data-cy="radio-group"] > div:nth-of-type(${3}) > label`,
    });

    // saveButton
    cy.get(
      "[data-cy='profile-edit-pronoun-update-pronoun-save-button'] button"
    ).click();
  });
  it("handle pronouns api fails", () => {
    cy.intercept(
      "PUT",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/pronouns`,
      {
        code: 500,
        errors: ["errors"],
      }
    ).as("applications");
    cy.handleRadioButton({
      radioSelector: `[data-cy='profile-edit-pronoun-pronoun-group'] [data-cy="radio-group"] > div:nth-of-type(${3}) > label`,
    });

    // saveButton
    cy.get(
      "[data-cy='profile-edit-pronoun-update-pronoun-save-button'] button"
    ).click();
    cy.get('[data-cy="edit-pronoun-alert"]').should("be.visible");
    cy.get('[data-cy="edit-pronoun-alert"] .close')
      .should("be.visible")
      .click();
  });
});

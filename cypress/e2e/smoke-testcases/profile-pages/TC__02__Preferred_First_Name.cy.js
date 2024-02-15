let access_token = null;
let appId = null;

describe("My Profile Edit Preferred First Name Tests", () => {
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

      cy.visit(`profile/edit-preferred-first-name`);
    });
  });

  it("handle preferred first name", () => {
    // preferredFirstName
    // invalid text
    cy.handleBaseInput({
      selector:
        "[data-cy='profile-edit-preferred-first-name-preferred-first-name-group']",
      text: "!@@",
    });
    cy.handleBaseInput({
      selector:
        "[data-cy='profile-edit-preferred-first-name-preferred-first-name-group']",
      text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    });
    // try to save
    cy.get(
      "[data-cy='profile-edit-preferred-first-name-save-button'] button"
    ).click();

    // entering correct text
    cy.handleBaseInput({
      selector:
        "[data-cy='profile-edit-preferred-first-name-preferred-first-name-group']",
      text: "AA",
    });

    // saveButton
    cy.get(
      "[data-cy='profile-edit-preferred-first-name-save-button'] button"
    ).click();
  });

  it("handle preferred first name when api fails", () => {
    cy.intercept(
      "PATCH",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/userinfo`,
      {
        code: 500,
        errors: ["errors"],
      }
    ).as("userInfo");
    // preferredFirstName
    cy.handleBaseInput({
      selector:
        "[data-cy='profile-edit-preferred-first-name-preferred-first-name-group']",
      text: "AA",
    });

    // saveButton
    cy.get(
      "[data-cy='profile-edit-preferred-first-name-save-button'] button"
    ).click();

    cy.get('[data-cy="preferred-first-name-alert"]').should("be.visible");
    cy.get('[data-cy="preferred-first-name-alert"] .close')
      .should("be.visible")
      .click();
  });
});

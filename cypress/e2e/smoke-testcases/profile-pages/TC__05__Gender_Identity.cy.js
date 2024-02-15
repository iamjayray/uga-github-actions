let access_token = null;
let appId = null;

describe("My Profile Edit Gender Identity Tests", () => {
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

      cy.visit(`profile/edit-gender`);
    });
  });

  it("handle genders", () => {
    cy.handleRadioButton({
      radioSelector: `[data-cy='profile-edit-gender-gender-group'] [data-cy="radio-group"] > div:nth-of-type(${2}) > label`,
    });

    // saveButton
    cy.get(
      "[data-cy='profile-edit-gender-update-gender-submit'] button"
    ).click();
  });
  it("handle genders api fail", () => {
    cy.intercept(
      "PUT",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/genders`,
      {
        code: 500,
        errors: ["errors"],
      }
    ).as("genders");
    cy.handleRadioButton({
      radioSelector: `[data-cy='profile-edit-gender-gender-group'] [data-cy="radio-group"] > div:nth-of-type(${3}) > label`,
    });

    // saveButton
    cy.get(
      "[data-cy='profile-edit-gender-update-gender-submit'] button"
    ).click();
    cy.wait("@genders");
    cy.get('[data-cy="edit-gender-alert"]').should("be.visible");
    cy.get('[data-cy="edit-gender-alert"] .close').should("be.visible").click();
  });
});

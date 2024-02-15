let access_token = null;
let appId = null;

describe("My Profile Edit Birthday Tests", () => {
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

      cy.visit(`profile/edit-birthday`);
    });
  });

  it("handle birthday", () => {
    // month
    cy.handleBaseSingleSelect({
      selector: '[data-cy="profile-edit-birthday-update-dob-month-group"]',
      text: "January",
      required: true,
      errorMessage: "This is a required field",
    });

    // day
    cy.handleBaseSingleSelect({
      selector: '[data-cy="profile-edit-birthday-update-dob-day-group"]',
      text: "1",
      required: true,
      errorMessage: "This is a required field",
    });

    //  year
    cy.handleBaseSingleSelect({
      selector: '[data-cy="profile-edit-birthday-update-dob-year-group"]',
      text: "1990",
      required: true,
      errorMessage: "This is a required field",
    });

    // saveButton
    cy.get("[data-cy='profile-edit-birthday-save-button']").click();
  });
  it("handle birthday when API fails", () => {
    cy.intercept(
      "PATCH",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/userinfo`,
      {
        code: 500,
        errors: ["errors"],
      }
    ).as("userInfo");
    // month
    cy.handleBaseSingleSelect({
      selector: '[data-cy="profile-edit-birthday-update-dob-month-group"]',
      text: "January",
      required: true,
      errorMessage: "This is a required field",
    });

    // day
    cy.handleBaseSingleSelect({
      selector: '[data-cy="profile-edit-birthday-update-dob-day-group"]',
      text: "1",
      required: true,
      errorMessage: "This is a required field",
    });

    //  year
    cy.handleBaseSingleSelect({
      selector: '[data-cy="profile-edit-birthday-update-dob-year-group"]',
      text: "1990",
      required: true,
      errorMessage: "This is a required field",
    });

    // saveButton
    cy.get("[data-cy='profile-edit-birthday-save-button']").click();
    cy.wait("@userInfo");
    cy.get('[data-cy="birthday-edit-alert"]').should("be.visible");
    cy.get('[data-cy="birthday-edit-alert"] .close')
      .should("be.visible")
      .click();
  });
});

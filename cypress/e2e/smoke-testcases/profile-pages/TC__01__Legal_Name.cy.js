let userStore = null;
let access_token = null;
let appId = null;

describe("My Profile Edit Name Tests", () => {
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

      cy.visit(`profile/edit-name`);

      cy.userStore().then((store) => {
        userStore = store;
      });
    });
  });

  it("handle edit name", () => {
    const { names } = userStore;

    // firstName
    cy.handleBaseInput({
      selector: "[data-cy='profile-edit-name-first-name-group']",
      text: "AA",
      required: true,
      errorMessage: "This is a required field",
    });

    // middleName
    cy.handleBaseInput({
      selector: "[data-cy='profile-edit-name-middle-name-group']",
      text: "AJ",
    });

    // lastName
    cy.handleBaseInput({
      selector: "[data-cy='profile-edit-name-last-name-group']",
      text: "JJ",
      required: true,
      errorMessage: "This is a required field",
    });

    // suffix
    cy.handleBaseSingleSelect({
      selector: '[data-cy="profile-edit-name-suffix-group"]',
      text: "IV",
    });

    // saveButton
    cy.get("[data-cy='profile-edit-name-form-cta'] button").click();

    names.forEach((el) => {
      for (let key in el) {
        if (key === "firstName") {
          expect(el[key]).to.eq("AA");
        }

        if (key === "lastName") {
          expect(el[key]).to.eq("JJ");
        }

        if (key === "middleName") {
          expect(el[key]).to.eq("AJ");
        }

        if (key === "suffix") {
          expect(el[key]).to.eq("IV");
        }
      }
    });
  });

  it("handle edit name api fail", () => {
    cy.intercept(
      "PUT",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/names/*`,
      {
        code: 500,
        errors: ["errors"],
      }
    ).as("names");
    // maxlength test
    // firstName
    cy.handleBaseInput({
      selector: "[data-cy='profile-edit-name-first-name-group']",
      text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    });

    // middleName
    cy.handleBaseInput({
      selector: "[data-cy='profile-edit-name-middle-name-group']",
      text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    });

    // lastName
    cy.handleBaseInput({
      selector: "[data-cy='profile-edit-name-last-name-group']",
      text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    });

    // special characters testing
    cy.handleBaseInput({
      selector: "[data-cy='profile-edit-name-first-name-group']",
      text: "@",
    });

    // middleName
    cy.handleBaseInput({
      selector: "[data-cy='profile-edit-name-middle-name-group']",
      text: "@",
    });

    // lastName
    cy.handleBaseInput({
      selector: "[data-cy='profile-edit-name-last-name-group']",
      text: "@",
    });

    // valid inputs
    // firstName
    cy.handleBaseInput({
      selector: "[data-cy='profile-edit-name-first-name-group']",
      text: "AA",
      required: true,
      errorMessage: "This is a required field",
    });

    // middleName
    cy.handleBaseInput({
      selector: "[data-cy='profile-edit-name-middle-name-group']",
      text: "AJ",
    });

    // lastName
    cy.handleBaseInput({
      selector: "[data-cy='profile-edit-name-last-name-group']",
      text: "JJ",
      required: true,
      errorMessage: "This is a required field",
    });

    // save click
    cy.get("[data-cy='profile-edit-name-form-cta'] button").click();
    cy.wait("@names");
    cy.get('[data-cy="edit-name-alert"]').should("be.visible");
    cy.get('[data-cy="edit-name-alert"] .close').should("be.visible").click();
  });
});

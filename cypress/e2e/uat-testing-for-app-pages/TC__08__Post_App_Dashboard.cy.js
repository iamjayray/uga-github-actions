let access_token = null;
let appId = null;
let userDetails = null;
let testCaseType = null;

let currentScenario = Cypress.env("configFile")
  ?.split("/")
  ?.pop()
  ?.replace(".json", "");

describe("Populate User details", () => {
  before(() => {
    // Get user details from fixture
    cy.fixture("users").then((users) => {
      userDetails = users[users.length - 1];
    });
    cy.readFile(`cypress/config/constants.json`).then(({ testCaseTypes }) => {
      testCaseType = testCaseTypes.uatTesting;
    });
  });

  it("populate userdetails and visit post-app-dashboard page", () => {
    cy.login(userDetails.email, userDetails.password);
    // Intercept config get calls
    cy.getCookie("access_token").then((item) => {
      access_token = item.value;
      cy.populateUgApplications(access_token).then((response) => {
        if (response.data.length > 0) {
          appId = response.data[0].appId;
        }
        // populate other user details
        cy.populateUserDetails(appId, access_token, testCaseType);
      });
    });
  });
});

describe(`Post App Dashboard Tests: ${currentScenario}`, () => {
  before(() => {
    try {
      // Get user details from fixture
      cy.fixture("users").then((users) => {
        userDetails = users[users.length - 1];
      });
    } catch (error) {
      console.error("Error during setup:", error);
    }
  });

  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/dashboard`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });

  it("handle post app dashboard page ui elements", () => {
    cy.get('[data-cy="app-dashboard-next-steps"] h1').contains("Next steps");

    cy.get("[data-cy='app-dashboard-view-submitted-application-btn']")
      .contains("Review what you submitted")
      .click();
    cy.url().should("include", "preview");

    cy.get("[data-cy='preview-return-to-previous-page-button']").click();
    cy.url().should("include", "dashboard");

    cy.get("[data-cy='profile-menu']").click();
    cy.get("[data-cy='profile-menu-edit-profile-button']").click();
    cy.url().should("include", "profile");

    cy.get("[data-cy='profile-index-account-info']").should(
      "not.have.a.property",
      "href"
    );

    cy.get("[data-cy='profile-index-preferred-first-name']").should(
      "not.have.a.property",
      "href"
    );

    cy.get("[data-cy='profile-index-birthday']").should(
      "not.have.a.property",
      "href"
    );

    cy.get("[data-cy='profile-index-pronouns']").should(
      "not.have.a.property",
      "href"
    );

    cy.get("[data-cy='profile-index-gender-identity']").should(
      "not.have.a.property",
      "href"
    );

    // visit and check profile page edit-name and assert it to not navigate to edit-name route
    cy.visit(`profile/edit-name`);
    cy.url().should("not.include", "profile/edit-name");
    cy.url().should("include", "dashboard");

    // visit and check profile page edit-preferred-first-name and assert it to not navigate to edit-preferred-first-name route
    cy.visit(`profile/edit-preferred-first-name`);
    cy.url().should("not.include", "profile/edit-preferred-first-name");
    cy.url().should("include", "dashboard");

    // visit and check profile page edit-birthday and assert it to not navigate to edit-birthday route
    cy.visit(`profile/edit-birthday`);
    cy.url().should("not.include", "profile/edit-birthday");
    cy.url().should("include", "dashboard");

    // visit and check profile page edit-pronoun and assert it to not navigate to edit-pronoun route
    cy.visit(`profile/edit-pronoun`);
    cy.url().should("not.include", "profile/edit-pronoun");
    cy.url().should("include", "dashboard");

    // visit and check profile page edit-gender and assert it to not navigate to edit-gender route
    cy.visit(`profile/edit-gender`);
    cy.url().should("not.include", "profile/edit-gender");
    cy.url().should("include", "dashboard");

    cy.get("[data-cy='dashboard-view-application-button']").click();
  });
});

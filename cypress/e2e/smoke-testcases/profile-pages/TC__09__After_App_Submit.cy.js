let access_token = null;
let appId = null;

describe("My Profile Pages After App Submit Tests", () => {
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
      cy.intercept(
        "GET",
        `${Cypress.env("baseUrl")}/api/ug/applications`,
        (req) => {
          req.continue((res) => {
            res.body.data[0].submitted = "Y";
          });
        }
      ).as("getApplication");

      // Login
      cy.login(users[1].email, users[1].password);
    });
  });
  after(() => {
    cy.setUIViewInfo(
      access_token,
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );
  });

  it("handle after app submit profile pages", () => {
    cy.visit("/profile");
    cy.get("[data-cy='profile-menu']").click();
    cy.get("[data-cy='profile-menu-edit-profile-button']").click();
    cy.url().should("include", "profile");

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

    // visit and check profile page edit-phone-number and assert it to not navigate to edit-phone-number route
    cy.visit(`profile/edit-phone-number`);
    cy.url().should("not.include", "profile/edit-phone-number");
    cy.url().should("include", "dashboard");

    cy.get("[data-cy='dashboard-view-application-button']").click();
  });
  it("Post app dashboard testing", () => {
    cy.visit(`ug-app/${appId}/dashboard`);
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.dashboardFeedbackAlertClosed = null;
      ugAppStore.dashboardQTRAlertClosed = null;
    });
    cy.get("[data-cy='app-dashboard-up-app-dashboard-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.get("[data-cy='ug-app-dashboard-welcome']").should("be.visible");
        // open feedback alert modal
        cy.get("[data-cy='ug-app-dashboard-welcome-feedback-button']")
          .should("be.visible")
          .click();
        cy.get("[data-cy='ug-app-dashboard-welcome-feedback-modal']").should(
          "be.visible"
        );
        // close feedback alert modal
        cy.get(
          "[data-cy='ug-app-dashboard-welcome-feedback-modal'] #cancel_button"
        ).click();
        cy.get("[data-cy='qtr-alert']").should("be.visible");
        cy.get("[data-cy='qtr-alert'] .qtr-close-button")
          .should("be.visible")
          .click();
        cy.get("[data-cy='feedback-alert'] .feedback-alert-close-button")
          .should("be.visible")
          .click();
      });
  });
  it("Landing on pre app dashboard with UI view info pointing to any app pages", () => {
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/ui/view-info/${appId}`,
      {
        code: 200,
        data: {
          appId: appId,
          previousScreen: "ug-app-my-information",
          currentScreen: "ug-app-my-information",
        },
      }
    ).as("getUiViewInfo");
    cy.intercept(
      "PUT",
      `${Cypress.env("baseUrl")}/api/ug/ui/view-info/${appId}`,
      {
        code: 200,
        data: {
          appId: appId,
          previousScreen: "ug-app-dashboard",
          currentScreen: "ug-app-dashboard",
        },
      }
    ).as("putUiViewInfo");
    cy.visit("/dashboard");
    cy.get('[data-cy="dashboard-dashboard-view"]', {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.get('[data-cy="dashboard-view-application-button"]').click();
        cy.wait("@putUiViewInfo");
        cy.url().should("include", `ug-app/${appId}/dashboard`);
      });
  });
});

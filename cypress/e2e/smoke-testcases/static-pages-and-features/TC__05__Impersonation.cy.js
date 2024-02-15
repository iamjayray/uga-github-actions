let access_token = null;
let appId = null;
let userDetails = null;

describe("Impersonation testing", () => {
  before(() => {
    // Get user details from fixture
    cy.fixture("users").then((users) => {
      userDetails = users[1];
    });
  });

  it("Landing on callback url with out token and appId", () => {
    cy.visit("impersonate/callback/");
    // checking if the user is redirected to error page
    cy.url(`error`);
  });

  it("Landing on callback url with user token and appId", () => {
    cy.visit("/");
    cy.login(userDetails.email, userDetails.password);
    cy.getCookie("access_token").then((item) => {
      access_token = item.value;
      cy.populateUgApplications(access_token).then((response) => {
        if (response.data.length > 0) {
          appId = response.data[0].appId;
        }
        // visiting the callback url with user token
        cy.visit(`impersonate/callback/?token=${access_token}&appId=${appId}`);
        // checking if the user is redirected to error page
        cy.url(`error`);
      });
    });
  });

  it("Landing with admin token and appId and application not found in DB", () => {
    cy.intercept("GET", `${Cypress.env("baseUrl")}/api/ug/applications`, {
      code: 200,
      data: [],
    }).as("applications");

    cy.visit(userDetails.impersonateCallbackUrl);
    // checking if the user is redirected to error page when application is not found
    cy.url(`error`);
  });

  it("Landing with admin token and appId and application is not submitted", () => {
    cy.visit(userDetails.impersonateCallbackUrl);

    // checking if the user is landed on review page
    cy.get("[data-cy=review-up-app-review-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.appStore().then((appStore) => {
            cy.get("body")
              .find('[data-cy="base-loader"]', { timeout: 30000 })
              .should("not.exist");
            // checking the current screen
            expect(ugAppStore.currentScreen).to.eq("ug-app-review");

            // trying to access dashboard and post submission pages
            cy.visit("/dashboard");
            // checking if the user is redirected back to review page
            cy.url(`ug-app/${appStore.selectedUndergradApplicationId}/review`);

            // trying to access post submission pages
            cy.visit(
              `ug-app/${appStore.selectedUndergradApplicationId}/preview`
            );
            // checking if the user is redirected back to review page
            cy.url(`ug-app/${appStore.selectedUndergradApplicationId}/review`);
            // accessing profile pages
            cy.visit("/profile");
            cy.url("profile");
          });
        });
      });
  });

  it("Landing with admin token and appId and application is submitted", () => {
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications`,
      (req) => {
        req.continue((res) => {
          res.body.data[0].submitted = "Y";
        });
      }
    ).as("getApplication");

    cy.visit(userDetails.impersonateCallbackUrl);

    // checking if the user is landed on review page
    cy.get("[data-cy=preview-up-app-preview-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.appStore().then((appStore) => {
          cy.get("body")
            .find('[data-cy="base-loader"]', { timeout: 30000 })
            .should("not.exist");
          // checking the current screen

          // trying to access dashboard and post submission pages
          cy.visit("/dashboard");
          // checking if the user is redirected back to review page
          cy.url(`ug-app/${appStore.selectedUndergradApplicationId}/preview`);

          // trying to access app pages
          cy.visit(`ug-app/${appStore.selectedUndergradApplicationId}/review`);
          // checking if the user is redirected back to review page
          cy.url(`ug-app/${appStore.selectedUndergradApplicationId}/preview`);
          // accessing profile pages
          cy.visit("/profile");
          cy.url(`ug-app/${appStore.selectedUndergradApplicationId}/preview`);
        });
      });
  });

  it("verifying the admin header is displayed on login", () => {
    cy.visit(userDetails.impersonateCallbackUrl);
    // checking if the user is landed on review page
    cy.get("[data-cy=review-up-app-review-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.get("body")
            .find('[data-cy="base-loader"]', { timeout: 30000 })
            .should("not.exist");
          // checking the current screen
          expect(ugAppStore.currentScreen).to.eq("ug-app-review");
          // header is visible
          cy.get("[data-cy='ug-app-admin-header']").should("be.visible");
          // home button is visible
          cy.get("[data-cy='admin-home-button']").should("be.visible");
          // search for another app button is visible
          cy.get("[data-cy='admin-search-for-another-app-button']").should(
            "be.visible"
          );
          // checking the profile menu dropdown
          cy.get("[data-cy='profile-menu-button']")
            .should("be.visible")
            .click();
          // checking if the signout button is visible
          cy.get("[data-cy='profile-menu-sign-out-button']").should(
            "be.visible"
          );
          // signing out
          cy.get("[data-cy='profile-menu-sign-out-button']").click();
          // checking if the user is redirected to login page
          cy.url("user/login");
        });
      });
  });
});

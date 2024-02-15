/* eslint-disable cypress/unsafe-to-chain-command */
let access_token = null;
let appId = null;
let userDetails = null;

describe("populate userdetails for unsaved changes alert modal feature", () => {
  before(() => {
    // Get user details from fixture
    cy.fixture("users").then((users) => {
      userDetails = users[0];
    });
  });

  it("populate userdetails and visit my programs page", () => {
    cy.login(userDetails.email, userDetails.password);
    // Intercept config get calls
    cy.getCookie("access_token").then((item) => {
      access_token = item.value;
      cy.populateUgApplications(access_token).then((response) => {
        if (response.data.length > 0) {
          appId = response.data[0].appId;
        }
        // set current screen as my-information
      });
    });
  });

  it("reset my-programs page details", () => {
    cy.interceptUiViewInfo(appId, "ug-app-my-information", "ug-app-my-program");
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-program`);

    cy.get("[data-cy='my-programs-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.resetProgramsPage(ugAppStore, access_token, appId).then(() => {
            cy.populateUserDetails(appId, access_token);
          });
        });
      });
  });
});

describe("Unsaved changes alert modal testcases", () => {
  beforeEach(() => {
    // Intercept config get calls
    cy.interceptUiViewInfo(appId, "ug-app-my-information", "ug-app-my-program");
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId);
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-program`);
  });
  it("verifying if the alert modal is popped when there are changes unsaved", () => {
    cy.get("[data-cy=my-programs-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        // change any field and checking if the modal is displayed
        // selecting the program
        cy.handleButton({
          buttonSelector:
            "[data-cy='my-programs-filtered-programs'] > div:nth-of-type(1) [data-cy='my-programs-choose-program-button']",
        });
        // term
        cy.handleRadioButton({
          radioSelector: `[data-cy='my-programs-confirm-program-modal-select-date-group'] #program_select_date  div:nth-of-type(1) > label`,
        });
        // next
        cy.handleButton({
          buttonSelector:
            "[data-cy='my-programs-confirm-program-modal-save-button']",
        });
        cy.handleButton({
          buttonSelector:
            "[data-cy='my-programs-confirm-program-modal-save-button']",
        });
        // try to go to dashboard
        cy.get('[data-cy="profile-menu-button"]').click();
        cy.get('[data-cy="profile-menu-dashboard-button"]').click();
        // checking if the modal is visible
        cy.get('[data-cy="ug-app-unsaved-changes-alert-modal"]').should(
          "be.visible"
        );
        // clicking on back to save button and checking if the user is on same page
        cy.get(
          '[data-cy="ug-app-unsaved-changes-alert-modal-go-back-to-save-button"]'
        ).click();
        // checking the URL
        cy.url(`ug-app/${appId}/my-program`);
        // modal should not e visible
        cy.get("body")
          .find('[data-cy="ug-app-unsaved-changes-alert-modal"]')
          .should("not.exist");

        // try to go to dashboard
        cy.get('[data-cy="profile-menu-dashboard-button"]').click();
        // checking if the modal is visible
        cy.get('[data-cy="ug-app-unsaved-changes-alert-modal"]').should(
          "be.visible"
        );
        // clicking on back to save button and checking if the user is on same page
        cy.get(
          '[data-cy="ug-app-unsaved-changes-alert-modal-leave-without-saving-button"]'
        ).click();
        cy.url(`dashboard`);
      });
  });

  it("checking during footer back button click", () => {
    cy.get("[data-cy=my-programs-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        // change any field and checking if the modal is displayed
        // selecting the program
        cy.handleButton({
          buttonSelector:
            "[data-cy='my-programs-filtered-programs'] > div:nth-of-type(1) [data-cy='my-programs-choose-program-button']",
        });
        // term
        cy.handleRadioButton({
          radioSelector: `[data-cy='my-programs-confirm-program-modal-select-date-group'] #program_select_date  div:nth-of-type(1) > label`,
        });
        // next
        cy.handleButton({
          buttonSelector:
            "[data-cy='my-programs-confirm-program-modal-save-button']",
        });
        cy.handleButton({
          buttonSelector:
            "[data-cy='my-programs-confirm-program-modal-save-button']",
        });
        // try to go to dashboard
        cy.get('[data-cy="up-app-footer-back-button"]').click();
        // checking if the modal is visible
        cy.get('[data-cy="ug-app-unsaved-changes-alert-modal"]').should(
          "be.visible"
        );
        // clicking on back to save button and checking if the user is on same page
        cy.get(
          '[data-cy="ug-app-unsaved-changes-alert-modal-go-back-to-save-button"]'
        ).click();
        // checking the URL
        cy.url(`ug-app/${appId}/my-program`);
        // modal should not e visible
        cy.get("body")
          .find('[data-cy="ug-app-unsaved-changes-alert-modal"]')
          .should("not.exist");

        // try to go to my info
        cy.get('[data-cy="up-app-footer-back-button"]').click();
        // checking if the modal is visible
        cy.get('[data-cy="ug-app-unsaved-changes-alert-modal"]').should(
          "be.visible"
        );
        // clicking on back to save button and checking if the user is on same page
        cy.get(
          '[data-cy="ug-app-unsaved-changes-alert-modal-leave-without-saving-button"]'
        ).click();
        cy.url(`ug-app/${appId}/my-information`);
      });
  });
});

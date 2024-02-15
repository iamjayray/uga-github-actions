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

  it("populate userdetails and visit preview page", () => {
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

describe(`Preview Tests: ${currentScenario}`, () => {
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

    cy.visit(`ug-app/${appId}/preview`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });

  it("handle data validation from store with preview page ui elements", () => {
    cy.get('[data-cy="preview-heading-and-back-button"] h1').contains(
      "Preview Submitted Application"
    );

    cy.ugApplicationStore().then((store) => {
      cy.handleSectionDetails({
        section: "my-profile",
        page: "preview",
        getter: store.myProfileDetails,
      });

      cy.handleSectionDetails({
        section: "my-information",
        page: "preview",
        getter: store.myInformationDetails,
      });

      cy.handleSectionDetails({
        section: "my-programs",
        page: "preview",
        getter: store.myProgramsDetails,
      });

      cy.handleSectionDetails({
        section: "my-schools",
        page: "preview",
        getter: store.mySchoolsDetails,
      });

      if (store.myHighSchoolGradesDetails.data.length > 0) {
        cy.handleSectionDetails({
          section: "my-high-school-grades",
          page: "preview",
          getter: store.myHighSchoolGradesDetails,
        });
      }

      if (store.myArizonaResidencyDetails.data.length > 0) {
        cy.handleSectionDetails({
          section: "arizona-residency",
          page: "preview",
          getter: store.myArizonaResidencyDetails,
        });
      }
    });

    cy.get("[data-cy='preview-application-details'] button")
      .should("be.enabled")
      .contains("Download as PDF");

    cy.get("[data-cy='preview-application-details'] button").as("downloadBtn");
    cy.get("@downloadBtn").click();
  });
});

let access_token = null;
let appId = null;
let userDetails = null;
let cardDetails = [];
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

  it("populate userdetails and visit review page", () => {
    cy.login(userDetails.email, userDetails.password);
    // Intercept config get calls
    cy.getCookie("access_token").then((item) => {
      access_token = item.value;
      cy.populateUgApplications(access_token).then((response) => {
        if (response.data.length > 0) {
          appId = response.data[0].appId;
        }
        // set current screen as my-information
        cy.setUIViewInfo(
          access_token,
          appId,
          "ug-app-arizona-residency",
          "ug-app-review"
        );
        // populate other user details
        cy.populateUserDetails(appId, access_token, testCaseType);
      });
    });
  });
});

describe(`Review Tests: ${currentScenario}`, () => {
  let config;

  before(() => {
    try {
      // Get user details from fixture
      cy.fixture("users").then((users) => {
        userDetails = users[users.length - 1];
      });

      // Get file from Cypres env variable
      cy.readFile(`${Cypress.env("configFile")}`).then(
        (data) => (config = data)
      );
    } catch (error) {
      console.error("Error during setup:", error);
    }
  });

  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);

    cy.getCookie("access_token").then((item) => {
      access_token = item.value;
      cy.populateUgApplications(access_token).then((response) => {
        if (response.data.length > 0) {
          appId = response.data[0].appId;
        }
      });
    });
    cy.readFile(`cypress/config/constants.json`).then(
      ({ creditCardDetails }) => {
        cardDetails = creditCardDetails;
      }
    );

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });

  it("handle data validation from store with review page ui elements", () => {
    cy.visit(`ug-app/${appId}/review`);

    const { paymentType } = config.review;

    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");
    // institution intercept
    cy.intercept(
      "GET",
      `${Cypress.env(
        "dplBaseUrl"
      )}/codeset/external-organizations?schoolTypeCode=2YR&countryCode=USA&stateCode=AZ`
    ).as("institutionOrganizationIntercept");

    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/paymentgateway/redirects`,
      (req) => {
        // Allow the request to proceed to the server and capture the real response
        req.continue((res) => {
          // Log the real response
          res.body.data.nelnetRedirectUrl = res.body.data.redirectUrl;
          res.body.data.redirectUrl = `http://localhost:8080/ug-app/${appId}/review`;
        });
      }
    ).as("nelnetRedirect");

    cy.get("[data-cy=review-up-app-review-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((store) => {
          cy.configStore().then((configStore) => {
            cy.handleSectionDetails({
              section: "my-profile",
              page: "review",
              getter: store.myProfileDetails,
            });

            cy.handleSectionDetails({
              section: "my-information",
              page: "review",
              getter: store.myInformationDetails,
            });

            cy.handleSectionDetails({
              section: "my-programs",
              page: "review",
              getter: store.myProgramsDetails,
            });

            cy.handleSectionDetails({
              section: "my-schools",
              page: "review",
              getter: store.mySchoolsDetails,
            });

            if (store.myHighSchoolGradesDetails.data.length > 0) {
              cy.handleSectionDetails({
                section: "my-high-school-grades",
                page: "review",
                getter: store.myHighSchoolGradesDetails,
              });
            }

            if (store.myArizonaResidencyDetails.data.length > 0) {
              cy.handleSectionDetails({
                section: "arizona-residency",
                page: "review",
                getter: store.myArizonaResidencyDetails,
              });
            }

            // checking for arizona community college consent
            // populating the arizona community institutions
            let params = `schoolTypeCode=2YR&countryCode=USA&stateCode=AZ`;
            configStore.populateInstitutions(params);
            cy.wait("@institutionOrganizationIntercept");
            store.otherInstitutions.forEach((item) => {
              if (
                configStore.institutions.some(
                  (ele) => ele.externalOrgId === item.extOrgId
                ) &&
                item.degreeCode === "none"
              ) {
                cy.get(
                  '[data-cy="review-arizona-community-college-transcript-consent"]'
                ).should("be.visible");
                cy.handleCheckbox({
                  checkboxSelector:
                    "[data-cy='review-arizona-community-college-transcript-consent-checkbox'] label",
                });
              } else {
                cy.get('[data-cy="review-up-app-review-view"]')
                  .find(
                    '[data-cy="review-arizona-community-college-transcript-consent"]'
                  )
                  .should("not.exist");
              }
            });

            // SECTION: Acknowledgement
            cy.handleCheckbox({
              checkboxSelector:
                "[data-cy='review-application-affidavit'] label",
            });

            // SECTION: Paylater
            cy.ugApplicationStore().then((store) => {
              if (store.waiver === "false") {
                cy.handleRadioButton({
                  radioSelector: `[data-cy='review-up-app-review-view'] [data-cy='radio-group'] > div:nth-of-type(${
                    paymentType === "payNow" ? 1 : 2
                  }) > label`,
                });
              }
            });
            // SECTION: handle save button
            cy.handleButton({
              buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
            });
            if (paymentType === "payNow") {
              cy.wait("@nelnetRedirect").then(({ response }) => {
                cy.readFile("cypress/fixtures/users.json").then(
                  (existingData) => {
                    // Define the new user data to append
                    let users = existingData;
                    users[users.length - 1].nelnetRedirectUrl =
                      response.body.data.nelnetRedirectUrl;
                    const updatedData = users;
                    // Write the updated data back to the JSON file
                    cy.writeFile("cypress/fixtures/users.json", updatedData);
                  }
                );
              });
            } else {
              // paylater or fee waved
              cy.wait("@notificationIntercept", { timeout: 30000 });
              cy.get(
                "[data-cy='app-dashboard-application-submission-alert'] h1"
              ).should("be.visible");
              cy.get(
                "[data-cy='app-dashboard-application-submission-alert'] button"
              ).click();
            }
          });
        });
      });
  });

  it("nelnet payment testing", () => {
    const { paymentType, creditCardType } = config.review;

    cy.intercept(
      "POST",
      "https://uatquikpayasp.com/asu/qpmvc/make-payment/submit",
      (req) => {
        // Allow the request to proceed to the server and capture the real response
        req.continue((res) => {
          // Log the real response
          res.body.transactionRedirect.localRedirectUrl =
            res.body.transactionRedirect.redirectUrl;
          // Modify the response body as needed
          res.body.transactionRedirect.redirectUrl =
            "https://uatquikpayasp.com/";
        });
      }
    ).as("nelnetPaymentSubmission");

    if (paymentType === "payNow") {
      cy.visit("https://uatquikpayasp.com/");
      let cardIndex = -1;
      if (creditCardType) {
        cardIndex = cardDetails.findIndex(
          (item) => item.type === creditCardType
        );
        if (cardIndex < 0) {
          cardIndex = Math.floor(Math.random() * cardDetails.length);
        }
      }
      cy.fixture("users").then((users) => {
        const userDetails = users[users.length - 1];
        cy.visit(userDetails.nelnetRedirectUrl);
        // checking the header text
        cy.get(
          ".xpt-is-non-production .xpt-header-non-production-banner-container"
        ).contains("TEST ENVIRONMENT");
        cy.get("#submitNext").click();
        // click on credit/debit button
        cy.get("#newCreditCard button").click();
        // enter card number
        cy.get("body")
          .find("input[name=creditCardNumber]")
          .type(cardDetails[cardIndex].number);
        cy.get("#accountHolderName").type(
          `${userDetails.firstName} ${userDetails.lastName}`
        );
        const year = new Date().getFullYear().toString();
        cy.get("#creditCardExpiry").type(`01/${parseInt(year.slice(2)) + 1}`);
        cy.get("#cvv").type(cardDetails[cardIndex].cvv);
        // submitPayment
        cy.get("#submitPayment").click();
        cy.wait("@nelnetPaymentSubmission").then(({ response }) => {
          cy.readFile("cypress/fixtures/users.json").then((existingData) => {
            // Define the new user data to append
            let users = existingData;
            users[users.length - 1].localRedirectUrl =
              response.body.transactionRedirect.localRedirectUrl;
            const updatedData = users;
            // Write the updated data back to the JSON file
            cy.writeFile("cypress/fixtures/users.json", updatedData);
          });
        });
        return;
      });
    }
  });

  it("nelnet outh handler page", () => {
    cy.visit("/");
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");
    const { paymentType } = config.review;
    if (paymentType === "payNow") {
      cy.fixture("users").then((users) => {
        const userDetails = users[users.length - 1];
        cy.visit(userDetails.localRedirectUrl);
        // paylater or fee waved
        cy.wait("@notificationIntercept", { timeout: 30000 });
        cy.get(
          "[data-cy='app-dashboard-application-submission-alert'] h1"
        ).should("be.visible");
        cy.get(
          "[data-cy='app-dashboard-application-submission-alert'] button"
        ).click();
      });
    }
  });
});

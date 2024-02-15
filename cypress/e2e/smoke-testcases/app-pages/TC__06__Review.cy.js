import reviewContent from "../../../../src/content/review.json";
let access_token = null;
let appId = null;
let userDetails = null;
let config = null;
let testCaseType = null;

describe("Populate User details", () => {
  before(() => {
    // Get user details from fixture
    cy.fixture("users").then((users) => {
      userDetails = users[0];
    });
    // Get file from Cypres env variable
    cy.readFile(`cypress/config/smoke-testing/review.json`).then((data) => {
      config = data;
    });
    cy.readFile(`cypress/config/constants.json`).then(({ testCaseTypes }) => {
      testCaseType = testCaseTypes.smokeTesting;
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
      });
    });
  });
  it("Reset application details", () => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-information",
      "ug-app-my-information"
    );

    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-information`);

    cy.get("[data-cy=my-information-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.userStore().then((userStore) => {
            cy.resetApplication(
              access_token,
              appId,
              userStore,
              ugAppStore
            ).then(() => {
              cy.populateUserDetails(appId, access_token, testCaseType);
            });
          });
        });
      });
  });
});

describe("Review page before submitting any app page details", () => {
  beforeEach(() => {
    const { feesApiResponse } = config;
    // Login
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(appId, "ug-app-arizona-residency", "ug-app-review");
    cy.visit(`ug-app/${appId}/review`);
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // fees intercept
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/fees`,
      feesApiResponse
    ).as("fees");
  });

  it("Without submitting any details verifying validation api errors are displayed", () => {
    const { feeNotWaivedApiResponse } = config;
    // waivers intercept
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/fees/waivers`,
      feeNotWaivedApiResponse
    ).as("waivers");
    // validation api
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/validations`
    ).as("validationApiIntercept");

    cy.get("[data-cy=review-up-app-review-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.wait("@validationApiIntercept");
          cy.get("body")
            .find('[data-cy="base-loader"]', { timeout: 30000 })
            .should("not.exist");
          // verifying error if section is visible
          cy.get('[data-cy="review-validation-errors"]').should("be.visible");
          //checking the error messages
          Object.keys(ugAppStore.applicationErrors).forEach((key) => {
            const errors = ugAppStore.applicationErrors[key];
            if (errors.length > 0) {
              cy.get(`[data-cy='page-${key}-errors']`)
                .should("be.visible")
                .find("li")
                .and("have.length", errors.length)
                .each((li, index) => {
                  cy.wrap(li).contains(errors[index].split(":")[1]);
                });
            }
          });
          // verifying the dropdowns to contain  error messages
          // profile
          if (
            ugAppStore.applicationErrors["ug-app-profile-errors"].length > 0
          ) {
            cy.get('[data-cy="review-my-profile"]')
              .find('[data-cy="incomplete-error-message"]')
              .should("be.visible");
          }
          // my info
          if (
            ugAppStore.applicationErrors["ug-app-my-information"].length > 0
          ) {
            cy.get('[data-cy="review-my-information"]')
              .find('[data-cy="incomplete-error-message"]')
              .should("be.visible");
          }
          // my programs
          if (ugAppStore.applicationErrors["ug-app-my-program"].length > 0) {
            cy.get('[data-cy="review-my-programs"]')
              .find('[data-cy="incomplete-error-message"]')
              .should("be.visible");
          }
          // My schools
          if (ugAppStore.applicationErrors["ug-app-my-schools"].length > 0) {
            cy.get('[data-cy="review-my-schools"]')
              .find('[data-cy="incomplete-error-message"]')
              .should("be.visible");
          }
          // My highschool grades
          if (
            ugAppStore.applicationErrors["ug-app-my-high-school-grades"]
              .length > 0
          ) {
            cy.get('[data-cy="review-my-high-school-grades"]')
              .find('[data-cy="incomplete-error-message"]')
              .should("be.visible");
          }
          // Arizona residency
          if (
            ugAppStore.applicationErrors["ug-app-arizona-residency"].length > 0
          ) {
            cy.get('[data-cy="review-arizona-residency"]')
              .find('[data-cy="incomplete-error-message"]')
              .should("be.visible");
          }
          cy.handleButton({
            buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
          });
        });
      });
  });
});

describe("Review page after submitting all app page details", () => {
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(appId, "ug-app-arizona-residency", "ug-app-review");
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    cy.visit(`ug-app/${appId}/review`);
    // fees intercept
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/fees`,
      config.feesApiResponse
    ).as("fees");
    // waivers intercept
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/fees/waivers`,
      config.feeNotWaivedApiResponse
    ).as("waivers");
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("Prefill all page details", () => {
    const {
      myInformation,
      myProgram,
      mySchools,
      myHighSchoolGrades,
      arizonaResidency,
    } = config.prefillPageDetails;
    cy.get("[data-cy=review-up-app-review-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.configStore().then((configStore) => {
            configStore.selectHomeAddressCountry(
              myInformation.homeAddress.countryCode
            );
            // submitting my info details
            cy.submitMyInformationDetails(
              ugAppStore,
              myInformation,
              access_token,
              appId
            );

            // submitting myPrograms details
            cy.submitMyProgramDetails(
              ugAppStore,
              myProgram,
              access_token,
              appId
            );

            // submitting mySchools details
            cy.submitMySchoolsDetails(
              ugAppStore,
              mySchools,
              access_token,
              appId
            );

            // submitting myHighSchoolGrades details
            cy.submitMyHighSchoolGradesDetails(
              ugAppStore,
              myHighSchoolGrades,
              access_token,
              appId
            );
            // submitting arizona-residency details
            cy.submitArizonaResidencyDetails(
              ugAppStore,
              arizonaResidency,
              access_token,
              appId
            );

            cy.wait(20000);
            cy.populateUserDetails(appId, access_token, testCaseType);
          });
        });
      });
  });
  it("verify review page sections", () => {
    cy.get("[data-cy=review-up-app-review-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        // details section should be visible
        cy.get('[data-cy="review-certify-your-application"]').should(
          "be.visible"
        );
        // review-application-affidavit
        cy.get('[data-cy="review-application-affidavit"]').should("be.visible");
        // review-acknowledgement
        cy.get('[data-cy="review-acknowledgement"]').should("be.visible");
        // review-payment-section
        cy.get('[data-cy="review-payment-section"]').should("be.visible");
        // click on save button
        cy.handleButton({
          buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
        });
      });
  });

  it("verify dropdown edit functionality", () => {
    const {
      paymentsApiResponse,
      validationApiResponse,
      editFunctionality,
      briteverifyResponse,
    } = config;
    cy.intercept(
      "PUT",
      `${Cypress.env("baseUrl")}/api/ug/ui/view-info/${appId}`,
      (req) => {
        req.reply({
          code: 201,
          data: req.body,
        });
      }
    ).as("uiViewInfo");
    // validation api
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/validations`,
      validationApiResponse
    ).as("validationApiIntercept");
    // Payments api
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/payments`,
      paymentsApiResponse
    ).as("paymentsApiResponse");

    cy.intercept(
      "POST",
      `https://bpi.briteverify.com/api/public/v1/fullverify`,
      (req) => {
        if (
          req.body.hasOwnProperty("address") &&
          req.body.hasOwnProperty("phone")
        ) {
          req.reply(briteverifyResponse.addressandPhone);
        } else {
          req.reply(briteverifyResponse.phone);
        }
      }
    ).as("briteverifyIntercept");

    cy.get("[data-cy=review-up-app-review-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        // app pages edit functionality check
        editFunctionality.appPages.forEach((page) => {
          cy.get("[data-cy=review-up-app-review-view]").should("be.visible");
          // wait for validation api call
          cy.wait("@validationApiIntercept");
          // wait till the loader is completed
          cy.get("body")
            .find('[data-cy="base-loader"]', { timeout: 30000 })
            .should("not.exist");
          // click on edit button
          cy.get(`[data-cy="review-${page.editButtonDataCy}"]`)
            .find('[data-cy="review-section-details-collapse-edit-button"]')
            .should("be.visible")
            .click();
          // check the URL
          cy.url(`ug-app/${appId}/${page.url}`);
          cy.get(`[data-cy=${page.pageDataCy}]`, {
            timeout: 30000,
          }).should("be.visible");
          cy.get("body")
            .find('[data-cy="base-loader"]', { timeout: 30000 })
            .should("not.exist");
          cy.wait(2000);
          // click on save button and return to review page
          cy.get('[data-cy="up-app-desktop-footer-save-button"]')
            .should("be.visible")
            .should("be.enabled");
          cy.get('[data-cy="up-app-desktop-footer-save-button"]').click();
          // wait for UI view info api call
          cy.wait("@uiViewInfo", { timeout: 10000 });
          cy.url(`ug-app/${appId}/review`);
        });
        // profile page edit functinality check
        cy.get(`[data-cy="review-${editFunctionality.profilePage.dataCy}"]`)
          .find('[data-cy="review-section-details-collapse-edit-button"]')
          .should("be.visible")
          .click();
        cy.get("body")
          .find('[data-cy="base-loader"]', { timeout: 30000 })
          .should("not.exist");
        cy.url(`ug-app/${appId}/${editFunctionality.profilePage.url}`);
      });
  });

  it("Arizona community college consent", () => {
    const { otherInstitution } = config.azCommunityCollegeConsent;
    // intercepting the institutions api and stubbing the response to trigger the consent in review page
    cy.intercept(
      "GET",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/otherinstitutions`,
      (req) => {
        // Modify the request or response as needed
        req.reply(otherInstitution);
      }
    ).as("otherinstitutions");

    cy.get("[data-cy=review-up-app-review-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        // verifying the section is visible
        cy.get(
          "[data-cy='review-arizona-community-college-transcript-consent']"
        ).should("be.visible");
        // verifying consent check box is visible
        cy.get(
          "[data-cy='review-arizona-community-college-transcript-consent-checkbox']"
        ).should("be.visible");
        // checking the consent
        cy.handleCheckbox({
          checkboxSelector:
            "[data-cy='review-arizona-community-college-transcript-consent-checkbox'] label",
        });
        // verifying if the check box if checked
        cy.get(
          "[data-cy='review-arizona-community-college-transcript-consent-checkbox'] :checked"
        )
          .should("be.checked")
          .and("have.value", "Y");
      });
  });

  it("Payment section: fee not waived", () => {
    const { feeNotWaivedApiResponse } = config;
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/fees/waivers`,
      feeNotWaivedApiResponse
    ).as("waivers");
    cy.get("[data-cy=review-up-app-review-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.get("[data-cy='review-payment-section']").should("be.visible");
          // verify the fee waived message is not visible
          cy.get("[data-cy='review-payment-section']")
            .find('[ data-cy="review-app-fee-waived"]')
            .should("not.exist");

          // verifying the payment option section is visible
          cy.get("[data-cy='review-app-payment']").should("be.visible");

          // checking fee amount is displayed
          cy.get("[data-cy='review-app-payment'] #application_fee")
            .should("be.visible")
            .contains(ugAppStore.feeAmount);
          // checking the payment options are visible
          cy.get('[data-cy="review-payment-option-group"]').should(
            "be.visible"
          );
          // selecting the options and verifying the alert message
          // pay now
          cy.handleRadioButton({
            radioSelector: `[data-cy='review-payment-option-group'] [data-cy='radio-group'] > div:nth-of-type(1) > label`,
          });
          cy.get("[data-cy='review-app-payment'] #payment_option_alert")
            .should("be.visible")
            .contains(reviewContent.applicationFee.payment.payNowAlertMessage);
          // pay later
          cy.handleRadioButton({
            radioSelector: `[data-cy='review-payment-option-group'] [data-cy='radio-group'] > div:nth-of-type(2) > label`,
          });
          cy.get("[data-cy='review-app-payment'] #payment_option_alert")
            .should("be.visible")
            .contains(
              reviewContent.applicationFee.payment.paylaterAlertMessage
            );
        });
      });
  });

  it("Payment section: fee waived", () => {
    const { feeWaivedApiResponse } = config;
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/fees/waivers`,
      feeWaivedApiResponse
    ).as("waivers");
    cy.get("[data-cy=review-up-app-review-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.get("[data-cy='review-payment-section']").should("be.visible");
          // verify the fee waived message is not visible
          cy.get("[data-cy='review-payment-section']")
            .find('[ data-cy="review-app-payment"]')
            .should("not.exist");

          // verifying the payment option section is visible
          cy.get("[data-cy='review-app-fee-waived']")
            .should("be.visible")
            .contains(reviewContent.applicationFee.feeWaivedMessage);
        });
      });
  });
  it("payment section completed payment: via pay later", () => {
    const { paylater } = config.paymentCompleted;
    const { feeNotWaivedApiResponse } = config;
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/fees/waivers`,
      feeNotWaivedApiResponse
    ).as("waivers");
    // intercepting the payment api and stubbing the response to payment completed flow
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/payments`,
      paylater
    ).as("payment");
    cy.get("[data-cy=review-up-app-review-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.get("[data-cy='review-payment-section']").should("be.visible");
          // payment options should not be visible
          cy.get("[data-cy='review-payment-section']")
            .find('[ data-cy="review-app-payment"]')
            .should("not.exist");
          // payment completed alert message should be visible
          cy.get('[data-cy="review-payment-completed"]').should("be.visible");
          // checking if the amount is visible
          cy.get(
            '[data-cy="review-payment-completed"] #payment_amount'
          ).contains(ugAppStore.feeAmount);
          // checking the alert message
          cy.get(
            '[data-cy="review-payment-completed"] #completed_alert_message'
          ).contains(
            reviewContent.applicationFee.paymentCompletedConfirmMessage.payLater
          );
        });
      });
  });
  it("payment section completed payment: via pay now", () => {
    const { payNow } = config.paymentCompleted;
    const { feeNotWaivedApiResponse } = config;
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/fees/waivers`,
      feeNotWaivedApiResponse
    ).as("waivers");
    // intercepting the payment api and stubbing the response to payment completed flow
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/payments`,
      payNow
    ).as("payment");
    cy.get("[data-cy=review-up-app-review-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.get("[data-cy='review-payment-section']").should("be.visible");
          // payment options should not be visible
          cy.get("[data-cy='review-payment-section']")
            .find('[ data-cy="review-app-payment"]')
            .should("not.exist");
          // payment completed alert message should be visible
          cy.get('[data-cy="review-payment-completed"]').should("be.visible");
          // checking if the amount is visible
          cy.get(
            '[data-cy="review-payment-completed"] #payment_amount'
          ).contains(ugAppStore.feeAmount);
          // checking the alert message
          cy.get(
            '[data-cy="review-payment-completed"] #completed_alert_message'
          ).contains(
            reviewContent.applicationFee.paymentCompletedConfirmMessage.payNow
          );
        });
      });
  });
});

let access_token = null;
let appId = null;
let userDetails = null;
let cardDetails = [];

describe("Populate User details", () => {
  before(() => {
    // Get user details from fixture
    cy.fixture("users").then((users) => {
      userDetails = users[1];
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
});

describe("Nelnet testing", () => {
  before(() => {
    // Get user details from fixture
    cy.fixture("users").then((users) => {
      userDetails = users[1];
    });
  });
  beforeEach(() => {
    // Get user details from fixture
    cy.fixture("users").then((users) => {
      userDetails = users[1];
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
    });
  });

  it("Nelnet payment process testing", () => {
    // intercepting the payment submit api in nelnet page
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

    // making api call to get the nelnet redirect url
    cy.api({
      method: "POST",
      url: `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/paymentgateway/redirects`,
      headers: {
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
        Authorization: `Bearer ${access_token}`,
      },
      body: {
        clientRedirectUrl: `http://localhost:8080/payment/nelnet/callback?persistedAppId=${appId}`,
      },
    }).then((response) => {
      let cardIndex = Math.floor(Math.random() * cardDetails.length);

      // visiting the site first
      cy.visit("https://uatquikpayasp.com/");
      // visiting the path provided in redirect url
      cy.visit(response.body.data.redirectUrl);
      // checking the header text
      cy.get(
        ".xpt-is-non-production .xpt-header-non-production-banner-container"
      ).contains("TEST ENVIRONMENT");
      cy.get("#submitNext").click();
      // click on credit/debit button
      cy.get("#newCreditCard button").click();
      // enter card number
      cy.get("#creditCardNumber").type(cardDetails[cardIndex].number);
      cy.get("#accountHolderName").type(`UG Application`);
      const year = new Date().getFullYear().toString();
      cy.get("#creditCardExpiry").type(`01/${parseInt(year.slice(2)) + 1}`);
      cy.get("#cvv").type(cardDetails[cardIndex].cvv);
      // submitPayment
      cy.get("#submitPayment").click();
      cy.wait("@nelnetPaymentSubmission").then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        cy.readFile("cypress/fixtures/users.json").then((existingData) => {
          // Define the new user data to append
          let users = existingData;
          users[1].localRedirectUrl =
            response.body.transactionRedirect.localRedirectUrl;
          const updatedData = users;
          // Write the updated data back to the JSON file
          cy.writeFile("cypress/fixtures/users.json", updatedData);
        });
      });
      return;
    });
  });
});

describe("Nelnet callback route page testing", () => {
  before(() => {
    // Get user details from fixture
    cy.fixture("users").then((users) => {
      userDetails = users[1];
      cy.visit("/");
      cy.login(userDetails.email, userDetails.password);

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
    // Get user details from fixture
    cy.fixture("users").then((users) => {
      userDetails = users[1];
    });
    cy.interceptUiViewInfo(appId, "ug-app-arizona-residency", "ug-app-review");
    // validation api
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/validations`
    ).as("validationApiIntercept");
    // notificationIntercept
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");

    // stubbing the authorizepayment endpont
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/paymentgateway/authorizations`,
      { code: 200 }
    ).as("authorizePayment");
    // submit application endpoint
    cy.intercept(
      "PATCH",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/submit`,
      { code: 200 }
    ).as("submitApi");
    // uiView info intercept
    cy.intercept(
      "PUT",
      `${Cypress.env("baseUrl")}/api/ug/ui/view-info/${appId}`,
      {
        code: 201,
        data: {
          appId: "3138622",
          previousScreen: "ug-app-review",
          currentScreen: "ug-app-dashboard",
        },
      }
    ).as("uiViewInfo");
    // payments api
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/payments`,
      { code: 201 }
    ).as("paymentsApi");

    // Login
    cy.login(userDetails.email, userDetails.password);
  });

  it("URL without any payment details and appId in the query", () => {
    cy.visit("/dashboard");
    cy.get("[data-cy='dashboard-dashboard-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.appStore().then((appStore) => {
          cy.visit("payment/nelnet/callback");
          // if appid exists on store checking if default paylater is executed
          if (appStore.selectedUndergradApplicationId) {
            // checking if the paylater api is called
            cy.wait("@paymentsApi");

            // intercepting the application api to update the application status as submitted
            cy.intercept(
              "GET",
              `${Cypress.env("baseUrl")}/api/ug/applications`,
              (req) => {
                req.continue((res) => {
                  res.body.data[0].submitted = "Y";
                });
              }
            ).as("getApplication");

            // checking if the application is being submitted
            // verify validation api is called
            cy.wait("@validationApiIntercept");
            //  submition api
            cy.wait("@submitApi");
            // salesforce notification
            cy.wait("@notificationIntercept");
            // UI view info
            cy.wait("@uiViewInfo");
            // checking for the alert modal in post app dashboard
            cy.get(
              "[data-cy='app-dashboard-application-submission-alert'] h1"
            ).should("be.visible");
            cy.get(
              "[data-cy='app-dashboard-application-submission-alert'] button"
            ).click();
          } else {
            // checking if the user is landed on error page
            cy.url(`error`);
          }
        });
      });
  });

  it("URL with the appId and all the query details", () => {
    cy.visit(userDetails.localRedirectUrl);
    // verify authorise api is called
    cy.wait("@authorizePayment");
    // verify validation api is called
    cy.wait("@validationApiIntercept");
    //  submition api
    cy.wait("@submitApi");

    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications`,
      (req) => {
        req.continue((res) => {
          res.body.data[0].submitted = "Y";
        });
      }
    ).as("getApplication");
    // salesforce notification
    cy.wait("@notificationIntercept");
    // UI view info
    cy.wait("@uiViewInfo");
    // checking for the alert modal in post app dashboard
    cy.get("[data-cy='app-dashboard-application-submission-alert'] h1").should(
      "be.visible"
    );
    cy.get(
      "[data-cy='app-dashboard-application-submission-alert'] button"
    ).click();
  });

  it("when authorize payment api fails checking if the default paylater is triggered", () => {
    // interceting the authorization api and returning failed response
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/paymentgateway/authorizations`,
      { statusCode: 500 }
    ).as("authorizePayment");

    cy.visit(userDetails.localRedirectUrl);

    cy.wait("@authorizePayment");
    // checking if the paylater api is called
    cy.wait("@paymentsApi");

    // intercepting the application api to update the application status as submitted
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications`,
      (req) => {
        req.continue((res) => {
          res.body.data[0].submitted = "Y";
        });
      }
    ).as("getApplication");

    // checking if the application is being submitted
    // verify validation api is called
    cy.wait("@validationApiIntercept");
    //  submition api
    cy.wait("@submitApi");
    // salesforce notification
    cy.wait("@notificationIntercept");
    // UI view info
    cy.wait("@uiViewInfo");
    // checking for the alert modal in post app dashboard
    cy.get("[data-cy='app-dashboard-application-submission-alert'] h1").should(
      "be.visible"
    );
    cy.get(
      "[data-cy='app-dashboard-application-submission-alert'] button"
    ).click();
  });

  it("when validation api fails checking if user is redirected to error page", () => {
    // interceting the validation api and returning failed response
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/validations`,
      (req) => {
        // Modify the request or response as needed
        req.reply({
          code: 200,
          data: {
            RESIDENCY: [
              "LOC_STAT: Missing or invalid residency answer.",
              "LES_ST_RES: Missing or invalid residency answer.",
            ],
          },
        });
      }
    ).as("validationIntercept");

    cy.visit(userDetails.localRedirectUrl);

    // verify validation api is called
    cy.wait("@validationIntercept");
    // checking if the user is landed on error page
    cy.url().should("include", "error");
  });

  it("when authorize payment api fails and the payment is already completed", () => {
    // interceting the authorization api and returning failed response
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/paymentgateway/authorizations`,
      { statusCode: 500 }
    ).as("authorizePayment");
    // payments api
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/payments`,
      (req) => {
        // Modify the request or response as needed
        req.reply({ code: 500 });
      }
    ).as("paymentsApi");
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/payments`,
      {
        data: {
          code: 200,
          data: [
            {
              transactionId: null,
              transactionTotalAmount: null,
              transactionStatus: null,
              transactionDate: null,
              paymentType: "Mail Pending",
              paymentCode: "ME",
            },
          ],
        },
      }
    ).as("getPaymentsApi");

    cy.visit(userDetails.localRedirectUrl);

    cy.wait("@authorizePayment");
    // checking if the paylater api is called
    cy.wait("@paymentsApi");

    // checking if the get payments api is called
    cy.wait("@getPaymentsApi");

    // intercepting the application api to update the application status as submitted
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications`,
      (req) => {
        req.continue((res) => {
          res.body.data[0].submitted = "Y";
        });
      }
    ).as("getApplication");

    // checking if the application is being submitted
    // verify validation api is called
    cy.wait("@validationApiIntercept");
    //  submition api
    cy.wait("@submitApi");
    // salesforce notification
    cy.wait("@notificationIntercept");
    // UI view info
    cy.wait("@uiViewInfo");
    // checking for the alert modal in post app dashboard
    cy.get("[data-cy='app-dashboard-application-submission-alert'] h1").should(
      "be.visible"
    );
    cy.get(
      "[data-cy='app-dashboard-application-submission-alert'] button"
    ).click();
  });

  it("checking if the user is redirected to error page when the submittion api fails", () => {
    cy.intercept(
      "PATCH",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/submit`,
      (req) => {
        // Modify the request or response as needed
        req.reply({ statusCode: 500 });
      }
    ).as("submitApi");
    cy.visit(userDetails.localRedirectUrl);
    // verify authorise api is called
    cy.wait("@authorizePayment");
    // verify validation api is called
    cy.wait("@validationApiIntercept");
    //  submition api
    cy.wait("@submitApi");
    // checking the URL
    cy.url(`error`);
  });
});

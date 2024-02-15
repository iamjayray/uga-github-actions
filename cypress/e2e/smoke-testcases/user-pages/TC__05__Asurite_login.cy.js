let accessToken = null;

describe("Testcases for ASU rite login", () => {
  before(() => {
    cy.fixture("users").then((users) => {
      // Login
      cy.login(users[1].email, users[1].password).then((response) => {
        accessToken = response.value;
      });
    });
  });

  it("Landing on callback url with the code query parameter", () => {
    // stubbing the api and returning the token
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/login/asurite-shibboleth/token`,
      {
        code: 200,
        data: {
          accessToken: accessToken,
        },
      }
    ).as("asuRiteLogin");

    cy.visit("oauth2/callback/?code=test-code");
    // checking if the user is landed on dashboard
    cy.url().should("include", "/dashboard");
  });
  it("Landing on callback url with the code query parameter and asurite-shibboleth API fails", () => {
    // stubbing the api and returning the token
    cy.intercept(
      "POST",
      `${Cypress.env("baseUrl")}/api/ug/login/asurite-shibboleth/token`,
      {
        code: 400,
        errors: ["errors"],
      }
    ).as("asuRiteLogin");

    cy.visit("oauth2/callback/?code=test-code");
    // checking if the user is landed on dashboard
    cy.url().should("include", "error");
  });

  it("Landing on callback url with out the code query parameter", () => {
    // landing without the code parameter in the URL query
    cy.visit("oauth2/callback/");
    // checking if the user is landed to error page
    cy.url("error");
  });
});

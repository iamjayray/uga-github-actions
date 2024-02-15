/* eslint-disable no-undef */
/// <reference types="cypress"/>

let appId = null;
let accessToken = null;
let userDetails = null;

describe("API TESTING (GET CALLS - /ug/ui)", () => {
  before(() => {
    // user details
    cy.fixture("users").then((users) => {
      userDetails = users[1];

      // Get accessToken
      cy.api({
        method: "POST",
        url: `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/sign-in`,
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
        body: {
          email: userDetails.email,
          password: userDetails.password,
        },
      }).then((response) => {
        accessToken = response.body.data.accessToken;
        cy.writeFile(
          "cypress/fixtures/api-responses/login.json",
          JSON.stringify(response.body)
        );
        // Get appId
        cy.api({
          method: "GET",
          url: `${Cypress.env("baseUrl")}/api/ug/applications`,
          headers: {
            Accept: "application/aaa.v1+json",
            Authorization: `Bearer ${accessToken}`,
          },
        }).then((response) => {
          appId = response.body.data[0].appId;
        });
      });

      cy.interceptConfigGetCalls();
    });
  });

  it("should retrieve appid get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/ui/view-info/${appId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.all.keys(
        "appId",
        "currentScreen",
        "previousScreen"
      );
    });
  });
});

describe("API TESTING (GET CALLS - /ug/applications)", () => {
  before(() => {
    // user details
    cy.fixture("users").then((users) => {
      userDetails = users[1];

      // Get accessToken
      cy.api({
        method: "POST",
        url: `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/sign-in`,
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
        body: {
          email: userDetails.email,
          password: userDetails.password,
        },
      }).then((response) => {
        accessToken = response.body.data.accessToken;

        // Get appId
        cy.api({
          method: "GET",
          url: `${Cypress.env("baseUrl")}/api/ug/applications`,
          headers: {
            Accept: "application/aaa.v1+json",
            Authorization: `Bearer ${accessToken}`,
          },
        }).then((response) => {
          appId = response.body.data[0].appId;
        });
      });

      cy.interceptConfigGetCalls();
    });
  });

  it("should retrieve pronouns get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/pronouns`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      // todo: fix
      // Add more assertions if needed
    });
  });

  it("should retrieve genders get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/genders`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      // todo: fix
      // Add more assertions if needed
    });
  });

  it("should retrieve names get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/names`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then(({ body }) => {
      expect(body.code).to.eq(200);
    });
  });

  it("should retrieve addresses get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/addresses`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "addressId",
        "type",
        "street1",
        "street2",
        "city",
        "stateProvince",
        "postalCode",
        "countryCode"
      );
    });
  });

  // todo: fix
  // it("should retrieve waivers get call", () => {
  //   cy.api({
  //     method: "GET",
  //     url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/waivers`,
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       Accept: "application/aaa.v1+json",
  //       "Content-Type": "application/aaa.v1+json",
  //     },
  //   }).then((response) => {
  //     expect(response.status).to.eq(200);
  //     // Add more assertions if needed
  //   });
  // });

  it("should retrieve applications get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/applications`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "appId",
        "submitted",
        "createdAt",
        "submittedAt",
        "userInfo",
        "instStatus",
        "name"
      );
      expect(response.body.data[0].name).to.have.all.keys(
        "id",
        "nameType",
        "firstName",
        "lastName",
        "middleName",
        "suffix"
      );
      expect(response.body.data[0].userInfo).to.have.all.keys(
        "asuId",
        "attendedASU",
        "birthCountry",
        "citizenCountry",
        "dateOfBirth",
        "email",
        "firstGeneration",
        "preferredFirstName",
        "primaryLanguageAtHome",
        "primaryLanguageAtHomeOther",
        "sex",
        "ssn",
        "visaCode"
      );
    });
  });

  it("should retrieve appId get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("should retrieve addresses get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/addresses`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "addressId",
        "type",
        "street1",
        "street2",
        "city",
        "stateProvince",
        "postalCode",
        "countryCode"
      );
    });
  });

  it("should retrieve ethnicities get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/ethnicities`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "ethnicGroupCode",
        "culturalOriginCode",
        "reportingPreference"
      );
    });
  });

  it("should retrieve guardians get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/guardians`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "guardianId",
        "guardianName",
        "email",
        "guardianRelation",
        "firstName",
        "lastName",
        "phoneCountryCode",
        "phoneNumber",
        "isLiving",
        "highestSchoolingLevel",
        "previousAsuStudent"
      );
    });
  });

  it("should retrieve otherinstitutions get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/otherinstitutions`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.wrap(response.body).snapshot();

      // todo: fix
      // Add more assertions if needed
    });
  });

  // todo: fix
  // it("should retrieve payments get call", () => {
  //   cy.api({
  //     method: "GET",
  //     url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/payments`,
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       Accept: "application/aaa.v1+json",
  //       "Content-Type": "application/aaa.v1+json",
  //     },
  //   }).then((response) => {
  //     expect(response.status).to.eq(200);
  //     // Add more assertions if needed
  //   });
  // });

  it("should retrieve fees get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/fees`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.all.keys("fee");
    });
  });

  it("should retrieve fees waivers get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/fees/waivers`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(Object.keys(response.body.data).length).to.equal(1);
      expect(response.body.data).to.have.all.keys("hasWaiver");
    });
  });

  it("should retrieve fees waivers financialcircumstances get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/fees/waivers/financialcircumstances`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.all.keys(
        "eligibleForFinancialCircumstances"
      );
    });
  });
});

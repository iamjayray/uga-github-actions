/* eslint-disable no-undef */
/// <reference types="cypress"/>

describe("API TESTING (GET CALLS - /ug/config)", () => {
  it("should retrieve pronouns get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/pronouns`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.property("id", "1");
      expect(response.body.data[0]).to.have.property("displayOrder", 1);
      expect(response.body.data[0]).to.have.property("pronoun", "He/Him");

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/pronouns.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve genders get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/genders`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.property("id", "1");
      expect(response.body.data[0]).to.have.property("displayOrder", 1);
      expect(response.body.data[0]).to.have.property(
        "genderIdentity",
        "Female"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/genders.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve arizona native american tribes", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/tribes`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.property(
        "culturalOriginCode",
        "N188"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/tribes.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve application deadlines", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/deadlines`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      const elementOne = response.body.data.find(
        (item) => item.id === "2134_REG"
      );
      const elementTwo = response.body.data.find(
        (item) => item.id === "2247_SESB"
      );
      expect(elementOne).to.not.be.undefined;
      expect(elementTwo).to.not.be.undefined;
      expect(elementOne.id).to.eq("2134_REG");
      expect(elementTwo.id).to.eq("2247_SESB");

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/deadlines.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve application fees", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/fees`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "id",
        "feeType",
        "effTerm",
        "feeAmount"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/fees.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve az residency configurations", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/azresidency`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "resQuestionKey",
        "resQuestionText",
        "rsQuestionNumber"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/azresidency.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve financial circumstances configurations", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/financialcircumstances`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "id",
        "circumstance",
        "circumstanceSarName"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/financialcircumstances.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve gender identity configurations", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/genders`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "id",
        "displayOrder",
        "genderIdentity"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/genders.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve language list configurations", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/languages`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "id",
        "displayOrder",
        "language",
        "languageCode3"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/languages.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve pronoun configurations", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/pronouns`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "id",
        "displayOrder",
        "pronoun"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/pronouns.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve SAR question configurations", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/sarquestions`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys("code", "label");

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/sarquestions.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve user types available locations", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/usertypes/locations`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "id",
        "campusCode",
        "userType"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/locations.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve high school academic years", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/highschools/academicyears`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys("id", "acadYear");

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/academicyears.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve high school course items", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/highschools/courses`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "id",
        "name",
        "orderBy",
        "subjectId"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/courses.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve high school course levels", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/highschools/courselevels`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "id",
        "code",
        "name",
        "orderBy"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/courselevels.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve high school course subjects", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/highschools/coursesubjects`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "id",
        "minYearsRequired",
        "subjectName"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/coursesubjects.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve high school gpa scales", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/highschools/gpascales`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "id",
        "psScaleName",
        "scaleDisplay"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/gpascales.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve high school grade scale types", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env(
        "baseUrl"
      )}/api/ug/config/highschools/gradescaletypes`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "id",
        "displayScaleTypeName"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/gradescaletypes.json",
        JSON.stringify(response.body)
      );
    });
  });

  it("should retrieve high school grade items", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/highschools/grades`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "gpaScaleTypeId",
        "grade",
        "id",
        "orderBy"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/grades.json",
        JSON.stringify(response.body)
      );
    });
  });
  it("should retrieve high school grade termtypes", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}/api/ug/config/highschools/termtypes`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data[0]).to.have.all.keys(
        "typeName",
        "id",
        "orderBy"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/termtypes.json",
        JSON.stringify(response.body)
      );
    });
  });
});

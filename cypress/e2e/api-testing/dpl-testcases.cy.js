describe("API TESTING Data potluck", () => {
  it("should retrieve countries get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("dplBaseUrl")}/codeset/countries`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body[0]).to.have.property("description");
      expect(response.body[0]).to.have.property("countryCode");
      expect(response.body[0]).to.have.property("countryCodeTwoChar");

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/countries.json",
        JSON.stringify(response.body)
      );
    });
  });
  it("should retrieve undergraduate-admissions-corporate-partners get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env(
        "dplBaseUrl"
      )}/codeset/undergraduate-admissions-corporate-partners`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body[0]).to.have.property("corporatePartnerCode");
      expect(response.body[0]).to.have.property("corporatePartnerDescription");

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/undergraduate-admissions-corporate-partners.json",
        JSON.stringify(response.body)
      );
    });
  });
  it("should retrieve ethnicities get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("dplBaseUrl")}/codeset/ethnicities`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body[0]).to.have.property("ethnicCategoryCode");
      expect(response.body[0]).to.have.property("ethnicCategoryDescription");
      expect(response.body[0]).to.have.property("ethnicGroups");

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/ethnicities.json",
        JSON.stringify(response.body)
      );
    });
  });
  it("should retrieve usa-states-cities get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env(
        "dplBaseUrl"
      )}/codeset/external-organizations/usa-states-cities`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body[0]).to.have.property("stateCode");
      expect(response.body[0]).to.have.property("description");
      expect(response.body[0]).to.have.property("cities");

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/usa-states-cities.json",
        JSON.stringify(response.body)
      );
    });
  });
  it("should retrieve visa-permit-types get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("dplBaseUrl")}/codeset/visa-permit-types`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body[0]).to.have.property("visaPermitTypeCode");
      expect(response.body[0]).to.have.property("description");
      expect(response.body[0]).to.have.property("visaPermitClassCode");
      expect(response.body[0]).to.have.property("visaPermitClassDescription");

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/visa-permit-types.json",
        JSON.stringify(response.body)
      );
    });
  });
  it("should retrieve acad-plans get call", () => {
    cy.api({
      method: "GET",
      url: `${Cypress.env(
        "dplBaseUrl"
      )}/codeset/acad-plans?degreeType=UG&majorMapGeneral.campus=ONLNE&include=planCategories&include=subplans&include=campusesOffered&include=applicationDeadlines&include=applicantsMustChooseSecondMajor&filter=activeInDegreeSearch`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body[0]).to.have.property("acadPlanCode");
      expect(response.body[0]).to.have.property("acadPlanDescription");
      expect(response.body[0]).to.have.property("acadProgramCode");
      expect(response.body[0]).to.have.property(
        "applicantsMustChooseSecondMajor"
      );

      cy.wrap(response.body).snapshot();

      cy.writeFile(
        "cypress/fixtures/api-responses/acad-plans.json",
        JSON.stringify(response.body)
      );
    });
  });
});

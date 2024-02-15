import { getMonthDetails } from "../../../utils/UtilityService.js";
import mySchoolsContent from "../../../../src/content/my-schools.json";
let access_token = null;
let appId = null;
let userDetails = null;
let config;
let testCaseType = null;

describe("Populate User details", () => {
  before(() => {
    // Get user details from fixture
    cy.fixture("users").then((users) => {
      userDetails = users[0];
    });
    // Get file from Cypres env variable
    cy.readFile(`cypress/config/smoke-testing/my-schools.json`).then(
      (data) => (config = data)
    );
    cy.readFile(`cypress/config/constants.json`).then(({ testCaseTypes }) => {
      testCaseType = testCaseTypes.smokeTesting;
    });
  });

  it("populate userdetails and vist my schools page", () => {
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

  it("Reset page details", () => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(appId, "ug-app-my-program", "ug-app-my-schools");

    cy.visit(`ug-app/${appId}/my-schools`);

    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.resetSchoolsPage(ugAppStore, access_token, appId).then(() => {
            cy.populateUserDetails(appId, access_token, testCaseType);
          });
        });
      });
  });
});

describe("Testcases for highschool section", () => {
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);

    cy.interceptUiViewInfo(appId, "ug-app-my-program", "ug-app-my-schools");
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // country intercept
    cy.intercept("GET", `${Cypress.env("dplBaseUrl")}/codeset/country/*`).as(
      "stateApiIntercept"
    );
    // highschool organization intercept
    cy.intercept(
      "GET",
      `${Cypress.env(
        "dplBaseUrl"
      )}/codeset/external-organizations?schoolTypeCode=*&countryCode=*&stateCode=*&city=*`
    ).as("highschoolOrganizationsIntercept");

    cy.visit(`ug-app/${appId}/my-schools`);
  });

  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("Graduation school US with non Arizona state", () => {
    const { graduationSchoolUSnonArizon } = config.highschool;
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      // country
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-country"]',
        text: graduationSchoolUSnonArizon.country,
        errorMessage: config.errorMessage,
      });
      cy.wait("@stateApiIntercept");
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-state"]',
        text: graduationSchoolUSnonArizon.state,
        errorMessage: config.errorMessage,
      });

      // city
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-city"]',
        text: graduationSchoolUSnonArizon.city,
        errorMessage: config.errorMessage,
      });
      cy.wait("@highschoolOrganizationsIntercept");
      // Verifying the SAIS input is not displayed
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-sais']")
        .should("not.exist");
      //  verifying custom school name input is not visible
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-school-name']")
        .should("not.exist");
      // highschool
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-high-school"]',
        text: graduationSchoolUSnonArizon.school,
        errorMessage: config.errorMessage,
      });
      // verifing start-date and end-date fields are not visible
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-first-date']")
        .should("not.exist");
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-last-date']")
        .should("not.exist");

      // graduation date
      // month
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_month',
        text: graduationSchoolUSnonArizon.graduationDate.month,
        errorMessage: config.errorMessage,
      });
      // year
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_year',
        text: graduationSchoolUSnonArizon.graduationDate.year,
        errorMessage: config.errorMessage,
      });
      // save button
      cy.handleButton({
        buttonSelector: '[data-cy="my-schools-save-button"]',
      });
    });
  });

  it("Graduation school US Arizona state", () => {
    const { graduationSchoolUSArizon } = config.highschool;
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      // country
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-country"]',
        text: graduationSchoolUSArizon.country,
        errorMessage: config.errorMessage,
      });
      cy.wait("@stateApiIntercept");
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-state"]',
        text: graduationSchoolUSArizon.state,
        errorMessage: config.errorMessage,
      });

      // city
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-city"]',
        text: graduationSchoolUSArizon.city,
        errorMessage: config.errorMessage,
      });

      cy.wait("@highschoolOrganizationsIntercept");
      // Verifying the SAIS input is not displayed
      cy.get('[data-cy="my-schools-high-school-sais"]').should("be.visible");
      cy.handleBaseInput({
        selector: '[data-cy="my-schools-high-school-sais"]',
        text: graduationSchoolUSArizon.sais,
        errorMessage: config.errorMessage,
      });
      //  verifying custom school name input is not visible
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-school-name']")
        .should("not.exist");
      // highschool
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-high-school"]',
        text: graduationSchoolUSArizon.school,
        errorMessage: config.errorMessage,
      });
      // verifing start-date and end-date fields are not visible
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-first-date']")
        .should("not.exist");
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-last-date']")
        .should("not.exist");

      // graduation date
      // month
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_month',
        text: graduationSchoolUSArizon.graduationDate.month,
        errorMessage: config.errorMessage,
      });
      // year
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_year',
        text: graduationSchoolUSArizon.graduationDate.year,
        errorMessage: config.errorMessage,
      });
      // save button
      cy.handleButton({
        buttonSelector: '[data-cy="my-schools-save-button"]',
      });
    });
  });

  it("Graduation school non US ", () => {
    const { graduationSchoolNonUs } = config.highschool;
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      // country
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-country"]',
        text: graduationSchoolNonUs.country,
        errorMessage: config.errorMessage,
      });
      cy.wait("@stateApiIntercept");
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-state"]',
        text: graduationSchoolNonUs.state,
        errorMessage: config.errorMessage,
      });

      // city
      cy.handleBaseInput({
        selector: '[data-cy="my-schools-high-school-city"]',
        text: graduationSchoolNonUs.city,
        errorMessage: config.errorMessage,
      });
      //  verifying  school name dropdown is not visible
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-high-school']")
        .should("not.exist");
      // custom school name
      cy.handleBaseInput({
        selector: '[data-cy="my-schools-high-school-school-name"]',
        text: graduationSchoolNonUs.school,
        errorMessage: config.errorMessage,
      });
      // verifing start-date and end-date fields are not visible
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-first-date']")
        .should("not.exist");
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-last-date']")
        .should("not.exist");
      // graduation date
      // month
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_month',
        text: graduationSchoolNonUs.graduationDate.month,
        errorMessage: config.errorMessage,
      });
      // year
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_year',
        text: graduationSchoolNonUs.graduationDate.year,
        errorMessage: config.errorMessage,
      });
      // save button
      cy.handleButton({
        buttonSelector: '[data-cy="my-schools-save-button"]',
      });
    });
  });

  it("Enter additional school", () => {
    const { graduationSchoolNonUs } = config.highschool;
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      // Add another schools button should not be visible
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-new-high-school-button']")
        .should("not.exist");
      // country
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-country"]',
        text: graduationSchoolNonUs.country,
        errorMessage: config.errorMessage,
      });
      cy.wait("@stateApiIntercept");
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-state"]',
        text: graduationSchoolNonUs.state,
        errorMessage: config.errorMessage,
      });

      // city
      cy.handleBaseInput({
        selector: '[data-cy="my-schools-high-school-city"]',
        text: graduationSchoolNonUs.city,
        errorMessage: config.errorMessage,
      });
      //  verifying  school name dropdown is not visible
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-high-school']")
        .should("not.exist");
      // custom school name
      cy.handleBaseInput({
        selector: '[data-cy="my-schools-high-school-school-name"]',
        text: graduationSchoolNonUs.school,
        errorMessage: config.errorMessage,
      });
      // verifing start-date and end-date fields are not visible
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-first-date']")
        .should("not.exist");
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-last-date']")
        .should("not.exist");

      // graduation date
      // month
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_month',
        text: graduationSchoolNonUs.graduationDate.month,
        errorMessage: config.errorMessage,
      });
      // year
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_year',
        text: graduationSchoolNonUs.graduationDate.year,
        errorMessage: config.errorMessage,
      });
      // save button
      cy.handleButton({
        buttonSelector: '[data-cy="my-schools-save-button"]',
      });

      // after entering one school add new button should be visible
      cy.get('[data-cy="my-schools-new-high-school-button"]').should(
        "be.visible"
      );
      cy.get('[data-cy="my-schools-new-high-school-button"]').click();
      // country fields should be visible for second highschool input
      cy.get('[data-cy="my-schools-high-school-country"]').should("be.visible");
      // Entering second school to verify if the date related fields are displayed correctly
      // country
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-country"]',
        text: graduationSchoolNonUs.country,
        errorMessage: config.errorMessage,
      });
      cy.wait("@stateApiIntercept");
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-state"]',
        text: graduationSchoolNonUs.state,
        errorMessage: config.errorMessage,
      });

      // city
      cy.handleBaseInput({
        selector: '[data-cy="my-schools-high-school-city"]',
        text: graduationSchoolNonUs.city,
        errorMessage: config.errorMessage,
      });
      cy.get('[data-cy="my-schools-high-school-first-date"]').should(
        "be.visible"
      );
      cy.get('[data-cy="my-schools-high-school-last-date"]').should(
        "be.visible"
      );
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-graduation-date']")
        .should("not.exist");
    });
  });

  it("High school max length alert testcase", () => {
    const { maxLength } = config.highschool;
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/highschools`,
      (req) => {
        // Modify the request or response as needed
        req.reply(maxLength.highschool);
      }
    ).as("highschools");
    cy.intercept(
      "GET",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/highschoolacademics`,
      (req) => {
        // Modify the request or response as needed
        req.reply(maxLength.highschoolacademics);
      }
    ).as("highschools");

    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      // checking the length
      cy.get(
        '[data-cy="my-schools-high-school-details-table"] tbody tr'
      ).should("have.length", 10);

      // checking new highschool button to be disabled
      cy.get('[data-cy="my-schools-new-high-school-button"]').should(
        "be.disabled"
      );
    });
  });
  it("High school edit and delete operations", () => {
    const { nonUsSchool } = config.highschool;

    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      // country
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-country"]',
        text: nonUsSchool.country,
        errorMessage: config.errorMessage,
      });
      cy.wait("@stateApiIntercept");
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-state"]',
        text: nonUsSchool.state,
        errorMessage: config.errorMessage,
      });

      // city
      cy.handleBaseInput({
        selector: '[data-cy="my-schools-high-school-city"]',
        text: nonUsSchool.city,
        errorMessage: config.errorMessage,
      });
      //  verifying  school name dropdown is not visible
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-high-school']")
        .should("not.exist");
      // custom school name
      cy.handleBaseInput({
        selector: '[data-cy="my-schools-high-school-school-name"]',
        text: nonUsSchool.school,
        errorMessage: config.errorMessage,
      });

      // graduation date
      // month
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_month',
        text: nonUsSchool.graduationDate.month,
        errorMessage: config.errorMessage,
      });
      // year
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_year',
        text: nonUsSchool.graduationDate.year,
        errorMessage: config.errorMessage,
      });
      // save button
      cy.handleButton({
        buttonSelector: '[data-cy="my-schools-save-button"]',
      });
      //  verify edit and delete buttons as visible
      cy.get(
        '[data-cy="my-schools-high-school-details-table"] tbody tr'
      ).should("have.length", 1);
      cy.get('[data-cy="my-schools-high-school-details-table"] tbody tr')
        .first()
        .find('[data-cy="my-schools-high-school-details-table-edit-school"]')
        .should("be.visible");
      cy.get('[data-cy="my-schools-high-school-details-table"] tbody tr')
        .first()
        .find('[data-cy="my-schools-high-school-details-table-delete-school"]')
        .should("be.visible");
      // click on edit button
      cy.get('[data-cy="my-schools-high-school-details-table"] tbody tr')
        .first()
        .find('[data-cy="my-schools-high-school-details-table-edit-school"]')
        .click();
      // verify save and cancle button is visible
      cy.get('[data-cy="my-schools-save-button"]').should("be.visible");
      cy.get('[data-cy="my-schools-cancel-buttons"]').should("be.visible");
      // updating the name
      cy.handleBaseInput({
        selector: '[data-cy="my-schools-high-school-school-name"]',
        text: "test school name",
        errorMessage: config.errorMessage,
      });
      // save school
      cy.get('[data-cy="my-schools-save-button"]').click();
      cy.get(
        '[data-cy="my-schools-high-school-details-table"] tbody tr'
      ).should("have.length", 1);
      cy.get('[data-cy="my-schools-high-school-details-table"] tbody tr')
        .first()
        .contains("test school name");
      // delete school
      cy.get('[data-cy="my-schools-high-school-details-table"] tbody tr')
        .first()
        .find('[data-cy="my-schools-high-school-details-table-delete-school"]')
        .click();
      // checking the modal and buttons are visible
      cy.get('[data-cy="highschool-confirm-delete-modal"]').should(
        "be.visible"
      );
      cy.get(
        '[data-cy="highschool-confirm-delete-modal"] #cancel_button'
      ).should("be.visible");
      cy.get(
        '[data-cy="highschool-confirm-delete-modal"] #delete_button'
      ).should("be.visible");
      cy.get(
        '[data-cy="highschool-confirm-delete-modal"] #delete_button'
      ).click();
      // checking the inputs are visible to enter the graduation school
      cy.get('[data-cy="my-schools-high-school-country"]').should("be.visible");
    });
  });
});

describe("Testcases for college/otherinstitution section", () => {
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(appId, "ug-app-my-program", "ug-app-my-schools");
    cy.visit(`ug-app/${appId}/my-schools`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    // country intercept
    cy.intercept("GET", `${Cypress.env("dplBaseUrl")}/codeset/country/*`).as(
      "stateApiIntercept"
    );
    // institution organization with country intercept
    cy.intercept(
      "GET",
      `${Cypress.env(
        "dplBaseUrl"
      )}/codeset/external-organizations?schoolTypeCode=*&schoolTypeCode=*&schoolTypeCode=*&schoolTypeCode=*&schoolTypeCode=*&countryCode=*`
    ).as("institutionOrganizationsWithCountryIntercept");
    // institution organization with country,state intercept
    cy.intercept(
      "GET",
      `${Cypress.env(
        "dplBaseUrl"
      )}/codeset/external-organizations?schoolTypeCode=*&schoolTypeCode=*&schoolTypeCode=*&schoolTypeCode=*&schoolTypeCode=*&countryCode=*&stateCode=*`
    ).as("institutionOrganizationsWithStateIntercept");
    // institution organization with country,state,city intercept
    cy.intercept(
      "GET",
      `${Cypress.env(
        "dplBaseUrl"
      )}/codeset/external-organizations?schoolTypeCode=*&schoolTypeCode=*&schoolTypeCode=*&schoolTypeCode=*&schoolTypeCode=*&countryCode=*&stateCode=*&city=*`
    ).as("institutionOrganizationsIntercept");
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("Attended and not attended college/university", () => {
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-attended-college'] [data-cy="radio-group"] > div:nth-of-type(2) > label`,
      });
      cy.get("[data-cy='my-schools-college-and-universities']")
        .find("[data-cy='my-schools-total-semester-credits']")
        .should("not.exist");
      // checking inputs to enter college should not be visible
      cy.get("[data-cy='my-schools-college-and-universities']")
        .find("[data-cy='my-schools-institution-country']")
        .should("not.exist");
      // changing the status to attended
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-attended-college'] [data-cy="radio-group"] > div:nth-of-type(1) > label`,
      });
      // checking inputs transfer credit is visible
      cy.get('[data-cy="my-schools-total-semester-credits"]').should(
        "be.visible"
      );
      // checking inputs to enter college should be visible
      cy.get('[data-cy="my-schools-institution-country"]').should("be.visible");
    });
  });

  it("Transfer credit field with future and past dated highschool", () => {
    const { pastDatedSchool } = config.college.transferCredits;
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      // entering future dated school
      // country
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-country"]',
        text: pastDatedSchool.country,
        errorMessage: config.errorMessage,
      });
      cy.wait("@stateApiIntercept");
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-high-school-state"]',
        text: pastDatedSchool.state,
        errorMessage: config.errorMessage,
      });
      // city
      cy.handleBaseInput({
        selector: '[data-cy="my-schools-high-school-city"]',
        text: pastDatedSchool.city,
        errorMessage: config.errorMessage,
      });
      //  verifying  school name dropdown is not visible
      cy.get("[data-cy='my-schools-high-schools']")
        .find("[data-cy='my-schools-high-school-high-school']")
        .should("not.exist");
      // custom school name
      cy.handleBaseInput({
        selector: '[data-cy="my-schools-high-school-school-name"]',
        text: pastDatedSchool.school,
        errorMessage: config.errorMessage,
      });
      // graduation date
      // month
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_month',
        text: pastDatedSchool.graduationDate.month,
        errorMessage: config.errorMessage,
      });
      // year
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_year',
        text: pastDatedSchool.graduationDate.year,
        errorMessage: config.errorMessage,
      });
      // save button
      cy.handleButton({
        buttonSelector: '[data-cy="my-schools-save-button"]',
      });

      // attended college
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-attended-college'] [data-cy="radio-group"] > div:nth-of-type(1) > label`,
      });
      // semister credit input should not be visible
      cy.get("[data-cy='my-schools-total-semester-credits']").should(
        "be.visible"
      );
      // change the graduation date to past
      cy.get('[data-cy="my-schools-high-school-details-table"] tbody tr')
        .first()
        .find('[data-cy="my-schools-high-school-details-table-edit-school"]')
        .click();
      // update the graduation date to future
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_year',
        text: new Date().getFullYear() + 1,
        errorMessage: config.errorMessage,
      });
      // save
      cy.handleButton({
        buttonSelector: '[data-cy="my-schools-save-button"]',
      });
      // transfer credit should not be visible
      cy.get("[data-cy='my-schools-college-and-universities']")
        .find("[data-cy='my-schools-total-semester-credits']")
        .should("not.exist");
    });
  });

  it("college/ institution input", () => {
    const { collegeInputs } = config.college;
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      // attended college
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-attended-college'] [data-cy="radio-group"] > div:nth-of-type(1) > label`,
      });
      let institutesLength = 0;
      collegeInputs.forEach((institute) => {
        // new institution button
        if (institutesLength > 0) {
          cy.handleButton({
            buttonSelector: '[data-cy="my-schools-new-institution-button"]',
          });
        }
        // country
        cy.handleBaseSingleSelect({
          selector: '[data-cy="my-schools-institution-country"]',
          text: institute.country,
          errorMessage: config.errorMessage,
        });
        cy.wait("@stateApiIntercept");
        let isStatesAvailabel = true;
        cy.get("@stateApiIntercept").should(({ response }) => {
          isStatesAvailabel =
            response.body.states && response.body.states.length > 0;
        });
        if (!isStatesAvailabel) {
          cy.wait("@institutionOrganizationsWithCountryIntercept");
        }
        // state
        if (isStatesAvailabel) {
          // Select state from dropdown
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-schools-institution-state"]',
            text: institute.state,
            errorMessage: config.errorMessage,
          });
        } else {
          // Enter state in the input
          cy.handleBaseInput({
            selector: '[data-cy="my-schools-institution-state"]',
            text: institute.state,
            errorMessage: config.errorMessage,
          });
        }
        if (
          institute.country.toLowerCase() !== "united states" &&
          isStatesAvailabel
        ) {
          cy.wait("@institutionOrganizationsWithStateIntercept");
        }
        // city
        if (institute.country.toLowerCase() === "united states") {
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-schools-institution-city"]',
            text: institute.city,
            errorMessage: config.errorMessage,
          });
        } else {
          cy.handleBaseInput({
            selector: '[data-cy="my-schools-institution-city"]',
            text: institute.city,
            errorMessage: config.errorMessage,
          });
        }
        if (institute.country.toLowerCase() === "united states") {
          cy.wait("@institutionOrganizationsIntercept");
        }
        //  institution
        cy.handleBaseSingleSelect({
          selector: '[data-cy="my-schools-institution-institute"]',
          text: institute.institute,
          errorMessage: config.errorMessage,
        });
        // custom institute name
        if (institute.institute.toLowerCase() === "not listed") {
          cy.handleBaseInput({
            selector:
              '[data-cy="my-schools-institution-custom-institute-name"]',
            text: institute.customInstituteName,
            errorMessage: config.errorMessage,
          });
        }
        // Degree awarded
        cy.handleBaseSingleSelect({
          selector: '[data-cy="my-schools-institution-degree-awarded"]',
          text: institute.degreeAwarded,
          errorMessage: config.errorMessage,
        });
        // degree concentration
        if (institute.degreeAwarded.toLowerCase() !== "no degree awarded") {
          cy.handleBaseInput({
            selector: '[data-cy="my-schools-institution-degree-concentration"]',
            text: institute.degreeConcentration,
            errorMessage: config.errorMessage,
          });
        }
        // dateFirstAttended
        // month
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="my-schools-institution-date-first-attended"] #institute_first_date_month',
          text: institute.dateFirstAttended.month,
          errorMessage: config.errorMessage,
        });
        // year
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="my-schools-institution-date-first-attended"] #institute_first_date_year',
          text: institute.dateFirstAttended.year,
          errorMessage: config.errorMessage,
        });
        // dateLastAttended
        // month
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="my-schools-institution-date-last-attended"] #institute_last_date_month',
          text: institute.dateLastAttended.month,
          errorMessage: config.errorMessage,
        });
        // year
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="my-schools-institution-date-last-attended"] #institute_last_date_year',
          text: institute.dateLastAttended.year,
          errorMessage: config.errorMessage,
        });
        // save button
        cy.handleButton({
          buttonSelector: '[data-cy="my-schools-institution-save-buttons"]',
        });
        // updating the school length
        institutesLength++;
      });

      cy.get('[ data-cy="my-schools-institution-detail-table"]').should(
        "be.visible"
      );
      cy.get(
        '[ data-cy="my-schools-institution-detail-table"] tbody tr'
      ).should("have.length", 2);
    });
  });

  it("college/institution edit and delete functionality", () => {
    const { institute } = config.college.editAndDelete;
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      // attended college
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-attended-college'] [data-cy="radio-group"] > div:nth-of-type(1) > label`,
      });
      // country
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-institution-country"]',
        text: institute.country,
        errorMessage: config.errorMessage,
      });
      cy.wait("@stateApiIntercept");
      let isStatesAvailabel = true;
      cy.get("@stateApiIntercept").should(({ response }) => {
        isStatesAvailabel =
          response.body.states && response.body.states.length > 0;
      });
      if (!isStatesAvailabel) {
        cy.wait("@institutionOrganizationsWithCountryIntercept");
      }
      // state
      if (isStatesAvailabel) {
        // Select state from dropdown
        cy.handleBaseSingleSelect({
          selector: '[data-cy="my-schools-institution-state"]',
          text: institute.state,
          errorMessage: config.errorMessage,
        });
      } else {
        // Enter state in the input
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-institution-state"]',
          text: institute.state,
          errorMessage: config.errorMessage,
        });
      }
      if (
        institute.country.toLowerCase() !== "united states" &&
        isStatesAvailabel
      ) {
        cy.wait("@institutionOrganizationsWithStateIntercept");
      }
      // city
      if (institute.country.toLowerCase() === "united states") {
        cy.handleBaseSingleSelect({
          selector: '[data-cy="my-schools-institution-city"]',
          text: institute.city,
          errorMessage: config.errorMessage,
        });
      } else {
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-institution-city"]',
          text: institute.city,
          errorMessage: config.errorMessage,
        });
      }
      if (institute.country.toLowerCase() === "united states") {
        cy.wait("@institutionOrganizationsIntercept");
      }
      //  institution
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-institution-institute"]',
        text: institute.institute,
        errorMessage: config.errorMessage,
      });
      // custom institute name
      if (institute.institute.toLowerCase() === "not listed") {
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-institution-custom-institute-name"]',
          text: institute.customInstituteName,
          errorMessage: config.errorMessage,
        });
      }
      // Degree awarded
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-institution-degree-awarded"]',
        text: institute.degreeAwarded,
        errorMessage: config.errorMessage,
      });
      // degree concentration
      if (institute.degreeAwarded.toLowerCase() !== "no degree awarded") {
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-institution-degree-concentration"]',
          text: institute.degreeConcentration,
          errorMessage: config.errorMessage,
        });
      }
      // dateFirstAttended
      // month
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-institution-date-first-attended"] #institute_first_date_month',
        text: institute.dateFirstAttended.month,
        errorMessage: config.errorMessage,
      });
      // year
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-institution-date-first-attended"] #institute_first_date_year',
        text: institute.dateFirstAttended.year,
        errorMessage: config.errorMessage,
      });
      // dateLastAttended
      // month
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-institution-date-last-attended"] #institute_last_date_month',
        text: institute.dateLastAttended.month,
        errorMessage: config.errorMessage,
      });
      // year
      cy.handleBaseSingleSelect({
        selector:
          '[data-cy="my-schools-institution-date-last-attended"] #institute_last_date_year',
        text: institute.dateLastAttended.year,
        errorMessage: config.errorMessage,
      });
      // save button
      cy.handleButton({
        buttonSelector: '[data-cy="my-schools-institution-save-buttons"]',
      });

      //  verify edit and delete buttons as visible
      cy.get('[data-cy="my-schools-institution-detail-table"] tbody tr').should(
        "have.length",
        1
      );
      cy.get('[data-cy="my-schools-institution-detail-table"] tbody tr')
        .first()
        .find('[data-cy="my-schools-institution-details-table-edit-institite"]')
        .should("be.visible");
      cy.get('[data-cy="my-schools-institution-detail-table"] tbody tr')
        .first()
        .find(
          '[data-cy="my-schools-institution-details-table-delete-institite"]'
        )
        .should("be.visible");
      // click on edit button
      cy.get('[data-cy="my-schools-institution-detail-table"] tbody tr')
        .first()
        .find('[data-cy="my-schools-institution-details-table-edit-institite"]')
        .click();
      // verify save and cancle button is visible
      cy.get('[data-cy="my-schools-institution-save-buttons"]').should(
        "be.visible"
      );
      cy.get('[data-cy="my-schools-institution-cancel-buttons"]').should(
        "be.visible"
      );
      // updating the degree-awarded
      cy.handleBaseSingleSelect({
        selector: '[data-cy="my-schools-institution-degree-awarded"]',
        text: "Associate of arts",
        errorMessage: config.errorMessage,
      });
      // save school
      cy.get('[data-cy="my-schools-institution-save-buttons"]').click();
      cy.get('[data-cy="my-schools-institution-detail-table"] tbody tr').should(
        "have.length",
        1
      );
      // delete school
      cy.get('[data-cy="my-schools-institution-detail-table"] tbody tr')
        .first()
        .find(
          '[data-cy="my-schools-institution-details-table-delete-institite"]'
        )
        .click();
      // checking the modal and buttons are visible
      cy.get('[data-cy="institution-confirm-delete-modal"]').should(
        "be.visible"
      );
      cy.get(
        '[data-cy="institution-confirm-delete-modal"] #cancel_button'
      ).should("be.visible");
      cy.get(
        '[data-cy="institution-confirm-delete-modal"] #delete_button'
      ).should("be.visible");
      cy.get(
        '[data-cy="institution-confirm-delete-modal"] #delete_button'
      ).click();
      // checking the inputs are visible to enter the graduation school
      cy.get('[data-cy="my-schools-institution-country"]').should("be.visible");
    });
  });
});

describe("previous college eligibility", () => {
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(appId, "ug-app-my-program", "ug-app-my-schools");

    cy.visit(`ug-app/${appId}/my-schools`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("Verify previous college section is visible for user", () => {
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      cy.get("[data-cy='my-schools-view']")
        .find("[data-cy='my-schools-eligibility-to-return-to-colleges']")
        .should("not.exist");
      // attended college
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-attended-college'] [data-cy="radio-group"] > div:nth-of-type(1) > label`,
      });
      cy.get('[data-cy="my-schools-eligibility-to-return-to-colleges"]').should(
        "be.visible"
      );
      // changing to No
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-attended-college'] [data-cy="radio-group"] > div:nth-of-type(2) > label`,
      });
      cy.get("[data-cy='my-schools-view']")
        .find("[data-cy='my-schools-eligibility-to-return-to-colleges']")
        .should("not.exist");
    });
  });
  it("Eligible to return to college", () => {
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      // attended college
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-attended-college'] [data-cy="radio-group"] > div:nth-of-type(1) > label`,
      });
      cy.get("[data-cy='my-schools-eligibility-to-return-to-colleges']")
        .find("[data-cy='my-schools-previous-college-eligibility']")
        .should("not.exist");
      // eligible to return to college
      // NO
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-is-eligible-to-return-to-colleges'] [data-cy="radio-group"] > div:nth-of-type(2) > label`,
      });
      cy.get('[data-cy="my-schools-previous-college-eligibility"]').should(
        "be.visible"
      );
      // YES
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-is-eligible-to-return-to-colleges'] [data-cy="radio-group"] > div:nth-of-type(1) > label`,
      });
      cy.get("[data-cy='my-schools-eligibility-to-return-to-colleges']")
        .find("[data-cy='my-schools-previous-college-eligibility']")
        .should("not.exist");
    });
  });
  it("Prevoius college eligibility details", () => {
    const { first, second } = config.previousCollegeEligiibility;
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      // attended college
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-attended-college'] [data-cy="radio-group"] > div:nth-of-type(1) > label`,
      });
      // eligible to return to college
      // NO
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-is-eligible-to-return-to-colleges'] [data-cy="radio-group"] > div:nth-of-type(2) > label`,
      });
      cy.get('[data-cy="my-schools-previous-college-eligibility"]').should(
        "be.visible"
      );
      // first college
      // college name
      cy.handleBaseInput({
        selector: `[data-cy="my-schools-first-group-school-schoolname"]`,
        text: first.collegeName,
        errorMessage: config.errorMessage,
      });
      // reasons
      // academic related
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-first-group-academic-related'] [data-cy='radio-group'] > div:nth-of-type(${
          first.academicRelated.toLowerCase() === "yes"
            ? 1
            : first.academicRelated.toLowerCase() === "no"
            ? 2
            : 3
        }) > label`,
      });
      // Student conduct
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-first-group-student-conduct'] [data-cy='radio-group'] > div:nth-of-type(${
          first.academicRelated.toLowerCase() === "yes"
            ? 1
            : first.academicRelated.toLowerCase() === "no"
            ? 2
            : 3
        }) > label`,
      });
      // Other
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-first-group-other-reason'] [data-cy='radio-group'] > div:nth-of-type(${
          first.academicRelated.toLowerCase() === "yes"
            ? 1
            : first.academicRelated.toLowerCase() === "no"
            ? 2
            : 3
        }) > label`,
      });
      //explaination
      cy.handleBaseInput({
        selector: `[data-cy="my-schools-first-group-ineligibility-explaination"]`,
        text: first.collegeName,
        errorMessage: config.errorMessage,
      });

      // checking for the second college question is visible
      cy.get('[data-cy="my-schools-second-group-school-schoolname"]').should(
        "be.visible"
      );
      // entering second college
      // college name
      cy.handleBaseInput({
        selector: `[data-cy="my-schools-second-group-school-schoolname"]`,
        text: second.collegeName,
        errorMessage: config.errorMessage,
      });
      // reasons
      // academic related
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-second-group-academic-related'] [data-cy='radio-group'] > div:nth-of-type(${
          second.academicRelated.toLowerCase() === "yes"
            ? 1
            : second.academicRelated.toLowerCase() === "no"
            ? 2
            : 3
        }) > label`,
      });
      // Student conduct
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-second-group-student-conduct'] [data-cy='radio-group'] > div:nth-of-type(${
          second.academicRelated.toLowerCase() === "yes"
            ? 1
            : second.academicRelated.toLowerCase() === "no"
            ? 2
            : 3
        }) > label`,
      });
      // Other
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-second-group-other-reason'] [data-cy='radio-group'] > div:nth-of-type(${
          second.academicRelated.toLowerCase() === "yes"
            ? 1
            : second.academicRelated.toLowerCase() === "no"
            ? 2
            : 3
        }) > label`,
      });
      //explaination
      cy.handleBaseInput({
        selector: `[data-cy="my-schools-second-group-ineligibility-explaination"]`,
        text: second.collegeName,
        errorMessage: config.errorMessage,
      });
    });
  });
});

describe("Transcript policy and Name on transcript", () => {
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(appId, "ug-app-my-program", "ug-app-my-schools");

    cy.visit(`ug-app/${appId}/my-schools`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("Transcript policy", () => {
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      cy.get("[data-cy='my-schools-transcript-policy']").should("be.visible");
      // transcript  guide
      cy.get(
        "[data-cy='my-schools-transcript-policy'] #transcript_guide"
      ).click();
      cy.get("[data-cy='transcript-guide-sidebar']").should("be.visible");
      cy.get("[data-cy='transcript-guide-sidebar'] #sidebar_title").contains(
        "Transcript Requirements"
      );
      cy.get("[data-cy='transcript-guide-sidebar'] #back_button").click();
      // checking the transcript policy acknowledgement
      cy.get(
        `[data-cy='transcript-policy-acknowledgement'] [type="checkbox"]`
      ).check("Yes", { force: true });
      cy.get("[data-cy='transcript-policy-acknowledgement'] :checked")
        .should("be.checked")
        .and("have.value", "Yes");
    });
  });
  it("Name on transcript functionality", () => {
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      cy.userStore().then((userStore) => {
        cy.intercept(
          "POST",
          `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/names`,
          {
            code: 201,
            data: [
              ...userStore.names,
              {
                id: `${userStore.names.length + 1}`,
                nameType: "former",
                firstName: "test",
                lastName: "test",
                middleName: null,
                suffix: null,
              },
            ],
          }
        ).as("postNames");
        cy.intercept(
          "PUT",
          `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/names/*`,
          {
            code: 200,
            data: {
              id: `${userStore.names.length}`,
              nameType: "former",
              firstName: "testa",
              lastName: "testa",
              middleName: null,
              suffix: null,
            },
          }
        ).as("putNames");

        cy.handleBaseSingleSelect({
          selector: '[data-cy="my-schools-high-school-country"]',
          text: "Aland islands",
        });
        cy.get('[data-cy="my-schools-name-on-transcript-select"]').should(
          "be.visible"
        );
        cy.get(`[data-cy="my-schools-name-on-transcript-select"] input`).type(
          "other"
        );
        cy.get(`[data-cy="my-schools-name-on-transcript-select"] input`).type(
          "{enter}"
        );
        cy.get('[data-cy="former-name-add-or-edit-modal"]').should(
          "be.visible"
        );
        cy.get('[data-cy="my-schools-group_former_first_name"]').should(
          "be.visible"
        );
        cy.get('[data-cy="my-schools-group_former_last_name"]').should(
          "be.visible"
        );
        cy.get(
          '[data-cy="former-name-add-or-edit-modal"] #cancle_button'
        ).should("be.visible");
        cy.get('[data-cy="former-name-add-or-edit-modal"] #save_button').should(
          "be.visible"
        );
        // try adding new name
        cy.get(
          '[data-cy="former-name-add-or-edit-modal"] #save_button'
        ).click();
        // checking for errors
        cy.get(
          '[data-cy="my-schools-group_former_first_name"] div.invalid-feedback'
        ).should("be.visible");
        cy.get(
          '[data-cy="my-schools-group_former_last_name"] div.invalid-feedback'
        ).should("be.visible");
        // adding same name
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-group_former_first_name"]',
          text: userStore.names[0].firstName,
        });
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-group_former_last_name"]',
          text: userStore.names[0].lastName,
        });
        cy.get(
          '[data-cy="my-schools-group_former_first_name"] div.invalid-feedback'
        ).should("be.visible");
        cy.get(
          '[data-cy="my-schools-group_former_last_name"] div.invalid-feedback'
        ).should("be.visible");
        // entering special charecters
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-group_former_first_name"]',
          text: "@",
        });
        cy.get(
          '[data-cy="my-schools-group_former_first_name"] div.invalid-feedback'
        ).should("be.visible");
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-group_former_last_name"]',
          text: "@",
        });
        cy.get(
          '[data-cy="my-schools-group_former_last_name"] div.invalid-feedback'
        ).should("be.visible");
        // max length
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-group_former_first_name"]',
          text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        });
        cy.get(
          '[data-cy="my-schools-group_former_first_name"] div.invalid-feedback'
        ).should("be.visible");
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-group_former_last_name"]',
          text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        });
        cy.get(
          '[data-cy="my-schools-group_former_last_name"] div.invalid-feedback'
        ).should("be.visible");
        // entering the proper inputs
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-group_former_first_name"]',
          text: "test",
        });
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-group_former_last_name"]',
          text: "test",
        });
        cy.get(
          '[data-cy="former-name-add-or-edit-modal"] #save_button'
        ).click();
        cy.wait("@postNames");

        // updated the newely entered name
        cy.get(
          '[data-cy="my-schools-name-on-transcript-edit-name-link"]'
        ).click();
        // checking if the modal is visible
        cy.get('[data-cy="former-name-add-or-edit-modal"]').should(
          "be.visible"
        );
        // updating the names
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-group_former_first_name"]',
          text: "testa",
        });
        cy.handleBaseInput({
          selector: '[data-cy="my-schools-group_former_last_name"]',
          text: "testa",
        });
        cy.get(
          '[data-cy="former-name-add-or-edit-modal"] #save_button'
        ).click();
        cy.wait("@putNames");

        // click on edit and close the modal
        cy.get(
          '[data-cy="my-schools-name-on-transcript-edit-name-link"]'
        ).click();
        cy.get(
          '[data-cy="former-name-add-or-edit-modal"] #cancle_button'
        ).click();
        cy.get(`[data-cy="my-schools-name-on-transcript-select"] input`).type(
          `${userStore.names[0].firstName} ${userStore.names[0].lastName}`
        );
        cy.get(`[data-cy="my-schools-name-on-transcript-select"] input`).type(
          "{enter}"
        );
      });
    });
  });
});

describe("Two way binding", () => {
  beforeEach(() => {
    cy.interceptUiViewInfo(appId, "ug-app-my-program", "ug-app-my-schools");
    cy.stubUserPopulateDetails(appId, testCaseType);
    const apiCalls = [
      {
        key: "applications",
        endpoint: `${Cypress.env("baseUrl")}/api/ug/applications`,
      },
      {
        key: "highschools",
        endpoint: `${Cypress.env(
          "baseUrl"
        )}/api/ug/applications/${appId}/highschools`,
      },
      {
        key: "otherInstitutions",
        endpoint: `${Cypress.env(
          "baseUrl"
        )}/api/ug/applications/${appId}/otherinstitutions`,
      },
      {
        key: "sarQuestionResponses",
        endpoint: `${Cypress.env(
          "baseUrl"
        )}/api/ug/applications/${appId}/sarquestionresponses`,
      },
      {
        key: "highschoolacademics",
        endpoint: `${Cypress.env(
          "baseUrl"
        )}/api/ug/applications/${appId}/highschoolacademics`,
      },
    ];
    apiCalls.forEach((api) => {
      cy.intercept("GET", api.endpoint, (req) => {
        // Modify the request or response as needed
        req.reply(config.twoWayBindingResponses[api.key]);
      }).as(api.key);
    });
    // Login
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-schools`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("Highschools section", () => {
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        // highschools
        ugAppStore.highSchools.forEach((school) => {
          cy.get(
            '[data-cy="my-schools-high-school-details-table"] tbody tr'
          ).each((row) => {
            cy.wrap(row).contains(school.name);
            // click on edit and verify all the details are binding with the fields
            cy.wrap(row)
              .find(
                '[data-cy="my-schools-high-school-details-table-edit-school"]'
              )
              .click();

            // checking the fields
            // country
            cy.configStore().then((configStore) => {
              const country = configStore.highSchoolCountries.filter(
                (item) => item.value === school.country
              );

              cy.get(
                "[data-cy='my-schools-high-school-country'] .vs__selected"
              ).contains(country[0].text);
            });
            // State
            cy.configStore().then((configStore) => {
              const state = configStore.highSchoolStates.filter(
                (item) => item.value === school.state
              );
              if (state.length > 0) {
                cy.get(
                  "[data-cy='my-schools-high-school-state'] .vs__selected"
                ).contains(state[0].text);
              } else {
                cy.get("[data-cy='my-schools-high-school-state'] input").should(
                  "have.value",
                  school.state
                );
              }
            });
            // city
            if (school.country === "USA") {
              cy.get(
                "[data-cy='my-schools-high-school-city'] .vs__selected"
              ).contains(school.city);
            } else {
              cy.get("[data-cy='my-schools-high-school-city'] input").should(
                "have.value",
                school.city
              );
            }
            // SAIS
            if (school.sais) {
              cy.get("[data-cy='my-schools-high-school-sais'] input").should(
                "have.value",
                school.sais
              );
            }
            // High School
            if (school.country === "USA") {
              const schoolName =
                school.extOrgId || school.name === "Home School"
                  ? school.name
                  : "My High School is not on the list";
              cy.get(
                "[data-cy='my-schools-high-school-high-school'] .vs__selected"
              ).contains(schoolName);
            }
            // custom School name
            if (
              school.country !== "USA" ||
              (!school.extOrgId && school.name !== "Home School")
            ) {
              cy.get(
                "[data-cy='my-schools-high-school-school-name'] input"
              ).should("have.value", school.name);
            }
            // graduation date
            if (school.gradMonth && school.gradYear) {
              const month = getMonthDetails(school.gradMonth);
              // month
              cy.get(
                "[data-cy='my-schools-high-school-graduation-date'] #school_graduation_date_month .vs__selected"
              ).contains(month.text);
              // year
              cy.get(
                "[data-cy='my-schools-high-school-graduation-date'] #school_graduation_date_year .vs__selected"
              ).contains(school.gradYear);
            } else {
              // Date first attended
              const firstAttendedmonth = getMonthDetails(school.startMonth);
              // month
              cy.get(
                "[data-cy='my-schools-high-school-first-date'] #school_first_date_month .vs__selected"
              ).contains(firstAttendedmonth.text);
              // year
              cy.get(
                "[data-cy='my-schools-high-school-first-date'] #school_first_date_year .vs__selected"
              ).contains(school.startYear);
              // Date last attended
              const lastAttendedmonth = getMonthDetails(school.endMonth);
              // month
              cy.get(
                "[data-cy='my-schools-high-school-last-date'] #school_last_date_month .vs__selected"
              ).contains(lastAttendedmonth.text);
              // year
              cy.get(
                "[data-cy='my-schools-high-school-last-date'] #school_last_date_year .vs__selected"
              ).contains(school.endYear);
            }
            // name on transcript
            cy.userStore().then((userStore) => {
              const name = userStore.names.filter(
                (item) => item.id === school.transcriptNameId
              );
              cy.get(
                "[data-cy='my-schools-group_school_transcript_name']"
              ).contains(`${name[0].firstName} ${name[0].lastName}`);
            });
            // close to check the next one
            cy.get("[data-cy='my-schools-cancel-buttons']").click();
          });
        });
      });
    });
  });
  it("College and other institution section", () => {
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.get("[data-cy='my-schools-attended-college'] :checked")
          .should("be.checked")
          .and("have.value", ugAppStore.institutionStatus);
        //checking if user attend college
        if (ugAppStore.institutionStatus === "attended/attending college") {
          // transfer credits
          if (
            parseInt(ugAppStore.mySchoolsSar.college.totelSemisterCredits) !== 0
          ) {
            cy.get(
              "[data-cy='my-schools-total-semester-credits'] input"
            ).should(
              "have.value",
              ugAppStore.mySchoolsSar.college.totelSemisterCredits
            );
          }

          // institutions
          ugAppStore.otherInstitutions.forEach((institution) => {
            cy.get(
              '[data-cy="my-schools-institution-detail-table"] tbody tr'
            ).each((row) => {
              cy.wrap(row).contains(institution.name);
              // click on edit and verify all the details are binding with the fields
              cy.wrap(row)
                .find(
                  '[data-cy="my-schools-institution-details-table-edit-institite"]'
                )
                .click();
              // checking the fields
              // country
              cy.configStore().then((configStore) => {
                const country = configStore.institutionCountries.filter(
                  (item) => item.value === institution.countryCode
                );

                cy.get(
                  "[data-cy='my-schools-institution-country'] .vs__selected"
                ).contains(country[0].text);
              });
              // State
              cy.configStore().then((configStore) => {
                const state = configStore.institutionStates.filter(
                  (item) => item.value === institution.stateProvince
                );
                if (state.length > 0) {
                  cy.get(
                    "[data-cy='my-schools-institution-state'] .vs__selected"
                  ).contains(state[0].text);
                } else {
                  cy.get(
                    "[data-cy='my-schools-institution-state'] input"
                  ).should("have.value", institution.stateProvince);
                }
              });
              // city
              if (institution.countryCode === "USA") {
                cy.get(
                  "[data-cy='my-schools-institution-city'] .vs__selected"
                ).contains(institution.city);
              } else {
                cy.get("[data-cy='my-schools-institution-city'] input").should(
                  "have.value",
                  institution.city
                );
              }
              // institution
              const instituteName = institution.extOrgId
                ? institution.name
                : "Not listed";
              cy.get(
                "[data-cy='my-schools-institution-institute'] .vs__selected"
              ).contains(instituteName);

              // custom institution name
              if (!institution.extOrgId) {
                cy.get(
                  "[data-cy='my-schools-institution-custom-institute-name'] input"
                ).should("have.value", institution.name);
              }
              // Degree awarded
              const degreeAwarded =
                mySchoolsContent.college.institution.degreeAwarded.options.filter(
                  (item) => item.value === institution.degreeCode
                );
              cy.get(
                "[data-cy='my-schools-institution-degree-awarded'] .vs__selected"
              ).contains(degreeAwarded[0].text);
              // Degree concentration
              if (institution.degreeCode !== "none") {
                cy.get(
                  "[data-cy='my-schools-institution-degree-concentration'] input"
                ).should("have.value", institution.concentration);
              }
              // Date first attended
              const firstAttendedmonth = getMonthDetails(
                institution.firstAttendedMonth
              );
              // month
              cy.get(
                "[data-cy='my-schools-institution-date-first-attended'] #institute_first_date_month .vs__selected"
              ).contains(firstAttendedmonth.text);
              // year
              cy.get(
                "[data-cy='my-schools-institution-date-first-attended'] #institute_first_date_year .vs__selected"
              ).contains(institution.firstAttendedYear);
              // Date last attended
              const lastAttendedmonth = getMonthDetails(
                institution.lastAttendedMonth
              );
              // month
              cy.get(
                "[data-cy='my-schools-institution-date-last-attended'] #institute_last_date_month .vs__selected"
              ).contains(lastAttendedmonth.text);
              // year
              cy.get(
                "[data-cy='my-schools-institution-date-last-attended'] #institute_last_date_year .vs__selected"
              ).contains(institution.lastAttendedYear);
              // name on transcript
              cy.userStore().then((userStore) => {
                const name = userStore.names.filter(
                  (item) => item.id === institution.transcriptNameId
                );
                cy.get(
                  "[data-cy='my-schools-group_institute_transcript_name']"
                ).contains(`${name[0].firstName} ${name[0].lastName}`);
              });
              // close to check the next one
              cy.get(
                "[data-cy='my-schools-institution-cancel-buttons']"
              ).click();
            });
          });
        }
      });
    });
  });
  it("Previous College eligibility", () => {
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        if (ugAppStore.institutionStatus === "attended/attending college") {
          cy.get(
            "[data-cy='my-schools-is-eligible-to-return-to-colleges'] :checked"
          )
            .should("be.checked")
            .and(
              "have.value",
              ugAppStore.mySchoolsSar.iseligibleToReturnToColleges
            );
          if (ugAppStore.mySchoolsSar.iseligibleToReturnToColleges === "N") {
            Object.keys(
              ugAppStore.mySchoolsSar.ineligibleToReturnCollege
            ).forEach((key) => {
              if (
                key !== "second" ||
                (key === "second" &&
                  ugAppStore.mySchoolsSar.ineligibleToReturnCollege[key].name)
              ) {
                // school name
                cy.get(
                  `[data-cy='my-schools-${key}-group-school-schoolname'] input`
                ).should(
                  "have.value",
                  ugAppStore.mySchoolsSar.ineligibleToReturnCollege[key].name
                );
                // reasons
                // Academic related
                cy.get(
                  `[data-cy='my-schools-${key}-group-academic-related'] :checked`
                )
                  .should("be.checked")
                  .and(
                    "have.value",
                    ugAppStore.mySchoolsSar.ineligibleToReturnCollege[key]
                      .reasons.academicRelated
                  );
                // Student conduct
                cy.get(
                  `[data-cy='my-schools-${key}-group-student-conduct'] :checked`
                )
                  .should("be.checked")
                  .and(
                    "have.value",
                    ugAppStore.mySchoolsSar.ineligibleToReturnCollege[key]
                      .reasons.studentConduct
                  );
                // Other
                cy.get(
                  `[data-cy='my-schools-${key}-group-other-reason'] :checked`
                )
                  .should("be.checked")
                  .and(
                    "have.value",
                    ugAppStore.mySchoolsSar.ineligibleToReturnCollege[key]
                      .reasons.other
                  );
                // explaination
                cy.get(
                  `[data-cy='my-schools-${key}-group-ineligibility-explaination'] input`
                ).should(
                  "have.value",
                  ugAppStore.mySchoolsSar.ineligibleToReturnCollege[key].reasons
                    .explaination
                );
              }
            });
          }
        }
      });
    });
  });
  it("Transcript policy acknowledgement", () => {
    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      cy.get("[data-cy='transcript-policy-acknowledgement'] :checked")
        .should("be.checked")
        .and("have.value", "Yes");
    });
  });
});

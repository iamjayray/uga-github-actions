let access_token = null;
let appId = null;
let ugAppStore = null;
let configStore = null;
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

  it("populate userdetails and visit my schools page", () => {
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
          "ug-app-my-program",
          "ug-app-my-schools"
        );
        // populate other user details
        cy.populateUserDetails(appId, access_token, testCaseType);
      });
    });
  });
});

describe(`My Schools Tests: ${currentScenario}`, () => {
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

    cy.visit(`ug-app/${appId}/my-schools`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);

    // Get store and check if current screen is my-information
    cy.ugApplicationStore().then((store) => {
      ugAppStore = store;
    });
    cy.configStore().then((store) => {
      configStore = store;
    });
  });

  it("handle master suite", () => {
    // country intercept
    cy.intercept("GET", `${Cypress.env("dplBaseUrl")}/codeset/country/*`).as(
      "stateApiIntercept"
    );
    // salesforce notification intercept
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");
    // highschool organization intercept
    cy.intercept(
      "GET",
      `${Cypress.env(
        "dplBaseUrl"
      )}/codeset/external-organizations?schoolTypeCode=*&countryCode=*&stateCode=*&city=*`
    ).as("highschoolOrganizationsIntercept");
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

    const {
      schools,
      college,
      iseligibleToReturnToColleges,
      ineligibleToReturnCollege,
    } = config.mySchools;

    cy.get("[data-cy='my-schools-view']", {
      timeout: 30000,
    }).then(() => {
      // SECTION: Current or most recent high school
      let schoolLength = ugAppStore.highSchools.length;
      // Country
      schools.forEach((school) => {
        if (schoolLength < 10) {
          // new school button
          if (schoolLength > 0) {
            cy.handleButton({
              buttonSelector: '[data-cy="my-schools-new-high-school-button"]',
            });
          }
          // country
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-schools-high-school-country"]',
            text: school.country.text,
            errorMessage: config.errorMessage,
          });
          cy.wait("@stateApiIntercept");
          let isStatesAvailabel = true;
          cy.get("@stateApiIntercept").should(({ response }) => {
            isStatesAvailabel =
              response.body.states && response.body.states.length > 0;
          });
          // state
          if (isStatesAvailabel) {
            // Select state from dropdown
            cy.handleBaseSingleSelect({
              selector: '[data-cy="my-schools-high-school-state"]',
              text: school.state.text,
              errorMessage: config.errorMessage,
            });
          } else {
            // Enter state in the input
            cy.handleBaseInput({
              selector: '[data-cy="my-schools-high-school-state"]',
              text: school.state.text,
              errorMessage: config.errorMessage,
            });
          }
          // city
          if (school.country.text.toLowerCase() === "united states") {
            cy.handleBaseSingleSelect({
              selector: '[data-cy="my-schools-high-school-city"]',
              text: school.city.text,
              errorMessage: config.errorMessage,
            });
          } else {
            cy.handleBaseInput({
              selector: '[data-cy="my-schools-high-school-city"]',
              text: school.city.text,
              errorMessage: config.errorMessage,
            });
          }
          if (school.country.text.toLowerCase() === "united states") {
            cy.wait("@highschoolOrganizationsIntercept");
          }
          // SAIS
          if (school.state.text.toLowerCase() === "arizona" && school.sais) {
            cy.handleBaseInput({
              selector: '[data-cy="my-schools-high-school-sais"]',
              text: school.sais,
              errorMessage: config.errorMessage,
            });
          }
          // highschool
          if (school.country.text.toLowerCase() === "united states") {
            cy.handleBaseSingleSelect({
              selector: '[data-cy="my-schools-high-school-high-school"]',
              text: school.highSchool.text,
              errorMessage: config.errorMessage,
            });
          }
          if (
            school.country.text.toLowerCase() !== "united states" ||
            school.highSchool.text.toLowerCase() ===
              "my high school is not on the list"
          ) {
            cy.handleBaseInput({
              selector: '[data-cy="my-schools-high-school-school-name"]',
              text:
                school.country.text.toLowerCase() === "united states"
                  ? school.customSchoolName
                  : school.highSchool,
              errorMessage: config.errorMessage,
            });
          }
          // graduation date
          if (
            school.graduationDate.month?.text &&
            school.graduationDate.year?.text
          ) {
            // month
            cy.handleBaseSingleSelect({
              selector:
                '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_month',
              text: school.graduationDate.month.text,
              errorMessage: config.errorMessage,
            });
            // year
            cy.handleBaseSingleSelect({
              selector:
                '[data-cy="my-schools-high-school-graduation-date"] #school_graduation_date_year',
              text: school.graduationDate.year.text,
              errorMessage: config.errorMessage,
            });
          } else {
            // dateFirstAttended
            // month
            cy.handleBaseSingleSelect({
              selector:
                '[data-cy="my-schools-high-school-first-date"] #school_first_date_month',
              text: school.dateFirstAttended.month.text,
              errorMessage: config.errorMessage,
            });
            // year
            cy.handleBaseSingleSelect({
              selector:
                '[data-cy="my-schools-high-school-first-date"] #school_first_date_year',
              text: school.dateFirstAttended.year.text,
              errorMessage: config.errorMessage,
            });
            // dateLastAttended
            // month
            cy.handleBaseSingleSelect({
              selector:
                '[data-cy="my-schools-high-school-last-date"] #school_last_date_month',
              text: school.dateLastAttended.month.text,
              errorMessage: config.errorMessage,
            });
            // year
            cy.handleBaseSingleSelect({
              selector:
                '[data-cy="my-schools-high-school-last-date"] #school_last_date_year',
              text: school.dateLastAttended.year.text,
              errorMessage: config.errorMessage,
            });
          }
          // save button
          cy.handleButton({
            buttonSelector: '[data-cy="my-schools-save-button"]',
          });
          // updating the school length
          schoolLength++;
        } else {
          cy.log(
            `High school limit excedded, Unable to enter school ${school.highSchool.text}`
          );
        }
      });

      // SECTION: Colleges and universities
      cy.handleRadioButton({
        radioSelector: `[data-cy='my-schools-attended-college'] [data-cy="radio-group"] > div:nth-of-type(${
          college.attendedCollege.text.toLowerCase() === "yes" ? 1 : 2
        }) > label`,
      });
      if (college.attendedCollege.text.toLowerCase() === "yes") {
        // semister credits
        cy.get('[data-cy="my-schools-college-and-universities"]').then(
          (section) => {
            if (
              section.find(`[data-cy="my-schools-total-semester-credits"]`)
                .length > 0 &&
              college.totelSemisterCredits
            ) {
              cy.handleBaseSingleSelect({
                selector: `[data-cy="my-schools-total-semester-credits"]`,
                text: college.totelSemisterCredits,
                errorMessage: config.errorMessage,
              });
            }
          }
        );
        let institutesLength = ugAppStore.otherInstitutions.length;
        // institutions
        college.institutions.forEach((institute) => {
          // new institution button
          if (institutesLength > 0) {
            cy.handleButton({
              buttonSelector: '[data-cy="my-schools-new-institution-button"]',
            });
          }
          // country
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-schools-institution-country"]',
            text: institute.country.text,
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
              text: institute.state.text,
              errorMessage: config.errorMessage,
            });
          } else {
            // Enter state in the input
            cy.handleBaseInput({
              selector: '[data-cy="my-schools-institution-state"]',
              text: institute.state.text,
              errorMessage: config.errorMessage,
            });
          }
          if (
            institute.country.text.toLowerCase() !== "united states" &&
            configStore.institutionStates.length > 0
          ) {
            cy.wait("@institutionOrganizationsWithStateIntercept");
          }
          // city
          if (institute.country.text.toLowerCase() === "united states") {
            cy.handleBaseSingleSelect({
              selector: '[data-cy="my-schools-institution-city"]',
              text: institute.city.text,
              errorMessage: config.errorMessage,
            });
          } else {
            cy.handleBaseInput({
              selector: '[data-cy="my-schools-institution-city"]',
              text: institute.city,
              errorMessage: config.errorMessage,
            });
          }
          if (institute.country.text.toLowerCase() === "united states") {
            cy.wait("@institutionOrganizationsIntercept");
          }
          //  institution
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-schools-institution-institute"]',
            text: institute.institute.text,
            errorMessage: config.errorMessage,
          });
          // custom institute name
          if (institute.institute.text.toLowerCase() === "not listed") {
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
            text: institute.degreeAwarded.text,
            errorMessage: config.errorMessage,
          });
          // degree concentration
          if (
            institute.degreeAwarded.text.toLowerCase() !== "no degree awarded"
          ) {
            cy.handleBaseInput({
              selector:
                '[data-cy="my-schools-institution-degree-concentration"]',
              text: institute.degreeConcentration,
              errorMessage: config.errorMessage,
            });
          }
          // dateFirstAttended
          // month
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="my-schools-institution-date-first-attended"] #institute_first_date_month',
            text: institute.dateFirstAttended.month.text,
            errorMessage: config.errorMessage,
          });
          // year
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="my-schools-institution-date-first-attended"] #institute_first_date_year',
            text: institute.dateFirstAttended.year.text,
            errorMessage: config.errorMessage,
          });
          // dateLastAttended
          // month
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="my-schools-institution-date-last-attended"] #institute_last_date_month',
            text: institute.dateLastAttended.month.text,
            errorMessage: config.errorMessage,
          });
          // year
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="my-schools-institution-date-last-attended"] #institute_last_date_year',
            text: institute.dateLastAttended.year.text,
            errorMessage: config.errorMessage,
          });
          // save button
          cy.handleButton({
            buttonSelector: '[data-cy="my-schools-institution-save-buttons"]',
          });
          // updating the school length
          institutesLength++;
        });
        // institutions END
        // Previous college eligibility
        // is eligible
        cy.handleRadioButton({
          radioSelector: `[data-cy='my-schools-is-eligible-to-return-to-colleges'] [data-cy="radio-group"] > div:nth-of-type(${
            iseligibleToReturnToColleges.text.toLowerCase() === "yes" ? 1 : 2
          }) > label`,
        });
        // in eligible college details
        if (iseligibleToReturnToColleges.text.toLowerCase() === "no") {
          for (let key in ineligibleToReturnCollege) {
            const collegeIndex = key === "first" ? "first" : "second";
            // college name
            cy.handleBaseInput({
              selector: `[data-cy="my-schools-${collegeIndex}-group-school-schoolname"]`,
              text: ineligibleToReturnCollege[collegeIndex].name,
              errorMessage: config.errorMessage,
            });
            // reasons
            // academic related
            cy.handleRadioButton({
              radioSelector: `[data-cy='my-schools-${collegeIndex}-group-academic-related'] [data-cy='radio-group'] > div:nth-of-type(${
                ineligibleToReturnCollege[
                  collegeIndex
                ].reasons.academicRelated.text.toLowerCase() === "yes"
                  ? 1
                  : ineligibleToReturnCollege[
                      collegeIndex
                    ].reasons.academicRelated.text.toLowerCase() === "no"
                  ? 2
                  : 3
              }) > label`,
            });
            // Student conduct
            cy.handleRadioButton({
              radioSelector: `[data-cy='my-schools-${collegeIndex}-group-student-conduct'] [data-cy='radio-group'] > div:nth-of-type(${
                ineligibleToReturnCollege[
                  collegeIndex
                ].reasons.studentConduct.text.toLowerCase() === "yes"
                  ? 1
                  : ineligibleToReturnCollege[
                      collegeIndex
                    ].reasons.studentConduct.text.toLowerCase() === "no"
                  ? 2
                  : 3
              }) > label`,
            });
            // Other
            cy.handleRadioButton({
              radioSelector: `[data-cy='my-schools-${collegeIndex}-group-other-reason'] [data-cy='radio-group'] > div:nth-of-type(${
                ineligibleToReturnCollege[
                  collegeIndex
                ].reasons.other.text.toLowerCase() === "yes"
                  ? 1
                  : ineligibleToReturnCollege[
                      collegeIndex
                    ].reasons.other.text.toLowerCase() === "no"
                  ? 2
                  : 3
              }) > label`,
            });
            //explaination
            cy.handleBaseInput({
              selector: `[data-cy="my-schools-${collegeIndex}-group-ineligibility-explaination"]`,
              text: ineligibleToReturnCollege[collegeIndex].reasons
                .explaination,
              errorMessage: config.errorMessage,
            });
          }
        }
      }

      //  Transcript policy acknowledgement
      cy.get(
        `[data-cy='transcript-policy-acknowledgement'] [type="checkbox"]`
      ).check("Yes", { force: true });

      // SECTION: handle save button
      cy.handleButton({
        buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
      }).then(() => {
        cy.wait("@notificationIntercept", { timeout: 30000 });
        cy.url(`ug-app/${appId}/my-high-school-grades`);
      });
    });
  });
});

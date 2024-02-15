import { getFormettedDOB } from "../../../utils/UtilityService.js";
import residencyContent from "../../../../src/content/arizona-residency.json";

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
    cy.readFile(`cypress/config/smoke-testing/arizona-residency.json`).then(
      (data) => (config = data)
    );
    cy.readFile(`cypress/config/constants.json`).then(({ testCaseTypes }) => {
      testCaseType = testCaseTypes.smokeTesting;
    });
  });

  it("populate userdetails and vist arizona residency page", () => {
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
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-high-school-grades",
      "ug-app-arizona-residency"
    );
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-high-school-grades`);

    cy.get("[data-cy='my-high-school-grades-view']", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        cy.ugApplicationStore().then((ugAppStore) => {
          // resetting the current page details
          cy.resetArizonaResidencyPage(ugAppStore, access_token, appId).then(
            () => {
              cy.populateUserDetails(appId, access_token, testCaseType);
            }
          );
        });
      });
  });
});

describe("Non US citizen", () => {
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-high-school-grades",
      "ug-app-arizona-residency"
    );

    cy.visit(`ug-app/${appId}/arizona-residency`);
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("Non US citizen page view", () => {
    const { nonUsCitizenVisaCode, nonUsCountryCode } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.userStore().then((userStore) => {
        userStore.visaCode = nonUsCitizenVisaCode;
        userStore.citizenCountry = nonUsCountryCode;
        cy.get('[data-cy="arizon-residency-page-heading-and-eta"]').contains(
          "Based on the information you provided, it appears that you are not a resident of the United States. Therefore, this page is not necessary. Please continue to the next step."
        );
        cy.get('[data-cy="arizona-residency-view"]')
          .find('[data-cy="arizona-residency-domicile"]')
          .should("not.exist");
      });
    });
  });
});

describe("US citizen", () => {
  beforeEach(() => {
    const { applicationsResponse, validVisaCode } = config;
    // Login
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-high-school-grades",
      "ug-app-arizona-residency"
    );
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);

    applicationsResponse.data[0].userInfo.visaCode = validVisaCode;

    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications`,
      (req) => {
        // Modify the request or response as needed
        req.reply(applicationsResponse);
      }
    ).as("applications");

    cy.visit(`ug-app/${appId}/arizona-residency`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("US citizen with no native american eligibility, Studied outside Az, no military affiliation", () => {
    const { highschool, militaryAffiliations } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          ugAppStore.highSchools = highschool.studiedOutSideArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.none;
          ugAppStore.ethnicities = [];
          // permanent home
          cy.get(
            "[data-cy='arizona-residency-domicile-group-permanent-home']"
          ).should("be.visible");
          // setting the permanent home to alabama
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="arizona-residency-domicile-group-permanent-home"]',
            text: "alabama",
          });
          // enrollment
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizon-residency-enrollment']")
            .should("not.exist");
          // arizona-residency-dependent-claim
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-dependent-claim']")
            .should("not.exist");
          // driver-license
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-driver-license']")
            .should("not.exist");
          // section-vehicle
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-section-vehicle']")
            .should("not.exist");
          // taxes
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-taxes']")
            .should("not.exist");
          // financial-support
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-financial-support']")
            .should("not.exist");
          // arizona-residency-is-employed
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-employment-changes']")
            .should("not.exist");

          // if dob is less than 24 then checking guardian related question should be displayed
          if (userStore.userAge <= 24) {
            cy.get("[data-cy='arizona-residency-legal-guardian']").should(
              "be.visible"
            );
          } else {
            cy.get("[data-cy='arizona-residency-view']")
              .find("[data-cy='arizona-residency-legal-guardian']")
              .should("not.exist");
          }
          // verifying no military affiliated related questions are asked
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-veteran']")
            .should("not.exist");
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-active-military']")
            .should("not.exist");
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-military-dependency']")
            .should("not.exist");
          // native american
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-native-american']")
            .should("not.exist");
          // section married
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-section-married']")
            .should("not.exist");

          // changing the permanent home to ARIZONA verifing all the questions are asked
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="arizona-residency-domicile-group-permanent-home"]',
            text: "arizona",
          });
          // arizon-residency-enrollment
          cy.get("[data-cy='arizon-residency-enrollment']").should(
            "be.visible"
          );
          if (userStore.userAge < 24) {
            cy.get("[data-cy='arizona-residency-dependent-claim']").should(
              "be.visible"
            );
          }
          cy.get("[data-cy='arizona-residency-driver-license']").should(
            "be.visible"
          );
          cy.get("[data-cy='arizona-residency-section-vehicle']").should(
            "be.visible"
          );
          cy.get("[data-cy='arizona-residency-taxes']").should("be.visible");
          cy.get("[data-cy='arizona-residency-financial-support']").should(
            "be.visible"
          );
          if (userStore.userAge > 18) {
            cy.get("[data-cy='arizona-residency-employment-changes']").should(
              "be.visible"
            );
            cy.get("[data-cy='arizona-residency-section-married']").should(
              "be.visible"
            );
          }
        });
      });
    });
  });

  it("US citizen with native american eligibility", () => {
    const { highschool, militaryAffiliations, nativeAmerican } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.configStore().then((configStore) => {
          ugAppStore.highSchools = highschool.studiedOutSideArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.none;
          ugAppStore.ethnicities = nativeAmerican;
          configStore.preselectEthnicities();

          cy.get("[data-cy='arizona-residency-native-american']").should(
            "be.visible"
          );
        });
      });
    });
  });

  it("US citizen studied in arizon", () => {
    const { highschool, militaryAffiliations } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          ugAppStore.highSchools = highschool.studiedInArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.none;

          // arizon-residency-enrollment
          cy.get("[data-cy='arizon-residency-enrollment']").should(
            "be.visible"
          );
          if (userStore.userAge < 24) {
            cy.get("[data-cy='arizona-residency-dependent-claim']").should(
              "be.visible"
            );
          }
          cy.get("[data-cy='arizona-residency-driver-license']").should(
            "be.visible"
          );
          cy.get("[data-cy='arizona-residency-section-vehicle']").should(
            "be.visible"
          );
          cy.get("[data-cy='arizona-residency-taxes']").should("be.visible");
          cy.get("[data-cy='arizona-residency-financial-support']").should(
            "be.visible"
          );
          if (userStore.userAge > 18) {
            cy.get("[data-cy='arizona-residency-employment-changes']").should(
              "be.visible"
            );
            cy.get("[data-cy='arizona-residency-section-married']").should(
              "be.visible"
            );
          }
        });
      });
    });
  });

  it("US citizen with active duty military affiliations", () => {
    const { highschool, militaryAffiliations } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        ugAppStore.highSchools = highschool.studiedOutSideArizona;
        ugAppStore.militaryaffiliations = militaryAffiliations.activeDuty;

        cy.get("[data-cy='arizona-residency-active-military']").should(
          "be.visible"
        );
        cy.get("[data-cy='arizona-residency-view']")
          .find("[data-cy='arizona-residency-veteran']")
          .should("not.exist");
        cy.get("[data-cy='arizona-residency-view']")
          .find("[data-cy='arizona-residency-military-dependency']")
          .should("not.exist");
      });
    });
  });

  it("US citizen with veteran military affiliations", () => {
    const { highschool, militaryAffiliations } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        ugAppStore.highSchools = highschool.studiedOutSideArizona;
        ugAppStore.militaryaffiliations = militaryAffiliations.veteran;

        cy.get("[data-cy='arizona-residency-veteran']").should("be.visible");
        // voters section should be visible
        cy.get("[data-cy='arizona-residency-voters-section']").should(
          "be.visible"
        );
        cy.get("[data-cy='arizona-residency-view']")
          .find("[data-cy='arizona-residency-active-military']")
          .should("not.exist");
        cy.get("[data-cy='arizona-residency-view']")
          .find("[data-cy='arizona-residency-military-dependency']")
          .should("not.exist");
      });
    });
  });

  it("US citizen with dependent military affiliations", () => {
    const { highschool, militaryAffiliations } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        ugAppStore.highSchools = highschool.studiedOutSideArizona;
        ugAppStore.militaryaffiliations = militaryAffiliations.dependent;

        cy.get("[data-cy='arizona-residency-military-dependency']").should(
          "be.visible"
        );
        cy.get("[data-cy='arizona-residency-view']")
          .find("[data-cy='arizona-residency-veteran']")
          .should("not.exist");
        cy.get("[data-cy='arizona-residency-view']")
          .find("[data-cy='arizona-residency-active-military']")
          .should("not.exist");

        // choosing sector of military as veteran to verify section vote is displayed
        cy.handleBaseSingleSelect({
          selector: '[data-cy="arizona-residency-select-sector-of-military"]',
          text: "veteran",
        });
        // voters section should be visible
        cy.get("[data-cy='arizona-residency-voters-section']").should(
          "be.visible"
        );
      });
    });
  });
});

describe("US citizen with user age based testing", () => {
  beforeEach(() => {
    const { applicationsResponse, validVisaCode } = config;
    // Login
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-high-school-grades",
      "ug-app-arizona-residency"
    );
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);

    applicationsResponse.data[0].userInfo.visaCode = validVisaCode;

    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications`,
      (req) => {
        // Modify the request or response as needed
        req.reply(applicationsResponse);
      }
    ).as("applications");

    cy.visit(`ug-app/${appId}/arizona-residency`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("Age less than 18 years", () => {
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.userStore().then((userStore) => {
        // less than 18 years
        const lessThan18 = getFormettedDOB({
          year: new Date().getFullYear() - 17,
        });
        userStore.dateOfBirth = lessThan18;
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="arizona-residency-domicile-group-permanent-home"]',
          text: "arizona",
        });
        // married section
        cy.get("[data-cy='arizona-residency-view']")
          .find("[data-cy='arizona-residency-section-married']")
          .should("not.exist");
        // employment section
        cy.get("[data-cy='arizona-residency-view']")
          .find("[data-cy='arizona-residency-employment-changes']")
          .should("not.exist");

        // dependent_claim
        cy.get("[data-cy='arizona-residency-dependent-claim']").should(
          "be.visible"
        );
        // guardian section
        cy.get("[data-cy='arizona-residency-legal-guardian']").should(
          "be.visible"
        );
      });
    });
  });
  it("Age older than 18 years", () => {
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.userStore().then((userStore) => {
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="arizona-residency-domicile-group-permanent-home"]',
          text: "arizona",
        });
        // older than 18
        const olderThan18 = getFormettedDOB({
          year: new Date().getFullYear() - 19,
        });
        userStore.dateOfBirth = olderThan18;
        // employment section
        cy.get("[data-cy='arizona-residency-employment-changes']").should(
          "be.visible"
        );
        // married section
        cy.get("[data-cy='arizona-residency-section-married']").should(
          "be.visible"
        );
        // dependent_claim
        cy.get("[data-cy='arizona-residency-dependent-claim']").should(
          "be.visible"
        );
        // guardian section
        cy.get("[data-cy='arizona-residency-legal-guardian']").should(
          "be.visible"
        );
      });
    });
  });
  it("Age less than 24 years", () => {
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.userStore().then((userStore) => {
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="arizona-residency-domicile-group-permanent-home"]',
          text: "arizona",
        });
        // less than 24 years
        const lessThan24 = getFormettedDOB({
          year: new Date().getFullYear() - 23,
        });
        userStore.dateOfBirth = lessThan24;
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="arizona-residency-domicile-group-permanent-home"]',
          text: "arizona",
        });
        // employment section
        cy.get("[data-cy='arizona-residency-employment-changes']").should(
          "be.visible"
        );
        // married section
        cy.get("[data-cy='arizona-residency-section-married']").should(
          "be.visible"
        );

        // dependent_claim
        cy.get("[data-cy='arizona-residency-dependent-claim']").should(
          "be.visible"
        );
        // guardian section
        cy.get("[data-cy='arizona-residency-legal-guardian']").should(
          "be.visible"
        );
      });
    });
  });
  it("Age older than 24 years", () => {
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.userStore().then((userStore) => {
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="arizona-residency-domicile-group-permanent-home"]',
          text: "arizona",
        });
        // less than 24 years
        const olderThan24 = getFormettedDOB({
          year: new Date().getFullYear() - 25,
        });
        userStore.dateOfBirth = olderThan24;
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="arizona-residency-domicile-group-permanent-home"]',
          text: "arizona",
        });
        // employment section
        cy.get("[data-cy='arizona-residency-employment-changes']").should(
          "be.visible"
        );
        // married section
        cy.get("[data-cy='arizona-residency-section-married']").should(
          "be.visible"
        );

        // dependent_claim
        cy.get("[data-cy='arizona-residency-view']")
          .find("[data-cy='arizona-residency-dependent-claim']")
          .should("not.exist");
        // guardian section
        cy.get("[data-cy='arizona-residency-view']")
          .find("[data-cy='arizona-residency-legal-guardian']")
          .should("not.exist");
      });
    });
  });
});

describe("prop-308 based testing", () => {
  beforeEach(() => {
    const { highSchools, highSchoolAcademics, DACA, UD } = config.prop308;
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-high-school-grades",
      "ug-app-arizona-residency"
    );
    // Login, visit page, intercept config get calls
    cy.login(userDetails.email, userDetails.password);
    cy.stubUserPopulateDetails(appId, testCaseType);
    cy.interceptConfigGetCalls();

    const { applications } = [DACA, UD][Math.floor(Math.random() * 2)];
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications`,
      (req) => {
        // Modify the request or response as needed
        req.reply(applications);
      }
    ).as("applications");
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/highschools`,
      (req) => {
        // Modify the request or response as needed
        req.reply(highSchools);
      }
    ).as("highSchools");
    cy.intercept(
      "GET",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/highschoolacademics`,
      (req) => {
        // Modify the request or response as needed
        req.reply(highSchoolAcademics);
      }
    ).as("highSchoolAcademics");

    cy.visit(`ug-app/${appId}/arizona-residency`);
  });

  afterEach(() => {
    // Reset unsaved changes after each test
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("is typeOfVisa DACA/UD and is prop-308 eligible", () => {
    // Assertions for prop-308 eligibility
    cy.get("[data-cy='arizona-residency-view']", { timeout: 30000 }).then(
      () => {
        cy.get('[data-cy="arizona-residency-prop-308-permanentHome"]').should(
          "exist"
        );
        cy.get(
          '[data-cy="arizona-residency-group-isGraduateFromAZPublicSchool"]'
        )
          .should("exist")
          .should("be.visible");

        // Unless the radio button for "isGraduateFromAZPublicSchool" is selected, the group for "isAttendAZPublicSchool" should not be visible
        cy.get(
          '[data-cy="arizona-residency-group-isAttendAZPublicSchool"]'
        ).should("not.exist");

        // Select "Yes" for "isGraduateFromAZPublicSchool"
        cy.handleRadioButton({
          radioSelector: `[data-cy="arizona-residency-group-isGraduateFromAZPublicSchool"] [data-cy="radio-group"] > div:nth-of-type(${1}) > label`,
        });

        // Check for the group "isAttendAZPublicSchool" to be visible
        cy.get(
          '[data-cy="arizona-residency-group-isAttendAZPublicSchool"] [data-cy="radio-group"]'
        )
          .should("exist")
          .should("be.visible");
      }
    );

    // Additional sections with "not.exist" assertions
    cy.get("[data-cy='arizona-residency-view']")
      .find("[data-cy='arizona-residency-employment-changes']")
      .should("not.exist");
    cy.get("[data-cy='arizona-residency-view']")
      .find("[data-cy='arizona-residency-section-married']")
      .should("not.exist");
    cy.get("[data-cy='arizona-residency-view']")
      .find("[data-cy='arizona-residency-dependent-claim']")
      .should("not.exist");
    cy.get("[data-cy='arizona-residency-view']")
      .find("[data-cy='arizona-residency-legal-guardian']")
      .should("not.exist");
  });
});

describe("Edge cases testing", () => {
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-high-school-grades",
      "ug-app-arizona-residency"
    );
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);

    cy.visit(`ug-app/${appId}/arizona-residency`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("Dependent for income tax claim by parent or guardian", () => {
    const { highschool, militaryAffiliations, validVisaCode } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          userStore.visaCode = validVisaCode;
          ugAppStore.highSchools = highschool.studiedOutSideArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.none;
          ugAppStore.ethnicities = [];

          // setting the userage to less than 24
          const lessThan24 = getFormettedDOB({
            year: new Date().getFullYear() - 23,
          });
          userStore.dateOfBirth = lessThan24;

          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="arizona-residency-domicile-group-permanent-home"]',
            text: "arizona",
          });

          cy.get("[data-cy='arizona-residency-dependent-claim']").should(
            "be.visible"
          );
          // selecting the claimed as yes
          cy.handleRadioButton({
            radioSelector: `[data-cy="arizona-residency-group-is-tax-claimed-as-dependent"] [data-cy="radio-group"] > div:nth-of-type(1) > label`,
          });
          // verifing proper error message is displayed in financial support section
          // verfying the parent and guardian input is prefilled with value 50
          cy.get(
            "[data-cy='arizona-residency-financial-table'] #group-inputParentOrGuardianSupport input"
          ).should("have.value", "50");
          // changing the value to more than 50
          cy.handleBaseInput({
            selector: `[data-cy='arizona-residency-financial-table'] #group-inputParentOrGuardianSupport`,
            text: "60",
          });
          cy.get(
            "[data-cy='arizona-residency-financial-table'] .invalid-feedback ul"
          )
            .find("li")
            .should("not.exist");
          // reducing the value to less than 50
          cy.handleBaseInput({
            selector: `[data-cy='arizona-residency-financial-table'] #group-inputParentOrGuardianSupport`,
            text: "49",
          });
          // verifing the error
          cy.get(
            "[data-cy='arizona-residency-financial-table'] .invalid-feedback ul li"
          ).should("have.length", 1);
          cy.get(
            "[data-cy='arizona-residency-financial-table'] .invalid-feedback"
          ).contains("Parent or guardian support must be at least 50%");

          // clearing the input
          cy.get(
            "[data-cy='arizona-residency-financial-table'] #group-inputParentOrGuardianSupport input"
          ).clear();
          //setting the tax dependent to NO
          cy.handleRadioButton({
            radioSelector: `[data-cy="arizona-residency-group-is-tax-claimed-as-dependent"] [data-cy="radio-group"] > div:nth-of-type(2) > label`,
          });
          // verifying no error is displayed
          cy.get(
            "[data-cy='arizona-residency-financial-table'] .invalid-feedback ul"
          )
            .find("li")
            .should("not.exist");
        });
      });
    });
  });

  it("Less than 18 years old user with employemt support in financial support section", () => {
    const { highschool, militaryAffiliations, validVisaCode } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          userStore.visaCode = validVisaCode;
          ugAppStore.highSchools = highschool.studiedOutSideArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.none;
          ugAppStore.ethnicities = [];
          // setting the userage to less than 18
          const lessThan18 = getFormettedDOB({
            year: new Date().getFullYear() - 17,
          });
          userStore.dateOfBirth = lessThan18;
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="arizona-residency-domicile-group-permanent-home"]',
            text: "arizona",
          });
          //  currently employed section should not be visible
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-employment-changes']")
            .should("not.exist");
          // enteing the employment support value in financial support section
          cy.handleBaseInput({
            selector: `[data-cy='arizona-residency-financial-table'] #group-inputEmploymentSupport`,
            text: "10",
          });
          // section should be visible now
          cy.get("[data-cy='arizona-residency-employment-changes']").should(
            "be.visible"
          );
          // removing the value to verify if the section is not visible
          cy.get(
            "[data-cy='arizona-residency-financial-table'] #group-inputEmploymentSupport input"
          ).clear();
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-employment-changes']")
            .should("not.exist");
        });
      });
    });
  });
  it("older than 24 years of age with Parent or legal guardian support in financial support section", () => {
    const { highschool, militaryAffiliations, validVisaCode } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          userStore.visaCode = validVisaCode;
          ugAppStore.highSchools = highschool.studiedOutSideArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.none;
          ugAppStore.ethnicities = [];
          // setting the userage to older than 24
          const olderThan24 = getFormettedDOB({
            year: new Date().getFullYear() - 25,
          });
          userStore.dateOfBirth = olderThan24;
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="arizona-residency-domicile-group-permanent-home"]',
            text: "arizona",
          });
          //  currently Parent or legal guardian section should not be visible
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-legal-guardian']")
            .should("not.exist");
          // enteing the Parent or legal guardian support value in financial support section
          cy.handleBaseInput({
            selector: `[data-cy='arizona-residency-financial-table'] #group-inputParentOrGuardianSupport`,
            text: "10",
          });
          // section should be visible now
          cy.get("[data-cy='arizona-residency-legal-guardian']").should(
            "be.visible"
          );
          // removing the value to verify if the section is not visible
          cy.get(
            "[data-cy='arizona-residency-financial-table'] #group-inputParentOrGuardianSupport input"
          ).clear();
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-legal-guardian']")
            .should("not.exist");
        });
      });
    });
  });
  it("Less than 18 years old user with spousal support in financial support section", () => {
    const { highschool, militaryAffiliations, validVisaCode } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          userStore.visaCode = validVisaCode;
          ugAppStore.highSchools = highschool.studiedOutSideArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.none;
          ugAppStore.ethnicities = [];
          // setting the userage to less than 18
          const lessThan18 = getFormettedDOB({
            year: new Date().getFullYear() - 17,
          });
          userStore.dateOfBirth = lessThan18;
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="arizona-residency-domicile-group-permanent-home"]',
            text: "arizona",
          });
          //  currently marrage section should not be visible
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-section-married']")
            .should("not.exist");
          // enteing the spousal support value in financial support section
          cy.handleBaseInput({
            selector: `[data-cy='arizona-residency-financial-table'] #group-inputSpouseSupport`,
            text: "10",
          });
          // section should be visible now
          cy.get("[data-cy='arizona-residency-section-married']").should(
            "be.visible"
          );
          // verifying are you married question is not displayed
          cy.get("[data-cy='arizona-residency-section-married']")
            .find("[data-cy='arizona-residency-is-married']")
            .should("not.exist");
          // verifying spouse related questions are displayed
          cy.get(
            "[data-cy='arizona-residency-is-married-state-spouse-lives']"
          ).should("be.visible");
          cy.get(
            "[data-cy='arizona-residency-is-married-is-spouse-employed']"
          ).should("be.visible");
          cy.get(
            "[data-cy='arizona-residency-is-married-spouse-employed-in-any-uni']"
          ).should("be.visible");
          cy.get(
            "[data-cy='arizona-residency-is-married-spouse-dependent']"
          ).should("be.visible");
          // removing the value to verify if the section is not visible
          cy.get(
            "[data-cy='arizona-residency-financial-table'] #group-inputSpouseSupport input"
          ).clear();
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-section-married']")
            .should("not.exist");
        });
      });
    });
  });
  it("older than 18 years of age with spousal support in financial support section", () => {
    const { highschool, militaryAffiliations, validVisaCode } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          userStore.visaCode = validVisaCode;
          ugAppStore.highSchools = highschool.studiedOutSideArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.none;
          ugAppStore.ethnicities = [];
          // setting the userage to older than 18
          const olderThan18 = getFormettedDOB({
            year: new Date().getFullYear() - 19,
          });
          userStore.dateOfBirth = olderThan18;
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="arizona-residency-domicile-group-permanent-home"]',
            text: "arizona",
          });
          // marrage section should be visible by default because of users age
          cy.get("[data-cy='arizona-residency-section-married']").should(
            "be.visible"
          );
          // enteing the spousal support value in financial support section
          cy.handleBaseInput({
            selector: `[data-cy='arizona-residency-financial-table'] #group-inputSpouseSupport`,
            text: "10",
          });
          // section should be visible now
          cy.get("[data-cy='arizona-residency-section-married']").should(
            "be.visible"
          );
          // verifying are you married question is not displayed
          cy.get("[data-cy='arizona-residency-section-married']")
            .find("[data-cy='arizona-residency-is-married']")
            .should("not.exist");
          // verifying spouse related questions are displayed
          cy.get(
            "[data-cy='arizona-residency-is-married-state-spouse-lives']"
          ).should("be.visible");
          cy.get(
            "[data-cy='arizona-residency-is-married-is-spouse-employed']"
          ).should("be.visible");
          cy.get(
            "[data-cy='arizona-residency-is-married-spouse-employed-in-any-uni']"
          ).should("be.visible");
          cy.get(
            "[data-cy='arizona-residency-is-married-spouse-dependent']"
          ).should("be.visible");
        });
      });
    });
  });
  it("Other support in financial support section", () => {
    const { highschool, militaryAffiliations, validVisaCode } = config;
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          userStore.visaCode = validVisaCode;
          ugAppStore.highSchools = highschool.studiedOutSideArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.none;
          ugAppStore.ethnicities = [];
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="arizona-residency-domicile-group-permanent-home"]',
            text: "arizona",
          });
          // other financial support options should not be visible should not be visible
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-other-options']")
            .should("not.exist");
          // enteing the other support value in financial support section
          cy.handleBaseInput({
            selector: `[data-cy='arizona-residency-financial-table'] #group-inputOtherSourceSupport`,
            text: "10",
          });
          // section should be visible now
          cy.get("[data-cy='arizona-residency-other-options']").should(
            "be.visible"
          );
          // describe input field should not be visible
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-custom-support-source-input']")
            .should("not.exist");
          // checking the Other/none of the above checkbox to verify the describe input field is displayed
          cy.get(
            `[data-cy="arizona-residency-other-options"] [type="checkbox"]`
          ).check("inputOtherSourceSupportOther", { force: true });
          cy.get(
            "[data-cy='arizona-residency-custom-support-source-input']"
          ).should("be.visible");
          // removing the value to verify if the section is not visible
          cy.get(
            "[data-cy='arizona-residency-financial-table'] #group-inputOtherSourceSupport input"
          ).clear();
          cy.get("[data-cy='arizona-residency-view']")
            .find("[data-cy='arizona-residency-other-options']")
            .should("not.exist");
        });
      });
    });
  });
});

describe("Two way binding testcases", () => {
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-high-school-grades",
      "ug-app-arizona-residency"
    );
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);

    cy.visit(`ug-app/${appId}/arizona-residency`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("US citizen with native american", () => {
    const {
      highschool,
      militaryAffiliations,
      nativeAmerican,
      twoWayBindingResponses,
      validVisaCode,
    } = config;
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/residencyanswers`,
      (req) => {
        // Modify the request or response as needed
        req.reply(twoWayBindingResponses.defaultResponse);
      }
    ).as("residencyanswers");
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          cy.configStore().then((configStore) => {
            ugAppStore.highSchools = highschool.studiedOutSideArizona;
            ugAppStore.militaryaffiliations = militaryAffiliations.none;
            ugAppStore.ethnicities = nativeAmerican;
            userStore.visaCode = validVisaCode;
            const lessThan18 = getFormettedDOB({
              year: new Date().getFullYear() - 17,
            });
            userStore.dateOfBirth = lessThan18;
            configStore.preselectEthnicities();

            // section Domicile
            const sectionDomicile = ugAppStore.sectionDomicile;
            // permanent home
            cy.get(
              "[data-cy='arizona-residency-domicile-group-permanent-home'] .vs__selected"
            ).contains(sectionDomicile.permanentHome.text);
            // living in Arizona continuously for the last 12 months
            cy.get(
              "[data-cy='arizona-residency-group-isAzResident12m'] :checked"
            )
              .should("be.checked")
              .and("have.value", sectionDomicile.isAzResident12m.value);
            // When did you begin living in Arizona?
            cy.verifyResidencyDateTwoWayBinding({
              selector: '[data-cy="arizona-residency-group-dateMovedToAz"]',
              date: sectionDomicile.dateMovedToAz,
            });
            // section enrollment
            const sectionEnrollment = ugAppStore.sectionEnrollment;
            //  currently enrolled at another college
            cy.get(
              "[data-cy='arizona-residency-is-enrolled-in-another-uni'] :checked"
            )
              .should("be.checked")
              .and(
                "have.value",
                sectionEnrollment.isEnrolledInAnotherUni.value
              );
            // Where are you currently enrolled?
            cy.get(
              "[data-cy='arizona-residency-input-enrolled-location'] input"
            ).should("have.value", sectionEnrollment.inputEnrolledLocation);
            // In which state is that school located?
            cy.get(
              "[data-cy='arizona-residency-select-state-enrolled'] .vs__selected"
            ).contains(sectionEnrollment.selectStateEnrolled.text);
            //  enrolled at any Arizona college or university in 2023 or 2022 calendar year
            cy.get(
              "[data-cy='arizona-residency-is-enroll-AZ-ed-current-or-last-year'] :checked"
            )
              .should("be.checked")
              .and(
                "have.value",
                sectionEnrollment.isEnrollAZedCurrentOrLastYear.value
              );

            // sectionDependent
            //  claimed as a dependent for income tax
            const sectionDependent = ugAppStore.sectionDependent;
            cy.get(
              "[data-cy='arizona-residency-group-is-tax-claimed-as-dependent'] :checked"
            )
              .should("be.checked")
              .and(
                "have.value",
                sectionDependent.isTaxClaimedAsDependent.value
              );

            // section driver license
            const sectionDriverLicense = ugAppStore.sectionDriverLicense;
            // Do you have a current driver’s license
            cy.get("[data-cy='arizona-residency-is-having-license'] :checked")
              .should("be.checked")
              .and("have.value", sectionDriverLicense.isHavingLicense.value);
            // In which state was your license issued?
            cy.get(
              "[data-cy='arizona-residency-group-select-state-license-issued'] .vs__selected"
            ).contains(sectionDriverLicense.selectStateLicenseIssued.text);
            // When was your license issued?
            cy.verifyResidencyDateTwoWayBinding({
              selector:
                '[data-cy="arizona-residency-driver-license-issued-date"]',
              date: sectionDriverLicense.dateLicenseIssued,
            });
            // section vehicle
            const sectionVehicle = ugAppStore.sectionVehicle;
            // Do you own or operate a car, motorcycle or other motor vehicle?
            cy.get(
              "[data-cy='arizona-residency-group-is-owns-vehicle'] :checked"
            )
              .should("be.checked")
              .and("have.value", sectionVehicle.isOwnsVehicle.value);
            // Is this vehicle registered in the state of Arizona?
            cy.get(
              "[data-cy='arizona-residency-group-is-vehicle-registered-in-az'] :checked"
            )
              .should("be.checked")
              .and("have.value", sectionVehicle.isVehicleRegisteredInAZ.value);
            // When was your vehicle registered?
            cy.verifyResidencyDateTwoWayBinding({
              selector:
                '[data-cy="arizona-residency-section-vehicle-registered-date"]',
              date: sectionVehicle.dateVehicleRegistered,
            });

            // section taxes
            const sectionTax = ugAppStore.sectionTax;
            // Did you, or will you, file state taxes for 2022?
            cy.get(
              "[data-cy='arizona-residency-group-is-filed-tax-last-year'] :checked"
            )
              .should("be.checked")
              .and("have.value", sectionTax.isFiledTaxLastYear.value);
            // Where did or where will you file your state taxes for 2022?
            cy.get(
              "[data-cy='arizona-residency-group-select-state-filed-tax'] .vs__selected"
            ).contains(sectionTax.selectStateFiledTax.text);

            // section financial support
            const sectionFinancialSupport = ugAppStore.sectionFinancialSupport;
            // financial support
            residencyContent.sectionFinancialSupport.source.forEach(
              (source) => {
                const value = sectionFinancialSupport[source.value]
                  ? sectionFinancialSupport[source.value]
                  : 0;
                cy.get(
                  `[data-cy='arizona-residency-financial-table']  #group-${source.value} input`
                ).should("have.value", value);
              }
            );
            //  otherOptions
            if (parseInt(sectionFinancialSupport.inputOtherSourceSupport) > 0) {
              let otherOptions = [];
              residencyContent.sectionFinancialSupport.otherOptions.source.forEach(
                (source) => {
                  if (sectionFinancialSupport[source.value] === "Y") {
                    otherOptions.push(source.value);
                  }
                }
              );
              cy.get(
                "[data-cy='arizona-residency-other-options'] :checked"
              ).each(($input) => {
                if (!otherOptions.includes($input.val())) {
                  throw new Error("other interests error!");
                }
              });

              // custom Source of support
              if (
                sectionFinancialSupport.inputOtherSourceSupportOther === "Y"
              ) {
                cy.get(
                  `[data-cy='arizona-residency-custom-support-source-input'] input`
                ).should(
                  "have.value",
                  sectionFinancialSupport.inputOtherSourceNota
                );
              }
            }

            // section employment
            const sectionEmployment = ugAppStore.sectionEmployment;
            // Are you currently employed?
            cy.get("[data-cy='arizona-residency-is-employed'] :checked")
              .should("be.checked")
              .and("have.value", sectionEmployment.isEmployed.value);
            // Where was your primary work location?
            cy.get(
              "[data-cy='arizona-residency-group-select-state-license-issued'] .vs__selected"
            ).contains(sectionEmployment.selectStateEmployedLast12m.text);
            // When did your employment at this location begin?
            cy.verifyResidencyDateTwoWayBinding({
              selector: '[data-cy="arizona-residency-employed-date"]',
              date: sectionEmployment.dateEmployed,
            });
            // sectionNativeAmerican
            const sectionNativeAmerican = ugAppStore.sectionNativeAmerican;
            // You indicated you are American Indian or Alaska Native
            cy.get("[data-cy='arizona-residency-is-native-american'] :checked")
              .should("be.checked")
              .and("have.value", sectionNativeAmerican.isNativeAmerican.value);

            // section legal guardian
            const sectionLegalGuardian = ugAppStore.sectionLegalGuardian;
            // In which state do your parent(s) or legal guardian(s) currently live
            cy.get(
              "[data-cy='arizona-residency-group-state-parent-lives'] .vs__selected"
            ).contains(sectionLegalGuardian.stateParentLives.text);
            // Which parent or legal guardian lives in Arizona?
            cy.get(
              "[data-cy='arizona-residency-group-select-parent-relationship'] .vs__selected"
            ).contains(sectionLegalGuardian.selectParentRelationship.text);
            // When did your parent(s) or legal guardian(s) begin living in Arizona continuously?
            cy.verifyResidencyDateTwoWayBinding({
              selector:
                '[data-cy="arizona-residency-legal-guardian-date-parent-moved-to-az"]',
              date: sectionLegalGuardian.dateParentMovedToAz,
            });
            // Did or will your parent(s) or legal guardian(s) file a state income tax return for the 2022 tax year?
            cy.get(
              "[data-cy='arizona-residency-group-is-parent-filed-tax-last-year'] :checked"
            )
              .should("be.checked")
              .and(
                "have.value",
                sectionLegalGuardian.isParentFiledTaxLastYear.value
              );
            // In which state did, or will, your parent(s) or legal guardian(s) file state income taxes?
            cy.get(
              "[data-cy='arizona-residency-group-select-state-parent-filed-tax'] .vs__selected"
            ).contains(sectionLegalGuardian.selectStateParentFiledTax.text);
            // Does either parent or legal guardian have a current Arizona driver license?
            cy.get(
              "[data-cy='arizona-residency-is-parent-having-license-in-az'] :checked"
            )
              .should("be.checked")
              .and(
                "have.value",
                sectionLegalGuardian.isParentHavingLicenseInAz.value
              );
            // Is either parent or legal guardian employed in Arizona?
            cy.get(
              "[data-cy='arizona-residency-is-parent-employed-in-az'] :checked"
            )
              .should("be.checked")
              .and(
                "have.value",
                sectionLegalGuardian.isParentEmployedInAz.value
              );

            // section marriage
            const sectionMarried = ugAppStore.sectionMarried;
            // In which state does your spouse currently live?
            cy.get(
              "[data-cy='arizona-residency-is-married-state-spouse-lives'] .vs__selected"
            ).contains(sectionMarried.selectStateSpouseLives.text);
            // When did your spouse begin living in Arizona?
            cy.verifyResidencyDateTwoWayBinding({
              selector:
                '[data-cy="arizona-residency-is-married-date-spouse-moved-to-az"]',
              date: sectionMarried.dateSpouseMovedToAz,
            });
            // Does your spouse have a valid drivers license or state-issued ID?
            cy.get(
              "[data-cy='arizona-residency-is-married-spouse-has-valid-id'] :checked"
            )
              .should("be.checked")
              .and("have.value", sectionMarried.isSpouseHavingValidId.value);

            // What state issued this drivers license or state ID?
            cy.get(
              "[data-cy='arizona-residency-is-married-state-issued-id'] .vs__selected"
            ).contains(sectionMarried.selectStateValidIdIssued.text);
            // When did your spouse obtain this drivers license or state ID?
            cy.verifyResidencyDateTwoWayBinding({
              selector:
                '[data-cy="arizona-residency-is-married-id-obtained-date"]',
              date: sectionMarried.dateSpouseObtainedId,
            });
            // Did or will your spouse file a state income tax return for the 2022 tax year?
            cy.get(
              "[data-cy='arizona-residency-is-married-spouse-file-taxes'] :checked"
            )
              .should("be.checked")
              .and("have.value", sectionMarried.isSpouseFileTax.value);

            // In which state did, or will, your spouse file state income taxes?
            cy.get(
              "[data-cy='arizona-residency-is-married-state-spouse-file-taxes'] .vs__selected"
            ).contains(sectionMarried.selectStateSpouseFiledTax.text);
            // Is your spouse employed?
            cy.get(
              "[data-cy='arizona-residency-is-married-is-spouse-employed'] :checked"
            )
              .should("be.checked")
              .and("have.value", sectionMarried.isSpouseEmployed.value);

            // In which state is your spouse employed?
            cy.get(
              "[data-cy='arizona-residency-is-married-state-spouse-employed'] .vs__selected"
            ).contains(sectionMarried.selectStateSpouseEmployed.text);
            cy.verifyResidencyDateTwoWayBinding({
              selector:
                '[data-cy="arizona-residency-is-married-date-spouse-employed"]',
              date: sectionMarried.dateSpouseEmploymentStarted,
            });
            // Is your spouse currently enrolled at ASU or any other college or university?
            cy.get(
              "[data-cy='arizona-residency-is-married-spouse-employed-in-any-uni'] :checked"
            )
              .should("be.checked")
              .and("have.value", sectionMarried.isSpouseEmployedInAnyUni.value);
            // Is your spouse dependent on someone other than you for financial support, e.g. parents, guardians, family or financial aid?
            cy.get(
              "[data-cy='arizona-residency-is-married-spouse-dependent'] :checked"
            )
              .should("be.checked")
              .and("have.value", sectionMarried.isSpouseDependent.value);
          });
        });
      });
    });
  });

  it("US citizen with military affiliation active duty flow", () => {
    const {
      highschool,
      militaryAffiliations,
      twoWayBindingResponses,
      validVisaCode,
    } = config;
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/residencyanswers`,
      (req) => {
        // Modify the request or response as needed
        req.reply(twoWayBindingResponses.militaryAffiliations.activeDuty);
      }
    ).as("residencyanswers");
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          ugAppStore.highSchools = highschool.studiedOutSideArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.activeDuty;
          ugAppStore.ethnicities = [];
          userStore.visaCode = validVisaCode;
          // sectionActiveMilitary
          const sectionMilitaryActiveDuty =
            ugAppStore.sectionMilitaryActiveDuty;
          // Where are you currently stationed?
          cy.get(
            "[data-cy='arizona-residency-select-state-stationed'] .vs__selected"
          ).contains(sectionMilitaryActiveDuty.selectStateStationed.text);
          // What is your state of legal residence as noted on your leave and earnings statement (LES)?
          cy.get(
            "[data-cy='arizona-residency-select-state-of-legal-residence'] .vs__selected"
          ).contains(
            sectionMilitaryActiveDuty.selectStateOfLegalResidence.text
          );
        });
      });
    });
  });

  it("US citizen with military affiliation veteran flow", () => {
    const {
      highschool,
      militaryAffiliations,
      twoWayBindingResponses,
      validVisaCode,
    } = config;
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/residencyanswers`,
      (req) => {
        // Modify the request or response as needed
        req.reply(twoWayBindingResponses.militaryAffiliations.veteran);
      }
    ).as("residencyanswers");
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          ugAppStore.highSchools = highschool.studiedOutSideArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.veteran;
          ugAppStore.ethnicities = [];
          userStore.visaCode = validVisaCode;
          const sectionVeteran = ugAppStore.sectionVeteran;
          // You indicated that you are a veteran of the US military. Which character of service is noted on your DD-214?
          cy.get(
            "[data-cy='arizona-residency-select-service'] .vs__selected"
          ).contains(sectionVeteran.selectService.text);
          // Are you eligible for Chapter 30 or Chapter 33 benefits?
          cy.get(
            "[data-cy='arizona-residency-is-eligible-for-30-or-33-chapter-benefits'] :checked"
          )
            .should("be.checked")
            .and(
              "have.value",
              sectionVeteran.isEligibleFor30or33ChapterBenefits.value
            );
          // When were you discharged or released from active duty?
          cy.verifyResidencyDateTwoWayBinding({
            selector:
              '[data-cy="arizona-residency-veteran-date-of-retirement"]',
            date: sectionVeteran.dateOfRetirement,
          });

          // Verifying section driver license is visible
          // Since the 2way binding is tested in the above testcase for this section just verifying the section is visible
          cy.get("[data-cy='arizona-residency-driver-license']").should(
            "be.visible"
          );

          // Section vote
          const sectionVote = ugAppStore.sectionVote;
          // Are you registered to vote?
          cy.get("[data-cy='arizona-residency-is-registered-to-vote'] :checked")
            .should("be.checked")
            .and("have.value", sectionVote.isRegisteredToVote.value);
          // In which state are you registered to vote?
          cy.get(
            "[data-cy='arizona-residency-select-state-registered-to-vote'] .vs__selected"
          ).contains(sectionVote.selectStateRegisteredToVote.text);
        });
      });
    });
  });

  it("US citizen with military affiliation dependent veteran service flow", () => {
    const {
      highschool,
      militaryAffiliations,
      twoWayBindingResponses,
      validVisaCode,
    } = config;
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/residencyanswers`,
      (req) => {
        // Modify the request or response as needed
        req.reply(
          twoWayBindingResponses.militaryAffiliations.dependent.veteran
        );
      }
    ).as("residencyanswers");
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          ugAppStore.highSchools = highschool.studiedOutSideArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.dependent;
          ugAppStore.ethnicities = [];
          userStore.visaCode = validVisaCode;
          // sectionMilitaryDependency
          const sectionMilitaryDependency =
            ugAppStore.sectionMilitaryDependency;
          // You indicated that you were the spouse or dependent of a U.S. service member or veteran. Which best describes the service member or veteran?
          cy.get(
            "[data-cy='arizona-residency-select-sector-of-military'] .vs__selected"
          ).contains(sectionMilitaryDependency.selectSectorOfMilitary.text);
          // When was your parent/guardian/spouse discharged or released from active duty?
          cy.verifyResidencyDateTwoWayBinding({
            selector:
              '[data-cy="arizona-residency-military-dependency-date-guardian-retaired"]',
            date: sectionMilitaryDependency.dateGuardianRetired,
          });
          // Are you eligible for Chapter 30 or Chapter 33 benefits?
          cy.get(
            "[data-cy='arizona-residency-is-eligible-for-30-or-33-chapter-benefits'] :checked"
          )
            .should("be.checked")
            .and(
              "have.value",
              sectionMilitaryDependency.isEligibleFor30or33ChapterBenefits.value
            );
          // Verifying section driver license is visible
          // Since the 2way binding is tested in the default testcase for this section just verifying the section is visible
          cy.get("[data-cy='arizona-residency-driver-license']").should(
            "be.visible"
          );

          // Section vote
          const sectionVote = ugAppStore.sectionVote;
          // Are you registered to vote?
          cy.get("[data-cy='arizona-residency-is-registered-to-vote'] :checked")
            .should("be.checked")
            .and("have.value", sectionVote.isRegisteredToVote.value);
          // In which state are you registered to vote?
          cy.get(
            "[data-cy='arizona-residency-select-state-registered-to-vote'] .vs__selected"
          ).contains(sectionVote.selectStateRegisteredToVote.text);
        });
      });
    });
  });

  it("US citizen with military affiliation dependent Other service flow", () => {
    const {
      highschool,
      militaryAffiliations,
      twoWayBindingResponses,
      validVisaCode,
    } = config;
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/residencyanswers`,
      (req) => {
        // Modify the request or response as needed
        req.reply(twoWayBindingResponses.militaryAffiliations.dependent.other);
      }
    ).as("residencyanswers");
    cy.get("[data-cy='arizona-residency-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          ugAppStore.highSchools = highschool.studiedOutSideArizona;
          ugAppStore.militaryaffiliations = militaryAffiliations.dependent;
          ugAppStore.ethnicities = [];
          userStore.visaCode = validVisaCode;
          // sectionMilitaryDependency
          const sectionMilitaryDependency =
            ugAppStore.sectionMilitaryDependency;
          // You indicated that you were the spouse or dependent of a U.S. service member or veteran. Which best describes the service member or veteran?
          cy.get(
            "[data-cy='arizona-residency-select-sector-of-military'] .vs__selected"
          ).contains(sectionMilitaryDependency.selectSectorOfMilitary.text);

          // Where is your spouse/parent/guardian currently stationed?
          cy.get(
            "[data-cy='arizona-residency-select-state-guardian-stationed'] .vs__selected"
          ).contains(
            sectionMilitaryDependency.selectStateGuardianStationed.text
          );
          // What is your spouse/parent/guardians state of legal residence?
          cy.get(
            "[data-cy='arizona-residency-select-state-guardian-legal-residence'] .vs__selected"
          ).contains(
            sectionMilitaryDependency.selectStateGuardianLegalResidence.text
          );
        });
      });
    });
  });
});

/* eslint-disable no-undef */

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Register api-testing
import "@bahmutov/cy-api";
import "@cypress/code-coverage/support";

// Register cypress-snapshot
require("@cypress/snapshot").register();
import jwt_decode from "jwt-decode";
import MonthOptions from "../../src/content/months.json";
import {
  EnumSarCodes,
  MyProgramConstants,
} from "../../src/content/enum-ug-application.js";
import { generateSarValues, getMonthDetails } from "../utils/UtilityService.js";

// Login
Cypress.Commands.add("login", (email, password) => {
  // checking if the decoded email from the token available in login fixture is same as email from the parameter
  // then skipping the api call an setting the cookie
  cy.fixture("api-responses/login").then((login) => {
    const decodedToken = jwt_decode(login.data.accessToken);
    if (decodedToken.sub !== email) {
      cy.api({
        method: "POST",
        url: `${Cypress.env("baseUrl")}/api/ug/useraccounts/cognito/sign-in`,
        headers: {
          Accept: "application/aaa.v1+json",
          "Content-Type": "application/aaa.v1+json",
        },
        body: {
          email: email,
          password: password,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.writeFile(
          `cypress/fixtures/api-responses/login.json`,
          JSON.stringify(response.body)
        );
        cy.setCookie("access_token", response.body.data.accessToken, {
          secure: true,
          sameSite: "no_restriction",
          expires: 30,
        });
      });
    } else {
      cy.setCookie("access_token", login.data.accessToken, {
        secure: true,
        sameSite: "no_restriction",
        expires: 30,
      });
    }
  });
});

// Stores
Cypress.Commands.add("appStore", () => {
  return cy.window().its("appStore");
});
Cypress.Commands.add("authStore", () => {
  return cy.window().its("authStore");
});
Cypress.Commands.add("configStore", () => {
  return cy.window().its("configStore");
});
Cypress.Commands.add("ugApplicationStore", () => {
  return cy.window().its("ugApplicationStore");
});
Cypress.Commands.add("userStore", () => {
  return cy.window().its("userStore");
});

// Intercept config get calls
Cypress.Commands.add("interceptConfigGetCalls", () => {
  // config
  const configEndpoints = [
    "/api/ug/config/pronouns",
    "/api/ug/config/genders",
    "/api/ug/config/tribes",
    "/api/ug/config/deadlines",
    "/api/ug/config/fees",
    "/api/ug/config/azresidency",
    "/api/ug/config/financialcircumstances",
    "/api/ug/config/languages",
    "/api/ug/config/pronouns",
    "/api/ug/config/sarquestions",
    "/api/ug/config/usertypes/locations",
    "/api/ug/config/highschools/academicyears",
    "/api/ug/config/highschools/courses",
    "/api/ug/config/highschools/courselevels",
    "/api/ug/config/highschools/coursesubjects",
    "/api/ug/config/highschools/gpascales",
    "/api/ug/config/highschools/gradescaletypes",
    "/api/ug/config/highschools/grades",
    "/api/ug/config/highschools/termtypes",
  ];

  // Loop through endpoints and intercept each config get request
  configEndpoints.forEach((endpoint) => {
    const file = endpoint.split("/").slice(-1)[0];
    cy.intercept("GET", `${Cypress.env("baseUrl")}${endpoint}`, {
      fixture: `api-responses/${file}.json`, // Using a fixture naming convention based on the endpoint
    }).as(file); // Alias the interception with a similar name
  });

  // Data potluck
  const dpEndpoints = [
    "/codeset/countries",
    "/codeset/undergraduate-admissions-corporate-partners",
    "/codeset/ethnicities",
    "/codeset/external-organizations/usa-states-cities",
    "/codeset/visa-permit-types",
    "/codeset/acad-plans?degreeType=UG&majorMapGeneral.campus=ONLNE&include=planCategories&include=subplans&include=campusesOffered&include=applicationDeadlines&include=applicantsMustChooseSecondMajor&filter=activeInDegreeSearch",
  ];

  // Loop through endpoints and intercept each config get request
  dpEndpoints.forEach((endpoint) => {
    const file = endpoint.split("/").slice(-1)[0].split("?")[0];
    cy.intercept("GET", `${Cypress.env("dplBaseUrl")}${endpoint}`, {
      fixture: `api-responses/${file}.json`, // Using a fixture naming convention based on the endpoint
    }).as(file); // Alias the interception with a similar name
  });
});
Cypress.Commands.add("populateUgApplications", (token) => {
  cy.api({
    method: "GET",
    url: `${Cypress.env("baseUrl")}/api/ug/applications`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/aaa.v1+json",
      "Content-Type": "application/aaa.v1+json",
    },
  }).then((response) => {
    if (response.body.code === 200 || response.body.code === 201) {
      return response.body;
    }
  });
});
Cypress.Commands.add(
  "setUIViewInfo",
  (token, appId, previousScreen, currentScreen) => {
    cy.api({
      method: "PUT",
      url: `${Cypress.env("baseUrl")}/api/ug/ui/view-info/${appId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
      body: {
        appId,
        previousScreen,
        currentScreen,
      },
    }).then((response) => {
      return response;
    });
  }
);

Cypress.Commands.add(
  "interceptUiViewInfo",
  (appId, previousScreen, currentScreen) => {
    cy.intercept(
      "GET",
      `${Cypress.env("baseUrl")}/api/ug/ui/view-info/${appId}`,
      {
        code: 200,
        data: {
          appId: appId,
          previousScreen: previousScreen,
          currentScreen: currentScreen,
        },
      }
    ).as("uiViewInfoIntercept");
  }
);

Cypress.Commands.add("populateUserDetails", (appId, token, testCaseType) => {
  const apiCalls = [
    { key: "user-ug-application", endpoint: `/api/ug/applications/${appId}` },
    { key: "user-names", endpoint: `/api/ug/applications/${appId}/names` },
    {
      key: "user-phones",
      endpoint: `/api/ug/applications/${appId}/phones`,
    },
    {
      key: "user-guardians",
      endpoint: `/api/ug/applications/${appId}/guardians`,
    },
    {
      key: "user-ethnicities",
      endpoint: `/api/ug/applications/${appId}/ethnicities`,
    },
    {
      key: "user-highschools",
      endpoint: `/api/ug/applications/${appId}/highschools`,
    },
    {
      key: "user-programsofinterest",
      endpoint: `/api/ug/applications/${appId}/programsofinterest`,
    },
    {
      key: "user-sarquestionresponses",
      endpoint: `/api/ug/applications/${appId}/sarquestionresponses`,
    },
    {
      key: "user-otherinstitutions",
      endpoint: `/api/ug/applications/${appId}/otherinstitutions`,
    },
    {
      key: "user-militaryaffiliations",
      endpoint: `/api/ug/applications/${appId}/militaryaffiliations`,
    },
    {
      key: "user-residencyanswers",
      endpoint: `/api/ug/applications/${appId}/residencyanswers`,
    },
    {
      key: "user-visasupplementals",
      endpoint: `/api/ug/applications/${appId}/visasupplementals`,
    },
  ];
  apiCalls.forEach((api) => {
    cy.api({
      method: "GET",
      url: `${Cypress.env("baseUrl")}${api.endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/aaa.v1+json",
        "Content-Type": "application/aaa.v1+json",
      },
    }).then((response) => {
      if (response.body.code === 200 || response.body.code === 201) {
        cy.task(
          "readFileMaybe",
          `cypress/fixtures/api-responses/${api.key}.json`
        ).then((fixtureResponse) => {
          let data = {};
          if (fixtureResponse) {
            data = JSON.parse(fixtureResponse);
          }
          data[testCaseType] = response.body;
          cy.writeFile(
            `cypress/fixtures/api-responses/${api.key}.json`,
            JSON.stringify(data)
          );
        });
      }
    });
  });
});

Cypress.Commands.add("stubUserPopulateDetails", (appId, testCaseType) => {
  const apiCalls = [
    { key: "user-ug-application", endpoint: `/api/ug/applications/${appId}` },
    { key: "user-names", endpoint: `/api/ug/applications/${appId}/names` },
    {
      key: "user-phones",
      endpoint: `/api/ug/applications/${appId}/phones`,
    },
    {
      key: "user-guardians",
      endpoint: `/api/ug/applications/${appId}/guardians`,
    },
    {
      key: "user-ethnicities",
      endpoint: `/api/ug/applications/${appId}/ethnicities`,
    },
    {
      key: "user-highschools",
      endpoint: `/api/ug/applications/${appId}/highschools`,
    },
    {
      key: "user-programsofinterest",
      endpoint: `/api/ug/applications/${appId}/programsofinterest`,
    },
    {
      key: "user-sarquestionresponses",
      endpoint: `/api/ug/applications/${appId}/sarquestionresponses`,
    },
    {
      key: "user-otherinstitutions",
      endpoint: `/api/ug/applications/${appId}/otherinstitutions`,
    },
    {
      key: "user-militaryaffiliations",
      endpoint: `/api/ug/applications/${appId}/militaryaffiliations`,
    },
    {
      key: "user-residencyanswers",
      endpoint: `/api/ug/applications/${appId}/residencyanswers`,
    },
    {
      key: "user-visasupplementals",
      endpoint: `/api/ug/applications/${appId}/visasupplementals`,
    },
  ];

  apiCalls.forEach((api) => {
    cy.readFile(`cypress/fixtures/api-responses/${api.key}.json`).then(
      (data) => {
        cy.intercept(
          "GET",
          `${Cypress.env("baseUrl")}${api.endpoint}`,
          data[testCaseType]
        ).as(api.key);
      }
    );
  });
});

// Common function for button
Cypress.Commands.add("handleButton", ({ buttonSelector, first, last }) => {
  if (first) {
    cy.get(buttonSelector).first().click();
  } else if (last) {
    cy.get(buttonSelector).last().click();
  } else cy.get(buttonSelector).click();
});

// Common function for radio button
Cypress.Commands.add("handleRadioButton", ({ radioSelector, first, last }) => {
  if (first) {
    cy.get(radioSelector).first().click();
  } else if (last) {
    cy.get(radioSelector).last().click();
  } else cy.get(radioSelector).click();
});

// Common function for checkbox
Cypress.Commands.add("handleCheckbox", ({ checkboxSelector, first, last }) => {
  if (first) {
    cy.get(checkboxSelector).first().click();
  } else if (last) {
    cy.get(checkboxSelector).last().click();
  } else {
    cy.get(checkboxSelector).click();
  }
});

// Common function for base input field
Cypress.Commands.add(
  "handleBaseInput",
  ({ selector, text, required, errorSelector, errorMessage }) => {
    cy.get(`${selector} input`)
      .should("be.visible")
      .then(($input) => {
        const currentText = $input.val();
        if (currentText !== text) {
          // Check error message for required fields
          if (required) {
            cy.get(`${selector} input`).type(text).clear();
            cy.get(
              errorSelector ? errorSelector : `${selector} div.invalid-feedback`
            )
              .should("be.visible")
              .contains(errorMessage);
          }
          // Clear input field if already has text and type new text
          if (currentText) {
            cy.get(`${selector} input`).clear();
          }
          cy.get(`${selector} input`).type(text);
        }
      });
  }
);

// Common function for base single select
Cypress.Commands.add(
  "handleBaseSingleSelect",
  ({ selector, text, required, errorMessage }) => {
    cy.get(`${selector} input`).then(($selectedItem) => {
      if ($selectedItem.text().trim() === text) {
        cy.get(clearSelector).click();
        cy.get(errorSelector).should("be.visible").contains(errorMessage);
      } else {
        if (required) {
          cy.get(`${selector} input`).type(text).type("{enter}");
          cy.get(`${selector} button > svg`).first().click();
          cy.get(`${selector} div.invalid-feedback`)
            .should("be.visible")
            .contains(errorMessage);
        }
        cy.get(`${selector} input`).type(text).type("{enter}");
        cy.get(`${selector} input`).first().click().type("{esc}");
      }
    });
  }
);
Cypress.Commands.add(
  "handleBasePhoneNumberInput",
  ({
    selector,
    country,
    phoneNumber,
    required,
    errorMessage,
    errorSelector,
  }) => {
    cy.get(`${selector} .input-phone-number input`)
      .should("be.visible")
      .then(($input) => {
        // select country
        cy.get(`${selector} .country-selector`).click();
        cy.get(`${selector} .country-selector .vue-recycle-scroller__item-view`)
          .contains(country)
          .click();

        const currentText = $input.val();
        if (currentText !== phoneNumber) {
          // Check error message for required fields
          if (required) {
            cy.get(`${selector} .input-phone-number input`)
              .type(phoneNumber)
              .clear();
            cy.get(
              errorSelector ? errorSelector : `${selector} div.invalid-feedback`
            )
              .should("be.visible")
              .contains(errorMessage);
          }
          // Clear input field if already has text and type new text
          if (currentText) {
            cy.get(`${selector} .input-phone-number input`).clear();
          }
          cy.get(`${selector} .input-phone-number input`).type(phoneNumber);
        }
      });
  }
);

// Common function for base multi select
Cypress.Commands.add(
  "handleBaseMultiSelect",
  ({
    inputSelector,
    textArray,
    clearSelector,
    required,
    errorSelector,
    errorMessage,
  }) => {
    cy.get(inputSelector).then(($selectedItems) => {
      const selectedTexts = $selectedItems
        .map((index, selectedItem) => Cypress.$(selectedItem).text().trim())
        .get();

      // Check if all the desired text options are already selected
      const areAllSelected = textArray.every((text) =>
        selectedTexts.includes(text)
      );

      if (areAllSelected) {
        cy.get(clearSelector).click();
        cy.get(errorSelector).should("be.visible").contains(errorMessage);
      } else {
        for (const text of textArray) {
          if (required) {
            cy.get(inputSelector).type(text).type("{enter}");
            cy.get(clearSelector).first().click();
            cy.get(errorSelector).should("be.visible").contains(errorMessage);
          }
          cy.get(inputSelector).type(text).type("{enter}");
        }
        cy.get(inputSelector).first().click().type("{esc}");
      }
    });
  }
);

Cypress.Commands.add(
  "handleResidencyDateSelect",
  ({ selector, month, year, errorMessage }) => {
    const monthDetails = MonthOptions.filter(
      (item) => parseInt(item.value) === parseInt(month)
    );
    // month
    cy.handleBaseSingleSelect({
      selector: `${selector} [data-cy="group-month"]`,
      text: monthDetails[0].text,
      errorMessage: errorMessage,
    });
    // year
    cy.handleBaseSingleSelect({
      selector: `${selector} [data-cy="group-year"]`,
      text: year,
      errorMessage: errorMessage,
    });
  }
);
Cypress.Commands.add(
  "verifyResidencyDateTwoWayBinding",
  ({ selector, date }) => {
    const monthDetails = getMonthDetails(date.substring(5, 7));
    // month
    cy.get(`${selector} [data-cy="group-month"] .vs__selected`).contains(
      monthDetails.text
    );
    // year
    cy.get(`${selector} [data-cy="group-year"] .vs__selected`).contains(
      date.substring(0, 4)
    );
  }
);

// Common function for review/preview page data validation
Cypress.Commands.add("handleSectionDetails", ({ section, page, getter }) => {
  cy.get(
    `[data-cy='${page}-${section}'] [data-cy='${page}-section-details-collapse-button-toggle']`
  )
    .click()
    .then(() => {
      cy.get(
        `[data-cy='${page}-${section}'] [data-cy='${page}-section-details-collapse-contents']`
      ).then(() => {
        Object.keys(getter.data).forEach((key, index) => {
          getter.data[key].forEach((item, i) => {
            // First p tag of div (key)
            cy.get(
              `[data-cy='${page}-section-details-collapse-item-${item?.text}-${index}-${i}'] p`
            )
              .first()
              .should("contain", item?.text);

            // Replace <br> with empty string
            item.value = item.value.replace(/<\/?[^>]+(>|$)/g, "");

            // Last p tag of div (value)
            cy.get(
              `[data-cy='${page}-section-details-collapse-item-${item?.text}-${index}-${i}'] p`
            )
              .last()
              .should("contain", item?.value);
          });
        });
      });
    });
});

// SUBMIT APP PAGE DETAILS

// submitMyInformationDetails
Cypress.Commands.add(
  "submitMyInformationDetails",
  (ugAppStore, form, access_token, appId) => {
    ugAppStore
      .submitMyInformation(access_token, appId, form)
      .then((response) => {
        response.forEach((error) => {
          if (error.value.code !== 200 && error.value.code !== 201) {
            throw new Error("My information submittion failed", response);
          }
        });
      });
  }
);
// submitMyProgramDetails
Cypress.Commands.add(
  "submitMyProgramDetails",
  (ugAppStore, form, access_token, appId) => {
    ugAppStore
      .submitMyAsuProgramForm(access_token, appId, form)
      .then((response) => {
        response.forEach((error) => {
          if (error.value.code !== 200 && error.value.code !== 201) {
            throw new Error("My program submission failed", response);
          }
        });
      });
  }
);
// submitMySchoolsDetails
Cypress.Commands.add(
  "submitMySchoolsDetails",
  (ugAppStore, form, access_token, appId) => {
    ugAppStore.submitMySchools(access_token, appId, form).then((response) => {
      response.forEach((error) => {
        if (error.value.code !== 200 && error.value.code !== 201) {
          throw new Error("My schools submission failed", response);
        }
      });
    });
  }
);
// submitMyHighSchoolGradesDetails
Cypress.Commands.add(
  "submitMyHighSchoolGradesDetails",
  (ugAppStore, form, access_token, appId) => {
    ugAppStore
      .submitMyHighSchoolGrades(access_token, appId, form)
      .then((response) => {
        response.forEach((error) => {
          if (error.value.code !== 200 && error.value.code !== 201) {
            throw new Error(
              "My high school grades submission failed",
              response
            );
          }
        });
      });
  }
);
// submitArizonaResidencyDetails
Cypress.Commands.add(
  "submitArizonaResidencyDetails",
  (ugAppStore, form, token, appId) => {
    const formData = form;
    ugAppStore
      .addApplicationResidencyAnswers({ token, appId, formData })
      .then((response) => {
        if (response.code !== 200 && response.code !== 201) {
          throw new Error("Arizona residency submission failed", response);
        }
      });
  }
);

// RESET APP PAGE DETAILS
// resetMyInformationPage
Cypress.Commands.add(
  "resetMyInformationPage",
  (ugAppStore, userStore, access_token, appId) => {
    // former names
    ugAppStore.formerNames.forEach((name) => {
      ugAppStore.removeApplicationFormerName(access_token, appId, name.id);
    });
    // addresses
    ugAppStore.addresses.forEach((address) => {
      ugAppStore.removeApplicationAddress(
        access_token,
        appId,
        address.addressId
      );
    });
    // ethnicity/races
    ugAppStore.ethnicities.forEach((ethnicity) => {
      ugAppStore.removeApplicationEthnicity(
        access_token,
        appId,
        ethnicity.ethnicGroupCode
      );
    });
    // parent / legal guardian
    ugAppStore.guardians.forEach((guardian) => {
      ugAppStore.removeApplicationGuardian(
        access_token,
        appId,
        guardian.guardianId
      );
    });
    // military affiliation
    ugAppStore.addApplicationMilitaryAffiliations(access_token, appId, {
      status: "None of these options apply",
    });
    // visasupplementals
    ugAppStore.removeApplicationVisaSupplementals(access_token, appId);
    // application details
    const userDetailsPayload = {
      birthCountry: null,
      citizenCountry: null,
      visaCode: null,
      attendedASU: null,
      asuID: null,
      sex: null,
      ssn: null,
      primaryLanguageAtHome: null,
      primaryLanguageAtHomeOther: null,
    };
    userStore.updateUserInfo(access_token, appId, userDetailsPayload);
    // deleting sar question answers
    generateSarValues(EnumSarCodes.myInfoSar).forEach((key) => {
      ugAppStore.removeApplicationSarQuestionResponses(
        access_token,
        appId,
        key
      );
    });
    cy.wait(10000);
  }
);

// resetProgramsPage
Cypress.Commands.add("resetProgramsPage", (ugAppStore, access_token, appId) => {
  const isRnToBsnProgramSelected = ugAppStore.programOfInterests.filter(
    (item) =>
      item.plan === MyProgramConstants.rnToBsnPlanCode &&
      item.subplan === MyProgramConstants.rnToBsnSubplanCode
  );
  // deleting RN to BSN SAR question only of the RN-BSN program is selected
  if (isRnToBsnProgramSelected.length > 0) {
    generateSarValues(EnumSarCodes.myAsuProgramSar.rnToBsn).forEach((key) => {
      ugAppStore.removeApplicationSarQuestionResponses(
        access_token,
        appId,
        key
      );
    });
  }
  // deleting other interests sar question answers
  generateSarValues(EnumSarCodes.myAsuProgramSar.otherInterests).forEach(
    (key) => {
      ugAppStore.removeApplicationSarQuestionResponses(
        access_token,
        appId,
        key
      );
    }
  );

  ugAppStore.programOfInterests.forEach((program) => {
    ugAppStore.removeApplicationProgramOfInterest(
      access_token,
      appId,
      program.priority
    );
  });
  cy.wait(10000);
});
// resetSchoolsPage
Cypress.Commands.add("resetSchoolsPage", (ugAppStore, access_token, appId) => {
  // deleting SAR Questions
  generateSarValues(EnumSarCodes.mySchoolsSar).forEach((key) => {
    ugAppStore.removeApplicationSarQuestionResponses(access_token, appId, key);
  });

  // deleting schools
  ugAppStore.highSchools.forEach((school) => {
    ugAppStore.removeApplicationHighSchool(
      access_token,
      appId,
      school.highSchoolId
    );
  });
  // deleting college/institutitons
  ugAppStore.otherInstitutions.forEach((institute) => {
    ugAppStore.removeApplicationOtherInstitution(
      access_token,
      appId,
      institute.otherInstitutionId
    );
  });
  // institution status
  const institutionStatus = null;
  ugAppStore.submitInstitutionStatus(access_token, appId, institutionStatus);
  cy.wait(10000);
});
// resetHighschoolGradesPage
Cypress.Commands.add(
  "resetHighschoolGradesPage",
  (ugAppStore, access_token, appId) => {
    generateSarValues(EnumSarCodes.myHighSchoolGradesSar).forEach((key) => {
      ugAppStore.removeApplicationSarQuestionResponses(
        access_token,
        appId,
        key
      );
    });

    // deleting the academic details
    ugAppStore.deleteApplicationHighSchoolAcademics(access_token, appId);
    // deleting highschool courseworks
    ugAppStore.highSchoolCourseWorks.forEach((course) => {
      ugAppStore.removeApplicationHighSchoolCourseWorks(
        access_token,
        appId,
        course.highSchoolCourseworkId
      );
    });
    cy.wait(10000);
  }
);
// resetArizonaResidencyPage
Cypress.Commands.add(
  "resetArizonaResidencyPage",
  (ugAppStore, access_token, appId) => {
    cy.intercept(
      "DELETE",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/residencyanswers`
    ).as("residencyAnswers");

    ugAppStore.deleteApplicationResidencyAnswers(access_token, appId);
    cy.wait(3000);
  }
);
// RESET COMPLETION
// reset application
Cypress.Commands.add(
  "resetApplication",
  (access_token, appId, userStore, ugAppStore) => {
    cy.resetArizonaResidencyPage(ugAppStore, access_token, appId).then(() => {
      cy.resetHighschoolGradesPage(ugAppStore, access_token, appId).then(() => {
        cy.resetSchoolsPage(ugAppStore, access_token, appId).then(() => {
          cy.resetProgramsPage(ugAppStore, access_token, appId).then(() => {
            cy.resetMyInformationPage(
              ugAppStore,
              userStore,
              access_token,
              appId
            );
          });
        });
      });
    });
  }
);

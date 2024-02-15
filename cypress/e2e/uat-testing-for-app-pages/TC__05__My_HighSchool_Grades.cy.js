import AcceptedVisaTypes from "../../../src/content/valid-visa-types.json";

let access_token = null;
let appId = null;
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
  it("populate userdetails and visit my highschool grades page", () => {
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
          "ug-app-my-schools",
          "ug-app-my-high-school-grades"
        );
        // populate other user details
        cy.populateUserDetails(appId, access_token, testCaseType);
      });
    });
  });
});

describe(`My High School Grades Tests: ${currentScenario}`, () => {
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

    cy.visit(`ug-app/${appId}/my-high-school-grades`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });

  it("handle master suite", () => {
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");

    const { gradePath, overallAcademics, highSchoolCourses } =
      config.myHighSchoolGrades;

    cy.get("[data-cy='my-high-school-grades-view']", {
      timeout: 30000,
    }).then(() => {
      // checking the eligibility
      let isEligibleToFillDetails = null;
      let isFutureGraduate = false;
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          isEligibleToFillDetails =
            userStore.citizenCountry === "USA" ||
            AcceptedVisaTypes.some((item) => item.value === userStore.visaCode);
          // isfuturegraduate
          isFutureGraduate = false;
          const highschool = ugAppStore.highSchools
            .slice()
            .filter((item) => item.gradYear && item.gradMonth);
          if (highschool.length > 0) {
            const currentDate = new Date();
            const month = parseInt(highschool[0].gradMonth);
            const year = parseInt(highschool[0].gradYear);
            isFutureGraduate =
              (year > currentDate.getFullYear() ||
                (year === currentDate.getFullYear() &&
                  month > currentDate.getMonth())) &&
              highschool[0].extOrgId !== "1100040290";
          }

          // if user is not eligible to fill details
          if (!isEligibleToFillDetails && !isFutureGraduate) {
            // checking if the alert is visible
            cy.get(
              '[data-cy="my-high-school-grades-page-heading-and-eta"]'
            ).contains(
              "Based on the information you provided, it appears that you are not a resident of the United States. Therefore, this page is not necessary. Please continue to the next step."
            );

            // save and move to next page
            cy.handleButton({
              buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
            }).then(() => {
              cy.wait("@notificationIntercept", { timeout: 30000 });
              cy.url(`ug-app/${appId}/arizona-residency`);
            });
          } else {
            // eligible to fill details
            if (!isFutureGraduate) {
              cy.get(
                `[data-cy='my-high-school-grades-admission-type'] [type="radio"]`
              ).check(gradePath === "Y" ? "Y" : "N", {
                force: true,
              });
            }
            // filling the course details is user as selected Y future graduate
            if (gradePath === "Y" || isFutureGraduate) {
              cy.handleBaseInput({
                selector:
                  '[data-cy="my-high-school-grades-overall-academics-unweighted-gpa"]',
                text: overallAcademics.unweightedGpa,
                errorMessage: config.errorMessage,
              });
              cy.handleBaseSingleSelect({
                selector:
                  '[data-cy="my-high-school-grades-overall-academics-gpa-scale"]',
                text: overallAcademics.gpaScale.text,
                errorMessage: config.errorMessage,
              });
              cy.handleBaseInput({
                selector:
                  '[data-cy="my-high-school-grades-overall-academics-class-rank-size"] #class_rank',
                text: overallAcademics.classRankSize.rank
                  ? overallAcademics.classRankSize.rank
                  : "",
                errorMessage: config.errorMessage,
              });
              cy.handleBaseInput({
                selector:
                  '[data-cy="my-high-school-grades-overall-academics-class-rank-size"] #class_size',
                text: overallAcademics.classRankSize.size
                  ? overallAcademics.classRankSize.size
                  : "",
                errorMessage: config.errorMessage,
              });
              cy.handleBaseSingleSelect({
                selector:
                  '[data-cy="my-high-school-grades-overall-academics-grading-system"]',
                text: overallAcademics.gradingSystem.text,
                errorMessage: config.errorMessage,
              });
              // course works
              // Get all tabs list
              highSchoolCourses.forEach((course) => {
                cy.get(
                  '[ data-cy="my-high-school-grades-course-works-tabs"] li.nav-item'
                ).then((tabList) => {
                  const [
                    english,
                    math,
                    science,
                    socialScience,
                    language,
                    fineArtsCTE,
                    electives,
                  ] = tabList;

                  // Click on desired tab
                  switch (course.courseName.subjectId) {
                    case "1":
                      cy.wrap(english).click();
                      break;
                    case "2":
                      cy.wrap(math).click();
                      break;
                    case "3":
                      cy.wrap(science).click();
                      break;
                    case "4":
                      cy.wrap(socialScience).click();
                      break;
                    case "5":
                      cy.wrap(language).click();
                      break;
                    case "6":
                      cy.wrap(fineArtsCTE).click();
                      break;
                    case "7":
                      cy.wrap(electives).click();
                      break;
                    default:
                      throw new Error("Invalid tab name");
                  }
                  // wait for 1 sec to completed the add course section transition.
                  cy.wait(1000);
                  // Academic year
                  if (
                    !(userStore.citizenCountry !== "USA" && isFutureGraduate)
                  ) {
                    cy.handleBaseSingleSelect({
                      selector:
                        '[data-cy="my-high-school-grades-course-works-academic-year"]',
                      text: course.academicYear.text,
                      errorMessage: config.errorMessage,
                    });
                  }

                  // Course name
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="my-high-school-grades-course-works-course-name"]',
                    text: course.courseName.text,
                    errorMessage: config.errorMessage,
                  });
                  // custom course name
                  if (
                    course.courseName.name.toLowerCase() === "other (specify)"
                  ) {
                    cy.handleBaseInput({
                      selector:
                        '[data-cy="my-high-school-grades-course-works-custom-course-name"]',
                      text: course.customeCourseName,
                      errorMessage: config.errorMessage,
                    });
                  }
                  // Duration
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="my-high-school-grades-course-works-duration"]',
                    text: course.duration.text,
                    errorMessage: config.errorMessage,
                  });

                  // Course level
                  cy.handleBaseSingleSelect({
                    selector:
                      '[data-cy="my-high-school-grades-course-works-course-level"]',
                    text: course.courseLevel.text,
                    errorMessage: config.errorMessage,
                  });

                  for (let key in course.grades) {
                    cy.get(
                      '[data-cy="my-high-school-grades-course-works-grade-fields"] input'
                    ).each((input) => {
                      cy.wrap(input)
                        .type(course.grades[key].text)
                        .type("{enter}");
                    });
                  }

                  // Save button
                  cy.handleButton({
                    buttonSelector:
                      '[data-cy="my-high-school-grades-new-courses-button-submit"] > button',
                  });
                });
              });
            }
            // END of filling the details

            // save and move to next page
            cy.handleButton({
              buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
            }).then(() => {
              cy.wait("@notificationIntercept", { timeout: 30000 });
              cy.url(`ug-app/${appId}/arizona-residency`);
            });
          }
        });
      });
    });
  });
});

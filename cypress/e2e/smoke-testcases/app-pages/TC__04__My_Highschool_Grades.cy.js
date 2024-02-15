import { MyHighSchoolConstants } from "../../../../src/content/enum-ug-application.js";

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
    cy.readFile(`cypress/config/smoke-testing/my-highschool-grades.json`).then(
      (data) => (config = data)
    );
    cy.readFile(`cypress/config/constants.json`).then(({ testCaseTypes }) => {
      testCaseType = testCaseTypes.smokeTesting;
    });
  });

  it("populate userdetails and vist my highschool grades page", () => {
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
      "ug-app-my-schools",
      "ug-app-my-high-school-grades"
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
          cy.resetSchoolsPage(ugAppStore, access_token, appId).then(() => {
            cy.resetHighschoolGradesPage(ugAppStore, access_token, appId).then(
              () => {
                cy.populateUserDetails(appId, access_token, testCaseType);
              }
            );
          });
        });
      });
  });
});
describe("Functional testing", () => {
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-schools",
      "ug-app-my-high-school-grades"
    );
    cy.visit(`ug-app/${appId}/my-high-school-grades`);
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("Overall academics inputs", () => {
    const { validVisaCode } = config;
    cy.get("[data-cy='my-high-school-grades-view']", {
      timeout: 30000,
    }).then(() => {
      cy.userStore().then((userStore) => {
        userStore.visaCode = validVisaCode;
        // selecting self report
        cy.get(
          `[data-cy='my-high-school-grades-admission-type'] [type="radio"]`
        ).check("Y", {
          force: true,
        });
        // overall academics
        cy.get("[data-cy='my-high-school-grades-overall-academics']").should(
          "be.visible"
        );
        // Unweighted GPA
        cy.get(
          "[data-cy='my-high-school-grades-overall-academics-unweighted-gpa']"
        ).should("be.visible");
        cy.get(
          "[data-cy='my-high-school-grades-overall-academics-unweighted-gpa'] input"
        ).type("1111111");
        cy.get(
          "[data-cy='my-high-school-grades-overall-academics-unweighted-gpa'] .invalid-feedback"
        )
          .should("be.visible")
          .contains("GPA should not be more that 6 characters.");
        cy.get(
          "[data-cy='my-high-school-grades-overall-academics-unweighted-gpa'] input"
        ).clear();
        cy.get(
          "[data-cy='my-high-school-grades-overall-academics-unweighted-gpa'] input"
        ).type("111111");
        cy.get(
          "[data-cy='my-high-school-grades-overall-academics-unweighted-gpa'] input"
        ).should("have.class", "is-valid");
        // GPA scale
        cy.get(
          "[data-cy='my-high-school-grades-overall-academics-gpa-scale']"
        ).should("be.visible");
        // class rank/size
        cy.get(
          '[data-cy="my-high-school-grades-overall-academics-class-rank-size"] #class_rank'
        ).should("be.visible");
        cy.get(
          '[data-cy="my-high-school-grades-overall-academics-class-rank-size"] #class_size'
        ).should("be.visible");
        // class rank/size maxlength check
        ["class_rank", "class_size"].forEach((inputId, index) => {
          cy.get(
            `[data-cy='my-high-school-grades-overall-academics-class-rank-size'] #${inputId} input`
          ).type(`11111`);
          cy.get(
            `[data-cy='my-high-school-grades-overall-academics-class-rank-size'] #${inputId} .invalid-feedback`
          )
            .should("be.visible")
            .contains("Should not contain more than 4 characters.");
          cy.get(
            `[data-cy='my-high-school-grades-overall-academics-class-rank-size'] #${inputId} input`
          ).clear();
          cy.get(
            `[data-cy='my-high-school-grades-overall-academics-class-rank-size'] #${inputId} input`
          ).type(`111${index}`);
          cy.get(
            `[data-cy='my-high-school-grades-overall-academics-class-rank-size'] #${inputId} input`
          ).should("have.class", "is-valid");
        });
        // Grading system
        cy.get(
          "[data-cy='my-high-school-grades-overall-academics-grading-system']"
        ).should("be.visible");
      });
    });
  });
  it("Course works tabs and inputs", () => {
    const { validVisaCode, duration } = config;
    cy.get("[data-cy='my-high-school-grades-view']", {
      timeout: 30000,
    }).then(() => {
      cy.userStore().then((userStore) => {
        userStore.visaCode = validVisaCode;
        // selecting self report
        cy.get(
          `[data-cy='my-high-school-grades-admission-type'] [type="radio"]`
        ).check("Y", {
          force: true,
        });
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="my-high-school-grades-overall-academics-grading-system"]',
          text: "A-F",
        });
        cy.get("[data-cy='my-high-school-grades-course-works-tabs']").should(
          "be.visible"
        );

        cy.configStore().then((configStore) => {
          cy.get(
            "[data-cy='my-high-school-grades-course-works-tabs'] ul li"
          ).should("have.length", configStore.highSchoolCourseSubjects.length);
          configStore.highSchoolCourseSubjects.forEach((subject, index) => {
            cy.get(
              `[data-cy='my-high-school-grades-course-works-tabs'] ul li:nth-of-type(${
                index + 1
              }) a`
            ).contains(subject.subjectName);
          });
        });
        // add a course section
        cy.get("[data-cy='my-high-school-grades-add-new-courses']").should(
          "be.visible"
        );
        // Academic year
        cy.get(
          "[data-cy='my-high-school-grades-course-works-academic-year']"
        ).should("be.visible");
        // Course name
        cy.get(
          "[data-cy='my-high-school-grades-course-works-course-name']"
        ).should("be.visible");
        // Duration
        cy.get(
          "[data-cy='my-high-school-grades-course-works-duration']"
        ).should("be.visible");
        // Course level
        cy.get(
          "[data-cy='my-high-school-grades-course-works-course-level']"
        ).should("be.visible");
        duration.forEach((item) => {
          cy.handleBaseSingleSelect({
            selector: '[data-cy="my-high-school-grades-course-works-duration"]',
            text: item.type,
          });
          for (let i = 0; i < item.noOfGrades; i++) {
            cy.get(
              `[data-cy='my-high-school-grades-course-works-grade-fields'] #course-level-${i}`
            ).should("be.visible");
          }
        });
      });
    });
  });
  it("Edit/delete coursework", () => {
    const { validVisaCode, courseWork } = config;
    cy.get("[data-cy='my-high-school-grades-view']", {
      timeout: 30000,
    }).then(() => {
      cy.userStore().then((userStore) => {
        userStore.visaCode = validVisaCode;
        // selecting self report
        cy.get(
          `[data-cy='my-high-school-grades-admission-type'] [type="radio"]`
        ).check("Y", {
          force: true,
        });
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="my-high-school-grades-overall-academics-grading-system"]',
          text: courseWork.gradingSystem,
        });
        cy.get("[data-cy='my-high-school-grades-course-works-tabs']").should(
          "be.visible"
        );
        // Academic year
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="my-high-school-grades-course-works-academic-year"]',
          text: courseWork.course.academicYear,
          errorMessage: config.errorMessage,
        });

        // checking the error messages
        cy.handleButton({
          buttonSelector:
            '[data-cy="my-high-school-grades-new-courses-button-submit"] > button',
        });

        // Course name
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="my-high-school-grades-course-works-course-name"]',
          text: courseWork.course.courseName,
          errorMessage: config.errorMessage,
        });
        // custom course name
        if (courseWork.course.courseName.toLowerCase() === "other (specify)") {
          cy.handleBaseInput({
            selector:
              '[data-cy="my-high-school-grades-course-works-custom-course-name"]',
            text: courseWork.course.customCourseName,
            errorMessage: config.errorMessage,
          });
        }
        // Duration
        cy.handleBaseSingleSelect({
          selector: '[data-cy="my-high-school-grades-course-works-duration"]',
          text: courseWork.course.duration,
          errorMessage: config.errorMessage,
        });

        // Course level
        cy.handleBaseSingleSelect({
          selector:
            '[data-cy="my-high-school-grades-course-works-course-level"]',
          text: courseWork.course.courseLevel,
          errorMessage: config.errorMessage,
        });
        // checking the error messages
        cy.handleButton({
          buttonSelector:
            '[data-cy="my-high-school-grades-new-courses-button-submit"] > button',
        });

        cy.get(
          '[data-cy="my-high-school-grades-course-works-grade-fields"] input'
        ).each((input, ind) => {
          cy.wrap(input).type(courseWork.course.grades[ind]).type("{enter}");
        });

        // Save button
        cy.handleButton({
          buttonSelector:
            '[data-cy="my-high-school-grades-new-courses-button-submit"] > button',
        });

        // table
        cy.get("[data-cy='my-high-school-grades-course-work-table']").should(
          "be.visible"
        );
        cy.get(
          "[data-cy='my-high-school-grades-course-work-table'] tbody tr"
        ).should("have.length", 1);
        // edit button
        cy.get("[data-cy='my-high-school-grades-course-work-table'] tbody tr")
          .find("[data-cy='my-high-school-grades-course-work-edit']")
          .should("be.visible");
        // delete button
        cy.get("[data-cy='my-high-school-grades-course-work-table'] tbody tr")
          .find("[data-cy='my-high-school-grades-course-work-delete']")
          .should("be.visible");
        // click edit
        cy.get("[data-cy='my-high-school-grades-course-work-table'] tbody tr")
          .find("[data-cy='my-high-school-grades-course-work-edit']")
          .click();
        cy.get(
          '[data-cy="my-high-school-grades-course-work-edit-modal"]'
        ).should("be.visible");
        cy.handleButton({
          buttonSelector:
            '[data-cy="my-high-school-grades-course-work-edit-modal"] [data-cy="my-high-school-grades-new-courses-button-submit"] > button',
        });
        // click delete
        cy.get("[data-cy='my-high-school-grades-course-work-table'] tbody tr")
          .find("[data-cy='my-high-school-grades-course-work-delete']")
          .click();
        // modal should be visible
        cy.get("#delete-course-modal").should("be.visible");
        // cancle button
        cy.get('[data-cy="my-high-school-grades-cancel-button"]').should(
          "be.visible"
        );
        // delete button
        cy.get('[data-cy="my-high-school-grades-delete-button"]').should(
          "be.visible"
        );
        // delete course
        cy.get('[data-cy="my-high-school-grades-delete-button"]').click();
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
      "ug-app-my-schools",
      "ug-app-my-high-school-grades"
    );

    cy.visit(`ug-app/${appId}/my-high-school-grades`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("past graduation school date", () => {
    const { nonUsCitizenVisaCode, pastGraduationSchool } = config;
    cy.get("[data-cy='my-high-school-grades-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          userStore.visaCode = nonUsCitizenVisaCode;
          userStore.citizenCountry = "AFG";
          ugAppStore.highSchools = pastGraduationSchool;
          cy.get(
            '[data-cy="my-high-school-grades-page-heading-and-eta"]'
          ).contains(
            "Based on the information you provided, it appears that you are not a resident of the United States. Therefore, this page is not necessary. Please continue to the next step."
          );
        });
      });
    });
  });
  it("Future graduation school date", () => {
    const { nonUsCitizenVisaCode, futureGraduationSchool } = config;
    cy.get("[data-cy='my-high-school-grades-view']", {
      timeout: 30000,
    }).then(() => {
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          userStore.visaCode = nonUsCitizenVisaCode;
          userStore.citizenCountry = "AFG";
          ugAppStore.highSchools = futureGraduationSchool;
          // verify the radio card is not visible
          cy.get("[data-cy='my-high-school-grades-view']")
            .find("[data-cy='my-high-school-grades-intro-and-card-selections']")
            .should("not.exist");
          cy.get(
            "[data-cy='my-high-school-grades-future-dated-intro-with-grading-system-input']"
          ).should("be.visible");
          cy.get("[data-cy='my-high-school-grades-view']")
            .find("[data-cy='my-high-school-grades-course-works-tabs']")
            .should("not.exist");
          // verify user is allowed to enter only Senior adamemic year course work
          // selecting the grading system
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="my-high-school-grades-overall-academics-grading-system"]',
            text: "A-F",
          });
          // course work tab should be visible
          cy.get("[data-cy='my-high-school-grades-course-works-tabs']").should(
            "be.visible"
          );
          // verifying the academic year field is disabled and preselected with senior year
          cy.get(
            "[data-cy='my-high-school-grades-course-works-academic-year'] .vs__selected"
          ).contains("Senior/12");
          cy.get(
            "[data-cy='my-high-school-grades-course-works-academic-year'] input"
          ).should("be.disabled");
        });
      });
    });
  });
});
describe("US citizen", () => {
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-schools",
      "ug-app-my-high-school-grades"
    );
    cy.visit(`ug-app/${appId}/my-high-school-grades`);
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });
  it("past graduation date with self reporting", () => {
    const { pastGraduationSchool, validVisaCode } = config;
    cy.get("[data-cy='my-high-school-grades-view']", {
      timeout: 30000,
    }).then(() => {
      // updating the visa code to be a US citizen
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          userStore.visaCode = validVisaCode;
          ugAppStore.highSchools = pastGraduationSchool;
          cy.get(
            '[data-cy="my-high-school-grades-intro-and-card-selections"]'
          ).should("be.visible");
          // selecting the self report
          cy.get(
            `[data-cy='my-high-school-grades-admission-type'] [type="radio"]`
          ).check("Y", {
            force: true,
          });
          // verifying academic details input are visible
          cy.get("[data-cy='my-high-school-grades-overall-academics']").should(
            "be.visible"
          );
          // selecting the grading system
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="my-high-school-grades-overall-academics-grading-system"]',
            text: "A-F",
          });
          // course work tab should be visible
          cy.get("[data-cy='my-high-school-grades-course-works-tabs']").should(
            "be.visible"
          );
          // verifying academic year select is not disabled
          cy.get(
            "[data-cy='my-high-school-grades-course-works-academic-year'] input"
          ).should("not.be.disabled");
          cy.get("[data-cy='up-app-desktop-footer-save-button']").click();
          // verifying the coursework error message, and verifying the text
          cy.get(
            "[data-cy='my-high-school-grades-course-works-error-alert']"
          ).should("be.visible");
          cy.get(
            "[data-cy='my-high-school-grades-course-works-error-alert']"
          ).contains("Please enter at least one course.");
        });
      });
    });
  });
  it("past graduation date with transcript only", () => {
    const { pastGraduationSchool, validVisaCode } = config;
    cy.get("[data-cy='my-high-school-grades-view']", {
      timeout: 30000,
    }).then(() => {
      // updating the visa code to be a US citizen
      cy.ugApplicationStore().then((ugAppStore) => {
        cy.userStore().then((userStore) => {
          userStore.visaCode = validVisaCode;
          ugAppStore.highSchools = pastGraduationSchool;
          cy.get(
            '[data-cy="my-high-school-grades-intro-and-card-selections"]'
          ).should("be.visible");
          // selecting the self report
          cy.get(
            `[data-cy='my-high-school-grades-admission-type'] [type="radio"]`
          ).check("N", {
            force: true,
          });
          // verifing the academic details are not visible
          cy.get("[data-cy='my-high-school-grades-view']")
            .find("[data-cy='my-high-school-grades-overall-academics']")
            .should("not.exist");
        });
      });
    });
  });
  it("Future graduation date", () => {
    const { validVisaCode, futureGraduationSchool } = config;
    cy.get("[data-cy='my-high-school-grades-view']", {
      timeout: 30000,
    }).then(() => {
      // updating the visa code to be a US citizen
      cy.userStore().then((userStore) => {
        cy.ugApplicationStore().then((ugAppStore) => {
          userStore.visaCode = validVisaCode;
          ugAppStore.highSchools = futureGraduationSchool;
          // verify the radio card is not visible
          cy.get("[data-cy='my-high-school-grades-view']")
            .find("[data-cy='my-high-school-grades-intro-and-card-selections']")
            .should("not.exist");
          cy.get(
            "[data-cy='my-high-school-grades-future-dated-intro-with-grading-system-input']"
          ).should("be.visible");
          cy.get("[data-cy='my-high-school-grades-view']")
            .find("[data-cy='my-high-school-grades-course-works-tabs']")
            .should("not.exist");
          // verify user is allowed to enter only Senior adamemic year course work
          // selecting the grading system
          cy.handleBaseSingleSelect({
            selector:
              '[data-cy="my-high-school-grades-overall-academics-grading-system"]',
            text: "A-F",
          });
          // course work tab should be visible
          cy.get("[data-cy='my-high-school-grades-course-works-tabs']").should(
            "be.visible"
          );
          // verifying academic year select is not disabled
          cy.get(
            "[data-cy='my-high-school-grades-course-works-academic-year'] input"
          ).should("not.be.disabled");
          cy.get("[data-cy='up-app-desktop-footer-save-button']").click();
          // verifying the coursework error message, and verifying the text
          cy.get(
            "[data-cy='my-high-school-grades-course-works-error-alert']"
          ).should("be.visible");
          cy.get(
            "[data-cy='my-high-school-grades-course-works-error-alert']"
          ).contains("Please enter at least one course for senior year.");
        });
      });
    });
  });
});
describe("Two way binding", () => {
  beforeEach(() => {
    cy.interceptUiViewInfo(
      appId,
      "ug-app-my-schools",
      "ug-app-my-high-school-grades"
    );
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    const apiCalls = [
      {
        key: "highschools",
        endpoint: `${Cypress.env(
          "baseUrl"
        )}/api/ug/applications/${appId}/highschools`,
      },
      {
        key: "sarQuestionResponses",
        endpoint: `${Cypress.env(
          "baseUrl"
        )}/api/ug/applications/${appId}/sarquestionresponses`,
      },
      {
        key: "highschoolCourseWorks",
        endpoint: `${Cypress.env(
          "baseUrl"
        )}/api/ug/applications/${appId}/highschoolcourseworks`,
      },
      {
        key: "highschoolAcademics",
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

    cy.visit(`ug-app/${appId}/my-high-school-grades`);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("Grade path and academic details", () => {
    const { validVisaCode } = config;
    cy.get("[data-cy='my-high-school-grades-view']", {
      timeout: 30000,
    }).then(() => {
      // updating the visa code to be a US citizen
      cy.userStore().then((userStore) => {
        cy.ugApplicationStore().then((ugAppStore) => {
          userStore.visaCode = validVisaCode;
          cy.get("[data-cy='my-high-school-grades-admission-type'] :checked")
            .should("be.checked")
            .and("have.value", ugAppStore.myHighSchoolGradesSar.gradePath);
          // overall academics
          if (ugAppStore.myHighSchoolGradesSar.gradePath === "Y") {
            // unweighted GPA
            cy.get(
              "[data-cy='my-high-school-grades-overall-academics-unweighted-gpa'] input"
            ).should(
              "have.value",
              ugAppStore.highSchoolAcademics.currentUnweightedGpa
            );
            // GPA scale
            cy.configStore().then((configStore) => {
              const gpaScale = configStore.highSchoolGpaScales.filter(
                (item) => item.id === ugAppStore.highSchoolAcademics.gpaScaleId
              );
              cy.get(
                "[data-cy='my-high-school-grades-overall-academics-gpa-scale'] .vs__selected"
              ).contains(gpaScale[0].text);
            });
            // Class rank / Class size
            cy.get(
              "[data-cy='my-high-school-grades-overall-academics-class-rank-size'] #class_rank input"
            ).should("have.value", ugAppStore.highSchoolAcademics.classRank);
            cy.get(
              "[data-cy='my-high-school-grades-overall-academics-class-rank-size'] #class_size input"
            ).should("have.value", ugAppStore.highSchoolAcademics.classSize);
            // Grading system
            cy.configStore().then((configStore) => {
              const gpaScaleType = configStore.highSchoolGradeScaleTypes.filter(
                (item) =>
                  item.id === ugAppStore.highSchoolAcademics.gradingScaleId
              );
              cy.get(
                "[data-cy='my-high-school-grades-overall-academics-grading-system'] .vs__selected"
              ).contains(gpaScaleType[0].text);
            });
          }
        });
      });
    });
  });

  it("Course works details", () => {
    const { validVisaCode } = config;
    cy.get("[data-cy='my-high-school-grades-view']", {
      timeout: 30000,
    }).then(() => {
      // updating the visa code to be a US citizen
      cy.userStore().then((userStore) => {
        cy.ugApplicationStore().then((ugAppStore) => {
          cy.configStore().then((configStore) => {
            userStore.visaCode = validVisaCode;
            // if grade path is Y (Selected self report) then verifying the course works
            if (ugAppStore.myHighSchoolGradesSar.gradePath === "Y") {
              configStore.highSchoolCourseSubjects.forEach((subject, index) => {
                cy.get(
                  '[ data-cy="my-high-school-grades-course-works-tabs"] li.nav-item'
                ).then((tabList) => {
                  cy.wrap(tabList[index]).click();
                  const courses = ugAppStore.highSchoolCourseWorks.filter(
                    (item) => item.subjectId === subject.id
                  );
                  courses.forEach((course, i) => {
                    cy.get(
                      '[data-cy="my-high-school-grades-course-work-table"] tbody tr'
                    ).then((rows) => {
                      cy.wrap(rows[i])
                        .find(
                          '[data-cy="my-high-school-grades-course-work-edit"]'
                        )
                        .click();
                      // checking the fields
                      // academic year
                      const academicYear =
                        configStore.highSchoolAcademicYears.filter(
                          (item) => item.id === course.academicYearId
                        );
                      cy.get(
                        "[data-cy='my-high-school-grades-course-works-academic-year'] .vs__selected"
                      ).contains(academicYear[0].text);
                      // course name
                      const courseName = configStore.highSchoolCourses.filter(
                        (item) => item.id === course.courseId
                      );
                      cy.get(
                        "[data-cy='my-high-school-grades-course-works-course-name'] .vs__selected"
                      ).contains(courseName[0].text);
                      // custom course name
                      if (
                        MyHighSchoolConstants.courseNameOther.includes(
                          courseName[0].text
                        )
                      ) {
                        cy.get(
                          "[data-cy='my-high-school-grades-course-works-custom-course-name'] input"
                        ).should("have.value", course.courseTitleAlternateText);
                      }
                      // Duration
                      const duration = configStore.highSchoolTermTypes.filter(
                        (item) => item.id === course.termTypeId
                      );
                      cy.get(
                        "[data-cy='my-high-school-grades-course-works-duration'] .vs__selected"
                      ).contains(duration[0].text);
                      // Course level
                      const courseLevel =
                        configStore.highSchoolCourseLevels.filter(
                          (item) => item.id === course.courseLevelId
                        );
                      cy.get(
                        "[data-cy='my-high-school-grades-course-works-course-level'] .vs__selected"
                      ).contains(courseLevel[0].text);
                      // grades
                      course.grades.forEach((grade, gradeIndex) => {
                        const gradeDetail = configStore.highSchoolGrades.filter(
                          (item) => item.id === grade.gradeId
                        );
                        cy.get(
                          `[data-cy='my-high-school-grades-course-works-grade-fields'] #course-level-${gradeIndex} .vs__selected`
                        ).contains(gradeDetail[0].text);
                      });
                      // closing the modal
                      cy.get("#update-course-modal .close").click();
                    });
                  });
                });
              });
            }
          });
        });
      });
    });
  });
});

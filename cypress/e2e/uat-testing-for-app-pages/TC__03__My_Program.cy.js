import myProgramContent from "../../../src/content/my-asu-program.json";

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

  it("populate userdetails and visit my programs page", () => {
    cy.login(userDetails.email, userDetails.password);
    // Intercept config get calls
    cy.getCookie("access_token").then((item) => {
      access_token = item.value;
      cy.populateUgApplications(access_token).then((response) => {
        if (response.data.length > 0) {
          appId = response.data[0].appId;
        }
        // set current screen as my-program and previous screen as my-information
        cy.setUIViewInfo(
          access_token,
          appId,
          "ug-app-my-information",
          "ug-app-my-program"
        );
        // populate other user details
        cy.populateUserDetails(appId, access_token, testCaseType);
      });
    });
  });
});

describe(`My Program Tests: ${currentScenario}`, () => {
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

    cy.visit(`ug-app/${appId}/my-program`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });

  it("handle master suite", () => {
    cy.intercept("GET", `${Cypress.env("dplBaseUrl")}/codeset/acad-plan/*`).as(
      "acadPlanIntercept"
    );

    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");

    const { programsSelected, rnToBsn, otherInterests } = config.myProgram;

    cy.get("[data-cy=my-programs-view]", {
      timeout: 30000,
    })
      .should("be.visible")
      .then(() => {
        // SECTION: Academic Calendar
        cy.handleButton({
          buttonSelector: "[data-cy='my-programs-heading-cta'] a",
        });
        cy.handleButton({
          buttonSelector:
            "[data-cy='my-programs-academic-calendar-sidebar'] > div > div.bg-white span",
        });

        // SECTION: View details
        cy.handleButton({
          buttonSelector:
            "[data-cy='my-programs-filtered-programs'] > div:nth-of-type(1) [data-cy='my-programs-view-details-button']",
        });
        cy.handleButton({
          buttonSelector:
            "[data-cy='my-programs-programs-details-sidebar'] > div > div.bg-white span",
        });

        programsSelected.forEach((program, ind) => {
          // choosing first choice program
          if (program.payloadData.priority === "1") {
            cy.get("[data-cy='my-programs-filters-search-input']").type(
              program.title,
              { force: true }
            );
            // choosing first choice program
            cy.handleButton({
              buttonSelector:
                "[data-cy='my-programs-filtered-programs'] > div:nth-of-type(1) [data-cy='my-programs-choose-program-button']",
            });
            cy.wait("@acadPlanIntercept");
            // term
            cy.get(
              `[data-cy='my-programs-confirm-program-modal-select-date-group'] [type="radio"]`
            ).check(program.startDate, { force: true });
            // next
            cy.handleButton({
              buttonSelector:
                "[data-cy='my-programs-confirm-program-modal-save-button']",
            });
            // save
            cy.handleButton({
              buttonSelector:
                "[data-cy='my-programs-confirm-program-modal-save-button']",
            });
          }

          // choosing second choice program
          if (program.payloadData.priority === "2") {
            // check the previous program
            cy.get(
              "[data-cy='my-programs-selected-program-collapse-button']"
            ).click();
            // checking the title of previous program
            cy.get(`[data-cy="my-programs-program-title"]`).contains(
              programsSelected[ind - 1].title
            );
            // checking the term of previous program
            cy.get(`[data-cy="my-programs-program-start-date"]`).contains(
              programsSelected[ind - 1].startDate
            );

            cy.get(
              '[data-cy="my-programs-selected-programs-backup-program-card"]'
            ).then(() => {
              cy.get("[data-cy='my-programs-filters-search-input']").clear();
              // choosing first choice program
              cy.get("[data-cy='my-programs-filters-search-input']").type(
                program.title,
                { force: true }
              );
              // choosing the program
              cy.handleButton({
                buttonSelector:
                  "[data-cy='my-programs-filtered-programs'] > div:nth-of-type(1) [data-cy='my-programs-choose-program-button']",
              });
              cy.wait("@acadPlanIntercept");
              // term
              cy.get(
                `[data-cy='my-programs-confirm-program-modal-select-date-group'] [type="radio"]`
              ).check(program.startDate, { force: true });
              // next
              cy.handleButton({
                buttonSelector:
                  "[data-cy='my-programs-confirm-program-modal-save-button']",
              });
              // save
              cy.handleButton({
                buttonSelector:
                  "[data-cy='my-programs-confirm-program-modal-save-button']",
              });
              cy.get("[data-cy='my-programs-selected-program']").should(
                "have.length",
                2
              );
              cy.get("[data-cy='my-programs-selected-program']")
                .last()
                .find(`[data-cy="my-programs-program-title"]`)
                .contains(program.title);

              cy.get("[data-cy='my-programs-selected-program']")
                .last()
                .find(`[data-cy="my-programs-program-start-date"]`)
                .contains(program.startDate);
            });
          }
        });

        // checking if RN/BSN program is selected
        cy.get('[data-cy="my-programs-view"]').then((section) => {
          // checking if the second choice program is required and alert is displayed
          if (section.find(`[data-cy="my-programs-rn-to-bsn"]`).length > 0) {
            // filling RN to BSN related questions
            // is licensed
            cy.handleRadioButton({
              radioSelector: `[data-cy='my-programs-rn-to-bsn-is-licensed-group'] [data-cy='radio-group'] > div:nth-of-type(${
                rnToBsn.isLicensed.text.toLowerCase() === "yes" ? 1 : 2
              }) > label`,
            });
            // license state
            cy.handleBaseSingleSelect({
              selector: `[data-cy="my-programs-rn-to-bsn-licensed-state-group"]`,
              text: rnToBsn.license.state.text,
              errorMessage: config.errorMessage,
            });
            // license number
            cy.handleBaseInput({
              selector:
                "[data-cy='my-programs-rn-to-bsn-license-number-group']",
              text: rnToBsn.license.number,
              required: true,
              errorMessage: config.errorMessage,
            });
            // license expiration date
            // month
            cy.handleBaseSingleSelect({
              selector: `[data-cy="my-programs-rn-to-bsn-license-expiration-date-group"] #license_expiration_month_select`,
              text: rnToBsn.license.expirationDate.month.text,
              errorMessage: config.errorMessage,
            });
            // day
            cy.handleBaseSingleSelect({
              selector: `[data-cy="my-programs-rn-to-bsn-license-expiration-date-group"] #license_expiration_day_select`,
              text: rnToBsn.license.expirationDate.day.text,
              errorMessage: config.errorMessage,
            });
            // year
            cy.handleBaseSingleSelect({
              selector: `[data-cy="my-programs-rn-to-bsn-license-expiration-date-group"] #license_expiration_year_select`,
              text: rnToBsn.license.expirationDate.year.text,
              errorMessage: config.errorMessage,
            });
            // Is your license encumbered
            cy.handleRadioButton({
              radioSelector: `[data-cy='my-programs-rn-to-bsn-license-disciplinary-action-group'] [data-cy='radio-group'] > div:nth-of-type(${
                rnToBsn.license.disciplinaryActionTaken.text.toLowerCase() ===
                "yes"
                  ? 1
                  : 2
              }) > label`,
            });
            // Date scheduled to take NCLEX-RN
            // month
            cy.handleBaseSingleSelect({
              selector: `[data-cy="my-programs-rn-to-bsn-date-scheduled-for-nclexrn-group"] #nclex_rn_month_select`,
              text: rnToBsn.dateScheduledForNclexrn.month.text,
              errorMessage: config.errorMessage,
            });
            // day
            cy.handleBaseSingleSelect({
              selector: `[data-cy="my-programs-rn-to-bsn-date-scheduled-for-nclexrn-group"] #nclex_rn_day_select`,
              text: rnToBsn.dateScheduledForNclexrn.day.text,
              errorMessage: config.errorMessage,
            });
            // year
            cy.handleBaseSingleSelect({
              selector: `[data-cy="my-programs-rn-to-bsn-date-scheduled-for-nclexrn-group"] #nclex_rn_year_select`,
              text: rnToBsn.dateScheduledForNclexrn.year.text,
              errorMessage: config.errorMessage,
            });
            // Employer
            cy.handleBaseInput({
              selector: "[data-cy='my-programs-rn-to-bsn-employer-group']",
              text: rnToBsn.employer,
              required: true,
              errorMessage: config.errorMessage,
            });
            // partner code
            cy.handleBaseInput({
              selector: "[data-cy='my-programs-rn-to-bsn-partner-code-group']",
              text: rnToBsn.partnerCode || "",
              errorMessage: config.errorMessage,
            });
            // I authorize ASU to release my name and graduation information to my employer.
            cy.handleRadioButton({
              radioSelector: `[data-cy='my-programs-rn-to-bsn-release_info_to_employer_group'] [data-cy='radio-group'] > div:nth-of-type(${
                rnToBsn.releaseInfoToEmployer.text.toLowerCase() === "yes"
                  ? 1
                  : 2
              }) > label`,
            });
            // Arizona Community Colleges
            cy.handleBaseSingleSelect({
              selector: `[data-cy="my-programs-rn-to-bsn-community-college-group"]`,
              text: rnToBsn.communityColleges.text,
              errorMessage: config.errorMessage,
            });
            // Reverse Transfer Agreement?
            cy.handleRadioButton({
              radioSelector: `[data-cy='my-programs-rn-to-bsn-reverse-transfer-group'] [data-cy='radio-group'] > div:nth-of-type(${
                rnToBsn.releaseInfoToEmployer.text.toLowerCase() === "yes"
                  ? 1
                  : rnToBsn.releaseInfoToEmployer.text.toLowerCase() === "no"
                  ? 2
                  : 3
              }) > label`,
            });
          }
        });
        // END of RN to BSN

        // Other interests

        myProgramContent.interestedInAnything.options.forEach((option) => {
          if (otherInterests.includes(option.text)) {
            otherInterests.push(option.value);
          }
        });
        // selecting the items
        cy.get(
          `[data-cy="my-programs-other-interests-interest-group"] [type="checkbox"]`
        ).check(otherInterests, { force: true });

        // SECTION: handle save button
        cy.handleButton({
          buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
        }).then(() => {
          cy.wait("@notificationIntercept", { timeout: 30000 });
          cy.url(`ug-app/${appId}/my-schools`);
        });
      });
  });
});

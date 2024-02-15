import myProgramContent from "../../../../src/content/my-asu-program.json";
import months from "../../../../src/content/months.json";

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
    cy.readFile(`cypress/config/smoke-testing/my-programs.json`).then(
      (data) => (config = data)
    );
    cy.readFile(`cypress/config/constants.json`).then(({ testCaseTypes }) => {
      testCaseType = testCaseTypes.smokeTesting;
    });
  });

  it("populate userdetails and vist my programs page", () => {
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

  it("Reset the page details", () => {
    // Intercept config get calls
    cy.interceptConfigGetCalls();
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(appId, "ug-app-my-information", "ug-app-my-program");

    cy.login(userDetails.email, userDetails.password);

    cy.visit(`ug-app/${appId}/my-program`);

    cy.get("[data-cy=my-programs-view]", {
      timeout: 30000,
    }).should("be.visible");

    cy.ugApplicationStore().then((ugAppStore) => {
      // deleting if any programs are already saved
      cy.resetProgramsPage(ugAppStore, access_token, appId).then(() => {
        cy.populateUserDetails(appId, access_token, testCaseType);
      });
    });
  });
});

describe("Programs search/filter/contact us functionality testing", () => {
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);
    // intercept Ui view info GET call
    cy.interceptUiViewInfo(appId, "ug-app-my-information", "ug-app-my-program");

    cy.visit(`ug-app/${appId}/my-program`);

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
  });
  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("handle search filter", () => {
    cy.get("[data-cy=my-programs-view]", {
      timeout: 30000,
    }).should("be.visible");
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();

    cy.get("[data-cy='my-programs-filters-search-input']").type("Accountancy");
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
    cy.get("[data-cy='my-programs-filters-search-input'] ").clear();

    cy.get("[data-cy='my-programs-filters-search-input']").type("Chemistry");
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
    cy.get("[data-cy='my-programs-filters-search-input'] ").clear();

    cy.get("[data-cy='my-programs-filters-search-input']").type("Business");
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
    cy.get("[data-cy='my-programs-filters-search-input'] ").clear();

    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
  });

  it("handle interest area filter", () => {
    cy.get("[data-cy=my-programs-view]", {
      timeout: 30000,
    }).should("be.visible");
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();

    cy.get("div.my-space-xs span").click();
    cy.get(
      "[data-cy='my-programs-program-filters'] div:nth-of-type(1) > label"
    ).click();
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
    cy.get(
      "[data-cy='my-programs-program-filters'] div:nth-of-type(1) > label"
    ).click();

    cy.get(
      "[data-cy='my-programs-program-filters'] div:nth-of-type(6) > label"
    ).click();
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
    cy.get(
      "[data-cy='my-programs-program-filters'] div:nth-of-type(6) > label"
    ).click();

    cy.get(
      "[data-cy='my-programs-program-filters'] div:nth-of-type(15) > label"
    ).click();
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
    cy.get(
      "[data-cy='my-programs-program-filters'] div:nth-of-type(15) > label"
    ).click();

    cy.get(
      "[data-cy='my-programs-program-filters'] div:nth-of-type(20) > label"
    ).click();
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
    cy.get(
      "[data-cy='my-programs-program-filters'] div:nth-of-type(20) > label"
    ).click();

    cy.get("div.my-space-xs span").click();

    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
  });

  it("handle college filter", () => {
    cy.get("[data-cy=my-programs-view]", {
      timeout: 30000,
    }).should("be.visible");
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();

    cy.get(
      "[data-cy='my-programs-program-filters'] > div > div:nth-of-type(4) span"
    ).click();

    cy.get(
      "[data-cy='my-programs-program-filters'] div:nth-of-type(1) > label"
    ).click();
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
    cy.get(
      "[data-cy='my-programs-program-filters'] div:nth-of-type(1) > label"
    ).click();

    cy.get("div:nth-of-type(6) > label").click();
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
    cy.get("div:nth-of-type(6) > label").click();

    cy.get("div:nth-of-type(8) > label").click();
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
    cy.get("div:nth-of-type(8) > label").click();

    cy.get("div:nth-of-type(12) > label").click();
    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
    cy.get("div:nth-of-type(12) > label").click();

    cy.get(
      "[data-cy='my-programs-program-filters'] > div > div:nth-of-type(4) span"
    ).click();

    cy.get("[data-cy='my-programs-total-programs-length']").snapshot();
  });

  it("handle contact us", () => {
    cy.get("[data-cy=my-programs-view]", {
      timeout: 30000,
    }).should("be.visible");
    // Contact us link
    cy.get("[data-cy='my-programs-contact-us-text'] a").click();
    // Select an option
    cy.get(
      "main [data-cy='form-need-help-support-options-group'] > div > div:nth-of-type(1) [data-cy='support-option-text']"
    ).click();
    // Input textarea
    cy.get("main [data-cy='additional-comments-textarea']").type("TEST");
    // Submit button
    cy.get("main [data-cy='submit-help-request-button']").click();
    // Back button
    cy.get(
      "[data-cy='my-programs-need-help-sedebar'] > div > div.px-space-sm span"
    ).click();
  });
});

describe("Scenario based Program of interests selection.", () => {
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);

    cy.interceptUiViewInfo(appId, "ug-app-my-information", "ug-app-my-program");

    // Intercept config get calls
    cy.interceptConfigGetCalls();
    cy.stubUserPopulateDetails(appId, testCaseType);
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/programsofinterest`,
      {
        code: 200,
      }
    ).as("postProgramOfInterest");
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/sarquestionresponses/*`,
      {
        code: 201,
      }
    ).as("postSarQuestions");

    cy.visit(`ug-app/${appId}/my-program`);
  });

  afterEach(() => {
    cy.ugApplicationStore().then((ugAppStore) => {
      ugAppStore.updateCurrentPageUnsavedChanges(false);
    });
  });

  it("First choice low priority program", () => {
    const { firstChoiceLowPriorityProgram } = config;
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");

    cy.get("[data-cy=my-programs-view]", {
      timeout: 30000,
    }).should("be.visible");
    cy.get("[data-cy='my-programs-program-filters']").should("be.visible");
    // save button click
    cy.handleButton({
      buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
    });
    // checkig if the select first choice program alert is visible
    cy.get("[data-cy='select-first-choice-program-alert']")
      .should("be.visible")
      .contains("Please select a program.");
    // selecting first choice program
    cy.get("[data-cy='my-programs-filters-search-input']").type(
      firstChoiceLowPriorityProgram.title,
      { force: true }
    );
    cy.handleButton({
      buttonSelector:
        "[data-cy='my-programs-filtered-programs'] > div:nth-of-type(1) [data-cy='my-programs-view-details-button']",
    });
    cy.get("[data-cy='my-programs-programs-details-sidebar']").contains(
      firstChoiceLowPriorityProgram.title
    );
    // my-programs-programs-details-sidebar-back-button
    // close button
    cy.handleButton({
      buttonSelector:
        "[data-cy='my-programs-programs-details-sidebar-back-button']",
    });
    // selecting the program
    cy.handleButton({
      buttonSelector:
        "[data-cy='my-programs-filtered-programs'] > div:nth-of-type(1) [data-cy='my-programs-choose-program-button']",
    });
    // next
    cy.handleButton({
      buttonSelector:
        "[data-cy='my-programs-confirm-program-modal-save-button']",
    });
    // checking if the error message is visible
    cy.get(
      `[data-cy='my-programs-confirm-program-modal-select-date-group'] div.invalid-feedback`
    ).should("be.visible");
    // term
    cy.get(
      `[data-cy='my-programs-confirm-program-modal-select-date-group'] [type="radio"]`
    ).check(firstChoiceLowPriorityProgram.term, { force: true });
    // checking if the error message is gone
    cy.get(
      `[data-cy='my-programs-confirm-program-modal-select-date-group']`
    ).not(".invalid-feedback");
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

    // checking if the selected program is visible
    cy.get("[data-cy='my-programs-selected-program']").should("have.length", 1);
    // checking the title
    cy.get("[data-cy='my-programs-selected-program']")
      .first()
      .find(`[data-cy="my-programs-program-title"]`)
      .contains(firstChoiceLowPriorityProgram.title);
    // checking the term
    cy.get("[data-cy='my-programs-selected-program']")
      .first()
      .find(`[data-cy="my-programs-program-start-date"]`)
      .contains(firstChoiceLowPriorityProgram.term);

    // checking if high admission alert is displayed
    cy.get("[data-cy='my-programs-view']")
      .find("[data-cy='higher-admission-program-alert']")
      .should("not.exist");
    // checking if program select section is visible
    cy.get("[data-cy='my-programs-view']")
      .find("[data-cy='my-programs-program-filters']")
      .should("not.exist");

    cy.handleButton({
      buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
    }).then(() => {
      cy.wait("@notificationIntercept", { timeout: 30000 });
      cy.url(`ug-app/${appId}/my-schools`);
    });
  });

  it("First choice high priority program", () => {
    const { firstChoiceHighPriorityProgram } = config;
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");

    cy.get("[data-cy=my-programs-view]", {
      timeout: 30000,
    }).should("be.visible");
    cy.get("[data-cy='my-programs-program-filters']").should("be.visible");
    // selecting first choice program
    cy.get("[data-cy='my-programs-filters-search-input']").type(
      firstChoiceHighPriorityProgram.first.title,
      { force: true }
    );
    // selecting the program
    cy.handleButton({
      buttonSelector:
        "[data-cy='my-programs-filtered-programs'] > div:nth-of-type(1) [data-cy='my-programs-choose-program-button']",
    });
    // term
    cy.get(
      `[data-cy='my-programs-confirm-program-modal-select-date-group'] [type="radio"]`
    ).check(firstChoiceHighPriorityProgram.first.term, { force: true });
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
    cy.get("[data-cy='my-programs-selected-program-collapse-button']").click();
    // checking the title
    cy.get(`[data-cy="my-programs-program-title"]`).contains(
      firstChoiceHighPriorityProgram.first.title
    );
    // checking the term
    cy.get(`[data-cy="my-programs-program-start-date"]`).contains(
      firstChoiceHighPriorityProgram.first.term
    );
    // checking if the high admission alert is visible
    cy.get(
      "[data-cy='my-programs-selected-programs-backup-program-card']"
    ).should("be.visible");

    // selecting second choice program
    cy.get("[data-cy='my-programs-filters-search-input']").clear();
    cy.get("[data-cy='my-programs-filters-search-input']").type(
      firstChoiceHighPriorityProgram.second.title,
      { force: true }
    );
    // selecting the program
    cy.handleButton({
      buttonSelector:
        "[data-cy='my-programs-filtered-programs'] > div:nth-of-type(1) [data-cy='my-programs-choose-program-button']",
    });
    // term
    cy.get(
      `[data-cy='my-programs-confirm-program-modal-select-date-group'] [type="radio"]`
    ).check(firstChoiceHighPriorityProgram.second.term, { force: true });
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
    cy.get("[data-cy='my-programs-selected-program']").should("have.length", 2);
    // checking the title of first program
    cy.get("[data-cy='my-programs-selected-program']")
      .first()
      .find(`[data-cy="my-programs-program-title"]`)
      .contains(firstChoiceHighPriorityProgram.first.title);
    // checking the term of first program
    cy.get("[data-cy='my-programs-selected-program']")
      .first()
      .find(`[data-cy="my-programs-program-start-date"]`)
      .contains(firstChoiceHighPriorityProgram.first.term);

    //  checking the title of second program
    cy.get("[data-cy='my-programs-selected-program']")
      .last()
      .find(`[data-cy="my-programs-program-title"]`)
      .contains(firstChoiceHighPriorityProgram.second.title);
    // checking the term of second program
    cy.get("[data-cy='my-programs-selected-program']")
      .last()
      .find(`[data-cy="my-programs-program-start-date"]`)
      .contains(firstChoiceHighPriorityProgram.second.term);

    // save the page
    cy.handleButton({
      buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
    }).then(() => {
      cy.wait("@notificationIntercept", { timeout: 30000 });
      cy.url(`ug-app/${appId}/my-schools`);
    });
  });

  it("RN to BSN program", () => {
    const { rnToBsnProgram } = config;
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");

    cy.get("[data-cy=my-programs-view]", {
      timeout: 30000,
    }).should("be.visible");
    // selecting first choice program
    cy.get("[data-cy='my-programs-filters-search-input']").type(
      rnToBsnProgram.first.title,
      { force: true }
    );
    // selecting the program
    cy.handleButton({
      buttonSelector:
        "[data-cy='my-programs-filtered-programs'] > div:nth-of-type(1) [data-cy='my-programs-choose-program-button']",
    });
    // term
    cy.get(
      `[data-cy='my-programs-confirm-program-modal-select-date-group'] [type="radio"]`
    ).check(rnToBsnProgram.first.term, { force: true });
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
    // selecting second choice program
    cy.get("[data-cy='my-programs-filters-search-input']").clear();
    cy.get("[data-cy='my-programs-filters-search-input']").type(
      rnToBsnProgram.second.title,
      { force: true }
    );
    // selecting the program
    cy.handleButton({
      buttonSelector:
        "[data-cy='my-programs-filtered-programs'] > div:nth-of-type(1) [data-cy='my-programs-choose-program-button']",
    });
    // term
    cy.get(
      `[data-cy='my-programs-confirm-program-modal-select-date-group'] [type="radio"]`
    ).check(rnToBsnProgram.second.term, { force: true });
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

    // checking the RN to BSN section questions are visible
    cy.get("[data-cy='my-programs-rn-to-bsn']").should("be.visible");
    // filling RN to BSN related questions
    // is licensed
    cy.handleRadioButton({
      radioSelector: `[data-cy='my-programs-rn-to-bsn-is-licensed-group'] [data-cy='radio-group'] > div:nth-of-type(${
        rnToBsnProgram.sectionRnToBsn.isLicensed.toLowerCase() === "yes" ? 1 : 2
      }) > label`,
    });
    // license state
    cy.handleBaseSingleSelect({
      selector: `[data-cy="my-programs-rn-to-bsn-licensed-state-group"]`,
      text: rnToBsnProgram.sectionRnToBsn.license.state,
    });
    // license number
    cy.handleBaseInput({
      selector: "[data-cy='my-programs-rn-to-bsn-license-number-group']",
      text: rnToBsnProgram.sectionRnToBsn.license.number,
    });
    // license expiration date
    // month
    cy.handleBaseSingleSelect({
      selector: `[data-cy="my-programs-rn-to-bsn-license-expiration-date-group"] #license_expiration_month_select`,
      text: rnToBsnProgram.sectionRnToBsn.license.expirationDate.month,
    });
    // day
    cy.handleBaseSingleSelect({
      selector: `[data-cy="my-programs-rn-to-bsn-license-expiration-date-group"] #license_expiration_day_select`,
      text: rnToBsnProgram.sectionRnToBsn.license.expirationDate.day,
    });
    // year
    cy.handleBaseSingleSelect({
      selector: `[data-cy="my-programs-rn-to-bsn-license-expiration-date-group"] #license_expiration_year_select`,
      text: rnToBsnProgram.sectionRnToBsn.license.expirationDate.year,
    });
    // Is your license encumbered
    cy.handleRadioButton({
      radioSelector: `[data-cy='my-programs-rn-to-bsn-license-disciplinary-action-group'] [data-cy='radio-group'] > div:nth-of-type(${
        rnToBsnProgram.sectionRnToBsn.license.disciplinaryActionTaken.toLowerCase() ===
        "yes"
          ? 1
          : 2
      }) > label`,
    });
    // Date scheduled to take NCLEX-RN
    // month
    cy.handleBaseSingleSelect({
      selector: `[data-cy="my-programs-rn-to-bsn-date-scheduled-for-nclexrn-group"] #nclex_rn_month_select`,
      text: rnToBsnProgram.sectionRnToBsn.dateScheduledForNclexrn.month,
    });
    // day
    cy.handleBaseSingleSelect({
      selector: `[data-cy="my-programs-rn-to-bsn-date-scheduled-for-nclexrn-group"] #nclex_rn_day_select`,
      text: rnToBsnProgram.sectionRnToBsn.dateScheduledForNclexrn.day,
    });
    // year
    cy.handleBaseSingleSelect({
      selector: `[data-cy="my-programs-rn-to-bsn-date-scheduled-for-nclexrn-group"] #nclex_rn_year_select`,
      text: rnToBsnProgram.sectionRnToBsn.dateScheduledForNclexrn.year,
    });
    // Employer
    cy.handleBaseInput({
      selector: "[data-cy='my-programs-rn-to-bsn-employer-group']",
      text: rnToBsnProgram.sectionRnToBsn.employer,
    });
    // partner code
    cy.handleBaseInput({
      selector: "[data-cy='my-programs-rn-to-bsn-partner-code-group']",
      text: rnToBsnProgram.sectionRnToBsn.partnerCode || "",
    });
    // I authorize ASU to release my name and graduation information to my employer.
    cy.handleRadioButton({
      radioSelector: `[data-cy='my-programs-rn-to-bsn-release_info_to_employer_group'] [data-cy='radio-group'] > div:nth-of-type(${
        rnToBsnProgram.sectionRnToBsn.releaseInfoToEmployer.toLowerCase() ===
        "yes"
          ? 1
          : 2
      }) > label`,
    });
    // Arizona Community Colleges
    cy.handleBaseSingleSelect({
      selector: `[data-cy="my-programs-rn-to-bsn-community-college-group"]`,
      text: rnToBsnProgram.sectionRnToBsn.communityColleges,
    });
    // Reverse Transfer Agreement?
    cy.handleRadioButton({
      radioSelector: `[data-cy='my-programs-rn-to-bsn-reverse-transfer-group'] [data-cy='radio-group'] > div:nth-of-type(${
        rnToBsnProgram.sectionRnToBsn.releaseInfoToEmployer.toLowerCase() ===
        "yes"
          ? 1
          : rnToBsnProgram.sectionRnToBsn.releaseInfoToEmployer.toLowerCase() ===
            "no"
          ? 2
          : 3
      }) > label`,
    });
    // save the page
    cy.handleButton({
      buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
    }).then(() => {
      cy.wait("@notificationIntercept", { timeout: 30000 });
      cy.url(`ug-app/${appId}/my-schools`);
    });
  });

  it("other interests", () => {
    const { otherInterests } = config;
    cy.intercept(
      "POST",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/push/SalesforceEdPlus`
    ).as("notificationIntercept");

    cy.get("[data-cy=my-programs-view]", {
      timeout: 30000,
    }).should("be.visible");
    cy.get("[data-cy='my-programs-program-filters']").should("be.visible");
    // selecting first choice program
    cy.get("[data-cy='my-programs-filters-search-input']").type(
      otherInterests.firstChoiceProgram.title,
      { force: true }
    );
    // selecting the program
    cy.handleButton({
      buttonSelector:
        "[data-cy='my-programs-filtered-programs'] > div:nth-of-type(1) [data-cy='my-programs-choose-program-button']",
    });
    // term
    cy.get(
      `[data-cy='my-programs-confirm-program-modal-select-date-group'] [type="radio"]`
    ).check(otherInterests.firstChoiceProgram.term, { force: true });
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
    cy.get("[data-cy='my-programs-selected-program']").should("have.length", 1);
    //other interests
    let interests = [];
    myProgramContent.interestedInAnything.options.forEach((option) => {
      if (otherInterests.interests.includes(option.text)) {
        interests.push(option.value);
      }
    });
    // selecting the items
    cy.get(
      `[data-cy="my-programs-other-interests-interest-group"] [type="checkbox"]`
    ).check(interests, { force: true });
    cy.get(
      "[data-cy='my-programs-other-interests-interest-group'] :checked"
    ).should("have.length", interests.length);

    cy.get(
      "[data-cy='my-programs-other-interests-interest-group'] :checked"
    ).each(($input, index) => {
      if (!interests.includes($input.val())) {
        throw new Error("other interests error!");
      }
    });
    // save the page
    cy.handleButton({
      buttonSelector: '[data-cy="up-app-desktop-footer-save-button"]',
    }).then(() => {
      cy.wait("@notificationIntercept", { timeout: 30000 });
      cy.url(`ug-app/${appId}/my-schools`);
    });
  });

  it("Two way binding testing", () => {
    const { twoWayBinding } = config;
    // intercept program of interest and SAR answers API
    cy.intercept(
      "GET",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/programsofinterest`,
      (req) => {
        // Modify the request or response as needed
        req.reply(twoWayBinding.programOfInterests);
      }
    ).as("getProgramOfInterests");
    cy.intercept(
      "GET",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/sarquestionresponses`,
      (req) => {
        // Modify the request or response as needed
        req.reply(twoWayBinding.sarQuestions);
      }
    ).as("getSarQuestions");
    cy.ugApplicationStore().then((ugAppStore) => {
      cy.get("[data-cy=my-programs-view]", {
        timeout: 30000,
      })
        .should("be.visible")
        .then(() => {
          // // populating the details into store
          // ugAppStore.programOfInterests = twoWayBinding.programOfInterests;
          // ugAppStore.myAsuProgramSar = twoWayBinding.sarQuestions;
          cy.get("[data-cy='my-programs-selected-program']").should(
            "have.length",
            ugAppStore.programOfInterests.length
          );
          // checking first program
          // checking the title
          cy.get("[data-cy='my-programs-selected-program']")
            .first()
            .find(`[data-cy="my-programs-program-title"]`)
            .contains(ugAppStore.programOfInterests[0].title);
          // checking the term
          cy.get("[data-cy='my-programs-selected-program']")
            .first()
            .find(`[data-cy="my-programs-program-start-date"]`)
            .contains(ugAppStore.programOfInterests[0].startTerm);
          // checking the second program
          cy.get("[data-cy='my-programs-selected-program']")
            .last()
            .find(`[data-cy="my-programs-program-title"]`)
            .contains(ugAppStore.programOfInterests[1].title);
          // checking the term
          cy.get("[data-cy='my-programs-selected-program']")
            .last()
            .find(`[data-cy="my-programs-program-start-date"]`)
            .contains(ugAppStore.programOfInterests[1].startTerm);

          // RN to BSN Questions
          // is licensed
          cy.get("[data-cy='my-programs-rn-to-bsn-is-licensed-group'] :checked")
            .should("be.checked")
            .and("have.value", ugAppStore.myAsuProgramSar.rnToBsn.isLicensed);
          // state
          cy.configStore().then((configStore) => {
            const state = configStore.statesLicensedtoPracticeRN.filter(
              (item) =>
                item.value === ugAppStore.myAsuProgramSar.rnToBsn.license.state
            );

            cy.get(
              "[data-cy='my-programs-rn-to-bsn-licensed-state-group'] .vs__selected"
            ).contains(state[0].text);
          });
          // RN license number
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-license-number-group'] input"
          ).should(
            "have.value",
            ugAppStore.myAsuProgramSar.rnToBsn.license.number
          );
          // License expiration date
          // month
          const expirationMonth = months.filter(
            (item) =>
              item.value ===
              ugAppStore.myAsuProgramSar.rnToBsn.license.expirationDate.substring(
                5,
                7
              )
          );
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-license-expiration-date-group'] #license_expiration_month_select .vs__selected"
          ).contains(expirationMonth[0].text);
          // day
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-license-expiration-date-group'] #license_expiration_day_select .vs__selected"
          ).contains(
            ugAppStore.myAsuProgramSar.rnToBsn.license.expirationDate.substring(
              8,
              10
            )
          );
          // year
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-license-expiration-date-group'] #license_expiration_year_select .vs__selected"
          ).contains(
            ugAppStore.myAsuProgramSar.rnToBsn.license.expirationDate.substring(
              0,
              4
            )
          );
          // disciplinary action
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-license-disciplinary-action-group'] :checked"
          )
            .should("be.checked")
            .and(
              "have.value",
              ugAppStore.myAsuProgramSar.rnToBsn.license.disciplinaryActionTaken
            );
          // Date scheduled to take NCLEX-RN
          // month
          const NCLEXMonth = months.filter(
            (item) =>
              item.value ===
              ugAppStore.myAsuProgramSar.rnToBsn.dateScheduledForNclexrn.substring(
                5,
                7
              )
          );
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-date-scheduled-for-nclexrn-group'] #nclex_rn_month_select .vs__selected"
          ).contains(NCLEXMonth[0].text);
          // day
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-date-scheduled-for-nclexrn-group'] #nclex_rn_day_select .vs__selected"
          ).contains(
            ugAppStore.myAsuProgramSar.rnToBsn.dateScheduledForNclexrn.substring(
              8,
              10
            )
          );
          // year
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-date-scheduled-for-nclexrn-group'] #nclex_rn_year_select .vs__selected"
          ).contains(
            ugAppStore.myAsuProgramSar.rnToBsn.dateScheduledForNclexrn.substring(
              0,
              4
            )
          );
          // employer
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-employer-group'] input"
          ).should("have.value", ugAppStore.myAsuProgramSar.rnToBsn.employer);
          // partnercode
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-partner-code-group'] input"
          ).should(
            "have.value",
            ugAppStore.myAsuProgramSar.rnToBsn.partnerCode
          );
          // I authorize ASU to release my name and graduation information to my employer.
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-release_info_to_employer_group'] :checked"
          )
            .should("be.checked")
            .and(
              "have.value",
              ugAppStore.myAsuProgramSar.rnToBsn.releaseInfoToEmployer
            );
          // Arizona Community Colleges

          const college =
            myProgramContent.rnToBsn.communityCollege.options.filter(
              (item) =>
                item.value ===
                ugAppStore.myAsuProgramSar.rnToBsn.communityColleges
            );
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-community-college-group'] .vs__selected"
          ).contains(college[0].text);

          // Reverse Transfer Agreement?
          cy.get(
            "[data-cy='my-programs-rn-to-bsn-reverse-transfer-group'] :checked"
          )
            .should("be.checked")
            .and(
              "have.value",
              ugAppStore.myAsuProgramSar.rnToBsn.reverseTransferAggrement
            );
          // other interests
          let otherInterests = [];
          Object.keys(ugAppStore.myAsuProgramSar.otherInterests).forEach(
            (key) => {
              if (ugAppStore.myAsuProgramSar.otherInterests[key] === "Y") {
                otherInterests.push(key);
              }
            }
          );
          cy.get(
            "[data-cy='my-programs-other-interests-interest-group'] :checked"
          ).each(($input, index) => {
            if (!otherInterests.includes($input.val())) {
              throw new Error("other interests error!");
            }
          });
        });
    });
  });
});

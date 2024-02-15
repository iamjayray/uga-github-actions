let access_token = null;
let userDetails = null;
let appId = null;

describe("My Profile Edit phone number Tests", () => {
  before(() => {
    cy.fixture("users").then((users) => {
      userDetails = users[1];
      // Login
      cy.login(userDetails.email, userDetails.password);
      cy.getCookie("access_token").then((item) => {
        access_token = item.value;
        cy.populateUgApplications(access_token).then((response) => {
          if (response.data.length > 0) {
            appId = response.data[0].appId;
          }
        });
      });
    });
  });
  beforeEach(() => {
    // Login
    cy.login(userDetails.email, userDetails.password);

    cy.visit(`/profile/edit-phone-number`);

    // intercepts
    cy.intercept(
      "PUT",
      `${Cypress.env("baseUrl")}/api/ug/applications/${appId}/phones/*`,
      (req) => {
        req.reply({
          code: 200,
          data: {
            phoneId: req.body.phoneType === "MAIN" ? "1" : "2",
            areaCode: req.body.areaCode,
            phoneNumber: req.body.phoneNumber,
            phoneType: req.body.phoneType,
            countryCode: req.body.countryCode,
          },
        });
      }
    ).as("phones");
  });

  it("Verifying the all the fields are pre filled on the page", () => {
    cy.get("[data-cy='profile-edit-phone-number-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.userStore().then((userStore) => {
          // main phone number
          cy.get(
            '[data-cy="profile-edit-phone-number-main-phone"] .input-phone-number input'
          ).should("not.be.null");

          const mainPhone = userStore.phone("MAIN");
          const mobilePhone = userStore.phone("MOBILE");
          const isBothNumbersSame =
            mainPhone.phoneNumber === mobilePhone?.phoneNumber &&
            mainPhone.areaCode === mobilePhone?.areaCode &&
            mainPhone.countryCode === mobilePhone?.countryCode;

          // Is this a mobile number?
          cy.get(
            '[data-cy="profile-edit-phone-number-is-a-mobile-number"] :checked'
          )
            .should("be.checked")
            .and("have.value", isBothNumbersSame ? "Y" : "N");

          // Mobile phone
          if (!isBothNumbersSame && mobilePhone) {
            cy.get(
              '[data-cy="profile-edit-phone-number-mobile-phone"] .input-phone-number input'
            ).should("not.be.null");
          }
          // stay engagde via SMS
          cy.get(
            '[data-cy="profile-edit-phone-number-receive-info-via-sms"] :checked'
          )
            .should("be.checked")
            .and("have.value", userStore.receiveInfoBySMS);
          // save and calcel buttons
          cy.get('[data-cy="profile-edit-phone-number-submit-button"]')
            .should("be.visible")
            .contains("Save");
          cy.get('[data-cy="profile-edit-phone-number-cancel-button"]')
            .should("be.visible")
            .contains("Cancel");
        });
      });
  });

  it("Updating the values with non us countries with main phona as mobile number", () => {
    cy.get("[data-cy='profile-edit-phone-number-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        // mobile phone number
        // entering a incorrect number to check if error is populated
        cy.handleBasePhoneNumberInput({
          selector: "[data-cy='profile-edit-phone-number-main-phone']",
          country: "Australia",
          phoneNumber: "4127",
          required: false,
        });
        cy.get(
          "[data-cy='profile-edit-phone-number-main-phone'] div.invalid-feedback"
        )
          .should("be.visible")
          .contains("Enter a valid phone number.");
        // entering a valid number
        cy.handleBasePhoneNumberInput({
          selector: "[data-cy='profile-edit-phone-number-main-phone']",
          country: "Australia",
          phoneNumber: "412345678",
          required: false,
        });
        // selecting is mobile number to Yes
        cy.get(
          `[data-cy='profile-edit-phone-number-is-a-mobile-number'] [type="radio"]`
        ).check("Y");
        // verifying mobile number field is not visible
        cy.get("body")
          .find('[data-cy="profile-edit-phone-number-mobile-phone"]')
          .should("not.exist");
        // setting receive info by SMS to Yes
        cy.get(
          `[data-cy='profile-edit-phone-number-receive-info-via-sms'] [type="radio"]`
        ).check("Y");
        // click on save
        cy.get('[data-cy="profile-edit-phone-number-submit-button"]').click();
        // checking if the user is landed on profile
        cy.url().should("include", "/profile");
      });
  });

  it("Failing the SAR api and checking if the error message is displayed", () => {
    cy.intercept(
      "PUT",
      `${Cypress.env(
        "baseUrl"
      )}/api/ug/applications/${appId}/sarquestionresponses/*`,
      {
        code: 500,
        errors: ["Error while saving the details."],
      }
    ).as("sarquestionIntercept");
    cy.get("[data-cy='profile-edit-phone-number-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.userStore().then((userStore) => {
          // updating the receive info by SMS
          cy.get(
            `[data-cy='profile-edit-phone-number-receive-info-via-sms'] [type="radio"]`
          ).check(userStore.receiveInfoBySMS === "Y" ? "N" : "Y");
          // click on save
          cy.get('[data-cy="profile-edit-phone-number-submit-button"]').click();

          // checking if the URL is still edit phone number
          cy.url().should("include", "/profile/edit-phone-number");

          // checking if the alert is visible
          cy.get('[data-cy="profile-edit-phone-number-alert"]')
            .should("be.visible")
            .contains("Error while saving the details.");
        });
      });
  });

  it("US/CA valid phone number briteverify testing", () => {
    cy.intercept(
      "POST",
      `https://bpi.briteverify.com/api/public/v1/fullverify`,
      (req) => {
        req.reply({
          phone: {
            number: req.body.phone,
            service_type: "land",
            phone_location: "business",
            status: "valid",
            errors: [],
          },
        });
      }
    ).as("briteverifyIntercept");
    cy.get("[data-cy='profile-edit-phone-number-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        // main phone number
        cy.handleBasePhoneNumberInput({
          selector: "[data-cy='profile-edit-phone-number-main-phone']",
          country: "United States",
          phoneNumber: "4804804800",
          required: false,
        });
        // selecting is mobile number to Yes
        cy.get(
          `[data-cy='profile-edit-phone-number-is-a-mobile-number'] [type="radio"]`
        ).check("N");
        // Mobile phone number
        cy.handleBasePhoneNumberInput({
          selector: "[data-cy='profile-edit-phone-number-mobile-phone']",
          country: "Canada",
          phoneNumber: "5062345679",
          required: false,
        });
        // click on save
        cy.get('[data-cy="profile-edit-phone-number-submit-button"]').click();
        // verifying modal is not visible
        cy.get("body")
          .find(
            '[data-cy="profile-update-phone-number-briteverify-alert-modal"]'
          )
          .should("not.exist");
        // checking if the user is landed on profile
        cy.url().should("include", "/profile");
      });
  });

  it("US/CA invalid phone number briteverify testing", () => {
    cy.intercept(
      "POST",
      `https://bpi.briteverify.com/api/public/v1/fullverify`,
      (req) => {
        req.reply({
          phone: {
            number: req.body.phone,
            service_type: "land",
            phone_location: "business",
            status: "invalid",
            errors: [],
          },
        });
      }
    ).as("briteverifyIntercept");
    cy.get("[data-cy='profile-edit-phone-number-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        // main phone number
        cy.handleBasePhoneNumberInput({
          selector: "[data-cy='profile-edit-phone-number-main-phone']",
          country: "United States",
          phoneNumber: "4804804800",
          required: false,
        });
        // selecting is mobile number to Yes
        cy.get(
          `[data-cy='profile-edit-phone-number-is-a-mobile-number'] [type="radio"]`
        ).check("N");
        // Mobile phone number
        cy.handleBasePhoneNumberInput({
          selector: "[data-cy='profile-edit-phone-number-mobile-phone']",
          country: "Canada",
          phoneNumber: "5062345679",
          required: false,
        });
        // click on save
        cy.get('[data-cy="profile-edit-phone-number-submit-button"]').click();
        // verifying modal is not visible
        cy.get(
          '[data-cy="profile-update-phone-number-briteverify-alert-modal"]'
        ).should("be.visible");

        cy.get(
          '[data-cy="profile-update-phone-number-briteverify-alert-modal-heading"]'
        ).should(
          "contain",
          "The phone number you entered could not be verified:"
        );
        // checking the address details
        cy.get(
          '[data-cy="my-profile-phone-number-update-briteverify-alert-modal-phone-table"]'
        )
          .children()
          .should("contain", "Phone number")
          .and("contain", `4804804800`)
          .and("contain", "Mobile phone")
          .and("contain", `5062345679`);

        // checking submit and Go back and change buttons are visible
        cy.get(
          "[data-cy='profile-update-phone-number-briteverify-alert-modal-back-button']"
        ).should("be.visible");
        cy.get(
          "[data-cy='profile-update-phone-number-briteverify-alert-modal-submit-button']"
        ).should("be.visible");

        // submitting from the modal
        cy.get(
          "[data-cy='profile-update-phone-number-briteverify-alert-modal-submit-button']"
        ).click();

        // checking if the user is landed on profile
        cy.url().should("include", "/profile");
      });
  });
});

let access_token = null;
let appId = null;

describe("My Profile Edit Preferred First Name Tests", () => {
  before(() => {
    cy.fixture("users").then((users) => {
      // Login
      cy.login(users[1].email, users[1].password);
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
    cy.fixture("users").then((users) => {
      // Login
      cy.login(users[1].email, users[1].password);

      cy.visit(`/profile`);
    });
  });

  it("Verifying the all the fields are displayed on the page", () => {
    cy.get("[data-cy='profile-index-view']", {
      timeout: 20000,
    })
      .should("be.visible")
      .then(() => {
        cy.userStore().then((userStore) => {
          cy.appStore().then((appStore) => {
            cy.get("[data-cy='profile-index-user-info']").contains(
              "Applicant profile"
            );
            cy.get("[data-cy='profile-index-user-info'] #user_name").contains(
              userStore.formattedFullName
            );
            cy.get("[data-cy='profile-index-user-info'] #user_app_id").contains(
              appStore.selectedUndergradApplicationId
            );

            // personal information
            cy.get("[data-cy='profile-index-legal-name']").contains(
              "Legal name"
            );
            cy.get("[data-cy='profile-index-legal-name']").contains(
              userStore.legalFullName
            );

            cy.get("[data-cy='profile-index-preferred-first-name']").contains(
              "Preferred first name "
            );
            cy.get("[data-cy='profile-index-preferred-first-name']").contains(
              userStore.preferredFirstName
                ? userStore.preferredFirstName
                : "Add one"
            );

            cy.get("[data-cy='profile-index-birthday']").contains("Birthday");
            cy.get("[data-cy='profile-index-birthday']").contains(
              userStore.formattedDob
            );

            cy.get("[data-cy='profile-index-pronouns']").contains("Pronouns");
            cy.get("[data-cy='profile-index-pronouns']").contains(
              userStore.pronouns.length > 0
                ? userStore.pronouns[0].pronoun
                : "Select"
            );

            cy.get("[data-cy='profile-index-gender-identity']").contains(
              "Gender identity"
            );
            cy.get("[data-cy='profile-index-gender-identity']").contains(
              userStore.genders.length > 0
                ? userStore.genders[0].genderIdentity
                : "Select"
            );

            // Account Information

            cy.get("[data-cy='profile-index-account-info']").contains(
              "Account Information"
            );

            cy.get("[data-cy='profile-index-account-info-email']").contains(
              "Email"
            );
            cy.get("[data-cy='profile-index-account-info-email']").contains(
              userStore.email
            );

            cy.get("[data-cy='profile-index-account-info-password']").contains(
              "Password"
            );
            cy.get("[data-cy='profile-index-account-info-password']").contains(
              "Reset password"
            );

            const mainPhone = userStore.phone("MAIN");
            cy.get(
              "[data-cy='profile-index-account-info-main-phone-number']"
            ).contains("Phone number");
            cy.get(
              "[data-cy='profile-index-account-info-main-phone-number']"
            ).contains(
              mainPhone
                ? `${mainPhone.areaCode ? `+1${mainPhone.areaCode}` : ""}${
                    mainPhone.phoneNumber
                  }`
                : "N/A"
            );
            const mobilePhone = userStore.phone("MOBILE");
            let isMobilePhoneVisible =
              !mobilePhone ||
              mainPhone.areaCode !== mobilePhone.areaCode ||
              mainPhone.phoneNumber !== mobilePhone.phoneNumber;

            if (isMobilePhoneVisible) {
              cy.get(
                "[data-cy='profile-index-account-info-mobile-phone-number']"
              ).contains("Mobile phone number");
              cy.get(
                "[data-cy='profile-index-account-info-mobile-phone-number']"
              ).contains(
                mobilePhone
                  ? `${
                      mobilePhone.areaCode ? `+1${mobilePhone.areaCode}` : ""
                    }${mobilePhone.phoneNumber}`
                  : "N/A"
              );
            }

            cy.get(
              "[data-cy='profile-index-account-info-receive-info-by-sms']"
            ).contains("Want to stay engaged with ASU via SMS messaging");
            cy.get(
              "[data-cy='profile-index-account-info-receive-info-by-sms']"
            ).contains(
              !userStore.receiveInfoBySMS
                ? "N/A"
                : userStore.receiveInfoBySMS === "Y"
                ? "Yes"
                : "No"
            );

            // return to dashboard
            cy.get('[data-cy="profile-index-return-to-dashboard-cta"]')
              .contains("Return to dashboard")
              .click();
            cy.url().should("include", "/dashboard");
          });
        });
      });
  });
});

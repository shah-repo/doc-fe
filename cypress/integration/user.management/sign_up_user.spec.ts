// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import { CONFIG } from "../../support/config";
import { NavigationItems } from "../../utils/constants/navigationItems";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginFirst;

const nameOfUserToSignUp = faker.name.findName();
const emailOfUserToSignUp = `enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`;

context("Sign up user flow", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login company admin", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Start sign a user flow", () => {
    it("Navigate to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    it("Click 'ADD EMPLOYEE'", () => {
      cy.usrClickAddEmployee();
    });

    context("Fill in user attributes", () => {
      it("Enters e-mail", () => {
        SystemRequirement("REQ-3940");
        cy.usrEnterEmail({ email: emailOfUserToSignUp });
      });

      it("Enters name", () => {
        cy.usrEnterName({ name: nameOfUserToSignUp });
      });
    });

    context("Create user", () => {
      it("Clicks the save button", () => {
        cy.usrClickSaveButton();
        cy.checkToastMessage({ exists: false });
        cy.wait(10000);
      });
    });
  });

  context("Activate user", () => {
    it("Verify activation email", () => {
      SystemRequirement("REQ-4110");
      cy.imapGetActivationLink({ userEmail: emailOfUserToSignUp });
    });

    it("Enter password", () => {
      SystemRequirement("REQ-4110");
      cy.authEnterSignUpPassword();
    });

    it("Enter password for confirmation", () => {
      SystemRequirement("REQ-4110");
      cy.authEnterSignUpConfirmPassword();
    });

    it("Click 'SIGN IN'", () => {
      SystemRequirement("REQ-4110");
      cy.authClickSignIn();
    });

    it("Verify user is loged in", () => {
      cy.navigListExistsCheck(
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_CONTROL);
    });
  });

  context("Log out and sign in again", () => {
    it("Logout", () => {
      cy.authLogout();
    });

    it("Log user in", () => {
      cy.authLogin({
        email: emailOfUserToSignUp,
      });
    });

    it("Verify user is loged in", () => {
      cy.navigListExistsCheck(
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_CONTROL);
    });
  });
});

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import { NavigationItems } from "../../../src/state/ducks/auth/types";
import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;

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
            importerEmail: USERS[5].email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1;
        done();
      });
    });
  });

  context("Login company admin", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
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
      cy.imapGetActivationLink({ userEmail: emailOfUserToSignUp });
    });

    it("Enter password", () => {
      cy.authEnterSignUpPassword({ password: "Tester1!" });
    });

    it("Enter password for confirmation", () => {
      cy.authEnterSignUpConfirmPassword({ password: "Tester1!" });
    });

    it("Click 'SIGN IN'", () => {
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
        password: "Tester1!",
      });
    });

    it("Verify user is loged in", () => {
      cy.navigListExistsCheck(
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_CONTROL);
    });
  });
});

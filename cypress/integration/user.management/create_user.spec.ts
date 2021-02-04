// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("User Creation Flow", () => {
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

  context("Start add a user flow", () => {
    it("Navigates to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    it("Clicks on 'Add Employee'", () => {
      cy.usrClickAddEmployee();
    });
  });

  context("Fill in user attributes", () => {
    it("Enters e-mail", () => {
      cy.usrEnterEmail({ email: USERS[10].email });
    });

    it("Enters name", () => {
      cy.usrEnterName({ name: USERS[10].name });
    });
  });

  context("Create user", () => {
    it("Clicks the save button", () => {
      cy.usrClickSaveButton();
    });
  });

  context("Check if the user is created", () => {
    it("Clicks on the close button", () => {
      cy.usrClickCloseDialogButton();
    });
    it("Checks if user is in the table", () => {
      SystemRequirement("REQ-2490");
      cy.usrCheckIfUserIsCreated({ email: USERS[10].email });
    });
  });
});

export { };


/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;


context.skip("Document form upgrade", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API]Prepare company", () => {
    it("[API]Create company", (done: any) => {
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
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
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

    it("[API]Create and release form for Record", () => {
    });

    it("[API]Create and release form for Document", () => {
    });
  });

  context("Login user", () => {
    it("Log user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create a record from form", () => {
    it("Navigate to document list", () => {
    });

    it("Select the Record form", () => {
    });

    it("Click on Create New button", () => {
    });

    it("Fill out the required fields", () => {
    });

    it("Save the document", () => {
    });
  });

  context("Create a document from form", () => {
    it("Navigate to document list", () => {
    });

    it("Select the Document form", () => {
    });

    it("Click on Create New button", () => {
    });

    it("Fill out the required fields", () => {
    });

    it("Save the document", () => {
    });
  });

  context("Revise the Record form", () => {
    it("Navigate to document list", () => {
    });

    it("Select the created Record form", () => {
    });

    it("Click on Revise button", () => {
    });

    it("Add a new field to the form", () => {
    });

    it("Approve and release", () => {
    });
  });

  context("Revise the Document form", () => {
    it("Navigate to document list", () => {
    });

    it("Select the created Document form", () => {
    });

    it("Click on Revise button", () => {
    });

    it("Add a new field to the form", () => {
    });

    it("Approve and release", () => {
    });
  });

  context("Upgrade document to new form", () => {
    it("Navigate to document list", () => {
    });

    it("Select document", () => {
    });

    it("Click on upgrade to new form", () => {
    });

    it("Check that new field was added", () => {
    });
  });

  context("Upgrade record to new form", () => {
    it("Navigate to Record list", () => {
    });

    it("Select Record", () => {
    });

    it("Click on upgrade to new form", () => {
    });

    it("Check that new field was added", () => {
    });
  });

  context("Release nd revise the record", () => {
    it("Add approvals", () => {
    });

    it("Submit for an approval", () => {
    });

    it("Approve the record", () => {
    });

    it("Update record", () => {
    });

    it("Check that A.1 version was created", () => {
    });
  });

  context("Check that revised record cannot be upgraded to new form", () => {
    it("Upgrade banner should not exist", () => {
    });
  });
});

export { };

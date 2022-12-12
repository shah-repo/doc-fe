/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let secondEmployee;

context("Export restricted access doc", () => {
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
            documentTypes: [
              ClinicalProtocolDocType,
            ],
            users: [USERS[2], USERS[3], USERS[4]],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
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

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.wait(2000);
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create a Form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "test form" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select User to access", () => {
      cy.get("#securityEmployees").arrowClick();
      cy.get("#securityEmployees").arrowType(`${USERS[3].name}{downarrow}{enter}`);
      cy.unClick();
      cy.get("#securityGroups div[aria-hidden=\"true\"]").eq(0).arrowClick();
    });

    it("Select 'Clinical Protocol' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release the form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });

  context(`Login with ${USERS[2].name}`, () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });
  });

  context("Check restricted access", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the form", () => {
      cy.dlFilterByDocTitle({ docTitle: "test form" });
      cy.dlSelectFirstDocument();
    });

    it("Click 'Send To Email'", () => {
      cy.sendToEmail();
    });

    it("Verify restricted access message", () => {
      cy.checkToastMessageContains({
        message: "You do not have access to this document for sending it to your email.",
      });
    });
  });
});

/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginSecond;

context("Document voiding Flow", () => {
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
            documentTypes: [
              TestDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginSecond = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
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
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: employeeLoginSecond.id });
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects 'Test Document Type' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Test Document Type" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Creates document", () => {
    it("Clicks create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Document in DRAFT", () => {
    it("Checks if document status is DRAFT after creating a document", () => {
      SystemRequirement("REQ-0020");
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Checks if Revison Change Type does not contain OBSOLETE option", () => {
      // cy.get("[data-cy=\"field-revisionStage\"]");
      cy.get("#RevisionTypeChange-obsolete").should("not.exist");
    });

    context("Void Document", () => {
      it("Clicks on VOID button in header menu ", () => {
        SystemRequirement("REQ-2800");
        cy.get("#HeaderMenuButton").arrowClick();
        cy.get("[data-cy=\"void-button\"]").arrowClick();
        cy.get("#AlertDialog-continueButton").arrowClick();
        cy.checkToastMessage({ exists: false });
      });
    });
  });

  context("Document in VOIDED", () => {
    it("Checks if document status is VOIDED after voiding a document", () => {
      SystemRequirement("REQ-0020");
      cy.wait(2000);
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.VOIDED });
    });
  });
});

export { };


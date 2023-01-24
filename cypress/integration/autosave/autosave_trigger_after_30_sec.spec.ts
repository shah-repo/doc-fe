// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLogin;

context.skip("Autosave trigger after 30 sec", () => {
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
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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
            documentTypes: [
              TestDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLogin = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login admin with autosave tigger shown", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLogin.id });
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

  context("Create 'Form' document with output document type 'Test Document Type'", () => {
    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Test Document Type' output document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Test Document Type" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });
  });

  context("Edit description and after 30 sec trigger Autosave", () => {
    it("Edit description with one second delay on typing", () => {
      cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]").clear()
        .type("Type something", { delay: 3000, timeout: 45000 });
    });

    it("Reload document", () => {
      cy.reload();
    });

    it("Check description if correct value was saved after 30 seconds", () => {
      cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]")
        .should("have.text", "Type somet");
    });
  });

  context("Edit Revision Stage after reload page and Autosave should trigger", () => {
    it("Select 'New Document Revision'", () => {
      cy.navigToDocumentList();
      cy.drFilterDocListByNameAndStatus({ title: "New Document Revision", status: "Draft" });
    });

    it("Autosave should trigger after changing Revision Stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Alpha" });
      cy.saveBarShouldNotExist();
    });

    it("Last save should be present", () => {
      cy.contains("Last saved:").should("be.exist");
    });
  });

});

export { };


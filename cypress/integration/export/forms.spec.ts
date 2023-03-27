/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CPExport } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let recordUrl;
let arUrl;

context("Export Form doc", () => {
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
              CPExport,
            ],
            users: [USERS[2], USERS[3], USERS[4]],
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

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create a Form from form", () => {
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
      cy.drEnterDocumentTitle( { name: "Form form" });
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

    it("Select 'Clinical Protocol' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Form with Draft status", () => {
    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Draft", filename: "-1-Form-form", status: STATUS_TYPES_LABEL.DRAFT });
    });
  });

  context("Form with Released status", () => {
    context("Add Form with Released", () => {
      it("Approve and release the form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({ pdfStatus: "Released", filename: "-1-Form-form", status: STATUS_TYPES_LABEL.RELEASED });
      });
    });
  });

  context("Form with Obsolete status", () => {
    it("Revise document with 'Obsolete' option", () => {
      cy.drClickReviseDocument();
      cy.drChooseTypeOfRevisionChangeOption({ option: "Obsolete" });
      cy.drClickSaveWithoutApiCall();
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Obsolete", filename: "-OBS-Form-form", status: STATUS_TYPES_LABEL.OBSOLETE });
    });
  });

  context("Form with Superseded status", () => {
    it("Click on revisions tab on side panel", () => {
      cy.drClickRevisionsSidePanel();
    });

    it("Select 'Superseded' record", () => {
      cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(1).contains("Superseded").arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "Superseded", filename: "-1-Form-form",
        status: STATUS_TYPES_LABEL.SUPERSEDED,
      });
    });
  });

  context("Form with Voided status", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "Form form" });
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

    it("Select 'Clinical Protocol' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
    });

    it("Click Create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Click Void button", () => {
      cy.arVoidAR();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Voided", filename: "-1-Void", status: STATUS_TYPES_LABEL.VOIDED });
    });
  });

  context("Form with Pending Change status", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "Form form" });
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

    it("Select 'Clinical Protocol' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.url().then((url: any) => {
        recordUrl = url;
      });
    });

    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Enter title AR title", () => {
      cy.arEnterApprovalRequestTitle({ title: "test title" });
    });

    it("Enter description", () => {
      cy.arEnterApprovalRequestDescription({ description: "test description" });
    });

    it("Add created document", () => {
      cy.arSelectItemsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arAddItems();
      cy.arSelectItem({ name: "Form form" });
      cy.arEnterItemDescription({ description: "added document description" });
      cy.arEnterItemJustification({ justification: "justification for added document" });
      cy.arClickAddItemDone();
    });

    it("Click Create Approval Request", () => {
      cy.arSaveApiCallWithoutApi();
    });

    it("Add Approver'", () => {
      cy.arSelectApprovalTab();
      cy.arAddApproverOnApproverListWithoutApi({ approver: USERS[1].name, noWait: true });
    });

    it("Click on Save", () => {
      cy.arSaveApiCallWithoutApi();
      cy.url().then((url: any) => {
        arUrl = url;
      });
    });

    it("Navigate to Form", () => {
      cy.visit(recordUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "Pending Change", filename: "-1-Form-form"
        , status: STATUS_TYPES_LABEL.PENDING_CHANGE,
      });
    });
  });

  context("Form with In Review status", () => {
    it("Navigate to AR", () => {
      cy.visit(arUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReviewWithoutApi();
    });

    it("Navigate to Form", () => {
      cy.visit(recordUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "In Review", filename: "-1-Form-form", status: STATUS_TYPES_LABEL.IN_REVIEW });
    });
  });

  context("Form with Approved status", () => {
    it("Navigate to AR", () => {
      cy.visit(arUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Click 'Approve Submission'", () => {
      cy.arApproveARWithoutApi();
    });

    it("Navigate to Form", () => {
      cy.visit(recordUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Approved", filename: "-1-Form-form", status: STATUS_TYPES_LABEL.APPROVED });
    });
  });

});

export { };


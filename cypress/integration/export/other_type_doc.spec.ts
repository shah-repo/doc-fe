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

context("Export Other internal doc", () => {
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
            documentTypes: [
              CPExport,
            ],
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

  context("Create a CP", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on Create New button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "CP form" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Clinical Protocol' document type", () => {
      cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("CP with Draft status", () => {
    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Draft", filename: "-1-CP-form", status: STATUS_TYPES_LABEL.DRAFT });
    });
  });

  context("CP with Released status", () => {
    it("Approve and release the form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Released", filename: "-1-CP-form", status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("CP with Obsolete status", () => {
    it("Revise document with 'Obsolete' option", () => {
      cy.drClickReviseDocument();
      cy.drChooseTypeOfRevisionChangeOption({ option: "Obsolete" });
      cy.drClickCreateDocumentWithoutApiCall();
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Obsolete", filename: "-OBS-CP-form", status: STATUS_TYPES_LABEL.OBSOLETE });
    });
  });

  context("CP with Superseded status", () => {
    it("Select Revision", () => {
      cy.drClickRevisionsSidePanel();
    });

    it("Select 'Superseded' record", () => {
      cy.contains("Superseded").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Superseded", filename: "-1-CP-form", status: STATUS_TYPES_LABEL.SUPERSEDED });
    });
  });

  context("CP with Voided status", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on Create New button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "CP form" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Clinical Protocol' document type", () => {
      cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Save the document", () => {
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

  context("CP with Pending Change status", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on Create New button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "CP form" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Clinical Protocol' document type", () => {
      cy.drSelectDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.url().then((url: any) => {
        recordUrl = url;
      });
    });

    it("Navigate to Approval Request list", () => {
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
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "CP form" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Click Create Approval Request", () => {
      cy.arClickCreateApprovalRequestAfterCompletingForm();
    });

    it("Add Approver'", () => {
      cy.arAddApproverOnApproverList({ approver: USERS[1].name, noWait: true });
    });

    it("Click on Save", () => {
      cy.arSaveApiCall();
      cy.url().then((url: any) => {
        arUrl = url;
      });
    });

    it("Navigate to CP", () => {
      cy.visit(recordUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "Pending Change", filename: "-1-CP-form",
        status: STATUS_TYPES_LABEL.PENDING_CHANGE,
      });
    });
  });

  context("CP with In Review status", () => {
    it("Navigate to AR", () => {
      cy.visit(arUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReview();
    });

    it("Navigate to CP", () => {
      cy.visit(recordUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "In Review", filename: "-1-CP-form", status: STATUS_TYPES_LABEL.IN_REVIEW });
    });
  });

  context("CP with Approved status", () => {
    it("Navigate to AR", () => {
      cy.visit(arUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Approve Submission'", () => {
      cy.arApproveAR();
    });

    it("Navigate to CP", () => {
      cy.visit(recordUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Approved", filename: "-1-CP-form", status: STATUS_TYPES_LABEL.APPROVED });
    });
  });

});

export { };


/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let arUrl;
let damUrl;
let createdCompany;
let loginResponse;
let adminEmployee;

context("Export DAM", () => {
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
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
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
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create DAM", () => {
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
      cy.drEnterDocumentTitle( { name: "DAM form" });
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

    it("Select 'Document Approval Matrix' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Document Approval Matrix" });
      cy.unClick();
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Click 'Create New' button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle({ name: "DAM doc" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });
  });

  context(`DAM with ${STATUS_TYPES_LABEL.VOIDED} status`, () => {

    it("Upload logo picture 'image.jpg'", () => {
      cy.atchOtherUploadAttachment({ fileName: "image.jpg" });
    });

    it("Click Void button", () => {
      cy.arVoidAR();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.VOIDED, filename: "-1-Void", pdfStatus: "Voided" });
    });
  });

  context(`DAM with ${STATUS_TYPES_LABEL.DRAFT} status`, () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the Record inline form", () => {
      cy.dlFilterByDocTitle({ docTitle: "DAM form" });
      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Click 'Create New' button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle({ name: "DAM doc" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("clicks on 'Save' button", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.DRAFT, filename: "-1-DAM-doc", pdfStatus: "Draft" });
    });

    it("navigate to matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
    });
  });

  context(`DAM with ${STATUS_TYPES_LABEL.RELEASED} status`, () => {
    it("Approve and release the form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.RELEASED, filename: "-1-DAM-doc", pdfStatus: "Released" });
    });
  });

  context(`DAM with ${STATUS_TYPES_LABEL.PENDING_CHANGE} status`, () => {
    it("Revise document", () => {
      cy.drClickReviseDocument();
      cy.drClickSaveWithoutApiCall();
      cy.url().then((url: any) => {
        damUrl = url;
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
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "DAM doc" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Click Create Approval Request", () => {
      cy.arSaveApiCallWithoutApi();
    });

    it("Add Approver'", () => {
      cy.arAddApproverOnApproverListWithoutApi({ approver: USERS[1].name, noWait: true });
    });

    it("Click on Save", () => {
      cy.arSaveApiCallWithoutApi();
      cy.url().then((url: any) => {
        arUrl = url;
      });
    });

    it("Navigate to DAM", () => {
      cy.visit(damUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        status: STATUS_TYPES_LABEL.PENDING_CHANGE, filename: "-2-DAM-doc",
        pdfStatus: "Pending Change",
      });
    });
  });

  context(`DAM with ${STATUS_TYPES_LABEL.IN_REVIEW} status`, () => {
    it("Navigate to AR", () => {
      cy.visit(arUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReview();
    });

    it("Navigate to DAM", () => {
      cy.visit(damUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.IN_REVIEW, filename: "-2-DAM-doc", pdfStatus: "In Review" });
    });
  });

  context(`DAM with ${STATUS_TYPES_LABEL.APPROVED} status`, () => {
    it("Navigate to AR", () => {
      cy.visit(arUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Click 'Approve Submission'", () => {
      cy.arApproveARWithoutApi();
    });

    it("Navigate to DAM", () => {
      cy.visit(damUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.APPROVED, filename: "-2-DAM-doc", pdfStatus: "Approved" });
    });
  });

});

export { };


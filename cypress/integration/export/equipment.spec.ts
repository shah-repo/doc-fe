/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let secondEmployee;
let recordDocumentType;
let approvalRequestDocumentType;
let formDocumentType;
let group;
let initialArDocument;
let createdRecordFormDocument;
let recordUrl;
let arUrl;

context("Export Equipment doc", () => {
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
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          recordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
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

    it("[API]Create and release form for Equipment", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: secondEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Equipment form</p>",
              document: {
                docId: "FM-00004",
                documentType: {
                  id: formDocumentType[0].id,
                },
                securityList: {
                  operators: [],
                  securityEmployees: [],
                  securityGroups: [
                    {
                      id: group.body[0].id,
                    },
                  ],
                },
              },
              name: "Equipment form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: recordDocumentType[0].id,
                }],
                schema: [
                  {
                    label: "form.builder.approvals",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-l02u8tzp",
                    uniqueSchemaItem: true,
                    index: 0,
                    tabId: "overview",
                  },
                ],
              },
            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdRecordFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdRecordFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
              },
              employeeId: secondEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create a Equipment from form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the Equipment form", () => {
      cy.dlFilterByDocTitle({ docTitle: "Equipment form" });
      cy.dlSelectFirstDocument();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "Equipment form" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Save the document", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context("Equipment with Draft status", () => {
    it("Verify export", () => {
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.DRAFT, filename: "-1-Equipment-form", pdfStatus: "Draft" });
    });
  });

  context("Equipment with Released status", () => {
    context("Add Equipment with Released", () => {
      it("Approve and release the form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.RELEASED, filename: "-1-Equipment-form",
          pdfStatus: "Released",
        });
      });
    });
  });

  context("Equipment with Obsolete status", () => {
    it("Revise document with 'Obsolete' option", () => {
      cy.drClickReviseDocument();
      cy.drChooseTypeOfRevisionChangeOption({ option: "Obsolete" });
      cy.drClickSaveWithoutApiCall();
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "Obsolete", filename: "-OBS-Equipment-form",
        status: STATUS_TYPES_LABEL.OBSOLETE,
      });
    });
  });

  context("Equipment with Superseded status", () => {
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
        pdfStatus: "Superseded", filename: "-1-Equipment-form",
        status: STATUS_TYPES_LABEL.SUPERSEDED,
      });
    });
  });

  context("Equipment with Voided status", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the Equipment form", () => {
      cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.dlFilterByDocTitle({ docTitle: "Equipment form" });
      cy.dlSelectFirstDocument();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "Equipment form" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Save the document", () => {
      cy.drClickSaveWithoutApiCall();
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

  context("Equipment with Pending Change status", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the Equipment form", () => {
      cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.dlFilterByDocTitle({ docTitle: "Equipment form" });
      cy.dlSelectFirstDocument();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "Equipment form" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Save the document", () => {
      cy.drClickSaveWithoutApiCall();
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
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "Equipment form" });
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

    it("Navigate to Equipment", () => {
      cy.visit(recordUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "Pending Change", filename: "-1-Equipment-form",
        status: STATUS_TYPES_LABEL.PENDING_CHANGE,
      });
    });
  });

  context("Equipment with In Review status", () => {
    it("Navigate to AR", () => {
      cy.visit(arUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReviewWithoutApi();
    });

    it("Navigate to Equipment", () => {
      cy.visit(recordUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "In Review", filename: "-1-Equipment-form",
        status: STATUS_TYPES_LABEL.IN_REVIEW,
      });
    });
  });

  context("Equipment with Approved status", () => {
    it("Navigate to AR", () => {
      cy.visit(arUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Click 'Approve Submission'", () => {
      cy.arApproveARWithoutApi();
    });

    it("Navigate to Equipment", () => {
      cy.visit(recordUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "Approved", filename: "-1-Equipment-form",
        status: STATUS_TYPES_LABEL.APPROVED,
      });
    });
  });

});

export { };


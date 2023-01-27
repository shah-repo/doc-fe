/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { MPIExport } from "../../utils/constants/documentTypes/mpi";
import { QPITest } from "../../utils/constants/documentTypes/qpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let recordUrl;
let arUrl;

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let equipmentDocument;
let materialsDocument;

context("Export MPI", () => {
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
              MPIExport,
              QPITest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
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


    it("[API]Create equipment one", () => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Equipment one</p>",
              document: {
                docId: "ET-00003",
                documentType: {
                  id: equipmentDocumentType[0].id,
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
              name: "Equipment one",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: equipmentDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            });
          });
        });
      });
    });

    it("[API]Create material one", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00004",
            documentType: {
              id: materialsDocumentType[0].id,
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
          name: "Material one",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        });
      });
    });

  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create MPI", () => {
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
      cy.drEnterDocumentTitle( { name: "MPI document" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Manufacturing Process Instructions Test' document type", () => {
      cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("MPI with Draft status", () => {
    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Draft", filename: "-1-MPI-document", status: STATUS_TYPES_LABEL.DRAFT });
    });
  });

  context("MPI with Released status", () => {
    it("Approve and release the form", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Released", filename: "-1-MPI-document", status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("MPI with Obsolete status", () => {
    it("Revise document with 'Obsolete' option", () => {
      cy.drClickReviseDocument();
      cy.drChooseTypeOfRevisionChangeOption({ option: "Obsolete" });
      cy.drClickCreateDocumentWithoutApiCall();
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "Obsolete", filename: "-OBS-MPI-document",
        status: STATUS_TYPES_LABEL.OBSOLETE,
      });
    });
  });

  context("MPI with Superseded status", () => {
    it("Select Revision", () => {
      cy.drClickRevisionsSidePanel();
    });

    it("Select 'Superseded' record", () => {
      cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(1).contains("Superseded").arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "Superseded", filename: "-1-MPI-document",
        status: STATUS_TYPES_LABEL.SUPERSEDED,
      });
    });
  });

  context("MPI with Voided status", () => {
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
      cy.drEnterDocumentTitle( { name: "MPI document" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Manufacturing Process Instructions Test' document type", () => {
      cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
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

  context("MPI with Pending Change status", () => {
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
      cy.drEnterDocumentTitle( { name: "MPI document" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Manufacturing Process Instructions Test' document type", () => {
      cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions Test" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click Create document", () => {
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
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "MPI document" });
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
      cy.arSaveApiCall();
      cy.url().then((url: any) => {
        arUrl = url;
      });
    });

    it("Navigate to MPI", () => {
      cy.visit(recordUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "Pending Change", filename: "-1-MPI-document",
        status: STATUS_TYPES_LABEL.PENDING_CHANGE,
      });
    });
  });

  context("MPI with In Review status", () => {
    it("Navigate to AR", () => {
      cy.visit(arUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Click 'Send To Review'", () => {
      cy.arClickSendToReviewWithoutApi();
    });

    it("Navigate to MPI", () => {
      cy.visit(recordUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({
        pdfStatus: "In Review", filename: "-1-MPI-document",
        status: STATUS_TYPES_LABEL.IN_REVIEW,
      });
    });
  });

  context("MPI with Approved status", () => {
    it("Navigate to AR", () => {
      cy.visit(arUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Click 'Approve Submission'", () => {
      cy.arApproveARWithoutApi();
    });

    it("Navigate to MPI", () => {
      cy.visit(recordUrl);
      cy.listLoadingElementShouldAppear();
      cy.progressBarShouldNotExist();
    });

    it("Verify export", () => {
      cy.exportVerifyEmail({ pdfStatus: "Approved", filename: "-1-MPI-document", status: STATUS_TYPES_LABEL.APPROVED });
    });
  });

});

export { };


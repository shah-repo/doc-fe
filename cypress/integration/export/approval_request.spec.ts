/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let secondEmployee;
let recordDocumentType;
let formDocumentType;
let group;

context("Export for Approval Request", () => {
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
              {
                ...RecordDocumentType,
                fieldsConfig: {
                  D: {
                    visible: false,
                    required: false,
                  },
                  E: {
                    label: "Record Type",
                    visible: true,
                    required: true,
                  },
                  F: {
                    label: "Record ID",
                    visible: false,
                    required: true,
                  },
                  G: {
                    visible: false,
                    required: false,
                  },
                  I: {
                    visible: false,
                  },
                  J: {
                    visible: false,
                  },
                  K: {
                    label: "Void",
                    visible: true,
                  },
                  L: {
                    label: "Correction",
                    visible: true,
                  },
                  N: {
                    label: "Finalize and Release",
                    visible: true,
                  },
                  O: {
                    label: "Record History",
                    visible: true,
                  },
                  R: {
                    visible: false,
                  },
                  S: {
                    label: "Update Record",
                    visible: true,
                  },
                  A1: {
                    label: "WIP",
                    visible: true,
                  },
                  A2: {
                    label: "Voided",
                    visible: true,
                  },
                  A3: {
                    label: "Archive",
                    visible: true,
                  },
                  P1: {
                    label: "WIP",
                    visible: true,
                  },
                  P2: {
                    label: "Voided",
                    visible: true,
                  },
                  P3: {
                    label: "Archive",
                    visible: true,
                  },
                },
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          recordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record Document");
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

    it("[API]Create and release form for Record", (done: any) => {
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
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Record form</p>",
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
              name: "Record form",
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
            done();
          });
        });
      });
    });

    it("[API]Create and release another form for Record", (done: any) => {
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
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Record test form</p>",
              document: {
                docId: "FM-00005",
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
              name: "Record form",
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
            done();
          });
        });
      });
    });

  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Create approval request with newly created form", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestList();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
    });

    it("Enter title AR title", () => {
      cy.arEnterApprovalRequestTitle({ title: "AR title" });
    });

    it("Enter description", () => {
      cy.arEnterApprovalRequestDescription({ description: "AR description" });
    });

    it("Add document", () => {
      cy.arClickAddDocument();
      cy.arChoseSpecificProposedDocument({ name: "FM-00004" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
    });

    it("Click Create Approval Request", () => {
      cy.arClickCreateApprovalRequestAfterCompletingForm();
    });

    it("Add Approver'", () => {
      cy.arAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
    });

    it("Click on Save", () => {
      cy.arClickCreateApprovalRequestAfterCompletingForm();
    });
  });

  context(`AR with ${STATUS_TYPES_LABEL.DRAFT} status`, () => {
    it("Verify export", () => {
      cy.exportVerifyEmail({
        status: STATUS_TYPES_LABEL.DRAFT, filename: "-AR-title",
        pdfStatus: STATUS_TYPES_LABEL.DRAFT, type: "approval request",
      });
    });
  });

  context(`AR with ${STATUS_TYPES_LABEL.IN_REVIEW} status`, () => {
    context(`Check status should be ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      it("Click 'Send To Review'", () => {
        cy.arClickSendToReview();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.IN_REVIEW, filename: "-AR-title",
          pdfStatus: "In Review", type: "approval request",
        });
      });
    });
  });

  context(`AR with ${STATUS_TYPES_LABEL.APPROVED} status`, () => {
    context("Approve Submission", () => {
      it("Click Approve Submission button", () => {
        cy.arApproveARWithoutApi();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.APPROVED, filename: "-AR-title", pdfStatus: STATUS_TYPES_LABEL.APPROVED,
          type: "approval request",
        });
      });
    });
  });

  context(`AR with ${STATUS_TYPES_LABEL.CLOSED} status`, () => {
    context("Approve Submission", () => {
      it("Click Close button", () => {
        cy.get("[data-cy=\"transition-closed\"]").first().arrowClick();
        cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
        cy.progressBarShouldAppear();
        cy.listLoadingElementShouldNotExist();
        cy.checkToastMessage({ exists: false });
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.CLOSED, filename: "-AR-title", pdfStatus: STATUS_TYPES_LABEL.CLOSED,
          type: "approval request",
        });
      });
    });
  });

  context(`AR with ${STATUS_TYPES_LABEL.VOIDED} status`, () => {
    context("Create a AR from form", () => {
      it("Navigate to approval request list", () => {
        cy.navigToApprovalRequestList();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click Create a Approval Request button", () => {
        cy.arClickCreateAnAR();
      });

      it("Enter title AR title", () => {
        cy.arEnterApprovalRequestTitle({ title: "AR title" });
      });

      it("Enter description", () => {
        cy.arEnterApprovalRequestDescription({ description: "AR description" });
      });

      it("Add document", () => {
        cy.arClickAddDocument();
        cy.arChoseSpecificProposedDocument({ name: "FM-00005" });
        cy.arEnterDescriptionAddDocumentsDialog({ description: "added document description" });
        cy.arEnterJustificationAddDocumentsDialog({ justification: "justification for added document" });
        cy.arClickAddBtnOnAddDocumentsDialog();
      });

      it("Click Create Approval Request", () => {
        cy.arClickCreateApprovalRequestAfterCompletingForm();
      });

      it("Click on Save", () => {
        cy.arSaveApiCallWithoutApi();
      });
    });

    context("Add Record with Voided", () => {
      it("Click Void button", () => {
        cy.arVoidAR();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.VOIDED, filename: "-AR-title", pdfStatus: STATUS_TYPES_LABEL.VOIDED,
          type: "approval request",
        });
      });
    });
  });

});

export { };


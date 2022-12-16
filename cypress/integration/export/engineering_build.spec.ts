/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { EBExport } from "../../utils/constants/documentTypes/engineeringBuild";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

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

context("Export Engineering Build doc", () => {
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
              EBExport,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          recordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Engineering Build");
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

    it("[API]Create and release inline form for EB", (done: any) => {
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
              description: "<p>EB inline form</p>",
              document: {
                docId: "FM-00003",
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
              name: "EB inline form",
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
                    tabId: "overview",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-l02u8tzp",
                    uniqueSchemaItem: true,
                    index: 0,
                  },
                  {
                    index: 1,
                    type: "section",
                    name: "textfield-kn7fc209",
                    validationMode: "default",
                    label: "Section 1",
                    tabId: "procedure",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                  },
                  {
                    index: 2,
                    type: "textfield",
                    name: "textfield1-kn7fc7w4",
                    rows: 1,
                    validationMode: "default",
                    label: "textfield 1",
                    tabId: "procedure",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                  },
                  {
                    index: 3,
                    type: "inlineapproval",
                    name: "inline-approval-kw6gbxwm",
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "Inline approval",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    editorProperties: [],
                    label: "Inline approval",
                    tabId: "procedure",
                    editorConfig: {
                      groups: [
                        group.body[0].id,
                      ],
                    },
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

    it("[API]Create and release form for EB", (done: any) => {
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
              description: "<p>EB form</p>",
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
              name: "EB form",
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
                    tabId: "overview",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-l02u8tzp",
                    uniqueSchemaItem: true,
                    index: 0,
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

  context("Create a EB from inline form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the EB inline form", () => {
      cy.dlFilterByDocTitle({ docTitle: "EB inline form" });

      cy.dlSelectFirstDocument();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle( { name: "EB inline form" });
    });

    it("Select 'Procedure' tab", () => {
      cy.get("[data-cy=\"tabId.procedure\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter text in textfield", () => {
      cy.get("[name^=\"textfield1\"]").arrowType("Test one");
    });

    it("Save the document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context(`EB with ${STATUS_TYPES_LABEL.WIP} status`, () => {
    it("Verify export", () => {
      cy.exportVerifyEmail({
        status: STATUS_TYPES_LABEL.WIP, filename: "-1-EB-inline-form",
        pdfStatus: STATUS_TYPES_LABEL.WIP,
      });
    });
  });

  context(`EB with ${STATUS_TYPES_LABEL.LAST_SIGNED} status`, () => {
    context(`Add EB with ${STATUS_TYPES_LABEL.LAST_SIGNED}`, () => {
      it("Add inline approver", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals],
          () => {
            cy.listLoadingElementShouldNotExist();
            cy.get("[name*=\"fb-ia-inline-approval\"] input").eq(0)
              .autocompleteSelect("enlil.testmail+cy1");
          });
      });

      it("Click Request Approval button", () => {
        cy.contains("Request approval").arrowClick();
      });

      it("Approve inline approval", () => {
        cy.inlineApproval();
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Select Last Signed", () => {
        cy.contains("Last Signed").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        SystemRequirement("REQ-3800");
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.LAST_SIGNED, filename: "-1-EB-inline-form",
          pdfStatus: "Last Signed",
        });
      });
    });
  });

  context(`EB with ${STATUS_TYPES_LABEL.ARCHIVE} status`, () => {
    context(`Add EB with ${STATUS_TYPES_LABEL.ARCHIVE}`, () => {
      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Click WIP status EB", () => {
        cy.contains("WIP").arrowClick();
      });

      it("Select 'Procedure' tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Update section", () => {
        cy.get("[name^=\"textfield1\"]").arrowType("1");
      });

      it("Save the document", () => {
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Procedure' tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Click Request Approval button", () => {
        cy.contains("Request approval").should("exist");
        cy.contains("Request approval").arrowClick();
      });

      it("Select 'Procedure' tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Approve inline approval", () => {
        cy.inlineApproval();
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Select Archive", () => {
        cy.contains("Archive").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.ARCHIVE, filename: "-1-EB-inline-form",
          pdfStatus: "Archive",
        });
      });
    });
  });

  context(`EB with ${STATUS_TYPES_LABEL.RELEASED} status`, () => {
    context(`Add EB with ${STATUS_TYPES_LABEL.RELEASED}`, () => {
      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Click WIP status EB", () => {
        cy.contains("WIP").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Finalize and release button click'", () => {
        cy.reload();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.recFinalizeAndReleaseRecord();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.RELEASED, filename: "-A-EB-inline-form",
          pdfStatus: "Released",
        });
      });
    });
  });

  context(`EB with ${STATUS_TYPES_LABEL.CANCELED} status`, () => {
    context(`Add EB with ${STATUS_TYPES_LABEL.CANCELED}`, () => {
      it("Click Update EB", () => {
        cy.drClickReviseDocument();
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click Cancel draft", () => {
        cy.drCancelDraftButton();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.CANCELED, filename: "-A-1-EB-inline-form",
          pdfStatus: "Canceled",
        });
      });
    });
  });

  context(`EB with ${STATUS_TYPES_LABEL.IN_REVIEW} status`, () => {
    context("Create a EB from form", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Select the EB form", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocTitle({ docTitle: "EB form" });
        cy.dlSelectFirstDocument();
      });

      it("Click on Create New button", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Enter title", () => {
        cy.drEnterDocumentTitle( { name: "EB form" });
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context(`Add EB with ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      it("Add inline approver", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").eq(0).autocompleteSelect(`${USERS[1].name}`);
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Save and submit for Approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.IN_REVIEW, filename: "-A-EB-form", pdfStatus: "In Review" });
      });
    });
  });

  context(`EB with ${STATUS_TYPES_LABEL.VOIDED} status`, () => {
    context("Create a EB from form", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Select the EB form", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocTitle({ docTitle: "EB form" });
        cy.dlSelectFirstDocument();
      });

      it("Click on Create New button", () => {
        cy.drCreateNewDocumentFromForm();
      });

      it("Enter title", () => {
        cy.drEnterDocumentTitle( { name: "EB form" });
      });

      it("Upload logo picture 'image.jpg'", () => {
        cy.atchUploadAttachment({ fileName: "image.jpg" });
      });

      it("Save the document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Add EB with Voided", () => {
      it("Click Void button", () => {
        cy.arVoidAR();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.VOIDED, filename: "-A-Void", pdfStatus: "Voided" });
      });
    });
  });

});

export { };


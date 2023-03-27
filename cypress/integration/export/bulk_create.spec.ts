/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { BulkImport } from "../../utils/constants/documentTypes/bulkImport";
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

context("Export Bulk", () => {
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
              BulkImport,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          recordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Bulk Import");
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

    it("[API]Create and release inline form for Bulk Import", (done: any) => {
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
              description: "<p>Bulk Import inline form</p>",
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
              name: "Bulk Import inline form",
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
                    name: "fb-form-document-to-be-used",
                    type: "autocomplete",
                    index: 0,
                    label: "Select Form Document For Import",
                    rules: "required",
                    optionId: "34",
                    placeholder: "select form document for import",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    validationAttribute: "Select Form Document For Import",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-add-column-document-record-id",
                    type: "radiogroup",
                    index: 2,
                    label: "Column Document/Record Id?",
                    options: [
                      {
                        text: "Yes",
                        value: "Yes",
                      },
                      {
                        text: "No",
                        value: "No",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "default",
                    editorProperties: [],
                    validationAttribute: "Column Document/Record Id?",
                    deleteInFormDisabled: false,
                    applicableValidationSchema: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-output-document-type",
                    type: "autocomplete",
                    index: 3,
                    label: "Select Output Document Type",
                    rules: "required",
                    optionId: "35",
                    placeholder: "select output document type",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    validationAttribute: "Select Output Document Type",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-download-sheet",
                    type: "downloadsheet",
                    index: 1,
                    label: "Download Excel Template",
                    deleteDisabled: true,
                    editorProperties: [],
                    deleteInFormDisabled: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-spreadsheet-for-import",
                    type: "section",
                    index: 4,
                    label: "EXCEL FOR IMPORT",
                    deleteDisabled: false,
                    deleteInFormDisabled: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-spreadsheet-for-import-file",
                    type: "fileupload",
                    index: 5,
                    label: "Upload excel with data for import",
                    rules: "required",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Upload excel with data for import",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-spreadsheet-for-logging",
                    type: "section",
                    index: 6,
                    label: "Mass Create Logs",
                    deleteDisabled: false,
                    deleteInFormDisabled: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-spreadsheet-for-logging-file",
                    type: "fileupload",
                    index: 7,
                    label: "Logs",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Logs",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "details",
                  },
                  {
                    index: 8,
                    type: "section",
                    name: "textfield-kn7fc209",
                    validationMode: "default",
                    label: "Section 1",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                    tabId: "details",
                  },
                  {
                    index: 9,
                    type: "textfield",
                    name: "textfield1-kn7fc7w4",
                    rows: 1,
                    validationMode: "default",
                    label: "textfield 1",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "textfield",
                    tabId: "details",
                  },
                  {
                    index: 10,
                    type: "inlineapproval",
                    name: "inline-approval-kw6gbxwn",
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
                    tabId: "details",
                    editorProperties: [],
                    label: "Inline approval",
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

    it("[API]Create and release form for Bulk Import", (done: any) => {
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
              description: "<p>Bulk Import form</p>",
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
              name: "Bulk Import form",
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
                    name: "fb-form-document-to-be-used",
                    type: "autocomplete",
                    index: 0,
                    label: "Select Form Document For Import",
                    rules: "required",
                    optionId: "34",
                    placeholder: "select form document for import",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    validationAttribute: "Select Form Document For Import",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-add-column-document-record-id",
                    type: "radiogroup",
                    index: 2,
                    label: "Column Document/Record Id?",
                    options: [
                      {
                        text: "Yes",
                        value: "Yes",
                      },
                      {
                        text: "No",
                        value: "No",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    validationMode: "default",
                    editorProperties: [],
                    validationAttribute: "Column Document/Record Id?",
                    deleteInFormDisabled: false,
                    applicableValidationSchema: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-output-document-type",
                    type: "autocomplete",
                    index: 3,
                    label: "Select Output Document Type",
                    rules: "required",
                    optionId: "35",
                    placeholder: "select output document type",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    validationAttribute: "Select Output Document Type",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-download-sheet",
                    type: "downloadsheet",
                    index: 1,
                    label: "Download Excel Template",
                    deleteDisabled: true,
                    editorProperties: [],
                    deleteInFormDisabled: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-spreadsheet-for-import",
                    type: "section",
                    index: 4,
                    label: "EXCEL FOR IMPORT",
                    deleteDisabled: false,
                    deleteInFormDisabled: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-spreadsheet-for-import-file",
                    type: "fileupload",
                    index: 5,
                    label: "Upload excel with data for import",
                    rules: "required",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Upload excel with data for import",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-spreadsheet-for-logging",
                    type: "section",
                    index: 6,
                    label: "Mass Create Logs",
                    deleteDisabled: false,
                    deleteInFormDisabled: true,
                    tabId: "details",
                  },
                  {
                    name: "fb-spreadsheet-for-logging-file",
                    type: "fileupload",
                    index: 7,
                    label: "Logs",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Logs",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                    tabId: "details",
                  },
                  {
                    label: "form.builder.approvals",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-l02u8tzp",
                    uniqueSchemaItem: true,
                    index: 8,
                    tabId: "details",
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

  context("Create a Bulk Import from inline form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select the Bulk Import inline form", () => {
      cy.dlFilterByDocTitle({ docTitle: "Bulk Import inline form" });
      cy.dlSelectFirstDocumentWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter title 'Bulk Creation document", () => {
      cy.drEnterDocumentTitle({ name: "Bulk Creation document" });
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select form to be used for bulk creation", () => {
      cy.get("[data-cy=\"fb-form-document-to-be-used\"]").autocompleteSelect("FM-00003");
    });

    it("Select document type to be used for bulk creation", () => {
      cy.get("[data-cy=\"fb-output-document-type\"]").autocompleteSelect("Bulk Import");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'yes' to have Document id column", () => {
      cy.get("[name=\"fb-add-column-document-record-id\"]").eq(0).check();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save the document", () => {
      cy.drClickSaveWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Upload csv file", () => {
      cy.atchUploadTemplateForBLC({ fileName: "test_template.xlsx" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter text in textfield", () => {
      cy.get("[name^=\"textfield1\"]").arrowType("Test one");
      cy.unClick();
    });

    it("Click save document", () => {
      cy.drClickSaveWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`Bulk Import with ${STATUS_TYPES_LABEL.WIP} status`, () => {
    it("Verify export", () => {
      SystemRequirement("REQ-3800");
      cy.exportVerifyEmail({ status: STATUS_TYPES_LABEL.WIP, filename: "-1-Bulk-Creation-document" });
    });
  });

  context(`Bulk Import ${STATUS_TYPES_LABEL.LAST_SIGNED} status`, () => {
    context("Add Bulk Import Last Signed", () => {
      it("Add inline approver", () => {
        cy.get("[data-cy^=fb-ia-inline-approval-]").eq(0).autocompleteSelect(`${USERS[1].email }`);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click Request Approval button", () => {
        cy.contains("Request approval").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve inline approval", () => {
        cy.inlineApprovalWithoutApi();
      });

      it("Click on revisions tab on side panel", () => {
        cy.get(`button[data-cy="note-icon"]`, { timeout: 10000 }).should("be.visible");
        cy.drClickRevisionsSidePanel();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Last Signed", () => {
        cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(1).contains("Last Signed").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.LAST_SIGNED, filename: "-1-Bulk-Creation-document",
          pdfStatus: "Last Signed",
        });
      });
    });
  });

  context(`Bulk Import ${STATUS_TYPES_LABEL.ARCHIVE} status`, () => {
    context("Add Bulk Import Archive", () => {
      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click WIP status record", () => {
        cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(0).contains("WIP").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Select 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Update section", () => {
        cy.get("[name^=\"textfield1\"]").arrowType("1").unClick();
      });

      it("Save the document", () => {
        cy.drClickSaveWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Details' tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click Request Approval button", () => {
        cy.contains("Request approval").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve inline approval", () => {
        cy.inlineApprovalWithoutApi();
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Archive", () => {
        cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(2).contains("Archive").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.ARCHIVE, filename: "-1-Bulk-Creation-document",
          pdfStatus: "Archive",
        });
      });
    });
  });

  context(`Bulk Import ${STATUS_TYPES_LABEL.RELEASED} status`, () => {
    context("Add Bulk Import Released", () => {
      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Click WIP status record", () => {
        cy.get(`[data-cy="DocumentRevisionList-item"]`).eq(0).contains("WIP").arrowClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Finalize and release button click'", () => {
        cy.reload();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.landingPageLoadingElementShouldNotExist();
        cy.recFinalizeAndReleaseRecord();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.RELEASED, filename: "-A-Bulk-Creation-document",
          pdfStatus: "Released",
        });
      });
    });
  });

  context(`Bulk Import ${STATUS_TYPES_LABEL.CANCELED} status`, () => {
    context("Add Bulk Import Canceled", () => {
      it("Click Update record", () => {
        cy.drClickReviseDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click Cancel draft", () => {
        cy.drCancelDraftButton();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.CANCELED, filename: "-A-1-Bulk-Creation-document",
          pdfStatus: "Canceled",
        });
      });
    });
  });

  context(`Bulk Import ${STATUS_TYPES_LABEL.IN_REVIEW} status`, () => {
    context("Create a Bulk Import from form", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to document list", () => {
        cy.navigToDocumentList();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select the Bulk Import form", () => {
        cy.dlClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.dlFilterByDocTitle({ docTitle: "Bulk Import form" });
        cy.dlSelectFirstDocumentWithoutApi();
      });

      it("Click on Create New button", () => {
        cy.drCreateNewDocumentFromForm();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter title", () => {
        cy.drEnterDocumentTitle( { name: "Bulk Import form" });
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select form to be used for bulk creation", () => {
        cy.get("input[data-cy=\"fb-form-document-to-be-used\"]").autocompleteSelect("FM-00003");
      });

      it("Select document type to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-output-document-type\"]").autocompleteSelect("Bulk Import");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'yes' to have Document id column", () => {
        cy.get("[name=\"fb-add-column-document-record-id\"]").eq(0).check();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Upload csv file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "test_template1.xlsx" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Save the document", () => {
        cy.drClickSaveWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context(`Add Bulk Import with ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      it("Add inline approver", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").eq(0).autocompleteSelect(`${USERS[1].email }`);
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Submit for Approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify export", () => {
        cy.exportVerifyEmail({
          status: STATUS_TYPES_LABEL.IN_REVIEW, filename: "-A-Bulk-Import-form",
          pdfStatus: "In Review",
        });
      });
    });
  });

});

export { };


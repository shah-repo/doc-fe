/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { BulkImport } from "../../utils/constants/documentTypes/bulkImport";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let recordDocumentType;
let formDocumentType;
let group;

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
          recordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Bulk Import");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
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

    it("[API]Create form for Bulk Import", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: employeeLoginFirst.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: employeeLoginFirst.id,
          name: "AR Form",
        }).then((response) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Bulk Import form</p>",
              document: {
                docId: "FM-00002",
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
            employeeId: employeeLoginFirst.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => done());
        });
      });
    });

    it("[API]Create form for Bulk Import for another", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: employeeLoginFirst.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: employeeLoginFirst.id,
          name: "AR Form",
        }).then((response) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Bulk Import form 2</p>",
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
              name: "Bulk Import form 2",
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
            employeeId: employeeLoginFirst.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => done());
        });
      });
    });

  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });
  context("Create Bulk import form", () => {
    context("Start document creation flow", () => {
      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Filter document by ID", () => {
        cy.drFilterDocListByDocIdAndStatus({  docId: "FM-00002", status: "Draft" });
      });
    });
  });

  context("Predefined fields are displayed", () => {
    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Button should have text 'Select Form Document For Import'", () => {
      cy.get("[data-cy=\"Select Form Document For Import\"]")
        .should("have.text", "Select Form Document For Import");
    });

    it("Button should have text 'Column Document/Record Id?'", () => {
      cy.get("[data-cy=\"Column Document/Record Id?\"]")
        .should("have.text", "Column Document/Record Id?");
    });

    it("Button should have text 'Select Output Document Type'", () => {
      cy.get("[data-cy=\"Select Output Document Type\"]")
        .should("have.text", "Select Output Document Type");
    });

    it("Button should have text 'Download Excel Template'", () => {
      cy.get("[data-cy=\"Download Excel Template\"]")
        .should("have.text", "Download Excel Template");
    });

    it("Button should have text 'EXCEL FOR IMPORT'", () => {
      cy.get("[data-cy=\"EXCEL FOR IMPORT\"]")
        .should("have.text", "EXCEL FOR IMPORT");
    });

    it("Button should have text 'Upload excel with data for import'", () => {
      cy.get("[data-cy=\"Upload excel with data for import\"]")
        .should("have.text", "Upload excel with data for import");
    });

    it("Button should have text 'Upload excel with data for import'", () => {
      cy.get("[data-cy=\"Upload excel with data for import\"]")
        .should("have.text", "Upload excel with data for import");
    });

    it("Button should have text 'Mass Create Logs'", () => {
      cy.get("[data-cy=\"Mass Create Logs\"]")
        .should("have.text", "Mass Create Logs");
    });

    it("Button should have text 'Logs'", () => {
      cy.get("[data-cy=\"Logs\"]")
        .should("have.text", "Logs");
    });

    it("Verify that Approvals field is automatically added", () => {
      cy.get("[data-cy='form.builder.approvals']").should("exist");
    });
  });

  context("Move & Edit & Remove component", () => {
    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for bulk import test" });
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
    });

    it("move Component", () => {
      cy.get("[data-cy='Textfield for bulk import test']").trigger("mouseover");
      cy.wait(2000);
      cy.get(`[class="drag-handle"]`).eq(9)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(8)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").eq(8).arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for bulk import Edited" });
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(8).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add component", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for bulk import test" });
      cy.wait(1000);
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
    });
  });

  context("Release Bulk Import form", () => {
    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Export and save the template", () => {
      cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").eq(0).arrowClick();
      cy.get("[data-cy=\"fb-template-name\"]").arrowType("Bulk_Import");
      cy.get("[data-cy=\"common.add\"]").arrowClick({ force: true });
      cy.wait(2000);
    });
  });

  context("Create another Bulk Imort form", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Filter document by ID", () => {
        cy.drFilterDocListByDocIdAndStatus({  docId: "FM-00003", status: "Draft" });
      });

      it("Import the template", () => {
        cy.get("#fb-import-schema").attachFile("../downloads/Bulk_Import.json");
      });

      it("verify the imported field 'Textfield for bulk import test'", () => {
        cy.get("[data-cy=\"Textfield for bulk import test\"]")
          .should("have.text", "Textfield for bulk import test");
      });

      it("Add component", () => {
        cy.fbAddNewFieldWhenHidden();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbAddLabelName({ name: "Textfield for New bulk import test" });
        cy.wait(1000);
        cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
      });

      it("move Component", () => {
        cy.listLoadingElementShouldNotExist();
        cy.get("[data-cy='Textfield for New bulk import test']").trigger("mouseover");
        cy.wait(2000);
        cy.get(`[class="drag-handle"]`).eq(1)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(`[class="drag-handle"]`).eq(0)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
      });

      it("Edit Component", () => {
        cy.get("[data-cy=\"edit-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
        cy.fbAddLabelName({ name: "Textfield for New bulk import Edited" });
        cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
      });

      it("remove Component", () => {
        cy.get("[data-cy=\"remove-schema-item\"]").eq(0).arrowClick({ force: true });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("Create record with newly created form", () => {
    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Click Create a Record button", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Record Document' form", () => {
      cy.get("[data-cy=\"field-selectType\"]").arrowClick();
      cy.get("div[id^=react-select]").contains("Bulk Import").arrowClick().wait(2000);
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter title Record title", () => {
      cy.drEnterDocumentTitle({ name: "New Bulk Record " });
    });

    it("Upload attachment", () => {
      cy.atchUploadAttachment({ fileName: "image1.jpg" });
    });

    it("Save Record'", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Select Form Document For Import ", () => {
      cy.get("[data-cy=\"fb-form-document-to-be-used\"]").autocompleteSelect("FM-00002 - rev 1 - Bulk Import form");
    });

    it("Select column-document-record-id", () => {
      cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-add-column-document-record-id\"]").eq(0).check();
    });

    it("select output document type", () => {
      cy.get("[data-cy=\"fb-output-document-type\"]").autocompleteSelect("Bulk Import");
    });

    it("Save Record'", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Download excel template file", () => {
      cy.excelDownloadTemplate({ saveFileName: "Form Template Spreadsheet.xlsx" });
    });

    it("Upload file", () => {
      cy.atchUploadTemplateForBLC({ fileName: "Form Template Spreadsheet.xlsx" });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.wait(2000);
      cy.closeAllAlertMessages();
      cy.unClick();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Add Approver", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].email });
    });

    it("Submit for approval", () => {
      cy.lhrSubmitForApprovalWithoutApi();
      cy.wait(3000);
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Approve record", () => {
      cy.ebApproveWithoutApi();
    });

    it("Navigate to records list", () => {
      cy.navigToRecords();
    });

    it("Filter by record-id", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: "BLC-00005" });
      cy.landingPageLoadingElementShouldAppear();
      cy.dlSelectFirstDocument();
    });

    it("Verify the docId", () => {
      cy.get("[data-cy=\"HeaderInfo-docId\"]").contains("BLC-00005")
        .should("exist");
    });

    it("Verify the Rev A", () => {
      cy.get("[data-cy=\"HeaderInfo-Rev\"]").contains("Rev A")
        .should("exist");
    });

    it("Verify the status", () => {
      cy.get("[data-cy=\"HeaderInfo-status\"]").contains("WIP")
        .should("exist");
    });

    it("Verify the text field", () => {
      cy.get("input[name^=\"textfield-for-bulk-import-test-\"]").should("have.value", "test");
    });
  });
});

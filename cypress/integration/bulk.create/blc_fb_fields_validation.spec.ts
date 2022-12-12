/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { TestDocumentTypeRecord } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let group;
let initialArDocument;
let approvalRequestDocumentType;
let testDocumentType;
let formDocumentType;
let createdDocumentForBulkCreation;
const date = moment().tz("America/Los_Angeles").format("x");
const excelTemplateSaveName = date + "excelTemplate.xlsx";

context("Test fb fields validation in BLC", () => {
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
              TestDocumentTypeRecord,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          testDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Test Document Type");
          done();
        });
      });
    });

    context("[API]Create documents for bulk create", () => {
      it("[API]Login first tester", (done: any) => {
        cy.authApiLogin({
          email: USERS[1].email,
        }).then((response) => {
          loginResponse = response;
          done();
        });
      });

      it("[API]Create Bulk Create form", (done: any) => {
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
                description: "<p>Document form for bulk create</p>",
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
                name: "Document for bulk creation",
                referenceTo: [],
                retrain: false,
                revisionChangeType: RevisionChangeType.NextRevision,
                revisionStage: 3,
                formTemplate: {
                  outputDocumentTypes: [
                    {
                      id: testDocumentType[0].id,
                    },
                  ],
                  schema: [
                    {
                      index: 0,
                      type: "textfield",
                      name: "text-field-no-validation-kwg97lhs",
                      tabId: "overview",
                      hidden: false,
                      outputDisabled: false,
                      deleted: false,
                      deleteInFormDisabled: false,
                      validationMode: "default",
                      validationAttribute: "Text field - no validation",
                      rules: "",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      applicableValidationSchema: true,
                      editorProperties: [],
                      placeholder: "",
                      rows: 1,
                      label: "Text field - no validation",
                    },
                    {
                      index: 1,
                      type: "texteditor",
                      name: "text-editor-required-kwg98gul",
                      tabId: "overview",
                      hidden: false,
                      outputDisabled: false,
                      deleted: false,
                      deleteInFormDisabled: false,
                      validationMode: "default",
                      validationAttribute: "Text editor - required",

                      rules: "required",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      applicableValidationSchema: true,
                      editorProperties: [],
                      options: [],
                      label: "Text editor - required",
                      validators: {
                        required: true,
                      },
                    },
                    {
                      index: 2,
                      type: "datepicker",
                      name: "date-picker-required-if-another-x-kwg9a9v2",
                      tabId: "overview",
                      hidden: false,
                      outputDisabled: false,
                      deleted: false,
                      deleteInFormDisabled: false,
                      validationMode: "default",
                      validationAttribute: "Date picker - required if another x",
                      rules: "required_if:text-field-no-validation-kwg97lhs,required if x",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      applicableValidationSchema: true,
                      editorProperties: [],
                      label: "Date picker - required if another x",
                      validators: {
                        required: true,
                        required_if: {
                          name: "text-field-no-validation-kwg97lhs",
                          value: "required if x",
                        },
                      },
                    },
                    {
                      index: 3,
                      type: "radiogroup",
                      name: "radio-button-group-hidden-kwg9bi00",
                      tabId: "overview",
                      hidden: false,
                      outputDisabled: false,
                      deleted: false,
                      deleteInFormDisabled: false,
                      validationMode: "visibility",
                      validationAttribute: "Radio button group - hidden",
                      rules: "required",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      applicableValidationSchema: true,
                      editorProperties: [],
                      options: [
                        {
                          value: "option1",
                          text: "option1",
                        },
                        {
                          value: "option2",
                          text: "option2",
                        },
                        {
                          value: "option3",
                          text: "option3",
                        },
                      ],
                      label: "Radio button group - hidden",
                      validators: {
                        required: true,
                      },
                    },
                    {
                      index: 4,
                      type: "select",
                      name: "select-hidden-if-another-x-kwg9cmj2",
                      tabId: "overview",
                      hidden: false,
                      outputDisabled: false,
                      deleted: false,
                      deleteInFormDisabled: false,
                      validationMode: "visibility",
                      validationAttribute: "Select - hidden if another x",
                      rules: "required_if:text-field-no-validation-kwg97lhs,required if x",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      applicableValidationSchema: true,
                      editorProperties: [],
                      label: "Select - hidden if another x",
                      options: [
                        {
                          value: "option1",
                          text: "option1",
                        },
                        {
                          value: "option2",
                          text: "option2",
                        },
                        {
                          value: "option3",
                          text: "option3",
                        },
                      ],
                      validators: {
                        required_if: {
                          name: "text-field-no-validation-kwg97lhs",
                          value: "required if x",
                        },
                      },
                      placeholder: "",
                    },
                    {
                      index: 5,
                      type: "checkboxgroup",
                      name: "checkbox-group-disabled-if-another-x-kwg9e3j1",
                      tabId: "overview",
                      hidden: false,
                      outputDisabled: false,
                      deleted: false,
                      deleteInFormDisabled: false,
                      validationMode: "disabled",
                      validationAttribute: "Checkbox group - disabled if another x",
                      rules: "required_if:text-field-no-validation-kwg97lhs,required if x",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      applicableValidationSchema: true,
                      editorProperties: [],
                      options: [
                        {
                          value: "option1",
                          text: "option1",
                        },
                        {
                          value: "option2",
                          text: "option2",
                        },
                        {
                          value: "option3",
                          text: "option3",
                        },
                      ],
                      label: "Checkbox group - disabled if another x",
                      validators: {
                        required_if: {
                          name: "text-field-no-validation-kwg97lhs",
                          value: "required if x",
                        },
                      },
                    },
                    {
                      name: "approvals-built-in",
                      tabId: "overview",
                      type: "approvals",
                      index: 6,
                      label: "Approvals",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      uniqueSchemaItem: true,
                      validationAttribute: "Approvals",
                      deleteInFormDisabled: true,
                      applicableValidationSchema: true,
                    },
                  ],
                },
              },
              employeeId: adminEmployee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then((response) => {
              createdDocumentForBulkCreation = response;
              cy.drAPIApproveAndRelease({
                documentId: createdDocumentForBulkCreation.id,
                payload: {
                  effectiveDate: (new Date()).toISOString(),
                  documentType: { id: approvalRequestDocumentType[0].id },
                  formDocument: { id: initialArDocument[0].id },
                  approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => {
                done();
              });
            });
          });
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create form for bulk create", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'Bulk create form'", () => {
      cy.drEnterDocumentTitle({ name: "Bulk create form" });
    });

    it("Enter description 'Bulk create form description'", () => {
      cy.drEnterDocumentDescription({ description: "Bulk create form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Bulk Create" });
    });

    context("Create and release form", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Start bulk creation flow", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click create new from form button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    context("Fill Bulk creation document atributes", () => {
      it("Enter title 'Bulk Creation document'", () => {
        cy.drEnterDocumentTitle({ name: "Bulk Creation document" });
      });

      it("Enter description 'Bulk Creation document description'", () => {
        cy.drEnterDocumentDescription({ description: "Bulk Creation document description" });
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Refresh autocomplete for selecting form to be used in bulk creation", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-form-document-to-be-used\"]>div>div:nth-child(2)")
            .arrowClick();
          cy.unClick();
        });
      });

      it("Select form to be used for bulk creation", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [data-cy=\"fb-form-document-to-be-used\"]")
          .autocompleteSelect("Document for bulk creation");
      });

      it("Select document type to be used for bulk creation", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [data-cy=\"fb-output-document-type\"]")
          .autocompleteSelect("Test Document Type");
      });

      it("Select 'no' to have Document id column", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-add-column-document-record-id\"]").eq(1).check();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click on 'Overview' tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Test excel download", () => {
      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Download excel template file", () => {
        cy.excelDownloadTemplate({ saveFileName: excelTemplateSaveName });
      });

      it("Verify file size to check for unsupported fields", () => {
        cy.readFile(`cypress/downloads/${excelTemplateSaveName}`).should("have.length.within", 15100, 15400);
      });

      it("Verify popup message", () => {
        cy.checkToastMessageIsEqual({
          message: "Excel Template Successfully Downloaded. " +
        "Please open downloaded Excel Template and populate data. Then Upload to Import Data",
        });
        cy.closeAllAlertMessages();
      });
    });

    context("Test invalid excel files for bulk create", () => {
      context("Upload template required fields blank", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordRequiredFBField.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "Sheet Row 3: The Text editor - required is a required field.; " +
            "Sheet Row 3: The Radio button group - hidden is a required field.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Upload template with required if fields", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordRequiredIfFBField.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "Sheet Row 3: The Date picker - required if another x field is " +
            "required when Text field - no validation is required if x.; Sheet Row 3: " +
            "The Radio button group - hidden is a required field.; Sheet Row 3: The Select - " +
            "hidden if another x field is required when Text field - no validation is required " +
            "if x.; Sheet Row 3: The Checkbox group - disabled if another x field " +
            "is required when Text field - no validation is required if x.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Upload template with disabled column fields", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordDisabledFBField.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "Sheet Row 3: The Text editor - required is a required field.; " +
            "Sheet Row 3: The Radio button group - hidden is a required field.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Upload template with empty disabled field if another x", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordDisabledEmptyIfFBField.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "Sheet Row 3: The Text editor - required is a required field.; " +
            "Sheet Row 3: The Date picker - required if another x field is required " +
            "when Text field - no validation is required if x.; Sheet Row 3: " +
            "The Radio button group - hidden is a required field.; Sheet Row 3: " +
            "The Select - hidden if another x field is required when Text field - " +
            "no validation is required if x.; Sheet Row 3: The Checkbox group - " +
            "disabled if another x field is required when Text field - no validation is required if x.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });
    });
  });

  context("Upload template with valid data in spreadsheet", () => {
    it("Upload template file with valid fb validation data", () => {
      cy.atchUploadTemplateForBLC({ fileName: "recordFBFieldsValid.xlsx" });
    });

    it("Save bulk document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Click on 'Overview' tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve record", () => {
      cy.ebApprove();
    });
  });

  context("Verify created records", () => {
    it("Navigate to records list and verify number of records", () => {
      cy.navigToDashboard();
      cy.wait(5 * 1000);
      cy.navigToRecords();
      cy.dlVerifyDocCounter({ docCounterNumber: 9 });
    });

    context("Verify WIP records", () => {
      context("Verify WIP record 1", () => {
        it("Filter record one", () => {
          cy.dlClearFilters();
          cy.dlFilterByDocId({ docId: "TDT-00004" });
        });

        it("Select first record", () => {
          cy.dlSelectFirstDocument();
        });

        it("Verify title", () => {
          cy.drVerifyTitle({ title: "Record title 1" });
        });

        it("Verify description", () => {
          cy.drVerifyDescription({ description: "Record description 1" });
        });

        it("Verify owner", () => {
          cy.drVerifyDocumentOWner({ owner: USERS[1].name });
        });

        it("Verify text field text", () => {
          cy.get("input[name^=\"text-field-no-validation\"]").should("have.attr", "value", "test");
        });

        it("Verify text editor value", () => {
          cy.get("[data-cy^=\"text-editor-required\"]").parent().find("p")
            .should("not.exist");
        });

        it("Verify date picker", () => {
          cy.get("input[name^=\"date-picker-required-if-another\"]").should("have.attr", "value");
        });

        it("Verify radio button group", () => {
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option1]").should("exist");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option2]").should("exist");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option3]").should("exist");
        });

        it("Verify checkbox group", () => {
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option1]")
            .should("have.attr", "disabled");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option2]")
            .should("have.attr", "disabled");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option3]")
            .should("have.attr", "disabled");
        });
      });

      context("Verify WIP record 2", () => {
        it("Navigate to records list", () => {
          cy.navigToRecords();
        });

        it("Filter record one", () => {
          cy.dlClearFilters();
          cy.dlFilterByDocId({ docId: "TDT-00005" });
        });

        it("Select first record", () => {
          cy.dlSelectFirstDocument();
        });

        it("Verify title", () => {
          cy.drVerifyTitle({ title: "Record title 2" });
        });

        it("Verify description", () => {
          cy.drVerifyDescription({ description: "Record description 2" });
        });

        it("Verify owner", () => {
          cy.drVerifyDocumentOWner({ owner: USERS[1].name });
        });

        it("Verify text field text", () => {
          cy.get("input[name^=\"text-field-no-validation\"]").should("have.attr", "value", "required if x");
        });

        it("Verify text editor value", () => {
          cy.get("[id=\"sm-tabpanel-0\"] [id^=\"fb-mpiprocedure-ref-text-editor-required\"]>div>" +
          "div>div:nth-child(2)>div:nth-child(2)>div")
            .should("have.text", "test");
        });

        it("Verify date picker", () => {
          cy.get("input[name^=\"date-picker-required-if-another\"]").should("have.attr", "value");
        });

        it("Verify radio button group", () => {
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option1]").should("exist");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option2]").should("exist");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option3]").should("exist");
        });

        it("Verify checkbox group", () => {
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option1]")
            .should("have.attr", "value");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option2]")
            .should("have.attr", "value");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option3]")
            .should("have.attr", "value");
        });
      });

      context("Verify WIP record 3", () => {
        it("Navigate to records list", () => {
          cy.navigToRecords();
        });

        it("Filter record one", () => {
          cy.dlClearFilters();
          cy.dlFilterByDocId({ docId: "TDT-00006" });
        });

        it("Select first record", () => {
          cy.dlSelectFirstDocument();
        });

        it("Verify title", () => {
          cy.drVerifyTitle({ title: "Record title 3" });
        });

        it("Verify description", () => {
          cy.drVerifyDescription({ description: "Record description 3" });
        });

        it("Verify owner", () => {
          cy.drVerifyDocumentOWner({ owner: USERS[1].name });
        });

        it("Verify text field text", () => {
          cy.get("input[name^=\"text-field-no-validation\"]").should("have.attr", "value");
        });

        it("Verify text editor value", () => {
          cy.get("[data-cy^=\"text-editor-required\"]").parent().find("p")
            .should("not.exist");
        });

        it("Verify date picker", () => {
          cy.get("input[name^=\"date-picker-required-if-another\"]").should("have.attr", "value");
        });

        it("Verify radio button group", () => {
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option1]").should("exist");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option2]").should("exist");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option3]").should("exist");
        });

        it("Verify checkbox group", () => {
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option1]")
            .should("not.have.attr", "disabled");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option2]")
            .should("have.attr", "checked");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option3]")
            .should("not.have.attr", "disabled");
        });
      });

      context("Verify WIP record 4", () => {
        it("Navigate to records list", () => {
          cy.navigToRecords();
        });

        it("Filter record one", () => {
          cy.dlClearFilters();
          cy.dlFilterByDocId({ docId: "TDT-00007" });
        });

        it("Select first record", () => {
          cy.dlSelectFirstDocument();
        });

        it("Verify title", () => {
          cy.drVerifyTitle({ title: "Record title 4" });
        });

        it("Verify description", () => {
          cy.drVerifyDescription({ description: "Record description 4" });
        });

        it("Verify owner", () => {
          cy.drVerifyDocumentOWner({ owner: USERS[1].name });
        });

        it("Verify text field text", () => {
          cy.get("input[name^=\"text-field-no-validation\"]").should("have.attr", "value", "required if x");
        });

        it("Verify text editor value", () => {
          cy.get("[id=\"sm-tabpanel-0\"] [id^=\"fb-mpiprocedure-ref-text-editor-required\"]>div>" +
          "div>div:nth-child(2)>div:nth-child(2)>div")
            .should("have.text", "test");
        });

        it("Verify date picker", () => {
          cy.get("input[name^=\"date-picker-required-if-another\"]").should("have.attr", "value", "11/25/2021");
        });

        it("Verify radio button group", () => {
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option1]").should("have.attr", "value");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option2]").should("have.attr", "value");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option3]").should("have.attr", "value");
        });

        it("Verify checkbox group", () => {
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option1]")
            .should("have.attr", "checked");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option2]")
            .should("not.have.attr", "disabled");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option3]")
            .should("not.have.attr", "disabled");
        });

        it("Verify date picker", () => {
          cy.get("input[name^=\"select-hidden-if-another\"]").should("have.attr", "value", "option1");
        });
      });

      context("Verify WIP record 7", () => {
        it("Navigate to records list", () => {
          cy.navigToRecords();
        });

        it("Filter record one", () => {
          cy.dlClearFilters();
          cy.dlFilterByDocId({ docId: "TDT-00010" });
        });

        it("Select first record", () => {
          cy.dlSelectFirstDocument();
        });

        it("Verify title", () => {
          cy.drVerifyTitle({ title: "Record title 7" });
        });

        it("Verify description", () => {
          cy.drVerifyDescription({ description: "Record description 7" });
        });

        it("Verify owner", () => {
          cy.drVerifyDocumentOWner({ owner: USERS[1].name });
        });

        it("Verify text field text", () => {
          cy.get("input[name^=\"text-field-no-validation\"]").should("have.attr", "value");
        });

        it("Verify text editor value", () => {
          cy.get("[id^=\"fb-mpiprocedure-ref-text-editor\"]>div>div>div:nth-child(2)>div:nth-child(2)>div")
            .should("be.empty");
        });

        it("Verify date picker", () => {
          cy.get("input[name^=\"date-picker-required-if-another\"]").should("have.attr", "value");
        });

        it("Verify radio button group", () => {
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option1]").should("exist");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option2]").should("exist");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option3]").should("exist");
        });

        it("Verify checkbox group", () => {
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option1]")
            .should("have.attr", "disabled");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option2]")
            .should("have.attr", "disabled");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option3]")
            .should("have.attr", "disabled");
        });
      });
    });

    context("Verify released records", () => {
      context("Verify released record 5", () => {
        it("Navigate to record list", () => {
          cy.navigToRecords();
        });

        it("Filter record two", () => {
          cy.dlClearFilters();
          cy.dlFilterByDocId({ docId: "TDT-00008" });
        });

        it("Select first record", () => {
          cy.dlSelectFirstDocument();
        });

        it("Verify title", () => {
          cy.drVerifyTitle({ title: "Record title 5" });
        });

        it("Verify description", () => {
          cy.recVerifyDescription({ description: "Record description 5" });
        });

        it("Verify owner", () => {
          cy.drVerifyDocumentOWner({ owner: USERS[1].name });
        });

        it("Verify text field text", () => {
          cy.get("div[name^=\"text-field-no-validation\"]").should("have.text", "required if x");
        });

        it("Verify text editor value", () => {
          cy.get("[id^=\"fb-mpiprocedure-ref-text-editor-required\"] span[data-text]")
            .should("have.text", "test");
        });

        it("Verify date picker", () => {
          cy.get("input[name^=\"date-picker-required-if-another\"]").should("have.attr", "value", "11/25/2021");
        });

        it("Verify radio button group", () => {
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option1]").should("have.attr", "disabled");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option2]").should("have.attr", "checked");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option3]").should("have.attr", "disabled");
        });

        it("Verify select field", () => {
          cy.get("input[name^=\"select-hidden-if-another-x\"]").should("have.attr", "value", "option2");
        });

        it("Verify checkbox group", () => {
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option1]")
            .should("have.attr", "disabled");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option2]")
            .should("have.attr", "checked");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option3]")
            .should("have.attr", "disabled");
        });
      });

      context("Verify released record 8", () => {
        it("Navigate to record list", () => {
          cy.navigToRecords();
        });

        it("Filter record two", () => {
          cy.dlClearFilters();
          cy.dlFilterByDocId({ docId: "TDT-00011" });
        });

        it("Select first record", () => {
          cy.dlSelectFirstDocument();
        });

        it("Verify title", () => {
          cy.drVerifyTitle({ title: "Record title 8" });
        });

        it("Verify description", () => {
          cy.recVerifyDescription({ description: "Record description 8" });
        });

        it("Verify owner", () => {
          cy.drVerifyDocumentOWner({ owner: USERS[1].name });
        });

        it("Verify text field text", () => {
          cy.get("div[name^=\"text-field-no-validation\"]").should("have.attr", "disabled");
        });

        it("Verify text editor value", () => {
          cy.get("[id^=\"fb-mpiprocedure-ref-text-editor-required\"] span[data-text]")
            .should("have.text", "test");
        });

        it("Verify date picker", () => {
          cy.get("input[name^=\"date-picker-required-if-another\"]").should("have.attr", "value");
        });

        it("Verify radio button group", () => {
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option1]").should("have.attr", "checked");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option2]").should("have.attr", "disabled");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option3]").should("have.attr", "disabled");
        });

        it("Verify checkbox group", () => {
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option1]")
            .should("have.attr", "disabled");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option2]")
            .should("have.attr", "disabled");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option3]")
            .should("have.attr", "disabled");
        });
      });
    });

    context("Verify voided records", () => {
      context("Verify voided record 6", () => {
        it("Navigate to records", () => {
          cy.navigToRecords();
        });

        it("Filter by record-id", () => {
          cy.dlClearFilters();
          cy.dlFilterByDocId({ docId: "TDT-00009" });
        });

        it("Select first record", () => {
          cy.dlSelectFirstDocument();
        });

        it("Verify title", () => {
          cy.drVerifyTitle({ title: "Void" });
        });

        it("Verify description", () => {
          cy.recVerifyDescription({ description: "Void" });
        });

        it("Verify owner", () => {
          cy.drVerifyDocumentOWner({ owner: USERS[1].name });
        });

        it("Click on revisions tab on side panel", () => {
          cy.drClickRevisionsSidePanel();
        });

        it("Verify released date", () => {
          cy.get("[data-cy=DocumentRevisionList-item]>a:nth-child(2)>div:nth-child(3)")
            .should("contain.text", "Voided Date: 11/25/2021");
        });

        it("Verify text field text", () => {
          cy.get("div[name^=\"text-field-no-validation\"]").should("not.exist");
        });

        it("Verify text editor value", () => {
          cy.get("[id^=\"fb-mpiprocedure-ref-text-editor-required\"] p")
            .should("not.exist");
        });

        it("Verify date picker", () => {
          cy.get("input[name^=\"date-picker-required-if-another\"]").should("not.exist");
        });

        it("Verify radio button group", () => {
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option1]").should("not.exist");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option2]").should("not.exist");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option3]").should("not.exist");
        });

        it("Verify checkbox group", () => {
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option1]")
            .should("not.exist");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option2]")
            .should("not.exist");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option3]")
            .should("not.exist");
        });
      });

      context("Verify voided record 9", () => {
        it("Navigate to records", () => {
          cy.navigToRecords();
        });

        it("Filter by record-id", () => {
          cy.dlClearFilters();
          cy.dlFilterByDocId({ docId: "TDT-00012" });
        });

        it("Select first record", () => {
          cy.dlSelectFirstDocument();
        });

        it("Verify title", () => {
          cy.drVerifyTitle({ title: "Void" });
        });

        it("Verify description", () => {
          cy.recVerifyDescription({ description: "Void" });
        });

        it("Verify owner", () => {
          cy.drVerifyDocumentOWner({ owner: USERS[1].name });
        });

        it("Click on revisions tab on side panel", () => {
          cy.drClickRevisionsSidePanel();
        });

        it("Verify released date", () => {
          cy.get("[data-cy=DocumentRevisionList-item]>a:nth-child(2)>div:nth-child(3)")
            .should("contain.text", "Voided Date: 11/25/2021");
        });

        it("Verify text field text", () => {
          cy.get("div[name^=\"text-field-no-validation\"]").should("not.exist");
        });

        it("Verify text editor value", () => {
          cy.get("[id^=\"fb-mpiprocedure-ref-text-editor-required\"] p")
            .should("not.exist");
        });

        it("Verify date picker", () => {
          cy.get("input[name^=\"date-picker-required-if-another\"]").should("not.exist");
        });

        it("Verify radio button group", () => {
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option1]").should("not.exist");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option2]").should("not.exist");
          cy.get("input[name^=\"radio-button-group-hidden\"][value=option3]").should("not.exist");
        });

        it("Verify checkbox group", () => {
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option1]")
            .should("not.exist");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option2]")
            .should("not.exist");
          cy.get("[name^=\"checkbox-group-disabled-if-another-x\"] input[value=option3]")
            .should("not.exist");
        });
      });
    });
  });
});

export { };

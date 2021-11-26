/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
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
const currentDate = moment().tz("America/Los_Angeles").format("l");

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
              {
                documentTypeName: "Test Document Type",
                documentTypeAcronym: "TDT-",
                category: "Record",
                group: "RECORD",
                isQms: true,
                canRedLine: true,
                fieldsConfig: {
                  A1: {
                    label: "WIP",
                    visible: true,
                  },
                },
              },
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
                      hidden: false,
                      outputDisabled: false,
                      deleted: false,
                      deleteInFormDisabled: false,
                      validationMode: "default",
                      validationAttribute: "Date picker - required if another x",
                      rules: "required|required_if:text-field-no-validation-kwg97lhs,required if x",
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

      it("Refresh autocomplete for selecting form to be used in bulk creation", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.get("[name=\"fb-form-document-to-be-used\"]>div>div:nth-child(2)").arrowClick();
          cy.unClick();
        });
      });

      it("Select form to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-form-document-to-be-used\"]").arrowClick();
        cy.get("ul[role=listbox]>li").contains("Document for bulk creation").arrowClick();
      });

      it("Select document type to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-output-document-type\"]").arrowClick();
        cy.get("ul[role=listbox]>li").contains("Test Document Type").arrowClick();
      });

      it("Select 'no' to have Document id column", () => {
        cy.get("[name=\"fb-add-column-document-record-id\"]").eq(1).check();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Test excel download", () => {
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
        cy.pause();
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
            message: "Sheet Row 3: The Text editor - required is a required field.; Sheet Row 3: " +
            "The Date picker - required if another x is a required field.; " +
            "Sheet Row 3: The Radio button group - hidden is a required field.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
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
            message: "Sheet Row 3: The Date picker - required if another x is a required " +
            "field.,The Date picker - required if another x field is required when Text field " +
            "- no validation is required if x.; Sheet Row 3: The Radio button group - hidden is a " +
            "required field.; Sheet Row 3: The Select - hidden if another x field is required when Text field " +
            "- no validation is required if x.; Sheet Row 3: The Checkbox group - disabled if another " +
            "x field is required when Text field - no validation is required if x.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
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
            message: "Sheet Row 3: The Text editor - required is a required field.; Sheet Row 3: " +
            "The Date picker - required if another x is a required field.; Sheet Row 3: " +
            "The Radio button group - hidden is a required field.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Upload template with empty disabled field if another x", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordDisabledEmptyFBField.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "In row: 3, select item BLC select field contains value not provided in item options.",
          });
          cy.pause();
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Upload template with more than one owner assigned to some records ", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplateMoreOwners.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "Row: 4 - Owner with email enlil.testmail+cy2@gmail.com," +
            " enlil.testmail+cy3@gmail.com not found in company.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Upload template with no existing owners", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplateNonExistantOwners.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "Row: 4 - Owner with email enlil.testmail+cyy2@gmail.com not found in company.;" +
            " Row: 5 - Owner with email enlil.testmail+cy22@gmail.com not found in company.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Test multiple document types form", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplateMultipleTypes.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "ADT-00001 doesn't start with document type acronym (TDT-).; " +
            "ADT-00002 doesn't start with document type acronym (TDT-).; ADT-00003 " +
            "doesn't start with document type acronym (TDT-).",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Test date formats", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplateReleaseDate.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "Record TDT-00001 with state Voided does not have defined data in column " +
            "Release/Voided Date.; Record TDT-00002 with state Voided does not have defined data " +
            "in column Release/Voided Date.; Record TDT-00003 with state Voided does not have defined " +
            "data in column Release/Voided Date.; Record TDT-00004 with state Voided does not have " +
            "defined data in column Release/Voided Date.; Record TDT-00009 with state Released does " +
            "not have defined data in column Release/Voided Date.; Record TDT-00010 with state " +
            "Released does not have defined data in column Release/Voided Date.; Record TDT-00011 " +
            "with state Released does not have defined data in column Release/Voided Date.; " +
            "Record TDT-00012 with state Released does not have defined data in column Release/Voided " +
            "Date.; Record TDT-00013 with state Released does not have defined data in column " +
            "Release/Voided Date.; Record TDT-00014 with state Released does not have defined " +
            "data in column Release/Voided Date.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      // context("Test future date formats on Voided/Released", () => {
      //   it("Upload template file", () => {
      //     cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplateFutureDate.xlsx" });
      //   });

      //   it("Click save document", () => {
      //     cy.drClickCreateDocumentWithApiCallForForms();
      //   });

      //   it("Submit for approval", () => {
      //     cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      //   });

      //   it("Verify error message", () => {
      //     cy.checkToastMessageIsEqual({
      //       message: "Row: 4 - Owner with email enlil.testmail+cyy2@gmail.com not found in company.;" +
      //       " Row: 5 - Owner with email enlil.testmail+cy22@gmail.com not found in company.",
      //     });
      //     cy.closeAllAlertMessages();
      //   });

      //   it("Remove file", () => {
      //     cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
      //       .find("button").arrowClick({ force: true });
      //   });
      // });

      context("Upload two correct templates and check for error", () => {
        it("Upload template file one", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplate.xlsx" });
        });

        it("Upload template file two", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplateTwo.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "Only one attachment excel is allowed.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[data-cy=\"remove-recordBulkTemplate.xlsx\"]").trigger("mouseover", { force: true });
          cy.get("[data-cy=\"remove-recordBulkTemplate.xlsx\"]").arrowClick({ force: true });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });
    });

    context("Create bulk records", () => {
      it("Save bulk document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve record", () => {
        cy.ebApprove();
      });
    });
  });

  context("Verify created records", () => {
    it("Navigate to records list and verify number of records", { retries: 2 }, () => {
      cy.navigToDashboard();
      cy.navigToRecords();
      cy.dlVerifyDocCounter({ docCounterNumber: 4 });
    });

    it("Filter by type and verify only 'Test Document Type' records are created", () => {
      cy.dlFilterByDocId({ docId: "TDT-" });
      cy.dlVerifyDocCounter({ docCounterNumber: 4 });
    });

    it("Filter by record-id", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: "TDT-00006" });
    });

    context("Verify voided record one data", () => {
      it("Select first record", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify title", () => {
        cy.recVerifyTitle({ title: "Void" });
      });

      it("Verify description", () => {
        cy.recVerifyDescription({ description: "Void" });
      });

      it("Verify owner", () => {
        cy.drVerifyDocumentOWner({ owner: USERS[1].name });
      });
    });

    context("Verify record two data", () => {
      it("Navigate to record list", () => {
        cy.navigToRecords();
      });

      it("Filter record two", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "TDT-00007" });
      });

      it("Select first record", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify title", () => {
        cy.recVerifyTitle({ title: "Second bulk document" });
      });

      it("Verify description", () => {
        cy.recVerifyDescription({ description: "description for second bulk document" });
      });

      it("Verify owner", () => {
        cy.drVerifyDocumentOWner({ owner: USERS[2].name });
      });

      it("Verify text field value", () => {
        cy.get("[name^=\"blc-text-field\"]").should("have.text", "second bulk document");
      });

      it("Verify text editor value", () => {
        cy.get("[id^=\"fb-mpiprocedure-ref-blc-text-editor-\"]>div>div>div:nth-child(2)>div:nth-child(2)>div")
          .should("have.text", "second bulk document");
      });

      it("Verify Date picker value", () => {
        cy.get("[name^=\"blc-date-picker\"]").should("have.attr", "value", "05/08/1995");
      });

      it("Verify radio button group", () => {
        cy.get("[name^=\"blc-radio-button-group-\"][value=\"option1\"]").should("have.attr", "checked");
        cy.get("[name^=\"blc-radio-button-group-\"][value=\"option2\"]").should("not.have.attr", "checked");
        cy.get("[name^=\"blc-radio-button-group-\"][value=\"option3\"]").should("not.have.attr", "checked");
      });

      it("Verify Select field", () => {
        cy.get("[name^=\"blc-select-field\"]").should("have.attr", "value", "option1");
      });

      it("Verify Checkbox group", () => {
        cy.get("[name^=\"blc-checkbox-group\"] [value=\"option1\"]").should("not.have.attr", "checked");
        cy.get("[name^=\"blc-checkbox-group\"] [value=\"option2\"]").should("have.attr", "checked");
        cy.get("[name^=\"blc-checkbox-group\"] [value=\"option3\"]").should("not.have.attr", "checked");
      });
    });

    context("Verify future dates for WIP records", () => {
      context("Verify record three data", () => {
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
          cy.recVerifyTitle({ title: "Third bulk document" });
        });

        it("Verify description", () => {
          cy.recVerifyDescription({ description: "description for third bulk document" });
        });

        it("Verify owner", () => {
          cy.drVerifyDocumentOWner({ owner: USERS[2].name });
        });

        it("Verify updated date", () => {
          cy.get("[data-cy=DocumentRevisionList-item]>a:nth-child(2)>div:nth-child(3)")
            .should("contain.text", `Updated: ${currentDate}`);
        });

        it("Verify text field value", () => {
          cy.get("[name^=\"blc-text-field\"]").should("have.text", "third bulk document");
        });

        it("Verify text editor value", () => {
          cy.get("[id^=\"fb-mpiprocedure-ref-blc-text-editor-\"]>div>div>div:nth-child(2)>div:nth-child(2)>div")
            .should("have.text", "third bulk document");
        });

        it("Verify Date picker value", () => {
          cy.get("[name^=\"blc-date-picker\"]").should("have.attr", "value", "05/08/1995");
        });

        it("Verify radio button group", () => {
          cy.get("[name^=\"blc-radio-button-group-\"][value=\"option1\"]").should("have.attr", "checked");
          cy.get("[name^=\"blc-radio-button-group-\"][value=\"option2\"]").should("not.have.attr", "checked");
          cy.get("[name^=\"blc-radio-button-group-\"][value=\"option3\"]").should("not.have.attr", "checked");
        });

        it("Verify Select field", () => {
          cy.get("[name^=\"blc-select-field\"]").should("have.attr", "value", "option1");
        });

        it("Verify Checkbox group", () => {
          cy.get("[name^=\"blc-checkbox-group\"] [value=\"option1\"]").should("not.have.attr", "checked");
          cy.get("[name^=\"blc-checkbox-group\"] [value=\"option2\"]").should("have.attr", "checked");
          cy.get("[name^=\"blc-checkbox-group\"] [value=\"option3\"]").should("not.have.attr", "checked");
        });
      });

      context("Verify record four data", () => {
        it("Navigate to record list", () => {
          cy.navigToRecords();
        });

        it("Filter record two", () => {
          cy.dlClearFilters();
          cy.dlFilterByDocId({ docId: "TDT-00009" });
        });

        it("Select first record", () => {
          cy.dlSelectFirstDocument();
        });

        it("Verify title", () => {
          cy.recVerifyTitle({ title: "Fourth bulk document" });
        });

        it("Verify description", () => {
          cy.recVerifyDescription({ description: "description for fourth bulk document" });
        });

        it("Verify owner", () => {
          cy.drVerifyDocumentOWner({ owner: USERS[2].name });
        });

        it("Verify updated date", () => {
          cy.get("[data-cy=DocumentRevisionList-item]>a:nth-child(2)>div:nth-child(3)")
            .should("contain.text", `Updated: ${currentDate}`);
        });

        it("Verify text field value", () => {
          cy.get("[name^=\"blc-text-field\"]").should("have.text", "fourth bulk document");
        });

        it("Verify text editor value", () => {
          cy.get("[id^=\"fb-mpiprocedure-ref-blc-text-editor-\"]>div>div>div:nth-child(2)>div:nth-child(2)>div")
            .should("have.text", "fourth bulk document");
        });

        it("Verify Date picker value", () => {
          cy.get("[name^=\"blc-date-picker\"]").should("have.attr", "value", "05/08/1995");
        });

        it("Verify radio button group", () => {
          cy.get("[name^=\"blc-radio-button-group-\"][value=\"option1\"]").should("have.attr", "checked");
          cy.get("[name^=\"blc-radio-button-group-\"][value=\"option2\"]").should("not.have.attr", "checked");
          cy.get("[name^=\"blc-radio-button-group-\"][value=\"option3\"]").should("not.have.attr", "checked");
        });

        it("Verify Select field", () => {
          cy.get("[name^=\"blc-select-field\"]").should("have.attr", "value", "option1");
        });

        it("Verify Checkbox group", () => {
          cy.get("[name^=\"blc-checkbox-group\"] [value=\"option1\"]").should("not.have.attr", "checked");
          cy.get("[name^=\"blc-checkbox-group\"] [value=\"option2\"]").should("have.attr", "checked");
          cy.get("[name^=\"blc-checkbox-group\"] [value=\"option3\"]").should("not.have.attr", "checked");
        });
      });
    });
  });
});

export { };

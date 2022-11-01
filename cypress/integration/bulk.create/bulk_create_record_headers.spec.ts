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
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let group;
let initialArDocument;
let approvalRequestDocumentType;
let testDocumentType;
let formDocumentType;
let createdDocumentForBulkCreation;
const currentDate = moment().tz("America/Los_Angeles").format("x");
const excelTemplateSaveName = currentDate + "excelTemplate.xlsx";

context("Bulk create record headers", () => {
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
                revisionStage: 2,
                formTemplate: {
                  outputDocumentTypes: [{
                    id: testDocumentType[0].id,
                  }],
                  schema: [
                    {
                      name: "blc-text-field-kv6ef2ii",
                      tabId: "overview",
                      rows: 1,
                      type: "textfield",
                      index: 0,
                      label: "BLC text field",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      placeholder: "",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC text field",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "-kv6effxq",
                      tabId: "overview",
                      type: "paragraph",
                      index: 1,
                      rules: "",
                      hidden: false,
                      deleted: false,
                      paragraph: "<p>BLC paragraph text</p>",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-text-editor-kv6efdw2",
                      tabId: "overview",
                      type: "texteditor",
                      index: 2,
                      label: "BLC Text Editor",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      editorProperties: [

                      ],
                      validationAttribute: "BLC Text Editor",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-date-picker-kv6efc5r",
                      tabId: "overview",
                      type: "datepicker",
                      index: 3,
                      label: "BLC Date picker",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      editorProperties: [

                      ],
                      validationAttribute: "BLC Date picker",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-radio-button-group-kv6efaga",
                      tabId: "overview",
                      type: "radiogroup",
                      index: 4,
                      label: "BLC radio button group",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      options: [
                        {
                          text: "option1",
                          value: "option1",
                        },
                        {
                          text: "option2",
                          value: "option2",
                        },
                        {
                          text: "option3",
                          value: "option3",
                        },
                      ],
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC radio button group",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-select-field-kv6ef7ot",
                      tabId: "overview",
                      type: "select",
                      index: 5,
                      label: "BLC select field",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      options: [
                        {
                          text: "option1",
                          value: "option1",
                        },
                        {
                          text: "option2",
                          value: "option2",
                        },
                        {
                          text: "option3",
                          value: "option3",
                        },
                      ],
                      placeholder: "",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC select field",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-checkbox-group-kv6ef53q",
                      tabId: "overview",
                      type: "checkboxgroup",
                      index: 6,
                      label: "BLC Checkbox group",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      options: [
                        {
                          text: "option1",
                          value: "option1",
                        },
                        {
                          text: "option2",
                          value: "option2",
                        },
                        {
                          text: "option3",
                          value: "option3",
                        },
                      ],
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC Checkbox group",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "approvals-built-in",
                      tabId: "overview",
                      type: "approvals",
                      index: 7,
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
        cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-add-column-document-record-id\"]").eq(0).check();
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
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
      context("Upload template with wrong headers", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplateMisspelledHeaders.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "Headers do not match expected order or values, either headers were modified " +
            "or configuration was updated. Please download sheet template and fill required data.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Upload template with additional fields", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplateAdditionalFields.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "Uploaded template has more columns than generated template in row 1",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Upload template with shuffled column fields", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplateShuffledFields.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "Headers do not match expected order or values, either headers were modified or " +
            "configuration was updated. Please download sheet template and fill required data.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Upload template with other option that is not provided", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplateNotAvailableOtherOption.xlsx" });
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
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Upload valid template but change doc type configuration", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplateWithTitle.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.pmSubmitForApproval();
        });

        context("Change doc type configuration, make label C not visible", () => {
          it("[API] Patch doc type", (done: any) => {
            cy.drPatchDocType({
              payload: {
                documentTypeName: "Test Document Type",
                documentTypeAcronym: "TDT-",
                category: "Record",
                group: "RECORD",
                isQms: true,
                canRedLine: true,
                fieldsConfig: {
                  C: {
                    visible: false,
                    required: false,
                  },
                },
              },
              docTypeId: testDocumentType[0].id,
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });

        context("Try to approve bulk create", () => {
          it("Click on 'Overview' tab", () => {
            cy.drSelectOverviewTab();
          });

          it("Approve record", () => {
            cy.ebTryToApprove();
          });

          it("Verify error message", () => {
            cy.checkToastMessageIsEqual({
              message: "Headers do not match expected order or values, either headers were modified or " +
              "configuration was updated. Please download sheet template and fill required data.; " +
              "Uploaded template has more columns than generated template in row 1",
            });
            cy.closeAllAlertMessages();
          });
        });

        context("Withdraw subbmision and remove file", () => {
          it("Withdraw submission", () => {
            cy.ebWithdrawSubmisison();
          });

          it("Click on 'Details' tab", () => {
            cy.drSelectDetailsTab();
          });

          it("Remove file", () => {
            cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
              .parent().parent()
              .find("button").arrowClick({ force: true });
          });
        });
      });
    });

    context("Upload correct template", () => {
      it("Upload template file", () => {
        SystemRequirement("REQ-4760 ");
        cy.atchUploadTemplateForBLC({ fileName: "recordBulkTemplate.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Create bulk records", () => {
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
  });

  context("Verify created records", () => {
    it("Navigate to records list and verify number of records", () => {
      cy.navigToDashboard();
      cy.wait(30 * 1000);
      cy.navigToRecords();
      cy.dlVerifyDocCounter({ docCounterNumber: 2 });
    });

    it("Filter by record-id", () => {
      cy.dlFilterByDocId({ docId: "TDT-00002" });
    });

    context("Verify voided record one data", () => {
      it("Select first record", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify title is not existing", () => {
        cy.get("[data-cy=\"SummaryBaseProps-values\"]").should("not.exist");
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
        cy.dlFilterByDocId({ docId: "TDT-00005" });
      });

      it("Select first record", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify title is not existing", () => {
        cy.get("[data-cy=\"SummaryBaseProps-values\"]").should("not.exist");
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
  });
});

export { };

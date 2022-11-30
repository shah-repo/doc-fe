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
const currentDate = moment().tz("America/Los_Angeles").format("x");
const excelTemplateSaveName = currentDate + "excelTemplate.xlsx";

context("Bulk create unsupported fields for records", () => {
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
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
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
                revisionStage: 1,
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
                      name: "blc-autocomplete-kv803wt2",
                      tabId: "overview",
                      type: "autocomplete",
                      label: "BLC autocomplete",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      optionId: "1",
                      placeholder: "",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC autocomplete",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-quantity-kv804z8m",
                      tabId: "overview",
                      type: "quantity",
                      label: "BLC quantity",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC quantity",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-timer-kv8058rz",
                      tabId: "overview",
                      type: "timer",
                      label: "BLC timer",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC timer",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-po-kv80636x",
                      tabId: "overview",
                      type: "purchaseorder",
                      label: "BLC po",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC po",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-receive-kv806fzf",
                      tabId: "overview",
                      type: "poreceive",
                      label: "BLC receive",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC receive",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "-kv806ph2",
                      tabId: "overview",
                      type: "approvalMatrix",
                      rules: "",
                      hidden: false,
                      deleted: false,
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
                      name: "blc-instruction-media-upload-kv80744w",
                      tabId: "overview",
                      type: "instructionsmediaupload",
                      label: "BLC instruction media upload",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      isTemplate: true,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC instruction media upload",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-evidence-media-upload-kv807eyt",
                      tabId: "overview",
                      type: "evidencemediaupload",
                      label: "BLC evidence media upload",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      isTemplate: false,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC evidence media upload",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "fb-parts-kv807mm4",
                      tabId: "overview",
                      type: "parts",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      applicableOn: [

                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      uniqueSchemaItem: true,
                      validationAttribute: "",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "fb-procedure-section-kv807mm4",
                      tabId: "overview",
                      type: "section",
                      label: "form.builder.procedure",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      applicableOn: [

                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "-kv807mmc",
                      tabId: "overview",
                      type: "procedure",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      stepIndex: 1,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      editorProperties: [
                        "copyableValue",
                      ],
                      validationAttribute: "",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "fb-mpi-procedure-section-kv807qce",
                      tabId: "overview",
                      type: "section",
                      label: "form.builder.mpiprocedure",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      outputDisabled: false,
                      validationMode: "default",
                      editorProperties: [

                      ],
                      validationAttribute: "",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "-kv807qck",
                      tabId: "overview",
                      type: "mpiprocedure",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      stepIndex: 2,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      editorConfig: {
                        equipment: [

                        ],
                        materials: [

                        ],
                        attachments: [

                        ],
                        description: "",
                      },
                      outputDisabled: false,
                      validationMode: "default",
                      editorProperties: [

                      ],
                      validationAttribute: "",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-equip-kv807ymj",
                      tabId: "overview",
                      type: "eqmaintenance",
                      label: "BLC equip",
                      rules: "eq_maintenance_required",
                      hidden: false,
                      deleted: false,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      editorConfig: {
                        type: "preventativeMaintenance",
                      },
                      outputDisabled: false,
                      validationMode: "default",
                      editorProperties: [
                        "deleteDisabled",
                      ],
                      validationAttribute: "BLC equip",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-text-with-range-kv808ai0",
                      tabId: "overview",
                      type: "textfieldwithrange",
                      label: "BLC text with range",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      placeholder: "",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      editorConfig: {

                      },
                      outputDisabled: false,
                      validationMode: "default",
                      editorProperties: [

                      ],
                      validationAttribute: "BLC text with range",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-suppliers-kv808n9y",
                      tabId: "overview",
                      type: "supplier",
                      label: "BLC suppliers",
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
                      validationAttribute: "BLC suppliers",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-lhrs-kv808yq3",
                      tabId: "overview",
                      type: "lhrstep",
                      label: "BLC lhrs",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      stepIndex: 3,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      editorConfig: {
                        filters: {

                        },
                      },
                      outputDisabled: false,
                      validationMode: "default",
                      editorProperties: [

                      ],
                      validationAttribute: "BLC lhrs",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-hyperlink-kv80ag5k",
                      tabId: "overview",
                      type: "hyperlink",
                      label: "BLC hyperlink",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      linkUrl: "https://www.google.hr/",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      editorProperties: [

                      ],
                      validationAttribute: "BLC hyperlink",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-file-upload-kv80aw6k",
                      tabId: "overview",
                      type: "fileupload",
                      label: "BLC file upload",
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
                      validationAttribute: "BLC file upload",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "blc-btf-kv80b7gb",
                      tabId: "overview",
                      type: "blanktplform",
                      label: "BLC BTF",
                      rules: "",
                      hidden: false,
                      deleted: false,
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      defaultValue: [

                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      editorProperties: [

                      ],
                      validationAttribute: "BLC BTF",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                    {
                      name: "approvals-built-in",
                      tabId: "overview",
                      type: "approvals",
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
                  ].map((x, index) => ({ ...x, index })),
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

      it("Select 'yes' to have Document id column", () => {
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

    context("Test downloaded excel", () => {
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
  });
});

export { };

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { AdditionalType, TestDocumentTypeRecord } from "../../utils/constants/documentTypes/testTypes";
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
let fourthEmployee;
let blcDocumentURL;
let additionalDocumentType;

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
              AdditionalType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          fourthEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[4].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          testDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Test Document Type");
          additionalDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Additional Document Type");
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
                  outputDocumentTypes: [
                    {
                      id: testDocumentType[0].id,
                    },
                    {
                      id: additionalDocumentType[0].id,
                    },
                  ],
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
                        {
                          value: "includeContext",
                          text: "form.builder.other",
                        },
                      ],
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      editorProperties: [
                        "includeContext",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC radio button group",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                      validators: {
                        required: true,
                      },
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
                        {
                          value: "includeContext",
                          text: "form.builder.other",
                        },
                      ],
                      placeholder: "",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      editorProperties: [
                        "includeContext",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC select field",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                      validators: {
                        required: true,
                      },
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
                        {
                          value: "includeContext",
                          text: "form.builder.other",
                        },
                      ],
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      editorProperties: [
                        "includeContext",
                      ],
                      outputDisabled: false,
                      validationMode: "default",
                      validationAttribute: "BLC Checkbox group",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                      validators: {
                        required: true,
                      },
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

      it("[API]Create new revision of Bulk Create form", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Document form for bulk create</p>",
            document: {
              id: createdDocumentForBulkCreation.documentId,
            },
            name: "Revised document for bulk creation",
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
                    {
                      value: "includeContext",
                      text: "form.builder.other",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  editorProperties: [
                    "includeContext",
                  ],
                  outputDisabled: false,
                  validationMode: "default",
                  validationAttribute: "BLC radio button group",
                  deleteInFormDisabled: false,
                  applicableValidationSchema: true,
                  validators: {
                    required: true,
                  },
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
                    {
                      value: "includeContext",
                      text: "form.builder.other",
                    },
                  ],
                  placeholder: "",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  editorProperties: [
                    "includeContext",
                  ],
                  outputDisabled: false,
                  validationMode: "default",
                  validationAttribute: "BLC select field",
                  deleteInFormDisabled: false,
                  applicableValidationSchema: true,
                  validators: {
                    required: true,
                  },
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
                    {
                      value: "includeContext",
                      text: "form.builder.other",
                    },
                  ],
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  editorProperties: [
                    "includeContext",
                  ],
                  outputDisabled: false,
                  validationMode: "default",
                  validationAttribute: "BLC Checkbox group",
                  deleteInFormDisabled: false,
                  applicableValidationSchema: true,
                  validators: {
                    required: true,
                  },
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
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
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
        cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-form-document-to-be-used\"]>div>div:nth-child(2)").arrowClick();
        cy.unClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Check only last revision of form document for bulk create is available on list", () => {
        const BLCDocumentFormList: string[] = [
          "FM-00001 - rev 1 - AR Form",
          "FM-00002 - rev 2 - Revised document for bulk creation",
          "FM-00003 - rev 1 - Bulk create form"];
        cy.get("[id=\"sm-tabpanel-1\" ] [data-cy=\"fb-form-document-to-be-used\"]").arrowClick();
        cy.get("ul>li[role=option]").should("have.length", 3);
        cy.get("ul>li[role=option]").each(($document) => {
          expect($document.text()).to.be.oneOf(BLCDocumentFormList);
        });
        cy.unClick();
      });

      it("Check form document types are not available", () => {
        const documentTypeList: string[] = [
          "Training Curriculum",
          "Bulk Create",
          "LHR Step",
          "Lot History Record",
          "First Article Inspection",
          "Maintenance Record",
          "Equipment",
          "Equipment Specification",
          "Suppliers",
          "PO Approval Matrix",
          "Purchase Order",
          "Document Approval Matrix",
          "Component Specification",
          "Engineering Build",
          "Parts",
          "Component Specification Lot",
          "Lots",
          "Receivable",
          "Approval Request",
          "Test Document Type",
          "Additional Document Type",
          "Paper Lot History Record",
        ];

        cy.get(`[id=\"sm-tabpanel-1\" ] [data-cy="fb-output-document-type"]`).verifyAutocompleteList(documentTypeList);
      });

      it("Select form to be used for bulk creation", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [data-cy=\"fb-form-document-to-be-used\"]")
          .autocompleteSelect("Revised document for bulk creation");
      });

      it("Select document type to be used for bulk creation", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [data-cy=\"fb-output-document-type\"]").autocompleteSelect("Suppliers");
      });

      it("Select 'no' to have Document id column", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-add-column-document-record-id\"]").eq(1).check();
      });

      it("Click create document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Click on 'Overview' tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[4].email });
      });
    });

    context("Upload correct template", () => {
      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Upload template file", () => {
        SystemRequirement("REQ-4760 ");
        cy.atchUploadTemplateForBLC({ fileName: "recordState.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });
    });

    context("Verify form does not have selected type for output", () => {
      it("Save bulk document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Submit for approval", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });

      it("Verify error message", () => {
        cy.checkToastMessageIsEqual({
          message: "The form has no selected document type as an output.",
        });
        cy.closeAllAlertMessages();
      });
    });

    context("Add correct type and release bulk create", () => {
      it("Select correct document type to be used for bulk creation", () => {
        cy.get(`[id=\"sm-tabpanel-1\" ] [name="fb-output-document-type"]`)
          .arrowClick().find("button").eq(0).arrowClick();
        cy.unClick();
        cy.get(`[id=\"sm-tabpanel-1\" ] [data-cy="fb-output-document-type"]`).autocompleteSelect("Test Document Type");
      });

      it("Save bulk document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
        cy.url().then((url: any) => {
          blcDocumentURL = url;
        });
      });
    });

    context("Change ownership of BLC document and login that user", () => {
      it(`Change ownership to ${USERS[4].name}`, () => {
        cy.drChangeOwnerFromMenu({ employee: USERS[4].name });
      });

      it(`Login user ${USERS[4].name} to dashboard`, () => {
        cy.authLoginToDashboard({ USER: USERS[4], employeeId: fourthEmployee.id });
      });

      it(`Navigate to BLC document`, () => {
        cy.visit(blcDocumentURL);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Create bulk records", () => {
      it("Submit for approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve record", () => {
        cy.ebApproveWithoutApi();
      });
    });
  });

  context("Verify created records", () => {
    it("Navigate to records list and verify number of records", () => {
      cy.navigToDashboard();
      cy.wait(30 * 1000);
      cy.navigToRecords();
      cy.dlVerifyDocCounter({ docCounterNumber: 8 });
    });

    it("Filter by type and verify only 'Test Document Type' records are created", () => {
      cy.dlFilterByDocId({ docId: "TDT-" });
      cy.dlVerifyDocCounter({ docCounterNumber: 8 });
    });

    context("Verify record one data", () => {
      it("Filter by record-id", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "TDT-00004" });
      });

      it("Select first record", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify title", () => {
        cy.drVerifyTitle({ title: "-" });
      });

      it("Verify description", () => {
        cy.recVerifyDescription({ description: "description one" });
      });

      it("Verify owner", () => {
        cy.drVerifyDocumentOWner({ owner: USERS[2].name });
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Verify no release date is present on WIP record", () => {
        cy.get("[data-cy=DocumentRevisionList-item]>a:nth-child(2)>div:nth-child(3)")
          .should("contain.text", "Updated:");
      });

      it("Verify BLC text field", () => {
        cy.get("[name^=\"blc-text-field\"]").should("have.text", "one");
      });

      it("Verify BLC text editor", () => {
        cy.get("[data-cy^=\"blc-text-editor\"]").should("have.text", "one");
      });

      it("Verify BLC date picker", () => {
        cy.get("[name^=\"blc-date-picker\"]").should("have.attr", "value", "11/16/2021");
      });

      it("Verify BLC radio button group", () => {
        cy.get("input[name^=\"blc-radio-button-group\"][value=\"includeContext\"]").should("have.attr", "checked");
        cy.get("[name^=\"input-context-blc-radio-button-group\"]").should("have.text", "one");
      });

      it("Verify select field", () => {
        cy.get("[id*=\"select-blc-select-field\"]").should("have.text", "Other");
        cy.get("[name^=\"input-context-blc-select-field\"]").should("have.text", "one");
      });

      it("Verify checkbox group", () => {
        cy.get("[name^=\"blc-checkbox-group\"] [value=includeContext]").should("have.attr", "checked");
        cy.get("[name^=\"input-context-blc-checkbox-group\"]").should("have.text", "one");
      });
    });

    context("Verify record two data", () => {
      it("Navigate to records", () => {
        cy.navigToRecords();
      });

      it("Filter by record-id", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "TDT-00005" });
      });

      it("Select first record", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify title", () => {
        cy.drVerifyTitle({ title: "title two" });
      });

      it("Verify description", () => {
        cy.get("div[data-cy=\"RichTextEditor.description\"] span[data-text]").should("not.exist");
      });

      it("Verify owner", () => {
        cy.drVerifyDocumentOWner({ owner: USERS[4].name });
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Verify no release date is present on WIP record", () => {
        cy.get("[data-cy=DocumentRevisionList-item]>a:nth-child(2)>div:nth-child(3)")
          .should("contain.text", "Updated:");
      });

      it("Verify BLC text field", () => {
        cy.get("[name^=\"blc-text-field\"]").should("have.attr", "value", "two");
      });

      it("Verify BLC text editor", () => {
        cy.get("[id=\"sm-tabpanel-0\"] [data-cy^=\"blc-text-editor\"] span[data-text]").should("have.text", "two");
      });

      it("Verify BLC date picker", () => {
        cy.get("[name^=\"blc-date-picker\"]").should("have.attr", "value", "11/16/2021");
      });

      it("Verify BLC radio button group", () => {
        cy.get("input[name^=\"blc-radio-button-group\"][value=\"option2\"]").should("have.attr", "checked");
      });

      it("Verify select field", () => {
        cy.get("[id=\"sm-tabpanel-0\"] [id*=\"select-blc-select-field\"]").should("have.text", "option2");
      });

      it("Verify checkbox group", () => {
        cy.get("[name^=\"blc-checkbox-group\"] [value=\"option2\"]").should("have.attr", "checked");
      });
    });

    context("Verify record three data", () => {
      it("Navigate to records", () => {
        cy.navigToRecords();
      });

      it("Filter by record-id", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "TDT-00006" });
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
        cy.drVerifyDocumentOWner({ owner: USERS[4].name });
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Verify released date", () => {
        cy.get("[data-cy=DocumentRevisionList-item]>a:nth-child(2)>div:nth-child(3)")
          .should("contain.text", "Voided Date: 11/15/2021");
      });

      it("Verify BLC text field", () => {
        cy.get("[name^=\"blc-text-field\"]").should("not.exist");
      });

      it("Verify BLC text editor", () => {
        cy.get("[data-cy^=\"blc-text-editor\"]").should("not.exist");
      });

      it("Verify BLC date picker", () => {
        cy.get("[name^=\"blc-date-picker\"]").should("not.exist");
      });

      it("Verify BLC radio button group", () => {
        cy.get("input[name^=\"blc-radio-button-group\"][value=\"option2\"]").should("not.exist");
      });

      it("Verify select field", () => {
        cy.get("[id*=\"select-blc-select-field\"]").should("not.exist");
      });

      it("Verify checkbox group", () => {
        cy.get("[name^=\"blc-checkbox-group\"] [value=\"option2\"]").should("not.exist");
      });
    });

    context("Verify record four data", () => {
      it("Navigate to records", () => {
        cy.navigToRecords();
      });

      it("Filter by record-id", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "TDT-00007" });
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
        cy.drVerifyDocumentOWner({ owner: USERS[4].name });
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Verify released date", () => {
        cy.get("[data-cy=DocumentRevisionList-item]>a:nth-child(2)>div:nth-child(3)")
          .should("contain.text", "Voided Date: 11/15/2021");
      });

      it("Verify BLC text field", () => {
        cy.get("[name^=\"blc-text-field\"]").should("not.exist");
      });

      it("Verify BLC text editor", () => {
        cy.get("[data-cy^=\"blc-text-editor\"]").should("not.exist");
      });

      it("Verify BLC date picker", () => {
        cy.get("[name^=\"blc-date-picker\"]").should("not.exist");
      });

      it("Verify BLC radio button group", () => {
        cy.get("input[name^=\"blc-radio-button-group\"][value=\"option2\"]").should("not.exist");
      });

      it("Verify select field", () => {
        cy.get("[id*=\"select-blc-select-field\"]").should("not.exist");
      });

      it("Verify checkbox group", () => {
        cy.get("[name^=\"blc-checkbox-group\"] [value=\"option2\"]").should("not.exist");
      });
    });

    context("Verify record five data", () => {
      it("Navigate to records", () => {
        cy.navigToRecords();
      });

      it("Filter by record-id", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "TDT-00008" });
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
        cy.drVerifyDocumentOWner({ owner: USERS[4].name });
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Verify released date", () => {
        cy.get("[data-cy=DocumentRevisionList-item]>a:nth-child(2)>div:nth-child(3)")
          .should("contain.text", "Voided Date: 11/15/2021");
      });

      it("Verify BLC text field", () => {
        cy.get("[name^=\"blc-text-field\"]").should("not.exist");
      });

      it("Verify BLC text editor", () => {
        cy.get("[data-cy^=\"blc-text-editor\"]").should("not.exist");
      });

      it("Verify BLC date picker", () => {
        cy.get("[name^=\"blc-date-picker\"]").should("not.exist");
      });

      it("Verify BLC radio button group", () => {
        cy.get("input[name^=\"blc-radio-button-group\"][value=\"option2\"]").should("not.exist");
      });

      it("Verify select field", () => {
        cy.get("[id*=\"select-blc-select-field\"]").should("not.exist");
      });

      it("Verify checkbox group", () => {
        cy.get("[name^=\"blc-checkbox-group\"] [value=\"option2\"]").should("not.exist");
      });
    });

    context("Verify record six data", () => {
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
        cy.drVerifyTitle({ title: "title six" });
      });

      it("Verify description", () => {
        cy.recVerifyDescription({ description: "description six" });
      });

      it("Verify owner", () => {
        cy.drVerifyDocumentOWner({ owner: USERS[4].name });
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Verify no release date is present on WIP record", () => {
        cy.get("[data-cy=DocumentRevisionList-item]>a:nth-child(2)>div:nth-child(3)")
          .should("contain.text", "Released Date: 11/15/2021");
      });

      it("Verify BLC text field", () => {
        cy.get("[name^=\"blc-text-field\"]").should("have.text", "six");
      });

      it("Verify BLC text editor", () => {
        cy.get("[data-cy^=\"blc-text-editor\"]").should("have.text", "six");
      });

      it("Verify BLC date picker", () => {
        cy.get("[name^=\"blc-date-picker\"]").should("have.attr", "value", "11/16/2021");
      });

      it("Verify BLC radio button group", () => {
        cy.get("input[name^=\"blc-radio-button-group\"][value=\"option1\"]").should("have.attr", "checked");
      });

      it("Verify select field", () => {
        cy.get("[id*=\"select-blc-select-field\"]").should("have.text", "option1");
      });

      it("Verify checkbox group", () => {
        cy.get("[name^=\"blc-checkbox-group\"] [value=option1]").should("have.attr", "checked");
      });
    });

    context("Verify record seven data", () => {
      it("Navigate to records", () => {
        cy.navigToRecords();
      });

      it("Filter by record-id", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "TDT-00010" });
      });

      it("Select first record", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify title", () => {
        cy.drVerifyTitle({ title: "title seven" });
      });

      it("Verify description", () => {
        cy.recVerifyDescription({ description: "description seven" });
      });

      it("Verify owner", () => {
        cy.drVerifyDocumentOWner({ owner: USERS[4].name });
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Verify no release date is present on WIP record", () => {
        cy.get("[data-cy=DocumentRevisionList-item]>a:nth-child(2)>div:nth-child(3)")
          .should("contain.text", "Released Date: 11/15/2021");
      });

      it("Verify BLC text field", () => {
        cy.get("[name^=\"blc-text-field\"]").should("have.text", "seven");
      });

      it("Verify BLC text editor", () => {
        cy.get("[data-cy^=\"blc-text-editor\"]").should("have.text", "seven");
      });

      it("Verify BLC date picker", () => {
        cy.get("[name^=\"blc-date-picker\"]").should("have.attr", "value", "11/16/2021");
      });

      it("Verify BLC radio button group", () => {
        cy.get("input[name^=\"blc-radio-button-group\"][value=\"includeContext\"]").should("have.attr", "checked");
        cy.get("[name^=\"input-context-blc-radio-button-group\"]").should("have.text", "seven");
      });

      it("Verify select field", () => {
        cy.get("[id*=\"select-blc-select-field\"]").should("have.text", "Other");
        cy.get("[name^=\"input-context-blc-select-field\"]").should("have.text", "seven");
      });

      it("Verify checkbox group", () => {
        cy.get("[name^=\"blc-checkbox-group\"] [value=includeContext]").should("have.attr", "checked");
        cy.get("[name^=\"input-context-blc-checkbox-group\"]").should("have.text", "seven");
      });
    });

    context("Verify record eight data", () => {
      it("Navigate to records", () => {
        cy.navigToRecords();
      });

      it("Filter by record-id", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "TDT-00011" });
      });

      it("Select first record", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify title", () => {
        cy.drVerifyTitle({ title: "title eight" });
      });

      it("Verify description", () => {
        cy.recVerifyDescription({ description: "description eight" });
      });

      it("Verify owner", () => {
        cy.drVerifyDocumentOWner({ owner: USERS[4].name });
      });

      it("Click on revisions tab on side panel", () => {
        cy.drClickRevisionsSidePanel();
      });

      it("Verify no release date is present on WIP record", () => {
        cy.get("[data-cy=DocumentRevisionList-item]>a:nth-child(2)>div:nth-child(3)")
          .should("contain.text", "Released Date: 11/15/2021");
      });

      it("Verify BLC text field", () => {
        cy.get("[name^=\"blc-text-field\"]").should("have.text", "eight");
      });

      it("Verify BLC text editor", () => {
        cy.get("[data-cy^=\"blc-text-editor\"]").should("have.text", "eight");
      });

      it("Verify BLC date picker", () => {
        cy.get("[name^=\"blc-date-picker\"]").should("have.attr", "value", "11/16/2021");
      });

      it("Verify BLC radio button group", () => {
        cy.get("input[name^=\"blc-radio-button-group\"][value=\"includeContext\"]").should("have.attr", "checked");
        cy.get("[name^=\"input-context-blc-radio-button-group\"]").should("have.text", "eight");
      });

      it("Verify select field", () => {
        cy.get("[id*=\"select-blc-select-field\"]").should("have.text", "Other");
        cy.get("[name^=\"input-context-blc-select-field\"]").should("have.text", "eight");
      });

      it("Verify checkbox group", () => {
        cy.get("[name^=\"blc-checkbox-group\"] [value=includeContext]").should("have.attr", "checked");
        cy.get("[name^=\"input-context-blc-checkbox-group\"]").should("have.text", "eight");
      });
    });
  });
});

export { };

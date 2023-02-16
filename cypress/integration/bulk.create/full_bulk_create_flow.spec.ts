// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let group;
let initialArDocument;
let approvalRequestDocumentType;
let createdInReviewDocument;
let formDocumentType;
let testDocumentType;
let createdArForDocInReview;
let createdObsoleteDocument;
let createdAlphaDocument;
let createdNumericAlphaDocument;
const currentDate = moment().tz("America/Los_Angeles").format("x");
const excelTemplateSaveName = currentDate + "excelTemplate.xlsx";

context("Bulk create flow", () => {
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
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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
              TestDocumentType,
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

    context("[API]Create documents to verify bulk form documents list", () => {
      it("[API]Login first tester", (done: any) => {
        cy.authApiLogin({
          email: USERS[1].email,
        }).then((response) => {
          loginResponse = response;
          done();
        });
      });

      it("[API]Create form document in DRAFT", (done: any) => {
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
                description: "<p>DRAFT document</p>",
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
                name: "Draft document",
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
                      name: "blc-textfield",
                      type: "textfield",
                      tabId: "overview",
                      index: 0,
                      label: "BLC text field",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      editorProperties: [],
                      validationAttribute: "BLC text field",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                  ],
                },
              },
              employeeId: adminEmployee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then(() => done());
          });
        });
      });

      it("[API]Create form document in IN REVIEW", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>IN REVIEW document</p>",
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
            name: "In review document",
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
                  name: "blc-textfield",
                  type: "textfield",
                  index: 0,
                  tabId: "overview",
                  label: "BLC text field",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  editorProperties: [],
                  validationAttribute: "BLC text field",
                  deleteInFormDisabled: false,
                  applicableValidationSchema: true,
                },
              ],
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdInReviewDocument = response;
          cy.arCreateApprovalRequest({
            payload: {
              title: "For first equipment",
              description: "Approval for equipment due in 4 days",
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
              formInput: {
                documentRevisions: [{
                  proposedDocumentRevision: { id: createdInReviewDocument.id },
                  descriptionOfChange: "ar test",
                  justificationOfChange: "ar test",
                  id: faker.random.uuid(),
                }],
                approvers: [{
                  id: adminEmployee.id,
                }],
              },
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then((response) => {
            createdArForDocInReview = response;
            cy.arPatchAR({
              payload: {
                formInput: {
                  documentRevisions: [{
                    proposedDocumentRevision: { id: createdInReviewDocument.id },
                    descriptionOfChange: "ar test",
                    justificationOfChange: "ar test",
                    id: faker.random.uuid(),
                  }],
                  approvers: [
                    {
                      approver: {
                        id: adminEmployee.id,
                      },
                      signatureGroupId: {
                        id: null,
                      },
                    },
                  ],
                },
              },
              arID: createdArForDocInReview.id,
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              cy.arInReview({
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
                arID: createdArForDocInReview.id,
              }).then(() => done());
            });
          });
        });
      });

      it("[API]Create form document in OBSOLETE", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>OBSOLETE document</p>",
            document: {
              docId: "FM-00006",
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
            name: "Obsolete document",
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
                  name: "blc-textfield",
                  type: "textfield",
                  index: 0,
                  label: "BLC text field",
                  tabId: "overview",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  editorProperties: [],
                  validationAttribute: "BLC text field",
                  deleteInFormDisabled: false,
                  applicableValidationSchema: true,
                },
              ],
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdObsoleteDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdObsoleteDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
              approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => {
            cy.drCreateDocumentRevision({
              payload: {
                attachments: [],
                description: "<p>OBSOLETE document</p>",
                document: { id: createdObsoleteDocument.documentId },
                name: "Obsolete document",
                referenceTo: [],
                retrain: false,
                revisionChangeType: RevisionChangeType.Obsolete,
                formTemplate: {
                  outputDocumentTypes: [{
                    id: testDocumentType[0].id,
                  }],
                  schema: [
                    {
                      name: "blc-textfield",
                      type: "textfield",
                      index: 0,
                      label: "BLC text field",
                      tabId: "overview",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      deleteDisabled: true,
                      editorProperties: [],
                      validationAttribute: "BLC text field",
                      deleteInFormDisabled: false,
                      applicableValidationSchema: true,
                    },
                  ],
                },
              },
              employeeId: adminEmployee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then((response) => {
              createdObsoleteDocument = response;
              cy.drAPIApproveAndRelease({
                documentId: createdObsoleteDocument.id,
                payload: {
                  effectiveDate: (new Date()).toISOString(),
                  documentType: { id: approvalRequestDocumentType[0].id },
                  formDocument: { id: initialArDocument[0].id },
                  approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => done());
            });
          });
        });
      });

      it("[API]Create form document in ALPHA", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>ALPHA document</p>",
            document: {
              docId: "FM-00007",
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
            name: "Alpha document",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 3,
            formTemplate: {
              outputDocumentTypes: [{
                id: testDocumentType[0].id,
              }],
              schema: [
                {
                  name: "blc-textfield",
                  type: "textfield",
                  index: 0,
                  label: "BLC text field",
                  tabId: "overview",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  editorProperties: [],
                  validationAttribute: "BLC text field",
                  deleteInFormDisabled: false,
                  applicableValidationSchema: true,
                },
              ],
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdAlphaDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdAlphaDocument.id,
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

      it("[API]Create form document in NUMERIC ALPHA", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>NUMERIC ALPHA document</p>",
            document: {
              docId: "FM-00008",
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
            name: "Numeric Alpha document",
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
                  name: "blc-textfield",
                  type: "textfield",
                  index: 0,
                  label: "BLC text field",
                  tabId: "overview",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  editorProperties: [],
                  validationAttribute: "BLC text field",
                  deleteInFormDisabled: false,
                  applicableValidationSchema: true,
                },
              ],
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdNumericAlphaDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdNumericAlphaDocument.id,
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

    it("Enter title 'Bulk create form", () => {
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

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    it("Select details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Button should have text 'Download Excel Template'", () => {
      cy.get(`[id="sm-tabpanel-1" ] [data-cy="Download Excel Template"]`)
        .should("have.text", "Download Excel Template");
    });

    it("The section component where the excel spreadsheet will be added is labeled 'Excel for Import'", () => {
      cy.get(`[id="sm-tabpanel-1" ] [id="fb-spreadsheet-for-import"]`).should("have.text", "Excel For Import");
    });

    it("The Paragraph component with the instructions is labeled 'Upload excel with data for import'", () => {
      cy.get(`[id="sm-tabpanel-1" ] [data-cy="Upload excel with data for import"]`)
        .should("have.text", "Upload excel with data for import");
    });

    context("Create and release form", () => {
      it("Approve and release Bulk create form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });
  });

  context("Create form document for bulk creation", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'Document for bulk creation", () => {
      cy.drEnterDocumentTitle({ name: "Document for bulk creation" });
    });

    it("Enter description 'Document for bulk creation description'", () => {
      cy.drEnterDocumentDescription({ description: "Document for bulk creation description" });
    });

    it("Select 'Test Document Type' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Test Document Type" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });

    context("Add form fields that will be used in bulk creation", () => {
      context("Add text field", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select text field", () => {
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        });

        it("Enter text in label field", () => {
          cy.fbEnterNameValue({ name: "label", value: "BLC text field" });
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Add Checkbox group", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select Checkbox group", () => {
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
        });

        it("Enter text in label field", () => {
          cy.fbEnterNameValue({ name: "label", value: "BLC Checkbox group" });
        });

        it("Enter values in options field", () => {
          cy.fbGroupOptions("option1", "option2", "option3");
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Add Select", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select Select", () => {
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
        });

        it("Enter text in label field", () => {
          cy.fbEnterNameValue({ name: "label", value: "BLC select field" });
        });

        it("Enter values in options field", () => {
          cy.fbGroupOptions("option1", "option2", "option3");
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Add Radio button group", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select Radio button group", () => {
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
        });

        it("Enter text in label field", () => {
          cy.fbEnterNameValue({ name: "label", value: "BLC radio button group" });
        });

        it("Enter values in options field", () => {
          cy.fbGroupOptions("option1", "option2", "option3");
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Add Date Picker", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select Date picker", () => {
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
        });

        it("Enter text in label field", () => {
          cy.fbEnterNameValue({ name: "label", value: "BLC Date picker" });
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Add Text Editor", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select Text Editor", () => {
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
        });

        it("Enter text in label field", () => {
          cy.fbEnterNameValue({ name: "label", value: "BLC Text Editor" });
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });

      context("Add Paragraph", () => {
        it("Click add button", () => {
          cy.fbAddNewFieldWhenHidden();
        });

        it("Select Paragraph", () => {
          cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Paragraph" });
        });

        it("Enter text to present in paragraph", () => {
          cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
            .click({ force: true }).clear().arrowType("BLC paragraph text").wait(500);
        });

        it("Add Field", () => {
          cy.fbAddNewFieldButton();
        });
      });
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

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select bulk creation form document", () => {
      cy.drFilterDocListByNameAndStatus({ title: "Bulk create form", status: "Released" });
    });

    it("Click create new from form button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    context("Fill Bulk creation document atributes", () => {
      it("Enter title 'Bulk Creation document", () => {
        cy.drEnterDocumentTitle({ name: "Bulk Creation document" });
      });

      it("Enter description 'Bulk Creation document description'", () => {
        cy.drEnterDocumentDescription({ description: "Bulk Creation document description" });
      });

      it("Select details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Refresh autocomplete for selecting form to be used in bulk creation", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-form-document-to-be-used\"]>div>div:nth-child(2)").click();
        cy.unClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Verify only allowed documents are on list for bulk document form", () => {
        const allowedDocuments: string[] = [
          "FM-00001 - rev 1 - AR Form",
          "FM-00007 - rev A - Alpha document",
          "FM-00008 - rev 1A - Numeric Alpha document",
          "FM-00002 - rev 1 - Bulk create form",
          "FM-00003 - rev 1 - Document for bulk creation"];

        cy.get("[id=\"sm-tabpanel-1\" ] [data-cy=\"fb-form-document-to-be-used\"]").click();
        cy.get("ul>li[role=option]").should("have.length", 5);
        cy.get("ul>li[role=option]").each(($document) => {
          expect($document.text()).to.be.oneOf(allowedDocuments);
        });

        cy.unClick();
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
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Select Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].email });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });
    });

    context("Test downloaded excel", () => {
      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Download excel template file", () => {
        SystemRequirement("REQ-4720");
        cy.excelDownloadTemplate({ saveFileName: excelTemplateSaveName });
      });

      it("Verify file size", () => {
        cy.readFile(`cypress/downloads/${excelTemplateSaveName}`).should("have.length.within", 11700, 11800);
      });

      it("Verify popup message", () => {
        cy.checkToastMessageIsEqual({
          message: "Excel Template Successfully Downloaded. " +
        "Please open downloaded Excel Template and populate data. Then Upload to Import Data",
        });
        cy.closeAllAlertMessages();
      });
    });

    context("Upload file for bulk create", () => {
      it("Upload csv file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "fullBulkCreateFlowCSV.csv" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Submit for approval", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });

      it("Verify csv is not supported", () => {
        SystemRequirement("REQ-4750");
        cy.checkToastMessageIsEqual({ message: "The file attachment is not a xlsx type." });
        cy.closeAllAlertMessages();
      });

      it("Remove csv file", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]").parent().parent()
          .find("button").arrowClick({ force: true });
      });

      it("Upload file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "fullBulkCreateFlow.xlsx" });
      });

      it("Verify upload", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] input[id=\"fb-attachment-field-fb-spreadsheet-for-import-file\"]")
          .parent().parent().find("div:nth-child(3)")
          .should("contain.text", "fullBulkCreateFlow.xlsx");
      });
    });

    context("Create bulk documents", () => {
      it("Save bulk document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Approve document", () => {
        SystemRequirement("REQ-4740");
        cy.ebApproveWithoutApi();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("Verify created documents", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.reload();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Clear filter", () => {
      cy.filterClear();
    });

    it("Filter by doc-id", () => {
      cy.dlFilterByType({ type: "TDT" });
    });

    it("Verify number of documents", () => {
      cy.dlVerifyDocCounter({ docCounterNumber: 2 });
    });

    it("Filter by doc-id", () => {
      cy.dlFilterByDocId({ docId: "TDT-00002" });
      cy.landingPageLoadingElementShouldAppear();
    });

    context("Verify document one data", () => {
      it("Select first document", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify title", () => {
        cy.drVerifyTitle({ title: "First bulk document" });
      });

      it("Verify description", () => {
        cy.drVerifyDescription({ description: "description of first bulk document" });
      });

      it("Verify owner", () => {
        cy.drVerifyDocumentOWner({ owner: USERS[1].name });
      });

      it("Verify Training", () => {
        cy.drIsTrainingRequired({ shouldBe: false });
      });

      it("Verify text field value", () => {
        cy.get("[name^=\"blc-text-field\"]").should("have.attr", "value", "first bulk document");
      });

      it("Verify text editor value", () => {
        cy.get("[id^=\"fb-mpiprocedure-ref-blc-text-editor-\"]>div>div>div:nth-child(2)>div:nth-child(2)>div")
          .should("have.text", "first bulk document");
      });

      it("Verify Date picker value", () => {
        cy.get("[name^=\"blc-date-picker\"]").should("have.attr", "value", "10/22/2021");
      });

      it("Verify radio button group", () => {
        cy.get("[name^=\"blc-radio-button-group-\"][value=\"option1\"]").should("not.have.attr", "checked");
        cy.get("[name^=\"blc-radio-button-group-\"][value=\"option2\"]").should("have.attr", "checked");
        cy.get("[name^=\"blc-radio-button-group-\"][value=\"option3\"]").should("not.have.attr", "checked");
      });

      it("Verify Select field", () => {
        cy.get("[name^=\"blc-select-field\"]").should("have.attr", "value", "option2");
      });

      it("Verify Checkbox group", () => {
        cy.get("[name^=\"blc-checkbox-group\"] [value=\"option1\"]").should("have.attr", "checked");
        cy.get("[name^=\"blc-checkbox-group\"] [value=\"option2\"]").should("not.have.attr", "checked");
        cy.get("[name^=\"blc-checkbox-group\"] [value=\"option3\"]").should("not.have.attr", "checked");
      });
    });

    context("Verify document two data", () => {
      it("Navigate to document list", () => {
        cy.navigToDocumentList();
      });

      it("Filter document two", () => {
        cy.dlClearFilters();
        cy.dlFilterByDocId({ docId: "TDT-00005" });
        cy.landingPageLoadingElementShouldAppear();
      });

      it("Select first document", () => {
        cy.dlSelectFirstDocument();
      });

      it("Verify title", () => {
        cy.drVerifyTitle({ title: "Second bulk document" });
      });

      it("Verify description", () => {
        cy.drVerifyDescription({ description: "description for second bulk document" });
      });

      // it("Verify owner", () => {
      //   cy.drVerifyDocumentOWner({ owner: USERS[2].name });
      // });

      it("Verify Training", () => {
        cy.drIsTrainingRequired({ shouldBe: true });
      });

      it("Verify text field value", () => {
        cy.get("[name^=\"blc-text-field\"]").should("have.attr", "value", "second bulk document");
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


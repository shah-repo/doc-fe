// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { PrivatePoolTest, PublicPoolTest } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let group;
let initialArDocument;
let approvalRequestDocumentType;
let testPrivateType;
let testPublicType;
let formDocumentType;
let createdDocumentForBulkCreation;
let testDocumentTypeDocument;
let blcForm;
let blc1;
let blc2;
const currentDate = moment().tz("America/Los_Angeles").format("x");
const excelTemplateSaveName = currentDate + "excelTemplate.xlsx";

context("Bulk create public, private and reserved record-ids", () => {
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
              PrivatePoolTest,
              PublicPoolTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          testPrivateType = cmpFilterDocumentTypeIdByName(createdCompany, "Test Private Pool");
          testPublicType = cmpFilterDocumentTypeIdByName(createdCompany, "Test Public Pool");
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
                      id: testPublicType[0].id,
                    },
                    {
                      id: testPrivateType[0].id,
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
                      name: "approvals-built-in",
                      tabId: "overview",
                      type: "approvals",
                      index: 1,
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

      it("[API]Create Private type record", () => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>test private record</p>",
            document: {
              docId: "TPP-00001",
              documentType: {
                id: testPrivateType[0].id,
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
            name: "Private record",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formDocument: { id: createdDocumentForBulkCreation.id },
            formInput: {
              "fb-approvals-approvals-built-in": [],
              "blc-text-field-kv6ef2ii": "private",
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          testDocumentTypeDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: testDocumentTypeDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
              approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          });
        });
      });

      it("[API]Create Private type record", () => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>test private record</p>",
            document: {
              docId: "TPP-00003",
              documentType: {
                id: testPrivateType[0].id,
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
            name: "Private record two",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formDocument: { id: createdDocumentForBulkCreation.id },
            formInput: {
              "fb-approvals-approvals-built-in": [],
              "blc-text-field-kv6ef2ii": "private",
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          testDocumentTypeDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: testDocumentTypeDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
              approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          });
        });
      });

      it("[API]Create Public type record", () => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>public record</p>",
            document: {
              docId: "TPUP-00002",
              documentType: {
                id: testPublicType[0].id,
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
            name: "Public record",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formDocument: { id: createdDocumentForBulkCreation.id },
            formInput: {
              "fb-approvals-approvals-built-in": [],
              "blc-text-field-kv6ef2ii": "public",
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          testDocumentTypeDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: testDocumentTypeDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
              approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          });
        });
      });

      it("[API]Create Public type record", () => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>public record</p>",
            document: {
              docId: "TPUP-00004",
              documentType: {
                id: testPublicType[0].id,
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
            name: "Public record",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formDocument: { id: createdDocumentForBulkCreation.id },
            formInput: {
              "fb-approvals-approvals-built-in": [],
              "blc-text-field-kv6ef2ii": "public",
            },
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          testDocumentTypeDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: testDocumentTypeDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
              approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
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
        cy.url().then((url: any) => {
          blcForm = url;
        });
      });
    });
  });

  context("Create BLC1 with private pool type", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click create new from form button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    context("Fill Bulk creation document atributes", () => {
      it("Enter title 'Bulk Creation document'", () => {
        cy.drEnterDocumentTitle({ name: "Bulk Creation document BLC1" });
      });

      it("Enter description 'Bulk Creation document description'", () => {
        cy.drEnterDocumentDescription({ description: "Bulk Creation document description" });
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Refresh autocomplete for selecting form to be used in bulk creation", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-form-document-to-be-used\"]>div>div:nth-child(2)").arrowClick();
          cy.unClick();
        });
      });

      it("Select form to be used for bulk creation", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [data-cy=\"fb-form-document-to-be-used\"]")
          .autocompleteSelect("Document for bulk creation");
      });

      it("Select document type to be used for bulk creation", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [data-cy=\"fb-output-document-type\"]").autocompleteSelect("Test Private Pool");
      });

      it("Select 'yes' to have Document id column", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-add-column-document-record-id\"]").eq(0).check();
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

    context("Download template and verify size", () => {
      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Download excel template file", () => {
        cy.excelDownloadTemplate({ saveFileName: excelTemplateSaveName });
      });

      it("Verify file size", () => {
        cy.readFile(`cypress/downloads/${excelTemplateSaveName}`).should("have.length.within", 11800, 11900);
      });

      it("Verify popup message", () => {
        cy.checkToastMessageIsEqual({
          message: "Excel Template Successfully Downloaded. " +
        "Please open downloaded Excel Template and populate data. Then Upload to Import Data",
        });
        cy.closeAllAlertMessages();
      });
    });

    context("Test spreadsheet templates", () => {
      context("Test spreadsheet template with empty record id column", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordEmptyIdColumn.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "rows => 0 => Document Id must be defined.; rows => 1 => Document Id " +
            "must be defined.; rows => 2 => Document Id must be defined.; rows => 3 => Document " +
            "Id must be defined.; rows => 4 => Document Id must be defined.; rows => 5 => Document Id must be defined.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Test spreadsheet template with missing some record id cell", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordSomeIdsMissing.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "rows => 2 => Document Id must be defined.; rows => 3 => Document Id must be defined.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Test spreadsheet template with record id duplicate of record in system", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordDuplicatedIdSystem.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "These docIds: TPP-00001, TPP-00003 already exists in your Enlil environment.",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Test spreadsheet template with record id duplicate of another in template", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordDuplicatedIdSpreadsheet.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "There are duplicated docIds in sheet: TPP-00004, TPP-00007",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Test spreadsheet template with record id incorrect number format", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordIdLessThan5Numbers.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "TPP-0009 doesn't have correct number of digits (5).; TPP-02 doesn't " +
            "have correct number of digits (5).",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Test spreadsheet template with record id prefix from different record type", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordIdOtherTypePrefix.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "TPUP-00008 doesn't start with document type acronym (TPP-).",
          });
          cy.closeAllAlertMessages();
        });

        it("Remove file", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\" ]")
            .parent().parent()
            .find("button").arrowClick({ force: true });
        });
      });

      context("Test spreadsheet template with not existing record id prefix", () => {
        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordIdIncorrectPrefix.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
        });

        it("Verify error message", () => {
          cy.checkToastMessageIsEqual({
            message: "BLC-00008 doesn't start with document type acronym (TPP-).",
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

    context("Send bulk document BLC1 in review", () => {
      it("Upload template file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "recordIDBLC1Reserved.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
        cy.url().then((url: any) => {
          blc1 = url;
        });
      });
    });

    context("Create bulk records BLC2", () => {
      it(`Navigate to BLC form`, () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
          cy.visit(blcForm);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Click create new from form button", () => {
        cy.drCreateNewDocumentFromForm();
      });

      context("Fill Bulk creation document atributes", () => {
        it("Enter title 'Bulk Creation records public'", () => {
          cy.drEnterDocumentTitle({ name: "Bulk Creation records public BLC2" });
        });

        it("Enter description 'Bulk Creation public records'", () => {
          cy.drEnterDocumentDescription({ description: "Bulk Creation public records" });
        });

        it("Click on 'Details' tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Refresh autocomplete for selecting form to be used in bulk creation", () => {
          cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
            cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-form-document-to-be-used\"]>div>div:nth-child(2)").arrowClick();
            cy.unClick();
          });
        });

        it("Select form to be used for bulk creation", () => {
          cy.get("[id=\"sm-tabpanel-1\" ] [data-cy=\"fb-form-document-to-be-used\"]")
            .autocompleteSelect("Document for bulk creation");
        });

        it("Select document type to be used for bulk creation", () => {
          cy.get("[id=\"sm-tabpanel-1\" ] [data-cy=\"fb-output-document-type\"]")
            .autocompleteSelect("Test Public Pool");
        });

        it("Select 'yes' to have Document id column", () => {
          cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-add-column-document-record-id\"]").eq(0).check();
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
      });

      context("Send BLC2 document in review", () => {
        it("Click on 'Details' tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordIDBLC2.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Submit for approval", () => {
          cy.pmSubmitForApproval();
          cy.url().then((url: any) => {
            blc2 = url;
          });
        });
      });
    });

    context("Verify reserved ids", () => {
      context("Create record in UI and verify system does not assign reserved id", () => {
        it("Navigate to records", () => {
          cy.navigToRecords();
        });

        it("Click on 'Create a record' button", () => {
          cy.ptClickCreateNewPart();
        });

        it("Clicks on 'Test Private Pool' type", () => {
          cy.inspecSelectRecordFormFromMultiSelect({ recordType: "Test Private Pool" });
        });

        it("Verify assigned record ID is one not reserved in BLC", () => {
          cy.get("[data-cy=\"HeaderInfo-docId\"]").should("have.text", "TPP-00009");
        });
      });

      context("Reject BLC1", () => {
        it(`Navigate to BLC1`, () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
            cy.visit(blc1);
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Reject BLC1", () => {
          cy.ebWithdrawSubmisison();
        });
      });

      context("Create record in UI and verify reserved ids has been released", () => {
        it("Navigate to records", () => {
          cy.navigToRecords();
        });

        it("Click on 'Create a record' button", () => {
          cy.ptClickCreateNewPart();
        });

        it("Clicks on 'Test Private Pool' type", () => {
          cy.inspecSelectRecordFormFromMultiSelect({ recordType: "Test Private Pool" });
        });

        it("Verify assigned record ID is one released reserved in BLC", () => {
          cy.get("[data-cy=\"HeaderInfo-docId\"]").should("have.text", "TPP-00002");
        });
      });
    });

    context("Complete and release bulk create documents", () => {
      context("Finish BLC1", () => {
        it(`Navigate to BLC1`, () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
            cy.visit(blc1);
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Click on 'Details' tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Remove old spreadsheet", () => {
          cy.get("[id=\"sm-tabpanel-1\"] [id=\"fb-attachment-field-fb-spreadsheet-for-import-file\"]").parent().parent()
            .find("button").arrowClick({ force: true });
        });

        it("Upload template file", () => {
          cy.atchUploadTemplateForBLC({ fileName: "recordIDBLC1.xlsx" });
        });

        it("Click save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Click on 'Overview' tab", () => {
          cy.drSelectOverviewTab();
        });

        it("Submit for approval", () => {
          cy.pmSubmitForApproval();
        });

        it("Approve BLC1", () => {
          cy.ebApprove();
        });
      });

      context("Finish BLC2", () => {
        it(`Navigate to BLC2`, () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
            cy.visit(blc2);
          });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Approve BLC2", () => {
          cy.ebApprove();
        });
      });
    });

    context("Verify created record ids", () => {
      it("Navigate to record list and verify count", () => {
        cy.navigToDashboard();
        cy.wait(30 * 1000);
        cy.navigToRecords();
        cy.dlClearFilters();
        cy.dlVerifyDocCounter({ docCounterNumber: 18 });
      });

      context("Verify Test Private Pool records", () => {
        it("Filter docs by type", () => {
          cy.dlFilterByDocId({ docId: "TPP" });
        });

        it("Verify doc-ids are correct for created doc", () => {
          const recordIdsThatShouldBeOnRecordsList: string[] = [
            "TPP-00001",
            "TPP-00002",
            "TPP-00003",
            "TPP-00004",
            "TPP-00005",
            "TPP-00006",
            "TPP-00007",
            "TPP-00008",
            "TPP-00009",
            "TPP-00010",
          ];

          cy.get(`td[role=gridcell][data-grid-col-index="0"]`).each(($document) => {
            expect($document.text()).to.be.oneOf(recordIdsThatShouldBeOnRecordsList);
          });
        });
      });

      context("Verify Test Public Pool records", () => {
        it("Filter docs by type", () => {
          cy.dlClearFilters();
          cy.dlFilterByDocId({ docId: "TPUP" });
        });

        it("Verify doc-ids are correct for created doc", () => {
          const recordIdsThatShouldBeOnRecordsList: string[] = [
            "TPUP-00001",
            "TPUP-00002",
            "TPUP-00003",
            "TPUP-00004",
            "TPUP-00005",
            "TPUP-00006",
            "TPUP-00007",
            "TPUP-00008",
          ];

          cy.get(`td[role=gridcell][data-grid-col-index="0"]`).each(($document) => {
            expect($document.text()).to.be.oneOf(recordIdsThatShouldBeOnRecordsList);
          });
        });
      });
    });
  });
});

export { };

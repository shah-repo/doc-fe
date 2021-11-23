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
let testPrivateType;
let testPublicType;
let formDocumentType;
let createdDocumentForBulkCreation;
let testDocumentTypeDocument;
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
              {
                documentTypeName: "Test Private Pool",
                documentTypeAcronym: "TPP-",
                category: "Record",
                group: "RECORD",
                isQms: true,
                canRedLine: true,
                privateNumberPool: true,
                fieldsConfig: {
                  A1: {
                    label: "WIP",
                    visible: true,
                  },
                },
              },
              {
                documentTypeName: "Test Public Pool",
                documentTypeAcronym: "TPUP-",
                category: "Record",
                group: "RECORD",
                isQms: true,
                canRedLine: true,
                privateNumberPool: false,
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
        cy.get("ul[role=listbox]>li").contains("Test Private Pool").arrowClick();
      });

      it("Select 'yes' to have Document id column", () => {
        cy.get("[name=\"fb-add-column-document-record-id\"]").eq(0).check();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Download template and verify size", () => {
      it("Download excel template file", () => {
        cy.excelDownloadTemplate({ saveFileName: excelTemplateSaveName });
      });

      it("Verify file size", () => {
        cy.readFile(`cypress/downloads/${excelTemplateSaveName}`).should("have.length.within", 11800, 11900);
        cy.pause();
      });

      it("Verify popup message", () => {
        cy.checkToastMessageIsEqual({
          message: "Excel Template Successfully Downloaded. " +
        "Please open downloaded Excel Template and populate data. Then Upload to Import Data",
        });
        cy.closeAllAlertMessages();
      });
    });

    context("Upload template with empty", () => {
      it("Upload template file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "privateBulkExistDocId.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });


      it("Submit for approval", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });

      it("Verify error message", () => {
        cy.checkToastMessageIsEqual({
          message: "These docIds: TPP-00002 already exists in your Enlil environment.",
        });
        cy.closeAllAlertMessages();
      });

      it("Remove file", () => {
        cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
          .find("button").arrowClick({ force: true });
      });
    });

    context("Create bulk documents wih no specified id-s", () => {
      it("Select 'no' to have Document id column", () => {
        cy.get("[name=\"fb-add-column-document-record-id\"]").eq(1).check();
      });

      it("Upload template file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "privateBulkNoExistDocId.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve record", () => {
        cy.ebApprove();
      });
    });

    context("Verify created docs", () => {
      it("Navigate to document list and verify count", { retries: 2 }, () => {
        cy.navigToDashboard();
        cy.navigToDocumentList();
        cy.dlClearFilters();
        cy.dlVerifyDocCounter({ docCounterNumber: 9 });
      });

      it("Filter docs by type", () => {
        cy.dlFilterByType({ type: "TPP" });
      });

      it("Verify doc-ids are correct for created doc", () => {
        const documetsWhichShouldBeOnList: string[] = ["TPP-00001", "TPP-00002", "TPP-00003", "TPP-00004"];

        cy.get("div[aria-rowindex]>div[aria-colindex=\"1\"]").each(($document) => {
          expect($document.text()).to.be.oneOf(documetsWhichShouldBeOnList);
        });
      });
    });
  });

  context("Test public pool document type", () => {
    it("Filter by doc-id", () => {
      cy.dlClearFilters();
      cy.dlFilterByDocId({ docId: "FM-00004" });
    });

    it("Select first doc", () => {
      cy.dlSelectFirstDocument();
    });

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
        cy.get("ul[role=listbox]>li").contains("Test Public Pool").arrowClick();
      });

      it("Select 'yes' to have Document id column", () => {
        cy.get("[name=\"fb-add-column-document-record-id\"]").eq(0).check();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Upload template with existing doc-ids", () => {
      it("Upload template file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "publicBulkExistDocId.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });


      it("Submit for approval", () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });

      it("Verify error message", () => {
        cy.checkToastMessageIsEqual({
          message: "These docIds: TPUP-00001, TPUP-00003 already exists in your Enlil environment.",
        });
        cy.closeAllAlertMessages();
      });

      it("Remove file", () => {
        cy.get("#fb-attachment-field-fb-spreadsheet-for-import-file").parent().parent()
          .find("button").arrowClick({ force: true });
      });
    });

    context("Create bulk documents wih no specified id-s", () => {
      it("Select 'no' to have Document id column", () => {
        cy.get("[name=\"fb-add-column-document-record-id\"]").eq(1).check();
      });

      it("Upload template file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "publicBulkNoExistDocId.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Submit for approval", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve record", () => {
        cy.ebApprove();
      });
    });

    context("Verify created docs", () => {
      it("Navigate to document list and verify count", { retries: 2 }, () => {
        cy.navigToDashboard();
        cy.navigToDocumentList();
        cy.dlClearFilters();
        cy.dlVerifyDocCounter({ docCounterNumber: 11 });
      });

      it("Filter docs by type", () => {
        cy.dlFilterByType({ type: "TPUP" });
      });

      it("Verify doc-ids are correct for created doc", () => {
        const documetsWhichShouldBeOnList: string[] = ["TPUP-00001", "TPUP-00003", "TPUP-00005", "TPUP-00006"];

        cy.get("div[aria-rowindex]>div[aria-colindex=\"1\"]").each(($document) => {
          expect($document.text()).to.be.oneOf(documetsWhichShouldBeOnList);
        });
      });
    });
  });
});

export { };

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { ApprovalsDocType, ApprovalsInlineType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let group;
let initialArDocument;
let approvalRequestDocumentType;
let approvalsDocumentType;
let approvalsInlineType;
let formDocumentType;
let createdDocumentForBulkCreation;
let blcForm;

context("Bulk create approvals block/inline test", () => {
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
              ApprovalsDocType,
              ApprovalsInlineType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          approvalsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approvals Document Type");
          approvalsInlineType = cmpFilterDocumentTypeIdByName(createdCompany, "Approvals Inline Type");
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

      it("[API]Create Bulk Create form with approvals block", (done: any) => {
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
                description: "<p>Document form with approvals for bulk create</p>",
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
                name: "Document with approvals for BLC",
                referenceTo: [],
                retrain: false,
                revisionChangeType: RevisionChangeType.NextRevision,
                revisionStage: 1,
                formTemplate: {
                  outputDocumentTypes: [
                    {
                      id: approvalsDocumentType[0].id,
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

      it("[API]Create Bulk Create form with approvals inline", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Document form with inline approvals for bulk create</p>",
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
            name: "Document with inline approvals for BLC",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [
                {
                  id: approvalsInlineType[0].id,
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
                  index: 1,
                  type: "inlineapproval",
                  tabId: "overview",
                  name: "inline-approval-kw6gbxwm",
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
                  editorProperties: [],
                  label: "Inline approval",
                  editorConfig: {
                    groups: [
                      group.body[0].id,
                    ],
                  },
                },
                {
                  name: "approvals-built-in",
                  tabId: "overview",
                  type: "approvals",
                  index: 2,
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
        cy.url().then((url: any) => {
          blcForm = url;
        });
      });
    });
  });

  context("Start bulk creation flow for approvals block", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Click create new from form button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    context("Fill Bulk creation document atributes", () => {
      it("Enter title 'Bulk Creation document'", () => {
        cy.drEnterDocumentTitle({ name: "Bulk Creation document for approvals" });
      });

      it("Enter description 'Bulk Creation document description'", () => {
        cy.drEnterDocumentDescription({ description: "Bulk Creation approvals document description" });
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Refresh autocomplete for selecting form to be used in bulk creation", () => {
        cy.get("[name=\"fb-form-document-to-be-used\"]>div>div:nth-child(2)").arrowClick();
        cy.unClick();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist();
      });

      it("Select form to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-form-document-to-be-used\"]").autocompleteSelect("Document with approvals for BLC");
      });

      it("Select document type to be used for bulk creation", () => {
        cy.get("[data-cy=\"fb-output-document-type\"]").autocompleteSelect("Approvals Document Type");
      });

      it("Select 'no' to have Document id column", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-add-column-document-record-id\"]").check();
      });
    });

    context("Upload approvals block spreadsheet template", () => {
      it("Upload template file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "recordApprovalsBlock.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
      });

      it("Click on 'Overview' tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].email });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
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

  context("Start bulk creation flow for approvals inline", () => {
    it(`Navigate to BLC form`, () => {
      cy.visit(blcForm);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create new from form button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    context("Fill Bulk creation document atributes", () => {
      it("Enter title 'Bulk Creation document'", () => {
        cy.drEnterDocumentTitle({ name: "Bulk Creation document approvals inline" });
      });

      it("Enter description 'Bulk Creation document description'", () => {
        cy.drEnterDocumentDescription({ description: "Bulk Creation approvals inline document description" });
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

      it("Select form to be used for bulk creation", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [data-cy=\"fb-form-document-to-be-used\"]")
          .autocompleteSelect("Document with inline approvals for BLC");
      });

      it("Select document type to be used for bulk creation", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [data-cy=\"fb-output-document-type\"]")
          .autocompleteSelect("Approvals Inline Type");
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'no' to have Document id column", () => {
        cy.get("[id=\"sm-tabpanel-1\" ] [name=\"fb-add-column-document-record-id\"]").eq(1).check();
      });

      it("Save the from", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Click on 'Overview' tab", () => {
        cy.listLoadingElementShouldNotExist();
        cy.drSelectOverviewTab();
      });

      it("Add approval", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].email });
      });
    });

    context("Upload approvals block spreadsheet template", () => {
      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Upload template file", () => {
        cy.atchUploadTemplateForBLC({ fileName: "recordApprovalsInline.xlsx" });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
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
      cy.navigToDashboardWithoutApi();
      cy.wait(30 * 1000);
      cy.navigToRecords();
      cy.dlVerifyDocCounter({ docCounterNumber: 12 });
    });

    context("Verify approvals block records data", () => {
      context("Verify WIP records revision stage is alpha", () => {
        it("Filter approvals block records in WIP state", () => {
          cy.dlFilterByDocId({ docId: "ADT-" });
        });

        it("Filter approvals block records in WIP state", () => {
          SystemRequirement("REQ-4730");
          cy.filterRecordState({ state: "WIP" });
          cy.landingPageLoadingElementShouldAppear();
        });

        it("Verify WIP records number", () => {
          cy.dlVerifyDocCounter({ docCounterNumber: 2 });
        });

        it("Verify WIP records revision stage is alpha", () => {
          cy.filterRecordVerifyRevisionFilter({ revision: "A" });
        });
      });

      context("Verify Voided records revision stage is alpha", () => {
        it("Filter approvals block records in WIP state", () => {
          cy.filterRecordState({ state: "Voided" });
        });

        it("Verify WIP records number", () => {
          cy.dlVerifyDocCounter({ docCounterNumber: 2 });
        });

        it("Verify WIP records revision stage is alpha", () => {
          cy.filterRecordVerifyRevisionFilter({ revision: "A" });
        });
      });

      context("Verify released records", () => {
        context("Verify released record one", () => {
          it("Filter by record-id", () => {
            cy.dlClearFilters();
            cy.dlFilterByDocId({ docId: "ADT-00007" });
            cy.landingPageLoadingElementShouldAppear();
          });

          it("Select first record", () => {
            cy.dlSelectFirstDocument();
          });

          it("Verify owner", () => {
            cy.drVerifyDocumentOWner({ owner: USERS[1].name });
          });

          it("Verify approver", () => {
            cy.get(`div[data-cy="approved-${USERS[1].name}"]`)
              .should("exist", USERS[1].name);
          });

          it("Verify record release date", () => {
            cy.get("div[data-cy=releaseDate]").parent().parent().find("p")
              .should("have.text", "11/18/2021");
          });

          it("Verify record approve date", () => {
            cy.get(`div[data-cy="approved-${USERS[1].name}"]`)
              .should("contain", "November 18, 2021");
          });
        });

        context("Verify released record two", () => {
          it("Navigate to records", () => {
            cy.navigToRecords();
          });

          it("Filter by record-id", () => {
            cy.dlClearFilters();
            cy.dlFilterByDocId({ docId: "ADT-00008" });
            cy.landingPageLoadingElementShouldAppear();
          });

          it("Select first record", () => {
            cy.dlSelectFirstDocument();
          });

          it("Verify owner", () => {
            cy.drVerifyDocumentOWner({ owner: USERS[1].name });
          });

          it("Verify approver", () => {
            cy.get(`div[data-cy="approved-${USERS[1].name}"]`)
              .should("exist", USERS[1].name);
          });

          it("Verify record release date", () => {
            cy.get("div[data-cy=releaseDate]").parent().parent().find("p")
              .should("have.text", "11/18/2021");
          });

          it("Verify record approve date", () => {
            cy.get(`div[data-cy="approved-${USERS[1].name}"]`)
              .should("contain", "November 18, 2021");
          });
        });
      });
    });

    context("Verify approvals inline records data", () => {
      context("Verify WIP records revision stage is numeric", () => {
        it("Navigate to records", () => {
          cy.navigToRecords();
        });

        it("Filter approvals block records in WIP state", () => {
          cy.dlClearFilters();
          cy.dlFilterByDocId({ docId: "AIT-" });
          cy.landingPageLoadingElementShouldAppear();
          cy.wait(1000);
        });

        it("Filter approvals block records in WIP state", () => {
          cy.filterRecordState({ state: "WIP" });
        });

        it("Verify WIP records number", () => {
          cy.dlVerifyDocCounter({ docCounterNumber: 2 });
        });

        it("Verify WIP records revision stage is numeric", () => {
          cy.filterRecordVerifyRevisionFilter({ revision: "1" });
        });
      });

      context("Verify Voided records revision stage is numeric", () => {
        it("Filter approvals block records in WIP state", () => {
          cy.filterRecordState({ state: "Voided" });
        });

        it("Verify WIP records number", () => {
          cy.dlVerifyDocCounter({ docCounterNumber: 2 });
        });

        it("Verify WIP records revision stage is numeric", () => {
          cy.filterRecordVerifyRevisionFilter({ revision: "1" });
        });
      });

      context("Verify released records", () => {
        context("Verify released record one", () => {
          it("Filter by record-id", () => {
            cy.dlClearFilters();
            cy.dlFilterByDocId({ docId: "AIT-00013" });
            cy.landingPageLoadingElementShouldAppear();
          });

          it("Select first record", () => {
            cy.dlSelectFirstDocument();
          });

          it("Verify owner", () => {
            cy.drVerifyDocumentOWner({ owner: USERS[1].name });
          });

          it("Verify approver", () => {
            cy.get("div[data-cy=releasedBy]")
              .should("contain", USERS[1].name);
          });

          it("Verify record release date", () => {
            cy.get("div[data-cy=releasedDate")
              .should("contain.text", "Released Date: 11/18/2021");
          });

          it("Verify record approve date", () => {
            cy.get("div[data-cy=fb-approval-history-0]")
              .should("contain", "18 Nov 2021");
          });
        });

        context("Verify released record two", () => {
          it("Navigate to records", () => {
            cy.navigToRecords();
          });

          it("Filter by record-id", () => {
            cy.dlClearFilters();
            cy.dlFilterByDocId({ docId: "AIT-00014" });
            cy.landingPageLoadingElementShouldAppear();
          });

          it("Select first record", () => {
            cy.dlSelectFirstDocument();
          });

          it("Verify owner", () => {
            cy.drVerifyDocumentOWner({ owner: USERS[1].name });
          });

          it("Verify approver", () => {
            cy.get("div[data-cy=releasedBy]")
              .should("contain", USERS[1].name);
          });

          it("Verify record release date", () => {
            cy.get("div[data-cy=releasedDate]")
              .should("contain.text", "Released Date: 11/18/2021");
          });

          it("Verify record approve date", () => {
            cy.get("div[data-cy=fb-approval-history-0]")
              .should("contain", "18 Nov 2021");
          });
        });
      });
    });
  });
});

export { };

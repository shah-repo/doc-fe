/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { RecordDocumentType, TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let secondEmployee;
let recordDocumentType;
let testDocumentType;
let approvalRequestDocumentType;
let formDocumentType;
let group;
let initialArDocument;
let createdRecordFormDocument;
let createdTestDocumentFormDocument;


context("Document form upgrade", () => {
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
              RecordDocumentType,
              TestDocumentType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          recordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record Document");
          testDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Test Document Type");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create and release form for Record", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: secondEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Record form</p>",
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
              name: "Record form",
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
                    label: "form.builder.approvals",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-kn7fbu5l",
                    uniqueSchemaItem: true,
                    index: 0,
                    tabId: "overview",
                  },
                  {
                    index: 1,
                    type: "section",
                    name: "old-textfield-kn7fc209",
                    validationMode: "default",
                    label: "Old section",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "Old textfield",
                  },
                  {
                    index: 2,
                    type: "textfield",
                    name: "old-textfield-kn7fc7w4",
                    rows: 1,
                    validationMode: "default",
                    label: "Old textfield",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "Old textfield",
                  },
                ],
              },
            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdRecordFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdRecordFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
              },
              employeeId: secondEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => done());
          });
        });
      });
    });

    it("[API]Create and release form for Document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Test document Form</p>",
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
          name: "Test document Form",
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
                index: 0,
                type: "section",
                name: "old-section-kn7ffn15",
                validationMode: "default",
                label: "Old section",
                tabId: "overview",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                applicableValidationSchema: true,
                validationAttribute: "Old section",
              },
              {
                index: 1,
                type: "textfield",
                tabId: "overview",
                name: "old-textfield-kn7fg4bj",
                rows: 1,
                validationMode: "default",
                label: "Old textfield",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                applicableValidationSchema: true,
                validationAttribute: "Old textfield",
              },
            ],
          },
        },
        employeeId: secondEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdTestDocumentFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdTestDocumentFormDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
          },
          employeeId: secondEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create a record from form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the Record form", () => {
      cy.dlFilterByDocTitle({ docTitle: "Record form" });

      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
      cy.wait(2000);
    });

    context("Fill out the required fields", () => {
      it("Enter title", () => {
        cy.drEnterDocumentTitle( { name: "Record for form upgrade" });
      });

      it("Enter description", () => {
        cy.drEnterDocumentDescription( { description: "Test record form upgrade" });
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Enter text in old textfield", () => {
        cy.get("[name^=\"old-textfield\"]").arrowType("Test one");
      });
    });

    context("Save document", () => {
      it("Save the document", () => {
        cy.drClickSaveWithoutApiCall();
      });
    });
  });

  context("Create a document from form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the Document form", () => {
      cy.dlClearFilters();

      cy.dlFilterByDocTitle({ docTitle: "Test document form" });

      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    context("Fill out the required fields", () => {
      it("Enter title", () => {
        cy.drEnterDocumentTitle( { name: "Document for form upgrade" });
      });

      it("Enter description", () => {
        cy.drEnterDocumentDescription( { description: "Test document form upgrade" });
      });

      it("Enter text in old textfield", () => {
        cy.get("[name^=\"old-textfield\"]").arrowType("Test one");
      });
    });

    context("Save document", () => {
      it("Save the document", () => {
        cy.drClickSaveWithoutApiCall();
      });
    });
  });

  context("Revise the Record form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the created Record form", () => {
      cy.dlClearFilters();

      cy.dlFilterByDocTitle({ docTitle: "Record form" });

      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Click on Revise button", () => {
      cy.drClickReviseDocument();
      cy.drClickSaveWithoutApiCall();
    });

    context("Add a new fields to the form", () => {
      it("Add a new section", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
        cy.fbEnterLabel({ label: "New section" });
        cy.fbAddNewFieldButton();
      });

      it("Add a new textfield", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterLabel({ label: "New textfield" });
        cy.fbAddNewFieldButton();
      });
    });

    context("Release updated form", () => {
      it("Save the form", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Approve and release", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });
  });

  context("Revise the Document form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select the created Document form", () => {
      cy.dlClearFilters();

      cy.dlFilterByDocId({ docId: "FM-00004" });

      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Click on Revise button", () => {
      cy.drClickReviseDocument();
      cy.drClickSaveWithoutApiCall();
    });

    context("Add a new fields to the form", () => {
      it("Add a new section", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
        cy.fbEnterLabel({ label: "New section" });
        cy.fbAddNewFieldButton();
      });

      it("Add a new textfield", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterLabel({ label: "New textfield" });
        cy.fbAddNewFieldButton();
      });
    });

    context("Release updated form", () => {
      it("Save the form", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Approve and release", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });
    });
  });

  context("Upgrade document to new form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Select document", () => {
      cy.dlClearFilters();

      cy.dlFilterByDocId({ docId: "TDT-00005" });

      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Click on upgrade to new form", () => {
      cy.drClickUpgradeForm();
    });

    context("Verify form upgrade", () => {
      it("Verify banner disappeared", () => {
        cy.get("input[data-cy=\"formUpgradeButton\"]").should("not.exist");
      });

      it("Verify existing fields", () => {
        cy.get("input[name^=\"old-textfield\"]").should("have.value", "Test one");
      });

      it("Verify newly added fields", () => {
        cy.get("span[data-cy=\"New section\"]").should("exist");
        cy.get("input[name^=\"new-textfield\"]").should("exist");
      });

      it("Enter value to new textfield", () => {
        cy.get("input[name^=\"new-textfield\"]").arrowType("Test two");
      });
    });

    context("Release updated document", () => {
      it("Save the form", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Approve and release", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      });

      it("Verify released upgraded document", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        cy.get("div[name^=\"new-textfield\"]").should("have.text", "Test two");
      });
    });
  });

  context("Upgrade record to new form", () => {
    it("Navigate to Record list", () => {
      cy.navigToRecords();
    });

    it("Select Record", () => {
      cy.dlFilterByDocId({ docId: "RD-00002" });
      cy.dlSelectFirstDocumentWithoutApi();
    });

    it("Click on upgrade to new form", () => {
      cy.drClickUpgradeForm();
    });

    context("Verify record upgrade", () => {
      it("Verify banner disappeared", () => {
        cy.get("input[data-cy=\"formUpgradeButton\"]").should("not.exist");
      });

      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Verify existing fields", () => {
        cy.get("input[name^=\"old-textfield\"]").should("have.value", "Test one");
      });

      it("Navigate to Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Verify newly added fields", () => {
        cy.get("span[data-cy=\"New section\"]").should("exist");
        cy.get("input[name^=\"new-textfield\"]").should("exist");
      });

      it("Enter value to new textfield", () => {
        cy.get("input[name^=\"new-textfield\"]").arrowType("Test two");
      });

      context("Release updated record", () => {
        it("Add approvals", () => {
          cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].email });
        });

        it("Save upgraded record", () => {
          cy.drClickSaveWithoutApiCall();
        });

        it("Submit for an approval", () => {
          cy.pmSubmitForApprovalWithoutAPI();
        });

        it("Approve the record", () => {
          cy.ebApproveWithoutApi();
        });
      });

      context("Verify released upgraded record", () => {
        it("Verify status", () => {
          cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
        });

        it("Verify added textfield", () => {
          cy.get("div[name^=\"new-textfield\"]").should("have.text", "Test two");
        });
      });
    });
  });

  context("Revise record and check for banner", () => {
    it("Revise record", () => {
      cy.get("[data-cy=\"updateRecord\"]").click();
      cy.progressBarShouldAppear();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on revisions tab on side panel", () => {
      cy.drClickRevisionsSidePanel();
    });

    it("Check that A.1 version was created", () => {
      cy.recCheckRevisionStage({ stage: "Revision A.1" });
    });

    context("Check that revised record does not have upgraded to new form banner", () => {
      it("Upgrade banner should not exist", () => {
        cy.get("input[data-cy=\"formUpgradeButton\"]").should("not.exist");
      });
    });
  });
});

export { };


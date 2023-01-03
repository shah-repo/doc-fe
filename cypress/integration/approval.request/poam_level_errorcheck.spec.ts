// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { LINE_ITEMS_STATUS_TYPES } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let secondEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let formDocumentType;
let group;
let poamDocumentType;
let createdPOAMform;
let createdPOAMdoc;

context("Approval Request landing page test", () => {
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
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
            documentTypes: [
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          poamDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "PO Approval Matrix");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create POAM form", (done: any) => {
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
              description: "<p>POAM form</p>",
              document: {
                docId: "FM-00010",
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
              name: "POAM form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: poamDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "po-levels-built-in",
                    type: "poApprovalMatrix",
                    index: 0,
                    label: "Purchase Order Approval Matrix",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Purchase Order Approval Matrix",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                ],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPOAMform = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPOAMform.id,
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

    it("[API]Create POAM document", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            formDocument: {
              id: createdPOAMform.id,
            },
            formInput: {
              "po-levels-built-in": {
                approvalLevels: [
                  {
                    id: "29f145c3-f0bb-43e6-8df9-38e339357a1b",
                    signatures: [
                      {
                        id: "b4b6c0d1-eab2-48e4-b0c1-99211805601d",
                        signatureStage: 1,
                        groups: [
                          {
                            id: group.body[0].id,
                          },
                        ],
                        employees: [],
                      },
                      {
                        id: "f4bbbf1c-e3c5-4a38-9508-5176792614a8",
                        signatureStage: 2,
                        groups: [],
                        employees: [],
                      },
                      {
                        id: "6a81c552-4ceb-44cc-9279-f8a4f1abe449",
                        signatureStage: 3,
                        groups: [],
                        employees: [],
                      },
                    ],
                    limit: 1000,
                    name: "Level-1",
                  },
                ],
              },
            },
            description: "<p>POAM</p>",
            document: {
              docId: "POAM-00001",
              documentType: {
                id: poamDocumentType[0].id,
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
            name: "POAM doc",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdPOAMdoc = response;
          cy.drAPIApproveAndRelease({
            documentId: createdPOAMdoc.id,
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

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Open released document and revise it", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Open released document", () => {
      cy.drFilterDocListByNameAndStatus({ title: "POAM doc", status: "Released" });
    });

    it("Click revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Navigate to Matrix Details Tab", () => {
      cy.drSelectMatrixDetailsTab();
    });

    it("Click add item", () => {
      cy.get(`[data-cy="form.builder.add.item"]`).arrowClick();
      cy.get(`[data-cy="name"]`).arrowType("Level-1");
      cy.get(`[data-cy="limit"]`).arrowType("2000");
      cy.get(`[data-cy="signatures.0.groups"]`).autocompleteSelect("Everyone");
      cy.get(`[data-cy="signatures.0.employees"]`).autocompleteSelect(USERS[1].name);
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });

    it("Verify system is showing error for duplicate entry", () => {
      cy.checkToastMessageContains({ message: "PO matrix can't have duplicate limits or level names" });
      cy.closeAllAlertMessages();
    });

    it("Click on the recently added level and change level name", () => {
      cy.get(`[data-cy="form.builder.add.item"]`).arrowClick();
      cy.get(`[data-cy="name"]`).arrowType("Level-2");
      cy.get(`[data-cy="limit"]`).arrowType("2000");
      cy.get(`[data-cy="signatures.0.groups"]`).autocompleteSelect("Everyone");
      cy.get(`[data-cy="signatures.0.employees"]`).autocompleteSelect(USERS[1].name);
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });

    it("Save document and verify document saved without error", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("Add another level", () => {
      cy.get(`[data-cy="form.builder.add.item"]`).arrowClick();
      cy.get(`[data-cy="name"]`).arrowType("Level-3");
      cy.get(`[data-cy="limit"]`).arrowType("2000");
      cy.get(`[data-cy="signatures.0.groups"]`).autocompleteSelect("Everyone");
      cy.get(`[data-cy="signatures.0.employees"]`).autocompleteSelect(USERS[1].name);
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });

    it("Verify system is showing error for duplicate entry", () => {
      cy.checkToastMessageContains({ message: "PO matrix can't have duplicate limits or level names" });
      cy.closeAllAlertMessages();
    });

    it("Click on the recently added level and change limit", () => {
      cy.get(`[data-cy="form.builder.add.item"]`).arrowClick();
      cy.get(`[data-cy="name"]`).arrowType("Level-3");
      cy.get(`[data-cy="limit"]`).arrowType("3000");
      cy.get(`[data-cy="signatures.0.groups"]`).autocompleteSelect("Everyone");
      cy.get(`[data-cy="signatures.0.employees"]`).autocompleteSelect(USERS[1].name);
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });

    it("Save document and verify document saved without error", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("Click on the First level", () => {
      cy.get("tbody>tr").eq(0).arrowClick();
    });

    it("Change level name as in second level", () => {
      cy.get(`[data-cy="name"]`).clear().arrowType("Level-2");
    });

    it("Change limit as in second level", () => {
      cy.get(`[data-cy="limit"]`).clear().arrowType("2000");
    });

    it("Click add button", () => {
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });

    it("Save document", () => {
      cy.get(`[data-cy="DocumentRevisionForm-submit"]`).arrowClick();
    });

    it("Verify system is showing error for duplicate entry", () => {
      cy.checkToastMessageContains({ message: "PO matrix can't have duplicate limits or level names" });
      cy.closeAllAlertMessages();
      cy.wait(2000);
    });

    it("Click on the First level and change level name to original", () => {
      cy.get("tbody>tr").eq(0).arrowClick();
      cy.get(`[data-cy="name"]`).clear().arrowType("Level-1");
    });

    it("Click add button", () => {
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });

    it("Verify system is showing error for duplicate entry", () => {
      cy.checkToastMessageContains({ message: "PO matrix can't have duplicate limits or level names" });
      cy.closeAllAlertMessages();
      cy.wait(2000);
    });

    it("Click on the First level and change limit to original", () => {
      cy.get("tbody>tr").eq(0).arrowClick();
      cy.get(`[data-cy="name"]`).clear().arrowType("Level-1");
      cy.get(`[data-cy="limit"]`).clear().arrowType("1000");
    });

    it("Click add button", () => {
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });

    it("Save document and verify document saved without error", () => {
      cy.drSaveDocumentWithoutaudit();
    });
  });

  context(`Add ${USERS[2].name} as approver`, () => {
    it("Click 'Approve and Release' button", () => {
      cy.poAMCheckForApproval();
    });

    it(`Select ${USERS[2].name}`, () => {
      cy.poAMSelectApprover(USERS[2].name);
    });

    it("Enter password", () => {
      cy.poAMEnterPassword();
    });

    it("Click 'Confirm' button", () => {
      cy.poAMApproveButton();
    });
  });

  context(`Approve as a ${USERS[2].name}`, () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Navigates to Approval Requests", () => {
      cy.navigToApprovalRequestList();
    });

    it("Choose AR", () => {
      cy.arFilterARListByNameAndStatus({ title: "POAM doc", status: LINE_ITEMS_STATUS_TYPES.IN_REVIEW });
    });

    it("Click 'Approve Submission' button", () => {
      cy.poAMApproveSubmissionButton();
    });

    it("Enter password", () => {
      cy.poAMEnterPassword();
    });

    it("Click 'Confirm' button", () => {
      cy.get(`[data-cy="passwordConfirm"]`).arrowClick();
    });
  });

  context(`Close the AR and verify it is closed without throwing any error message`, () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigates to Approval Requests", () => {
      cy.navigToApprovalRequestList();
    });

    it("Choose AR", () => {
      cy.arClearFilters();
      cy.arFilterARListByNameAndStatus({ title: "POAM doc", status: LINE_ITEMS_STATUS_TYPES.APPROVED });
    });

    it("Close AR and verify AR closed without throwing any error message", () => {
      cy.arCloseAR();
    });

    it("Verify status of AR", () => {
      cy.arVerifyStatus({ status: LINE_ITEMS_STATUS_TYPES.CLOSED });
    });
  });
});

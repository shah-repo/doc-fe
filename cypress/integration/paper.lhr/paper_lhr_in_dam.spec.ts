/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let developersGroup;
let formDocumentType;
let damDocumentType;
let group;
let createdDAMForm;
let approvalRequestDocumentType;
let initialArDocument;

const paperLhrDocType = "Paper Lot History Record";

context("Verify Paper LHR", () => {
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
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          damDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Document Approval Matrix");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
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

    it("[API]Get group", () => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });

    it("[API]Create DAM form", (done: any) => {
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
              description: "<p>DAM form</p>",
              document: {
                docId: "FM-00011",
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
              name: "DAM form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: damDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "dam-built-in",
                    type: "approvalMatrix",
                    index: 0,
                    label: "Approval Matrix",
                    tabId: "matrixdetails",
                    deleteDisabled: true,
                    uniqueSchemaItem: true,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "dar-built-in",
                    type: "approvalRoles",
                    index: 1,
                    label: "Approval Roles",
                    tabId: "approvalroles",
                    deleteDisabled: true,
                    uniqueSchemaItem: true,
                    deleteInFormDisabled: true,
                  },
                ],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdDAMForm = response;
            cy.drAPIApproveAndRelease({
              documentId: createdDAMForm.id,
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context(`check 'Paper lhr' exist in DAM document`, () => {
    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Filter dam document", () => {
      cy.dlFilterByDocTitle({ docTitle: "DAM form document" });
    });

    it("Open first document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Click 'Create New' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[data-cy=\"PreviewControlsContainer-createNew\"]").arrowClick();
      });
    });

    it("navigate to matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
    });

    it(`Verify '${paperLhrDocType}' have acronym 'LHR-'`, () => {
      cy.contains(paperLhrDocType).parent()
        .prev().prev().should("have.text", "LHR-");
    });

    it(`Verify '${paperLhrDocType}' have internal group 'PAPER_LHR'`, () => {
      cy.contains(paperLhrDocType).parent()
        .prev().should("have.text", "PAPER_LHR");
    });
  });

  context("Navigate to Document Type Management and check 'Paper lhr' exist", () => {
    it("Navigate to Document Type Management", () => {
      cy.navigToDocumentTypeManagement();
    });

    it(`Filter by document type '${paperLhrDocType}'`, () => {
      cy.dtmClearFilters();
      cy.get(`[aria-colindex="2"] input`).arrowType(paperLhrDocType);
    });

    it("Verify document type", () => {
      cy.get(`[aria-rowindex="3"]`).find(`[aria-colindex="2"]`).should("have.text", paperLhrDocType);
    });

    it(`Verify acronym for '${paperLhrDocType}'`, () => {
      cy.get(`[aria-rowindex="3"]`).find(`[aria-colindex="3"]`).should("have.text", "LHR-");
    });

    it(`Verify internal group for '${paperLhrDocType}'`, () => {
      cy.get(`[data-grid-col-index="12"]`).prev().should("have.text", "PAPER_LHR");
    });
  });
});

export { };


/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { PaperLHR } from "../../utils/constants/documentTypes/paperLhr";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;

let lhrUrl;
let createdPartDocument;
let developersGroup;
let secondEmployee;
let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let partDocumentType;
let createdLotsFormDocument;
let formDocumentType;
let paperLhrDocumentType;
let thirdEmployee;
let allGroups;
let caGroup;

context("Change Ownership of Paper LHR", () => {
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
            name: newCompanyName,
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              PaperLHR,
              MPITest,
              LHRTTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          paperLhrDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PaperLHR.documentTypeName);
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

    it("[API]Create part document", (done: any) => {
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
              description: "<p>Part document</p>",
              document: {
                docId: "CS-00005",
                documentType: {
                  id: partDocumentType[0].id,
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
              name: "Part document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPartDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartDocument.id,
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

    it("[API]Create unreleased part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>unreleased part document</p>",
          document: {
            docId: "CS-00010",
            documentType: {
              id: partDocumentType[0].id,
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
          name: "Unreleased part document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => {
        done();
      });
    });

    it("[API]Create LHRt form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>LHRT document</p>",
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
          name: "LHRT document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: paperLhrDocumentType[0].id,
            }],
            schema: [
              {
                name: "lhr-selected-part",
                type: "partsselection",
                index: 0,
                tabId: "details",
                label: "Part to be Manufactured",
                deleteDisabled: true,
                deleteInFormDisabled: true,
                editorConfig: {
                  id: createdPartDocument.documentId,
                },
              },
              {
                name: "lhr_initial_quantity",
                type: "quantity",
                index: 1,
                tabId: "details",
                label: "Initial Quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "Initial Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lhr-end-quantity",
                type: "quantity",
                index: 2,
                tabId: "details",
                label: "End Quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "End Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lhr-build-type",
                type: "radiogroup",
                index: 3,
                tabId: "details",
                label: "Build Type",
                options: [
                  {
                    text: "R&D",
                    value: "R&D",
                  },
                  {
                    text: "Production",
                    value: "Production",
                  },
                ],
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                validationAttribute: "Build Type",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                tabId: "details",
                deleteDisabled: true,
                name: "fb-approvals-kvateryo",
                uniqueSchemaItem: true,
                index: 6,
              },
            ],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdLotsFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLotsFormDocument.id,
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

    it("[API]Get group", (done: any) => {
      cy.grpGetGroups({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        allGroups = response;
        cy.log(response);
        developersGroup = allGroups.find((group) => group.name === "Developers");
        caGroup = allGroups.find((group) => group.name === "Company Admin");
        done();
      });
    });

    it("[API]Patch 'Company Admin' group", () => {
      cy.grpPatchGroup({
        groupId: caGroup.id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }, { id: thirdEmployee.id }],
          tags: [
            GroupTag.DASHBOARD_ADMIN,
            GroupTag.OWNERSHIP_CHANGE,
          ],
        },
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }, { id: secondEmployee.id }, { id: thirdEmployee.id }],
          tags: [...developersGroup.tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
            GroupTag.OWNERSHIP_CHANGE,
          ],
        },
      });
    });

    it("[API]Update company navigation", (done: any) => {
      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId as unknown as string,
        payload: {
          navigation: [
            {
              icon: "/navigation_icons/dashboard.svg",
              path: "/",
              type: "LINK",
              label: "Dashboard",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/document.svg",
                  path: "/document_revision",
                  type: "LINK",
                  label: "Document List",
                },
                {
                  icon: "/navigation_icons/cr.svg",
                  path: "/change_request",
                  type: "LINK",
                  label: "Approval Requests",
                },
                {
                  icon: "/navigation_icons/text-paper.svg",
                  type: "CATEGORY",
                  label: "Records",
                  category: "Record",
                },
              ],
              type: "MENU",
              label: "Document Control",
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              type: "CATEGORY",
              label: "Equipment",
              category: "Equipment",
            },
            {
              icon: "/navigation_icons/supplier-menu.svg",
              menu: [
                {
                  icon: "/navigation_icons/supplier-list.svg",
                  type: "CATEGORY",
                  label: "Supplier List",
                  category: "Supplier",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Supplier Management",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/receipt_list.svg",
              type: "CATEGORY",
              label: "Purchase Orders",
              category: "Purchase Order",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/cart-simple-in.svg",
              type: "CATEGORY",
              label: "Receiving",
              category: "Receive",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/tools.svg",
              menu: [
                {
                  icon: "/navigation_icons/icon_parts.svg",
                  type: "CATEGORY",
                  label: "Parts",
                  category: "Parts",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/todo.svg",
                  type: "CATEGORY",
                  label: "Work Orders",
                  category: "Work Order",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/tag-check.svg",
                  type: "CATEGORY",
                  label: "Lots",
                  category: "Lot",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
                {
                  icon: "/navigation_icons/lhr_icon.svg",
                  type: "CATEGORY",
                  label: "LHR",
                  category: "Lhr",
                  restrictedToUsersWithTags: [
                    GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
                  ],
                },
              ],
              type: "MENU",
              label: "Manufacturing",
              restrictedToUsersWithTags: [
                GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
              ],
            },
            {
              icon: "/navigation_icons/group-management.svg",
              path: "/group_management",
              type: "LINK",
              label: "Group Management",
              restrictedToUsersWithTags: [
                GroupTag.GROUP_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/user-management.svg",
              path: "/user_management",
              type: "LINK",
              label: "User Management",
              restrictedToUsersWithTags: [
                GroupTag.USER_MANAGEMENT,
              ],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [
                GroupTag.DOCUMENT_TYPE_MANAGEMENT,
              ],
            },
          ],
        },
      }).then(() => {
        done();
      });
    });
  });

  context("Login User 1", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create LHR document", () => {
    context("Start document creation flow", () => {
      it("Navigate to LHR list", () => {
        cy.navigToLHR();
      });

      it("Click on 'Initiate New LHR' button", () => {
        cy.recCreateRecordFromLandingPage();
      });

      it("Select Lot History Record", () => {
        cy.recSelectRecordFormFromMultiSelect({
          recordType: PaperLHR.documentTypeName,
        });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      });

      it("Enter end quantity", () => {
        cy.get("[name=\"lhr-end-quantity\"]").arrowType("10");
      });

      it("Select 'R&D' build type", () => {
        cy.unClick();
        cy.get("[value=\"R&D\"]").check();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Click on sidebar permission icon to add Operators", () => {
        cy.get("[data-cy='permission-icon']").arrowClick();
      });

      it(`Assign operator '${USERS[2].name}'`, () => {
        cy.drAssignDocumentTo({ username: USERS[2].name });
        cy.wait(2000);
      });

      it("Add an Approver 1", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[2].name);
        cy.unClick();
      });

      it("Add an Approver 2", () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[3].name);
        cy.unClick();
      });

      it("Click save document", () => {
        cy.url().then((url: any) => {
          lhrUrl = url;
        });
        cy.drClickCreateDocumentWithApiCallForForms();
      });

      it("Check history - added approvers should be displayed", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit], () => {
          cy.drSelectHistoryTab();
        });
        cy.get("[data-cy=\"change-key-0-0\"]").parent().parent()
          .should("contain.text", "Approver Added").and("contain.text", USERS[3].name);
        cy.get("[data-cy=\"change-key-1-0\"]").parent().parent()
          .should("contain.text", "Approver Added").and("contain.text", USERS[2].name);
      });
    });
  });

  context(`Login with User ${USERS[3].name} and add/remove approver`, () => {
    it("Log out user", () => {
      cy.authLogout();
    });

    it(`Log in as User 3 (${USERS[3].name})`, () => {
      cy.authLogin({
        email: USERS[3].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
    });

    it("Visit LHR", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
        CyRoutes.GetSpecificDocumentType,
      ], () => {
        cy.visit(lhrUrl);
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Change ownership of LHR", () => {
      cy.drChangeOwnerFromMenu({ employee: USERS[3].name });
    });

    it("Verify 2 approvers should exist", () => {
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").parent().parent().parent().parent()
        .find(".MuiChip-deletable").should("have.length", 2);
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").parent().parent().parent().parent()
        .find(".MuiChip-deletable").should("contain.text", USERS[2].name);
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").parent().parent().parent().parent()
        .find(".MuiChip-deletable").should("contain.text", USERS[3].name);
    });

    it("Check history - added approvers should be displayed", () => {
      cy.get("[data-cy=\"change-key-1-0\"]").parent().parent()
        .should("contain.text", "Approver Added").and("contain.text", USERS[3].name);
      cy.get("[data-cy=\"change-key-2-0\"]").parent().parent()
        .should("contain.text", "Approver Added").and("contain.text", USERS[2].name);
    });

    it(`Remove ${USERS[3].name} approver`, () => {
      cy.contains(`${USERS[3].name} - ${USERS[3].email}`).parent().parent().find(".MuiChip-deleteIcon").arrowClick();
    });

    it(`Add ${USERS[1].name} approver`, () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[1].name);
        cy.unClick();
      });
    });

    it("Check history - added and removed approvers should be displayed", () => {
      cy.wait(3000);
      cy.get("[data-cy=\"change-key-0-0\"]").parent().parent()
        .should("contain.text", "Approver Added").and("contain.text", USERS[1].name);
      cy.get("[data-cy=\"change-key-1-0\"]").parent().parent()
        .should("contain.text", "Approver Removed").and("contain.text", USERS[3].name);
    });
  });

  context("Operator should be able to edit LHR fields", () => {
    it("Log out user", () => {
      cy.authLogout();
    });

    it("Log in as User 2 (operator)", () => {
      cy.authLogin({
        email: USERS[2].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName, multiple: true });
    });

    it("Visit LHR", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
        CyRoutes.GetSpecificDocumentType,
      ], () => {
        cy.visit(lhrUrl);
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify 2 approvers should exist", () => {
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").parent().parent().parent().parent()
        .find(".MuiChip-deletable").should("have.length", 2);
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").parent().parent().parent().parent()
        .find(".MuiChip-deletable").should("contain.text", USERS[2].name);
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").parent().parent().parent().parent()
        .find(".MuiChip-deletable").should("contain.text", USERS[1].name);
    });

    it(`Operator can add ${USERS[4].name} approver`, () => {
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[4].name);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("visit the LHR", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
        CyRoutes.GetSpecificDocumentType,
      ], () => {
        cy.visit(lhrUrl);
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Operator can remove ${USERS[4].name} approver`, () => {
      cy.contains(USERS[4].name).last().parent().parent().find(".MuiChip-deleteIcon").arrowClick();
    });

    it("Check history - added and removed approvers should be displayed", () => {
      cy.wait(3000);
      cy.get("[data-cy=\"change-key-0-0\"]").parent().parent()
        .should("have.text", `Approver Removed${USERS[4].name}`);
      cy.get("[data-cy=\"change-key-1-0\"]").parent().parent()
        .should("have.text", `Approver Added${USERS[4].name}`);
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApproval();
    });
  });
});

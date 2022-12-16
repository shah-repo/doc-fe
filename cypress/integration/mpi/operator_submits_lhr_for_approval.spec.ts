/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
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
let equipmentDocumentType;
let materialsDocumentType;
let partDocumentType;
let equipmentDocument;
let materialsDocument;
let mpiDocument;
let mpiDocumentType;
let createdLotsFormDocument;
let formDocumentType;
let lhrDocumentType;


context("Owner submits LHR for approval", () => {
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
              LotHistoryRecordTest,
              MPITest,
              LHRTTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
          mpiDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          lhrDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, LotHistoryRecordTest.documentTypeName);
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


    it("[API]Create equipment one", () => {
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
              description: "<p>Equipment one</p>",
              document: {
                docId: "ET-00003",
                documentType: {
                  id: equipmentDocumentType[0].id,
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
              name: "Equipment one",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: equipmentDocument.id,
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

    it("[API]Create material one", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: "MT-00004",
            documentType: {
              id: materialsDocumentType[0].id,
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
          name: "Material one",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        materialsDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: materialsDocument.id,
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

    it("[API]Create part document", (done: any) => {
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

    it("[API]Create MPI document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          formTemplate: {
            outputDocumentTypes: [],
            schema: [
              {
                name: "fb-mpi-procedure-section-built-in",
                type: "section",
                index: 0,
                tabId: "procedure",
                label: "form.builder.mpiprocedure",
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "mpi-procedure-built-in",
                type: "mpiprocedure",
                index: 1,
                tabId: "procedure",
                stepIndex: 1,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                editorConfig: {
                  materials: [
                    {
                      id: "kolg5zka",
                      title: materialsDocument.id,
                      quantity: 1,
                      unit: "sets",
                    },
                  ],
                  equipment: [
                    {
                      id: "kolg6pz4",
                      title: equipmentDocument.id,
                    },
                  ],
                  description: "<p>Description of MPI step created with API</p>",
                },
              },
              {
                name: "lhrs-start-quantity",
                type: "quantity",
                index: 2,
                tabId: "procedure",
                label: "Start quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Start quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "lhrs-accepted-quantity",
                type: "quantity",
                index: 3,
                tabId: "procedure",
                label: "Accepted quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Accepted quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "lhrs-rejected-quantity",
                type: "quantity",
                index: 4,
                tabId: "procedure",
                label: "Rejected quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                editorProperties: [
                  "includeNotes",
                ],
                validationAttribute: "Rejected quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                includeNotes: true,
              },
              {
                name: "approvals-built-in",
                type: "approvals",
                index: 5,
                tabId: "overview",
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
          description: "<p>MPI created with API description</p>",
          name: "MPI created with API",
          attachments: [],
          referenceTo: [],
          revisionStage: 1,
          revisionChangeType: RevisionChangeType.NextRevision,
          retrain: false,
          document: {
            docId: "PI-00008",
            securityList: {
              securityEmployees: [],
              securityGroups: [
                {
                  id: group.body[0].id,
                },
              ],
              operators: [],
            },
            documentType: {
              id: mpiDocumentType[0].id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        mpiDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: mpiDocument.id,
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
              id: lhrDocumentType[0].id,
            }],
            schema: [
              {
                name: "lhr-selected-part",
                type: "partsselection",
                index: 0,
                tabId: "overview",
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
                tabId: "overview",
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
                tabId: "overview",
                label: "End Quantity",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                outputDisabled: true,
                validationAttribute: "End Quantity",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "lhr-build-type",
                type: "radiogroup",
                index: 3,
                tabId: "overview",
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
                name: "lhr-due-date",
                type: "datepicker",
                index: 4,
                tabId: "overview",
                label: "Due Date",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                validationAttribute: "Due Date",
                applicableValidationSchema: true,
              },
              {
                name: "lhrstep-built-in",
                type: "lhrstep",
                index: 5,
                tabId: "details",
                label: "LHR Step",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                applicableValidationSchema: true,
                stepIndex: 1,
                editorConfig: {
                  value: mpiDocument.id,
                },
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                tabId: "overview",
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
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: secondEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
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
                  label: "Change Orders",
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
          recordType: LotHistoryRecordTest.documentTypeName,
        });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });

      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      });

      it("Select 'R&D' build type", () => {
        cy.unClick();
        cy.get("[value=\"R&D\"]").check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
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

  context("Operator should be able to edit LHR fields and submit for approval", () => {
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

    it("Confirm 'Initial Quantity' field is disabled for operator", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").should("be.disabled");
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
      cy.get("[data-cy=\"change-key-0-0\"]").parent().parent()
        .should("contain.text", "Approver Added").and("contain.text", USERS[3].name);
      cy.get("[data-cy=\"change-key-1-0\"]").parent().parent()
        .should("contain.text", "Approver Added").and("contain.text", USERS[2].name);
    });

    it(`Remove ${USERS[3].name} approver`, () => {
      cy.contains(USERS[3].name).last().parent().parent().find(".MuiChip-deleteIcon").arrowClick();
    });

    it(`Add ${USERS[1].name} approver`, () => {
      cy.get("[data-cy^=fb-approvals-fb-approvals-]").autocompleteSelect(USERS[1].name);
      cy.unClick();
      cy.wait(3000);
    });

    it("Check history - added and removed approvers should be displayed", () => {
      cy.get("[data-cy=\"change-key-0-0\"]").parent().parent()
        .should("contain.text", "Approver Added").and("contain.text", USERS[1].name);
      cy.get("[data-cy=\"change-key-1-0\"]").parent().parent()
        .should("contain.text", "Approver Removed").and("contain.text", USERS[3].name);
    });

    it("Select Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Click 'LHR Step'", () => {
      cy.get("[data-cy^=\"LHR Step\"]").arrowClick();
    });

    it("Click 'START MPI'", () => {
      cy.mpiStartStep({ stepNumber: 1 });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Select Procedure tab", () => {
      cy.drSelectProcedureTab();
    });

    it("Enter 'Start quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-start-quantity\"]").arrowType("1");
    });

    it("Enter 'Accepted quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("1");
    });

    it("Enter 'Rejected quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("1");
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Select Overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add an Approval", () => {
      cy.get("[data-cy=\"fb-approvals-approvals-built-in\"]").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
        cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click save document", () => {
      cy.drSaveDocumentWithoutaudit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Complete step", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve LHR Step", () => {
      cy.ebApprove();
    });

    it("Visit LHR", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.GetDocumentTypes, CyRoutes.GetAvailableApprovers,
        CyRoutes.GetSpecificDocumentType,
      ], () => {
        cy.visit(lhrUrl);
      });
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit LHR for approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });
      cy.listLoadingElementShouldNotExist();
    });

    it("Check status of LHR is 'In Review'", () => {
      cy.poCheckStatus(STATUS_TYPES_LABEL.IN_REVIEW);
    });

    it("'Withdraw Submission' button does not exist", () => {
      cy.get("[data-cy=\"document.revision.withdraw.alert\"]").should("not.exist");
    });
  });

  context(`Owner user ${USERS[1].name} should be able to withdraw LHR`, () => {
    it("Log out user", () => {
      cy.authLogout();
    });

    it(`Log in as User 1 (${USERS[1].name})`, () => {
      cy.authLogin({
        email: USERS[1].email,
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
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Withdraw Submission' button", () => {
      cy.get("[data-cy=\"document.revision.withdraw.alert\"]").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview], () => {
        cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
      });
    });

    it("Check status of LHR is 'WIP'", () => {
      cy.poCheckStatus(STATUS_TYPES_LABEL.WIP);
    });
  });

  context(`Operator user ${USERS[2].name} approves LHR`, () => {
    it("Log out user", () => {
      cy.authLogout();
    });

    it(`Log in as User 2 (${USERS[2].name})`, () => {
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
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit LHR for approval", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });
      cy.listLoadingElementShouldNotExist();
    });

    it("Check status of LHR is 'In Review'", () => {
      cy.poCheckStatus(STATUS_TYPES_LABEL.IN_REVIEW);
    });

    it("Approve LHR", () => {
      cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
      cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
      cy.unClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
      });
      cy.checkToastMessage({ exists: false });
      cy.listLoadingElementShouldNotExist();
    });
  });

  context(`User ${USERS[1].name} approves LHR`, () => {
    it("Log out user", () => {
      cy.authLogout();
    });

    it(`Log in as User 1 (${USERS[1].name})`, () => {
      cy.authLogin({
        email: USERS[1].email,
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
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve LHR", () => {
      cy.get("[data-cy=\"form.builder.request.approve\"]").contains("Approve").arrowClick();
      cy.get("input[name=\"password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD).wait(1500);
      cy.unClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.DocPreview, CyRoutes.SessionDetails], () => {
        cy.get("[data-cy=\"common.confirm\"]").arrowClick();
      });
      cy.checkToastMessage({ exists: false });
      cy.listLoadingElementShouldNotExist();
    });

    it("Check status of LHR is Released", () => {
      cy.poCheckStatus(STATUS_TYPES_LABEL.RELEASED);
    });
  });
});

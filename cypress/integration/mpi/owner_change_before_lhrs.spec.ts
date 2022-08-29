/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let partDocumentType;
let equipmentDocument;
let createdPartDocument;
let MPIDocumentType;
let createdMPIDocument;
let LHRtDocumentType;
let LHRDocumentType;
let createdLHRtDocument;
let developersGroup;
let secondEmployee;
let lhrs1DocUrl;
let emailsFromInbox;
let companyId;
let lhrDocUrl;
let thirdEmployee;
let fourthEmployee;

const dateAfterEmailShouldArrive = new Date();
const lotDateSuffix = moment().tz("America/Los_Angeles").format("YYMMDD");

context("Change owner before starting LHRs", () => {
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
              LotHistoryRecordTest,
              MPITest,
              LHRTTest,
              Part,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          thirdEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          fourthEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[4].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
          MPIDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          LHRtDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "LHR template");
          LHRDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lot History Record Test");
          companyId = createdCompany.id;
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

    it("[API]Create part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document</p>",
          document: {
            docId: "PRT-00005",
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

    it("[API]Create MPI document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>MPI created through API</p>",
          document: {
            docId: "PI-00001",
            documentType: {
              id: MPIDocumentType[0].id,
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
          name: "API MPI",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [],
            schema: [
              {
                name: "fb-mpi-procedure-section-built-in",
                type: "section",
                index: 0,
                label: "form.builder.mpiprocedure",
                tabId: "procedure",
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "mpi-procedure-built-in",
                type: "mpiprocedure",
                tabId: "procedure",
                index: 1,
                stepIndex: 1,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
                editorProperties: [
                  "includeNotes",
                ],
                includeNotes: true,
                editorConfig: {
                  description: "<p>Description for step 1</p>",
                  materials: [
                    {
                      id: "kvasuama",
                      title: createdPartDocument.id,
                      quantity: 3,
                      unit: "each",
                    },
                  ],
                  equipment: [
                    {
                      id: "kvasulmm",
                      title: equipmentDocument.id,
                    },
                  ],
                },
              },
              {
                name: "lhrs-start-quantity",
                type: "quantity",
                index: 2,
                label: "Start quantity",
                tabId: "procedure",
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
                label: "Accepted quantity",
                tabId: "procedure",
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
                label: "Rejected quantity",
                tabId: "procedure",
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
                label: "Approvals",
                tabId: "overview",
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
        createdMPIDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdMPIDocument.id,
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

    it("[API]Create LHRt document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>LHRt created with API</p>",
          document: {
            docId: "LHRT-00003",
            documentType: {
              id: LHRtDocumentType[0].id,
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
          name: "API LHRt document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [
              { id: LHRDocumentType[0].id },
            ],
            schema: [
              {
                name: "lhr-selected-part",
                type: "partsselection",
                index: 0,
                label: "Part to be Manufactured",
                tabId: "overview",
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
                label: "Initial Quantity",
                tabId: "overview",
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
                label: "End Quantity",
                tabId: "overview",
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
                label: "Build Type",
                tabId: "overview",
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
                label: "Due Date",
                tabId: "overview",
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
                label: "LHR Step",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                applicableValidationSchema: true,
                stepIndex: 1,
                editorConfig: {
                  value: createdMPIDocument.id,
                },
              },
              {
                label: "form.builder.approvals",
                tabId: "overview",
                type: "approvals",
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
        createdLHRtDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdLHRtDocument.id,
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

    it("[API]Create LHR document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>LHR created with API</p>",
          document: {
            docId: "LHR-00004",
            documentType: {
              id: LHRDocumentType[0].id,
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
          name: "API LHR document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: { id: createdLHRtDocument.id },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => done());
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
          employees: [{ id: adminEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });

    it("[API]API request for updating company navigation", (done: any) => {
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

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Start LHRs and add operator", () => {
    it("Navigate to LHR list", () => {
      cy.navigToLHR();
    });

    it("Enter into LHR created with API", () => {
      cy.dlSelectFirstDocument();
    });

    context("Enter LHR atributes", () => {
      it("Enter initial quantity", () => {
        cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      });

      it("Select 'R&D' build type", () => {
        SystemRequirement("REQ-3190");
        cy.unClick();
        cy.get("[value=\"R&D\"]").check();
      });

      it("Add 'Due Date'", () => {
        cy.poAddDateRequired();
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.url().then((url: any) => {
          lhrDocUrl = url;
        });
      });
    });

    context("Change owner of LHR", () => {
      it(`Change owner of LHR to ${USERS[4].name}`, () => {
        cy.drChangeOwnerFromMenu({ employee: USERS[4].name });
      });
    });

    context("Login new owner and navigate to LHR", () => {
      it("Logout admin user", () => {
        cy.authLogout();
      });

      it("Login new LHR owner to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[4], employeeId: fourthEmployee.id });
      });

      it("Navig to LHR", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
          cy.visit(lhrDocUrl);
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Details tab", () => {
        cy.drSelectDetailsTab();
      });
    });

    context("Start LHRs", () => {
      it("Click 'LHR Step'", () => {
        cy.get("[data-cy^=\"LHR Step 1\"]").arrowClick();
      });

      it("Click 'START MPI'", () => {
        SystemRequirement("REQ-3210");
        cy.mpiStartStep({ stepNumber: 1 });
      });

      it("Click on sidebar permission icon to add Operators", () => {
        cy.get("[data-cy='permission-icon']").arrowClick();
      });

      it(`Assign operator '${USERS[2].name}'`, () => {
        SystemRequirement("REQ-3200");
        cy.drAssignDocumentTo({ username: USERS[2].name });
      });

      it("Click on sidebar permission icon to add Operators", () => {
        cy.get("[data-cy='permission-icon']").arrowClick();
      });

      it(`Assign operator '${USERS[3].name}'`, () => {
        SystemRequirement("REQ-3200");
        cy.drAssignDocumentTo({ username: USERS[3].name });
      });

      it("Click save document", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Verify status is WIP", () => {
        cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.WIP });
        cy.url().then((url: any) => {
          lhrs1DocUrl = url;
        });
      });
    });
  });

  context("Login operator and complete step", () => {
    it("Logout admin user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
    });

    it("Navig to LHRs #1", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
        cy.visit(lhrs1DocUrl);
      });
    });

    context("Add atributes to LHRs with operator", () => {
      it("Select Procedure tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Enter 'Start quntity' for LHRs #1", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[name=\"lhrs-start-quantity\"]").arrowType("10");
          cy.unClick();
        });
      });

      it("Enter 'Accepted quntity' for LHRs #1", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("8");
          cy.unClick();
        });
      });

      it("Enter 'Rejected quntity' for LHRs #1", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[name=\"lhrs-rejected-quantity\"]").arrowType("2");
          cy.unClick();
        });
      });

      it("Select Overview tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add an Approval", () => {
        cy.get("[data-cy^=\"fb-approvals-approvals\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
        });
      });

      it("Add an Approval", () => {
        cy.get("[data-cy^=\"fb-approvals-approvals\"]").arrowClick();
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get("ul>li[role=option]").contains(USERS[3].name).arrowClick();
        });
      });

      it("Click save document", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
      });
    });

    context("Complete LHRs with first operator", () => {
      it("Complete step", () => {
        cy.pmSubmitForApproval();
      });

      it("Approve step", () => {
        SystemRequirement("REQ-3230");
        cy.ebApprove();
      });
    });

    context("Complete LHRs with second operator", () => {
      it("Logout first operator", () => {
        cy.authLogout();
      });

      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[3], employeeId: thirdEmployee.id });
      });

      it("Navig to LHRs #1", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhrs1DocUrl);
        });
      });

      it("Approve step", () => {
        SystemRequirement("REQ-3230");
        cy.ebApprove();
        cy.wait(15000);
      });
    });
  });

  context("Verify emails", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[4].email,
          contains: [
            `Hello <b>${USERS[4].name},</b><br>`,
            "Part PRT-00005 Part document, <a href=",
            `${lhrDocUrl.substring(lhrDocUrl.length - 100)}">LOT #${lotDateSuffix}01RD</a>, <a`,
            `${lhrs1DocUrl.substring(lhrs1DocUrl.length - 100)}">Step #1</a> (PI-00001 API MPI, Rev`,
            "1) has been completed.",
            companyId],
        },
        {
          sentToUser: USERS[3].email,
          contains: [
            `Hello <b>${USERS[3].name},</b><br>`,
            "Part PRT-00005 Part document, <a href=",
            `${lhrDocUrl.substring(lhrDocUrl.length - 100)}">LOT #${lotDateSuffix}01RD</a>, <a`,
            `${lhrs1DocUrl.substring(lhrs1DocUrl.length - 100)}">Step #1</a> (PI-00001 API MPI, Rev`,
            "1) has been completed.",
            companyId],
        },
      ];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });

    it("Verify emails that should not be received", () => {
      const emailsThatShouldNotBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [
            `Hello <b>${USERS[1].name},</b><br>`,
            "Part PRT-00005 Part document, <a href=",
            `${lhrDocUrl.substring(lhrDocUrl.length - 100)}">LOT #${lotDateSuffix}01RD</a>, <a`,
            `${lhrs1DocUrl.substring(lhrs1DocUrl.length - 100)}">Step #1</a> (PI-00001 API MPI, Rev`,
            "1) has been completed.",
            companyId],
        },
        {
          sentToUser: USERS[2].email,
          contains: [
            `Hello <b>${USERS[2].name},</b><br>`,
            "Part PRT-00005 Part document, <a href=",
            `${lhrDocUrl.substring(lhrDocUrl.length - 100)}">LOT #${lotDateSuffix}01RD</a>, <a`,
            `${lhrs1DocUrl.substring(lhrs1DocUrl.length - 100)}">Step #1</a> (PI-00001 API MPI, Rev`,
            "1) has been completed.",
            companyId],
        },
      ];
      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldNotBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 0,
      });
    });
  });
});

export { };


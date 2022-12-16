/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

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

const lot = "LOT #";
const state = "STATE";
const owner = "OWNER";
const partNumberRev = "PART NUMBER/REV";
const completionDate = "COMPLETION DATE";
const startQuantity = "START QUANTITY";
const endQuantity = "END QUANTITY";
const template = "TEMPLATE";
const id = "ID";

context("Test LHR landing page", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.intercept({ url: "/api/v1/document_revisions/search", middleware: true }, (req) => {
      req.continue((res) => {
        res.setDelay(100);
      });
    }).as("Search");
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
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
          MPIDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          LHRtDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "LHR template");
          LHRDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lot History Record Test");
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
                index: 1,
                tabId: "procedure",
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

    it("[API]Create LHR document2", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>LHR created with API2</p>",
          document: {
            docId: "LHR-00005",
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
          name: "API LHR document2",
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

    it("[API]Create LHR document3", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>LHR created with API3</p>",
          document: {
            docId: "LHR-00006",
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
          name: "API LHR document3",
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
                  icon: "/navigation_icons/eb_icon.svg",
                  type: "CATEGORY",
                  label: "Engineering Builds",
                  category: "EB",
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

  context("Verify LHR landing page", () => {
    it("Navigate to LHR landing page", () => {
      cy.navigToLHR();
    });

    it("Verify landing page table is using Kendo grid", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    it("Verify all columns are present", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${lot}`);
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${state}`);
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${owner}`);
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${partNumberRev}`);
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${completionDate}`);
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", `${startQuantity}`);
      cy.get(`th[role="columnheader"]`).eq(6).should("have.text", `${endQuantity}`);
      cy.get(`th[role="columnheader"]`).eq(7).should("have.text", `${template}`);
      cy.get(`th[role="columnheader"]`).eq(8).should("have.text", `${id}`);
    });

    it(`Verify buttons "Clear Filter" and "Export List" are present`, () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
      cy.get(`button[id="DocumentByTypeListPresenter-openDocRev"]`)
        .should("have.text", "Initiate new LHR")
        .and("exist");
    });

    it(`Verify drag and drop State header on first slot`, () => {
      cy.get(`td[data-grid-col-index="1"]`).eq(0).should("contain.text", "WIP");

      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="2"][role]>span>span`,
        toSelector: `th[aria-colindex="1"][role]>span>span`,
      });

      cy.get(`td[data-grid-col-index="1"]`).eq(0).should("not.contain.text", "FM-");

      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="2"][role]>span>span`,
        toSelector: `th[aria-colindex="1"][role]>span>span`,
      });
    });

    it(`Column grouping should be displayed`, () => {
      cy.get(`th[aria-colindex="1"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column");
      cy.unClick();
    });

    it(`Verify grouping`, () => {
      cy.get("tr.k-grouping-row").should("not.exist");
      cy.get(`th[aria-colindex="2"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("tr.k-grouping-row").should("have.length", "1");
      cy.get(`div.k-group-indicator>a>span`).eq(1).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("tr.k-grouping-row").should("not.exist");
    });

    it(`Verify LHR can be opened`, () => {
      cy.dlSelectFirstDocument();
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.WIP });
    });

    it(`Verify LHR count`, () => {
      cy.navigToLHR();
      cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      cy.get("tr.k-master-row").should("have.length", 3);
    });

    context("Verify filters on each field", () => {
      it("Verify filter for LOT #", () => {
        cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="1"] input`).arrowType("FM-00004");
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "FM-00004");
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.dlClearFilters();
        cy.wait(2000);
      });

      it("Verify filter for State", () => {
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="2"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("WIP").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "WIP");
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      });

      it("Verify filter for owner", () => {
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="3"] input`).arrowType(USERS[1].name);
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", USERS[1].name);
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      });

      it("Verify filter for Part Number/Rev", () => {
        cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="4"] input`).arrowType("P");
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "P");
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      });

      it("Verify filter for Completion Date", () => {
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="5"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("Last 7 days").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "Last 7 days");
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.get(`th[aria-colindex="5"] span.k-i-filter-clear`).arrowClick();
      });

      it("Verify filter for Start Quantity", () => {
        cy.get(`th[aria-colindex="6"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="6"] input`).arrowType("Test");
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="6"] input`).should("have.attr", "value", "Test");
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.get(`th[aria-colindex="6"] span.k-i-filter-clear`).arrowClick();
      });

      it("Verify filter for End Quantity", () => {
        cy.get(`th[aria-colindex="7"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="7"] input`).arrowType("Test");
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="7"] input`).should("have.attr", "value", "Test");
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.get(`th[aria-colindex="7"] span.k-i-filter-clear`).arrowClick();
      });

      it("Verify filter for Template", () => {
        cy.get(`th[aria-colindex="8"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="8"] input`).arrowType("LHRT-00003");
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="8"] input`).should("have.attr", "value", "LHRT-00003");
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
      });

      it("Verify filter for ID", () => {
        cy.get(`th[aria-colindex="9"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="9"] input`).arrowType("LHR-00006");
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="9"] input`).should("have.attr", "value", "LHR-00006");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify clear filters", () => {
        cy.trClearFilters();
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="6"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="7"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="8"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="9"] input`).should("have.attr", "value", "");
      });
    });

    context("Verify hide and freeze", () => {
      it("Verify hide on State", () => {
        cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${state}`);
        cy.get(`th[aria-colindex="2"] span.k-icon`).eq(0).arrowClick();
        cy.get("div.k-columnmenu-item ").contains("Hide Column").arrowClick();
        cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${state}`);
      });

      it("Verify unhide on State", () => {
        cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${state}`);
        cy.get(`button[data-cy="manageColumnsBtn"]`).arrowClick();
        cy.get("ul>li[role=menuitem]").contains(`${state}`).parents("li").find("svg").arrowClick();
        cy.get("body").type("{esc}");
        cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${state}`);
      });

      it("Verify freeze on State", () => {
        cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${state}`);
        cy.get(`th[aria-colindex="2"] span.k-icon`).eq(0).arrowClick();
        cy.get("div.k-columnmenu-item ").contains("Freeze Column").arrowClick();
        cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${state}`);
      });

      it("Verify un-freeze on State", () => {
        cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${state}`);
        cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
        cy.get("div.k-columnmenu-item ").contains("Unfreeze Column").arrowClick();
        cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", `${state}`);
      });
    });

    context("Verify dropdown filters", () => {
      it("Verify ID dropdown filters", () => {
        cy.get(`th[aria-colindex="9"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").should("have.text", "ContainsDoes not containIs equal toIs not equal to" +
        "Starts withEnds withIs nullIs not nullIs emptyIs not empty");
      });

      it(`Verify ID "Does not contain" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get("ul>li[role=option]").contains("Does not contain").arrowClick();
        cy.get(`th[aria-colindex="9"] input`).arrowType("6");
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="9"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify ID "Is equal to" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="9"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is equal to").arrowClick();
        cy.get(`th[aria-colindex="9"] input`).arrowType("LHR-00006");
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get(`th[aria-colindex="9"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify ID "Is not equal to" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="9"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is not equal to").arrowClick();
        cy.get(`th[aria-colindex="9"] input`).arrowType("LHR-00006");
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="9"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify ID "Starts with" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="9"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Starts with").arrowClick();
        cy.get(`th[aria-colindex="9"] input`).arrowType("LHR-0000");
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="9"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify ID "Ends with" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="9"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Ends with").arrowClick();
        cy.get(`th[aria-colindex="9"] input`).arrowType("6");
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get(`th[aria-colindex="9"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify ID "Is null" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="9"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is null").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.get(`th[aria-colindex="9"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify ID "Is not null" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="9"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is not null").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="9"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });


      it(`Verify ID "Is empty" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="9"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is empty").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.get(`th[aria-colindex="9"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify ID "Is not empty" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="9"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 3 });
        cy.get(`th[aria-colindex="9"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });
    });

    context("Verify select field filter", () => {
      it(`Verify filter is disabled on default select field`, () => {
        cy.get(`th[aria-colindex="2"] button[title="Clear"]`).should("have.attr", "disabled");
        cy.get(`th[aria-colindex="2"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("WIP").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "WIP");
        cy.get(`th[aria-colindex="2"] button[title="Clear"]`).should("not.have.attr", "disabled");
        cy.get(`th[aria-colindex="2"] button[title="Clear"]`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });
    });
  });
});


/* eslint-disable @typescript-eslint/camelcase */

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { emailDateOffset, fileTimeFormat, momentInPST } from "../../utils/constants/dateHandler";
import { EngineeringBuild } from "../../utils/constants/documentTypes/engineeringBuild";
import { GeneralDocumentDocType } from "../../utils/constants/documentTypes/generalDocument";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { LegalRecord } from "../../utils/constants/documentTypes/record";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { StructureFromPerCompanyReport } from "./document_counter.spec";

let createdCompany;
let loginResponse;
let secondEmployee;
let group;
let initialArDocument;
let approvalRequestDocumentType;
let formDocumentType;
let legalRecordDocumentType;
let purchaseOrderDocumentType;
let adminEmployee;
let asyncTasksGroup;
let generalDocumentType;
let createdGeneralDocument;
let createdRecordForm;
let createdReleasedRecord;
let createdPartDocument;
let supplierDocumentType;
let createdSupplierFormDocument;
let createdSupplierDocument;
let partDocumentType;
let createdPartDocument2;
let createdPODocument;
let createdPOFormDocument;
let developersGroup;
let EBDocumentType;
let dateAfterEmailShouldArrive;
let emailsFromInbox;

const todaysDate = momentInPST();
const todaysDateFormated = momentInPST().format("L");

const usageReportTomorrow = momentInPST().add("days", "2").format("YYYY-MM-DDThh:mm");

const usageReportXlsxFileName = "Usage_report_" + fileTimeFormat + ".xlsx";
const usageReportXlsxFileNameAndPath = "cypress/downloads/" + usageReportXlsxFileName;
const perCompanyReportJsonFileName = "Per_company_report_" + fileTimeFormat + ".json";
const perCompanyReportJsonFileNameAndPath = "cypress/downloads/" + perCompanyReportJsonFileName;

const numberOfDocsFromUsageReport: StructureFromPerCompanyReport[] = [];
const numberOfCreatedDocs: StructureFromPerCompanyReport[] = [
  {
    name: "Parts",
    releasedCompleted: 2,
    draftPending: 0,
  },
  {
    name: "Equipment",
    releasedCompleted: 0,
    draftPending: 0,
  },
  {
    name: "Supplier",
    releasedCompleted: 1,
    draftPending: 0,
  },
  {
    name: "Purchase Order",
    releasedCompleted: 1,
    draftPending: 1,
  },
  {
    name: "Receiving",
    releasedCompleted: 0,
    draftPending: 0,
  },
  {
    name: "EB",
    releasedCompleted: 1,
    draftPending: 1,
  },
  {
    name: "LHR",
    releasedCompleted: 0,
    draftPending: 0,
  },
  {
    name: "LOT",
    releasedCompleted: 0,
    draftPending: 0,
  },
  {
    name: "Records",
    releasedCompleted: 1,
    draftPending: 1,
  },
  {
    name: "Documents",
    releasedCompleted: 5,
    draftPending: 1,
  },
  {
    name: "Change Orders",
    releasedCompleted: 11,
    draftPending: 0,
  },
  {
    name: "Training Records",
    releasedCompleted: 0,
    draftPending: 0,
  },
];

context("Usage report document counter for new revisions", { tags: ["@timetool"] }, () => {
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
              LegalRecord,
              PurchaseOrderTest,
              GeneralDocumentDocType,
              EngineeringBuild,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          generalDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, GeneralDocumentDocType.documentTypeName);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PurchaseOrderTest.documentTypeName);
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          legalRecordDocumentType = cmpFilterDocumentTypeIdByName(
            createdCompany,
            LegalRecord.documentTypeName
          );
          EBDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Engineering Build Test");
          done();
        });
      });
    });

    it("[API]Login admin user", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Get group", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Async Tasks",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [
            {
              id: adminEmployee.id,
            },
            {
              id: secondEmployee.id,
            },
          ],
        },
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
                  icon: "/navigation_icons/todo.svg",
                  type: "CATEGORY",
                  label: "Work Orders",
                  category: "Work Order",
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
            {
              icon: "/navigation_icons/receipt_list.svg",
              menu: [
                {
                  icon: "/navigation_icons/computer.svg",
                  path: "/training",
                  type: "LINK",
                  label: "Training Records",
                },
                {
                  icon: "/navigation_icons/receipt_list.svg",
                  path: "/document_by_category/Training Curriculums",
                  type: "LINK",
                  label: "Training Curriculums",
                },
              ],
              type: "MENU",
              label: "Training",
            },
          ],
        },
      }).then(() => {
        done();
      });
    });

    it("[API]POST EB page details", (done: any) => {
      cy.request({
        method: "POST",
        url: `${CONFIG.BE_URL}/api/v1/page_details`,
        headers: {
          Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
        },
        body: {
          category: "EB",
          addNewBtnLabel: "Create Engineering Build",
          config: {},
          columns: [
            {
              label: "EB ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "document.docId",
              showOnAndroid: true,
            },
            {
              fn: "DOCUMENT_REVISION_VERSION",
              label: "Revision",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.revision",
              sourcePath: ["revisionStage:revision"],
              showOnAndroid: true,
            },
            {
              label: "State",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "status",
              showOnAndroid: true,
            },
            {
              label: "Title",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "name",
              showOnAndroid: true,
            },
            {
              label: "Owner",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "owner.user.name",
              showOnAndroid: true,
            },
            {
              label: "Released Date",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "releasedAt",
              showOnAndroid: true,
            },
            {
              fn: "FORM_DOC_ID",
              label: "Form ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.formDocId",
              sourcePath: ["irrelevant"],
              showOnAndroid: true,
            },
            {
              fn: "PART_ID_FROM_EB",
              label: "Part ID",
              fieldName: "irrelevant",
              showOnWeb: true,
              valuePath: "precalc.partFromEb",
              sourcePath: ["irrelevant"],
              showOnAndroid: true,
            },
          ],
        },
      }).then(() =>  done());
    });

    it("[API]Create General Document", (done: any) => {
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
              description: "<p>General document</p>",
              document: {
                docId: "GD-00001",
                documentType: {
                  id: generalDocumentType[0].id,
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
              name: "API General Document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdGeneralDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdGeneralDocument.id,
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

    it("[API]Create form for Record", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Record form 1</p>",
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
          name: "API Record form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: legalRecordDocumentType[0].id,
            }],
            schema: [
              {
                index: 0,
                type: "textfield",
                name: "textfield-l39qj0uv",
                hidden: false,
                outputDisabled: false,
                deleted: false,
                deleteInFormDisabled: false,
                validationMode: "default",
                validationAttribute: "Random textfield",
                rules: "",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                applicableValidationSchema: true,
                editorProperties: [],
                placeholder: "",
                rows: 1,
                label: "Textfield for inline",
                tabId: "details",
              },
              {
                name: "fb-approvals",
                type: "approvals",
                index: 1,
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
        createdRecordForm = response;
        cy.drAPIApproveAndRelease({
          documentId: createdRecordForm.id,
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

    it("[API]Create released record", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Record</p>",
          document: {
            docId: "LR-00002",
            documentType: {
              id: legalRecordDocumentType[0].id,
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
          name: "API Released record",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: {
            id: createdRecordForm.id,
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdReleasedRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdReleasedRecord.id,
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

    it("[API]Create Supplier", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Supplier Form document</p>",
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
          name: "Supplier form",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: supplierDocumentType[0].id,
            }],
            schema: [],
          },

        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdSupplierFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdSupplierFormDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => {
          cy.poAPICreatePO({
            payload: {
              name: "API Supplier Document",
              attachments: [],
              referenceTo: [],
              formDocument: { id: createdSupplierFormDocument.id },
              description: "API Supplier document",
              revisionChangeType: RevisionChangeType.NextRevision,
              document: {
                docId: "SUP-00001",
                documentType: {
                  id: supplierDocumentType[0].id,
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
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then((response) => {
            createdSupplierDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdSupplierDocument.id,
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

    it("[API]Create part documents", (done: any) => {
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
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part second document</p>",
              document: {
                docId: "PRT-00006",
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
              name: "Part second document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPartDocument2 = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartDocument2.id,
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

    it("[API]Create PO form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>PO Form document</p>",
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
          name: "PO Form document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: purchaseOrderDocumentType[0].id,
            }],
            schema: [
              {
                name: "po-status-built-in",
                type: "select",
                index: 0,
                label: "PO Status",
                tabId: "details",
                options: [
                  {
                    text: "Open",
                    value: "Open",
                  },
                  {
                    text: "Closed",
                    value: "Closed",
                  },
                  {
                    text: "Cancelled",
                    value: "Cancelled",
                  },
                ],
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationAttribute: "PO Status",
                applicableValidationSchema: true,
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "po-general-information-to-be-completed-by-requester-section",
                type: "section",
                index: 1,
                label: "General Information",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
              },
              {
                name: "po-requestor-autocomplete",
                type: "autocomplete",
                index: 2,
                label: "Requestor",
                tabId: "details",
                rules: "required",
                hidden: false,
                deleted: false,
                optionId: "3",
                placeholder: "[Select requestor here]",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: false,
                optionLabelKey: "user.email",
                optionValueKey: "id",
                outputDisabled: false,
                validationMode: "default",
                editorProperties: [
                  "deleteDisabled",
                ],
                validationAttribute: "Requestor",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "po-supplier-built-in",
                type: "supplier",
                index: 3,
                label: "Supplier ",
                tabId: "details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationAttribute: "Supplier",
                applicableValidationSchema: true,
                deleteDisabled: true,
                deleteInFormDisabled: true,
              },
              {
                name: "po-order-date",
                type: "datepicker",
                index: 4,
                label: "Order Date",
                tabId: "details",
                rules: "required",
                hidden: false,
                deleted: false,
                validators: {
                  required: true,
                },
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: false,
                outputDisabled: false,
                validationMode: "default",
                editorProperties: [
                  "deleteDisabled",
                ],
                validationAttribute: "Order Date",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "po-items-built-in",
                type: "purchaseorder",
                index: 5,
                label: "Purchase Order",
                tabId: "lineitems",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                applicableValidationSchema: true,
                validationAttribute: "Purchase Order",
                deleteInFormDisabled: true,
              },
              {
                name: "fb-po-approvals",
                type: "approvals",
                index: 6,
                label: "Approvals",
                tabId: "details",
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
        createdPOFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPOFormDocument.id,
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

    it("[API]Create PO", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>PO for receiving</p>",
          document: {
            docId: "POT-00001",
            documentType: {
              id: purchaseOrderDocumentType[0].id,
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
          formDocument: {
            id: createdPOFormDocument.id,
          },
          name: "",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formInput: {
            "po-items-built-in": {
              tax: "0.00",
              taxRate: 9.25,
              subTotal: "2100.00",
              totalAmount: "2100.00",
              shippingCost: "0.00",
              currency: "USD",
              exchangeRate: 1,
              totalInUSD: "2100.00",
              dateOfExchangeRate: "",
              items: [
                {
                  type: "product",
                  partNumberTitle: "Part document",
                  partNumberDocId: "PRT-00005 - 1",
                  partNumber: createdPartDocument.id,
                  order: 200,
                  units: "each",
                  unitPrice: 5,
                  date: todaysDate,
                  id: "l1or09um",
                  received: 0,
                  totalAmount: "1000.00",
                  formattedDate: todaysDateFormated,
                  index: 0,
                },
                {
                  type: "product",
                  partNumberTitle: "Part second document",
                  partNumberDocId: "PRT-00006 - 1",
                  partNumber: createdPartDocument2.id,
                  order: 100,
                  units: "each",
                  unitPrice: 11,
                  date: todaysDate,
                  id: "l1or0d4o",
                  received: 0,
                  totalAmount: "1100.00",
                  formattedDate: todaysDateFormated,
                  index: 1,
                },
              ],
            },
            "fb-po-approvals": [
              adminEmployee.id,
            ],
            "po-status-built-in": "Open",
            "po-requestor-autocomplete": adminEmployee.id,
            "po-order-date": todaysDate,
            "po-supplier-built-in": createdSupplierDocument.id,
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPODocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPODocument.id,
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

    it("[API]Create EB document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>EB document</p>",
          document: {
            docId: "EB-00001",
            documentType: {
              id: EBDocumentType[0].id,
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
          name: "Engineering Build document",
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

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Revise normal document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter document by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: "API General Document", status: "Released" });
    });

    it("Click revise button", () => {
      cy.drClickReviseDocument();
    });

    it("Clicks Save button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Revise record document", () => {
    it("Navigate to records", () => {
      cy.navigToRecords();
    });

    it("Select first record", () => {
      cy.dlSelectFirstDocument();
    });

    it("Click revise button", () => {
      cy.drClickReviseDocument();
    });
  });

  context("Revise PO document", () => {
    it("Navigate to PO list", () => {
      cy.navigToPurchaseOrder();
    });

    it("Select PO document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Click revise button", () => {
      cy.drClickReviseDocument();
    });

    it("Clicks Save button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Revise EB document", () => {
    it("Navigate to EB list", () => {
      cy.navigToEB();
    });

    it("Select EB document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Click revise button", () => {
      cy.drClickReviseDocument();
    });

    it("Select administrative change", () => {
      cy.drAdministrativeRevisionLevel();
    });

    it("Clicks Save button", () => {
      cy.drClickCreateDocumentWithApiCall({ toastifyExists: true });
    });
  });

  context("Submit request for usage report", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task USAGE_REPORT", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.USAGE_REPORT });
    });

    it("Select date time", () => {
      cy.get("#datetime-local").eq(0).arrowType(usageReportTomorrow);
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
    });
  });

  context("Get report and parse it", () => {
    it("Get attachment from email", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      cy.wait(20000);
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Enlil Usage Report:`,
        include_attachments: true,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
        const attachmentData = emailsFromInbox[0].attachments[0].data;
        cy.writeFile(usageReportXlsxFileNameAndPath, attachmentData, "base64");
      });
    });

    it("Parse to JSON for number of documents", () => {
      cy.task("parseXlsx", { file: usageReportXlsxFileNameAndPath, sheet: "Report Per Company" }).then((rows: any) => {
        cy.writeFile(perCompanyReportJsonFileNameAndPath, { rows });
      });
    });
  });

  context("Verify number of documents", () => {
    it("Read data from JSON", () => {
      cy.readFile(perCompanyReportJsonFileNameAndPath).then((data) => {
        const relesedCompletedKey = createdCompany.name;

        const keysInReport = Object.keys(data.rows[1]);
        const indexOfUnknownKey = keysInReport.indexOf(relesedCompletedKey) + 1;
        const draftPendingKey = keysInReport[indexOfUnknownKey];

        data.rows.forEach((row, i) => {
          if (i !== 0) {
            numberOfDocsFromUsageReport.push({
              name: row[""],
              releasedCompleted: parseInt(row[relesedCompletedKey], 10),
              draftPending: parseInt(row[draftPendingKey], 10),
            });
          }
        });
      });
    });

    it("Verify data from usage report", () => {
      assert.deepEqual(numberOfDocsFromUsageReport, numberOfCreatedDocs);
    });
  });
});

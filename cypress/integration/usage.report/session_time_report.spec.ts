/* eslint-disable @typescript-eslint/camelcase */

// eslint-disable-next-line spaced-comment
/// <reference types="cypress-grep" />

import { integer } from "aws-sdk/clients/cloudfront";
import { float } from "aws-sdk/clients/lightsail";
import faker from "faker";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { emailDateOffset, fileTimeFormat, momentInPST } from "../../utils/constants/dateHandler";
import { AdministrativeDocumentDocType } from "../../utils/constants/documentTypes/administrative";
import { EngineeringBuild } from "../../utils/constants/documentTypes/engineeringBuild";
import { GeneralDocumentDocType } from "../../utils/constants/documentTypes/generalDocument";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { LegalRecord } from "../../utils/constants/documentTypes/record";
import { TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let asyncTasksGroup;
let formDocumentType;
let legalRecordDocumentType;
let secondEmployee;
let thirdEmplyee;
let fourthEmplyee;
let fifthEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let equipmentDocumentType;
let group;
let inlineRecordForm;
let recordForm;
let adminEmployee;
let loginResponse;
let createdCompany;
let createdCompany2;
let dateAfterEmailShouldArrive;
let emailsFromInbox;
let createdEquipmentFormDocument;
let createdSupplierFormDocument;
let supplierDocumentType;
let createdSupplierDocument;
let createdPOFormDocument;
let createdReceivingForm;
let purchaseOrderDocumentType;
let receivingDocumentType;
let partDocumentType;
let lotDocumentType;
let createdPartDocument;
let releasedequipmentDocument;
let generalDocumentType;
let maintenanceRecordDocumentType;
let createdGeneralDocument;
let createdARDocument;
let createdPODocument;
let createdRelesedReceivable;
let EBDocumentType;
let administrativeDocumentType;
let LHRtDocumentType;
let createdLHRtDocument;
let LHRDocumentType;
let createdARForm;
let createdPMForm;
let createdCalibrationForm;
let createdReleasedRecord;
let createdEBRecord;
let createdMPIDocument;
let MPIDocumentType;

const todaysDate = momentInPST();
const todaysDateFormated = momentInPST().format("L");
const usageReportXlsxFileName = "Usage_report_" + fileTimeFormat + ".xlsx";
const usageReportXlsxFileNameAndPath = "cypress/downloads/" + usageReportXlsxFileName;
const perCompanyReportJsonFileName = "Per_company_report_" + fileTimeFormat + ".json";
const perCompanyReportJsonFileNameAndPath = "cypress/downloads/" + perCompanyReportJsonFileName;
const sessionReportJsonFileName = "session_report_" + fileTimeFormat + ".json";
const sessionReportJsonFileNameAndPath = "cypress/downloads/" + sessionReportJsonFileName;

const usageReportTomorrow = momentInPST().add("days", "2").format("YYYY-MM-DDThh:mm");

interface StructureFromSessionReport {
  sessionTimeAproxAdminUser: float;
  sessionTimeAproxUser2: float;
  sessionTimeAproxUser3: float;
  sessionTimeAproxUser4: float;
  sessionTimeAproxUser5: float;
}

const spentTimeFromReport: StructureFromSessionReport = {
  sessionTimeAproxAdminUser: 0.0,
  sessionTimeAproxUser2: 0.0,
  sessionTimeAproxUser3: 0.0,
  sessionTimeAproxUser4: 0.0,
  sessionTimeAproxUser5: 0.0,
};

interface StructureFromPerCompanyReport {
  name: string;
  releasedCompleted: integer;
  draftPending: integer;
}

const numberOfDocsFromUsageReportForCompany1: StructureFromPerCompanyReport[] = [];
const numberOfDocsFromUsageReportForCompany2: StructureFromPerCompanyReport[] = [];
const numberOfCreatedDocsForComany1: StructureFromPerCompanyReport[] = [
  {
    name: "Parts",
    releasedCompleted: 1,
    draftPending: 0,
  },
  {
    name: "Equipment",
    releasedCompleted: 3,
    draftPending: 2,
  },
  {
    name: "Supplier",
    releasedCompleted: 1,
    draftPending: 2,
  },
  {
    name: "Purchase Order",
    releasedCompleted: 2,
    draftPending: 1,
  },
  {
    name: "Receiving",
    releasedCompleted: 2,
    draftPending: 0,
  },
  {
    name: "EB",
    releasedCompleted: 1,
    draftPending: 0,
  },
  {
    name: "LHR",
    releasedCompleted: 0,
    draftPending: 1,
  },
  {
    name: "LOT",
    releasedCompleted: 0,
    draftPending: 0,
  },
  {
    name: "Records",
    releasedCompleted: 4,
    draftPending: 4,
  },
  {
    name: "Documents",
    releasedCompleted: 14,
    draftPending: 8,
  },
  {
    name: "Change Orders",
    releasedCompleted: 28,
    draftPending: 0,
  },
  {
    name: "Training Records",
    releasedCompleted: 0,
    draftPending: 0,
  },
];

const numberOfCreatedDocsForComany2: StructureFromPerCompanyReport[] = [
  {
    name: "Parts",
    releasedCompleted: 0,
    draftPending: 0,
  },
  {
    name: "Equipment",
    releasedCompleted: 0,
    draftPending: 0,
  },
  {
    name: "Supplier",
    releasedCompleted: 0,
    draftPending: 0,
  },
  {
    name: "Purchase Order",
    releasedCompleted: 0,
    draftPending: 0,
  },
  {
    name: "Receiving",
    releasedCompleted: 0,
    draftPending: 0,
  },
  {
    name: "EB",
    releasedCompleted: 0,
    draftPending: 0,
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
    releasedCompleted: 0,
    draftPending: 0,
  },
  {
    name: "Documents",
    releasedCompleted: 1,
    draftPending: 0,
  },
  {
    name: "Change Orders",
    releasedCompleted: 1,
    draftPending: 0,
  },
  {
    name: "Training Records",
    releasedCompleted: 0,
    draftPending: 0,
  },
];

context("Test usage report is correctly counting documents", { tags: ["@timetool"] }, () => {
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
    it("[API]Creates company 1", (done: any) => {
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
            users: [USERS[2], USERS[3], USERS[4], USERS[5]],
            documentTypes: [
              LegalRecord,
              MPITest,
              GeneralDocumentDocType,
              EngineeringBuild,
              LHRTTest,
              AdministrativeDocumentDocType,
              { ...TrainingCurriculum, documentTypeName: "Training Curriculum Test" },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          thirdEmplyee = createdCompany.employees.find((employee) => employee.user.email === USERS[3].email);
          fourthEmplyee = createdCompany.employees.find((employee) => employee.user.email === USERS[4].email);
          fifthEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[5].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          legalRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, LegalRecord.documentTypeName);
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order");
          receivingDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable");
          administrativeDocumentType =
                    cmpFilterDocumentTypeIdByName(createdCompany, AdministrativeDocumentDocType.documentTypeName);
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          lotDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lots");
          generalDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, GeneralDocumentDocType.documentTypeName);
          EBDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Engineering Build Test");
          LHRtDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "LHR template");
          LHRDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lot History Record");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
          MPIDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          done();
        });
      });
    });

    it("[API]Creates company 2", (done: any) => {
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
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany2 = response;
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

    context("[API]Create required documents for Usage Report", () => {
      context("[API]Create form documents", () => {
        it("[API]Create record inline form", (done: any) => {
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
                  description: "<p>Record inline form</p>",
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
                  name: "API record inline form",
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
                        tabId: "details",
                        name: "textfield-for-inline-l39qj0uv",
                        hidden: false,
                        outputDisabled: false,
                        deleted: false,
                        deleteInFormDisabled: false,
                        validationMode: "default",
                        validationAttribute: "Textfield for inline",
                        rules: "",
                        applicableOn: [
                          "ON_STATE_TO_IN_REVIEW",
                        ],
                        applicableValidationSchema: true,
                        editorProperties: [],
                        placeholder: "",
                        rows: 1,
                        label: "Textfield for inline",
                      },
                      {
                        index: 1,
                        type: "inlineapproval",
                        tabId: "details",
                        name: "inline-field-l39qj2f2",
                        hidden: false,
                        outputDisabled: false,
                        deleted: false,
                        deleteInFormDisabled: false,
                        validationMode: "default",
                        validationAttribute: "Inline field",
                        rules: "",
                        applicableOn: [
                          "ON_STATE_TO_IN_REVIEW",
                        ],
                        applicableValidationSchema: true,
                        editorProperties: [],
                        label: "Inline field",
                        editorConfig: {
                          approvers: [
                            adminEmployee.id,
                          ],
                        },
                      },
                      {
                        index: 2,
                        type: "textfield",
                        tabId: "details",
                        name: "second-textfield-for-inline-l39qj3i5",
                        hidden: false,
                        outputDisabled: false,
                        deleted: false,
                        deleteInFormDisabled: false,
                        validationMode: "default",
                        validationAttribute: "Second textfield for inline",
                        rules: "",
                        applicableOn: [
                          "ON_STATE_TO_IN_REVIEW",
                        ],
                        applicableValidationSchema: true,
                        editorProperties: [],
                        placeholder: "",
                        rows: 1,
                        label: "Second textfield for inline",
                      },
                      {
                        index: 3,
                        type: "inlineapproval",
                        tabId: "details",
                        name: "second-inline-field-l39qj5nh",
                        hidden: false,
                        outputDisabled: false,
                        deleted: false,
                        deleteInFormDisabled: false,
                        validationMode: "default",
                        validationAttribute: "Second inline field",
                        rules: "",
                        applicableOn: [
                          "ON_STATE_TO_IN_REVIEW",
                        ],
                        applicableValidationSchema: true,
                        editorProperties: [],
                        label: "Second inline field",
                        editorConfig: {
                          approvers: [
                            secondEmployee.id,
                          ],
                        },
                      },
                    ],
                  },

                },
                employeeId: adminEmployee.id as unknown as string,
                sessionId: loginResponse.sessionId as unknown as string,
              }).then((response) => {
                inlineRecordForm = response;
                cy.drAPIApproveAndRelease({
                  documentId: inlineRecordForm.id,
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

        it("[API]Create Equipment form", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Equipment form</p>",
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
              name: "Equipment form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: equipmentDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "fb-default-eq-status",
                    type: "radiogroup",
                    tabId: "overview",
                    index: 0,
                    label: "EQ Status",
                    rules: "required",
                    options: [
                      {
                        text: "Active",
                        value: "Active",
                      },
                      {
                        text: "Inactive",
                        value: "Inactive",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "fb-primary-owner-eq",
                    type: "autocomplete",
                    tabId: "specification",
                    index: 1,
                    label: "Primary Owner",
                    optionId: "13",
                    placeholder: "Select employee as primary owner",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Primary Owner",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "fb-coordinator-eq",
                    type: "autocomplete",
                    tabId: "specification",
                    index: 2,
                    label: "Coordinator",
                    optionId: "13",
                    placeholder: "Select employee as coordinator",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Coordinator",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                ],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdEquipmentFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdEquipmentFormDocument.id,
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

        it("[API]Create Supplier form", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Supplier Form document</p>",
              document: {
                docId: "FM-00005",
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
              name: "API supplier form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: supplierDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "fb-approvals-l42iv0i2",
                    type: "approvals",
                    tabId: "overview",
                    index: 3,
                    label: "form.builder.approvals",
                    deleteDisabled: true,
                    uniqueSchemaItem: true,
                  },
                ],
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
              done();
            });
          });
        });

        it("[API]Create PO form", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>PO Form document</p>",
              document: {
                docId: "FM-00006",
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
                    tabId: "details",
                    index: 0,
                    label: "PO Status",
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
                    tabId: "details",
                    index: 1,
                    label: "General Information",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                  },
                  {
                    name: "po-requestor-autocomplete",
                    type: "autocomplete",
                    tabId: "details",
                    index: 2,
                    label: "Requestor",
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
                    tabId: "details",
                    index: 3,
                    label: "Supplier ",
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
                    tabId: "details",
                    index: 4,
                    label: "Order Date",
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
                    tabId: "lineitems",
                    index: 5,
                    label: "Purchase Order",
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
                    tabId: "details",
                    index: 6,
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

        it("[API] Create receivable form", () => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Receivable form</p>",
              document: {
                docId: "FM-00007",
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
              formTemplate: {
                outputDocumentTypes: [
                  { id: receivingDocumentType[0].id },
                ],
                schema: [
                  {
                    name: "receive-po-kzqkr5yl",
                    type: "poreceive",
                    tabId: "details",
                    index: 0,
                    label: "Receive PO",
                    rules: "",
                    hidden: false,
                    deleted: false,
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    outputDisabled: false,
                    validationMode: "default",
                    editorProperties: [

                    ],
                    validationAttribute: "Receive PO",
                    deleteInFormDisabled: false,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "fb-approvals-kzqkpxqm",
                    type: "approvals",
                    tabId: "overview",
                    index: 1,
                    label: "form.builder.approvals",
                    deleteDisabled: true,
                    uniqueSchemaItem: true,
                  },
                ],
              },
              name: "Receivable form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdReceivingForm = response;
            cy.drAPIApproveAndRelease({
              documentId: createdReceivingForm.id,
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

        it("[API] Create Approval Request form", () => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Approval Request form</p>",
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
              formTemplate: {
                outputDocumentTypes: [
                  { id: approvalRequestDocumentType[0].id },
                ],
                schema: [],
              },
              name: "Approval Request form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdARForm = response;
            cy.drAPIApproveAndRelease({
              documentId: createdARForm.id,
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

        it("[API]Create record form", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Record form</p>",
              document: {
                docId: "FM-00009",
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
              name: "API record form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: legalRecordDocumentType[0].id,
                }],
                schema: [],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            recordForm = response;
            cy.drAPIApproveAndRelease({
              documentId: recordForm.id,
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

        it("[API]Create Part form in Draft", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part form in draft</p>",
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
              name: "API Part form in Draft",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: partDocumentType[0].id,
                }],
                schema: [],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => done());
        });

        it("[API]Create Lot form in Draft", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Lot form in draft</p>",
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
              name: "API Lot form in Draft",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: lotDocumentType[0].id,
                }],
                schema: [],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => done());
        });

        it("[API]Create Other form in Draft", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Other form in draft</p>",
              document: {
                docId: "FM-00012",
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
              name: "API Other form in Draft",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: generalDocumentType[0].id,
                }],
                schema: [],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => done());
        });
      });

      context("[API]Create equipment documents", () => {
        it("[API]Create Released Equipment document", () => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Released Equipment</p>",
              document: {
                docId: "ET-00001",
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
              name: "Released Equipment",
              formDocument: {
                id: createdEquipmentFormDocument.id,
              },
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formInput: {
                "fb-default-eq-status": "Active",
                "fb-primary-owner-eq": adminEmployee.id,
                "fb-coordinator-eq": adminEmployee.id,
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            releasedequipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: releasedequipmentDocument.id,
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

        it("[API]Create Draft Equipment document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Draft Equipment</p>",
              document: {
                docId: "ET-00002",
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
              name: "Draft Equipment",
              formDocument: {
                id: createdEquipmentFormDocument.id,
              },
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formInput: {
                "fb-default-eq-status": "Active",
                "fb-primary-owner-eq": adminEmployee.id,
                "fb-coordinator-eq": adminEmployee.id,
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => done());
        });
      });

      context("[API]Create Part documents", () => {
        it("[API]Create released part document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part document</p>",
              document: {
                docId: "PRT-00001",
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
              name: "Released Part document",
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

      context("[API]Create Suppliers document", () => {
        it("[API]Create Released Supplier document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Supplier</p>",
              document: {
                docId: "SUP-00003",
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
              name: "Released Supplier",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formDocument: { id: createdSupplierFormDocument.id },
              formInput: {},
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
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
            }).then(() => done());
          });
        });
      });

      context("[API]Create POs", () => {
        it("[API]Create released PO", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>released PO</p>",
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
                      partNumber: faker.random.uuid(),
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
      });

      context("[API]Create Approval Request document", () => {
        it("[API]Create Released Approval Request document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Approval Request</p>",
              document: {
                docId: "AR-00005",
                documentType: {
                  id: approvalRequestDocumentType[0].id,
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
                id: createdARForm.id,
              },
              name: "Released Approval Request",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdARDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdARDocument.id,
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

      context("[API]Create records", () => {
        it("[API]Create released record inline", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Released Record inline</p>",
              document: {
                docId: "LR-00001",
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
              name: "API inline record",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formDocument: {
                id: inlineRecordForm.id,
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
              formDocument: {
                id: recordForm.id,
              },
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
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

        it("[API]Create Draft record", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Record</p>",
              document: {
                docId: "LR-00003",
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
              name: "API Draft record",
              formDocument: {
                id: recordForm.id,
              },
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => done());
        });
      });

      context("[API]Create Receiving documents", () => {
        it("[API] Create released receivable", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              name: "",
              description: "",
              document: {
                docId: "RC-00002",
                documentType: {
                  id: receivingDocumentType[0].id,
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
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formDocument: {
                id: createdReceivingForm.id,
              },
              formInput: {
                "receive-po-kzqkr5yl": { id: faker.random.uuid() },
                "fb-approvals-fb-approvals-kzqkpxqm": [],
              },
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then((response) => {
            createdRelesedReceivable = response;
            cy.drAPIApproveAndRelease({
              documentId: createdRelesedReceivable.id,
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

      context("[API]Create Administrative documents", () => {
        it("[API] Create draft Administrative document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              name: "Administrative Document",
              description: "<p>Draft Administrative Document</p>",
              document: {
                docId: "ADM-00002",
                documentType: {
                  id: administrativeDocumentType[0].id,
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
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
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

  context("User 2 Day 1", () => {
    it("[API]Login user 2", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    context("Day 1 User 2 Spent Time Tracking", () => {
      it("[API]Create LHRT document in Draft", (done: any) => {
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
                description: "<p>LHRt created with API</p>",
                document: {
                  docId: "LHRT-00001",
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
                      tabId: "overview",
                      index: 0,
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
                      tabId: "overview",
                      index: 1,
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
                      tabId: "overview",
                      index: 2,
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
                      tabId: "overview",
                      index: 4,
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
                      tabId: "details",
                      index: 5,
                      label: "LHR Step",
                      applicableOn: [
                        "ON_STATE_TO_IN_REVIEW",
                      ],
                      validationMode: "default",
                      applicableValidationSchema: true,
                      stepIndex: 1,
                      editorConfig: {
                        value: faker.random.uuid(),
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
              employeeId: secondEmployee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then((response) => {
              createdLHRtDocument = response;
            }).then(() => {
              done();
            });
          });
        });
      });

      it("[API]Create General Document in Draft", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>GD document</p>",
            document: {
              docId: "GD-00002",
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
            name: "Pending GD document",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdGeneralDocument = response;
        }).then(() => {
          done();
        });
      });

      it("[API]Create Equipment document in Draft", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Draft Equipment for user 2</p>",
            document: {
              docId: "ET-00005",
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
            name: "Draft Equipment for user 2",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => done());
      });

      it("[API]Create Regular Record in Draft", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Record for user 2</p>",
            document: {
              docId: "LR-00005",
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
            name: "API Draft record for user 2",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => done());
      });

      it("[API]Create Record inline in Draft", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Draft Record inline</p>",
            document: {
              docId: "LR-00006",
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
            name: "API inline record draft",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formDocument: {
              id: inlineRecordForm.id,
            },
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdReleasedRecord = response;
        }).then(() => done());
      });


      it("[API]Create Regular released record", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Record for user 2</p>",
            document: {
              docId: "LR-00007",
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
            name: "API Released record for user 2",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdReleasedRecord = response;
          cy.drAPIApproveAndRelease({
            documentId: createdReleasedRecord.id,
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

      context("[API]Create POs", () => {
        it("[API]Create released PO", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>released PO for user 2</p>",
              document: {
                docId: "POT-00003",
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
                      partNumber: faker.random.uuid(),
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
                  ],
                },
                "fb-po-approvals": [
                  secondEmployee.id,
                ],
                "po-status-built-in": "Open",
                "po-requestor-autocomplete": secondEmployee.id,
                "po-order-date": todaysDate,
                "po-supplier-built-in": createdSupplierDocument.id,
              },
            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPODocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPODocument.id,
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

      context("[API]Create Receiving documents", () => {
        it("[API] Create released receivable", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              name: "",
              description: "",
              document: {
                docId: "RC-00004",
                documentType: {
                  id: receivingDocumentType[0].id,
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
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formDocument: {
                id: createdReceivingForm.id,
              },
              formInput: {
                "receive-po-kzqkr5yl": { id: faker.random.uuid() },
                "fb-approvals-fb-approvals-kzqkpxqm": [],
              },
            },
            employeeId: secondEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then((response) => {
            createdRelesedReceivable = response;
            cy.drAPIApproveAndRelease({
              documentId: createdRelesedReceivable.id,
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

      context("[API]Create equipment documents", () => {
        it("[API]Create Released Equipment document", () => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Released Equipment for user 2</p>",
              document: {
                docId: "ET-00007",
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
              name: "Released Equipment",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            releasedequipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: releasedequipmentDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
              },
              employeeId: secondEmployee.id,
              sessionId: loginResponse.sessionId,
            });
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
                        title: releasedequipmentDocument.id,
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
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdMPIDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdMPIDocument.id,
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

      it("[API]Create PM form", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>PM form</p>",
            document: {
              docId: "FM-00025",
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
            name: "Preventative Maintenance form",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [{
                id: maintenanceRecordDocumentType[0].id,
              }],
              schema: [
                {
                  name: "fb-maintenance-details-section",
                  type: "section",
                  tabId: "details",
                  index: 0,
                  label: "Maintenance Details",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  deleteInFormDisabled: true,
                },
                {
                  name: "equipment_id",
                  type: "autocomplete",
                  tabId: "details",
                  index: 1,
                  label: "Equipment",
                  rules: "required",
                  optionId: "20",
                  placeholder: "[Select revision here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationMode: "default",
                  deleteInFormDisabled: true,
                },
                {
                  name: "equipment_maintainer",
                  type: "autocomplete",
                  tabId: "details",
                  index: 2,
                  label: "Maintainer",
                  rules: "required",
                  optionId: "13",
                  placeholder: "[Select name here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationMode: "default",
                  deleteInFormDisabled: true,
                },
                {
                  name: "fb-equipment_due_date",
                  type: "datepicker",
                  tabId: "details",
                  index: 3,
                  label: "Completion Date",
                  rules: "required",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationMode: "default",
                  deleteInFormDisabled: true,
                },
                {
                  name: "fb-requipment-maintenance-section",
                  type: "textfield",
                  tabId: "details",
                  index: 4,
                  label: "Equipment Maintenance Section",
                  rules: "required",
                  hidden: true,
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationMode: "default",
                  deleteInFormDisabled: true,
                },
                {
                  label: "form.builder.approvals",
                  type: "approvals",
                  tabId: "details",
                  deleteDisabled: true,
                  name: "fb-approvals-kybkhbpt",
                  uniqueSchemaItem: true,
                  index: 5,
                },
              ],
            },

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdPMForm = response;
          cy.drAPIApproveAndRelease({
            documentId: createdPMForm.id,
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

      it("[API]Create Calibration form", (done: any) => {
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Calibration form</p>",
            document: {
              docId: "FM-00026",
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
            name: "Calibration form",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [{
                id: maintenanceRecordDocumentType[0].id,
              }],
              schema: [
                {
                  name: "fb-maintenance-details-section",
                  type: "section",
                  tabId: "details",
                  index: 0,
                  label: "Maintenance Details",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  deleteInFormDisabled: true,
                },
                {
                  name: "equipment_id",
                  type: "autocomplete",
                  tabId: "details",
                  index: 1,
                  label: "Equipment",
                  rules: "required",
                  optionId: "20",
                  placeholder: "[Select revision here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationMode: "default",
                  deleteInFormDisabled: true,
                },
                {
                  name: "equipment_maintainer",
                  type: "autocomplete",
                  tabId: "details",
                  index: 2,
                  label: "Maintainer",
                  rules: "required",
                  optionId: "13",
                  placeholder: "[Select name here]",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationMode: "default",
                  deleteInFormDisabled: true,
                },
                {
                  name: "fb-equipment_due_date",
                  type: "datepicker",
                  tabId: "details",
                  index: 3,
                  label: "Completion Date",
                  rules: "required",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationMode: "default",
                  deleteInFormDisabled: true,
                },
                {
                  name: "fb-requipment-maintenance-section",
                  type: "textfield",
                  tabId: "details",
                  index: 4,
                  label: "Equipment Maintenance Section",
                  rules: "required",
                  hidden: true,
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationMode: "default",
                  deleteInFormDisabled: true,
                },
                {
                  label: "form.builder.approvals",
                  type: "approvals",
                  tabId: "details",
                  deleteDisabled: true,
                  name: "fb-approvals-kybkhbpt",
                  uniqueSchemaItem: true,
                  index: 5,
                },
              ],
            },

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCalibrationForm = response;
          cy.drAPIApproveAndRelease({
            documentId: createdCalibrationForm.id,
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

  context("Day 1 User 1 Spent Time Tracking for company 2", () => {
    it("Auth login first user", () => {
      cy.authLogin({ email: USERS[1].email });
    });

    it("Select company", () => {
      cy.cmpSelectCompany({ name: createdCompany2.name, multiple: true });
    });
    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open first document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Logout", () => {
      cy.authLogout();
    });
  });

  context("Time travel one day back to the future", () => {
    it("Login user 1 to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it(`Select 1 day to back in future`, () => {
      cy.asyncSelectBackToTheFutureTime({ day: 1 });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
    });
  });

  context("Day 2 User 3 Spent Time Tracking", () => {
    it("[API]Login user 3", (done: any) => {
      cy.authApiLogin({
        email: USERS[3].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    context("[API]Create Inline record in draft", () => {
      it("[API]Create Inline record document", (done: any) => {
        cy.grpGetGroupByName({
          sessionId: loginResponse.sessionId,
          employeeId: thirdEmplyee.id,
          groupName: "Everyone",
        }).then((response) => {
          group = response;
          cy.arGetArDocumentByName({
            sessionId: loginResponse.sessionId,
            employeeId: thirdEmplyee.id,
            name: "AR Form",
          }).then((response) => {
            initialArDocument = response;
            cy.drCreateDocumentRevision({
              payload: {
                attachments: [],
                description: "<p>Draft Record inline for user 3</p>",
                document: {
                  docId: "LR-00010",
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
                name: "API inline record draft for user 3",
                referenceTo: [],
                retrain: false,
                revisionChangeType: RevisionChangeType.NextRevision,
                revisionStage: 1,
              },
              employeeId: thirdEmplyee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then(() => {
              done();
            });
          });
        });
      });
    });

    it("[API]Create Draft Supplier document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Supplier for user 3</p>",
          document: {
            docId: "SUP-00005",
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
          name: "Draft Supplier",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: thirdEmplyee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => done());
    });

    it("[API]Create Released Equipment document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Released Equipment or user 3</p>",
          document: {
            docId: "ET-00017",
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
          name: "Released Equipment for user 3",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: thirdEmplyee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        releasedequipmentDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: releasedequipmentDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: thirdEmplyee.id } }],
          },
          employeeId: thirdEmplyee.id,
          sessionId: loginResponse.sessionId,
        });
      });
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open first document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open first document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open first document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open first document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open first document", () => {
      cy.dlSelectFirstDocument();
    });
  });

  context("Time travel one day back to the future", () => {
    it("Login user 1 to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it(`Select 1 day to back in future`, () => {
      cy.asyncSelectBackToTheFutureTime({ day: 1 });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
    });
  });

  context("Day 3 User 1 Spent Time Tracking", () => {

    it("[API]Login user 1", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    context("[API]Create Approval Request document", () => {
      it("[API]Create Released Approval Request document", (done: any) => {
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
                description: "<p>Approval Request</p>",
                document: {
                  docId: "AR-00006",
                  documentType: {
                    id: approvalRequestDocumentType[0].id,
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
                  id: createdARForm.id,
                },
                name: "Released Approval Request",
                referenceTo: [],
                retrain: false,
                revisionChangeType: RevisionChangeType.NextRevision,
                revisionStage: 1,
              },
              employeeId: adminEmployee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then(() => done());
          });
        });
      });
    });
  });

  context("Day 3 User 2 Spent Time Tracking", () => {
    it("[API]Login user 2", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    context("[API]Create EB document", () => {
      it("[API]Create Released EB document", (done: any) => {
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
              employeeId: secondEmployee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then((response) => {
              createdEBRecord = response;
              cy.drAPIApproveAndRelease({
                documentId: createdEBRecord.id,
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
      });
    });
  });

  context("Day 3 User 4 Spent Time Tracking", () => {
    it("[API]Login user 4", (done: any) => {
      cy.authApiLogin({
        email: USERS[4].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create LHRt document", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: fourthEmplyee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: fourthEmplyee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>LHRt created with API</p>",
              document: {
                docId: "LHRT-00002",
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
            employeeId: fourthEmplyee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdLHRtDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdLHRtDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: fourthEmplyee.id } }],
              },
              employeeId: fourthEmplyee.id,
              sessionId: loginResponse.sessionId,
            }).then(() => {
              done();
            });
          });
        });
      });
    });

    it("[API]Create Draft Supplier document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Supplier</p>",
          document: {
            docId: "SUP-00004",
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
          name: "Draft Supplier",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: fourthEmplyee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => done());
    });
  });

  context("Day 3 User 5 Spent Time Tracking", () => {
    it("Login user 5 to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[5], employeeId: fifthEmployee.id });
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open first document", () => {
      cy.dlFilterByDocId({ docId: "FM-00003" });
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open second document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open third document", () => {
      cy.dlSelectFirstDocument();
    });
  });

  context("Time travel one day back to the future", () => {
    it("Login user 1 to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it(`Select 1 day to back in future`, () => {
      cy.asyncSelectBackToTheFutureTime({ day: 1 });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
    });
  });

  context("Day 4 User 1 Spent Time Tracking", () => {
    it("[API]Login user 1", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create Lot form", (done: any) => {
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
              description: "<p>Lot Form document</p>",
              document: {
                docId: "FM-000012",
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
              name: "API Lot form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: lotDocumentType[0].id,
                }],
                schema: [],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => {
            done();
          });
        });
      });
    });

    it("[API]Create General Document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>General document</p>",
          document: {
            docId: "GD-00005",
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

  context("Day 4 User 2 Spent Time Tracking", () => {
    it("[API]Login user 2", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create LHR document", (done: any) => {
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
              description: "<p>LHR</p>",
              document: {
                docId: "LHR-00001",
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
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => done());
        });
      });
    });

    it("[API]Create released record", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Record</p>",
          document: {
            docId: "LR-000013",
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
        },
        employeeId: secondEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdReleasedRecord = response;
        cy.drAPIApproveAndRelease({
          documentId: createdReleasedRecord.id,
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

  context("Time travel one day back to the future", () => {
    it("Login user 1 to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it(`Select 1 day to back in future`, () => {
      cy.asyncSelectBackToTheFutureTime({ day: 1 });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
    });
  });

  context("Day 5 User 1 Spent Time Tracking", () => {
    it("Login user 1 to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open first document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open first document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open first document", () => {
      cy.dlSelectFirstDocument();
    });
  });

  context("Day 5 User 2 Spent Time Tracking", () => {
    it("[API]Login user 2", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create Draft PO", (done: any) => {
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
              description: "<p>Draft PO</p>",
              document: {
                docId: "POT-00006",
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
                      partNumber: faker.random.uuid(),
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
                  ],
                },
                "fb-po-approvals": [
                  secondEmployee.id,
                ],
                "po-status-built-in": "Open",
                "po-requestor-autocomplete": secondEmployee.id,
                "po-order-date": todaysDate,
                "po-supplier-built-in": createdSupplierDocument.id,
              },
            },
            employeeId: secondEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => {
            done();
          });
        });
      });
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

    it("Parse to JSON for Session Time", () => {
      cy.task("parseXlsx", { file: usageReportXlsxFileNameAndPath, sheet: "Session Time" }).then((rows: any) => {
        cy.writeFile(sessionReportJsonFileNameAndPath, { rows });
      });
    });
  });

  context("Verify number of documents for company 1", () => {
    it("Read data from JSON", () => {
      cy.readFile(perCompanyReportJsonFileNameAndPath).then((data) => {
        const relesedCompletedKey = createdCompany.name;

        const keysInReport = Object.keys(data.rows[1]);
        const indexOfUnknownKey = keysInReport.indexOf(relesedCompletedKey) + 1;
        const draftPendingKey = keysInReport[indexOfUnknownKey];

        data.rows.forEach((row, i) => {
          if (i !== 0) {
            numberOfDocsFromUsageReportForCompany1.push({
              name: row[""],
              releasedCompleted: parseInt(row[relesedCompletedKey], 10),
              draftPending: parseInt(row[draftPendingKey], 10),
            });
          }
        });
      });
    });

    it("Verify data from usage report", () => {
      assert.deepEqual(numberOfDocsFromUsageReportForCompany1, numberOfCreatedDocsForComany1);
    });
  });

  context("Verify number of documents for company 2", () => {
    it("Read data from JSON", () => {
      cy.readFile(perCompanyReportJsonFileNameAndPath).then((data) => {
        const relesedCompletedKey = createdCompany2.name;

        const keysInReport = Object.keys(data.rows[1]);
        const indexOfUnknownKey = keysInReport.indexOf(relesedCompletedKey) + 1;
        const draftPendingKey = keysInReport[indexOfUnknownKey];

        data.rows.forEach((row, i) => {
          if (i !== 0) {
            numberOfDocsFromUsageReportForCompany2.push({
              name: row[""],
              releasedCompleted: parseInt(row[relesedCompletedKey], 10),
              draftPending: parseInt(row[draftPendingKey], 10),
            });
          }
        });
      });
    });

    it("Verify data from usage report", () => {
      assert.deepEqual(numberOfDocsFromUsageReportForCompany2, numberOfCreatedDocsForComany2);
    });
  });

  context("Verify aprox session time for user", () => {
    it("Read data from JSON", () => {
      cy.readFile(sessionReportJsonFileNameAndPath).then((data) => {
        const keysInReport = Object.keys(data.rows[1]);

        const sessionAdminUserData = data.rows.find(
          (row) => row[keysInReport[0]] === createdCompany.name && row[keysInReport[1]] === USERS[1].email);

        const sessionUser2Data = data.rows.find(
          (row) => row[keysInReport[0]] === createdCompany.name && row[keysInReport[1]] === USERS[2].email);

        const sessionUser3Data = data.rows.find(
          (row) => row[keysInReport[0]] === createdCompany.name && row[keysInReport[1]] === USERS[3].email);

        const sessionUser4Data = data.rows.find(
          (row) => row[keysInReport[0]] === createdCompany.name && row[keysInReport[1]] === USERS[4].email);

        const sessionUser5Data = data.rows.find(
          (row) => row[keysInReport[0]] === createdCompany.name && row[keysInReport[1]] === USERS[5].email);

        spentTimeFromReport.sessionTimeAproxAdminUser = parseFloat(sessionAdminUserData[keysInReport[2]]);
        spentTimeFromReport.sessionTimeAproxUser2 = parseFloat(sessionUser2Data[keysInReport[2]]);
        spentTimeFromReport.sessionTimeAproxUser3 = parseFloat(sessionUser3Data[keysInReport[2]]);
        spentTimeFromReport.sessionTimeAproxUser4 = parseFloat(sessionUser4Data[keysInReport[2]]);
        spentTimeFromReport.sessionTimeAproxUser5 = parseFloat(sessionUser5Data[keysInReport[2]]);
      });
    });

    it("Verify data from usage report", () => {
      expect(spentTimeFromReport.sessionTimeAproxAdminUser).to.be.within(0, 15000);
      expect(spentTimeFromReport.sessionTimeAproxUser2).to.be.within(0, 1);
      expect(spentTimeFromReport.sessionTimeAproxUser3).to.be.within(0, 1);
      expect(spentTimeFromReport.sessionTimeAproxUser4).to.be.within(0, 1);
      expect(spentTimeFromReport.sessionTimeAproxUser5).to.be.within(0, 1);
    });
  });
});


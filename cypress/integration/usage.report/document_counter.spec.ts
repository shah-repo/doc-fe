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
import { CyRoutes } from "../../support/routes";
import { emailDateOffset, fileTimeFormat, momentInPST } from "../../utils/constants/dateHandler";
import { EngineeringBuild } from "../../utils/constants/documentTypes/engineeringBuild";
import { GeneralDocumentDocType } from "../../utils/constants/documentTypes/generalDocument";
import { LHRT } from "../../utils/constants/documentTypes/lhrt";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { LegalRecord } from "../../utils/constants/documentTypes/record";
import { TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { NavigationItems } from "../../utils/constants/navigationItems";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let asyncTasksGroup;
let formDocumentType;
let legalRecordDocumentType;
let secondEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let equipmentDocumentType;
let group;
let inlineRecordForm;
let adminEmployee;
let loginResponse;
let createdCompany;
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
let ebDocumentType;
let createdEBform;
let createdPartFormDocument;
let partDocumentType;
let createdPOAMform;
let damDocumentType;
let createdDAMForm;
let createdDAMDocument;
let createdPartDocument;
let createdDraftPart;
let releasedequipmentDocument;
let approvalForVoidedSupplier;
let createdMPIDocument;
let MPIDocumentType;
let generalDocumentType;
let createdGeneralDocument;
let createdLotsFormDocument;
let CSLDocumentType;
let createdPODocument;
let createdPODocument3;
let createdRelesedReceivable;
let EBDocumentType;
let LHRtDocumentType;
let createdLHRtDocument;
let LHRDocumentType;
let trainingCurriculumDocumentType;
let createdTrainingCurriculumFormDocument;
let createdARForGD;
let createdRecordForm;
let createdRecordForm2;
let createdReleasedRecord;
let createdVoidedRecord;
let createdInReviewRecord;
let createdEBRecord;
let lhrDocUrl;
let createdLot;
let createdTrainingCurriculumRecord;

const todaysDate = momentInPST();
const todaysDateFormated = momentInPST().format("L");
const usageReportXlsxFileName = "Usage_report_" + fileTimeFormat + ".xlsx";
const usageReportXlsxFileNameAndPath = "cypress/downloads/" + usageReportXlsxFileName;
const perCompanyReportJsonFileName = "Per_company_report_" + fileTimeFormat + ".json";
const perCompanyReportJsonFileNameAndPath = "cypress/downloads/" + perCompanyReportJsonFileName;
const userReportJsonFileName = "user_report_" + fileTimeFormat + ".json";
const userReportJsonFileNameAndPath = "cypress/downloads/" + userReportJsonFileName;
const sessionReportJsonFileName = "session_report_" + fileTimeFormat + ".json";
const sessionReportJsonFileNameAndPath = "cypress/downloads/" + sessionReportJsonFileName;

const nameOfUserToSignUp = faker.name.findName();
const emailOfUserToSignUp =
`enlil.testmail+${faker.fake("{{address.zipCode}}{{internet.userName}}")}@gmail.com`.toLowerCase();

const usageReportTomorrow = momentInPST().add("days", "2").format("YYYY-MM-DDThh:mm");

export interface StructureFromPerCompanyReport {
  name: string;
  releasedCompleted: integer;
  draftPending: integer;
}

interface StructureFromUserReport {
  numberOfRegistredUsers: integer;
  numberOfUniqueUsers: integer;
}

interface StructureFromSessionReport {
  sessionTimeAproxAdminUser: float;
  sessionTimeAproxNewUser: float;
}

const numberOfDocsFromUsageReport: StructureFromPerCompanyReport[] = [];
const numberOfCreatedDocs: StructureFromPerCompanyReport[] = [
  {
    name: "Parts",
    releasedCompleted: 1,
    draftPending: 1,
  },
  {
    name: "Equipment",
    releasedCompleted: 1,
    draftPending: 1,
  },
  {
    name: "Supplier",
    releasedCompleted: 1,
    draftPending: 2,
  },
  {
    name: "Purchase Order",
    releasedCompleted: 2,
    draftPending: 2,
  },
  {
    name: "Receiving",
    releasedCompleted: 1,
    draftPending: 1,
  },
  {
    name: "EB",
    releasedCompleted: 1,
    draftPending: 0,
  },
  {
    name: "LHR",
    releasedCompleted: 1,
    draftPending: 1,
  },
  {
    name: "LOT",
    releasedCompleted: 1,
    draftPending: 0,
  },
  {
    name: "Records",
    releasedCompleted: 2,
    draftPending: 2,
  },
  {
    name: "Documents",
    releasedCompleted: 18,
    draftPending: 1,
  },
  {
    name: "Approval Requests",
    releasedCompleted: 32,
    draftPending: 2,
  },
  {
    name: "Training Records",
    releasedCompleted: 0,
    draftPending: 2,
  },
];

const createdUsers: StructureFromUserReport = {
  numberOfRegistredUsers: 6,
  numberOfUniqueUsers: 2,
};
const usersFromReport: StructureFromUserReport = {
  numberOfRegistredUsers: 0,
  numberOfUniqueUsers: 0,
};

const spentTimeFromReport: StructureFromSessionReport = {
  sessionTimeAproxAdminUser: 0.0,
  sessionTimeAproxNewUser: 0.0,
};

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
              MPITest,
              GeneralDocumentDocType,
              EngineeringBuild,
              LHRT,
              { ...TrainingCurriculum, documentTypeName: "Training Curriculum Test" },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          legalRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, LegalRecord.documentTypeName);
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order");
          receivingDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable");
          ebDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Engineering Build");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          damDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Document Approval Matrix");
          MPIDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          generalDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, GeneralDocumentDocType.documentTypeName);
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification Lot");
          EBDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Engineering Build Test");
          LHRtDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "LHR template");
          LHRDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lot History Record");
          trainingCurriculumDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Training Curriculum Test");
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
                        tabId: "details",
                      },
                      {
                        index: 1,
                        type: "inlineapproval",
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
                        tabId: "details",
                        editorConfig: {
                          approvers: [
                            adminEmployee.id,
                          ],
                        },
                      },
                      {
                        index: 2,
                        type: "textfield",
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
                        tabId: "details",
                      },
                      {
                        index: 3,
                        type: "inlineapproval",
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
                        tabId: "details",
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
              description: "<p>Maintenance and Calibration form</p>",
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
              name: "Maintenance and calibration form document",
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
                    index: 0,
                    label: "EQ Status",
                    tabId: "overview",
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
                    index: 1,
                    label: "Primary Owner",
                    tabId: "specification",
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
                    index: 2,
                    label: "Coordinator",
                    tabId: "specification",
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
                  {
                    index: 3,
                    type: "eqmaintenance",
                    name: "pm-ki5wtk5l",
                    editorConfig: {
                      type: "preventativeMaintenance",
                    },
                    editorProperties: [],
                    label: "Preventative Maintenance",
                    tabId: "specification",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "PM",
                  },
                  {
                    index: 4,
                    type: "eqmaintenance",
                    name: "calibration-ki5wtyj0",
                    editorConfig: {
                      type: "calibration",
                    },
                    editorProperties: [],
                    label: "Calibration",
                    tabId: "specification",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "Calibration",
                  },
                  {
                    label: "form.builder.approvals",
                    tabId: "overview",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-kycyk1n8",
                    uniqueSchemaItem: true,
                    index: 5,
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
                    index: 0,
                    label: "Receive PO",
                    tabId: "details",
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
                    tabId: "details",
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

        it("[API]Create Part form", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part form</p>",
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
              name: "Part form document",
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
          }).then((response) => {
            createdPartFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdPartFormDocument.id,
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

        it("[API]Create EB form", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>EB form</p>",
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
              name: "EB form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: ebDocumentType[0].id,
                }],
                schema: [
                  {
                    type: "parts",
                    name: "fb-parts-l42j5ayw",
                    uniqueSchemaItem: true,
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "",
                    rules: "",
                    applicableOn: [],
                    applicableValidationSchema: true,
                    editorProperties: [],
                    index: 0,
                    tabId: "procedure",
                  },
                  {
                    type: "section",
                    name: "fb-procedure-section-l42j5ayw",
                    label: "form.builder.procedure",
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "",
                    rules: "",
                    applicableOn: [],
                    applicableValidationSchema: true,
                    editorProperties: [],
                    index: 1,
                    tabId: "procedure",
                  },
                  {
                    index: 2,
                    type: "procedure",
                    tabId: "procedure",
                    name: "-l42j5ayx",
                    hidden: false,
                    outputDisabled: false,
                    deleted: false,
                    deleteInFormDisabled: false,
                    validationMode: "default",
                    validationAttribute: "",
                    rules: "",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    editorProperties: [
                      "copyableValue",
                    ],
                    stepIndex: 1,
                  },
                  {
                    name: "fb-approvals-l42iv0i2",
                    type: "approvals",
                    index: 3,
                    label: "form.builder.approvals",
                    tabId: "overview",
                    deleteDisabled: true,
                    uniqueSchemaItem: true,
                  },
                ],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdEBform = response;
            cy.drAPIApproveAndRelease({
              documentId: createdEBform.id,
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

        it("[API]Create POAM form", (done: any) => {
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
                  id: purchaseOrderDocumentType[0].id,
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

        it("[API]Create POAM document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              formDocument: {
                id: createdPOAMform.id,
              },
              formInput: {
                "po-levels-built-in": {
                  approvalLevels: [],
                },
              },
              description: "<p>POAM</p>",
              document: {
                docId: "POAM-00001",
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
              name: "",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdEBform = response;
            cy.drAPIApproveAndRelease({
              documentId: createdEBform.id,
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

        it("[API]Create DAM form", (done: any) => {
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

        it("[API]Create DAM document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              formDocument: {
                id: createdDAMForm.id,
              },
              description: "<p>DAM</p>",
              formInput: {
                "dar-built-in": [
                  {
                    employees: [],
                    groups: [
                      {
                        id: group.body[0].id,
                      },
                    ],
                    name: "Test group",
                    id: "44ada43e-de5d-4ac5-95b7-9e3dd949d1cd",
                    index: 0,
                  },
                ],
                "dam-built-in": [
                  {
                    id: "84ddcc0e-e1bd-4646-b1f2-837ad8e250cd",
                    docType: {
                      defaultTraining: false,
                      needsSignature: false,
                      acronym: "TT-",
                      group: "OTHER",
                      name: "Test Type",
                      category: "record",
                    },
                    approvalRoles: {
                      stage1: [],
                      stage2: [],
                      stage3: [],
                      admStage: [],
                    },
                  },
                ],
              },
              document: {
                docId: "DAM-00001",
                documentType: {
                  id: damDocumentType[0].id,
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
              name: "DAM document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdDAMDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdDAMDocument.id,
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

        it("[API]Create Draft part document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part document</p>",
              document: {
                docId: "PRT-00002",
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
              name: "Draft Part document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(done());
        });

        it("[API]Create Pending change part document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Part document</p>",
              document: {
                docId: "PRT-00003",
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
              name: "Pending Change Part document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdDraftPart = response;
            cy.arCreateApprovalRequest({
              payload: {
                title: "Approval for part",
                description: "Description for approval part",
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                formInput: {
                  documentRevisions: [{
                    proposedDocumentRevision: { id: createdDraftPart.id },
                    descriptionOfChange: "description of change",
                    justificationOfChange: "justification of change",
                    id: faker.random.uuid(),
                  }],
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
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
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

      context("[API]Create Suppliers document", () => {
        it("[API]Create Draft Supplier document", () => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Supplier</p>",
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
              name: "Draft Supplier",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          });
        });

        it("[API]Create Draft Supplier document 2", () => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Supplier</p>",
              document: {
                docId: "SUP-00002",
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
              name: "Draft Supplier2",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          });
        });

        it("[API]Create Voided Supplier document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              formDocument: {
                id: createdSupplierFormDocument.id,
              },
              description: "Supplier voided",
              name: "Supplier voided",
              attachments: [],
              referenceTo: [],
              revisionStage: 1,
              revisionChangeType: RevisionChangeType.NextRevision,
              document: {
                docId: "SUP-00004",
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
                  id: supplierDocumentType[0].id,
                },
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdSupplierDocument = response;
            cy.approvals({
              assignedEmployeeId: adminEmployee.id,
              fieldId: "fb-approvals-l42iv0i2",
              recordId: createdSupplierDocument.id,
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then((response) => {
              approvalForVoidedSupplier = response;
              cy.approvalSubmitForApproval({
                docRevId: createdSupplierDocument.id,
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => {
                cy.approvalApprove({
                  approvalsId: approvalForVoidedSupplier.id,
                  employeeId: adminEmployee.id,
                  sessionId: loginResponse.sessionId,
                }).then(() => {
                  cy.recAPICreateVoidedDocument({
                    fromDocumentId: createdSupplierFormDocument.id,
                    formInputFieldName: "fb-approvals-l42iv0i2",
                    formInputApprovalId: adminEmployee.id,
                    documentId: createdSupplierDocument.documentId,
                    employeeId: adminEmployee.id,
                    sessionId: loginResponse.sessionId,
                  }).then((response) => {
                    createdSupplierDocument = response;
                    cy.approvals({
                      assignedEmployeeId: adminEmployee.id,
                      fieldId: "fb-approvals-l42iv0i2",
                      recordId: createdSupplierDocument.id,
                      employeeId: adminEmployee.id,
                      sessionId: loginResponse.sessionId,
                    }).then((response) => {
                      approvalForVoidedSupplier = response;
                      cy.approvalSubmitForApproval({
                        docRevId: createdSupplierDocument.id,
                        employeeId: adminEmployee.id,
                        sessionId: loginResponse.sessionId,
                      }).then(() => {
                        cy.approvalApprove({
                          approvalsId: approvalForVoidedSupplier.id,
                          employeeId: adminEmployee.id,
                          sessionId: loginResponse.sessionId,
                        }).then(() => done());
                      });
                    });
                  });
                });
              });
            });
          });
        });

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

      context("[API]Create MPI, LOT form and GD document", () => {
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

        it("[API]Create Lots form", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Lots Form document</p>",
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
              name: "Lots form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: CSLDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "lot_quantity",
                    type: "quantity",
                    index: 0,
                    label: "Initial Quantity",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Initial Quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lot_usable_quantity",
                    type: "quantity",
                    index: 1,
                    label: "Usable Quantity",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    editorProperties: [],
                    validationAttribute: "Usable Quantity",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lot_expiry_date",
                    type: "datepicker",
                    index: 2,
                    label: "Expiration Date",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Expiration Date",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "lot_part",
                    type: "autocomplete",
                    index: 3,
                    label: "Part Selection",
                    tabId: "details",
                    optionId: "21",
                    placeholder: "Select the appropriate part for this lot",
                    deleteDisabled: true,
                    deleteInFormDisabled: true,
                  },
                  {
                    name: "100-inspection-override",
                    type: "checkboxgroup",
                    index: 4,
                    label: "100% Inspection Override",
                    tabId: "details",
                    options: [
                      {
                        text: "100% Inspection Override",
                        value: "100% Inspection Override",
                      },
                    ],
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationMode: "default",
                    editorProperties: [],
                    validationAttribute: "100% Inspection Override",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    label: "form.builder.approvals",
                    tabId: "details",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-",
                    uniqueSchemaItem: true,
                    index: 5,
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

        it("[API]Create General Document", (done: any) => {
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

        it("[API]Create draft PO", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>draft PO</p>",
              document: {
                docId: "POT-00002",
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
                      partNumberDocId: "PRT-00006 - 1",
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
                  ],
                },
                "fb-po-approvals": [
                  adminEmployee.id,
                ],
                "po-status-built-in": "Closed",
                "po-requestor-autocomplete": adminEmployee.id,
                "po-order-date": todaysDate,
                "po-supplier-built-in": createdSupplierDocument.id,
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => done());
        });

        it("[API]Create Pending PO", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>pending PO</p>",
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
                      partNumberDocId: "PRT-00007 - 1",
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
                  ],
                },
                "fb-po-approvals": [
                  adminEmployee.id,
                ],
                "po-status-built-in": "Closed",
                "po-requestor-autocomplete": adminEmployee.id,
                "po-order-date": todaysDate,
                "po-supplier-built-in": createdSupplierDocument.id,
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdPODocument3 = response;
            cy.approvals({
              assignedEmployeeId: adminEmployee.id,
              fieldId: "fb-po-approvals",
              recordId: createdPODocument3.id,
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then((response) => {
              approvalForVoidedSupplier = response;
              cy.approvalSubmitForApproval({
                docRevId: createdPODocument3.id,
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => done());
            });
          });
        });
      });

      context("[API]Create Receiving documents", () => {
        it("[API] Create draft receivable", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              name: "",
              description: "",
              document: {
                docId: "RC-00001",
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
                "receive-po-kzqkr5yl": { id: createdPODocument.id },
                "fb-approvals-fb-approvals-kzqkpxqm": [],
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => done());
        });

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
                "receive-po-kzqkr5yl": { id: createdPODocument3.id },
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

      context("[API]Create EB record", () => {
        it("[API]Create EB record", (done: any) => {
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
            createdEBRecord = response;
            cy.drAPIApproveAndRelease({
              documentId: createdEBRecord.id,
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

      context("[API]Create LHRt and GD in pending change", () => {
        it("[API]Create LHRt document", (done: any) => {
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

        it("[API]Create General Document in Pending", (done: any) => {
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
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdGeneralDocument = response;
            cy.arCreateApprovalRequest({
              payload: {
                title: "Approval for part",
                description: "Description for approval part",
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                formInput: {
                  documentRevisions: [{
                    proposedDocumentRevision: { id: createdGeneralDocument.id },
                    descriptionOfChange: "description of change",
                    justificationOfChange: "justification of change",
                    id: faker.random.uuid(),
                  }],
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

      context("[API]Create additional forms", () => {
        it("[API]Create form for Legal Record 1", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Record form 1</p>",
              document: {
                docId: "FM-00013",
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
              name: "API Legal Record form",
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

        it("[API]Create form for Legal Record 2", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Record form 2</p>",
              document: {
                docId: "FM-00014",
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
              name: "API Legal Record form 2",
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
            createdRecordForm2 = response;
            cy.drAPIApproveAndRelease({
              documentId: createdRecordForm2.id,
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

        it("[API]Create Training Curriculum form", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Training Curriculum form</p>",
              document: {
                docId: "FM-000015",
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
              name: "Training Curriculum form document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: trainingCurriculumDocumentType[0].id,
                }],
                schema: [
                  {
                    name: "training-curriculum-details-section",
                    type: "section",
                    index: 0,
                    label: "Periodic Training",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Periodic Training",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-document-to-be-trained-on",
                    type: "autocomplete",
                    index: 1,
                    label: "Documents to Train on",
                    tabId: "details",
                    rules: "|required",
                    multiple: true,
                    optionId: "36",
                    validators: {
                      required: true,
                    },
                    placeholder: "Select documents for training",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "visibility",
                    editorProperties: [
                      "multiple",
                    ],
                    validationAttribute: "Documents to Train on",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-refresh-training-periodically",
                    type: "radiogroup",
                    index: 2,
                    label: "Refresh/repeat training periodically?",
                    tabId: "details",
                    rules: "required||",
                    options: [
                      {
                        text: "Yes",
                        value: "Yes",
                      },
                    ],
                    validators: {
                      required: true,
                    },
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Refresh/repeat training periodically?",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-validity",
                    type: "quantity",
                    index: 3,
                    label: "Training Frequency (in days)",
                    tabId: "details",
                    rules: "required_if:training-refresh-training-periodically,Yes",
                    validators: {
                      required_if: {
                        name: "training-refresh-training-periodically",
                        value: [
                          "Yes",
                        ],
                      },
                    },
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "visibility",
                    validationAttribute: "Training Frequency (in days)",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-details-section",
                    type: "section",
                    index: 4,
                    label: "Trainees Details",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    validationAttribute: "Trainees Details",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-select-groups-to-train",
                    type: "autocomplete",
                    index: 5,
                    label: "Groups to Train",
                    tabId: "details",
                    multiple: true,
                    optionId: "10",
                    placeholder: "Select groups",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    editorProperties: [
                      "multiple",
                    ],
                    validationAttribute: "Groups to Train",
                    applicableValidationSchema: true,
                  },
                  {
                    name: "training-select-users-to-train",
                    type: "autocomplete",
                    index: 6,
                    label: "Users to Train (if applicable)",
                    tabId: "details",
                    multiple: true,
                    optionId: "13",
                    placeholder: "Select users",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    validationMode: "default",
                    editorProperties: [
                      "multiple",
                    ],
                    validationAttribute: "Users to Train (if applicable)",
                    applicableValidationSchema: true,
                  },
                  {
                    label: "form.builder.approvals",
                    type: "approvals",
                    deleteDisabled: true,
                    name: "fb-approvals-l0wcpa0v",
                    tabId: "overview",
                    uniqueSchemaItem: true,
                    index: 7,
                  },
                ],
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdTrainingCurriculumFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdTrainingCurriculumFormDocument.id,
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

        it("[API]Create General Document in Approved", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>GD document3 </p>",
              document: {
                docId: "GD-00003",
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
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdGeneralDocument = response;
            cy.arCreateApprovalRequest({
              payload: {
                title: "Approval for part",
                description: "Description for approval part",
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                formInput: {
                  documentRevisions: [{
                    proposedDocumentRevision: { id: createdGeneralDocument.id },
                    descriptionOfChange: "description of change",
                    justificationOfChange: "justification of change",
                    id: faker.random.uuid(),
                  }],
                },
              },
              employeeId: adminEmployee.id as unknown as string,
              sessionId: loginResponse.sessionId as unknown as string,
            }).then((response) => {
              createdARForGD = response;
              cy.arPatchAR({
                payload: {
                  formInput: {
                    documentRevisions: [{
                      proposedDocumentRevision: { id: createdGeneralDocument.id },
                      descriptionOfChange: "description of change",
                      justificationOfChange: "justification of change",
                      id: faker.random.uuid(),
                    }],
                    approvers: [
                      {
                        approver: {
                          id: adminEmployee.id,
                        },
                        signatureGroupId: {
                          id: null,
                        },
                      },
                    ],
                  },
                },
                arID: createdARForGD.id,
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => {
                cy.arInReview({
                  employeeId: adminEmployee.id,
                  sessionId: loginResponse.sessionId,
                  arID: createdARForGD.id,
                }).then(() => {
                  cy.arApprove({
                    employeeId: adminEmployee.id,
                    sessionId: loginResponse.sessionId,
                    arID: createdARForGD.id,
                  }).then(() => done());
                });
              });
            });
          });
        });

        it("[API]Create General Obsoleted Document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Obsoleted General document</p>",
              document: {
                docId: "GD-00004",
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
              cy.drCreateDocumentRevision({
                payload: {
                  description: "<p>General document</p>",
                  name: "API General Document",
                  attachments: [],
                  referenceTo: [],
                  revisionStage: 1,
                  revisionChangeType: RevisionChangeType.Obsolete,
                  retrain: false,
                  document: {
                    id: createdGeneralDocument.documentId,
                  },
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
                }).then(() => done());
              });
            });
          });
        });
      });

      context("[API]Create records", () => {
        it("[API]Create last signed record inline", (done: any) => {
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

        it("[API]Create WIP record", (done: any) => {
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
              name: "API WIP record",
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
          }).then(() => done());
        });

        it("[API]Create Voided record document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              formDocument: {
                id: createdRecordForm.id,
              },
              description: "Record voided",
              name: "Record voided",
              attachments: [],
              referenceTo: [],
              revisionStage: 1,
              revisionChangeType: RevisionChangeType.NextRevision,
              document: {
                docId: "LR-00004",
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
                  id: legalRecordDocumentType[0].id,
                },
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdVoidedRecord = response;
            cy.approvals({
              assignedEmployeeId: adminEmployee.id,
              fieldId: "fb-approvals",
              recordId: createdVoidedRecord.id,
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then((response) => {
              approvalForVoidedSupplier = response;
              cy.approvalSubmitForApproval({
                docRevId: createdVoidedRecord.id,
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => {
                cy.approvalApprove({
                  approvalsId: approvalForVoidedSupplier.id,
                  employeeId: adminEmployee.id,
                  sessionId: loginResponse.sessionId,
                }).then(() => {
                  cy.recAPICreateVoidedDocument({
                    fromDocumentId: createdRecordForm.id,
                    formInputFieldName: "fb-approvals",
                    formInputApprovalId: adminEmployee.id,
                    documentId: createdVoidedRecord.documentId,
                    employeeId: adminEmployee.id,
                    sessionId: loginResponse.sessionId,
                  }).then((response) => {
                    createdVoidedRecord = response;
                    cy.approvals({
                      assignedEmployeeId: adminEmployee.id,
                      fieldId: "fb-approvals",
                      recordId: createdVoidedRecord.id,
                      employeeId: adminEmployee.id,
                      sessionId: loginResponse.sessionId,
                    }).then((response) => {
                      approvalForVoidedSupplier = response;
                      cy.approvalSubmitForApproval({
                        docRevId: createdVoidedRecord.id,
                        employeeId: adminEmployee.id,
                        sessionId: loginResponse.sessionId,
                      }).then(() => {
                        cy.approvalApprove({
                          approvalsId: approvalForVoidedSupplier.id,
                          employeeId: adminEmployee.id,
                          sessionId: loginResponse.sessionId,
                        }).then(() => done());
                      });
                    });
                  });
                });
              });
            });
          });
        });

        it("[API]Create In review record document", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              formDocument: {
                id: createdRecordForm.id,
              },
              description: "In review Record",
              name: "In review Record",
              attachments: [],
              referenceTo: [],
              revisionStage: 1,
              revisionChangeType: RevisionChangeType.NextRevision,
              document: {
                docId: "LR-00005",
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
                  id: legalRecordDocumentType[0].id,
                },
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdInReviewRecord = response;
            cy.approvals({
              assignedEmployeeId: adminEmployee.id,
              fieldId: "fb-approvals",
              recordId: createdInReviewRecord.id,
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then((response) => {
              approvalForVoidedSupplier = response;
              cy.approvalSubmitForApproval({
                docRevId: createdInReviewRecord.id,
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => done());
            });
          });
        });
      });

      context("[API]Create LHR", () => {
        it("[API]Create LHR document", (done: any) => {
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
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => done());
        });

        it("[API]Create LHR document to be released", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>LHR</p>",
              document: {
                docId: "LHR-00002",
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
              name: "API Released LHR document",
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
      });

      context("[API]Create LOT", () => {
        it("[API]Create Lot record", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              formDocument: {
                id: createdLotsFormDocument.id,
              },
              formInput: {
                "fb-approvals-": [],
                "lot_quantity": 5,
                "lot_usable_quantity": 3,
                "lot_expiry_date": new Date(),
                "lot_part": createdPartDocument.id,
                "100-inspection-override": [
                  "100% Inspection Override",
                ],
              },
              description: "",
              name: "API LOT 1",
              attachments: [],
              referenceTo: [],
              revisionStage: 3,
              revisionChangeType: RevisionChangeType.NextRevision,
              retrain: false,
              document: {
                docId: "LOT #22041301",
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
                  id: CSLDocumentType[0].id,
                },
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdLot = response;
            cy.drAPIApproveAndRelease({
              documentId: createdLot.id,
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

      context("[API]Create Training Curriculum", () => {
        it("[API]Create Released Training Curriculum record", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Training Curriculum record</p>",
              document: {
                docId: "TCT-00001",
                documentType: {
                  id: trainingCurriculumDocumentType[0].id,
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
              name: "ATraining Curriculum test record",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 3,
              formDocument: {
                id: createdTrainingCurriculumFormDocument.id,
              },
              formInput: {
                "training-document-to-be-trained-on": [
                  createdSupplierFormDocument.documentId,
                ],
                "training-refresh-training-periodically": "Yes",
                "training-validity": 5,
                "training-select-groups-to-train": [
                  asyncTasksGroup.body[0].id,
                ],
                "training-select-users-to-train": [
                  adminEmployee.id,
                ],
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdTrainingCurriculumRecord = response;
            cy.drAPIApproveAndRelease({
              documentId: createdTrainingCurriculumRecord.id,
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

        it("[API]Create draft Training Curriculum record", (done: any) => {
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Training Curriculum record 2</p>",
              document: {
                docId: "TCT-00002",
                documentType: {
                  id: trainingCurriculumDocumentType[0].id,
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
              name: "BTraining Curriculum test record2",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 3,
              formDocument: {
                id: createdTrainingCurriculumFormDocument.id,
              },
              formInput: {
                "training-document-to-be-trained-on": [
                  createdSupplierFormDocument.documentId,
                ],
                "training-refresh-training-periodically": "Yes",
                "training-validity": 5,
                "training-select-groups-to-train": [
                  asyncTasksGroup.body[0].id,
                ],
                "training-select-users-to-train": [
                  adminEmployee.id,
                ],
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then(() => done());
        });
      });
    });
  });

  context("Start sign a user flow", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to User management", () => {
      cy.usrNavigateToUserManagement();
    });

    it("Click 'ADD EMPLOYEE'", () => {
      cy.usrClickAddEmployee();
    });

    context("Fill in user attributes", () => {
      it("Enters e-mail", () => {
        cy.usrEnterEmail({ email: emailOfUserToSignUp });
      });

      it("Enters name", () => {
        cy.usrEnterName({ name: nameOfUserToSignUp });
      });
    });

    context("Create user", () => {
      it("Clicks the save button", () => {
        cy.usrClickSaveButton();
        cy.checkToastMessage({ exists: false });
      });
    });
  });

  context("Activate user", () => {
    it("Verify user is loged in", () => {
      cy.authLogout();
    });

    it("Verify activation email", () => {
      cy.imapGetActivationLink({ userEmail: emailOfUserToSignUp });
    });

    it("Enter password", () => {
      cy.authEnterSignUpPassword();
    });

    it("Enter password for confirmation", () => {
      cy.authEnterSignUpConfirmPassword();
    });

    it("Click 'SIGN IN'", () => {
      cy.authClickSignIn();
    });

    it("Verify user is loged in", () => {
      cy.navigListExistsCheck(
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_CONTROL);
    });
  });

  context("Log out and sign in again", () => {
    it("Logout", () => {
      cy.authLogout();
    });

    it("Log user in", () => {
      cy.authLogin({
        email: emailOfUserToSignUp,
      });
    });

    it("Verify user is loged in", () => {
      cy.navigListExistsCheck(
        NavigationItems.DASHBOARD,
        NavigationItems.DOCUMENT_CONTROL);
    });

    it("Navigate to Document List", () => {
      cy.navigToDocumentList();
    });

    it("Open first document", () => {
      cy.dlSelectFirstDocument();
    });
  });

  context("Login user and complete one LHR steps", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to LHR", () => {
      cy.navigToLHR();
    });

    it("Select first LHR", () => {
      cy.dlSelectFirstDocument();
    });

    context("Enter LHR atributes", () => {
      it("Enter initial quantity", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
          cy.unClick();
          cy.url().then((url: any) => {
            lhrDocUrl = url;
          });
        });
      });

      it("Select 'R&D' build type", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.get("[value=\"R&D\"]").check();
        });
      });

      it("Add 'Due Date'", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
          cy.poAddDateRequired();
        });
      });

      it("Click save document", () => {
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.wait(7000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Complete LHR step", () => {
      it("Navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Open LHRs 1 dropdown", () => {
        cy.get(`div[id="sm-tabpanel-1"] circle`).arrowClick();
      });

      it("Click 'START MPI'", () => {
        cy.mpiStartStep({ stepNumber: 1 });
      });

      it("Click save document", () => {
        cy.wait(5000);
        cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify status is WIP", () => {
        cy.drCheckDocumentStatus({ status: "WIP" });
      });

      it("Select 'Procedure' tab", () => {
        cy.drSelectProcedureTab();
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

      it("Click on 'Overview' tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add approval", () => {
        cy.wait(3000);
        cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Submit for approval", () => {
        cy.wait(3000);
        cy.pmSubmitForApproval();
      });

      it("Approve approval", () => {
        cy.wait(3000);
        cy.ebApprove();
      });
    });

    context("Complete LHR", () => {
      it("Navig to LHR", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetRequiredApproversDocRev], () => {
          cy.visit(lhrDocUrl);
        });
      });

      it("Add approval", () => {
        cy.lhrAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Submit for approval", () => {
        cy.lhrSubmitForApproval();
      });

      it("Approve approval", () => {
        cy.lhrApprove();
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

    it("Parse to JSON for Users Report", () => {
      cy.task("parseXlsx", { file: usageReportXlsxFileNameAndPath, sheet: "Users Report" }).then((rows: any) => {
        cy.writeFile(userReportJsonFileNameAndPath, { rows });
      });
    });

    it("Parse to JSON for Session Time", () => {
      cy.task("parseXlsx", { file: usageReportXlsxFileNameAndPath, sheet: "Session Time" }).then((rows: any) => {
        cy.writeFile(sessionReportJsonFileNameAndPath, { rows });
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

  context("Verify number of users and unique users", () => {
    it("Read data from JSON", () => {
      cy.readFile(userReportJsonFileNameAndPath).then((data) => {
        const companyKey = "Enlil Customer (enlil.io)";
        const registeredUsersKey = "Registered Users";
        const uniqueUsersKey = "Unique Users";

        const companyUsersData = data.rows.find((row) => row[companyKey] === createdCompany.name);

        usersFromReport.numberOfRegistredUsers = parseInt(companyUsersData[registeredUsersKey], 10);
        usersFromReport.numberOfUniqueUsers = parseInt(companyUsersData[uniqueUsersKey], 10);
      });
    });

    it("Verify data from usage report", () => {
      assert.deepEqual(usersFromReport, createdUsers);
    });
  });

  context("Verify aprox session time for user", () => {
    it("Read data from JSON", () => {
      cy.readFile(sessionReportJsonFileNameAndPath).then((data) => {
        const keysInReport = Object.keys(data.rows[1]);

        const sessionAdminUserData = data.rows.find(
          (row) => row[keysInReport[0]] === createdCompany.name && row[keysInReport[1]] === USERS[1].email);

        const sessionNewUserData = data.rows.find(
          (row) => row[keysInReport[0]] === createdCompany.name && row[keysInReport[1]] === emailOfUserToSignUp);

        spentTimeFromReport.sessionTimeAproxAdminUser = parseFloat(sessionAdminUserData[keysInReport[2]]);
        spentTimeFromReport.sessionTimeAproxNewUser = parseFloat(sessionNewUserData[keysInReport[2]]);
      });
    });

    it("Verify data from usage report", () => {
      expect(spentTimeFromReport.sessionTimeAproxAdminUser).to.be.within(0, 5);
      expect(spentTimeFromReport.sessionTimeAproxNewUser).to.be.within(0, 1);
    });
  });
});

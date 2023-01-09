/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { GroupTag } from "../../../src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { LHRTTest } from "../../utils/constants/documentTypes/lhrt";
import { LotHistoryRecordTest } from "../../utils/constants/documentTypes/lotHistoryRecord";
import { MPITest } from "../../utils/constants/documentTypes/mpi";
import { RecordDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { FONT_SIZE_11, FONT_SIZE_12, FONT_SIZE_14, FONT_SIZE_14_4, FONT_SIZE_16, FONT_SIZE_28, FONT_WT_300, FONT_WT_400, FONT_WT_600, FONT_WT_700, LINE_HT_1, LINE_HT_13_2, LINE_HT_18, LINE_HT_2, LINE_HT_20, LINE_HT_3, LINE_HT_4, soraSansserif } from "../../utils/constants/fonts_constants";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let secondEmployee;
let everyoneGroup;
let developersGroup;
let asyncTasksGroup;
let caGroup;
let createdTrainingCurriculumFormDocument;
let trainingCurriculumDocumentType;
let clinicalProtocolDocumentType;
let createdClinicalProtocolForm;
let createdPOFormDocument;
let group;
let initialArDocument;
let formDocumentType;
let purchaseOrderDocumentType;
let approvalRequestDocumentType;
let rDdocumentType;
let recDocId;
let partDocumentType;
let MPIDocumentType;
let LHRtDocumentType;
let LHRDocumentType;
let createdPartDocument;
let createdMPIDocument;
let createdLHRtDocument;
let equipmentDocumentType;
let equipmentDocument;
let lhrUrl;

const ADMIN_USER = USERS[1];
const trainingFormId = "FM-00002";
const arId = "AR-00008";
const poOrder = "PO-00001";
const lhrsid = "LHRS-00001";
const lhrid = "LHR-00007";
const rejArId = "AR-00009";
const tcId = "TC-00001";

context("Dashboard notification font test", { tags: ["@timetool"] }, () => {
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
              ClinicalProtocolDocType,
              RecordDocumentType,
              { ...TrainingCurriculum, documentTypeName: "Training Curriculum Test" },
              LotHistoryRecordTest,
              MPITest,
              LHRTTest,
            ],
          },
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          secondEmployee = createdCompany.employees.find(
            (employee) => employee.user.email === USERS[2].email
          );
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          trainingCurriculumDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Training Curriculum Test");
          clinicalProtocolDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Clinical Protocol");
          rDdocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Record Document");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
          MPIDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Manufacturing Process Instructions Test");
          LHRtDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "LHR Template");
          LHRDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lot History Record Test");
          done();
        });
      });
    });

    it("[API]Login first tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Get group for group name 'Developers'", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group for developersGroup", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
          tags: [
            ...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });

    it("[API]Get group for group name 'Async Tasks'", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Async Tasks",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        asyncTasksGroup = response;
        done();
      });
    });

    it("[API]Patch group for asyncTasksGroup", () => {
      cy.grpPatchGroup({
        groupId: asyncTasksGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
        },
      });
    });

    it("[API]Get group for group name 'Company Admin'", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Company Admin",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        caGroup = response;
        done();
      });
    });

    it("[API]Patch group with groip id 'Company Admin'", () => {
      cy.grpPatchGroup({
        groupId: caGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
          tags: [GroupTag.DASHBOARD_ADMIN],
        },
      });
    });

    it("[API]API request for updating company navigation", (done: any) => {
      cy.cmpUpdateCompany({
        employeeId: adminEmployee.id,
        sessionId: loginResponse.sessionId as string,
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
              restrictedToUsersWithTags: [GroupTag.GROUP_MANAGEMENT],
            },
            {
              icon: "/navigation_icons/user-management.svg",
              path: "/user_management",
              type: "LINK",
              label: "User Management",
              restrictedToUsersWithTags: [GroupTag.USER_MANAGEMENT],
            },
            {
              icon: "/navigation_icons/document-menu.svg",
              path: "/document_type_management",
              type: "LINK",
              label: "Document Type Management",
              restrictedToUsersWithTags: [GroupTag.DOCUMENT_TYPE_MANAGEMENT],
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

    it("[API]Create form to be used for training", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        everyoneGroup = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          name: "AR Form",
        }).then((response) => {
          initialArDocument = response;
          cy.drCreateDocumentRevision({
            payload: {
              attachments: [],
              description: "<p>Form to be used for training</p>",
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
                      id: everyoneGroup.body[0].id,
                    },
                  ],
                },
              },
              name: "released form",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: clinicalProtocolDocumentType[0].id,
                }],
                schema: [],
              },

            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdClinicalProtocolForm = response;
            cy.drAPIApproveAndRelease({
              documentId: createdClinicalProtocolForm.id,
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

    it("[API]Create form for Training Curriculum form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Training Curriculum form</p>",
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
                  id: everyoneGroup.body[0].id,
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
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                validationAttribute: "Periodic Training",
                applicableValidationSchema: true,
                tabId: "details",
              },
              {
                name: "training-document-to-be-trained-on",
                type: "autocomplete",
                index: 1,
                label: "Documents to Train on",
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
                tabId: "details",
              },
              {
                name: "training-refresh-training-periodically",
                type: "radiogroup",
                index: 2,
                label: "Refresh/repeat training periodically?",
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
                tabId: "details",
              },
              {
                name: "training-validity",
                type: "quantity",
                index: 3,
                label: "Training Frequency (in days)",
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
                tabId: "details",
              },
              {
                name: "training-details-section",
                type: "section",
                index: 4,
                label: "Trainees Details",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                validationMode: "default",
                validationAttribute: "Trainees Details",
                applicableValidationSchema: true,
                tabId: "details",
              },
              {
                name: "training-select-groups-to-train",
                type: "autocomplete",
                index: 5,
                label: "Groups to Train",
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
                tabId: "details",
              },
              {
                name: "training-select-users-to-train",
                type: "autocomplete",
                index: 6,
                label: "Users to Train (if applicable)",
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
                tabId: "details",
              },
              {
                label: "form.builder.approvals",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-l0wcpa0v",
                uniqueSchemaItem: true,
                index: 7,
                tabId: "overview",
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

    context("[API]Create form for PO", () => {
      it("[API]Create PO form", (done: any) => {
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
                description: "<p>PO Form document</p>",
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
                name: "PO Form document",
                referenceTo: [],
                retrain: false,
                revisionChangeType: RevisionChangeType.NextRevision,
                revisionStage: 1,
                formTemplate: {
                  outputDocumentTypes: [{
                    id: purchaseOrderDocumentType[0].id,
                  }],
                  schema: [{
                    index: 0,
                    type: "purchaseorder",
                    label: "PO",
                    tabId: "details",
                    name: "po-kdpqvhc7",
                    applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                  },
                  {
                    label: "form.builder.approvals",
                    tabId: "details",
                    type: "poapprovals",
                    deleteDisabled: false,
                    name: "fb-po-approvals-kpmd2alc",
                    uniqueSchemaItem: true,
                    index: 1,
                  }],
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
        });
      });
    });

    context("[API]Update record document type", () => {
      it("Change fields config in record document type", () => {
        cy.drUpdateDocumentTypeName({
          sessionId: loginResponse.sessionId,
          employeeId: adminEmployee.id,
          id: rDdocumentType[0].id,
          payload: {
            fieldsConfig: {
              D: {
                visible: false,
                required: false,
              },
              E: {
                label: "Record Type",
                visible: false,
                required: true,
              },
              F: {
                label: "Record ID",
                visible: false,
                required: true,
              },
              G: {
                visible: false,
                required: false,
              },
              I: {
                visible: false,
              },
              J: {
                visible: false,
              },
              K: {
                label: "Void",
                visible: true,
              },
              L: {
                label: "Correction",
                visible: true,
              },
              N: {
                label: "Approve and Release",
                visible: true,
              },
              O: {
                label: "Record History",
                visible: true,
              },
              R: {
                visible: false,
              },
              S: {
                label: "Update Record",
                visible: true,
              },
              A1: {
                label: "WIP",
                visible: true,
              },
              A2: {
                label: "Voided",
                visible: true,
              },
              A3: {
                label: "Archive",
                visible: true,
              },
              P1: {
                label: "WIP",
                visible: true,
              },
              P2: {
                label: "Voided",
                visible: true,
              },
              P3: {
                label: "Archive",
                visible: true,
              },
            },
          },
        });
      });
    });

    context("[API]Create 'AR Form', 'Equipment one' 'Part document' 'API MPI'", () => {
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

      it("[API]Create Part document", (done: any) => {
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
                  deleteDisabled: true,
                  deleteInFormDisabled: true,
                  tabId: "procedure",
                },
                {
                  name: "mpi-procedure-built-in",
                  type: "mpiprocedure",
                  index: 1,
                  stepIndex: 1,
                  tabId: "procedure",
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
                  tabId: "procedure",
                },
                {
                  name: "lhrs-accepted-quantity",
                  type: "quantity",
                  index: 3,
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
                  tabId: "procedure",
                },
                {
                  name: "lhrs-rejected-quantity",
                  type: "quantity",
                  index: 4,
                  label: "Rejected quantity",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  tabId: "procedure",
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
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  uniqueSchemaItem: true,
                  validationAttribute: "Approvals",
                  deleteInFormDisabled: true,
                  applicableValidationSchema: true,
                  tabId: "overview",
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

      it("[API]Create 'API LHRt document'", (done: any) => {
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
                  deleteDisabled: true,
                  deleteInFormDisabled: true,
                  editorConfig: {
                    id: createdPartDocument.documentId,
                  },
                  tabId: "overview",
                },
                {
                  name: "lhr_initial_quantity",
                  type: "quantity",
                  index: 1,
                  label: "Initial Quantity",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  deleteDisabled: true,
                  validationAttribute: "Initial Quantity",
                  deleteInFormDisabled: true,
                  applicableValidationSchema: true,
                  tabId: "overview",
                },
                {
                  name: "lhr-end-quantity",
                  type: "quantity",
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
                  tabId: "overview",
                },
                {
                  name: "lhr-build-type",
                  type: "radiogroup",
                  index: 3,
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
                  tabId: "overview",
                },
                {
                  name: "lhr-due-date",
                  type: "datepicker",
                  index: 4,
                  label: "Due Date",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  validationMode: "default",
                  validationAttribute: "Due Date",
                  applicableValidationSchema: true,
                  tabId: "overview",
                },
                {
                  name: "lhrstep-built-in",
                  type: "lhrstep",
                  index: 5,
                  label: "LHR Step",
                  applicableOn: [
                    "ON_STATE_TO_IN_REVIEW",
                  ],
                  validationMode: "default",
                  applicableValidationSchema: true,
                  stepIndex: 1,
                  editorConfig: {
                    value: createdMPIDocument.id,
                  },
                  tabId: "details",
                },
                {
                  label: "form.builder.approvals",
                  type: "approvals",
                  deleteDisabled: true,
                  name: "fb-approvals-kvateryo",
                  uniqueSchemaItem: true,
                  index: 6,
                  tabId: "overview",
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
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

  });

  context("Create a form with title as 'released doc1'", () => {
    it("Doc1 with Released status", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drEnterDocumentTitle({ name: "released doc1" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.get("#Checkbox-box").arrowClick();
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
    });
  });

  context("Create a form with title as 'released doc2'", () => {
    it("Doc1 with Released status", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drEnterDocumentTitle({ name: "released doc2" });
      cy.drEnterDocumentDescription({ description: "test description" });
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      cy.get("#Checkbox-box").arrowClick();
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });
  });

  context("Create approval request form with title as 'Approval Request Document Title'", () => {
    it("Navigate to approval request list", () => {
      cy.navigToApprovalRequestListWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Create a Approval Request button", () => {
      cy.arClickCreateAnAR();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Approval Request title", () => {
      cy.arEnterApprovalRequestTitle({ title: "Approval Request Document Title" });
    });

    it("Enter description ", () => {
      cy.arEnterApprovalRequestDescription({ description: "Description" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add sample document one", () => {
      cy.arClickAddDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arChoseSpecificProposedDocument({ name: "FM-00006 - rev 1 - released doc2" });
      cy.arEnterDescriptionAddDocumentsDialog({ description: "Document description" });
      cy.arEnterJustificationAddDocumentsDialog({ justification: "Justification for added document" });
      cy.arClickAddBtnOnAddDocumentsDialog();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add approvers to approval request on approver list", () => {
      cy.arAddApproverOnApproverListWithoutApiCall({ approver: USERS[2].email });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on Save", () => {
      cy.arSaveApiCallWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click send to review", () => {
      cy.arClickSendToReview();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();

    });

    it("Verify AR status", () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });
  });

  context("Create Training Curriculum with document type as 'Training Curriculum test'", () => {
    it("Navigate to Training Curriculums", () => {
      cy.navigToTrainingCurriculums();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Create new Training Curriculum", () => {
      cy.recCreateRecordFromLandingPage();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select 'Training Curriculum test' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Training Curriculum test");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter training title 'training title'", () => {
      cy.drEnterDocumentTitle({ name: "test training title" });
    });

    it("type a description", () => {
      cy.drEnterDocumentDescription({ description: "Description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Open details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select document 'released doc1' to be trained on", () => {
      cy.get("[data-cy=training-document-to-be-trained-on]").autocompleteSelect("released doc1");
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select refresh training periodically 'Yes'", () => {
      cy.get("[name=training-refresh-training-periodically]").eq(0).arrowClick();
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter training refresh period days", () => {
      cy.get("[name=training-validity]").arrowType("40");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Select User ${USERS[1].name} to train`, () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[1].name}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Select User ${USERS[2].name} to train`, () => {
      cy.get("[data-cy=training-select-users-to-train]").autocompleteSelect(`${USERS[2].name}`);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });


    it("Click on 'Overview' tab", () => {
      cy.drSelectOverviewTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select Approver", () => {
      cy.pmAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.DRAFT}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.DRAFT });
    });

    it("Save training", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Submit for Approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify training status should be ${STATUS_TYPES_LABEL.IN_REVIEW}`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
    });

    it("Click Approve", () => {
      cy.trApproveTrainingWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create 'Purchase order' for 'PO' internal type", () => {
    it("Navigate to PO list", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create new PO", () => {
      cy.poClickCreatePO();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter description 'PO font test'", () => {
      cy.drEnterDocumentDescription({ description: "PO font test" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("clicks on 'Save' button", () => {
      cy.drClickCreateDocumentWithoutApiCallForForms();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-po-approvals\"]").scrollIntoView();
      cy.poAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Submit for approvals and check enfocment", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create new LHR", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select the Record inline form", () => {
      cy.dlFilterByDocTitle({ docTitle: "API LHRt document" });
      cy.dlSelectFirstDocumentWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on Create New button", () => {
      cy.drCreateNewDocumentFromForm();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Enter initial quantity", () => {
      cy.get("[name=\"lhr_initial_quantity\"]").arrowClick();
      cy.get("[name=\"lhr_initial_quantity\"]").arrowType("10");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Production' build type", () => {
      cy.unClick();
      cy.get("[value=\"Production\"]").check();
    });

    it("Turn on autosave", () => {
      cy.cmpTurnOnAutosave();
    });

    it("Add 'Due Date'", () => {
      cy.poAddDateRequired();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.url().then((url: any) => {
        lhrUrl = url;
      });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add approver", () => {
      cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Details' tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'START MPI'", () => {
      cy.mpiClickNotStarted({ stepNumber: 1 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.mpiStartStepWithoutApi({ stepNumber: 1 });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Add an Approval", () => {
      cy.lhrAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Procedure' tab", () => {
      cy.drSelectProcedureTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter 'Start quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-start-quantity\"]").arrowType("1");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter 'Accepted quntity' for LHRs #1", () => {
      cy.get("[name=\"lhrs-accepted-quantity\"]").arrowType("1");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it("Click save document", () => {
      cy.drSaveDocumentWithoutaudit();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Complete step", () => {
      cy.lhrSubmitForApprovalWithoutApi();
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
      cy.landingPageLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Approve step", () => {
      cy.lhrApproveWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.COMPLETED });
      cy.wait(5000);
    });

    it("visit the LHR", () => {
      cy.visit(lhrUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Submit for approval", () => {
      cy.lhrSubmitForApprovalWithoutApi();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click Approve button", () => {
      cy.lhrApproveWithoutApi();
      cy.wait(5000);
    });
  });

  context("Verify dashboard training notification exists for 'training assigned'", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it(`Verify dashboard training notification exists as 'training is assigned to you'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
        `${trainingFormId}Rev 1 released doc1A training is assigned to you`,
      });
    });
  });

  context(`Verify ${trainingFormId} and 'training is assigned to you' font`, () => {
    // eslint-disable-next-line max-len
    it(`Verify ${trainingFormId} for 'training is assigned to you' has font-size ${FONT_SIZE_14_4} font-family ${soraSansserif} line-height ${LINE_HT_2} font-weight ${FONT_WT_400}`, () => {
      cy.contains(trainingFormId).first().should("have.css", "font-size", FONT_SIZE_14_4);
      cy.contains(trainingFormId).first().should("have.css", "font-family", soraSansserif);
      cy.contains(trainingFormId).first().should("have.css", "line-height", LINE_HT_2);
      cy.contains(trainingFormId).first().should("have.css", "font-weight", FONT_WT_400);
    });

    // eslint-disable-next-line max-len
    it(`Verify 'training is assigned to you' font-size ${FONT_SIZE_14} font-family ${soraSansserif} line-height ${LINE_HT_1} font-weight ${FONT_WT_400}`, () => {
      cy.contains("training is assigned to you").first().should("have.css", "font-size", FONT_SIZE_14);
      cy.contains("training is assigned to you").first().should("have.css", "font-family", soraSansserif);
      cy.contains("training is assigned to you").first().should("have.css", "line-height", LINE_HT_1);
      cy.contains("training is assigned to you").first().should("have.css", "font-weight", FONT_WT_400);
    });
  });

  context(`Open ${trainingFormId} and complete the training`, () => {
    it(`Open and complete training`, () => {
      cy.dashGoToListItemFromDashboard({
        listItem:
        `${trainingFormId}Rev 1 released doc1A training is assigned to you`,
      });
      cy.trCompleteTrainingWithoutApi();
      cy.wait(5000);
    });
  });

  // eslint-disable-next-line max-len
  context(`Verify COMPLETED training notification exists as '${trainingFormId} Rev 1 released doc1 is COMPLETED'`, () => {
    it("Navigate to Dashboard", () => {
      cy.grpNavigateToDashboard();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify training notification is COMPLETED`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${trainingFormId}Rev 1 released doc1isCOMPLETED`,
      });
    });
  });

  // eslint-disable-next-line max-len
  context(`Verify ${trainingFormId} and 'COMPLETED' font`, () => {
    // eslint-disable-next-line max-len
    it(`Verify COMPLETED training id ${trainingFormId} has font-size ${FONT_SIZE_14_4} form-family ${soraSansserif} line-height ${LINE_HT_2} font-weight ${FONT_WT_400}`, () => {
      cy.contains(trainingFormId).first().should("have.css", "font-size", FONT_SIZE_14_4);
      cy.contains(trainingFormId).first().should("have.css", "font-family", soraSansserif);
      cy.contains(trainingFormId).first().should("have.css", "line-height", LINE_HT_2);
      cy.contains(trainingFormId).first().should("have.css", "font-weight", FONT_WT_400);
    });

    // eslint-disable-next-line max-len
    it(`Verify 'COMPLETED' has font-size ${FONT_SIZE_12} form-family ${soraSansserif} line-height ${LINE_HT_13_2} font-weight ${FONT_WT_700}`, () => {
      cy.contains("COMPLETED").first().should("have.css", "font-size", FONT_SIZE_12);
      cy.contains("COMPLETED").first().should("have.css", "font-family", soraSansserif);
      cy.contains("COMPLETED").first().should("have.css", "line-height", LINE_HT_13_2);
      cy.contains("COMPLETED").first().should("have.css", "font-weight", FONT_WT_700);
    });
  });

  context("Verify dashboard notification exist for Released Approval Request", () => {
    it(`Verify notification for Releasing Approval Request exists`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `APPROVED${arId}Releasing ${trainingFormId}, released doc1`,
      });
    });

    // eslint-disable-next-line max-len
    it(`Verify Releasing Approval Request ID ${arId} has font-size ${FONT_SIZE_14_4} form-family ${soraSansserif} line-height ${LINE_HT_2} font-weight ${FONT_WT_400}`, () => {
      cy.contains(arId).first().should("have.css", "font-size", FONT_SIZE_14_4);
      cy.contains(arId).first().should("have.css", "font-family", soraSansserif);
      cy.contains(arId).first().should("have.css", "line-height", LINE_HT_2);
      cy.contains(arId).first().should("have.css", "font-weight", FONT_WT_400);
    });
  });

  context("Verify PO notification exist as 'IN REVIEW pending approvals from' ", () => {
    it(`Verify notification for PO exists as 'IN REVIEW pending approvals from'`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${poOrder}Rev 1 isIN REVIEWpending approvals from`,
      });
    });

    // eslint-disable-next-line max-len
    it(`Verify Purchase Order 'pending approvals from' font-size ${FONT_SIZE_14} form-family ${soraSansserif} line-height ${LINE_HT_1} font-weight ${FONT_WT_400}`, () => {
      cy.contains("pending approvals from").first().should("have.css", "font-size", FONT_SIZE_14);
      cy.contains("pending approvals from").first().should("have.css", "font-family", soraSansserif);
      cy.contains("pending approvals from").first().should("have.css", "line-height", LINE_HT_1);
      cy.contains("pending approvals from").first().should("have.css", "font-weight", FONT_WT_400);
    });

    // eslint-disable-next-line max-len
    it(`Verify Purchase Order 'IN REVIEW' font-size ${FONT_SIZE_12} form-family ${soraSansserif} line-height ${LINE_HT_3} font-weight ${FONT_WT_700}`, () => {
      cy.contains("IN REVIEW").first().should("have.css", "font-size", FONT_SIZE_12);
      cy.contains("IN REVIEW").first().should("have.css", "font-family", soraSansserif);
      cy.contains("IN REVIEW").first().should("have.css", "line-height", LINE_HT_3);
      cy.contains("IN REVIEW").first().should("have.css", "font-weight", FONT_WT_700);
    });
  });

  context("Verify notification exists as 'LHRS-00001 Rev A LHR-00007, Step #1'", () => {
    it(`Verify notification exists as 'LHRS-00001 Rev A LHR-00007, Step #1`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${lhrsid}Rev A ${lhrid}, Step #1`,
      });
    });

    // eslint-disable-next-line max-len
    it(`Verify LHR step ID ${lhrsid} has font-size ${FONT_SIZE_14_4} form-family ${soraSansserif} line-height ${LINE_HT_2} font-weight ${FONT_WT_400}`, () => {
      cy.contains(lhrsid).first().should("have.css", "font-size", FONT_SIZE_14_4);
      cy.contains(lhrsid).first().should("have.css", "font-family", soraSansserif);
      cy.contains(lhrsid).first().should("have.css", "line-height", LINE_HT_2);
      cy.contains(lhrsid).first().should("have.css", "font-weight", FONT_WT_400);
    });
  });

  context("Verify font for APPROVED LHR ID", () => {
    it(`Verify notification exists for APPROVED LHR ID ${lhrid}`, () => {
      cy.wait(2000);
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `APPROVED${lhrid}Rev A`,
      });
    });

    // eslint-disable-next-line max-len
    it(`Verify LHR step ID ${lhrid} has font-size ${FONT_SIZE_14_4} form-family ${soraSansserif} line-height ${LINE_HT_2} font-weight ${FONT_WT_400}`, () => {
      cy.wait(2000);
      cy.contains(lhrid).first().should("have.css", "font-size", FONT_SIZE_14_4);
      cy.contains(lhrid).first().should("have.css", "font-family", soraSansserif);
      cy.contains(lhrid).first().should("have.css", "line-height", LINE_HT_2);
      cy.contains(lhrid).first().should("have.css", "font-weight", FONT_WT_400);
    });
  });

  context("Verify notification exists for CLOSED Approval Request", () => {
    it(`Verify notification exists for CLOSED Approval Request`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${arId}Releasing ${trainingFormId}, released doc1isCLOSED`,
      });
    });

    // eslint-disable-next-line max-len
    it(`Verify CLOSED AR 'Releasing FM-00002, released doc1' has font-size ${FONT_SIZE_14_4} form-family ${soraSansserif} line-height ${LINE_HT_2} font-weight  ${FONT_WT_400}`, () => {
      cy.contains("Releasing FM-00002, released doc1").last().should("have.css", "font-size", FONT_SIZE_14_4);
      cy.contains("Releasing FM-00002, released doc1").last().should("have.css", "font-family", soraSansserif);
      cy.contains("Releasing FM-00002, released doc1").first().should("have.css", "line-height", LINE_HT_2);
      cy.contains("Releasing FM-00002, released doc1").first().should("have.css", "font-weight",  FONT_WT_400);
    });
  });

  context("Create 'Lot History Record'", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enters title 'Lot History Record'", () => {
      cy.drEnterDocumentTitle({ name: "Lot History Record" });
    });

    it("Enters description 'Lot History Record description'", () => {
      cy.drEnterDocumentDescription({ description: "Lot History Record description" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Record Document' output document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Record Document" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Give label to 'Text Field' as 'TEXT FIELD'`, () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Verify form ${STATUS_TYPES_LABEL.RELEASED} status`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "Lot History Record" });
    });
  });

  context("Start creating Record Document", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enters title 'Approval Record'", () => {
      cy.drEnterDocumentTitle({ name: "Approval Record" });
    });

    it("Enters description 'Approval Record description'", () => {
      cy.drEnterDocumentDescription({ description: "Approval Record description" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Selects 'Record Document' output document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Record Document" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify approvals field is automatically added", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Navigate to Records", () => {
      cy.navigToRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Create new record button click", () => {
      cy.recCreateRecordFromLandingPage();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select 'Lot History Record' form", () => {
      cy.get(`div[data-cy^="field-selectType"]`).click().focused()
        .arrowType("Record Document{downarrow}{enter}", { force: true });
      cy.unClick();
      cy.get("[data-cy=\"field-selectForm\"]").click().focused()
        .arrowType("Lot History Record{downarrow}{enter}", { force: true });
    });

    it("Check if revision is in alpha revision stage", () => {
      cy.drClickRevisionsSidePanel();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.recCheckRevisionStage({ stage: "Revision A" });
    });

    it("Enters title 'Approval Record title'", () => {
      cy.drEnterDocumentTitle({ name: "Approval Record title" });
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Add first Approver as ${USERS[1].name}`, () => {
      cy.get("[data-cy^=\"fb-approvals\"]").scrollIntoView().click().autocompleteSelect(USERS[1].name);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Approve and Release button click'", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Get the document Id`, () => {
      cy.arVerifyStatus({ status: STATUS_TYPES_LABEL.IN_REVIEW });
      cy.drGetDocIdElementFromUI().then(($docIdElement: JQuery<HTMLElement>) => {
        recDocId = $docIdElement.text();
      });
    });
  });

  context("Verify font for Record (Pending Approval) dialog box", () => {
    it("Navigate to Dashboard", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Click on IN REVIEW Record ${recDocId}`, () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`)
        .should("contain", recDocId)
        .and("contain", STATUS_TYPES_LABEL.IN_REVIEW);
      cy.contains("IN REVIEW").first().arrowClick();
    });

    it(`Verify the popup window has PENDING text`, () => {
      cy.get("[data-cy='pending-title']")
        .contains("PENDING");
    });

    // eslint-disable-next-line max-len
    it(`Verify the PENDING has font-size ${FONT_SIZE_12} form-family ${soraSansserif} line-height ${LINE_HT_3} font-weight ${FONT_WT_700}`, () => {
      cy.get("[data-cy='pending-title']")
        .contains("PENDING").should("have.css", "font-size", FONT_SIZE_12);
      cy.get("[data-cy='pending-title']")
        .contains("PENDING").should("have.css", "font-family", soraSansserif);
      cy.get("[data-cy='pending-title']")
        .contains("PENDING").should("have.css", "line-height", LINE_HT_3);
      cy.get("[data-cy='pending-title']")
        .contains("PENDING").should("have.css", "font-weight", FONT_WT_700);
    });

    // eslint-disable-next-line max-len
    it(`Verify ${USERS[1].name} has font-size ${FONT_SIZE_14} form-family ${soraSansserif} line-height ${LINE_HT_18} font-weight ${FONT_WT_400}`, () => {
      cy.get("[data-cy='list-item-text']")
        .contains(USERS[1].name).should("have.css", "font-size", FONT_SIZE_14);
      cy.get("[data-cy='list-item-text']")
        .contains(USERS[1].name).should("have.css", "font-family", soraSansserif);
      cy.get("[data-cy='list-item-text']")
        .should("have.css", "line-height", LINE_HT_18);
      cy.get("[data-cy='list-item-text']")
        .should("have.css", "font-weight", FONT_WT_400);
    });

    it(`Close the popup window`, () => {
      cy.get("[data-cy='close-model']")
        .arrowClick();
    });
  });

  context("Approve record", () => {
    it("Navigate to record list", () => {
      cy.navigToRecords();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Filter record two", () => {
      cy.dlClearFilters();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.dlFilterByDocId({ docId: recDocId });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select first record", () => {
      cy.dlSelectFirstDocumentWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve record button click", () => {
      cy.ebApproveWithoutApi();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it(`Check doc ${STATUS_TYPES_LABEL.RELEASED} status`, () => {
      cy.drCheckDocumentStatus({ status: STATUS_TYPES_LABEL.RELEASED });
      cy.arCheckTitleInEditableAndMatches({ name: "Approval Record title" });
      cy.drGetDocIdElementFromUI().should("contain.text", "RD-").then(($docIdElement: JQuery<HTMLElement>) => {
        recDocId = $docIdElement.text();
      });
    });
  });

  context("Verify font for Record released", () => {
    it("Navigate to Dashboard", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`Verify record notification for Record released`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${recDocId}Rev A Approval Record titleisRELEASED`,
      });
    });

    // eslint-disable-next-line max-len
    it(`Verify 'Rev A Approval Record title' has font-size ${FONT_SIZE_14_4} form-family ${soraSansserif} line-height ${LINE_HT_2} font-weight ${FONT_WT_400}`, () => {
      cy.contains("Rev A Approval Record title").last().should("have.css", "font-size", FONT_SIZE_14_4);
      cy.contains("Rev A Approval Record title").last().should("have.css", "font-family", soraSansserif);
      cy.contains("Rev A Approval Record title").last().should("have.css", "line-height", LINE_HT_2);
      cy.contains("Rev A Approval Record title").last().should("have.css", "font-weight", FONT_WT_400);
    });
  });

  context("Verify font for 'TRAININGS OUTSTANDING' Chart", () => {
    // eslint-disable-next-line max-len
    it(`Verify 'TRAININGS OUTSTANDING' Chart font-size ${FONT_SIZE_16} and form-family ${soraSansserif} line-height ${LINE_HT_20} font-weight ${FONT_WT_600}`, () => {
      cy.contains("TRAININGS OUTSTANDING").should("have.css", "font-size", FONT_SIZE_16);
      cy.contains("TRAININGS OUTSTANDING").should("have.css", "font-family", soraSansserif);
      cy.contains("TRAININGS OUTSTANDING").should("have.css", "line-height", LINE_HT_20);
      cy.contains("TRAININGS OUTSTANDING").should("have.css", "font-weight", FONT_WT_600);
    });
  });

  context(`Verify font for 'Welcome back, ${USERS[1].name}!'`, () => {
    // eslint-disable-next-line max-len
    it(`Verify Welcome back, Username! font-size as ${FONT_SIZE_28} and form-family as ${soraSansserif} font-weight ${FONT_WT_300}`, () => {
      cy.contains(`Welcome Back, ${USERS[1].name}!`).last().should("have.css", "font-size", FONT_SIZE_28);
      cy.contains(`Welcome Back, ${USERS[1].name}!`).last().should("have.css", "font-family", soraSansserif);
      cy.contains(`Welcome Back, ${USERS[1].name}!`).last().should("have.css", "font-weight", FONT_WT_300);
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Select 24 day to back in future", () => {
      cy.trSetTimeTravelInDays({ days: 24 });
      cy.setTimeTravelToComplete({
        tasktype: "TIME_TRAVEL_COMPANY",
        days: "24 days",
        status: "COMPLETE",
      });
      cy.wait(50000);
    });

    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Select 'Trainings' tab", () => {
      cy.contains("Trainings").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training notification", () => {
      cy.get("[trainingstatus=\"DUE\"]")
        .eq(0)
        .should("have.text", "DUE IN 7 DAYS");
    });
  });

  context("Verify font for DUE IN 7 DAYS", () => {
    // eslint-disable-next-line max-len
    it(`Verify DUE IN 7 DAYS font-size as ${FONT_SIZE_12} and form-family ${soraSansserif} line-height ${LINE_HT_3} font-weight ${FONT_WT_700}`, () => {
      cy.contains("DUE IN 7 DAYS").should("have.css", "font-size", FONT_SIZE_12);
      cy.contains("DUE IN 7 DAYS").should("have.css", "font-family", soraSansserif );
      cy.contains("DUE IN 7 DAYS").should("have.css", "line-height", LINE_HT_3);
      cy.contains("DUE IN 7 DAYS").should("have.css", "font-weight", FONT_WT_700);
    });
  });

  context("Use time tool to travel user back to future", () => {
    it("Select 31 day to back in future", () => {
      cy.trSetTimeTravelInDays({ days: 31 });
      cy.setTimeTravelToComplete({
        tasktype: "TIME_TRAVEL_COMPANY",
        days: "a month",
        status: "COMPLETE",
      });
      cy.wait(50000);
    });

    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select 'Trainings' tab", () => {
      cy.contains("Trainings").eq(0).arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify training notification OVERDUE", () => {
      cy.get("[trainingstatus=\"OVERDUE\"]")
        .eq(0)
        .should("have.text", "OVERDUE");
    });
  });

  context("Verify font for OVERDUE", () => {
    // eslint-disable-next-line max-len
    it(`Verify OVERDUE font-size as ${FONT_SIZE_12} and form-family ${soraSansserif} line-height ${LINE_HT_3} font-weight ${FONT_WT_700}`, () => {
      cy.contains("OVERDUE").should("have.css", "font-size", FONT_SIZE_12);
      cy.contains("OVERDUE").should("have.css", "font-family", soraSansserif);
      cy.contains("OVERDUE").should("have.css", "line-height", LINE_HT_3);
      cy.contains("OVERDUE").should("have.css", "font-weight", FONT_WT_700);
    });
  });

  context("Verify font for Email dialog box", () => {
    it("Click on training notification OVERDUE", () => {
      cy.get("[trainingstatus=\"OVERDUE\"]")
        .eq(0)
        .should("have.text", "OVERDUE").arrowClick();
    });

    // eslint-disable-next-line max-len
    it(`Verify training status 'EMAIL ALL' font-size as ${FONT_SIZE_11} and form-family as ${soraSansserif} line-height ${FONT_SIZE_14} and font-weight ${FONT_WT_700}`, () => {
      cy.get("[data-cy='email-button']")
        .contains("EMAIL ALL").should("have.css", "font-size", FONT_SIZE_11);
      cy.get("[data-cy='email-button']")
        .contains("EMAIL ALL").should("have.css", "font-family", soraSansserif);
      cy.get("[data-cy='email-button']")
        .contains("EMAIL ALL").should("have.css", "line-height", FONT_SIZE_14);
      cy.get("[data-cy='email-button']")
        .contains("EMAIL ALL").should("have.css", "font-weight", FONT_WT_700);
    });

    // eslint-disable-next-line max-len
    it(`Verify training status ${USERS[2].name} font-size as ${FONT_SIZE_14} and form-family as ${soraSansserif}`, () => {
      cy.get("[data-cy='list-item-text']")
        .contains(USERS[2].name).should("have.css", "font-size", FONT_SIZE_14);
      cy.get("[data-cy='list-item-text']")
        .contains(USERS[2].name).should("have.css", "font-family", soraSansserif);
    });

    it(`Close training status popup window`, () => {
      cy.get(`button[aria-label="close"]`).find("svg").arrowClick();
    });
  });

  context("Verify font for Recent tab: PO, TC, Document, Form", () => {
    it("Select 'Recent' tab", () => {
      cy.contains("Recent").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    // eslint-disable-next-line max-len
    it(`Verify TC id ${tcId} font-size as ${FONT_SIZE_14_4} and form-family ${soraSansserif} line-height ${LINE_HT_4} font-weight ${FONT_WT_400}`, () => {
      cy.contains(tcId).should("have.css", "font-size", FONT_SIZE_14_4);
      cy.contains(tcId).should("have.css", "font-family", soraSansserif);
      cy.contains(tcId).should("have.css", "line-height", LINE_HT_4);
      cy.contains(tcId).should("have.css", "font-weight", FONT_WT_400);
    });

    // eslint-disable-next-line max-len
    it(`Verify PO id ${poOrder} has font-size as ${FONT_SIZE_14_4} and form-family as ${soraSansserif} line-height ${LINE_HT_4} font-weight ${FONT_WT_400}`, () => {
      cy.contains(poOrder).should("have.css", "font-size", "14.4px");
      cy.contains(poOrder).should("have.css", "font-family", soraSansserif);
      cy.contains(poOrder).should("have.css", "line-height", LINE_HT_4);
      cy.contains(poOrder).should("have.css", "font-weight", FONT_WT_400);
    });

    // eslint-disable-next-line max-len
    it(`Verify form id ${trainingFormId} font-size as ${FONT_SIZE_14_4} and form-family as ${soraSansserif} line-height ${LINE_HT_4} font-weight ${FONT_WT_400}`, () => {
      cy.contains(trainingFormId).should("have.css", "font-size", FONT_SIZE_14_4);
      cy.contains(trainingFormId).should("have.css", "font-family", soraSansserif);
      cy.contains(trainingFormId).should("have.css", "line-height", LINE_HT_4);
      cy.contains(trainingFormId).should("have.css", "font-weight", FONT_WT_400);
    });

    // eslint-disable-next-line max-len
    it(`Verify document LHR ID ${lhrid} font-size as ${FONT_SIZE_14_4} and form-family as ${soraSansserif} line-height ${LINE_HT_4}font-weight ${FONT_WT_400}`, () => {
      cy.contains(lhrid).should("have.css", "font-size", FONT_SIZE_14_4);
      cy.contains(lhrid).should("have.css", "font-family", soraSansserif);
      cy.contains(lhrid).should("have.css", "line-height", LINE_HT_4);
      cy.contains(lhrid).should("have.css", "font-weight", FONT_WT_400);
    });

    it("Select 'My Feed' tab", () => {
      cy.contains("My Feed").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify font for REJECTED Approval Request", () => {
    it("Logout current user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({
        USER: USERS[2],
        employeeId: secondEmployee.id,
      });
    });

    it("Reject AR from dashboard", () => {
      cy.get("[data-cy=dashboardFeedList]>div").contains(`${USERS[1].name}needs your approval for`)
        .parent()
        .parent()
        .parent().trigger("mouseover")
        .find(`[data-cy="transition-reject"]`).first()
        .arrowClick();
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
    });

    it("Logout user", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({
        USER: USERS[1],
        employeeId: adminEmployee.id,
      });
    });

    it(`Verify notification for REJECTED Approval Request`, () => {
      cy.dashVerifyListItemExistsOnDashboard({
        listItem:
          `${USERS[2].name}REJECTED${rejArId}`,
      });
    });

    // eslint-disable-next-line max-len
    it(`Verify REJECTED Approval Request ID ${rejArId} font-size ${FONT_SIZE_14_4} and form-family ${soraSansserif} line-height ${LINE_HT_2} font-weight ${FONT_WT_400}`, () => {
      cy.contains(rejArId).should("have.css", "font-size", FONT_SIZE_14_4);
      cy.contains(rejArId).should("have.css", "font-family", soraSansserif);
      cy.contains(rejArId).should("have.css", "line-height", LINE_HT_2);
      cy.contains(rejArId).should("have.css", "font-weight", FONT_WT_400);
    });
  });
});

export { };

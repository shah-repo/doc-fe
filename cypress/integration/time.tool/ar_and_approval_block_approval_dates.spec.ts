/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { GroupTag } from "../../../src/state/ducks/auth/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { CONFIG } from "../../support/config";
import { approvalNotificationPrivday, approvalNotificationToday, emailDateOffset } from "../../utils/constants/dateHandler";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { LegalRecord } from "../../utils/constants/documentTypes/record";
import { TrainingCurriculum } from "../../utils/constants/documentTypes/trainingCurriculum";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let secondEmployee;
let inlineRecordForm;
let group;
let initialArDocument;
let approvalRequestDocumentType;
let formDocumentType;
let clinicalProtocolDocumentType;
let legalRecordDocumentType;
let purchaseOrderDocumentType;
let adminEmployee;
let asyncTasksGroup;
let emailsFromInbox;
let dateAfterEmailShouldArrive;
let createdPOFormDocument;
let trainingCurriculumDocumentType;
let createdTrainingCurriculumFormDocument;
let developersGroup;
const FIRST_USER = USERS[1];

context("Approval dates for AR and approval block", { tags: ["@timetool"] }, () => {
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
              LegalRecord,
              PurchaseOrderTest,
              { ...TrainingCurriculum, documentTypeName: "Training Curriculum Test" },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          trainingCurriculumDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Training Curriculum Test");
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PurchaseOrderTest.documentTypeName);
          legalRecordDocumentType = cmpFilterDocumentTypeIdByName(
            createdCompany,
            LegalRecord.documentTypeName
          );
          clinicalProtocolDocumentType = cmpFilterDocumentTypeIdByName(
            createdCompany,
            ClinicalProtocolDocType.documentTypeName
          );
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


    it("[API]Create form for Legal Record", (done: any) => {
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
              description: "<p>Record form</p>",
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
                    tabId: "details",
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

    it("[API]Create Clinical protocol document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Clinical protocol document</p>",
          document: {
            docId: "CP-00001",
            documentType: {
              id: clinicalProtocolDocumentType[0].id,
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
          name: "API Clinical protocol",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then(() => done());
    });

    it("[API]Create PO-s", (done: any) => {
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
                    deleteDisabled: true,
                    validationAttribute: "PO Status",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "po-supplier-built-in",
                    type: "supplier",
                    index: 1,
                    label: "Supplier ",
                    tabId: "details",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Supplier",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "po-items-built-in",
                    type: "purchaseorder",
                    index: 2,
                    label: "Purchase Order",
                    tabId: "lineitems",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Purchase Order",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    label: "form.builder.approvals",
                    tabId: "details",
                    type: "poapprovals",
                    deleteDisabled: false,
                    name: "fb-po-approvals-kqqix31p",
                    uniqueSchemaItem: true,
                    index: 3,
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
              cy.poAPICreatePO({
                payload: {
                  name: "",
                  attachments: [],
                  referenceTo: [],
                  formDocument: { id: createdPOFormDocument.id },
                  description: "API PO document",
                  revisionChangeType: RevisionChangeType.NextRevision,
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
                  formInput: {
                    "po-items-built-in": {
                      items: [{
                        id: "kqqj708c",
                        type: "service",
                        date: (new Date()).toISOString(),
                        tax: false,
                        capitalEquipment: false,
                        isTraceabilityRequired: false,
                        description: "office cleaning",
                        serviceId: "cleaning",
                        units: "hours",
                        order: 5,
                        glCode: "code 1",
                        unitPrice: 30,
                        received: 0,
                        totalAmount: "150.00",
                        formattedDate: (new Date()).toLocaleDateString("en-US"),
                        index: 0,
                      }],
                      tax: "0.00",
                      taxRate: 9.25,
                      subTotal: "150.00",
                      totalAmount: "150.00",
                      shippingCost: "0.00",
                      currency: "USD",
                      exchangeRate: 1,
                      totalInUSD: "150.00",
                      dateOfExchangeRate: "",
                    },
                    "po-status-built-in": "Open",
                  },
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => done());
            });
          });
        });
      });
    });

    it("[API]Create Training Curriculum form", (done: any) => {
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
                tabId: "overview",
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-l0wcpa0v",
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

    it("[API]Create Training Curriculum record", (done: any) => {
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
              createdPOFormDocument.documentId,
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

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Ask for approvals on record, approval request, PO and TC", () => {
    context("Ask for approvals on record", () => {
      it("Navigate to records list", () => {
        cy.navigToRecords();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Create new record button click", () => {
        cy.poSelectPoFormFromMultiSelect({ poType: LegalRecord.documentTypeName });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter title Record title", () => {
        cy.drEnterDocumentTitle({ name: "Record title" });
      });

      it("Enter description 'Record description'", () => {
        cy.drEnterDocumentDescription({ description: "Record description" });
      });

      it("Select approver", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: FIRST_USER.name });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Save Record'", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify no PENDING text is present on approval block", () => {
        cy.get(`[data-cy^="not-approved"]`).should("not.contain.text", "PENDING");
      });

      it("Submit for approval'", () => {
        cy.pmSubmitForApprovalWithoutAPI();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify 'PENDING' text is present on approval block", () => {
        cy.get(`[data-cy^="not-approved"`).should("contain.text", "PENDING");
      });

      it("Navigate to dashboard'", () => {
        cy.navigToDashboardWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Switch to myfeed tab", () => {
        cy.dashboardMyFeedTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check if approval request is 'In Review'", () => {
        cy.get("[data-cy='dashboardFeedList']").contains("IN REVIEW").arrowClick();
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        cy.get("h2").should("contain.text", "PENDING (1)");
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", USERS[1].name);
        cy.get("h2").should("contain.text", "APPROVED (0)");
      });

      it("Click on 'EMAIL ALL'", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
      });
    });

    context("Ask for approvals on Approval Request", () => {
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
        cy.arEnterApprovalRequestTitle({ title: "Approval Request title" });
      });

      it("Enter description ", () => {
        cy.arEnterApprovalRequestDescription({ description: "Approval Request description" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add sample document one", () => {
        cy.arSelectItemsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.arAddItems();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.arSelectItem({ name: "API Clinical Protocol" });
        cy.arEnterItemDescription({ description: "Document description" });
        cy.arEnterItemJustification({ justification: "Justification for added document" });
        cy.arClickAddItemDone();
      });

      it("Click on Save button", () => {
        cy.arSaveApiCallWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add approvers to approval request on approver list", () => {
        cy.arSelectApprovalTab();
        cy.arAddApproverOnApproverListWithoutApiCall({ approver: FIRST_USER.email, noWait: true });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Click on Save", () => {
        cy.arSaveApiCallWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Click send to review", () => {
        cy.arClickSendToReviewWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify PENDING text is present on approval block", () => {
        cy.arSelectApprovalTab();
        cy.get(`[data-cy="SummaryBaseProps-values"]`)
          .should("contain.text", "PENDING");
      });

      it("Navigate to dashboard'", () => {
        cy.navigToDashboardWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Switch to myfeed tab", () => {
        cy.dashboardMyFeedTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check if approval request is 'In Review'", () => {
        cy.get("[data-cy='dashboardFeedList']").contains("IN REVIEW").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        cy.get("h2").should("contain.text", "PENDING (1)");
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", USERS[1].name);
        cy.get("h2").should("contain.text", "APPROVED (0)");
      });

      it("Click on 'EMAIL ALL'", () => {
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
      });
    });

    context("Ask for approvals on PO", () => {
      it("Navigate to PO'", () => {
        cy.navigToPurchaseOrder();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select first PO'", () => {
        cy.dlSelectFirstDocumentWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select approver", () => {
        cy.poAddApproverOnApproverListWithoutApi({ approver: FIRST_USER.name });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Save PO'", () => {
        cy.drClickCreateDocumentWithoutApiCallForForms();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(3000);
      });

      it("Verify no PENDING text is present on approval block", () => {
        cy.poClickOnPending();
        cy.get(`[name^="fb-po-approvals"]`)
          .should("not.contain.text", "PENDING");
      });

      it("Submit for approval'", () => {
        cy.pmSubmitForApprovalWithoutAPI();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Verify PENDING text is present on approval block", () => {
        cy.poClickOnPending();
        cy.get(`[name^="fb-po-approvals"]`).should("contain.text", "PENDING");
      });

      it("Navigate to dashboard'", () => {
        cy.navigToDashboardWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Switch to myfeed tab", () => {
        cy.dashboardMyFeedTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check if approval request is 'In Review'", () => {
        cy.get("[data-cy='dashboardFeedList']").contains("IN REVIEW").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        cy.get("h2").should("contain.text", "PENDING (1)");
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", USERS[1].name);
        cy.get("h2").should("contain.text", "APPROVED (0)");
      });

      it("Click on 'EMAIL ALL'", () => {
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
      });
    });

    context("Ask for approvals on TC", () => {
      it("Navigate to Training Curriculums'", () => {
        cy.navigToTrainingCurriculums();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Clear filter", () => {
        cy.trClearFilters();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select first TC'", () => {
        cy.dlSelectFirstDocumentWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select approver", () => {
        cy.pmAddApproverOnApproverListWithoutApi({ approver: FIRST_USER.name });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
      });

      it("Save TC'", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
      });

      it("Verify no PENDING text is present on approval block", () => {
        cy.get(`[data-cy^="not-approved"`)
          .should("not.contain.text", "PENDING");
      });

      it("Submit for approval'", () => {
        cy.pmSubmitForApprovalWithoutAPI();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
      });

      it("Verify PENDING text is present on approval block", () => {
        cy.get(`[data-cy^="not-approved"`).should("contain.text", "PENDING");
      });

      it("Navigate to dashboard'", () => {
        cy.navigToDashboardWithoutApi();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Switch to myfeed tab", () => {
        cy.dashboardMyFeedTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check if approval request is 'In Review'", () => {
        cy.get("[data-cy='dashboardFeedList']").contains("IN REVIEW").eq(0).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        cy.get("h2").should("contain.text", "PENDING (1)");
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", USERS[1].name);
        cy.get("h2").should("contain.text", "APPROVED (0)");
      });

      it("Click on 'EMAIL ALL'", () => {
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
      });
    });
  });

  context("Verify received emails", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Can you please approve my request`,
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };
      cy.wait(10000);
      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify 'in review' emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: FIRST_USER.email,
          contains: [approvalNotificationToday, "LR-00002"],
        },
        {
          sentToUser: FIRST_USER.email,
          contains: [approvalNotificationToday, "TCT-00001"],
        },
        {
          sentToUser: FIRST_USER.email,
          contains: [approvalNotificationToday, "POT-00001"],
        },
        {
          sentToUser: FIRST_USER.email,
          contains: [approvalNotificationToday, "AR-00004"],
        },
      ];

      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });

  context("Time travel one day back to the future", () => {
    it("Navigate to async tasks", () => {
      // this delay is required to assured that previous emails are not pulled
      cy.wait(60000);
      cy.navigToAsyncTasks();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Select task TIME_TRAVEL_USER", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.TIME_TRAVEL_COMPANY });
    });

    it(`Select 1 day to back in future`, () => {
      cy.asyncSelectBackToTheFutureTime({ day: 1 });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
      cy.wait(5000);
    });
  });

  context("Ask for approval on all documents again", () => {
    it("Log out", () => {
      cy.authLogout();
    });

    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    context("Send email to all approval for record", () => {
      it("Click on record 'In Review'", () => {
        cy.get("[data-cy='LR-00002InReview']> div:nth-child(4)")
          .arrowClick();
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        cy.get("h2").should("contain.text", "PENDING (1)");
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", USERS[1].name);
        cy.get("h2").should("contain.text", "APPROVED (0)");
      });

      it("Click on 'EMAIL ALL'", () => {
        cy.get("button").contains("EMAIL ALL").arrowClick();
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
        cy.cmpExitDropdown();
      });
    });

    context("Send email to all approval for Approval Request", () => {
      it("Click on AR 'In Review'", () => {
        cy.get("[data-cy='AR-00004InReview']> div:nth-child(3)")
          .arrowClick();
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        cy.get("h2").should("contain.text", "PENDING (1)");
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", USERS[1].name);
        cy.get("h2").should("contain.text", "APPROVED (0)");
      });

      it("Click on 'EMAIL ALL'", () => {
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
        cy.cmpExitDropdown();
      });
    });

    context("Send email to all approval for PO", () => {
      it("Click on PO 'In Review'", () => {
        cy.get("[data-cy='POT-00001InReview']> div:nth-child(4)")
          .arrowClick();
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        cy.get("h2").should("contain.text", "PENDING (1)");
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", USERS[1].name);
        cy.get("h2").should("contain.text", "APPROVED (0)");
      });

      it("Click on 'EMAIL ALL'", () => {
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
        cy.cmpExitDropdown();
      });
    });

    context("Send email to all approval for TC", () => {
      it("Click on TC 'In Review'", () => {
        cy.get("[data-cy='TCT-00001InReview']> div:nth-child(4)")
          .arrowClick();
      });

      it("Check if pop-up modal has pending with all the approvers", () => {
        cy.get("h2").should("contain.text", "PENDING (1)");
        cy.get("[class='MuiCollapse-wrapperInner']").should("contain.text", USERS[1].name);
        cy.get("h2").should("contain.text", "APPROVED (0)");
      });

      it("Click on 'EMAIL ALL'", () => {
        cy.get("button").contains("EMAIL ALL").arrowClick();
      });

      it("Check if 'EMAIL SENT TO ALL' message is shown", () => {
        cy.contains("EMAIL SENT TO ALL").should("exist");
        cy.get("button[aria-label=close]").eq(1).arrowClick();
        cy.get("button[aria-label=close]").eq(0).arrowClick();
        cy.cmpExitDropdown();
        cy.wait(10000);
      });
    });
  });

  context("Verify received emails", () => {
    it("Get emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Can you please approve my request`,
        // eslint-disable-next-line @typescript-eslint/camelcase
        include_body: true,
      };
      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify 'in review' emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: FIRST_USER.email,
          contains: [`Hi ${FIRST_USER.name}`, approvalNotificationPrivday, "TCT-00001"],
        },
        {
          sentToUser: FIRST_USER.email,
          contains: [`Hi ${FIRST_USER.name}`, approvalNotificationPrivday, "POT-00001"],
        },
        {
          sentToUser: FIRST_USER.email,
          contains: [`Hi ${FIRST_USER.name}`, approvalNotificationPrivday, "AR-00004"],
        },
        {
          sentToUser: FIRST_USER.email,
          contains: [`Hi ${FIRST_USER.name}`, approvalNotificationPrivday, "LR-00002"],
        },
      ];

      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });
});

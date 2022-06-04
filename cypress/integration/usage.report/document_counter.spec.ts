/* eslint-disable @typescript-eslint/camelcase */
import { integer } from "aws-sdk/clients/cloudfront";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { SQS_TYPES } from "../../../src/ui/async.tasks/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { emailDateOffset, fileTimeFormat } from "../../utils/constants/dateHandler";
import { LegalRecord } from "../../utils/constants/documentTypes/record";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let asyncTasksGroup;
let formDocumentType;
let legalRecordDocumentType;
let secondEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let legalRecordDocumentType;
let group;
let inlineRecordForm;
let adminEmployee;
let loginResponse;
let createdCompany;
let dateAfterEmailShouldArrive;
let emailsFromInbox;
const usageReportXlsxFileName = "Usage_report_" + fileTimeFormat + ".xlsx";
const usageReportXlsxFileNameAndPath = "cypress/downloads/" + usageReportXlsxFileName;
const usageReporJsonFileName = "Usage_report_" + fileTimeFormat + ".json";
const usageReportJsonFileNameAndPath = "cypress/downloads/" + usageReporJsonFileName;

interface StructureFromUsageReport {
  name: string;
  releasedCompleted: integer;
  draftPending: integer;
}

const numberOfDocsFromUsageReport: StructureFromUsageReport[] = [];

const numberOfDocsThatWereCreated: StructureFromUsageReport[] = [
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
    draftPending: 1,
  },
  {
    name: "Documents",
    releasedCompleted: 2,
    draftPending: 0,
  },
  {
    name: "Approval Requests",
    releasedCompleted: 2,
    draftPending: 0,
  },
  {
    name: "Training Records",
    releasedCompleted: 0,
    draftPending: 0,
  },
];

context("Test usage_report is correctly counting documents", () => {
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
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          legalRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, LegalRecord.documentTypeName);
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

    it("[API]Create Legal record inline", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Record inline</p>",
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
          name: "API record inline",
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
      }).then(() => done());
    });

    it("[API]Create Equipment form", (done: any) => {
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
              description: "<p>Maintenance and Calibration form</p>",
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
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    applicableValidationSchema: true,
                    validationAttribute: "Calibration",
                  },
                  {
                    label: "form.builder.approvals",
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
      });
    });


    it("[API]Create Supplier form", (done: any) => {
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
              name: SupplierFormTitle,
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
                validationMode: "default",
                validationAttribute: "PO Status",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "general-information-to-be-completed-by-requester-kc3oqlpn",
                type: "section",
                index: 1,
                label: "General Information",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
              },
              {
                name: "requestor-k740hxlb",
                type: "autocomplete",
                index: 2,
                label: "Requestor",
                rules: "",
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
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationMode: "default",
                validationAttribute: "Supplier",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "ordered-k6mlhan7",
                type: "datepicker",
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
              },
              {
                name: "po-items-built-in",
                type: "purchaseorder",
                index: 5,
                label: "Purchase Order",
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: true,
                validationAttribute: "Purchase Order",
                deleteInFormDisabled: true,
                applicableValidationSchema: true,
              },
              {
                name: "approvals-built-in",
                type: "approvals",
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
        }).then(() => done() );
      });
    });

    it("[API]Create old receiving form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Old receiving Form document</p>",
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
          name: "Old Receiving Form document",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formTemplate: {
            outputDocumentTypes: [{
              id: receivingDocumentType[0].id,
            }],
            schema: [
              {
                name: "receiving-ku6t73ty",
                type: "poreceive",
                index: 0,
                label: "Select PO",
                rules: "",
                hidden: false,
                deleted: false,
                applicableOn: [
                  "ON_STATE_TO_IN_REVIEW",
                ],
                deleteDisabled: false,
                outputDisabled: false,
                validationMode: "default",
                editorProperties: [],
                validationAttribute: "Select PO",
                deleteInFormDisabled: false,
                applicableValidationSchema: true,
              },
              {
                name: "fb-approvals-ku6t6gzw",
                type: "approvals",
                index: 1,
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
        oldReceivingForm = response;
        cy.drAPIApproveAndRelease({
          documentId: oldReceivingForm.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done() );
      });
    });

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

  });

  context("Time travel one day back to the future", () => {
    it("Login user to dashboard", () => {
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

    it("Select task USAGE_REPORT", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.USAGE_REPORT });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
    });
  });

  context.skip("Submit request for usage report", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to async tasks", () => {
      cy.navigToAsyncTasks();
    });

    it("Select task USAGE_REPORT", () => {
      cy.asyncTaskSelectTaskType({ taskType: SQS_TYPES.USAGE_REPORT });
    });

    it("Submit async task", () => {
      cy.asyncTaskClickSubmit();
    });
  });

  context("Get report and parse it", () => {
    it("Get attachment from email", () => {
      dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
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

    it("Parse to JSON", () => {
      cy.task("parseXlsx", { file: usageReportXlsxFileNameAndPath, sheet: "Report Per Company" }).then((rows: any) => {
        cy.writeFile(usageReportJsonFileNameAndPath, { rows });
      });
    });
  });

  context("Verify number of records", () => {
    it("Read data from JSON", () => {
      cy.readFile(usageReportJsonFileNameAndPath).then((data) => {
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
      assert.deepEqual(numberOfDocsFromUsageReport, numberOfDocsThatWereCreated);
    });
  });
});

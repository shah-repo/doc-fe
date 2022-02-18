// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

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
let createdPOFormDocument;
let formDocumentType;
let purchaseOrderDocumentType;
let createdPODocument;
let supplierDocumentType;
let maintenanceRecordDocumentType;
let CSLDocumentType;
let createdLotsFormDocument;
let receivableDocumentType;
let createdRecivableFormDocument;
let createdReceivable1;

context("Sorting test", () => {
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
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
              {
                documentTypeName: "Part",
                documentTypeAcronym: "PRT-",
                group: "PART",
                isQms: true,
                needsSignature: true,
                category: "Parts",
              },
              {
                documentTypeName: "Material",
                documentTypeAcronym: "MT-",
                group: "MATERIAL",
                isQms: true,
                needsSignature: true,
                category: "Materials",
              },
              {
                documentTypeName: "Supplier",
                documentTypeAcronym: "SUP-",
                group: "SUPPLIER",
                isQms: true,
                needsSignature: true,
                category: "Suppliers",
              },
              {
                documentTypeName: "Purchase Order test",
                documentTypeAcronym: "POT-",
                group: "PO",
                category: "Purchase Order",
                isQms: true,
                privateNumberPool: true,
                needsSignature: true,
                fieldsConfig: {
                  C: {
                    visible: false,
                    required: false,
                  },
                  D: {
                    label: "Description",
                    visible: true,
                    required: false,
                  },
                  E: {
                    visible: false,
                    required: true,
                  },
                  F: {
                    visible: false,
                    required: true,
                  },
                  G: {
                    visible: false,
                    required: false,
                  },
                  I: {
                    label: "Revise PO",
                    visible: true,
                  },
                  J: {
                    visible: false,
                  },
                  K: {
                    label: "Cancel PO",
                    visible: true,
                  },
                  L: {
                    label: "Correct PO",
                    visible: true,
                  },
                  M: {
                    label: "Type of Change",
                    visible: true,
                    required: true,
                  },
                  N: {
                    label: "Add Approvers",
                    visible: false,
                    required: false,
                  },
                  O: {
                    label: "PO History",
                    visible: true,
                  },
                  R: {
                    visible: false,
                  },
                  S: {
                    label: "Revise PO",
                    visible: true,
                  },
                  V: {
                    label: "Create PO",
                    visible: true,
                  },
                  A1: {
                    label: "Draft",
                    visible: true,
                  },
                  A2: {
                    label: "Void",
                    visible: true,
                  },
                  A3: {
                    label: "History",
                    visible: true,
                  },
                  A4: {
                    visible: false,
                  },
                  A5: {
                    label: "Pending Approval",
                    visible: true,
                  },
                  A6: {
                    label: "Draft",
                    visible: true,
                  },
                  P1: {
                    label: "Draft",
                    visible: true,
                  },
                  P2: {
                    label: "Void",
                    visible: true,
                  },
                  P3: {
                    label: "History",
                    visible: true,
                  },
                  P4: {
                    visible: false,
                  },
                  P5: {
                    label: "Pending Approval",
                    visible: true,
                  },
                  P6: {
                    label: "Draft",
                    visible: true,
                  },
                },
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
                    name: "po-supplier-built-in",
                    type: "supplier",
                    index: 1,
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
                    name: "po-items-built-in",
                    type: "purchaseorder",
                    index: 2,
                    label: "Purchase Order",
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: true,
                    validationAttribute: "Purchase Order",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                ],
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Material");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          maintenanceRecordDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Maintenance Record");
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification Lot");
          receivableDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Creates Maintenance record1", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Maintenance record1</p>",
            document: {
              docId: "MR-00001",
              documentType: {
                id: maintenanceRecordDocumentType[0].id,
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
            name: "Maintenance record1",
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
    });

    it("[API]Creates Maintenance record2", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Maintenance record2</p>",
            document: {
              docId: "MR-00002",
              documentType: {
                id: maintenanceRecordDocumentType[0].id,
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
            name: "Maintenance record2",
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
    });

    it("[API]Creates Maintenance record3", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Maintenance record3</p>",
            document: {
              docId: "MR-00003",
              documentType: {
                id: maintenanceRecordDocumentType[0].id,
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
            name: "Maintenance record3",
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
    });

    it("[API]Create equipment document1", () => {
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
              description: "<p>Equipment document1</p>",
              document: {
                docId: "ET-00004",
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
              name: "Equipment document1",
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

    it("[API]Create equipment document2", () => {
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
              description: "<p>Equipment document2</p>",
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
              name: "Equipment document2",
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

    it("[API]Create equipment document3", () => {
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
              description: "<p>Equipment document3</p>",
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
              name: "Equipment document3",
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

    it("[API]Create materials document", () => {
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
          name: "Material document",
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

    it("[API]Create part document1", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document1</p>",
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
          name: "Part document1",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      });
    });

    it("[API]Create part document2", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document2</p>",
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
          name: "Part document2",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      });
    });

    it("[API]Create part document3", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document3</p>",
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
          name: "Part document3",
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      });
    });

    it("[API]Create PO document1", (done: any) => {
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
                    validationAttribute: "PO Status",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "po-supplier-built-in",
                    type: "supplier",
                    index: 1,
                    label: "Supplier ",
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
                    docId: "PO-00001",
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
                  cy.drCreateDocumentRevision({
                    payload: {
                      attachments: [],
                      description: "<p>document form for Receivable</p>",
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
                      name: "Receivable form",
                      referenceTo: [],
                      retrain: false,
                      revisionChangeType: RevisionChangeType.NextRevision,
                      revisionStage: 1,
                      formTemplate: {
                        outputDocumentTypes: [{
                          id: receivableDocumentType[0].id,
                        }],
                        schema: [{
                          index: 0,
                          type: "poreceive",
                          label: "Receivable",
                          name: "receivable-kdptzei2",
                          applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                        },
                        {
                          label: "form.builder.approvals",
                          type: "approvals",
                          deleteDisabled: true,
                          name: "fb-approvals-kn7fbu5l",
                          uniqueSchemaItem: true,
                          index: 0,
                        }],
                      },
                    },
                    employeeId: adminEmployee.id as unknown as string,
                    sessionId: loginResponse.sessionId as unknown as string,
                  }).then((response) => {
                    createdRecivableFormDocument = response;
                    cy.drAPIApproveAndRelease({
                      documentId: createdRecivableFormDocument.id,
                      payload: {
                        effectiveDate: (new Date()).toISOString(),
                        documentType: { id: approvalRequestDocumentType[0].id },
                        formDocument: { id: initialArDocument[0].id },
                        approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
                      },
                      employeeId: adminEmployee.id,
                      sessionId: loginResponse.sessionId,
                    }).then(() => {
                      cy.recAPICreateReceivable({
                        payload: {
                          name: "",
                          description: "",
                          attachments: [],
                          referenceTo: [],
                          formDocument: { id: createdRecivableFormDocument.id },
                          revisionChangeType: RevisionChangeType.NextRevision,
                          document: {
                            docId: "RC-00005",
                            documentType: {
                              id: receivableDocumentType[0].id,
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
                            "receivable-kdptzei2": { id: createdPODocument.id },
                          },
                        },
                        employeeId: adminEmployee.id,
                        sessionId: loginResponse.sessionId,
                      }).then((response) => {
                        createdReceivable1 = response;
                        cy.drAPIApproveAndRelease({
                          documentId: createdReceivable1.id,
                          payload: {
                            effectiveDate: (new Date()).toISOString(),
                            documentType: { id: approvalRequestDocumentType[0].id },
                            formDocument: { id: initialArDocument[0].id },
                            approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
                          },
                          employeeId: adminEmployee.id,
                          sessionId: loginResponse.sessionId,
                        }).then(() => {
                          cy.recAPICreateReceivable({
                            payload: {
                              name: "",
                              description: "",
                              attachments: [],
                              referenceTo: [],
                              formDocument: { id: createdRecivableFormDocument.id },
                              revisionChangeType: RevisionChangeType.NextRevision,
                              document: {
                                docId: "RC-00006",
                                documentType: {
                                  id: receivableDocumentType[0].id,
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
                                "receivable-kdptzei2": { id: createdPODocument.id },
                              },
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
            });
          });
        });
      });
    });

    it("[API]Create PO document2", (done: any) => {
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
                    docId: "PO-00002",
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
                        totalAmount: "100.00",
                        formattedDate: (new Date()).toLocaleDateString("en-US"),
                        index: 0,
                      }],
                      tax: "0.00",
                      taxRate: 9.25,
                      subTotal: "100.00",
                      totalAmount: "100.00",
                      shippingCost: "0.00",
                      currency: "USD",
                      exchangeRate: 1,
                      totalInUSD: "100.00",
                      dateOfExchangeRate: "",
                    },
                    "po-status-built-in": "Closed",
                  },
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
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
        });
      });
    });

    it("[API]Create PO document3", (done: any) => {
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
                    validationAttribute: "PO Status",
                    deleteInFormDisabled: true,
                    applicableValidationSchema: true,
                  },
                  {
                    name: "po-supplier-built-in",
                    type: "supplier",
                    index: 1,
                    label: "Supplier ",
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
                    docId: "PO-00003",
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
                        totalAmount: "200.00",
                        formattedDate: (new Date()).toLocaleDateString("en-US"),
                        index: 0,
                      }],
                      tax: "0.00",
                      taxRate: 9.25,
                      subTotal: "200.00",
                      totalAmount: "200.00",
                      shippingCost: "0.00",
                      currency: "USD",
                      exchangeRate: 1,
                      totalInUSD: "200.00",
                      dateOfExchangeRate: "",
                    },
                    "po-status-built-in": "Closed",
                  },
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
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
        });
      });
    });

    it("[API]Creates supplier document1", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Supplier Document1</p>",
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
            name: "Supplier Document1",
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
    });

    it("[API]Creates supplier document2", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Supplier Document2</p>",
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
            name: "Supplier Document2",
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
    });

    it("[API]Creates supplier document3", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Supplier Document3</p>",
            document: {
              docId: "SUP-00006",
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
            name: "Supplier Document3",
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
    });

    it("[API]Create Lots form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Lots Form document</p>",
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
                type: "approvals",
                deleteDisabled: true,
                name: "fb-approvals-ksherq6d",
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Document List Sorting", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    context("Sort 'Doc Id'", () => {
      it("Doc Id should be in ascending order", () => {
        cy.get("span").contains("Doc ID").eq(0).click();
        cy.get("span").contains("Doc ID").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 8 });
      });

      it("Doc Id should be in descending order", () => {
        cy.get("span").contains("Doc ID").eq(0).click();
        cy.get("span").contains("Doc ID").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 8 });
      });
    });

    context("Sort 'Revision'", () => {
      it("Revision should be in ascending order", () => {
        cy.contains("Revision").eq(0).click();
        cy.contains("Revision").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 8 });
      });

      it("Revision should be in descending order", () => {
        cy.contains("Revision").eq(0).click();
        cy.contains("Revision").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 8 });
      });
    });

    context("Sort 'Document title'", () => {
      it("Document title should be in ascending order", () => {
        cy.contains("Document title").eq(0).click();
        cy.contains("Document title").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 8 });
      });

      it("Document title should be in descending order", () => {
        cy.contains("Document title").eq(0).click();
        cy.contains("Document title").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 8 });
      });
    });

    context("Sort 'Type'", () => {
      it("Type should be in ascending order", () => {
        cy.contains("Type").eq(0).click();
        cy.contains("Type").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 3, colLength: 8 });
      });

      it("Type should be in descending order", () => {
        cy.contains("Type").eq(0).click();
        cy.contains("Type").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 3, colLength: 8 });
      });
    });

    context("Sort 'Owner'", () => {
      it("Owner should be in ascending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 4, colLength: 8 });
      });

      it("Owner should be in descending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 4, colLength: 8 });
      });
    });

    // context("Sort 'AR ID'", () => {
    //   it("AR ID should be in ascending order", () => {
    //     cy.contains("AR ID").eq(0).click();
    //     cy.contains("AR ID").eq(0).parent().find(".ReactVirtualized__Table__sortableHeaderIcon--ASC")
    //       .should("be.exist");
    //     cy.verifyAscSort({ index: 5, colLength: 8 });
    //   });

    //   it("AR ID should be in descending order", () => {
    //     cy.contains("AR ID").eq(0).click();
    //     cy.contains("AR ID").eq(0).parent().find(".ReactVirtualized__Table__sortableHeaderIcon--DESC")
    //       .should("be.exist");
    //     cy.verifyDesSort({ index: 5, colLength: 8 });
    //   });
    // });

    context("Sort 'Status'", () => {
      it("Status should be in ascending order", () => {
        cy.contains("Status").eq(0).click();
        cy.contains("Status").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 6, colLength: 8 });
      });

      it("Status should be in descending order", () => {
        cy.contains("Status").eq(0).click();
        cy.contains("Status").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 6, colLength: 8 });
      });
    });

    context("Sort 'Effective Date'", () => {
      it("Effective Date should be in ascending order", () => {
        cy.contains("Effective Date").eq(0).click();
        cy.contains("Effective Date").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 7, colLength: 8 });
      });

      it("Effective Date should be in descending order", () => {
        cy.contains("Effective Date").eq(0).click();
        cy.contains("Effective Date").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 7, colLength: 8 });
      });
    });
  });

  context("Group Management Sorting", () => {
    it("Navigate to Group Management", () => {
      cy.grpNavigateToGroupManagement();
    });

    // context("Sort 'Name'", () => {
    //   it("Name should be in ascending order", () => {
    //     cy.contains("Name").eq(0).click();
    //     cy.contains("Name").eq(0).parent().find(".ReactVirtualized__Table__sortableHeaderIcon--ASC")
    //       .should("be.exist");
    //     cy.verifyAscSort({ index: 0, colLength: 3 });
    //   });

    //   it("Name should be in descending order", () => {
    //     cy.contains("Name").eq(0).click();
    //     cy.contains("Name").eq(0).parent().find(".ReactVirtualized__Table__sortableHeaderIcon--DESC")
    //       .should("be.exist");
    //     cy.verifyDesSort({ index: 0, colLength: 3 });
    //   });
    // });

    // context("Sort 'Members'", () => {
    //   it("Members should be in ascending order", () => {
    //     cy.contains("Members").eq(0).click();
    //     cy.contains("Members").eq(0).parent().find(".ReactVirtualized__Table__sortableHeaderIcon--ASC")
    //       .should("be.exist");
    //     cy.verifyAscSort({ index: 1, colLength: 3 });
    //   });

    //   it("Members should be in descending order", () => {
    //     cy.contains("Members").eq(0).click();
    //     cy.contains("Members").eq(0).parent().find(".ReactVirtualized__Table__sortableHeaderIcon--DESC")
    //       .should("be.exist");
    //     cy.verifyDesSort({ index: 1, colLength: 3 });
    //   });
    // });

    context("Sort 'Group Type'", () => {
      it("Group Type should be in ascending order", () => {
        cy.contains("Group Type").eq(0).click();
        cy.contains("Group Type").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 7 });
      });

      it("Group Type should be in descending order", () => {
        cy.contains("Group Type").eq(0).click();
        cy.contains("Group Type").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 7 });
      });
    });
  });

  context("User Management Sorting", () => {
    it("Navigate to User Management", () => {
      cy.usrNavigateToUserManagement();
    });

    context("Sort 'Name'", () => {
      it("Name should be in ascending order", () => {
        cy.contains("Name").eq(0).click();
        cy.contains("Name").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 6 });
      });

      it("Name should be in descending order", () => {
        cy.contains("Name").eq(0).click();
        cy.contains("Name").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 6 });
      });
    });

    context("Sort 'Email'", () => {
      it("Email should be in ascending order", () => {
        cy.contains("Email").eq(0).click();
        cy.contains("Email").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 6 });
      });

      it("Email should be in descending order", () => {
        cy.contains("Email").eq(0).click();
        cy.contains("Email").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 6 });
      });
    });

    // context("Sort 'Groups'", () => {
    //   it("Groups should be in ascending order", () => {
    //     cy.contains("Groups").eq(0).click();
    //     cy.contains("Groups").eq(0).parent().find(".ReactVirtualized__Table__sortableHeaderIcon--ASC")
    //       .should("be.exist");
    //     cy.verifyAscSort({ index: 2, colLength: 5 });
    //   });

    //   it("Groups should be in descending order", () => {
    //     cy.contains("Groups").eq(0).click();
    //     cy.contains("Groups").eq(0).parent().find(".ReactVirtualized__Table__sortableHeaderIcon--DESC")
    //       .should("be.exist");
    //     cy.verifyDesSort({ index: 2, colLength: 5 });
    //   });
    // });

    context("Sort 'Active'", () => {
      it("Active should be in ascending order", () => {
        cy.contains("Active").eq(0).click();
        cy.contains("Active").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 4, colLength: 6 });
      });

      it("Active should be in descending order", () => {
        cy.contains("Active").eq(0).click();
        cy.contains("Active").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 4, colLength: 6 });
      });
    });

    context("Sort 'Signed up'", () => {
      it("Signed up should be in ascending order", () => {
        cy.contains("Signed Up").eq(0).click();
        cy.contains("Signed Up").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 6 });
      });

      it("Signed up should be in descending order", () => {
        cy.contains("Signed Up").eq(0).click();
        cy.contains("Signed Up").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 6 });
      });
    });
  });

  context("Equipment Sorting", () => {
    it("Navigate to Equipment", () => {
      cy.navigToEquipment();
    });

    context("Sort 'ID'", () => {
      it("ID should be in ascending order", () => {
        cy.contains("ID").eq(0).click();
        cy.contains("ID").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 8 });
      });

      it("ID should be in descending order", () => {
        cy.contains("ID").eq(0).click();
        cy.contains("ID").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 8 });
      });
    });

    context("Sort 'Revision'", () => {
      it("Revision should be in ascending order", () => {
        cy.contains("Revision").eq(0).click();
        cy.contains("Revision").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 8 });
      });

      it("Revision should be in descending order", () => {
        cy.contains("Revision").eq(0).click();
        cy.contains("Revision").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 8 });
      });
    });

    context("Sort 'State'", () => {
      it("State should be in ascending order", () => {
        cy.contains("State").eq(0).click();
        cy.contains("State").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 8 });
      });

      it("State should be in descending order", () => {
        cy.contains("State").eq(0).click();
        cy.contains("State").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 8 });
      });
    });

    context("Sort 'Title'", () => {
      it("Title should be in ascending order", () => {
        cy.contains("Title").eq(0).click();
        cy.contains("Title").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 3, colLength: 8 });
      });

      it("Title should be in descending order", () => {
        cy.contains("Title").eq(0).click();
        cy.contains("Title").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 3, colLength: 8 });
      });
    });

    context("Sort 'EFT Owner'", () => {
      it("EFT Owner should be in ascending order", () => {
        cy.contains("EFT Owner").eq(0).click();
        cy.contains("EFT Owner").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 4, colLength: 8 });
      });

      it("EFT Owner should be in descending order", () => {
        cy.contains("EFT Owner").eq(0).click();
        cy.contains("EFT Owner").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 4, colLength: 8 });
      });
    });

    context("Sort 'Cal Due Date'", () => {
      it("Cal Due Date should be in ascending order", () => {
        cy.contains("Cal Due Date").eq(0).click();
        cy.contains("Cal Due Date").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 5, colLength: 8 });
      });

      it("Cal Due Date should be in descending order", () => {
        cy.contains("Cal Due Date").eq(0).click();
        cy.contains("Cal Due Date").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 5, colLength: 8 });
      });
    });

    context("Sort 'PM Due Date'", () => {
      it("PM Due Date should be in ascending order", () => {
        cy.contains("PM Due Date").eq(0).click();
        cy.contains("PM Due Date").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 6, colLength: 8 });
      });

      it("PM Due Date should be in descending order", () => {
        cy.contains("PM Due Date").eq(0).click();
        cy.contains("PM Due Date").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 6, colLength: 8 });
      });
    });

    context("Sort 'EQ Status'", () => {
      it("EQ Status should be in ascending order", () => {
        cy.contains("EQ Status").eq(0).click();
        cy.contains("EQ Status").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 7, colLength: 8 });
      });

      it("EQ Status should be in descending order", () => {
        cy.contains("EQ Status").eq(0).click();
        cy.contains("EQ Status").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 7, colLength: 8 });
      });
    });
  });

  context("Suppliers Sorting", () => {
    it("Navigate to Suppliers", () => {
      cy.navigToSuppliers();
    });

    context("Sort 'Supplier ID'", () => {
      it("Supplier ID should be in ascending order", () => {
        cy.contains("Supplier ID").eq(0).click();
        cy.contains("Supplier ID").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 7 });
      });

      it("Supplier ID should be in descending order", () => {
        cy.contains("Supplier ID").eq(0).click();
        cy.contains("Supplier ID").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 7 });
      });
    });

    context("Sort 'Supplier Name'", () => {
      it("Supplier Name should be in ascending order", () => {
        cy.contains("Supplier Name").eq(0).click();
        cy.contains("Supplier Name").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 7 });
      });

      it("Supplier Name should be in descending order", () => {
        cy.contains("Supplier Name").eq(0).click();
        cy.contains("Supplier Name").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 7 });
      });
    });

    context("Sort 'Supplier Level'", () => {
      it("Supplier Level should be in ascending order", () => {
        cy.contains("Supplier Level").eq(0).click();
        cy.contains("Supplier Level").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 7 });
      });

      it("Supplier Level should be in descending order", () => {
        cy.contains("Supplier Level").eq(0).click();
        cy.contains("Supplier Level").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 7 });
      });
    });

    context("Sort 'Supplier Status'", () => {
      it("Supplier Status should be in ascending order", () => {
        cy.contains("Supplier Status").eq(0).click();
        cy.contains("Supplier Status").eq(0).click();
        cy.contains("Supplier Status").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 3, colLength: 7 });
      });

      it("Supplier Status should be in descending order", () => {
        cy.contains("Supplier Status").eq(0).click();
        cy.contains("Supplier Status").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 3, colLength: 7 });
      });
    });

    context("Sort 'State'", () => {
      it("State should be in ascending order", () => {
        cy.contains("State").eq(0).click();
        cy.contains("State").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 4, colLength: 7 });
      });

      it("State should be in descending order", () => {
        cy.contains("State").eq(0).click();
        cy.contains("State").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 4, colLength: 7 });
      });
    });

    context("Sort 'Owner'", () => {
      it("Owner should be in ascending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 5, colLength: 7 });
      });

      it("Owner should be in descending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 5, colLength: 7 });
      });
    });

    context("Sort 'Approval ID'", () => {
      it("Approval ID should be in ascending order", () => {
        cy.contains("Approval ID").eq(0).click();
        cy.contains("Approval ID").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 6, colLength: 7 });
      });

      it("Approval ID should be in descending order", () => {
        cy.contains("Approval ID").eq(0).click();
        cy.contains("Approval ID").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 6, colLength: 7 });
      });
    });
  });

  context("Parts Sorting", () => {
    it("Navigate to Parts", () => {
      cy.navigToParts();
    });

    context("Sort 'Parts ID'", () => {
      it("Parts ID should be in ascending order", () => {
        cy.contains("Parts ID").eq(0).click();
        cy.contains("Parts ID").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 5 });
      });

      it("Parts ID should be in descending order", () => {
        cy.contains("Parts ID").eq(0).click();
        cy.contains("Parts ID").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 5 });
      });
    });

    context("Sort 'Document Title'", () => {
      it("Document Title should be in ascending order", () => {
        cy.contains("Document Title").eq(0).click();
        cy.contains("Document Title").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 5 });
      });

      it("Document Title should be in descending order", () => {
        cy.contains("Document Title").eq(0).click();
        cy.contains("Document Title").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 5 });
      });
    });

    context("Sort 'Owner'", () => {
      it("Owner should be in ascending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 5 });
      });

      it("Owner should be in descending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 5 });
      });
    });

    context("Sort 'State'", () => {
      it("State should be in ascending order", () => {
        cy.contains("State").eq(0).click();
        cy.contains("State").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 3, colLength: 5 });
      });

      it("State should be in descending order", () => {
        cy.contains("State").eq(0).click();
        cy.contains("State").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 3, colLength: 5 });
      });
    });

    context("Sort 'Approval ID'", () => {
      it("Approval ID should be in ascending order", () => {
        cy.contains("Approval ID").eq(0).click();
        cy.contains("Approval ID").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 4, colLength: 5 });
      });

      it("Approval ID should be in descending order", () => {
        cy.contains("Approval ID").eq(0).click();
        cy.contains("Approval ID").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 4, colLength: 5 });
      });
    });
  });

  context("Purchase Order Sorting", () => {
    it("Navigate to Purchase Order", () => {
      cy.navigToPurchaseOrder();
    });

    context("Sort 'PO #'", () => {
      it("PO # should be in ascending order", () => {
        cy.contains("PO #").eq(0).click();
        cy.contains("PO #").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 8 });
      });

      it("PO # should be in descending order", () => {
        cy.contains("PO #").eq(0).click();
        cy.contains("PO #").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 8 });
      });
    });

    context("Sort 'Revision'", () => {
      it("Revision should be in ascending order", () => {
        cy.contains("Revision").eq(0).click();
        cy.contains("Revision").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 8 });
      });

      it("Revision should be in descending order", () => {
        cy.contains("Revision").eq(0).click();
        cy.contains("Revision").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 8 });
      });
    });

    context("Sort 'PO Status'", () => {
      it("PO Status should be in ascending order", () => {
        cy.contains("PO Status").eq(0).click();
        cy.contains("PO Status").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 8 });
      });

      it("PO Status should be in descending order", () => {
        cy.contains("PO Status").eq(0).click();
        cy.contains("PO Status").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 8 });
      });
    });

    context("Sort 'Supplier'", () => {
      it("Supplier should be in ascending order", () => {
        cy.get("[aria-colindex]").contains("Supplier").eq(0).click();
        cy.get("[aria-colindex]").contains("Supplier").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 3, colLength: 8 });
      });

      it("Supplier should be in descending order", () => {
        cy.get("[aria-colindex]").contains("Supplier").eq(0).click();
        cy.get("[aria-colindex]").contains("Supplier").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 3, colLength: 8 });
      });
    });

    context("Sort 'Part Number'", () => {
      it("Part Number should be in ascending order", () => {
        cy.contains("Part Number").eq(0).click();
        cy.contains("Part Number").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 4, colLength: 8 });
      });

      it("Part Number should be in descending order", () => {
        cy.contains("Part Number").eq(0).click();
        cy.contains("Part Number").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 4, colLength: 8 });
      });
    });

    context("Sort 'Amount'", () => {
      it("Amount should be in ascending order", () => {
        cy.contains("Amount").eq(0).click();
        cy.contains("Amount").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 5, colLength: 8 });
      });

      it("Amount should be in descending order", () => {
        cy.contains("Amount").eq(0).click();
        cy.contains("Amount").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 5, colLength: 8 });
      });
    });

    context("Sort 'Requestor'", () => {
      it("Requestor should be in ascending order", () => {
        cy.contains("Requestor").eq(0).click();
        cy.contains("Requestor").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 6, colLength: 8 });
      });

      it("Requestor should be in descending order", () => {
        cy.contains("Requestor").eq(0).click();
        cy.contains("Requestor").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 6, colLength: 8 });
      });
    });

    context("Sort 'Issue Date'", () => {
      it("Issue Date should be in ascending order", () => {
        cy.contains("Issue Date").eq(0).click();
        cy.contains("Issue Date").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 7, colLength: 8 });
      });

      it("Issue Date should be in descending order", () => {
        cy.contains("Issue Date").eq(0).click();
        cy.contains("Issue Date").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 7, colLength: 8 });
      });
    });
  });

  context("Receiving Sorting", () => {
    it("Navigate to Receiving", () => {
      cy.navigToReceivableList();
    });

    context("Sort 'Receive ID'", () => {
      it("Receive ID should be in ascending order", () => {
        cy.contains("Receive ID").eq(0).click();
        cy.contains("Receive ID").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 5 });
      });

      it("Receive ID should be in descending order", () => {
        cy.contains("Receive ID").eq(0).click();
        cy.contains("Receive ID").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 5 });
      });
    });

    context("Sort 'Document Title'", () => {
      it("Document Title should be in ascending order", () => {
        cy.contains("Document Title").eq(0).click();
        cy.contains("Document Title").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 5 });
      });

      it("Document Title should be in descending order", () => {
        cy.contains("Document Title").eq(0).click();
        cy.contains("Document Title").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 5 });
      });
    });

    context("Sort 'Owner'", () => {
      it("Owner should be in ascending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 5 });
      });

      it("Owner should be in descending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 5 });
      });
    });


    // context("Sort 'State'", () => {
    //   it("State should be in ascending order", () => {
    //     cy.contains("State").eq(0).click();
    //     cy.contains("State").eq(0).parent().find(".ReactVirtualized__Table__sortableHeaderIcon--ASC")
    //       .should("be.exist");
    //     cy.verifyAscSort({ index: 3, colLength: 5 });
    //   });

    //   it("State should be in descending order", () => {
    //     cy.contains("State").eq(0).click();
    //     cy.contains("State").eq(0).parent().find(".ReactVirtualized__Table__sortableHeaderIcon--DESC")
    //       .should("be.exist");
    //     cy.verifyDesSort({ index: 3, colLength: 5 });
    //   });
    // });

    // context("Sort 'Approval ID'", () => {
    //   it("Approval ID should be in ascending order", () => {
    //     cy.contains("Approval ID").eq(0).click();
    //     cy.contains("Approval ID").eq(0).parent().find(".ReactVirtualized__Table__sortableHeaderIcon--ASC")
    //       .should("be.exist");
    //     cy.verifyAscSort({ index: 4, colLength: 5 });
    //   });

    //   it("Approval ID should be in descending order", () => {
    //     cy.contains("Approval ID").eq(0).click();
    //     cy.contains("Approval ID").eq(0).parent().find(".ReactVirtualized__Table__sortableHeaderIcon--DESC")
    //       .should("be.exist");
    //     cy.verifyDesSort({ index: 4, colLength: 5 });
    //   });
    // });
  });

  context("AR Sorting", () => {
    it("Navigate to AR", () => {
      cy.navigToApprovalRequestList();
      cy.arClearFilters();
      cy.listLoadingElementShouldNotExist();
    });

    context("Sort 'AR ID'", () => {
      it("AR ID should be in ascending order", () => {
        cy.contains("AR ID").eq(0).click();
        cy.contains("AR ID").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 4 });
      });

      it("AR ID should be in descending order", () => {
        cy.contains("AR ID").eq(0).click();
        cy.contains("AR ID").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 4 });
      });
    });

    context("Sort 'AR Title'", () => {
      it("AR Title should be in ascending order", () => {
        cy.contains("AR Title").eq(0).click();
        cy.contains("AR Title").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 4 });
      });

      it("AR Title should be in descending order", () => {
        cy.contains("AR Title").eq(0).click();
        cy.contains("AR Title").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 4 });
      });
    });

    context("Sort 'Owner'", () => {
      it("Owner should be in ascending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 4 });
      });

      it("Owner should be in descending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 4 });
      });
    });


    context("Sort 'Status'", () => {
      it("Status should be in ascending order", () => {
        cy.contains("Status").eq(0).click();
        cy.contains("Status").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 3, colLength: 4 });
      });

      it("Status should be in descending order", () => {
        cy.contains("Status").eq(0).click();
        cy.contains("Status").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 3, colLength: 4 });
      });
    });
  });

  context("Records Sorting", () => {
    it("Navigate to Records", () => {
      cy.navigToRecords();
    });

    context("Sort 'ID'", () => {
      it("ID should be in ascending order", () => {
        cy.contains("ID").eq(0).click();
        cy.contains("ID").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 7 });
      });

      it("ID should be in descending order", () => {
        cy.contains("ID").eq(0).click();
        cy.contains("ID").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 7 });
      });
    });

    context("Sort 'Revision'", () => {
      it("Revision should be in ascending order", () => {
        cy.contains("Revision").eq(0).click();
        cy.contains("Revision").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 7 });
      });

      it("Revision should be in descending order", () => {
        cy.contains("Revision").eq(0).click();
        cy.contains("Revision").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 7 });
      });
    });

    context("Sort 'State'", () => {
      it("State should be in ascending order", () => {
        cy.contains("State").eq(0).click();
        cy.contains("State").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 7 });
      });

      it("State should be in descending order", () => {
        cy.contains("State").eq(0).click();
        cy.contains("State").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 7 });
      });
    });


    context("Sort 'Title'", () => {
      it("Title should be in ascending order", () => {
        cy.contains("Title").eq(0).click();
        cy.contains("Title").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 3, colLength: 7 });
      });

      it("Title should be in descending order", () => {
        cy.contains("Title").eq(0).click();
        cy.contains("Title").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 3, colLength: 7 });
      });
    });

    context("Sort 'Owner'", () => {
      it("Owner should be in ascending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 4, colLength: 7 });
      });

      it("Owner should be in descending order", () => {
        cy.contains("Owner").eq(0).click();
        cy.contains("Owner").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 4, colLength: 7 });
      });
    });

    context("Sort 'Released Date'", () => {
      it("Released Date should be in ascending order", () => {
        cy.contains("Released Date").eq(0).click();
        cy.contains("Released Date").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 5, colLength: 7 });
      });

      it("Released Date should be in descending order", () => {
        cy.contains("Released Date").eq(0).click();
        cy.contains("Released Date").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 5, colLength: 7 });
      });
    });

    context("Sort 'Form ID'", () => {
      it("Form ID should be in ascending order", () => {
        cy.contains("Form ID").eq(0).click();
        cy.contains("Form ID").eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 6, colLength: 7 });
      });

      it("Form ID should be in descending order", () => {
        cy.contains("Form ID").eq(0).click();
        cy.contains("Form ID").eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 6, colLength: 7 });
      });
    });
  });
});

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { Material } from "../../utils/constants/documentTypes/material";
import { Part } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { Supplier } from "../../utils/constants/documentTypes/supplier";
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

const DL_COLUMN_HEADERS = [
  "DOC ID",
  "REVISION",
  "DOCUMENT TITLE",
  "TYPE",
  "OWNER",
  "AR ID",
  "STATUS",
  "EFFECTIVE DATE",
];

const GROUP_MGMT_COLUMN_HEADERS = [
  "GROUP TYPE",
  "NAME",
  // "MEMBERS",
  // "PERMISSIONS",
  // "TAGS",
  // "PARENT GROUPS",
];

const USER_MGMT_COLUMN_HEADERS = [
  "SIGNED UP",
  "NAME",
  "EMAIL",
  "GROUPS",
  "ACTIVE",
];

const EQ_COLUMN_HEADERS = [
  "ID",
  "REVISION",
  "STATE",
  "TITLE",
  "EFT OWNER",
  "CAL DUE DATE",
  "PM DUE DATE",
  "EQ STATUS",
];

const SUPP_COLUMN_HEADERS = [
  "SUPPLIER ID",
  "SUPPLIER NAME",
  "SUPPLIER LEVEL",
  "SUPPLIER STATUS",
  "STATE",
  "OWNER",
  "APPROVAL ID",
];

const PARTS_COLUMN_HEADERS = [
  "PARTS ID",
  "DOCUMENT TITLE",
  "OWNER",
  "STATE",
  "APPROVAL ID",
];

const PO_COLUMN_HEADERS = [
  "PO #",
  "REVISION",
  "PO STATUS",
  "SUPPLIER",
  "PART NUMBER",
  "AMOUNT",
  "REQUESTOR",
  "ISSUE DATE",
];

const RECEIVING_COLUMN_HEADERS = [
  "RECEIVE ID",
  "DOCUMENT TITLE",
  "OWNER",
  "STATE",
  "APPROVAL ID",
];

const AR_COLUMN_HEADERS = [
  "AR ID",
  "AR TITLE",
  "OWNER",
  "STATUS",
];

const RECORDS_COLUMN_HEADERS = [
  "ID",
  "REVISION",
  "STATE",
  "TITLE",
  "OWNER",
  "RELEASED DATE",
  "FORM ID",
];

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
              ClinicalProtocolDocType,
              Part,
              Material,
              Supplier,
              PurchaseOrderTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
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
                    type: "poapprovals",
                    deleteDisabled: false,
                    name: "fb-po-approvals-kqqix31p",
                    uniqueSchemaItem: true,
                    index: 3,
                    tabId: "details",
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
                          tabId: "details",
                          name: "receivable-kdptzei2",
                          applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                        },
                        {
                          label: "form.builder.approvals",
                          tabId: "details",
                          type: "approvals",
                          deleteDisabled: true,
                          name: "fb-approvals-kn7fbu5l",
                          uniqueSchemaItem: true,
                          index: 1,
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
                    type: "poapprovals",
                    deleteDisabled: false,
                    name: "fb-po-approvals-kqqix31p",
                    uniqueSchemaItem: true,
                    index: 3,
                    tabId: "details",
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
                    type: "poapprovals",
                    deleteDisabled: false,
                    name: "fb-po-approvals-kqqix31p",
                    uniqueSchemaItem: true,
                    index: 3,
                    tabId: "details",
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

    DL_COLUMN_HEADERS.forEach( (columnHeader, i) => {
      context(`Sort '${columnHeader}'`, () => {
        const columnHeaderRegex = new RegExp("^" + columnHeader + "$", "g");

        it(`${columnHeader} should be in ascending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-asc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyAscSort({ index: i, colLength: 8 });
        });

        it(`${columnHeader} should be in descending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-desc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyDesSort({ index: i, colLength: 8 });
        });
      });
    });
  });

  context("Group Management Sorting", () => {
    it("Navigate to Group Management", () => {
      cy.grpNavigateToGroupManagement();
    });

    GROUP_MGMT_COLUMN_HEADERS.forEach( (columnHeader, i) => {
      context(`Sort '${columnHeader}'`, () => {
        const columnHeaderRegex = new RegExp("^" + columnHeader + "$", "g");

        it(`${columnHeader} should be in ascending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-asc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyAscSort({ index: i, colLength: 7 });
        });

        it(`${columnHeader} should be in descending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-desc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyDesSort({ index: i, colLength: 7 });
        });
      });
    });
  });

  context("User Management Sorting", () => {
    it("Navigate to User Management", () => {
      cy.usrNavigateToUserManagement();
    });

    USER_MGMT_COLUMN_HEADERS.forEach( (columnHeader, i) => {
      context(`Sort '${columnHeader}'`, () => {
        const columnHeaderRegex = new RegExp("^" + columnHeader + "$", "g");

        it(`${columnHeader} should be in ascending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-asc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyAscSort({ index: i, colLength: 6 });
        });

        it(`${columnHeader} should be in descending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-desc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyDesSort({ index: i, colLength: 6 });
        });
      });
    });
  });

  context("Equipment Sorting", () => {
    it("Navigate to Equipment", () => {
      cy.navigToEquipment();
    });

    EQ_COLUMN_HEADERS.forEach( (columnHeader, i) => {
      context(`Sort '${columnHeader}'`, () => {
        const columnHeaderRegex = new RegExp("^" + columnHeader + "$", "g");

        it(`${columnHeader} should be in ascending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-asc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyAscSort({ index: i, colLength: 8 });
        });

        it(`${columnHeader} should be in descending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-desc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyDesSort({ index: i, colLength: 8 });
        });
      });
    });
  });

  context("Suppliers Sorting", () => {
    it("Navigate to Suppliers", () => {
      cy.navigToSuppliers();
    });

    SUPP_COLUMN_HEADERS.forEach( (columnHeader, i) => {
      context(`Sort '${columnHeader}'`, () => {
        const columnHeaderRegex = new RegExp("^" + columnHeader + "$", "g");

        it(`${columnHeader} should be in ascending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-asc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyAscSort({ index: i, colLength: 7 });
        });

        it(`${columnHeader} should be in descending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-desc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyDesSort({ index: i, colLength: 7 });

          // workaround for sorting issue between 'Supplier Level' and 'Supplier Status' columns
          if (columnHeader === "SUPPLIER LEVEL") {
            cy.contains(columnHeaderRegex).eq(0).arrowClick();
          }
        });
      });
    });
  });

  context("Parts Sorting", () => {
    it("Navigate to Parts", () => {
      cy.navigToParts();
    });

    PARTS_COLUMN_HEADERS.forEach( (columnHeader, i) => {
      context(`Sort '${columnHeader}'`, () => {
        const columnHeaderRegex = new RegExp("^" + columnHeader + "$", "g");

        it(`${columnHeader} should be in ascending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-asc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyAscSort({ index: i, colLength: 5 });
        });

        it(`${columnHeader} should be in descending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-desc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyDesSort({ index: i, colLength: 5 });
        });
      });
    });
  });

  context("Purchase Order Sorting", () => {
    it("Navigate to Purchase Order", () => {
      cy.navigToPurchaseOrder();
    });

    PO_COLUMN_HEADERS.forEach( (columnHeader, i) => {
      context(`Sort '${columnHeader}'`, () => {
        const columnHeaderRegex = new RegExp("^" + columnHeader + "$", "g");

        it(`${columnHeader} should be in ascending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-asc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyAscSort({ index: i, colLength: 8 });
        });

        it(`${columnHeader} should be in descending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-desc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyDesSort({ index: i, colLength: 8 });
        });
      });
    });
  });

  context("Receiving Sorting", () => {
    it("Navigate to Receiving", () => {
      cy.navigToReceivableList();
    });

    RECEIVING_COLUMN_HEADERS.forEach( (columnHeader, i) => {
      context(`Sort '${columnHeader}'`, () => {
        const columnHeaderRegex = new RegExp("^" + columnHeader + "$", "g");

        it(`${columnHeader} should be in ascending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-asc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyAscSort({ index: i, colLength: 5 });
        });

        it(`${columnHeader} should be in descending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-desc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyDesSort({ index: i, colLength: 5 });
        });
      });
    });
  });

  context("AR Sorting", () => {
    it("Navigate to AR", () => {
      cy.navigToApprovalRequestList();
      cy.arClearFilters();
      cy.listLoadingElementShouldNotExist();
    });

    AR_COLUMN_HEADERS.forEach( (columnHeader, i) => {
      context(`Sort '${columnHeader}'`, () => {
        const columnHeaderRegex = new RegExp("^" + columnHeader + "$", "g");

        it(`${columnHeader} should be in ascending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-asc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyAscSort({ index: i, colLength: 4 });
        });

        it(`${columnHeader} should be in descending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-desc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyDesSort({ index: i, colLength: 4 });
        });
      });
    });
  });

  context("Records Sorting", () => {
    it("Navigate to Records", () => {
      cy.navigToRecords();
    });

    RECORDS_COLUMN_HEADERS.forEach( (columnHeader, i) => {
      context(`Sort '${columnHeader}'`, () => {
        const columnHeaderRegex = new RegExp("^" + columnHeader + "$", "g");

        it(`${columnHeader} should be in ascending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-asc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyAscSort({ index: i, colLength: 7 });
        });

        it(`${columnHeader} should be in descending order`, () => {
          cy.contains(columnHeaderRegex).eq(0).arrowClick();
          cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-desc-sm")
            .should("be.exist");
          cy.wait(200);
          cy.verifyDesSort({ index: i, colLength: 7 });
        });
      });
    });
  });
});

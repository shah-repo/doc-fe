// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { ReceivableTest } from "../../utils/constants/documentTypes/receivable";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let secondUserLogin;
let receivableDocumentType;
let supplierDocumentType;
let partDocumentType;
let purchaseOrderDocumentType;
let approvalRequestDocumentType;
let formDocumentType;
let initialArDocument;
let createdPOFormDocument;
let createdPartDocument;
let createdPartDocument2;
let createdPartDocument3;
let createdPODocument;
let createdPODocument2;
let createdPODocument3;
let createdSupplierFormDocument;
let createdSupplierDocument;
let createdSupplierDocument2;
let createdSupplierDocument3;
let receivableForm;
let releasedRec;
let adminEmployee;
let supplierPageDetailsId;
let secondEmployee;
let group;

const SupplierFormTitle = "Supplier form";
const todaysDate = moment().tz("America/Los_Angeles");
const todaysDateFormated = moment().tz("America/Los_Angeles").format("L");

const COLUMN_HEADERS = [
  "RECEIPT ID",
  "RECEIPT RECORD STATE",
  "OWNER",
  "PO #",
  "RELEASED DATE",
  "SUPPLIER",
  "PART NUMBER/REV",
  "PO STATUS",
];

context("Test Supplier Landing Page for Supira", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });


  context("Test setup", () => {
    it("[API] Creates company", (done: any) => {
      cy.authApiLogin({
        email: CONFIG.SUPERADMIN_EMAIL,
        password: CONFIG.SUPERADMIN_PASSWORD,
      }).then((response) => {
        loginResponse = response;

        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: IMPORTER_USER.email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2]],
            documentTypes: [ReceivableTest],
            acctCodes: ["code 1"],
            addresses: ["Address 1"],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Component Specification");
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order");
          receivableDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable test");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API] Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create SupplierForm & Suppliers", (done: any) => {
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
                  cy.poAPICreatePO({
                    payload: {
                      name: "API Supplier Document 2",
                      attachments: [],
                      referenceTo: [],
                      formDocument: { id: createdSupplierFormDocument.id },
                      description: "API Supplier document 2",
                      revisionChangeType: RevisionChangeType.NextRevision,
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
                    },
                    employeeId: adminEmployee.id,
                    sessionId: loginResponse.sessionId,
                  }).then((response) => {
                    createdSupplierDocument2 = response;
                    cy.drAPIApproveAndRelease({
                      documentId: createdSupplierDocument2.id,
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
                          name: "API Supplier Document 3",
                          attachments: [],
                          referenceTo: [],
                          formDocument: { id: createdSupplierFormDocument.id },
                          description: "API Supplier document 3",
                          revisionChangeType: RevisionChangeType.NextRevision,
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
                        },
                        employeeId: adminEmployee.id,
                        sessionId: loginResponse.sessionId,
                      }).then((response) => {
                        createdSupplierDocument3 = response;
                        cy.drAPIApproveAndRelease({
                          documentId: createdSupplierDocument3.id,
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
              cy.drCreateDocumentRevision({
                payload: {
                  attachments: [],
                  description: "<p>Part third document</p>",
                  document: {
                    docId: "PRT-00007",
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
                  name: "Part third document",
                  referenceTo: [],
                  retrain: false,
                  revisionChangeType: RevisionChangeType.NextRevision,
                  revisionStage: 1,
                },
                employeeId: adminEmployee.id as unknown as string,
                sessionId: loginResponse.sessionId as unknown as string,
              }).then((response) => {
                createdPartDocument3 = response;
                cy.drAPIApproveAndRelease({
                  documentId: createdPartDocument3.id,
                  payload: {
                    effectiveDate: (new Date()).toISOString(),
                    documentType: { id: approvalRequestDocumentType[0].id },
                    formDocument: { id: initialArDocument[0].id },
                    approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
                  },
                  employeeId: adminEmployee.id,
                  sessionId: loginResponse.sessionId,
                }).then(( ) => { done(); });
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
              ],
            },
            "fb-po-approvals": [
              adminEmployee.id,
            ],
            "po-status-built-in": "Open",
            "po-requestor-autocomplete": adminEmployee.id,
            "po-order-date": todaysDate,
            "po-supplier-built-in": createdSupplierDocument2.id,
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

    it("[API]Create PO2", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>PO for receiving 2</p>",
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
                  partNumber: createdPartDocument2.id,
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
            "po-supplier-built-in": createdSupplierDocument2.id,
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdPODocument2 = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPODocument2.id,
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

    it("[API]Create PO3", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>PO for receiving 3</p>",
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
                  partNumber: createdPartDocument3.id,
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
        cy.drAPIApproveAndRelease({
          documentId: createdPODocument3.id,
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
              description: "<p>Receivable form</p>",
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
              formTemplate: {
                outputDocumentTypes: [
                  { id: receivableDocumentType[0].id },
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
            receivableForm = response;
            cy.drAPIApproveAndRelease({
              documentId: receivableForm.id,
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

    it("[API] Patch page details", (done: any) => {
      cy.request({
        method: "GET",
        url: `${CONFIG.BE_URL}/api/v1/page_details`,
        qs: {
          category: "Receive",
        },
        headers: {
          Authorization: `bearer ${adminEmployee.id}:${loginResponse.sessionId}`,
        },
      }).then((response) => {
        if (response.body) {
          supplierPageDetailsId = response.body[0].id;
        }
      }).then(() => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/page_details/*" }).as("response");
        cy.cmpUpdatePageDetails({
          id: supplierPageDetailsId,
          payload: {
            columns: [
              {
                label: "Receipt ID",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "document.docId",
                showOnAndroid: true,
              },
              {
                label: "Receipt Record State",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "displayStatus",
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
                fn: "AUTOCOMPLETE_DOC_ID",
                label: "PO #",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po-number",
                sourcePath: [
                  "formInput.receive-po-kzqkr5yl",
                ],
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
                fn: "PO_SUPPLIER_NAME_IN_RECEIVABLE",
                label: "Supplier",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po-suppliers-in-receiving",
                sourcePath: [
                  "formInput.select-po-krowk9h4",
                  "formInput.purchase-order-number-khf4czb2",
                  "formInput.receive-po-kzqkr5yl",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PART_NUMBER_REV_FROM_RECEIVABLE",
                label: "Part Number/Rev",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.part_number_rev",
                sourcePath: [
                  "formInput.cs-part-number-khf48ow3",
                  "formInput.receive-po-kzqkr5yl",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PO_STATUS_IN_RECEIVABLE",
                label: "PO Status",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po-status-in-receiving",
                sourcePath: [
                  "formInput.select-po-krowk9h4",
                  "formInput.purchase-order-number-khf4czb2",
                  "formInput.receive-po-kzqkr5yl",
                ],
                showOnAndroid: true,
              },
            ],
          },
          employeeId: adminEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    it("[API] Create draft receivable", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          name: "",
          description: "",
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
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: {
            id: receivableForm.id,
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

    it("[API] Login second user", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      }).then((response) => {
        secondUserLogin = response;
        done();
      });
    });

    it("[API] Create released receivable", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          name: "",
          description: "",
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
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
          formDocument: {
            id: receivableForm.id,
          },
          formInput: {
            "receive-po-kzqkr5yl": { id: createdPODocument3.id },
            "fb-approvals-fb-approvals-kzqkpxqm": [],
          },
        },
        employeeId: secondEmployee.id,
        sessionId: secondUserLogin.sessionId,
      }).then((response) => {
        releasedRec = response;
        cy.drAPIApproveAndRelease({
          documentId: releasedRec.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
          },
          employeeId: secondEmployee.id,
          sessionId: secondUserLogin.sessionId,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("Verify Receiving landing page", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to Receivable landing page", () => {
      cy.navigToReceivableList();
    });

    it("Verify landing page table is using Kendo grid", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    context("Verify all columns are present", () => {
      COLUMN_HEADERS.forEach( (columnHeader, i) => {
        it(`Verify column '${columnHeader}' is present`, () => {
          cy.get(`th[role="columnheader"]`).eq(i).should("have.text", columnHeader);
        });
      });
    });

    context("Verify filter on each column", () => {
      [
        {
          header: COLUMN_HEADERS[0],
          index: 1,
          searchTerm: "RC-00006",
          expectedDocId: "RC-00006",
        },
        // State uses dropdown, it's tested separately
        {
          header: COLUMN_HEADERS[2],
          index: 3,
          searchTerm: USERS[2].name,
          expectedDocId: "RC-00006",
        },
        {
          header: COLUMN_HEADERS[3],
          index: 4,
          searchTerm: "POT-00003",
          expectedDocId: "RC-00006",
        },
        // Released date uses dropdown, it's tested separately
        {
          header: COLUMN_HEADERS[5],
          index: 6,
          searchTerm: "API Supplier document 2",
          expectedDocId: "RC-00005",
        },
        {
          header: COLUMN_HEADERS[6],
          index: 7,
          searchTerm: "PRT-00007 - 1",
          expectedDocId: "RC-00006",
        },
        {
          header: COLUMN_HEADERS[7],
          index: 8,
          searchTerm: "Closed",
          expectedDocId: "RC-00006",
        },
      ].forEach((params) => {
        it(`Verify filter for ${params.header}`, () => {
          cy.dlClearFilters();
          cy.get(`th[aria-colindex="${params.index}"] input`).should("have.attr", "value", "");
          cy.get(`th[aria-colindex="${params.index}"] input`).arrowType(params.searchTerm);
          cy.get(`th[aria-colindex="${params.index}"] input`).should("have.attr", "value", params.searchTerm);
          cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
          cy.get("tr.k-master-row").first().find("td").eq(0).should( (cell) => {
            expect(cell).to.contain(params.expectedDocId);
          } );
        });
      });

      // State uses dropdown, so different commands are used
      it("Verify filter for State", () => {
        cy.dlClearFilters();
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="2"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("WIP").arrowClick();
        cy.get(`th[aria-colindex="2"] span.k-input`).should("have.text", "WIP");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get("tr.k-master-row").first().find("td").eq(0).should( (cell) => {
          expect(cell).to.contain("RC-00005");
        } );
        cy.dlClearFilters();
      });

      // Released at uses dropdown, so different commands are used
      it("Verify filter for Released At", () => {
        cy.dlClearFilters();
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="5"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("Last 7 days").arrowClick();
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "Last 7 days");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get("tr.k-master-row").first().find("td").eq(0).should( (cell) => {
          expect(cell).to.contain("RC-00006");
        } );
        cy.dlClearFilters();
      });
    });

    context("Verify sort for each column", () => {
      COLUMN_HEADERS.forEach( (columnHeader, i) => {
        context(`Sort '${columnHeader}'`, () => {
          const columnHeaderRegex = new RegExp("^" + columnHeader + "$", "g");

          it(`${columnHeader} should be in ascending order`, () => {
            cy.contains(columnHeaderRegex).eq(0).arrowClick({ force: true });
            cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-asc-sm")
              .should("be.exist");
            cy.wait(200);
            cy.verifyAscSort({ index: i, colLength: 8 });
          });

          it(`${columnHeader} should be in descending order`, () => {
            cy.contains(columnHeaderRegex).eq(0).arrowClick({ force: true });
            cy.contains(columnHeaderRegex).eq(0).parent().find("span.k-i-sort-desc-sm")
              .should("be.exist");
            cy.wait(200);
            cy.verifyDesSort({ index: i, colLength: 8 });
          });
        });
      });
    });

    it(`Verify buttons "Clear Filter" and "Export List" are present`, () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
    });
  });

  context("Create receiving document", () => {
    it("Create Receiving Record", () => {
      cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick();
    });

    it("Select 'Receivable test' as document type", () => {
      cy.get("#MultipleFormTemplate-selectDocForm input[type='text']").arrowClick({ force: true })
        .autocompleteSelect("Receivable test");
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Search for API PO document and select it", () => {
      cy.get("[data-cy='porec-receive-po-kzqkr5yl']").autocompleteSelect("PO for receiving" );
    });

    it("Verify requester is present on receivable", () => {
      cy.get("input[data-cy^=\"po-requestor-autocomplete\"]")
        .should("have.attr", "value", `${USERS[1].name} - ${USERS[1].email}`);
    });

    it("Verify supplier is present on receivable", () => {
      cy.get("input[data-cy^=\"po-supplier-built-in\"]")
        .should("have.attr", "value", "SUP-00002 - rev 1 - API Supplier Document 2");
    });

    it("Verify PO table is present on receivable", () => {
      cy.get("div[name=\"po-items-built-in\"]>table").should("exist");
    });

    it("Save receivable", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Verify PART NUMBER/REV when RELEASED", () => {
    it("Navigate to Receivable landing page", () => {
      cy.navigToReceivableList();
    });

    it("Filter RECEIPT ID column", () => {
      cy.get(`th[aria-colindex="1"] input`).arrowType("RC-00005");
    });

    it("Filter RECEIPT ID column", () => {
      cy.get(`th[aria-colindex="7"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="7"] input`).arrowType("PRT-00005 - 1");
    });

    it("Verify value of PART NUMBER/REV value", () => {
      cy.get("td[role=gridcell][data-grid-col-index='6']").eq(0).should("have.text", "PRT-00005 - 1");
    });

    it("Navigate to created one", () => {
      cy.dlSelectFirstDocument();
    });

    it("Turn off auto save", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Add an Approval", () => {
      cy.get(`[name^="fb-approvals-fb-approvals"]`).arrowClick().wait(500);
      cy.get(`[name^="fb-approvals-fb-approvals"]`)
        .autocompleteSelect(USERS[1].email);
      cy.unClick();
    });

    it("Save PO", () => {
      cy.drSaveDocumentWithoutaudit();
    });

    it("Click 'Submit for Approval' button", () => {
      cy.pmSubmitForApproval();
    });

    it("Click 'Approve' button", () => {
      cy.ebApprove();
    });
  });

  context("Verify PART NUMBER/REV when REVISED", () => {
    it("Navigate to Receivable landing page", () => {
      cy.navigToReceivableList();
    });

    it("Verify value of PART NUMBER/REV value", () => {
      cy.get("tr[data-grid-row-index=\"0\"]").should("contain", "PRT-00005 - 1");
    });

    it("Navigate to created one", () => {
      cy.dlSelectFirstDocument();
    });

    it("Revise RC", () => {
      cy.drClickReviseDocument();
    });

    it("Navigate to Receivable landing page", () => {
      cy.navigToReceivableList();
    });

    it("Verify value of PART NUMBER/REV value", () => {
      cy.get("tr[data-grid-row-index=\"0\"]").should("contain", "PRT-00005 - 1");
    });

    it("Verify export button exists", () => {
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
    });
  });

  context("Verify PART NUMBER/REV when Released new one", () => {
    it("Clear filters", () => {
      cy.dlClearFilters();
    });

    it("Filter RCT-00001", () => {
      cy.get(`th[aria-colindex="1"] input`).arrowType("RCT-00001");
    });

    it("Open first one in the list", () => {
      cy.dlSelectFirstDocument();
    });

    it("Add an Approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Click 'Submit for Approval' button", () => {
      cy.pmSubmitForApproval();
    });

    it("Click 'Approve' button", () => {
      cy.ebApprove();
    });

    it("Navigate to Receivable landing page", () => {
      cy.navigToReceivableList();
    });

    it("Verify value of PART NUMBER/REV value", () => {
      cy.get(`th[aria-colindex="2"] span.k-input`).arrowClick();
      cy.get("ul>li[role=option]").contains("Released").arrowClick();
      cy.get("td[role=gridcell][data-grid-col-index='6']").eq(0).should("have.text", "PRT-00005 - 1");
    });

    it("Clear filters & Verify export button exists", () => {
      cy.dlClearFilters();
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
    });
  });
});

export { };

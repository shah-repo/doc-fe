// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { LotsTest } from "../../utils/constants/documentTypes/lot";
import { Part } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { ReceivableTest } from "../../utils/constants/documentTypes/receivable";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];

let createdCompany;
let loginResponse;
let adminEmployeeLoginResponse;
let adminEmployee;
let purchaseOrderDocumentType;
let formDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdPOFormDocument;
let CSLDocumentType;
let group;
let createdRecivableFormDocument;
let receivableDocumentType;
let supplierDocumentType;
let createdSupplierFormDocument;
let createdSupplierDocument;
let partDocumentType;
let createdPartDocument;
let createdPartDocument2;
let createdLotsFormDocument;
let createdRecivableDocument;
let createdPODocument;
let receivePageDetailsId;
let secondEmployee;
let loginResponseSecondTester;
let createdPODocument2;

const PART_DOCUMENT_TYPE_NAME = "Part";
const SupplierFormTitle = "Supplier form";
const todaysDate = moment().tz("America/Los_Angeles");
const todaysDateFormated = moment().tz("America/Los_Angeles").format("L");

context("Receiving landing page test", () => {
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
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ADMIN_USER.email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER],
            documentTypes: [
              Part,
              PurchaseOrderTest,
              LotsTest,
              ReceivableTest,
            ],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === SECOND_USER.email);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          receivableDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable test");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          CSLDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Lots test");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PART_DOCUMENT_TYPE_NAME);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: SECOND_USER.email,
      }).then((response) => {
        loginResponseSecondTester = response;
        done();
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

    it("[API]Create PO2", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>PO for receiving2</p>",
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
              secondEmployee.id,
            ],
            "po-status-built-in": "Closed",
            "po-requestor-autocomplete": secondEmployee.id,
            "po-order-date": todaysDate,
            "po-supplier-built-in": createdSupplierDocument.id,
          },
        },
        employeeId: secondEmployee.id as unknown as string,
        sessionId: loginResponseSecondTester.sessionId as unknown as string,
      }).then((response) => {
        createdPODocument2 = response;
        cy.drAPIApproveAndRelease({
          documentId: createdPODocument2.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
          },
          employeeId: secondEmployee.id,
          sessionId: loginResponseSecondTester.sessionId,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Create Receiving form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Document form for Receivable</p>",
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
              name: "receivable-test",
              applicableOn: ["ON_STATE_TO_IN_REVIEW"],
            },
            {
              label: "form.builder.approvals",
              tabId: "overview",
              type: "poapprovals",
              deleteDisabled: false,
              name: "fb-po-approvals",
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
          done();
        });
      });
    });

    it("[API]Create Receiving", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          name: "",
          description: "",
          document: {
            docId: "RCT-00001",
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
            id: createdRecivableFormDocument.id,
          },
          formInput: {
            "fb-po-approvals": [ adminEmployee.id ],
            "receivable-test": {
              id: createdPODocument.id,
            },
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdRecivableDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdRecivableDocument.id,
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

    it("[API]Create Receiving 2", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          name: "",
          description: "",
          document: {
            docId: "RCT-00002",
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
            id: createdRecivableFormDocument.id,
          },
          formInput: {
            "fb-po-approvals": [ secondEmployee.id ],
            "receivable-test": {
              id: createdPODocument2.id,
            },
          },
        },
        employeeId: secondEmployee.id as unknown as string,
        sessionId: loginResponseSecondTester.sessionId as unknown as string,
      }).then((response) => {
        createdRecivableDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdRecivableDocument.id,
          payload: {
            effectiveDate: (new Date()).toISOString(),
            documentType: { id: approvalRequestDocumentType[0].id },
            formDocument: { id: initialArDocument[0].id },
            approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
          },
          employeeId: secondEmployee.id,
          sessionId: loginResponseSecondTester.sessionId,
        }).then(() => {
          done();
        });
      });
    });

    it("[API]Patch page details", (done: any) => {
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
          receivePageDetailsId = response.body[0].id;
        }
      }).then(() => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/page_details/*" }).as("response");
        cy.cmpUpdatePageDetails({
          id: receivePageDetailsId,
          payload: {
            columns: [
              {
                label: "RECEIPT ID",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "document.docId",
                showOnAndroid: true,
              },
              {
                label: "RECEIPT RECORD STATE",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "displayStatus",
                showOnAndroid: true,
              },
              {
                label: "OWNER",
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
                valuePath: "precalc.po-docId-in-receiving",
                sourcePath: [
                  `formInput.receivable-test`,
                ],
                showOnAndroid: true,
              },
              {
                label: "RELEASED DATE",
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
                  `formInput.receivable-test`,
                ],
                showOnAndroid: true,
              },
              {
                fn: "PART_NUMBER_REV_FROM_RECEIVABLE",
                label: "PART NUMBER/REV",
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.part_number_rev",
                sourcePath: [
                  `formInput.receivable-test`,
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
                  `formInput.receivable-test`,
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Verify Receiving landing page", () => {
    it("Navigate to Receivings landing page", () => {
      cy.navigToReceivableList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify landing page table is using Kendo grid", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    it("Verify all columns are present", () => {
      SystemRequirement("REQ-1680");
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", "RECEIPT ID");
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", "RECEIPT RECORD STATE");
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", "OWNER");
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", "PO #");
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", "RELEASED DATE");
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", "SUPPLIER");
      cy.get(`th[role="columnheader"]`).eq(6).should("have.text", "PART NUMBER/REV");
      cy.get(`th[role="columnheader"]`).eq(7).should("have.text", "PO STATUS");
    });

    it(`Verify buttons "Clear Filter", "Export List" and "Add New Receiving" are present`, () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
      cy.get(`button[id="DocumentByTypeListPresenter-openDocRev"]`)
        .should("exist")
        .and("have.text", "Add new Receiving");
    });

    it(`Verify drag and drop RECEIPT ID header on second slot`, () => {
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "RCT-");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="1"][role]>span>span`,
        toSelector: `th[aria-colindex="2"][role]>span>span`,
      });
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("not.contain.text", "RCT-");
    });

    it(`Column grouping should be displayed`, () => {
      cy.get(`th[aria-colindex="3"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column");
      cy.unClick();
    });

    it(`Verify grouping`, () => {
      cy.get("tr.k-grouping-row").should("not.exist");
      cy.get(`th[aria-colindex="3"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("tr.k-grouping-row").should("have.length", "2");
      cy.get(`div.k-group-indicator>a>span`).eq(1).arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get("tr.k-grouping-row").should("not.exist");
    });

    it(`Verify receiving can be opened`, () => {
      cy.get("[data-cy=\"HeaderInfo-docId\"]").should("not.exist");
      cy.dlSelectFirstDocument();
      cy.get("[data-cy=\"HeaderInfo-docId\"]").should("exist");
      cy.navigToReceivableList();
      cy.get("div[role=dialog]").should("not.exist");
    });

    it(`Verify receiving record count`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get("tr.k-master-row").should("have.length", 2);
    });

    context("Verify filters on each field", () => {
      it("Verify filter for RECEIPT RECORD STATE", () => {
        cy.get(`th[aria-colindex="1"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="1"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("Released").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="1"] span.k-input`).should("have.text", "Released");
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      });

      it("Verify filter for RECEIPT ID", () => {
        cy.get(`th[aria-colindex="2"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="2"] input`).arrowType("RCT-00002");
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="2"] input`).should("have.attr", "value", "RCT-00002");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for OWNER", () => {
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="3"] input`).arrowType("Athena Block");
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "Athena Block");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for PO #", () => {
        cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="4"] input`).arrowType("POT-00002").wait(500);
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "POT-00002");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for RELEASED DATE", () => {
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="5"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("Last 7 days").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "Last 7 days");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for SUPPLIER", () => {
        cy.get(`th[aria-colindex="6"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="6"] input`).arrowType("API Supplier Document");
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="6"] input`).should("have.attr", "value", "API Supplier Document");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for PART NUMBER/REV", () => {
        cy.get(`th[aria-colindex="7"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="7"] input`).arrowType("PRT-00005");
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="7"] input`).should("have.attr", "value", "PRT-00005");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Verify filter for PO STATUS", () => {
        cy.get(`th[aria-colindex="8"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="8"] input`).arrowType("Closed");
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="8"] input`).should("have.attr", "value", "Closed");
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      });

      it("Navigate away from receiving landing page and come back to verify filters are intact", () => {
        cy.navigToDashboard();
        cy.navigToReceivableList();
        cy.get(`th[aria-colindex="1"] span.k-input`).should("have.text", "Released");
        cy.get(`th[aria-colindex="2"] input`).should("have.attr", "value", "RCT-00002");
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "Athena Block");
        cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "POT-00002");
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "Last 7 days");
        cy.get(`th[aria-colindex="6"] input`).should("have.attr", "value", "API Supplier Document");
        cy.get(`th[aria-colindex="7"] input`).should("have.attr", "value", "PRT-00005");
        cy.get(`th[aria-colindex="8"] input`).should("have.attr", "value", "Closed");
      });

      it("Verify clear filters", () => {
        cy.trClearFilters();
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="1"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="2"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "All");
        cy.get(`th[aria-colindex="6"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="7"] input`).should("have.attr", "value", "");
        cy.get(`th[aria-colindex="8"] input`).should("have.attr", "value", "");
      });
    });

    context("Verify hide and freeze", () => {
      it("Verify hide on PO #", () => {
        cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", "PO #");
        cy.get(`th[aria-colindex="4"] span.k-icon`).eq(0).arrowClick();
        cy.get("div.k-columnmenu-item ").contains("Hide Column").arrowClick();
        cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", "PO #");
      });

      it("Verify unhide on PO #", () => {
        cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", "PO #");
        cy.get(`button[data-cy="manageColumnsBtn"]`).arrowClick();
        cy.get("ul>li[role=menuitem]").contains("PO #").parents("li").find("svg").arrowClick();
        cy.get("body").type("{esc}");
        cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", "PO #");
      });

      it("Verify freeze on PO #", () => {
        cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", "PO #");
        cy.get(`th[aria-colindex="4"] span.k-icon`).eq(0).arrowClick();
        cy.get("div.k-columnmenu-item ").contains("Freeze Column").arrowClick();
        cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", "PO #");
      });

      it("Verify un-freeze on PO #", () => {
        cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", "PO #");
        cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
        cy.get("div.k-columnmenu-item ").contains("Unfreeze Column").arrowClick();
        cy.get(`th[aria-colindex="1"] span.k-column-title`).should("not.have.text", "PO #");
      });
    });


    context("Verify dropdown filters", () => {
      it("Verify RECEIPT ID dropdown filters", () => {
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").should("have.text", "ContainsDoes not containIs equal toIs not equal to" +
        "Starts withEnds withIs nullIs not nullIs emptyIs not empty");
      });

      it(`Verify RECEIPT ID "Does not contain" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get("ul>li[role=option]").contains("Does not contain").arrowClick();
        cy.get(`th[aria-colindex="3"] input`).arrowType("2");
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify RECEIPT ID "Is equal to" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is equal to").arrowClick();
        cy.get(`th[aria-colindex="3"] input`).arrowType("RCT-00002");
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify RECEIPT ID "Is not equal to" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is not equal to").arrowClick();
        cy.get(`th[aria-colindex="3"] input`).arrowType("RCT-00002");
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify RECEIPT ID "Starts with" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Starts with").arrowClick();
        cy.get(`th[aria-colindex="3"] input`).arrowType("RCT-0000");
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify RECEIPT ID "Ends with" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Ends with").arrowClick();
        cy.get(`th[aria-colindex="3"] input`).arrowType("2");
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify RECEIPT ID "Is null" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is null").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify RECEIPT ID "Is not null" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is not null").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });


      it(`Verify RECEIPT ID "Is empty" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is empty").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });

      it(`Verify RECEIPT ID "Is not empty" dropdown filter`, () => {
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="3"] span.k-select`).arrowClick();
        cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
        cy.get(`th[aria-colindex="3"] span.k-i-filter-clear`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });
    });

    context("Verify select field filter", () => {
      it(`Verify filter is disabled on default select field`, () => {
        cy.get(`th[aria-colindex="5"] button[title="Clear"]`).should("have.attr", "disabled");
        cy.get(`th[aria-colindex="5"] span.k-input`).arrowClick();
        cy.get("ul>li[role=option]").contains("Last 7 days").arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
        cy.get(`th[aria-colindex="5"] span.k-input`).should("have.text", "Last 7 days");
        cy.get(`th[aria-colindex="5"] button[title="Clear"]`).should("not.have.attr", "disabled");
        cy.get(`th[aria-colindex="5"] button[title="Clear"]`).arrowClick();
        cy.landingPageLoadingElementShouldNotExist();
      });
    });
  });
});

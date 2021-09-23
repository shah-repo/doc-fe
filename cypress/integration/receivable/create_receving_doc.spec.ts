// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { PurchaseOrderItem } from "../../support/commands/purchase.order/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];

let createdCompany;
let loginResponse;
let adminEmployeeLoginResponse;
let multipleCompanies;
let adminEmployee;
let purchaseOrderDocumentType;
let formDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let createdPOFormDocument;
let createdPODocument;
let group;
let createdRecivableFormDocument;
let receivableDocumentType;

context("Create receivable test", () => {
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
        adminEmployeeLoginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: ADMIN_USER.email,
            importerEmail: IMPORTER_USER.email,
            users: [FIRST_USER, SECOND_USER, THIRD_USER],
            documentTypes: [              {
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
            }],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          receivableDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
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
                  cy.poAPICreatePO({
                    payload: {
                      name: "",
                      attachments: [],
                      referenceTo: [],
                      formDocument: { id: createdPOFormDocument.id },
                      description: "API PO document 2",
                      revisionChangeType: RevisionChangeType.NextRevision,
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
                      formInput: {
                        "po-items-built-in": {
                          items: [{
                            id: "kdpr51z9",
                            type: "service",
                            date: (new Date()).toISOString(),
                            tax: false,
                            capitalEquipment: false,
                            isTraceabilityRequired: false,
                            description: "transporting products",
                            serviceId: "transportingID",
                            units: "hours",
                            order: 5,
                            glCode: "code 1",
                            unitPrice: 40,
                            received: 0,
                            totalAmount: "200.00",
                            formattedDate: (new Date()).toLocaleDateString("en-US"),
                            index: 0,
                          },
                          {
                            id: "kdpr51z8",
                            type: "service",
                            date: (new Date()).toISOString(),
                            tax: false,
                            capitalEquipment: false,
                            isTraceabilityRequired: false,
                            description: "office cleaning",
                            serviceId: "cleaningID",
                            units: "hours",
                            order: 6,
                            glCode: "code 1",
                            unitPrice: 30,
                            received: 0,
                            totalAmount: "180.00",
                            formattedDate: (new Date()).toLocaleDateString("en-US"),
                            index: 1,
                          }],
                          tax: "0.00",
                          subTotal: "380.00",
                          totalAmount: "380.00",
                          shippingCost: "0.00",
                          currency: "USD",
                          exchangeRate: 1,
                          totalInUSD: "380.00",
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
                              name: "receivable-kdptzei2",
                              applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                            },
                            {
                              index: 1,
                              type: "textfield",
                              name: "text-field-ke04ztn7",
                              rows: 1,
                              editorProperties: [],
                              label: "Text field",
                              placeholder: "Enter text",
                              applicableOn: [
                                "ON_STATE_TO_IN_REVIEW",
                              ],
                            },
                            {
                              label: "form.builder.approvals",
                              type: "poapprovals",
                              deleteDisabled: false,
                              name: "fb-po-approvals-kqqix31p",
                              uniqueSchemaItem: true,
                              index: 2,
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
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  context("Login user", () => {
    context("Login user when he doesn't have privileges", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: ADMIN_USER.email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });
    });
  });

  context("Create receivable", () => {
    context("Navigate to receivables list and click create", () => {
      it("Navigate to receivable list", () => {
        cy.navigToReceivableList();
      });

      it("Click create receivable", () => {
        cy.recCreateNew();
      });
    });

    context("Fill out receivable document form", () => {
      context("Check list of open PO-s", () => {
        it("Check there is two open PO-s available to select", () => {
          SystemRequirement("REQ-1790");
          cy.recCheckNumberOfAvailablePo({ numberOfOpenPOs: 2 });
        });
      });

      context("Check for search and selecting PO", () => {
        it("Search for API PO document and select it", () => {
          SystemRequirement("REQ-1800");
          cy.recSelectPo({ poTitle: "API PO document 2" });
        });
      });

      context("Check selected PO is loaded and displayed in receivable", () => {
        it("Verify PO 'API PO document 2' is displayed", () => {
          SystemRequirement("REQ-1810");
          const poItems: PurchaseOrderItem[] = [{
            index: 1,
            partNumber: "",
            descritpion: "",
            ordered: 5,
            received: 0,
            units: "hours",
            dateRequired: "",
            unitPrice: "$40.00",
          },
          {
            index: 2,
            partNumber: "",
            descritpion: "",
            ordered: 6,
            received: 0,
            units: "hours",
            dateRequired: "",
            unitPrice: "$30.00",
          }];
          cy.recVerifyPOIsDisplayed({ loadedPoItems: poItems });
        });
      });
      context("Check for if part numer/description received for items exists", () => {
        it("Check for part number/description", () => {
          SystemRequirement("REQ-1930");
          cy.get("[data-cy=serviceId]").eq(0).should("contain.text", "transportingID");
          cy.get("[data-cy=description]").eq(0).should("contain.text", "transporting products");
          cy.get("[data-cy=serviceId]").eq(1).should("contain.text", "cleaningID");
          cy.get("[data-cy=description]").eq(1).should("contain.text", "office cleaning");
        });
      });
      context("Verify receivable creation", () => {
        it("Verify adding attachments", () => {
          SystemRequirement("REQ-1980");
          cy.atchUploadAttachment({ fileName: "test.docx" });
        });

        it("Fill custom text field added in receivable form", () => {
          cy.get("input[type=textfield]").type("Custom field");
        });

        it("Click 'Create document' on receiving lading page", () => {
          SystemRequirement("REQ-1770");
          cy.recClickCreateDocumentWithApiCall();
        });

        it("Verify receivable status is 'WIP'", () => {
          SystemRequirement("REQ-1870");
          cy.drCheckDocumentStatus({ status: "WIP" });
        });

        it("Verify owner change", () => {
          SystemRequirement("REQ-1990");
          cy.drChangeOwnerFromMenu({ employee: SECOND_USER.name });
        });
      });

      context("Verify receivable can be created without selecting PO document", () => {
        it("Navigate to receiving", () => {
          cy.navigToReceivableList();
        });

        it("Click 'Add new receiving'", () => {
          cy.recCreateNew();
        });

        it("Add an Approval", () => {
          cy.get("[data-cy^=\"fb-po-approvals-\"]").click();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).click();
          });
        });

        it("Save PO", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Click 'Submit for Approval' button", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
            cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
          });
        });

        it("Click 'Approve' button", () => {
          SystemRequirement("REQ-1860");
          cy.get("[data-cy=\"form.builder.request.approve\"]").click();
          cy.get("input[name=\"password\"]").type("Tester1!");
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove,
            CyRoutes.EmployeesGet], () => {
            cy.get("[data-cy=\"common.confirm\"]").click();
          });
        });

        it("Verify receivable status is 'Current'", () => {
          cy.drCheckDocumentStatus({ status: "Current" });
        });
      });
    });
  });
});

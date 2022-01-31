import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let adminEmployeeLoginResponse;
let createdCompany;
let adminEmployee;
let purchaseOrderDocumentType;
let approvalRequestDocumentType;
let formDocumentType;
let supplierDocumentType;
let partDocumentType;
let loginResponse;
let group;
let initialArDocument;
let createdSupplierFormDocument;
let createdSupplierDocument;
let createdPartDocument;
let createdPOFormDocument;
let receivingName;
let receivePageDetailsId;
let receivingDocumentType;
let oldReceivingForm;

const receivingReleasedDate = moment().tz("America/Los_Angeles").format("M/D/YYYY");
const PART_DOCUMENT_TYPE_NAME = "Part";
const SupplierFormTitle = "Supplier form";

context("Receivable test with Page Details", () => {
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
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: PART_DOCUMENT_TYPE_NAME,
                documentTypeAcronym: "PRT-",
                group: "PART",
                isQms: true,
                needsSignature: true,
                category: "Parts",
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
                    label: "Close PO",
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
                  W: {
                    label: "Revision Stage",
                    visible: false,
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
                    label: "Released",
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
                    label: "Released",
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
                    optionPath: "/change_requests/available_approvers",
                    placeholder: "[Select requestor here]",
                    rulesObject: {},
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    optionLabelKey: "user.email",
                    optionValueKey: "id",
                    outputDisabled: false,
                    validationMode: "default",
                    formValuesRules: {},
                    editorProperties: [
                      "deleteDisabled",
                    ],
                    validationAttribute: "Requestor",
                    deleteInFormDisabled: true,
                    sampleItemsIndicator: {
                      id: "",
                      enabled: false,
                      serialNumber: 0,
                      sampleSection: false,
                    },
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
                    rulesObject: {},
                    applicableOn: [
                      "ON_STATE_TO_IN_REVIEW",
                    ],
                    deleteDisabled: false,
                    outputDisabled: false,
                    validationMode: "default",
                    formValuesRules: {},
                    editorProperties: [
                      "deleteDisabled",
                    ],
                    validationAttribute: "Order Date",
                    deleteInFormDisabled: true,
                    sampleItemsIndicator: {
                      id: "",
                      enabled: false,
                      serialNumber: 0,
                      sampleSection: false,
                    },
                    applicableValidationSchema: true,
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
              {
                documentTypeName: "Receivable test",
                documentTypeAcronym: "RCT-",
                group: "RECEIVABLE",
                category: "Receive",
                isQms: true,
                privateNumberPool: true,
                needsSignature: true,
                fieldsConfig: {
                  C: {
                    visible: false,
                    required: false,
                  },
                  D: {
                    visible: false,
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
                    label: "Update",
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
                  M: {
                    label: "Type of Revision Change",
                    visible: true,
                    required: true,
                  },
                  N: {
                    label: "Create Receving Record",
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
                    label: "Void",
                    visible: true,
                  },
                  A3: {
                    label: "History",
                    visible: true,
                  },
                  A4: {
                    label: "Released",
                    visible: true,
                  },
                  A5: {
                    label: "Pending Approval",
                    visible: true,
                  },
                  P1: {
                    label: "WIP",
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
                    label: "Released",
                    visible: true,
                  },
                  P5: {
                    label: "Pending Approval",
                    visible: true,
                  },
                },
              },
            ],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          receivingDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PART_DOCUMENT_TYPE_NAME);
          done();
        });
      });
    });

    it("[API]Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
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
                schema: [{
                }],
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

    it("[API]Create part document", (done: any) => {
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
  });

  context("Login and create PO", () => {
    context("Login user", () => {
      context("Login user when he doesn't have privileges", () => {
        it("Login user to dashboard", () => {
          cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
        });
      });
    });

    context("Create Purchase Order document with two Products", () => {
      it("Click on 'Purchase Order' on sidebar", () => {
        cy.navigToPurchaseOrder();
      });

      it("Click on 'Create PO' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
        });
      });

      it("Select 'Open' for PO status", () => {
        cy.poSelectPOStatus({ status: "Open" });
      });

      it("Select Requestor", () => {
        cy.get("[data-cy^=requestor]").arrowClick();
        cy.get("ul[role=listbox]>li").contains(USERS[1].name).arrowClick();
        cy.unClick();
      });

      it("Select PO order date", () => {
        cy.get("[name^=ordered]").parent().find("button").arrowClick();
        cy.get("button.MuiPickersDay-current").arrowClick();
      });

      it("Select 'SUP-00001' Supplier ", () => {
        cy.get("[data-cy=\"po-supplier-built-in\"]").arrowType("SUP-00001{downarrow}{enter}");
      });

      it("Enters description 'New Purchase Order Description'", () => {
        cy.drEnterDocumentDescription({ description: "New Purchase Order" });
      });

      context("Create first line item on PO", () => {
        it("Click on 'Add item' button", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
            cy.poAddNewFieldItem();
          });
        });

        it("Select Part Number", () => {
          cy.poSelectPartNumber({ partNo: "PRT-00005 - 1" });
        });

        it("Enter Quantity Ordered", () => {
          cy.poEnterQuantityOrdered({ quantity: "200" });
        });

        it("Select Units", () => {
          cy.poSelectUnits();
        });

        it("Enter Unit Price", () => {
          cy.poNumberOfUnits({ number: "5" });
        });

        it("Add Required Date", () => {
          cy.get("[name^=date]").parent().find("button").arrowClick();
          cy.get("button.MuiPickersDay-current").arrowClick();
        });

        it("Click on 'Add' inside PO dialog box", () => {
          cy.poAddPOButtonClick();
        });
      });

      context("Create second line item on PO", () => {
        it("Click on 'Add item' button", () => {
          cy.unClick();
          cy.poAddNewFieldItem();
        });

        it("Select Part Number", () => {
          cy.poSelectPartNumber({ partNo: "PRT-00006 - 1" });
        });

        it("Enter Quantity Ordered", () => {
          cy.poEnterQuantityOrdered({ quantity: "100" });
        });

        it("Select Units", () => {
          cy.poSelectUnits();
        });

        it("Enter Unit Price", () => {
          cy.poNumberOfUnits({ number: "11" });
        });

        it("Add Required Date", () => {
          cy.get("[name^=date]").parent().find("button").arrowClick();
          cy.get("button.MuiPickersDay-current").arrowClick();
        });

        it("Click on 'Add' inside PO dialog box", () => {
          cy.poAddPOButtonClick();
        });

        it("Add an Approval", () => {
          cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
        });

        it("Save PO", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });

        it("Click 'Submit for Approval' button", () => {
          cy.pmSubmitForApproval();
        });

        it("Click 'Approve' button", () => {
          cy.ebApprove();
        });
      });
    });
  });

  context("Create receiving form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Receivable Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Receivable Form" });
    });

    it("Enters description 'New Recivable description'", () => {
      cy.drEnterDocumentDescription({ description: "New Recivable description" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Click on 'Approval request' outputdocument type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Receivable test" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    context("Add Receivable field to form", () => {
      it("Click add new field", () => {
        cy.fbAddNewFieldWhenHidden();
      });

      it("Select Receive Purchase Order from given fields", () => {
        cy.fbSelectItemFromNewFieldList({ field: "Receive Purchase Order" });
      });

      it("Enter label Receive", () => {
        cy.fbEnterNameValue({ name: "label", value: "Receivable" });
      });

      it("Click add field", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
          cy.fbAddNewFieldButton();
        });
      });
    });

    context("Save and release form form", () => {
      it("Click create document", () => {
        cy.intercept({ method: "POST", pathname: "/api/v1/document_revisions" }, (req) => {
          req.reply((res) => {
            if (res.body !== "") {
              const response = res.body;
              receivingName = response.formTemplate.schema[1].name;
            }
          });
        }).as("response");
        cy.drClickCreateDocumentWithApiCall();
        cy.wait("@response", { requestTimeout: 20000, responseTimeout: 20000 });
      });

      it("Approve and release", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create receiving document", () => {
    it("Navigate to receiving", () => {
      cy.navigToReceivableList();
    });

    it("Create new record button click", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Receivable test' form", () => {
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Receivable test" });
    });

    it("Search for API PO document and select it", () => {
      cy.recSelectPo({ poTitle: "New Purchase Order" });
    });

    it("Verify requester is present on receivable", () => {
      cy.get("input[data-cy^=\"requestor\"]").should("have.attr", "value", `${USERS[1].name} - ${USERS[1].email}`);
    });

    it("Verify supplier is present on receivable", () => {
      cy.get("input[data-cy^=\"po-supplier-built-in\"]")
        .should("have.attr", "value", "SUP-00001 - rev 1 - API Supplier Document");
    });

    it("Verify PO table is present on receivable", () => {
      cy.get("div[name=\"po-items-built-in\"]>table").should("exist");
    });

    it("Save receivable", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Patch page details and verify receiving landing page", () => {
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
                valuePath: "precalc.po-docId-in-receiving",
                sourcePath: [
                  `formInput.${receivingName}`,
                  "formInput.receiving-ku6t73ty",
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
                  `formInput.${receivingName}`,
                  "formInput.receiving-ku6t73ty",
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
                  `formInput.${receivingName}`,
                  "formInput.receiving-ku6t73ty",
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
                  `formInput.${receivingName}`,
                  "formInput.receiving-ku6t73ty",
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

    it("Navig to receiving", () => {
      cy.wait(30 * 1000);
      cy.navigToReceivableList();
      cy.wrapWithWaitOnApiCalls([CyRoutes.SessionDetails], () => {
        cy.reload();
      });
      cy.get("[aria-label=\"precalc.po-docId-in-receiving\"]").should("have.text", "PO #");
    });

    it("Verify Receipt ID", () => {
      cy.get("div[aria-colindex=\"1\"]").should("have.text", "RCT-00001");
    });

    it("Verify Receipt Record State", () => {
      cy.get("div[aria-colindex=\"2\"]").should("have.text", "WIP");
    });

    it("Verify Owner", () => {
      cy.get("div[aria-colindex=\"3\"]").should("have.text", USERS[1].name);
    });

    it("Verify PO #", () => {
      cy.get("div[aria-colindex=\"4\"]").should("have.text", "POT-00001");
    });

    it("Verify Released Date", () => {
      cy.get("div[aria-colindex=\"5\"]").should("have.text", "");
    });

    it("Verify Supplier", () => {
      cy.get("div[aria-colindex=\"6\"]").should("have.text", "API Supplier Document");
    });

    it("Verify Part Number/Rev", () => {
      cy.get("div[aria-colindex=\"7\"]").should("have.text", "PRT-00005 - 1, PRT-00006 - 1");
    });

    it("Verify PO Status", () => {
      cy.get("div[aria-colindex=\"8\"]").should("have.text", "Open");
    });
  });

  context("Release Receiving", () => {
    it("Open receiving document", () => {
      cy.dlSelectFirstDocument();
    });

    it("Add approval", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].email });
    });

    it("Save receivable", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Submit for Approval", () => {
      cy.pmSubmitForApproval();
    });

    it("Approve receiving", () => {
      cy.ebApprove();
    });
  });

  context("Verify landing page after releasing receiving", () => {
    it("Navig to receiving", () => {
      cy.navigToReceivableList();
    });

    it("Verify Receipt ID", () => {
      cy.get("div[aria-colindex=\"1\"]").should("have.text", "RCT-00001");
    });

    it("Verify Receipt Record State", () => {
      cy.get("div[aria-colindex=\"2\"]").should("have.text", "Released");
    });

    it("Verify Owner", () => {
      cy.get("div[aria-colindex=\"3\"]").should("have.text", USERS[1].name);
    });

    it("Verify PO #", () => {
      cy.get("div[aria-colindex=\"4\"]").should("have.text", "POT-00001");
    });

    it("Verify Released Date", () => {
      cy.get("div[aria-colindex=\"5\"]").should("have.text", receivingReleasedDate);
    });

    it("Verify Supplier", () => {
      cy.get("div[aria-colindex=\"6\"]").should("have.text", "API Supplier Document");
    });

    it("Verify Part Number/Rev", () => {
      cy.get("div[aria-colindex=\"7\"]").should("have.text", "PRT-00005 - 1, PRT-00006 - 1");
    });

    it("Verify PO Status", () => {
      cy.get("div[aria-colindex=\"8\"]").should("have.text", "Open");
    });
  });

  context("Verify old receiving form", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Create new record button click", () => {
      cy.recCreateRecordFromLandingPage();
    });

    it("Select 'Receivable' form", () => {
      cy.recSelectRecordFormFromMultiSelect({ recordType: "Receivable" });
    });

    it("Search for API PO document and select it", () => {
      cy.get("input[data-cy^=\"porec-rece\"]").arrowType("New Purchase Order{downarrow}{enter}");
    });

    it("Verify requester is present on receivable", () => {
      cy.get("input[data-cy^=\"requestor\"]").should("have.attr", "value", `${USERS[1].name} - ${USERS[1].email}`);
    });

    it("Verify supplier is present on receivable", () => {
      cy.get("input[data-cy^=\"po-supplier-built-in\"]")
        .should("have.attr", "value", "SUP-00001 - rev 1 - API Supplier Document");
    });

    it("Verify PO table is present on receivable", () => {
      cy.get("div[name=\"po-items-built-in\"]>table").should("exist");
    });

    it("Save receivable", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });
});


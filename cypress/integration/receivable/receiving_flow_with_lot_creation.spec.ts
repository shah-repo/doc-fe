// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
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
let CSLDocumentType;
let group;
let createdRecivableFormDocument;
let receivableDocumentType;
let supplierDocumentType;
let createdSupplierFormDocument;
let createdSupplierDocument;
let partDocumentType;
let createdPartDocument;
let createdLotsFormDocument;

const PART_DOCUMENT_TYPE_NAME = "Part";
const SupplierFormTitle = "Supplier form";

context("Create receivable test with PO, Lot and Supplier", () => {
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
              {
                documentTypeName: "Lots test",
                documentTypeAcronym: "LTT-",
                group: "LOT",
                category: "Lot",
                isQms: true,
                privateNumberPool: true,
                needsSignature: true,
                fieldsConfig: {
                  D: {
                    label: "Description",
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
                    visible: true,
                  },
                  J: {
                    visible: false,
                  },
                  K: {
                    visible: false,
                  },
                  L: {
                    label: "Correction",
                    visible: true,
                  },
                  O: {
                    label: "Lot History",
                    visible: true,
                  },
                  R: {
                    visible: false,
                  },
                  A1: {
                    label: "WIP",
                    visible: true,
                  },
                  A2: {
                    label: "Rejected",
                    visible: true,
                  },
                  A3: {
                    visible: false,
                  },
                  A4: {
                    label: "Accepted",
                    visible: true,
                  },
                  A5: {
                    label: "Quarantine",
                    visible: true,
                  },
                  A6: {
                    visible: false,
                  },
                  P1: {
                    label: "WIP",
                    visible: true,
                  },
                  P2: {
                    label: "Rejected",
                    visible: true,
                  },
                  P3: {
                    visible: false,
                  },
                  P4: {
                    label: "Accepted",
                    visible: true,
                  },
                  P5: {
                    label: "Quarantine",
                    visible: true,
                  },
                  P6: {
                    visible: false,
                  },
                },
              },
            ],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          receivableDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable");
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
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
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
                      name: "receivable-kdptzei2",
                      applicableOn: ["ON_STATE_TO_IN_REVIEW"],
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

    it("Select 'SUP-00001' Supplier ", () => {
      cy.get("[data-cy=\"po-supplier-built-in\"]").type("SUP-00001{downarrow}{enter}");
    });

    it("Enters description 'New Purchase Order Description'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order Description" });
      cy.wait(1000);
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
        cy.poAddDateRequired();
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
        cy.poAddDateRequired();
      });

      it("Click on 'Add' inside PO dialog box", () => {
        cy.poAddPOButtonClick();
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
        cy.get("[data-cy=\"form.builder.request.approve\"]").click();
        cy.get("input[name=\"password\"]").type("Tester1!");
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.GetFieldLocks], () => {
          cy.get("[data-cy=\"common.confirm\"]").click();
        });
      });
    });
  });

  context("Create new Receivable document with PO line items", () => {
    it("Click on 'Receiving' on sidebar", () => {
      cy.navigToReceivableList();
    });

    it("Click 'Add new receiving'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevGet, CyRoutes.GetSpecificDocumentType], () => {
        cy.recCreateNew();
      });
    });

    it("Check for ID uniqueness - should be 'RC-00001'", () => {
      SystemRequirement("REQ-1890");
      cy.get("[id=HeaderInfo-docId]").should("have.text", "RC-00001");
    });

    it("Click on 'Receiving' on sidebar", () => {
      cy.navigToReceivableList();
    });

    it("Click 'Add new receiving'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevGet, CyRoutes.GetSpecificDocumentType], () => {
        cy.recCreateNew();
      });
      cy.wait(6000);
    });

    it("Check for ID uniqueness - should be 'RC-00002'", () => {
      SystemRequirement("REQ-1890");
      cy.get("[id=HeaderInfo-docId]").should("have.text", "RC-00002");
    });

    it("Select PO Receivable from dropdown for 'RC-00002'", () => {
      SystemRequirement("REQ-1830");
      cy.get("[data-cy*=\"porec-receivable-\"]").type("POT-00001{downarrow}{enter}");
    });

    it("Click on first line item", () => {
      cy.get("[data-cy='poItems']").eq(0).click();
    });

    it("Add quantity received", () => {
      SystemRequirement("REQ-1950");
      cy.get("[data-cy='received']").eq(2).type("75");
    });

    it("Click 'Save' button", () => {
      cy.get("[data-cy='form.builder.save']").click();
    });

    it("Click on first line item again", () => {
      cy.get("[data-cy='poItems']").eq(0).click();
    });

    it("Add different value to quantity received and check value will update and not create a new one", () => {
      SystemRequirement("REQ-1950", "REQ-3890");
      cy.get("[data-cy='received']").eq(2).clear().type("85");
    });

    it("Click 'Save' button", () => {
      cy.get("[data-cy='form.builder.save']").click();
    });

    it("Click on 'Receiving' on sidebar", () => {
      cy.navigToReceivableList();
    });

    it("Click on existing Receiving that was created before", () => {
      SystemRequirement("REQ-1900");
      cy.poClickOnSpecificPOFromList({ item: "RC-00001" });
    });

    it("Select PO Receivable from dropdown for 'RC-00001'", () => {
      SystemRequirement("REQ-1830");
      cy.get("[data-cy*=\"porec-receivable-\"]").type("POT-00001{downarrow}{enter}");
      cy.wait(3000);
    });
  });

  context("Check if supplier is automatically populated", () => {
    it("Check if supplier field is populated automatically", () => {
      SystemRequirement("REQ-1920");
      cy.wait(2000);
      cy.get("[data-cy=\"po-supplier-built-in\"]").should("contain.value", "SUP-00001 - rev 1 - API Supplier Document");
    });
  });

  context("Create a Lot for first line item", () => {
    it("Click 'Create a Lot' on first line item", () => {
      SystemRequirement("REQ-1820", "REQ-2010");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocumentType], () => {
        cy.get("tr>td>button").eq(0).click();
      });
    });

    it("Add 'Receipt Quantity'", () => {
      cy.get("[name='received']").type("20");
    });

    it("Select 'Lots test' document type", () => {
      cy.get("[data-cy='lotType']").type("Lots test{downarrow}{enter}");
      cy.wait(2000);
    });

    it("Select 'Lots form document' form", () => {
      cy.get("[data-cy='lotForm']").type("Lots form{downarrow}{enter}");
    });

    it("Click 'Create Lot' button", () => {
      cy.get("[data-cy='form.builder.po.create.lot']").click();
      cy.unClick();
    });
  });

  context("Check if reference to Lot is automatically generated", () => {
    it("Check reference for a Lot", () => {
      SystemRequirement("REQ-1940");
      cy.wait(2000);
      cy.get("[data-cy='common.referenced.by']")
        .should("contain.text", "A - PRT-00005 rev 1 - Part document, Received in RC-00001");
    });
  });

  context("Create a Lot for second line item", () => {
    it("Click 'Create a Lot' on second line item", () => {
      SystemRequirement("REQ-1820", "REQ-2010");
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocumentType], () => {
        cy.get("tr>td>button").eq(1).click();
      });
    });

    it("Add 'Receipt Quantity'", () => {
      cy.get("[name='received']").type("15");
    });

    it("Select 'Lots test' document type", () => {
      cy.get("[data-cy='lotType']").type("Lots test{downarrow}{enter}");
      cy.wait(2000);
    });

    it("Select 'Lots form document' form", () => {
      cy.get("[data-cy='lotForm']").type("Lots form{downarrow}{enter}");
    });

    it("Click 'Create Lot' button", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostReceivable], () => {
        cy.get("[data-cy='form.builder.po.create.lot']").click();
      });
    });
  });

  context("Enter Quantity received on line item and save it", () => {
    it("Click on first line item", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.DocRevPreview,
        CyRoutes.GetAutocompleteOptions,
        CyRoutes.GetReceivableQuantity], () => {
        cy.get("[data-cy='poItems']").eq(0).click();
      });
    });

    it("Add quantity received", () => {
      SystemRequirement("REQ-1950");
      cy.get("[data-cy='received']").eq(2).type("55");
    });

    it("Click 'Save' button", () => {
      cy.get("[data-cy='form.builder.save']").click();
      cy.wait(5000);
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
      cy.get("[data-cy=\"form.builder.request.approve\"]").click();
      cy.get("input[name=\"password\"]").type("Tester1!");
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove, CyRoutes.GetFieldLocks], () => {
        cy.get("[data-cy=\"common.confirm\"]").click();
      });
    });

    it("Click on update record", () => {
      SystemRequirement("REQ-2070");
      cy.recClickUpdateRecord();
    });

    it("Check for minor revision update", () => {
      SystemRequirement("REQ-2080");
      cy.get("[data-cy='DocumentRevisionList-item']").should("contain.text", "Revision").and("contain.text", "A.1");
    });
  });

  context("Navigate to PO and check for cumulative quantity received", () => {
    it("Navigate to PO", () => {
      cy.navigToPurchaseOrder();
    });

    it("Select PO that we use on the Recivable documents", () => {
      cy.poClickOnSpecificPOFromList({ item: "POT-00001" });
    });

    it("Check if cumulative quantity received value is '140'", () => {
      SystemRequirement("REQ-1840");
      cy.get("[data-cy='received'").should("contain.text", "140");
    });
  });

  context("Navigate to Lots to check references on Receiving Record and PO", () => {
    it("Navigate to Lots", () => {
      cy.navigToLots();
    });

    it("Select first Lot from the list", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.GetAutocompleteOptions], () => {
        cy.get(".MuiTableCell-root a:nth-child(1)").first().click();
      });
    });

    it("Check the references on a Lot document", () => {
      SystemRequirement("REQ-2020");
      cy.get("[data-cy='referenceTo']")
        .should("contain.text", "RC-00001 - A - ").and("contain.text", "POT-00001 - 1 - ");
    });
  });
});

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { LotsTest } from "../../utils/constants/documentTypes/lot";
import { Part } from "../../utils/constants/documentTypes/part";
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
              Part,
              LotsTest,
            ],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order");
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
                      name: "receivable-kdptzei2",
                      applicableOn: ["ON_STATE_TO_IN_REVIEW"],
                    },
                    {
                      label: "form.builder.approvals",
                      tabId: "overview",
                      type: "approvals",
                      deleteDisabled: false,
                      name: "fb-po-approvals-kqqix31p",
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
          });
        });
      });
    });
  });

  context("[API]Update document type", () => {
    it("Change fields config in BLC document type", () => {
      cy.drUpdateDocumentTypeName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        id: receivableDocumentType[0].id,
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

  context("Login user", () => {
    context("Login user when he doesn't have privileges", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
        cy.progressBarShouldNotExist();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });
  });


  context("Create Purchase Order document with two Products", () => {
    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrderWithoutApi();
      cy.cmpTurnOffAutosave();
    });

    it("Click on 'Create PO' button", () => {
      cy.poClickCreatePO();
    });

    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Select 'SUP-00001' Supplier ", () => {
      cy.get("[data-cy=\"po-supplier-built-in\"]").arrowClick({ force: true }).wait(500);
      cy.get("[data-cy=\"po-supplier-built-in\"]").arrowClick()
        .arrowType("SUP-00001 - rev 1 - API Supplier Document{downarrow}{enter}");
      cy.unClick();
    });

    it("Enters description 'New Purchase Order Description'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order Description" });
    });

    it("Click 'Save the document", () => {
      cy.recClickCreateDocumentWithApiCall();
    });

    context("Create first line item on PO", () => {
      it("Navigate to Lineitem tab", () => {
        cy.drSelectLineItems();
      });

      it("Click on 'Add item' button", () => {
        cy.poAddNewFieldItem();
        cy.listLoadingElementShouldNotExist();
        cy.progressBarShouldNotExist().wait(500);
      });

      it("Select Part Number", () => {
        cy.poSelectPartNumberNew({ partNo: "PRT-00005 - 1" });
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

      it("Save document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add an Approval", () => {
        cy.poAddApproverOnApproverList({ approver: USERS[1].name });
      });

      it("Save PO", () => {
        cy.drClickCreateDocumentWithApiCallForForms();
        cy.progressBarShouldNotExist().wait(1000);
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApprovalWithoutAPI();
      });

      it("Click 'Approve' button", () => {
        cy.poApproveWithoutApi();
      });
    });
  });

  context("Create new Receivable document with PO line items", () => {
    it("Click on 'Receiving' on sidebar", () => {
      cy.navigToReceivableList();
    });

    it("Click 'Add new receiving'", () => {
      cy.recCreateNew();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check for ID uniqueness - should be 'RC-00001'", () => {
      SystemRequirement("REQ-1890");
      cy.get("[data-cy=\"HeaderInfo-docId\"]").should("have.text", "RC-00001");
    });

    it("Click on 'Receiving' on sidebar", () => {
      cy.navigToReceivableList();
    });

    it("Click 'Add new receiving'", () => {
      cy.recCreateNew();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Check for ID uniqueness - should be 'RC-00002'", () => {
      SystemRequirement("REQ-1890");
      cy.get("[data-cy=\"HeaderInfo-docId\"]").should("have.text", "RC-00002");
    });

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
      cy.wait(2000);
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Select PO Receivable from dropdown for 'RC-00002'", () => {
      SystemRequirement("REQ-1830");
      cy.get("[data-cy*=\"porec-receivable-\"]").autocompleteSelect("PO-00001");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on first line item", () => {
      cy.get("[data-cy='poItems']").eq(0).arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add quantity received", () => {
      SystemRequirement("REQ-1950");
      cy.get("[data-cy='received']").eq(2).click();
      cy.get("[data-cy='received']").eq(2).arrowType("75");
    });

    it("Click 'Save' button", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
      cy.wait(3000);
    });

    it("Click on first line item again", () => {
      cy.get("[data-cy='poItems']").eq(0).arrowClick();
    });

    it("Add different value to quantity received and check value will update and not create a new one", () => {
      SystemRequirement("REQ-1950", "REQ-3890");
      cy.get("[data-cy='received']").eq(2).click();
      cy.get("[data-cy='received']").eq(2).clear().arrowType("85");
    });

    it("Click 'Save' button", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Receiving' on sidebar", () => {
      cy.navigToReceivableList();
    });

    it("Click on existing Receiving that was created before", () => {
      SystemRequirement("REQ-1900");
      cy.poClickOnSpecificPOFromList({ item: "RC-00001" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Select PO Receivable from dropdown for 'RC-00001'", () => {
      SystemRequirement("REQ-1830");
      cy.get("[data-cy*=\"porec-receivable-\"]").autocompleteSelect("PO-00001");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.drClickCreateDocumentWithoutApiCallForForms();
    });
  });

  context("Check if supplier is automatically populated", () => {
    it("Check if supplier field is populated automatically", () => {
      SystemRequirement("REQ-1920");
      cy.get("[data-cy=\"po-supplier-built-in\"]").should("contain.value", "SUP-00001 - rev 1 - API Supplier Document");
    });
  });

  context("Create a Lot for first line item", () => {
    it("Click 'Create a Lot' on first line item", () => {
      SystemRequirement("REQ-1820", "REQ-2010");
      cy.get("tr>td>button").eq(0).arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add 'Receipt Quantity'", () => {
      cy.get("[name='received']").arrowType("20");
    });

    it("Select 'Lots test' document type", () => {
      cy.get("[data-cy='lotType']").autocompleteSelect("Lots test");
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.wait(3000);
    });

    it("Select 'Lots form document' form", () => {
      cy.get("[data-cy='lotForm']").autocompleteSelect("Lots form");
    });

    it("Click 'Create Lot' button", () => {
      cy.get("[data-cy='form.builder.po.create.lot']").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
      cy.unClick();
    });
  });

  context("Check if reference to Lot is automatically generated", () => {
    it("Check reference for a Lot", () => {
      SystemRequirement("REQ-1940");
      cy.get("[data-cy='common.referenced.by']")
        .should("contain.text", "A - PRT-00005 rev 1 - Part document, Received in RC-00001");
    });
  });

  context("Create a Lot for second line item", () => {
    it("Click 'Create a Lot' on second line item", () => {
      SystemRequirement("REQ-1820", "REQ-2010");
      cy.get("tr>td>button").eq(1).arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Add 'Receipt Quantity'", () => {
      cy.get("[name='received']").arrowType("15");
    });

    it("Select 'Lots test' document type", () => {
      cy.get("[data-cy='lotType']").autocompleteSelect("Lots test");
    });

    it("Select 'Lots form document' form", () => {
      cy.get("[data-cy='lotForm']").autocompleteSelect("Lots form");
    });

    it("Click 'Create Lot' button", () => {
      cy.get("[data-cy='form.builder.po.create.lot']").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });
  });

  context("Enter Quantity received on line item and save it", () => {
    it("Click on first line item", () => {
      cy.get("tr[data-cy='poItems']").eq(0).arrowClick({ force: true }).wait(2000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Add quantity received", () => {
      SystemRequirement("REQ-1950");
      cy.get("[data-cy='received']").eq(2).arrowType("55").wait(500);
    });

    it("Click 'Save' button", () => {
      cy.get("[data-cy='form.builder.save']").arrowClick().wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click on 'overview' tab", () => {
      cy.drSelectOverviewTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(3000);
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^='fb-approvals-fb-po-approvals']").autocompleteSelect(USERS[1].name);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save PO", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Click on 'overview' tab", () => {
      cy.drSelectOverviewTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist().wait(1000);
    });

    it("Click 'Submit for Approval' button", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Click 'Approve' button", () => {
      cy.ebApproveWithoutApi();
    });

    it("Click on update record", () => {
      SystemRequirement("REQ-2070");
      cy.recClickUpdateRecord();
    });

    it("Navigate to Details tab again again", () => {
      cy.drSelectDetailsTab();
    });

    it("Check for minor revision update", () => {
      SystemRequirement("REQ-2080");
      cy.drClickRevisionsSidePanel();
      cy.get("[data-cy='DocumentRevisionList-item']").should("contain.text", "Revision").and("contain.text", "A.1");
    });
  });

  context("Navigate to PO and check for cumulative quantity received", () => {
    it("Navigate to PO", () => {
      cy.navigToPurchaseOrder();
    });

    it("Select PO that we use on the Recivable documents", () => {
      cy.poClickOnSpecificPOFromList({ item: "PO-00001" });
    });

    it("Open line items tab", () => {
      cy.drSelectLineItems();
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
      cy.get("tr.k-master-row").first().arrowClick();
    });

    it("Check the references on a Lot document", () => {
      SystemRequirement("REQ-2020");
      cy.get("[data-cy='referenceTo']").parent().parent().parent()
        .should("contain.text", "RC-00001 - A - ").and("contain.text", "PO-00001 - A - ");
    });
  });
});

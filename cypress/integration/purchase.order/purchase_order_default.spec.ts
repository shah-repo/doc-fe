/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { purchaseOrderDefaultSchema } from "../../fixtures/default_po_schema";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;
let supplierDocumentType;
let secondEmployee;
let group;
let formDocumentType;
let purchaseOrderDocumentType;
let createdPurchaseOrderFormDocument;
let approvalRequestDocumentType;
let initialArDocument;
let poCreationDate1;
let poCreationDate2;

context("PO test with default enlil form", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

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
          importerEmail: IMPORTER_USER.email,
          users: [USERS[2], USERS[3], USERS[4]],
          documentTypes: [
            {
              documentTypeName: "PO Part",
              documentTypeAcronym: "PRT-",
              group: "PART",
              category: "Parts",
              isQms: true,
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
          acctCodes: ["code 1", "code 2"],
          addresses: ["Address 1", "Address 2"],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCompany = response;
        secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
        supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
        formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
        purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
        approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
        done();
      });
    });
  });

  context("[API]Create supplier document", () => {
    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });

    it("[API]Creates suplier document for PO", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Test Supplier Document</p>",
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
            name: "API supplier",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });
  });

  context("[API]Create PO form", () => {
    it("[API] Create PO record form", (done: any) => {
      cy.arGetArDocumentByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        name: "AR Form",
      }).then((response) => {
        initialArDocument = response;
        cy.drCreateDocumentRevision({
          payload: {
            attachments: [],
            description: "<p>Purchase order form record</p>",
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
            name: "Purchase Order form",
            referenceTo: [],
            retrain: false,
            revisionChangeType: RevisionChangeType.NextRevision,
            revisionStage: 1,
            formTemplate: {
              outputDocumentTypes: [{
                id: purchaseOrderDocumentType[0].id,
              }],
              schema: purchaseOrderDefaultSchema,
            },

          },
          employeeId: secondEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdPurchaseOrderFormDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdPurchaseOrderFormDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
              approversWithSignatures: [{ approver: { id: secondEmployee.id } }],
            },
            employeeId: secondEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => done());
        });
      });
    });
  });

  context("Create Purchase order on default form", () => {
    context("Log user to company", () => {
      it("Logs user in", () => {
        cy.authLogin({
          email: USERS[1].email,
          password: "Tester1!",
        });
      });

      it("Selects company", () => {
        cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Create purchase order", () => {
      it("Click on 'Purchase Order' on sidebar", () => {
        cy.navigToPurchaseOrder();
      });

      it("Click on 'Create PO' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
          poCreationDate1 = moment().tz("America/Los_Angeles").format("MMMM D, YYYY hh:mm A");
          poCreationDate2 = moment().tz("America/Los_Angeles").add(1, "minutes").format("MMMM D, YYYY hh:mm A");
        });
      });

      context("Fill form fields", () => {
        it("Enter description 'New Purchase Order'", () => {
          cy.drEnterDocumentDescription({ description: "New Purchase Order" });
        });

        it("Check history entry", () => {
          SystemRequirement("REQ-1630");
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit], () => {
            cy.drSelectHistoryTab();
          });
          cy.wait(500);
          cy.get("div[data-cy=\"owner-0\"]").should("have.text", USERS[1].name);
          cy.get("time[data-cy=\"time-0\"]")
            .should("have.text", (poCreationDate1 || poCreationDate2));
        });

        it("Select 'Open' for PO status", () => {
          cy.poSelectPOStatus({ status: "Open" });
        });

        it(`Select '${USERS[1].name}' for Requestor`, () => {
          SystemRequirement("REQ-1300");
          cy.get("[data-cy^=requestor]").click();
          cy.get("ul[role=listbox]>li").contains(USERS[1].name).click();
        });

        it(`Select 'Quality' for Department`, () => {
          cy.get("div[id*=department]").click();
          cy.get("ul[role=listbox]>li").contains("Quality").click();
        });

        it("Select 'SUP-00003' Supplier ", () => {
          cy.get("[data-cy=\"po-supplier-built-in\"]").type("SUP-00003{downarrow}{enter}");
        });

        it("Select 'Customer Company' for Ship To", () => {
          cy.get("[name^=\"ship-to\"]").eq(0).click();
        });

        it("Select 'Address 2' for Company Ship To Address", () => {
          SystemRequirement("REQ-1300", "REQ-1250");
          cy.get("input[data-cy^=company-ship-to-address]").click();
          cy.get("ul[role=listbox]>li").contains("Address 2").click();
        });

        it("Select 'FedEx 449260805' for Shipping Information", () => {
          SystemRequirement("REQ-1250");
          cy.get("div[id*=select-shipping]").click();
          cy.get("ul[role=listbox]>li").contains("FedEx 449260805").click();
        });

        it("Select 'Credit Card' for Terms", () => {
          cy.get("div[id*=terms]").click();
          cy.get("ul[role=listbox]>li").contains("Credit Card").click();
        });

        it("Enter '1' for Quotation Number", () => {
          cy.get("input[name^=quotation-number]").typeFieldLock("1");
        });

        it("Select Order Date", () => {
          cy.get("input[name^=ordered]").parent().find("button").click();
          cy.wait(500);
          cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").last().click();
        });
      });

      context("Add purchase order item", () => {
        it("Click on 'Add item' button to add item without Part Number", () => {
          cy.get("[data-cy=\"fb-control-btn\"]").last().click();
        });

        it("Enter Quantity Ordered", () => {
          cy.poEnterQuantityOrdered({ quantity: "10" });
        });

        it("Select Units", () => {
          cy.poSelectUnits();
        });

        it("Select GL code", () => {
          SystemRequirement("REQ-1300", "REQ-1250");
          cy.poSelectGLCode();
        });

        it("Enter Supplier Part Number", () => {
          cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
        });

        it("Enter number of Units", () => {
          SystemRequirement("REQ-1250");
          cy.poNumberOfUnits({ number: "2" });
        });

        it("Add Required Date", () => {
          cy.get("input[name^=date]").parent().find("button").click();
          cy.wait(500);
          cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").last().click();
        });

        it("Check Tax box", () => {
          cy.poSelectTaxCheckbox();
        });

        it("Click on 'Add' inside PO dialog box", () => {
          cy.poAddPOButtonClick();
        });
      });

      context("Finish PO", () => {
        it("Enter 'Nothing to comment' inside PO dialog box", () => {
          cy.get("div[style=\"width: 100%; height: 100%;\"]").click();
          cy.get("div[contenteditable=true]").eq(1).type("Nothing to comment");
          cy.get("[data-cy=Comments]").click();
          cy.wait(300);
          cy.unClick();
        });

        it("Enter 'contact.us@gmail.com' inside Contact Email", () => {
          cy.get("[name^=contact-email]").typeFieldLock("contact.us@gmail.com");
        });

        it("Add an Approval", () => {
          cy.get("[data-cy^=\"fb-po-approvals-\"]").click();
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
            cy.get("ul[role=\"listbox\"]>li").contains(USERS[1].name).click();
          });
        });

        it("Save PO document", () => {
          cy.wrapWithWaitOnApiCalls(
            [CyRoutes.PatchDocRev], () => {
              cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
            });
          cy.checkToastMessage({ exists: false });
          cy.wait(2000);
        });

        it("Click 'Submit for Approval' button", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRevInReview], () => {
            cy.get("[data-cy=\"ApproveAndRelease-button\"]").click();
          });
        });

        it("Click 'Approve' button", () => {
          cy.get("[data-cy=\"form.builder.request.approve\"]").click();
          cy.get("input[name=\"password\"]").type("Tester1!");
          cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovalsApprove,
            CyRoutes.EmployeesGet, CyRoutes.GetFieldLocks], () => {
            cy.get("[data-cy=\"common.confirm\"]").click();
          });
        });
      });
    });
  });
});

export { };


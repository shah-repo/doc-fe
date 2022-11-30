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
import { POPart } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
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
            POPart,
            PurchaseOrderTest,
          ],
          acctCodes: ["code 1", "code 2"],
          addresses: ["Address 1", "Address 2"],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCompany = response;
        adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
        secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
        supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
        formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
        purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
        approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Change Order");
        done();
      });
    });
  });

  context("[API]Create supplier document", () => {
    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
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
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
      });
    });

    context("Create purchase order", () => {
      it("Click on 'Purchase Order' on sidebar", () => {
        cy.wait(1000);
        cy.navigToPurchaseOrder();
      });

      it("Click on 'Create PO' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
          poCreationDate1 = moment().tz("America/Los_Angeles").format("MMM D, YYYY hh:mm A");
          poCreationDate2 = moment().tz("America/Los_Angeles").add(1, "minutes").format("MMMM D, YYYY hh:mm A");
        });
      });

      context("Fill form fields", () => {
        it("Enter description 'New Purchase Order'", () => {
          cy.drEnterDocumentDescription({ description: "New Purchase Order" });
        });

        it("Check history entry", () => {
          SystemRequirement("REQ-1630");
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit], () => {
            cy.drSelectHistoryTab();
          });

          cy.get("[class^=\"MuiListItemText-root MuiListItemText-multiline\"]").eq(1).contains(USERS[1].name);
          cy.get("time[data-cy=\"audit-time-0\"]")
            .contains((poCreationDate1 || poCreationDate2));
        });

        it("Select 'Open' for PO status", () => {
          cy.poSelectPOStatus({ status: "Open" });
          cy.unClick();
        });

        it(`Select '${USERS[1].name}' for Requestor`, () => {
          cy.get("[data-cy^=\"po-requestor-\"]").arrowClick();
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        });

        it(`Select 'Quality' for Department`, () => {
          cy.get("div[id*=mui-component-select-department]").arrowClick();
          cy.get("ul>li[role=option]").contains("Quality").arrowClick();
        });

        it("Select 'SUP-00003' Supplier ", () => {
          cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect("SUP-00003");
        });

        it("Select 'Customer Company' for Ship To", () => {
          cy.get("[name^=\"ship-to\"]").eq(0).arrowClick();
        });

        it("Select 'Address 2' for Company Ship To Address", () => {
          SystemRequirement("REQ-1300", "REQ-1250");
          cy.get("input[data-cy^=company-ship-to-address]").arrowClick();
          cy.get("ul>li[role=option]").contains("Address 2").arrowClick();
        });

        it("Select 'FedEx 449260805' for Shipping Information", () => {
          SystemRequirement("REQ-1250");
          cy.get("div[id*=select-shipping]").arrowClick();
          cy.get("ul>li[role=option]").contains("FedEx 449260805").arrowClick();
        });

        it("Select 'Credit Card' for Terms", () => {
          cy.get("div[id*=terms]").arrowClick();
          cy.get("ul>li[role=option]").contains("Credit Card").arrowClick();
        });

        it("Enter '1' for Quotation Number", () => {
          cy.get("input[name^=quotation-number]").arrowType("1");
        });

        it("Select Order Date", () => {
          cy.get("input[name^=ordered]").parent().find("button").arrowClick();
          cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").last().arrowClick();
        });

        it("Save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      context("Add purchase order item", () => {
        it("navigate to Line Items", () => {
          cy.drSelectLineItems();
        });

        it("Click on 'Add item' button to add item without Part Number", () => {
          cy.poAddNewFieldItem();
        });

        it("Enter Quantity Ordered", () => {
          cy.poEnterQuantityOrdered({ quantity: "2" });
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
          cy.poNumberOfUnits({ number: "10" });
        });

        it("Add Required Date", () => {
          cy.get("input[name^=date]").parent().find("button").arrowClick();
          cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").last().arrowClick();
        });

        it("Check Tax box", () => {
          cy.poSelectTaxCheckbox();
        });

        it("Click on 'Add' inside PO dialog box", () => {
          cy.poAddPOButtonClick();
        });
      });

      context("Edit the added item and Verify values", () => {
        it("Click on added item", () => {
          cy.get("[data-cy=\"poItems\"]").eq(0).arrowClick();
        });

        it("Edit Unit Price", () => {
          cy.get("[name=\"unitPrice\"]").clear();
          cy.poNumberOfUnits({ number: "9.56" });
        });

        it("Close dialog box", () => {
          cy.get("[data-cy=\"dialog-close\"]").arrowClick();
        });

        it("Click Save button", () => {
          cy.poSaveDocument();
        });

        it("Verify unit price and sum of item", () => {
          cy.get("[data-cy=\"poItems\"]").eq(0).find("[data-cy=\"unitPrice\"]").should("have.text", "$10.00");
          cy.get("[data-cy=\"poSum\"]").eq(0).should("have.text", "$20.00");
        });

        it("Verify Sub Total, Tax & Total", () => {
          cy.poCheckAmount({ number: "$20.00" });
          cy.poCheckTax({ number: "1.850000" });
          cy.poCheckTotalAmount({ number: "$21.85" });
        });
      });

      context("Add one more item and verify values", () => {
        it("Click on 'Add item' button to add item", () => {
          cy.get("[data-cy=\"fb-control-btn\"]").last().arrowClick();
        });

        it("Click on 'Service' select option", () => {
          cy.poSelectOption({ optionName: "service" });
        });

        it("Enter ServiceID", () => {
          cy.poEnterServiceID({ serviceId: "SRV123" });
        });

        it("Enter Description", () => {
          cy.poEnterDescription({ description: "Description for SRV123" });
        });

        it("Enter Quantity Ordered", () => {
          cy.poEnterQuantityOrdered({ quantity: "6" });
        });

        it("Select Units", () => {
          cy.poSelectUnits();
        });

        it("Select GL code", () => {
          cy.poSelectGLCode();
        });

        it("Enter number of Units", () => {
          cy.poNumberOfUnits({ number: "5" });
        });

        it("Add Required Date", () => {
          cy.get("[name=\"date\"]").next().find("button").arrowClick();
          cy.get(".MuiPickersDay-daySelected").arrowClick();
        });

        it("Click on 'Add' inside PO dialog box", () => {
          cy.poAddPOButtonClick();
        });

        it("Verify unit price and sum of item", () => {
          cy.get("[data-cy=\"poItems\"]").eq(1).find("[data-cy=\"unitPrice\"]").should("have.text", "$5.00");
          cy.get("[data-cy=\"poSum\"]").eq(1).should("have.text", "$30.00");
        });

        it("Verify Sub Total, Tax & Total", () => {
          cy.poCheckAmount({ number: "$50.00" });
          cy.poCheckTax({ number: "1.850000" });
          cy.poCheckTotalAmount({ number: "$51.85" });
        });

        it("Save document", () => {
          cy.drClickCreateDocumentWithApiCallForForms();
        });
      });

      context("Finish PO", () => {
        it("navigate to Details tab", () => {
          cy.drSelectDetailsTab();
        });

        it("Enter 'Nothing to comment' inside PO dialog box", () => {
          cy.get("div[style=\"width: 100%; height: 100%;\"]").arrowClick();
          cy.get("div[contenteditable=true]").eq(1).arrowType("Nothing to comment");
          cy.get("[data-cy=Comments]").arrowClick();
          cy.unClick();
        });

        it("Enter 'contact.us@gmail.com' inside Contact Email", () => {
          cy.get("[name^=contact-email]").arrowType("contact.us@gmail.com");
        });

        it("Save PO document", () => {
          cy.wrapWithWaitOnApiCalls(
            [CyRoutes.PatchDocRev], () => {
              cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
            });
          cy.checkToastMessage({ exists: false });

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
});

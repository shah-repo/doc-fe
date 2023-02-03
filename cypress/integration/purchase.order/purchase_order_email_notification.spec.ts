/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { purchaseOrderDefaultSchema } from "../../fixtures/default_po_schema";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../support/commands/imap/commands";
import { IMAPEmail } from "../../support/commands/imap/imap";
import { CONFIG } from "../../support/config";
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
let emailsFromInbox: IMAPEmail[];
const dateAfterEmailShouldArrive = new Date();

context("Send PO Owner an email notification when a PO is approved", () => {
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
        approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
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

  context("Create Purchase Order", () => {
    context("Log user to company", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(5000);
      });

      it("Go to Purchase Order module", () => {
        cy.navigToPurchaseOrder();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click on 'Create PO' button", () => {
        cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      context("Fill out PO fields", () => {
        it("Enter description 'New Purchase Order'", () => {
          cy.drEnterDocumentDescription({ description: "New Purchase Order" });
        });

        it("Select 'Open' for PO status", () => {
          cy.poSelectPOStatus({ status: "Open" });
        });

        it(`Select '${USERS[1].name}' for Requestor`, () => {
          cy.get("[data-cy^=po-requestor]").arrowClick();
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        });

        it("Select 'SUP-00003' Supplier ", () => {
          cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect("SUP-00003");
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Select Order Date", () => {
          cy.get("input[name^=ordered]").parent().find("button").arrowClick();
          cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").last().arrowClick();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Clicks Save button", () => {
          cy.drClickCreateDocumentWithoutApiCall();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });

      context("Add purchase order item", () => {
        it("navigate to Line Items", () => {
          cy.drSelectLineItems();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Click on 'Add item' button to add item without Part Number", () => {
          cy.poAddNewFieldItem();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Enter Quantity Ordered", () => {
          cy.poEnterQuantityOrdered({ quantity: "2" });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Select Units", () => {
          cy.poSelectUnits();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Select GL code", () => {
          cy.poSelectGLCode();
        });

        it("Enter Supplier Part Number", () => {
          cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Enter number of Units", () => {
          cy.poNumberOfUnits({ number: "10" });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Add Required Date", () => {
          cy.get("input[name^=date]").parent().find("button").arrowClick();
          cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").last().arrowClick();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Check Tax box", () => {
          cy.poSelectTaxCheckbox();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Click on 'Add' inside PO dialog box", () => {
          cy.poAddPOButtonClick();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Clicks Save button", () => {
          cy.drClickCreateDocumentWithoutApiCall();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });
      });
    });
  });

  context("Submit PO for Approval", () => {
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
      cy.get("[data-cy^=\"fb-po-approvals-\"]").autocompleteSelect(USERS[2].name);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click 'Submit for Approval' button", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });
  });

  context("Login as approver", () => {
    it("Login user to dashboard", () => {
      cy.authLogout();
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: secondEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click approve for the Purchase Order", () => {
      cy.dashApproverFirstFromList();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Login as PO owner", () => {
    it("Login user to dashboard", () => {
      cy.authLogout();
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Dashboard shows that PO has been approved", () => {
      cy.contains(USERS[2].name).eq(0).parent().parent()
        .should("contain.text", "APPROVED")
        .and("contain.text", "POT-00001");
    });
  });

  context("Verify email for approved PO", () => {
    it("Verify emails", () => {
      const getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
        subject: `Purchase Order POT-00001 Approval Status`,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received", () => {
      SystemRequirement("REQ-5160");
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[1].email,
          contains: [
            `Hello <b>${USERS[1].name},</b><br /><br />`,
            "Purchase Order <b>POT-00001</b> has been approved and released for company",
            createdCompany.id,
          ],
        }];

      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });
});

export { };

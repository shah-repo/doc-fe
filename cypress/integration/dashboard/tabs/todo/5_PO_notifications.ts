// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../../../support/config";
import { IMPORTER_USER, USERS } from "../../../../utils/constants/users";
import { SystemRequirement } from "../../../../utils/context/systemRequirement";
import { PurchaseOrderTest } from "../../../../utils/constants/documentTypes/purchaseOrder";
import { RevisionChangeType } from "../../../../../src/state/ducks/documentRevisions/types";
import { purchaseOrderDefaultSchema } from "../../../../fixtures/default_po_schema";
import { cmpFilterDocumentTypeIdByName } from "../../../../support/commands/company/commands";
import { IMAPEmailsInTesting } from "../../../../support/commands/imap/commands";
import "moment-timezone";
import moment from "moment";
import { emailDateOffset } from "../../../../utils/constants/dateHandler";

const currentDate = moment().tz("America/Los_Angeles").format("MMM D, YYYY");

let createdCompany;
let loginResponse;
let group;
let adminEmployee;
let initialArDocument;
let createdPurchaseOrderFormDocument;
let purchaseOrderDocumentType;
let supplierDocumentType;
let formDocumentType;
let approvalRequestDocumentType;
let partDocumentType;
let createdPartDocument;
let getEmailSetting;
let dateAfterEmailShouldArrive;
let emailsFromInbox;
let poUrl;

context("PO notifications", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("[API] Prepare company", () => {
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
            users: [USERS[2]],
            documentTypes: [
              PurchaseOrderTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          done();
        });
      });
    });
  });

  context("[API] Create documents", () => {
    it("[API] Login as User 1", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API] Create part document", () => {
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
            });
          });
        });
      });
    });

    it("[API] Creates supplier document for PO", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
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
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then(() => {
          done();
        });
      });
    });

    it("[API] Create PO record form", (done: any) => {
      cy.arGetArDocumentByName({
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
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
            renderHTML: "<html><body><h1>Purchase order</h1></body></html>",
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
          employeeId: adminEmployee.id as unknown as string,
          sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdPurchaseOrderFormDocument = response;
          cy.drAPIApproveAndRelease({
            documentId: createdPurchaseOrderFormDocument.id,
            payload: {
              effectiveDate: (new Date()).toISOString(),
              documentType: { id: approvalRequestDocumentType[0].id },
              formDocument: { id: initialArDocument[0].id },
              approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
            },
            employeeId: adminEmployee.id,
            sessionId: loginResponse.sessionId,
          }).then(() => done());
        });
      });
    });
  });

  context("Login as User 1", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create Purchase Order", () => {
    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click on 'Create PO' button", () => {
      cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    context("Fill form fields", () => {
      it("Enter description 'New Purchase Order'", () => {
        cy.drEnterDocumentDescription({ description: "New Purchase Order" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Open' for PO status", () => {
        cy.poSelectPOStatus({ status: "Open" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Select User 2 as Requestor`, () => {
        cy.get("[data-cy^=po-requestor]").arrowClick();
        cy.get("[data-cy^=po-requestor]").autocompleteSelect(USERS[2].name);
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it(`Select 'Quality' for Department`, () => {
        cy.get("div[id*=department]").arrowClick();
        cy.get("ul>li[role=option]").contains("Quality").arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'SUP-00003' Supplier ", () => {
        cy.get("[data-cy='po-supplier-built-in']").arrowClick();
        cy.get("[data-cy='po-supplier-built-in']").autocompleteSelect("SUP-00003");
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Third party Company' for Ship To", () => {
        cy.get("[name^='ship-to']").eq(1).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Third party Company Address", () => {
        cy.get("input[data-cy^=third-party-company]").arrowClick();
        cy.get("input[data-cy^=third-party-company]").autocompleteSelect("API supplier");
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'FedEx 449260805' for Shipping Information", () => {
        cy.get(`[data-cy="Shipping Information"]`).scrollIntoView();
        cy.get("div[id*=select-shipping]").arrowClick();
        cy.get("ul>li[role=option]").contains("FedEx").arrowClick();
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Credit Card' for Terms", () => {
        cy.get("div[id*=terms]").arrowClick();
        cy.get("ul>li[role=option]").contains("Credit Card").arrowClick();
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter '1' for Quotation Number", () => {
        cy.get("input[name^=quotation-number]").arrowType("1");
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Order Date", () => {
        cy.get("input[name^=ordered]").parent().find("button").arrowClick();
        cy.get("button.MuiPickersDay-day[tabindex='0']").last().arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
      });

      it("Save PO", () => {
        cy.url().then((url) => (poUrl = url));
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Add purchase order item", () => {
      it("Open line items tab", () => {
        cy.drSelectLineItems();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Upload attachments", () => {
        cy.atchUploadAttachment({ fileName: "test_image.jpg" });
        cy.progressBarShouldNotExist();
        cy.wait(2000);
        cy.atchUploadAttachment({ fileName: "image.jpg" });
        cy.progressBarShouldNotExist();
        cy.wait(2000);
      });

      it("Click on 'Add item' button to add item without Part Number", () => {
        cy.get(`button[data-cy="fb-control-btn"]`).eq(0).arrowClick({ multiple: true, force: true }).wait(1000);
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter Quantity Ordered", () => {
        cy.poEnterQuantityOrdered({ quantity: "10" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Units", () => {
        cy.poSelectUnits();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select Part Number", () => {
        cy.poSelectPartNumber({ partNo: "PRT-00001 - 1" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter Supplier Part Number", () => {
        cy.poEnterSupplierPartNumber({ partNumber: "PRT-0004" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter number of Units", () => {
        cy.poNumberOfUnits({ number: "2" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Add Required Date", () => {
        cy.get("input[name^=date]").parent().find("button").arrowClick();
        cy.get(".MuiPickersDay-daySelected").arrowClick();
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

      it("Save PO", () => {
        cy.poSaveDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Finish PO", () => {
      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enter 'Nothing to comment' inside PO dialog box", () => {
        cy.get("div[style='width: 100%; height: 100%;']").arrowClick();
        cy.get("div[contenteditable=true]").eq(1).arrowType("Nothing to comment");
        cy.get("[data-cy=Comments]").arrowClick();
        cy.unClick();
        cy.progressBarShouldNotExist();
      });

      it("Enter 'contact.us@gmail.com' inside Contact Email", () => {
        cy.get("[name^=contact-email]").arrowType("contact.us@gmail.com");
        cy.unClick();
        cy.progressBarShouldNotExist();
      });

      it("Verify that User 2 is automatically added as the approver", () => {
        cy.get("[name^='fb-po-approvals-'] .MuiChip-root").contains(USERS[2].name)
          .should("exist");
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Save PO", () => {
        cy.poSaveDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click 'Submit for Approval' button", () => {
        dateAfterEmailShouldArrive = new Date(new Date().getTime() - emailDateOffset);
        cy.pmSubmitForApprovalInThreeDotsWithoutAPI();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("Login as User 2", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify User 2 receives an email that a PO has been sent for review and they are approvers", () => {
    it("Verify emails", () => {
      SystemRequirement("REQ-2140");
      getEmailSetting =  {
        to: CONFIG.TEST_EMAIL,
        after: dateAfterEmailShouldArrive,
      };

      cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).then((emails) => {
        emailsFromInbox = emails;
      });
    });

    it("Verify the emails that should be received", () => {
      const emailsThatShouldBeReceived: IMAPEmailsInTesting[] = [
        {
          sentToUser: USERS[2].email,
          contains: [
            `Hello <b>${USERS[2].name},</b><br/><br/>`,
            `Record <b>POT-00001</b> is in review and you are an approver.`,
          ],
        },
      ];

      cy.imapVerifyEmailsInList({
        receivedEmails: emailsFromInbox,
        emailsToTest: emailsThatShouldBeReceived,
        getEmailsSincedate: dateAfterEmailShouldArrive,
        assertNumberOfEmailsFoundInList: 1,
      });
    });
  });

  context("Verify tabs content", () => {
    it(`Verify PO line item contain icon, doc detail & datetime`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "POT-00001")
        .and("contain.text", "needs your approval for")
        .and("contain.text", USERS[1].name);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(1)
        .should("contain.text", currentDate);
    });

    it("Clicking on the arrow should show the PO details", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find("svg").eq(0).arrowClick();
      cy.dashVerifyListItemDetailsExistsOnDashboard({ listItem: `Supplier:API supplier` });
      cy.dashVerifyListItemDetailsExistsOnDashboard({ listItem: `Total:USD 21.85` });
      cy.dashVerifyListItemDetailsExistsOnDashboard({ listItem: `Description:New Purchase Order` });
      cy.dashVerifyListItemDetailsExistsOnDashboard({ listItem: `Line Items:1` });
      cy.dashVerifyListItemDetailsExistsOnDashboard({ listItem: `Attachments` });
      cy.dashVerifyListItemDetailsExistsOnDashboard({ listItem: `image.jpg` });
      cy.dashVerifyListItemDetailsExistsOnDashboard({ listItem: `test_image.jpg` });
    });

    it("Hovering PO line item should display buttons", () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("svg").should("have.length", 4);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy='transition-download-pdf']").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy='transition-approve']").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy='transition-reject']").should("exist");
    });

    it("Clicking on Download PDF should open the modal box for the PO PDF", () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy='transition-download-pdf']").first().trigger("mouseover");
      cy.get("[data-cy='download-pdf']").first().arrowClick();
      cy.progressBarShouldNotExist();
      cy.get("object[type='application/pdf']").should("exist");
      cy.get("[data-cy='dialog-close']").first().arrowClick();
    });

    it("Reject PO", () => {
      cy.get(`.MuiListItemText-root.MuiListItemText-dense`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-reject"]`).first().trigger("mouseover");
      cy.get(`[data-cy="transition-reject"]`).first().arrowClick();
      cy.get("[data-cy='PoRejectDialog-continueButton']").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
      cy.wait(3000);
    });

    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });
  });

  context("Login as User 1", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });

    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it(`User should see rejected PO notification from User 2`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[2].name)
        .and("contain.text", "REJECTED")
        .and("contain.text", "POT-00001");
    });

    it("Dismiss item", () => {
      cy.contains("POT-00001").eq(0).trigger("mouseover");
      cy.get("[data-cy='dismiss-icon']").first().arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(1000);
    });

    it("Dismissed item shouldn't be in the list", () => {
      SystemRequirement("REQ-5330");
      cy.contains("REJECTED").should("not.exist");
    });
  });

  context("Resend PO", () => {
    it("Open PO", () => {
      cy.visit(poUrl);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Status should be 'DRAFT'", () => {
      cy.arVerifyStatus({ status: "DRAFT" });
    });

    it("Click 'Submit for Approval' button", () => {
      cy.pmSubmitForApprovalInThreeDotsWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Login as User 2", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it(`Verify that To Do tab has PO notification again`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "POT-00001")
        .and("contain.text", "needs your approval for")
        .and("contain.text", USERS[1].name);
    });

    it("Approve PO", () => {
      cy.dashApproverFirstFromListWithoutApi();
      cy.wait(3000);
    });

    it("'To Do' tab should be empty", () => {
      cy.contains("No pending actions").should("exist");
    });
  });

  context("Login as User 1", () => {
    it("Logs user in", () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
    });
    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify tabs content", () => {
    it("Open My Feed tab", () => {
      cy.dashOpenMyFeedTab();
    });

    it("PO is in approved state on dashboard", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "POT-00001")
        .and("contain.text", "APPROVED");
    });
  });
});

export { };

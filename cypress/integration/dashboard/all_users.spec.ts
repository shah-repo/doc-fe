// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import faker from "faker";
import moment from "moment";
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { purchaseOrderDefaultSchema } from "../../fixtures/default_po_schema";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;
let secondEmployee;
let group;
let initialArDocument;
let approvalRequestDocumentType;
let createdInReviewDocument;
let formDocumentType;
let testDocumentType;
let createdArForDocInReview;
let purchaseOrderDocumentType;
let equipmentDocumentType;
let equipmentDocument;
let supplierDocumentType;
let createdPurchaseOrderFormDocument;

const currentDate = moment().tz("America/Los_Angeles").format("MMM D, YYYY");

context("All regular users on new dashboard", () => {
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
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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
              TestDocumentType,
              PurchaseOrderTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          secondEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          testDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Test Document Type");
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          done();
        });
      });
    });
  });

  context("[API]Create documents", () => {
    it("[API]Login first tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Create a form document in IN REVIEW", (done: any) => {
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
              description: "<p>IN REVIEW document</p>",
              document: {
                docId: "FM-00005",
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
              name: "In review document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
              formTemplate: {
                outputDocumentTypes: [{
                  id: testDocumentType[0].id,
                }],
                schema: [],
              },
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdInReviewDocument = response;
            cy.arCreateApprovalRequest({
              payload: {
                title: "Equipment form",
                description: "test description",
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                formInput: {
                  documentRevisions: [{
                    proposedDocumentRevision: { id: createdInReviewDocument.id },
                    descriptionOfChange: "ar test",
                    justificationOfChange: "ar test",
                    id: faker.random.uuid(),
                  }],
                  approvers: [{
                    id: adminEmployee.id,
                  }],
                },
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then((response) => {
              createdArForDocInReview = response;
              cy.arPatchAR({
                payload: {
                  formInput: {
                    documentRevisions: [{
                      proposedDocumentRevision: { id: createdInReviewDocument.id },
                      descriptionOfChange: "ar test",
                      justificationOfChange: "ar test",
                      id: faker.random.uuid(),
                    }],
                    approvers: [
                      {
                        approver: {
                          id: secondEmployee.id,
                        },
                        signatureGroupId: {
                          id: null,
                        },
                      },
                    ],
                  },
                },
                arID: createdArForDocInReview.id,
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => {
                cy.arInReview({
                  employeeId: adminEmployee.id,
                  sessionId: loginResponse.sessionId,
                  arID: createdArForDocInReview.id,
                }).then(() => done());
              });
            });
          });
        });
      });
    });

    it("[API]Create equipment document", () => {
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
              description: "<p>Equipment document</p>",
              document: {
                docId: "ET-00003",
                documentType: {
                  id: equipmentDocumentType[0].id,
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
              name: "Equipment document",
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.arCreateApprovalRequest({
              payload: {
                title: "For first equipment",
                description: "Approval for equipment",
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                formInput: {
                  documentRevisions: [{
                    proposedDocumentRevision: { id: equipmentDocument.id },
                    descriptionOfChange: "ar test",
                    justificationOfChange: "ar test",
                    id: faker.random.uuid(),
                  }],
                  approvers: [{
                    id: adminEmployee.id,
                  }],
                },
              },
              employeeId: adminEmployee.id,
              sessionId: loginResponse.sessionId,
            }).then((response) => {
              createdArForDocInReview = response;
              cy.arPatchAR({
                payload: {
                  formInput: {
                    documentRevisions: [{
                      proposedDocumentRevision: { id: equipmentDocument.id },
                      descriptionOfChange: "ar test",
                      justificationOfChange: "ar test",
                      id: faker.random.uuid(),
                    }],
                    approvers: [
                      {
                        approver: {
                          id: secondEmployee.id,
                        },
                        signatureGroupId: {
                          id: null,
                        },
                      },
                    ],
                  },
                },
                arID: createdArForDocInReview.id,
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then(() => {
                cy.arInReview({
                  employeeId: adminEmployee.id,
                  sessionId: loginResponse.sessionId,
                  arID: createdArForDocInReview.id,
                });
              });
            });
          });
        });
      });
    });

    it("[API]Creates suplier document for PO", (done: any) => {
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

  context("Login user", () => {
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

  context("Verify Dashboard tabs", () => {
    it("Dashboard should have 3 tabs - 'My Feed' and 'Recent'", () => {
      cy.get("[role=tablist] button").eq(0).should("contain.text", "To Do");
      cy.get("[role=tablist] button").eq(1).should("contain.text", "My Feed");
      cy.get("[role=tablist] button").eq(2).should("contain.text", "Recent");
    });
  });

  context("My Feed tab contains", () => {
    it("Switch to myfeed tab", () => {
      cy.dashboardMyFeedTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Own AR and records that are in review and awaiting approval from other users", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(2).find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00002")
        .and("contain.text", "For first equipment")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(2).find(".MuiGrid-container").eq(1)
        .should("contain.text", USERS[2].name);

      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(3).find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00001")
        .and("contain.text", "Equipment form")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(3).find(".MuiGrid-container").eq(1)
        .should("contain.text", USERS[2].name);
    });

    it(`Login as ${USERS[2].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Documents, Records and ARs from other users that are for your approval", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00002")
        .and("contain.text", "For first equipment");

      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(1).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00001")
        .and("contain.text", "Equipment form");
    });
  });

  context("Verify content of each line item", () => {
    it(`For ${USERS[2].name}, verify each line contain icon, doc detail & datetime`, () => {
      SystemRequirement("REQ-5000", "REQ-5010");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiAvatar-root").eq(0)
        .should("have.text", "GR");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00002")
        .and("contain.text", "For first equipment");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(1)
        .should("contain.text", currentDate);


      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(1).find(".MuiAvatar-root").eq(0)
        .should("have.text", "GR");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(1).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "AR-00001")
        .and("contain.text", "Equipment form");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(1).find(".MuiGrid-container").eq(1)
        .should("contain.text", currentDate);
    });

    it(`Login as ${USERS[1].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Switch to myfeed tab", () => {
      cy.dashboardMyFeedTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`For ${USERS[1].name}, verify each line contain icon, doc detail & datetime`, () => {
      SystemRequirement("REQ-5000", "REQ-5010");
      cy.contains("CLOSED").parent().parent().parent().parent().parent().find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00003")
        .and("contain.text", "Releasing FM-00004, Purchase Order form")
        .and("contain.text", "CLOSED");
      cy.contains("CLOSED").parent().parent().parent().parent().parent().find(".MuiGrid-container").eq(1)
        .should("contain.text", currentDate);

      cy.contains("APPROVED").parent().parent().parent().parent().parent().parent().parent()
        .find(".MuiAvatar-root").eq(0).should("have.text", "GR");

      cy.contains("APPROVED").parent().parent().parent().parent().parent().find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00003")
        .and("contain.text", "Releasing FM-00004, Purchase Order form")
        .and("contain.text", "APPROVED")
        .and("contain.text", USERS[1].name);
      cy.contains("APPROVED").parent().parent().parent().parent().parent().find(".MuiGrid-container").eq(1)
        .should("contain.text", currentDate);

      cy.contains("AR-00002").parent().parent().parent().parent().find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00002")
        .and("contain.text", "For first equipment")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.contains("AR-00002").parent().parent().parent().parent().find(".MuiGrid-container").eq(1)
        .should("contain.text", USERS[2].name)
        .and("contain.text", currentDate);

      cy.contains("AR-00001").parent().parent().parent().parent().find(".MuiGrid-container").eq(0)
        .should("contain.text", "AR-00001")
        .and("contain.text", "Equipment form")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.contains("AR-00001").parent().parent().parent().parent().find(".MuiGrid-container").eq(1)
        .should("contain.text", USERS[2].name)
        .and("contain.text", currentDate);
    });
  });

  context("Verify on click pending approvers or AR status should open the email modal box", () => {
    it("Click on pending approver", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(2).find(".MuiGrid-container").eq(1)
        .find("a").arrowClick();
      cy.get("#simple-modal-title").should("exist").and("have.text", "Approval Status");
      cy.get("div[role=presentation] button[aria-label=close]").arrowClick();

      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(2).find(".MuiGrid-container").eq(0)
        .find(".MuiGrid-root").eq(2).arrowClick();
      cy.get("#simple-modal-title").should("exist").and("have.text", "Approval Status");
      cy.get("div[role=presentation] button[aria-label=close]").arrowClick();

      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(3).find(".MuiGrid-container").eq(1)
        .find("a").arrowClick();
      cy.get("#simple-modal-title").should("exist").and("have.text", "Approval Status");
      cy.get("div[role=presentation] button[aria-label=close]").arrowClick();

      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(3).find(".MuiGrid-container").eq(0)
        .find(".MuiGrid-root").eq(2).arrowClick();
      cy.get("#simple-modal-title").should("exist").and("have.text", "Approval Status");
      cy.get("div[role=presentation] button[aria-label=close]").arrowClick();
    });
  });

  context("Create purchase order", () => {
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

      it(`Select '${USERS[1].name}' for Requestor`, () => {
        cy.get("[data-cy^=po-requestor]").arrowClick();
        cy.get("[data-cy^=po-requestor]").autocompleteSelect(USERS[1].name);
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
        cy.get("[data-cy=\"po-supplier-built-in\"]").arrowClick();
        cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect("SUP-00003");
        cy.unClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Select 'Third party Company' for Ship To", () => {
        cy.get("[name^=\"ship-to\"]").eq(1).arrowClick();
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
        cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").last().arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.wait(2000);
      });

      it("Save PO", () => {
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
        cy.get("div[style=\"width: 100%; height: 100%;\"]").arrowClick();
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

      it("Add an Approval", () => {
        cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
        cy.get("ul>li[role=option]").contains(USERS[2].name).arrowClick();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Save PO", () => {
        cy.poSaveDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApprovalWithoutAPI();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });
  });

  context("Owner should see pending PO in My Feed", () => {
    it("Goto Dashboard", () => {
      cy.navigToDashboardWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Switch to myfeed tab", () => {
      cy.dashboardMyFeedTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it(`${USERS[1].name} should see pending PO on dashboard`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "POT-00001")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(1)
        .should("contain.text", USERS[2].name);
    });

    it(`For ${USERS[1].name}, verify line item contain icon, doc detail & datetime`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "POT-00001")
        .and("contain.text", "pending approvals from")
        .and("contain.text", "IN REVIEW");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(1)
        .should("contain.text", USERS[2].name)
        .and("contain.text", currentDate);
    });
  });

  context("Verify line item for PO", () => {
    it(`Login as ${USERS[2].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it(`For ${USERS[2].name}, verify line item contain icon, doc detail & datetime`, () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "POT-00001")
        .and("contain.text", "needs your approval for")
        .and("contain.text", USERS[1].name);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(1)
        .should("contain.text", currentDate);
    });

    it("Hovering PO line item should display buttons", () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("svg").should("have.length", 4);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-approve\"]").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-reject\"]").should("exist");
    });
  });

  context(`${USERS[2].name} should see in his Dashboard that there’s a PO for approval`, () => {
    it(`Login as ${USERS[2].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("pending PO should be present", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", USERS[1].name)
        .and("contain.text", "needs your approval for")
        .and("contain.text", "POT-00001");
    });

    it("Clicking on the arrow should show the PO details", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find("svg").eq(0).arrowClick();
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `Supplier:API supplier` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `Total:USD 21.85` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `Description:New Purchase Order` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `Line Items:1` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `Attachments` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `image.jpg` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `test_image.jpg` });
    });

    it("Buttons for PO should be displayed", () => {
      cy.get(".MuiListItemText-root.MuiListItemText-dense").first().trigger("mouseover");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("svg").should("have.length", 4);
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-download-pdf\"]").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-approve\"]").should("exist");
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiBox-root").eq(0)
        .find("[data-cy=\"transition-reject\"]").should("exist");
    });
  });

  context("Check notification after update PO", () => {
    it(`Login as ${USERS[1].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.cmpTurnOffAutosave();
    });

    it("Click PO", () => {
      cy.contains("POT-00001").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Click withdraw submission button", () => {
      cy.get("[data-cy=\"document.revision.withdraw.alert\"]").arrowClick();
      cy.get("[data-cy=\"AlertDialog-continueButton\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Update description", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order test" });
    });

    it("Add an Approval", () => {
      cy.get("[data-cy^=\"fb-po-approvals-\"]").arrowClick();
      cy.get("[data-cy^=\"fb-po-approvals-\"]").autocompleteSelect(USERS[1].name);
      cy.unClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Save PO document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
      cy.wait(2000);
    });

    it("Click 'Submit for Approval' button", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.wait(5000);
    });

    it("Verify updated info on PO notification", () => {
      cy.navigToDashboardWithoutApi();
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(1).find("svg").eq(0).arrowClick();
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `Supplier:API supplier` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `Total:USD 21.85` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `Description:New Purchase Order` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `Line Items:1` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `Attachments` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `image.jpg` });
      cy.dashVerifyListItemExistsOnDashboard({ listItem: `test_image.jpg` });
    });

    it(`${USERS[1].name} should see 2 pending PO on dashboard`, () => {
      cy.contains("IN REVIEW").eq(0).parent().parent().parent().parent()
        .should("contain.text", "POT-00001")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.contains("IN REVIEW").parent().parent().parent().parent().next()
        .find("span").eq(0)
        .should("contain.text", `${USERS[1].name}`)
        .and("contain.text", `${USERS[2].name}`);
    });
  });

  context("Update notification on approve PO", () => {
    it("Click approve for PO", () => {
      cy.contains("needs your approval for").eq(0).trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });

    it("update PO approvals on dashboard", () => {
      cy.contains("IN REVIEW").eq(0).parent().parent().parent().parent()
        .should("contain.text", "POT-00001")
        .and("contain.text", "IN REVIEW")
        .and("contain.text", "pending approvals from");
      cy.contains("IN REVIEW").parent().parent().parent().parent().next()
        .find("span").eq(0).should("have.text", `${USERS[2].name}`);
    });
  });

  context(`Approve PO by ${USERS[2].name}`, () => {
    it(`Login as ${USERS[2].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[2].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
    });

    it("Click approve for PO", () => {
      cy.contains("needs your approval for").eq(0).trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().trigger("mouseover");
      cy.get("[data-cy=\"transition-approve\"]").first().arrowClick();
      cy.get("[data-cy=\"transition.action.password\"]").arrowType(CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
      cy.get("[data-cy=\"passwordConfirm\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.checkToastMessage({ exists: false });
    });
  });

  context("PO owner should get notification", () => {
    it(`Login as ${USERS[1].name}`, () => {
      cy.authLogout();
      cy.authLogin({
        email: USERS[1].email,
        password: CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
      });
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: true });
      cy.cmpTurnOffAutosave();
    });

    it("PO is in approved state on dashboard", () => {
      cy.get("[data-cy=dashboardFeedList] .MuiListItem-root").eq(0).find(".MuiGrid-container").eq(0)
        .should("contain.text", "POT-00001")
        .and("contain.text", "APPROVED");
    });
  });
});

export { };

/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import moment from "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { purchaseOrderDefaultSchema } from "../../fixtures/default_po_schema";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { POPart } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let secondEmployee;
let group;
let formDocumentType;
let purchaseOrderDocumentType;
let createdPurchaseOrderFormDocument;
let approvalRequestDocumentType;
let supplierDocumentType;
let initialArDocument;
let poPageDetailsId;

const endOfMonth   = moment().endOf("month").format("MM/DD/YYYY");
const oneDayBeforeEndOfMonth   = moment().endOf("month").subtract(1, "days").format("MM/DD/YYYY");
const twoDayBeforeEndOfMonth   = moment().endOf("month").subtract(2, "days").format("MM/DD/YYYY");
const threeDayBeforeEndOfMonth   = moment().endOf("month").subtract(3, "days").format("MM/DD/YYYY");
const ninthDayBeforeEndOfMonth   = moment().endOf("month").subtract(9, "days").format("MM/DD/YYYY");
const eleventhDayBeforeEndOfMonth   = moment().endOf("month").subtract(11, "days").format("MM/DD/YYYY");

const COLUMN_HEADERS = [
  "PO #",
  "REVISION",
  "PO STATUS",
  "PO STATE",
  "SUPPLIER",
  "PART NUMBER",
  "AMOUNT",
  "REQUESTOR",
  "ORDER DATE",
];

context("Search PO item with correct order date format", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("Set up", () => {
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
        }); ``;
      });
    });

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

    it("[API] Patch page details", (done: any) => {
      cy.request({
        method: "GET",
        url: `${CONFIG.BE_URL}/api/v1/page_details`,
        qs: {
          category: "Purchase Order",
        },
        headers: {
          Authorization: `bearer ${secondEmployee.id}:${loginResponse.sessionId}`,
        },
      }).then((response) => {
        if (response.body) {
          poPageDetailsId = response.body[0].id;
        }
      }).then(() => {
        cy.intercept({ method: "PATCH", pathname: "/api/v1/page_details/*" }).as("response");
        cy.cmpUpdatePageDetails({
          id: poPageDetailsId,
          payload: {
            columns: [
              {
                label: COLUMN_HEADERS[0],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "document.docId",
                showOnAndroid: true,
              },
              {
                fn: "DOCUMENT_REVISION_VERSION",
                label: COLUMN_HEADERS[1],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.version",
                sourcePath: [
                  "revisionStage:revision",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PO_STATUS_FROM_PURCHASE_ORDER",
                label: COLUMN_HEADERS[2],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po_status",
                sourcePath: [
                  "formDocument.formTemplate.schema",
                ],
                showOnAndroid: true,
              },
              {
                label: COLUMN_HEADERS[3],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "displayStatus",
                showOnAndroid: true,
              },
              {
                fn: "SUPPLIER_NAME_FROM_PURCHASE_ORDER",
                label: COLUMN_HEADERS[4],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.supplier",
                sourcePath: [
                  "formDocument.formTemplate.schema",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PO_PART_NUMBER_FROM_PURCHASE_ORDER",
                label: COLUMN_HEADERS[5],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po_partNumber",
                sourcePath: [
                  "formDocument.formTemplate.schema",
                ],
                showOnAndroid: true,
              },
              {
                fn: "PO_AMOUNT_FROM_PURCHASE_ORDER",
                label: COLUMN_HEADERS[6],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.po_amount",
                sourcePath: [
                  "formDocument.formTemplate.schema",
                ],
                showOnAndroid: true,
              },
              {
                fn: "USER_NAME",
                label: COLUMN_HEADERS[7],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.requestor-k740hxlb",
                sourcePath: [
                  "formInput.requestor-k740hxlb",
                  "formInput.po-requestor-autocomplete",
                ],
                showOnAndroid: true,
              },
              {
                fn: "DATE_FORMAT_MM_DD_YYYY",
                label: COLUMN_HEADERS[8],
                fieldName: "irrelevant",
                showOnWeb: true,
                valuePath: "precalc.order-date-formatted",
                sourcePath: [
                  "formInput.ordered-k6mlhan7",
                  "formInput.po-order-date",
                ],
                showOnAndroid: true,
              },
            ],
          },
          employeeId: secondEmployee.id,
          sessionId: loginResponse.sessionId,
        }).then(() => done());
      });
    });

    context("Create Purchase Order Draft", () => {
      context("Log user to company", () => {
        it("Login user to dashboard", () => {
          cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
        });

        it("Turn off autosave", () => {
          cy.cmpTurnOffAutosave();
          cy.unClick();
        });

        it("Go to Purchase Order module", () => {
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.navigToPurchaseOrder();
        });

        it("Click on 'Create PO' button", () => {
          cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
            cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
          });
        });

        context("Fill out PO fields", () => {
          it("Enter description 'New Purchase Order Draft'", () => {
            cy.drEnterDocumentDescription({ description: "New Purchase Order Draft" });
          });

          it("Select 'Open' for PO status", () => {
            cy.poSelectPOStatus({ status: "Open" });
          });

          it(`Select '${USERS[1].name}' for Requestor`, () => {
            cy.get("[data-cy^=po-requestor]").arrowClick();
            cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
          });

          it("Select Order Date", () => {
            cy.get("input[name^=ordered]").parent().find("button").arrowClick();
            cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").eq(-1).arrowClick();
          });

          it("Clicks Save button", () => {
            cy.drClickCreateDocumentWithApiCall();
          });
        });
      });
    });

    context("Create Purchase Order Released 1", () => {
      it("Go to Purchase Order module", () => {
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.navigToPurchaseOrder();
      });

      it("Click on 'Create PO' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
        });
      });

      context("Fill out PO fields", () => {
        it("Enter description 'New Purchase Order Released 1'", () => {
          cy.drEnterDocumentDescription({ description: "New Purchase Order Released 1" });
        });

        it("Select 'Open' for PO status", () => {
          cy.poSelectPOStatus({ status: "Open" });
        });

        it(`Select '${USERS[1].name}' for Requestor`, () => {
          cy.get("[data-cy^=po-requestor]").arrowClick();
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        });

        it("Select Order Date", () => {
          cy.get("input[name^=ordered]").parent().find("button").arrowClick();
          cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").eq(-2).arrowClick();
        });

        it("Clicks Save button", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        context("Submit PO for Approval", () => {
          it("navigate to Details tab", () => {
            cy.drSelectDetailsTab();
          });

          it("Add an Approval", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
              cy.get(`[data-cy^="fb-po-approvals-"]`).autocompleteSelect(USERS[1].name);
            });
          });

          it("Click 'Submit for Approval' button", () => {
            cy.pmSubmitForApproval();
          });

          it("Approve", () => {
            cy.poApprove();
          });
        });
      });
    });

    context("Create Purchase Order Released 2", () => {
      it("Go to Purchase Order module", () => {
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.navigToPurchaseOrder();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
        cy.unClick();
      });

      it("Click on 'Create PO' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
        });
      });

      context("Fill out PO fields", () => {
        it("Enter description 'New Purchase Order Released 2'", () => {
          cy.drEnterDocumentDescription({ description: "New Purchase Order Released 2" });
        });

        it("Select 'Open' for PO status", () => {
          cy.poSelectPOStatus({ status: "Open" });
        });

        it(`Select '${USERS[1].name}' for Requestor`, () => {
          cy.get("[data-cy^=po-requestor]").arrowClick();
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        });

        it("Select Order Date", () => {
          cy.get("input[name^=ordered]").parent().find("button").arrowClick();
          cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").eq(-3).arrowClick();
        });

        it("Clicks Save button", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        context("Submit PO for Approval", () => {
          it("navigate to Details tab", () => {
            cy.drSelectDetailsTab();
          });

          it("Add an Approval", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
              cy.get(`[data-cy^="fb-po-approvals-"]`).autocompleteSelect(USERS[1].name);
            });
          });

          it("Click 'Submit for Approval' button", () => {
            cy.pmSubmitForApproval();
          });
        });

        context("Approve", () => {
          it("Approve", () => {
            cy.poApprove();
          });
        });
      });
    });

    context("Create Purchase Order Pending Action", () => {
      it("Go to Purchase Order module", () => {
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        cy.navigToPurchaseOrder();
      });

      it("Turn off autosave", () => {
        cy.cmpTurnOffAutosave();
        cy.unClick();
      });

      it("Click on 'Create PO' button", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.DocPreview], () => {
          cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
        });
      });

      context("Fill out PO fields", () => {
        it("Enter description 'New Purchase Order Pending Action'", () => {
          cy.drEnterDocumentDescription({ description: "New Purchase Order Pending Action" });
        });

        it("Select 'Open' for PO status", () => {
          cy.poSelectPOStatus({ status: "Open" });
        });

        it(`Select '${USERS[1].name}' for Requestor`, () => {
          cy.get("[data-cy^=po-requestor]").arrowClick();
          cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
        });

        it("Select Order Date", () => {
          cy.get("input[name^=ordered]").parent().find("button").arrowClick();
          cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").eq(-4).arrowClick();
        });

        it("Clicks Save button", () => {
          cy.drClickCreateDocumentWithApiCall();
        });

        context("Submit PO for Approval", () => {
          it("navigate to Details tab", () => {
            cy.drSelectDetailsTab();
          });

          it("Add an Approval", () => {
            cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
              cy.get(`[data-cy^="fb-po-approvals-"]`).autocompleteSelect(USERS[1].name);
            });
          });

          it("Click 'Submit for Approval' button", () => {
            cy.pmSubmitForApproval();
          });
        });
      });
    });
  });


  context("Search by order date", () => {
    it("Go to Purchase Order module", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.navigToPurchaseOrder();
    });

    it("Search by Order date for Draft", () => {
      cy.poListVerifyFilterByOrderDate({ orderDate: endOfMonth });
    });

    it("Check state", () => {
      cy.get(`td[data-grid-col-index="3"]`).eq(0).should("contain.text", "Draft");
    });

    it("Clear filters", () => {
      cy.filterClear();
    });

    it("Search by Order date for RELEASED 1", () => {
      cy.poListVerifyFilterByOrderDate({ orderDate: oneDayBeforeEndOfMonth });
    });

    it("Check state", () => {
      cy.get(`td[data-grid-col-index="3"]`).eq(0).should("contain.text", "RELEASED");
    });

    it("Clear filters", () => {
      cy.filterClear();
    });

    it("Search by Order date for RELEASED 2", () => {
      cy.poListVerifyFilterByOrderDate({ orderDate: twoDayBeforeEndOfMonth });
    });

    it("Check state", () => {
      cy.get(`td[data-grid-col-index="3"]`).eq(0).should("contain.text", "RELEASED");
    });

    it("Clear filters", () => {
      cy.filterClear();
    });

    it("Search by Order date for Pending Approval", () => {
      cy.poListVerifyFilterByOrderDate({ orderDate: threeDayBeforeEndOfMonth });
    });

    it("Check state", () => {
      cy.get(`td[data-grid-col-index="3"]`).eq(0).should("contain.text", "Pending Approval");
    });
  });

  context("Revise PO 1", () => {
    it("Clear filters", () => {
      cy.filterClear();
    });

    it("Filter by Released state", () => {
      cy.get(`[aria-colindex="4"] [class="k-input"]`).arrowClick();
      cy.get("li").contains("RELEASED").arrowClick().wait(500);
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select first document", () => {
      cy.get(`td[data-grid-col-index="3"]`).eq(0).arrowClick();
    });

    it("Click revise on PO record", () => {
      cy.drClickReviseDocument();
    });

    it("Clicks Save button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Select Order Date", () => {
      cy.get("input[name^=ordered]").parent().find("button").arrowClick();
      cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").eq(-10).arrowClick();
    });

    it("Clicks Save button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Revise PO 2", () => {
    it("Go to Purchase Order module", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.navigToPurchaseOrder();
    });

    it("Clear filters", () => {
      cy.filterClear();
    });

    it("Filter by Released state", () => {
      cy.get(`[aria-colindex="4"] [class="k-input"]`).arrowClick();
      cy.get("li").contains("RELEASED").arrowClick().wait(500);
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Select first document", () => {
      cy.get(`td[data-grid-col-index="3"]`).eq(1).arrowClick();
    });

    it("Click revise on PO record", () => {
      cy.drClickReviseDocument();
    });

    it("Clicks Save button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Select Order Date", () => {
      cy.get("input[name^=ordered]").parent().find("button").arrowClick();
      cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").eq(-12).arrowClick();
    });

    it("Clicks Save button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    context("Submit PO for Approval", () => {
      it("navigate to Details tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Add an Approval", () => {
        cy.wrapWithWaitOnApiCalls([CyRoutes.PostApprovals], () => {
          cy.get(`[data-cy^="fb-po-approvals-"]`).autocompleteSelect(USERS[1].name);
        });
      });

      it("Click 'Submit for Approval' button", () => {
        cy.pmSubmitForApproval();
      });
    });

    context("Approve", () => {
      it("Approve", () => {
        cy.poApprove();
      });
    });
  });

  context("Search by order date after revise", () => {
    it("Go to Purchase Order module", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.navigToPurchaseOrder();
    });

    it("Clear filters", () => {
      cy.filterClear();
    });

    it("Search by Order date for Draft", () => {
      cy.poListVerifyFilterByOrderDate({ orderDate: ninthDayBeforeEndOfMonth });
    });

    it("Check state", () => {
      cy.get(`td[data-grid-col-index="3"]`).eq(0).should("contain.text", "Draft");
    });

    it("Clear filters", () => {
      cy.filterClear();
    });

    it("Search by Order date for Draft", () => {
      cy.poListVerifyFilterByOrderDate({ orderDate: eleventhDayBeforeEndOfMonth });
    });

    it("Check state", () => {
      cy.get(`td[data-grid-col-index="3"]`).eq(0).should("contain.text", "RELEASED");
    });
  });
});

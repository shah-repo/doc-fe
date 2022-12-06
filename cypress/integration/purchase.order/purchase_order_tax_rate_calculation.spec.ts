/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { purchaseOrderDefaultSchema } from "../../fixtures/default_po_schema";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { POPart } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderDocType } from "../../utils/constants/documentTypes/purchaseOrder";
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

const documentSupplierRevisionName = "New suplier for PO";

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
              PurchaseOrderDocType,
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
              docId: "SUP-00004",
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
            name: documentSupplierRevisionName,
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
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: secondEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
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


    context("Create Form Part document to create Part", () => {
      it("Login user to dashboard", () => {
        cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Navigates to document list", () => {
        cy.navigToDocumentList();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enters title 'New Part Form'", () => {
        cy.drEnterDocumentTitle({ name: "New Part Form" });
      });

      it("Enters description 'New Part Form description'", () => {
        cy.drEnterDocumentDescription({ description: "New Part Form description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Selects 'PO Part' document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "PO Part" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Create Part document for PO", () => {
      it("Navigates to parts list", () => {
        cy.navigToParts();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Clicks on 'Add new part' button", () => {
        cy.ptClickCreateNewPart();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Clicks on 'PO Part' Form", () => {
        cy.ptSelectPartFormFromMultiSelect({ partForm: "PO Part" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enters title 'New Part'", () => {
        cy.drEnterDocumentTitle({ name: "New Part" });
      });

      it("Enters description 'New Part description'", () => {
        cy.drEnterDocumentDescription({ description: "New Part description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Create Supplier form for PO", () => {
      it("Navigates to document list", () => {
        cy.navigToDocumentList();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Clicks on 'create a document' button", () => {
        cy.cmpClickCreateNewDocument();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Enters title 'New Supplier Form'", () => {
        cy.drEnterDocumentTitle({ name: "New Supplier Form" });
      });

      it("Enters description 'New Supplier Description'", () => {
        cy.drEnterDocumentDescription({ description: "New Supplier Description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Selects 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Click on 'Suppliers' outputdocument type", () => {
        cy.drSelectOutputDocumentType({ documentType: "Suppliers" });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Click create document after filling document", () => {
        cy.drClickCreateDocumentWithoutApiCall();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });

      it("Approve and release document", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
      });
    });

    context("Create Purchase Order", () => {
      context("Log user to company", () => {
        it("Login user to dashboard", () => {
          cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
        });

        it("Navigate to document list", () => {
          cy.navigToDocumentList();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });


        it("Filter DocType name", () => {
          cy.dlClearFilters();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.get(".k-textbox").eq(2).arrowType("Purchase Order form").wait(500);
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Search PO form", () => {
          cy.dlSelectFirstDocument();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Navigate to line items", () => {
          cy.drSelectLineItems();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Verify % symbol next to tax rate", () => {
          cy.get(`[data-cy="po-items-built-in.taxRate"]`).parent().parent().parent().parent().should("contain", "%");
        });

        it("Go to Purchase Order module", () => {
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
          cy.navigToPurchaseOrder();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Click on 'Create PO' button", () => {
          cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Navigate to line items", () => {
          cy.drSelectLineItems();
          cy.progressBarShouldNotExist();
          cy.listLoadingElementShouldNotExist();
        });

        it("Verify % symbol next to tax rate", () => {
          cy.get(`[data-cy="po-items-built-in.taxRate"]`).parent().parent().parent().parent().should("contain", "%");
        });

        it("check default tax rate", () => {
          cy.get(`[name="po-items-built-in.taxRate"]`).should("have.value", "9.25");
        });

        context("Fill out PO fields", () => {
          it("Navigate to details tab", () => {
            cy.drSelectDetailsTab();
          });

          it("Enter description 'New Purchase Order Draft'", () => {
            cy.drEnterDocumentDescription({ description: "New Purchase Order Draft" });
          });

          it("Select 'Open' for PO status", () => {
            cy.poSelectPOStatus({ status: "Open" });
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it(`Select '${USERS[1].name}' for Requestor`, () => {
            cy.get("[data-cy^=po-requestor]").arrowClick();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
            cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Select Order Date", () => {
            cy.get("input[name^=ordered]").parent().find("button").arrowClick();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
            cy.get("button.MuiPickersDay-day[tabindex=\"0\"]").eq(-1).arrowClick();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Navigate to line items", () => {
            cy.drSelectLineItems();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Click on 'Add item' button", () => {
            cy.poAddNewFieldItem();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Click on 'Add' inside PO dialog box and check for required fields", () => {
            cy.get("[data-cy=\"common.add\"]").click();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
            cy.get("p[class*='MuiFormHelperText-root']>span")
              .contains("The Part Number field is required when Supplier Part Number is empty.");
            cy.get("p[class*='MuiFormHelperText-root']>span")
              .contains("The Supplier Part Number field is required when Part Number is empty.");
          });

          it("Select Part Number", () => {
            cy.poSelectPartNumber({ partNo: "PRT-00003 - 1" });
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Enter Quantity Ordered", () => {
            cy.poEnterQuantityOrdered({ quantity: "5" });
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
            cy.get("[name=\"date\"]").next().find("button").arrowClick();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
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

          it("check PO sum", () => {
            cy.get(`[data-cy="poSum"]`).should("contain", "$10.00");
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Verify Tax", () => {
            cy.poCheckTax({ number: "0.925000" });
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Change Tax", () => {
            cy.get(`[data-cy="po-items-built-in.taxRate"] input`).arrowClick().wait(1000);
            cy.get(`[data-cy="po-items-built-in.taxRate"] input`).arrowType(`{selectAll}{backspace}`).unClick();
            cy.get(`[data-cy="po-items-built-in.taxRate"] input`).arrowType("2").unClick();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Clicks Save button", () => {
            cy.drClickCreateDocumentWithoutApiCall();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Verify revised Tax", () => {
            cy.poCheckTax({ number: "0.000200" });
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("navigate to Details tab", () => {
            cy.drSelectDetailsTab();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Click 'Submit for Approval' button", () => {
            cy.pmSubmitForApprovalWithoutAPI();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
            cy.landingPageLoadingElementShouldNotExist();
          });

          it("Approve", () => {
            cy.ebApproveWithoutApi();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
            cy.landingPageLoadingElementShouldNotExist();
          });
        });

        context("Verify Tax Rate symbol", () => {
          it("Navigate to line items tab", () => {
            cy.drSelectLineItems();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Verify % symbol next to tax rate", () => {
            cy.get(`[name="po-items-built-in.taxRate"]`).parent().parent().parent().parent().should("contain", "%");
          });

          it("Revise record", () => {
            cy.get("[data-cy=\"updateRecord\"]").click();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
            cy.landingPageLoadingElementShouldNotExist();
          });

          it("Navigate to line items tab", () => {
            cy.drSelectLineItems();
            cy.progressBarShouldNotExist();
            cy.listLoadingElementShouldNotExist();
          });

          it("Verify % symbol next to tax rate", () => {
            cy.get(`[data-cy="po-items-built-in.taxRate"]`).parent().parent().parent().parent().should("contain", "%");
          });
        });
      });
    });
  });
});

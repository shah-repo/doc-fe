// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolNotRedline } from "../../utils/constants/documentTypes/clinicalProtocol";
import { Material } from "../../utils/constants/documentTypes/material";
import { Part } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderDocType } from "../../utils/constants/documentTypes/purchaseOrder";
import { Supplier } from "../../utils/constants/documentTypes/supplier";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let equipmentDocumentType;
let materialsDocumentType;
let partDocumentType;
let equipmentDocument;
let partDocument;
let createdPOFormDocument;
let formDocumentType;
let purchaseOrderDocumentType;
let createdPODocument;
let createdMaintenanceRecordFormDocument;

const equipmentNo = "ET-00003";
const equipmentTitle = "Equipment document";
const materialNo = "MT-00004";
const materialTitle = "Material document";
const partNo = "PRT-00005";
const partTitle = "Part document";
const po = "PO #";
const rev = "REVISION";
const poStatus = "PO STATUS";
const supplier = "SUPPLIER";
const partNumber = "PART NUMBER";
const amount = "AMOUNT";
const requestor = "REQUESTOR";
const issueDate = "ISSUE DATE";

context("Purchase Order Landing Page", () => {
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
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              ClinicalProtocolNotRedline,
              Part,
              Material,
              Supplier,
              PurchaseOrderDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          equipmentDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Equipment");
          materialsDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Material");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Part");
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          done();
        });
      });
    });

    it("[API]Login Admin", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
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
                docId: equipmentNo,
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
              name: equipmentTitle,
              referenceTo: [],
              retrain: false,
              revisionChangeType: RevisionChangeType.NextRevision,
              revisionStage: 1,
            },
            employeeId: adminEmployee.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            equipmentDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: equipmentDocument.id,
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

    it("[API]Create materials document", () => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Materials document</p>",
          document: {
            docId: materialNo,
            documentType: {
              id: materialsDocumentType[0].id,
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
          name: materialTitle,
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        partDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: partDocument.id,
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

    it("[API]Create part document", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Part document</p>",
          document: {
            docId: partNo,
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
          name: partTitle,
          referenceTo: [],
          retrain: false,
          revisionChangeType: RevisionChangeType.NextRevision,
          revisionStage: 1,
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdMaintenanceRecordFormDocument = response;
        cy.drAPIApproveAndRelease({
          documentId: createdMaintenanceRecordFormDocument.id,
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

    it("[API]Create PO document", (done: any) => {
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
                    type: "poapprovals",
                    tabId: "details",
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
              cy.poAPICreatePO({
                payload: {
                  name: "",
                  attachments: [],
                  referenceTo: [],
                  formDocument: { id: createdPOFormDocument.id },
                  description: "API PO document",
                  revisionChangeType: RevisionChangeType.NextRevision,
                  document: {
                    docId: "PO-00001",
                    documentType: {
                      id: purchaseOrderDocumentType[0].id,
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
                  formInput: {
                    "po-items-built-in": {
                      items: [{
                        id: "kqqj708c",
                        type: "service",
                        date: (new Date()).toISOString(),
                        tax: false,
                        capitalEquipment: false,
                        isTraceabilityRequired: false,
                        description: "office cleaning",
                        serviceId: "cleaning",
                        units: "hours",
                        order: 5,
                        glCode: "code 1",
                        unitPrice: 30,
                        received: 0,
                        totalAmount: "150.00",
                        formattedDate: (new Date()).toLocaleDateString("en-US"),
                        index: 0,
                      }],
                      tax: "0.00",
                      taxRate: 9.25,
                      subTotal: "150.00",
                      totalAmount: "150.00",
                      shippingCost: "0.00",
                      currency: "USD",
                      exchangeRate: 1,
                      totalInUSD: "150.00",
                      dateOfExchangeRate: "",
                    },
                    "po-status-built-in": "Open",
                  },
                },
                employeeId: adminEmployee.id,
                sessionId: loginResponse.sessionId,
              }).then((response) => {
                createdPODocument = response;
                cy.drAPIApproveAndRelease({
                  documentId: createdPODocument.id,
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

    it("[API] Login admin tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Purchase order Landing Page", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Navigate to PO", () => {
      cy.navigToPurchaseOrder();
    });

    it("Verify that landing pages for use the new data table", () => {
      cy.get(`div[role="grid"]`).should("have.class", "k-grid");
    });

    it("Verify all columns are present", () => {
      cy.get(`th[role="columnheader"]`).eq(0).should("have.text", `${po}`);
      cy.get(`th[role="columnheader"]`).eq(1).should("have.text", `${rev}`);
      cy.get(`th[role="columnheader"]`).eq(2).should("have.text", `${poStatus}`);
      cy.get(`th[role="columnheader"]`).eq(3).should("have.text", `${supplier}`);
      cy.get(`th[role="columnheader"]`).eq(4).should("have.text", `${partNumber}`);
      cy.get(`th[role="columnheader"]`).eq(5).should("have.text", `${amount}`);
      cy.get(`th[role="columnheader"]`).eq(6).should("have.text", `${requestor}`);
      cy.get(`th[role="columnheader"]`).eq(7).should("have.text", `${issueDate}`);
    });

    it(`Verify drag and drop`, () => {
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("contain.text", "PO-00001");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="1"][role]>span>span`,
        toSelector: `th[aria-colindex="2"][role]>span>span`,
      });
      cy.get(`td[data-grid-col-index="0"]`).eq(0).should("not.contain.text", "PO-00001");
      cy.dragAndDrop({
        fromSelector: `th[aria-colindex="2"][role]>span>span`,
        toSelector: `th[aria-colindex="1"][role]>span>span`,
      });
    });

    it("Column grouping", () => {
      cy.get(`th[aria-colindex="2"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").eq(0).should("have.text", "Group Column").click();
    });

    it("Verify that data is sorted based on that column grouping", () => {
      cy.get(".k-grouping-row").eq(0).should("contain.text", "1").arrowClick();
    });

    it("Grouping columns should be displayed next to button Clear Filters", () => {
      cy.get(".k-group-indicator").eq(0).should("have.text", "Revision");
    });

    it("Verify that User should be able to remove column grouping", () => {
      cy.get(".k-i-group-delete").click();
    });
  });

  context("Landing Page", () => {
    it("Verify that system display the number of PO's displayed that match the filter settings", () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
    });

    it(`Verify buttons "Clear Filter" and "Export List" are present`, () => {
      cy.get(`button[data-cy="clearFilter"]`).should("exist");
      cy.get(`button[data-cy="document.revision.export.list"]`).should("exist");
    });
  });

  context("Create first 'Purchase Order' document", () => {
    it("Click on 'Create PO' button", () => {
      cy.poSelectPoFormFromMultiSelect({ poType: "Purchase Order test" });
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Check for PO ID uniqueness - ID should be POT-00001", () => {
      cy.poCheckStatus( "POT-00001" );
    });

    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
    });

    it("Click on existing PO that was created before", () => {
      cy.poClickOnSpecificPOFromList({ item: "POT-00001" });
    });

    it("Check status of PO should be Draft", () => {
      cy.poCheckStatus(STATUS_TYPES_LABEL.DRAFT);
    });

    it("Click on 'Purchase Order' on sidebar", () => {
      cy.navigToPurchaseOrder();
    });
  });

  context("Verify that arrow for sorting are present in all columns and verify asm and desc order", () => {
    context("Sort 'PO #'", () => {
      it("PO # should be in ascending order", () => {
        cy.contains(`${po}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${po}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 0, colLength: 8 });
      });

      it("PO # should be in descending order", () => {
        cy.contains(`${po}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${po}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 0, colLength: 8 });
      });
    });

    context("Sort 'Revision'", () => {
      it("Revision should be in ascending order", () => {
        cy.contains(`${rev}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${rev}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 1, colLength: 8 });
      });

      it("Revision should be in descending order", () => {
        cy.contains(`${rev}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${rev}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 1, colLength: 8 });
      });
    });

    context("Sort 'PO Status'", () => {
      it("PO Status should be in ascending order", () => {
        cy.contains(`${poStatus}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${poStatus}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 2, colLength: 8 });
      });

      it("PO Status should be in descending order", () => {
        cy.contains(`${poStatus}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${poStatus}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 2, colLength: 8 });
      });
    });

    context("Sort 'Supplier'", () => {
      it("Supplier should be in ascending order", () => {
        cy.get("[aria-colindex]").contains(`${supplier}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.get("[aria-colindex]").contains(`${supplier}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 3, colLength: 8 });
      });

      it("Supplier should be in descending order", () => {
        cy.get("[aria-colindex]").contains(`${supplier}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.get("[aria-colindex]").contains(`${supplier}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 3, colLength: 8 });
      });
    });

    context("Sort 'Part Number'", () => {
      it("Part Number should be in ascending order", () => {
        cy.contains(`${partNumber}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${partNumber}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 4, colLength: 8 });
      });

      it("Part Number should be in descending order", () => {
        cy.contains(`${partNumber}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${partNumber}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 4, colLength: 8 });
      });
    });

    context("Sort 'Amount'", () => {
      it("Amount should be in ascending order", () => {
        cy.contains(`${amount}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${amount}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 5, colLength: 8 });
      });

      it("Amount should be in descending order", () => {
        cy.contains(`${amount}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${amount}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 5, colLength: 8 });
      });
    });

    context("Sort 'Requestor'", () => {
      it("Requestor should be in ascending order", () => {
        cy.contains(`${requestor}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${requestor}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 6, colLength: 8 });
      });

      it("Requestor should be in descending order", () => {
        cy.contains(`${requestor}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${requestor}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 6, colLength: 8 });
      });
    });

    context("Sort 'Issue Date'", () => {
      it("Issue Date should be in ascending order", () => {
        cy.contains(`${issueDate}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${issueDate}`).eq(0).parent().find("span.k-i-sort-asc-sm")
          .should("be.exist");
        cy.verifyAscSort({ index: 7, colLength: 8 });
      });

      it("Issue Date should be in descending order", () => {
        cy.contains(`${issueDate}`).eq(0).click();
        cy.landingPageLoadingElementShouldNotExist();
        cy.contains(`${issueDate}`).eq(0).parent().find("span.k-i-sort-desc-sm")
          .should("be.exist");
        cy.verifyDesSort({ index: 7, colLength: 8 });
      });
    });
  });

  context("Verify that each filter for each column in the landing page is functional ", () => {
    it("Verify filter for  PO #", () => {
      cy.get(`[aria-colindex="1"] input`).arrowType("POT-00001").wait(500);
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`[aria-colindex="1"] input`).should("have.attr", "value", "POT-00001");
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify filter for Revision", () => {
      cy.get(`[aria-colindex="2"] input`).arrowType("1");
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`[aria-colindex="2"] input`).should("have.attr", "value", "1");
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify filter for 'PO Status'", () => {
      cy.get(`[aria-colindex="3"] input`).arrowType("N/A");
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`[aria-colindex="3"] input`).should("have.attr", "value", "N/A");
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify filter for 'Supplier'", () => {
      cy.get(`[aria-colindex="4"] input`).arrowType("N/A");
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`[aria-colindex="4"] input`).should("have.attr", "value", "N/A");
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify filter for 'Part Number'", () => {
      cy.get(`[aria-colindex="5"] input`).arrowType("N/A");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify filter for 'Amount'", () => {
      cy.get(`[aria-colindex="6"] input`).arrowType("N/A");
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify filter for 'Requestor'", () => {
      cy.get(`[aria-colindex="7"] input`).arrowType("Giovanni Reynolds");
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("Verify filter for 'Issue Date'", () => {
      cy.get(`[aria-colindex="8"] input`).arrowType("N/A");
      cy.dlVerifyDocCounter({ docCounterNumber: 1 });
    });

    it("system maintain PO filter when navigating away from and back to the landing page", () => {
      cy.navigToDocumentList();
      cy.navigToPurchaseOrder();
      cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "POT-00001");
      cy.get(`[aria-colindex="2"] input`).should("have.attr", "value", "1");
      cy.get(`[aria-colindex="3"] input`).should("have.attr", "value", "N/A");
      cy.get(`[aria-colindex="4"] input`).should("have.attr", "value", "N/A");
      cy.get(`[aria-colindex="5"] input`).should("have.attr", "value", "N/A");
      cy.get(`[aria-colindex="6"] input`).should("have.attr", "value", "N/A");
      cy.get(`[aria-colindex="7"] input`).should("have.attr", "value", "Giovanni Reynolds");
      cy.get(`[aria-colindex="8"] input`).should("have.attr", "value", "N/A");
    });

    it("Verify that user is able to click button 'Clear Filters' and all filters should be cleared'", () => {
      cy.grpClearFilter();
      cy.landingPageLoadingElementShouldNotExist();
      cy.get(`th[aria-colindex="1"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="2"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="3"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="4"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="5"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="6"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="7"] input`).should("have.attr", "value", "");
      cy.get(`th[aria-colindex="8"] input`).should("have.attr", "value", "");
    });
  });

  context("Verify hide and freeze", () => {
    it("Verify hide", () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${po}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item").contains("Hide Column").arrowClick();
      cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${po}`);
    });

    it("Verify unhide", () => {
      cy.get(`th[role="columnheader"] span.k-column-title`).should("not.contain.text", `${po}`);
      cy.get(`button[data-cy="manageColumnsBtn"]`).arrowClick();
      cy.get("ul>li[role=menuitem]").contains(`${po}`).parents("li").find("svg").arrowClick();
      cy.get("body").type("{esc}");
      cy.get(`th[role="columnheader"] span.k-column-title`).should("contain.text", `${po}`);
    });

    it("Verify freeze", () => {
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${po}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Freeze Column").arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${po}`);
    });

    it("Verify un-freeze", () => {
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${po}`);
      cy.get(`th[aria-colindex="1"] span.k-icon`).eq(0).arrowClick();
      cy.get("div.k-columnmenu-item ").contains("Unfreeze Column").arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-column-title`).should("have.text", `${po}`);
    });
  });

  context("Click on the three dots on the column that have Select option and click", () => {
    it("Group column, Hide and Freeze column should be invoked", () => {
      cy.get(`th[aria-colindex="1"][role]>div.k-grid-column-menu`).arrowClick();
      cy.get("div.k-columnmenu-item").contains("Group Column");
      cy.get("div.k-columnmenu-item").contains("Hide Column");
      cy.get("div.k-columnmenu-item").contains("Freeze Column");
      cy.grpClearFilter();
    });

    it("User should be able to insert filter in input field and icon be visible next to the field", () => {
      cy.get(".k-i-filter.k-icon").should("be.visible");
    });
  });

  context("Create second 'Purchase Order' document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'po title'", () => {
      cy.drEnterDocumentTitle({ name: "po title" });
    });

    it("Enter document description 'Purchase Order document description'", () => {
      cy.drEnterDocumentDescription({ description: "Purchase Order document description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Purchase Order test' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order test" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.navigToPurchaseOrder();
    });
  });

  context("Verify dropdown filters", () => {
    it("Verify dropdown filters", () => {
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").should("have.text", "ContainsDoes not containIs equal toIs not equal to" +
        "Starts withEnds withIs nullIs not nullIs emptyIs not empty");
      cy.grpClearFilter();
    });

    it(`Verify "Does not contain" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Does not contain").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("PO-00001");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Is equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is equal to").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("PO-00001");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Is not equal to" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not equal to").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("PO-00001");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Starts with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Starts with").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("PO-00001");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Ends with" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Ends with").arrowClick();
      cy.get(`th[aria-colindex="1"] input`).arrowType("PO-00001");
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 1 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Is null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is null").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Is not null" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not null").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });


    it(`Verify "Is not empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it(`Verify "Is empty" dropdown filter`, () => {
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Is empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 0 });
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it("Insert filter", () => {
      cy.get(`th[aria-colindex="1"] input`).arrowType("PO-00001").wait(500);
    });

    it(`Crossed filter icon should appear `, () => {
      cy.get(".k-button.k-clear-button-visible").should("be.visible").wait(500);
    });

    it(`Select option Contains and verify that the filter is functional`, () => {
      cy.get(`th[aria-colindex="1"] span.k-select`).arrowClick();
      cy.get("ul>li[role=option]").contains("Contains").arrowClick();
      cy.get(`th[aria-colindex="1"] span.k-i-filter-clear`).arrowClick();
    });

    it("Select option from dropdown list", () => {
      cy.get(`th[aria-colindex="2"] span.k-select`).arrowClick().wait(500);
      cy.get("ul>li[role=option]").contains("Is not empty").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
      cy.dlVerifyDocumentCount({ numberOfDoc: 2 });
    });

    it(`Crossed filter icon should appear `, () => {
      cy.get(".k-button-icon.k-clear-button-visible").should("exist");
    });
  });
});

export { };


// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import { GroupTag } from "../../../../doc-fe/src/state/ducks/auth/types";
import { STATUS_TYPES_LABEL } from "../../../../doc-fe/src/state/ducks/dashboard.new/my.feeds/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { ClinicalProtocolNotRedline } from "../../utils/constants/documentTypes/clinicalProtocol";
import { Material } from "../../utils/constants/documentTypes/material";
import { Part } from "../../utils/constants/documentTypes/part";
import { PurchaseOrderTest } from "../../utils/constants/documentTypes/purchaseOrder";
import { Supplier } from "../../utils/constants/documentTypes/supplier";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let developersGroup;
let adminEmployee;
let supplierDocumentType;
let partDocumentType;
let approvalRequestDocumentType;
let createdSupplierFormDocument;
let formDocumentType;
let createdSupplierDocument;
let purchaseOrderDocumentType;
let initialArDocument;
let createdPartDocument;
let createdPOFormDocument;
let group;
context("Scenario 7 in ENC-13443: PO Approval Matrix Template", () => {
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
              PurchaseOrderTest,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Parts");
          purchaseOrderDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Purchase Order test");
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });

    it("[API]Get group Developers", (done: any) => {
      cy.grpGetGroupByName({
        groupName: "Developers",
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
      }).then((response) => {
        developersGroup = response;
        done();
      });
    });

    it("[API]Patch group Developers", () => {
      cy.grpPatchGroup({
        groupId: developersGroup.body[0].id,
        sessionId: loginResponse.sessionId,
        employeeId: adminEmployee.id,
        payload: {
          employees: [{ id: adminEmployee.id }],
          tags: [...developersGroup.body[0].tags,
            GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
            GroupTag.NAVIGATION_WITH_RESTRICTED_DOC_TYPES,
          ],
        },
      });
    });

    // it("[API] Create Supplier form", (done: any) => {
    //   cy.grpGetGroupByName({
    //     sessionId: loginResponse.sessionId,
    //     employeeId: adminEmployee.id,
    //     groupName: "Everyone",
    //   }).then((response) => {
    //     group = response;
    //     cy.arGetArDocumentByName({
    //       sessionId: loginResponse.sessionId,
    //       employeeId: adminEmployee.id,
    //       name: "AR Form",
    //     }).then((response) => {
    //       initialArDocument = response;
    //       cy.drCreateDocumentRevision({
    //         payload: {
    //           attachments: [],
    //           description: "<p>Supplier Form document</p>",
    //           document: {
    //             docId: "FM-00010",
    //             documentType: {
    //               id: formDocumentType[0].id,
    //             },
    //             securityList: {
    //               operators: [],
    //               securityEmployees: [],
    //               securityGroups: [
    //                 {
    //                   id: group.body[0].id,
    //                 },
    //               ],
    //             },
    //           },
    //           name: "Supplier form",
    //           referenceTo: [],
    //           retrain: false,
    //           revisionChangeType: RevisionChangeType.NextRevision,
    //           revisionStage: 1,
    //           formTemplate: {
    //             outputDocumentTypes: [
    //               {
    //                 id: supplierDocumentType[0].id,
    //               },
    //             ],
    //             schema: [],
    //           },
    //         },
    //         employeeId: adminEmployee.id as unknown as string,
    //         sessionId:
    //         loginResponse.sessionId as unknown as string,
    //       }).then((response) => {
    //         createdSupplierFormDocument = response;
    //         cy.drAPIApproveAndRelease({
    //           documentId: createdSupplierFormDocument.id,
    //           payload: {
    //             effectiveDate: new Date().toISOString(),
    //             documentType: { id: approvalRequestDocumentType[0].id },
    //             formDocument: { id: initialArDocument[0].id },
    //             approversWithSignatures: [
    //               { approver: { id: adminEmployee.id } },
    //             ],
    //           },
    //           employeeId: adminEmployee.id,
    //           sessionId: loginResponse.sessionId,
    //         }).then(() => {
    //           cy.poAPICreatePO({
    //             payload: {
    //               name: "API Supplier Document",
    //               attachments: [],
    //               referenceTo: [],
    //               formDocument: { id: createdSupplierFormDocument.id },
    //               description: "API Supplier document",
    //               revisionChangeType: RevisionChangeType.NextRevision,
    //               document: {
    //                 docId: "SUP-00001",
    //                 documentType: {
    //                   id: supplierDocumentType[0].id,
    //                 },
    //                 securityList: {
    //                   operators: [],
    //                   securityEmployees: [],
    //                   securityGroups: [
    //                     {
    //                       id: group.body[0].id,
    //                     },
    //                   ],
    //                 },
    //               },
    //             },
    //             employeeId: adminEmployee.id,
    //             sessionId: loginResponse.sessionId,
    //           }).then((response) => {
    //             createdSupplierDocument = response;
    //             cy.drAPIApproveAndRelease({
    //               documentId: createdSupplierDocument.id,
    //               payload: {
    //                 effectiveDate: new Date().toISOString(),
    //                 documentType: { id: approvalRequestDocumentType[0].id },
    //                 formDocument: { id: initialArDocument[0].id },
    //                 approversWithSignatures: [
    //                   { approver: { id: adminEmployee.id } },
    //                 ],
    //               },
    //               employeeId: adminEmployee.id,
    //               sessionId: loginResponse.sessionId,
    //             }).then(() => {
    //               done();
    //             });
    //           });
    //         });
    //       });
    //     });
    //   });
    // });
    // it("[API] Create part documents", (done: any) => {
    //   cy.drCreateDocumentRevision({
    //     payload: {
    //       attachments: [],
    //       description: "<p>Part document</p>",
    //       document: {
    //         docId: "PRT-00005",
    //         documentType: {
    //           id: partDocumentType[0].id,
    //         },
    //         securityList: {
    //           operators: [],
    //           securityEmployees: [],
    //           securityGroups: [
    //           ],
    //         },
    //       },
    //       name: "Part document",
    //       referenceTo: [],
    //       retrain: false,
    //       revisionChangeType: RevisionChangeType.NextRevision,
    //       revisionStage: 1,
    //     },
    //     employeeId: adminEmployee.id as unknown as string,
    //     sessionId: loginResponse.sessionId as unknown as string,
    //   }).then((response) => {
    //     createdPartDocument = response;
    //     cy.drAPIApproveAndRelease({
    //       documentId: createdPartDocument.id,
    //       payload: {
    //         effectiveDate: new Date().toISOString(),
    //         documentType: { id: approvalRequestDocumentType[0].id },
    //         formDocument: { id: initialArDocument[0].id },
    //         approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
    //       },
    //       employeeId: adminEmployee.id,
    //       sessionId: loginResponse.sessionId,
    //     }).then(() => done());
    //   });
    // });

    // it("[API]Create PO document", (done: any) => {
    //   cy.grpGetGroupByName({
    //     sessionId: loginResponse.sessionId,
    //     employeeId: adminEmployee.id,
    //     groupName: "Everyone",
    //   }).then((response) => {
    //     group = response;
    //     cy.arGetArDocumentByName({
    //       sessionId: loginResponse.sessionId,
    //       employeeId: adminEmployee.id,
    //       name: "AR Form",
    //     }).then((response) => {
    //       initialArDocument = response;
    //       cy.drCreateDocumentRevision({
    //         payload: {
    //           attachments: [],
    //           description: "<p>PO Form document</p>",
    //           document: {
    //             docId: "FM-00003",
    //             documentType: {
    //               id: formDocumentType[0].id,
    //             },
    //             securityList: {
    //               operators: [],
    //               securityEmployees: [],
    //               securityGroups: [
    //                 {
    //                   id: group.body[0].id,
    //                 },
    //               ],
    //             },
    //           },
    //           name: "PO Form document",
    //           referenceTo: [],
    //           retrain: false,
    //           revisionChangeType: RevisionChangeType.NextRevision,
    //           revisionStage: 1,
    //           formTemplate: {
    //             outputDocumentTypes: [{
    //               id: purchaseOrderDocumentType[0].id,
    //             }],
    //             schema: [
    //               {
    //                 name: "po-status-built-in",
    //                 type: "select",
    //                 index: 0,
    //                 label: "PO Status",
    //                 tabId: "details",
    //                 options: [
    //                   {
    //                     text: "Open",
    //                     value: "Open",
    //                   },
    //                   {
    //                     text: "Closed",
    //                     value: "Closed",
    //                   },
    //                   {
    //                     text: "Cancelled",
    //                     value: "Cancelled",
    //                   },
    //                 ],
    //                 applicableOn: [
    //                   "ON_STATE_TO_IN_REVIEW",
    //                 ],
    //                 deleteDisabled: true,
    //                 validationAttribute: "PO Status",
    //                 deleteInFormDisabled: true,
    //                 applicableValidationSchema: true,
    //               },
    //               {
    //                 name: "po-supplier-built-in",
    //                 type: "supplier",
    //                 index: 1,
    //                 label: "Supplier ",
    //                 tabId: "details",
    //                 applicableOn: [
    //                   "ON_STATE_TO_IN_REVIEW",
    //                 ],
    //                 deleteDisabled: true,
    //                 validationAttribute: "Supplier",
    //                 deleteInFormDisabled: true,
    //                 applicableValidationSchema: true,
    //               },
    //               {
    //                 name: "po-items-built-in",
    //                 type: "purchaseorder",
    //                 index: 2,
    //                 label: "Purchase Order",
    //                 tabId: "lineitems",
    //                 applicableOn: [
    //                   "ON_STATE_TO_IN_REVIEW",
    //                 ],
    //                 deleteDisabled: true,
    //                 validationAttribute: "Purchase Order",
    //                 deleteInFormDisabled: true,
    //                 applicableValidationSchema: true,
    //               },
    //               {
    //                 label: "form.builder.approvals",
    //                 type: "poapprovals",
    //                 tabId: "details",
    //                 deleteDisabled: false,
    //                 name: "fb-po-approvals-kqqix31p",
    //                 uniqueSchemaItem: true,
    //                 index: 3,
    //               },
    //             ],
    //           },
    //         },
    //         employeeId: adminEmployee.id as unknown as string,
    //         sessionId: loginResponse.sessionId as unknown as string,
    //       }).then((response) => {
    //         createdPOFormDocument = response;
    //         cy.drAPIApproveAndRelease({
    //           documentId: createdPOFormDocument.id,
    //           payload: {
    //             effectiveDate: (new Date()).toISOString(),
    //             documentType: { id: approvalRequestDocumentType[0].id },
    //             formDocument: { id: initialArDocument[0].id },
    //             approversWithSignatures: [{ approver: { id: adminEmployee.id } }],
    //           },
    //           employeeId: adminEmployee.id,
    //           sessionId: loginResponse.sessionId,
    //         }).then(() => {
    //           cy.poAPICreatePO({
    //             payload: {
    //               name: "",
    //               attachments: [],
    //               referenceTo: [],
    //               formDocument: { id: createdPOFormDocument.id },
    //               description: "API PO document",
    //               revisionChangeType: RevisionChangeType.NextRevision,
    //               document: {
    //                 docId: "PO-00001",
    //                 documentType: {
    //                   id: purchaseOrderDocumentType[0].id,
    //                 },
    //                 securityList: {
    //                   operators: [],
    //                   securityEmployees: [],
    //                   securityGroups: [
    //                     {
    //                       id: group.body[0].id,
    //                     },
    //                   ],
    //                 },
    //               },
    //               formInput: {
    //                 "po-items-built-in": {
    //                   items: [{
    //                     id: "kqqj708c",
    //                     type: "service",
    //                     date: (new Date()).toISOString(),
    //                     tax: false,
    //                     capitalEquipment: false,
    //                     isTraceabilityRequired: false,
    //                     description: "office cleaning",
    //                     serviceId: "cleaning",
    //                     units: "hours",
    //                     order: 5,
    //                     glCode: "code 1",
    //                     unitPrice: 30,
    //                     received: 0,
    //                     totalAmount: "150.00",
    //                     formattedDate: (new Date()).toLocaleDateString("en-US"),
    //                     index: 0,
    //                   }],
    //                   tax: "0.00",
    //                   taxRate: 9.25,
    //                   subTotal: "150.00",
    //                   totalAmount: "150.00",
    //                   shippingCost: "0.00",
    //                   currency: "USD",
    //                   exchangeRate: 1,
    //                   totalInUSD: "150.00",
    //                   dateOfExchangeRate: "",
    //                 },
    //                 "po-status-built-in": "Open",
    //               },
    //             },
    //             employeeId: adminEmployee.id,
    //             sessionId: loginResponse.sessionId,
    //           }).then((response) => {
    //             done();
    //           });
    //         });
    //       });
    //     });
    //   });
    // });


  });
  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create POAM from and import template", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'POAM form for custom form'", () => {
      cy.drEnterDocumentTitle({ name: "POAM Request title" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select output type document", () => {
      cy.drSelectOutputDocumentType({ documentType: "PO Approval Matrix" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Verify created form  should have specification tab", () => {
      cy.verifyTabs("overview", "matrixdetails");
    });

    it("Import template", () => {
      cy.get("#fb-import-schema")
        .attachFile("../fixtures/custom_forms_templates/po_approval_matrix.json");
    });
  });

  context("Verify that the POAM Form has the correct fields and its in correct tab", () => {
    it("Open overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Verify Predefined fields doc id doc type revision etc exist", () => {
      cy.verifyPredefiendFields();
      cy.drIsTrainingRequired({ shouldBe: false });
      cy.get("[data-cy='AttachmentFieldPresenter-field']").should("exist");
      cy.get("[data-cy='field-renderHTML']").should("exist");
    });

    it("Open matrix detail tab", () => {
      cy.drSelectMatrixDetailsTab();
    });

    it("Verify POAM matrix exist in matrix detail tab", () => {
      cy.get("[data-cy^='poApprovalMatrix-undefined']").should("exist");
    });

    it("Remove extra POAM matrix exist in matrix detail tab", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(0).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Release the POAM form", () => {
    it("Approve and release the form", () => {
      cy.drApproveAndReleaseDocumentwithoutApi();
    });

    it("Verify form is released", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.RELEASED,
        title: "Document List",
        docId: "FM-00002",
        revision: "Rev 1",
      });
    });
  });

  context("Create the POAM", () => {
    it("Click 'Create New'", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Verify POAM record should created", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.DRAFT,
        title: "Document List",
        docId: "POAM-00001",
        revision: "Rev 1",
      });
    });

    it("Enter title 'POAM Record'", () => {
      cy.drEnterDocumentTitle({ name: "POAM Document" });
    });

    it(`Enter description as 'POAM  description'`, () => {
      cy.drEnterDocumentDescription({ description: "POAM description" });
      cy.pause();
    });

    it("Click on save", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("navigate to Matrix detail tab", () => {
      cy.drSelectMatrixDetailsTab();
    });

    it("Click add item", () => {
      // cy.get(`[data-cy="form.builder.add.item"]`).arrowClick();
      cy.poAddNewFieldItem();
      cy.pause();
      cy.get(`[data-cy="name"]`).arrowType("Level-1");
      cy.get(`[data-cy="limit"]`).arrowType("1000");
      cy.get(`[data-cy="signatures.0.employees"]`).autocompleteSelect(USERS[1].name);
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });

    // it("Add another level", () => {
    //   cy.poAddNewFieldItem();
    //   cy.get(`[data-cy="name"]`).arrowType("Level-2");
    //   cy.get(`[data-cy="limit"]`).arrowType("3000");
    //   cy.get(`[data-cy="signatures.0.employees"]`).autocompleteSelect(USERS[2].name);
    //   cy.get(`[data-cy="common.add"]`).arrowClick();
    // });

    // it("Approve and release the form", () => {
    //   cy.drApproveAndReleaseDocumentwithoutApi();
    // });

    // it("Verify POAM is released", () => {
    //   cy.verifyHeaderInfoContent({
    //     status: STATUS_TYPES_LABEL.RELEASED,
    //     title: "Document List",
    //     docId: "POAM-00001",
    //     revision: "Rev 1",
    //   });
    // });
  });

  context("Add/edit POAM level", () => {
    // it("navigate to Matrix detail tab", () => {
    //   cy.drSelectMatrixDetailsTab();
    // });

    // it("Add one more level level-3 limit 5000", () => {
    //   cy.poAddNewFieldItem();
    //   cy.get(`[data-cy="name"]`).arrowType("Level-3");
    //   cy.get(`[data-cy="limit"]`).arrowType("5000");
    //   cy.get(`[data-cy="signatures.0.groups"]`).autocompleteSelect("Everyone");
    //   cy.get(`[data-cy="signatures.0.employees"]`).autocompleteSelect(USERS[3].name);
    //   cy.get(`[data-cy="common.add"]`).arrowClick();
    // });

    // it("Edit level-1 and increase Approver limit", () => {
    //   cy.contains("Level-1").arrowClick();
    // });

    it("update item and cancel those changes", () => {
      cy.contains("Level-1").arrowClick();
      cy.get(`[data-cy="limit"]`).clear().arrowType("2500");
      cy.get(`[data-cy="threshold"]`).clear().arrowType("25");
      // cy.get(`[data-cy="signatures.0.employees"]`).parent().find("svg").first().arrowClick();
      // cy.get(`[data-cy="signatures.0.employees"]`).clear().autocompleteSelect(USERS[4].name);
      // cy.get(`[data-cy="common.add"]`).arrowClick();
      cy.get(`[data-cy="common.cancel"]`).arrowClick();
    });

    it("update item again", () => {
      cy.contains("Level-1").arrowClick();
      // cy.get(`[data-cy="limit"]`).clear().arrowType("2500");
      cy.get(`[data-cy="threshold"]`).clear().arrowType("25");
      // cy.get(`[data-cy="signatures.0.employees"]`).parent().find("svg").first().arrowClick();
      // cy.get(`[data-cy="signatures.0.employees"]`).clear().autocompleteSelect(USERS[4].name);
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });

    it("Add another level", () => {
      cy.poAddNewFieldItem();
      cy.get(`[data-cy="name"]`).arrowType("Level-2");
      cy.get(`[data-cy="limit"]`).arrowType("2000");
      cy.get(`[data-cy="threshold"]`).clear().arrowType("20");
      cy.get(`[data-cy="signatures.0.employees"]`).autocompleteSelect(USERS[2].name);
      cy.get(`[data-cy="common.add"]`).arrowClick();
      cy.pause();
    });

    it("Add another level", () => {
      cy.poAddNewFieldItem();
      cy.get(`[data-cy="name"]`).arrowType("Level-3");
      cy.get(`[data-cy="limit"]`).arrowType("3000");
      cy.get(`[data-cy="threshold"]`).clear().arrowType("30");
      cy.get(`[data-cy="signatures.0.employees"]`).autocompleteSelect(USERS[3].name);
      cy.get(`[data-cy="common.add"]`).arrowClick();
    });

    it("update another item", () => {
      cy.contains("Level-3").arrowClick();
      // cy.get(`[data-cy="limit"]`).clear().arrowType("2500");
      cy.get(`[data-cy="threshold"]`).clear().arrowType("37");
      // cy.get(`[data-cy="signatures.0.employees"]`).parent().find("svg").first().arrowClick();
      // cy.get(`[data-cy="signatures.0.employees"]`).clear().autocompleteSelect(USERS[4].name);
      cy.get(`[data-cy="common.add"]`).arrowClick();
      // cy.get(`[data-cy="common.cancel"]`).arrowClick();
    });

    it("verify that threshold field should update", () => {
      cy.contains("37").should("exist");
    });

    // it("Click on save", () => {
    //   cy.drClickCreateDocumentWithoutApiCall();
    // });

    it("Add another level", () => {
      cy.poAddNewFieldItem();
      cy.get(`[data-cy="common.cancel"]`).arrowClick();
    });

  });

  context("Filter each column entering letters, then numbers", () => {

    it("Filter by name column", () => {
      cy.get(`[aria-colindex="1"] .k-filtercell > input`).clear().arrowType("Level-3").wait(500);
      cy.get(`[aria-colindex="1"] .k-clear-button-visible`).should("be.visible").arrowClick().wait(500);
    });

    it("Filter by limit column", () => {
      cy.get(`[aria-colindex="2"] .k-filtercell > input`).clear().arrowType("2000").wait(500);
      cy.get(`[aria-colindex="2"] .k-clear-button-visible`).should("be.visible").arrowClick().wait(500);
    });

    it("Filter by threshold column", () => {
      cy.get(`[aria-colindex="3"] .k-filtercell > input`).clear().arrowType("25").wait(500);
      cy.get(`[aria-colindex="3"] .k-clear-button-visible`).should("be.visible").arrowClick().wait(500);
    });

  });

  context("Release the POAM form", () => {
    it("Approve and release the POAM", () => {
      cy.drApproveAndReleaseDocumentwithoutApi();
    });

    it("Verify that the POAM Form can be released without any error", () => {
      cy.verifyHeaderInfoContent({
        status: STATUS_TYPES_LABEL.RELEASED,
        title: "Document List",
        docId: "POAM-00001",
        revision: "Rev 1",
      });
    });
  });

  // context("Create/Open a PO", () => {

  //   // it("Navigate to PO", () => {
  //   //   cy.navigToPurchaseOrderWithoutApi();
  //   // });

  //   // it("Select created PO ", () => {
  //   //   cy.contains("PO-00001").arrowClick();
  //   //   cy.progressBarShouldNotExist();
  //   // });

  //   // context("Add line items", () => {
  //   //   it("Open line items tab", () => {
  //   //     cy.drSelectLineItems();
  //   //     cy.progressBarShouldNotExist();
  //   //     cy.listLoadingElementShouldNotExist();
  //   //   });

  //   //   it("Click on 'Add item' button", () => {
  //   //     cy.poAddNewFieldItem();
  //   //   });

  //   //   it("Enter Quantity Ordered", () => {
  //   //     cy.poEnterQuantityOrdered({ quantity: "20" });
  //   //     cy.progressBarShouldNotExist();
  //   //     cy.listLoadingElementShouldNotExist();
  //   //   });

  //   //   it("Select Units", () => {
  //   //     cy.poSelectUnits();
  //   //     cy.progressBarShouldNotExist();
  //   //     cy.listLoadingElementShouldNotExist();
  //   //   });

  //   //   it("Enter Supplier Part Number", () => {
  //   //     cy.poEnterSupplierPartNumber({ partNumber: "PRT-00005" });
  //   //     cy.progressBarShouldNotExist();
  //   //     cy.listLoadingElementShouldNotExist();
  //   //   });

  //   //   it("Enter Units price", () => {
  //   //     cy.poNumberOfUnits({ number: "200" });
  //   //     cy.progressBarShouldNotExist();
  //   //     cy.listLoadingElementShouldNotExist();
  //   //   });

  //   //   it("Add Required Date", () => {
  //   //     cy.get("input[name^=date]").parent().find("button").arrowClick();
  //   //     cy.get(".MuiPickersDay-daySelected").arrowClick();
  //   //     cy.progressBarShouldNotExist();
  //   //     cy.listLoadingElementShouldNotExist();
  //   //   });

  //   //   it("Check Tax box", () => {
  //   //     cy.poSelectTaxCheckbox();
  //   //     cy.progressBarShouldNotExist();
  //   //     cy.listLoadingElementShouldNotExist();
  //   //   });

  //   //   it("Click on 'Add' inside PO dialog box", () => {
  //   //     cy.poAddPOButtonClick();
  //   //     cy.progressBarShouldNotExist();
  //   //     cy.listLoadingElementShouldNotExist();
  //   //   });

  //   //   it("Save PO", () => {
  //   //     cy.poSaveDocument();
  //   //     cy.progressBarShouldNotExist();
  //   //     cy.listLoadingElementShouldNotExist();
  //   //   });
  //   // });

  //   // context("Verify that the POAM is enforced", () => {
  //   //   it("Navigate to details tab", () => {
  //   //     cy.drSelectDetailsTab();
  //   //   });

  //   //   it("Add Approver which not satisfied the  POAM criteria", () => {
  //   //     cy.poAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
  //   //   });

  //   //   it("Click Submit for Approval", () => {
  //   //     cy.pmSubmitForApprovalWithoutAPI();
  //   //   });

  //   //   it(`Verify that the POAM is enforced
  //   //   (Can't release PO that has amount greater than maximal limit set in PO matrix)`, () => {
  //   //     cy.checkToastMessageIsEqual({
  //   //       message: "Can't release PO that has amount greater than maximal limit set in PO matrix",
  //   //     });
  //   //   });

  //   //   it("Open line items tab", () => {
  //   //     cy.drSelectLineItems();
  //   //     cy.progressBarShouldNotExist();
  //   //     cy.listLoadingElementShouldNotExist();
  //   //   });

  //   //   it("delete line item", () => {
  //   //     cy.get("[data-cy=\"poItems\"]").eq(1).find("td").eq(0).click();
  //   //     cy.progressBarShouldNotExist();
  //   //     cy.listLoadingElementShouldNotExist();
  //   //   });

  //   //   it("Navigate to details tab", () => {
  //   //     cy.drSelectDetailsTab();
  //   //   });

  //   //   it("Add Approver which satisfied the  POAM criteria", () => {
  //   //     cy.poAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
  //   //   });

  //   //   it("Verify The correct approver should be required based on the total amount", () => {
  //   //     cy.get("[data-cy=\"Level-1 PO Approval sig. 1\"]").should("exist");
  //   //     cy.get(`[data-cy="check-circle-primary"]`).should("exist");
  //   //     cy.get("[data-cy='check-circle-primary'] svg").should("have.css", "color", "rgb(13, 183, 141)");
  //   //   });
  //   // });

  // });

  // context("Revise the POAM Form", () => {
  //   it("Navigate to document list", () => {
  //     cy.navigToDocumentList();
  //   });

  //   it("Click on POAM released form", () => {
  //     cy.contains("FM-00002").arrowClick();
  //     cy.progressBarShouldNotExist();
  //   });

  //   it("Revise the POAM form", () => {
  //     cy.drClickReviseDocument();
  //   });

  //   it("Click on save", () => {
  //     cy.drClickCreateDocumentWithoutApiCall();
  //   });

  //   it("Verify form is revised to rev2", () => {
  //     cy.verifyHeaderInfoContent({
  //       status: STATUS_TYPES_LABEL.DRAFT,
  //       title: "Document List",
  //       docId: "FM-00002",
  //       revision: "Rev 2",
  //     });
  //   });

  //   it("Add TextField to overview tab", () => {
  //     cy.fbAddNewFieldWhenHiddenLastPlace();
  //     cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
  //     cy.fbEnterNameValue({ name: "label", value: "textfield-wo-ch" });
  //     cy.fbAddNewFieldButton();
  //   });

  //   it("Navigate to approval tab", () => {
  //     cy.drSelectMatrixDetailsTab();
  //   });

  //   it("Add Checkbox group with validation", () => {
  //     cy.fbAddNewFieldWhenHiddenLastPlace();
  //     cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
  //     cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
  //     cy.fbGroupOptions("1", "2", "3");
  //     cy.fbOpenValidation();
  //     cy.fbFieldRequiredIf({ name: "textfield-wo-ch", value: "test" });
  //     cy.fbAddNewFieldButton();
  //   });
  // });

  // context("Edit the field and switch the tab and verify no data loss", () => {
  //   it("Edit the field", () => {
  //     cy.get("[data-cy='edit-schema-item']").last().arrowClick({ force: true });
  //     cy.get("[data-cy='options']").clear();
  //     cy.fbGroupOptions("A", "B", "C");
  //     cy.fbAddNewFieldButton();
  //     cy.drClickCreateDocumentWithoutApiCall();
  //   });

  //   it("Select the matrix detail tab", () => {
  //     cy.drSelectOverviewTab();
  //   });

  //   it("Change the label", () => {
  //     cy.get("[data-cy='edit-schema-item']").last().arrowClick({ force: true });
  //     cy.fbEnterNameValue({ name: "label", value: "textfield-for_edited" });
  //     cy.fbAddNewFieldButton();
  //   });

  //   it("Select the MAtrix detail tab", () => {
  //     cy.drClickCreateDocumentWithoutApiCall();
  //     cy.drSelectMatrixDetailsTab();
  //   });

  //   it("Verify modification related to checkbox not loose on tab switch", () => {
  //     cy.get("[value='A']").should("exist");
  //   });

  //   it("Select the matrix detail tab", () => {
  //     cy.drSelectOverviewTab();
  //   });

  //   it("Text field should have vaue test", () => {
  //     cy.get("[data-cy='textfield-for_edited']").should("exist");
  //   });

  //   it("Click on ‘Approve & Release’", () => {
  //     cy.drApproveAndReleaseDocumentWithoutSelectingForm();
  //   });

  //   it("Verify that the POAM Form can be released without any error", () => {
  //     cy.verifyHeaderInfoContent({
  //       status: STATUS_TYPES_LABEL.RELEASED,
  //       title: "Document List",
  //       docId: "FM-00002",
  //       revision: "Rev 2",
  //     });
  //   });
  // });

  // context("Upgrade document to new form rev2", () => {
  //   it("Navigate to document list", () => {
  //     cy.navigToDocumentList();
  //   });

  //   it("Click on POAM released", () => {
  //     cy.contains("POAM-00001").arrowClick();
  //     cy.progressBarShouldNotExist();
  //   });

  //   it("Revise the POAM", () => {
  //     cy.drClickReviseDocument();
  //   });

  //   it("Click on save", () => {
  //     cy.drClickCreateDocumentWithoutApiCall();
  //   });

  //   it("Verify POAM is revised to rev2", () => {
  //     cy.verifyHeaderInfoContent({
  //       status: STATUS_TYPES_LABEL.DRAFT,
  //       title: "Document List",
  //       docId: "POAM-00001",
  //       revision: "Rev 2",
  //     });
  //   });

  //   it("Click on upgrade to new form", () => {
  //     cy.get(`button[data-cy="formUpgradeButton"]`).arrowClick();
  //     cy.get(`button[id="UpgradeToLatest-proceed"]`).arrowClick();
  //     cy.progressBarShouldNotExist();
  //   });

  //   it("Verify that it is upgraded from the latest revision of the Form", () => {
  //     cy.get("[data-cy='common.revision']").parent().should("contain.text", "FM-00002");
  //     cy.get("[data-cy='common.revision']").should("contain.text", "Revision");
  //     cy.get("[data-cy='common.revision']").parent().should("contain.text", "2");
  //     cy.get("[data-cy='common.revision']").parent().should("contain.text",
  //       moment().tz("America/Los_Angeles").format("MM/DD/YYYY"));
  //   });

  //   // context("Verify that all changes made on Form rev 2 are there", () => {
  //   //   it("Text field should exist", () => {
  //   //     cy.get("[data-cy='textfield-for_edited']").should("exist");
  //   //   });

  //   //   it("Enter value in text field", () => {
  //   //     cy.get("[data-cy^='textfield-wo-ch'] input").arrowType("test");
  //   //   });

  //   //   it("Select the Matrix detail tab", () => {
  //   //     cy.drSelectMatrixDetailsTab();
  //   //   });

  //   //   it("Verify modification related to checkbox not loose on tab switch", () => {
  //   //     cy.get("[value='A']").should("exist");
  //   //   });
  //   // });
  // });

  // context("Verify that the validations set on different tabs are working without error", () => {
  //   it("Select the change detail tab", () => {
  //     cy.drSelectOverviewTab();
  //   });

  //   it("Enter value in text field", () => {
  //     cy.get("[data-cy^='textfield-wo-ch'] input").clear().arrowType("test");
  //   });

  //   it("Click on save", () => {
  //     cy.drClickCreateDocumentWithoutApiCall();
  //   });

  //   it("Select the matrix detail tab", () => {
  //     cy.drSelectMatrixDetailsTab();
  //   });

  //   it("Verify that the validation works correctly", () => {
  //     cy.contains(
  //       "The Checkbox field is required when textfield-for_edited is test.").should("exist");
  //   });
  // });

  // context(`Verify that all changes are being saved and
  // that there’s no data loss while moving from one tab to another`, () => {
  //   it("Select the matrix detail tab", () => {
  //     cy.drSelectMatrixDetailsTab();
  //   });

  //   it("Verify modification related to checkbox not loose on tab switch", () => {
  //     cy.get("[value='A']").should("exist");
  //     cy.get("[value='A']").arrowClick();
  //   });

  //   it("Click on save", () => {
  //     cy.drClickCreateDocumentWithoutApiCall();
  //   });

  //   it("Select the Matrix detail tab", () => {
  //     cy.drSelectOverviewTab();
  //   });

  //   it("Text field should have vaue test", () => {
  //     cy.get("[data-cy='textfield-for_edited']").should("exist");
  //     cy.get("[data-cy^='textfield-wo-ch'] input").should("have.value", "test");
  //   });

  //   it("Select the matrix detail tab", () => {
  //     cy.drSelectMatrixDetailsTab();
  //   });

  //   it("Verify modification related to checkbox not loose on tab switch", () => {
  //     cy.get("[value='A']").should("be.checked");
  //   });
  // });

  // context("Add/edit POAM levels", () => {
  //   it("navigate to Matrix detail tab", () => {
  //     cy.drSelectMatrixDetailsTab();
  //   });

  //   it("Add one more level level-3 limit 5000", () => {
  //     cy.poAddNewFieldItem();
  //     cy.get(`[data-cy="name"]`).arrowType("Level-3");
  //     cy.get(`[data-cy="limit"]`).arrowType("5000");
  //     cy.get(`[data-cy="signatures.0.groups"]`).autocompleteSelect("Everyone");
  //     cy.get(`[data-cy="signatures.0.employees"]`).autocompleteSelect(USERS[3].name);
  //     cy.get(`[data-cy="common.add"]`).arrowClick();
  //   });

  //   it("Edit level-1 and increase Approver limit", () => {
  //     cy.contains("Level-1").arrowClick();
  //   });

  //   it("update item", () => {
  //     cy.get(`[data-cy="limit"]`).clear().arrowType("6000");
  //     cy.get(`[data-cy="signatures.0.employees"]`).parent().find("svg").first().arrowClick();
  //     cy.get(`[data-cy="signatures.0.employees"]`).clear().autocompleteSelect(USERS[4].name);
  //     cy.get(`[data-cy="common.add"]`).arrowClick();
  //   });

  //   it("Click on save", () => {
  //     cy.drClickCreateDocumentWithoutApiCall();
  //   });

  //   it("Approve and release the POAM", () => {
  //     cy.drApproveAndReleaseDocumentwithoutApi();
  //   });

  //   it("Verify that the POAM Form can be released without any error", () => {
  //     cy.verifyHeaderInfoContent({
  //       status: STATUS_TYPES_LABEL.RELEASED,
  //       title: "Document List",
  //       docId: "POAM-00001",
  //       revision: "Rev 2",
  //     });
  //   });
  // });


  // context("Open the PO and validate as per recent POAM", () => {
  //   it("Navigate to PO", () => {
  //     cy.navigToPurchaseOrderWithoutApi();
  //   });

  //   it("Click on PO ", () => {
  //     cy.contains("PO-00001").arrowClick();
  //     cy.progressBarShouldNotExist();
  //     cy.wait(2000);
  //   });

  //   it("Add Approver which satisfied the  POAM criteria", () => {
  //     cy.get(".MuiChip-deleteIcon").first().arrowClick();
  //     cy.poAddApproverOnApproverListWithoutApi({ approver: USERS[2].name });
  //   });

  //   it("verify that he will now fulfill the required POAM signature", () => {
  //     cy.get("[data-cy=\"Level-2 PO Approval sig. 1\"]").should("exist");
  //     cy.get(`[data-cy="check-circle-primary"]`).should("exist");
  //     cy.get("[data-cy='check-circle-primary'] svg").should("have.css", "color", "rgb(13, 183, 141)");
  //   });

  //   it("Add Approver which not satisfied the  POAM criteria which was removed from POAM", () => {
  //     cy.get(".MuiChip-deleteIcon").first().arrowClick();
  //     cy.poAddApproverOnApproverListWithoutApi({ approver: USERS[1].name });
  //   });

  //   // temp fix
  //   it("navigate to Matrix detail tab", () => {
  //     cy.drSelectLineItems();
  //     cy.drSelectDetailsTab();
  //   });

  //   it(`Verify the approver which was removed from the level or group,
  //   no longer fulfiller the required POAM signature`, () => {
  //     cy.get("[data-cy=\"Level-2 PO Approval sig. 1\"]").should("exist");
  //     cy.get(`[data-cy="check-circle-disabled"]`).should("exist");
  //     cy.get("[data-cy='check-circle-disabled'] svg").should("have.css", "color", "rgb(77, 77, 77)");
  //   });
  // });
});
export { };

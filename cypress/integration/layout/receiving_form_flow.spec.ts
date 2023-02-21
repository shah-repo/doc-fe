/* eslint-disable max-len */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import "moment-timezone";
import { DOC_TYPE_GROUP } from "../../../src/state/ducks/documentRevisions/documentType/types";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { Part } from "../../utils/constants/documentTypes/part";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

const ADMIN_USER = USERS[1];
const FIRST_USER = USERS[2];
const SECOND_USER = USERS[3];
const THIRD_USER = USERS[4];

let createdCompany;
let adminEmployeeLoginResponse;
let adminEmployee;
let formDocumentType;
let approvalRequestDocumentType;
let initialArDocument;
let group;
let receivableDocumentType;
let supplierDocumentType;
let createdSupplierFormDocument;
let createdSupplierDocument;
let partDocumentType;
let createdPartDocument;

const PART_DOCUMENT_TYPE_NAME = "Part";
const SupplierFormTitle = "Supplier form";
const LFPO =  {
  documentTypeName: "Lot From Purchase Order Form",
  documentTypeAcronym: "LFPO",
  group: DOC_TYPE_GROUP.FORM,
  isQms: true,
};

context("Receiving landing page test", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.intercept({ url: "/api/v1/document_revisions/search", middleware: true }, (req) => {
      req.continue((res) => {
        res.setDelay(100);
      });
    }).as("Search");
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
              LFPO,
              Part,
            ],
          }, sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === ADMIN_USER.email);
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          receivableDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Receivable");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          partDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, PART_DOCUMENT_TYPE_NAME);
          done();
        });
      });
    });

    it("[API]Login admin", (done: any) => {
      cy.authApiLogin({
        email: ADMIN_USER.email,
      }).then((response) => {
        adminEmployeeLoginResponse = response;
        done();
      });
    });

    it("[API]Create Supplier form", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: adminEmployeeLoginResponse.sessionId,
        employeeId: adminEmployee.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: adminEmployeeLoginResponse.sessionId,
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
            sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
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
              sessionId: adminEmployeeLoginResponse.sessionId,
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
                sessionId: adminEmployeeLoginResponse.sessionId,
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
                  sessionId: adminEmployeeLoginResponse.sessionId,
                }).then(() => {
                  done();
                });
              });
            });
          });
        });
      });
    });

    it("[API]Create part documents", (done: any) => {
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
        sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
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
          sessionId: adminEmployeeLoginResponse.sessionId,
        }).then(() =>  done());
      });
    });

    it("[API]Create Receiving form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>New Receiving Form Description</p>",
          document: {
            docId: "FM-00004",
            documentType: {
              id: formDocumentType[0].id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
            },
          },
          name: "New Receiving Form",
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
              name: "receivable-test",
              applicableOn: ["ON_STATE_TO_IN_REVIEW"],
            },
            {
              label: "form.builder.approvals",
              tabId: "overview",
              type: "approvals",
              deleteDisabled: false,
              name: "fb-po-approvals",
              uniqueSchemaItem: true,
              index: 1,
            }],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
      }).then(() => {
        done();
      });
    });

    it("[API]Create Another Receiving form", (done: any) => {
      cy.drCreateDocumentRevision({
        payload: {
          attachments: [],
          description: "<p>Document form for Another Receivable</p>",
          document: {
            docId: "FM-00005",
            documentType: {
              id: formDocumentType[0].id,
            },
            securityList: {
              operators: [],
              securityEmployees: [],
              securityGroups: [],
            },
          },
          name: "Another Receivable form",
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
              name: "receivable-test",
              applicableOn: ["ON_STATE_TO_IN_REVIEW"],
            },
            {
              label: "form.builder.approvals",
              tabId: "overview",
              type: "approvals",
              deleteDisabled: false,
              name: "fb-po-approvals",
              uniqueSchemaItem: true,
              index: 1,
            }],
          },
        },
        employeeId: adminEmployee.id as unknown as string,
        sessionId: adminEmployeeLoginResponse.sessionId as unknown as string,
      }).then(() => {
        done();
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  context("Create receiving  form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Filter document by ID", () => {
      cy.dlClearFilters();
      cy.contains("FM-00004").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify that Approvals field is automatically added", () => {
      cy.get("input[data-cy=\"fb-approvals-fb-po-approvals\"]").should("exist");
    });

    it("Add Receive Purchase Order component", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Receive Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-receive-purchase-order" });
      cy.fbAddNewFieldButton();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Verify Form opens to the Overview tab by default and it contains", () => {
    it("Verify that two tabs are displayed, Overview and Details tab", () => {
      cy.get("[data-cy='tabId.overview']").should("exist");
      cy.get("[data-cy='tabId.details']").should("exist");
    });

    it("Verify Title", () => {
      cy.get("[data-cy=\"field-name\"]").contains("New Receiving Form")
        .should("exist");
    });

    it("Verify Description", () => {
      cy.get("[data-cy=\"description\"]").contains("New Receiving Form Description")
        .should("exist");
    });

    it("Verify Document Type", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").contains("Document Type")
        .should("exist");
    });

    it("Verify Document ID", () => {
      cy.get("[data-cy=\"field-document.docId\"]").contains("Document ID")
        .should("exist");
    });

    it("Verify Revision Stage", () => {
      // eslint-disable-next-line max-len
      cy.get("[id=\"sm-tabpanel-0\"] [class^=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6\"]").eq(2).contains("Revision Stage")
        .should("exist");
    });

    it("Verify Numeric", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Numeric")
        .should("exist");
    });

    it("Verify Numeric Alpha", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Numeric Alpha")
        .should("exist");
    });

    it("Verify Alpha", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Alpha")
        .should("exist");
    });

    it("Verify Training Required", () => {
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("exist");
    });

    it("Verify Output Document Type", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").contains("Output Document Type")
        .should("exist");
    });

    it("Verify Output Document Type as Purchase Order", () => {
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Receivable")
        .should("exist");
    });

    it("Verify Approvals", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").eq(0).contains("Approvals")
        .should("exist");
    });

    it("Verify Receivable purchase order component", () => {
      cy.get("[data-cy=\"fb-receive-purchase-order\"]").contains("fb-receive-purchase-order")
        .should("exist");
    });

    it("Verify Render HTML", () => {
      cy.get("[data-cy=\"field-renderHTML\"]").contains("Render HTML")
        .should("exist");
    });
  });

  context("Move & Edit & Remove component", () => {
    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for Receiving" });
      cy.wait(1000);
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("move component", () => {
      cy.get("[data-cy='Textfield for Receiving']").trigger("mouseover");
      cy.wait(2000);
      cy.get(`[class="drag-handle"]`).eq(2)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").eq(0).arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for receiving Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(0).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Release form and export template", () => {
    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Export and save the template", () => {
      cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").eq(0).arrowClick();
      cy.get("[data-cy=\"fb-template-name\"]").arrowType("Receiving_Import");
      cy.get("[data-cy=\"common.add\"]").arrowClick();
    });
  });

  context("Create Another receiving  form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Filter document by ID", () => {
      cy.dlClearFilters();
      cy.contains("FM-00005").arrowClick();
      cy.landingPageLoadingElementShouldNotExist();
    });

    it("Verify that Approvals field is automatically added", () => {
      cy.get("input[data-cy=\"fb-approvals-fb-po-approvals\"]").should("exist");
    });

    it("Import the template", () => {
      cy.get("#fb-import-schema").attachFile("../fixtures/Receiving_Import.json");
    });

    it("Verify imported field", () => {
      cy.get("[data-cy=\"fb-receive-purchase-order\"]").contains("fb-receive-purchase-order")
        .should("exist");
    });
  });

  context("Verify Form opens to the Overview tab by default and it contains", () => {
    it("Verify that two tabs are displayed, Overview and Details tab", () => {
      cy.get("[data-cy='tabId.overview']").should("exist");
      cy.get("[data-cy='tabId.details']").should("exist");
    });

    it("Verify Title", () => {
      cy.get("[data-cy=\"field-name\"]").contains("Another Receivable form")
        .should("exist");
    });

    it("Verify Description", () => {
      cy.get("[data-cy=\"description\"]").contains("Document form for Another Receivable")
        .should("exist");
    });

    it("Verify Document Type", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").contains("Document Type")
        .should("exist");
    });

    it("Verify Document ID", () => {
      cy.get("[data-cy=\"field-document.docId\"]").contains("Document ID")
        .should("exist");
    });

    it("Verify Revision Stage", () => {
      // eslint-disable-next-line max-len
      cy.get("[id=\"sm-tabpanel-0\"] [class^=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6\"]").eq(2).contains("Revision Stage")
        .should("exist");
    });

    it("Verify Numeric", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Numeric")
        .should("exist");
    });

    it("Verify Numeric Alpha", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Numeric Alpha")
        .should("exist");
    });

    it("Verify Alpha", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Alpha")
        .should("exist");
    });

    it("Verify Training Required", () => {
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("exist");
    });

    it("Verify Output Document Type", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").contains("Output Document Type")
        .should("exist");
    });

    it("Verify Output Document Type as Purchase Order", () => {
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Receivable")
        .should("exist");
    });

    it("Verify Approvals", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").eq(0).contains("Approvals")
        .should("exist");
    });

    it("Verify Receivable purchase order component", () => {
      cy.get("[data-cy=\"fb-receive-purchase-order\"]").contains("fb-receive-purchase-order")
        .should("exist");
    });

    it("Verify Render HTML", () => {
      cy.get("[data-cy=\"field-renderHTML\"]").contains("Render HTML")
        .should("exist");
    });
  });

  context("Move & Edit & Remove component", () => {
    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for new receiving" });
      cy.wait(1000);
      cy.fbAddNewFieldButton();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });


    it("move component", () => {
      cy.get("[data-cy='Textfield for new receiving']").trigger("mouseover", { force: true });
      cy.wait(2000);
      cy.get(`[class="drag-handle"]`).eq(2)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").eq(0).arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for new receiving Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(0).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create Lot from Purchase Order Form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Lot from Purchase Order Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Lot from Purchase Order Form" });
    });

    it("Enter description 'New Lot from Purchase Order Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Lot from Purchase Order Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Lot From Purchase Order Form" });
    });

    it("Click on 'Lots' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Lots" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify that Approvals field is automatically added", () => {
      cy.get("[data-cy='form.builder.approvals']").should("exist");
    });
  });

  context("Verify Form opens to the Details tab by default and it contains", () => {
    it("Verify that two tabs are displayed, Overview and Details tab", () => {
      cy.get("[data-cy='tabId.details']").should("exist");
    });

    it("Verify Title", () => {
      cy.get("[data-cy=\"field-name\"]").contains("New Lot from Purchase Order Form")
        .should("exist");
    });

    it("Verify Description", () => {
      cy.get("[data-cy=\"description\"]").contains("New Lot from Purchase Order Form description")
        .should("exist");
    });

    it("Verify Document Type", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").contains("Document Type")
        .should("exist");
    });

    it("Verify Document Type selected", () => {
      cy.get("[data-cy=\"select.document.documentType.id\"]").contains("Lot From Purchase Order Form")
        .should("exist");
    });

    it("Verify Document ID", () => {
      cy.get("[data-cy=\"field-document.docId\"]").contains("Document ID")
        .should("exist");
    });

    it("Verify Revision Stage", () => {
      // eslint-disable-next-line max-len
      cy.get("[id=\"sm-tabpanel-0\"] [class^=\"MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6\"]").eq(2).contains("Revision Stage")
        .should("exist");
    });

    it("Verify Numeric", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Numeric")
        .should("exist");
    });

    it("Verify Numeric Alpha", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Numeric Alpha")
        .should("exist");
    });

    it("Verify Alpha", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").contains("Alpha")
        .should("exist");
    });

    it("Verify Training Required", () => {
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("exist");
    });

    it("Verify Output Document Type", () => {
      cy.get("[data-cy=\"field-outputDocumentTypes\"]").contains("Output Document Type")
        .should("exist");
    });

    it("Verify Output Document Type as Lots", () => {
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Lots")
        .should("exist");
    });

    it("Verify Render HTML", () => {
      cy.get("[data-cy=\"field-renderHTML\"]").contains("Render HTML")
        .should("exist");
    });

    it("Verify Initial Quantity", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").contains("Initial Quantity")
        .should("exist");
    });

    it("Verify Usable Quantity", () => {
      cy.get("[data-cy=\"Usable Quantity\"]").contains("Usable Quantity")
        .should("exist");
    });

    it("Verify Expiration Date", () => {
      cy.get("[data-cy=\"Expiration Date\"]").contains("Expiration Date")
        .should("exist");
    });

    it("Verify Part Selection", () => {
      cy.get("[data-cy=\"Part Selection\"]").contains("Part Selection")
        .should("exist");
    });

    it("Verify 100% Inspection Override", () => {
      cy.get("[data-cy=\"100% Inspection Override\"]").contains("100% Inspection Override")
        .should("exist");
    });

    it("Verify Approvals", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").eq(0).contains("Approvals")
        .should("exist");
    });
  });

  context("Move & Edit & Remove component", () => {
    it("Verify Add field", () => {
      cy.get("[data-cy=\"form.builder.add.field\"]").eq(0).contains("Add Field")
        .should("exist");
    });

    it("Add Receive Purchase Order component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Receive Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-receive-purchase-order" });
      cy.fbAddNewFieldButton();
    });

    it("Add component", () => {
      cy.listLoadingElementShouldNotExist();
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for LFPO" });
      cy.wait(1000);
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
    });

    it("move component", () => {
      cy.get("[data-cy='Textfield for LFPO']").trigger("mouseover");
      cy.wait(2000);
      cy.get(`[class="drag-handle"]`).eq(7)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(6)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").eq(6).arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]>div>input").clear();
      cy.fbAddLabelName({ name: "Textfield for LFPO Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(6).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Release form and export template", () => {
    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Export and save the template", () => {
      cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").eq(0).arrowClick();
      cy.get("[data-cy=\"fb-template-name\"]").arrowType("LFPO_Import");
      cy.get("[data-cy=\"common.add\"]").arrowClick();
    });
  });

  context("Create Another Lot from Purchase Order Form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click on 'Create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter title 'New Lot from Purchase Order Form'", () => {
      cy.drEnterDocumentTitle({ name: "Another Lot from Purchase Order Form" });
    });

    it("Enter description 'New Lot from Purchase Order Form description'", () => {
      cy.drEnterDocumentDescription({ description: "Another Lot from Purchase Order Form description" });
    });

    it("Click on 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Lot From Purchase Order Form" });
    });

    it("Click on 'Lots' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Lots" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify that Approvals field is automatically added", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy='form.builder.approvals']").should("exist");
    });

    it("Import the template", () => {
      cy.get("#fb-import-schema").attachFile("../downloads/LFPO_Import.json");
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Verify imported field", () => {
      cy.get("[data-cy=\"fb-receive-purchase-order\"]").contains("fb-receive-purchase-order")
        .should("exist");
    });
  });

  context("Move & Edit & Remove component", () => {
    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for Another LFPO" });
      cy.wait(1000);
      cy.fbAddNewFieldButton();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("move component", () => {
      cy.get("[data-cy='Textfield for Another LFPO']").trigger("mouseover");
      cy.wait(2000);
      cy.get(`[class="drag-handle"]`).eq(7)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(6)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").eq(6).arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for Another LFPO Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(6).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create 'Purchase Order' form", () => {
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
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
    });

    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Enter html code into 'Render HTML' field", () => {
      cy.drEnterHtmlText({
        htmlText:
          `<!DOCTYPE html>
          <html lang="en">

          <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Document</title>
              <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet" />
              <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap" rel="stylesheet" />
              <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
          </head>

          <body>
              <style>
                  html {
                      zoom: 0.2;
                  }

                  * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                      font-family: "Open Sans", sans-serif;
                      -webkit-print-color-adjust: exact;
                  }

                  .container {
                      width: 2480px;
                      padding: 80px;
                      margin: 0 auto;
                      position: relative;
                      background: #ffffff;
                  }

                  header {
                      padding-bottom: 30px;
                      border-bottom: 1px solid #d3d3d3;
                      margin-bottom: 80px;
                      height: 180px;
                  }

                  .fs41 {
                      font-size: 41px;
                  }

                  .fs34 {
                      font-size: 34px;
                  }

                  .fwb {
                      font-weight: bold;
                      letter-spacing: 1px;
                  }

                  .text-white {
                      color: white;
                  }

                  .title {
                      padding: 33px 30px;
                      background-color: #007698;
                  }

                  .title strong {
                      font-size: 34px;
                      color: white;
                  }

                  .information {
                      margin-bottom: 1.5em;
                  }

                  .information:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .information__supplier {
                      width: 1007px;
                      float: left;
                      border: 1px solid #d3d3d3;
                      min-height: 1100px;
                  }

                  .information__shipping {
                      width: 1273px;
                      float: right;
                      border: 1px solid #d3d3d3;
                      min-height: 1100px;
                  }

                  .supplier__address {
                      padding: 50px 30px;
                      border-bottom: 1px solid #d3d3d3;
                      height: 711px;
                  }

                  .supplier__contacts,
                  .billing__mail {
                      height: 220px;
                  }

                  .shipping-billing {
                      height: 314px;
                  }

                  .address-value,
                  .phone-value,
                  .fax-value,
                  .shipping-value,
                  .billing-value,
                  .data-value {
                      margin-left: 10px;
                  }

                  .supplier__contacts,
                  .supplier__info,
                  .billing__mail {
                      padding-left: 30px;
                      padding-top: 20px;
                      border-bottom: 1px solid #d3d3d3;
                  }

                  .supplier__info,
                  .billing__contacts {
                      border-bottom: none;
                      height: 200px;
                  }

                  .invoice_mail,
                  .contact_mail,
                  .data__item,
                  .total__item {
                      margin-bottom: 45px;
                  }

                  .invoice_mail div,
                  .contact_mail div {
                      float: left;
                      margin-right: 30px;
                  }

                  .data__item div {
                      float: left;
                      margin-right: 30px;
                  }

                  .data__item::after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .invoice_mail:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .contact_mail:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .data-value {
                      font-size: 34px;
                      letter-spacing: 0px;
                      color: #292929;
                  }

                  .shipping-billing {
                      padding: 50px 30px;
                      border-bottom: 1px solid #d3d3d3;
                  }

                  .shipping-billing:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .shipping,
                  .billing {
                      width: 48%;
                  }

                  .shipping {
                      float: left;
                  }

                  .billing {
                      float: right;
                  }

                  .billing__contacts {
                      border-bottom: none;
                      padding-left: 30px;
                      padding-top: 20px;
                  }

                  .data_element {
                      float: left;
                      padding-right: 10px;
                      width: 50%;
                  }

                  .list table {
                      border-spacing: 0;
                      border-collapse: collapse;
                      border: 1px solid #007698;
                  }

                  .table th {
                      text-align: center;
                  }

                  .list td {
                      border: 1px solid #d3d3d3;
                  }

                  table {
                      max-width: 100%;
                  }

                  th {
                      font-weight: 900;
                  }

                  table {
                      margin-bottom: 1.5em;
                      position: relative;
                      width: 100%;
                      z-index: 1;
                  }

                  table th,
                  table td {
                      font-family: inherit;
                      font-size: inherit;
                      padding: 12px 0px;
                      vertical-align: middle;
                      font-size: 28px;
                  }

                  #checkbox {
                      border: 0.1px solid black;
                      height: 40px;
                      width: 40px;
                      position: absolute;
                      top: 30px;
                      left: 40px;
                  }

                  .checked {
                      width: 30px;
                      height: 15px;
                      border: 2px solid;
                      position: absolute;
                      top: 18%;
                      left: 13%;
                      transform: rotate(-45deg);
                      border-top: none;
                      border-right: none;
                      /* display:none; */
                  }

                  .smallCell {
                      width: 140px;
                  }

                  section {
                      margin-bottom: 50px;
                  }

                  .comments {
                      width: 1509px;
                      border: 1px solid #d3d3d3;
                      margin-right: 100px;
                      float: left;
                  }

                  .comments__block,
                  .subtotal {
                      height: 240px;
                  }

                  .subtotal {
                      width: 635px;
                      float: left;
                      padding-top: 30px;
                  }

                  section:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .subtotal .data__item {
                      margin-bottom: 20px;
                  }

                  .total {
                      padding: 10px 50px 10px 10px;
                      width: 635px;
                      border: 1px solid #d3d3d3;
                  }

                  .total .total__item {
                      margin-bottom: 0px;
                  }

                  .total__item div {
                      float: left;
                  }

                  .total__item:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .approvals {
                      border: 1px solid #d3d3d3;
                      margin-bottom: 50px;
                      width: 2320px;
                  }

                  .directors {
                      padding: 20px 50px 20px 20px;
                  }

                  .directors div {
                      float: left;
                      margin-right: 200px;
                      width: fit-content;
                  }

                  .directors div:last-child {
                      margin-right: 0px;
                  }

                  .directors:after {
                      content: "";
                      display: block;
                      clear: both;
                  }

                  .directors ul {
                      list-style-type: none;
                      padding-top: 30px;
                  }

                  .directors ul li {
                      margin-bottom: 30px;
                      font-size: 34px;
                  }

                  .directors ul li:last-child {
                      margin-bottom: 0px;
                  }

                  .signature span {
                      font-size: 34px;
                  }

                  .notification {
                      padding-bottom: 50px;
                      border-bottom: 1px solid #d3d3d3;
                  }

                  #date {
                      position: absolute;
                      right: 80px;
                      margin-top: 10px;
                      font-weight: bold;
                      font-size: 20px;
                  }
              </style>
              <div class="container">
                  <header>
                      <div style="float: left; width: 33%;">
                          <p class="fwb fs41">Purchase Order </p>
                          <!-- <p class="fs41"style="color: #292929;">Shifamed</p> -->
                      </div>
                      <div style="float: left; width: 33%; text-align: center;"> <img src="https://doc-be-dev-public.s3.us-west-2.amazonaws.com/fbeba60d-2f25-4f35-90e8-41bb79b40df2/2020-05-21T08%3A37%3A20.213Z/shifamed-logo.png" alt="Logo" /> </div>
                      <div style="float: right;">
                          <p class="fwb fs41" style="color: #292929;">PO Number: {{documentRevision.document.docId}}-{{documentRevision.displayRevision}}<span></span></p>
                      </div>
                  </header>
                  <div style="clear: both;"></div>
                  <div class="information">
                      <div class="information__supplier">
                          <div class="title"> <strong class="fs18 text-white">SUPPLIER INFORMATION</strong> </div>
                          <div class="supplier__address">
                              <div style="float: left; margin-right: 20px; height: 100%;"> <strong style="color: #292929; font-size: 34px;">To:</strong> </div>
                              <div class="data-value">
                                  <div>{{autocompletes.po-supplier-built-in.name}}</div>
                                  <div id="to-description" style="white-space: pre;">{{{autocompletes.po-supplier-built-in.description}}}</div>
                              </div>
                          </div>
                          <div style="clear: both;"></div>
                          <div class="supplier__info">
                              <div class="data__item">
                                  <div style="width: 330px;"> <strong style="color: #292929; font-size: 34px;">Department:</strong> </div>
                                  <div class="data-value">{{documentRevision.formInput.department-k6ml6ew5}}</div>
                              </div>
                              <div class="data__item">
                                  <div style="width: 330px;"> <strong style="color: #292929; font-size: 34px;">Requestor:</strong> </div>
                                  <div class="data-value">{{autocompletes.po-requestor-autocomplete.user.name}}</div>
                              </div>
                          </div>
                      </div>
                      <div class="information__shipping">
                          <div class="title"> <strong>SHIPPING/BILLING INFORMATION</strong> </div>
                          <div class="shipping-billing" style="height: 100%">
                              <div class="shipping" style="height: 100%;width: 100%;">
                                  <div style="float: left; height: 175px; margin-right: 30px;"> <strong style="color: #292929; font-size: 34px;">Ship To:</strong> </div>
                                  <div class="data-value">
                                      <div id="shipping" style="">
                                          <div id="shipping-customer-company" style="display: none">{{documentRevision.formInput.company-ship-to-address-kn5cq5gi}}</div>
                                          <div id="shipping-third-party-company" style="display: none">{{autocompletes.third-party-company-k7f25yb6.name}} <br/>{{{autocompletes.third-party-company-k7f25yb6.description}}}</div>
                                          <div id="shipping-complete-manually" style="display: none">{{documentRevision.formInput.ship-to-address-k7f27j0k}}</div>
                                      </div>
                                  </div>
                              </div>
                              <div class="billing" style="width: 100%;margin-top: 40px;">
                                  <div style="float: left; height: 175px; margin-right: 30px;"> <strong style="color: #292929; font-size: 34px;">Bill To:</strong> </div>
                                  <div class="data-value">
                                      <div id="billing1" style="">
                                          <div id="billing-customer-company"> Shifamed <br>590 Division St <br>Campbell CA 95008 </div>
                                          <div id="billing-complete-manually" style="display: none">{{documentRevision.formInput.company-bill-to-k7f2e82a}}</div>
                                      </div>
                                      <div id="billing"></div>
                                  </div>
                              </div>
                          </div>
                          <div class="billing__mail">
                              <div class="invoice_mail">
                                  <div style="float: left; width: 220px;"> <strong style="color: #292929; font-size: 34px;">Invoices to:</strong> </div>
                                  <div class="data-value" style="float: left;">accounting@shifamed.com </div>
                              </div>
                              <div class="contact_mail">
                                  <div style="float: left; width: 202px;"> <strong style="color: #292929; font-size: 34px;">Contact:</strong> </div>
                                  <div class="data-value" style="float: left;">{{documentRevision.formInput.contact-email-kl7slf5l}}</div>
                              </div>
                          </div>
                          <div class="billing__contacts">
                              <div class="data_element">
                                  <div class="data__item">
                                      <div style="width: 160px;"> <strong style="color: #292929; font-size: 34px;">Shipping:</strong> </div>
                                      <div class="data-value">{{documentRevision.formInput.shipping-k6mletok}}</div>
                                  </div>
                                  <div class="data__item">
                                      <div style="width: 160px;"> <strong style="color: #292929; font-size: 34px;">Terms:</strong> </div>
                                      <div class="data-value">{{documentRevision.formInput.terms-k6mlftzn}}</div>
                                  </div>
                              </div>
                              <div class="data_element">
                                  <div class="data__item">
                                      <div style="width: 170px;"> <strong style="color: #292929; font-size: 34px;">Ordered:</strong> </div>
                                      <div id="ordered" class="data-value"> </div>
                                  </div>
                                  <div class="data__item">
                                      <div style="width: 170px;"> <strong style="color: #292929; font-size: 34px;">Quote:</strong> </div>
                                      <div class="data-value">{{documentRevision.formInput.quotation-number-k7dwg3xr}} </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="list">
                      <table id="items-table">
                          <thead>
                              <tr class="title text-white fwb" style="text-transform: uppercase;">
                                  <th style="text-align: center;">Item</th>
                                  <th style="text-align: center;width: 200px;">Order Qty</th>
                                  <th style="text-align: center;">Units</th>
                                  <th style="text-align: center;width: 400px;">SUP PN / Date Required</th>
                                  <th style="text-align: center;">Description / PN</th>
                                  <th style="text-align: center;">Price</th>
                                  <th style="text-align: center;width: 230px;">Ext. Amount</th>
                                  <th class="smallCell" style="text-align: center;">Tax</th>
                              </tr>
                          </thead>
                          <tbody> {{#documentRevision.formInput.po-items-built-in.items}}
                              <tr title="table-item">
                                  <td class="data-value" style="text-align: center;">{{index++}}</td>
                                  <td class="data-value" style="text-align: center;">{{order}}</td>
                                  <td class="data-value" style="text-align: center;">{{units}}</td>
                                  <td class="data-value" style="text-align: center;">{{supplierPartNumber}}<br /> {{formattedDate}}</td>
                                  <td class="data-value" style="text-align: center;"> {{partNumberTitle}}{{^partNumberTitle}}{{description}}{{^description}}{{/description}}{{/partNumberTitle}} <br /> {{partNumberDocId}}{{^partNumberDocId}}{{serviceId}}{{^serviceId}}{{/serviceId}}{{/partNumberDocId}}</td>
                                  </td>
                                  <td class="data-value" style="text-align: center;"><span class="currency"></span>{{unitPrice}}</td>
                                  <td class="data-value" style="text-align: center;"><span class="currency"></span>{{totalAmount}}</td>
                                  <td style="position: relative; height: 188px;">
                                      <div id="checkbox">{{#tax}}&#10003;{{/tax}}</div>
                                  </td>
                              </tr>
                              <tr style="text-align: center; height: 95px;background-color: #ECECEC;">
                                  <td colspan="8" style="color: #292929; height: 95px;" class="data-value">{{glCode}}</td>
                              </tr> {{/documentRevision.formInput.po-items-built-in.items}} </tbody>
                      </table>
                  </div>
                  <section>
                      <div class="comments">
                          <div class="title"> <strong class="text-white fwb">NOTES / COMMENTS FOR SUPPLIER</strong> </div>
                          <div class="comments__block">
                              <div class="data-value" style="text-align: left; margin-left: 30px; margin-top: 30px;"> {{{documentRevision.formInput.comments-k6mlinzm}}} </div>
                          </div>
                      </div>
                      <div class="subtotal">
                          <div class="data__item">
                              <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Subtotal:</strong> </div>
                              <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.subTotal}} </div>
                          </div>
                          <div class="data__item">
                              <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Tax:</strong> </div>
                              <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.tax}} </div>
                          </div>
                          <div class="data__item">
                              <div style="width: 250px;"> <strong style="color: #292929; font-size: 34px;">Shipping Cost:</strong> </div>
                              <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.shippingCost}} </div>
                          </div>
                          <div class="total">
                              <div class="total__item">
                                  <div style="width: 268px;"> <strong style="color: #292929; font-size: 34px;">Total:</strong> </div>
                                  <div class="data-value"> <span class="currency"></span>{{documentRevision.formInput.po-items-built-in.totalAmount}} </div>
                              </div>
                          </div>
                      </div>
                  </section>
                  <div class="approvals">
                      <div class="title"> <strong class="text-white fwb">APPROVALS:<span></span></strong> </div>
                      <div class="directors">
                          <div style="margin-left: 100px;"> <strong style="color: #292929; font-size: 34px;">Name</strong> {{#documentRevision.approvals}}
                              <ul>
                                  <li>{{approver.user.name}}</li>
                              </ul> {{/documentRevision.approvals}} </div>
                          <div> <strong style="color: #292929; font-size: 34px;">Date</strong> {{#validApprovalDates}}
                              <ul>
                                  <li>{{reviewedAt}}</li>
                              </ul> {{/validApprovalDates}} </div>
                      </div>
                  </div>
                  <div class="notification">
                      <p style="color: #292929; font-size: 34px;"> <strong style="color: #292929; font-size: 34px;"> Change Notification: </strong> Supplier shall provide notification of any change or deviation to Goods and/or Services to be provided under the Purchase Order. Any change or deviation requires prior written consent. </p>
                  </div>
                  <div> </div>
                  <footer>
                      <div id="pageFooter-last" /> </footer>
              </div>
              <script>
                  var table = document.getElementById('items-table');
                  var rows = [];
                  var tempRows = table.getElementsByTagName('tr');
                  for (var i = 0; i < tempRows.length; i++) {
                      if (tempRows[i].title === "table-item") {
                          rows.push(tempRows[i]);
                      }
                  }
                  for (var i = 0; i < rows.length; i++) {
                      var index = i + 1;
                      rows[i].cells[0].innerHTML = index;
                  }
              </script>
              <script>
                  document.getElementById("to-description").innerHTML = document.getElementById("to-description").innerHTML.replace(/(<((?!br|\/br)[^>]+)>)/gi, "");

                  function formatDate(date) {
                      if (!date) {
                          return "";
                      }
                      return moment(date).format("MM/DD/YYYY");
                  }
                  document.getElementById("ordered").innerHTML = formatDate("{{documentRevision.formInput.po-order-date}}");

                  function shipping(field, options) {
                      if (field === "Customer Company") {
                          document.getElementById("shipping").style.whiteSpace = 'normal';
                          return options.customerCompany;
                      } else if (field === "Third Party Company") {
                          document.getElementById("shipping").style.whiteSpace = 'normal';
                          return options.thirdPartyCompany;
                      } else if (field === "Complete Manually") {
                          document.getElementById("shipping").style.whiteSpace = 'pre';
                          return options.completeManually;
                      } else return "";
                  };
                  document.getElementById("shipping").innerHTML = shipping("{{documentRevision.formInput.ship-to-k7f1t1lw}}", {
                      customerCompany: document.getElementById("shipping-customer-company").innerHTML,
                      thirdPartyCompany: document.getElementById("shipping-third-party-company").innerHTML,
                      completeManually: document.getElementById("shipping-complete-manually").innerHTML,
                  });

                  function billing(field, options) {
                      if (field === "Customer Company") {
                          document.getElementById("billing").style.whiteSpace = 'normal';
                          return options.customerCompany;
                      } else if (field === "Complete Manually") {
                          document.getElementById("billing").style.whiteSpace = 'pre';
                          return options.completeManually;
                      } else return "";
                  };
                  document.getElementById("billing").innerHTML = billing("{{documentRevision.formInput.bill-to-k7f29tfo}}", {
                      customerCompany: document.getElementById("billing-customer-company").innerHTML,
                      completeManually: document.getElementById("billing-complete-manually").innerHTML,
                  });

                  function getCurrency(currency) {
                      switch (currency) {
                          case "EUR":
                              return "€";
                          case "USD":
                              return "$";
                          case "GBP":
                              return "£";
                          default:
                              return "";
                      }
                  }
                  var currencyElements = document.getElementsByClassName("currency");
                  for (var i = 0; i < currencyElements.length; i++) {
                      currencyElements[i].innerHTML = getCurrency("{{documentRevision.formInput.po-items-built-in.currency}}");
                  };
                  if ("{{documentRevision.formInput.ship-to-k7f1t1lw}}" === "Customer Company") {
                      document.getElementById("shipping").innerHTML = document.getElementById("shipping").innerHTML.replace(/, /gi, "<br>");
                  };
                  if ("{{documentRevision.formInput.bill-to-k7f29tfo}}" === "Customer Company") {
                      document.getElementById("billing").innerHTML = document.getElementById("billing").innerHTML.replace(/, /gi, "<br>");
                  }
              </script>
          </body>

          </html>`,
      });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Check complete PO flow ", () => {
    it("Navigate to PO", () => {
      cy.navigToPurchaseOrder();
    });

    it("Click on 'Create PO' button", () => {
      cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Verify Requestor", () => {
      cy.get("[data-cy=\"Requestor\"]").contains("Requestor")
        .should("exist");
    });

    it("Verify Order Date", () => {
      cy.get("[data-cy=\"Order Date\"]").contains("Order Date")
        .should("exist");
    });

    it("Enter description 'New Purchase Order'", () => {
      cy.drEnterDocumentDescription({ description: "New Purchase Order" });
    });

    it("Select 'Open' for PO status", () => {
      cy.poSelectPOStatus({ status: "Open" });
    });

    it(`Select '${USERS[1].name}' for Requestor`, () => {
      cy.get("[data-cy='po-requestor-autocomplete']").arrowClick();
      cy.get("ul>li[role=option]").contains(USERS[1].name).arrowClick();
    });

    it("Select Supplier", () => {
      cy.get("[data-cy=\"po-supplier-built-in\"]").autocompleteSelect("SUP-00001 - rev 1 - API Supplier Document");
      cy.unClick();
    });

    it("Add Required Date", () => {
      cy.get("[name=\"po-order-date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Click 'Add line item' and fill the data", () => {
    it("navigate to Line Items", () => {
      cy.drSelectLineItems();
    });

    it("Click on 'Add' inside PO dialog box and check for required fields", () => {
      cy.get("[data-cy=\"form.builder.add.line.item\"]").click();
    });

    it("Select Part Number", () => {
      cy.poSelectPartNumberNew({ partNo: "PRT-00005 - 1" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "5" });
    });

    it("Select Units", () => {
      cy.poSelectUnits();
    });

    it("Select GL code", () => {
      cy.poSelectGLCode();
    });

    it("Enter number of Units", () => {
      cy.poNumberOfUnits({ number: "2" });
    });

    it("Add Required Date", () => {
      cy.get("[name=\"date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Check Tax box", () => {
      cy.poSelectTaxCheckbox();
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Save PO", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Enter Shipping Cost", () => {
      cy.poShippingCost({ number: "2" });
    });

    it("Save document", () => {
      cy.recClickSaveBtn();
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Click 'Add line item' and select Service data", () => {
    it("Click on 'Add' inside PO dialog box and check for required fields", () => {
      cy.get("[data-cy=\"form.builder.add.line.item\"]").click();
    });

    it("Click on service option", () => {
      cy.poSelectOption({ optionName: "service" });
    });

    it("Select service id", () => {
      cy.poEnterServiceID({ serviceId: "SRV123" });
    });

    it("Enter Description", () => {
      cy.poEnterDescription({ description: "Description for SRV123" });
    });

    it("Enter Quantity Ordered", () => {
      cy.poEnterQuantityOrdered({ quantity: "2" });
    });

    it("Select Units", () => {
      cy.poSelectUnits();
    });

    it("Select GL code", () => {
      cy.poSelectGLCode();
    });

    it("Add Required Date", () => {
      cy.get("[name=\"date\"]").next().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Enter Unit Price", () => {
      cy.poNumberOfUnits({ number: "10" });
    });

    it("Click on 'Add' inside PO dialog box", () => {
      cy.poAddPOButtonClick();
    });

    it("Save document", () => {
      cy.recClickSaveBtn();
      cy.wait(1000);
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("generate pdf and submit for approval", () => {
    it("navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
      cy.progressBarShouldNotExist();
    });

    it("Approve PO", () => {
      cy.ebApproveWithoutApi();
    });
  });

  context("Navigate to Receiving", () => {
    it("Navigate to Receiving landing page", () => {
      cy.navigToReceivableList();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Create Receiving Record", () => {
      cy.get("#DocumentByTypeListPresenter-openDocRev").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.landingPageLoadingElementShouldNotExist();
      cy.wait(2000);
    });

    it("Add approver", () => {
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy^=\"fb-approvals-fb-po-approvals\"]").scrollIntoView().arrowClick().wait(500);
      cy.get("[data-cy^=\"fb-approvals-fb-po-approvals\"]").autocompleteSelect(USERS[1].name).wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.unClick();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save the form", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Navigate to detail tab", () => {
      cy.drSelectDetailsTab();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist().wait(2000);
    });

    it("Select Purchase order", () => {
      cy.get("[data-cy='porec-receivable-test']").autocompleteSelect("PO-00001 - rev A - New Purchase Order");
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Save the form", () => {
      cy.drClickCreateDocumentWithoutApiCall();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("click on 1st part record", () => {
      cy.get("[data-cy='poItemIndex']").eq(0).arrowClick();
    });

    it("Add 'Receipt Quantity'", () => {
      cy.get("[name='received']").arrowType("3");
      cy.wait(2000);
    });

    it("Save", () => {
      cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Navigate to detail tab", () => {
      cy.drSelectDetailsTab();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist().wait(2000);
    });

    it("Select Receive All", () => {
      cy.get("[data-cy=\"form.builder.receive\"]").contains("Receive All")
        .should("exist");
    });

    it("Click on create lot", () => {
      cy.get("[name='po-items-built-in'] button").contains("Create Lot").first().arrowClick();
      cy.listLoadingElementShouldNotExist();
      cy.progressBarShouldNotExist().wait(2000);
    });

    it("Fill the lot form", () => {
      cy.get("[name^='received']").clear().arrowType("100");
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy='lotType']").autocompleteSelect("Lots");
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.get("[data-cy='lotForm']").arrowClick({ force: true }).autocompleteSelect("New Lot from Purchase Order Form");
      cy.get("[data-cy='fb-control-btn']").contains("Create Lot").first().arrowClick();
    });

    it("Submit for approval", () => {
      cy.pmSubmitForApprovalWithoutAPI();
    });

    it("Approve RC", () => {
      cy.ebApproveWithoutApi();
    });
  });

  context("Verify created lot", () => {
    it("Navigate to Lot landing page", () => {
      cy.navigToLots();
      cy.filterClear();
    });

    it("Veryfy the part document on lot", () => {
      cy.get(`[aria-colindex="3"] input`).arrowType("PRT-00005.1");
    });
  });
});

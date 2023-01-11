// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import "moment-timezone";
import { RevisionChangeType } from "../../../src/state/ducks/documentRevisions/types";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let group;
let initialArDocument;
let approvalRequestDocumentType;
let formDocumentType;
let supplierDocumentType;
let createdSupplierFormDocument;
let createdSupplierDocument;

const owner = USERS[1].name;
const history = [
  {
    owner,
    actions: [
      { key: "Description changed", value: "Test Part description" },
      { key: "Name changed", value: "Test part" },
    ],
  },
  {
    owner,
    actions: [
      { key: "New Doc ID", value: "PRT-00004" },
      { key: "Form Set To", value: "FM-00002 - revision 1 - New Part Form" },
      { key: "New owner", value: `${owner}` },
      { key: "Access granted to group", value: "Everyone" },
      { key: "New status", value: `${owner}` },
    ],
  },
];

context("new_layout_for_Parts", () => {
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
    it("[API]Create company", (done: any) => {
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
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          supplierDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Suppliers");
          approvalRequestDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Approval Request");
          formDocumentType = cmpFilterDocumentTypeIdByName(createdCompany, "Form");
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

    it("[API]Create Supplier form", (done: any) => {
      cy.grpGetGroupByName({
        sessionId: loginResponse.sessionId,
        employeeId: employeeLoginFirst.id,
        groupName: "Everyone",
      }).then((response) => {
        group = response;
        cy.arGetArDocumentByName({
          sessionId: loginResponse.sessionId,
          employeeId: employeeLoginFirst.id,
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
              name: "supplier form",
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
            employeeId: employeeLoginFirst.id as unknown as string,
            sessionId: loginResponse.sessionId as unknown as string,
          }).then((response) => {
            createdSupplierFormDocument = response;
            cy.drAPIApproveAndRelease({
              documentId: createdSupplierFormDocument.id,
              payload: {
                effectiveDate: (new Date()).toISOString(),
                documentType: { id: approvalRequestDocumentType[0].id },
                formDocument: { id: initialArDocument[0].id },
                approversWithSignatures: [{ approver: { id: employeeLoginFirst.id } }],
              },
              employeeId: employeeLoginFirst.id,
              sessionId: loginResponse.sessionId,
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
                employeeId: employeeLoginFirst.id,
                sessionId: loginResponse.sessionId,
              }).then((response) => {
                createdSupplierDocument = response;
                cy.drAPIApproveAndRelease({
                  documentId: createdSupplierDocument.id,
                  payload: {
                    effectiveDate: (new Date()).toISOString(),
                    documentType: { id: approvalRequestDocumentType[0].id },
                    formDocument: { id: initialArDocument[0].id },
                    approversWithSignatures: [{ approver: { id: employeeLoginFirst.id } }],
                  },
                  employeeId: employeeLoginFirst.id,
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create Form for Parts document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
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

    it("Selects 'Parts' document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Parts" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Verify the fields on part form", () => {
    it("Verify Form opens to the Overview tab by default", () => {
      cy.get("[data-cy=\"tabId.overview\"]").contains("Overview")
        .should("exist");
    });

    it("Verify the Specification tab", () => {
      cy.get("[data-cy=\"tabId.specification\"]").contains("Specification")
        .should("exist");
    });

    it("Verify Title", () => {
      cy.get("[data-cy=\"field-name\"]").contains("New Part Form")
        .should("exist");
    });

    it("Verify Description", () => {
      cy.get("[data-cy=\"description\"]").contains("New Part Form description")
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

    it("Verify Output Document Type as Parts", () => {
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").contains("Parts")
        .should("exist");
    });

    it("Verify Render HTML", () => {
      cy.get("[data-cy=\"field-renderHTML\"]").contains("Render HTML")
        .should("exist");
    });

    it("navigate to Specification Items", () => {
      cy.drSelectSpecificationTab();
    });

    it("Button should have text Make vs Buy", () => {
      cy.get("[data-cy=\"Make vs Buy\"]")
        .should("have.text", "Make vs Buy");
    });

    it("Button should have text Primary Supplier", () => {
      cy.get("[data-cy=\"Primary Supplier\"]")
        .should("have.text", "Primary Supplier");
    });

    it("Button should have text Other Suppliers", () => {
      cy.get("[data-cy=\"Other Suppliers\"]")
        .should("have.text", "Other Suppliers");
    });

    it("Button should have text Unit of measure", () => {
      cy.get("[data-cy=\"Unit of measure\"]")
        .should("have.text", "Unit of measure");
    });

    it("Button should have text Traceability required", () => {
      cy.get("[data-cy=\"Traceability required\"]")
        .should("have.text", "Traceability required");
    });

    it("Button should have text Serialized", () => {
      cy.get("[data-cy=\"Serialized\"]")
        .should("have.text", "Serialized");
    });

    it("Button should have text Select serialization", () => {
      cy.get("[data-cy=\"Select serialization\"]")
        .should("have.text", "Select serialization");
    });

    it("Button should have text IQC Required", () => {
      cy.get("[data-cy=\"IQC Required\"]")
        .should("have.text", "IQC Required");
    });

    it("Button should have text Limited Shelf Life", () => {
      cy.get("[data-cy=\"Limited Shelf Life\"]")
        .should("have.text", "Limited Shelf Life");
    });

    it("Button should have text FAI Required", () => {
      cy.get("[data-cy=\"FAI Required\"]")
        .should("have.text", "FAI Required");
    });
  });

  context("Add components in the form", () => {
    it("navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for parts test" });
      cy.fbAddField();
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbAddNewFieldButton();
    });

    it("Add Autocomplete", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.fbAddNewFieldButton();
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context("Verify the highlighted Items", () => {
    it("Verify the remove button", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").last().should("exist");
    });

    it("Verify the Edit button", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").last().should("exist");
    });

    it("Verify the presentation button", () => {
      cy.get("[class=\"MuiSvgIcon-root\"]").eq(18).should("exist");
    });

    it("Verify the drag & drop button", () => {
      cy.get("[class=\"drag-handle\"]").last().should("exist");
    });
  });

  context("Move & Edit & Remove component", () => {
    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for Parts " });
      cy.fbAddField();
    });

    it("move component", () => {
      cy.get(`[class="drag-handle"]`).eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("move component", () => {
      cy.get(`[class="drag-handle"]`).eq(0)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(1)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").last().arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for Parts Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").last().arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Export and save the template", () => {
      cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").eq(0).arrowClick();
      cy.get("[data-cy=\"fb-template-name\"]").arrowType("part_Import");
      cy.get("[data-cy=\"common.add\"]").arrowClick();
    });
  });

  context("Create Form for second Parts document ", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Part Form'", () => {
      cy.drEnterDocumentTitle({ name: "second Part Form" });
    });

    it("Enters description 'New Part Form description'", () => {
      cy.drEnterDocumentDescription({ description: "second Part Form description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Parts' document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Parts" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Import and verify the imported fields", () => {
    it("Import the template", () => {
      cy.get("#fb-import-schema").attachFile("../downloads/part_Import.json");
    });

    it("Verify Textfield for Textfield for parts test", () => {
      cy.get("[data-cy=\"Textfield for parts test\"]").contains("Textfield for parts test")
        .should("exist");
    });

    it("Verify fb-checkbox-group", () => {
      cy.get("[data-cy=\"fb-checkbox-group\"]").contains("fb-checkbox-group")
        .should("exist");
    });

    it("Verify fb-autocomplete", () => {
      cy.get("[data-cy=\"fb-autocomplete\"]").contains("fb-autocomplete")
        .should("exist");
    });
  });

  context("Move & Edit & Remove component", () => {
    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for second Parts " });
      cy.fbAddField();
    });

    it("move component", () => {
      cy.get(`[class="drag-handle"]`).eq(1)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(0)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("move component", () => {
      cy.get(`[class="drag-handle"]`).eq(0)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(1)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").last().arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for second Parts Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").last().arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Create a new part form part landing page", () => {
    it("Navigate to parts landing page", () => {
      cy.navigToParts();
    });

    it("Clicks on 'Add new part' button", () => {
      cy.ptClickCreateNewPart();
    });
  });

  context("Verify the fields on test part form", () => {
    it("Verify Form opens to the Overview tab by default", () => {
      cy.get("[data-cy=\"tabId.overview\"]").contains("Overview")
        .should("exist");
    });

    it("Verify the Specification tab", () => {
      cy.get("[data-cy=\"tabId.specification\"]").contains("Specification")
        .should("exist");
    });

    it("Enter title", () => {
      cy.drEnterDocumentTitle({ name: "Test part" });
    });

    it("Enter description 'Test Part description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Part description" });
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
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

    it("Verify Part of ", () => {
      cy.get("[data-cy=\"BuildsPresenter-label\"]").contains("Part of")
        .should("exist");
    });

    it("Verify Training Required", () => {
      cy.get("[data-cy=\"field-retrain\"]").contains("Training Required")
        .should("exist");
    });

    it("Verify Textfield for Textfield for parts test", () => {
      cy.get("[data-cy=\"Textfield for parts test\"]").contains("Textfield for parts test")
        .should("exist");
    });

    it("Verify fb-checkbox-group", () => {
      cy.get("[data-cy=\"fb-checkbox-group\"]").contains("fb-checkbox-group")
        .should("exist");
    });

    it("Verify fb-autocomplete", () => {
      cy.get("[data-cy=\"fb-autocomplete\"]").contains("fb-autocomplete")
        .should("exist");
    });

    it("navigate to Specification Items", () => {
      cy.drSelectSpecificationTab();
    });

    it("Button should have text Make vs Buy", () => {
      cy.get("[data-cy=\"Make vs Buy\"]")
        .should("have.text", "Make vs Buy");
    });

    it("Button should have text Unit of measure", () => {
      cy.get("[data-cy=\"Unit of measure\"]")
        .should("have.text", "Unit of measure");
    });

    it("Button should have text Traceability required", () => {
      cy.get("[data-cy=\"Traceability required\"]")
        .should("have.text", "Traceability required");
    });

    it("Button should have text IQC Required", () => {
      cy.get("[data-cy=\"IQC Required\"]")
        .should("have.text", "IQC Required");
    });

    it("Button should have text Limited Shelf Life", () => {
      cy.get("[data-cy=\"Limited Shelf Life\"]")
        .should("have.text", "Limited Shelf Life");
    });

    it("Button should have text FAI Required", () => {
      cy.get("[data-cy=\"FAI Required\"]")
        .should("have.text", "FAI Required");
    });
  });

  context("Navigate to Specification Tab", () => {
    it("navigate to Specification Items", () => {
      cy.drSelectSpecificationTab();
    });

    it("Select make vs buy", () => {
      cy.get("[id$=\"make-vs-buy\"]").arrowClick({ force: true });
      cy.get("ul[role=listbox]>li").contains("Make").arrowClick();
    });

    it("Select traceability required", () => {
      cy.get("[value=\"Traceability required\"]").check({ force: true });
    });

    it("Button should have text Serialized", () => {
      cy.get("[data-cy=\"Serialized\"]")
        .should("have.text", "Serialized");
    });

    it(`Verify Redline error for The Serialized is a required field.`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("The Serialized is a required field.")
        .should("exist");
    });

    it("Select 'Yes' for Serialized option", () => {
      cy.get("[name=\"serialized\"][value=\"Yes\"]").check({ force: true });
    });

    it("Button should have text Select serialization", () => {
      cy.get("[data-cy=\"Select serialization\"]")
        .should("have.text", "Select serialization");
    });

    it(`Verify Redline error for The Serialized is a required field.`, () => {
      cy.get("[id=\"sm-tabpanel-1\"]").contains("The Select serialization is a required field.")
        .should("exist");
    });

    it("Select serialization", () => {
      cy.get("[id=\"mui-component-select-select-serialization\"]").autocompleteSelect("Select Provided Serialization");
      cy.unClick();
    });

    it("Select make vs buy", () => {
      cy.get("[id$=\"make-vs-buy\"]").arrowClick({ force: true });
      cy.get("ul[role=listbox]>li").contains("Buy").arrowClick();
    });

    it("Button should have text Primary Supplier", () => {
      cy.get("[data-cy=\"Primary Supplier\"]")
        .should("have.text", "Primary Supplier");
    });

    it("Button should have text Other Suppliers", () => {
      cy.get("[data-cy=\"Other Suppliers\"]")
        .should("have.text", "Other Suppliers");
    });

    it("Select primary Supplier", () => {
      cy.get("[data-cy=\"primary-supplier\"]").autocompleteSelect("SUP-00001 - rev 1 - API Supplier Document");
      cy.unClick();
    });

    it("Select other Supplier", () => {
      cy.get("[data-cy=\"other-suppliers\"]").autocompleteSelect("SUP-00001 - rev 1 - API Supplier Document");
      cy.unClick();
    });
  });

  context("verify References fields", () => {
    it("Verify References ", () => {
      cy.get("[data-cy=\"references-icon\"]").should("exist");
    });

    it("Verify General Info ", () => {
      cy.get("[data-cy=\"generalInfo\"]").should("exist");
    });

    it("Verify Avatar ", () => {
      cy.get("[data-cy=\"user-avatar\"]").should("exist");
    });

    it("Verify User name ", () => {
      cy.get("[data-cy=\"user-name\"]").should("exist");
    });

    it("Verify References ", () => {
      cy.get("[data-cy=\"field-referenceTo\"]").should("exist");
    });

    it("Verify Referenced By ", () => {
      cy.get("[data-cy=\"generalInfo\"]").contains("Referenced By")
        .should("exist");
    });

    it("Verify ReleaseDate ", () => {
      cy.get("[data-cy=\"releaseDate\"]").should("exist");
    });

    it("Verify FormInfo ", () => {
      cy.get("[data-cy=\"output.info\"]").should("exist");
    });

    it("Verify Migrate Form ", () => {
      cy.get("[data-cy=\"common.form.migration\"]").should("exist");
    });

    it("Add reference to part", () => {
      cy.drSelectReferences("FM-00002");
    });

    it("Remove reference for document", () => {
      cy.drRemoveReferences({ reference: "FM-00002" });
      cy.progressBarShouldNotExist();
    });
  });

  context("verify Revision tab", () => {
    it("Verify Revision icon", () => {
      cy.get("[data-cy=\"note-icon\"]").should("exist");
    });
  });

  context("verify History fields", () => {
    it("Verify History ", () => {
      cy.get("[data-cy=\"timeline-icon\"]").should("exist");
    });

    it("Open History drawer and compare history values", () => {
      cy.drSelectHistoryTab();
    });

    it("Verify user  ", () => {
      cy.get("[data-cy=\"user-name\"]").contains("Giovanni Reynolds")
        .should("exist");
    });

    it("Verify Description changed  ", () => {
      cy.get("[data-cy=\"change-key-0-0\"]").contains("Description changed")
        .should("exist");
    });

    it("Verify Test Part description  ", () => {
      cy.get("[data-cy=\"change-value-0-0\"]").contains("Test Part description")
        .should("exist");
    });

    it("Verify Name changed  ", () => {
      cy.get("[data-cy=\"change-key-0-1\"]").contains("Name changed")
        .should("exist");
    });

    it("Verify Test Part", () => {
      cy.get("[data-cy=\"change-value-0-1\"]").contains("Test part")
        .should("exist");
    });

    history.forEach((element, groupIndex) => {
      it(`Check owner name for group ${groupIndex + 1}`, () => {
        cy.get(`[data-cy="change-key-${groupIndex}"]`).should("have.text", element.owner);
      });

      element.actions.forEach((action, index, identifier) => {
        it(`'${action.key}' as '${action.value}' exists`, () => {
          const typeOfChange = action.key;
          const contentOfChange = action.value;
          if (action.key === "Access granted to group") {
            cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`).should(($identifier) =>  {
              expect($identifier.text()).to.be.oneOf(["Everyone"]);
            });
          }
          else {
            cy.get(`[data-cy^="change-value-${groupIndex}-${index}"]`)
              .contains(action.key === "New owner" ? new RegExp("^" + action.value) : action.value)
              .parent()
              .parent()
              .within(() => {
                cy.get(`[data-cy^=change-key-${groupIndex}-${index}]`).should("have.text", typeOfChange);
                cy.get(`[data-cy^=change-value-${groupIndex}-${index}]`).should("contain.text", contentOfChange);
              });
          }
        });
      });
    });
  });

  context("verify Access Permission fields", () => {
    it("Verify Access Permission ", () => {
      cy.get("[data-cy=\"permission-icon\"]").should("exist");
    });
  });

  context("verify Bookmark and Revision History fields", () => {
    it("Verify Bookmark ", () => {
      cy.get("[data-cy=\"bookmark-icon\"]").should("exist");
    });

    it("Verify Revision History ", () => {
      cy.get("[data-cy=\"cr-icon\"]").should("exist");
    });
  });

  context("verify Access Permission fields", () => {
    it("navigate to overview tab", () => {
      cy.drSelectOverviewTab();
    });

    it("Add Text field with range", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
      cy.fbEnterNameValue({ name: "label", value: "fb-range" });
      cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
      cy.fbAddNewFieldButton();
    });
  });

  context("Fill in the fields", () => {
    it("navigate to Specification Items", () => {
      cy.drSelectSpecificationTab();
    });

    it("Select make vs buy", () => {
      cy.get("[id$=\"make-vs-buy\"]").arrowClick({ force: true });
      cy.get("ul[role=listbox]>li").contains("Buy").arrowClick();
    });

    it("Select primary Supplier", () => {
      cy.get("[data-cy=\"primary-supplier\"]").autocompleteSelect("SUP-00001 - rev 1 - API Supplier Document");
      cy.unClick();
    });

    it("Select other Supplier", () => {
      cy.get("[data-cy=\"other-suppliers\"]").autocompleteSelect("SUP-00001 - rev 1 - API Supplier Document");
      cy.unClick();
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context("navigate to Parts landing page and verify data", () => {
    it("Navigate to parts landing page", () => {
      cy.navigToParts();
    });

    it("verify that part landing page is pulling correct data for newly released part", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("PRT-00004").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(1).clear().arrowType("Test part").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(2).clear().arrowType("Giovanni Reynolds").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get(`[aria-colindex="4"] [class="k-input"]`).arrowClick();
      cy.get("li").contains("Draft").arrowClick().wait(500);
      cy.listLoadingElementShouldNotExist();
    });

    it("Select PO from the list", () => {
      cy.get("[data-cy=\"clearFilter\"]").arrowClick();
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("PRT-00004");
      cy.dlSelectFirstDocument();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Navigate to parts landing page", () => {
      cy.navigToParts();
      cy.get("[data-cy=\"clearFilter\"]").arrowClick();
    });

    it("verify that part landing page is pulling correct data for newly released part", () => {
      cy.get("[class=\"k-textbox\"]").eq(0).clear().arrowType("PRT-00004").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(1).clear().arrowType("Test part").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(2).clear().arrowType("Giovanni Reynolds").wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get(`[aria-colindex="4"] [class="k-input"]`).arrowClick();
      cy.get("li").contains("Released").arrowClick().wait(500);
      cy.listLoadingElementShouldNotExist();
      cy.get("[class=\"k-textbox\"]").eq(3).clear().arrowType("AR-00004").wait(500);
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Open Released Part and verify all the steps above", () => {
    it("Select PO from the list", () => {
      cy.dlSelectFirstDocument();
    });

    it("Verify Title 'Test part'", () => {
      cy.get("[data-cy=\"field-name\"]").contains("Test part")
        .should("exist");
    });

    it("Verify Description 'Test Part description'", () => {
      cy.get("[data-cy=\"BaseWithhtml-editor\"]").contains("Test Part description")
        .should("exist");
    });

    it("Verify Form opens to the Overview tab by default", () => {
      cy.get("[data-cy=\"tabId.overview\"]").contains("Overview")
        .should("exist");
    });

    it("Verify the Specification tab", () => {
      cy.get("[data-cy=\"tabId.specification\"]").contains("Specification")
        .should("exist");
    });

    it(`Verify Training Required field`, () => {
      cy.get("[id='sm-tabpanel-0']").contains("Training Required")
        .should("exist");
    });

    it(`Verify Part of field`, () => {
      cy.get("[id='sm-tabpanel-0']").contains("Part of")
        .should("exist");
    });

    it(`Verify Attachments field`, () => {
      cy.get("[id='sm-tabpanel-0']").contains("Attachments")
        .should("exist");
    });

    it(`Verify Textfield for parts test field`, () => {
      cy.get("[id='sm-tabpanel-0']").contains("Textfield for parts test")
        .should("exist");
    });

    it(`Verify checkbox-group field`, () => {
      cy.get("[id='sm-tabpanel-0']").contains("fb-checkbox-group")
        .should("exist");
    });

    it(`Verify autocomplete field`, () => {
      cy.get("[id='sm-tabpanel-0']").contains("fb-autocomplete")
        .should("exist");
    });

    it(`Verify Textfield with range field`, () => {
      cy.get("[id='sm-tabpanel-0']").contains("fb-range")
        .should("exist");
    });

    it("navigate to Specification Items", () => {
      cy.drSelectSpecificationTab();
    });

    it("Button should have text Make vs Buy", () => {
      cy.get("[data-cy=\"Make vs Buy\"]")
        .should("have.text", "Make vs Buy");
    });

    it("Button should have text Unit of measure", () => {
      cy.get("[data-cy=\"Unit of measure\"]")
        .should("have.text", "Unit of measure");
    });

    it("Button should have text Traceability required", () => {
      cy.get("[data-cy=\"Traceability required\"]")
        .should("have.text", "Traceability required");
    });

    it("Button should have text IQC Required", () => {
      cy.get("[data-cy=\"IQC Required\"]")
        .should("have.text", "IQC Required");
    });

    it("Button should have text Limited Shelf Life", () => {
      cy.get("[data-cy=\"Limited Shelf Life\"]")
        .should("have.text", "Limited Shelf Life");
    });

    it("Button should have text FAI Required", () => {
      cy.get("[data-cy=\"FAI Required\"]")
        .should("have.text", "FAI Required");
    });
  });
});

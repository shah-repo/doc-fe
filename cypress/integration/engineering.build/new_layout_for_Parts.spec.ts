// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import moment from "moment";
import "moment-timezone";
import { cmpFilterDocumentTypeIdByName } from "../../support/commands/company/commands";
import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;
let group;
let initialArDocument;
let partDocumentType;
let approvalRequestDocumentType;
let createdPartFormDocument;
let formDocumentType;
const currentDate = moment().tz("America/Los_Angeles").format("MMMM D, YYYY");


context("Parts from EB flow test", () => {
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
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });
  context("Create Form Part document to create Part", () => {
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
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Create Form Part document to create Part", () => {
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
      cy.drClickCreateDocumentWithApiCall();
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
  });

});



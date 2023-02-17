// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { Seed } from "../../utils/constants/documentTypes/seed";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;
const ncoFormName = "NCO Form";
const seedFormName = "Seed Form";
const randomNumberForCompany = (Math.round(Math.random() * 100000)) % 100000;
const newCompanyName = "New company " + randomNumberForCompany;
const newCompanyAbbr = "NC-" + randomNumberForCompany;

context("NCO document type management with record doc type", () => {
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
              Seed,
              NCORecord,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[1].email,
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create form for NCO document", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title '${ncoFormName}'`, () => {
      cy.drEnterDocumentTitle({ name: ncoFormName });
    });

    it("Enters description 'New NCO Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New NCO Form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'New Company Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "New Company Record" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Create Document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Predefined fields are displayed", () => {
    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Button should have text Company Details", () => {
      cy.get("[data-cy=\"Company Details\"]")
        .should("have.text", "Company Details");
    });

    it("Button should have text Company Name", () => {
      cy.get("[data-cy=\"Company Name\"]")
        .should("have.text", "Company Name");
    });

    it("Button should have text Company Abbreviation", () => {
      cy.get("[data-cy=\"Company Abbreviation\"]")
        .should("have.text", "Company Abbreviation");
    });

    it("Button should have text Company Admin Email", () => {
      cy.get("[data-cy=\"Company Admin Email\"]")
        .should("have.text", "Company Admin Email");
    });

    it("Button should have text Client's Logo & Avatar", () => {
      cy.get("[data-cy=\"Client's Logo & Avatar\"]")
        .should("have.text", "Client's Logo & Avatar");
    });

    it("Button should have text White-labeling", () => {
      cy.get("[data-cy=\"White-labeling\"]")
        .should("have.text", "White-labeling");
    });

    it("Button should have text Instructions Media upload", () => {
      cy.get("[data-cy=\"Instructions Media upload\"]")
        .should("have.text", "Instructions Media upload");
    });

    it("Button should have text defaultBackground", () => {
      cy.get("[data-cy=\"defaultBackground\"]")
        .should("have.text", "defaultBackground");
    });

    it("Button should have text primary", () => {
      cy.get("[data-cy=\"primary\"]")
        .should("have.text", "primary");
    });

    it("Button should have text secondary", () => {
      cy.get("[data-cy=\"secondary\"]")
        .should("have.text", "secondary");
    });

    it("Button should have text APPROVED DAM JSON", () => {
      cy.get("[data-cy=\"APPROVED DAM JSON\"]")
        .should("have.text", "APPROVED DAM JSON");
    });

    it("Button should have text Approved DAM json is used", () => {
      cy.get("[data-cy=\"Approved DAM json is used\"]")
        .should("have.text", "Approved DAM json is used");
    });

    it("Button should have text DAM JSON ", () => {
      cy.get("[data-cy=\"DAM JSON \"]")
        .should("have.text", "DAM JSON ");
    });

    it("Button should have text APPROVED PAGE DETAILS JSON", () => {
      cy.get("[data-cy=\"APPROVED PAGE DETAILS JSON\"]")
        .should("have.text", "APPROVED PAGE DETAILS JSON");
    });

    it("Button should have text Approved Page Details json is used", () => {
      cy.get("[data-cy=\"Approved Page Details json is used\"]")
        .should("have.text", "Approved Page Details json is used");
    });

    it("Button should have text Page Details JSON", () => {
      cy.get("[data-cy=\"Page Details JSON\"]")
        .should("have.text", "Page Details JSON");
    });

    it("Button should have text APPROVED NAVIGATION JSON", () => {
      cy.get("[data-cy=\"APPROVED NAVIGATION JSON\"]")
        .should("have.text", "APPROVED NAVIGATION JSON");
    });

    it("Button should have text Approved Navigation json is used", () => {
      cy.get("[data-cy=\"Approved Navigation json is used\"]")
        .should("have.text", "Approved Navigation json is used");
    });

    it("Button should have text Navigation JSON", () => {
      cy.get("[data-cy=\"Navigation JSON\"]")
        .should("have.text", "Navigation JSON");
    });

    it("Button should have text Launching Details", () => {
      cy.get("[data-cy=\"Launching Details\"]")
        .should("have.text", "Launching Details");
    });

    it("Button should have text Scheduled Go Live Date", () => {
      cy.get("[data-cy=\"Scheduled Go Live Date\"]")
        .should("have.text", "Scheduled Go Live Date");
    });

    it("Button should have text EMPLOYEES TEMPLATE LIST", () => {
      cy.get("[data-cy=\"EMPLOYEES TEMPLATE LIST\"]")
        .should("have.text", "EMPLOYEES TEMPLATE LIST");
    });

    it("Button should have text Users List", () => {
      cy.get("[data-cy=\"Users List\"]")
        .should("have.text", "Users List");
    });

    it("Button should have text GL Codes template list", () => {
      cy.get("[data-cy=\"GL Codes template list\"]")
        .should("have.text", "GL Codes template list");
    });

    it("Button should have text Client's GL codes list", () => {
      cy.get("[data-cy=\"Client's GL codes list\"]")
        .should("have.text", "Client's GL codes list");
    });

    it("Button should have text Seed documents to be included", () => {
      cy.get("[data-cy=\"Seed documents to be included\"]")
        .should("have.text", "Seed documents to be included");
    });

    it("Button should have text Post Creation Records", () => {
      cy.get("[data-cy=\"Post Creation Records\"]")
        .should("have.text", "Post Creation Records");
    });

    it("Button should have text Logs Created", () => {
      cy.get("[data-cy=\"Logs Created\"]")
        .should("have.text", "Logs Created");
    });
  });

  context("Move & Edit & Remove component", () => {
    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for bulk import test" });
      cy.fbAddField();
    });

    it("move Component", () => {
      cy.get("[data-cy='Textfield for bulk import test']").trigger("mouseover");
      cy.wait(2000);
      cy.get(`[class="drag-handle"]`).eq(33)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(32)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").eq(32).arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for bulk import Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(32).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });
  });

  context("Fill out the required fields", () => {
    it("Upload correct DAM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "doc_type_DAM.json", queue: 0 });
    });

    it("Upload Page Details JSON", () => {
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "doc_type_page_details.json", queue: 0 });
    });

    it("Upload Navigation JSON", () => {
      cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Approve and release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Export and save the template", () => {
      cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").arrowClick();
      cy.get("[data-cy=\"fb-template-name\"]").arrowType("NCO_Form");
      cy.get("[data-cy=\"common.add\"]").arrowClick();
    });
  });

  context("Create Another form for NCO document", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title '${ncoFormName + "test"}'`, () => {
      cy.drEnterDocumentTitle({ name: ncoFormName +  " test" });
    });

    it("Enters description 'New NCO Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New NCO Form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'New Company Record' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "New Company Record" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Create Document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Import the template", () => {
      cy.get("#fb-import-schema").attachFile("../downloads/NCO_Form.json");
    });
  });

  context("'Add' & 'Move' & 'Edit' & Remove component", () => {
    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for bulk import test" });
      cy.fbAddField();
    });

    it("move Component", () => {
      cy.get("[data-cy='Textfield for bulk import test']").trigger("mouseover", { force: true });
      cy.wait(2000);
      cy.get(`[class="drag-handle"]`).eq(33)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(32)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").eq(32).arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for bulk import Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(32).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Create form for SEED document", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title '${seedFormName}'`, () => {
      cy.drEnterDocumentTitle({ name: seedFormName });
    });

    it("Enters description 'New Seed Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Seed Form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'SEED' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "SEED" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Predefined fields are displayed for seed form", () => {
    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Button should have text Document Title", () => {
      cy.get("[data-cy=\"Document Title\"]")
        .should("have.text", "Document Title");
    });

    it("Button should have text Document Description", () => {
      cy.get("[data-cy=\"Document Description\"]")
        .should("have.text", "Document Description");
    });

    it("Button should have text Type of document to be created", () => {
      cy.get("[data-cy=\"Type of document to be created\"]")
        .should("have.text", "Type of document to be created");
    });

    it("Button should have text Document Type to be selected", () => {
      cy.get("[data-cy=\"Document Type to be selected\"]")
        .should("have.text", "Document Type to be selected");
    });

    it("Button should have text JSON Form", () => {
      cy.get("[data-cy=\"JSON Form\"]")
        .should("have.text", "JSON Form");
    });

    it("Button should have text Define the output of that form", () => {
      cy.get("[data-cy=\"Define the output of that form\"]")
        .should("have.text", "Define the output of that form");
    });

    it("Button should have text Default Revision Stage", () => {
      cy.get("[data-cy=\"Default Revision Stage\"]")
        .should("have.text", "Default Revision Stage");
    });

    it("Button should have text Training Required", () => {
      cy.get("[data-cy=\"Training Required\"]")
        .should("have.text", "Training Required");
    });

    it("Button should have text Attachments to be included", () => {
      cy.get("[data-cy=\"Attachments to be included\"]")
        .should("have.text", "Attachments to be included");
    });
  });

  context("'Add' & 'Move' & 'Edit' & Remove component", () => {
    it("Navigate to overview tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for bulk import test" });
      cy.fbAddField();
    });

    it("move Component", () => {
      cy.get("[data-cy='Textfield for bulk import test']").trigger("mouseover");
      cy.wait(2000);
      cy.get(`[class="drag-handle"]`).eq(9)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(8)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").eq(8).arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for bulk import Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(8).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context("Approve and Release' the document", () => {
    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });

    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Export and save the template", () => {
      cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").arrowClick();
      cy.get("[data-cy=\"fb-template-name\"]").arrowType("Seed_Form");
      cy.get("[data-cy=\"common.add\"]").arrowClick();
    });
  });

  context("Create Another form for SEED document", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title '${seedFormName}'`, () => {
      cy.drEnterDocumentTitle({ name: seedFormName + " Test" });
    });

    it("Enters description 'New Seed Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Seed Form description test" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'SEED' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "SEED" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Import the template", () => {
      cy.get("#fb-import-schema").attachFile("../downloads/Seed_Form.json");
    });
  });

  context("'Add' & 'Move' & 'Edit' & Remove component", () => {
    it("Navigate to overview tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Add component", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbAddLabelName({ name: "Textfield for bulk import test" });
      cy.fbAddField();
    });

    it("move Component", () => {
      cy.get("[data-cy='Textfield for bulk import test']").trigger("mouseover");
      cy.wait(2000);
      cy.get(`[class="drag-handle"]`).eq(9)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(`[class="drag-handle"]`).eq(8)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
    });

    it("Edit Component", () => {
      cy.get("[data-cy=\"edit-schema-item\"]").eq(8).arrowClick({ force: true });
      cy.get("[data-cy=\"fb-editor-field-textfield\"]").clear();
      cy.fbAddLabelName({ name: "Textfield for bulk import Edited" });
      cy.fbAddField();
    });

    it("remove Component", () => {
      cy.get("[data-cy=\"remove-schema-item\"]").eq(8).arrowClick({ force: true });
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context("Create output from the created SEED form in Scenario 10.1", () => {
    it("Navigate to Document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter document by ID", () => {
      cy.drFilterDocListByDocIdAndName({  docId: "FM-00004", title: "Seed Form" });
    });

    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
      cy.wait(2000);
    });

    it("Enters title 'New Seed 2'", () => {
      cy.drEnterDocumentTitle({ name: "New Seed 2" });
    });

    it("Enters description 'New Seed description 2'", () => {
      cy.drEnterDocumentDescription({ description: "New Seed description 2" });
    });
  });

  context("Check that validations are working fine", () => {
    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("check validation for  Document Title", () => {
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").eq(0)
        .should("have.text", "The Document Title is a required field.");
    });

    it("check validation for Document Description", () => {
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").eq(1)
        .should("have.text", "The Document Description is a required field.");
    });

    it("check validation for Type of document to be created", () => {
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").eq(2)
        .should("have.text", "The Type of document to be created is a required field.");
    });

    it("check validation for Document Type to be selected", () => {
      cy.get("[data-cy=\"Document Type to be selected\"]")
        .should("have.text", "Document Type to be selected");
    });

    it("check validation for Default Revision Stage", () => {
      cy.get("[data-cy=\"radiogroup-6\"]")
        .contains("The Default Revision Stage is a required field.").should("exist");
    });
  });

  context("Fill out all the fields", () => {
    it("Enters document title 'Second document'", () => {
      cy.get("[name^=document-title-]").arrowType("Seed document");
    });

    it("Enters document description 'Second document description'", () => {
      cy.get("[data-cy^=document-description-]>div>div>div>div>div[contenteditable]>div")
        .click({ force: true }).arrowType("Seed document description", { force: true });
      cy.get("[data-cy^=document-title-]").arrowClick();
    });

    it("Select 'Document' value on 'Type of document to be created'", () => {
      cy.get("[name^=type-of-document-to-be-created-]").eq(0).check();
    });

    it("Selects document type as 'Form'", () => {
      cy.get("[id^=mui-component-select-document-type-to-be-selected-]").arrowClick();
      cy.get("[id^=menu-document-type-to-be-selected-]>div:nth-child(3)>ul").contains("li", "Form").arrowClick();
    });

    it("Upload JSON Form", () => {
      cy.atchUploadJSONFormForSeed({ fileName: "TestTemplate.json", queue: 0 });
    });

    it("Selects document type as 'Clinical Protocol'", () => {
      cy.get("[id^=mui-component-select-define-the-output-of-that-form-]").arrowClick();
      cy.get("[id^=menu-define-the-output-of-that-form-]>div:nth-child(3)>ul")
        .contains("li", "Clinical Protocol").arrowClick();
    });

    it("Select 'Numeric' value on 'Default Revision Stage'", () => {
      cy.get("[name^=default-revision-stage-]").eq(0).check();
    });

    it("Selects 'No' training required option", () => {
      cy.get("[name^=training-required-]").eq(1).check();
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("'Approve and Release' the document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Create NCO document from Form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filter document by ID", () => {
      cy.drFilterDocListByDocIdAndName({  docId: "FM-00002", title: "NCO Form" });
    });

    it("Create new document from form", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Company'", () => {
      cy.drEnterDocumentTitle({ name: "New Company" });
    });

    it("Enters description 'New Company description'", () => {
      cy.drEnterDocumentDescription({ description: "New Company description" });
    });
  });

  context("Check that validations are working fine for NCO", () => {
    it("Navigate to Details tab", () => {
      cy.drSelectDetailsTab();
    });

    it("check validation for Company Name", () => {
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").eq(0)
        .should("have.text", "The Company Name is a required field.");
    });

    it("check validation for Company Abbreviation", () => {
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").eq(1)
        .should("have.text", "The Company Abbreviation is a required field.");
    });

    it("check validation for Company Admin Email", () => {
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").eq(2)
        .should("have.text", "The Company Admin Email is a required field.");
    });

    it("check validation for Approved DAM json is used", () => {
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").eq(3)
        .should("have.text", "The Approved DAM json is used is a required field.");
    });

    it("check validation for Approved Page Details json is used", () => {
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").eq(4)
        .should("have.text", "The Approved Page Details json is used is a required field.");
    });

    it("check validation for Approved Navigation json is used", () => {
      cy.get("[class=\"MuiFormHelperText-root Mui-error\"]").eq(5)
        .should("have.text", "The Approved Navigation json is used is a required field.");
    });
  });

  context("Fill out all the fields for NCO ", () => {
    it("Select 'Details' tab", () => {
      cy.drSelectDetailsTab();
    });

    it(`Enters company name '${newCompanyName}'`, () => {
      cy.get("[name^=company-name-]").arrowType(newCompanyName);
    });

    it(`Enters company abbriviation '${newCompanyAbbr}'`, () => {
      cy.get("[name^=company-abbreviation-]").arrowType(newCompanyAbbr);
    });

    it(`Enters company email '${USERS[1].email}'`, () => {
      cy.get("[name^=company-admin-email-]").arrowType(USERS[1].email);
    });

    it("Select 'Yes' for 'Approved DAM json is used'", () => {
      cy.get("[name*=\"approved-dam-json-is-used-\"]").check("Yes");
    });

    it("Upload correct DAM JSON", () => {
      cy.atchUploadDOMJSONForNCO({ fileName: "doc_type_DAM.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Page Details json is used'", () => {
      cy.get("[name*=\"approved-page-details-json-is-used-\"]").check("Yes");
    });

    it("Upload Page Details JSON", () => {
      cy.atchUploadPageDetailsJSONForNCO({ fileName: "doc_type_page_details.json", queue: 0 });
    });

    it("Select 'Yes' for 'Approved Navigation json is used'", () => {
      cy.get("[name*=\"approved-navigation-json-is-used-\"]").check("Yes");
    });

    it("Upload Navigation JSON", () => {
      cy.atchUploadNavigationJSONForNCO({ fileName: "doc_type_navigation.json", queue: 0 });
    });

    it("Upload Users List JSON", () => {
      cy.atchUploadUserListJSONForNCO({ fileName: "users.csv", queue: 0 });
    });

    it("Select Seed documents to be included", () => {
      cy.get("[data-cy^=\"seed-documents-to-be-included-\"]").autocompleteSelect("SEED-00001 - rev 1 - New Seed 2");
    });

    it("Save document", () => {
      cy.drClickSaveWithoutApiCall();
    });

    it("Approve and release document - create company", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
    });
  });

  context("Login to newly created company to", () => {
    it("Log out user", () => {
      cy.authLogout();
    });

    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: newCompanyName, multiple: multipleCompanies });
    });

    it("Logo field is empty and Verify default company logo", () => {
      cy.get(`img[alt="Company logo"]`).should("have.attr", "src", "/logo_enlil.svg");
    });

    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Check Seed document is created", () => {
      cy.dlClearFilters();
      cy.listLoadingElementShouldNotExist();
      cy.filterLandingPageColumnFilter({ colIndex: 1, input: "FM-00003" });
      cy.landingPageLoadingElementShouldAppear();
      cy.get(`td[data-grid-col-index="2"]`).should("contain.text", "Seed document");
    });
  });
});

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLogin;

context("Autosave on add and remove FB fields", () => {
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
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLogin = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });

    it("[API]Login admin with autosave tigger shown", (done: any) => {
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
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLogin.id });
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Create 'Form' document with output document type 'Test Document Type'", () => {
    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects 'Form' document type from dropdown", () => {
      SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Test Document Type' output document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectOutputDocumentType({ documentType: "Test Document Type" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Add TextField", () => {
      cy.fbAddNewField();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
      cy.wait(2000);
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.wait(3000);
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Autocomplete", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Text Editor", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Verify you can't enter data to Text Editor", () => {
      cy.xpath("//div[starts-with(@data-cy, \"fb-text-editor-\")]/../div[2]/div")
        .should("not.have.attr", "contenteditable");
    });

    it("Add Date picker", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Hyperlink", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
      cy.fbEnterNameValue({ name: "label", value: "Hyperlink" });
      cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Select Field", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
      cy.fbGroupOptions("option1", "option2");
      cy.wait(3000);
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Radio Button group", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.wait(3000);
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Paragraph", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Paragraph" });
      cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
        .click({ force: true }).clear().arrowType("fb-paragraph");
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Blank Template Form", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Blank Template Form" });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Quantity", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
      cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Timer", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Timer" });
      cy.fbEnterNameValue({ name: "label", value: "fb-timer" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Purchase Order", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-purchase-order" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Receive Purchase Order", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Receive Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-receive-purchase-order" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add PO Approval Matrix", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "PO Approval Matrix" });
      cy.fbEnterNameValue({ name: "label", value: "fb-po-approval-matrix" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Instructions Media upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Instructions Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-instructions" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Evidence Media upload", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Evidence Media upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-evidence" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Procedure", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Equipment", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
      cy.fbEnterNameValue({ name: "label", value: "fb-equipment" });
      cy.get("input[value=\"preventativeMaintenance\"]").arrowClick();
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Text field with range", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
      cy.fbEnterNameValue({ name: "label", value: "fb-range" });
      cy.fbEnterNameValue({ name: "placeholder", value: "fb-range placeholder" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Section", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
      cy.fbEnterNameValue({ name: "label", value: "fb-section" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Subsection", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Subsection" });
      cy.fbEnterNameValue({ name: "label", value: "fb-subsection" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Step", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Step" });
      cy.fbEnterNameValue({ name: "label", value: "fb-step" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Approvals", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Approvals" });
      cy.fbEnterNameValue({ name: "label", value: "fb-approvals" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Inline Approval", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
      cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval" });
      cy.get("[data-cy=\"editorConfig.approvers\"]").autocompleteSelect(`${USERS[1].email }`);
      cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Request Approval", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Request Approval" });
      cy.fbEnterNameValue({ name: "label", value: "fb-request-approval" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Checkpoint", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Checkpoint" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkpoint" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Create a Label", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Create a Label" });
      cy.fbEnterNameValue({ name: "label", value: "fb-create-label" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Implementation Task", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Implementation Task" });
      cy.fbEnterNameValue({ name: "label", value: "fb-task" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Instructions 'MPI'", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Instructions", field: "MPI" });
      cy.fbEnterNameValue({ name: "label", value: "fb-mpi" });
      cy.get("[data-cy=\"instructionsDocument\"]").autocompleteSelect("AR Form");
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Instructions 'Select Document(s)'", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Instructions", field: "Select Document(s)" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-doc" });
      cy.get("[data-cy=\"options\"]").autocompleteSelect("AR Form");
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Actions 'Action Button'", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Actions", field: "Action Button" });
      cy.get("input[value=\"SendEmailWithFormToFill\"]").arrowClick();
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Checkbox group", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Autocomplete", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Text Editor", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Date picker", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Hyperlink", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Select Field", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Radio Button group", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Paragraph", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove File Upload", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Blank Template Form", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Quantity", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Timer", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Purchase Order", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Receive Purchase Order", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove PO Approval Matrix", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Instructions Media upload", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Evidence Media upload", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Procedure", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Equipment", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Text field with range", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Section", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Subsection", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Step", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Approvals", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Inline Approval", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Request Approval", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Checkpoint", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Create a Label", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Implementation Task", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Instructions 'MPI'", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove Instructions 'Select Document(s)'", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove 'Action Button'", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Remove TextField", () => {
      cy.fbRemoveLastAddedItem();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });
  });
});


export { };


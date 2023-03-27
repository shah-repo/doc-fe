// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { TestDocumentType } from "../../utils/constants/documentTypes/testTypes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLogin;

context.skip("Autosave on add and edit FB fields", () => {
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
            importerEmail: USERS[5].email,
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
    });

    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2");
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
      cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
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
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Add Radio Button group", () => {

      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbGroupOptions("option1", "option2");
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
      cy.get("div[data-cy=\"form.builder.timer\"]").eq(-1).arrowClick();
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

    it("Add EB Procedure", () => {
      cy.fbAddNewFieldWhenHidden();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit TextField", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit Checkbox group", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-checkbox-group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit Autocomplete", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit Text Editor", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-text-editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit Date picker", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-datepicker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit Hyperlink", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-hyperlink" });
      cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit Select Field", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-select-field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-field1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit Radio Button group", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-radiobutton-group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit Paragraph", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-paragraph" });
      cy.get("[data-cy=\"paragraph\"]>div>div>div>div>div[contenteditable]")
        .click({ force: true }).clear().arrowType("fb-paragraph1");
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit File Upload", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-fileupload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit Blank Template Form", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-blank-template" });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit Quantity", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
      cy.fbEnterNameValue({ name: "label", value: "fb-quantity1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit Timer", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-timer" });
      cy.fbEnterNameValue({ name: "label", value: "fb-timer1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    // code is commented for ENC-13939
    // it("Edit Purchase Order", () => {
    //   cy.fbClickLabelEditHiddenBtn({ label: "fb-purchase-order" });
    //   cy.fbEnterNameValue({ name: "label", value: "fb-purchase-order1" });
    //   cy.fbAddNewFieldButton();
    //   cy.saveBarShouldNotExist();
    //   cy.progressBarShouldNotExist();
    // });

    it("Edit Receive Purchase Order", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-receive-purchase-order" });
      cy.fbEnterNameValue({ name: "label", value: "fb-receive-purchase-order1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit PO Approval Matrix", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-po-approval-matrix" });
      cy.fbEnterNameValue({ name: "label", value: "fb-po-approval-matrix1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit Instructions Media upload", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "fb-instructions" });
      cy.fbEnterNameValue({ name: "label", value: "fb-instructions1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });

    it("Edit EB Procedure", () => {
      cy.fbClickLabelEditHiddenBtn({ label: "Step #1" });
      cy.fbAddNewFieldButton();
      cy.saveBarShouldNotExist();
      cy.progressBarShouldNotExist();
    });
  });

  context("Verify Updation of Fields on reload page", () => {
    it("reload page", () => {
      cy.navigToDocumentList();
      cy.drFilterDocListByNameAndStatus({ title: "New Document Revision", status: "Draft" });
    });

    it("Verify TextField", () => {
      cy.contains("fb-textfield1").should("exist");
    });

    it("Verify Checkbox group", () => {
      cy.contains("fb-checkbox-group1").should("exist");
    });

    it("Verify Autocomplete", () => {
      cy.contains("fb-autocomplete1").should("exist");
    });

    it("Verify Text Editor", () => {
      cy.contains("fb-text-editor1").should("exist");
    });

    it("Verify Date picker", () => {
      cy.contains("fb-datepicker1").should("exist");
    });

    it("Verify Hyperlink", () => {
      cy.contains("fb-hyperlink1").should("exist");
    });

    it("Verify Select Field", () => {
      cy.contains("fb-select-field1").should("exist");
    });

    it("Verify Radio Button group", () => {
      cy.contains("fb-radiobutton-group1").should("exist");
    });

    it("Verify Paragraph", () => {
      cy.contains("fb-paragraph1").should("exist");
    });

    it("Verify File Upload", () => {
      cy.contains("fb-fileupload1").should("exist");
    });

    it("Verify Blank Template Form", () => {
      cy.contains("fb-blank-template1").should("exist");
    });

    it("Verify Quantity", () => {
      cy.contains("fb-quantity1").should("exist");
    });

    it("Verify Timer", () => {
      cy.contains("fb-timer1").should("exist");
    });


    // code is commented for ENC-13939
    // it("Verify Purchase Order", () => {
    //   cy.contains("fb-purchase-order1").should("exist");
    // });

    it("Verify Receive Purchase Order", () => {
      cy.contains("fb-receive-purchase-order1").should("exist");
    });

    it("Verify PO Approval Matrix", () => {
      cy.contains("fb-po-approval-matrix1").should("exist");
    });

    it("Verify Instructions Media upload", () => {
      cy.contains("fb-instructions1").should("exist");
    });

    it("Verify EB Procedure", () => {
      cy.contains("Step #1").should("exist");
    });
  });
});

export { };


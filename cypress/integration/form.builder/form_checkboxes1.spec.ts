// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginFirst;

context("Checkboxes test1", () => {
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
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: IMPORTER_USER.email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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

  context("Create a form", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'eb-title'", () => {
      cy.drEnterDocumentTitle({ name: "eb-title" });
    });

    it("Enter document description 'eb description'", () => {
      cy.drEnterDocumentDescription({ description: "eb description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Engineering Build' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
      cy.unClick();
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Add Fields with Checkboxes", () => {
    it("Add TextField with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "textfield-wi-ch" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByName({ name: "textfield-wi-ch-" } );
    });

    it("Add TextField without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "textfield-wo-ch" });
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByName({ name: "textfield-wo-ch-" } );
    });

    it("Add Checkbox group with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbEnterNameValue({ name: "label", value: "cbg-wi-ch" });
      cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "cbg-wi-ch" });
    });

    it("Add Checkbox group without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "cbg-wo-ch" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "cbg-wo-ch" });
    });

    it("Add Autocomplete with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "ac-wi-ch" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.fbSelectCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();

      cy.contains("ac-wi-ch").trigger("mouseover", { force: true });
    });

    it("Add Autocomplete without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "ac-wo-ch" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.fbAddNewFieldButton();

      cy.contains("ac-wo-ch").trigger("mouseover");
    });

    it("Add Text Editor with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
      cy.fbEnterNameValue({ name: "label", value: "te-wi-ch" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "te-wi-ch" } );
    });

    it("Add Text Editor without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
      cy.fbEnterNameValue({ name: "label", value: "te-wo-ch" });
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "te-wo-ch" } );
    });

    it("Add Date picker with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
      cy.fbEnterNameValue({ name: "label", value: "dp-wi-ch" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "dp-wi-ch" } );
    });

    it("Add Date picker without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
      cy.fbEnterNameValue({ name: "label", value: "dp-wo-ch" });
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "dp-wo-ch" } );
    });

    it("Add Hyperlink with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
      cy.fbEnterNameValue({ name: "label", value: "hl-wi-ch" });
      cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "hl-wi-ch" } );
    });

    it("Add Hyperlink without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
      cy.fbEnterNameValue({ name: "label", value: "hl-wo-ch" });
      cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "hl-wo-ch" } );
    });

    it("Add Select Field with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
      cy.fbEnterNameValue({ name: "label", value: "sf-wi-ch" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbSelectCheckboxValue("includeNone", "includeContext", "reviseDisabled",
        "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "sf-wi-ch" } );
    });

    it("Add Select Field without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
      cy.fbEnterNameValue({ name: "label", value: "sf-wo-ch" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "sf-wo-ch" } );
    });

    it("Add Radio Button group with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "rbg-wi-ch" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "rbg-wi-ch" } );
    });

    it("Add Radio Button group without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "rbg-wo-ch" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "rbg-wo-ch" } );
    });

    it("Add File Upload with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fu-wi-ch" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "fu-wi-ch" } );
    });

    it("Add File Upload without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fu-wo-ch" });
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "fu-wo-ch" } );
    });

    it("Add Quantity with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
      cy.fbEnterNameValue({ name: "label", value: "q-wi-ch" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "q-wi-ch" } );
    });

    it("Add Quantity without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
      cy.fbEnterNameValue({ name: "label", value: "q-wo-ch" });
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "q-wo-ch" } );
    });

    it("Add Timer with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Timer" });
      cy.fbEnterNameValue({ name: "label", value: "t-wi-ch" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "t-wi-ch" } );
    });

    it("Add Timer without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Timer" });
      cy.fbEnterNameValue({ name: "label", value: "t-wo-ch" });
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "t-wo-ch" } );
    });

    it("Add Purchase Order with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "po-wi-ch" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "po-wi-ch" } );
    });

    it("Add Purchase Order without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "po-wo-ch" });
      cy.fbAddNewFieldButton();
      cy.fbMouseOverByLabel({ label: "po-wo-ch" } );
    });

    it("Add Receive Purchase Order with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Receive Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "rpo-wi-ch" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();

      cy.fbMouseOverByLabel({ label: "rpo-wi-ch" } );
    });

    it("Add Receive Purchase Order without checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Receive Purchase Order" });
      cy.fbEnterNameValue({ name: "label", value: "rpo-wo-ch" });
      cy.fbAddNewFieldButton();

      cy.fbMouseOverByLabel({ label: "rpo-wo-ch" } );
    });

    it("Add Actions 'Action Button' with checkboxes", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Actions", field: "Action Button" });
      cy.get("input[value^=\"SendEmailWithFormToFill\"]").check();
      cy.get("input[value^=\"SendSurveyEmailWithFormToFill\"]").check();
      cy.unClick();
      cy.fbAddNewFieldButton();
    });
  });

  context("Verify other checkboxes properties", () => {
    it("Verify Autocomplete with 'Include QR Scan' checkbox", () => {
      cy.contains("ac-wi-ch").parentsUntil("li").should("contain", "Scan QR code");
    });

    it("Verify Autocomplete without 'Include QR Scan' checkbox", () => {
      cy.contains("ac-wo-ch").parentsUntil("li").should("not.contain", "Scan QR code");
    });

    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify Autocomplete with 'Multi Select' checkbox", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy^=\"ac-wi-ch-\"]")
        .click()
        .type("{downarrow}{enter}")
        .click()
        .type("{downarrow}{downarrow}{enter}")
        .should("have.value", "");
    });

    it("Verify Autocomplete without 'Multi Select' checkbox", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy^=\"ac-wo-ch-\"]")
        .click()
        .type("{downarrow}{enter}")
        .should("not.have.value", "");
    });

    it("Verify Select Field without 'Include None' checkbox", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[id^=mui-component-select-sf-wo-ch-]").arrowClick();
      cy.get("[id^=menu-sf-wo-ch-] ul").should("not.contain", "None");
      cy.get("[id^=menu-sf-wo-ch-] ul").arrowClick();
    });

    it("Verify Select Field with 'Include None' checkbox", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[id^=mui-component-select-sf-wi-ch-]").arrowClick();
      cy.get("[id^=menu-sf-wi-ch-] ul").should("contain", "None");
      cy.get("[id^=menu-sf-wi-ch-] ul").arrowClick();
    });

    it("Verify Select Field without 'Include Other' checkbox", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[id^=mui-component-select-sf-wo-ch-]").arrowClick();
      cy.get("[id^=menu-sf-wo-ch-] ul").should("not.contain", "Other");
      cy.get("[id^=menu-sf-wo-ch-] ul").arrowClick();
    });

    it("Verify Select Field with 'Include Other' checkbox", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[id^=mui-component-select-sf-wi-ch-]").arrowClick();
      cy.get("[id^=menu-sf-wi-ch-] ul").should("contain", "Other");
      cy.get("[id^=menu-sf-wi-ch-] ul").arrowClick();
    });

    it("Verify Radio Button group without 'Include Other' checkbox", () => {
      cy.get("[label='rbg-wo-ch']").last().should("not.contain", "Other");
    });

    it("Verify Radio Button group with 'Include Other' checkbox", () => {
      cy.contains("rbg-wi-ch").parentsUntil("li").should("contain", "Other");
    });

    it("Verify 'Send Email' checkbox", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy=\"Send Email\"]").eq(0)
        .should("have.text", "Send Email");
    });

    it("Verify 'Send Email with Supplier' checkbox", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy=\"Send Email\"]").eq(1)
        .should("have.text", "Send Email");
    });

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Create & Approve Document", () => {
    it("Click create document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingFormWithoutApi();
      cy.fbClickButton({ el: "updateRecord" });
    });
  });

  context("Verify 'Revision Disabled' checkbox property", () => {
    it("Verify TextField without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByName({ name: "textfield-wo-ch-" } );
      cy.fbVerifyElementVisibile({ name: "textfield-wo-ch-", el: "edit-schema-item" });
      cy.fbVerifyElementVisibile({ name: "textfield-wo-ch-", el: "remove-schema-item" });
    });

    it("Verify TextField with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByName({ name: "textfield-wi-ch-" } );
      cy.fbVerifyElementNotVisibile({ name: "textfield-wi-ch-", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibile({ name: "textfield-wi-ch-", el: "remove-schema-item" });
    });

    it("Verify Checkbox Group without 'Include Other' checkbox", () => {
      cy.fbVerifyElementNotContainText({ name: "cbg-wo-ch-", label: "cbg-wo-ch", text: "Other" });
    });

    it("Verify Checkbox Group with 'Include Other' checkbox", () => {
      cy.fbVerifyElementContainText({ name: "cbg-wi-ch-", label: "cbg-wi-ch", text: "Other" });
    });

    it("Verify Checkbox Group without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "cbg-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "cbg-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "cbg-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Checkbox Group with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "cbg-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "cbg-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "cbg-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Autocomplete without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "ac-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "ac-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "ac-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Autocomplete with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "ac-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "ac-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "ac-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Text Editor without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "te-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "te-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "te-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Text Editor with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "te-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "te-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "te-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Date picker without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "dp-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "dp-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "dp-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Date picker with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "dp-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "dp-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "dp-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Hyperlink without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "hl-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "hl-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "hl-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Hyperlink with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "hl-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "hl-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "hl-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Select Field without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "sf-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "sf-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "sf-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Select Field with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "sf-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "sf-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "sf-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Radio Button group without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "rbg-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "rbg-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "rbg-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Radio Button group with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "rbg-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "rbg-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "rbg-wi-ch", el: "remove-schema-item" });
    });

    it("Verify File Upload without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "fu-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "fu-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "fu-wo-ch", el: "remove-schema-item" });
    });

    it("Verify File Upload with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "fu-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "fu-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "fu-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Quantity without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "q-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "q-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "q-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Quantity with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "q-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "q-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "q-wi-ch", el: "remove-schema-item" });
    });

    it("Verify Timer without 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "t-wo-ch" } );
      cy.fbVerifyElementVisibileByLabel({ label: "t-wo-ch", el: "edit-schema-item" });
      cy.fbVerifyElementVisibileByLabel({ label: "t-wo-ch", el: "remove-schema-item" });
    });

    it("Verify Timer with 'Revision Disabled' checkbox", () => {
      cy.fbMouseOverByLabel({ label: "t-wi-ch" } );
      cy.fbVerifyElementNotVisibileByLabel({ label: "t-wi-ch", el: "edit-schema-item" });
      cy.fbVerifyElementNotVisibileByLabel({ label: "t-wi-ch", el: "remove-schema-item" });
    });
  });

  context("Create a new document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Filters form by name and status, and select it", () => {
      cy.drFilterDocListByNameAndStatus({ title: "eb-title", status: "Released" });
    });

    it("Click to Create document", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter eb document title 'eb-doc-title'", () => {
      cy.drEnterDocumentTitle({ name: "eb-doc-title" });
    });

    it("Enter document description 'eb document description'", () => {
      cy.drEnterDocumentDescription({ description: "eb description" });
    });

    it("Click save document", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });
  });

  context("Verify 'Deletion Disabled' checkbox property", () => {
    it("Verify TextField without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClass({ name: "textfield-wo-ch-", el: "remove-schema-item", class: "schema-delete-enabled" });
    });

    it("Verify TextField with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClass({
        name: "textfield-wi-ch-", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Checkbox Group without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "cbg-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Checkbox Group with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "cbg-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Autocomplete without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "ac-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Autocomplete with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "ac-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Text Editor without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "te-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Text Editor with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "te-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Date picker without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "dp-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Date picker with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "dp-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Hyperlink without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "hl-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Hyperlink with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "hl-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Select Field without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "sf-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Select Field with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "sf-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Radio Button group without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "rbg-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Radio Button group with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "rbg-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify File Upload without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "fu-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify File Upload with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "fu-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Quantity without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "q-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Quantity with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "q-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Verify Timer without 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "t-wo-ch", el: "remove-schema-item",
        class: "schema-delete-enabled",
      });
    });

    it("Verify Timer with 'Deletion Disabled' checkbox", () => {
      cy.fbVerifyElementClassByLabel({
        label: "t-wi-ch", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });
  });

  context("Create Document", () => {
    it("Click create document", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
    });
  });
});

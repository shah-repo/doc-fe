// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolNotRedline } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginFirst;

context("Copyable Checkbox test", () => {
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
              ClinicalProtocolNotRedline,
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

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
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
      cy.drClickCreateDocumentWithApiCall();
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
        cy.fbEnterNameValue({ name: "label", value: "hy-wo-ch" });
        cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "hy-wo-ch" } );
      });

      it("Add Hyperlink without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
        cy.fbEnterNameValue({ name: "label", value: "hy-wi-ch" });
        cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "hy-wi-ch" } );
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

      it("Add Blank Template Form", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Blank Template Form" });
        cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
        cy.fbAddNewFieldButton();
        cy.elUploadAttachment({ fileName: "image.jpg", el: "fb-attachment-field-fb-blank-template-" });
        cy.fbMouseOverByLabel({ label: "fb-blank-template" } );
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

      it("Add Procedure with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "Step #1" } );
      });

      it("Add Procedure without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "EB Procedure" });
        cy.fbUnSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "Step #2" } );
      });

      it("Add Equipment with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "eq-wi-ch" });
        cy.get("input[value=\"preventativeMaintenance\"]").arrowClick();
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "eq-wi-ch" } );
      });

      it("Add Equipment without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "eq-wo-ch" });
        cy.get("input[value=\"preventativeMaintenance\"]").arrowClick();
        cy.fbUnSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "eq-wo-ch" } );
      });

      it("Add Text field with range with checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
        cy.fbEnterNameValue({ name: "label", value: "twr-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "twr-wi-ch" } );
      });

      it("Add Text field with range without checkboxes", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field with range" });
        cy.fbEnterNameValue({ name: "label", value: "twr-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "twr-wo-ch" } );
      });
    });
  });

  context("Create & Approve Document", () => {
    it("Click create document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        cy.fbClickButton({ el: "updateRecord" });
      });
    });
  });

  context("Create 'Engineering Build' Record for copyableValue checkbox", () => {
    it("Navigate to Record on side bar", () => {
      cy.navigToRecords();
    });

    it("Click 'Create a Record' button", () => {
      cy.poClickCreatePO();
    });

    it("Select Record Type: 'Engineering Build'", () => {
      cy.wrapWithWaitOnApiCalls([
        CyRoutes.PostDocRev,
        CyRoutes.AvailableMaintenanceForms], () => {
        cy.get("#MultipleFormTemplate-selectDocForm").arrowClick();
        cy.get("div[id^=react-select]").contains("Engineering Build").arrowClick();
      });
    });

    it("Add TextFields value", () => {
      cy.unClick();
      cy.get("[name^=\"textfield-wi-ch-\"]").arrowType("textfield-wi-ch-value", { force: true });
      cy.unClick();
      cy.get("[name^=\"textfield-wo-ch-\"]").arrowType("textfield-wo-ch-value", { force: true });
      cy.unClick();
    });

    it("Select Checkboxes group", () => {
      cy.get("[name^=\"cbg-wi-ch-\"]").find("label").eq(0).arrowClick();
      cy.get("[name^=\"cbg-wo-ch-\"]").find("label").eq(0).arrowClick();
    });

    it("Add TextEditors value", () => {
      cy.get("[data-cy^=\"te-wi-ch-\"]").find("div[contenteditable]")
        .click({ force: true }).arrowType("te-wi-ch-value");
      cy.get("[data-cy^=\"te-wo-ch-\"]").find("div[contenteditable]")
        .click({ force: true }).arrowType("te-wo-ch-value");
    });

    it("Select 'Select fields' value", () => {
      cy.get("[id^=mui-component-select-sf-wi-ch-]").arrowClick();
      cy.get("[data-value=\"option1\"]").arrowClick();
      cy.contains("sf-wi-ch").arrowClick();
      cy.get("[id^=mui-component-select-sf-wo-ch-]").arrowClick();
      cy.get("[data-value=\"option1\"]").arrowClick();
    });

    it("Select Radio button groups value", () => {
      cy.get("[name^=\"rbg-wi-ch-\"]").eq(0).arrowClick();
      cy.get("[name^=\"rbg-wo-ch-\"]").eq(0).arrowClick();
    });

    it("Add Quantities value", () => {
      cy.get("[name^=\"q-wi-ch-\"]").arrowType("1");
      cy.get("[name^=\"q-wo-ch-\"]").arrowType("1");
    });

    it("Add Timers value", () => {
      cy.get("[name^=\"t-wi-ch-\"]").arrowType("t-wi-ch-value", { force: true });
      cy.unClick();
      cy.get("[name^=\"t-wo-ch-\"]").arrowType("t-wo-ch-value", { force: true });
    });

    it("Add 'TextField with range' value", () => {
      cy.get("[name^=\"twr-wi-ch-\"]").arrowType("2");
      cy.get("[name^=\"twr-wo-ch-\"]").arrowType("2");
    });

    it("Add Date pickers value", () => {
      cy.get("[name^=\"dp-wi-ch-\"]").parent().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.get("[name^=\"dp-wo-ch-\"]").parent().find("button").arrowClick();
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Select Autocompletes", () => {
      cy.get("[data-cy^=\"ac-wi-ch-\"]").arrowClick().autocompleteSelect("eb-title");
      cy.get("[data-cy^=\"ac-wo-ch-\"]").arrowClick().autocompleteSelect("eb-title");
    });

    it("Select Procedure", () => {
      cy.contains("Step #1").parentsUntil(".MuiFormControl-fullWidth").parent()
        .find("div[contenteditable]").arrowClick({ force: true }).clear().arrowType("step1 description");

      cy.contains("Step #2").parentsUntil(".MuiFormControl-fullWidth").parent()
        .find("div[contenteditable]").arrowClick({ force: true }).clear().arrowType("step2 description");
    });

    it("Select radio button of with copyableValue checkbox Equipment Maintenance", () => {
      cy.get("input[name^=\"eq-wi-ch-\"]").eq(-1).arrowClick();
    });

    it("Enter Justification of with copyableValue checkbox Equipment Maintenance", () => {
      cy.get("div[data-cy^=\"eq-wi-ch-\"]:eq(-2)").find("div[contenteditable]")
        .click({ force: true }).clear().arrowType("Justification1");
    });

    it("Select radio button of without copyableValue checkbox Equipment Maintenance", () => {
      cy.get("input[name^=\"eq-wo-ch-\"]").eq(-1).arrowClick({ force: true });
    });

    it("Enter Justification of without copyableValue checkbox Equipment Maintenance", () => {
      cy.get("div[data-cy^=\"eq-wo-ch-\"]:eq(-2)").find("div[contenteditable]")
        .click({ force: true }).clear().arrowType("Justification2");
    });

    it("Enter title: 'test title'", () => {
      cy.drEnterDocumentTitle({ name: "test title" });
    });

    it("Enter description: 'test description'", () => {
      cy.drEnterDocumentDescription({ description: "test description" });
    });

    it("Click 'Save' button", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Click 'Clone EB' button", () => {
      cy.ebClickCloneFromMenu();
    });
  });

  context("Verify 'copyableValue' checkbox property", () => {
    it("Verify 'TextField' values", () => {
      cy.get("[name^=\"textfield-wi-ch-\"]").should("have.value", "textfield-wi-ch-value");
      cy.get("[name^=\"textfield-wo-ch-\"]").should("not.have.value", "textfield-wo-ch-value");
    });

    it("Verify 'Checkboxes group' values", () => {
      cy.get("[name^=\"cbg-wi-ch-\"]").find("input").eq(0).should("be.checked");
      cy.get("[name^=\"cbg-wo-ch-\"]").find("input").eq(0).should("not.be.checked");
    });

    it("Verify TextEditor with Editor values", () => {
      cy.get("[data-cy^=\"te-wi-ch-\"]").parent().find("p").should("have.text", "te-wi-ch-value");
      cy.get("[data-cy^=\"te-wo-ch-\"]").parent().should("not.have.text", "te-wo-ch-value");
    });

    it("Verify location linked on Hyperlink", () => {
      cy.window().then((win) => {
        cy.spy(win, "open").as("redirect");
      });
      cy.get("[name^=hy-wi-ch]").arrowClick();
      cy.get("@redirect").should("be.calledWith", "https://google.com");
    });

    it("Verify Select fields values", () => {
      cy.get("[name^=\"sf-wi-ch-\"]").should("have.value", "option1");
      cy.get("[name^=\"sf-wo-ch-\"]").invoke("val").should("be.empty");
    });

    it("Verify Radio button groups values", () => {
      cy.get("[name^=\"rbg-wi-ch-\"]").eq(0).should("have.value", "option1");
      cy.get("[name^=\"rbg-wo-ch-\"]").eq(0).should("not.be.checked");
    });

    it("Verify Quantities values", () => {
      cy.get("[name^=\"q-wi-ch-\"]").should("have.value", "1");
      cy.get("[name^=\"q-wo-ch-\"]").invoke("val").should("be.empty");
    });

    it("Verify Timers values", () => {
      cy.get("[name^=\"t-wi-ch-\"]").should("have.value", "t-wi-ch-value");
      cy.get("[name^=\"t-wo-ch-\"]").invoke("val").should("be.empty");
    });

    it("Verify TextField with range values", () => {
      cy.get("[name^=\"twr-wi-ch-\"]").should("have.value", "2");
      cy.get("[name^=\"twr-wo-ch-\"]").invoke("val").should("be.empty");
    });

    it("Verify Date pickers values", () => {
      cy.get("input[name^=\"dp-wi-ch-\"]").invoke("val").should("not.be.empty");
      cy.get("input[name^=\"dp-wo-ch-\"]").invoke("val").should("be.empty");
    });

    it("Verify Autocompletes values", () => {
      cy.get("[data-cy^=\"ac-wi-ch-\"]").parent().invoke("text").should("not.be.empty");
      cy.get("[data-cy^=\"ac-wo-ch-\"]").should("have.value", "");
    });

    it("Verify Procedure", () => {
      cy.contains("Step #1").parentsUntil(".MuiFormControl-fullWidth").parent()
        .find("div").eq(-1).invoke("text").should("not.be.empty");
      cy.contains("Step #2").parentsUntil(".MuiFormControl-fullWidth").parent()
        .find("div").eq(-1).invoke("text").should("be.empty");
    });

    it("Verify Equipment Maintenance", () => {
      cy.get("div[data-cy^=\"eq-wi-ch-\"]:eq(-2)").invoke("text").should("not.be.empty");
      cy.get("input[name^=\"eq-wo-ch-\"]").eq(-1).should("not.be.checked");
    });
  });

  context("Edit and Verify field values", () => {
    it("Edit Quantity value", () => {
      cy.get("[name^=\"q-wi-ch-\"]").clear().arrowType("2");
    });

    it("Click 'Save' button", () => {
      cy.unClick();
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Verify Quantity value", () => {
      cy.unClick();
      cy.get("[name^=\"q-wi-ch-\"]").should("have.value", "2");
    });
  });

  context("Add, Edit and Verify fields", () => {
    it("Add new Quantity field", () => {
      cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).arrowClick({ force: true });
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
      cy.fbEnterNameValue({ name: "label", value: "quantity" });
      cy.fbAddNewFieldButton();
    });

    it("Add new Hyperlink field", () => {
      cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).arrowClick({ force: true });
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
      cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
      cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
      cy.fbAddNewFieldButton();
    });

    it("Add new Autocomplete field", () => {
      cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).arrowClick({ force: true });
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
      cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.fbAddNewFieldButton();
    });

    it("Add new Text Editor field", () => {
      cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).arrowClick({ force: true });
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
      cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
      cy.fbAddNewFieldButton();
    });

    it("Add new Date picker field", () => {
      cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).arrowClick({ force: true });
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Quantity field", () => {
      cy.contains("quantity").parentsUntil("li").find("[data-cy=edit-schema-item]").arrowClick({ force: true });
      cy.fbEnterNameValue({ name: "label", value: "quantity1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Blank Template field", () => {
      cy.contains("fb-blank-template")
        .parentsUntil("li").find("[data-cy=edit-schema-item]").arrowClick({ force: true });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Hyperlink field", () => {
      cy.contains("fb-hyperlink").parentsUntil("li").find("[data-cy=edit-schema-item]").arrowClick({ force: true });
      cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Autocomplete field", () => {
      cy.contains("fb-autocomplete").parentsUntil("li").find("[data-cy=edit-schema-item]").arrowClick({ force: true });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Text Editor field", () => {
      cy.contains("fb-text-editor").parentsUntil("li").find("[data-cy=edit-schema-item]").arrowClick({ force: true });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor1" });
      cy.fbAddNewFieldButton();
    });

    it("Edit Date picker field", () => {
      cy.contains("fb-datepicker").parentsUntil("li").find("[data-cy=edit-schema-item]").arrowClick({ force: true });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker1" });
      cy.fbAddNewFieldButton();
    });

    it("Click 'Save' button", () => {
      cy.unClick();
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Verify Quantity field", () => {
      cy.get("[data-cy=quantity1]").should("have.text", "quantity1");
    });

    it("Verify Blank Template field", () => {
      cy.get("[data-cy=fb-blank-template1]").should("have.text", "fb-blank-template1");
    });

    it("Verify Hyperlink field", () => {
      cy.get("[name^=fb-hyperlink-]").should("have.text", "fb-hyperlink1");
    });

    it("Verify Autocomplete field", () => {
      cy.get("[data-cy=fb-autocomplete1]").should("have.text", "fb-autocomplete1");
    });

    it("Verify Text Editor field", () => {
      cy.get("[data-cy=fb-text-editor1]").should("have.text", "fb-text-editor1");
    });

    it("Verify Date picker field", () => {
      cy.get("[data-cy=fb-datepicker1]").should("have.text", "fb-datepicker1");
    });
  });
});

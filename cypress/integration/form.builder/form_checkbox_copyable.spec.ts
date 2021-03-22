// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Copyable Checkbox test", () => {
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
            importerEmail: USERS[5].email,
            numOfRevStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
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
        password: "Tester1!",
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
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
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

    context("Add Fields with Checkboxes", () => {
      it("Add TextField with checkboxes", () => {
        cy.get("[data-cy^=\"fb-approvals-fb-approvals-\"]").parent().trigger("mouseover");
        cy.get("[data-cy=\"form.builder.add.field\"]").click();
        cy.fbSelectItemFromNewFieldList({ field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "textfield-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByName({ name: "textfield-wi-ch-" } );
      });

      it("Add TextField without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "textfield-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByName({ name: "textfield-wo-ch-" } );
      });

      it("Add Checkbox group with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbEnterNameValue({ name: "label", value: "cbg-wi-ch" });
        cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "cbg-wi-ch" });
      });

      it("Add Checkbox group without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Checkbox group" });
        cy.fbEnterNameValue({ name: "label", value: "cbg-wo-ch" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "cbg-wo-ch" });
      });

      it("Add Autocomplete with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "ac-wi-ch" });
        cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
        cy.fbSelectCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.wait(2000);
        cy.contains("ac-wi-ch").trigger("mouseover");
      });

      it("Add Autocomplete without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "ac-wo-ch" });
        cy.get("[data-cy=\"optionId\"]").type("Document Revision{downarrow}{enter}");
        cy.fbAddNewFieldButton();
        cy.wait(2000);
        cy.contains("ac-wo-ch").trigger("mouseover");
      });

      it("Add Text Editor with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
        cy.fbEnterNameValue({ name: "label", value: "te-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "te-wi-ch" } );
      });

      it("Add Text Editor without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Text Editor" });
        cy.fbEnterNameValue({ name: "label", value: "te-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "te-wo-ch" } );
      });

      it("Add Date picker with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
        cy.fbEnterNameValue({ name: "label", value: "dp-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "dp-wi-ch" } );
      });

      it("Add Date picker without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Date picker" });
        cy.fbEnterNameValue({ name: "label", value: "dp-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "dp-wo-ch" } );
      });

      it("Add Select Field with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "sf-wi-ch" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeNone", "includeContext", "reviseDisabled",
          "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "sf-wi-ch" } );
      });

      it("Add Select Field without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Select" });
        cy.fbEnterNameValue({ name: "label", value: "sf-wo-ch" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "sf-wo-ch" } );
      });

      it("Add Radio Button group with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "rbg-wi-ch" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "rbg-wi-ch" } );
      });

      it("Add Radio Button group without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Radio Button group" });
        cy.fbEnterNameValue({ name: "label", value: "rbg-wo-ch" });
        cy.fbGroupOptions("option1", "option2");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "rbg-wo-ch" } );
      });

      it("Add Quantity with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
        cy.fbEnterNameValue({ name: "label", value: "q-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "q-wi-ch" } );
      });

      it("Add Quantity without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Quantity" });
        cy.fbEnterNameValue({ name: "label", value: "q-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "q-wo-ch" } );
      });

      it("Add Timer with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.get("div[data-cy=\"form.builder.timer\"]").eq(-1).click();
        cy.fbEnterNameValue({ name: "label", value: "t-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "t-wi-ch" } );
      });

      it("Add Timer without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.get("div[data-cy=\"form.builder.timer\"]").eq(-1).click();
        cy.fbEnterNameValue({ name: "label", value: "t-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "t-wo-ch" } );
      });

      it("Add Purchase Order with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Purchase Order" });
        cy.fbEnterNameValue({ name: "label", value: "po-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "po-wi-ch" } );
      });

      it("Add Purchase Order without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Purchase Order" });
        cy.fbEnterNameValue({ name: "label", value: "po-wo-ch" });
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "po-wo-ch" } );
      });

      it("Add Approval Matrix with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Approval Matrix" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "Approval Roles" } );
      });

      it("Add Procedure with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "Step #1" } );
      });

      it("Add Procedure without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Procedure" });
        cy.fbUnSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "Step #2" } );
      });

      it("Add Equipment with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "eq-wi-ch" });
        cy.get("input[value=\"preventativeMaintenance\"]").click();
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "eq-wi-ch" } );
      });

      it("Add Equipment without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Equipment" });
        cy.fbEnterNameValue({ name: "label", value: "eq-wo-ch" });
        cy.get("input[value=\"preventativeMaintenance\"]").click();
        cy.fbUnSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "eq-wo-ch" } );
      });

      it("Add Text field with range with checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
        cy.fbEnterNameValue({ name: "label", value: "twr-wi-ch" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
        cy.fbMouseOverByLabel({ label: "twr-wi-ch" } );
      });

      it("Add Text field with range without checkboxes", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").eq(-1).click();
        cy.fbSelectItemFromNewFieldList({ field: "Text field with range" });
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
      cy.fbClickButton({ el: "navigation.records" });
    });

    it("Click 'Create a Record' button", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.GetDocumentType, () => {
        cy.get("#DocumentByTypeListPresenter-openDocRev").click();
      });
    });

    it("Select Record Type: 'Engineering Build'", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PostDocRev, CyRoutes.EmployeesGet], () => {
        cy.get("#MultipleFormTemplate-selectDocForm").type("Engineering Build{downarrow}{enter}");
      });
    });

    it("Add TextFields value", () => {
      cy.get("[name^=\"textfield-wi-ch-\"]").type("textfield-wi-ch-value");
      cy.get("[name^=\"textfield-wo-ch-\"]").type("textfield-wo-ch-value");
    });

    it("Select Checkboxes group", () => {
      cy.get("[name^=\"cbg-wi-ch-\"]").find("label").eq(0).click();
      cy.get("[name^=\"cbg-wo-ch-\"]").find("label").eq(0).click();
    });

    it("Add TextEditors value", () => {
      cy.get("[data-cy^=\"te-wi-ch-\"]").find("div[contenteditable]")
        .click({ force: true }).type("te-wi-ch-value");
      cy.get("[data-cy^=\"te-wo-ch-\"]").find("div[contenteditable]")
        .click({ force: true }).type("te-wo-ch-value");
    });

    it("Select 'Select fields' value", () => {
      cy.get("[id^=mui-component-select-sf-wi-ch-]").click();
      cy.get("[data-value=\"option1\"]").click();
      cy.contains("sf-wi-ch").click();
      cy.get("[id^=mui-component-select-sf-wo-ch-]").click();
      cy.get("[data-value=\"option1\"]").click();
    });

    it("Select Radio button groups value", () => {
      cy.get("[name^=\"rbg-wi-ch-\"]").eq(0).click();
      cy.get("[name^=\"rbg-wo-ch-\"]").eq(0).click();
    });

    it("Add Quantities value", () => {
      cy.get("[name^=\"q-wi-ch-\"]").type("1");
      cy.get("[name^=\"q-wo-ch-\"]").type("1");
    });

    it("Add Timers value", () => {
      cy.get("[name^=\"t-wi-ch-\"]").type("t-wi-ch-value");
      cy.get("[name^=\"t-wo-ch-\"]").type("t-wo-ch-value");
    });

    it("Add 'TextField with range' value", () => {
      cy.get("[name^=\"twr-wi-ch-\"]").type("2");
      cy.get("[name^=\"twr-wo-ch-\"]").type("2");
    });

    it("Add Date pickers value", () => {
      cy.get("[name^=\"dp-wi-ch-\"]").parent().find("button").click();
      cy.get(".MuiPickersDay-daySelected").click();
      cy.get("[name^=\"dp-wo-ch-\"]").parent().find("button").click();
      cy.get(".MuiPickersDay-daySelected").click();
    });

    it("Add Purchase Orders value", () => {
      cy.get(".MuiOutlinedInput-root div[id^=\"mui-component-select-po-wi-ch-\"]").click();
      cy.get("[data-value=EUR]").click();
      cy.get(".MuiOutlinedInput-root div[id^=\"mui-component-select-po-wo-ch-\"]").click();
      cy.get("[data-value=EUR]").click();
    });

    it("Select Autocompletes", () => {
      cy.get("[data-cy^=\"ac-wi-ch-\"]").click().type("test title{downarrow}{enter}");
      cy.get("[data-cy^=\"ac-wo-ch-\"]").click().type("test title{downarrow}{enter}");
    });

    it("Select Procedure", () => {
      cy.contains("Step #1").parentsUntil(".MuiFormControl-fullWidth").parent()
        .find("div[contenteditable]").click({ force: true }).clear().type("step1 description");

      cy.contains("Step #2").parentsUntil(".MuiFormControl-fullWidth").parent()
        .find("div[contenteditable]").click({ force: true }).clear().type("step2 description");
    });

    it("Select radio button of with copyableValue checkbox Equipment Maintenance", () => {
      cy.get("input[name^=\"eq-wi-ch-\"]").eq(-1).click();
    });

    it("Enter Justification of with copyableValue checkbox Equipment Maintenance", () => {
      cy.get("[data-cy^=\"eq-wi-ch-\"]").find("div[contenteditable]")
        .click({ force: true }).clear().type("Justification1");
    });

    it("Select radio button of without copyableValue checkbox Equipment Maintenance", () => {
      cy.get("input[name^=\"eq-wo-ch-\"]").eq(-1).click();
    });

    it("Enter Justification of without copyableValue checkbox Equipment Maintenance", () => {
      cy.get("[data-cy^=\"eq-wo-ch-\"]").find("div[contenteditable]")
        .click({ force: true }).clear().type("Justification2");
    });

    it("Click on 'Add Another Role' button", () => {
      cy.get("button[data-cy=\"form.builder.add.another.role\"]").click();
    });

    it("Enter Approval Role 'Role 1'", () => {
      cy.get("[data-cy=\"name\"]").type("Role 1");
    });

    it("Click on 'Add' button", () => {
      cy.get("button[data-cy=\"common.add\"]").click();
    });

    it("Enter title: 'test title'", () => {
      cy.get("#Title-field",  { timeout: 10000 }).type("test title");
    });

    it("Enter description: 'test description'", () => {
      cy.get("[data-cy=\"RichTextEditor.description\"]>div>div>div>div>div[contenteditable]", { timeout: 10000 })
        .click({ force: true }).clear().type("test description");
    });

    it("Click 'Save' button", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev, CyRoutes.GetDocAggregatedAudit], () => {
          cy.unClick();
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click();
        });
      cy.wait(500);
    });

    it("Click 'Clone EB' button", () => {
      cy.fbClickButton({ el: "CloneEBButton" });
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
      cy.get("input[name^=\"dp-wo-ch-\"]").should("have.value", "");
    });

    it("Verify Purchase Orders values", () => {
      cy.get(".MuiOutlinedInput-root div[id^=\"mui-component-select-po-wi-ch-\"]").should("have.text", "EUR €");
      cy.get(".MuiOutlinedInput-root div[id^=\"mui-component-select-po-wo-ch-\"]").should("have.text", "USD $");
    });

    it("Verify Autocompletes values", () => {
      cy.get("[data-cy^=\"ac-wi-ch-\"]").parent().invoke("text").should("not.be.empty");
      cy.get("[data-cy^=\"ac-wo-ch-\"]").should("have.value", "");
    });

    it("Verify Approval Matrix fields & values", () => {
      cy.contains("Approval Role").should("exist");
      cy.contains("Approving Users").should("exist");
      cy.contains("Approving Groups").should("exist");
    });

    it("Verify Procedure", () => {
      cy.contains("Step #1").parentsUntil(".MuiFormControl-fullWidth").parent()
        .find("div").eq(-1).invoke("text").should("not.be.empty");
      cy.contains("Step #2").parentsUntil(".MuiFormControl-fullWidth").parent()
        .find("div").eq(-1).invoke("text").should("be.empty");
    });

    it("Verify Equipment Maintenance", () => {
      cy.get("[data-cy^=\"eq-wi-ch-\"]").invoke("text").should("not.be.empty");
      cy.get("input[name^=\"eq-wo-ch-\"]").eq(-1).should("not.be.checked");
    });
  });
});

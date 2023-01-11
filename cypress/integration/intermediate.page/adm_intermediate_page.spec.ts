// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { AdministrativeDocumentDocType } from "../../utils/constants/documentTypes/administrative";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const paperLhrOutputDocType = "Administrative";

context("Intermediate page validation", () => {
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
            companyAdminEmail: USERS[2].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[5], USERS[3], USERS[4]],
            documentTypes: [AdministrativeDocumentDocType],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[2].email);
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[3].email,
      }).then((response) => {
        loginResponse = response;
        done();
      });
    });
  });

  context("Login company admin", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[2], employeeId: adminEmployee.id });
    });
  });

  context("Navigate to document list", () => {
    it("Navigate to document list landing page", () => {
      cy.navigToDocumentList();
    });
  });

  context("Click on 'create document'", () => {
    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });
  });

  context("Enter title and select revision stage", () => {
    it("Enter document title", () => {
      cy.drEnterDocumentTitle({ name: paperLhrOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: paperLhrOutputDocType + " description" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context(`Select document type ${docType} and check fields`, () => {
    it(`Select ${docType} document type`, () => {
      cy.drSelectDocumentType({ documentType: docType });
    });

    it("Verify Document id is assigned by system", () => {
      cy.get("input[id='document.docId']").should("contain.value", "FM-000");
    });

    it("Verify Document id is editable", () => {
      cy.intPageVerifyDocIdIsEditable();
    });

    it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").parent()
        .should("have.class", "MuiGrid-grid-xs-6").next()
        .should("have.class", "MuiGrid-grid-xs-6")
        .should("contain.text", "Document ID");
    });

    it("Verify 'Revision Stage' field is visible", () => {
      cy.intPageVerifyRevisionStageExist();
    });

    it("Verify 'Training required' field is visible", () => {
      cy.intPageVerifyTrainingRequiredExist();
    });

    it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").parent().parent()
        .should("have.class", "MuiGrid-grid-xs-6").next()
        .should("have.class", "MuiGrid-grid-xs-6")
        .should("contain.text", "Training Required");
    });

    it("Verify 'Selected Users' field is visible", () => {
      cy.intPageVerifySelectedUsersExist();
    });

    it("Verify 'Selected Groups' field is visible", () => {
      cy.intPageVerifySelectedGroupsExist();
    });

    it("Verify 'Attachment' field is displayed", () => {
      cy.intPageVerifyAttachmentExist();
    });

    it("Verify 'Preview Layout' button is disabled and grayed out", () => {
      cy.intPageVerifyPreviewLayoutButtonDisabled();
    });
  });

  context("Select output document type", () => {
    it(`Select ${paperLhrOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: paperLhrOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'Part to be Manufactured' is not displayed", () => {
      cy.intPageVerifyPartToBeManufacturedNotExist();
    });

    it("Check 'Initial Quantity' is not displayed", () => {
      cy.intPageVerifyInitialQuantityNotExist();
    });

    it("Check 'End Quantity' is not displayed", () => {
      cy.intPageVerifyEndQuantityNotExist();
    });

    it("Check 'Build Type' is not displayed", () => {
      cy.intPageVerifyBuildTypeNotExist();
    });

    it("Check 'Approvals' is not displayed", () => {
      cy.intPageVerifyApprovalsNotExist();
    });

    it("Check 'Step #1' is not displayed", () => {
      cy.intPageVerifyLHRStepNotExist();
    });
  });

  context("Verify 'Add Field' and 'Form Options' not displayed on page", () => {
    it("Verify 'Add Field' button not displayed", () => {
      cy.intPageVerifyAddFieldNotExist();
    });

    it("Verify 'Form Options' are not displayed", () => {
      cy.intPageVerifyFormOptionsNotExist();
    });
  });

  context("Click 'Preview Layout' button and verify predefined fields are displayed", () => {
    context("verify default tabs are displayed", () => {
      it("Click 'Preview Layout' button", () => {
        cy.intPageClickPreviewLayout();
      });

      it("Verify 'Overview' tab is displayed", () => {
        cy.intPageVerifyOverviewTabExist();
      });
    });

    context("verify default fields are displayed", () => {
      it("Verify Document type is displayed", () => {
        cy.intPageVerifyDocTypeExist();
      });

      it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
        cy.get("[data-cy=\"field-document.documentType.id\"]").parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Document ID");
      });

      it("Verify 'Revision Stage' field is displayed", () => {
        cy.intPageVerifyRevisionStageExist();
      });

      it("Verify 'Training required' field is displayed", () => {
        cy.intPageVerifyTrainingRequiredExist();
      });

      it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
        cy.get("[data-cy=\"field-revisionStage\"]").parent().parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Training Required");
      });

      it("Verify 'Attachment' field is displayed", () => {
        cy.intPageVerifyAttachmentExist();
      });

      it("Verify Output document type is displayed", () => {
        cy.intPageVerifyOutputDocTypeExist();
      });

      it("Click 'Preview Layout' button", () => {
        cy.intPageClosePreviewDialog();
      });
    });
  });

  context("Click 'Create Document' button and verify predefined fields are displayed", () => {
    it("Click on 'Create Document' button", () => {
      cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Verify there is ADD A FIELD button is displayed", () => {
      cy.intPageVerifyAddFieldExist();
    });

    it("Verify center bottom displays: eye, import and export icons", () => {
      cy.intPageVerifyFormOptionsExist();
    });
  });

  context("Verify form options and add field button is displayed in Details tab", () => {
    context("Check form options are displayed at center bottom", () => {
      it("check 'Form Options' are diplayed at bottom center", () => {
        cy.intPageVerifyFormOptionsExist();
      });
    });

    context("Verify add field button is displayed", () => {
      it("Verify 'Add Field' button displayed", () => {
        cy.intPageVerifyAddFieldExist();
      });
    });
  });

  context("Make sure fields and tabs displayed in non preview mode are the same displayed in Preview mode", () => {
    context("Add form fields", () => {
      it("Add Quantity", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
        cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add Autocomplete", () => {
        SystemRequirement("FB-0140", "FB-0150");
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
        cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete" });
        cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder" });
        cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
        cy.fbSelectCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Save form", () => {
        cy.drClickSaveWithoutApiCall();
      });
    });

    context("Verify Form fields in non preivew mode", () => {
      it("Verify Quantity attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-quantity" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-quantity" });
        cy.fbVerifyCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });

      it("Verify Autocomplete attributes", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-autocomplete" });
        cy.fbVerifyNameValue({ name: "label", value: "fb-autocomplete" });
        cy.fbVerifyNameValue({ name: "placeholder", value: "fb-autocomplete placeholder" });
        cy.get("[data-cy=\"optionId\"]").should("have.value", "Document revisions");
        cy.fbVerifyCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });
    });

    context("Verify Form fields in preview mode", () => {
      it("Open Preview dialog", () => {
        cy.fbClickButton({ el: "FBWorkspace-clickView" });
      });

      it("Add and check Quantity field", () => {
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("input[name^=fb-quantity-]").clear().arrowType("1");
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("input[name^=fb-quantity-]").should("have.value", "1");
      });

      it("Add and check Autocomplete field", () => {
        cy.get("input[data-cy^=\"fb-autocomplete-\"]").eq(1).arrowClick().autocompleteSelect("FM-00001");
        // eslint-disable-next-line max-len
        cy.get("[class='MuiChip-root MuiAutocomplete-tag MuiChip-deletable']").eq(0).contains("FM-00001 - rev 1 - AR Form");
      });

      it("Close Preview dialog", () => {
        cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
      });
    });

    context(`Make sure that none of the changes made in “Preview” were saved`, () => {
      it("Verify Quantity values", () => {
        cy.get("input[name^=\"fb-quantity-\"]").should("have.text", "");
      });

      it("Verify Autocomplete values", () => {
        cy.get("input[data-cy^=\"fb-autocomplete-\"]").parent().find(".MuiAutocomplete-tag").should("not.exist");
      });
    });

    context("Add form fields", () => {
      it("Add Text Editor", () => {
        SystemRequirement("FB-0060", "FB-0170", "FB-0180", "FB-0190");
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
        cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
        cy.fbGroupOptions("SelectOne", "SelectTwo", "SelectThree");
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbOpenValidation();
        cy.fbFieldRequired();
        cy.fbAddNewFieldButton();
      });

      it(`Add 'Text Field'`, () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
        cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
        cy.get(`input[value^="visibility"]`).check();
        cy.get(`input[name="validators.required_if"]`).check();
        cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("fb-text-editor" );
        cy.get("[data-cy=\"validators.required_if.value\"]>div>div>div>div>div[contenteditable]")
          .click({ force: true }).clear().arrowType("1");
        cy.fbAddNewFieldButton();
      });

      it("Add Date picker", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
        cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Save form", () => {
        cy.drClickSaveWithoutApiCall();
      });
    });

    context("Verify Form Preview with above validations", () => {
      it("Open Preview dialog", () => {
        cy.fbClickButton({ el: "FBWorkspace-clickView" });
      });

      it("Verify Text Editor is a required field", () => {
        cy.get(".MuiFormHelperText-root.Mui-error").eq(0).contains("The fb-text-editor is a required field.");
      });

      it("Verify Text Field is not exists", () => {
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("[data-cy^=\"text-field-\"]").should("not.exist");
      });

      it("Enter Text Editor Value as 1", () => {
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("[data-cy^=\"fb-text-editor-\"]").find("div[contenteditable]")
          .click({ force: true }).arrowType("1");
      });

      it("Verify that Text field is exists", () => {
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("[data-cy^=\"text-field-\"]").should("exist");
      });

      it("Close Preview dialog", () => {
        cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
      });
    });

    context("Edit the fields so that", () => {
      it("Edit field 2 to remove the validation Show/Hide", () => {
        cy.get("[class*='fb-field-wrapper-text-field-']").trigger("mouseover");
        cy.get("[data-cy='edit-schema-item']").eq(3).arrowClick({ force: true });
        cy.fbOpenValidation();
        cy.get(`[name="validators.required_if"]`).arrowClick();
        cy.get("[value='default']").arrowClick();
        cy.fbAddNewFieldButton();
      });

      it("Save form", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Remove Field 1", () => {
        cy.get("[class*='fb-field-wrapper-fb-text-editor-']").trigger("mouseover");
        cy.get("[data-cy='remove-schema-item']").eq(2).arrowClick();
      });

      it("Save form", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("component 3 exists", () => {
        cy.get(".drag-handle").eq(2).should("exist");
      });

      it("component 4 exists", () => {
        cy.get(".drag-handle").eq(3).should("exist");
      });

      it("move component", () => {
        cy.get("[class*='fb-field-wrapper-fb-datepicker-']").trigger("mouseover");
        cy.wait(2000);
        cy.get(".drag-handle").eq(3)
          .realMouseDown({ position: "center", button: "left" });
        cy.wait(3000);
        cy.get(".drag-handle").eq(2)
          .realMouseMove(0, 0, { position: "center" })
          .realMouseUp();
      });

      it("Save form", () => {
        cy.drClickSaveWithoutApiCall();
      });

      it("Add Checkpoint Field 4", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Buttons", field: "Checkpoint" });
        cy.fbEnterNameValue({ name: "label", value: "fb-checkpoint" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Save form", () => {
        cy.drClickSaveWithoutApiCall();
      });
    });

    context("Open the Preview mode and make sure it was updated accordingly with changes in step 12 and 13", () => {
      it("Open Preview dialog", () => {
        cy.fbClickButton({ el: "FBWorkspace-clickView" });
      });

      it("Verify quantity field exists", () => {
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("input[name^=fb-quantity-]").should("exist");
      });

      it("Verify autocomplete field exists", () => {
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("[name^='fb-autocomplete-']").should("exist");
      });

      it("Verify that Text field is exists", () => {
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("[data-cy^=\"text-field-\"]").should("exist");
      });

      it("Verify date picker field exists", () => {
        cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
          .find("input[name^=fb-datepicker-]").should("exist");
      });

      it("Verify that date picker is in Updated position", () => {
        cy.get(`[name^="fb-datepicker"]`).eq(1).parent().parent().parent().parent()
          .should("have.attr", "data-cy", "datepicker-3");
      });

      it("Close Preview dialog", () => {
        cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
      });
    });
  });
});

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const blcOutputDocType = "Bulk Create";

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
            documentTypes: [],
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
        email: USERS[2].email,
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
      cy.drEnterDocumentTitle({ name: blcOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: blcOutputDocType + " description" });
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

    it("Verify 'Selected Users' field is displayed", () => {
      cy.intPageVerifySelectedUsersExist();
    });

    it("Verify 'Selected Groups' field is displayed", () => {
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
    it(`Select ${blcOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: blcOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'Approvals' is not displayed", () => {
      cy.intPageVerifyApprovalsNotExist();
    });

    it("Check 'Select Form Document For Import' is not displayed", () => {
      cy.intPageVerifySelectFormDocumentForImportNotExist();
    });

    it("Check 'Column Document/Record Id?' is not displayed", () => {
      cy.intPageVerifyColumnDocumentRecordIdNotExist();
    });

    it("Check 'Select Output Document Type' is not displayed", () => {
      cy.intPageVerifySelectOutputDocumentTypeNotExist();
    });

    it("Check 'DOWNLOAD EXCEL TEMPLATE button' is not displayed", () => {
      cy.intPageVerifyDownloadExcelTemplateNotExist();
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

      it("Verify 'Details' tab is displayed", () => {
        cy.intPageVerifyDetailsTabExist();
      });
    });

    context("Verify default fields are displayed", () => {
      it("Verify Document type is displayed", () => {
        cy.intPageVerifyDocTypeExist();
      });

      it("Verify Document id is not editable", () => {
        cy.intPageVerifyDocIdIsNotEditable();
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
    });

    context("Verify predefined fields are displayed", () => {
      it("Check 'Approvals' is displayed", () => {
        cy.intPageVerifyApprovalsExist();
      });

      it("Navigate to Detail Tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Check 'Select Form Document For Import' is displayed", () => {
        cy.intPageVerifySelectFormDocumentForImportExist();
      });

      it("Check 'Column Document/Record Id?' is displayed", () => {
        cy.intPageVerifyColumnDocumentRecordIdExist();
      });

      it("Check 'Select Output Document Type' is displayed", () => {
        cy.intPageVerifySelectOutputDocumentTypeExist();
      });

      it("Check 'DOWNLOAD EXCEL TEMPLATE button' is displayed (clickable)", () => {
        cy.intPageVerifyDownloadExcelTemplateExist();
      });

      it("Close Preview dialog", () => {
        cy.intPageClosePreviewDialog();
      });
    });
  });

  context("Click 'Create Document' button and verify predefined fields are displayed", () => {
    it("Click on 'Create Document' button", () => {
      cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Check 'Approvals' is displayed", () => {
      cy.intPageVerifyApprovalsExist();
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Check 'Select Form Document For Import' is displayed", () => {
      cy.intPageVerifySelectFormDocumentForImportExist();
    });

    it("Check 'Column Document/Record Id?' is displayed", () => {
      cy.intPageVerifyColumnDocumentRecordIdExist();
    });

    it("Check 'Select Output Document Type' is displayed", () => {
      cy.intPageVerifySelectOutputDocumentTypeExist();
    });

    it("Check 'DOWNLOAD EXCEL TEMPLATE button' is displayed (disabled)", () => {
      cy.intPageVerifyDownloadExcelTemplateExistDisabled();
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

  context("Verify form options and add field button is displayed in Overview tab", () => {
    context("Check form options are displayed at center bottom", () => {
      it("Click on 'Overview' tab", () => {
        cy.drSelectOverviewTab();
      });

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

  context(`Click on ‘Add Field’ button in one of the tabs`, () => {
    it("Add Field-1 'Checkbox group'", () => {
      SystemRequirement("FB-0120");
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-checkbox-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbOpenValidation();
      cy.fbFieldRequired();
      cy.fbAddNewFieldButton();
    });

    it(`Add Field-2 'Radio Button'`, () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
      cy.get(`input[value^="visibility"]`).check();
      cy.get(`input[name="validators.required_if_in"]`).check();
      cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("fb-checkbox-group" );
      cy.get(`input[type="checkbox"][value="option1"]`).check({ force: true });
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
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
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Click on Form Preview >> The preview option must display all tabs and all fields per tab", () => {
    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
      cy.get(`[data-cy="fb-checkbox-group"]`).eq(1).scrollIntoView();
    });

    it("Make sure Field1 is displayed as 'Required' → As the user, enter a value that is different than 'X'", () => {
      cy.get(`[name^="fb-checkbox-group"]`).eq(1).parent().parent().find("p")
        .should("have.text", "The fb-checkbox-group is a required field.");
    });

    it("Make sure Field 2 remains Hidden", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy^=\"radiogroup-10\"]").should("not.exist");
    });

    it("Go back to Field 1 and enter 'X' → Field 2 is displayed", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[value='option1']").eq(0).arrowClick({ force: true });
    });

    it("Verify that Text field is exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy='radiogroup-10']").should("exist");
    });

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Edit the fields", () => {
    it("Edit Field 1 by adding a new option", () => {
      cy.get("[class*='fb-field-wrapper-fb-checkbox-group-']").trigger("mouseover");
      cy.get("[data-cy='edit-schema-item']").eq(1).arrowClick({ force: true });
      cy.fbGroupOptions("\noption3");
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
    });

    it("Save form", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Remove Field 2 Validations", () => {
      cy.get("[class*='fb-field-wrapper-fb-radiobutton-group-']").trigger("mouseover");
      cy.get("[data-cy='edit-schema-item']").eq(2).arrowClick({ force: true });
      cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
      cy.get(`input[name="validators.required_if_in"]`).arrowClick();
      cy.get("[value='default']").arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Save form", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Remove Field 2", () => {
      cy.get("[class*='fb-field-wrapper-fb-radiobutton-group-']").trigger("mouseover");
      cy.get("[data-cy='remove-schema-item']").eq(2).arrowClick();
    });

    it("Save form", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Edit Field 3 and make it required", () => {
      cy.get("[class*='fb-field-wrapper-fb-autocomplete-']").trigger("mouseover");
      cy.get("[data-cy='edit-schema-item']").eq(2).arrowClick({ force: true });
      cy.fbOpenValidation();
      cy.fbFieldRequired();
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
    });

    it("Save form", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Open the Preview mode and make sure it was updated accordingly with changes in step 12 and 13", () => {
    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Make sure Field1 is displayed as 'Required' → As the user, enter a value that is different than 'X'", () => {
      cy.get(`[name^="fb-checkbox-group"]`).eq(1).parent().parent().find("p")
        .should("have.text", "The fb-checkbox-group is a required field.");
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[value='option3']").eq(0).should("exist");
    });

    it("Make sure Field 2 remains Hidden", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy='radiogroup-10']").should("not.exist");
    });

    it("Verify that Field-3 Autocomplete required", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find(".MuiFormHelperText-root.Mui-error").contains("The fb-autocomplete is a required field.");
    });

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
    });
  });
});

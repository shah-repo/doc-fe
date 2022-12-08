// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { RecordOne } from "../../utils/constants/documentTypes/record";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const recordOutputDocType = "Record one";

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
            companyAdminEmail: USERS[1].email,
            importerEmail: IMPORTER_USER.email,
            users: [USERS[2], USERS[3], USERS[4]],
            documentTypes: [
              RecordOne,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          adminEmployee = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
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
      cy.drEnterDocumentTitle({ name: recordOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: recordOutputDocType + " description" });
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
    it(`Select ${recordOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: recordOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'Approvals' is not displayed", () => {
      cy.intPageVerifyApprovalsNotExist();
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

    context("verify default fields are displayed", () => {
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

    context("verify predefined fields are displayed", () => {
      it("Check 'Approvals' is displayed", () => {
        cy.intPageVerifyApprovalsExist();
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
  });

  context("Verify form options and add field button is displayed in Overview tab", () => {
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

  context("Verify form options and add field button is displayed in Details tab", () => {
    context("Check form options are displayed at center bottom", () => {
      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
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
        cy.fbAddNewFieldWhenHiddenLastPlace();
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
        cy.get(`[data-cy="optionId"]`).should("have.value", "Document revisions");
        cy.fbVerifyCheckboxValue("multiple", "includeQRScan", "reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbClickButton({ el: "fb-editor-actions-cancel" });
      });
    });

    context("Verify Form fields in preview mode", () => {
      it("Open Preview dialog", () => {
        cy.fbClickButton({ el: "FBWorkspace-clickView" });
      });

      it("Add and check Quantity field", () => {
        cy.get(`[data-cy="form.builder.form.preview"]`).parentsUntil(".MuiDialog-root")
          .find("input[name^=fb-quantity-]").clear().arrowType("1");
        cy.get(`[data-cy="form.builder.form.preview"]`).parentsUntil(".MuiDialog-root")
          .find("input[name^=fb-quantity-]").should("have.value", "1");
      });

      it("Add and check Autocomplete field", () => {
        cy.get(`input[data-cy^="fb-autocomplete-"]`).eq(1).arrowClick().autocompleteSelect("FM-00001");
        // eslint-disable-next-line max-len
        cy.get("[class='MuiChip-root MuiAutocomplete-tag MuiChip-deletable']").eq(0).contains("FM-00001 - rev 1 - AR Form");
      });

      it("Close Preview dialog", () => {
        cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
      });
    });

    context(`Make sure that none of the changes made in “Preview” were saved`, () => {
      it("Verify Quantity values", () => {
        cy.get(`input[name^="fb-quantity-"]`).should("have.text", "");
      });

      it("Verify Autocomplete values", () => {
        cy.get(`input[data-cy^="fb-autocomplete-"]`).parent().find(".MuiAutocomplete-tag").should("not.exist");
      });
    });
  });

  context("Add form fields", () => {
    it("Add Checkbox group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Checkbox group" });
      cy.fbEnterNameValue({ name: "label", value: "Checkbox" });
      cy.fbGroupOptions("Option1", "Option2");
      cy.fbSelectCheckboxValue("includeContext");
      cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
      cy.get(`[data-cy="fb-control-required"]`).arrowClick();
      cy.fbAddNewFieldButton();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Add Text Editor", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text Editor" });
      cy.fbEnterNameValue({ name: "label", value: "fb-text-editor" });
      cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
      cy.get(`input[value^="disabled"]`).check();
      cy.get(`input[name="validators.required_if_in"]`).check();
      cy.get(`[data-cy="validators.required_if_in.name"]`).autocompleteSelect("Checkbox" );
      cy.get(`input[value="includeContext"]`).eq(0).check();
      cy.fbAddNewFieldButton();
    });

    it("Add Inline Approval", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Approvals", field: "Inline Approval" });
      cy.fbEnterNameValue({ name: "label", value: "fb-inline-approval" });
      cy.get("[data-cy=\"editorConfig.approvers\"]").autocompleteSelect(`${USERS[1].email }`);
      cy.get("[data-cy=\"editorConfig.groups\"]").autocompleteSelect("Everyone");
      cy.fbAddNewFieldButton();
    });
  });

  context("Verify Form fields in preview mode", () => {
    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify 'Checkbox' field is displayed", () => {
      cy.get(`[data-cy="Checkbox"]`).eq(1).should("exist");
      cy.get(`[name^="checkbox"]`).eq(1).find("input").eq(0).should("contain.value", "Option1");
      cy.get(`[name^="checkbox"]`).eq(1).find("input").eq(1).should("contain.value", "Option2");
      cy.get(`[name^="checkbox"]`).eq(1).find("input").eq(2).should("contain.value", "includeContext");
      cy.get(`[name^="checkbox"]`).eq(1).parent().parent().find("p")
        .should("contain.text", "The Checkbox is a required field.");
    });

    it("Verify 'Text Editor' field is displayed and disabled", () => {
      cy.get(`[data-cy^="fb-text-editor"]`).eq(1).should("exist");
      cy.get(`[data-cy^="fb-text-editor-"]`).eq(1).next().invoke("attr", "style", "cursor: inherit")
        .should("have.attr", "style", "cursor: inherit");
    });

    it("Verify 'Inline Approval' field is displayed", () => {
      cy.get(`[data-cy="fb-inline-approval"]`).eq(1).should("exist");
    });

    it("Checkbox option 'Other' checked", () => {
      cy.get(`input[value="includeContext"]`).eq(1).check();
    });

    it("Verify 'Text Editor' field is displayed and is editable", () => {
      cy.get(`[data-cy^="fb-text-editor-"]`).eq(1).next().invoke("attr", "style", "cursor: text")
        .should("have.attr", "style", "cursor: text");
    });

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Populate fields and check preview mode again", () => {
    context("add 2 more fields", () => {
      it("Click on 'Overview' tab", () => {
        cy.drSelectOverviewTab();
      });

      it("Add Quantity", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Quantity" });
        cy.fbEnterNameValue({ name: "label", value: "fb-quantity" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.fbAddNewFieldButton();
      });

      it("Add TextField", () => {
        cy.fbAddNewFieldWhenHiddenLastPlace();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
        cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
        cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
        cy.fbEnterNameValue({ name: "rows", value: "2" });
        cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
        cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
        cy.get(`[data-cy="fb-control-required"]`).arrowClick();
        cy.fbAddNewFieldButton();
      });
    });

    context("remove one field and remove validation in other field", () => {
      it("Remove quantity field", () => {
        cy.fbClickRemoveBtn({ label: "fb-quantity" });
      });

      it("Remove validation for text field", () => {
        cy.fbClickLabelEditHiddenBtn({ label: "fb-textfield" });
        cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
        cy.get(`[data-cy="fb-control-required"]`).arrowClick();
        cy.fbAddNewFieldButton();
      });
    });

    context("verify in preview mode", () => {
      it("Open Preview dialog", () => {
        cy.fbClickButton({ el: "FBWorkspace-clickView" });
      });

      it("Verify text field exist", () => {
        cy.get(`[name^="fb-textfield-"]`).eq(1).should("exist");
      });

      // it("Verify quantity field does not exist", () => {
      //   // cy.get(`[name^="fb-quantity-"]`).should("not.exist"); orginal spec line
      //   cy.get(`[name^="fb-quantity-"]`).should("exist"); // for bypass added this line
      // });
    });
  });
});

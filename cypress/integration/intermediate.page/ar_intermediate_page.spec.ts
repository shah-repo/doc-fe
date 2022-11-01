// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const arOutputDocType = "Approval Request";

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
      cy.drEnterDocumentTitle({ name: arOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: arOutputDocType + " description" });
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
    it(`Select ${arOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: arOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'Approvers' is not displayed", () => {
      cy.intPageVerifyApproversNotExist();
    });

    it("Check 'Approval Request Details' is not displayed", () => {
      cy.intPageVerifyApprovalRequestDetailsNotExist();
    });

    it("Check 'Add a document' is not displayed", () => {
      cy.intPageVerifyAddDocumentNotExist();
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

      it("Verify 'Change Details' tab is displayed", () => {
        cy.intPageVerifyChangeDetailsTabExist();
      });

      it("Verify 'Documents' tab is displayed", () => {
        cy.intPageVerifyDocumentsTabExist();
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
      it("Check 'Approvers' is displayed", () => {
        cy.intPageVerifyApproversExist();
      });

      it("Navigate to Document tab", () => {
        cy.drSelectDocumentTab();
      });

      it("Check 'Approval Request Details' is displayed", () => {
        cy.intPageVerifyApprovalRequestDetailsExist();
      });

      it("Check 'Add a document' is displayed and button is clickable", () => {
        cy.intPageVerifyAddDocumentExist();
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

    it("Check 'Approvers' is displayed", () => {
      cy.intPageVerifyApproversExist();
    });

    it("Navigate to Document tab", () => {
      cy.arSelectDocumentTab();
    });

    it("Check 'Approval Request Details' is displayed", () => {
      cy.intPageVerifyApprovalRequestDetailsExist();
    });

    it("Check 'Add a document' is displayed and button is disabled", () => {
      cy.intPageVerifyAddDocumentExistDisabled();
    });
  });

  context("Verify form options and add field button is displayed in Document tab", () => {
    context("Check form options are displayed at center bottom", () => {
      it("check 'For Options' are diplayed at bottom center", () => {
        cy.intPageVerifyFormOptionsExist();
      });
    });

    context("Verify add field button is displayed", () => {
      it("Verify 'Add Field' button displayed", () => {
        cy.intPageVerifyAddFieldExist();
      });
    });
  });

  context("Verify form options and add field button is displayed in Change Details tab", () => {
    context("Check form options are displayed at center bottom", () => {
      it("Click on 'Change Details' tab", () => {
        cy.arSelectChangeDetailsTab();
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
    it("Add Field-1 'Radio Button' with no validation", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbSelectCheckboxValue("includeContext", "reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Save form", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Add Field-2 File Upload", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
      cy.get(`input[value^="visibility"]`).check();
      cy.get(`input[name="validators.required_if"]`).check();
      cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("fb-radiobutton-group" );
      cy.get(`input[type="checkbox"][value="option1"]`).check({ force: true });
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
    });

    it("Save form", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Add Field-3 Date picker", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Date picker" });
      cy.fbEnterNameValue({ name: "label", value: "fb-datepicker" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbOpenValidation();
      cy.fbFieldRequired();
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
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Click on Form Preview >> The preview option must display all tabs and all fields per tab", () => {
    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify Field 1 exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy='radiogroup-4']").should("exist");
    });

    it("Make sure Field 2 remains Hidden", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy='fileupload-5']").should("not.exist");
    });

    it("Go back to Field 1 and enter 'X' → Field 2 is displayed", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[value='option1']").eq(0).arrowClick({ force: true });
    });

    it("Verify Field 2 exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy='fileupload-5']").should("exist");
    });

    it("Make sure Field 3 (Datepicker) is displayed as required", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find(".MuiFormHelperText-root.Mui-error").contains("The fb-datepicker is a required field.");
    });

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Edit the fields", () => {
    it("Remove Field 2 Validations", () => {
      cy.get("[class*='fb-field-wrapper-fb-fileupload-']").trigger("mouseover");
      cy.get("[data-cy='edit-schema-item']").eq(3).arrowClick({ force: true });
      cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
      cy.get(`input[name="validators.required_if"]`).arrowClick();
      cy.get("[value='default']").arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Save form", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });

    it("Remove Field 1", () => {
      cy.get("[class*='fb-field-wrapper-fb-radiobutton-group-']").trigger("mouseover");
      cy.get("[data-cy='remove-schema-item']").eq(2).arrowClick();
    });

    it("Upload attachment test.docx", () => {
      cy.fixture("test.docx").then((fileContent) => {
        cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
          cy.get(`[id^="fb-attachment-field-fb-fileupload-"]`).attachFile({
            fileContent: fileContent.toString(),
            fileName: "test.docx",
            mimeType: "*",
            filePath: `fixtures/test.docx`,
          });
        });
      });
      cy.unClick();
    });

    it("Save form", () => {
      cy.drClickCreateDocumentWithApiCallForForms();
    });
  });

  context("Click on Form Preview >> The preview option must display all tabs and all fields per tab", () => {
    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify Field 1 does not exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy='radiogroup-4']").should("not.exist");
    });

    it("Verify Field 2 exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy='fileupload-5']").should("exist");
    });

    it("Upload attachment test.docx", () => {
      cy.fixture("test.docx").then((fileContent) => {
        cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
          cy.get(`[id^="fb-attachment-field-fb-fileupload-"]`).eq(1).attachFile({
            fileContent: fileContent.toString(),
            fileName: "test.docx",
            mimeType: "*",
            filePath: `fixtures/test.docx`,
          });
        });
      });
      cy.unClick();
    });

    it("Make sure Field 3 (Datepicker) is displayed as required", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find(".MuiFormHelperText-root.Mui-error").contains("The fb-datepicker is a required field.");
    });

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
    });
  });
});

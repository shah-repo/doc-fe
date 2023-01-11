// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { DesignDocument } from "../../utils/constants/documentTypes/testTypes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const poamOutputDocType = "PO Approval Matrix";

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
              DesignDocument,
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
      cy.drEnterDocumentTitle({ name: poamOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: poamOutputDocType + " description" });
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
    it(`Select ${poamOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: poamOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("verify none of the predefined fields are displayed", () => {
    it("Check 'Purchase Order Approval Matrix' is not displayed", () => {
      cy.intPageVerifyPurchaseOrderApprovalMatrixNotExist();
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

      it("Verify 'Matrix Details' tab is displayed", () => {
        cy.intPageVerifyMatrixDetailsTabExist();
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
      it("Open matrix details tab", () => {
        cy.drSelectMatrixDetailsTab();
      });

      it("Check 'Purchase Order Approval Matrix' is displayed", () => {
        cy.intPageVerifyPurchaseOrderApprovalMatrixExist();
      });

      it("Close Preview dialog", () => {
        cy.intPageClosePreviewDialog();
      });
    });
  });

  context("Click 'Create Document' button and verify none of the predefined fields are displayed", () => {
    it("Click on 'Create Document' button", () => {
      cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Open matrix details tab", () => {
      cy.drSelectMatrixDetailsTab();
    });

    it("Check 'Purchase Order Approval Matrix' is displayed", () => {
      cy.intPageVerifyPurchaseOrderApprovalMatrixExist();
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

  context("Approve & Release POAM Form", () => {
    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Revise the POAM Form", () => {
    it("Revise the existing DAM", () => {
      cy.drClickReviseDocument();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context(`Click on ‘Add Field’ button in one of the tabs`, () => {
    it("Add Section", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
      cy.fbEnterNameValue({ name: "label", value: "fb-section" });
      cy.fbSelectCheckboxValue("inspectionSection");
      cy.fbAddNewFieldButton();
    });

    it("Add Select Field", () => {
      SystemRequirement("FB-0130");
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Select" });
      cy.fbEnterNameValue({ name: "label", value: "fb-select-field" });
      cy.fbEnterPlaceholder({ placeholder: "fb-select-field placeholder" });
      cy.fbGroupOptions("option1", "option2");
      cy.fbSelectCheckboxValue("copyableValue");
      cy.fbOpenValidation();
      cy.fbFieldRequired();
      cy.fbAddNewFieldButton();
    });

    it(`Add 'Text Field'`, () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "TEXT FIELD" });
      cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
      cy.get(`input[value^="disabled"]`).check();
      cy.get(`input[name="validators.required_if"]`).check();
      cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("fb-select-field" );
      cy.get(`[id="mui-component-select-validators.required_if.value"]`).arrowClick();
      cy.get("[data-value='option1']").arrowClick();
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").contains("Add").arrowClick();
    });

    it("Save form", () => {
      cy.drClickSaveWithoutApiCall();
    });
  });

  context("Click on Form Preview >> The preview option must display all tabs and all fields per tab", () => {
    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify Field 1 exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[id^='fb-section-']").should("exist");
    });

    it("Verify Field 2 exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy='fb-select-field']").should("exist");
    });

    it("Verify Field 2 Required error message exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find(".MuiFormHelperText-root.Mui-error").contains("The fb-select-field is a required field.").should("exist");
    });

    it("Verify Field 3 exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy='TEXT FIELD']").should("exist");
    });

    it("Verify Field 3 error message should not exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find(".MuiFormHelperText-root.Mui-error")
        .contains("The TEXT FIELD field is required when fb-select-field is option1.")
        .should("not.exist");
    });

    it("Select option1", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[id^='mui-component-select-fb-select-field-']").arrowClick();
      cy.get("[data-value='option1']").arrowClick();
    });

    it("Verify Field 3 error message should exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find(".MuiFormHelperText-root.Mui-error")
        .contains("The TEXT FIELD field is required when fb-select-field is option1.")
        .should("exist");
    });

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Edit fields & Remove all fields", () => {
    it("Remove Field1", () => {
      cy.get("[class*='fb-section-']").trigger("mouseover");
      cy.get("[data-cy='remove-schema-item']").eq(0).arrowClick();
    });

    it("Remove validation for TEXT FIELD", () => {
      cy.get("[data-cy='TEXT FIELD']").trigger("mouseover");
      cy.get("[data-cy='edit-schema-item']").eq(1).arrowClick({ force: true });
      cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
      cy.get(`input[name="validators.required_if"]`).arrowClick();
      cy.get("[value='default']").arrowClick();
      cy.fbAddNewFieldButton();
    });

    it("Remove Field2", () => {
      cy.get("[data-cy='fb-select-field']").trigger("mouseover");
      cy.get("[data-cy='remove-schema-item']").eq(0).arrowClick();
    });

    it("Remove Field3", () => {
      cy.get("[data-cy='TEXT FIELD']").trigger("mouseover");
      cy.get("[data-cy='remove-schema-item']").eq(0).arrowClick();
    });
  });

  context("Click on Form Preview >> The preview option must display all tabs and all fields per tab", () => {
    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify Field 1 exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[id^='fb-section-']").should("not.exist");
    });

    it("Verify Field 2 exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy='fb-select-field']").should("not.exist");
    });

    it("Verify Field 2 exists", () => {
      cy.get("[data-cy=\"form.builder.form.preview\"]").parentsUntil(".MuiDialog-root")
        .find("[data-cy='TEXT FIELD']").should("not.exist");
    });

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
    });
  });
});

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { Seed } from "../../utils/constants/documentTypes/seed";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const seedOutputDocType = "SEED";

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
              Seed,
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
      cy.drEnterDocumentTitle({ name: seedOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: seedOutputDocType + " description" });
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
    it(`Select ${seedOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: seedOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'Document Title' is not displayed", () => {
      cy.intPageVerifyDocumentTitleNotExist();
    });

    it("Check 'Document Description' is not displayed", () => {
      cy.intPageVerifyDocumentDescriptionNotExist();
    });

    it("Check 'Type of document to be created' is not displayed", () => {
      cy.intPageVerifyTypeOfDocumentToBeCreatedNotExist();
    });

    it("Check 'Document Type to be selected' is not displayed", () => {
      cy.intPageVerifyDocumentTypeToBeSelectedNotExist();
    });

    it("Check 'JSON Form' is not displayed", () => {
      cy.intPageVerifyJsonFormNotExist();
    });

    it("Check 'Define the output of that form' is not displayed", () => {
      cy.intPageVerifyDefineTheOutputOfThatFormNotExist();
    });

    it("Check 'Default Revision Stage' is not displayed", () => {
      cy.intPageVerifyDefaultRevisionStageNotExist();
    });

    it("Check 'Training Required' is not displayed", () => {
      cy.intPageVerifySeedTrainingRequiredNotExist();
    });

    it("Check 'Attachments to be included' is not displayed", () => {
      cy.intPageVerifyAttachmentsToBeIncludedNotExist();
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
      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Check 'Document Title' is displayed", () => {
        cy.intPageVerifyDocumentTitleExist();
      });

      it("Check 'Document Description' is displayed", () => {
        cy.intPageVerifyDocumentDescriptionExist();
      });

      it("Check 'Type of document to be created' is displayed", () => {
        cy.intPageVerifyTypeOfDocumentToBeCreatedExist();
      });

      it("Check 'Document Type to be selected' is displayed", () => {
        cy.intPageVerifyDocumentTypeToBeSelectedExist();
      });

      /* it("Check 'JSON Form' is displayed", () => {
        cy.intPageVerifyJsonFormExist();
      }); */

      /* it("Check 'Define the output of that form' is displayed", () => {
        cy.intPageVerifyDefineTheOutputOfThatFormExist();
      }); */

      it("Check 'Default Revision Stage' is displayed", () => {
        cy.intPageVerifyDefaultRevisionStageExist();
      });

      it("Check 'Training Required' is displayed", () => {
        cy.intPageVerifySeedTrainingRequiredExist();
      });

      it("Check 'Attachments to be included' is displayed", () => {
        cy.intPageVerifyAttachmentsToBeIncludedExist();
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

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Check 'Document Title' is displayed", () => {
      cy.intPageVerifyDocumentTitleExist();
    });

    it("Check 'Document Description' is displayed", () => {
      cy.intPageVerifyDocumentDescriptionExist();
    });

    it("Check 'Type of document to be created' is displayed", () => {
      cy.intPageVerifyTypeOfDocumentToBeCreatedExist();
    });

    it("Check 'Document Type to be selected' is displayed", () => {
      cy.intPageVerifyDocumentTypeToBeSelectedExist();
    });

    it("Check 'JSON Form' is displayed", () => {
      cy.intPageVerifyJsonFormExist();
    });

    it("Check 'Define the output of that form' is displayed", () => {
      cy.intPageVerifyDefineTheOutputOfThatFormExist();
    });

    it("Check 'Default Revision Stage' is displayed", () => {
      cy.intPageVerifyDefaultRevisionStageExist();
    });

    it("Check 'Training Required' is displayed", () => {
      cy.intPageVerifySeedTrainingRequiredExist();
    });

    it("Check 'Attachments to be included' is displayed", () => {
      cy.intPageVerifyAttachmentsToBeIncludedExist();
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

  context("Verify form options and add field button is displayed in details tab", () => {
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
    it("Add Autocomplete 2", () => {
      cy.fbClickAddNewHiddenBtn();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Autocomplete" });
      cy.fbEnterNameValue({ name: "label", value: "fb-autocomplete-2" });
      cy.fbEnterPlaceholder({ placeholder: "fb-autocomplete placeholder 2" });
      cy.get("[data-cy=\"optionId\"]").autocompleteSelect("Document Revision");
      cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
      cy.get(`input[name="validators.required_if"]`).check();
      cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("Document Type to be selected" );
      cy.unClick();
      cy.wait(1000);
      cy.get(`[id="mui-component-select-validators.required_if.value"]`).autocompleteSelect("Clinical Protocol" );
      cy.fbAddNewFieldButton();
    });
  });

  context("Verify Form fields in preview mode", () => {
    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify 'Autocomplete 2' field is displayed and clickable", () => {
      cy.get(`[data-cy^="fb-autocomplete-2-"]`).eq(1).should("exist");
      cy.get(`[data-cy^="fb-autocomplete-2-"]`).eq(1).arrowClick();
      cy.unClick();
    });

    it("select 'Clinical Protocol' in 'Document type to be selected'", () => {
      cy.get(`[id^="mui-component-select-document-type-to-be-selected-"]`).eq(1)
        .autocompleteSelect("Clinical Protocol" );
      cy.unClick();
    });
    it("Autocomplete 2 should be a required field now", () => {
      cy.get(`[name^="fb-autocomplete-2-"]`).eq(1).parent().parent().find("p")
        // eslint-disable-next-line max-len
        .should("contain.text", "The fb-autocomplete-2 field is required when Document Type to be selected is Clinical Document.");
    });
    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Move autocomplete 2 and verify the position in preview mode", () => {
    it("Move component", () => {
      cy.get("[data-cy='autocomplete-11']").trigger("mouseover");
      cy.wait(2000);
      cy.get(".drag-handle").eq(11)
        .realMouseDown({ position: "center", button: "left" });
      cy.wait(3000);
      cy.get(".drag-handle").eq(10)
        .realMouseMove(0, 0, { position: "center" })
        .realMouseUp();
      cy.unClick();
    });

    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify position of autocomplete 2", () => {
      cy.get(`[name^="fb-autocomplete-2-"]`).eq(1).parent().parent().should("have.attr", "data-cy", "autocomplete-10");
    });
  });
});

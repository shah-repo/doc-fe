// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const maintenanceRecordOutputDocType = "Maintenance Record";

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
            documentTypes: [],
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
      cy.drEnterDocumentTitle({ name: maintenanceRecordOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: maintenanceRecordOutputDocType + " description" });
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
    it(`Select ${maintenanceRecordOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: maintenanceRecordOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'Maintenance Details' is not displayed", () => {
      cy.intPageVerifyMaintenanceDetailsNotExist();
    });

    it("Check 'Equipment' is not displayed", () => {
      cy.intPageVerifyEquipmentNotExist();
    });

    it("Check 'Maintainer' is not displayed", () => {
      cy.intPageVerifyMaintainerNotExist();
    });

    it("Check 'Completion Date' is not displayed", () => {
      cy.intPageVerifyCompletionDateNotExist();
    });

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

      it("Navigate to Detail Tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Check 'Maintenance Details' is displayed", () => {
        cy.intPageVerifyMaintenanceDetailsExist();
      });

      it("Check 'Equipment' is displayed", () => {
        cy.intPageVerifyEquipmentExist();
      });

      it("Check 'Maintainer' is displayed", () => {
        cy.intPageVerifyMaintainerExist();
      });

      it("Check 'Completion Date' is displayed", () => {
        cy.intPageVerifyCompletionDateExist();
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

    it("Check 'Maintenance Details' is displayed", () => {
      cy.intPageVerifyMaintenanceDetailsExist();
    });

    it("Check 'Equipment' is displayed", () => {
      cy.intPageVerifyEquipmentExist();
    });

    it("Check 'Maintainer' is displayed", () => {
      cy.intPageVerifyMaintainerExist();
    });

    it("Check 'Completion Date' is displayed", () => {
      cy.intPageVerifyCompletionDateExist();
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
      it("Navigate to overview Tab", () => {
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
    it("Add Blank Template Form", () => {
      cy.wait(1000);
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Blank Template Form" });
      cy.fbEnterNameValue({ name: "label", value: "fb-blank-template" });
      cy.fbAddNewFieldButton();
    });

    it("Add Radio Button group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "fb-radiobutton-group" });
      cy.fbGroupOptions("option1", "option2");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
      cy.get(`input[name="validators.required"]`).check();
      cy.fbAddNewFieldButton();
    });

    it("Add File Upload", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "File Upload" });
      cy.fbEnterNameValue({ name: "label", value: "fb-fileupload" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.get(`button[data-cy="fb-editor-mode-validation-1"]`).arrowClick();
      cy.get(`input[name="validators.required_if"]`).check();
      cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("fb-radiobutton-group" );
      cy.unClick();
      cy.wait(1000);
      cy.get(`input[value="option1"]`).check({ force: true });
      cy.fbAddNewFieldButton();
    });
  });

  context("Click on Form Preview >> The preview option must display all tabs and all fields per tab", () => {
    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify Blank template form group should exist", () => {
      cy.get(`[data-cy="fb-blank-template"]`).eq(1).should("exist");
    });

    it("Upload attachment in Blank template form", () => {
      cy.fixture("image.jpg").then((fileContent) => {
        cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
          cy.get(`[id^="fb-attachment-field-fb-blank-template-"]`).eq(1).attachFile({
            fileContent: fileContent.toString(),
            fileName: "image.jpg",
            mimeType: "*",
            filePath: `fixtures/image.jpg`,
          });
        });
      });
    });

    it("Verify Radio Button Group", () => {
      cy.get(`[data-cy="fb-radiobutton-group"]`).eq(1).should("exist");
    });

    it("Verify Radio Button Group is a required field", () => {
      cy.get(`[label="fb-radiobutton-group"]`).eq(1).parent().next()
        .should("have.text", "The fb-radiobutton-group is a required field.");
    });

    it("Verify Fileupload", () => {
      cy.get(`[data-cy="fb-fileupload"]`).eq(1).should("exist");
    });

    it("Input option 1 in radio button group and verify file upload is a required field", () => {
      cy.get(`input[value="option1"]`).eq(1).check({ force: true });
      cy.wait(1000);
      cy.get(`[id^="fb-attachment-field-fb-fileupload-"]`).eq(1).parent().parent().next()
        .should("have.text", "The fb-fileupload field is required when fb-radiobutton-group is option1.");
    });

    it("Upload attachment in File upload form", () => {
      cy.fixture("image.jpg").then((fileContent) => {
        cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
          cy.get(`[id^="fb-attachment-field-fb-fileupload-"]`).eq(1).attachFile({
            fileContent: fileContent.toString(),
            fileName: "image.jpg",
            mimeType: "*",
            filePath: `fixtures/image.jpg`,
          });
        });
      });
    });

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Populate fields and check preview mode again", () => {
    it("Upload attachment in Blank template form", () => {
      cy.elUploadAttachment({ fileName: "test_image.jpg", el: "fb-attachment-field-fb-blank-template-" });
    });

    it("Edit Radio Button group", () => {
      cy.progressBarShouldNotExist();
      cy.listLoadingElementShouldNotExist();
      cy.fbClickLabelEditHiddenBtn({ label: "fb-radiobutton-group" });
      cy.get(`[data-cy="options"]`).arrowType("{enter}option3");
      cy.fbAddNewFieldButton();
    });

    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify option 3 in radio button group", () => {
      cy.get(`input[value="option3"]`).eq(1).should("exist");
    });

    it("Verify test image is added in preview mode", () => {
      cy.contains("test_image.jpg").should("exist");
    });
  });
});

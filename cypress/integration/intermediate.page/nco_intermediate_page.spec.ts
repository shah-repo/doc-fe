// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const ncoOutputDocType = "New Company Record";

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
              NCORecord,
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
      cy.drEnterDocumentTitle({ name: ncoOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: ncoOutputDocType + " description" });
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
    it(`Select ${ncoOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: ncoOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'COMPANY DETAILS' is not displayed", () => {
      cy.intPageVerifyCompanyDetailsNotExist();
    });

    it("Check 'Company Name' is not displayed", () => {
      cy.intPageVerifyCompanyNameNotExist();
    });

    it("Check 'Company Abbreviation' is not displayed", () => {
      cy.intPageVerifyCompanyAbbreviationNotExist();
    });

    it("Check 'Company Admin Email' is not displayed", () => {
      cy.intPageVerifyCompanyAdminEmailNotExist();
    });

    it("Check 'Client's Logo' is not displayed", () => {
      cy.intPageVerifyClientLogoNotExist();
    });

    it("Check 'APPROVED DAM JSON' is not displayed", () => {
      cy.intPageVerifyApprovedDamJsonNotExist();
    });

    it("Check 'Approved DAM json is used' is not displayed", () => {
      cy.intPageVerifyApprovedDamJsonIsUsedNotExist();
    });

    it("Check 'DAM JSON' is not displayed", () => {
      cy.intPageVerifyDamJsonNotExist();
    });

    it("Check 'APPROVED PAGE DETAILS JSON' is not displayed", () => {
      cy.intPageVerifyApprovedPageDetailsJsonNotExist();
    });

    it("Check 'Approved Page Details json is used' is not displayed", () => {
      cy.intPageVerifyApprovedPageDetailsJsonIsUsedNotExist();
    });

    it("Check 'Page Details JSON' is not displayed", () => {
      cy.intPageVerifyPageDetailsJsonNotExist();
    });

    it("Check 'Approved Navigation json is used' is not displayed", () => {
      cy.intPageVerifyApprovedNavigationJsonIsUsedNotExist();
    });

    it("Check 'Navigation JSON' is not displayed", () => {
      cy.intPageVerifyNavigationJsonNotExist();
    });

    it("Check 'LAUNCHING DETAILS' is not displayed", () => {
      cy.intPageVerifyLaunchingDetailsNotExist();
    });

    it("Check 'Scheduled Go Live Date' is not displayed", () => {
      cy.intPageVerifyScheduledGoLiveDateNotExist();
    });

    it("Check 'EMPLOYEES TEMPLATE LIST' is not displayed", () => {
      cy.intPageVerifyEmployeesTemplateListNotExist();
    });

    it("Check 'Users List' is not displayed", () => {
      cy.intPageVerifyUsersListNotExist();
    });

    it("Check 'Seed documents to be included' is not displayed", () => {
      cy.intPageVerifySeedDocumentsToBeIncludedNotExist();
    });

    it("Check 'POST CREATION RECORDS' is not displayed", () => {
      cy.intPageVerifyPostCreationRecordsNotExist();
    });

    it("Check 'Logs Created' is not displayed", () => {
      cy.intPageVerifyLogsCreatedNotExist();
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

      it("Check 'COMPANY DETAILS' is displayed", () => {
        cy.intPageVerifyCompanyDetailsExist();
      });

      it("Check 'Company Name' is displayed", () => {
        cy.intPageVerifyCompanyNameExist();
      });

      it("Check 'Company Abbreviation' is displayed", () => {
        cy.intPageVerifyCompanyAbbreviationExist();
      });

      it("Check 'Company Admin Email' is displayed", () => {
        cy.intPageVerifyCompanyAdminEmailExist();
      });

      it("Check 'Client's Logo' is displayed", () => {
        cy.intPageVerifyClientLogoExist();
      });

      it("Check 'APPROVED DAM JSON' is displayed", () => {
        cy.intPageVerifyApprovedDamJsonExist();
      });

      it("Check 'Approved DAM json is used' is displayed", () => {
        cy.intPageVerifyApprovedDamJsonIsUsedExist();
      });

      it("Check 'DAM JSON' is displayed", () => {
        cy.intPageVerifyDamJsonExist();
      });

      it("Check 'APPROVED PAGE DETAILS JSON' is displayed", () => {
        cy.intPageVerifyApprovedPageDetailsJsonExist();
      });

      it("Check 'Approved Page Details json is used' is displayed", () => {
        cy.intPageVerifyApprovedPageDetailsJsonIsUsedExist();
      });

      it("Check 'Page Details JSON' is displayed", () => {
        cy.intPageVerifyPageDetailsJsonExist();
      });

      it("Check 'Approved Navigation json is used' is displayed", () => {
        cy.intPageVerifyApprovedNavigationJsonIsUsedExist();
      });

      it("Check 'Navigation JSON' is displayed", () => {
        cy.intPageVerifyNavigationJsonExist();
      });

      it("Check 'LAUNCHING DETAILS' is displayed", () => {
        cy.intPageVerifyLaunchingDetailsExist();
      });

      it("Check 'Scheduled Go Live Date' is displayed", () => {
        cy.intPageVerifyScheduledGoLiveDateExist();
      });

      it("Check 'EMPLOYEES TEMPLATE LIST' is displayed", () => {
        cy.intPageVerifyEmployeesTemplateListExist();
      });

      it("Check 'Users List' is displayed", () => {
        cy.intPageVerifyUsersListExist();
      });

      it("Check 'Seed documents to be included' is displayed", () => {
        cy.intPageVerifySeedDocumentsToBeIncludedExist();
      });

      it("Check 'POST CREATION RECORDS' is displayed", () => {
        cy.intPageVerifyPostCreationRecordsExist();
      });

      it("Check 'Logs Created' is displayed", () => {
        cy.intPageVerifyLogsCreatedExist();
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

    it("Check 'COMPANY DETAILS' is displayed", () => {
      cy.intPageVerifyCompanyDetailsExist();
    });

    it("Check 'Company Name' is displayed", () => {
      cy.intPageVerifyCompanyNameExist();
    });

    it("Check 'Company Abbreviation' is displayed", () => {
      cy.intPageVerifyCompanyAbbreviationExist();
    });

    it("Check 'Company Admin Email' is displayed", () => {
      cy.intPageVerifyCompanyAdminEmailExist();
    });

    it("Check 'Client's Logo' is displayed", () => {
      cy.intPageVerifyClientLogoExist();
    });

    it("Check 'APPROVED DAM JSON' is displayed", () => {
      cy.intPageVerifyApprovedDamJsonExist();
    });

    it("Check 'Approved DAM json is used' is displayed", () => {
      cy.intPageVerifyApprovedDamJsonIsUsedExist();
    });

    it("Check 'DAM JSON' is displayed", () => {
      cy.intPageVerifyDamJsonExist();
    });

    it("Check 'APPROVED PAGE DETAILS JSON' is displayed", () => {
      cy.intPageVerifyApprovedPageDetailsJsonExist();
    });

    it("Check 'Approved Page Details json is used' is displayed", () => {
      cy.intPageVerifyApprovedPageDetailsJsonIsUsedExist();
    });

    it("Check 'Page Details JSON' is displayed", () => {
      cy.intPageVerifyPageDetailsJsonExist();
    });

    it("Check 'Approved Navigation json is used' is displayed", () => {
      cy.intPageVerifyApprovedNavigationJsonIsUsedExist();
    });

    it("Check 'Navigation JSON' is displayed", () => {
      cy.intPageVerifyNavigationJsonExist();
    });

    it("Check 'LAUNCHING DETAILS' is displayed", () => {
      cy.intPageVerifyLaunchingDetailsExist();
    });

    it("Check 'Scheduled Go Live Date' is displayed", () => {
      cy.intPageVerifyScheduledGoLiveDateExist();
    });

    it("Check 'EMPLOYEES TEMPLATE LIST' is displayed", () => {
      cy.intPageVerifyEmployeesTemplateListExist();
    });

    it("Check 'Users List' is displayed", () => {
      cy.intPageVerifyUsersListExist();
    });

    it("Check 'Seed documents to be included' is displayed", () => {
      cy.intPageVerifySeedDocumentsToBeIncludedExist();
    });

    it("Check 'POST CREATION RECORDS' is displayed", () => {
      cy.intPageVerifyPostCreationRecordsExist();
    });

    it("Check 'Logs Created' is displayed", () => {
      cy.intPageVerifyLogsCreatedExist();
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
    it("Add TextField", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "fb-textfield" });
      cy.fbEnterPlaceholder({ placeholder: "fb-textfield placeholder" });
      cy.fbEnterNameValue({ name: "rows", value: "2" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });

    it("Add Hyperlink", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Hyperlink" });
      cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink" });
      cy.fbEnterNameValue({ name: "linkUrl", value: "google.com" });
      cy.fbSelectCheckboxValue("reviseDisabled", "deleteDisabled", "copyableValue");
      cy.fbAddNewFieldButton();
    });
  });

  context("Click on Form Preview >> The preview option must display all tabs and all fields per tab", () => {
    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify TextField", () => {
      cy.get(`[data-cy="fb-textfield"]`).eq(1).should("exist");
    });

    it("Verify Hyperlink", () => {
      cy.get(`[name^="fb-hyperlink-"]`).eq(1).should("exist");
    });

    it("Verify location linked on Hyperlink in new tab", () => {
      cy.window().then((win) => {
        cy.spy(win, "open").as("redirect");
      });
      cy.get("[name^=fb-hyperlink-]").eq(1).arrowClick();
      cy.get("@redirect").should("be.calledWith", "https://google.com");
    });

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Populate fields and check preview mode again", () => {
    it("Edit Hyperlink field", () => {
      cy.get(`[name^="fb-hyperlink-"]`)
        .parentsUntil("li").find("[data-cy=edit-schema-item]").arrowClick({ force: true });
      cy.fbEnterNameValue({ name: "label", value: "fb-hyperlink1" });
      cy.fbAddNewFieldButton();
    });

    it("Open Preview dialog", () => {
      cy.fbClickButton({ el: "FBWorkspace-clickView" });
    });

    it("Verify Hyperlink", () => {
      cy.get(`[name^="fb-hyperlink-"]`).eq(1).should("contain.text", "fb-hyperlink1");
    });
  });
});

// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
import { CONFIG } from "../../support/config";
import { momentInPST } from "../../utils/constants/dateHandler";
import { IMPORTER_USER } from "../../utils/constants/users";
import { USERS } from "./../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const lotsOutputDocType = "Lots";

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
        email: USERS[1].email,
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
      cy.drEnterDocumentTitle({ name: lotsOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: lotsOutputDocType + " description" });
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
      cy.get("[data-cy='field-document.documentType.id']").parent()
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
      cy.get("[data-cy='field-revisionStage']").parent().parent()
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
    it(`Select ${lotsOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: lotsOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'Initial Quantity' is not displayed", () => {
      cy.intPageVerifyInitialQuantityNotExist();
    });

    it("Check 'Usable Quantity' is not displayed", () => {
      cy.intPageVerifyUsableQuantityNotExist();
    });

    it("Check 'Expiration Date' is not displayed", () => {
      cy.intPageVerifyExpirationDateNotExist();
    });

    it("Check 'Part Selection' is not displayed", () => {
      cy.intPageVerifyPartSelectionNotExist();
    });

    it("Check '100% Inspection Override' is not displayed", () => {
      cy.intPageVerifyInspectionOverrideNotExist();
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
        cy.get("[data-cy='field-document.documentType.id']").parent()
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
        cy.get("[data-cy='field-revisionStage']").parent().parent()
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
      it("Check 'Initial Quantity' is displayed", () => {
        cy.intPageVerifyInitialQuantityExist();
      });

      it("Check 'Usable Quantity' is displayed", () => {
        cy.intPageVerifyUsableQuantityExist();
      });

      it("Check 'Expiration Date' is displayed", () => {
        cy.intPageVerifyExpirationDateExist();
      });

      it("Check 'Part Selection' is displayed", () => {
        cy.intPageVerifyPartSelectionExist();
      });

      it("Check '100% Inspection Override' is displayed", () => {
        cy.intPageVerifyInspectionOverrideExist();
      });

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
      cy.get("[id='DocumentRevisionForm-submit']").arrowClick();
    });

    it("Check 'Initial Quantity' is displayed", () => {
      cy.intPageVerifyInitialQuantityExist();
    });

    it("Check 'Usable Quantity' is displayed", () => {
      cy.intPageVerifyUsableQuantityExist();
    });

    it("Check 'Expiration Date' is displayed", () => {
      cy.intPageVerifyExpirationDateExist();
    });

    it("Check 'Part Selection' is displayed", () => {
      cy.intPageVerifyPartSelectionExist();
    });

    it("Check '100% Inspection Override' is displayed", () => {
      cy.intPageVerifyInspectionOverrideExist();
    });

    it("Check 'Approvals' is displayed", () => {
      cy.intPageVerifyApprovalsExist();
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

  // start of scenarion 1o of ENC-11456
  context("Verify Preview mode after doc creation", () => {
    it("Verify form preview button in Overview Tab", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
    });

    it("Verify tab 'details' exist", () => {
      cy.verifyTabs("details");
    });

    it("Verify lot quantity is visible", () => {
      cy.get(`.MuiDialogContent-root [name="lot_quantity"]`).should("be.visible");
    });

    it("Verify 'usable quantity' field is visible", () => {
      cy.get(`.MuiDialogContent-root [name="lot_usable_quantity"]`).should("be.visible");
    });

    it("Verify Expiration date is visible", () => {
      cy.get(`.MuiDialogContent-root input[name="lot_expiry_date"]`).should("be.visible");
    });

    it("Verify part selection is visible", () => {
      cy.get(`.MuiDialogContent-root [data-cy="lot_part"]`).should("be.visible");
    });

    it("Verify '100 % inspection override' is visible", () => {
      cy.get(`.MuiDialogContent-root [name="100-inspection-override"]`).should("be.visible");
    });

    it("Verify 'FB approval' is visible", () => {
      cy.get(".MuiDialogContent-root [name^='fb-approvals']").last().scrollIntoView();
      cy.get(".MuiDialogContent-root [name^='fb-approvals']").last().should("be.visible");
    });
  });

  context("Verify fields in preview mode editable or not", () => {
    it("Enter initial lot  quantity", () => {
      cy.get(`.MuiDialogContent-root [name="lot_quantity"]`).arrowType("10");
    });

    it("Enter 'usable quantity' field should be visible", () => {
      cy.get(`.MuiDialogContent-root [name="lot_usable_quantity"]`).arrowType("8");
    });

    it("Enter Expiration date", () => {
      cy.get(`.MuiDialogContent-root input[name^="lot_expiry_date"]`)
        .parent().find("button").arrowClick({ force: true });
      cy.get(".MuiPickersDay-daySelected").arrowClick();
    });

    it("Select Part", () => {
      cy.get(`.MuiDialogContent-root [data-cy="lot_part"]`).trigger("click");
      cy.unClick();
    });

    it("Check 100% override", () => {
      cy.get(`.MuiDialogContent-root [value="100% Inspection Override"]`).check();
    });

    it("Check approver editable or not Add  approver", () => {
      cy.get("[data-cy^='fb-approvals']").last().scrollIntoView().click().autocompleteSelect(USERS[1].name);
    });

    it("Close the preview mode", () => {
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
    });

    it("Reopen the preview mode and verify enter detail not saved", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
      cy.get(`.MuiDialogContent-root [name="lot_quantity"]`).should("not.contain.value", "10");
      cy.get(`.MuiDialogContent-root [name="lot_usable_quantity"]`).should("not.contain.value", "8");
      cy.get(`.MuiDialogContent-root input[name^="lot_expiry_date"]`)
        .should("not.contain.value", momentInPST().format("M/D/YYYY"));
      cy.get(`.MuiDialogContent-root [data-cy="lot_part"]`).should("not.contain.value");
      cy.get(`.MuiDialogContent-root [value="100% Inspection Override"]`).should("not.be.checked");
      cy.get(".MuiDialogContent-root [name^='fb-approvals']").last().should("not.contain.value", USERS[1].name);
    });

    it("Close the preview mode dialog", () => {
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Add FB fields and verify radio button group is visible when expiry date has value", () => {
    it("Add textfield", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
      cy.fbEnterNameValue({ name: "label", value: "FbLotText" });
      cy.fbAddField();
    });

    it("Add radio button group", () => {
      cy.fbAddNewFieldWhenHiddenLastPlace();
      cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Radio Button group" });
      cy.fbEnterNameValue({ name: "label", value: "RadioBtnGroup for inline" });
      cy.fbGroupOptions("One", "Two", "Three");
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.get("input[value^='visibility']").check();
      cy.get(`input[name="validators.required_if"]`).check();
      cy.get(`[data-cy="validators.required_if.name"]`).autocompleteSelect("Expiration Date");
      cy.get(`[name="validators.required_if.value"]`).parent().find("button").arrowClick({ force: true });
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.fbAddField();
    });

    it("Verify form preview button in Overview Tab", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
    });

    it("Verify radio button group is hidden", () => {
      cy.get("[name^='fb-lot-text']").last().should("exist");
      cy.get("[name^='radio-btn-group-for-inline']").should("be.hidden");
    });

    it("Enter  'Date' in Expiration field  Radio button group should be visible", () => {
      cy.get(`.MuiDialogContent-root input[name^="lot_expiry_date"]`).parent()
        .find("button").arrowClick({ force: true });
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.get("[name^='radio-btn-group-for-inline']").last().should("exist");
      cy.get("[data-cy='RadioBtnGroup for inline']").last().scrollIntoView();
      cy.get("[data-cy='RadioBtnGroup for inline']").should("be.visible");
    });

    it("Close the preview mode dialog", () => {
      cy.get(`.MuiDialogContent-root input[name^="lot_expiry_date"]`).parent()
        .find("button").arrowClick({ force: true });
      cy.get(".MuiPickersDay-daySelected").arrowClick();
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
    });
  });

  context("Remove the FB fields validation and verify", () => {
    it("Edit Component", () => {
      cy.get("[data-cy='edit-schema-item']").last().arrowClick({ force: true });
      cy.get(`[data-cy="fb-editor-mode-validation-1"]`).click().wait(1000);
      cy.get("input[value^='default']").check();
      cy.get(`input[name="validators.required_if"]`).uncheck();
      cy.fbAddField();
    });

    it("Open form preview", () => {
      cy.get("[data-cy='FBWorkspace-clickView']").click();
    });

    it("Verify radio button group is visible after removal of validation", () => {
      cy.get("[name^='radio-btn-group-for-inline']").last().should("exist");
      cy.get("[data-cy='RadioBtnGroup for inline']").last().scrollIntoView();
      cy.get("[data-cy='RadioBtnGroup for inline']").should("be.visible");
    });
  });
});

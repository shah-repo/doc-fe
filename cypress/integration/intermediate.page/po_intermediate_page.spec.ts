// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const outputDocType1 = "Bulk Create";
const poOutputDocType = "Purchase Order";

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

  context("Verify fields displays on page", () => {
    it("Verify header on the top left is empty", () => {
      cy.get("[data-cy=\"HeaderInfo\"]").should("not.exist");
    });

    it("Verify header on the top right have CREATE DOCUMENT button", () => {
      cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").should("exist")
        .parent().parent().should("have.class", "MuiGrid-justify-xs-flex-end");
    });

    it("Verify 'Title' field is displayed", () => {
      cy.intPageVerifyTitleExist();
    });

    it("Verify 'Description' field is displayed", () => {
      cy.intPageVerifyDescriptionExist();
    });

    it("Verify 'Document Type' field is displayed", () => {
      cy.intPageVerifyDocTypeExist();
    });

    it("Verify 'Document Id' field is displayed", () => {
      cy.get("[data-cy=\"field-document.docId\"]").should("exist");
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
  });

  context("Enter title and select revision stage", () => {
    it("Enter document title 'test title'", () => {
      cy.drEnterDocumentTitle({ name: "intermediate page test" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });
  });

  context("Verify editor options in description", () => {
    it("Click on description field", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick();
    });

    it("Veify 'Bold' option is available", () => {
      cy.get("[title=\"Bold\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Italic' option is available", () => {
      cy.get("[title=\"Italic\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Underline' option is available", () => {
      cy.get("[title=\"Underline\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Strikethrough' option is available", () => {
      cy.get("[title=\"Strikethrough\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Monospace' option is available", () => {
      cy.get("[title=\"Monospace\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Superscript' option is available", () => {
      cy.get("[title=\"Superscript\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Subscript' option is available", () => {
      cy.get("[title=\"Subscript\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Color Picker' option is available", () => {
      cy.get("[title=\"Color Picker\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Unordered' option is available", () => {
      cy.get("[title=\"Unordered\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Ordered' option is available", () => {
      cy.get("[title=\"Ordered\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Indent' option is available", () => {
      cy.get("[title=\"Indent\"]").should("exist").should("have.class", "rdw-option-disabled");
    });

    it("Veify 'Outdent' option is available", () => {
      cy.get("[title=\"Outdent\"]").should("exist").should("have.class", "rdw-option-disabled");
    });

    it("Veify 'Text align Left' option is available", () => {
      cy.get("[title=\"Left\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Text align Center' option is available", () => {
      cy.get("[title=\"Center\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Text align Right' option is available", () => {
      cy.get("[title=\"Right\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Text align Justify' option is available", () => {
      cy.get("[title=\"Justify\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Link' option is available", () => {
      cy.get("[title=\"Link\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Unlink' option is available", () => {
      cy.get("[title=\"Unlink\"]").should("exist").should("have.class", "rdw-option-disabled");
    });

    it("Veify 'Remove' option is available", () => {
      cy.get("[title=\"Remove\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Undo' option is available", () => {
      cy.get("[title=\"Undo\"]").should("exist").should("not.be.disabled");
    });

    it("Veify 'Redo' option is available", () => {
      cy.get("[title=\"Redo\"]").should("exist").should("have.class", "rdw-option-disabled");
    });

    it("Veify 'Header Type' option is not displayed", () => {
      cy.get("[title=\"Block Type\"]").should("not.exist");
    });

    it("Veify 'Font Size' option is not displayed", () => {
      cy.get("[title=\"Font Size\"]").should("not.exist");
    });

    it("Veify 'Font Type' option is not displayed", () => {
      cy.get("[title=\"Font\"]").should("not.exist");
    });
  });

  context("Verify DescriptionToolBar Functionality", () => {
    it("Verify Description for BOLD", () => {
      cy.get(`[data-cy="description"] [contenteditable]`).first().clear().wait(1000);
      cy.get("[class=\"rdw-inline-wrapper\"]").find("[title=\"Bold\"]").arrowClick().wait(2000);
      cy.get(`[data-cy="description"] [contenteditable]`).first().arrowType("I am here").wait(1000);
      cy.get("[data-cy=\"description\"]").contains("I am here").should("have.css", "font-weight", "700");
      cy.unClick();
    });

    it("Verify Description for Italic", () => {
      cy.get(`[data-cy="description"] [contenteditable]`).first().clear().wait(1000);
      cy.get("[class=\"rdw-inline-wrapper\"]").find("[title=\"Italic\"]").arrowClick().wait(2000);
      cy.get(`[data-cy="description"] [contenteditable]`).first().arrowType("I am here").wait(1000);
      cy.get("[data-cy=\"description\"]").contains("I am here").should("have.css", "font-style", "italic");
      cy.unClick();
    });

    // TODO: remaining options to be added

    it("Verify Description for Monospace", () => {
      cy.get(`[data-cy="description"] [contenteditable]`).first().clear().wait(1000);
      cy.get("[class=\"rdw-inline-wrapper\"]").find("[title=\"Monospace\"]").arrowClick().wait(2000);
      cy.get(`[data-cy="description"] [contenteditable]`).first().arrowType("I am here").wait(1000);
      cy.get("[data-cy=\"description\"]").contains("I am here").should("have.css", "font-family", "monospace");
      cy.unClick();
    });
  });

  context("Verify description field", () => {
    it("Enter a 1 line description", () => {
      // eslint-disable-next-line max-len
      cy.drEnterDocumentDescription({ description: "This is description test to check length. Checking length of characters and lines." });
      cy.unClick().wait(3000);
      cy.intPageVerifyDescriptionViewMoreNotExist();
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Add 2nd line description", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`).first()
        // eslint-disable-next-line max-len
        .arrowType("{moveToEnd}{enter}This is description test to check length. Checking length of characters and lines.");
      cy.unClick().wait(3000);
      cy.intPageVerifyDescriptionViewMoreNotExist();
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Add 3rd line description", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`).first()
        .arrowType("{moveToEnd}{enter}This is description test to check length.");
      cy.unClick().wait(3000);
      cy.intPageVerifyDescriptionViewMoreExist();
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Enter a description longer than 3 lines and over 245 characters", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`).first()
        .arrowType("{moveToEnd}{enter}Checking length of characters and lines ends here.");
      cy.unClick().wait(3000);
      cy.get("[data-cy=\"description\"] button").arrowClick();
      cy.get(`[data-cy="description"] [contenteditable]`).first()
        .scrollIntoView({ ensureScrollable: false });
    });

    // TODO: scroll visibility to be added
  });

  context("Verify 'Add Field' and 'Form Options' not displayed on page", () => {
    it("Verify 'Add Field' button not displayed", () => {
      cy.intPageVerifyAddFieldNotExist();
    });

    it("Verify 'Form Options' are not displayed", () => {
      cy.intPageVerifyFormOptionsNotExist();
    });
  });

  context("Select document type 'Form' and check some fields appeared", () => {
    it(`Select ${docType} document type`, () => {
      cy.drSelectDocumentType({ documentType: docType });
    });

    it("Verify Document id is assigned by system", () => {
      cy.get("input[id='document.docId']").should("contain.value", "FM-000");
    });

    it("Verify Document id is editable", () => {
      cy.intPageVerifyDocIdIsEditable();
    });

    it("Verify 'Attachment' field is displayed", () => {
      cy.intPageVerifyAttachmentExist();
    });

    it("Verify 'Preview Layout' button is disabled and grayed out", () => {
      cy.intPageVerifyPreviewLayoutButtonDisabled();
    });
  });

  context("Verify only one output document type is selected", () => {
    it(`Select ${outputDocType1} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: outputDocType1 });
    });

    it(`Select ${poOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: poOutputDocType });
    });

    it(`Verify ${outputDocType1} is removed and only ${poOutputDocType} is added`, () => {
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").should("not.have.text", outputDocType1);
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").should("have.text", poOutputDocType);
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'PO Status' is not displayed", () => {
      cy.intPageVerifyPoStatusNotExist();
    });

    it("Check 'Requestor' is not displayed", () => {
      cy.intPageVerifyRequestorNotExist();
    });

    it("Check 'Supplier' is not displayed", () => {
      cy.intPageVerifySupplierNotExist();
    });

    it("Check 'Order Date' is not displayed", () => {
      cy.intPageVerifyOrderDateNotExist();
    });

    it("Check 'PO table' is not displayed", () => {
      cy.intPageVerifyPoTableNotExist();
    });

    it("Check 'Approvals' is not displayed", () => {
      cy.intPageVerifyApproversNotExist();
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
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

      it("Verify 'Line Items' tab is displayed", () => {
        cy.intPageVerifyLineItemsTabExist();
      });
    });

    context("verify default fields are displayed", () => {
      it("Verify Document type is displayed", () => {
        cy.intPageVerifyDocTypeExist();
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

      it("Verify 'Attachment' field is displayed", () => {
        cy.intPageVerifyAttachmentExist();
      });

      it("Verify Output document type is displayed", () => {
        cy.intPageVerifyOutputDocTypeExist();
      });
    });

    context("verify predefined fields are displayed", () => {
      it("Check 'PO Status' is displayed", () => {
        cy.intPageVerifyPoStatusExist();
      });

      it("Check 'Requestor' is displayed", () => {
        cy.intPageVerifyRequestorExist();
      });

      it("Check 'Supplier' is displayed", () => {
        cy.intPageVerifySupplierExist();
      });

      it("Check 'Order Date' is displayed", () => {
        cy.intPageVerifyOrderDateExist();
      });

      it("Check 'PO table' is displayed", () => {
        cy.intPageVerifyPoTableExist();
      });

      it("Check 'Approvals' is displayed", () => {
        cy.intPageVerifyApproversExist();
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

    it("Check 'PO Status' is displayed", () => {
      cy.intPageVerifyPoStatusExist();
    });

    it("Check 'Requestor' is displayed", () => {
      cy.intPageVerifyRequestorExist();
    });

    it("Check 'Supplier' is displayed", () => {
      cy.intPageVerifySupplierExist();
    });

    it("Check 'Order Date' is displayed", () => {
      cy.intPageVerifyOrderDateExist();
    });

    it("Check 'PO table' is displayed", () => {
      cy.intPageVerifyPoTableExist();
    });

    it("Check 'Approvals' is displayed", () => {
      cy.intPageVerifyApproversExist();
    });
  });

  context("Verify description", () => {
    it("Verify description is saved correctly", () => {
      cy.intPageVerifyDescriptionViewMoreExist();
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
});

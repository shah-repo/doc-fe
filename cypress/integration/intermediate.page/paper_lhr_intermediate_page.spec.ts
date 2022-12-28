// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const paperLhrOutputDocType = "Paper Lot History Record";

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

  context("Verify predefined fields are not deletable in preview layout tab", () => {
    it("Click 'Preview Layout' button", () => {
      cy.intPageClickPreviewLayout();
    });

    it("Check 'Part to be Manufactured' is not deletable", () => {
      cy.get("[data-cy='Part to be Manufactured']").trigger("mouseover");
      cy.get(`[data-cy="edit-schema-item"]`)
        .should("not.exist");
      cy.get(`[data-cy="remove-schema-item"]`)
        .should("not.exist");
    });

    it("Check 'Initial Quantity' is not deletable", () => {
      cy.get("[data-cy='Initial Quantity']").trigger("mouseover");
      cy.get(`[data-cy="edit-schema-item"]`)
        .should("not.exist");
      cy.get(`[data-cy="remove-schema-item"]`)
        .should("not.exist");
    });

    it("Check 'End Quantity' is not deletable", () => {
      cy.get("[data-cy='End Quantity']").trigger("mouseover");
      cy.get(`[data-cy="edit-schema-item"]`)
        .should("not.exist");
      cy.get(`[data-cy="remove-schema-item"]`)
        .should("not.exist");
    });

    it("Check 'Build Type' is not deletable", () => {
      cy.get("[data-cy='Build Type']").trigger("mouseover");
      cy.get(`[data-cy="edit-schema-item"]`)
        .should("not.exist");
      cy.get(`[data-cy="remove-schema-item"]`)
        .should("not.exist");
    });

    it("Check 'Approvals' is not deletable", () => {
      cy.get("[data-cy='form.builder.approvals']").trigger("mouseover");
      cy.get(`[data-cy="edit-schema-item"]`)
        .should("not.exist");
      cy.get(`[data-cy="remove-schema-item"]`)
        .should("not.exist");
    });

    it("Close preview layout", () => {
      cy.get(`[data-cy="dialog-close"]`).arrowClick();
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
      it("Check 'Part to be Manufactured' is displayed", () => {
        cy.intPageVerifyPartToBeManufacturedExist();
      });

      it("Check 'Initial Quantity' is displayed", () => {
        cy.intPageVerifyInitialQuantityExist();
      });

      it("Check 'End Quantity' is displayed", () => {
        cy.intPageVerifyEndQuantityExist();
      });

      it("Check 'Build Type' is displayed", () => {
        cy.intPageVerifyBuildTypeExist();
      });

      it("Check 'Approvals' is displayed", () => {
        cy.intPageVerifyApprovalsExist();
      });

      it("Check 'Preview Layout' button gets colored", () => {
        cy.intPageVerifyPreviewLayoutButtonEnabled();
      });

      it("Close Preview dialog", () => {
        cy.intPageClosePreviewDialog();
      });
    });
  });

  context("Click 'Create Document' button and verify predefined fields are displayed and are not deletable", () => {
    it("Click on 'Create Document' button", () => {
      cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Check 'Part to be Manufactured' is displayed", () => {
      cy.intPageVerifyPartToBeManufacturedExist();
      cy.fbVerifyElementClassByLabel({
        label: "Part to be Manufactured", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Check 'Initial Quantity' is displayed", () => {
      cy.intPageVerifyInitialQuantityExist();
      cy.fbVerifyElementClassByLabel({
        label: "Initial Quantity", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Check 'End Quantity' is displayed", () => {
      cy.intPageVerifyEndQuantityExist();
      cy.fbVerifyElementClassByLabel({
        label: "End Quantity", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Check 'Build Type' is displayed", () => {
      cy.intPageVerifyBuildTypeExist();
      cy.fbVerifyElementClassByLabel({
        label: "Build Type", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
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
});

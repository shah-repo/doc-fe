// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const partsOutputDocType = "Parts";

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
      cy.drEnterDocumentTitle({ name: partsOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: partsOutputDocType + " description" });
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
    it(`Select ${partsOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: partsOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.intPageVerifyPreviewLayoutButtonEnabled();
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'Make vs Buy' is not displayed", () => {
      cy.intPageVerifyMakeVsBuyNotExist();
    });

    it("Check 'Unit of measure' is not displayed", () => {
      cy.intPageVerifyUnitOfMeasureNotExist();
    });

    it("Check 'Traceability required' is not displayed", () => {
      cy.intPageVerifyTraceabilityRequiredNotExist();
    });

    it("Check 'IQC Required' is not displayed", () => {
      cy.intPageVerifyIqcRequiredNotExist();
    });

    it("Check 'Limited Shelf Life' is not displayed", () => {
      cy.intPageVerifyLimitedShelfLifeNotExist();
    });

    it("Check 'FAI Required' is not displayed", () => {
      cy.intPageVerifyFaiRequiredNotExist();
    });
  });

  context("Verify predefined fields are not deletable in preview layout tab", () => {
    it("Click 'Preview Layout' button", () => {
      cy.intPageClickPreviewLayout();
    });

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Check 'Make vs Buy' is not deletable", () => {
      cy.get("[data-cy='Make vs Buy']").trigger("mouseover");
      cy.get(`[data-cy="edit-schema-item"]`)
        .should("not.exist");
      cy.get(`[data-cy="remove-schema-item"]`)
        .should("not.exist");
    });

    it("Check 'Unit of measure' is not deletable", () => {
      cy.get("[data-cy='Unit of measure']").trigger("mouseover");
      cy.get(`[data-cy="edit-schema-item"]`)
        .should("not.exist");
      cy.get(`[data-cy="remove-schema-item"]`)
        .should("not.exist");
    });

    it("Check 'Traceability required' is not deletable", () => {
      cy.get("[data-cy='Traceability required']").trigger("mouseover");
      cy.get(`[data-cy="edit-schema-item"]`)
        .should("not.exist");
      cy.get(`[data-cy="remove-schema-item"]`)
        .should("not.exist");
    });

    it("Check 'IQC Required' is not deletable", () => {
      cy.get("[data-cy='IQC Required']").trigger("mouseover");
      cy.get(`[data-cy="edit-schema-item"]`)
        .should("not.exist");
      cy.get(`[data-cy="remove-schema-item"]`)
        .should("not.exist");
    });

    it("Check 'Limited Shelf Life' is not deletable", () => {
      cy.get("[data-cy='Limited Shelf Life']").trigger("mouseover");
      cy.get(`[data-cy="edit-schema-item"]`)
        .should("not.exist");
      cy.get(`[data-cy="remove-schema-item"]`)
        .should("not.exist");
    });

    it("Check 'FAI Required' is not deletable", () => {
      cy.get("[data-cy='FAI Required']").trigger("mouseover");
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

      it("Verify 'Overview' tab is displayed", () => {
        cy.intPageVerifyOverviewTabExist();
      });

      it("Verify 'Specification' tab is displayed", () => {
        cy.intPageVerifySpecificationTabExist();
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
      it("Navigate to specification tab", () => {
        cy.drSelectSpecificationTab();
      });

      it("Check 'Make vs Buy' is displayed", () => {
        cy.intPageVerifyMakeVsBuyExist();
      });

      it("Check 'Unit of measure' is displayed", () => {
        cy.intPageVerifyUnitOfMeasureExist();
      });

      it("Check 'Traceability required' is displayed", () => {
        cy.intPageVerifyTraceabilityRequiredExist();
      });

      it("Check 'IQC Required' is displayed", () => {
        cy.intPageVerifyIqcRequiredExist();
      });

      it("Check 'Limited Shelf Life' is displayed", () => {
        cy.intPageVerifyLimitedShelfLifeExist();
      });

      it("Check 'FAI Required' is displayed", () => {
        cy.intPageVerifyFaiRequiredExist();
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

    it("Navigate to specification tab", () => {
      cy.drSelectSpecificationTab();
    });

    it("Check 'Make vs Buy' is displayed", () => {
      cy.intPageVerifyMakeVsBuyExist();
      cy.fbVerifyElementClassByLabel({
        label: "Make vs Buy", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Check 'Unit of measure' is displayed", () => {
      cy.intPageVerifyUnitOfMeasureExist();
      cy.fbVerifyElementClassByLabel({
        label: "Unit of measure", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Check 'Traceability required' is displayed", () => {
      cy.intPageVerifyTraceabilityRequiredExist();
      cy.fbVerifyElementClassByLabel({
        label: "Traceability required", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Check 'IQC Required' is displayed", () => {
      cy.intPageVerifyIqcRequiredExist();
      cy.fbVerifyElementClassByLabel({
        label: "IQC Required", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Check 'Limited Shelf Life' is displayed", () => {
      cy.intPageVerifyLimitedShelfLifeExist();
      cy.fbVerifyElementClassByLabel({
        label: "Limited Shelf Life", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });

    it("Check 'FAI Required' is displayed", () => {
      cy.intPageVerifyFaiRequiredExist();
      cy.fbVerifyElementClassByLabel({
        label: "FAI Required", el: "remove-schema-item",
        class: "schema-delete-disabled",
      });
    });
  });

  context("Verify form options and add field button is displayed in Specification tab", () => {
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
});

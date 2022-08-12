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
    it("Verify 'Title' field is displayed", () => {
      cy.get("[data-cy=\"field-name\"]").should("exist");
    });

    it("Verify 'Description' field is displayed", () => {
      cy.get("[data-cy=\"description\"]").should("exist");
    });

    it("Verify 'Document Type' field is displayed", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").should("exist");
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
      cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
    });

    it("Verify 'Training required' field is displayed", () => {
      cy.get("[data-cy=\"field-retrain\"]").should("exist");
    });

    it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").parent().parent()
        .should("have.class", "MuiGrid-grid-xs-6").next()
        .should("have.class", "MuiGrid-grid-xs-6")
        .should("contain.text", "Training Required");
    });

    it("Verify 'Selected Users' field is displayed", () => {
      cy.get("[data-cy=\"field-securityEmployees\"]").should("exist");
    });

    it("Verify 'Selected Groups' field is displayed", () => {
      cy.get("[data-cy=\"field-securityGroups\"]").should("exist");
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

  context("Verify description field", () => {
    it("Enter a 1 line description", () => {
      // eslint-disable-next-line max-len
      cy.drEnterDocumentDescription({ description: "This is description test to check length. Checking length of characters and lines." });
      cy.unClick().wait(3000);
      cy.get("[data-cy=\"description\"] button").should("not.exist");
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Add 2nd line description", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`).first()
        // eslint-disable-next-line max-len
        .arrowType("{moveToEnd}{enter}This is description test to check length. Checking length of characters and lines.");
      cy.unClick().wait(3000);
      cy.get("[data-cy=\"description\"] button").should("not.exist");
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Add 3rd line description", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`).first()
        .arrowType("{moveToEnd}{enter}This is description test to check length.");
      cy.unClick().wait(3000);
      cy.get("[data-cy=\"description\"] button").should("exist");
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
  });

  context("Verify 'Add Field' and 'Form Options' not displayed on page", () => {
    it("Verify 'Add Field' button not displayed", () => {
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").should("not.exist");
    });

    it("Verify view option is not displayed", () => {
      cy.get("button[data-cy=\"FBWorkspace-clickView\"]").should("not.exist");
    });

    it("check export option is diplayed", () => {
      cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").should("not.exist");
    });

    it("check import option is diplayed", () => {
      cy.get("[data-cy=\"FBWorkspace-importTemplate\"]").should("not.exist");
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
      cy.get("input[id='document.docId']").should("not.be.disabled");
    });

    it("Verify 'Attachment' field is displayed", () => {
      cy.get("#AttachmentFieldPresenter-linkButton").should("exist");
    });

    it("Verify 'Preview Layout' button is disabled and grayed out", () => {
      cy.contains("button", "Preview Layout").should("be.disabled")
        .should("have.css", "background-color", "rgb(162, 162, 162)");
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
      cy.contains("Preview Layout").should("have.css", "background-color", "rgb(1, 31, 187)");
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'PO Status' is not displayed", () => {
      cy.get("[data-cy=\"PO Status\"]").should("not.exist");
    });

    it("Check 'Requestor' is not displayed", () => {
      cy.get("[data-cy=\"Requestor\"]").should("not.exist");
    });

    it("Check 'Supplier' is not displayed", () => {
      cy.get("[data-cy=\"Supplier \"]").should("not.exist");
    });

    it("Check 'Order Date' is not displayed", () => {
      cy.get("[data-cy=\"Order Date\"]").should("not.exist");
    });

    it("Check 'PO table' is not displayed", () => {
      cy.get("[data-cy=\"common.summary.total\"]").should("not.exist");
    });

    it("Check 'Approvals' is not displayed", () => {
      cy.get("[data-cy=\"form.builder.approvers\"]").should("not.exist");
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.contains("Preview Layout").should("have.css", "background-color", "rgb(1, 31, 187)");
    });
  });

  context("Click 'Preview Layout' button and verify predefined fields are displayed", () => {
    context("verify default tabs are displayed", () => {
      it("Click 'Preview Layout' button", () => {
        cy.contains("Preview Layout").arrowClick();
        cy.get(".MuiDialogContent-root").scrollTo("bottom");
      });

      it("Verify 'Details' tab is displayed", () => {
        cy.get("[data-cy=\"tabId.details\"]").should("exist");
      });

      it("Verify 'Line Items' tab is displayed", () => {
        cy.get("[data-cy=\"tabId.lineitems\"]").should("exist");
      });
    });

    context("verify default fields are displayed", () => {
      it("Verify Document type is displayed", () => {
        cy.get("[data-cy=\"field-document.documentType.id\"]").should("exist");
      });

      it("Verify Document id is editable", () => {
        cy.get("input[id='document.docId']").should("exist")
          .should("not.be.disabled");
      });

      it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
        cy.get("[data-cy=\"field-document.documentType.id\"]").parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Document ID");
      });

      it("Verify 'Revision Stage' field is displayed", () => {
        cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
      });

      it("Verify 'Training required' field is displayed", () => {
        cy.get("[data-cy=\"field-retrain\"]").should("exist");
      });

      it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
        cy.get("[data-cy=\"field-revisionStage\"]").parent().parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Training Required");
      });

      it("Verify 'Attachment' field is displayed", () => {
        cy.get("#AttachmentFieldPresenter-linkButton").should("exist");
      });

      it("Verify Output document type is displayed", () => {
        cy.get("[data-cy=\"field-outputDocumentTypes\"]").should("exist");
      });
    });

    context("verify predefined fields are displayed", () => {
      it("Check 'PO Status' is displayed", () => {
        cy.get("[data-cy=\"PO Status\"]").should("exist");
      });

      it("Check 'Requestor' is displayed", () => {
        cy.get("[data-cy=\"Requestor\"]").should("exist");
      });

      it("Check 'Supplier' is displayed", () => {
        cy.get("[data-cy=\"Supplier \"]").should("exist");
      });

      it("Check 'Order Date' is displayed", () => {
        cy.get("[data-cy=\"Order Date\"]").should("exist");
      });

      it("Check 'PO table' is displayed", () => {
        cy.get("[data-cy=\"common.summary.total\"]").should("exist");
      });

      it("Check 'Approvals' is displayed", () => {
        cy.get("[data-cy=\"form.builder.approvers\"]").should("exist");
      });

      it("Close Preview dialog", () => {
        cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
      });
    });
  });

  context("Click 'Create Document' button and verify predefined fields are displayed", () => {
    it("Click on 'Create Document' button", () => {
      cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Check 'PO Status' is displayed", () => {
      cy.get("[data-cy=\"PO Status\"]").should("exist");
    });

    it("Check 'Requestor' is displayed", () => {
      cy.get("[data-cy=\"Requestor\"]").should("exist");
    });

    it("Check 'Supplier' is displayed", () => {
      cy.get("[data-cy=\"Supplier \"]").should("exist");
    });

    it("Check 'Order Date' is displayed", () => {
      cy.get("[data-cy=\"Order Date\"]").should("exist");
    });

    it("Check 'PO table' is displayed", () => {
      cy.get("[data-cy=\"common.summary.total\"]").should("exist");
    });

    it("Check 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvers\"]").should("exist");
    });
  });

  context("Verify description", () => {
    it("Verify description is saved correctly", () => {
      cy.get("[data-cy=\"description\"] button").should("exist");
    });
  });

  context("Verify form options and add field button is displayed in Details tab", () => {
    context("Check form options are displayed at center bottom", () => {
      it("check view option is diplayed", () => {
        cy.get("[data-cy=\"FBWorkspace-clickView\"]").should("exist")
          .parent().parent().should("have.class", "MuiGrid-align-items-xs-center");
      });

      it("check export option is diplayed", () => {
        cy.get("[data-cy=\"FBWorkspace-exportTemplate\"]").should("exist")
          .parent().parent().should("have.class", "MuiGrid-align-items-xs-center");
      });

      it("check import option is diplayed", () => {
        cy.get("[data-cy=\"FBWorkspace-importTemplate\"]").should("exist")
          .parent().parent().should("have.class", "MuiGrid-align-items-xs-center");
      });
    });

    context("Verify add field button is displayed", () => {
      it("Verify 'Add Field' button displayed", () => {
        cy.get("button[data-cy=\"form.builder.add.field\"]").should("exist");
      });
    });
  });
});

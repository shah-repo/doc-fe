// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

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

  xcontext("[API]Prepare company", () => {
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

  xcontext("Login company admin", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: adminEmployee.id });
    });
  });

  // just for testing purpose
  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: "Gold Ruecker LLC 3597", multiple: true });
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
    it("Verify 'Title' field is visible", () => {
      cy.get("[data-cy=\"field-name\"]").should("exist");
    });

    it("Verify 'Description' field is visible", () => {
      cy.get("[data-cy=\"description\"]").should("exist");
    });

    it("Verify 'Document Type' field is visible", () => {
      cy.get("[data-cy=\"field-document.documentType.id\"]").should("exist");
    });

    it("Verify 'Document Id' field is visible", () => {
      cy.get("[data-cy=\"field-document.docId\"]").should("exist");
    });

    // it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {

    // });

    it("Verify 'Revision Stage' field is visible", () => {
      cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
    });

    it("Verify 'Training required' field is visible", () => {
      cy.get("[data-cy=\"field-retrain\"]").should("exist");
    });

    // it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {

    // });

    it("Verify 'Selected Users' field is visible", () => {
      cy.get("[data-cy=\"field-securityEmployees\"]").should("exist");
    });

    it("Verify 'Selected Groups' field is visible", () => {
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
      cy.unClick().wait(5000);
      cy.get("[data-cy=\"description\"] button").should("not.exist");
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Add 2nd line description", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`).first()
        // eslint-disable-next-line max-len
        .arrowType("{moveToEnd}{enter}This is description test to check length. Checking length of characters and lines.");
      cy.unClick().wait(5000);
      cy.get("[data-cy=\"description\"] button").should("not.exist");
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Add 3rd line description", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`).first()
        .arrowType("{moveToEnd}{enter}This is description test to check length.");
      cy.unClick().wait(5000);
      cy.get("[data-cy=\"description\"] button").should("exist");
      cy.get("[data-cy=\"description\"]").first().scrollIntoView({ ensureScrollable: false });
    });

    it("Enter a description longer than 3 lines and over 245 characters", () => {
      cy.get("[data-cy=\"description\"]").first().arrowClick().wait(1000);
      cy.get(`[data-cy="description"] [contenteditable]`).first()
        .arrowType("{moveToEnd}{enter}Checking length of characters and lines ends here.");
      cy.unClick().wait(5000);
      cy.get("[data-cy=\"description\"] button").arrowClick();
      cy.get(`[data-cy="description"] [contenteditable]`).first()
        .scrollIntoView({ ensureScrollable: false });
    });
  });

  context("Verify some fields not displayed on page", () => {
    it("Verify 'Add Field' button not displayed", () => {
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").should("not.exist");
    });

    it("Verify form options not displayed", () => {
      cy.get("button[data-cy=\"FBWorkspace-clickView\"]").should("not.exist");
    });
  });

  context("Select document type 'Form' and check some fields appeared", () => {
    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
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
    it("Select 'Bulk Create' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Bulk Create" });
    });

    it("Select 'Purchase Order' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Purchase Order" });
    });

    it("Verify 'Bulk Create' is removed and only 'Purchase Order' is added", () => {
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").should("not.have.text", "Bulk Create");
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]")
        .should("have.text", "Purchase Order");
    });
  });

  context("Verify no predefined fields are displayed", () => {
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
    it("Click 'Preview Layout' button", () => {
      cy.contains("Preview Layout").arrowClick();
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

    it("Close Preview dialog", () => {
      cy.get(`svg[data-cy="dialog-close"]`).arrowClick();
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

  context("Check form options are displayed", () => {
    it("check eye option is diplayed", () => {
      cy.get("[id^=\"sm-tabpanel-0\"]").scrollTo("bottom");
      cy.get("[data-cy=\"FBWorkspace-clickView\"]").should("exist");
    });

    //   it("check export option is diplayed", () => {

    //   });

    //   it("check import option is diplayed", () => {

    //   });
  });

  context("Verify add field button and description", () => {
    it("Verify 'Add Field' button displayed", () => {
      cy.get("button[data-cy=\"form.builder.add.field\"]").should("exist");
    });

    it("Verify description is saved correctly", () => {
      cy.get("[data-cy=\"description\"] button").should("exist");
    });
  });
});

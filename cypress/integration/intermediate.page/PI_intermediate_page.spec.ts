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
      cy.cmpSelectCompany({ name: "Maroon Leuschke and Sons 20095", multiple: true });
    });
  });

  context("Validate 'Manufacturing Process Instructions' intermediate page", () => {
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
      it("Enter document title 'test title'", () => {
        cy.drEnterDocumentTitle({ name: "intermediate page test" });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "MPI document description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });
    });

    context("Select document type 'Manufacturing Process Instructions' and check fields", () => {
      it("Select 'Manufacturing Process Instructions' document type", () => {
        cy.drSelectDocumentType({ documentType: "Manufacturing Process Instructions" });
      });

      it("Verify Document id is assigned by system", () => {
        cy.get("input[id='document.docId']").should("contain.value", "MPI-000");
      });

      it("Verify Document id is editable", () => {
        cy.get("input[id='document.docId']").should("not.be.disabled");
      });

      it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
        cy.get("[data-cy=\"field-document.documentType.id\"]").parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Document ID");
      });

      it("Verify 'Revision Stage' field is visible", () => {
        cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
      });

      it("Verify 'Training required' field is visible", () => {
        cy.get("[data-cy=\"field-retrain\"]").should("exist");
      });

      it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
        cy.get("[data-cy=\"field-revisionStage\"]").parent().parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Training Required");
      });

      it("Verify 'Attachment' field is not displayed", () => {
        cy.get("#AttachmentFieldPresenter-linkButton").should("not.exist");
      });

      it(`Verify output document type is not displayed`, () => {
        cy.get("[data-cy=\"field-outputDocumentTypes\"]").should("not.exist");
      });

      it("Verify 'Preview Layout' button is not displayed", () => {
        cy.contains("button", "Preview Layout").should("not.exist");
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

    context("Click 'Create Document' button and verify predefined fields are displayed", () => {
      it("Click on 'Create Document' button", () => {
        cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Check 'Approvals' is displayed", () => {
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      it("Select 'Procedure' tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Check 'PI PROCEDURE' is displayed", () => {
        cy.get("[data-cy=\"form.builder.mpiprocedure\"]").should("exist");
      });

      it("Check 'Start quantity' is displayed", () => {
        cy.get("[data-cy=\"Start quantity\"]").should("exist");
      });

      it("Check 'Accepted quantity' is displayed", () => {
        cy.get("[data-cy=\"Accepted quantity\"]").should("exist");
      });

      it("Check 'Rejected quantity' is displayed", () => {
        cy.get("[data-cy=\"Rejected quantity\"]").should("exist");
      });
    });

    context("Verify add field button is diplayed", () => {
      it("Verify 'Add Field' button displayed", () => {
        cy.get("button[data-cy=\"form.builder.add.field\"]").should("exist");
      });
    });

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
  });

  xcontext("Validate 'Quality Process Instructions' intermediate page", () => {
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
      it("Enter document title 'test title'", () => {
        cy.drEnterDocumentTitle({ name: "intermediate page test" });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "MPI document description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });
    });

    context("Select document type 'Quality Process Instructions' and check fields", () => {
      it("Select 'Quality Process Instructions' document type", () => {
        cy.drSelectDocumentType({ documentType: "Quality Process Instructions" });
      });

      it("Verify Document id is assigned by system", () => {
        cy.get("input[id='document.docId']").should("contain.value", "MPI-000");
      });

      it("Verify Document id is editable", () => {
        cy.get("input[id='document.docId']").should("not.be.disabled");
      });

      it("Verify 'Document Type' and 'Document Id' fields are in one line", () => {
        cy.get("[data-cy=\"field-document.documentType.id\"]").parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Document ID");
      });

      it("Verify 'Revision Stage' field is visible", () => {
        cy.get("[data-cy=\"field-revisionStage\"]").should("exist");
      });

      it("Verify 'Training required' field is visible", () => {
        cy.get("[data-cy=\"field-retrain\"]").should("exist");
      });

      it("Verify 'Revision Stage' and 'Training required' fields are in one line", () => {
        cy.get("[data-cy=\"field-revisionStage\"]").parent().parent()
          .should("have.class", "MuiGrid-grid-xs-6").next()
          .should("have.class", "MuiGrid-grid-xs-6")
          .should("contain.text", "Training Required");
      });

      it("Verify 'Attachment' field is not displayed", () => {
        cy.get("#AttachmentFieldPresenter-linkButton").should("not.exist");
      });

      it(`Verify output document type is not displayed`, () => {
        cy.get("[data-cy=\"field-outputDocumentTypes\"]").should("not.exist");
      });

      it("Verify 'Preview Layout' button is not displayed", () => {
        cy.contains("button", "Preview Layout").should("not.exist");
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

    context("Click 'Create Document' button and verify predefined fields are displayed", () => {
      it("Click on 'Create Document' button", () => {
        cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
      });

      it("Check 'Approvals' is displayed", () => {
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      it("Select 'Procedure' tab", () => {
        cy.drSelectProcedureTab();
      });

      it("Check 'PI PROCEDURE' is displayed", () => {
        cy.get("[data-cy=\"form.builder.mpiprocedure\"]").should("exist");
      });

      it("Check 'Start quantity' is displayed", () => {
        cy.get("[data-cy=\"Start quantity\"]").should("exist");
      });

      it("Check 'Accepted quantity' is displayed", () => {
        cy.get("[data-cy=\"Accepted quantity\"]").should("exist");
      });

      it("Check 'Rejected quantity' is displayed", () => {
        cy.get("[data-cy=\"Rejected quantity\"]").should("exist");
      });
    });

    context("Verify add field button is diplayed", () => {
      it("Verify 'Add Field' button displayed", () => {
        cy.get("button[data-cy=\"form.builder.add.field\"]").should("exist");
      });
    });

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
  });
});

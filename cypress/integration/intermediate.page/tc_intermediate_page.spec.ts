// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const docType = "Form";
const tcOutputDocType = "Training Curriculum";

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
      cy.drEnterDocumentTitle({ name: tcOutputDocType + " title" });
    });

    it("Enter description", () => {
      cy.drEnterDocumentDescription({ description: tcOutputDocType + " description" });
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
      cy.get("input[id='document.docId']").should("not.be.disabled");
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

    it("Verify 'Attachment' field is displayed", () => {
      cy.get("#AttachmentFieldPresenter-linkButton").should("exist");
    });

    it("Verify 'Preview Layout' button is disabled and grayed out", () => {
      cy.contains("button", "Preview Layout").should("be.disabled")
        .should("have.css", "background-color", "rgb(162, 162, 162)");
    });
  });

  context("Select output document type", () => {
    it(`Select ${tcOutputDocType} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: tcOutputDocType });
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.contains("Preview Layout").should("have.css", "background-color", "rgb(1, 31, 187)");
    });
  });

  context("Verify predefined fields are not displayed", () => {
    it("Check 'Approvals' is not displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("not.exist");
    });

    it("Check 'PERIODIC TRAINING' is not displayed", () => {
      cy.get("[data-cy=\"Refresh/repeat training periodically?\"]").should("not.exist");
    });

    it("Check 'Documents to Train on' is not displayed", () => {
      cy.get("[data-cy=\"Documents to be trained on\"]").should("not.exist");
    });

    it("Check 'Refresh/repeat training periodically?' is not displayed", () => {
      cy.get("[data-cy=\"Refresh/repeat training periodically?\"]").should("not.exist");
    });

    it("Check 'Training Frequency (in days)' is not displayed", () => {
      cy.get("[data-cy=\"Training refresh period (days)\"]").should("not.exist");
    });

    it("Check 'TRAINEES DETAILS' is not displayed", () => {
      cy.get("[data-cy=\"Trainees Details\"]").should("not.exist");
    });

    it("Check 'Groups to Train' is not displayed", () => {
      cy.get("[data-cy=\"Select Groups to train\"]").should("not.exist");
    });

    it("Check 'Users to Train (if applicable)' is not displayed", () => {
      cy.get("[data-cy=\"Select Users to train (if applicable)\"]").should("not.exist");
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

  context("Click 'Preview Layout' button and verify predefined fields are displayed", () => {
    context("verify default tabs are displayed", () => {
      it("Click 'Preview Layout' button", () => {
        cy.contains("Preview Layout").arrowClick();
        cy.get(".MuiDialogContent-root").scrollTo("bottom");
      });

      it("Verify 'Overview' tab is displayed", () => {
        cy.get("[data-cy=\"tabId.overview\"]").should("exist");
      });

      it("Verify 'Details' tab is displayed", () => {
        cy.get("[data-cy=\"tabId.details\"]").should("exist");
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
      it("Check 'Approvals' is displayed", () => {
        cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      it("Click on 'Details' tab", () => {
        cy.drSelectDetailsTab();
      });

      it("Check 'PERIODIC TRAINING' is displayed", () => {
        cy.get("[data-cy=\"Refresh/repeat training periodically?\"]").should("exist");
      });

      it("Check 'Documents to Train on' is displayed", () => {
        cy.get("[data-cy=\"Documents to be trained on\"]").should("exist");
      });

      it("Check 'Refresh/repeat training periodically?' is displayed", () => {
        cy.get("[data-cy=\"Refresh/repeat training periodically?\"]").should("exist");
      });

      it("Check 'Training Frequency (in days)' is displayed", () => {
        cy.get("[data-cy=\"Training refresh period (days)\"]").should("exist");
      });

      it("Check 'TRAINEES DETAILS' is displayed", () => {
        cy.get("[data-cy=\"Trainees Details\"]").should("exist");
      });

      it("Check 'Groups to Train' is displayed", () => {
        cy.get("[data-cy=\"Select Groups to train\"]").should("exist");
      });

      it("Check 'Users to Train (if applicable)' is displayed", () => {
        cy.get("[data-cy=\"Select Users to train (if applicable)\"]").should("exist");
      });

      it("Close Preview dialog", () => {
        cy.get("svg[data-cy=\"dialog-close\"]").arrowClick();
      });
    });
  });

  context("Click 'Create Document' button and verify predefined fields are displayed", () => {
    it("Click on 'Create Document' button", () => {
      cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Check 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });

    it("Click on 'Details' tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Check 'PERIODIC TRAINING' is displayed", () => {
      cy.get("[data-cy=\"Refresh/repeat training periodically?\"]").should("exist");
    });

    it("Check 'Documents to Train on' is displayed", () => {
      cy.get("[data-cy=\"Documents to be trained on\"]").should("exist");
    });

    it("Check 'Refresh/repeat training periodically?' is displayed", () => {
      cy.get("[data-cy=\"Refresh/repeat training periodically?\"]").should("exist");
    });

    it("Check 'Training Frequency (in days)' is displayed", () => {
      cy.get("[data-cy=\"Training refresh period (days)\"]").should("exist");
    });

    it("Check 'TRAINEES DETAILS' is displayed", () => {
      cy.get("[data-cy=\"Trainees Details\"]").should("exist");
    });

    it("Check 'Groups to Train' is displayed", () => {
      cy.get("[data-cy=\"Select Groups to train\"]").should("exist");
    });

    it("Check 'Users to Train (if applicable)' is displayed", () => {
      cy.get("[data-cy=\"Select Users to train (if applicable)\"]").should("exist");
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

  context("Verify form options and add field button is displayed in Overview tab", () => {
    context("Check form options are displayed at center bottom", () => {
      it("Click on 'Overview' tab", () => {
        cy.drSelectOverviewTab();
      });

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

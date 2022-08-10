// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const outputDocType1 = "Bulk Create";
const outputDocType2 = "Lot History Record";

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

  context("Verify some fields not displayed on page", () => {
    it("Verify 'Add Field' button not displayed", () => {
      cy.get("button[data-cy=\"fb-editor-actions-add\"]").should("not.exist");
    });

    it("Verify form options not displayed", () => {
      cy.get("button[data-cy=\"FBWorkspace-clickView\"]").should("not.exist");
    });
  });

  context("Select document type 'Form' and check some fields appeared", () => {
    it("Select 'LHR Template' document type", () => {
      cy.drSelectDocumentType({ documentType: "LHR Template" });
    });

    it("Verify Document id is assigned by system", () => {
      cy.get("input[id='document.docId']").should("contain.value", "LHRT-000");
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

    it(`Select ${outputDocType2} output document type`, () => {
      cy.drSelectOutputDocumentType({ documentType: outputDocType2 });
    });

    it(`Verify ${outputDocType1} is removed and only ${outputDocType2} is added`, () => {
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]").should("not.have.text", outputDocType1);
      cy.get("[id=\"formTemplate.outputDocumentTypes\"]")
        .should("have.text", outputDocType2);
    });
  });

  context("Verify no predefined fields are displayed", () => {
    it("Check 'Part to be Manufactured' is not displayed", () => {
      cy.get("[data-cy=\"Part to be Manufactured\"]").should("not.exist");
    });

    it("Check 'Initial Quantity' is not displayed", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").should("not.exist");
    });

    it("Check 'End Quantity' is not displayed", () => {
      cy.get("[data-cy=\"End Quantity\"]").should("not.exist");
    });

    it("Check 'Build Type' is not displayed", () => {
      cy.get("[data-cy=\"Build Type\"]").should("not.exist");
    });

    it("Check 'Due Date' is not displayed", () => {
      cy.get("[data-cy=\"Due Date\"]").should("not.exist");
    });

    it("Check 'Approvals' is not displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("not.exist");
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.contains("Preview Layout").should("have.css", "background-color", "rgb(1, 31, 187)");
    });

    it("Check 'Step #1' is not displayed", () => {
      cy.get("[data-cy=\"LHR Step 1\"]").should("not.exist");
    });
  });

  context("Click 'Preview Layout' button and verify predefined fields are displayed", () => {
    it("Click 'Preview Layout' button", () => {
      cy.contains("Preview Layout").arrowClick();
      cy.get(".MuiDialogContent-root").scrollTo("bottom");
    });

    it("Check 'Part to be Manufactured' is displayed", () => {
      cy.get("[data-cy=\"Part to be Manufactured\"]").should("exist");
    });

    it("Check 'Initial Quantity' is displayed", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").should("exist");
    });

    it("Check 'End Quantity' is displayed", () => {
      cy.get("[data-cy=\"End Quantity\"]").should("exist");
    });

    it("Check 'Build Type' is displayed", () => {
      cy.get("[data-cy=\"Build Type\"]").should("exist");
      // cy.get("[data-cy=\"Build Type\"]").parents().should("have.value", "R&D");
      // cy.get("[data-cy=\"Build Type\"]").parents().should("have.value", "Production");
    });

    it("Check 'Due Date' is displayed", () => {
      cy.get("[data-cy=\"Due Date\"]").should("exist");
    });

    it("Check 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });

    it("Check 'Preview Layout' button gets colored", () => {
      cy.contains("Preview Layout").should("have.css", "background-color", "rgb(1, 31, 187)");
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    it("Check 'Step #1' is displayed", () => {
      cy.get("[data-cy=\"LHR Step 1\"]").should("exist");
    });

    it("Close Preview dialog", () => {
      cy.get("svg[data-cy=\"dialog-close\"]").arrowClick();
    });
  });

  context("Click 'Create Document' button and verify predefined fields are displayed", () => {
    it("Click on 'Create Document' button", () => {
      cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
    });

    it("Check 'Part to be Manufactured' is displayed", () => {
      cy.get("[data-cy=\"Part to be Manufactured\"]").should("exist");
    });

    it("Check 'Initial Quantity' is displayed", () => {
      cy.get("[data-cy=\"Initial Quantity\"]").should("exist");
    });

    it("Check 'End Quantity' is displayed", () => {
      cy.get("[data-cy=\"End Quantity\"]").should("exist");
    });

    it("Check 'Build Type' is displayed", () => {
      cy.get("[data-cy=\"Build Type\"]").should("exist");
      // cy.get("[label=\"Build Type\"]").should("have.value", "R&D");
      // cy.get("[label=\"Build Type\"]").should("have.value", "Production");
    });

    it("Check 'Due Date' is displayed", () => {
      cy.get("[data-cy=\"Due Date\"]").should("exist");
    });

    it("Check 'Approvals' is displayed", () => {
      cy.get("[data-cy=\"form.builder.approvals\"]").should("exist");
    });

    it("Navigate to Detail Tab", () => {
      cy.drSelectDetailsTab();
    });

    // it("Check 'Step #1' is displayed", () => {
    //   cy.get("[data-cy=\"LHR Step 1\"]").should("exist");
    // });
  });

  context("Verify form options and add field button is displayed in Details tab", () => {
    context("Check form options are displayed at center bottom", () => {
      it("check eye option is diplayed", () => {
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
      it("Navigate to overview Tab", () => {
        cy.drSelectOverviewTab();
      });

      it("check eye option is diplayed", () => {
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

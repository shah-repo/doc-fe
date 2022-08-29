// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { QPITest } from "../../utils/constants/documentTypes/qpi";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let adminEmployee;

const mpiOutputDocType = "Manufacturing Process Instructions";
const qpiOutputDocType = "Quantity Process Instructions Test";

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
              QPITest,
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

  context(`Validate ${mpiOutputDocType} intermediate page`, () => {
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
        cy.drEnterDocumentTitle({ name: "mpi intermediate page test" });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "MPI document description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });
    });

    context(`Select document type ${mpiOutputDocType} and check fields`, () => {
      it(`Select ${mpiOutputDocType} document type`, () => {
        cy.drSelectDocumentType({ documentType: mpiOutputDocType });
      });

      it("Verify Document id is assigned by system", () => {
        cy.get("input[id='document.docId']").should("contain.value", "MPI-000");
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

      it("Verify 'Attachment' field is not displayed", () => {
        cy.intPageVerifyAttachmentNotExist();
      });

      it(`Verify output document type is not displayed`, () => {
        cy.intPageVerifyOutputDocTypeNotExist();
      });

      it("Verify 'Preview Layout' button is not displayed", () => {
        cy.intPageVerifyPreviewLayoutButtonNotExist();
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

    context("Click 'Create Document' button and verify predefined fields are displayed", () => {
      context("verify default tabs are displayed", () => {
        it("Click on 'Create Document' button", () => {
          cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
        });

        it("Verify 'Overview' tab is displayed", () => {
          cy.intPageVerifyOverviewTabExist();
        });

        it("Verify 'Procedure' tab is displayed", () => {
          cy.intPageVerifyProcedureTabExist();
        });

        it("Verify 'Materials & Equipment' tab is displayed", () => {
          cy.intPageVerifyMaterialsAndEquipmentTabExist();
        });

        it("Verify 'Training' tab is displayed", () => {
          cy.intPageVerifyTrainingTabExist();
        });
      });

      context("verify predefined fields are displayed", () => {
        it("Verify 'Attachment' field is displayed", () => {
          cy.intPageVerifyAttachmentExist();
        });

        it("Check 'Approvals' is displayed", () => {
          cy.intPageVerifyApprovalsExist();
        });

        it("Select 'Procedure' tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Check 'PI PROCEDURE' is displayed", () => {
          cy.intPageVerifyPiProcedureExist();
        });

        it("Check 'Start quantity' is displayed", () => {
          cy.intPageVerifyStartQuantityExist();
        });

        it("Check 'Accepted quantity' is displayed", () => {
          cy.intPageVerifyAcceptedQuantityExist();
        });

        it("Check 'Rejected quantity' is displayed", () => {
          cy.intPageVerifyRejectedQuantityExist();
        });
      });
    });

    context("Verify add field button is diplayed", () => {
      it("Verify 'Add Field' button displayed", () => {
        cy.intPageVerifyAddFieldExist();
      });
    });

    context("Check form options are displayed at center bottom", () => {
      it("check 'Form Options' are diplayed at bottom center", () => {
        cy.intPageVerifyFormOptionsExist();
      });
    });
  });

  context(`Validate ${qpiOutputDocType} intermediate page`, () => {
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
        cy.drEnterDocumentTitle({ name: "qpi intermediate page test" });
      });

      it("Enter description 'MPI document description'", () => {
        cy.drEnterDocumentDescription({ description: "QPI document description" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });
    });

    context(`Select document type ${qpiOutputDocType} and check fields`, () => {
      it(`Select ${qpiOutputDocType} document type`, () => {
        cy.drSelectDocumentType({ documentType: qpiOutputDocType });
      });

      it("Verify Document id is assigned by system", () => {
        cy.get("input[id='document.docId']").should("contain.value", "QPI-000");
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

      it("Verify 'Attachment' field is not displayed", () => {
        cy.intPageVerifyAttachmentNotExist();
      });

      it(`Verify output document type is not displayed`, () => {
        cy.intPageVerifyOutputDocTypeNotExist();
      });

      it("Verify 'Preview Layout' button is not displayed", () => {
        cy.intPageVerifyPreviewLayoutButtonNotExist();
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

    context("Click 'Create Document' button and verify predefined fields are displayed", () => {
      context("verify default tabs are displayed", () => {
        it("Click on 'Create Document' button", () => {
          cy.get("[id=\"DocumentRevisionForm-submit\"]").arrowClick();
        });

        it("Verify 'Overview' tab is displayed", () => {
          cy.intPageVerifyOverviewTabExist();
        });

        it("Verify 'Procedure' tab is displayed", () => {
          cy.intPageVerifyProcedureTabExist();
        });

        it("Verify 'Materials & Equipment' tab is displayed", () => {
          cy.intPageVerifyMaterialsAndEquipmentTabExist();
        });
      });

      context("verify predefined fields are displayed", () => {
        it("Verify 'Attachment' field is displayed", () => {
          cy.intPageVerifyAttachmentExist();
        });

        it("Check 'Approvals' is displayed", () => {
          cy.intPageVerifyApprovalsExist();
        });

        it("Select 'Procedure' tab", () => {
          cy.drSelectProcedureTab();
        });

        it("Check 'PI PROCEDURE' is displayed", () => {
          cy.intPageVerifyPiProcedureExist();
        });

        it("Check 'Start quantity' is displayed", () => {
          cy.intPageVerifyStartQuantityExist();
        });

        it("Check 'Accepted quantity' is displayed", () => {
          cy.intPageVerifyAcceptedQuantityExist();
        });

        it("Check 'Rejected quantity' is displayed", () => {
          cy.intPageVerifyRejectedQuantityExist();
        });
      });
    });

    context("Verify add field button is diplayed", () => {
      it("Verify 'Add Field' button displayed", () => {
        cy.intPageVerifyAddFieldExist();
      });
    });

    context("Check form options are displayed at center bottom", () => {
      it("check 'Form Options' are diplayed at bottom center", () => {
        cy.intPageVerifyFormOptionsExist();
      });
    });
  });
});

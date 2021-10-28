// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let employeeLoginFirst;

context("Autosave EB test", () => {
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
    it("[API]Create company", (done: any) => {
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
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
          done();
        });
      });
    });
  });

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
    });
  });

  context("Create EB form", () => {
    context("Start document creation flow", () => {
      it("Navigate to Document list", () => {
        cy.navigToDocumentList();
      });

      it("Click on 'Create a document' button", () => {
        cy.cmpClickCreateNewDocument();
      });
    });

    context("Fill in the form attributes", () => {
      it("Enter title 'Engineering Build Form", () => {
        cy.drEnterDocumentTitle({ name: "Engineering Build Form" });
      });

      it("Enter description 'Engineering Build Form description'", () => {
        cy.drEnterDocumentDescription({ description: "Engineering Build Form description" });
      });

      it("Select 'Form' document type from dropdown", () => {
        cy.drSelectDocumentType({ documentType: "Form" });
      });

      it("Select 'Numeric' revision stage", () => {
        cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
      });

      it("Select 'Engineering Build' output document type from dropdown", () => {
        cy.drSelectOutputDocumentType({ documentType: "Engineering Build" });
      });

      it("Verify that Approvals field is automatically added", () => {
        cy.get("div[data-cy=\"form.builder.approvals\"]").should("exist");
      });

      it("Add EB Procedure", () => {
        cy.get("[data-cy=\"form.builder.add.field\"]").arrowClick({ force: true });
        cy.fbSelectItemFromNewFieldList({ field: "EB Procedure" });
        cy.fbAddNewFieldButton();
      });
    });

    context("Create the form and release it", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release the form", () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });
  });

  context("Create an EB document", () => {
    it("Click 'Create New' button", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enter title 'Test Engineering Build'", () => {
      cy.drEnterDocumentTitle({ name: "Test Engineering Build" });
    });

    it("Enter description 'Test Engineering Build description'", () => {
      cy.drEnterDocumentDescription({ description: "Test Engineering Build description" });
    });

    it("Fill step #1 description and check autosave", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.mpiEnterDescriptionToStep({ numbOfStep: 1, description: "Description of step one" });
      });
    });

    it("Add attachment and check autosave", () => {
      cy.get("[data-cy=\"albumMediaButton\"]").arrowClick();
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev, CyRoutes.GetDocAudit, CyRoutes.PatchDocRev], () => {
        cy.elUploadAttachment({
          fileName: "image.jpg",
          el: "fb-mediaalbum-upload-",
        });
      });
    });

    it("Add 'Material' to step #1 and check autosave", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.GetAutocompleteOptions, () => {
          cy.get("[data-cy=\"form.builder.materials.btn\"]").arrowClick();
        });
        cy.get("[data-cy=\"title\"]").arrowType("Material");
        cy.get("[data-cy=\"partLot\"]").arrowType("test");
        cy.get("[name=\"quantity\"]").arrowType("2");
        cy.get("[data-cy=\"unit\"]").arrowType("Day{downarrow}{enter}");
        cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
      });
    });

    it("Add 'Equipment' to step #1 and check autosave", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[data-cy=\"form.builder.equipment.btn\"]").arrowClick();
        cy.get("[data-cy=\"title\"]").arrowType("Equipment");
        cy.get("[data-cy=\"form.builder.save\"]").arrowClick();
      });
    });

    it("Delete Material and check for autosave", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[data-cy=\"form.builder.procedure.materials.title\"]").parent()
          .find("button").last().arrowClick();
      });
    });

    it("Delete attachment and check autosave", () => {
      cy.wrapWithWaitOnApiCalls([CyRoutes.PatchDocRev], () => {
        cy.get("[id^=\"fb-mediaalbum-upload-\"]").parent()
          .find("button").eq(3).arrowClick({ force: true });
      });
    });
  });

  context("Add/remove approver and check autosave", () => {
    it("Add first Approver'", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[1].name });
    });

    it("Add second Approver'", () => {
      cy.pmAddApproverOnApproverList({ approver: USERS[2].name });
    });

    it("check approvers after reload page", () => {
      cy.reload();
      cy.get(".MuiAutocomplete-tag").eq(0)
        .should("have.text", `${USERS[2].name} - ${USERS[2].email}`);
      cy.get(".MuiAutocomplete-tag").eq(1)
        .should("have.text", `${USERS[1].name} - ${USERS[1].email}`);
    });

    it("Remove second Approver'", () => {
      cy.contains(`${USERS[2].name} - ${USERS[2].email}`).parent().next().arrowClick();
    });

    it("check approvers after reload page", () => {
      cy.reload();
      cy.get(".MuiAutocomplete-tag").eq(0)
        .should("have.text", `${USERS[1].name} - ${USERS[1].email}`);
      cy.get(".MuiAutocomplete-tag").eq(1)
        .should("not.exist");
    });
  });

  context("Submit EB for approval", () => {
    it("Click 'Submit for Approval' button", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.PostDocRevInReview, () => {
        cy.get("[data-cy=\"ApproveAndRelease-button\"]").arrowClick();
      });
    });
  });
});

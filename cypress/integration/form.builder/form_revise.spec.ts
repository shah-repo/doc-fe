// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("FORM document revise test", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      SystemRequirement("REQ-0400", "REQ-0420", "REQ-0440");
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
              {
                documentTypeName: "Clinical Protocol",
                documentTypeAcronym: "CP-",
                group: "OTHER",
                isQms: true,
              },
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: USERS[2].email,
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        multipleCompanies = loginResponse.employees.length > 1 ? true : false;
        done();
      });
    });
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Create FORM document", () => {
    it("Navigate to document list", () => {
      cy.navigToDocumentList();
    });

    it("Click create document", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enter document title 'FORM doucment'", () => {
      cy.drEnterDocumentTitle({ name: "FORM doucment" });
    });

    it("Enter document description 'FORM doucment description'", () => {
      cy.drEnterDocumentDescription({ description: "FORM doucment description" });
    });

    it("Select 'Form' document type", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Select 'Component Protocol' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
    });

    context("Add form fields", () => {
      it("Add section field", () => {
        cy.fbAddNewField();
        cy.fbSelectItemFromNewFieldList({ field: "Section" });
        cy.fbEnterLabel({ label: "Test section" });
        cy.fbAddNewFieldButton();
      });

      it("Add Text field", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ field: "Text field" });
        cy.fbEnterLabel({ label: "text field" });
        cy.fbEnterPlaceholder({ placeholder: "test placeholder" });
        cy.fbAddNewFieldButton();
      });
    });

    context("Create and release FORM doucment", () => {
      it("Click create document", () => {
        cy.drClickCreateDocumentWithApiCall();
      });

      it("Approve and release FORM document", () => {
        cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
          cy.drApproveAndReleaseDocumentWithoutSelectingForm();
        });
      });

      it("Verify revision status is 'Revision 1  - Released'", () => {
        cy.drVerifyFirstDocumentRevisionList({ revision: "Revision 1  - Released" });
      });
    });
  });

  context("Revise FORM to 'Next Revision' stage", () => {
    it("Click revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    it("Verify revision status is 'Revision 2  - Released'", () => {
      cy.drVerifyFirstDocumentRevisionList({ revision: "Revision 2  - Released" });
    });
  });

  context("Revise FORM to 'Administrative Change' stage", () => {
    it("Click revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Select revision stage 'Administrative Change'", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Administrative Change" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    it("Verify revision status is 'Revision 2.1  - Released'", () => {
      cy.drVerifyFirstDocumentRevisionList({ revision: "Revision 2.1  - Released" });
    });
  });

  context("Revise FORM to 'Obsolete' stage", () => {
    it("Click revise document", () => {
      cy.drClickReviseDocument();
    });

    it("Select revision stage 'Obsolete'", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Obsolete" });
    });

    it("Save document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and release FORM document", () => {
      cy.wrapWithWaitOnApiCall(CyRoutes.DocPreview, () => {
        cy.drApproveAndReleaseDocumentWithoutSelectingForm();
      });
    });

    it("Verify revision status is 'Revision OBS  - Obsolete'", () => {
      cy.drVerifyFirstDocumentRevisionList({ revision: "Revision OBS  - Obsolete" });
    });
  });
});

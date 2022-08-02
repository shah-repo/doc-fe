// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { STATUS_TYPES_LABEL } from "../../../src/state/ducks/dashboard.new/my.feeds/types";
import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { ClinicalProtocolDocType } from "../../utils/constants/documentTypes/clinicalProtocol";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginFirst;

context("FORM document revise test", () => {
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
              ClinicalProtocolDocType,
            ],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          employeeLoginFirst = createdCompany.employees.find((employee) => employee.user.email === USERS[1].email);
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

  context("Login user", () => {
    it("Login user to dashboard", () => {
      cy.authLoginToDashboard({ USER: USERS[1], employeeId: employeeLoginFirst.id });
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

    it("Click create a document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    context("Add form fields", () => {
      it("Add section field", () => {
        cy.fbAddNewField();
        cy.fbSelectItemFromNewFieldList({ section: "Section", field: "Section" });
        cy.fbEnterLabel({ label: "Test section" });
        cy.fbAddNewFieldButton();
      });

      it("Add Text field", () => {
        cy.fbClickAddNewHiddenBtn();
        cy.fbSelectItemFromNewFieldList({ section: "Inputs", field: "Text field" });
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
        cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 1", status: STATUS_TYPES_LABEL.RELEASED });
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
      cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 2", status: STATUS_TYPES_LABEL.RELEASED });
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
      cy.drVerifyFirstDocumentRevisionList({ revision: "Rev 2.1", status: STATUS_TYPES_LABEL.RELEASED });
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
      cy.drVerifyFirstDocumentRevisionList({ revision: "Rev OBS", status: STATUS_TYPES_LABEL.OBSOLETE });
    });
  });
});

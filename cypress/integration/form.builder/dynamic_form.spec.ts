// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { CyRoutes } from "../../support/routes";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";
import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let employeeLoginFirst;

context("Dynamic Form Test", () => {
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

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("Enters title 'New Dynamic Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Dynamic Form" });
    });

    it("Enters description 'New Dynamic Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Dynamic Form description" });
    });

    it("Selects 'Dynamic Form' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Dynamic Form" });
    });

    it("Click on 'Add a field'", () => {
      cy.fbAddNewField();
    });

    it("Select 'Text Field' field", () => {
      cy.fbSelectTextField();
    });

    it("Give label to 'Text Field' as 'New Text Field'", () => {
      cy.fbAddLabelName({ name: "New Text Field" });
    });

    it("Add 'Text Field' field", () => {
      cy.fbAddNewFieldButton();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
      cy.wait(3000);
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Navigates to document list", () => {
      // SystemRequirement("REQ-0140");
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it("Enters title 'New Form with Dynamic Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Form with Dynamic Form" });
    });

    it("Enters description 'New Form with Dynamic Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Form with Dynamic Form description" });
    });

    it("Selects 'Dynamic Form' document type from dropdown", () => {
      // SystemRequirement("REQ-0490");
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Selects 'Clinical Protocol' output document type from dropdown", () => {
      cy.drSelectOutputDocumentType({ documentType: "Clinical Protocol" });
    });

    it("Click on 'Add a field'", () => {
      cy.fbAddNewField();
    });

    it("Select 'New Dynamic Form' field", () => {
      SystemRequirement("REQ-0550");
      cy.fbSelectCustomControl();
    });

    it("Click on 'Add a field'", () => {
      cy.fbClickAddNewHiddenBtn();
    });

    it("Select 'Text Field 2' field", () => {
      cy.fbSelectTextField();
    });

    it("Give label to 'Text Field' as 'New Text Field 2'", () => {
      cy.fbAddLabelName({ name: "New Text Field 2" });
    });

    it("Add 'Text Field' field", () => {
      cy.fbAddNewFieldButton();
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });

    it("Open new document", () => {
      cy.drCreateNewDocumentFromForm();
    });

    it("Enters title 'New Document from Form'", () => {
      cy.drEnterDocumentTitle({ name: "New Document from Form" });
    });

    it("Enters description 'New Document from Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document from Form description" });
    });

    it("Enters text inside 'New Text Field 1' dynamic form field", () => {
      cy.get("[data-cy*=\"new-text-field\"]").eq(0).arrowType("Some text for Dynamic Form field");
    });

    it("Enters text inside 'New Text Field 2'", () => {
      cy.get("[data-cy*=\"new-text-field-2\"]").arrowType("Some text for Text field");
    });

    it("Click create document after filling document", () => {
      cy.wrapWithWaitOnApiCalls(
        [CyRoutes.PatchDocRev], () => {
          cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").arrowClick();
        });
      cy.wait(500);
    });

    it("Approve and Release document", () => {
      cy.drApproveAndReleaseDocumentWithoutSelectingForm();
    });
  });
});

export { };


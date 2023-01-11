// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { CONFIG } from "../../support/config";
import { NCORecord } from "../../utils/constants/documentTypes/nco";
import { IMPORTER_USER, USERS } from "../../utils/constants/users";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Error Validations", () => {
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
              NCORecord,
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
        email: USERS[1].email,
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
        email: USERS[1].email,
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("To check User gets error when trying to upload invalid JSON i.e Random Key value pair in Json", () => {
    it("Turn off autosave", () => {
      cy.cmpTurnOffAutosave();
    });

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title Test form 1`, () => {
      cy.drEnterDocumentTitle({ name: "Test form 1" });
    });

    it("Enters description 'New Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Training Curriculum' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Training Curriculum" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Create Document' button", () => {
      cy.drClickCreateDocumentWithoutApiCall();
    });

    it("Upload JSON file", () => {
      cy.fixture("invalid_jsons/test_form_1.json").then((fileContent) => {
        cy.get("#fb-import-schema").eq(0).attachFile({
          fileContent,
          fileName: "test_form_1.json",
          mimeType: "*",
          filePath: "fixtures/invalid_jsons/test_form_1.json",
        });
      });
    });

    it("Click on 'Save' button", () => {
      cy.drClickSaveWithoutApiCallExpectingToastError();
    });

    it("Verify error message", () => {
      cy.checkToastMessageIsEqual({
        message: "section => 0 => property testing should not exist",
      });
      cy.closeAllAlertMessages();
    });
  });

  context("To check User gets error when trying to Add {'placeholder': 'testing placeholder'} in radio group", () => {

    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });

    it(`Enters title Test form 2`, () => {
      cy.drEnterDocumentTitle({ name: "Test form 2" });
    });

    it("Enters description 'New Form description'", () => {
      cy.drEnterDocumentDescription({ description: "New Form description" });
    });

    it("Select 'Form' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Form" });
    });

    it("Select 'Training Curriculum' output document type", () => {
      cy.drSelectOutputDocumentType({ documentType: "Training Curriculum" });
    });

    it("Select 'Numeric' revision stage", () => {
      cy.drSelectRevisionStageOptions({ revisionStageOption: "Numeric" });
    });

    it("Click on 'Create Document' button", () => {
      cy.drClickCreateDocumentWithApiCall();
    });

    it("Upload JSON file", () => {
      cy.fixture("invalid_jsons/test_form_2.json").then((fileContent) => {
        cy.get("#fb-import-schema").eq(0).attachFile({
          fileContent,
          fileName: "test_form_2.json",
          mimeType: "*",
          filePath: "fixtures/invalid_jsons/test_form_2.json",
        });
      });
    });

    it("Click on 'Save' button", () => {
      cy.drClickSaveWithoutApiCallExpectingToastError();
    });

    it("Verify error message", () => {
      cy.checkToastMessageIsEqual({
        message: "radiogroup => 0 => property placeholder should not exist",
      });
      cy.closeAllAlertMessages();
    });
  });

});

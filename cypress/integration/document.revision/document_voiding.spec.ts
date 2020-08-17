/* eslint-disable max-classes-per-file */
// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

import { SystemRequirement } from "../../utils/context/systemRequirement";

let createdCompany;
let loginResponse;
let multipleCompanies;

context("Document Creation Flow", () => {
  context("[API]Prepare company", () => {
    it("[API]Creates company", (done: any) => {
      cy.authApiLogin({
        email: "zoran.kovacevic+admin@codecons.com",
        password: "Tester1!",
      }).then((response) => {
        loginResponse = response;
        cy.cmpCreateCompany({
          specFilePath: __filename,
          payload: {
            companyAdminEmail: "enlil.testmail+cy1@gmail.com",
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: "enlil.testmail+cy5@gmail.com",
            maxRevisionStages: 3,
            numOfDocDigits: 5,
            remoteValidatorBundleName: "default",
            slackIntegrationEnabled: false,
            users: [
              {
                name: "Second Tester",
                email: "enlil.testmail+cy2@gmail.com",
              },
              {
                name: "Third Tester",
                email: "enlil.testmail+cy3@gmail.com",
              },
              {
                name: "Fourth Tester",
                email: "enlil.testmail+cy4@gmail.com",
              }],
            documentTypes: [],
          }, sessionId: loginResponse.sessionId as unknown as string,
        }).then((response) => {
          createdCompany = response;
          done();
        });
      });
    });

    it("[API]Login second tester", (done: any) => {
      cy.authApiLogin({
        email: "enlil.testmail+cy2@gmail.com",
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
        email: "enlil.testmail+cy2@gmail.com",
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: createdCompany.name, multiple: multipleCompanies });
    });
  });

  context("Start document creation flow", () => {
    it("Navigates to document list", () => {
      cy.navigToDocumentList();
    });

    it("Clicks on 'create a document' button", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("Enters title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enters description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Selects 'Component Specification' document type from dropdown", () => {
      cy.drSelectDocumentType({ documentType: "Component Specification" });
    });
  });

  context("Creates document", () => {
    it("Clicks create document after filling document", () => {
      cy.drClickCreateDocumentWithApiCall();
    });
  });

  context("Document in DRAFT", () => {
    it("Checks if document status is DRAFT after creating a document", () => {
      SystemRequirement("REQ-0020");
      cy.drCheckDocumentStatus({ status: "Draft" });
    });

    it("Checks if Revison Change Type contains OBSOLETE option", () => {
      cy.get("[data-cy=\"field-revisionChangeType\"]");
      cy.get("#RevisionTypeChange-obsolete").should("not.exist");
    });

    context("Void Document", () => {
      it("Clicks on VOID button in header menu ", () => {
        cy.get("#HeaderMenuButton").click();
        cy.get("#void").click();
        cy.get("#AlertDialog-continueButton").click();
      });
    });
  });

  context("Document in VOIDED", () => {
    it("Checks if document status is VOIDED after voiding a document", () => {
      SystemRequirement("REQ-0020");
      cy.drCheckDocumentStatus({ status: "Voided" });
    });
  });
});

export { };


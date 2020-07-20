// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});


const runId = new Date().valueOf();
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
          payload: {
            companyAcronym: `T1${runId}`,
            companyAdminEmail: "enlil.testmail+cy1@gmail.com",
            helloSignIntegrationEnabled: false,
            helloSignTestMode: false,
            importerEmail: "enlil.testmail+cy5@gmail.com",
            maxRevisionStages: 3,
            name: `Test Company ${runId}`,
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
    it("Navigate to document list", () => {
      cy.cmpNavigateToDocumentList();
    });

    it("Click on 'create a document'", () => {
      cy.cmpClickCreateNewDocument();
    });
  });

  context("Fill in document attributes", () => {
    it("Enter title 'New Document Revision'", () => {
      cy.drEnterDocumentTitle({ name: "New Document Revision" });
    });

    it("Enter description 'New Document Revision description'", () => {
      cy.drEnterDocumentDescription({ description: "New Document Revision description" });
    });

    it("Click on 'Component Specification' document type", () => {
      cy.drSelectDocumentType({ documentType: "Component Specification" });
    });

    it("Check if document type id is generated", () => {
      cy.drCheckIfDocumentIdIsGenerated();
    });

    it("Upload multiple attachments when creating document", () => {
      cy.atchUploadAttachment({ fileName: "test.docx" });
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Selected Groups should default to 'Everyone' when creating new document", () => {
      cy.get("[data-cy=\"field-securityGroups\"]").contains("Everyone");
    });

    it("Click create document after filling document", () => {
      cy.drClickCreateDocument();
    });

    it("Check if document status is DRAFT after creating a document", () => {
      cy.drCheckDocumentStatus({ status: "Draft" });
    });

    it("Upload multiple attachments when document is in DRAFT", () => {
      cy.atchUploadAttachment({ fileName: "test_image.jpg" });
      cy.atchUploadAttachment({ fileName: "image.jpg" });
    });

    it("Set attachment as primary", () => {
      cy.atchSetPrimaryAttachment({ fileName: "test_image.jpg" });
    });

    it("Allow user to only set single attachment to be primary", () => {
      cy.atchSetPrimaryAttachment({ fileName: "test.docx" });
      cy.atchCheckForSinglePrimaryAttachment();
    });

    it("Remove last attachment", () => {
      cy.atchRemoveLastAttachment();
    });
  });
});

export { };

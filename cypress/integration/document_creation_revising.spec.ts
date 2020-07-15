// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

import path from "path";

const runId = new Date().valueOf();
let createdCompany;
let loginResponse;

context(`Test: ${path.basename(__filename)}`, () => {
  it("Creates company", (done: any) => {
    cy.authApiLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    }).then((response) => {
      loginResponse = response;
      cy.cmpCreateCompany({
        payload: {
          companyAcronym: `T1${runId}`,
          companyAdminEmail: "zoran.kovacevic+admin@codecons.com",
          helloSignIntegrationEnabled: false,
          helloSignTestMode: false,
          importerEmail: `zoran.kovacevic+importer${runId}@codecons.com`,
          maxRevisionStages: 3,
          name: `Test Company ${runId}`,
          numOfDocDigits: 5,
          remoteValidatorBundleName: "default",
          slackIntegrationEnabled: false,
          users: [{
            name: "Zoran 1",
            email: `zoran.kovacevic+1_${runId}@codecons.com`,
          }, {
            name: "Zoran 2",
            email: `zoran.kovacevic+2_${runId}@codecons.com`,
          }, {
            name: "Zoran 3",
            email: `zoran.kovacevic+3_${runId}@codecons.com`,
          }, {
            name: "Zoran 4",
            email: `zoran.kovacevic+4_${runId}@codecons.com`,
          }],
          acctCodes: ["code 1"],
          addresses: ["Address 1"],
          whiteLabeling: null,
          documentTypes: [],
        }, sessionId: loginResponse.sessionId as unknown as string,
      }).then((response) => {
        createdCompany = response;
        done();
      });
    });
  });

  it("Logs user in", () => {
    cy.authLogin({
      email: "zoran.kovacevic+admin@codecons.com",
      password: "Tester1!",
    });
  });

  it("Selects company", () => {
    cy.cmpSelectCompany({ name: createdCompany.name });
  });
  it("Navigate to document list", () => {
    cy.cmpNavigateToDocumentList();
  });

  it("Click on 'create a document'", () => {
    cy.cmpClickCreateNewDocument();
  });

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

export { };

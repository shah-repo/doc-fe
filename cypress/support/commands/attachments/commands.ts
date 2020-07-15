
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      atchUploadAttachment(params: {fileName: string }): Chainable<Subject>;
      atchSetPrimaryAttachment(params: {fileName: string }): Chainable<Subject>;
      atchRemoveLastAttachment(): Chainable<Subject>;
      atchCheckForSinglePrimaryAttachment(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("atchUploadAttachment", (params: {fileName: string }) => {
  cy.fixture(params.fileName).then((fileContent) => {
    cy.get("#AttachmentFieldPresenter-linkButton").click();
    cy.get("#attachments-button-file-clean-copy").attachFile({
      fileContent: fileContent.toString(),
      fileName: params.fileName,
      mimeType: "*",
      filePath: `fixtures/${params.fileName}`,
    });
  });
});

Cypress.Commands.add("atchSetPrimaryAttachment", (params: {fileName: string }) => {
  cy.get(`button[title=\"${params.fileName}\"]`).rightclick();
  cy.get("[data-cy=\"set.attachment.as.primary\"]").click();
});

Cypress.Commands.add("atchRemoveLastAttachment", () => {
  cy.get("[id=AttachmentIconPresenter-handleRemove]").last().click();
});

Cypress.Commands.add("atchCheckForSinglePrimaryAttachment", () => {
  cy.get("[data-cy=\"primary.attachment.icon\"]").should("have.length", 1);
});

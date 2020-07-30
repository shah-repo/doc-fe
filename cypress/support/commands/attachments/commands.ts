
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
      atchCheckDisplayedAttachments(params: {fileNames: string[] }): Chainable<Subject>;
      atchRemoveAttachment(params: {fileName: string }): Chainable<Subject>;
      atchCheckAtributes(params: {fileName: string; attributes: string }): Chainable<Subject>;
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
    }).wait(5000);
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
  cy.get("[data-cy=\"attachment.icon.primary\"]").should("have.length", 1);
});

Cypress.Commands.add("atchCheckDisplayedAttachments", (params: {fileNames: string[] }) => {
  cy.get("[data-cy=\"attachment.title\"]").should("have.length", params.fileNames.length);
  params.fileNames.forEach((fileName) => {
    cy.get("[data-cy=\"attachment.title\"]").contains(fileName);
  });
});

Cypress.Commands.add("atchRemoveAttachment", (params: {fileName: string }) => {
  cy.xpath(`//span[@title=\"${params.fileName}\"]`).trigger("mouseover");
  cy.xpath(`//span[@title=\"${params.fileName}\"]/../../div[3]`).click();
});

Cypress.Commands.add("atchCheckAtributes", (params: {fileName: string; attributes: string}) => {
  cy.xpath(`//span[@title=\"${params.fileName}\"]/../span[2]`).should("have.text", params.attributes);
});

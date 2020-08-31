import { CyRoutes } from "../../routes";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      atchUploadAttachment(params: {fileName: string }): Chainable<Subject>;
      atchUploadRedlineAttachment(params: {fileName: string }): Chainable<Subject>;
      atchSetPrimaryAttachment(params: {fileName: string }): Chainable<Subject>;
      atchRemoveLastAttachment(): Chainable<Subject>;
      atchCheckForSinglePrimaryAttachment(): Chainable<Subject>;
      atchCheckDisplayedAttachments(params: {fileNames: string[] }): Chainable<Subject>;
      atchRemoveAttachment(params: {fileName: string }): Chainable<Subject>;
      atchCheckAtributes(params: {fileName: string; attributes: string }): Chainable<Subject>;
      atchDownloadAllAttachments(): Chainable<Subject>;
      atchEnterConfirmationPassword(params: {password: string }): Chainable<Subject>;
      attachFiles(files: {name: string; type: string}[]): Chainable<Subject>;
      closeAtchUploadDialog(): Chainable<Subject>;
      atchCheckDisplayedAtLast(params: {fileName: string}): Chainable<Subject>;
      atchCheckRedLineIndicator(params: {fileName: string}): Chainable<Subject>;
      atchNoPrimaryForRedline(params: {fileName: string}): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("atchUploadAttachment", (params: {fileName: string }) => {
  cy.fixture(params.fileName).then((fileContent) => {
    cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
      cy.get("#AttachmentFieldPresenter-linkButton").click();
      cy.get("#attachments-button-file-clean-copy").attachFile({
        fileContent: fileContent.toString(),
        fileName: params.fileName,
        mimeType: "*",
        filePath: `fixtures/${params.fileName}`,
      }).wait(5000);
    });
  });
});

Cypress.Commands.add("attachFiles", { prevSubject: "element" },
  (input, files: {name: string; type: string}[]) => {
    files.forEach((file) => {
      const { name, type } = file;
      cy.fixture(name)
        .then((content) => Cypress.Blob.base64StringToBlob(content, type))
        .then((blob) => {
          const testFile = new File([blob], name);
          const dataTransfer = new DataTransfer();
          for (const fileObj of input[0].files) {
            dataTransfer.items.add(fileObj);
          }
          dataTransfer.items.add(testFile);
          input[0].files = dataTransfer.files;
          return input;
        });
    });
    cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
      cy.get("#attachments-button-file-clean-copy")
        .trigger("change", { force: true });
    });
  },
);

Cypress.Commands.add("atchUploadRedlineAttachment", (params: {fileName: string }) => {
  cy.fixture(params.fileName).then((fileContent) => {
    cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
      cy.get("#AttachmentFieldPresenter-linkButton").click();
      cy.get("#attachments-button-file-red-line").attachFile({
        fileContent: fileContent.toString(),
        fileName: params.fileName,
        mimeType: "*",
        filePath: `fixtures/${params.fileName}`,
      }).wait(5000);
    });
  });
});

Cypress.Commands.add("atchEnterConfirmationPassword", (params: {password: string }) => {
  cy.get("[data-cy=\"reject.request\"]").click().wait(1000);
  // dowload document part is not working in cypress, cypress freezes so we just cancel password confirm
  // cy.get("[data-cy=\"transition.action.password\"]").type(params.password);
  // cy.get("[data-cy=\"passwordConfirm\"]").click().wait(10000);
});

Cypress.Commands.add("atchDownloadAllAttachments", () => {
  cy.get("[id=\"AttachmentFieldPresenter-downloadAllButton\"]").click();
  cy.get("[id=\"passwordConfirm\"]").click();
});

Cypress.Commands.add("atchSetPrimaryAttachment", (params: {fileName: string }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.SetPrimaryAttachment, () => {
    cy.get(`button[title="${params.fileName}"]`).rightclick();
    cy.get("[data-cy=\"set.attachment.as.primary\"]", { timeout: 1000 }).click();
  });
});

Cypress.Commands.add("atchRemoveLastAttachment", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.PatchDocRev, () => {
    cy.get("[id=AttachmentIconPresenter-handleRemove]").last().click();
  });
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
  cy.xpath(`//span[@title="${params.fileName}"]`).trigger("mouseover");
  cy.xpath(`//span[@title="${params.fileName}"]/../../div[3]`).click();
});

Cypress.Commands.add("atchCheckAtributes", (params: {fileName: string; attributes: string}) => {
  cy.xpath(`//span[@title="${params.fileName}"]/../span[2]`).should("have.text", params.attributes);
});

Cypress.Commands.add("closeAtchUploadDialog", () => {
  cy.get("[data-cy=\"AttachmentFieldPresenter-handleRemove\"]").click();
});

Cypress.Commands.add("atchCheckDisplayedAtLast", (params: {fileName: string }) => {
  cy.get("[data-cy=\"attachment.title\"]").last().contains(params.fileName);
});

Cypress.Commands.add("atchCheckRedLineIndicator", (params: {fileName: string }) => {
  cy.get(`button[title="${params.fileName}"] > div[data-cy="attachment.icon.redline"]`).should("be.visible");
});

Cypress.Commands.add("atchNoPrimaryForRedline", (params: {fileName: string }) => {
  cy.get(`button[title="${params.fileName}"]`).rightclick();
  cy.get("[data-cy=\"set.attachment.as.primary\"]").should("not.be.visible");
  cy.get("[data-cy=\"field-name\"]").click({ force: true });
});

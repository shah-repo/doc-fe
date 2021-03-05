import { CyRoutes } from "../../routes";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      atchUploadAttachment(params: {fileName: string }): Chainable<Subject>;
      atchUploadAttachmentFail(params: {fileName: string }): Chainable<Subject>;
      atchUploadRedlineAttachment(params: {fileName: string }): Chainable<Subject>;
      atchSetPrimaryAttachment(params: {fileName: string }): Chainable<Subject>;
      atchRemoveLastAttachment(): Chainable<Subject>;
      atchCheckForSinglePrimaryAttachment(): Chainable<Subject>;
      atchCheckDisplayedAttachments(params: {fileNames: string[] }): Chainable<Subject>;
      atchRemoveAttachment(params: {fileName: string }): Chainable<Subject>;
      atchCheckAtributes(params: {fileName: string; attributes: string }): Chainable<Subject>;
      attachFiles(files: {name: string; type: string}[]): Chainable<Subject>;
      closeAtchUploadDialog(): Chainable<Subject>;
      atchCheckDisplayedAtLast(params: {fileName: string}): Chainable<Subject>;
      atchCheckRedLineIndicator(params: {fileName: string}): Chainable<Subject>;
      atchNoPrimaryForRedline(params: {fileName: string}): Chainable<Subject>;
      atchDownloadFile(params: {fileName: string; saveFileName: string}): Chainable<Subject>;
      atchDownloadAll(): Chainable<Subject>;
      atchUploadJSONFormForSeed(params: {fileName: string; queue: number }): Chainable<Subject>;
      atchUploadDOMJSONForNCO(params: {fileName: string; queue: number }): Chainable<Subject>;
      atchUploadPageDetailsJSONForNCO(params: {fileName: string; queue: number }): Chainable<Subject>;
      atchUploadNavigationJSONForNCO(params: {fileName: string; queue: number }): Chainable<Subject>;
      atchUploadUserListJSONForNCO(params: {fileName: string; queue: number }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("atchUploadJSONFormForSeed", (params: {fileName: string; queue: number }) => {
  cy.fixture(params.fileName).then((fileContent) => {
    cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
      cy.get("[id^=fb-attachment-field-json-form-]").eq(params.queue).attachFile({
        fileContent: fileContent.toString(),
        fileName: params.fileName,
        mimeType: "*",
        filePath: `fixtures/${params.fileName}`,
      });
    });
  });
});

Cypress.Commands.add("atchUploadDOMJSONForNCO", (params: {fileName: string; queue: number }) => {
  cy.fixture(params.fileName).then((fileContent) => {
    cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
      cy.get("[id^=fb-attachment-field-dom-json-]").eq(params.queue).attachFile({
        fileContent: fileContent.toString(),
        fileName: params.fileName,
        mimeType: "*",
        filePath: `fixtures/${params.fileName}`,
      });
    });
  });
});

Cypress.Commands.add("atchUploadPageDetailsJSONForNCO", (params: {fileName: string; queue: number }) => {
  cy.fixture(params.fileName).then((fileContent) => {
    cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
      cy.get("[id^=fb-attachment-field-page-details-json-]").eq(params.queue).attachFile({
        fileContent: fileContent.toString(),
        fileName: params.fileName,
        mimeType: "*",
        filePath: `fixtures/${params.fileName}`,
      });
    });
  });
});

Cypress.Commands.add("atchUploadNavigationJSONForNCO", (params: {fileName: string; queue: number }) => {
  cy.fixture(params.fileName).then((fileContent) => {
    cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
      cy.get("[id^=fb-attachment-field-navigation-json-]").eq(params.queue).attachFile({
        fileContent: fileContent.toString(),
        fileName: params.fileName,
        mimeType: "*",
        filePath: `fixtures/${params.fileName}`,
      });
    });
  });
});

Cypress.Commands.add("atchUploadUserListJSONForNCO", (params: {fileName: string; queue: number }) => {
  cy.fixture(params.fileName).then((fileContent) => {
    cy.wrapWithWaitOnApiCalls([CyRoutes.GetDocAudit, CyRoutes.GetDocAggregatedAudit], () => {
      cy.get("[id^=fb-attachment-field-users-list-]").eq(params.queue).attachFile({
        fileContent: fileContent.toString(),
        fileName: params.fileName,
        mimeType: "*",
        filePath: `fixtures/${params.fileName}`,
      });
    });
  });
});

Cypress.Commands.add("atchUploadAttachment", (params: {fileName: string }) => {
  cy.fixture(params.fileName).then((fileContent) => {
    cy.wrapWithWaitOnApiCall(CyRoutes.UploadAttachment, () => {
      cy.get("#AttachmentFieldPresenter-linkButton").click();
      cy.get("#attachments-button-file-clean-copy").attachFile({
        fileContent: fileContent.toString(),
        fileName: params.fileName,
        mimeType: "*",
        filePath: `fixtures/${params.fileName}`,
      });
    });
  });
});

Cypress.Commands.add("atchUploadAttachmentFail", (params: {fileName: string }) => {
  cy.server({ force404: true });
  cy.route({
    method: "POST",
    url: "**/attachments/upload",
    response: "fixture:test_upload_response.json",
    status: 400,
  }).as("upload");
  cy.fixture(params.fileName).then((fileContent) => {
    cy.get("#AttachmentFieldPresenter-linkButton").click();
    cy.get("#attachments-button-file-clean-copy").attachFile({
      fileContent: fileContent.toString(),
      fileName: params.fileName,
      mimeType: "*",
      filePath: `fixtures/${params.fileName}`,
    });
  });
  cy.wait("@upload");
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
      });
    });
  });
});

Cypress.Commands.add("atchSetPrimaryAttachment", (params: {fileName: string }) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.SetPrimaryAttachment, () => {
    cy.get(`button[title="${params.fileName}"]`).rightclick();
    cy.wait(500);
    cy.get("[data-cy=\"set.attachment.as.primary\"]").click();
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

Cypress.Commands.add("atchDownloadFile", (params: {fileName: string; saveFileName: string }) => {
  cy.intercept({ pathname: "/api/v1/attachments/*/download*" }, (req) => {
    req.reply((res) => {
      if (res.body !== "") {
        const response = res.body;
        res.send(response.url);
      }
    });
  }).as("attach");
  cy.get("div[data-cy=\"attachment\"]").contains(params.fileName).rightclick();
  cy.get("div[id=\"simple-menu\"]>div>ul[role=\"menu\"]>li:nth-child(1)").click();
  cy.get("body").then(($body) => {
    if ($body.find("[data-cy=\"download.warning\"]").length > 0) {
      cy.get("[id=\"passwordConfirm\"]").click();
      cy.get("[data-cy=\"transition.action.password\"]").type("Tester1!");
      cy.get("[data-cy=\"passwordConfirm\"]").click();
    }
  });
  cy.wait("@attach").then((res) => {
    const fileUrl = res.response?.body.toString();
    cy.downloadFile({
      url: fileUrl,
      directory: "cypress/downloads",
      fileName: params.saveFileName,
    });
  });
});

Cypress.Commands.add("atchDownloadAll", () => {
  cy.intercept({ pathname: "/api/v1/attachments/*/download*" }, (req) => {
    req.reply((res) => {
      if (res.body !== "") {
        const response = res.body;
        res.send(response.url);
      }
    });
  }).as("attach");
  cy.get("#AttachmentFieldPresenter-downloadAllButton").click();
  cy.get("body").then(($body) => {
    if ($body.find("[data-cy=\"download.warning\"]").length > 0) {
      cy.get("[id=\"passwordConfirm\"]").click();
      cy.get("[data-cy=\"transition.action.password\"]").type("Tester1!");
      cy.get("[data-cy=\"passwordConfirm\"]").click();
    }
  });
  cy.wait("@attach").then((res) => {
    if (res) {
      const fileUrl = res.response?.body.toString();
      const fileName = fileUrl.split("/")[5].split("?");
      cy.downloadFile({
        url: fileUrl,
        directory: "cypress/downloads",
        fileName: fileName[0],
      });
    }

  });
});

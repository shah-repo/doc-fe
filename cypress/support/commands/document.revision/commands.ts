/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-len */
import { DocumentRevisionEditRequestBody } from "../../../../src/state/ducks/documentRevisions/types";
import { CONFIG } from "../../config";


export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      drCreateDocumentRevision(params: { payload: DocumentRevisionEditRequestBody; employeeId: string; sessionId: string }): Chainable<Subject>;
      drGetDocumentType(params: { employeeId: string; sessionId: string }): Chainable<Subject>;
      drEnterDocumentTitle(params: { name: string }): Chainable<Subject>;
      drEnterDocumentDescription(params: { description: string }): Chainable<Subject>;
      drSelectDocumentType(params: { documentType: string }): Chainable<Subject>;
      drSelectOutputDocType(params: { documentType: string }): Chainable<Subject>;
      drApproveAndReleaseDocument(): Chainable<Subject>;
      drClickCreateDocument(): Chainable<Subject>;
      drCheckDocumentStatus(params: { status: string }): Chainable<Subject>;
      drCheckIfDocumentIdIsGenerated(): Chainable<Subject>;
      drCheckIfDocumentIdMatches(params: { docId: string }): Chainable<Subject>;
      drFilterDocListByNameAndStatus(params: { title: string; status: string }): Chainable<Subject>;
      drChangeOwner(params: { employee: string }): Chainable<Subject>;
      drChangeOwnerFromMenu(params: { employee: string }): Chainable<Subject>;
      drClickReviseDocument(): Chainable<Subject>;
      drClickTrainingRequired(): Chainable<Subject>;
      drCheckTypeOfRevisionChangeOptions(): Chainable<Subject>;
      drChooseTypeOfRevisionChangeOption(params: { option: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("drCreateDocumentRevision", (params: {
  payload: DocumentRevisionEditRequestBody;
  employeeId: string;
  sessionId: string;
}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/document_revisions`,
    body: params.payload,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("drGetDocumentType", (params: { employeeId: string; sessionId: string }) => {
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/document_type`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response);
});

Cypress.Commands.add("drEnterDocumentTitle", (params: { name: string }) => {
  cy.get("[data-cy=\"field-name\"]").type(params.name);
});

Cypress.Commands.add("drEnterDocumentDescription", (params: { description: string }) => {
  cy.get("[data-cy=\"field-description\"]").click().type(params.description);
});

Cypress.Commands.add("drSelectDocumentType", (params: { documentType: string }) => {
  cy.get("[data-cy=\"select.document.documentType.id\"]").click();
  cy.get(`[data-cy=\"selectItem.document.documentType.id.${params.documentType}\"]`).click();
});

Cypress.Commands.add("drSelectOutputDocType", (params: { documentType: string }) => {
  cy.get("[data-cy=\"field-outputDocumentTypes\"]").click();
  cy.get("[data-cy=\"field-outputDocumentTypes\"]").type(`${params.documentType}{enter}`);
});

Cypress.Commands.add("drApproveAndReleaseDocument", () => {
  cy.get("[data-cy=\"ApproveAndRelease-button\"]", { timeout: 5 * 1000 }).click();
  cy.get("#FormList-selectForm").type("Initial AR Form{enter}");
  cy.get("[data-cy=\"ApproveAndRelease-submit\"]").click();
});

Cypress.Commands.add("drClickCreateDocument", () => {
  cy.get("[data-cy=\"DocumentRevisionForm-submit\"]").click().wait(2000);
});

Cypress.Commands.add("drCheckDocumentStatus", (params: { status: string }) => {
  cy.wait(5000);
  cy.get("[id=HeaderInfo-status]").should("have.text", params.status);
});

Cypress.Commands.add("drCheckIfDocumentIdIsGenerated", () => {
  cy.get("[id=\"document.docId\"]").invoke("val").should("not.be.empty");
});

Cypress.Commands.add("drCheckIfDocumentIdMatches", (params: { docId: string }) => {
  cy.get("[id=\"document.docId\"]").should("have.value", params.docId);
});

Cypress.Commands.add("drFilterDocListByNameAndStatus", (params: { title: string; status: string }) => {
  cy.get("#clearFilter").click().wait(500);
  cy.get("#name").type(params.title).wait(500);
  cy.get("[id=\"mui-component-select-status[]\"]").click().wait(300);
  cy.get("li[data-value]").contains(params.status).click().wait(500);
  cy.get(".ReactVirtualized__Table__rowColumn").contains(params.title).click();
});

Cypress.Commands.add("drChangeOwnerFromMenu", (params: { employee: string }) => {
  cy.get("#HeaderMenuButton").click();
  cy.drChangeOwner({ employee: params.employee });
});

Cypress.Commands.add("drChangeOwner", (params: { employee: string }) => {
  cy.get("#OwnerChangerPresenter-changeOwner").click();
  cy.get("#employee").click();
  cy.get(`[data-cy=\"selectItem.employee.${params.employee}\"]`).click();
  cy.get("#OwnerChangerPresenter-submitButton").click();
});

Cypress.Commands.add("drClickReviseDocument", () => {
  cy.get("#PreviewControlsContainer-revise").click();
});

Cypress.Commands.add("drClickTrainingRequired", () => {
  cy.get("input[type=checkbox]").click();
});

Cypress.Commands.add("drCheckTypeOfRevisionChangeOptions", () => {
  cy.get("[data-cy=\"field-revisionChangeType\"]");
  cy.get("#RevisionTypeChange-nextRevision").contains("Next Revision");
  cy.get("#RevisionTypeChange-nextRevisionStage").contains("Upgrade to Next Revision Level");
  cy.get("#RevisionTypeChange-obsolete").contains("Obsolete");
  cy.get("#RevisionTypeChange-administrativeChange").contains("Administrative Change");
});

Cypress.Commands.add("drChooseTypeOfRevisionChangeOption", (params: { option: string }) => {
  cy.get("[data-cy=\"field-revisionChangeType\"]");
  cy.get("label").contains(params.option).click();
});

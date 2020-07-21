/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-len */
import { DocumentRevisionEditRequestBody } from "../../../../src/state/ducks/documentRevisions/types";
import { CONFIG } from "../../config";


export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      drCreateDocumentRevision(params: {payload: DocumentRevisionEditRequestBody; employeeId: string; sessionId: string}): Chainable<Subject>;
      drGetDocumentType(params: {employeeId: string; sessionId: string}): Chainable<Subject>;
      drEnterDocumentTitle( params: {name: string }): Chainable<Subject>;
      drEnterDocumentDescription( params: {description: string }): Chainable<Subject>;
      drSelectDocumentType(params: {documentType: string }): Chainable<Subject>;
      drSelectApprovalRequestOutputDocType(): Chainable<Subject>;
      drApproveAndReleaseDocument(): Chainable<Subject>;
      drClickCreateDocument(): Chainable<Subject>;
      drCheckDocumentStatus(params: {status: string }): Chainable<Subject>;
      drCheckIfDocumentIdIsGenerated(): Chainable<Subject>;
      drCheckIfDocumentIdMatches(params: {docId: string }): Chainable<Subject>;
      drFilterDocListByNameAndStatus(params: {title: string; status: string}): Chainable<Subject>;
      drChangeOwner(params: {employee: string }): Chainable<Subject>;
      drChangeOwnerFromMenu(params: {employee: string }): Chainable<Subject>;
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

Cypress.Commands.add("drGetDocumentType", (params: {employeeId: string; sessionId: string}) => {
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/document_type`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response);
});

Cypress.Commands.add("drEnterDocumentTitle", (params: {name: string }) => {
  cy.get("[data-cy=\"field-name\"]").type(params.name);
});

Cypress.Commands.add("drEnterDocumentDescription", (params: {description: string }) => {
  cy.get("[data-cy=\"field-description\"]").click().type(params.description);
});

Cypress.Commands.add("drSelectDocumentType", (params: {documentType: string }) => {
  cy.get("[data-cy=\"select.document.documentType.id\"]").click();
  cy.get(`[data-cy=\"selectItem.document.documentType.id.${params.documentType}\"]`).click();
});

Cypress.Commands.add("drSelectApprovalRequestOutputDocType", () => {
  cy.get("[id=\"formTemplate.outputDocumentTypes").click();
  cy.get("[id=\"react-select-6-option-0").click();
});

Cypress.Commands.add("drApproveAndReleaseDocument", () => {
  cy.get("#ApproveAndRelease-button").click();
  cy.get("#FormList-selectForm").click();
  cy.get("#FormList-selectForm>div:nth-child(3)>div>div:nth-child(1)").click();
  cy.get("#ApproveAndRelease-submit").click();
});

Cypress.Commands.add("drClickCreateDocument", () => {
  cy.get("#DocumentRevisionForm-submit").click();
});

Cypress.Commands.add("drCheckDocumentStatus", (params: {status: string }) => {
  cy.get("[id=HeaderInfo-status]").should("have.text", params.status);
});

Cypress.Commands.add("drCheckIfDocumentIdIsGenerated", () => {
  cy.get("[id=\"document.docId\"]").invoke("val").should("not.be.empty");
});

Cypress.Commands.add("drCheckIfDocumentIdMatches", (params: {docId: string }) => {
  cy.get("[id=\"document.docId\"]").should("have.value", params.docId);
});

Cypress.Commands.add("drFilterDocListByNameAndStatus", (params: {title: string; status: string }) => {
  cy.get("#clearFilter").click();
  cy.get("#name").type(params.title).wait(300);
  cy.get("[id=\"mui-component-select-status[]\"]").click();
  cy.get("li[data-value]").contains(params.status).click().wait(300);
  cy.get(".ReactVirtualized__Table__rowColumn").contains(params.title).click();
});

Cypress.Commands.add("drChangeOwnerFromMenu", (params: {employee: string}) => {
  cy.get("#HeaderMenuButton").click();
  cy.drChangeOwner({ employee: params.employee });
});

Cypress.Commands.add("drChangeOwner", (params: {employee: string}) => {
  cy.get("#OwnerChangerPresenter-changeOwner").click();
  cy.get("#employee").click();
  cy.get(`[data-cy=\"selectItem.employee.${params.employee}\"]`).click();
  cy.get("#OwnerChangerPresenter-submitButton").click();
});

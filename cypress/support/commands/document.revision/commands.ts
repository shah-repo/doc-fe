/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
import { DocumentRevisionEditRequestBody } from "../../../../src/state/ducks/documentRevisions/types";
import { CONFIG } from "../../config";


export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      createDocumentRevision(params: {payload: DocumentRevisionEditRequestBody; employeeId: string; sessionId: string}): Chainable<Subject>;
      getDocumentType(params: {employeeId: string; sessionId: string}): Chainable<Subject>;
      enterDocumentTitle( params: {name: string }): Chainable<Subject>;
      enterDocumentDescription( params: {description: string }): Chainable<Subject>;
      selectFormDocumentType(): Chainable<Subject>;
      selectChangeRequestOutputDocType(): Chainable<Subject>;
      approveAndReleaseDocument(): Chainable<Subject>;
      clickCreateDocument(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("createDocumentRevision", (params: {
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
    timeout: 10 * 1000,
  }).then((response) => response.body);
});

Cypress.Commands.add("getDocumentType", (params: {employeeId: string; sessionId: string}) => {
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/document_type`,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
    timeout: 10 * 1000,
  }).then((response) => response);
});

Cypress.Commands.add("enterDocumentTitle", (params: {name: string }) => {
  cy.get("[data-cy=\"field-name\"]").type(params.name);
});

Cypress.Commands.add("enterDocumentDescription", (params: {description: string }) => {
  cy.get("[data-cy=\"field-description\"]").click().type(params.description);
});

Cypress.Commands.add("selectFormDocumentType", () => {
  cy.get("[data-cy=\"select.document.documentType.id\"]").click().get("[data-cy=\"selectItem.document.documentType.id.Form\"]").click();
});

Cypress.Commands.add("selectChangeRequestOutputDocType", () => {
  cy.get("[id=\"formTemplate.outputDocumentTypes").click().get("[id=\"react-select-6-option-0").click();
});

Cypress.Commands.add("approveAndReleaseDocument", () => { 
  cy.get("#ApproveAndRelease-button").click();
  cy.get("#FormList-selectForm").click().get("#FormList-selectForm>div:nth-child(3)>div>div:nth-child(1)").click().get("#ApproveAndRelease-submit").click();
});

Cypress.Commands.add("clickCreateDocument", () => {
  cy.get("#DocumentRevisionForm-submit").click();
});


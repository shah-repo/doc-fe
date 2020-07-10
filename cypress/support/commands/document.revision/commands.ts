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

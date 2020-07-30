import { Company } from "../../../../src/state/ducks/company/types";
import { CONFIG } from "../../config";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      cmpCreateCompany(params: {payload: Company; sessionId: string}): Chainable<Subject>;
      cmpSelectCompany( params: {name: string; multiple: boolean }): Chainable<Subject>;
      cmpNavigateToDocumentList(): Chainable<Subject>;
      cmpClickCreateNewDocument(): Chainable<Subject>;
      cmpNavigateToApprovalRequestList(): Chainable<Subject>;
      cmpClickCreateApprovalRequest(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("cmpCreateCompany", (params: {payload: Company; sessionId: string}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/company/bootstrap`,
    body: params.payload,
    headers: {
      Authorization: `bearer_admin ${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("cmpSelectCompany", (params: {name: string; multiple: boolean }) => {
  if ( params.multiple )
  {
    cy.get("#root").contains(params.name).click();
  }
});

Cypress.Commands.add("cmpNavigateToDocumentList", () => {
  cy.get("[data-cy=\"navigation.dashboard\"]").click();
  cy.wait(300).get("[data-cy=\"navigation.documentControl\"]").click();
  cy.get("[data-cy=\"navigation.documentList\"]").click();
});

Cypress.Commands.add("cmpNavigateToApprovalRequestList", () => {
  cy.get("[data-cy=\"navigation.dashboard\"]").click();
  cy.wait(300).get("[data-cy=\"navigation.documentControl\"]").click();
  cy.get("[data-cy=\"navigation.approvalRequests\"]").click();
});

Cypress.Commands.add("cmpClickCreateNewDocument", () => {
  cy.get("[data-cy=\"document.revision.create\"]").click();
});

Cypress.Commands.add("cmpClickCreateApprovalRequest", () => {
  cy.get("#ChangeRequest-create").click();
});

export function cmpFilterDocumentTypeIdByName(companyResponse: Company, documentTypeName: string) {
  return companyResponse.documentTypes.filter((type) => type.documentTypeName === documentTypeName);
}

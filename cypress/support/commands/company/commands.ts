import { User } from "../../../../src/state/ducks/common/types";
import { DocumentType } from "../../../../src/state/ducks/documentRevisions/documentType/types";
import { CONFIG } from "../../config";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

export interface CreateCompanyBootstrap {
  name: string;
  companyAcronym: string;
  companyAdminEmail: string;
  importerEmail: string;
  slackIntegrationEnabled: boolean;
  helloSignIntegrationEnabled: boolean;
  helloSignTestMode: boolean;
  maxRevisionStages: number;
  numOfDocDigits: number;
  users: User[];
  documentTypes: DocumentType[];
  whiteLabeling?: any;
  addresses?: string[];
  remoteValidatorBundleName: string;
  acctCodes?: string[];
}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      createCompany(params: {payload: CreateCompanyBootstrap; sessionId: string}): Chainable<Subject>;
      selectCompany( params: {name: string }): Chainable<Subject>;
      navigateToDocumentList(): Chainable<Subject>;
      clickCreateNewDocument(): Chainable<Subject>;
      navigateToChangeRequestList(): Chainable<Subject>;
      clickCreateChangeRequest(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("createCompany", (params: {payload: CreateCompanyBootstrap; sessionId: string}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/company/bootstrap`,
    body: params.payload,
    headers: {
      Authorization: `bearer_admin ${params.sessionId}`,
    },
    timeout: 10 * 1000,
  }).then((response) => response.body);
});

Cypress.Commands.add("selectCompany", (params: {name: string }) => {
  cy.get("#root", { timeout: 10 * 1000 }).contains(params.name).click();
});

Cypress.Commands.add("navigateToDocumentList", () => {
  cy.get("[data-cy=\"navigation.documentList\"]").click();
});

Cypress.Commands.add("navigateToChangeRequestList", () => {
  cy.get("[data-cy=\"navigation.changeRequestList\"]").click();
});

Cypress.Commands.add("clickCreateNewDocument", () => {
  cy.get("[data-cy=\"document.revision.create\"]").click();
});

Cypress.Commands.add("clickCreateChangeRequest", () => {
  cy.get("#ChangeRequest-create").click();
});
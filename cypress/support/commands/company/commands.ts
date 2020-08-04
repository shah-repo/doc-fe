import { Company } from "../../../../src/state/ducks/company/types";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };
// We need this interfaces for Company Bootstrap, do not remove
interface IUser {
  email: string;
  name: string;
}
//
interface IdocumentTypeDto {
  documentTypeName: string;
  documentTypeAcronym: string;
  isQms?: boolean;
  group: string;
}

export interface ICreateCompanyBootstrap {
  name: string;
  companyAcronym: string;
  companyAdminEmail: string;
  importerEmail: string;
  slackIntegrationEnabled: boolean;
  helloSignIntegrationEnabled: boolean;
  helloSignTestMode: boolean;
  maxRevisionStages: number;
  numOfDocDigits: number;
  users: IUser[];
  documentTypes: IdocumentTypeDto[];
  whiteLabeling?: any;
  addresses?: string[];
  remoteValidatorBundleName: string;
  acctCodes?: string[];
}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      cmpCreateCompany(params: { payload: ICreateCompanyBootstrap; sessionId: string }): Chainable<Subject>;
      cmpUpdateCompany(params: { employeeId: string; sessionId: string; payload: Partial<Company> }): Chainable<Subject>;
      cmpSelectCompany(params: { name: string; multiple: boolean }): Chainable<Subject>;
      cmpNavigateToDocumentList(): Chainable<Subject>;
      cmpClickCreateNewDocument(): Chainable<Subject>;
      cmpNavigateToApprovalRequestList(): Chainable<Subject>;
      cmpClickCreateApprovalRequest(): Chainable<Subject>;
      cmpNavigateToPurchaseOrder(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("cmpCreateCompany", (params: { payload: ICreateCompanyBootstrap; sessionId: string }) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/company/bootstrap`,
    body: params.payload,
    headers: {
      Authorization: `bearer_admin ${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("cmpUpdateCompany", (
  params: {
    employeeId: string;
    sessionId: string;
    payload: Partial<Company>;
  }) => {
  cy.request({
    method: "PATCH",
    url: `${CONFIG.BE_URL}/api/v1/company/mine`,
    body: params.payload,
    headers: {
      Authorization: `bearer ${params.employeeId}:${params.sessionId}`,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("cmpSelectCompany", (params: { name: string; multiple: boolean }) => {
  if (params.multiple) {
    cy.wrapWithWaitOnApiCalls([
      CyRoutes.IOTCredentials,
      CyRoutes.CompanyMine,
    ], () => {
      cy.get("#root").contains(params.name).click();
    });
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
  cy.get("[data-cy=\"change.request.create\"]").click();
});

Cypress.Commands.add("cmpNavigateToPurchaseOrder", () => {
  cy.get("[data-cy=\"navigation.purchaseOrder\"]").click().wait(500);
});

export function cmpFilterDocumentTypeIdByName(companyResponse: Company, documentTypeName: string) {
  return companyResponse.documentTypes.filter((type) => type.documentTypeName === documentTypeName);
}

import faker from "faker";
import { Company } from "../../../../src/state/ducks/company/types";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

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
      cmpCreateCompany(params: { payload: Partial<ICreateCompanyBootstrap>; sessionId: string }): Chainable<Subject>;
      cmpUpdateCompany(params: { employeeId: string; sessionId: string;
        payload: Partial<Company>;}): Chainable<Subject>;
      cmpSelectCompany(params: { name: string; multiple: boolean }): Chainable<Subject>;
      cmpClickCreateNewDocument(): Chainable<Subject>;
      cmpClickCreateApprovalRequest(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("cmpCreateCompany", (params: { payload: ICreateCompanyBootstrap; sessionId: string }) => {
  const companyNumber = Math.round(Math.random() * 1000);
  const bodyDefaults = {
    name: `${capitalize(faker.commerce.color())} ${faker.company.companyName()} ${companyNumber}`,
    companyAcronym: `TC${companyNumber}`,
  };
  const body: ICreateCompanyBootstrap = {
    ...params.payload,
    ...bodyDefaults,
  };
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/company/bootstrap`,
    body,
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

Cypress.Commands.add("cmpClickCreateNewDocument", () => {
  cy.get("[data-cy=\"document.revision.create\"]").click();
});

Cypress.Commands.add("cmpClickCreateApprovalRequest", () => {
  cy.get("[data-cy=\"change.request.create\"]").click();
});

export function cmpFilterDocumentTypeIdByName(companyResponse: Company, documentTypeName: string) {
  return companyResponse.documentTypes.filter((type) => type.documentTypeName === documentTypeName);
}

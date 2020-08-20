import { CONFIG } from "./config";
import { CyRoutes, CyWaitOptions, routes } from "./routes";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
      */
      createCompany(params: { payload: ICreateCompanyBootstrap; sessionId: string }): Chainable<Subject>;
      apiLogin(params: { email: string; password: string }): Chainable<Subject>;
      selectCompany(params: { name: string }): Chainable<Subject>;
      unClick(): Chainable<Subject>;
      myCompanies(token: string): Chainable<Subject>;
      wrapWithWaitOnApiCall(
        name: CyRoutes,
        callback: () => void,
        options?: Partial<CyWaitOptions>
      ): Chainable<Subject>;
      wrapWithWaitOnApiCalls(
        names: CyRoutes[],
        callback: () => void,
        options?: Partial<CyWaitOptions>
      ): Chainable<Subject>;
    }
  }
}

interface IUser {
  email: string;
  name: string;
}
interface IdocumentTypeDto {
  documentTypeName: string;
  documentTypeAcronym: string;
  group: string;
  privateNumberPool: boolean;
  startingNumber?: number;
  pageDetails?: any;
  isQms?: boolean;
  needsSignature?: boolean;
  defaultTraining?: boolean;
  schema?: any;
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

Cypress.Commands.add("createCompany", (params: { payload: ICreateCompanyBootstrap; sessionId: string }) => {
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

Cypress.Commands.add("myCompanies", (token: string) => {
  cy.request({
    method: "GET",
    url: `${CONFIG.BE_URL}/api/v1/company/mine`,
    headers: {
      Authorization: `bearer ${token}`,
    },
    timeout: 10 * 1000,
  }).then((response) => response.body);
});

Cypress.Commands.add("apiLogin", (params: { email: string; password: string }) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/auth/login`,
    timeout: 10 * 1000,
    body: params,
  }).then((response) =>
    response.body.sessionId
  );
});

Cypress.Commands.add("selectCompany", (params: { name: string }) => {
  cy.get("#root", { timeout: 20 * 1000 }).contains(params.name).click();
});

Cypress.Commands.add("unClick", () => {
  cy.get("#root>div>div>header").click();
});


Cypress.Commands.add(
  "wrapWithWaitOnApiCalls",
  (names: CyRoutes[], callback: () => void, options?: Partial<CyWaitOptions>) => {
    cy.server();
    names.forEach((name) => {
      const { requestConfig } = routes[name];
      cy.route(requestConfig).as(name);

    });

    callback();

    names.forEach((name) => {
      const {  callConfig } = routes[name];
      cy.wait(`@${name}`, Object.assign({}, callConfig, options));
    });
  });

Cypress.Commands.add(
  "wrapWithWaitOnApiCall",
  (name: CyRoutes, callback: () => void, options?: Partial<CyWaitOptions>) => {
    cy.wrapWithWaitOnApiCalls([name], callback, options);
  });


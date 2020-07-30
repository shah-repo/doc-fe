import { CONFIG } from "./config";

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
      login(params: { email: string; password: string }): Chainable<Subject>;
      selectCompany(params: { name: string }): Chainable<Subject>;
      unClick(): Chainable<Subject>;
      myCompanies(token: string): Chainable<Subject>;
    }
  }
}


// class DocumentTypeDto {
//   constructor(props: Partial<DocumentTypeDto>) {
//     Object.assign(this, props);
//   }
//   documentTypeName: string;
//   documentTypeAcronym: string;
//   group: string;
//   privateNumberPool: boolean;
//   startingNumber?: number;
//   pageDetails?: PageDetails;
//   isQms?: boolean;
//   needsSignature?: boolean;
//   defaultTraining?: boolean;
//   schema?: ISchemaItem[];
// }

// class User {
//   constructor(props: Partial<User>) {
//     Object.assign(this, props);
//   }
//   email =  "test@test.com";
//   name = "User";
// }

// class CreateCompanyBootstrap {
//   constructor(props: Required<{
//     remoteValidatorBundleName: string;
//   }> & Partial<CreateCompanyBootstrap>) {
//     Object.assign(this, props);
//     this.remoteValidatorBundleName = props.remoteValidatorBundleName;
//   }
//   name = "CompanyName";
//   companyAcronym= "CN";
//   companyAdminEmail = "companyadminemail@test.com";
//   importerEmail = "companyimporteremail@test.com";
//   slackIntegrationEnabled = false;
//   helloSignIntegrationEnabled = false;
//   helloSignTestMode = false;
//   maxRevisionStages = 3;
//   numOfDocDigits = 3;
//   users: User[] =  [];
//   documentTypes: DocumentTypeDto[] = [];
//   whiteLabeling?: WhiteLabeling;
//   addresses?: string[] = [];
//   remoteValidatorBundleName: string;
//   acctCodes?: string[] = [];
// }

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
    timeout: 10 * 1000
  }).then((response) => response.body)
})

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

Cypress.Commands.add("login", (params: { email: string; password: string }) => {
  cy.visit(CONFIG.FE_URL);
  cy.get("[data-cy=\"LoginFormPresenter-email\"]", { timeout: 10 * 1000 }).type(params.email)
    .get("[data-cy=\"LoginFormPresenter-password\"]").type(params.password)
    .get("[data-cy=\"LoginFormPresenter-submit\"]").click();
});

Cypress.Commands.add("selectCompany", (params: { name: string }) => {
  cy.get("#root", { timeout: 20 * 1000 }).contains(params.name).click();
});

Cypress.Commands.add("unClick", () => {
  cy.get("#root>div>div>header").click();
});

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


// function withParentTitle(item: any) {
//   const nameParts: any = [];
//   if(item.parent) {
//     nameParts.unshift(item.parent.title)
//     nameParts.unshift(...withParentTitle(item.parent))
//   }
//   return nameParts;
// }

// Cypress.on('test:after:run', (test, runnable) => {
//   console.log({"test.state": test.state})
//   if (test.state === 'failed') {
//     let item: any = runnable
//     const nameParts = [runnable.title]
//     nameParts.unshift(...withParentTitle(item.parent))

//     const fullTestName = nameParts
//             .filter(Boolean)
//             .join(' -- ')           // this is how cypress joins the test title fragments

//     const imageUrl = `${fullTestName} (failed) kova.png`
//     console.log({fullTestName, imageUrl})
//     cy.screenshot()
//     // cy.screenshot(imageUrl, {
//     //   capture: "viewport",
//     // }).then(() => {
//     // console.log(4)
//     //   addTestContext({ test }, { title: "Screenshot", value: imageUrl });
//     // })

//   }
// })

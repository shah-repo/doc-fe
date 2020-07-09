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
      createCompany(params: {payload: ICreateCompanyBootstrap; sessionId: string}): Chainable<Subject>;
      apiLogin( params: {email: string; password: string }): Chainable<Subject>;
      login( params: {email: string; password: string }): Chainable<Subject>;
      selectCompany( params: {name: string }): Chainable<Subject>;
      unClick(): Chainable<Subject>;
      createDocumentRevision(params: {payload: IDocumentRevisionEditRequestBody; employeeId:string; sessionId:string;}): Chainable<Subject>;
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
//Document Revision Types

export interface Attachment {
  id: string;
  name: string;
  type: string;
  s3link: string;
  s3linkCleanCopy?: string;
  isLoading?: boolean;
  owner?: IUser;
  lineType: string;
  //documentRevision?: DocumentRevision;
  fileSizeS3Link: number;
  fileSizeS3LinkCleanCopy: number;
}

  export interface OptionType {
    label: string;
    value: string;
  }
export interface IFBOutputDocumentType {
  id: string;
  documentTypeName?: string;
  groupOptions?: string;
}

export interface IFBFormTemplateProps {
  outputDocumentTypes: IFBOutputDocumentType[] | OptionType[];
  schema: string[];
  helloSignTemplateId?: string;
}
export interface SecurityListRequest {
  securityEmployees: Id[];
  securityGroups: Id[];
  operators: Id[];
}

export interface IDocumentRevisionDocumentRequest {
  docId?: string;
  id?: string;
  //documentType?: Partial<DocumentType>;
  documentType: Id;
  securityList: SecurityListRequest;
}
export interface Id {
  id: string;
}
export interface IFBDocumentRevisionProps {
  id?: string;
  formTemplate?: IFBFormTemplateProps;
  formDocument?: IFBDocumentRevisionProps;
  formInput?: Record<string, any>;
  document?: Partial<IDocumentRevisionDocumentRequest>;
  revision?: number;
  subRevision?: number;
  revisionStage?: number;
  revisionChangeType?: string;
  releasedAt?: string;
  renderHTML?: string;
  status?: string;
  //tasks?: FBTaskItem[];
}

 interface IDocumentRevisionEditRequestBody extends IFBDocumentRevisionProps {
  name: string;
  docId?: string;
  description: string;
  attachments: Attachment[];
  type?: string;
  referenceTo: Id[];
  document?: Partial<IDocumentRevisionDocumentRequest>;
  revisionChangeType?: string;
  revisionStage?: number;
  retrain?: boolean;
  renderHTML?: string;
  status?: string;
}
//Document Revision
Cypress.Commands.add("createDocumentRevision", (params: {payload: IDocumentRevisionEditRequestBody; employeeId:string; sessionId: string}) => {
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

//Company
Cypress.Commands.add("createCompany", (params: {payload: ICreateCompanyBootstrap; sessionId: string}) => {
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



Cypress.Commands.add("apiLogin", (params: {email: string; password: string }) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/auth/login`,
    timeout: 10 * 1000,
    body: params,
  }).then((response: IUser) =>
    response.body,
  );
});

Cypress.Commands.add("login", (params: {email: string; password: string }) => {
  cy.visit(CONFIG.FE_URL);
  cy.get("#LoginFormPresenter-email", { timeout: 10 * 1000 }).type(params.email)
    .get("#LoginFormPresenter-password").type(params.password)
    .get("#LoginFormPresenter-submit").click();
});

Cypress.Commands.add("selectCompany", (params: {name: string }) => {
  cy.get("#root", { timeout: 10 * 1000 }).contains(params.name).click();
});

/* Cypress.Commands.add("unClick", () => {
  cy.get("header:nth-child(1)").click();
}); */
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

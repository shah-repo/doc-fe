/* eslint-disable @typescript-eslint/camelcase */
// import "../../node_modules/cypress-movie/src/arrow
import path from "path";
import { Result } from "pdf-parse";
import { DOC_TYPE_GROUP } from "../../src/state/ducks/documentRevisions/documentType/types";
import { addTestContext } from "../utils/context/addTestContext";
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
      arrowClick(
        options?: Partial<Cypress.ClickOptions>): Chainable<Subject>;
      arrowClick(
        x: number,
        y: number,
        options?: Partial<Cypress.ClickOptions>): Chainable<Subject>;
      arrowType(
        text: string,
        options?: Partial<Cypress.TypeOptions>): Chainable<Subject>;
      autocompleteSelect(text: string, options?: {force?: boolean}): Chainable<Subject>;
      verifyAutocompleteList(list: string[]): Chainable<Subject>;
      downloadFile(params: { url: string; directory: string; fileName: string}): Chainable<Subject>;
      unzipFile(params: { directory: string; fileName: string}): Chainable<Subject>;
      pdfparseFile(params: { directory: string; fileName: string}): Promise<Result>;
      sendToEmail(): Chainable<Subject>;
      sendToEmailFromHeader(): Chainable<Subject>;
      createCompany(params: { payload: ICreateCompanyBootstrap; sessionId: string }): Chainable<Subject>;
      apiLogin(params: { email: string; password: string }): Chainable<Subject>;
      selectCompany(params: { name: string }): Chainable<Subject>;
      unClick(options?: { force?: boolean }): Chainable<Subject>;
      checkIfInputHasValue(params: { inputSelector: string }): Chainable<Subject>;
      myCompanies(token: string): Chainable<Subject>;
      triggerDueDateEmailScript(params: {sessionId: string; currentDate: string});
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
      arrow(options: any): Chainable<Subject>;
      saveBarShouldNotExist(): Chainable<Subject>;
      progressBarShouldNotExist(): Chainable<Subject>;
      progressBarShouldExist(): Chainable<Subject>;
      progressBarShouldAppear(): Chainable<Subject>;
      listLoadingElementShouldNotExist(): Chainable<Subject>;
      landingPageLoadingElementShouldNotExist(): Chainable<Subject>;
      landingPageLoadingElementShouldAppear(): Chainable<Subject>;
      listLoadingElementShouldExist(): Chainable<Subject>;
      listLoadingElementShouldAppear(): Chainable<Subject>;
      dragAndDrop(params: {fromSelector: string; toSelector: string});
      dragAndDropTopDown(params: {fromSelector: string; toSelector: string});
    }
  }
}
export interface IUser {
  email: string;
  name: string;
}

export enum DEFAUL_REV_STAGE {
  NUMERIC = "Numeric",
  ALPHA = "Alpha"
}

interface IfieldsConfig{
  [key: string]: {
    visible: boolean;
    required?: boolean;
    label?: string;};
}
export interface IdocumentTypeDto {
  documentTypeName: string;
  documentTypeAcronym: string;
  isQms?: boolean;
  group: DOC_TYPE_GROUP;
  privateNumberPool?: boolean;
  startingNumber?: number;
  needsSignature?: boolean;
  category?: string;
  schema?: any;
  fieldsConfig?: IfieldsConfig;
  canRedLine?: boolean;
  defaultTraining?: boolean;
  hiddenForCreationForUsersWithoutTags?: any[];
  defaultRevStage?: DEFAUL_REV_STAGE;
  active?: boolean;
}

export interface ICreateCompanyBootstrap {
  name: string;
  companyAcronym: string;
  companyAdminEmail: string;
  importerEmail: string;
  slackIntegrationEnabled: boolean;
  helloSignIntegrationEnabled: boolean;
  helloSignTestMode: boolean;
  numOfRevStages: number;
  numOfDocDigits: number;
  users: IUser[];
  documentTypes: IdocumentTypeDto[];
  scheduledForDeletion: boolean;
  testAutomationCompany: boolean;
  whiteLabeling?: any;
  addresses?: string[];
  remoteValidatorBundleName: string;
  acctCodes?: string[];
}

Cypress.Commands.add("checkIfInputHasValue", (params: {inputSelector}) => {
  cy.get("body").then(($body) => {
    const inputField = $body.find(params.inputSelector).attr("value");
    if (inputField) {
      return true;
    }
    return false;
  });
});

Cypress.Commands.add("saveBarShouldNotExist", () => {
  cy.get(`[data-cy="Document-Save-Progress-Bar"]`, { timeout: 40000 }).should("not.exist");
});

Cypress.Commands.add("progressBarShouldNotExist", () => {
  cy.get("div.MuiLinearProgress-root", { timeout: 40000 }).should("not.exist");
});

Cypress.Commands.add("progressBarShouldExist", () => {
  cy.get("div.MuiLinearProgress-root", { timeout: 40000 }).should("exist");
});

Cypress.Commands.add("progressBarShouldAppear", () => {
  cy.progressBarShouldExist();
  cy.progressBarShouldNotExist();
});

Cypress.Commands.add("listLoadingElementShouldNotExist", () => {
  cy.get("div.MuiCircularProgress-root", { timeout: 40000 }).should("not.exist");
});

Cypress.Commands.add("landingPageLoadingElementShouldNotExist", () => {
  cy.get("div.k-loading-image", { timeout: 40000 }).should("not.exist");
});

Cypress.Commands.add("landingPageLoadingElementShouldAppear", () => {
  cy.get("div.k-loading-mask", { timeout: 40000 }).should("be.visible");
  cy.get("div.k-loading-mask", { timeout: 40000 }).should("not.exist");
});

Cypress.Commands.add("listLoadingElementShouldExist", () => {
  cy.get("div.MuiCircularProgress-root", { timeout: 40000 }).should("exist");
});

Cypress.Commands.add("listLoadingElementShouldAppear", () => {
  cy.listLoadingElementShouldExist();
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("createCompany", (params: { payload: ICreateCompanyBootstrap; sessionId: string }) => {
  addTestContext("company", params.payload.name);
  cy.log(params.payload.name);
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/company/bootstrap`,
    body: params.payload,
    headers: {
      Authorization: `bearer_admin ${params.sessionId}`,
    },
    timeout: 30 * 1000,
  }).then((response) => response.body);
});

Cypress.Commands.add("downloadFile", (params: { url: string; directory: string; fileName: string} ) => {
  cy.getCookies().then((cookies) => cy.task("downloadFile", {
    url: params.url,
    directory: params.directory,
    cookies,
    fileName: params.fileName,
  }));
});

Cypress.Commands.add("unzipFile", (params: { directory: string; fileName: string} ) => {
  cy.getCookies().then((cookies) => {
    cy.readFile(path.join(params.directory, params.fileName)).then(() => {
      cy.task("unzipFile", {
        directory: params.directory,
        cookies,
        fileName: params.fileName,
      });
    });
  });
});

Cypress.Commands.add("pdfparseFile", (params: { directory: string; fileName: string} ) => {
  cy.getCookies().then((cookies) => {
    cy.readFile(path.join(params.directory, params.fileName)).then(() => {
      cy.task("pdfparseFile", {
        directory: params.directory,
        cookies,
        fileName: params.fileName,
      });
    });
  });
});

Cypress.Commands.add("sendToEmail", () => {
  cy.get("[data-cy=\"HeaderMenuButton\"]").arrowClick();
  cy.get("[data-cy=\"exportToEmail\"]").contains("Send To Email").arrowClick();
  cy.get("div.Toastify__toast-container").should("exist");
});

Cypress.Commands.add("sendToEmailFromHeader", () => {
  cy.get("#HeaderMenuButton").arrowClick();
  cy.get("[data-cy=\"exportToEmail\"]").contains("Send To Email").arrowClick();
  cy.get("div.Toastify__toast-container").should("exist");
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

Cypress.Commands.add("triggerDueDateEmailScript", (params: {sessionId: string; currentDate: string}) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/due_date_notifiers/send_emails`,
    headers: {
      Authorization: `bearer_admin ${params.sessionId}`,
    },
    body: {
      currentDate: params.currentDate,
    },
    timeout: 30 * 1000,
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
  cy.get("#root", { timeout: 20 * 1000 }).contains(params.name).arrowClick();
});

Cypress.Commands.add("unClick", (options = { force: true }) => {
  cy.get("body").arrowClick( 10, 10, options);
});

Cypress.Commands.add(
  "wrapWithWaitOnApiCalls",
  (names: CyRoutes[], callback: () => void, options?: Partial<CyWaitOptions>) => {
    names.forEach((name) => {
      const { requestConfig } = routes[name];
      cy.intercept(requestConfig).as(name);

    });

    callback();

    names.forEach((name) => {
      cy.log(name);
      const {  callConfig } = routes[name];
      cy.wait(`@${name}`, Object.assign({}, callConfig, options));
    });
  });

Cypress.Commands.add(
  "wrapWithWaitOnApiCall",
  (name: CyRoutes, callback: () => void, options?: Partial<CyWaitOptions>) => {
    cy.wrapWithWaitOnApiCalls([name], callback, options);
  });

Cypress.Commands.add("arrowClick", { prevSubject: "element" }, (
  subject: JQuery<HTMLElement>,
  options?: Partial<Cypress.ClickOptions>) => {
  cy.wrap(subject).arrow({ duration: CONFIG.ARROW_DURATION, blocking: true }).click(options);
});

Cypress.Commands.add("arrowClick", { prevSubject: "element" }, (
  subject: JQuery<HTMLElement>,
  x: number,
  y: number,
  options?: Partial<Cypress.ClickOptions>) => {
  cy.wrap(subject).arrow({ duration: CONFIG.ARROW_DURATION, blocking: true }).click(x, y, options);
});

Cypress.Commands.add("arrowType", { prevSubject: "element" }, (
  subject: JQuery<HTMLElement>,
  text: string,
  options?: Partial<Cypress.TypeOptions>) => {
  cy.wrap(subject).arrow({ duration: CONFIG.ARROW_DURATION, blocking: true }).type(text, options);
});

Cypress.Commands.add("autocompleteSelect", { prevSubject: "element" }, (
  subject: JQuery<HTMLElement>,
  text: string,
  options?: {force?: boolean} ) => {
  cy.wrap(subject).arrowType(text,  options).wait(1500).arrowType("{downarrow}{enter}",  options);
});

Cypress.Commands.add("verifyAutocompleteList", { prevSubject: "element" }, (
  subject: JQuery<HTMLElement>,
  list: string[] ) => {
  cy.wrap(subject).arrowClick();
  cy.get("ul>li[role=option]").first().scrollIntoView().trigger("mouseover").wait(500);

  list.forEach(() => {
    cy.get("ul>li[role=option][data-focus=true]").invoke("text").should("be.oneOf", list);
    cy.wrap(subject).type("{downarrow}");
  });

  const indexNumberToVerifyLengthOfList = list.length - 1;
  cy.get("ul>li[role=option]").last().should("have.attr", "data-option-index", indexNumberToVerifyLengthOfList);

  cy.unClick();
});

Cypress.Commands.add("dragAndDrop", (params: {fromSelector: string; toSelector: string}) => {
  cy.get(params.fromSelector)
    .realMouseDown({ position: "center", button: "left" });
  cy.wait(3000);
  cy.get(params.toSelector)
    .realMouseMove(0, 0, { position: "center" })
    .realMouseUp();
});

Cypress.Commands.add("dragAndDropTopDown", (params: {fromSelector: string; toSelector: string}) => {
  cy.get(params.fromSelector)
    .realMouseDown({ position: "top" });
  cy.wait(3000);
  cy.get(params.toSelector)
    .realMouseMove(0, 200, { position: "bottom" })
    .realMouseUp();
});


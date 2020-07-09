import { CONFIG } from "../../config";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      apiLogin( params: {email: string; password: string }): Chainable<Subject>;
      login( params: {email: string; password: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("apiLogin", (params: {email: string; password: string }) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/auth/login`,
    timeout: 10 * 1000,
    body: params,
  }).then((response) => response.body);
});

Cypress.Commands.add("login", (params: {email: string; password: string }) => {
  cy.visit(CONFIG.FE_URL);
  cy.get("#LoginFormPresenter-email", { timeout: 10 * 1000 }).type(params.email)
    .get("#LoginFormPresenter-password").type(params.password)
    .get("#LoginFormPresenter-submit").click();
});


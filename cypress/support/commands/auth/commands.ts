import { CONFIG } from "../../config";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      authApiLogin( params: {email: string; password: string }): Chainable<Subject>;
      authLogin( params: {email: string; password: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("authApiLogin", (params: {email: string; password: string }) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/auth/login`,
    body: params,
  }).then((response) => response.body);
});

Cypress.Commands.add("authLogin", (params: {email: string; password: string }) => {
  cy.visit(CONFIG.FE_URL);
  cy.get("#LoginFormPresenter-email").type(params.email);
  cy.get("#LoginFormPresenter-password").type(params.password);
  cy.get("#LoginFormPresenter-submit").click();
});


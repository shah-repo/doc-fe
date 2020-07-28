import { CONFIG } from "../../config";

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      authApiLogin(params: { email: string; password: string }): Chainable<Subject>;
      authLogin(params: { email: string; password: string }): Chainable<Subject>;
      authApiLogout(): Chainable<Subject>;
      authLogout(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("authApiLogin", (params: { email: string; password: string }) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/auth/login`,
    body: params,
  }).then((response) => response.body);
});

Cypress.Commands.add("authApiLogout", () => {
  cy.request({
    method: "DELETE",
    url: `${CONFIG.BE_URL}/api/v1/auth/logout`,
  }).then((response) => response.body);
});

Cypress.Commands.add("authLogin", (params: { email: string; password: string }) => {
  cy.visit(CONFIG.FE_URL, { timeout: 10 * 1000 });
  cy.get("[data-cy=\"LoginFormPresenter-email\"]").type(params.email)
    .get("[data-cy=\"LoginFormPresenter-password\"]").type(params.password)
    .get("[data-cy=\"LoginFormPresenter-submit\"]").click();
});

Cypress.Commands.add("authLogout", () => {
  cy.get("[id=\"UserMenuButton\"]").click();
  cy.contains("Logout").click();
});


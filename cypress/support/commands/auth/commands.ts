import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

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
      authVisitLogin(): Chainable<Subject>;
      authSubmitLogin(): Chainable<Subject>;
      authRequiredValidation(params: {selector: string; show: boolean}): Chainable<Subject>;
      authInvalidEmailValidation(): Chainable<Subject>;
      authEnterEmail(params: {value: string}): Chainable<Subject>;
      authEnterPassword(params: {value: string}): Chainable<Subject>;
      authSubmitLoginError(params: {show: boolean; message?: string}): Chainable<Subject>;
      authEnterSignUpPassword(params: {password: string}): Chainable<Subject>;
      authEnterSignUpConfirmPassword(params: {password: string}): Chainable<Subject>;
      authClickSignIn(): Chainable<Subject>;
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
  cy.wrapWithWaitOnApiCall(CyRoutes.PreventIdleLogout, () => {
    cy.visit(`${CONFIG.FE_URL}/login`, { timeout: 50000 });
  });
  cy.wait(500);
  cy.wrapWithWaitOnApiCall(
    CyRoutes.Login, () => {
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").type(params.email)
        .get("[data-cy=\"LoginFormPresenter-password\"]").type(params.password)
        .wait(300)
        .get("[data-cy=\"LoginFormPresenter-submit\"]").click();
    });
  cy.checkToastMessage({ exists: false });
});

// Cypress.Commands.overwrite("click", (originalFn, subject, options) => {

//   const currentCommand = cy.state("current").attributes.name;

//   if (currentCommand === "click") {
//     cy.wrap(subject).arrow({ duration: 1000, blocking: true }).then(() => originalFn(subject, options));
//   } else {
//     return originalFn(subject, options);
//   }
// });

// Cypress.Commands.overwrite("type", (originalFn, subject, options) => {

//   const currentCommand = cy.state("current").attributes.name;

//   if (currentCommand === "type") {
//     cy.wrap(subject).arrow({ duration: 1000, blocking: true }).then(() => originalFn(subject, options));
//   } else {
//     return originalFn(subject, options);
//   }
// });

Cypress.Commands.add("authEnterEmail", (params: { value: string }) => {
  cy.get("[data-cy=\"LoginFormPresenter-email\"]").clear().type(params.value);
});

Cypress.Commands.add("authEnterPassword", (params: { value: string }) => {
  cy.get("[data-cy=\"LoginFormPresenter-password\"]").clear().type(params.value);
});

Cypress.Commands.add("authVisitLogin", () => {
  cy.visit(CONFIG.FE_URL, { timeout: 20 * 1000 });
});

Cypress.Commands.add("authSubmitLogin", () => {
  cy.get("[data-cy=\"LoginFormPresenter-submit\"]").click();
});

Cypress.Commands.add("authRequiredValidation", (params: {selector: string; show: boolean}) => {
  if (params.show) {
    cy.get(`[data-cy="${params.selector}"] p`).should("be.visible");
    cy.get(`[data-cy="${params.selector}"] p`).should("have.text", "Required");
  } else {
    cy.get(`[data-cy="${params.selector}"] p`).should("not.exist");
  }
});

Cypress.Commands.add("authInvalidEmailValidation", () => {
  cy.get(`[data-cy="field-email"] p`)
    .should("be.visible")
    .should("have.text", "Invalid email address");
});

Cypress.Commands.add("authSubmitLoginError", (params: {show: boolean; message: string}) => {
  if (params.show) {
    cy.get(`[class="Toastify__toast-body"]`)
      .should("be.visible")
      .should("have.text", params.message);
  }
  else {
    cy.checkToastMessage({ exists: false });
  }
});

Cypress.Commands.add("authLogout", () => {
  cy.get("[data-cy=\"UserMenuButton\"]").click();
  cy.wrapWithWaitOnApiCall(CyRoutes.DeleteLogout, () => {
    cy.get("[data-cy=\"header.logout\"]").click();
  });
});

Cypress.Commands.add("authEnterSignUpPassword", (params: {password: string}) => {
  cy.get("[name=\"password\"]").type(params.password);
});

Cypress.Commands.add("authEnterSignUpConfirmPassword", (params: {password: string}) => {
  cy.get("[name=\"confirmPass\"]").type(params.password);
});

Cypress.Commands.add("authClickSignIn", () => {
  cy.wrapWithWaitOnApiCall(
    CyRoutes.Login, () => {
      cy.get("[id=\"ConfirmPasswordPresenter-loginSubmit\"]").click();
    });
});

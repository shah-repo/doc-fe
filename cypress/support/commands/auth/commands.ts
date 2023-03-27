/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */

import { addTestContext } from "../../../utils/context/addTestContext";
import { IUser } from "../../commands";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      authApiLogin(params: { email: string; password?: string }): Chainable<Subject>;
      authLogin(params: { email: string; password?: string }): Chainable<Subject>;
      authApiLogout(): Chainable<Subject>;
      authLogout(): Chainable<Subject>;
      authVisitLogin(): Chainable<Subject>;
      authSubmitLogin(): Chainable<Subject>;
      authRequiredValidation(params: {selector: string; show: boolean}): Chainable<Subject>;
      authInvalidEmailValidation(): Chainable<Subject>;
      authEnterEmail(params: {value: string}): Chainable<Subject>;
      authEnterPassword(params: {value: string}): Chainable<Subject>;
      authSubmitLoginError(params: {show: boolean; message?: string}): Chainable<Subject>;
      authEnterSignUpPassword(params?: {password?: string}): Chainable<Subject>;
      authEnterSignUpConfirmPassword(params?: {password?: string}): Chainable<Subject>;
      authClickSignIn(): Chainable<Subject>;
      authLoginToDashboard(params: { USER: IUser; employeeId: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("authApiLogin", (params: { email: string; password?: string }) => {
  cy.request({
    method: "POST",
    url: `${CONFIG.BE_URL}/api/v1/auth/login`,
    body: {
      email: params.email,
      password: params.password ?? CONFIG.DEFAULT_ENLIL_USER_PASSWORD,
    },
  }).then((response) => response.body);
});

Cypress.Commands.add("authApiLogout", () => {
  cy.request({
    method: "DELETE",
    url: `${CONFIG.BE_URL}/api/v1/auth/logout`,
  }).then((response) => response.body);
});

Cypress.Commands.add("authLogin", (params: { email: string; password?: string }) => {
  cy.visit(`${CONFIG.FE_URL}/login`, { timeout: 50000 });
  cy.wrapWithWaitOnApiCall(
    CyRoutes.Login, () => {
      cy.log(params.email);
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").arrowType(params.email);
      cy.get("[data-cy=\"LoginFormPresenter-password\"]")
        .arrowType(params.password ?? CONFIG.DEFAULT_ENLIL_USER_PASSWORD)
      ;
      cy.get("[data-cy=\"LoginFormPresenter-submit\"]").arrowClick();
    });

  cy.checkToastMessage({ exists: false });
  cy.progressBarShouldNotExist();

  addTestContext("user", params.email);
});

Cypress.Commands.add("authEnterEmail", (params: { value: string }) => {
  cy.get("[data-cy=\"LoginFormPresenter-email\"]").clear().arrowType(params.value);
});

Cypress.Commands.add("authEnterPassword", (params: { value: string }) => {
  cy.get("[data-cy=\"LoginFormPresenter-password\"]").clear().arrowType(params.value);
});

Cypress.Commands.add("authVisitLogin", () => {
  cy.visit(`${CONFIG.FE_URL}/login`, { timeout: 50000 });
});

Cypress.Commands.add("authSubmitLogin", () => {
  cy.get("[data-cy=\"LoginFormPresenter-submit\"]").arrowClick();
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
  cy.get("[data-cy=\"UserMenuButton\"]").arrowClick();
  cy.wrapWithWaitOnApiCall(CyRoutes.DeleteLogout, () => {
    cy.get("[data-cy=\"header.logout\"]").arrowClick();
  });
});

Cypress.Commands.add("authEnterSignUpPassword", (params: {password?: string}) => {
  cy.get("[name=\"password\"]", { timeout: 10000 }).arrowType(params?.password ?? CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
});

Cypress.Commands.add("authEnterSignUpConfirmPassword", (params: {password?: string}) => {
  cy.get("[name=\"confirmPass\"]").arrowType(params?.password ?? CONFIG.DEFAULT_ENLIL_USER_PASSWORD);
  cy.unClick();
});

Cypress.Commands.add("authClickSignIn", () => {
  cy.get("[id=\"ConfirmPasswordPresenter-loginSubmit\"]").arrowClick();
  cy.progressBarShouldAppear();
});

Cypress.Commands.add("authLoginToDashboard", (params: { USER: IUser; employeeId: string }) => {
  let loginResponse;
  cy.authApiLogin({ email: params.USER.email })
    .then((response) => {
      loginResponse = response;
      cy.request({
        method: "GET",
        url: `${CONFIG.BE_URL}/api/v1/auth/credentials/iot`,
        headers: {
          Authorization: `bearer ${params.employeeId}:${loginResponse.sessionId}`,
        },
        timeout: 30000,
      }).then((response) => {
        const user = {
          email: loginResponse.email,
          name: loginResponse.name,
          id: loginResponse.id,
          employeeId: params.employeeId,
          sessionId: loginResponse.sessionId,
          iotCredentials: response.body,
          employee: { active: true },
          employees: [],
        };
        const auth =
        {
          user: JSON.stringify(user),
          _persist: JSON.stringify({ version: 2, rehydrated: true }),
        };
        cy.setLocalStorage("persist:auth", JSON.stringify(auth));
        cy.setLocalStorage("debug", "enlil:*");
        cy.saveLocalStorage();
        cy.wrapWithWaitOnApiCall(CyRoutes.SessionDetails, () => {
          cy.visit(CONFIG.FE_URL, { timeout: 50000 });
        });
        cy.progressBarShouldNotExist();
        cy.listLoadingElementShouldNotExist();
        addTestContext("user", loginResponse.email);
        cy.log(loginResponse.email);
      });
    });
});

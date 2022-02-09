import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      usrNavigateToUserManagement(): Chainable;
      usrClickAddEmployee(): Chainable;
      usrGetInitials(params: {fullName: string}): Chainable;
      usrEnterEmail(params: {email: string}): Chainable;
      usrEnterName(params: {name: string}): Chainable;
      usrClickEditUser(params: {name: string}): Chainable;
      usrClickSaveButton(): Chainable;
      usrClickCloseDialogButton(): Chainable;
      usrCheckIfUserIsCreated(params: {email: string}): Chainable;
      authLoginWithInvalidPassword(params: { email: string; password: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("usrNavigateToUserManagement", () => {
  cy.wrapWithWaitOnApiCall(CyRoutes.EmployeesGet, () => {
    cy.get("[data-cy=\"navigation.userManagement\"]").arrowClick();
  });
  cy.listLoadingElementShouldNotExist();
});

Cypress.Commands.add("usrClickAddEmployee", () => {
  cy.get("#AddEmployeePresenter-openDialog").arrowClick();
});

Cypress.Commands.add("usrEnterEmail", (params: {email: string }) => {
  cy.get("[id=\"input-with-icon-textfield\"]").eq(1).arrowType(params.email);
});

Cypress.Commands.add("usrEnterName", (params: {name: string }) => {
  cy.get("[id=\"input-with-icon-textfield\"]").eq(0).arrowType(params.name);
});

Cypress.Commands.add("usrClickEditUser", (params: {name: string }) => {
  cy.get("tr.k-master-row").contains(params.name).parents("tr").find("button").eq(1)
    .arrowClick();
});

Cypress.Commands.add("usrGetInitials", (params: {fullName: string }) => {
  function getInitials(fullName) {
    const nameArr = fullName.split("");
    const initials = nameArr.filter(function(char) {
      return /[A-Z]/.test(char);
    });
    return initials.join("").substring(0, 2);
  }

  cy.get("[data-cy=header-userInitials]").should("have.text", getInitials(params.fullName));
});

Cypress.Commands.add("usrClickSaveButton", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesPost, CyRoutes.EmployeesGet], () => {
    cy.get("button>span>svg>path").eq(1).arrowClick();
  });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("usrClickCloseDialogButton", () => {
  cy.get("#AddEmployeeDialogPresenter-closeDialog").arrowClick();
});

Cypress.Commands.add("usrCheckIfUserIsCreated", (params: {email: string}) => {
  cy.get("#clearFilter").arrowClick();
  cy.get(`th[aria-colindex="3"] input`).arrowType(params.email);
  cy.get("tr.k-master-row").should("contain.text", params.email);
});

Cypress.Commands.add("authLoginWithInvalidPassword", (params: { email: string; password: string }) => {
  cy.visit(`${CONFIG.FE_URL}/login`, { timeout: 50000 });
  cy.wrapWithWaitOnApiCall(
    CyRoutes.Login, () => {
      cy.log(params.email);
      cy.get("[data-cy=\"LoginFormPresenter-email\"]").arrowType(params.email);
      cy.get("[data-cy=\"LoginFormPresenter-password\"]")
        .arrowType(params.password)
      ;
      cy.get("[data-cy=\"LoginFormPresenter-submit\"]").arrowClick();
    });
});

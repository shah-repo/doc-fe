import { CyRoutes } from "../../routes";

/* eslint-disable @typescript-eslint/no-namespace */

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      usrNavigateToUserManagement(): Chainable;
      usrClickAddEmployee(): Chainable;
      usrEnterEmail(params: {email: string}): Chainable;
      usrEnterName(params: {name: string}): Chainable;
      usrClickSaveButton(): Chainable;
      usrClickCloseDialogButton(): Chainable;
      usrCheckIfUserIsCreated(params: {email: string}): Chainable;
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
  cy.get("#AddEmployeeFormPresenter-commonEmail").arrowType(params.email);
});

Cypress.Commands.add("usrEnterName", (params: {name: string }) => {
  cy.get("#AddEmployeeFormPresenter-commonName").arrowType(params.name);
});

Cypress.Commands.add("usrClickSaveButton", () => {
  cy.wrapWithWaitOnApiCalls([CyRoutes.EmployeesPost, CyRoutes.EmployeesGetActive], () => {
    cy.get("#AddEmployeeFormPresenter-submitForm").arrowClick();
  });
  cy.checkToastMessage({ exists: false });
});

Cypress.Commands.add("usrClickCloseDialogButton", () => {
  cy.get("#AddEmployeeDialogPresenter-closeDialog").arrowClick();
});

Cypress.Commands.add("usrCheckIfUserIsCreated", (params: {email: string}) => {
  cy.wrapWithWaitOnApiCall(CyRoutes.EmployeesGet, () => {
    cy.get("#clearFilter").arrowClick();
  });
  cy.wrapWithWaitOnApiCall(CyRoutes.EmployeesGet, () => {
    cy.get("#email").arrowType(params.email);
  });
  cy.get("div.ReactVirtualized__Table__rowColumn:nth-child(2)>div>div>div").should("contain.text", params.email);
});

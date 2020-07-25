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
      usrFilterUsersByEmail(params: {email: string}): Chainable;
    }
  }
}

Cypress.Commands.add("usrNavigateToUserManagement", () => {
  cy.get("[data-cy=\"navigation.userManagement\"]").click();
});

Cypress.Commands.add("usrClickAddEmployee", () => {
  cy.get("#AddEmployeePresenter-openDialog").click();
});

Cypress.Commands.add("usrEnterEmail", (params: {email: string }) => {
  cy.get("#AddEmployeeFormPresenter-commonEmail").type(params.email);
});

Cypress.Commands.add("usrEnterName", (params: {name: string }) => {
  cy.get("#AddEmployeeFormPresenter-commonName").type(params.name);
});

Cypress.Commands.add("usrClickSaveButton", () => {
  cy.get("#AddEmployeeFormPresenter-submitForm").click();
});

Cypress.Commands.add("usrClickCloseDialogButton", () => {
  cy.get("#AddEmployeeDialogPresenter-closeDialog").click();
});

Cypress.Commands.add("usrFilterUsersByEmail", (params: {email: string}) => {
  cy.get("#clearFilter").click();
  cy.get("#email").type(params.email).wait(300);
});

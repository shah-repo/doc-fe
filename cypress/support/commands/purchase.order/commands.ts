/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      addNewFieldItem(): Chainable<Subject>;
      createNewPO(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("addNewFieldItem", () => {
  cy.get("[class=\"MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary MuiButton-fullWidth\"]").contains("Add item").click();
});

Cypress.Commands.add("createNewPO", () => {
  cy.get("[id=DocumentByTypeListPresenter-openDocRev").click();
});



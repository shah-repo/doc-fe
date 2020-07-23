/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      addNewFieldItem(): Chainable<Subject>;
      createNewPO(): Chainable<Subject>;
      addPOButtonClick(): Chainable<Subject>;
      poEnterDocumentDescription(params: {description: string }): Chainable<Subject>;
      selectPartNumber(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("addNewFieldItem", () => {
  cy.get("[class=\"MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary MuiButton-fullWidth\"]").contains("Add item").click();
});

Cypress.Commands.add("addPOButtonClick", () => {
  cy.get("[class=\"MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary\"]").contains(new RegExp("^Add$", "g")).click();
});

Cypress.Commands.add("createNewPO", () => {
  cy.get("[id=DocumentByTypeListPresenter-openDocRev").click();
});

Cypress.Commands.add("poEnterDocumentDescription", (params: {description: string }) => {
  cy.get("[data-cy=\"field-description\"]").click().type(params.description, { delay: 100 });
  cy.get("[id=\"DocumentRevisionForm-submit\"]").wait(3000).click();
});

Cypress.Commands.add("selectPartNumber", () => {
  cy.get("[name=\"partNumber\"]").click();
  cy.get("ul[role=listbox] > li").contains("PRT-00004 - 1").click();
});

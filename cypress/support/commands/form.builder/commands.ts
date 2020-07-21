/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      addNewFieldOption(): Chainable<Subject>;
      selectItemFromNewFieldList(params: {field: string}): Chainable<Subject>;
      enterPOLabelName(params: {name: string}): Chainable<Subject>;
      addNewFieldButton(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("addNewFieldOption", () => {
  cy.contains("Add a Field").click();
});

Cypress.Commands.add("selectItemFromNewFieldList", (params: {field: string}) => {
  cy.get("[class=\"MuiButton-label\"]").contains(new RegExp(params.field, "g")).click();
});

Cypress.Commands.add("enterPOLabelName", (params: {name: string}) => {
  cy.get("[class=\"MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl\"]").type(params.name).click();
});

Cypress.Commands.add("addNewFieldButton", (params: {name: string}) => {
  cy.get("[class=\"MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSecondary\"]").contains("Add").click();
});

/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      fbAddNewFieldOption(): Chainable<Subject>;
      fbSelectItemFromNewFieldList(params: { field: string }): Chainable<Subject>;
      fbEnterPOLabelName(params: { name: string }): Chainable<Subject>;
      fbAddNewFieldButton(): Chainable<Subject>;
      fbSelectTextField(): Chainable<Subject>;
      fbSelectAutoComplete(): Chainable<Subject>;
      fbOpenValidation(): Chainable<Subject>;
      fbAddField(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("fbAddNewFieldOption", () => {
  cy.contains("Add a Field").click();
});

Cypress.Commands.add("fbSelectItemFromNewFieldList", (params: { field: string }) => {
  cy.get("[class=\"MuiButton-label\"]").contains(new RegExp(params.field, "g")).click();
});

Cypress.Commands.add("fbEnterPOLabelName", (params: { name: string }) => {
  cy.get("[class=\"MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl\"]").type(params.name).click();
});

Cypress.Commands.add("fbAddNewFieldButton", (params: { name: string }) => {
  cy.get("[data-cy=\"fb-editor-actions-add\"]").contains("Add").click();
});

Cypress.Commands.add("fbSelectTextField", () => cy.get("[data-cy=\"form.builder.textfield\"]").click());

Cypress.Commands.add("fbSelectAutoComplete", () => cy.get("[data-cy=\"form.builder.autocomplete\"]").click());

Cypress.Commands.add("fbOpenValidation", () => cy.get("[data-cy=\"fb-editor-mode-validation-1\"]").click());

Cypress.Commands.add("fbAddField", () => cy.get("[data-cy=\"fb-editor-actions-add\"]").click());

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      muiSelect(selectId: string, text: string): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("muiSelect", (selectId, text) => {
  cy.get(selectId, { timeout: 10000 })
    .parent()
    .click()
    .find("div")
    .contains(text)
    .click({ force: true });
});
